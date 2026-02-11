/**
 * Returns a thumbnail/preview image URL for known video and media links.
 * Used to show a preview on recommendation cards (e.g. YouTube, Vimeo).
 */
export function getLinkThumbnail(url: string): string | null {
  if (!url || typeof url !== "string") return null;
  const trimmed = url.trim();

  // YouTube: watch?v=ID, youtu.be/ID, youtube.com/embed/ID (hqdefault is widely available)
  const youtubeWatch = trimmed.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/);
  if (youtubeWatch) {
    const id = youtubeWatch[1];
    return `https://img.youtube.com/vi/${id}/hqdefault.jpg`;
  }

  // Vimeo: vimeo.com/123456 or player.vimeo.com/video/123456
  const vimeo = trimmed.match(/(?:vimeo\.com\/|player\.vimeo\.com\/video\/)(\d+)/);
  if (vimeo) {
    const id = vimeo[1];
    return `https://vumbnail.com/${id}.jpg`;
  }

  return null;
}

/**
 * Fallback thumbnail URL when link is not YouTube/Vimeo or image fails to load.
 */
export const FALLBACK_THUMBNAIL =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='225' viewBox='0 0 400 225' fill='none'%3E%3Crect width='400' height='225' fill='%23e4e4e7'/%3E%3Cpath d='M160 90v45l30-22.5L160 90z' fill='%23a1a1aa'/%3E%3C/svg%3E";
