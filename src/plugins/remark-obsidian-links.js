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