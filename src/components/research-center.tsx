'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppStore } from "@/store/app-store";
import { searchWithBrave } from "@/lib/brave-search";
import { geminiService } from "@/lib/gemini";
import { copyWithToast } from "@/lib/clipboard";
import { 
  Search, 
  Globe, 
  BookOpen, 
  TrendingUp, 
  FileText,
  ExternalLink,
  Download,
  Copy,
  Loader2,
  AlertCircle,
  X
} from "lucide-react";

export function ResearchCenter() {
  const { searchResults, isSearching, setSearchResults, setIsSearching } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [analysisQuery, setAnalysisQuery] = useState('');
  const [analysisResult, setAnalysisResult] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [analysisError, setAnalysisError] = useState('');

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    
    setIsSearching(true);
    setSearchError('');
    setSearchResults([]);
    
    try {
      const results = await searchWithBrave(searchQuery);
      setSearchResults(results);
      
      if (results.length === 0) {
        setSearchError('Không tìm thấy kết quả nào. Hãy thử với từ khóa khác.');
      }
    } catch (error) {
      console.error('🚨 Lỗi tìm kiếm:', error);
      const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định';
      setSearchError(errorMessage);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleAnalysis = async () => {
    if (!analysisQuery.trim()) return;
    
    setIsAnalyzing(true);
    setAnalysisError('');
    setAnalysisResult('');
    
    try {
      const result = await geminiService.analyzeContent(analysisQuery);
      setAnalysisResult(result);
    } catch (error) {
      console.error('🚨 Lỗi phân tích:', error);
      const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi phân tích không xác định';
      setAnalysisError(errorMessage);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCopyToClipboard = async (text: string) => {
    await copyWithToast(
      text,
      () => console.log('📋 Đã copy thành công!'),
      (error) => console.error('❌ Copy thất bại:', error)
    );
  };

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 min-h-screen">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
            Trung Tâm Nghiên Cứu
          </h1>
          <p className="text-lg text-gray-300 mt-2">🔍 Tìm kiếm và phân tích thông tin thông minh</p>
        </div>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={async () => {
              try {
                const response = await fetch('/api/debug-search', { method: 'POST', body: JSON.stringify({ testQuery: 'test' }), headers: { 'Content-Type': 'application/json' } });
                const data = await response.json();
                console.log('🧪 Debug Search Result:', data);
                if (data.success) {
                  alert('✅ API hoạt động bình thường! Kiểm tra console để xem chi tiết.');
                } else {
                  alert(`❌ API có vấn đề: ${data.error}`);
                }
              } catch (err) {
                alert(`🚨 Lỗi test API: ${err}`);
              }
            }}
            className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700"
          >
            🧪 Test API
          </Button>
          <Button variant="outline" size="sm" className="border-slate-600 bg-slate-800 text-white hover:bg-slate-700">
            <Download className="h-4 w-4 mr-2" />
            Xuất Kết Quả
          </Button>
        </div>
      </div>

      <Tabs defaultValue="search" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 bg-slate-800 border border-slate-600">
          <TabsTrigger value="search" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-gray-300">Tìm Kiếm Web</TabsTrigger>
          <TabsTrigger value="analysis" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-gray-300">Phân Tích AI</TabsTrigger>
          <TabsTrigger value="knowledge" className="data-[state=active]:bg-slate-700 data-[state=active]:text-white text-gray-300">Kho Tri Thức</TabsTrigger>
        </TabsList>

        <TabsContent value="search" className="space-y-6">
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <Search className="h-5 w-5" />
                <span>Web Search</span>
              </CardTitle>
              <CardDescription className="text-gray-300">
                Search the web for information using Brave Search API
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                <Input
                  placeholder="Enter your search query..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="flex-1 bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                />
                <Button onClick={handleSearch} disabled={isSearching} className="bg-blue-600 hover:bg-blue-700">
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                  Search
                </Button>
              </div>

              {searchError && (
                <div className="bg-red-900/50 border border-red-700 rounded-md p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-red-400 mb-1">Lỗi tìm kiếm</h4>
                      <p className="text-sm text-red-300">{searchError}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setSearchError('')}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/30 p-1 h-auto"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-white">Search Results</h3>
                  <div className="space-y-3">
                    {searchResults.map((result, index) => (
                      <Card key={index} className="p-4 bg-slate-700 border-slate-600">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-blue-400 hover:text-blue-300">
                              <a href={result.url} target="_blank" rel="noopener noreferrer">
                                {result.title}
                              </a>
                            </h4>
                            <p className="text-sm text-gray-300 mt-1">{result.description}</p>
                            <div className="flex items-center space-x-2 mt-2 text-xs text-gray-400">
                              <Globe className="h-3 w-3" />
                              <span>{new URL(result.url).hostname}</span>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-slate-600">
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analysis" className="space-y-6">
          <Card className="bg-slate-800 border-slate-600">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-white">
                <TrendingUp className="h-5 w-5" />
                <span>AI Content Analysis</span>
              </CardTitle>
              <CardDescription className="text-gray-300">
                Use AI to analyze, summarize, and extract insights from content
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                placeholder="Paste content here for AI analysis, or describe what you'd like to research..."
                value={analysisQuery}
                onChange={(e) => setAnalysisQuery(e.target.value)}
                rows={6}
                className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
              />
              <div className="flex space-x-2">
                <Button onClick={handleAnalysis} disabled={isAnalyzing} className="bg-purple-600 hover:bg-purple-700">
                  {isAnalyzing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <TrendingUp className="h-4 w-4" />
                  )}
                  Analyze Content
                </Button>
                <Button variant="outline" onClick={() => setAnalysisQuery('')} className="border-slate-600 text-white hover:bg-slate-700">
                  Clear
                </Button>
              </div>

              {analysisError && (
                <div className="bg-red-900/50 border border-red-700 rounded-md p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-red-400 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-red-400 mb-1">Lỗi phân tích</h4>
                      <p className="text-sm text-red-300">{analysisError}</p>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setAnalysisError('')}
                      className="text-red-400 hover:text-red-300 hover:bg-red-900/30 p-1 h-auto"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {analysisResult && (
                <Card className="mt-4 bg-slate-700 border-slate-600">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-white">Analysis Result</CardTitle>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleCopyToClipboard(analysisResult)}
                      className="text-gray-300 hover:text-white hover:bg-slate-600"
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="prose prose-sm max-w-none">
                      <pre className="whitespace-pre-wrap text-sm text-gray-300 bg-slate-800 p-4 rounded border border-slate-600">{analysisResult}</pre>
                    </div>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="knowledge" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <BookOpen className="h-5 w-5" />
                <span>Knowledge Base</span>
              </CardTitle>
              <CardDescription>
                Curated research topics and saved insights
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  {
                    title: "AI & Machine Learning",
                    description: "Latest trends in artificial intelligence",
                    articles: 15,
                    updated: "2 days ago"
                  },
                  {
                    title: "Web Development",
                    description: "Modern web technologies and frameworks",
                    articles: 23,
                    updated: "1 week ago"
                  },
                  {
                    title: "Business Strategy",
                    description: "Market analysis and business insights",
                    articles: 8,
                    updated: "3 days ago"
                  },
                  {
                    title: "Technology Trends",
                    description: "Emerging technologies and innovations",
                    articles: 12,
                    updated: "5 days ago"
                  },
                  {
                    title: "Research Methods",
                    description: "Best practices for information gathering",
                    articles: 6,
                    updated: "1 week ago"
                  },
                  {
                    title: "Data Analysis",
                    description: "Tools and techniques for data insights",
                    articles: 18,
                    updated: "4 days ago"
                  }
                ].map((topic, index) => (
                  <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{topic.title}</h3>
                      <p className="text-sm text-gray-600 mb-3">{topic.description}</p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{topic.articles} articles</span>
                        <span>Updated {topic.updated}</span>
                      </div>
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
