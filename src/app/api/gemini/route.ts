import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { prompt, type = 'general' } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    if (!process.env.GOOGLE_API_KEY) {
      console.error('Google API key not configured');
      return NextResponse.json(
        { 
          error: 'Google API key not configured. Please add GOOGLE_API_KEY to environment variables.',
          details: 'Vui lòng thêm GOOGLE_API_KEY vào Environment Variables trong Replit'
        },
        { status: 500 }
      );
    }

    // Thử các model khả dụng theo thứ tự ưu tiên
    let model;
    const modelOptions = [
      'gemini-1.5-flash',
      'gemini-1.5-pro', 
      'gemini-1.0-pro',
      'gemini-pro'
    ];

    // Chọn model đầu tiên (gemini-1.5-flash)
    model = genAI.getGenerativeModel({ model: modelOptions[0] });

    let enhancedPrompt = prompt;

    // Enhance prompts based on type
    switch (type) {
      case 'code':
        enhancedPrompt = `You are an expert programmer. ${prompt}. Provide clean, well-commented code with explanations.`;
        break;
      case 'blog':
        enhancedPrompt = `You are a skilled content writer. Write a comprehensive blog post about: ${prompt}. Include headings, subheadings, and engaging content.`;
        break;
      case 'email':
        enhancedPrompt = `You are a professional email writer. Write a professional email for: ${prompt}. Make it clear, concise, and appropriate for business communication.`;
        break;
      case 'creative':
        enhancedPrompt = `You are a creative writer. Create engaging, imaginative content for: ${prompt}. Be creative and original.`;
        break;
      case 'analysis':
        enhancedPrompt = `You are an expert analyst. Analyze the following content and provide detailed insights: ${prompt}`;
        break;
      case 'debug':
        enhancedPrompt = `You are a debugging expert. Analyze this code and provide debugging insights, potential issues, and solutions: ${prompt}`;
        break;
      default:
        enhancedPrompt = prompt;
    }

    console.log('Generating content with Gemini...', { type, promptLength: prompt.length, model: modelOptions[0] });
    
    let result, response, text;
    let lastError;

    // Thử generate content với model hiện tại
    try {
      result = await model.generateContent(enhancedPrompt);
      response = await result.response;
      text = response.text();
    } catch (error) {
      lastError = error;
      
      // Nếu lỗi model không tìm thấy, thử model khác
      if (error instanceof Error && error.message.includes('not found')) {
        console.log('Model not found, trying alternative models...');
        
        for (let i = 1; i < modelOptions.length; i++) {
          try {
            console.log(`Trying model: ${modelOptions[i]}`);
            model = genAI.getGenerativeModel({ model: modelOptions[i] });
            result = await model.generateContent(enhancedPrompt);
            response = await result.response;
            text = response.text();
            
            console.log(`Successfully used model: ${modelOptions[i]}`);
            break; // Thành công, thoát vòng lặp
            
          } catch (modelError) {
            console.log(`Model ${modelOptions[i]} failed:`, modelError instanceof Error ? modelError.message : modelError);
            lastError = modelError;
            continue; // Thử model tiếp theo
          }
        }
        
        // Nếu tất cả model đều fail
        if (!text) {
          throw lastError;
        }
      } else {
        // Lỗi khác không phải model not found
        throw error;
      }
    }

    if (!text) {
      console.error('Empty response from Gemini API');
      return NextResponse.json(
        { error: 'Empty response from AI service' },
        { status: 500 }
      );
    }

    console.log('Content generated successfully');
    return NextResponse.json({ content: text });

  } catch (error) {
    console.error('Gemini API error:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    });
    
    // Xử lý các loại lỗi cụ thể
    if (error instanceof Error) {
      if (error.message.includes('API_KEY')) {
        return NextResponse.json(
          { error: 'Invalid API key configuration' },
          { status: 401 }
        );
      } else if (error.message.includes('quota') || error.message.includes('limit')) {
        return NextResponse.json(
          { error: 'API quota exceeded. Please try again later.' },
          { status: 429 }
        );
      } else if (error.message.includes('blocked') || error.message.includes('safety')) {
        return NextResponse.json(
          { error: 'Content was blocked by safety filters. Please modify your request.' },
          { status: 400 }
        );
      }
    }
    
    return NextResponse.json(
      { error: 'Failed to generate content' },
      { status: 500 }
    );
  }
}
