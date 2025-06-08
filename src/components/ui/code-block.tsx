'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { copyWithToast } from '@/lib/clipboard';

interface CodeBlockProps {
  code: string;
  language?: string;
  title?: string;
  theme?: 'dark' | 'light';
}

export function CodeBlock({ 
  code, 
  language = 'text', 
  title,
  theme = 'dark' 
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    await copyWithToast(
      code,
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      },
      (error) => {
        console.error('❌ Copy failed:', error);
        // Có thể hiển thị error notification sau
      }
    );
  };

  const getThemeClasses = () => {
    if (theme === 'dark') {
      return {
        container: "bg-gray-900 border-gray-700",
        header: "bg-gray-800 border-gray-700 text-gray-100",
        code: "text-gray-100",
        syntax: getSyntaxHighlight()
      };
    } else {
      return {
        container: "bg-white border-gray-300",
        header: "bg-gray-100 border-gray-300 text-gray-800", 
        code: "text-gray-800",
        syntax: getSyntaxHighlightLight()
      };
    }
  };

  const getSyntaxHighlight = () => {
    // Basic syntax highlighting for dark theme
    return {
      keyword: "text-blue-400",
      string: "text-green-400", 
      comment: "text-gray-500",
      number: "text-orange-400",
      function: "text-yellow-400",
      operator: "text-pink-400"
    };
  };

  const getSyntaxHighlightLight = () => {
    // Basic syntax highlighting for light theme
    return {
      keyword: "text-blue-600",
      string: "text-green-600",
      comment: "text-gray-400", 
      number: "text-orange-600",
      function: "text-purple-600",
      operator: "text-pink-600"
    };
  };

  const themeClasses = getThemeClasses();

  return (
    <div className={`rounded-lg border-2 overflow-hidden shadow-lg ${themeClasses.container}`}>
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-2 border-b ${themeClasses.header}`}>
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-3 h-3 rounded-full bg-red-500"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
          </div>
          {title && (
            <span className="text-sm font-medium ml-2">{title}</span>
          )}
          {language && (
            <span className="text-xs bg-opacity-20 bg-gray-500 px-2 py-1 rounded">
              {language.toUpperCase()}
            </span>
          )}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={copyToClipboard}
          className="h-8 w-8 p-0 hover:bg-gray-700"
        >
          {copied ? (
            <Check className="h-4 w-4 text-green-400" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>

      {/* Code Content */}
      <div className="relative">
        <pre className={`p-6 overflow-x-auto text-sm font-mono leading-relaxed ${themeClasses.code}`}>
          <code className="whitespace-pre-wrap">
            {code}
          </code>
        </pre>
        
        {/* Line numbers (optional) */}
        <div className="absolute left-0 top-0 p-6 text-gray-500 text-sm font-mono leading-relaxed pointer-events-none select-none">
          {code.split('\n').map((_, index) => (
            <div key={index} className="text-right pr-4 w-10">
              {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 