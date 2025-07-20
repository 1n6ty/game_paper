import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeSanitize from "rehype-sanitize";

interface RichTextProps {
  content: string;
  className?: string;
}

/**
 * Безопасный компонент для рендеринга Markdown-текста.
 * Использует rehype-sanitize для предотвращения XSS-атак.
 */
export const RichText = ({ content, className }: RichTextProps) => {
  return (
    <div className={className}>
      <ReactMarkdown rehypePlugins={[rehypeSanitize]}>{content}</ReactMarkdown>
    </div>
  );
};
