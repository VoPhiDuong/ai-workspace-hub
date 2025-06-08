import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

interface ModelStatus {
  name: string;
  status: 'available' | 'unavailable' | 'unknown';
  tested: boolean;
  error?: string;
}

export async function GET(request: NextRequest) {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        { error: 'Google API key not configured' },
        { status: 500 }
      );
    }

    // Danh sách các model thường dùng để test
    const modelsToTest = [
      'gemini-1.5-flash',
      'gemini-1.5-pro',
      'gemini-1.0-pro',
      'gemini-pro'
    ];

    const modelStatus: ModelStatus[] = [];

    for (const modelName of modelsToTest) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        
        // Test với prompt đơn giản
        const result = await model.generateContent('Hello');
        const response = await result.response;
        
        modelStatus.push({
          name: modelName,
          status: 'available',
          tested: true
        });
        
        // Chỉ test một model thành công là đủ để không spam API
        break;
        
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        modelStatus.push({
          name: modelName,
          status: 'unavailable',
          error: errorMessage,
          tested: true
        });
      }
    }

    // Thêm các model chưa test
    modelsToTest.forEach(modelName => {
      if (!modelStatus.find(m => m.name === modelName)) {
        modelStatus.push({
          name: modelName,
          status: 'unknown',
          tested: false
        });
      }
    });

    return NextResponse.json({
      models: modelStatus,
      recommendedModel: modelStatus.find(m => m.status === 'available')?.name || 'gemini-1.5-flash',
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Models API error:', error);
    return NextResponse.json(
      { error: 'Failed to check models' },
      { status: 500 }
    );
  }
} 