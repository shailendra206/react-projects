/**
 * Routes an image URL through Cloudinary's Fetch API to resize + re-encode
 * on the fly. AniList doesn't offer size variants for bannerImage/coverImage,
 * so this cuts payload by fetching only the pixels we actually render.
 *
 * @param {string} url - original image URL (must be publicly reachable, e.g. AniList CDN)
 * @param {number} width - target render width in CSS px (we ask for a bit more for HiDPI)
 * @param {string} [quality='auto'] - Cloudinary quality directive
 * @returns {string} proxied URL, or the original url if none was given
 */
const CLOUDINARY_CLOUD_NAME = 'hmj01ddt';

export function optimizedImage(url, width, quality = 'auto') {
  if (!url) return url;

  const transformations = `f_auto,q_${quality},w_${Math.round(width)},c_limit`;
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch/${transformations}/${encodeURIComponent(url)}`;
}
