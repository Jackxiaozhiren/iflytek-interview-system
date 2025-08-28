<template>
  <div class="responsive-module-grid" :class="[gradientClass, layoutClass, gradientFadeClass]">
    <div class="responsive-container">
      <!-- 页面标题区域 -->
      <div class="page-header" v-if="title || subtitle">
        <div class="content-centered">
          <h1 class="responsive-title gradient-text-overlay">{{ title }}</h1>
          <p class="responsive-subtitle gradient-text-overlay" v-if="subtitle">{{ subtitle }}</p>
        </div>
      </div>

      <!-- 统计数据展示 -->
      <div class="stats-section" v-if="stats && stats.length > 0">
        <div class="symmetric-layout equal-height-grid stagger-animation">
          <div 
            v-for="(stat, index) in stats" 
            :key="index"
            class="stat-card module-card hover-lift fade-in-up"
          >
            <div class="stat-icon" v-if="stat.icon">
              <el-icon><component :is="stat.icon" /></el-icon>
            </div>
            <div class="stat-content">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
              <div class="stat-trend" v-if="stat.trend" :class="stat.trend.type">
                <el-icon><component :is="getTrendIcon(stat.trend.type)" /></el-icon>
                {{ stat.trend.value }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 主要功能模块 -->
      <div class="modules-section">
        <div class="responsive-grid equal-height-grid stagger-animation">
          <div 
            v-for="(module, index) in modules" 
            :key="module.id || index"
            class="feature-module module-card hover-lift fade-in-up"
            :class="module.gradientClass"
            @click="handleModuleClick(module)"
          >
            <!-- 模块图标 -->
            <div class="module-icon" v-if="module.icon">
              <el-icon><component :is="module.icon" /></el-icon>
            </div>

            <!-- 模块内容 -->
            <div class="module-content">
              <h3 class="module-title">{{ module.title }}</h3>
              <p class="module-description">{{ module.description }}</p>
              
              <!-- 功能特性列表 -->
              <ul class="module-features" v-if="module.features && module.features.length > 0">
                <li v-for="feature in module.features" :key="feature">
                  <el-icon><Check /></el-icon>
                  {{ feature }}
                </li>
              </ul>

              <!-- 模块统计 -->
              <div class="module-stats" v-if="module.stats">
                <div class="stat-item" v-for="(stat, key) in module.stats" :key="key">
                  <span class="stat-number">{{ stat.value }}</span>
                  <span class="stat-text">{{ stat.label }}</span>
                </div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="module-actions" v-if="module.actions && module.actions.length > 0">
              <el-button 
                v-for="action in module.actions" 
                :key="action.id"
                :type="action.type || 'primary'"
                :size="action.size || 'default'"
                @click.stop="handleActionClick(action, module)"
              >
                <el-icon v-if="action.icon"><component :is="action.icon" /></el-icon>
                {{ action.label }}
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 次要功能区域 -->
      <div class="secondary-section" v-if="secondaryModules && secondaryModules.length > 0">
        <div class="responsive-grid">
          <div 
            v-for="(module, index) in secondaryModules" 
            :key="module.id || index"
            class="secondary-module module-card hover-lift"
          >
            <div class="module-header">
              <el-icon v-if="module.icon"><component :is="module.icon" /></el-icon>
              <h4>{{ module.title }}</h4>
            </div>
            <p>{{ module.description }}</p>
            <el-button 
              v-if="module.action"
              :type="module.action.type || 'default'"
              size="small"
              @click="handleActionClick(module.action, module)"
            >
              {{ module.action.label }}
            </el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { 
  ArrowUp, 
  ArrowDown, 
  Minus, 
  Check,
  VideoCamera,
  Microphone,
  TrendCharts,
  User,
  Document,
  Setting
} from '@element-plus/icons-vue'

// Props定义
const props = defineProps({
  title: {
    type: String,
    default: ''
  },
  subtitle: {
    type: String,
    default: ''
  },
  gradientType: {
    type: String,
    default: 'homepage',
    validator: (value) => ['homepage', 'enterprise', 'candidate', 'report'].includes(value)
  },
  layoutType: {
    type: String,
    default: 'standard',
    validator: (value) => ['standard', 'compact', 'wide'].includes(value)
  },
  stats: {
    type: Array,
    default: () => []
  },
  modules: {
    type: Array,
    default: () => []
  },
  secondaryModules: {
    type: Array,
    default: () => []
  }
})

// Emits定义
const emit = defineEmits(['module-click', 'action-click'])

// Router
const router = useRouter()

// 计算属性
const gradientClass = computed(() => `${props.gradientType}-gradient`)
const layoutClass = computed(() => `layout-${props.layoutType}`)
const gradientFadeClass = computed(() => `${props.gradientType}-gradient-fade`)

// 方法
const getTrendIcon = (type) => {
  switch (type) {
    case 'up': return ArrowUp
    case 'down': return ArrowDown
    default: return Minus
  }
}

const handleModuleClick = (module) => {
  emit('module-click', module)
  if (module.route) {
    router.push(module.route)
  }
}

const handleActionClick = (action, module) => {
  emit('action-click', action, module)
  if (action.route) {
    router.push(action.route)
  } else if (action.handler) {
    action.handler(module)
  }
}
</script>

<style scoped>
/* 组件特定样式 */
.responsive-module-grid {
  min-height: 100vh;
  padding: var(--spacing-xl) 0;
}

.page-header {
  margin-bottom: var(--spacing-xxl);
  text-align: center;
}

.stats-section {
  margin-bottom: var(--spacing-xxl);
}

.modules-section {
  margin-bottom: var(--spacing-xl);
}

.secondary-section {
  margin-top: var(--spacing-xl);
}

/* 统计卡片样式 */
.stat-card {
  text-align: center;
  padding: var(--spacing-lg);
}

.stat-icon {
  font-size: 2.5rem;
  color: var(--iflytek-primary);
  margin-bottom: var(--spacing-md);
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--iflytek-primary);
  margin-bottom: var(--spacing-sm);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
}

