# Deployment trên Replit với Autoscale

## Các bước deploy:

### 1. Upload dự án lên Replit
- Tạo một Repl mới trên https://replit.com
- Chọn "Import from GitHub" hoặc upload trực tiếp code
- Chọn template "Node.js"

### 2. Cấu hình Environment Variables (nếu cần)
- Vào tab "Secrets" trong Replit
- Thêm các biến môi trường cần thiết như API keys

### 3. Deploy với Autoscale
- Vào tab "Deploy" trong Replit
- Chọn "Autoscale Deployments"
- Cấu hình:
  - **Build Command**: `npm run build`
  - **Run Command**: `npm start`
  - **Port**: 3000

### 4. Domain và SSL
- Replit sẽ tự động cung cấp HTTPS domain
- Có thể custom domain nếu cần

### 5. Monitoring
- Replit cung cấp monitoring và logs tự động
- Autoscale sẽ tự động điều chỉnh resources dựa trên traffic

## Lưu ý:
- Đảm bảo `.env` files không được commit (đã có trong .gitignore)
- Sử dụng Replit Secrets cho sensitive data
- Autoscale chỉ available cho paid plans 