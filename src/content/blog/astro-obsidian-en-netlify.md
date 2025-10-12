---
title: Desplegando Astro Obsidian en Netlify
description: Cómo desplegar en Netlify un blog como este
pubDate: 2025/10/12
heroImage: "@/assets/astro-obsidian-netlify.png"
tags:
  - astro
  - obsidian
  - netlify
  - devops
---
## Obsidian

- [Obsidian - Sharpen your thinking](https://obsidian.md/)
- Obsidian permite desarrollar un "segundo cerebro".
	- Un sistema de anotación donde las notas se independizan y se van relacionando orgánicamente.
- Eventualmente, se llega a material que se puede compartir con otras personas.
- Las notas se almacenan en archivos markdown.
- Maneja tags.
- Tiene un amplio ecosistema de plugins.
- Se puede usar libremente de manera local.
- La publicación directa en web requiere el pago de una membresía.
## Astro

- [Astro](https://astro.build/)
- Astro es un framework que permite publicar sites de contenido.
- El contenido se puede almacenar en archivos markdown.
	- Además de html
- Puede manejar tags.
- Tiene un amplio sistema de plugins.
- Se puede usar libremente.
- Se puede desplegar con relativa facilidad en diversos ambientes.
	- Local
	- Netlify
	- Vercel

## Idea

- Qué tal si usamos astro para publicar notas que podamos desarrollar y mantener fácilmente con obsidian.
- Que funcione bien:
	- Hacer links en obsidian que sean reconocidos en el site publicado en astro
	- Copiar y pegar imagenes en obsidian que sea reconocidos en el site publicado en astro
	- Que bloques especiales de obsidian sean reconocidos en el site publicado en astro
		- code
		- mermaid
		- math

## Estrategia

- Crear un vault obsidian
  - Configurarlo para aumentar su compatibilidad con astro
	- Files and links
		- Default Location for new notes: Same folder as current file
		- New link format: Relative path to file
		- Use [[Wikilinks]]: NO
		- Default location for new attachments: In the folder specified below.
		- Attachment folder path: `astro/images` (para imágenes estáticas que no serán procesadas por Astro).
- Crear un proyecto astro del tipo blog
	- Ya tiene una configuración de ejemplo que funciona para blogging.
	- Tener un content que apunte a una carpeta de contenido de un vault de obsidian
	- Tener un assets que apunte a una carpeta de assets de un vault de obsidian

## Configuración

Este proyecto utiliza una configuración que permite usar una bóveda de Obsidian como fuente de contenido para un sitio web de Astro. Aquí se detallan algunos aspectos técnicos importantes.

### Astro + Obsidian
- [akobashikawa/astro-obsidian: Integrando astro para usarlo con obsidian](https://github.com/akobashikawa/astro-obsidian)
- El repositorio está organizado en dos directorios principales:
	-   `loqueaprendihoy/`: Contiene el proyecto de Astro (el sitio web).
	-   `loqueaprendihoy-vault/`: Contiene la bóveda de Obsidian (el contenido).
- Para que Astro pueda acceder al contenido de la bóveda, se están utilizando enlaces simbólicos. 
	- `loqueaprendihoy-vault/astro/content` es un enlace simbólico a `loqueaprendihoy/src/content`
	- `loqueaprendihoy-vault/astro/assets` es un enlace simbólico a `loqueaprendihoy/src/assets`
		- **Uso:** Para imágenes que quieres que Astro optimice (compresión, generación de formatos modernos, etc.). Ideal para imágenes de contenido como `heroImage` en el frontmatter.
		- **Consideración:** El hot-reloading de Astro puede fallar si se renombra o elimina un archivo de esta carpeta desde Obsidian (por ejemplo, con el plugin "Paste image rename").
	- `loqueaprendihoy-vault/astro/images` es un enlace simbólico a `loqueaprendihoy/public/images`
		- **Uso:** Para imágenes estáticas que se servirán tal cual. Es la carpeta recomendada para los adjuntos automáticos de Obsidian.
		- **Consideración:** El hot-reloading funciona de manera fiable con esta carpeta.

> **Flujo de trabajo recomendado:**
> 1. Configura Obsidian para que guarde las imágenes en `astro/images`. La mayoría de tus imágenes vivirán aquí.
> 2. Si necesitas que una imagen específica sea optimizada por Astro (por ejemplo, la imagen principal de un post), muévela manualmente de la carpeta `images` a `assets` y actualiza la ruta en tu archivo Markdown.

### Configurando Obsidian

```sh
cd loqueaprendihoy
mklink /D content \loqueaprendihoy\src\content
mklink /D assets \loqueaprendihoy\src\assets
mkdir \loqueaprendihoy\public\images
mklink /D images \loqueaprendihoy\public\images
```
- Files and Links
	- New link format: Relative path to file
		- Previene que recorte la ruta del link
	- Use Wikilinks: NO
	- Default location for file attachments: In the folder specified below
	- Attachment folder path: loqueaprendihoy/images
- Tag Folder
	- Always Open: YES
	- Files
		- Use title: NO
	- Tags
		- Store tags in frontmatter for new notes: YES
	- Actions
		- Search tags inside TagFolder when clocking tags: YES
	- Arrangements
		- Merge redundant combinations: YES

### Configurando Astro

- rehype-mermaid
	- Permite visualizar gráficos hechos con mermaid code
- rehype-katex
	- Para visualizar fórmulas matemáticas latex
- remark-math
	- Para visualizar fórmulas matemáticas latex
- katex
	- requerido por rehype-katex
- playwright-core (compatible con netlify)
	- requerido por rehype-katex
- plugins/remark-obsidian-links.js
	- plugin adhoc para las conversiones de enlaces y urls de imágenes

```sh
npx astro add react
npx astro add vue
npm install --save astro-loader-obsidian
npm install --save rehype-mermaid
npm install --save playwright-core
npm install --save remark-math rehype-katex
```

#### package.json

```json
{
  "name": "loqueaprendihoy",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "postinstall": "npx playwright-core install chromium"
  },
  "dependencies": {
    "@astrojs/mdx": "^4.3.7",
    "@astrojs/react": "^4.4.0",
    "@astrojs/rss": "^4.0.12",
    "@astrojs/sitemap": "^3.6.0",
    "@astrojs/vue": "^5.1.1",
    "@types/react": "^19.2.2",
    "@types/react-dom": "^19.2.1",
    "astro": "^5.14.4",
    "astro-loader-obsidian": "^0.10.0",
    "playwright-core": "^1.56.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "rehype-katex": "^7.0.1",
    "rehype-mermaid": "^3.0.0",
    "remark-math": "^6.0.0",
    "sharp": "^0.34.3",
    "vue": "^3.5.22"
  }
}

```

#### tsconfig.json

Para facilitar la importación de componentes desde los archivos de contenido (MDX), se ha configurado un alias de ruta en `loqueaprendihoy/tsconfig.json`:

`@/*` apunta a `loqueaprendihoy/src/*`

Esto permite importar componentes de forma consistente, sin importar la profundidad del archivo de contenido.

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [
    ".astro/types.d.ts",
    "**/*"
  ],
  "exclude": [
    "dist"
  ],
  "compilerOptions": {
    "strictNullChecks": true,
    "baseUrl": ".",
    "paths": {
      "@/*": [
        "src/*"
      ]
    },
    "jsx": "preserve",
    "jsxImportSource": "react"
  }
}
```

#### src\plugins\remark-obsidian-links.js

- Se encarga de corregir los enlaces de obsidian para que aparezcan correctamente publicados en astro.
```js
import { visit } from 'unist-util-visit';
import path from 'path';

export default function remarkObsidianLinks() {
  return (tree, file) => {
    // Visit both links and images
    visit(tree, ['link', 'image'], (node) => {
      // Handle Markdown links
      if (node.type === 'link' && node.url.endsWith('.md')) {
        // Extract filename without extension
        const slug = path.basename(node.url, '.md');
        // Transform to absolute blog path
        node.url = `/blog/${slug}/`;
        return; // Continue to the next node
      }

      // Handle image links
      if (node.type === 'image' && node.url.includes('/images/')) {
        const pathParts = node.url.split('/');
        const imageIndex = pathParts.findIndex(part => part === 'images');
        node.url = '/' + pathParts.slice(imageIndex).join('/');
      }
    });
  };
}
```

#### astro.config.mjs

- Indica el soporte para mdx, react, vue, mermaid, math, etc
```js
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
```

#### src\content.config.ts

- Indica la carga de los archivos md y mdx, su esquema, etc
- Aunque probé ObsidianMdLoader recomendado, me fue mejor con el glob por default.
```js
import { defineCollection, z } from 'astro:content';
// import { ObsidianDocumentSchema, ObsidianMdLoader } from "astro-loader-obsidian";
import { glob } from 'astro/loaders';

const blog = defineCollection({
	// Load Markdown and MDX files in the `src/content/blog/` directory.
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// loader: ObsidianMdLoader({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	// Type-check frontmatter using a schema
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			description: z.string(),
			// Transform string to Date object
			pubDate: z.coerce.date(),
			updatedDate: z.coerce.date().optional(),
			heroImage: image().optional(),
		}),
});

export const collections = { blog };

```

## Repositorio en Github

- [akobashikawa/loqueaprendihoy: Blog](https://github.com/akobashikawa/loqueaprendihoy)

## Desplegando en Netlify

### Despliegue básico

- Creo el proyecto akc-loqueaprendihoy
	- Indico que deseo importar el repositorio de github
- Acepto las opciones de despliegue por default
	- npm run build
	- tomar el resultado de la carpeta build
- Esto permitirá obtener https://akc-loqueaprendihoy.netlify.app/

### Custom domain

- Domain management
	- Production domain
		- loqueaprendihoy.akcstudio.com
	- HTTPS
		- SSL/TSL certificate
			- Verify: OK
			- Letsencrypt: requested (puede tardar, chequear en 24h)
- Tengo el DNS manager DigitalOcean:
	- DNS akcstudio.com
		- CNAME
			- loqueaprendihoy.akcstudio.com
			- is alias of akc-loqueaprendihoy.netlify.app
