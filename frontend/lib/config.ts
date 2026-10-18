export const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';
/** Used by server components; inside docker the API is reachable by service name. */
export const API_INTERNAL_URL = process.env.API_INTERNAL_URL ?? API_URL;
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '';

export const REFRESH_COOKIE = 'forbit_rt';
export const ATTRIBUTION_COOKIE = 'attribution';
