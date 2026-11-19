import React from 'react';
import manifestData from '../../shared/cards-manifest.json';
import type { CardManifest, CardRouteEntry } from '../platform/types';

const CARD_COMPONENTS: Record<
  string,
  React.LazyExoticComponent<React.ComponentType>
> = {
  vvntx2011: React.lazy(() => import('./vvntx2011')),
};

const manifest = manifestData as CardManifest;

export const CARD_ROUTES: CardRouteEntry[] = manifest.cards.map((entry) => ({
  ...entry,
  Component: CARD_COMPONENTS[entry.accessSlug.toLowerCase()],
}));
