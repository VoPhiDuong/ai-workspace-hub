# AI Workspace Hub

Comprehensive AI-powered productivity platform with Gemini integration

## Setup Environment Variables

Để sử dụng các tính năng AI, bạn cần thiết lập các environment variables sau:

### 1. Tạo file `.env.local` trong thư mục gốc của project:

```bash
# Google Gemini API
GOOGLE_API_KEY=your_google_api_key_here

# Brave Search API (optional)
BRAVE_API_KEY=your_brave_search_api_key_here
```

### 2. Cách lấy Google API Key:

1. Truy cập [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Đăng nhập bằng tài khoản Google
3. Tạo API key mới
4. Copy và dán vào file `.env.local`

### 3. Troubleshooting

#### Lỗi "Google API key not configured":
- Kiểm tra file `.env.local` đã được tạo
- Đảm bảo `GOOGLE_API_KEY` được đặt đúng tên
- Restart development server sau khi thêm environment variables

#### Lỗi "models/gemini-pro is not found":
- Model cũ không còn được hỗ trợ
- Ứng dụng đã được cập nhật để sử dụng `gemini-1.5-flash`
- Restart development server để áp dụng thay đổi

#### Lỗi API quota exceeded:
- Kiểm tra giới hạn API key trên Google Cloud Console
- Thử lại sau vài phút

#### Lỗi kết nối:
- Kiểm tra kết nối internet
- Đảm bảo không có firewall chặn requests đến Google APIs

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Features

- AI Code Generation với Gemini
- Content Studio để tạo blog, email
- Development Tools
- Search Integration với Brave Search

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
