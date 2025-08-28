# 🎬 平台专用中文字体优化提示词指南
# Platform-Specific Chinese Font Optimization Prompt Guide

## 📋 使用说明 / Usage Instructions

本指南提供针对不同AI视频生成平台优化的中文字体渲染提示词，专门解决中文文字模糊、乱码等问题。
This guide provides Chinese font rendering prompts optimized for different AI video generation platforms, specifically addressing Chinese text blur and garbled character issues.

---

## 🚀 Runway ML 专用提示词 / Runway ML Specific Prompts

### 📝 使用方法 / Usage Method
1. 访问 https://runwayml.com
2. 选择 Gen-2 视频生成工具
3. 直接复制以下英文提示词
4. 设置对应时长和分辨率 (1920x1080)

### 🎯 视频1: demo-complete.mp4 (8分钟)
```
Professional AI interview system interface demonstration, Microsoft YaHei font rendering, crystal clear Chinese text display "iFlytek Spark Intelligent Interview Assessment System", blue-purple gradient background (#667eea to #764ba2), high-contrast white text, sharp font edges, readable Chinese buttons "Start Interview", "Multimodal Analysis", "Capability Assessment", "Generate Report", modern corporate UI design, no text blur, maximum font clarity, professional business style, 1920x1080 resolution, 8 minutes duration
```

### 🤖 视频2: demo-ai-tech.mp4 (6分钟)
```
iFlytek Spark LLM technical architecture visualization, Microsoft YaHei font rendering, crystal clear Chinese title "AI Technology Architecture", sharp technical labels "Neural Networks", "Algorithm Optimization", "Multimodal Fusion", deep blue tech background, white crisp text, professional technical diagrams, modern tech interface design, maximum text sharpness, no font blur, technical documentation quality, 6 minutes duration
```

### 📊 视频3: demo-cases.mp4 (5分钟)
```
Interview case analysis interface demonstration, Microsoft YaHei font rendering, crystal clear Chinese title "Interview Case Analysis", sharp position labels "AI Engineer", "Big Data Analyst", "IoT Developer", split-screen evaluation process, professional interview environment, enterprise-level interface design, high-contrast readable text, no font blur, business-level text presentation, 5 minutes duration
```

---

## 🎨 Pika Labs 专用提示词 / Pika Labs Specific Prompts

### 📝 使用方法 / Usage Method
1. 加入 Pika Labs Discord 服务器
2. 使用 `/create` 命令
3. 复制以下提示词格式

### 🎯 视频1: demo-complete.mp4
```
/create Professional AI interview system demo, Microsoft YaHei font, crystal clear Chinese text "iFlytek Spark System", blue-purple gradient UI, high-contrast white text, readable Chinese buttons, modern corporate design, sharp font rendering, no text blur --duration 8 minutes --aspect 16:9 --style professional
```

### 🤖 视频2: demo-ai-tech.mp4
```
/create iFlytek Spark LLM technical architecture, Microsoft YaHei font, clear Chinese tech labels "Neural Networks", "Algorithm Optimization", deep blue background, white sharp text, professional tech visualization, maximum text clarity --duration 6 minutes --aspect 16:9 --style technical
```

### 📊 视频3: demo-cases.mp4
```
/create Interview case analysis demo, Microsoft YaHei font, clear Chinese labels "AI Engineer", "Big Data Analyst", "IoT Developer", split-screen evaluation, professional setting, sharp text rendering, high contrast --duration 5 minutes --aspect 16:9 --style corporate
```

---

## 🎪 Stable Video Diffusion 专用提示词 / Stable Video Specific Prompts

### 📝 使用方法 / Usage Method
1. 部署 Stable Video Diffusion 环境
2. 使用以下提示词配置
3. 设置中文字体渲染参数

### 🎯 视频1: demo-complete.mp4
```
high-quality professional AI interview system interface, Microsoft YaHei font rendering, crystal clear Chinese text display, iFlytek Spark LLM branding, multimodal input visualization, six capability assessment dashboard, blue-purple gradient design (#667eea to #764ba2), high-contrast white Chinese text, clean corporate aesthetic, sharp text edges, no font blur, maximum text clarity, photorealistic, 1920x1080
```

### 🤖 视频2: demo-ai-tech.mp4
```
technical AI architecture diagrams, Microsoft YaHei font rendering, iFlytek Spark LLM neural network visualization, crystal clear Chinese technical annotations, multimodal fusion algorithms, professional technical presentation, high-contrast white text on deep blue gradient, clean technical aesthetic, sharp font rendering, maximum text sharpness
```

