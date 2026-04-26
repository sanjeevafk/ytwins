'use client';

import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
    content: string;
}

export const MarkdownRenderer = ({ content }: MarkdownRendererProps) => {
    return (
        <div className="markdown-body text-gray-300">
            <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                    code({ inline, className, children, ...props }: { inline?: boolean; className?: string; children?: React.ReactNode }) {
                        const match = /language-(\w+)/.exec(className || '');
                        return !inline && match ? (
                            <SyntaxHighlighter
                                {...props}
                                style={vscDarkPlus}
                                language={match[1]}
                                PreTag="div"
                                customStyle={{
                                    background: '#1e1e1e',
                                    borderRadius: '0.5rem',
                                    padding: '1rem',
                                    margin: '1rem 0',
                                }}
                            >
                                {String(children).replace(/\n$/, '')}
                            </SyntaxHighlighter>
                        ) : (
                            <code {...props} className={`${className} bg-gray-800 rounded px-1.5 py-0.5 text-sm`}>
                                {children}
                            </code>
                        );
                    },
                    h1: (props) => <h1 className="text-2xl font-bold mb-4 mt-6 text-white" {...props} />,
                    h2: (props) => <h2 className="text-xl font-semibold mb-3 mt-5 text-gray-100" {...props} />,
                    h3: (props) => <h3 className="text-lg font-medium mb-2 mt-4 text-gray-200" {...props} />,
                    ul: (props) => <ul className="list-disc list-outside ml-6 mb-4 space-y-1" {...props} />,
                    ol: (props) => <ol className="list-decimal list-outside ml-6 mb-4 space-y-1" {...props} />,
                    li: (props) => <li className="mb-1" {...props} />,
                    p: (props) => <p className="mb-4 leading-relaxed" {...props} />,
                    strong: (props) => <strong className="font-bold text-green-400" {...props} />,
                    blockquote: (props) => (
                        <blockquote className="border-l-4 border-green-500 pl-4 py-1 my-4 italic text-gray-400 bg-gray-800/30 rounded-r" {...props} />
                    ),
                }}
            >
                {content}
            </ReactMarkdown>
        </div>
    );
};
