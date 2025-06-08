'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RefreshCw, CheckCircle, XCircle, AlertTriangle } from "lucide-react";

interface DebugInfo {
  nodeEnv: string;
  hasGoogleApiKey: boolean;
  googleApiKeyLength: number;
  googleApiKeyPrefix: string;
  hasBraveApiKey: boolean;
  timestamp: string;
  workingDirectory: string;
  allEnvKeys: string[];
}

export function DebugPanel() {
  const [debugInfo, setDebugInfo] = useState<DebugInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const checkConfiguration = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/debug');
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get debug info');
      }
      
      setDebugInfo(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const testGeminiAPI = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: 'Test connection', 
          type: 'general' 
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        alert('✅ Gemini API hoạt động bình thường!');
      } else {
        alert(`❌ Lỗi Gemini API: ${data.error}`);
      }
    } catch (err) {
      alert(`❌ Lỗi kết nối: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const checkModels = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/gemini/models');
      const data = await response.json();
      
      if (response.ok) {
        const availableModels = data.models.filter((m: any) => m.status === 'available');
        const unavailableModels = data.models.filter((m: any) => m.status === 'unavailable');
        
        let message = `🔍 Kết quả kiểm tra models:\n\n`;
        message += `✅ Available: ${availableModels.map((m: any) => m.name).join(', ') || 'Không có'}\n`;
        message += `❌ Unavailable: ${unavailableModels.map((m: any) => m.name).join(', ') || 'Không có'}\n`;
        message += `🎯 Recommended: ${data.recommendedModel}`;
        
        alert(message);
      } else {
        alert(`❌ Lỗi kiểm tra models: ${data.error}`);
      }
    } catch (err) {
      alert(`❌ Lỗi kết nối: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-yellow-500" />
          <span>Debug Panel - Kiểm Tra Cấu Hình</span>
        </CardTitle>
        <CardDescription>
          Kiểm tra environment variables và kết nối API
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex space-x-2">
          <Button 
            onClick={checkConfiguration} 
            disabled={isLoading}
            className="flex items-center space-x-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Kiểm Tra Cấu Hình</span>
          </Button>
          
          <Button 
            onClick={testGeminiAPI} 
            disabled={isLoading}
            variant="outline"
          >
            Test Gemini API
          </Button>
          
          <Button 
            onClick={checkModels} 
            disabled={isLoading}
            variant="outline"
          >
            Kiểm Tra Models
          </Button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
            ❌ {error}
          </div>
        )}

        {debugInfo && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center space-x-2">
                <span className="font-medium">Environment:</span>
                <Badge variant="outline">{debugInfo.nodeEnv}</Badge>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="font-medium">Working Directory:</span>
                <span className="text-sm text-gray-600 truncate">{debugInfo.workingDirectory}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                {debugInfo.hasGoogleApiKey ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                <span className="font-medium">Google API Key:</span>
                <span className={debugInfo.hasGoogleApiKey ? 'text-green-600' : 'text-red-600'}>
                  {debugInfo.hasGoogleApiKey 
                    ? `✅ Có (${debugInfo.googleApiKeyLength} ký tự)` 
                    : '❌ Không có'
                  }
                </span>
              </div>

              {debugInfo.hasGoogleApiKey && (
                <div className="ml-7 text-sm text-gray-600">
                  Prefix: {debugInfo.googleApiKeyPrefix}
                </div>
              )}

              <div className="flex items-center space-x-2">
                {debugInfo.hasBraveApiKey ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-gray-400" />
                )}
                <span className="font-medium">Brave API Key:</span>
                <span className={debugInfo.hasBraveApiKey ? 'text-green-600' : 'text-gray-500'}>
                  {debugInfo.hasBraveApiKey ? '✅ Có' : '⚪ Không có (tùy chọn)'}
                </span>
              </div>
            </div>

            {debugInfo.allEnvKeys.length > 0 && (
              <div>
                <span className="font-medium">Environment Variables Found:</span>
                <div className="mt-1 flex flex-wrap gap-1">
                  {debugInfo.allEnvKeys.map(key => (
                    <Badge key={key} variant="secondary" className="text-xs">
                      {key}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="text-xs text-gray-500">
              Last checked: {new Date(debugInfo.timestamp).toLocaleString('vi-VN')}
            </div>
          </div>
        )}

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
          <h4 className="font-medium text-blue-800 mb-2">Hướng Dẫn Khắc Phục:</h4>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>• Đảm bảo file <code>.env.local</code> ở thư mục gốc của project</li>
            <li>• Kiểm tra tên biến: <code>GOOGLE_API_KEY=your_key_here</code></li>
            <li>• Restart development server sau khi thêm env variables</li>
            <li>• API Key lấy từ: <a href="https://makersuite.google.com/app/apikey" target="_blank" className="underline">Google AI Studio</a></li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
} 