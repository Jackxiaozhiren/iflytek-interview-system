#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
准备GitHub仓库用于免费部署
创建所有必要的配置文件
"""

import os
import shutil
import json
from pathlib import Path

def create_github_repo_package():
    """创建GitHub仓库部署包"""
    
    print("🚀 准备GitHub仓库用于免费部署...")
    
    # 创建临时目录
    repo_dir = Path("github-repo-ready")
    if repo_dir.exists():
        shutil.rmtree(repo_dir)
    repo_dir.mkdir()
    
    print("📁 创建目录结构...")
    
    # 复制后端文件
    backend_src = Path("../../backend")
    backend_dst = repo_dir / "backend"
    if backend_src.exists():
        shutil.copytree(backend_src, backend_dst)
        print("✅ 复制后端文件")
    else:
        print("❌ 后端文件不存在")
    
    # 复制前端文件
    frontend_src = Path("../../frontend")
    frontend_dst = repo_dir / "frontend"
    if frontend_src.exists():
        shutil.copytree(frontend_src, frontend_dst)
        print("✅ 复制前端文件")
    else:
        print("❌ 前端文件不存在")
    
    # 创建Render配置
    render_config = """# Render.com 部署配置
services:
  - type: web
    name: iflytek-interview-backend
    env: python
    buildCommand: |
      cd backend
      pip install -r requirements.txt
    startCommand: |
      cd backend
      python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: PYTHONPATH
        value: /opt/render/project/src/backend
      - key: IFLYTEK_APP_ID
        sync: false
      - key: IFLYTEK_API_KEY
        sync: false
      - key: IFLYTEK_API_SECRET
        sync: false
      - key: IFLYTEK_SPARK_URL
        value: wss://spark-api.xf-yun.com/v3.5/chat
"""
    
    with open(repo_dir / "render.yaml", "w", encoding="utf-8") as f:
        f.write(render_config)
    print("✅ 创建Render配置")
    
    # 创建Vercel配置
    vercel_config = {
        "name": "iflytek-interview-system",
        "version": 2,
        "builds": [
            {
                "src": "frontend/package.json",
                "use": "@vercel/static-build",
                "config": {"distDir": "dist"}
            }
        ],
        "routes": [
            {"src": "/(.*)", "dest": "/frontend/dist/$1"}
        ],
        "env": {
            "IFLYTEK_APP_ID": "@iflytek_app_id",
            "IFLYTEK_API_KEY": "@iflytek_api_key",
            "IFLYTEK_API_SECRET": "@iflytek_api_secret"
        }
    }
    
    with open(repo_dir / "vercel.json", "w", encoding="utf-8") as f:
        json.dump(vercel_config, f, indent=2)
    print("✅ 创建Vercel配置")
    
    # 创建Railway配置
    railway_config = """[build]
builder = "NIXPACKS"

[deploy]
startCommand = "cd backend && python -m uvicorn app.main:app --host 0.0.0.0 --port $PORT"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
"""
    
    with open(repo_dir / "railway.toml", "w", encoding="utf-8") as f:
        f.write(railway_config)
    print("✅ 创建Railway配置")
    
    # 创建环境变量模板
    env_template = """# 环境变量配置
# 请在部署平台中设置这些变量

IFLYTEK_APP_ID=你的APP_ID
IFLYTEK_API_KEY=你的API_KEY
IFLYTEK_API_SECRET=你的API_SECRET
IFLYTEK_SPARK_URL=wss://spark-api.xf-yun.com/v3.5/chat
ENVIRONMENT=production
"""
    
    with open(repo_dir / ".env.example", "w", encoding="utf-8") as f:
        f.write(env_template)
    print("✅ 创建环境变量模板")
    
    # 创建README
    readme_content = """# 🚀 iFlytek 多模态面试系统

## 🆓 免费部署选项

### 1. Render.com（推荐）
- 完全免费，无需信用卡
- 自动部署，连接GitHub即可

### 2. Vercel
- 全球CDN，访问速度快
- 适合前端项目

### 3. Railway
- 支持数据库
- 开发者友好

## 🚀 快速部署

### Render部署
1. Fork这个仓库
2. 访问 https://render.com
3. 用GitHub登录
4. 创建Web Service
5. 连接仓库
6. 配置环境变量
7. 部署完成！

### 环境变量配置
```
IFLYTEK_APP_ID=你的APP_ID
IFLYTEK_API_KEY=你的API_KEY
IFLYTEK_API_SECRET=你的API_SECRET
```

## 📁 项目结构
```
├── backend/          # FastAPI后端
├── frontend/         # Vue.js前端
├── render.yaml       # Render配置
├── vercel.json       # Vercel配置
└── railway.toml      # Railway配置
```

## 🎯 功能特性
- AI智能面试
- 多模态分析
- 实时评估
- 报告生成

---
**部署完成后，你的系统将永久在线，任何人都可以访问！** 🎉
"""
    
    with open(repo_dir / "README.md", "w", encoding="utf-8") as f:
        f.write(readme_content)
    print("✅ 创建README文件")
    
    # 创建.gitignore
    gitignore_content = """# 依赖文件
node_modules/
__pycache__/
*.pyc
venv/
.env

# 构建文件
dist/
build/
*.log

# IDE文件
.vscode/
.idea/
*.swp
*.swo

# 系统文件
.DS_Store
Thumbs.db

# 数据库文件
*.db
*.sqlite
"""
    
    with open(repo_dir / ".gitignore", "w", encoding="utf-8") as f:
        f.write(gitignore_content)
    print("✅ 创建.gitignore文件")
    
    print(f"\n🎉 GitHub仓库准备完成！")
    print(f"📁 文件位置: {repo_dir.absolute()}")
    print(f"\n📋 下一步操作:")
    print("1. 将 github-repo-ready 文件夹内容上传到GitHub")
    print("2. 选择一个免费部署平台（推荐Render）")
    print("3. 连接GitHub仓库")
    print("4. 配置环境变量")
    print("5. 一键部署！")

if __name__ == "__main__":
    create_github_repo_package()
