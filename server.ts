import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import {
  getAdminOverviewData,
  getUserActivityLogs,
  updateAccountRestrictionStatus,
  updateUserProfileRecord,
  updateUserSettingsRecord,
} from './src/db/users.ts';
import { requireAdminRole, requireAuth, type AuthRequest } from './src/middleware/auth.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '1mb' }));

  // Authenticated Client Account API
  app.get('/api/me', requireAuth, async (req: AuthRequest, res) => {
    try {
      const dbUser = req.dbUser!;
      const logs = await getUserActivityLogs(dbUser.uid);
      res.json({
        user: dbUser,
        activityLogs: logs,
      });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unable to load account profile.';
      console.error('GET /api/me failed:', error);
      res.status(500).json({ error: message });
    }
  });

  app.patch('/api/me/profile', requireAuth, async (req: AuthRequest, res) => {
    try {
      const displayName = String(req.body?.displayName ?? '').trim();
      const jurisdiction = String(req.body?.jurisdiction ?? '').trim();

      if (displayName.length < 2 || displayName.length > 100) {
        return res
          .status(400)
          .json({ error: 'Display name must be between 2 and 100 characters.' });
      }
      if (jurisdiction.length < 2 || jurisdiction.length > 100) {
        return res
          .status(400)
          .json({ error: 'Jurisdiction must be between 2 and 100 characters.' });
      }

      const updated = await updateUserProfileRecord(req.user!.uid, {
        displayName,
        jurisdiction,
      });
      if (!updated) {
        return res.status(404).json({ error: 'Account record not found.' });
      }
      res.json({ user: updated });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unable to save profile updates.';
      console.error('PATCH /api/me/profile failed:', error);
      res.status(500).json({ error: message });
    }
  });

  app.patch('/api/me/settings', requireAuth, async (req: AuthRequest, res) => {
    try {
      const notifySecurity = Boolean(req.body?.notifySecurity);
      const notifyKyc = Boolean(req.body?.notifyKyc);
      const notifyPlatform = Boolean(req.body?.notifyPlatform);

      const updated = await updateUserSettingsRecord(req.user!.uid, {
        notifySecurity,
        notifyKyc,
        notifyPlatform,
      });
      if (!updated) {
        return res.status(404).json({ error: 'Account record not found.' });
      }
      res.json({ user: updated });
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unable to update notification settings.';
      console.error('PATCH /api/me/settings failed:', error);
      res.status(500).json({ error: message });
    }
  });

  // RBAC-Protected Admin API
  app.get('/api/admin/overview', requireAuth, requireAdminRole, async (_req, res) => {
    try {
      const data = await getAdminOverviewData();
      res.json(data);
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : 'Unable to load administrative overview.';
      console.error('GET /api/admin/overview failed:', error);
      res.status(500).json({ error: message });
    }
  });

  app.patch(
    '/api/admin/users/:uid/status',
    requireAuth,
    requireAdminRole,
    async (req: AuthRequest, res) => {
      try {
        if (req.dbUser?.role !== 'admin') {
          return res.status(403).json({
            error: 'Only platform administrators can modify account restriction states.',
          });
        }
        const targetUid = String(req.params.uid ?? '').trim();
        const nextStatus = req.body?.accountStatus;
        if (
          nextStatus !== 'Active' &&
          nextStatus !== 'Restricted' &&
          nextStatus !== 'Under Review'
        ) {
          return res.status(400).json({ error: 'Invalid account status value.' });
        }
        const updated = await updateAccountRestrictionStatus(
          targetUid,
          nextStatus,
          req.dbUser.email
        );
        if (!updated) {
          return res.status(404).json({ error: 'Target account not found.' });
        }
        res.json({ user: updated });
      } catch (error: unknown) {
        const message =
          error instanceof Error ? error.message : 'Unable to update account status.';
        console.error('PATCH /api/admin/users/:uid/status failed:', error);
        res.status(500).json({ error: message });
      }
    }
  );

  // Vite middleware (dev) or static bundle (production)
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      const indexFile = path.join(distPath, 'index.html');
      if (fs.existsSync(indexFile)) {
        res.sendFile(indexFile);
      } else {
        res.status(404).send('Build output not found.');
      }
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CAREX Web Platform listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start CAREX server:', err);
  process.exit(1);
});
