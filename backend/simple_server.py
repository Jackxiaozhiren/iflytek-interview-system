#!/usr/bin/env python3
"""
简单的测试服务器 - 用于解决前端API连接问题
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn

# 创建FastAPI应用
app = FastAPI(
    title="多模态面试评估系统 - 测试服务器",
    description="临时测试服务器，提供基本API响应",
    version="1.0.0"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 模拟技术领域数据
MOCK_DOMAINS = [
    {
        "id": 1,
        "name": "AI技术",
        "description": "人工智能技术领域",
        "color": "#0066cc",
        "positions": [
            {"id": 1, "name": "AI算法工程师", "level": "高级"},
            {"id": 2, "name": "机器学习工程师", "level": "中级"},
            {"id": 3, "name": "深度学习研究员", "level": "专家"}
        ]
    },
    {
        "id": 2,
        "name": "大数据",
        "description": "大数据处理与分析",
        "color": "#059669",
        "positions": [
            {"id": 4, "name": "大数据工程师", "level": "高级"},
            {"id": 5, "name": "数据分析师", "level": "中级"},
            {"id": 6, "name": "数据科学家", "level": "专家"}
        ]
    },
    {
        "id": 3,
        "name": "IoT物联网",
        "description": "物联网技术与应用",
        "color": "#ea580c",
        "positions": [
            {"id": 7, "name": "IoT开发工程师", "level": "高级"},
            {"id": 8, "name": "嵌入式工程师", "level": "中级"},
            {"id": 9, "name": "物联网架构师", "level": "专家"}
        ]
    }
]

@app.get("/")
async def root():
    return {
        "message": "多模态面试评估系统后端服务器运行中",
        "status": "running",
        "version": "1.0.0"
    }

@app.get("/api/v1/domains")
async def get_domains():
    """获取技术领域列表"""
    return {
        "success": True,
        "data": MOCK_DOMAINS,
        "message": "获取技术领域成功"
    }

@app.get("/api/v1/domains/{domain_id}/positions")
async def get_positions(domain_id: int):
    """获取指定领域的职位列表"""
    domain = next((d for d in MOCK_DOMAINS if d["id"] == domain_id), None)
    if not domain:
        return JSONResponse(
            status_code=404,
            content={"success": False, "message": "技术领域不存在"}
        )
    
    return {
        "success": True,
        "data": domain["positions"],
        "message": f"获取{domain['name']}职位列表成功"
    }

@app.post("/api/v1/interview/start")
async def start_interview():
    """开始面试"""
    return {
        "success": True,
        "data": {
            "session_id": "test_session_001",
            "status": "started",
            "timestamp": "2024-01-01T10:00:00Z"
        },
        "message": "面试已开始"
    }

@app.get("/api/v1/health")
async def health_check():
    """健康检查"""
    return {
        "status": "healthy",
        "timestamp": "2024-01-01T10:00:00Z",
        "services": {
            "database": "connected",
            "ai_service": "available",
            "file_storage": "ready"
        }
    }

@app.get("/api/v1/system/status")
async def system_status():
    """系统状态"""
    return {
        "success": True,
        "data": {
            "server_status": "running",
            "database_status": "connected",
            "ai_service_status": "available",
            "active_sessions": 0,
            "total_interviews": 1247,
            "system_load": "normal"
        },
        "message": "系统运行正常"
    }

if __name__ == "__main__":
    print("🚀 启动简单测试服务器...")
    print("📡 服务器地址: http://localhost:8000")
    print("📋 API文档: http://localhost:8000/docs")
    print("🔍 健康检查: http://localhost:8000/api/v1/health")
    
    uvicorn.run(
        "simple_server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
