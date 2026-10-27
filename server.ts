import express from 'express';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

// Load environment variables from .env if present
dotenv.config();

const app = express();
const PORT = 3000;

// Body parser middleware
app.use(express.json());

// In-memory security storage
interface AttemptRecord {
  attempts: number;
  lockedUntil: number;
  lastAttempt: number;
}

const failedAttempts = new Map<string, AttemptRecord>();
const activeAdminSessions = new Map<string, { createdAt: number; expiresAt: number }>();

// Master PIN configured via process.env.ADMIN_SECRET_PIN, fallback to 9842
let currentMasterPin = process.env.ADMIN_SECRET_PIN || '9842';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutos
const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 horas

// Helper to get client identifier for rate limiting
function getClientIp(req: express.Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.socket.remoteAddress || 'unknown-client';
}

// Clean expired records periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of failedAttempts.entries()) {
    if (record.lockedUntil < now && now - record.lastAttempt > 60 * 60 * 1000) {
      failedAttempts.delete(ip);
    }
  }
  for (const [token, session] of activeAdminSessions.entries()) {
    if (session.expiresAt < now) {
      activeAdminSessions.delete(token);
    }
  }
}, 5 * 60 * 1000);

// ==========================================
// API ROUTES
// ==========================================

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  });
});

// Admin Security: Verify PIN with anti-brute-force protection
app.post('/api/admin/verify-pin', (req, res) => {
  const ip = getClientIp(req);
  const now = Date.now();
  const record = failedAttempts.get(ip) || { attempts: 0, lockedUntil: 0, lastAttempt: now };

  // Check if IP is currently locked out
  if (record.lockedUntil > now) {
    const remainingMinutes = Math.ceil((record.lockedUntil - now) / 60000);
    return res.status(429).json({
      success: false,
      isLocked: true,
      error: `Sistema bloqueado contra tentativas suspeitas (anti-brute-force). Tente novamente em ${remainingMinutes} minuto(s).`,
      remainingMinutes,
    });
  }

  const { pin } = req.body;

  if (!pin || typeof pin !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'PIN inválido ou não fornecido.',
    });
  }

  // Constant-time comparison to prevent timing attacks
  const inputBuffer = Buffer.from(pin.trim());
  const masterBuffer = Buffer.from(currentMasterPin.trim());

  const isMatch =
    inputBuffer.length === masterBuffer.length &&
    crypto.timingSafeEqual(inputBuffer, masterBuffer);

  if (isMatch) {
    // Reset failed attempts on success
    failedAttempts.delete(ip);

    // Generate cryptographically secure token
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = now + SESSION_DURATION_MS;

    activeAdminSessions.set(token, {
      createdAt: now,
      expiresAt,
    });

    return res.json({
      success: true,
      token,
      expiresAt,
      message: 'Autenticação administrativa realizada com sucesso!',
    });
  } else {
    record.attempts += 1;
    record.lastAttempt = now;

    if (record.attempts >= MAX_FAILED_ATTEMPTS) {
      record.lockedUntil = now + LOCKOUT_DURATION_MS;
      failedAttempts.set(ip, record);

      return res.status(429).json({
        success: false,
        isLocked: true,
        error: 'Limite de 5 tentativas excedido! Acesso temporariamente bloqueado por 15 minutos para proteger o servidor.',
        remainingMinutes: 15,
      });
    } else {
      failedAttempts.set(ip, record);
      const remaining = MAX_FAILED_ATTEMPTS - record.attempts;

      return res.status(401).json({
        success: false,
        isLocked: false,
        error: `PIN incorreto. Você tem mais ${remaining} tentativa(s) antes do bloqueio de segurança.`,
        attemptsRemaining: remaining,
      });
    }
  }
});

// Admin Security: Verify active session token
app.post('/api/admin/verify-token', (req, res) => {
  const { token } = req.body;
  if (!token || typeof token !== 'string') {
    return res.status(401).json({ valid: false });
  }

  const session = activeAdminSessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    if (session) activeAdminSessions.delete(token);
    return res.status(401).json({ valid: false, error: 'Sessão expirada ou inválida' });
  }

  return res.json({ valid: true });
});

// Admin Security: Change PIN securely
app.post('/api/admin/change-pin', (req, res) => {
  const { token, newPin } = req.body;

  if (!token || typeof token !== 'string') {
    return res.status(401).json({ success: false, error: 'Não autorizado' });
  }

  const session = activeAdminSessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    return res.status(401).json({ success: false, error: 'Sessão expirada' });
  }

  if (!newPin || typeof newPin !== 'string' || newPin.trim().length < 4) {
    return res.status(400).json({
      success: false,
      error: 'O novo PIN deve conter pelo menos 4 caracteres.',
    });
  }

  currentMasterPin = newPin.trim();

  return res.json({
    success: true,
    message: 'PIN do Painel Administrativo atualizado com sucesso no servidor!',
  });
});

// Admin Security: Logout
app.post('/api/admin/logout', (req, res) => {
  const { token } = req.body;
  if (token && typeof token === 'string') {
    activeAdminSessions.delete(token);
  }
  return res.json({ success: true });
});

// ==========================================
// VITE & STATIC SERVING
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WD IdleCoins Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
