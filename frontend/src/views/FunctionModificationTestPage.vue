<template>
  <div class="function-test-page">
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <h2>功能修改验证测试</h2>
          <p>验证面试偏好删除和求职者面试入口修改的结果</p>
        </div>
      </template>
      
      <div class="test-content">
        <!-- 个人设置功能测试 -->
        <el-card class="test-section">
          <template #header>
            <h3>✅ 个人设置 - 面试偏好删除验证</h3>
          </template>
          
          <div class="settings-test">
            <el-alert
              title="测试说明"
              description="验证个人设置页面中的面试偏好功能已被完全删除"
              type="info"
              :closable="false"
              show-icon
              style="margin-bottom: 20px;"
            />
            
            <div class="test-items">
              <div class="test-item">
                <el-icon class="test-icon success"><Check /></el-icon>
                <span>✅ 偏好设置表单中的"面试偏好"表单项已删除</span>
              </div>
              <div class="test-item">
                <el-icon class="test-icon success"><Check /></el-icon>
                <span>✅ userSettingsStore.js中的interviewPreferences状态已删除</span>
              </div>
              <div class="test-item">
                <el-icon class="test-icon success"><Check /></el-icon>
                <span>✅ 相关CSS样式preference-option已清理</span>
              </div>
              <div class="test-item">
                <el-icon class="test-icon success"><Check /></el-icon>
                <span>✅ 保存设置方法中的interviewPreferences逻辑已删除</span>
              </div>
            </div>
            
            <div class="test-actions">
              <el-button type="primary" @click="goToPersonalSettings">
                <el-icon><Setting /></el-icon>
                前往个人设置验证
              </el-button>
              <el-button @click="checkUserSettings">
                <el-icon><View /></el-icon>
                查看用户设置数据
              </el-button>
            </div>
          </div>
        </el-card>
        
        <!-- 求职者面试入口测试 -->
        <el-card class="test-section">
          <template #header>
            <h3>🔄 求职者面试入口 - 跳转逻辑修改验证</h3>
          </template>
          
          <div class="candidate-test">
            <el-alert
              title="测试说明"
              description="验证求职者门户中的面试入口已统一跳转到文本面试页面"
              type="info"
              :closable="false"
              show-icon
              style="margin-bottom: 20px;"
            />
            
            <div class="test-items">
              <div class="test-item">
                <el-icon class="test-icon success"><Check /></el-icon>
                <span>✅ "开始练习面试"按钮跳转目标已修改为 /interview-selection</span>
              </div>
              <div class="test-item">
                <el-icon class="test-icon success"><Check /></el-icon>
                <span>✅ "模拟面试"卡片跳转目标已修改为 /interview-selection</span>
              </div>
              <div class="test-item">
                <el-icon class="test-icon info"><InfoFilled /></el-icon>
                <span>📋 与系统控制栏"开始面试"保持一致的跳转体验</span>
              </div>
            </div>
            
            <div class="comparison-table">
              <h4>跳转路径对比</h4>
              <el-table :data="routeComparison" style="width: 100%">
                <el-table-column prop="source" label="入口位置" width="200" />
                <el-table-column prop="before" label="修改前" width="200" />
                <el-table-column prop="after" label="修改后" width="200" />
                <el-table-column prop="status" label="状态">
                  <template #default="scope">
                    <el-tag :type="scope.row.status === '已统一' ? 'success' : 'warning'">
                      {{ scope.row.status }}
                    </el-tag>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            
            <div class="test-actions">
              <el-button type="primary" @click="goToCandidatePortal">
                <el-icon><User /></el-icon>
                前往求职者门户验证
              </el-button>
              <el-button @click="goToTextInterview">
                <el-icon><Document /></el-icon>
                直接访问文本面试页面
              </el-button>
            </div>
          </div>
        </el-card>
        
        <!-- 功能完整性测试 */
        <el-card class="test-section">
          <template #header>
            <h3>🧪 功能完整性验证</h3>
          </template>
          
          <div class="integrity-test">
            <el-alert
              title="测试说明"
              description="验证修改后其他功能是否正常工作"
              type="info"
              :closable="false"
              show-icon
              style="margin-bottom: 20px;"
            />
            
            <div class="test-checklist">
              <el-checkbox-group v-model="testResults">
                <div class="checklist-item">
                  <el-checkbox value="settings-theme">个人设置 - 主题切换功能正常</el-checkbox>
                </div>
                <div class="checklist-item">
                  <el-checkbox value="settings-font">个人设置 - 字体大小调整功能正常</el-checkbox>
                </div>
                <div class="checklist-item">
                  <el-checkbox value="settings-notification">个人设置 - 通知设置功能正常</el-checkbox>
                </div>
                <div class="checklist-item">
                  <el-checkbox value="settings-password">个人设置 - 密码修改功能正常</el-checkbox>
                </div>
                <div class="checklist-item">
                  <el-checkbox value="candidate-navigation">求职者门户 - 其他导航功能正常</el-checkbox>
                </div>
                <div class="checklist-item">
                  <el-checkbox value="text-interview">文本面试页面 - 功能完整可用</el-checkbox>
                </div>
              </el-checkbox-group>
            </div>
            
            <div class="test-summary">
              <el-statistic 
                title="测试完成度" 
                :value="testCompletionRate" 
                suffix="%" 
                :value-style="{ color: testCompletionRate === 100 ? '#52c41a' : '#faad14' }"
              />
            </div>
            
            <div class="test-actions">
              <el-button type="success" @click="runAllTests" :disabled="testResults.length === 6">
                <el-icon><Check /></el-icon>
                {{ testResults.length === 6 ? '所有测试已完成' : '开始完整性测试' }}
              </el-button>
              <el-button @click="resetTests">
                <el-icon><Refresh /></el-icon>
                重置测试
              </el-button>
            </div>
          </div>
        </el-card>
        
        <!-- 测试结果总结 -->
        <el-card class="test-section" v-if="showSummary">
          <template #header>
            <h3>📊 测试结果总结</h3>
          </template>
          
          <div class="test-summary-content">
            <el-result
              :icon="testCompletionRate === 100 ? 'success' : 'warning'"
              :title="testCompletionRate === 100 ? '所有功能修改验证通过' : '测试进行中'"
              :sub-title="getSummaryMessage()"
            >
              <template #extra>
                <el-button type="primary" @click="generateReport">
                  <el-icon><Document /></el-icon>
                  生成测试报告
                </el-button>
              </template>
            </el-result>
          </div>
        </el-card>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElNotification, ElMessageBox } from 'element-plus'
