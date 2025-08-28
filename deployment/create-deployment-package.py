#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
iFlytek 多模态面试系统 - 免费部署包创建脚本
自动创建包含所有必要文件的部署包
"""

import os
import shutil
import zipfile
from pathlib import Path

def create_deployment_package():
    """创建免费部署包"""
    
    print("🚀 创建 iFlytek 多模态面试系统免费部署包...")
    
    # 创建临时目录
    temp_dir = Path("temp_deployment")
    if temp_dir.exists():
        shutil.rmtree(temp_dir)
    temp_dir.mkdir()
    
    # 创建目录结构
    free_dir = temp_dir / "free-deployment"
    free_dir.mkdir()
    
    # 复制免费部署文件
    files_to_copy = [
        "docker-compose-free.yml",
        "Dockerfile.backend-free",
        "Dockerfile.frontend-free",
        "nginx-free.conf",
        "free-deploy.sh",
        "免费云服务器申请指南.md",
        "快速部署指南.md"
    ]

    for file_name in files_to_copy:
        src = Path("free-deployment") / file_name
        dst = free_dir / file_name
        if src.exists():
            shutil.copy2(src, dst)
            print(f"✅ 复制: {file_name}")
        else:
            print(f"❌ 文件不存在: {src}")
    
    # 创建环境配置文件
    env_content = """# iFlytek 多模态面试系统 - 免费版配置
# 请修改以下配置为你的实际值

# iFlytek Spark LLM 配置 (必须配置)
IFLYTEK_APP_ID=your_app_id_here
IFLYTEK_API_KEY=your_api_key_here  
IFLYTEK_API_SECRET=your_api_secret_here
IFLYTEK_SPARK_URL=wss://spark-api.xf-yun.com/v3.5/chat

# 服务器配置
DOMAIN_NAME=your-server-ip
ENVIRONMENT=production
DEBUG=false

# 性能配置 (免费服务器优化)
WORKERS=1
MAX_UPLOAD_SIZE=50MB
CACHE_TTL=1800
"""
    
    with open(free_dir / ".env.example", "w", encoding="utf-8") as f:
        f.write(env_content)
    print("✅ 创建: .env.example")
    
    # 创建README文件
    readme_content = """# 🆓 iFlytek 多模态面试系统 - 免费部署包

## 📦 包含文件
- `free-deploy.sh` - 一键部署脚本
- `docker-compose-free.yml` - Docker编排配置
- `Dockerfile.backend-free` - 后端容器配置
- `Dockerfile.frontend-free` - 前端容器配置  
- `nginx-free.conf` - Nginx配置
- `.env.example` - 环境变量模板
- `免费云服务器申请指南.md` - 详细申请指南
- `快速部署指南.md` - 快速部署步骤

## 🚀 快速开始

### 1. 申请免费服务器
推荐使用 Oracle Cloud Always Free：https://www.oracle.com/cloud/free/

### 2. 上传文件到服务器
```bash
scp -i your-key.pem -r free-deployment/ ubuntu@your-server-ip:/home/ubuntu/
```

### 3. 连接服务器并部署
```bash
ssh -i your-key.pem ubuntu@your-server-ip
cd free-deployment
chmod +x free-deploy.sh
./free-deploy.sh
```

### 4. 配置API密钥
```bash
cp .env.example .env
nano .env
# 修改 iFlytek API 配置
docker-compose -f docker-compose-free.yml restart
```

### 5. 访问系统
访问: http://your-server-ip

## 📞 技术支持
详细说明请查看 `快速部署指南.md`
"""
    
    with open(free_dir / "README.md", "w", encoding="utf-8") as f:
        f.write(readme_content)
    print("✅ 创建: README.md")
    
    # 创建ZIP包
    zip_path = "iFlytek面试系统免费部署包.zip"
    with zipfile.ZipFile(zip_path, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, dirs, files in os.walk(temp_dir):
            for file in files:
                file_path = os.path.join(root, file)
                arc_path = os.path.relpath(file_path, temp_dir)
                zipf.write(file_path, arc_path)
    
    # 清理临时目录
    shutil.rmtree(temp_dir)
    
    print(f"\n🎉 部署包创建完成: {zip_path}")
    print(f"📦 文件大小: {os.path.getsize(zip_path) / 1024:.1f} KB")
    print("\n📋 使用说明:")
    print("1. 下载部署包到本地")
    print("2. 解压后上传 free-deployment 文件夹到服务器")
    print("3. 运行 ./free-deploy.sh 一键部署")
    print("4. 配置 iFlytek API 密钥")
    print("5. 访问系统")

if __name__ == "__main__":
    create_deployment_package()
