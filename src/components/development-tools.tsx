'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { geminiService } from "@/lib/gemini";
import { 
  Code, 
  Terminal, 
  Bug, 
  Zap, 
  Copy,
  Download,
  Play,
  FileCode,
  GitBranch,
  Database,
  Loader2
} from "lucide-react";
import { CodeBlock } from "@/components/ui/code-block";
import { copyWithToast } from "@/lib/clipboard";

export function DevelopmentTools() {
  const [codePrompt, setCodePrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [debugCode, setDebugCode] = useState('');
  const [debugResult, setDebugResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDebugging, setIsDebugging] = useState(false);
  const [error, setError] = useState<string>('');

  const handleCodeGeneration = async () => {
    if (!codePrompt.trim()) return;
    
    setIsGenerating(true);
    setError(''); // Reset error state
    try {
      const result = await geminiService.generateCode(codePrompt);
      setGeneratedCode(result);
    } catch (error) {
      console.error('Code generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định';
      setError(errorMessage);
      
      // Hiển thị thông báo lỗi chi tiết dựa trên loại lỗi
      if (errorMessage.includes('API key not configured')) {
        setError('Lỗi cấu hình: Chưa thiết lập Google API Key. Vui lòng liên hệ quản trị viên.');
      } else if (errorMessage.includes('500')) {
        setError('Lỗi máy chủ: Dịch vụ AI tạm thời không khả dụng. Vui lòng thử lại sau.');
      } else if (errorMessage.includes('không thể kết nối')) {
        setError('Lỗi kết nối: Không thể kết nối đến dịch vụ AI. Kiểm tra kết nối internet.');
      } else {
        setError(`Lỗi tạo code: ${errorMessage}`);
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDebugCode = async () => {
    if (!debugCode.trim()) return;
    
    setIsDebugging(true);
    try {
      const result = await geminiService.debugCode(debugCode);
      setDebugResult(result);
    } catch (error) {
      console.error('Debug error:', error);
    } finally {
      setIsDebugging(false);
    }
  };

  const handleCopyToClipboard = async (text: string) => {
    await copyWithToast(
      text,
      () => console.log('📋 Đã copy code thành công!'),
      (error) => console.error('❌ Copy thất bại:', error)
    );
  };

  const codeTemplates = [
    {
      name: "Component React",
      description: "Tạo component React functional",
      prompt: "Tạo một React functional component với TypeScript"
    },
    {
      name: "API Endpoint", 
      description: "Tạo REST API endpoint",
      prompt: "Tạo một REST API endpoint với Express.js"
    },
    {
      name: "Database Schema",
      description: "Tạo schema cơ sở dữ liệu",
      prompt: "Tạo database schema cho quản lý người dùng"
    },
    {
      name: "Thuật Toán",
      description: "Tạo thuật toán implementation",
      prompt: "Triển khai thuật toán tìm kiếm nhị phân trong JavaScript"
    }
  ];

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 min-h-screen text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Công Cụ Phát Triển
          </h1>
          <p className="text-lg text-gray-300 mt-2">🛠️ Tạo code và debug với AI</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700">
            <GitBranch className="h-4 w-4 mr-2" />
            Kiểm Soát Phiên Bản
          </Button>
          <Button variant="outline" size="sm" className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700">
            <Download className="h-4 w-4 mr-2" />
            Xuất Code
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-600 hover:shadow-lg hover:shadow-slate-700/20 transition-all duration-300">
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <Code className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">42</p>
                <p className="text-sm text-gray-300">Đoạn Code</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-600 hover:shadow-lg hover:shadow-slate-700/20 transition-all duration-300">
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
                <Bug className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">18</p>
                <p className="text-sm text-gray-300">Phiên Debug</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-600 hover:shadow-lg hover:shadow-slate-700/20 transition-all duration-300">
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <Terminal className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">156</p>
                <p className="text-sm text-gray-300">Lệnh Đã Chạy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-600 hover:shadow-lg hover:shadow-slate-700/20 transition-all duration-300">
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg">
                <FileCode className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">8</p>
                <p className="text-sm text-gray-300">Dự Án</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-slate-800 border border-slate-600">
          <TabsTrigger value="generate" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white text-gray-300">Tạo Code</TabsTrigger>
          <TabsTrigger value="debug" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white text-gray-300">Debug Code</TabsTrigger>
          <TabsTrigger value="snippets" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white text-gray-300">Thư Viện Code</TabsTrigger>
          <TabsTrigger value="tools" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white text-gray-300">Công Cụ Dev</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600 shadow-xl text-white">
            <CardHeader>
                              <CardTitle className="flex items-center space-x-2 text-blue-300">
                  <div className="p-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded">
                    <Code className="h-5 w-5 text-white" />
                  </div>
                  <span>Trình Tạo Code AI</span>
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Tạo đoạn code, hàm và component bằng AI
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Mô tả code bạn muốn tạo..."
                value={codePrompt}
                onChange={(e) => setCodePrompt(e.target.value)}
                rows={4}
                className="bg-slate-700 border-slate-500 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400"
              />

              <div className="flex space-x-2">
                <Button onClick={handleCodeGeneration} disabled={isGenerating} className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4" />
                  )}
                  Tạo Code
                </Button>
                <Button variant="outline" onClick={() => setCodePrompt('')} className="border-slate-500 hover:bg-slate-600 text-gray-300 hover:text-white">
                  Xóa
                </Button>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-3 bg-red-900/50 border border-red-600 rounded-md">
                  <div className="flex items-center space-x-2">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="text-sm text-red-200">{error}</div>
                    <button 
                      onClick={() => setError('')}
                      className="ml-auto text-red-400 hover:text-red-200"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}

              {/* Code Templates */}
              <div className="border-t border-slate-600 pt-4">
                <h3 className="font-semibold text-white mb-2">Mẫu Code Nhanh:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {codeTemplates.map((template, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setCodePrompt(template.prompt)}
                      className="text-left justify-start border-slate-600 bg-slate-800 text-white hover:bg-slate-700"
                    >
                      <span className="text-xs">{template.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {generatedCode && (
                <div className="mt-6">
                  <CodeBlock
                    code={generatedCode}
                    language="javascript"
                    title="Code Đã Tạo"
                    theme="dark"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="debug" className="space-y-6">
          <Card className="bg-slate-800 border-slate-600 shadow-lg text-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-300">
                <div className="p-1 bg-gradient-to-r from-red-500 to-pink-500 rounded">
                  <Bug className="h-5 w-5 text-white" />
                </div>
                <span>Trình Debug Code</span>
              </CardTitle>
              <CardDescription className="text-gray-300">
                Debug code và phân tích lỗi bằng AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Dán code cần debug tại đây..."
                value={debugCode}
                onChange={(e) => setDebugCode(e.target.value)}
                rows={8}
                className="font-mono bg-slate-700 border-slate-500 text-white placeholder-gray-400 focus:border-red-400"
              />

              <div className="flex space-x-2">
                <Button onClick={handleDebugCode} disabled={isDebugging} className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600">
                  {isDebugging ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Bug className="h-4 w-4" />
                  )}
                  Debug Code
                </Button>
                <Button variant="outline" onClick={() => setDebugCode('')} className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700">
                  Xóa
                </Button>
              </div>

              {debugResult && (
                <div className="mt-6">
                  <CodeBlock
                    code={debugResult}
                    language="text"
                    title="Phân Tích Debug"
                    theme="dark"
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="snippets" className="space-y-6">
          <Card className="bg-slate-800 border-slate-600 shadow-lg text-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-300">
                <div className="p-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded">
                  <FileCode className="h-5 w-5 text-white" />
                </div>
                <span>Thư Viện Đoạn Code</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  {
                    title: "React useState Hook",
                    language: "JavaScript",
                    description: "Quản lý state trong React components",
                    code: "const [state, setState] = useState(initialValue);"
                  },
                  {
                    title: "Express Route Handler",
                    language: "JavaScript", 
                    description: "Route handler cơ bản Express.js",
                    code: "app.get('/api/users', (req, res) => {\n  res.json({ users: [] });\n});"
                  },
                  {
                    title: "Python List Comprehension",
                    language: "Python",
                    description: "Tạo danh sách bằng comprehension",
                    code: "squares = [x**2 for x in range(10)]"
                  },
                  {
                    title: "SQL Join Query",
                    language: "SQL",
                    description: "Kết nối bảng với foreign keys",
                    code: "SELECT u.name, p.title FROM users u\nJOIN posts p ON u.id = p.user_id;"
                  },
                  {
                    title: "CSS Flexbox Center",
                    language: "CSS",
                    description: "Căn giữa nội dung với flexbox",
                    code: ".container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}"
                  },
                  {
                    title: "TypeScript Interface",
                    language: "TypeScript",
                    description: "Định nghĩa cấu trúc object",
                    code: "interface User {\n  id: number;\n  name: string;\n  email: string;\n}"
                  }
                ].map((snippet, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md hover:shadow-slate-700/20 transition-shadow bg-slate-700 border-slate-600 hover:border-slate-500">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-white">{snippet.title}</h3>
                        <span className="px-2 py-1 rounded text-xs bg-blue-900/30 text-blue-300 border border-blue-700">
                          {snippet.language}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mb-3">{snippet.description}</p>
                      <CodeBlock
                        code={snippet.code}
                        language={snippet.language.toLowerCase()}
                        theme="dark"
                      />
                      <div className="flex justify-end mt-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                                                        onClick={() => handleCopyToClipboard(snippet.code)}
                          className="hover:bg-slate-600 text-gray-300 hover:text-white"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tools" className="space-y-6">
          <Card className="bg-slate-800 border-slate-600 shadow-lg text-white">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-300">
                <div className="p-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded">
                  <Terminal className="h-5 w-5 text-white" />
                </div>
                <span>Công Cụ Phát Triển</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    icon: Terminal,
                    title: "Terminal Tích Hợp",
                    description: "Chạy lệnh trực tiếp trong app",
                    action: "Mở Terminal"
                  },
                  {
                    icon: Database,
                    title: "Quản Lý Database",
                    description: "Kết nối và quản lý cơ sở dữ liệu",
                    action: "Kết Nối DB"
                  },
                  {
                    icon: GitBranch,
                    title: "Git Integration",
                    description: "Quản lý version control",
                    action: "Xem Git Status"
                  },
                  {
                    icon: Play,
                    title: "Code Runner",
                    description: "Chạy code trong nhiều ngôn ngữ",
                    action: "Chạy Code"
                  },
                  {
                    icon: FileCode,
                    title: "File Manager",
                    description: "Quản lý file dự án",
                    action: "Mở File Explorer"
                  },
                  {
                    icon: Zap,
                    title: "API Tester",
                    description: "Test REST APIs",
                    action: "Mở API Tester"
                  }
                ].map((tool, index) => (
                  <Card key={index} className="hover:shadow-md hover:shadow-slate-700/20 transition-shadow bg-slate-700 border-slate-600 hover:border-slate-500">
                    <CardContent className="p-4 text-center">
                      <div className="flex justify-center mb-3">
                        <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                          <tool.icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-white mb-2">{tool.title}</h3>
                      <p className="text-sm text-gray-300 mb-3">{tool.description}</p>
                      <Button size="sm" variant="outline" className="border-slate-600 bg-slate-800 text-white hover:bg-slate-600">
                        {tool.action}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}