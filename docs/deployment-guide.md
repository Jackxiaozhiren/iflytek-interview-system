# 🚀 部署指南

本指南将帮助您将 iFlytek 多模态智能面试评测系统部署到各种平台。

## 📋 目录

- [🌟 推荐部署平台](#-推荐部署平台)
- [🎯 Render 部署](#-render-部署)
- [⚡ Vercel 部署](#-vercel-部署)
- [🚄 Railway 部署](#-railway-部署)
- [🐳 Docker 部署](#-docker-部署)
- [☁️ 云服务器部署](#️-云服务器部署)
- [🔧 环境配置](#-环境配置)

## 🌟 推荐部署平台

| 平台 | 免费额度 | 适用场景 | 推荐指数 |
|------|----------|----------|----------|
| 🎯 **Render** | 750小时/月 | 全栈应用 | ⭐⭐⭐⭐⭐ |
| ⚡ **Vercel** | 100GB带宽/月 | 前端应用 | ⭐⭐⭐⭐ |
| 🚄 **Railway** | $5免费额度 | 开发测试 | ⭐⭐⭐⭐ |
| 🐳 **Docker** | 无限制 | 自托管 | ⭐⭐⭐ |

## 🎯 Render 部署

### 优势
- ✅ 完全免费，无需信用卡
- ✅ 支持全栈应用
- ✅ 自动 HTTPS
- ✅ 持续部署

### 部署步骤

#### 1. 准备工作
```bash
# Fork 项目到你的 GitHub 账号
# 访问：https://github.com/Jackxiaozhiren/iflytek-interview-system
# 点击右上角 "Fork" 按钮
```

#### 2. 创建 Render 服务
1. 访问 [Render.com](https://render.com)
2. 使用 GitHub 账号登录
3. 点击 "New +" → "Web Service"
4. 连接你的 GitHub 仓库

#### 3. 配置服务
```yaml
# render.yaml 配置文件
services:
  - type: web
    name: iflytek-interview-backend
    env: python
    buildCommand: "cd backend && pip install -r requirements.txt"
    startCommand: "cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT"
    envVars:
      - key: IFLYTEK_APP_ID
        value: your_app_id
      - key: IFLYTEK_API_KEY
        value: your_api_key
      - key: IFLYTEK_API_SECRET
        value: your_api_secret

  - type: web
    name: iflytek-interview-frontend
    env: node
    buildCommand: "cd frontend && npm install && npm run build"
    startCommand: "cd frontend && npm run preview"
    envVars:
      - key: VITE_API_BASE_URL
        value: https://your-backend-url.onrender.com
```

#### 4. 环境变量配置
在 Render 控制台中设置以下环境变量：

| 变量名 | 说明 | 示例值 |
|--------|------|--------|
| `IFLYTEK_APP_ID` | 讯飞应用ID | `12345678` |
| `IFLYTEK_API_KEY` | 讯飞API密钥 | `abcdef123456` |
| `IFLYTEK_API_SECRET` | 讯飞API密钥 | `secret123456` |
| `DATABASE_URL` | 数据库连接 | `sqlite:///./app.db` |

#### 5. 部署完成
- 🌐 **访问地址**：`https://your-app-name.onrender.com`
- ⏰ **首次启动**：可能需要30秒
- 🔄 **自动部署**：推送代码后自动更新

## ⚡ Vercel 部署

### 优势
- ✅ 全球 CDN
- ✅ 极快的访问速度
- ✅ 适合前端应用
- ✅ 无服务器函数支持

### 部署步骤

#### 1. 安装 Vercel CLI
```bash
npm install -g vercel
```

#### 2. 登录 Vercel
```bash
vercel login
```

#### 3. 部署前端
```bash
cd frontend
vercel --prod
```

#### 4. 配置文件
```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_API_BASE_URL": "https://your-backend-url.com"
  }
}
```

## 🚄 Railway 部署

### 优势
- ✅ 支持数据库
- ✅ 开发者友好
- ✅ 简单配置
- ✅ 实时日志

### 部署步骤

#### 1. 安装 Railway CLI
```bash
npm install -g @railway/cli
```

#### 2. 登录 Railway
```bash
railway login
```

#### 3. 初始化项目
```bash
railway init
```

#### 4. 配置文件
```toml
# railway.toml
[build]
builder = "NIXPACKS"

[deploy]
startCommand = "python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

#### 5. 部署
```bash
railway up
```

## 🐳 Docker 部署

### 优势
- ✅ 环境一致性
- ✅ 易于扩展
- ✅ 支持容器编排
- ✅ 本地开发友好

### 部署步骤

#### 1. 构建镜像
```bash
# 构建后端镜像
docker build -t iflytek-backend ./backend

# 构建前端镜像
docker build -t iflytek-frontend ./frontend
```

#### 2. Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - IFLYTEK_APP_ID=${IFLYTEK_APP_ID}
      - IFLYTEK_API_KEY=${IFLYTEK_API_KEY}
      - IFLYTEK_API_SECRET=${IFLYTEK_API_SECRET}
    volumes:
      - ./data:/app/data
      - ./logs:/app/logs

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
    depends_on:
      - backend
    environment:
      - VITE_API_BASE_URL=http://localhost:8000

  redis:
    image: redis:alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  redis_data:
```

#### 3. 启动服务
```bash
docker-compose up -d
```

## ☁️ 云服务器部署

### 支持的云平台
- 🌐 **阿里云**：ECS + RDS
- 🌐 **腾讯云**：CVM + CDB
- 🌐 **华为云**：ECS + RDS
- 🌐 **AWS**：EC2 + RDS
- 🌐 **Azure**：VM + SQL Database

### 部署步骤

#### 1. 服务器配置
```bash
# 最低配置要求
CPU: 2核
内存: 4GB
存储: 40GB SSD
带宽: 5Mbps

# 推荐配置
CPU: 4核
内存: 8GB
存储: 100GB SSD
带宽: 10Mbps
```

#### 2. 环境安装
```bash
# 更新系统
sudo apt update && sudo apt upgrade -y

# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 Python
sudo apt install python3 python3-pip -y

# 安装 Nginx
sudo apt install nginx -y

# 安装 PM2
sudo npm install -g pm2
```

#### 3. 部署应用
```bash
# 克隆代码
git clone https://github.com/Jackxiaozhiren/iflytek-interview-system.git
cd iflytek-interview-system

# 安装依赖
cd backend && pip3 install -r requirements.txt
cd ../frontend && npm install && npm run build

# 启动后端
pm2 start "python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000" --name backend

# 配置 Nginx
sudo cp deployment/nginx.conf /etc/nginx/sites-available/iflytek
sudo ln -s /etc/nginx/sites-available/iflytek /etc/nginx/sites-enabled/
sudo systemctl restart nginx
```

#### 4. Nginx 配置
```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 前端静态文件
    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # 后端 API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🔧 环境配置

### 必需环境变量
```env
# iFlytek 配置
IFLYTEK_APP_ID=your_app_id
IFLYTEK_API_KEY=your_api_key
IFLYTEK_API_SECRET=your_api_secret

# 数据库配置
DATABASE_URL=sqlite:///./interview_system.db

# 系统配置
DEBUG=False
LOG_LEVEL=INFO
CORS_ORIGINS=["http://localhost:5173"]
```

### 可选环境变量
```env
# Redis 配置
REDIS_URL=redis://localhost:6379

# 文件存储
UPLOAD_PATH=/app/uploads
MAX_FILE_SIZE=10485760

# 邮件配置
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-password
```

## 🔍 部署验证

### 健康检查
```bash
# 检查后端服务
curl http://your-domain.com/health

# 检查前端页面
curl http://your-domain.com

# 检查 API 文档
curl http://your-domain.com/docs
```

### 性能测试
```bash
# 安装测试工具
npm install -g artillery

# 运行负载测试
artillery quick --count 10 --num 5 http://your-domain.com/api/v1/health
```

## 🚨 故障排除

### 常见问题

#### 1. 服务启动失败
```bash
# 检查日志
pm2 logs backend

# 检查端口占用
netstat -tlnp | grep :8000

# 重启服务
pm2 restart backend
```

#### 2. 数据库连接失败
```bash
# 检查数据库文件权限
ls -la interview_system.db

# 重新创建数据库
rm interview_system.db
python -c "from app.database import create_tables; create_tables()"
```

#### 3. API 调用失败
```bash
# 检查环境变量
echo $IFLYTEK_API_KEY

# 测试 API 连接
curl -X POST "https://spark-api.xf-yun.com/v1/chat/completions" \
  -H "Authorization: Bearer $IFLYTEK_API_KEY"
```

## 📞 获取帮助

如果在部署过程中遇到问题：

- 📖 **查看文档**：[技术文档](technical-documentation.md)
- 🐛 **提交问题**：[GitHub Issues](https://github.com/Jackxiaozhiren/iflytek-interview-system/issues)
- 💬 **社区讨论**：[GitHub Discussions](https://github.com/Jackxiaozhiren/iflytek-interview-system/discussions)
- 📧 **邮件支持**：[support@example.com](mailto:support@example.com)

## 🎯 部署最佳实践

### 🔒 安全配置
- 使用 HTTPS 证书
- 配置防火墙规则
- 定期更新依赖包
- 监控系统日志

### 📊 性能优化
- 启用 Gzip 压缩
- 配置 CDN 加速
- 使用缓存策略
- 数据库索引优化

### 🔄 持续集成
- 设置自动部署
- 配置测试流水线
- 监控服务状态
- 自动备份数据

---

**祝您部署成功！如果有任何问题，请随时联系我们。** 🚀
