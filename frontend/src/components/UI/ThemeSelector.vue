<template>
  <div class="theme-selector">
    <el-dropdown 
      @command="handleThemeChange"
      trigger="click"
      placement="bottom-end"
    >
      <el-button 
        :icon="currentThemeIcon" 
        circle 
        class="theme-toggle-btn"
        :class="currentTheme"
        v-tooltip="'切换主题'"
      />
      
      <template #dropdown>
        <el-dropdown-menu class="theme-dropdown">
          <div class="theme-dropdown-header">
            <h4>选择模块主题</h4>
            <p>为不同技术领域选择专属配色</p>
          </div>
          
          <el-dropdown-item 
            v-for="theme in themes" 
            :key="theme.key"
            :command="theme.key"
            :class="{ active: currentTheme === theme.key }"
            class="theme-option"
          >
            <div class="theme-preview">
              <div class="theme-colors">
                <div 
                  class="color-dot primary" 
                  :style="{ background: theme.colors.primary }"
                ></div>
                <div 
                  class="color-dot secondary" 
                  :style="{ background: theme.colors.secondary }"
                ></div>
                <div 
                  class="color-dot accent" 
                  :style="{ background: theme.colors.accent }"
                ></div>
              </div>
              <div class="theme-info">
                <div class="theme-name">{{ theme.name }}</div>
                <div class="theme-description">{{ theme.description }}</div>
              </div>
              <el-icon v-if="currentTheme === theme.key" class="check-icon">
                <Check />
              </el-icon>
            </div>
          </el-dropdown-item>
          
          <el-divider style="margin: 8px 0;" />
          
          <el-dropdown-item command="auto" class="theme-option">
            <div class="theme-preview">
              <el-icon class="auto-icon"><Setting /></el-icon>
              <div class="theme-info">
                <div class="theme-name">智能切换</div>
                <div class="theme-description">根据页面内容自动选择</div>
              </div>
            </div>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Check, Cpu, DataBoard, Connection, Star, Setting } from '@element-plus/icons-vue'

// 主题配置
const themes = ref([
  {
    key: 'ai',
    name: 'AI技术',
    description: '科技蓝色系，专注人工智能',
    icon: Cpu,
    colors: {
      primary: '#0066cc',
      secondary: '#4c51bf',
      accent: '#3b82f6'
    }
  },
  {
    key: 'data',
    name: '大数据',
    description: '数据绿色系，突出分析能力',
    icon: DataBoard,
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#34d399'
    }
  },
  {
    key: 'iot',
    name: 'IoT物联网',
    description: '活力橙色系，连接万物',
    icon: Connection,
    colors: {
      primary: '#f59e0b',
      secondary: '#d97706',
      accent: '#fbbf24'
    }
  },
  {
    key: 'interview',
    name: '面试评估',
    description: 'iFlytek紫色系，专业评估',
    icon: Star,
    colors: {
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      accent: '#a78bfa'
    }
  }
])

// 当前主题
const currentTheme = ref('interview')
const autoMode = ref(false)
const route = useRoute()

// 计算当前主题图标
const currentThemeIcon = computed(() => {
  if (autoMode.value) return Setting
  const theme = themes.value.find(t => t.key === currentTheme.value)
  return theme?.icon || Star
})

// 根据路由自动切换主题
const getThemeFromRoute = (routePath) => {
  if (routePath.includes('ai') || routePath.includes('artificial')) return 'ai'
  if (routePath.includes('data') || routePath.includes('analytics')) return 'data'
  if (routePath.includes('iot') || routePath.includes('internet')) return 'iot'
  return 'interview'
}

// 应用主题到DOM
const applyTheme = (themeKey) => {
  const body = document.body
  
  // 移除所有主题类
  body.classList.remove('theme-ai', 'theme-data', 'theme-iot', 'theme-interview')
  
  // 添加新主题类
  if (themeKey && themeKey !== 'auto') {
    body.classList.add(`theme-${themeKey}`)
  }
  
  // 更新CSS变量
  const theme = themes.value.find(t => t.key === themeKey)
  if (theme) {
    const root = document.documentElement
    root.style.setProperty('--current-theme-primary', theme.colors.primary)
    root.style.setProperty('--current-theme-secondary', theme.colors.secondary)
    root.style.setProperty('--current-theme-accent', theme.colors.accent)
  }
}

