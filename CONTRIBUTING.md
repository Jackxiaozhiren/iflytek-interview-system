# 🤝 贡献指南

感谢您对 iFlytek 多模态智能面试评测系统的关注！我们欢迎所有形式的贡献，包括但不限于：

- 🐛 Bug 报告
- 💡 功能建议
- 📝 文档改进
- 🔧 代码贡献
- 🎨 UI/UX 优化
- 🌐 国际化支持

## 📋 贡献流程

### 1. 准备工作

#### Fork 项目
1. 访问 [项目主页](https://github.com/Jackxiaozhiren/iflytek-interview-system)
2. 点击右上角的 "Fork" 按钮
3. 克隆你的 Fork 到本地：
```bash
git clone https://github.com/YOUR_USERNAME/iflytek-interview-system.git
cd iflytek-interview-system
```

#### 设置开发环境
```bash
# 添加上游仓库
git remote add upstream https://github.com/Jackxiaozhiren/iflytek-interview-system.git

# 安装依赖
python start_system.py  # 一键安装所有依赖
```

### 2. 开发流程

#### 创建分支
```bash
# 从主分支创建新的功能分支
git checkout -b feature/your-feature-name

# 或者修复分支
git checkout -b fix/your-fix-name
```

#### 分支命名规范
- `feature/功能名称` - 新功能开发
- `fix/问题描述` - Bug 修复
- `docs/文档类型` - 文档更新
- `style/样式描述` - 样式调整
- `refactor/重构描述` - 代码重构
- `test/测试描述` - 测试相关

#### 代码开发
1. **遵循代码规范**：
   - 前端：ESLint + Prettier
   - 后端：Black + isort + flake8
   
2. **编写测试**：
   - 新功能必须包含单元测试
   - Bug 修复需要添加回归测试

3. **提交规范**：
```bash
# 提交格式
git commit -m "type(scope): description"

# 示例
git commit -m "feat(interview): add voice recognition feature"
git commit -m "fix(api): resolve authentication issue"
git commit -m "docs(readme): update installation guide"
```

### 3. 提交 Pull Request

#### 提交前检查
```bash
# 运行测试
npm run test          # 前端测试
pytest tests/         # 后端测试

# 代码格式检查
npm run lint          # 前端代码检查
black backend/        # 后端代码格式化
```

#### 创建 Pull Request
1. 推送分支到你的 Fork：
```bash
git push origin feature/your-feature-name
```

2. 在 GitHub 上创建 Pull Request
3. 填写 PR 模板中的所有必要信息
4. 等待代码审查

## 🐛 Bug 报告

### 报告 Bug 前请检查：
- [ ] 搜索现有的 Issues，确认问题未被报告
- [ ] 使用最新版本的代码
- [ ] 问题可以稳定复现

### Bug 报告模板：
```markdown
**Bug 描述**
简洁清晰地描述这个 bug。

**复现步骤**
1. 进入 '...'
2. 点击 '....'
3. 滚动到 '....'
4. 看到错误

**期望行为**
描述你期望发生什么。

**实际行为**
描述实际发生了什么。

**截图**
如果适用，添加截图来帮助解释你的问题。

**环境信息**
- OS: [e.g. Windows 10, macOS 12.0]
- Browser: [e.g. Chrome 95, Firefox 94]
- Node.js: [e.g. 16.14.0]
- Python: [e.g. 3.9.7]

**附加信息**
添加任何其他关于问题的信息。
```

## 💡 功能建议

### 建议新功能前请考虑：
- [ ] 功能是否符合项目目标
- [ ] 是否有其他用户需要此功能
- [ ] 功能的实现复杂度

### 功能建议模板：
```markdown
**功能描述**
简洁清晰地描述你想要的功能。

**问题背景**
描述这个功能要解决什么问题。

**解决方案**
描述你希望如何实现这个功能。

**替代方案**
描述你考虑过的其他解决方案。

**附加信息**
添加任何其他关于功能建议的信息。
```

## 📝 代码规范

### 前端代码规范

#### Vue.js 组件
```javascript
// 使用 Composition API
<script setup>
import { ref, reactive, computed, onMounted } from 'vue'

// 响应式数据
const count = ref(0)
const state = reactive({
  name: '',
  email: ''
})

// 计算属性
const doubleCount = computed(() => count.value * 2)

// 生命周期
onMounted(() => {
  console.log('Component mounted')
})
</script>

<template>
  <div class="component-wrapper">
    <!-- 使用语义化的 HTML -->
    <h1>{{ title }}</h1>
    <p>{{ description }}</p>
  </div>
</template>

<style scoped>
/* 使用 scoped 样式 */
.component-wrapper {
  padding: 16px;
}
</style>
```

#### CSS 规范
```css
/* 使用 BEM 命名规范 */
.interview-card {
  /* 块 */
}

.interview-card__title {
  /* 元素 */
}

.interview-card--active {
  /* 修饰符 */
}

/* 使用 CSS 变量 */
:root {
  --primary-color: #1890ff;
  --text-color: #262626;
}
```

### 后端代码规范

#### Python 代码
```python
"""模块文档字符串"""

from typing import List, Optional
from fastapi import FastAPI, HTTPException
from pydantic import BaseModel


class InterviewRequest(BaseModel):
    """请求模型文档字符串"""
    domain: str
    position: str
    user_id: Optional[int] = None


async def create_interview(request: InterviewRequest) -> dict:
    """
    创建面试会话
    
    Args:
        request: 面试请求参数
        
    Returns:
        dict: 面试会话信息
        
    Raises:
        HTTPException: 当创建失败时
    """
    try:
        # 业务逻辑
        return {"session_id": 123}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

## 🧪 测试指南

### 前端测试
```javascript
// 组件测试示例
import { mount } from '@vue/test-utils'
import InterviewCard from '@/components/InterviewCard.vue'

describe('InterviewCard', () => {
  it('renders correctly', () => {
    const wrapper = mount(InterviewCard, {
      props: {
        title: 'Test Interview',
        domain: 'AI'
      }
    })
    
    expect(wrapper.text()).toContain('Test Interview')
  })
})
```

### 后端测试
```python
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_interview():
    """测试创建面试接口"""
    response = client.post("/api/v1/interview/start", json={
        "domain": "人工智能",
        "position": "AI工程师"
    })
    
    assert response.status_code == 200
    assert "session_id" in response.json()
```

## 📚 文档贡献

### 文档类型
- **README.md** - 项目主要文档
- **docs/** - 详细技术文档
- **API 文档** - 自动生成的 API 文档
- **代码注释** - 内联文档

### 文档规范
- 使用清晰的标题层级
- 提供代码示例
- 包含截图和图表
- 保持内容更新

## 🎯 开发最佳实践

### 性能优化
- 前端：懒加载、虚拟滚动、图片优化
- 后端：数据库查询优化、缓存策略、异步处理

### 安全考虑
- 输入验证和清理
- API 访问控制
- 敏感数据加密
- 安全头设置

### 可访问性
- 语义化 HTML
- 键盘导航支持
- 屏幕阅读器兼容
- 色彩对比度

## 🏆 贡献者认可

我们会在以下方式认可贡献者：
- README 中的贡献者列表
- 发布说明中的感谢
- 特殊贡献的专门表彰

## 📞 获取帮助

如果你在贡献过程中遇到问题：
- 📧 发送邮件到：[your-email@example.com](mailto:your-email@example.com)
- 💬 在 [GitHub Discussions](https://github.com/Jackxiaozhiren/iflytek-interview-system/discussions) 中提问
- 🐛 在 [GitHub Issues](https://github.com/Jackxiaozhiren/iflytek-interview-system/issues) 中报告问题

---

**感谢你的贡献！让我们一起打造更好的面试评测系统！** 🚀
