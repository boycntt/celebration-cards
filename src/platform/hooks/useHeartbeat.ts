import { useEffect, useRef } from 'react';

export interface UseHeartbeatOptions {
  enabled?: boolean;
  intervalMs?: number;
}

const DEFAULT_HEARTBEAT_INTERVAL_MS = 3 * 60 * 1000;
const MIN_HEARTBEAT_INTERVAL_MS = 30 * 1000;
const RESUME_PING_COOLDOWN_MS = 60 * 1000;

/**
 * Periodically sends lightweight background pings to /api/health while a card tab
 * remains open (including background tabs) to keep Render Free Tier awake.
 */
export function useHeartbeat({
  enabled = true,
  intervalMs = DEFAULT_HEARTBEAT_INTERVAL_MS,
}: UseHeartbeatOptions = {}): void {
  const lastPingAtRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const safeIntervalMs = Math.max(intervalMs, MIN_HEARTBEAT_INTERVAL_MS);

    const sendHeartbeat = (requireVisible: boolean) => {
      if (requireVisible && document.visibilityState !== 'visible') {
        return;
      }
      if (typeof navigator !== 'undefined' && navigator.onLine === false) {
        return;
      }

      lastPingAtRef.current = Date.now();
      fetch('/api/health?source=client', {
        method: 'GET',
        cache: 'no-store',
        keepalive: true,
      }).catch(() => {});
    };

    const handleInterval = () => {
      sendHeartbeat(false);
    };

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible' &&
        Date.now() - lastPingAtRef.current >= RESUME_PING_COOLDOWN_MS
      ) {
        sendHeartbeat(true);
      }
    };

    const handleOnline = () => {
      if (Date.now() - lastPingAtRef.current >= RESUME_PING_COOLDOWN_MS) {
        sendHeartbeat(false);
      }
    };

    const timerId = window.setInterval(handleInterval, safeIntervalMs);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('online', handleOnline);

    return () => {
      window.clearInterval(timerId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('online', handleOnline);
    };
  }, [enabled, intervalMs]);
}
