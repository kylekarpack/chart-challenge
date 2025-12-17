import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import React from "react";

const components: MDXComponents = {
  h1: ({ children }: { children?: React.ReactNode }) => (
    <h1 className="text-4xl font-bold mt-8 mb-4 text-gray-900">{children}</h1>
  ),
  h2: ({ children }: { children?: React.ReactNode }) => (
    <h2 className="text-3xl font-bold mt-6 mb-3 text-gray-800">{children}</h2>
  ),
  h3: ({ children }: { children?: React.ReactNode }) => (
    <h3 className="text-2xl font-semibold mt-5 mb-2 text-gray-800">{children}</h3>
  ),
  p: ({ children }: { children?: React.ReactNode }) => (
    <p className="text-base leading-7 mb-4 text-gray-700">{children}</p>
  ),
  a: ({ href, children }: { href?: string; children?: React.ReactNode }) => (
    <Link
      href={href || "#"}
      className="text-blue-600 hover:text-blue-800 underline"
    >
      {children}
    </Link>
  ),
  ul: ({ children }: { children?: React.ReactNode }) => (
    <ul className="list-disc list-inside mb-4 space-y-2 text-gray-700">{children}</ul>
  ),
  ol: ({ children }: { children?: React.ReactNode }) => (
    <ol className="list-decimal list-inside mb-4 space-y-2 text-gray-700">{children}</ol>
  ),
  li: ({ children }: { children?: React.ReactNode }) => <li className="ml-4">{children}</li>,
  blockquote: ({ children }: { children?: React.ReactNode }) => (
    <blockquote className="border-l-4 border-blue-500 pl-4 italic my-4 text-gray-600">
      {children}
    </blockquote>
  ),
  code: ({ children }: { children?: React.ReactNode }) => (
    <code className="bg-gray-100 rounded px-1.5 py-0.5 text-sm font-mono text-gray-800">
      {children}
    </code>
  ),
  pre: ({ children }: { children?: React.ReactNode }) => (
    <pre className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto mb-4">
      {children}
    </pre>
  ),
  strong: ({ children }: { children?: React.ReactNode }) => <strong className="font-semibold">{children}</strong>,
  em: ({ children }: { children?: React.ReactNode }) => <em className="italic">{children}</em>,
};

export function useMDXComponents(): MDXComponents {
  return components;
}
