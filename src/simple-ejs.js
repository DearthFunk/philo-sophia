// Simple EJS-like template renderer for browser use
export function render(template, data) {
  const { results, foundWordDefinition } = data;
  
  let html = '';
  
  results.forEach(result => {
    html += `
      <div class="result"> 
        <h2>${escapeHtml(result.word)}</h2>
        <p>${escapeHtml(result.definition)}</p>`;
    
    result.foundWords.forEach(foundWord => {
      const definition = foundWordDefinition.call(foundWord);
      html += `
        <div class="found-words">
          <button class="found-word" id="${escapeHtml(foundWord)}">
            <b>${escapeHtml(foundWord)}</b>: <span>${escapeHtml(definition)}</span>
          </button>
        </div>`;
    });
    
    html += `
      </div>`;
  });
  
  return html;
}

function escapeHtml(text) {
  if (text == null) return '';
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}
