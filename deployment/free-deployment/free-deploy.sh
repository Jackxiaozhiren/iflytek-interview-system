#!/bin/bash

# iFlytek 多模态面试系统 - 免费云服务器部署脚本
# 专为低配置免费服务器优化

set -e

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}"
echo "========================================="
echo "  iFlytek 多模态面试系统免费部署"
echo "========================================="
echo -e "${NC}"

# 检查系统资源
check_resources() {
    echo -e "${BLUE}[1/9]${NC} 检查系统资源..."
    
    # 检查内存
    total_mem=$(free -m | awk 'NR==2{printf "%.0f", $2}')
    if [ $total_mem -lt 900 ]; then
        echo -e "${YELLOW}警告: 内存较低 (${total_mem}MB)，建议至少1GB${NC}"
    fi
    
    # 检查磁盘空间
    disk_space=$(df -h / | awk 'NR==2{print $4}' | sed 's/G//')
    if [ ${disk_space%.*} -lt 10 ]; then
        echo -e "${YELLOW}警告: 磁盘空间较低，建议至少10GB可用空间${NC}"
    fi
    
    echo -e "${GREEN}系统资源检查完成${NC}"
}

# 优化系统性能
optimize_system() {
    echo -e "${BLUE}[2/9]${NC} 优化系统性能..."
    
    # 创建swap文件（如果内存小于2GB）
    if [ $total_mem -lt 2000 ] && [ ! -f /swapfile ]; then
        echo "创建1GB swap文件..."
        sudo fallocate -l 1G /swapfile
        sudo chmod 600 /swapfile
        sudo mkswap /swapfile
        sudo swapon /swapfile
        echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    fi
    
    # 清理系统缓存
    sudo apt-get clean
    sudo apt-get autoremove -y
    
    echo -e "${GREEN}系统优化完成${NC}"
}

# 安装Docker（轻量化）
install_docker() {
    echo -e "${BLUE}[3/9]${NC} 安装Docker..."
    
    if ! command -v docker &> /dev/null; then
        # 使用官方脚本安装
        curl -fsSL https://get.docker.com -o get-docker.sh
        sudo sh get-docker.sh
        sudo usermod -aG docker $USER
        rm get-docker.sh
        
        # 启动Docker服务
        sudo systemctl start docker
        sudo systemctl enable docker
    fi
    
    echo -e "${GREEN}Docker安装完成${NC}"
}

# 安装Docker Compose
install_docker_compose() {
    echo -e "${BLUE}[4/9]${NC} 安装Docker Compose..."
    
    if ! command -v docker-compose &> /dev/null; then
        # 安装轻量版本
        sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
        sudo chmod +x /usr/local/bin/docker-compose
    fi
    
    echo -e "${GREEN}Docker Compose安装完成${NC}"
}

# 准备部署环境
prepare_environment() {
    echo -e "${BLUE}[5/9]${NC} 准备部署环境..."
    
    # 创建必要目录
    mkdir -p data/backend data/redis logs
    
    # 复制环境配置
    if [ ! -f .env ]; then
        cp ../production.env .env
        echo -e "${YELLOW}请编辑 .env 文件配置你的 iFlytek API 密钥${NC}"
    fi
    
    echo -e "${GREEN}环境准备完成${NC}"
}

# 构建镜像（分步构建节省内存）
build_images() {
    echo -e "${BLUE}[6/9]${NC} 构建Docker镜像..."
    
    # 先构建后端
    echo "构建后端镜像..."
    docker build -f Dockerfile.backend-free -t iflytek-backend-free ../../backend
    
    # 清理构建缓存
    docker system prune -f
    
    # 再构建前端
    echo "构建前端镜像..."
    docker build -f Dockerfile.frontend-free -t iflytek-frontend-free ../../frontend
    
    # 再次清理
    docker system prune -f
    
    echo -e "${GREEN}镜像构建完成${NC}"
}

# 启动服务
start_services() {
    echo -e "${BLUE}[7/9]${NC} 启动服务..."
    
    # 使用免费版配置启动
    docker-compose -f docker-compose-free.yml up -d
    
    echo -e "${GREEN}服务启动完成${NC}"
}

# 等待服务就绪
wait_for_services() {
    echo -e "${BLUE}[8/9]${NC} 等待服务启动..."
    
    # 等待更长时间，因为免费服务器性能较低
    sleep 60
    
    # 检查服务状态
    if docker-compose -f docker-compose-free.yml ps | grep -q "Up"; then
        echo -e "${GREEN}服务启动成功${NC}"
    else
        echo -e "${RED}服务启动可能有问题，请检查日志${NC}"
        docker-compose -f docker-compose-free.yml logs
    fi
}

# 显示部署结果
show_result() {
    echo -e "${BLUE}[9/9]${NC} 部署完成！"
    
    # 获取服务器IP
    server_ip=$(curl -s ifconfig.me 2>/dev/null || echo "localhost")
    
    echo -e "${GREEN}"
    echo "========================================="
    echo "          免费部署完成！"
    echo "========================================="
    echo -e "${NC}"
    echo "访问地址: http://$server_ip"
    echo ""
    echo "管理命令:"
    echo "  查看状态: docker-compose -f docker-compose-free.yml ps"
    echo "  查看日志: docker-compose -f docker-compose-free.yml logs -f"
    echo "  重启服务: docker-compose -f docker-compose-free.yml restart"
    echo "  停止服务: docker-compose -f docker-compose-free.yml down"
    echo ""
    echo -e "${YELLOW}注意: 免费服务器性能有限，首次访问可能较慢${NC}"
}

# 主函数
main() {
    check_resources
    optimize_system
    install_docker
    install_docker_compose
    prepare_environment
    build_images
    start_services
    wait_for_services
    show_result
}

# 运行主函数
main "$@"
