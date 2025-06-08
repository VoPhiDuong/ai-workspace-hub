import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const debugInfo = {
      nodeEnv: process.env.NODE_ENV,
      hasGoogleApiKey: !!process.env.GOOGLE_API_KEY,
      googleApiKeyLength: process.env.GOOGLE_API_KEY?.length || 0,
      googleApiKeyPrefix: process.env.GOOGLE_API_KEY?.substring(0, 10) + '...' || 'Không có',
      hasBraveApiKey: !!process.env.BRAVE_API_KEY,
      timestamp: new Date().toISOString(),
      platform: 'replit'
    };

    return NextResponse.json(debugInfo);

  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json(
      { error: 'Debug failed' },
      { status: 500 }
    );
  }
} 