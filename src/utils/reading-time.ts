/**
 * Estimates reading time from raw markdown/MDX body text.
 * Average adult reading speed: ~200 words per minute.
 */
export function readingTime(body: string): number {
  const words = body.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

/** Strip .md / .mdx extension from a Content Layer entry id to get a URL slug. */
export function getSlug(id: string): string {
  return id.replace(/\.(mdx?)$/, '');
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
