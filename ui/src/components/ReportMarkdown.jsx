import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

 const markdownComponents = {
  h1: ({ children }) => (
    <h1 className="text-4xl font-bold text-gray-900 mb-6 pb-4 border-b-4 border-orange-600 mt-8">
      {children}
    </h1>
  ),

  h2: ({ children }) => (
    <h2 className="text-3xl font-bold text-gray-800 mb-4 mt-8 pb-2 border-b-2 border-orange-400">
      {children}
    </h2>
  ),

  h3: ({ children }) => (
    <h3 className="text-2xl font-semibold text-gray-700 mb-3 mt-6">
      {children}
    </h3>
  ),

  h4: ({ children }) => (
    <h4 className="text-xl font-semibold text-gray-700 mb-2 mt-4">
      {children}
    </h4>
  ),

  p: ({ children }) => (
    <p className="text-gray-700 mb-4 leading-relaxed text-base">{children}</p>
  ),

  // Strong/Bold text
  strong: ({ children }) => (
    <strong className="font-bold text-gray-900">{children}</strong>
  ),

  // Lists with professional styling
  ul: ({ children }) => (
    <ul className="list-none mb-4 ml-0 space-y-2">{children}</ul>
  ),

  ol: ({ children }) => (
    <ol className="list-decimal mb-4 ml-6 space-y-2 text-gray-700">
      {children}
    </ol>
  ),

  li: ({ children }) => {
    const childText = typeof children === "string" ? children : "";
    const hasSublist = React.Children.toArray(children).some(
      (child) => child?.type === "ul" || child?.type === "ol"
    );

    const isDollarItem =
      childText.includes("$") ||
      React.Children.toArray(children).some(
        (child) => typeof child === "string" && child.includes("$")
      );

    return (
      <li className={`text-gray-700 ${hasSublist ? "mb-2" : ""}`}>
        <div className="flex items-start">
          <span className="text-orange-600 mr-3 mt-1 flex-shrink-0">●</span>
          <span className={`flex-1 ${isDollarItem ? "font-medium" : ""}`}>
            {children}
          </span>
        </div>
      </li>
    );
  },

  table: ({ children }) => (
    <div className="mb-6 overflow-x-auto shadow-lg rounded-lg">
      <table className="min-w-full bg-white border border-gray-300">
        {children}
      </table>
    </div>
  ),

  thead: ({ children }) => (
    <thead className="bg-gradient-to-r from-orange-700 to-orange-700">
      {children}
    </thead>
  ),

  tbody: ({ children }) => (
    <tbody className="divide-y divide-gray-200">{children}</tbody>
  ),

  tr: ({ children, isHeader }) => (
    <tr className={isHeader ? "" : "hover:bg-orange-200 transition-colors"}>
      {children}
    </tr>
  ),

  th: ({ children }) => (
    <th className="px-6 py-4 text-left text-sm font-bold text-white uppercase tracking-wider border-r border-orange-500 last:border-r-0">
      {children}
    </th>
  ),

  td: ({ children }) => {
    const childText = typeof children === "string" ? children : "";
    const isDollar = childText.includes("$");
    const isPercentage = childText.includes("%");
    const isNumber = /^\d+[\d,]*(\.\d+)?$/.test(childText.trim());

    return (
      <td
        className={`px-6 py-4 text-sm border-r border-gray-200 last:border-r-0 ${
          isDollar
            ? "font-semibold text-green-700"
            : isPercentage
            ? "font-medium text-orange-700"
            : isNumber
            ? "font-medium text-gray-800"
            : "text-gray-700"
        }`}
      >
        {children}
      </td>
    );
  },

  // Blockquotes for important notes
  blockquote: ({ children }) => (
    <blockquote className="border-l-4 border-orange-500 bg-orange-50 pl-4 py-3 mb-4 italic text-gray-700">
      {children}
    </blockquote>
  ),

  // Horizontal rule
  hr: () => <hr className="my-8 border-t-2 border-gray-300" />,

  // Code blocks (for any technical content)
  code: ({ inline, children }) => {
    if (inline) {
      return (
        <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono text-gray-800">
          {children}
        </code>
      );
    }
    return (
      <code className="block bg-gray-100 p-4 rounded-lg mb-4 overflow-x-auto text-sm font-mono text-gray-800">
        {children}
      </code>
    );
  },

  // Links
  a: ({ href, children }) => (
    <a
      href={href}
      className="text-orange-600 hover:text-orange-800 underline font-medium"
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
    </a>
  ),
};

export default function ReportMarkdown({ content }) {
  return (
    <div className="w-full mx-auto bg-white shadow-xl rounded-lg p-8 my-8">
      {/* Report Content */}
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown
          components={markdownComponents}
          remarkPlugins={[remarkGfm]}
        >
          {content}
        </ReactMarkdown>
      </div>

      {/* Report Footer */}
      <div className="mt-12 pt-6 border-t-2 border-gray-300 text-center text-sm text-gray-600">
        <p>
          This report is confidential and intended for authorized personnel
          only.
        </p>
        <p className="mt-2">
          © {new Date().getFullYear()} Healthcare Analytics Division
        </p>
      </div>
    </div>
  );
}
