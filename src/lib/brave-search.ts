export interface SearchResult {
  title: string;
  description: string;
  url: string;
  hostname: string;
  published?: string;
}

export async function searchWithBrave(
  query: string, 
  count: number = 10,
  retryCount: number = 0
): Promise<SearchResult[]> {
  try {
    console.log(`🔍 Tìm kiếm: "${query}" (lần thử ${retryCount + 1})`);

    const response = await fetch('/api/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, count }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`❌ Lỗi API: ${response.status}`, data);
      
      // Retry cho server errors (500, 502, 503, 504)
      if (response.status >= 500 && retryCount < 2) {
        console.log(`🔄 Thử lại sau ${(retryCount + 1) * 2} giây...`);
        await new Promise(resolve => setTimeout(resolve, (retryCount + 1) * 2000));
        return searchWithBrave(query, count, retryCount + 1);
      }

      // Throw với error message từ server
      throw new Error(data.error || `Lỗi API: ${response.status}`);
    }

    console.log(`✅ Tìm thấy ${data.results?.length || 0} kết quả`);
    return data.results || [];

  } catch (error) {
    console.error('🚨 Lỗi tìm kiếm:', error);
    
    // Network errors
    if (error instanceof TypeError && error.message.includes('fetch')) {
      throw new Error('Không thể kết nối đến dịch vụ tìm kiếm. Vui lòng kiểm tra kết nối mạng.');
    }

    // Timeout errors
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('Yêu cầu tìm kiếm bị timeout. Vui lòng thử với từ khóa ngắn gọn hơn.');
    }

    // Re-throw known errors
    if (error instanceof Error) {
      throw error;
    }

    // Unknown errors
    throw new Error('Đã xảy ra lỗi không xác định khi tìm kiếm. Vui lòng thử lại.');
  }
}

export class BraveSearchService {
  async search(query: string, count: number = 10): Promise<any> {
    try {
      const results = await searchWithBrave(query, count);
      return {
        web: {
          results: results
        }
      };
    } catch (error) {
      console.error('BraveSearchService error:', error);
      
      // Return fallback structure với error info
      return {
        web: {
          results: []
        },
        error: error instanceof Error ? error.message : 'Lỗi không xác định'
      };
    }
  }

  async searchNews(query: string): Promise<any> {
    return this.search(query + ' news', 10);
  }
}

export const braveSearchService = new BraveSearchService();
