const fs = require('fs');
const path = require('path');

/**
 * index.html unit test
 * Validates that the HTML entry contains the expected structure, meta tags, and script includes.
 */

describe('index.html', () => {
  let content;
  let filePath;

  beforeAll(() => {
    filePath = path.resolve(__dirname, '..', 'index.html');
    content = fs.readFileSync(filePath, 'utf8');
  });

  test('starts with HTML5 doctype', () => {
    // Trim any BOM/leading whitespace and assert doctype
    const head = content.slice(0, 100).trimStart();
    expect(/^<!DOCTYPE\s+html>/i.test(head)).toBe(true);
  });

  test('contains required HTML structure and tags', () => {
    // Create an isolated document and inject the HTML (doctype is not part of innerHTML)
  // Parse using DOMParser to preserve <html> attributes like lang
  const parsed = new DOMParser().parseFromString(content, 'text/html');
  const htmlEl = parsed.documentElement;

  // <html lang="en">
  expect(htmlEl.getAttribute('lang')).toBe('en');

  // Work within the found HTML element
  const headEl = parsed.head;
  const bodyEl = parsed.body;

  // Head: charset, viewport, X-UA-Compatible, title
  const charset = headEl.querySelector('meta[charset]');
    expect(charset).not.toBeNull();
    expect((charset.getAttribute('charset') || '').toUpperCase()).toBe('UTF-8');

  const viewport = headEl.querySelector('meta[name="viewport"]');
    expect(viewport).not.toBeNull();
    expect(viewport.getAttribute('content')).toBe('width=device-width, initial-scale=1.0');

  const xua = headEl.querySelector('meta[http-equiv]');
    expect(xua).not.toBeNull();
    expect(xua.getAttribute('http-equiv')).toBe('X-UA-Compatible');
    expect(xua.getAttribute('content')).toBe('ie=edge');

  const title = headEl.querySelector('title');
    expect(title).not.toBeNull();
    expect(title.textContent).toBe('StockChart');

  // Body: root div and script include
  const root = bodyEl.querySelector('#root');
    expect(root).not.toBeNull();

  const script = bodyEl.querySelector('script[src]');
    expect(script).not.toBeNull();
    expect(script.getAttribute('src')).toBe('./index.js');
  });
});