// 处理主题切换
const handleThemeChange = (themeKey) => {
  if (themeKey === 'auto') {
    autoMode.value = true
    currentTheme.value = getThemeFromRoute(route.path)
    ElMessage.success('已启用智能主题切换')
  } else {
    autoMode.value = false
    currentTheme.value = themeKey
    const theme = themes.value.find(t => t.key === themeKey)
    ElMessage.success(`已切换到${theme?.name}主题`)
  }
  
  applyTheme(currentTheme.value)
  
  // 保存到本地存储
  localStorage.setItem('theme-preference', JSON.stringify({
    theme: currentTheme.value,
    auto: autoMode.value
  }))
}

// 监听路由变化（自动模式下）
watch(() => route.path, (newPath) => {
  if (autoMode.value) {
    const newTheme = getThemeFromRoute(newPath)
    if (newTheme !== currentTheme.value) {
      currentTheme.value = newTheme
      applyTheme(currentTheme.value)
    }
  }
})

// 组件挂载时恢复主题设置
onMounted(() => {
  try {
    const saved = localStorage.getItem('theme-preference')
    if (saved) {
      const { theme, auto } = JSON.parse(saved)
      autoMode.value = auto || false
      currentTheme.value = auto ? getThemeFromRoute(route.path) : theme
    } else {
      // 默认根据路由设置主题
      currentTheme.value = getThemeFromRoute(route.path)
    }
  } catch (error) {
    console.warn('主题设置恢复失败:', error)
    currentTheme.value = 'interview'
  }
  
  applyTheme(currentTheme.value)
})
</script>

<style scoped>
.theme-selector {
  position: relative;
}

.theme-toggle-btn {
  width: 40px;
  height: 40px;
  border: 2px solid var(--border-light);
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: all var(--duration-normal) var(--ease-out);
  box-shadow: var(--shadow-sm);
}

.theme-toggle-btn:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
}

.theme-toggle-btn.ai {
  border-color: var(--ai-primary);
  color: var(--ai-primary);
}

.theme-toggle-btn.data {
  border-color: var(--data-primary);
  color: var(--data-primary);
}

.theme-toggle-btn.iot {
  border-color: var(--iot-primary);
  color: var(--iot-primary);
}

.theme-toggle-btn.interview {
  border-color: var(--interview-primary);
  color: var(--interview-primary);
}

.theme-dropdown {
  min-width: 280px;
  padding: var(--spacing-sm);
}

.theme-dropdown-header {
  padding: var(--spacing-md);
  text-align: center;
  border-bottom: 1px solid var(--border-light);
  margin-bottom: var(--spacing-sm);
}

.theme-dropdown-header h4 {
  margin: 0 0 var(--spacing-xs) 0;
  color: var(--text-primary);
  font-size: 1rem;
  font-weight: 600;
}

.theme-dropdown-header p {
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.875rem;
}

.theme-option {
  padding: var(--spacing-sm) !important;
  border-radius: var(--radius-md);
  margin: var(--spacing-xs) 0;
  transition: all var(--duration-fast) var(--ease-out);
}

.theme-option:hover {
  background: var(--neutral-100);
}

.theme-option.active {
  background: var(--neutral-100);
  border-left: 3px solid var(--current-theme-primary, var(--iflytek-primary));
}

.theme-preview {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  width: 100%;
}

.theme-colors {
  display: flex;
  gap: var(--spacing-xs);
}

.color-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid var(--bg-primary);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.theme-info {
  flex: 1;
}

.theme-name {
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.875rem;
  margin-bottom: 2px;
}

.theme-description {
  font-size: 0.75rem;
  color: var(--text-secondary);
  line-height: 1.3;
}

.check-icon {
  color: var(--success);
  font-size: 1rem;
}

.auto-icon {
  font-size: 1.25rem;
  color: var(--text-secondary);
}
</style>
