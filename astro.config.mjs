// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap, { ChangeFreqEnum } from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// SITE_URL wins (set this in Vercel dashboard when a custom domain is ready).
// VERCEL_PROJECT_PRODUCTION_URL is auto-injected by Vercel on every build.
// Falls back to localhost for local dev.
const site =
  process.env.SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : 'http://localhost:4321');

// https://astro.build/config
export default defineConfig({
  site,
  trailingSlash: 'never',

  // Default, but explicit for clarity
  output: 'static',

  integrations: [
    // MDX inherits markdown plugins via extendMarkdownConfig: true (default)
    mdx(),
    sitemap({
      serialize(item) {
        // Strip trailing slash for consistency with trailingSlash: 'never'
        if (item.url.endsWith('/') && item.url !== site + '/') {
          item.url = item.url.slice(0, -1);
        }
        const url = item.url;
        if (url === site || url === site + '/') {
          item.priority = 1.0;
          item.changefreq = ChangeFreqEnum.DAILY;
          item.lastmod = new Date().toISOString();
        } else if (url.endsWith('/about') || url.endsWith('/essays')) {
          item.priority = 0.9;
          item.changefreq = ChangeFreqEnum.WEEKLY;
        } else if (url.includes('/blog/')) {
          item.priority = 0.7;
          item.changefreq = ChangeFreqEnum.MONTHLY;
        } else if (url.includes('/tags/')) {
          item.priority = 0.3;
          item.changefreq = ChangeFreqEnum.YEARLY;
        }
        return item;
      },
    }),
  ],

  vite: {
    // Tailwind v4 uses a Vite plugin instead of a PostCSS plugin.
    // @ts-ignore — type conflict between Astro's bundled Vite and @tailwindcss/vite's Vite peer dep
    plugins: [tailwindcss()],
  },

  markdown: {
    // These also apply to .mdx files via extendMarkdownConfig
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex],
    // Shiki dual-theme: emits CSS variables that swap via prefers-color-scheme.
    // Keeps syntax colors matched to the background in both modes.
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      wrap: false,
    },
  },
});
