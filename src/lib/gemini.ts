class GeminiService {
  private async callAPI(prompt: string, type: string = 'general'): Promise<string> {
    try {
      const response = await fetch('/api/gemini', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt, type }),
      });

      if (!response.ok) {
        // Lấy thông tin lỗi chi tiết từ response
        const errorData = await response.json().catch(() => null);
        const errorMessage = errorData?.error || `HTTP ${response.status}: ${response.statusText}`;
        
        console.error('API Response Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorData?.error,
          url: response.url
        });
        
        throw new Error(`API error: ${errorMessage}`);
      }

      const data = await response.json();
      
      if (!data.content) {
        console.error('Invalid API response:', data);
        throw new Error('API returned invalid response format');
      }
      
      return data.content;
    } catch (error) {
      console.error('Error calling Gemini API:', {
        error: error instanceof Error ? error.message : error,
        stack: error instanceof Error ? error.stack : undefined,
        prompt: prompt.substring(0, 100) + '...', // Log first 100 chars of prompt
        type
      });
      
      // Ném lỗi với thông tin chi tiết hơn
      if (error instanceof Error) {
        if (error.message.includes('API error:')) {
          throw error; // Giữ nguyên lỗi API
        } else if (error.message.includes('fetch')) {
          throw new Error('Không thể kết nối đến API. Vui lòng kiểm tra kết nối internet.');
        } else {
          throw new Error(`Lỗi xử lý API: ${error.message}`);
        }
      } else {
        throw new Error('Đã xảy ra lỗi không xác định khi gọi API');
      }
    }
  }

  async generateContent(prompt: string): Promise<string> {
    return this.callAPI(prompt, 'general');
  }
  async generateCode(prompt: string, language: string = 'JavaScript'): Promise<string> {
    const codePrompt = `Generate ${language} code for the following requirement. Return only the code without any explanations:

${prompt}`;
    
    return this.callAPI(codePrompt, 'code');
  }

  async debugCode(code: string): Promise<string> {
    const debugPrompt = `Debug this code and provide analysis of potential issues, bugs, and solutions:

${code}`;
    
    return this.callAPI(debugPrompt, 'debug');
  }

  async reviewCode(code: string, language: string): Promise<string> {
    const reviewPrompt = `Review this ${language} code and provide suggestions for improvement, bug fixes, and best practices:

\`\`\`${language}
${code}
\`\`\``;
    
    return this.callAPI(reviewPrompt, 'analysis');
  }

  async analyzeContent(content: string): Promise<string> {
    const analyzePrompt = `Analyze the following content and provide insights, key points, and summary:

${content}`;
    
    return this.callAPI(analyzePrompt, 'analysis');
  }

  async generateBlogPost(topic: string, keywords: string[] = []): Promise<string> {
    const keywordText = keywords.length > 0 ? `Include these keywords: ${keywords.join(', ')}.` : '';
    const blogPrompt = `Write a comprehensive blog post about "${topic}". ${keywordText}
    
Structure the post with:
- Engaging title
- Introduction
- Main content with subheadings
- Conclusion
- SEO-friendly formatting`;
    
    return this.callAPI(blogPrompt, 'blog');
  }

  async generateEmail(purpose: string, tone: string = 'professional'): Promise<string> {
    const emailPrompt = `Write a ${tone} email for: ${purpose}`;
    return this.callAPI(emailPrompt, 'email');
  }

  async generateCreativeContent(prompt: string): Promise<string> {
    return this.callAPI(prompt, 'creative');
  }
}

export const geminiService = new GeminiService();
