/**
 * Routes an image URL through wsrv.nl (images.weserv.nl) to resize + re-encode
 * to WebP on the fly. AniList doesn't offer size variants for bannerImage/coverImage,
 * so this cuts payload by fetching only the pixels we actually render.
 *
 * @param {string} url - original image URL (must be publicly reachable, e.g. AniList CDN)
 * @param {number} width - target render width in CSS px (we ask for a bit more for HiDPI)
 * @param {number} [quality=80] - WebP quality (1-100)
 * @returns {string} proxied URL, or the original url if none was given
 */
export function optimizedImage(url, width, quality = 80) {
  if (!url) return url;

  const params = new URLSearchParams({
    url,
    w: String(Math.round(width)),
    q: String(quality),
    output: 'webp',
    fit: 'cover',
  });

  return `https://wsrv.nl/?${params.toString()}`;
}