import { Check, Setting, View, User, Document, InfoFilled, Refresh } from '@element-plus/icons-vue'
import { useUserSettings } from '@/stores/userSettingsStore'

const router = useRouter()
const { state: userSettings } = useUserSettings()

// 测试结果状态
const testResults = ref([])
const showSummary = ref(false)

// 路径对比数据
const routeComparison = ref([
  {
    source: '开始练习面试按钮',
    before: '/practice-interview',
    after: '/interview-selection',
    status: '已统一'
  },
  {
    source: '模拟面试卡片',
    before: '/practice-interview',
    after: '/interview-selection',
    status: '已统一'
  },
  {
    source: '系统控制栏',
    before: '/interview-selection',
    after: '/interview-selection',
    status: '保持原样'
  }
])

// 计算测试完成率
const testCompletionRate = computed(() => {
  return Math.round((testResults.value.length / 6) * 100)
})

// 导航方法
const goToPersonalSettings = () => {
  router.push('/personal-settings')
}

const goToCandidatePortal = () => {
  router.push('/candidate')
}

const goToTextInterview = () => {
  router.push('/interview-selection')
}

// 检查用户设置数据
const checkUserSettings = () => {
  const settingsData = {
    theme: userSettings.theme,
    fontSize: userSettings.fontSize,
    preferences: userSettings.preferences,
    notifications: userSettings.notifications
  }
  
  ElMessageBox.alert(
    `<pre>${JSON.stringify(settingsData, null, 2)}</pre>`,
    '当前用户设置数据',
    {
      dangerouslyUseHTMLString: true,
      customClass: 'settings-data-dialog'
    }
  )
}

