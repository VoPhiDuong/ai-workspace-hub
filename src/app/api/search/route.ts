import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { query, count = 10 } = await request.json();

    if (!query) {
      return NextResponse.json(
        { error: 'Truy vấn tìm kiếm là bắt buộc' },
        { status: 400 }
      );
    }

    if (!process.env.BRAVE_API_KEY) {
      return NextResponse.json(
        { error: 'Brave Search API key chưa được cấu hình' },
        { status: 500 }
      );
    }

    console.log(`Đang tìm kiếm: "${query}" với ${count} kết quả`);

    // Tạo URL với parameters đúng cách
    const url = new URL('https://api.search.brave.com/res/v1/web/search');
    url.searchParams.append('q', query);
    url.searchParams.append('count', String(count));
    url.searchParams.append('search_lang', 'en');
    url.searchParams.append('country', 'us');
    url.searchParams.append('safesearch', 'moderate');
    url.searchParams.append('freshness', 'pw');
    url.searchParams.append('text_decorations', 'false');
    url.searchParams.append('spellcheck', 'true');

    console.log(`Gọi Brave API: ${url.toString()}`);

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': process.env.BRAVE_API_KEY,
        'User-Agent': 'AI-Workspace-Hub/1.0'
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });

    console.log(`Brave API response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Brave API error ${response.status}:`, errorText);
      
      // Xử lý các lỗi cụ thể
      if (response.status === 429) {
        return NextResponse.json(
          { error: 'Đã vượt quá giới hạn rate limit. Vui lòng thử lại sau.' },
          { status: 429 }
        );
      } else if (response.status === 401) {
        return NextResponse.json(
          { error: 'API key không hợp lệ hoặc đã hết hạn.' },
          { status: 401 }
        );
      } else if (response.status === 500) {
        return NextResponse.json(
          { error: 'Lỗi máy chủ Brave Search. Vui lòng thử lại sau.' },
          { status: 500 }
        );
      } else {
        return NextResponse.json(
          { error: `Lỗi API Brave Search: ${response.status}` },
          { status: response.status }
        );
      }
    }

    const data = await response.json();
    console.log(`Nhận được ${data.web?.results?.length || 0} kết quả`);

    // Transform the response to match our expected format
    const results = data.web?.results?.map((result: any) => ({
      title: result.title,
      description: result.description,
      url: result.url,
      hostname: new URL(result.url).hostname,
      published: result.published || null,
    })) || [];

    return NextResponse.json({
      results,
      query,
      total: data.web?.total || 0,
    });

  } catch (error) {
    console.error('Search API error:', error);
    
    // Xử lý timeout
    if (error instanceof Error && error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'Yêu cầu tìm kiếm bị timeout. Vui lòng thử lại.' },
        { status: 408 }
      );
    }

    return NextResponse.json(
      { error: 'Không thể thực hiện tìm kiếm. Vui lòng thử lại sau.' },
      { status: 500 }
    );
  }
}

// Alternative implementation using fetch with proper URL construction
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q');
    const count = searchParams.get('count') || '10';

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      );
    }

    if (!process.env.BRAVE_API_KEY) {
      return NextResponse.json(
        { error: 'Brave Search API key not configured' },
        { status: 500 }
      );
    }

    const url = new URL('https://api.search.brave.com/res/v1/web/search');
    url.searchParams.append('q', query);
    url.searchParams.append('count', count);
    url.searchParams.append('search_lang', 'en');
    url.searchParams.append('country', 'us');
    url.searchParams.append('safesearch', 'moderate');
    url.searchParams.append('freshness', 'pw');
    url.searchParams.append('text_decorations', 'false');
    url.searchParams.append('spellcheck', 'true');

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip',
        'X-Subscription-Token': process.env.BRAVE_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Brave Search API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform the response to match our expected format
    const results = data.web?.results?.map((result: any) => ({
      title: result.title,
      description: result.description,
      url: result.url,
      hostname: new URL(result.url).hostname,
      published: result.published || null,
    })) || [];

    return NextResponse.json({
      results,
      query,
      total: data.web?.total || 0,
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Failed to perform search' },
      { status: 500 }
    );
  }
}
