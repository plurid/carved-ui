import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import mdx from '@mdx-js/rollup';
import remarkGfm from 'remark-gfm';
import rehypeSlug from 'rehype-slug';
import rehypeShiki from '@shikijs/rehype';
import { carved } from '../../tools/vite/carved.ts';
import { api } from './vite/api.ts';
import { examples } from './vite/examples.ts';
import { carvedTheme } from './vite/highlight.ts';

// SITE_BASE is the path the site is served from, such as /carved-ui/ on GitHub Pages.
export default defineConfig({
  base: process.env.SITE_BASE ?? '/',
  // The guides and recipes live outside this package; resolve their imports from here.
  resolve: { dedupe: ['@mdx-js/react', 'react', 'react-dom'] },
  plugins: [
    carved(),
    examples(),
    api(),
    {
      enforce: 'pre',
      ...mdx({
        providerImportSource: '@mdx-js/react',
        remarkPlugins: [remarkGfm],
        rehypePlugins: [rehypeSlug, [rehypeShiki, { theme: carvedTheme }]],
      }),
    },
    react({ include: /\.(mdx|tsx?)$/ }),
  ],
});
