'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { geminiService } from "@/lib/gemini";
import { copyWithToast } from "@/lib/clipboard";
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

export function DevelopmentTools() {
  const [codePrompt, setCodePrompt] = useState('');
  const [generatedCode, setGeneratedCode] = useState('');
  const [debugCode, setDebugCode] = useState('');
  const [debugResult, setDebugResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDebugging, setIsDebugging] = useState(false);

  const handleCodeGeneration = async () => {
    if (!codePrompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const result = await geminiService.generateCode(codePrompt);
      setGeneratedCode(result);
    } catch (error) {
      console.error('Code generation error:', error);
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
      () => console.log('📋 Code đã được copy!'),
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
    <div className="space-y-6 p-6 bg-gradient-to-br from-purple-50 via-white to-indigo-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
            Công Cụ Phát Triển
          </h1>
          <p className="text-lg text-gray-600 mt-2">🛠️ Tạo code và debug với AI</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="border-purple-200 hover:bg-purple-50">
            <GitBranch className="h-4 w-4 mr-2" />
            Kiểm Soát Phiên Bản
          </Button>
          <Button variant="outline" size="sm" className="border-indigo-200 hover:bg-indigo-50">
            <Download className="h-4 w-4 mr-2" />
            Xuất Code
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <Code className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">42</p>
                <p className="text-sm text-gray-600">Đoạn Code</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-red-500 to-pink-500 rounded-lg">
                <Bug className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">18</p>
                <p className="text-sm text-gray-600">Phiên Debug</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <Terminal className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">156</p>
                <p className="text-sm text-gray-600">Lệnh Đã Chạy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-violet-50 border-purple-200 hover:shadow-lg transition-all duration-300">
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg">
                <FileCode className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">8</p>
                <p className="text-sm text-gray-600">Dự Án</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="generate" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 bg-gradient-to-r from-purple-100 to-indigo-100">
          <TabsTrigger value="generate" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white">Tạo Code</TabsTrigger>
          <TabsTrigger value="debug" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white">Debug Code</TabsTrigger>
          <TabsTrigger value="snippets" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white">Thư Viện Code</TabsTrigger>
          <TabsTrigger value="tools" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-indigo-500 data-[state=active]:text-white">Công Cụ Dev</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          <Card className="bg-gradient-to-br from-white to-purple-50 border-purple-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-purple-800">
                <div className="p-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded">
                  <Code className="h-5 w-5 text-white" />
                </div>
                <span>Trình Tạo Code AI</span>
              </CardTitle>
              <CardDescription>
                Tạo đoạn code, hàm và component bằng AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Mô tả code bạn muốn tạo..."
                value={codePrompt}
                onChange={(e) => setCodePrompt(e.target.value)}
                rows={4}
                className="border-purple-200 focus:border-purple-400"
              />

              <div className="flex space-x-2">
                <Button onClick={handleCodeGeneration} disabled={isGenerating} className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600">
                  {isGenerating ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="h-4 w-4" />
                  )}
                  Tạo Code
                </Button>
                <Button variant="outline" onClick={() => setCodePrompt('')} className="border-purple-200 hover:bg-purple-50">
                  Xóa
                </Button>
              </div>

              {/* Code Templates */}
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-800 mb-2">Mẫu Code Nhanh:</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {codeTemplates.map((template, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => setCodePrompt(template.prompt)}
                      className="text-left justify-start border-purple-200 hover:bg-purple-50"
                    >
                      <span className="text-xs">{template.name}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {generatedCode && (
                <Card className="mt-4 border-purple-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-purple-800">Code Đã Tạo</CardTitle>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleCopyToClipboard(generatedCode)}
                        className="hover:bg-purple-50"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="hover:bg-purple-50">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto border">
                      <code>{generatedCode}</code>
                    </pre>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="debug" className="space-y-6">
          <Card className="bg-gradient-to-br from-white to-red-50 border-red-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-red-800">
                <div className="p-1 bg-gradient-to-r from-red-500 to-pink-500 rounded">
                  <Bug className="h-5 w-5 text-white" />
                </div>
                <span>Trình Debug Code</span>
              </CardTitle>
              <CardDescription>
                Debug code và phân tích lỗi bằng AI
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Dán code cần debug tại đây..."
                value={debugCode}
                onChange={(e) => setDebugCode(e.target.value)}
                rows={8}
                className="font-mono border-red-200 focus:border-red-400"
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
                <Button variant="outline" onClick={() => setDebugCode('')} className="border-red-200 hover:bg-red-50">
                  Xóa
                </Button>
              </div>

              {debugResult && (
                <Card className="mt-4 border-red-200">
                  <CardHeader>
                    <CardTitle className="text-sm font-medium text-red-800">Phân Tích Debug</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-100 p-3 rounded text-sm border">
                      {debugResult}
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="snippets" className="space-y-6">
          <Card className="bg-gradient-to-br from-white to-blue-50 border-blue-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-blue-800">
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
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow border-blue-100 hover:border-blue-300">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{snippet.title}</h3>
                        <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800 border border-blue-200">
                          {snippet.language}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{snippet.description}</p>
                      <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto border">
                        <code>{snippet.code}</code>
                      </pre>
                      <div className="flex justify-end mt-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                                                      onClick={() => handleCopyToClipboard(snippet.code)}
                          className="hover:bg-blue-50"
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
          <Card className="bg-gradient-to-br from-white to-green-50 border-green-200 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-green-800">
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
                  <Card key={index} className="hover:shadow-md transition-shadow border-green-100 hover:border-green-300">
                    <CardContent className="p-4 text-center">
                      <div className="flex justify-center mb-3">
                        <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                          <tool.icon className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-2">{tool.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{tool.description}</p>
                      <Button size="sm" variant="outline" className="border-green-200 hover:bg-green-50">
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