---

## 🇨🇳 国产AI平台专用提示词 / Chinese AI Platform Specific Prompts

### 🎯 即梦AI (JiMeng AI) 专用
```
专业AI面试系统界面演示，使用微软雅黑字体清晰显示所有中文文字，确保"科大讯飞Spark智能面试评估系统"标题文字清晰锐利，蓝紫色渐变背景，高对比度白色文字，包含"开始面试""多模态分析""能力评估""生成报告"等清晰可读的中文按钮，现代企业UI设计，所有文字边缘清晰，无模糊或乱码现象，字体渲染质量最高，专业商务风格，1920x1080分辨率，8分钟时长
```

### 🎯 文心一格 (ERNIE-ViLG) 专用
```
iFlytek Spark大语言模型技术架构展示界面，微软雅黑字体清晰显示"AI技术架构"中文标题，包含"神经网络""算法优化""多模态融合"等高对比度技术标签，深蓝色科技背景，白色清晰文字，确保所有中文技术术语清晰可读，专业技术图表展示，现代科技界面设计，字体边缘锐利清晰，技术文档级别的文字质量
```

---

## ⚙️ 通用字体渲染参数 / Universal Font Rendering Parameters

### 🔧 推荐设置 / Recommended Settings
```json
{
  "font_family": "Microsoft YaHei, SimHei, PingFang SC",
  "font_weight": "medium",
  "text_contrast": "high",
  "font_rendering": "crisp_edges",
  "anti_aliasing": "subpixel",
  "text_sharpness": "maximum",
  "encoding": "UTF-8",
  "resolution": "1920x1080",
  "aspect_ratio": "16:9"
}
```

### 🎨 颜色对比度建议 / Color Contrast Recommendations
- **高对比度白字**: `color: #FFFFFF, background: #1a1a2e` (对比度 15.8:1)
- **高对比度黑字**: `color: #000000, background: #f8f9fa` (对比度 19.6:1)
- **蓝紫渐变背景**: `background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)`

---

## 🔍 质量检查清单 / Quality Verification Checklist

### ✅ 文字质量检查 / Text Quality Check
- [ ] 中文字符清晰可读 / Chinese characters are clearly readable
- [ ] 字体边缘锐利清晰 / Font edges are sharp and crisp  
- [ ] 文字对比度充足 / Text contrast is sufficient
- [ ] 无乱码或损坏字符 / No garbled or corrupted characters
- [ ] 字体大小适合视频分辨率 / Font size is appropriate for video resolution
- [ ] 文字对齐和间距专业 / Text alignment and spacing look professional

### 🎯 技术指标要求 / Technical Requirements
- **分辨率**: 1920x1080 (Full HD)
- **帧率**: 30fps
- **编码**: H.264
- **字体**: Microsoft YaHei (主要) / SimHei (备用)
- **对比度**: 最小 7:1 (WCAG AA标准)
- **文字清晰度**: 最高级别

---

## 🚨 常见问题解决 / Troubleshooting Common Issues

### ❌ 问题1: 中文文字模糊
**原因**: 提示词中未指定中文字体
**解决方案**: 在提示词中明确添加 "Microsoft YaHei font" 或 "SimHei font"

### ❌ 问题2: 字符乱码
**原因**: 编码或字体兼容性问题  
**解决方案**: 指定 UTF-8 编码，使用广泛支持的中文字体

### ❌ 问题3: 文字对比度低
**原因**: 生成视频中颜色对比度不足
**解决方案**: 在提示词中强调 "high-contrast white text" 或 "high-contrast black text"

### ❌ 问题4: 字体像素化
**原因**: 分辨率低或字体渲染质量差
**解决方案**: 要求 "sharp font rendering", "crisp text edges"，并指定 1920x1080 分辨率

---

## 📞 技术支持 / Technical Support

如果遇到字体渲染问题，请检查：
1. 提示词是否包含明确的中文字体指定
2. 是否设置了足够的文字对比度
3. 视频分辨率是否为 1920x1080
4. 是否使用了平台推荐的提示词格式

For font rendering issues, please check:
1. Whether prompts include explicit Chinese font specifications
2. Whether sufficient text contrast is set
3. Whether video resolution is 1920x1080  
4. Whether platform-recommended prompt formats are used
