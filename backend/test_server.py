#!/usr/bin/env python3
"""
测试服务器 - 最小化版本
"""

import sys
import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

# 添加当前目录到Python路径
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

# 创建FastAPI应用
app = FastAPI(
    title="多模态智能面试评测系统",
    description="基于iFlytek Spark大模型的智能面试评估平台",
    version="2.0.0"
)

# 添加CORS中间件
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "多模态面试评估系统后端服务正在运行", "status": "ok"}

@app.get("/api/health")
async def health_check():
    return {"status": "healthy", "message": "服务运行正常"}

@app.get("/api/domains")
async def get_domains():
    return {
        "domains": [
            {"id": "ai", "name": "人工智能", "description": "AI技术相关面试"},
            {"id": "bigdata", "name": "大数据", "description": "大数据技术相关面试"},
            {"id": "iot", "name": "物联网", "description": "IoT技术相关面试"},
            {"id": "blockchain", "name": "区块链", "description": "区块链技术相关面试"}
        ]
    }

if __name__ == "__main__":
    print("🚀 启动测试后端服务器...")
    print(f"📁 当前目录: {current_dir}")
    
    try:
        # 启动服务器
        uvicorn.run(
            "test_server:app",
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except Exception as e:
        print(f"❌ 启动失败: {e}")
        import traceback
        traceback.print_exc()
        sys.exit(1)
