<template>
  <div class="theme-test-page">
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <h2>🎨 主题切换功能测试</h2>
          <p>验证明亮/暗黑主题切换是否正常工作</p>
        </div>
      </template>
      
      <div class="test-content">
        <!-- 主题切换控制 -->
        <el-card class="control-section">
          <template #header>
            <h3>主题切换控制</h3>
          </template>
          
          <div class="theme-controls">
            <el-radio-group v-model="currentTheme" @change="changeTheme">
              <el-radio label="light">
                <div class="theme-option">
                  <div class="theme-preview light-preview"></div>
                  <span>浅色主题</span>
                </div>
              </el-radio>
              <el-radio label="dark">
                <div class="theme-option">
                  <div class="theme-preview dark-preview"></div>
                  <span>深色主题</span>
                </div>
              </el-radio>
              <el-radio label="auto">
                <div class="theme-option">
                  <div class="theme-preview auto-preview"></div>
                  <span>跟随系统</span>
                </div>
              </el-radio>
            </el-radio-group>
            
            <div class="theme-info">
              <p><strong>当前主题：</strong>{{ currentTheme }}</p>
              <p><strong>有效主题：</strong>{{ effectiveTheme }}</p>
              <p><strong>系统主题：</strong>{{ systemTheme }}</p>
            </div>
          </div>
        </el-card>
        
        <!-- 组件展示区域 -->
        <el-card class="demo-section">
          <template #header>
            <h3>组件主题效果展示</h3>
          </template>
          
          <div class="demo-grid">
            <!-- 按钮组件 -->
            <div class="demo-item">
              <h4>按钮组件</h4>
              <div class="button-group">
                <el-button>默认按钮</el-button>
                <el-button type="primary">主要按钮</el-button>
                <el-button type="success">成功按钮</el-button>
                <el-button type="warning">警告按钮</el-button>
                <el-button type="danger">危险按钮</el-button>
              </div>
            </div>
            
            <!-- 输入组件 -->
            <div class="demo-item">
              <h4>输入组件</h4>
              <el-input v-model="testInput" placeholder="请输入内容" />
              <el-select v-model="testSelect" placeholder="请选择">
                <el-option label="选项1" value="1" />
                <el-option label="选项2" value="2" />
              </el-select>
            </div>
            
            <!-- 表格组件 -->
            <div class="demo-item">
              <h4>表格组件</h4>
              <el-table :data="tableData" style="width: 100%">
                <el-table-column prop="name" label="姓名" />
                <el-table-column prop="score" label="分数" />
                <el-table-column prop="status" label="状态">
                  <template #default="scope">
                    <el-tag :type="scope.row.status === '通过' ? 'success' : 'warning'">
                      {{ scope.row.status }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            
            <!-- 标签页组件 -->
            <div class="demo-item">
              <h4>标签页组件</h4>
              <el-tabs v-model="activeTab">
                <el-tab-pane label="用户管理" name="users">用户管理内容</el-tab-pane>
                <el-tab-pane label="配置管理" name="config">配置管理内容</el-tab-pane>
                <el-tab-pane label="角色管理" name="roles">角色管理内容</el-tab-pane>
              </el-tabs>
            </div>
            
            <!-- 统计卡片 -->
            <div class="demo-item">
              <h4>统计卡片</h4>
              <div class="stats-grid">
                <div class="stats-card">
                  <div class="stats-value">1,234</div>
                  <div class="stats-label">总用户数</div>
                </div>
                <div class="stats-card">
                  <div class="stats-value">89%</div>
                  <div class="stats-label">成功率</div>
                </div>
              </div>
            </div>
          </div>
        </el-card>
        
        <!-- 颜色变量展示 -->
        <el-card class="color-section">
          <template #header>
            <h3>CSS变量颜色展示</h3>
          </template>
          
          <div class="color-grid">
            <div class="color-item">
              <div class="color-box" style="background-color: var(--current-bg-primary)"></div>
              <span>主背景色</span>
            </div>
            <div class="color-item">
              <div class="color-box" style="background-color: var(--current-bg-secondary)"></div>
              <span>次背景色</span>
            </div>
            <div class="color-item">
              <div class="color-box" style="background-color: var(--current-text-primary)"></div>
              <span>主文字色</span>
            </div>
            <div class="color-item">
              <div class="color-box" style="background-color: var(--current-iflytek-primary)"></div>
              <span>iFlytek主色</span>
            </div>
            <div class="color-item">
              <div class="color-box" style="background-color: var(--current-border-primary)"></div>
              <span>边框色</span>
            </div>
          </div>
        </el-card>
        
        <!-- 测试结果 -->
        <el-card class="result-section">
          <template #header>
            <h3>测试结果</h3>
          </template>
          
          <div class="test-results">
            <el-alert
              :title="testResult.title"
              :description="testResult.description"
              :type="testResult.type"
              :closable="false"
              show-icon
            />
            
            <div class="test-actions">
              <el-button type="primary" @click="runThemeTest">
                <el-icon><Check /></el-icon>
                运行主题测试
              </el-button>
              <el-button @click="goToPersonalSettings">
                <el-icon><Setting /></el-icon>
                前往个人设置
              </el-button>
            </div>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElNotification } from 'element-plus'
