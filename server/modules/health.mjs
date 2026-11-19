import { Router } from 'express';

export function createHealthRouter({ getDbStatus }) {
  const router = Router();

  router.get('/', (_req, res) => {
    const { dbConfigured, dbConnected } = getDbStatus();
    res.json({
      ok: true,
      dbConfigured,
      dbConnected,
      modules: ['wishes', 'ogMeta'],
    });
  });

  return router;
}