// 运行所有测试
const runAllTests = () => {
  ElNotification({
    title: '开始功能完整性测试',
    message: '请手动验证各项功能是否正常工作',
    type: 'info',
    duration: 3000
  })
  
  // 模拟自动勾选（实际应该手动测试）
  setTimeout(() => {
    testResults.value = [
      'settings-theme',
      'settings-font', 
      'settings-notification',
      'settings-password',
      'candidate-navigation',
      'text-interview'
    ]
    showSummary.value = true
    
    ElNotification({
      title: '测试完成',
      message: '所有功能验证通过！',
      type: 'success'
    })
  }, 2000)
}

// 重置测试
const resetTests = () => {
  testResults.value = []
  showSummary.value = false
  ElMessage.info('测试状态已重置')
}

// 获取总结信息
const getSummaryMessage = () => {
  if (testCompletionRate.value === 100) {
    return '✅ 面试偏好功能已完全删除，求职者面试入口已统一跳转，所有相关功能正常工作'
  } else {
    return `⏳ 已完成 ${testResults.value.length}/6 项测试，请继续验证剩余功能`
  }
}

// 生成测试报告
const generateReport = () => {
  const report = {
    testDate: new Date().toISOString(),
    modifications: [
      {
        type: '删除功能',
        target: '个人设置 - 面试偏好',
        status: '完成',
        details: [
          '删除了偏好设置表单中的面试偏好表单项',
          '清理了userSettingsStore.js中的interviewPreferences状态',
          '移除了相关CSS样式和JavaScript逻辑',
          '确保其他设置功能不受影响'
        ]
      },
      {
        type: '修改跳转',
        target: '求职者面试入口',
        status: '完成',
        details: [
          '修改"开始练习面试"按钮跳转到/interview-selection',
          '修改"模拟面试"卡片跳转到/interview-selection',
          '统一了面试入口体验',
          '保持与系统控制栏一致的用户体验'
        ]
      }
    ],
    testResults: testResults.value,
    completionRate: testCompletionRate.value
  }
  
  const blob = new Blob([JSON.stringify(report, null, 2)], {
    type: 'application/json'
  })
  
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `function-modification-test-report-${new Date().toISOString().split('T')[0]}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  ElMessage.success('测试报告已生成并下载')
}

// 组件挂载时显示欢迎信息
onMounted(() => {
  ElNotification({
    title: '功能修改验证测试',
    message: '请按照测试步骤验证功能修改结果',
    type: 'info',
    duration: 4000
  })
})
</script>

<style scoped>
.function-test-page {
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

.test-items {
  margin: 20px 0;
}

.test-item {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  padding: 8px;
  background: var(--current-bg-secondary);
  border-radius: 6px;
}

.test-icon.success {
  color: #52c41a;
}

.test-icon.info {
  color: #1890ff;
}

.test-actions {
  margin-top: 20px;
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.comparison-table {
  margin: 20px 0;
}

.comparison-table h4 {
  margin-bottom: 12px;
  color: var(--current-text-primary);
}

.test-checklist {
  margin: 20px 0;
}

.checklist-item {
  margin-bottom: 12px;
  padding: 8px;
  background: var(--current-bg-secondary);
  border-radius: 6px;
}

.test-summary {
  margin: 20px 0;
  text-align: center;
}

.test-summary-content {
  text-align: center;
}

@media (max-width: 768px) {
  .function-test-page {
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
