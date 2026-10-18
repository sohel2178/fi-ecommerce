'use client';

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export type MetaEvent = 'PageView' | 'ViewContent' | 'AddToCart' | 'InitiateCheckout' | 'Purchase' | 'CompleteRegistration' | 'Search';

/** Shared id for an event sent by both the Pixel and the Conversions API, so Meta counts it once. */
export function newEventId(): string {
  return crypto.randomUUID();
}

/** Fires a Meta Pixel standard event. No-op when the Pixel is not configured. */
export function track(event: MetaEvent, params?: Record<string, unknown>, eventId?: string): void {
  window.fbq?.('track', event, params ?? {}, eventId ? { eventID: eventId } : undefined);
}
