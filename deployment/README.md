# 🚀 iFlytek 多模态面试系统 - 云服务器部署

## 📋 快速部署（10分钟搞定）

### 1️⃣ 购买云服务器
- **推荐配置**：2核4GB，Ubuntu 20.04
- **云服务商**：阿里云/腾讯云/华为云
- **开放端口**：80、443、22

### 2️⃣ 上传项目文件
```bash
# 将整个 deployment 文件夹上传到服务器
scp -r deployment/ root@your-server-ip:/root/
```

### 3️⃣ 连接服务器并部署
```bash
# SSH连接服务器
ssh root@your-server-ip

# 进入部署目录
cd deployment

# 一键部署
chmod +x quick-deploy.sh
./quick-deploy.sh
```

### 4️⃣ 配置iFlytek API
```bash
# 编辑配置文件
nano .env

# 修改以下内容：
IFLYTEK_APP_ID=你的APP_ID
IFLYTEK_API_KEY=你的API_KEY
IFLYTEK_API_SECRET=你的API_SECRET
DOMAIN_NAME=你的服务器IP

# 重启服务
docker-compose restart
```

### 5️⃣ 访问系统
- **访问地址**：http://你的服务器IP
- **完成！** 🎉

## 📁 文件说明

```
deployment/
├── docker-compose.yml      # Docker编排配置
├── .env.example           # 环境变量模板
├── quick-deploy.sh        # 一键部署脚本
├── deploy.sh             # 完整部署脚本
├── backend/
│   └── Dockerfile        # 后端容器配置
├── frontend/
│   ├── Dockerfile        # 前端容器配置
│   └── nginx.conf        # Nginx配置
└── nginx/
    └── nginx.conf        # 反向代理配置
```

## 🔧 管理命令

```bash
# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f

# 重启服务
docker-compose restart

# 停止服务
docker-compose down

# 更新部署
./deploy.sh --update
```

## 🌐 域名配置（可选）

如果你有域名，可以：

1. **配置DNS解析**：将域名指向服务器IP
2. **配置SSL证书**：运行 `./deploy.sh --ssl`
3. **更新配置**：修改 `.env` 中的 `DOMAIN_NAME`

## ❓ 常见问题

**Q: 部署失败怎么办？**
A: 查看日志 `docker-compose logs`，检查端口是否被占用

**Q: 如何更新系统？**
A: 运行 `./deploy.sh --update`

**Q: 如何备份数据？**
A: 数据存储在 `data/` 目录，定期备份即可

**Q: 系统要求是什么？**
A: 最低2核4GB内存，推荐4核8GB

---

## 🎯 部署成功标志

当你看到以下信息时，说明部署成功：

```
========================================
          部署完成！
========================================
访问地址: http://your-server-ip
```

现在别人就可以通过网址直接访问你的多模态面试系统了！ 🚀
