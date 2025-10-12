// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vue from '@astrojs/vue';

import rehypeMermaid from 'rehype-mermaid';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import remarkObsidianLinks from './src/plugins/remark-obsidian-links';


// https://astro.build/config
export default defineConfig({
    site: 'https://loqueaprendihoy.akcstudio.com',
    integrations: [mdx(), sitemap(), react(), vue()],
    markdown: {
        syntaxHighlight: {
            type: 'shiki',
            excludeLangs: ['mermaid', 'math'],
        },
        rehypePlugins: [
        	rehypeMermaid,
        	rehypeKatex
        ],
        remarkPlugins: [
        	remarkObsidianLinks,
        	remarkMath
        ]
    }
});