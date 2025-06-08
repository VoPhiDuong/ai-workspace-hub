'use client'

import React, { useState } from 'react'
import { useAppStore } from '@/store/app-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { geminiService } from '@/lib/gemini'
import { downloadFile } from '@/lib/utils'
import { copyWithToast } from '@/lib/clipboard'
import { 
  PenTool, 
  Code2, 
  Mail, 
  FileText, 
  Download, 
  Copy, 
  Loader2,
  Sparkles,
  BookOpen
} from 'lucide-react'
import { CodeBlock } from '@/components/ui/code-block'

export function ContentStudio() {
  const { generatedContent, isGenerating, setGeneratedContent, setIsGenerating } = useAppStore()
  const [activeTab, setActiveTab] = useState('blog')
  const [prompts, setPrompts] = useState({
    blog: { topic: '', keywords: '' },
    code: { description: '', language: 'javascript' },
    email: { purpose: '', tone: 'professional' },
    creative: { type: 'story', prompt: '' }
  })

  const handleGenerate = async (type: string) => {
    setIsGenerating(true)
    try {
      let result = ''
      
      switch (type) {
        case 'blog':
          const keywords = prompts.blog.keywords.split(',').map(k => k.trim()).filter(k => k)
          result = await geminiService.generateBlogPost(prompts.blog.topic, keywords)
          break
        case 'code':
          result = await geminiService.generateCode(prompts.code.description, prompts.code.language)
          break
        case 'email':
          result = await geminiService.generateContent(
            `Viết một email ${prompts.email.tone === 'professional' ? 'chuyên nghiệp' : prompts.email.tone === 'casual' ? 'thân thiện' : 'trang trọng'} cho mục đích: ${prompts.email.purpose}. Viết bằng tiếng Việt.`
          )
          break
        case 'creative':
          result = await geminiService.generateContent(
            `Viết một ${prompts.creative.type === 'story' ? 'câu chuyện' : prompts.creative.type === 'poem' ? 'bài thơ' : 'văn bản sáng tạo'} dựa trên: ${prompts.creative.prompt}. Viết bằng tiếng Việt.`
          )
          break
      }
      
      setGeneratedContent(result)
    } catch (error) {
      console.error('Generation error:', error)
      setGeneratedContent('Xin lỗi, đã có lỗi xảy ra khi tạo nội dung. Vui lòng thử lại.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async () => {
    await copyWithToast(
      generatedContent,
      () => console.log('📋 Nội dung đã được copy!'),
      (error) => console.error('❌ Copy thất bại:', error)
    )
  }

  const handleDownload = () => {
    const filename = `ai-content-${Date.now()}.txt`
    downloadFile(generatedContent, filename, 'text/plain')
  }

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 min-h-screen text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
            Studio Nội Dung AI
          </h1>
          <p className="text-lg text-gray-300 mt-2">✨ Tạo nội dung sáng tạo với AI</p>
        </div>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm" className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700">
            <BookOpen className="h-4 w-4 mr-2" />
            Mẫu
          </Button>
          <Button variant="outline" size="sm" className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700">
            <Download className="h-4 w-4 mr-2" />
            Xuất File
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-slate-800 border-slate-600 hover:shadow-lg hover:shadow-slate-700/20 transition-all duration-300">
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg">
                <PenTool className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">24</p>
                <p className="text-sm text-gray-300">Bài Viết</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-600 hover:shadow-lg hover:shadow-slate-700/20 transition-all duration-300">
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <Code2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">36</p>
                <p className="text-sm text-gray-300">Đoạn Code</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-600 hover:shadow-lg hover:shadow-slate-700/20 transition-all duration-300">
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <Mail className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">12</p>
                <p className="text-sm text-gray-300">Email</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-800 border-slate-600 hover:shadow-lg hover:shadow-slate-700/20 transition-all duration-300">
          <CardContent className="flex items-center p-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-violet-500 rounded-lg">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">18</p>
                <p className="text-sm text-gray-300">Sáng Tạo</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600 shadow-xl text-white">
          <CardHeader>
                          <CardTitle className="flex items-center space-x-2 text-pink-300">
                <div className="p-1 bg-gradient-to-r from-pink-500 to-purple-500 rounded">
                  <PenTool className="h-5 w-5 text-white" />
                </div>
                <span>Trình Tạo Nội Dung</span>
              </CardTitle>
              <CardDescription className="text-gray-300">
                Tạo nhiều loại nội dung khác nhau với sự hỗ trợ của AI
              </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>              <TabsList className="grid w-full grid-cols-4 bg-slate-800 border border-slate-600">
                <TabsTrigger value="blog" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-gray-300">Bài Viết</TabsTrigger>
                <TabsTrigger value="code" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-gray-300">Lập Trình</TabsTrigger>
                <TabsTrigger value="email" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-gray-300">Email</TabsTrigger>
                <TabsTrigger value="creative" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-purple-500 data-[state=active]:text-white text-gray-300">Sáng Tạo</TabsTrigger>
              </TabsList>              <TabsContent value="blog" className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Chủ Đề Bài Viết</label>
                  <Input
                    placeholder="Nhập chủ đề bài viết..."
                    value={prompts.blog.topic}
                    onChange={(e) => setPrompts(prev => ({
                      ...prev,
                      blog: { ...prev.blog, topic: e.target.value }
                    }))}
                    className="bg-slate-700 border-slate-500 text-white placeholder-gray-400 focus:border-pink-400 focus:ring-pink-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Từ Khóa (phân cách bằng dấu phẩy)</label>
                  <Input
                    placeholder="từ khóa 1, từ khóa 2, từ khóa 3..."
                    value={prompts.blog.keywords}
                    onChange={(e) => setPrompts(prev => ({
                      ...prev,
                      blog: { ...prev.blog, keywords: e.target.value }
                    }))}
                    className="bg-slate-700 border-slate-500 text-white placeholder-gray-400 focus:border-pink-400 focus:ring-pink-400"
                  />
                </div>
                <Button 
                  onClick={() => handleGenerate('blog')}
                  disabled={isGenerating || !prompts.blog.topic}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <FileText className="h-4 w-4 mr-2" />}
                  Tạo Bài Viết
                </Button>
              </TabsContent>              <TabsContent value="code" className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Mô Tả Code</label>
                  <Textarea
                    placeholder="Mô tả code bạn muốn tạo..."
                    value={prompts.code.description}
                    onChange={(e) => setPrompts(prev => ({
                      ...prev,
                      code: { ...prev.code, description: e.target.value }
                    }))}
                    className="bg-slate-700 border-slate-500 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Ngôn Ngữ Lập Trình</label>
                  <select 
                    className="w-full p-2 border border-slate-500 rounded-md focus:border-blue-400 focus:ring-2 focus:ring-blue-400 bg-slate-700 text-white"
                    value={prompts.code.language}
                    onChange={(e) => setPrompts(prev => ({
                      ...prev,
                      code: { ...prev.code, language: e.target.value }
                    }))}
                  >
                    <option value="javascript">JavaScript</option>
                    <option value="typescript">TypeScript</option>
                    <option value="python">Python</option>
                    <option value="java">Java</option>
                    <option value="cpp">C++</option>
                    <option value="csharp">C#</option>
                  </select>
                </div>
                <Button 
                  onClick={() => handleGenerate('code')}
                  disabled={isGenerating || !prompts.code.description}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Code2 className="h-4 w-4 mr-2" />}
                  Tạo Code
                </Button>
              </TabsContent>              <TabsContent value="email" className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Mục Đích Email</label>
                  <Input
                    placeholder="Email này để làm gì?"
                    value={prompts.email.purpose}
                    onChange={(e) => setPrompts(prev => ({
                      ...prev,
                      email: { ...prev.email, purpose: e.target.value }
                    }))}
                    className="bg-slate-700 border-slate-500 text-white placeholder-gray-400 focus:border-green-400 focus:ring-green-400"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Phong Cách</label>
                  <select 
                    className="w-full p-2 border border-slate-500 rounded-md focus:border-green-400 focus:ring-2 focus:ring-green-400 bg-slate-700 text-white"
                    value={prompts.email.tone}
                    onChange={(e) => setPrompts(prev => ({
                      ...prev,
                      email: { ...prev.email, tone: e.target.value }
                    }))}
                  >
                    <option value="professional">Chuyên Nghiệp</option>
                    <option value="friendly">Thân Thiện</option>
                    <option value="formal">Trang Trọng</option>
                    <option value="casual">Thoải Mái</option>
                  </select>
                </div>
                <Button 
                  onClick={() => handleGenerate('email')}
                  disabled={isGenerating || !prompts.email.purpose}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Mail className="h-4 w-4 mr-2" />}
                  Tạo Email
                </Button>
              </TabsContent>              <TabsContent value="creative" className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-300">Loại Sáng Tạo</label>
                  <select 
                    className="w-full p-2 border border-slate-500 rounded-md focus:border-purple-400 focus:ring-2 focus:ring-purple-400 bg-slate-700 text-white"
                    value={prompts.creative.type}
                    onChange={(e) => setPrompts(prev => ({
                      ...prev,
                      creative: { ...prev.creative, type: e.target.value }
                    }))}
                  >
                    <option value="story">Truyện Ngắn</option>
                    <option value="poem">Thơ</option>
                    <option value="script">Kịch Bản</option>
                    <option value="lyrics">Lời Bài Hát</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-300">Ý Tưởng Sáng Tạo</label>
                  <Textarea
                    placeholder="Mô tả ý tưởng sáng tạo của bạn..."
                    value={prompts.creative.prompt}
                    onChange={(e) => setPrompts(prev => ({
                      ...prev,
                      creative: { ...prev.creative, prompt: e.target.value }
                    }))}
                    className="bg-slate-700 border-slate-500 text-white placeholder-gray-400 focus:border-purple-400 focus:ring-purple-400"
                  />
                </div>
                <Button 
                  onClick={() => handleGenerate('creative')}
                  disabled={isGenerating || !prompts.creative.prompt}
                  className="w-full bg-gradient-to-r from-purple-500 to-violet-500 hover:from-purple-600 hover:to-violet-600 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isGenerating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <BookOpen className="h-4 w-4 mr-2" />}
                  Tạo Nội Dung Sáng Tạo
                </Button>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>        {/* Output Panel */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-700 border-slate-600 shadow-xl text-white">
          <CardHeader>
                          <CardTitle className="flex items-center justify-between text-purple-300">
              <div className="flex items-center space-x-2">
                <div className="p-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded">
                  <Sparkles className="h-5 w-5 text-white" />
                </div>
                <span>Nội Dung Đã Tạo</span>
              </div>
              {generatedContent && (
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" onClick={handleCopy} className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700">
                    <Copy className="h-4 w-4 mr-1" />
                    Sao Chép
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload} className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700">
                    <Download className="h-4 w-4 mr-1" />
                    Tải Xuống
                  </Button>
                </div>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isGenerating ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-purple-500" />
                  <p className="text-muted-foreground">Đang tạo nội dung...</p>
                </div>
              </div>
            ) : generatedContent ? (
              <div className="space-y-4">
                <div className="max-h-96 overflow-y-auto">
                  <CodeBlock
                    code={generatedContent}
                    language={activeTab === 'code' ? prompts.code.language : 'text'}
                    title={`Nội Dung ${activeTab === 'blog' ? 'Blog' : activeTab === 'code' ? 'Code' : activeTab === 'email' ? 'Email' : 'Sáng Tạo'}`}
                    theme="dark"
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 text-muted-foreground">
                <div className="text-center">
                  <Sparkles className="h-12 w-12 mx-auto mb-4 opacity-50 text-purple-300" />
                  <p>Nội dung được tạo bởi AI sẽ hiển thị ở đây</p>
                  <p className="text-sm mt-2 text-gray-500">✨ Chọn loại nội dung và bắt đầu tạo</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
