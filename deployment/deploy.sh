#!/bin/bash

# iFlytek 多模态面试系统 - 自动化部署脚本
# 使用方法: ./deploy.sh [选项]
# 选项: --init (初始化部署) --update (更新部署) --ssl (配置SSL)

set -e

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查系统要求
check_requirements() {
    log_info "检查系统要求..."
    
    # 检查Docker
    if ! command -v docker &> /dev/null; then
        log_error "Docker 未安装，请先安装 Docker"
        exit 1
    fi
    
    # 检查Docker Compose
    if ! command -v docker-compose &> /dev/null; then
        log_error "Docker Compose 未安装，请先安装 Docker Compose"
        exit 1
    fi
    
    # 检查Git
    if ! command -v git &> /dev/null; then
        log_error "Git 未安装，请先安装 Git"
        exit 1
    fi
    
    log_success "系统要求检查通过"
}

# 初始化部署
init_deployment() {
    log_info "开始初始化部署..."
    
    # 创建必要的目录
    mkdir -p nginx/ssl
    mkdir -p data/backend
    mkdir -p data/redis
    mkdir -p logs
    
    # 复制环境配置文件
    if [ ! -f .env ]; then
        cp .env.example .env
        log_warning "请编辑 .env 文件，配置你的 iFlytek API 密钥和域名"
        log_warning "配置完成后，请重新运行部署脚本"
        exit 0
    fi
    
    # 设置权限
    chmod +x deploy.sh
    chmod 600 .env
    
    log_success "初始化完成"
}

# 配置SSL证书
setup_ssl() {
    log_info "配置SSL证书..."
    
    read -p "请输入你的域名: " domain
    read -p "请输入你的邮箱: " email
    
    # 使用Let's Encrypt获取SSL证书
    docker run --rm \
        -v $(pwd)/nginx/ssl:/etc/letsencrypt \
        -v $(pwd)/nginx/webroot:/var/www/certbot \
        certbot/certbot certonly \
        --webroot \
        --webroot-path=/var/www/certbot \
        --email $email \
        --agree-tos \
        --no-eff-email \
        -d $domain
    
    # 复制证书到nginx目录
    cp nginx/ssl/live/$domain/fullchain.pem nginx/ssl/cert.pem
    cp nginx/ssl/live/$domain/privkey.pem nginx/ssl/key.pem
    
    log_success "SSL证书配置完成"
}

# 构建和启动服务
deploy_services() {
    log_info "构建和启动服务..."
    
    # 停止现有服务
    docker-compose down
    
    # 构建镜像
    log_info "构建Docker镜像..."
    docker-compose build --no-cache
    
    # 启动服务
    log_info "启动服务..."
    docker-compose up -d
    
    # 等待服务启动
    log_info "等待服务启动..."
    sleep 30
    
    # 检查服务状态
    check_services
}

# 检查服务状态
check_services() {
    log_info "检查服务状态..."
    
    services=("backend" "frontend" "redis" "nginx")
    
    for service in "${services[@]}"; do
        if docker-compose ps $service | grep -q "Up"; then
            log_success "$service 服务运行正常"
        else
            log_error "$service 服务启动失败"
            docker-compose logs $service
        fi
    done
}

# 更新部署
update_deployment() {
    log_info "更新部署..."
    
    # 拉取最新代码
    git pull origin main
    
    # 重新构建和部署
    deploy_services
    
    log_success "更新完成"
}

# 显示部署信息
show_deployment_info() {
    log_success "部署完成！"
    echo ""
    echo "========================================="
    echo "  iFlytek 多模态面试系统已成功部署"
    echo "========================================="
    echo ""
    echo "访问地址:"
    echo "  HTTP:  http://$(hostname -I | awk '{print $1}')"
    echo "  HTTPS: https://your-domain.com (如果配置了SSL)"
    echo ""
    echo "管理命令:"
    echo "  查看日志: docker-compose logs -f"
    echo "  重启服务: docker-compose restart"
    echo "  停止服务: docker-compose down"
    echo ""
    echo "监控命令:"
    echo "  服务状态: docker-compose ps"
    echo "  系统资源: docker stats"
    echo ""
}

# 主函数
main() {
    echo "========================================="
    echo "  iFlytek 多模态面试系统部署脚本"
    echo "========================================="
    echo ""
    
    case "$1" in
        --init)
            check_requirements
            init_deployment
            ;;
        --ssl)
            setup_ssl
            ;;
        --update)
            update_deployment
            ;;
        *)
            check_requirements
            init_deployment
            deploy_services
            show_deployment_info
            ;;
    esac
}

# 运行主函数
main "$@"
