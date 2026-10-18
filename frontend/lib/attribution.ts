'use client';

import { ATTRIBUTION_COOKIE } from './config';

function readCookie(name: string): string | undefined {
  const match = document.cookie.split('; ').find((c) => c.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}

export type Attribution = {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmContent?: string;
  utmTerm?: string;
  fbclid?: string;
  fbc?: string;
  fbp?: string;
  landingPath?: string;
  capturedAt?: string;
};

/** The first-touch attribution set by middleware.ts plus Meta's _fbc/_fbp cookies, for register/checkout. */
export function getAttribution(): Attribution | undefined {
  let base: Attribution = {};
  const raw = readCookie(ATTRIBUTION_COOKIE);
  if (raw) {
    try {
      base = JSON.parse(raw) as Attribution;
    } catch {
      /* ignore malformed cookie */
    }
  }
  const fbc = readCookie('_fbc');
  const fbp = readCookie('_fbp');
  const result = { ...base, ...(fbc ? { fbc } : {}), ...(fbp ? { fbp } : {}) };
  return Object.keys(result).length ? result : undefined;
}
