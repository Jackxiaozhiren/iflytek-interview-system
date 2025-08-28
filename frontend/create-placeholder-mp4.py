#!/usr/bin/env python3
"""
创建最小的MP4视频占位符文件
解决多模态面试评估系统的视频404错误
"""

import os
import sys
from pathlib import Path

def check_ffmpeg():
    """检查FFmpeg是否可用"""
    try:
        import subprocess
        result = subprocess.run(['ffmpeg', '-version'], 
                              capture_output=True, text=True)
        return result.returncode == 0
    except FileNotFoundError:
        return False

def create_minimal_mp4_with_ffmpeg():
    """使用FFmpeg创建最小的MP4占位符"""
    videos = [
        {'name': 'demo-complete.mp4', 'duration': 8, 'title': '系统完整演示'},
        {'name': 'demo-ai-tech.mp4', 'duration': 6, 'title': 'AI技术解析'},
        {'name': 'demo-cases.mp4', 'duration': 5, 'title': '案例分析'},
        {'name': 'demo-bigdata.mp4', 'duration': 7, 'title': '大数据专题'},
        {'name': 'demo-iot.mp4', 'duration': 6, 'title': 'IoT专题'}
    ]
    
    # 确保目录存在
    os.makedirs('public/videos', exist_ok=True)
    
    print("🎬 使用FFmpeg创建MP4占位符文件...\n")
    
    for video in videos:
        output_path = f"public/videos/{video['name']}"
        
        # FFmpeg命令：创建纯色视频
        cmd = [
            'ffmpeg', '-y',  # 覆盖已存在文件
            '-f', 'lavfi',   # 使用lavfi输入
            '-i', f'color=c=0x667eea:size=1920x1080:duration={video["duration"]}:rate=30',
            '-f', 'lavfi',   # 音频输入
            '-i', f'anullsrc=channel_layout=stereo:sample_rate=48000:duration={video["duration"]}',
            '-c:v', 'libx264',  # 视频编码
            '-c:a', 'aac',      # 音频编码
            '-shortest',        # 使用最短流的长度
            output_path
        ]
        
        try:
            import subprocess
            result = subprocess.run(cmd, capture_output=True, text=True)
            if result.returncode == 0:
                print(f"✅ 创建成功: {video['name']} ({video['duration']}分钟)")
            else:
                print(f"❌ 创建失败: {video['name']}")
                print(f"错误: {result.stderr}")
        except Exception as e:
            print(f"❌ 创建失败: {video['name']} - {str(e)}")
    
    print(f"\n🎉 MP4占位符创建完成！")
    print(f"📁 文件位置: public/videos/")
    print(f"💡 这些是临时占位符，建议后续替换为真实演示视频")

def create_minimal_mp4_manual():
    """手动创建最小的MP4文件头"""
    print("⚠️ FFmpeg不可用，创建最小MP4文件头...")
    
    # 最小的MP4文件头（约100字节）
    mp4_header = bytes([
        # ftyp box
        0x00, 0x00, 0x00, 0x20,  # box size
        0x66, 0x74, 0x79, 0x70,  # 'ftyp'
        0x69, 0x73, 0x6F, 0x6D,  # major brand 'isom'
        0x00, 0x00, 0x02, 0x00,  # minor version
        0x69, 0x73, 0x6F, 0x6D,  # compatible brand 'isom'
        0x69, 0x73, 0x6F, 0x32,  # compatible brand 'iso2'
        0x61, 0x76, 0x63, 0x31,  # compatible brand 'avc1'
        0x6D, 0x70, 0x34, 0x31,  # compatible brand 'mp41'
        
        # mdat box (empty)
        0x00, 0x00, 0x00, 0x08,  # box size
        0x6D, 0x64, 0x61, 0x74,  # 'mdat'
    ])
    
    videos = [
        'demo-complete.mp4',
        'demo-ai-tech.mp4', 
        'demo-cases.mp4',
        'demo-bigdata.mp4',
        'demo-iot.mp4'
    ]
    
    os.makedirs('public/videos', exist_ok=True)
    
    for video in videos:
        output_path = f"public/videos/{video}"
        try:
            with open(output_path, 'wb') as f:
                f.write(mp4_header)
            print(f"✅ 创建最小文件: {video}")
        except Exception as e:
            print(f"❌ 创建失败: {video} - {str(e)}")
    
    print(f"\n⚠️ 注意: 这些是最小的MP4文件头，可能无法正常播放")
    print(f"💡 建议安装FFmpeg后重新运行此脚本")

def install_ffmpeg_guide():
    """显示FFmpeg安装指南"""
    print("\n📦 FFmpeg安装指南:")
    print("\n🪟 Windows:")
    print("1. 访问 https://ffmpeg.org/download.html")
    print("2. 下载Windows版本")
    print("3. 解压到C:\\ffmpeg")
    print("4. 添加C:\\ffmpeg\\bin到系统PATH")
    print("5. 重启命令行")
    
    print("\n🐧 Linux (Ubuntu/Debian):")
    print("sudo apt update && sudo apt install ffmpeg")
    
    print("\n🍎 macOS:")
    print("brew install ffmpeg")
    
    print("\n🐍 Python包管理:")
    print("pip install ffmpeg-python")

def main():
    print("🎬 多模态面试评估系统 - MP4占位符生成器\n")
    
    if check_ffmpeg():
        print("✅ 检测到FFmpeg，将创建高质量MP4占位符")
        create_minimal_mp4_with_ffmpeg()
    else:
        print("❌ 未检测到FFmpeg")
        install_ffmpeg_guide()
        
        choice = input("\n是否创建最小MP4文件头作为临时解决方案？(y/n): ")
        if choice.lower() == 'y':
            create_minimal_mp4_manual()
        else:
            print("请安装FFmpeg后重新运行此脚本")
            return
    
    print("\n🚀 下一步操作:")
    print("1. 刷新浏览器查看效果")
    print("2. 验证视频404错误是否解决")
    print("3. 后续替换为真实的演示视频")

if __name__ == "__main__":
    main()
