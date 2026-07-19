'use client';

import ReactMarkdown from 'react-markdown';

export default function BlogMarkdown({ content }: { content: string }) {
  return (
    <ReactMarkdown
      components={{
        h2: ({ children }) => (
          <h2 className="font-display text-2xl md:text-3xl text-[#F2EFE8] mt-12 mb-4 tracking-tight">
            {children}
          </h2>
        ),
        h3: ({ children }) => (
          <h3 className="font-display text-xl text-[#F2EFE8] mt-8 mb-3 tracking-tight">
            {children}
          </h3>
        ),
        p: ({ children }) => (
          <p className="font-body text-[#C8C2B6] text-base leading-[1.75] mb-5">{children}</p>
        ),
        ul: ({ children }) => (
          <ul className="list-disc pl-5 space-y-2 mb-6 text-[#C8C2B6] font-body">{children}</ul>
        ),
        ol: ({ children }) => (
          <ol className="list-decimal pl-5 space-y-2 mb-6 text-[#C8C2B6] font-body">{children}</ol>
        ),
        li: ({ children }) => <li className="leading-relaxed">{children}</li>,
        strong: ({ children }) => <strong className="text-[#F2EFE8] font-semibold">{children}</strong>,
        a: ({ href, children }) => (
          <a
            href={href}
            className="text-[#C4A574] underline underline-offset-4 decoration-[#C4A574]/40 hover:decoration-[#C4A574]"
          >
            {children}
          </a>
        ),
        blockquote: ({ children }) => (
          <blockquote className="border-l-2 border-[#C4A574] pl-4 my-6 text-[#A39E93] italic">
            {children}
          </blockquote>
        ),
        code: ({ children }) => (
          <code className="font-mono text-sm text-[#C4A574] bg-[#161614] px-1.5 py-0.5 rounded">
            {children}
          </code>
        ),
      }}
    >
      {content}
    </ReactMarkdown>
  );
}
