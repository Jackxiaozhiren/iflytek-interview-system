<template>
  <div class="settings-test-page">
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <h2>个人设置功能测试</h2>
          <p>测试主题切换、字体大小调整等功能</p>
        </div>
      </template>
      
      <div class="test-content">
        <!-- 主题测试 -->
        <el-card class="test-section">
          <template #header>
            <h3>主题切换测试</h3>
          </template>
          
          <div class="theme-test">
            <p>当前主题: {{ userSettings.theme }}</p>
            <p>有效主题: {{ getters.effectiveTheme.value }}</p>
            
            <el-button-group>
              <el-button @click="testTheme('light')" :type="userSettings.theme === 'light' ? 'primary' : ''">
                浅色主题
              </el-button>
              <el-button @click="testTheme('dark')" :type="userSettings.theme === 'dark' ? 'primary' : ''">
                暗黑主题
              </el-button>
              <el-button @click="testTheme('auto')" :type="userSettings.theme === 'auto' ? 'primary' : ''">
                跟随系统
              </el-button>
            </el-button-group>
          </div>
        </el-card>
        
        <!-- 字体大小测试 -->
        <el-card class="test-section">
          <template #header>
            <h3>字体大小测试</h3>
          </template>
          
          <div class="font-test">
            <p>当前字体大小: {{ userSettings.fontSize }}</p>
            
            <el-button-group>
              <el-button @click="testFontSize('small')" :type="userSettings.fontSize === 'small' ? 'primary' : ''">
                小号字体
              </el-button>
              <el-button @click="testFontSize('medium')" :type="userSettings.fontSize === 'medium' ? 'primary' : ''">
                中号字体
              </el-button>
              <el-button @click="testFontSize('large')" :type="userSettings.fontSize === 'large' ? 'primary' : ''">
                大号字体
              </el-button>
            </el-button-group>
            
            <div class="font-demo">
              <h1>标题1 - 这是一个测试标题</h1>
              <h2>标题2 - 这是一个测试标题</h2>
              <h3>标题3 - 这是一个测试标题</h3>
              <p>正文 - 这是一段测试文字，用于展示不同字体大小的效果。</p>
            </div>
          </div>
        </el-card>
        
        <!-- 设置状态测试 */
        <el-card class="test-section">
          <template #header>
            <h3>设置状态测试</h3>
          </template>
          
          <div class="settings-status">
            <el-descriptions :column="2" border>
              <el-descriptions-item label="是否有未保存更改">
                {{ getters.hasUnsavedChanges.value ? '是' : '否' }}
              </el-descriptions-item>
              <el-descriptions-item label="上次保存时间">
                {{ userSettings.lastSaved || '未保存' }}
              </el-descriptions-item>
              <el-descriptions-item label="通知摘要">
                {{ getters.notificationSummary.value }}
              </el-descriptions-item>
              <el-descriptions-item label="字体大小类名">
                {{ getters.fontSizeClass.value }}
              </el-descriptions-item>
            </el-descriptions>
            
            <div class="test-actions">
              <el-button type="primary" @click="saveSettings">
                保存设置
              </el-button>
              <el-button @click="resetSettings">
                重置设置
              </el-button>
              <el-button @click="showSettingsData">
                查看设置数据
              </el-button>
            </div>
          </div>
        </el-card>
        
        <!-- 通知测试 */
        <el-card class="test-section">
          <template #header>
            <h3>通知功能测试</h3>
          </template>
          
          <div class="notification-test">
            <p>浏览器通知权限: {{ notificationPermission }}</p>
            
            <el-button-group>
              <el-button @click="requestNotificationPermission">
                请求通知权限
              </el-button>
              <el-button @click="testNotification">
                测试通知
              </el-button>
            </el-button-group>
          </div>
        </el-card>
        
        <!-- 导航测试 -->
        <el-card class="test-section">
          <template #header>
            <h3>页面导航测试</h3>
          </template>
          
          <div class="navigation-test">
            <el-button type="primary" @click="goToSettings">
              前往个人设置页面
            </el-button>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElNotification, ElMessageBox } from 'element-plus'
import { useUserSettings } from '@/stores/userSettingsStore'
import notificationService from '@/utils/notificationService'

const router = useRouter()
const { state: userSettings, getters, actions } = useUserSettings()

const notificationPermission = ref('unknown')

// 测试主题切换
const testTheme = (theme) => {
  actions.updateSettings({ theme })
  ElMessage.success(`主题已切换到: ${theme}`)
}

// 测试字体大小
const testFontSize = (fontSize) => {
  actions.updateSettings({ fontSize })
  ElMessage.success(`字体大小已设置为: ${fontSize}`)
}

// 保存设置
const saveSettings = () => {
  const success = actions.saveSettings()
  if (success) {
    ElMessage.success('设置已保存到本地存储')
  }
}

// 重置设置
const resetSettings = () => {
  ElMessageBox.confirm('确定要重置所有设置吗？', '确认重置', {
    type: 'warning'
  }).then(() => {
    actions.resetToDefaults()
    ElMessage.success('设置已重置')
  }).catch(() => {
    ElMessage.info('已取消重置')
  })
}

// 显示设置数据
const showSettingsData = () => {
  ElMessageBox.alert(
    `<pre>${JSON.stringify(userSettings, null, 2)}</pre>`,
    '当前设置数据',
    {
      dangerouslyUseHTMLString: true,
      customClass: 'settings-data-dialog'
    }
  )
}

// 请求通知权限
const requestNotificationPermission = async () => {
  const granted = await notificationService.requestPermission()
  notificationPermission.value = notificationService.checkPermission()
  
  if (granted) {
    ElMessage.success('通知权限已获取')
  } else {
    ElMessage.warning('通知权限被拒绝')
  }
}

// 测试通知
const testNotification = () => {
  notificationService.testNotification()
}

// 前往设置页面
const goToSettings = () => {
  router.push('/personal-settings')
}

// 组件挂载时初始化
onMounted(async () => {
  // 初始化用户设置
  await actions.initializeSettings()
  
  // 检查通知权限
  notificationPermission.value = notificationService.checkPermission()
  
  ElNotification({
    title: '测试页面已加载',
    message: '您可以在这里测试个人设置的各项功能',
    type: 'info'
  })
})
</script>

<style scoped>
.settings-test-page {
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

.test-section {
  margin-bottom: 16px;
}

.theme-test,
.font-test,
.settings-status,
.notification-test,
.navigation-test {
  padding: 16px 0;
}

.font-demo {
  margin-top: 20px;
  padding: 16px;
  background: var(--current-bg-secondary);
  border-radius: 8px;
  border: 1px solid var(--current-border-secondary);
}

.test-actions {
  margin-top: 16px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .settings-test-page {
    padding: 10px;
  }
  
  .test-actions {
    flex-direction: column;
  }
  
  .test-actions .el-button {
    width: 100%;
  }
}
</style>

<style>
.settings-data-dialog .el-message-box__content {
  max-height: 400px;
  overflow-y: auto;
}

.settings-data-dialog pre {
  font-size: 12px;
  line-height: 1.4;
  background: #f5f5f5;
  padding: 12px;
  border-radius: 4px;
  overflow-x: auto;
}
</style>
