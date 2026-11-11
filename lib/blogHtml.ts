/**
 * Blog posts are sometimes saved as a complete HTML document (<!DOCTYPE html><html><head><style>…)
 * rather than a body fragment. Injected as-is, the document's <style> is global: rules such as
 * `footer{…}`, `.grid{…}`, `*{margin:0}`, `ul,ol{…}`, `h2{…}` restyled the site's own navbar,
 * "Explore More" box and footer below the article (Nov 2026 report: broken layout under posts).
 *
 * prepareBlogHtml() keeps only the body markup and returns the post's CSS with every selector
 * scoped under `scopeClass`, so a post can style itself but nothing outside its container.
 */

export const BLOG_SCOPE_CLASS = 'blog-embed';

export interface PreparedBlogHtml {
  html: string;
  /** Scoped CSS from the post's own <style> blocks; empty when the post had none. */
  css: string;
}

export function prepareBlogHtml(content: string, scopeClass: string = BLOG_SCOPE_CLASS): PreparedBlogHtml {
  let html = content || '';

  // Collect every <style> block (head or body) and remove it from the markup.
  const styles: string[] = [];
  html = html.replace(/<style\b[^>]*>([\s\S]*?)<\/style\s*>/gi, (_, css: string) => {
    styles.push(css);
    return '';
  });

  // Full document → keep only what is inside <body>; otherwise strip any stray document tags.
  const body = html.match(/<body\b[^>]*>([\s\S]*)<\/body\s*>/i);
  if (body) {
    html = body[1];
  } else {
    html = html
      .replace(/<!DOCTYPE[^>]*>/gi, '')
      .replace(/<head\b[^>]*>[\s\S]*?<\/head\s*>/gi, '')
      .replace(/<\/?(?:html|body)\b[^>]*>/gi, '');
  }

  const scope = `.${scopeClass}`;
  const css = styles.map((s) => scopeCss(s, scope)).join('\n').trim();
  return { html: html.trim(), css };
}

/** Prefix every selector in `css` with `scope`. Handles nested @media/@supports/@container. */
export function scopeCss(css: string, scope: string): string {
  const src = css.replace(/\/\*[\s\S]*?\*\//g, '');
  let out = '';
  let i = 0;

  while (i < src.length) {
    const open = src.indexOf('{', i);
    const semi = src.indexOf(';', i);

    // Statement at-rules (@import, @charset, @namespace) before the next block: drop them —
    // an @import would load global CSS, and they are invalid mid-stylesheet anyway.
    if (semi !== -1 && (open === -1 || semi < open) && src.slice(i, semi).trim().startsWith('@')) {
      i = semi + 1;
      continue;
    }
    if (open === -1) break;

    const prelude = src.slice(i, open).trim();
    const close = matchBrace(src, open);
    const inner = src.slice(open + 1, close);
    i = close + 1;
    if (!prelude) continue;

    if (prelude.startsWith('@')) {
      const name = prelude.slice(1).split(/[\s(]/)[0].toLowerCase();
      if (name === 'media' || name === 'supports' || name === 'container' || name === 'layer') {
        out += `${prelude}{${scopeCss(inner, scope)}}\n`;
      } else {
        // @keyframes, @font-face, @page, @property: not selector-based, keep verbatim.
        out += `${prelude}{${inner}}\n`;
      }
      continue;
    }

    const selectors = splitSelectors(prelude).map((sel) => scopeSelector(sel, scope));
    out += `${selectors.join(',')}{${inner}}\n`;
  }

  return out;
}

function matchBrace(src: string, open: number): number {
  let depth = 0;
  for (let j = open; j < src.length; j++) {
    if (src[j] === '{') depth++;
    else if (src[j] === '}') {
      depth--;
      if (depth === 0) return j;
    }
  }
  return src.length - 1;
}

/** Split a selector list on top-level commas (not those inside :is(), :not(), [attr="a,b"]). */
function splitSelectors(prelude: string): string[] {
  const parts: string[] = [];
  let depth = 0;
  let quote: string | null = null;
  let start = 0;
  for (let j = 0; j < prelude.length; j++) {
    const c = prelude[j];
    if (quote) {
      if (c === quote) quote = null;
    } else if (c === '"' || c === "'") quote = c;
    else if (c === '(' || c === '[') depth++;
    else if (c === ')' || c === ']') depth--;
    else if (c === ',' && depth === 0) {
      parts.push(prelude.slice(start, j));
      start = j + 1;
    }
  }
  parts.push(prelude.slice(start));
  return parts.map((p) => p.trim()).filter(Boolean);
}

function scopeSelector(sel: string, scope: string): string {
  // `:root`, `html`, `body` (and chains like `html body`) mean "the document" — in a post that
  // is the post's container.
  const root = sel.match(/^((?::root|html|body)(?![\w-])\s*)+/i);
  if (root) {
    const rest = sel.slice(root[0].length);
    // `body.dark p` → `.blog-embed.dark p`; `body p` → `.blog-embed p`.
    return rest && !/^\s/.test(root[0].slice(-1)) ? `${scope}${rest}` : `${scope} ${rest}`.trim();
  }
  return `${scope} ${sel}`;
}
