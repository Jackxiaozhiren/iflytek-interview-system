#!/bin/bash

# iFlytek 多模态面试系统 - 快速部署脚本
# 适用于云服务器一键部署

set -e

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}"
echo "========================================="
echo "  iFlytek 多模态面试系统快速部署"
echo "========================================="
echo -e "${NC}"

# 1. 更新系统
echo -e "${BLUE}[1/8]${NC} 更新系统包..."
sudo apt update && sudo apt upgrade -y

# 2. 安装Docker
echo -e "${BLUE}[2/8]${NC} 安装Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
fi

# 3. 安装Docker Compose
echo -e "${BLUE}[3/8]${NC} 安装Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# 4. 准备项目文件
echo -e "${BLUE}[4/8]${NC} 准备项目文件..."
# 假设项目文件已经上传到服务器
if [ ! -d "deployment" ]; then
    echo -e "${RED}错误：请先将项目文件上传到服务器${NC}"
    exit 1
fi

# 5. 配置环境变量
echo -e "${BLUE}[5/8]${NC} 配置环境变量..."
if [ ! -f .env ]; then
    cp .env.example .env
    echo -e "${RED}请编辑 .env 文件，配置你的 iFlytek API 密钥${NC}"
    echo "nano .env"
    read -p "配置完成后按回车继续..."
fi

# 6. 创建必要目录
echo -e "${BLUE}[6/8]${NC} 创建必要目录..."
mkdir -p nginx/ssl data/backend data/redis logs

# 7. 启动服务
echo -e "${BLUE}[7/8]${NC} 启动服务..."
docker-compose up -d --build

# 8. 等待服务启动
echo -e "${BLUE}[8/8]${NC} 等待服务启动..."
sleep 30

# 检查服务状态
echo -e "${GREEN}检查服务状态...${NC}"
docker-compose ps

echo -e "${GREEN}"
echo "========================================="
echo "          部署完成！"
echo "========================================="
echo -e "${NC}"
echo "访问地址: http://$(curl -s ifconfig.me)"
echo "本地访问: http://localhost"
echo ""
echo "管理命令:"
echo "  查看日志: docker-compose logs -f"
echo "  重启服务: docker-compose restart"
echo "  停止服务: docker-compose down"