.stat-trend {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 0.75rem;
  font-weight: 500;
}

.stat-trend.up { color: var(--iflytek-success); }
.stat-trend.down { color: var(--iflytek-error); }

/* 功能模块样式 */
.feature-module {
  cursor: pointer;
  transition: all 0.3s ease;
}

.module-icon {
  font-size: 3rem;
  color: var(--iflytek-primary);
  margin-bottom: var(--spacing-md);
  text-align: center;
}

.module-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.module-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: var(--spacing-sm);
  color: var(--text-on-light);
}

.module-description {
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
  line-height: 1.6;
}

.module-features {
  list-style: none;
  padding: 0;
  margin: var(--spacing-md) 0;
}

.module-features li {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
  font-size: 0.875rem;
  color: var(--text-secondary);
}

.module-stats {
  display: flex;
  gap: var(--spacing-md);
  margin: var(--spacing-md) 0;
}

.module-stats .stat-item {
  text-align: center;
}

.module-stats .stat-number {
  display: block;
  font-weight: 600;
  color: var(--iflytek-primary);
}

.module-stats .stat-text {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.module-actions {
  margin-top: auto;
  padding-top: var(--spacing-md);
  display: flex;
  gap: var(--spacing-sm);
  flex-wrap: wrap;
}

/* 次要模块样式 */
.secondary-module {
  padding: var(--spacing-md);
}

.module-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-sm);
}

.module-header h4 {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

/* 布局变体 */
.layout-compact .responsive-container {
  max-width: var(--container-lg);
}

.layout-wide .responsive-container {
  max-width: var(--container-xxl);
}

.layout-compact .module-card {
  padding: var(--spacing-md);
}

.layout-wide .module-card {
  padding: var(--spacing-xl);
}
</style>
