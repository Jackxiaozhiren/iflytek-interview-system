#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
iFlytek 职位管理系统简单HTTP服务器
用于在开发服务器无法启动时提供静态文件服务
"""

import http.server
import socketserver
import os
import sys
import webbrowser
import threading
import time

class CustomHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=os.getcwd(), **kwargs)
    
    def end_headers(self):
        # 添加CORS头部，允许跨域访问
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        super().end_headers()
    
    def log_message(self, format, *args):
        # 自定义日志格式
        print(f"[{time.strftime('%Y-%m-%d %H:%M:%S')}] {format % args}")

def open_browser(url, delay=2):
    """延迟打开浏览器"""
    time.sleep(delay)
    try:
        webbrowser.open(url)
        print(f"已在浏览器中打开: {url}")
    except Exception as e:
        print(f"无法自动打开浏览器: {e}")
        print(f"请手动在浏览器中访问: {url}")

def main():
    # 设置端口
    PORT = 8080
    
    print("=" * 50)
    print("iFlytek 职位管理系统 - 简单HTTP服务器")
    print("=" * 50)
    print()
    
    # 检查当前目录
    current_dir = os.getcwd()
    print(f"当前目录: {current_dir}")
    
    # 检查重要文件
    important_files = [
        'ui-fixes-demo.html',
        'test-ui-fixes.html', 
        'package.json'
    ]
    
    print("\n检查重要文件:")
    for file in important_files:
        if os.path.exists(file):
            print(f"  ✅ {file}")
        else:
            print(f"  ❌ {file} (未找到)")
    
    print(f"\n正在启动HTTP服务器，端口: {PORT}")
    
    try:
        # 创建服务器
        with socketserver.TCPServer(("", PORT), CustomHTTPRequestHandler) as httpd:
            server_url = f"http://localhost:{PORT}"
            
            print(f"服务器已启动: {server_url}")
            print("\n可访问的页面:")
            print(f"  📋 修复演示: {server_url}/ui-fixes-demo.html")
            print(f"  🧪 测试报告: {server_url}/test-ui-fixes.html")
            print(f"  🏠 主页面: {server_url}/index.html")
            print(f"  📁 文件列表: {server_url}/")
            print()
            print("按 Ctrl+C 停止服务器")
            print("=" * 50)
            
            # 在新线程中延迟打开浏览器
            browser_thread = threading.Thread(
                target=open_browser, 
                args=(f"{server_url}/ui-fixes-demo.html",)
            )
            browser_thread.daemon = True
            browser_thread.start()
            
            # 启动服务器
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n\n服务器已停止")
    except OSError as e:
        if "Address already in use" in str(e):
            print(f"\n错误: 端口 {PORT} 已被占用")
            print("请尝试以下解决方案:")
            print("1. 关闭占用端口的程序")
            print("2. 使用其他端口: python simple_server.py --port 8081")
            print("3. 直接双击打开 ui-fixes-demo.html 文件")
        else:
            print(f"\n启动服务器时出错: {e}")
    except Exception as e:
        print(f"\n未知错误: {e}")

if __name__ == "__main__":
    # 检查命令行参数
    if len(sys.argv) > 1 and sys.argv[1] == "--help":
        print("用法:")
        print("  python simple_server.py          # 使用默认端口8080")
        print("  python simple_server.py --port 8081  # 使用指定端口")
        sys.exit(0)
    
    main()
