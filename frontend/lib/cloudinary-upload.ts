'use client';

import { api, ApiError } from './api';

export type UploadKind = 'product-image' | 'datasheet' | 'trade-license';

type Signed = {
  uploadUrl: string;
  apiKey: string;
  signature: string;
  params: Record<string, string | number>;
  maxBytes: number;
  formats: string[];
};

/**
 * Signed direct upload: our API signs, the browser sends the file straight to Cloudinary.
 * Returns the publicId, which the caller sends to our API; the API verifies it before saving.
 */
export async function uploadToCloudinary(
  kind: UploadKind,
  file: File,
  onProgress?: (percent: number) => void,
): Promise<{ publicId: string; format: string }> {
  const signed = await api<Signed>('/uploads/sign', { method: 'POST', body: { kind } });

  const ext = file.name.split('.').pop()?.toLowerCase() ?? '';
  if (!signed.formats.includes(ext)) {
    throw new ApiError(400, 'BAD_FORMAT', `Allowed file types: ${signed.formats.join(', ')}`);
  }
  if (file.size > signed.maxBytes) {
    throw new ApiError(400, 'TOO_LARGE', `File must be ${signed.maxBytes / 1024 / 1024} MB or smaller`);
  }

  const form = new FormData();
  form.append('file', file);
  form.append('api_key', signed.apiKey);
  form.append('signature', signed.signature);
  for (const [k, v] of Object.entries(signed.params)) form.append(k, String(v));

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', signed.uploadUrl);
    xhr.upload.onprogress = (e) => e.lengthComputable && onProgress?.(Math.round((e.loaded / e.total) * 100));
    xhr.onload = () => {
      const body = JSON.parse(xhr.responseText || '{}');
      if (xhr.status >= 200 && xhr.status < 300) resolve({ publicId: body.public_id, format: body.format ?? ext });
      else reject(new ApiError(xhr.status, 'UPLOAD_FAILED', body?.error?.message ?? 'Upload failed'));
    };
    xhr.onerror = () => reject(new ApiError(0, 'UPLOAD_FAILED', 'Network error during upload'));
    xhr.send(form);
  });
}
