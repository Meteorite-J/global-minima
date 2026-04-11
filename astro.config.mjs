// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// https://astro.build/config
export default defineConfig({
  // GitHub Pages URL — change if using a custom domain
  site: 'https://meteorite-j.github.io',
  base: '/global-minima',

  // Default, but explicit for clarity
  output: 'static',

  integrations: [
    // MDX inherits markdown plugins via extendMarkdownConfig: true (default)
    mdx(),
    sitemap(),
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
