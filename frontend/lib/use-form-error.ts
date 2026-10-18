'use client';

import { useState } from 'react';
import { ApiError } from './api';

/** Turns an ApiError into a top-level message plus per-field messages from zod details. */
export function useFormError() {
  const [message, setMessage] = useState<string | null>(null);
  const [fields, setFields] = useState<Record<string, string>>({});

  function handle(err: unknown) {
    if (err instanceof ApiError) {
      setMessage(err.details ? 'Please check the highlighted fields.' : err.message);
      setFields(Object.fromEntries(Object.entries(err.details ?? {}).map(([k, v]) => [k, v[0]])));
    } else {
      setMessage('Something went wrong. Please try again.');
      setFields({});
    }
  }

  function fail(text: string) {
    setMessage(text);
    setFields({});
  }

  function reset() {
    setMessage(null);
    setFields({});
  }

  return { message, fields, handle, fail, reset };
}

/** Only allow same-site relative redirects after login. */
export function safeNext(next: string | null, fallback = '/account'): string {
  return next && next.startsWith('/') && !next.startsWith('//') ? next : fallback;
}
