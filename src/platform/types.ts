import type { ComponentType, LazyExoticComponent } from 'react';

export interface CardMeta {
  title: string;
  description: string;
  ogImage: string;
  themeColor: string;
}

export interface CardWishesBackendOption {
  enabled: boolean;
  collectionKey?: string;
  defaultRole?: string;
  maxMessageLength?: number;
}

export interface CardBackendOptions {
  wishes?: CardWishesBackendOption;
}

export interface CardManifestEntry {
  accessSlug: string;
  status: 'active' | 'coming-soon';
  validFrom: string;
  validTo: string;
  meta: CardMeta;
  backendOptions?: CardBackendOptions;
}

export interface CardManifest {
  cards: CardManifestEntry[];
}

export interface CardRouteEntry extends CardManifestEntry {
  Component?: LazyExoticComponent<ComponentType> | ComponentType;
}

export interface WishItem {
  id: string;
  author: string;
  role: string;
  message: string;
  createdAt: string;
}

export interface WishFeedback {
  type: 'success' | 'info' | 'error';
  text: string;
}

export interface CardPersonalization {
  presetId: string;
  customTo: string;
  customFrom: string;
  customMessage: string;
}
