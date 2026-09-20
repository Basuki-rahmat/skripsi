/**
 * Rate limiter sederhana (in-memory) untuk melindungi login & register
 * dari brute force / spam.
 *
 * Catatan arsitektur:
 * - Cukup untuk VPS single-instance (Next.js berjalan sebagai satu proses).
 * - Jika suatu saat scale-out multi-instance, ganti ke penyimpanan bersama
 *   (mis. Redis) dengan logika sama.
 *
 * Pakai:
 *   if (!checkRateLimit(`login:${email}`, 5, 10 * 60_000)) { ... tolak ... }
 */

type Bucket = { count: number; resetAt: number };

const globalForRate = globalThis as unknown as {
  __rateBuckets?: Map<string, Bucket>;
};

const buckets: Map<string, Bucket> =
  globalForRate.__rateBuckets ?? new Map<string, Bucket>();
globalForRate.__rateBuckets = buckets;

/**
 * true = boleh lewat. false = melebihi batas, harus ditolak.
 */
export function checkRateLimit(
  key: string,
  max: number,
  windowMs: number
): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();

  // Bersihkan bucket kadaluarsa sesekali agar map tidak tumbuh tanpa batas.
  if (buckets.size > 5_000) {
    for (const [k, v] of buckets) {
      if (v.resetAt <= now) buckets.delete(k);
    }
  }

  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true, retryAfterSec: 0 };
  }

  bucket.count += 1;
  if (bucket.count > max) {
    return {
      ok: false,
      retryAfterSec: Math.max(1, Math.ceil((bucket.resetAt - now) / 1000)),
    };
  }
  return { ok: true, retryAfterSec: 0 };
}
