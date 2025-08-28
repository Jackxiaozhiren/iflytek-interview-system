#!/usr/bin/env python3
"""
多模态面试评估系统后端服务器启动脚本
"""

import sys
import os
import uvicorn

# 添加项目根目录到Python路径
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)  # 上级目录
sys.path.insert(0, current_dir)
sys.path.insert(0, project_root)

# 设置环境变量
os.environ["PYTHONPATH"] = f"{current_dir}{os.pathsep}{project_root}"

if __name__ == "__main__":
    print("🚀 启动多模态面试评估系统后端服务器...")
    print(f"📁 项目目录: {current_dir}")
    print(f"🐍 Python路径: {sys.path[0]}")
    
    try:
        # 导入主应用
        from app.main import app
        
        # 启动服务器
        uvicorn.run(
            app,
            host="0.0.0.0",
            port=8000,
            reload=True,
            log_level="info"
        )
    except Exception as e:
        print(f"❌ 启动失败: {e}")
        sys.exit(1)
