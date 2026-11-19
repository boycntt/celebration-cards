import { Router } from 'express';

const NO_CACHE_CONTROL = 'no-store, no-cache, must-revalidate, proxy-revalidate';

export function createHealthRouter({ getDbStatus, pingDb, getHeartbeatStatus }) {
  const router = Router();

  async function handleHealthCheck(req, res) {
    res.setHeader('Cache-Control', NO_CACHE_CONTROL);
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');

    if (typeof pingDb === 'function') {
      await pingDb({ minIntervalMs: 60_000 }).catch(() => {});
    }

    const { dbConfigured, dbConnected } =
      typeof getDbStatus === 'function'
        ? getDbStatus()
        : { dbConfigured: false, dbConnected: false };

    if (req.method === 'HEAD') {
      res.status(200).end();
      return;
    }

    const heartbeat = typeof getHeartbeatStatus === 'function' ? getHeartbeatStatus() : null;

    res.json({
      ok: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptimeSeconds: Math.floor(process.uptime()),
      dbConfigured,
      dbConnected,
      heartbeat,
      modules: ['wishes', 'ogMeta', 'heartbeat'],
    });
  }

  router.head('/', handleHealthCheck);
  router.get('/', handleHealthCheck);

  return router;
}
