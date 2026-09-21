import React from 'react';

/**
 * Lightweight, robust Markdown Renderer for clinical chat and triage analysis.
 * Parses headings, bold, italics, bullet lists, numbered lists, tables, code, and alerts.
 */
export function MarkdownRenderer({ content, className = '' }) {
  if (!content) return null;

  // Split content into blocks by double newlines or single newlines depending on structure
  const lines = content.split('\n');
  const elements = [];
  let currentList = null; // { type: 'ul' | 'ol', items: [] }
  let tableRows = [];

  const flushList = () => {
    if (currentList) {
      if (currentList.type === 'ul') {
        elements.push(
          <ul key={`ul-${elements.length}`} className="md-ul">
            {currentList.items.map((it, idx) => (
              <li key={idx}>{renderInline(it)}</li>
            ))}
          </ul>
        );
      } else {
        elements.push(
          <ol key={`ol-${elements.length}`} className="md-ol">
            {currentList.items.map((it, idx) => (
              <li key={idx}>{renderInline(it)}</li>
            ))}
          </ol>
        );
      }
      currentList = null;
    }
  };

  const flushTable = () => {
    if (tableRows.length > 0) {
      const headers = tableRows[0];
      const rows = tableRows.slice(1).filter(r => !r.isDivider);
      elements.push(
        <div key={`table-${elements.length}`} className="md-table-wrap">
          <table className="md-table">
            <thead>
              <tr>
                {headers.cells.map((cell, cIdx) => (
                  <th key={cIdx}>{renderInline(cell)}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rIdx) => (
                <tr key={rIdx}>
                  {row.cells.map((cell, cIdx) => (
                    <td key={cIdx}>{renderInline(cell)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      tableRows = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    // Check for Table line: | col1 | col2 |
    if (line.startsWith('|') && line.endsWith('|')) {
      flushList();
      const isDivider = line.replace(/\|/g, '').trim().split('').every(ch => ch === '-' || ch === ':');
      const cells = line.split('|').slice(1, -1).map(c => c.trim());
      tableRows.push({ cells, isDivider });
      continue;
    } else {
      flushTable();
    }

    // Check for empty line
    if (!line) {
      flushList();
      continue;
    }

    // Check for Headings
    if (line.startsWith('### ')) {
      flushList();
      elements.push(<h4 key={`h4-${elements.length}`} className="md-h4">{renderInline(line.slice(4))}</h4>);
      continue;
    }
    if (line.startsWith('## ')) {
      flushList();
      elements.push(<h3 key={`h3-${elements.length}`} className="md-h3">{renderInline(line.slice(3))}</h3>);
      continue;
    }
    if (line.startsWith('# ')) {
      flushList();
      elements.push(<h2 key={`h2-${elements.length}`} className="md-h2">{renderInline(line.slice(2))}</h2>);
      continue;
    }

    // Check for Horizontal Rule
    if (line === '---' || line === '***') {
      flushList();
      elements.push(<hr key={`hr-${elements.length}`} className="md-hr" />);
      continue;
    }

    // Check for Blockquote or alert
    if (line.startsWith('> ')) {
      flushList();
      elements.push(
        <blockquote key={`bq-${elements.length}`} className="md-blockquote">
          {renderInline(line.slice(2))}
        </blockquote>
      );
      continue;
    }

    // Check for Unordered list (- or *)
    const ulMatch = line.match(/^[-*•]\s+(.*)$/);
    if (ulMatch) {
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(ulMatch[1]);
      continue;
    }

    // Check for Ordered list (1. 2.)
    const olMatch = line.match(/^(\d+)\.\s+(.*)$/);
    if (olMatch) {
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(olMatch[2]);
      continue;
    }

    // Regular paragraph
    flushList();
    elements.push(
      <p key={`p-${elements.length}`} className="md-paragraph">
        {renderInline(line)}
      </p>
    );
  }

  flushList();
  flushTable();

  return <div className={`markdown-content ${className}`}>{elements}</div>;
}

/**
 * Parses inline formatting: **bold**, *italic*, `code`, and links.
 */
function renderInline(text) {
  if (!text) return '';

  // Tokenize bold, code, italic
  const parts = [];
  let remaining = text;
  let keyIdx = 0;

  while (remaining.length > 0) {
    // Bold: **text**
    const boldMatch = remaining.match(/\*\*(.+?)\*\*/);
    // Code: `code`
    const codeMatch = remaining.match(/`([^`]+)`/);
    // Italic: *text* (when not preceded by *)
    const italicMatch = remaining.match(/(?<!\*)\*([^*]+)\*(?!\*)/);

    // Find first match
    let firstMatch = null;
    let matchType = null;
    let matchIndex = Infinity;

    if (boldMatch && boldMatch.index < matchIndex) {
      firstMatch = boldMatch;
      matchType = 'bold';
      matchIndex = boldMatch.index;
    }
    if (codeMatch && codeMatch.index < matchIndex) {
      firstMatch = codeMatch;
      matchType = 'code';
      matchIndex = codeMatch.index;
    }
    if (italicMatch && italicMatch.index < matchIndex && matchType !== 'bold') {
      firstMatch = italicMatch;
      matchType = 'italic';
      matchIndex = italicMatch.index;
    }

    if (!firstMatch) {
      parts.push(remaining);
      break;
    }

    // Push text before match
    if (firstMatch.index > 0) {
      parts.push(remaining.substring(0, firstMatch.index));
    }

    // Push formatted element
    if (matchType === 'bold') {
      parts.push(<strong key={keyIdx++} className="md-strong">{firstMatch[1]}</strong>);
    } else if (matchType === 'code') {
      parts.push(<code key={keyIdx++} className="md-code">{firstMatch[1]}</code>);
    } else if (matchType === 'italic') {
      parts.push(<em key={keyIdx++} className="md-em">{firstMatch[1]}</em>);
    }

    remaining = remaining.substring(firstMatch.index + firstMatch[0].length);
  }

  return parts;
}
