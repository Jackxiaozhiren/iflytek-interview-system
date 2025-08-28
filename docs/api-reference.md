# 📚 API 参考文档

本文档详细介绍了 iFlytek 多模态智能面试评测系统的 API 接口。

## 📋 目录

- [🌐 基础信息](#-基础信息)
- [🔐 认证方式](#-认证方式)
- [📊 面试管理 API](#-面试管理-api)
- [🤖 AI 分析 API](#-ai-分析-api)
- [📈 评估报告 API](#-评估报告-api)
- [🎯 学习路径 API](#-学习路径-api)
- [🔍 系统监控 API](#-系统监控-api)

## 🌐 基础信息

### 服务地址
- **开发环境**：`http://localhost:8000`
- **生产环境**：`https://your-domain.com`
- **在线演示**：`https://iflytek-interview-system.onrender.com`

### 通用响应格式
```json
{
  "code": 200,
  "message": "success",
  "data": {},
  "timestamp": "2025-01-01T00:00:00Z"
}
```

### 错误响应格式
```json
{
  "code": 400,
  "message": "参数错误",
  "error": "详细错误信息",
  "timestamp": "2025-01-01T00:00:00Z"
}
```

### HTTP 状态码
| 状态码 | 说明 |
|--------|------|
| 200 | 请求成功 |
| 201 | 创建成功 |
| 400 | 请求参数错误 |
| 401 | 未授权 |
| 403 | 禁止访问 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

## 🔐 认证方式

### API Key 认证
```http
Authorization: Bearer your-api-key
```

### 获取 API Key
```http
POST /api/v1/auth/token
Content-Type: application/json

{
  "username": "your-username",
  "password": "your-password"
}
```

## 📊 面试管理 API

### 获取技术领域列表
```http
GET /api/v1/domains
```

**响应示例：**
```json
{
  "code": 200,
  "data": [
    {
      "id": "ai",
      "name": "人工智能",
      "description": "机器学习、深度学习、计算机视觉",
      "positions": ["AI工程师", "算法工程师", "机器学习工程师"]
    },
    {
      "id": "bigdata",
      "name": "大数据",
      "description": "数据分析、数据挖掘、大数据架构",
      "positions": ["数据工程师", "数据分析师", "大数据架构师"]
    }
  ]
}
```

### 开始面试
```http
POST /api/v1/interview/start
Content-Type: application/json

{
  "domain": "ai",
  "position": "AI工程师",
  "difficulty": "中级",
  "candidate_info": {
    "name": "张三",
    "experience": "2年",
    "education": "本科"
  }
}
```

**响应示例：**
```json
{
  "code": 200,
  "data": {
    "session_id": "sess_123456789",
    "question": {
      "id": "q_001",
      "content": "请介绍一下机器学习的基本概念",
      "type": "开放性问题",
      "difficulty": "中级",
      "expected_duration": 300
    },
    "progress": {
      "current": 1,
      "total": 10
    }
  }
}
```

### 继续面试
```http
POST /api/v1/interview/next
Content-Type: application/json

{
  "session_id": "sess_123456789",
  "answer": {
    "text": "机器学习是人工智能的一个分支...",
    "audio_url": "https://example.com/audio.wav",
    "video_url": "https://example.com/video.mp4"
  }
}
```

### 结束面试
```http
POST /api/v1/interview/end
Content-Type: application/json

{
  "session_id": "sess_123456789"
}
```

## 🤖 AI 分析 API

### 多模态分析
```http
POST /api/v1/multimodal/analyze
Content-Type: application/json

{
  "session_id": "sess_123456789",
  "question_id": "q_001",
  "text_content": "机器学习是人工智能的一个分支...",
  "audio_path": "/uploads/audio_123.wav",
  "video_path": "/uploads/video_123.mp4",
  "context": {
    "domain": "ai",
    "position": "AI工程师",
    "difficulty": "中级"
  }
}
```

**响应示例：**
```json
{
  "code": 200,
  "data": {
    "analysis_id": "ana_123456789",
    "text_analysis": {
      "technical_keywords": ["机器学习", "人工智能", "算法"],
      "keyword_accuracy": 0.85,
      "logical_structure": 0.78,
      "expression_clarity": 0.82
    },
    "audio_analysis": {
      "speech_rate": 150,
      "volume_stability": 0.75,
      "emotion_stability": 0.80,
      "fluency_score": 0.77
    },
    "video_analysis": {
      "attention_level": 0.85,
      "emotion_distribution": {
        "confident": 0.6,
        "neutral": 0.3,
        "nervous": 0.1
      },
      "eye_contact_ratio": 0.72
    },
    "overall_score": 0.81
  }
}
```

### 获取分析结果
```http
GET /api/v1/multimodal/analysis/{analysis_id}
```

## 📈 评估报告 API

### 获取评估结果
```http
GET /api/v1/assessment/{session_id}
```

**响应示例：**
```json
{
  "code": 200,
  "data": {
    "session_id": "sess_123456789",
    "candidate_info": {
      "name": "张三",
      "domain": "人工智能",
      "position": "AI工程师"
    },
    "capability_scores": {
      "professional_knowledge": 85,
      "skill_matching": 78,
      "language_expression": 82,
      "logical_thinking": 80,
      "innovation_ability": 75,
      "stress_resistance": 88
    },
    "overall_score": 81,
    "grade": "良好",
    "strengths": [
      "专业知识扎实",
      "应变能力强",
      "表达清晰"
    ],
    "improvements": [
      "可以加强创新思维的培养",
      "技能匹配度有待提升"
    ],
    "detailed_analysis": {
      "question_performance": [
        {
          "question_id": "q_001",
          "score": 85,
          "feedback": "回答准确，逻辑清晰"
        }
      ]
    }
  }
}
```

### 生成报告
```http
POST /api/v1/assessment/report
Content-Type: application/json

{
  "session_id": "sess_123456789",
  "format": "pdf",
  "language": "zh-CN"
}
```

### 导出报告
```http
GET /api/v1/assessment/export/{session_id}?format=pdf
```

## 🎯 学习路径 API

### 生成学习路径
```http
POST /api/v1/learning-paths/generate
Content-Type: application/json

{
  "session_id": "sess_123456789",
  "target_position": "高级AI工程师",
  "learning_preferences": {
    "style": "实践导向",
    "duration": "3个月",
    "intensity": "中等"
  }
}
```

**响应示例：**
```json
{
  "code": 200,
  "data": {
    "path_id": "path_123456789",
    "title": "AI工程师进阶学习路径",
    "duration": "3个月",
    "modules": [
      {
        "id": "module_001",
        "title": "深度学习基础",
        "description": "掌握神经网络基本原理",
        "duration": "4周",
        "difficulty": "中级",
        "resources": [
          {
            "type": "视频课程",
            "title": "深度学习入门",
            "url": "https://example.com/course1",
            "duration": "10小时"
          },
          {
            "type": "实践项目",
            "title": "图像分类项目",
            "url": "https://github.com/example/project1",
            "difficulty": "中级"
          }
        ]
      }
    ],
    "milestones": [
      {
        "week": 4,
        "title": "完成深度学习基础",
        "requirements": ["理论考试通过", "项目实践完成"]
      }
    ]
  }
}
```

### 获取学习路径
```http
GET /api/v1/learning-paths/{path_id}
```

### 更新学习进度
```http
PUT /api/v1/learning-paths/{path_id}/progress
Content-Type: application/json

{
  "module_id": "module_001",
  "progress": 75,
  "completed_resources": ["resource_001", "resource_002"]
}
```

## 🔍 系统监控 API

### 健康检查
```http
GET /health
```

**响应示例：**
```json
{
  "status": "healthy",
  "timestamp": "2025-01-01T00:00:00Z",
  "version": "1.0.0"
}
```

### 详细健康检查
```http
GET /api/v1/health
```

**响应示例：**
```json
{
  "status": "healthy",
  "services": {
    "database": "healthy",
    "redis": "healthy",
    "iflytek_api": "healthy"
  },
  "metrics": {
    "uptime": 86400,
    "memory_usage": "45%",
    "cpu_usage": "12%"
  }
}
```

### 系统统计
```http
GET /api/v1/system/stats
```

### 性能指标
```http
GET /api/v1/system/performance
```

## 📝 请求示例

### cURL 示例
```bash
# 开始面试
curl -X POST "http://localhost:8000/api/v1/interview/start" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer your-api-key" \
  -d '{
    "domain": "ai",
    "position": "AI工程师",
    "difficulty": "中级"
  }'
```

### JavaScript 示例
```javascript
// 使用 fetch API
const response = await fetch('/api/v1/interview/start', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-api-key'
  },
  body: JSON.stringify({
    domain: 'ai',
    position: 'AI工程师',
    difficulty: '中级'
  })
});

const data = await response.json();
console.log(data);
```

### Python 示例
```python
import requests

url = "http://localhost:8000/api/v1/interview/start"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer your-api-key"
}
data = {
    "domain": "ai",
    "position": "AI工程师",
    "difficulty": "中级"
}

response = requests.post(url, json=data, headers=headers)
result = response.json()
print(result)
```

## 🚨 错误处理

### 常见错误码
| 错误码 | 说明 | 解决方案 |
|--------|------|----------|
| 1001 | 参数缺失 | 检查必需参数 |
| 1002 | 参数格式错误 | 验证参数格式 |
| 2001 | 会话不存在 | 检查 session_id |
| 2002 | 会话已过期 | 重新开始面试 |
| 3001 | AI 服务异常 | 稍后重试 |
| 3002 | 分析超时 | 减少数据量或重试 |

### 错误处理最佳实践
```javascript
try {
  const response = await fetch('/api/v1/interview/start', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestData)
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (data.code !== 200) {
    throw new Error(data.message);
  }
  
  return data.data;
} catch (error) {
  console.error('API 调用失败:', error);
  // 处理错误逻辑
}
```

## 📞 技术支持

如果在使用 API 过程中遇到问题：

- 📖 **在线文档**：[API 文档](https://your-domain.com/docs)
- 🐛 **问题反馈**：[GitHub Issues](https://github.com/Jackxiaozhiren/iflytek-interview-system/issues)
- 💬 **技术讨论**：[GitHub Discussions](https://github.com/Jackxiaozhiren/iflytek-interview-system/discussions)
- 📧 **邮件支持**：[api-support@example.com](mailto:api-support@example.com)

---

**API 文档持续更新中，欢迎反馈建议！** 📚