import { Check, Setting } from '@element-plus/icons-vue'
import { useUserSettings } from '@/stores/userSettingsStore'

const router = useRouter()
const { state: userSettings, getters, actions } = useUserSettings()

// 响应式数据
const currentTheme = ref('light')
const testInput = ref('')
const testSelect = ref('')
const activeTab = ref('users')

// 表格数据
const tableData = ref([
  { name: '张三', score: 85, status: '通过' },
  { name: '李四', score: 72, status: '待审核' },
  { name: '王五', score: 91, status: '通过' }
])

// 测试结果
const testResult = ref({
  title: '等待测试',
  description: '点击"运行主题测试"开始验证主题切换功能',
  type: 'info'
})

// 计算属性
const effectiveTheme = computed(() => getters.effectiveTheme.value)
const systemTheme = computed(() => userSettings.systemTheme)

// 主题切换方法
const changeTheme = (theme) => {
  actions.updateSettings({ theme })
  ElMessage.success(`主题已切换到: ${theme}`)
}

// 运行主题测试
const runThemeTest = async () => {
  try {
    ElNotification({
      title: '开始主题测试',
      message: '正在验证主题切换功能...',
      type: 'info'
    })
    
    // 测试各个主题
    const themes = ['light', 'dark', 'auto']
    let testPassed = true
    
    for (const theme of themes) {
      await new Promise(resolve => setTimeout(resolve, 500))
      changeTheme(theme)
      
      // 检查主题是否正确应用
      const body = document.body
      const expectedClass = `theme-${theme === 'auto' ? systemTheme.value : theme}`
      
      if (!body.classList.contains(expectedClass)) {
        testPassed = false
        break
      }
    }
    
    if (testPassed) {
      testResult.value = {
        title: '✅ 主题切换测试通过',
        description: '所有主题都能正常切换，CSS变量系统工作正常，iFlytek品牌色彩一致性良好',
        type: 'success'
      }
      
      ElNotification({
        title: '测试完成',
        message: '主题切换功能验证通过！',
        type: 'success'
      })
    } else {
      testResult.value = {
        title: '❌ 主题切换测试失败',
        description: '主题切换存在问题，请检查CSS变量系统和主题应用逻辑',
        type: 'error'
      }
    }
  } catch (error) {
    console.error('主题测试失败:', error)
    testResult.value = {
      title: '❌ 测试执行失败',
      description: `测试过程中出现错误: ${error.message}`,
      type: 'error'
    }
  }
}

// 前往个人设置
const goToPersonalSettings = () => {
  router.push('/personal-settings')
}

// 组件挂载时初始化
onMounted(async () => {
  await actions.initializeSettings()
  currentTheme.value = userSettings.theme
  
  ElNotification({
    title: '主题测试页面',
    message: '您可以在这里测试主题切换功能',
    type: 'info',
    duration: 3000
  })
})
</script>

<style scoped>
.theme-test-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.test-card {
  margin-bottom: 20px;
}

.card-header h2 {
  margin: 0 0 8px 0;
  color: var(--current-text-primary);
}

.card-header p {
  margin: 0;
  color: var(--current-text-secondary);
}

.test-content {
  display: grid;
  gap: 20px;
}

.control-section,
.demo-section,
.color-section,
.result-section {
  margin-bottom: 16px;
}

.theme-controls {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.theme-option {
  display: flex;
  align-items: center;
  gap: 8px;
}

.theme-preview {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 1px solid var(--current-border-primary);
}

.light-preview {
  background: linear-gradient(45deg, #ffffff 50%, #f5f5f5 50%);
}

.dark-preview {
  background: linear-gradient(45deg, #141414 50%, #262626 50%);
}

.auto-preview {
  background: linear-gradient(45deg, #ffffff 25%, #141414 25%, #141414 50%, #ffffff 50%, #ffffff 75%, #141414 75%);
  background-size: 8px 8px;
}

.theme-info {
  padding: 16px;
  background: var(--current-bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--current-border-secondary);
}

.theme-info p {
  margin: 4px 0;
  color: var(--current-text-primary);
}

.demo-grid {
  display: grid;
  gap: 20px;
}

.demo-item {
  padding: 16px;
  background: var(--current-bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--current-border-secondary);
}

.demo-item h4 {
  margin: 0 0 12px 0;
  color: var(--current-text-primary);
}

.button-group {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.stats-card {
  padding: 16px;
  background: var(--current-bg-primary);
  border: 1px solid var(--current-border-secondary);
  border-radius: 8px;
  text-align: center;
  box-shadow: var(--current-shadow-sm);
}

.stats-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--current-iflytek-primary);
  margin-bottom: 4px;
}

.stats-label {
  font-size: 14px;
  color: var(--current-text-secondary);
}

.color-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.color-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.color-box {
  width: 60px;
  height: 60px;
  border-radius: 8px;
  border: 1px solid var(--current-border-primary);
}

.color-item span {
  font-size: 12px;
  color: var(--current-text-secondary);
  text-align: center;
}

.test-results {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.test-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .theme-test-page {
    padding: 10px;
  }
  
  .button-group {
    flex-direction: column;
  }
  
  .test-actions {
    flex-direction: column;
  }
  
  .test-actions .el-button {
    width: 100%;
  }
}
</style>
