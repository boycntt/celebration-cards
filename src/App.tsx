import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { CARD_ROUTES } from './cards/registry';
import { NotFoundPage } from './platform/components/NotFoundPage';
import { useHeartbeat } from './platform/hooks/useHeartbeat';
import { resolveValidCardRoute } from './platform/router/routeGuard';
import { extractAccessSlugFromPath } from './platform/router/urlParams';

const DEFAULT_NOT_FOUND_TITLE = 'Không tìm thấy thiệp';

const CardLoadingFallback: React.FC = () => (
  <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4 text-slate-600">
    <div className="flex flex-col items-center gap-3 text-center">
      <span
        aria-hidden="true"
        className="h-7 w-7 animate-spin rounded-full border-2 border-slate-300 border-t-slate-700"
      />
      <p className="text-sm font-medium">Đang mở thiệp...</p>
    </div>
  </div>
);

export const App: React.FC = () => {
  const [pathname, setPathname] = useState<string>(() => window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const route = useMemo(() => {
    const accessSlug = extractAccessSlugFromPath(pathname);
    return resolveValidCardRoute(CARD_ROUTES, accessSlug);
  }, [pathname]);

  useHeartbeat({ enabled: Boolean(route && route.Component) });

  useEffect(() => {
    if (!route || !route.Component) {
      document.title = DEFAULT_NOT_FOUND_TITLE;
    } else if (route.meta?.title) {
      document.title = route.meta.title;
    }
  }, [route]);

  if (!route || !route.Component) {
    return <NotFoundPage />;
  }

  const PageComponent = route.Component;
  return (
    <Suspense fallback={<CardLoadingFallback />}>
      <PageComponent key={route.accessSlug} />
    </Suspense>
  );
};

export default App;
