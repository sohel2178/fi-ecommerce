import { NextResponse, type NextRequest } from 'next/server';

const ATTRIBUTION_COOKIE = 'attribution';
const THIRTY_DAYS = 60 * 60 * 24 * 30;
const NINETY_DAYS = 60 * 60 * 24 * 90;

const UTM_KEYS = {
  utm_source: 'utmSource',
  utm_medium: 'utmMedium',
  utm_campaign: 'utmCampaign',
  utm_content: 'utmContent',
  utm_term: 'utmTerm',
} as const;

type Attribution = Partial<Record<(typeof UTM_KEYS)[keyof typeof UTM_KEYS], string>> & {
  fbclid?: string;
  landingPath?: string;
  capturedAt?: string;
};

function readAttribution(req: NextRequest): Attribution | null {
  const raw = req.cookies.get(ATTRIBUTION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Attribution;
  } catch {
    return null;
  }
}

/**
 * 1. Captures Facebook/UTM attribution from boosted-post links into a first-party cookie.
 *    First touch wins; a new fbclid (a new ad click) overwrites it.
 * 2. Sets Meta's _fbc click-id cookie (fb.1.<ms>.<fbclid>) for Pixel + Conversions API matching.
 * 3. Forwards the path as x-pathname so server route guards can build ?next= redirects.
 */
export function middleware(req: NextRequest) {
  const headers = new Headers(req.headers);
  headers.set('x-pathname', req.nextUrl.pathname + req.nextUrl.search);
  const res = NextResponse.next({ request: { headers } });

  const params = req.nextUrl.searchParams;
  const fbclid = params.get('fbclid')?.slice(0, 500) ?? undefined;
  const hasUtm = Object.keys(UTM_KEYS).some((k) => params.has(k));
  if (!fbclid && !hasUtm) return res;

  const existing = readAttribution(req);
  const isNewClick = Boolean(fbclid && fbclid !== existing?.fbclid);
  if (!existing || isNewClick) {
    const next: Attribution = { landingPath: req.nextUrl.pathname, capturedAt: new Date().toISOString() };
    for (const [param, key] of Object.entries(UTM_KEYS)) {
      const v = params.get(param);
      if (v) next[key] = v.slice(0, 200);
    }
    if (fbclid) next.fbclid = fbclid;
    res.cookies.set(ATTRIBUTION_COOKIE, JSON.stringify(next), { maxAge: THIRTY_DAYS, path: '/', sameSite: 'lax' });
  }

  if (isNewClick) {
    res.cookies.set('_fbc', `fb.1.${Date.now()}.${fbclid}`, { maxAge: NINETY_DAYS, path: '/', sameSite: 'lax' });
  }
  return res;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)'],
};
