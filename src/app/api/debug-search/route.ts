import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    const config = {
      hasApiKey: !!process.env.BRAVE_API_KEY,
      apiKeyLength: process.env.BRAVE_API_KEY?.length || 0,
      apiKeyPrefix: process.env.BRAVE_API_KEY?.substring(0, 8) + '...',
      timestamp: new Date().toISOString()
    };

    console.log('🔍 Debug Brave Search Configuration:', config);

    return NextResponse.json({
      status: 'OK',
      message: 'Debug thông tin Brave Search API',
      config,
      testUrl: 'https://api.search.brave.com/res/v1/web/search?q=test&count=1'
    });

  } catch (error) {
    console.error('Debug error:', error);
    return NextResponse.json(
      { 
        error: 'Lỗi khi debug',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { testQuery = 'AI technology' } = await request.json();

    if (!process.env.BRAVE_API_KEY) {
      return NextResponse.json({
        error: 'BRAVE_API_KEY không được cấu hình',
        solution: 'Thêm BRAVE_API_KEY vào file .env.local'
      });
    }

    console.log(`🧪 Test tìm kiếm: "${testQuery}"`);

    const url = new URL('https://api.search.brave.com/res/v1/web/search');
    url.searchParams.append('q', testQuery);
    url.searchParams.append('count', '3');
    url.searchParams.append('search_lang', 'en');

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'X-Subscription-Token': process.env.BRAVE_API_KEY,
        'User-Agent': 'AI-Workspace-Hub/1.0'
      },
      signal: AbortSignal.timeout(15000)
    });

    const data = await response.json();

    return NextResponse.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      hasResults: !!data.web?.results?.length,
      resultCount: data.web?.results?.length || 0,
      sampleResult: data.web?.results?.[0] ? {
        title: data.web.results[0].title,
        url: data.web.results[0].url
      } : null,
      error: !response.ok ? data : null,
      testQuery
    });

  } catch (error) {
    console.error('🚨 Test search error:', error);
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      type: error instanceof Error ? error.name : 'UnknownError',
      timestamp: new Date().toISOString()
    });
  }
} 