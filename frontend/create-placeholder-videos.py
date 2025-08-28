#!/usr/bin/env python3
"""
创建多模态面试评估系统演示视频占位符
使用Python + moviepy生成简单的演示视频
"""

import os
import sys
from pathlib import Path

def check_dependencies():
    """检查依赖包"""
    try:
        import moviepy.editor as mp
        import numpy as np
        return True
    except ImportError:
        print("❌ 缺少依赖包，请安装:")
        print("pip install moviepy numpy")
        return False

def create_demo_video(filename, title, duration, content_points):
    """创建演示视频占位符"""
    try:
        import moviepy.editor as mp
        import numpy as np
        
        # 视频参数
        width, height = 1920, 1080
        fps = 30
        
        # 创建背景渐变
        def make_frame(t):
            # 创建渐变背景
            gradient = np.zeros((height, width, 3), dtype=np.uint8)
            for i in range(height):
                ratio = i / height
                # 蓝紫渐变 (#667eea → #764ba2)
                r = int(102 + (118 - 102) * ratio)
                g = int(126 + (75 - 126) * ratio)
                b = int(234 + (162 - 234) * ratio)
                gradient[i, :] = [r, g, b]
            return gradient
        
        # 创建背景视频
        background = mp.VideoClip(make_frame, duration=duration)
        
        # 创建标题文本
        title_clip = mp.TextClip(
            title,
            fontsize=60,
            color='white',
            font='Arial-Bold'
        ).set_position('center').set_duration(duration)
        
        # 创建副标题
        subtitle = "多模态面试评估系统演示"
        subtitle_clip = mp.TextClip(
            subtitle,
            fontsize=30,
            color='white',
            font='Arial'
        ).set_position(('center', height*0.6)).set_duration(duration)
        
        # 创建内容要点文本
        content_text = "\n".join([f"• {point}" for point in content_points])
        content_clip = mp.TextClip(
            content_text,
            fontsize=24,
            color='white',
            font='Arial',
            method='caption',
            size=(width*0.8, None)
        ).set_position('center').set_duration(duration).set_start(2)
        
        # 合成视频
        final_video = mp.CompositeVideoClip([
            background,
            title_clip,
            subtitle_clip,
            content_clip
        ])
        
        # 输出路径
        output_path = f"public/videos/{filename}"
        
        # 导出视频
        final_video.write_videofile(
            output_path,
            fps=fps,
            codec='libx264',
            audio_codec='aac'
        )
        
        print(f"✅ 创建视频: {filename}")
        return True
        
    except Exception as e:
        print(f"❌ 创建视频失败 {filename}: {str(e)}")
        return False

def main():
    """主函数"""
    print("🎬 创建多模态面试评估系统演示视频占位符\n")
    
    # 检查依赖
    if not check_dependencies():
        return
    
    # 确保目录存在
    os.makedirs("public/videos", exist_ok=True)
    
    # 视频配置
    videos = [
        {
            "filename": "demo-complete.mp4",
            "title": "系统完整演示",
            "duration": 8,
            "content": [
                "系统介绍与核心功能展示",
                "iFlytek Spark LLM技术亮点",
                "多模态输入演示 (语音/视频/文本)",
                "六维能力评估过程",
                "智能分析报告生成"
            ]
        },
        {
            "filename": "demo-ai-tech.mp4",
            "title": "AI技术深度解析",
            "duration": 6,
            "content": [
                "iFlytek Spark大模型技术特点",
                "多模态融合技术原理",
                "六维能力评估算法详解",
                "AI技术在面试中的应用场景"
            ]
        },
        {
            "filename": "demo-cases.mp4",
            "title": "实际案例分析",
            "duration": 5,
            "content": [
                "AI领域面试案例分析",
                "大数据技术面试案例",
                "物联网领域面试案例",
                "评估结果准确性验证"
            ]
        },
        {
            "filename": "demo-bigdata.mp4",
            "title": "大数据技术专题",
            "duration": 7,
            "content": [
                "数据处理能力评估",
                "机器学习算法理解测试",
                "实战项目案例分析",
                "大数据技术栈评估"
            ]
        },
        {
            "filename": "demo-iot.mp4",
            "title": "物联网技术深度",
            "duration": 6,
            "content": [
                "嵌入式系统与硬件知识",
                "IoT通信协议理解",
                "物联网系统集成能力",
                "传感器技术应用"
            ]
        }
    ]
    
    # 创建视频
    success_count = 0
    for video in videos:
        if create_demo_video(
            video["filename"],
            video["title"],
            video["duration"],
            video["content"]
        ):
            success_count += 1
    
    print(f"\n🎉 完成! 成功创建 {success_count}/{len(videos)} 个视频")
    print("\n📁 视频文件位置: public/videos/")
    print("💡 这些是占位符视频，建议后续替换为真实的演示内容")

if __name__ == "__main__":
    main()
