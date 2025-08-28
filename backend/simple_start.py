#!/usr/bin/env python3
"""
简单的服务器启动脚本
"""

import sys
import os
import uvicorn

# 添加当前目录到Python路径
current_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, current_dir)

# 设置环境变量
os.environ["PYTHONPATH"] = current_dir

if __name__ == "__main__":
    print("🚀 启动简单后端服务器...")
    print(f"📁 当前目录: {current_dir}")
    
    try:
        # 直接导入应用
        from app.main import app
        
        # 启动服务器
        uvicorn.run(
            "app.main:app",
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
