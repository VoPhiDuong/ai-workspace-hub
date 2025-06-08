import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    // Chỉ cho phép debug trong development mode
    if (process.env.NODE_ENV !== 'development') {
      return NextResponse.json(
        { error: 'Debug API chỉ khả dụng trong development mode' },
        { status: 403 }
      );
    }

    const debugInfo = {
      nodeEnv: process.env.NODE_ENV,
      hasGoogleApiKey: !!process.env.GOOGLE_API_KEY,
      googleApiKeyLength: process.env.GOOGLE_API_KEY?.length || 0,
      googleApiKeyPrefix: process.env.GOOGLE_API_KEY?.substring(0, 10) + '...' || 'Không có',
      hasBraveApiKey: !!process.env.BRAVE_API_KEY,
      timestamp: new Date().toISOString(),
      workingDirectory: process.cwd(),
      allEnvKeys: Object.keys(process.env).filter(key => 
        key.includes('GOOGLE') || key.includes('BRAVE') || key.includes('API')
      ),
    };

    return NextResponse.json(debugInfo);

  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json(
      { error: 'Debug failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 