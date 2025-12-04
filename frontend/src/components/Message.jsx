import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { duotoneSpace } from "react-syntax-highlighter/dist/esm/styles/prism";

// Function to parse text & extract code blocks
function renderMessage(content) {
  const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g;

  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = codeBlockRegex.exec(content)) !== null) {
    const [full, lang, code] = match;
    const start = match.index;

    // Plain text before code block
    if (start > lastIndex) {
      parts.push({
        type: "text",
        content: content.slice(lastIndex, start),
      });
    }

    // Code block
    parts.push({
      type: "code",
      lang: lang || "javascript",
      content: code,
    });

    lastIndex = start + full.length;
  }

  // Remaining text after last code block
  if (lastIndex < content.length) {
    parts.push({
      type: "text",
      content: content.slice(lastIndex),
    });
  }

  return parts;
}

export default function Message({ role, content }) {
  const parsed = renderMessage(content);

  return (
    <div
      className={`p-3 rounded-xl max-w-2xl whitespace-pre-wrap text-xl text-stone-300 ${
        role === "user"
          ? "bg-stone-600 self-end ml-auto"
          : "bg-stone-800"
      }`}
    >
      {parsed.map((part, i) =>
        part.type === "code" ? (
          <SyntaxHighlighter
            key={i}
            language={part.lang}
            style={duotoneSpace}
            customStyle={{
              borderRadius: "12px",
              padding: "16px",
              marginTop: "12px",
            }}
          >
            {part.content}
          </SyntaxHighlighter>
        ) : (
          <span key={i}>{part.content}</span>
        )
      )}
    </div>
  );
}
