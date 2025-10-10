import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';

export function MarkdownContent({ children, className = '', ...rest }) {
  if (children == null) return null;
  const source = typeof children === 'string' ? children : String(children);
  if (!source.trim()) return null;

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeRaw, rehypeKatex]}
      components={{
        table({ node, ...props }) {
          return (
            <div className="markdown-table-wrapper">
              <table {...props} />
            </div>
          );
        }
      }}
      className={['markdown-content', className].filter(Boolean).join(' ')}
      {...rest}
    >
      {source}
    </ReactMarkdown>
  );
}
