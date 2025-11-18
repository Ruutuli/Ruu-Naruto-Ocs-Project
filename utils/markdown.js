// Markdown utility for rendering markdown text safely

// Configure marked options
if (typeof marked !== 'undefined') {
  marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: true,
    mangle: false
  });
}

/**
 * Renders markdown text to HTML
 * @param {string} text - Markdown text to render
 * @returns {string} - Rendered HTML
 */
export function renderMarkdown(text) {
  if (!text) return '';
  
  if (typeof marked !== 'undefined') {
    try {
      return marked.parse(text);
    } catch (error) {
      console.error('Markdown rendering error:', error);
      // Fallback to plain text with line breaks
      return text.split('\n').map(line => `<p>${escapeHtml(line)}</p>`).join('');
    }
  } else {
    // Fallback if marked.js is not loaded
    return escapeHtml(text).replace(/\n/g, '<br>');
  }
}

/**
 * Escapes HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

