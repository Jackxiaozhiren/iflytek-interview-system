<template>
  <div class="feature-test-page">
    <div class="test-container">
      <h1>学习路径详情页面功能测试</h1>
      <p>测试所有新增功能是否正常工作</p>
      
      <div class="test-sections">
        <!-- 测试1：学习模块路由 -->
        <el-card class="test-card">
          <template #header>
            <h3>测试1：学习模块路由功能</h3>
          </template>
          
          <div class="test-content">
            <p>测试学习模块详情页面的路由跳转功能</p>
            <div class="test-buttons">
              <el-button type="primary" @click="testModuleRoute('study')">
                测试开始学习路由
              </el-button>
              <el-button type="warning" @click="testModuleRoute('continue')">
                测试继续学习路由
              </el-button>
              <el-button type="success" @click="testModuleRoute('review')">
                测试复习回顾路由
              </el-button>
            </div>
          </div>
        </el-card>

        <!-- 测试2：资源预览功能 -->
        <el-card class="test-card">
          <template #header>
            <h3>测试2：推荐学习资源功能</h3>
          </template>
          
          <div class="test-content">
            <p>测试不同类型资源的预览和操作功能</p>
            <div class="test-buttons">
              <el-button @click="testResourcePreview('video')">
                测试视频资源
              </el-button>
              <el-button @click="testResourcePreview('document')">
                测试文档资源
              </el-button>
              <el-button @click="testResourcePreview('project')">
                测试项目资源
              </el-button>
              <el-button @click="testResourcePreview('practice')">
                测试练习资源
              </el-button>
            </div>
          </div>
        </el-card>

        <!-- 测试3：个人设置功能 -->
        <el-card class="test-card">
          <template #header>
            <h3>测试3：个人设置功能</h3>
          </template>
          
          <div class="test-content">
            <p>测试个人设置页面的各项功能</p>
            <div class="test-buttons">
              <el-button type="primary" @click="testPersonalSettings">
                打开个人设置页面
              </el-button>
              <el-button @click="testCandidatePortal">
                测试候选人门户跳转
              </el-button>
            </div>
          </div>
        </el-card>

        <!-- 测试4：技能发展路径可视化 -->
        <el-card class="test-card">
          <template #header>
            <h3>测试4：技能发展路径可视化</h3>
          </template>
          
          <div class="test-content">
            <p>测试技能进度条的优化显示效果</p>
            <div class="skill-demo">
              <div class="skill-item-demo">
                <div class="skill-info-demo">
                  <h4>Python基础</h4>
                  <div class="skill-levels-demo">
                    <span class="current-level">当前: 85%</span>
                    <span class="target-level">目标: 95%</span>
                    <span class="gap-level">差距: 10%</span>
                  </div>
                </div>
                <div class="skill-bar-demo">
                  <el-progress 
                    :percentage="95" 
                    :stroke-width="12"
                    color="#e6f7ff"
                    :show-text="false"
                  />
                  <div class="current-progress-demo">
                    <el-progress 
                      :percentage="85" 
                      :stroke-width="12"
                      color="#1890ff"
                      :show-text="false"
                    />
                  </div>
                  <div class="target-marker-demo" style="left: 95%">
                    <div class="marker-line-demo"></div>
                    <div class="marker-label-demo">95%</div>
                  </div>
                </div>
                <div class="skill-suggestion-demo">
                  <el-icon><InfoFilled /></el-icon>
                  <span>您已接近目标水平，继续保持！</span>
                </div>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 测试结果显示 -->
        <el-card class="test-card">
          <template #header>
            <h3>测试结果</h3>
          </template>
          
          <div class="test-results">
            <div v-for="result in testResults" :key="result.id" class="result-item">
              <el-tag :type="result.status === 'success' ? 'success' : result.status === 'error' ? 'danger' : 'info'">
                {{ result.name }}
              </el-tag>
              <span class="result-message">{{ result.message }}</span>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 资源预览弹窗 -->
    <ResourcePreviewModal
      v-model="showResourcePreview"
      :resource="selectedResource"
      @action="handleResourceAction"
    />
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { InfoFilled } from '@element-plus/icons-vue'
import ResourcePreviewModal from '../components/ResourcePreviewModal.vue'

const router = useRouter()

// 测试数据
const showResourcePreview = ref(false)
const selectedResource = ref({})
const testResults = reactive([])

// 测试资源数据
const testResources = {
  video: {
    id: 'test-video',
    name: '测试视频教程',
    type: 'video',
    description: '这是一个测试视频资源',
    duration: '30分钟',
    quality: '1080P',
    size: '500MB',
    videoUrl: 'https://example.com/test-video.mp4'
  },
  document: {
    id: 'test-doc',
    name: '测试文档资料',
    type: 'document',
    description: '这是一个测试文档资源',
    format: 'PDF',
    pages: '50',
    size: '5MB',
    downloadUrl: 'https://example.com/test-doc.pdf',
    previewContent: '<h3>文档预览</h3><p>这是文档的预览内容...</p>'
  },
  project: {
    id: 'test-project',
    name: '测试项目案例',
    type: 'project',
    description: '这是一个测试项目资源',
    technologies: ['Vue.js', 'Element Plus', 'JavaScript'],
    features: ['响应式设计', '组件化开发', '状态管理'],
    projectUrl: 'https://github.com/example/test-project'
  },
  practice: {
    id: 'test-practice',
    name: '测试练习题库',
    type: 'practice',
    description: '这是一个测试练习资源',
    difficulty: 'medium',
    questionCount: 20,
    estimatedTime: '2小时',
    topics: ['基础语法', '算法思维', '代码实现']
  }
}

// 测试方法
const testModuleRoute = (mode) => {
  const pathId = 'test-path'
  const moduleId = 'test-module'
  const route = `/learning-path/${pathId}/module/${moduleId}/${mode}`
  
  addTestResult(`模块路由测试-${mode}`, `尝试跳转到: ${route}`, 'success')
  
  try {
    router.push(route)
    ElMessage.success(`成功跳转到${mode}模式`)
  } catch (error) {
    addTestResult(`模块路由测试-${mode}`, `跳转失败: ${error.message}`, 'error')
    ElMessage.error('路由跳转失败')
  }
}

const testResourcePreview = (type) => {
  selectedResource.value = testResources[type]
  showResourcePreview.value = true
  addTestResult(`资源预览测试-${type}`, `成功打开${type}类型资源预览`, 'success')
}

const testPersonalSettings = () => {
  try {
    router.push('/personal-settings')
    addTestResult('个人设置测试', '成功跳转到个人设置页面', 'success')
    ElMessage.success('成功打开个人设置页面')
  } catch (error) {
    addTestResult('个人设置测试', `跳转失败: ${error.message}`, 'error')
    ElMessage.error('跳转失败')
  }
}

const testCandidatePortal = () => {
  try {
    router.push('/candidate')
    addTestResult('候选人门户测试', '成功跳转到候选人门户', 'success')
    ElMessage.success('成功打开候选人门户')
  } catch (error) {
    addTestResult('候选人门户测试', `跳转失败: ${error.message}`, 'error')
    ElMessage.error('跳转失败')
  }
}

const handleResourceAction = (action) => {
  addTestResult('资源操作测试', `执行操作: ${action.type}`, 'success')
  ElMessage.success(`资源操作测试成功: ${action.type}`)
}

const addTestResult = (name, message, status) => {
  testResults.push({
    id: Date.now(),
    name,
    message,
    status,
    timestamp: new Date().toLocaleTimeString()
  })
}
</script>

<style scoped>
.feature-test-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%);
  padding: 24px;
}

.test-container {
  max-width: 1200px;
  margin: 0 auto;
}

.test-container h1 {
  text-align: center;
  color: #1890ff;
  margin-bottom: 8px;
}

.test-container p {
  text-align: center;
  color: #666;
  margin-bottom: 32px;
}

.test-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.test-card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.test-card h3 {
  color: #1890ff;
  margin: 0;
}

.test-content {
  padding: 16px 0;
}

.test-buttons {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 16px;
}

.skill-demo {
  margin-top: 16px;
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
}

.skill-item-demo {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skill-info-demo {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.skill-info-demo h4 {
  margin: 0;
  color: #262626;
}

.skill-levels-demo {
  display: flex;
  gap: 12px;
  font-size: 12px;
}

.current-level {
  color: #1890ff;
  font-weight: 600;
}

.target-level {
  color: #52c41a;
  font-weight: 600;
}

.gap-level {
  color: #fa8c16;
  font-weight: 600;
}

.skill-bar-demo {
  position: relative;
  height: 20px;
}

.current-progress-demo {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
}

.target-marker-demo {
  position: absolute;
  top: -2px;
  transform: translateX(-50%);
  z-index: 3;
}

.marker-line-demo {
  width: 3px;
  height: 24px;
  background: #52c41a;
  border-radius: 2px;
}

.marker-label-demo {
  position: absolute;
  top: -24px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 10px;
  color: #52c41a;
  font-weight: 600;
  background: white;
  padding: 2px 4px;
  border-radius: 3px;
  border: 1px solid #52c41a;
}

.skill-suggestion-demo {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #666;
  background: white;
  padding: 8px 12px;
  border-radius: 6px;
  border-left: 3px solid #1890ff;
}

.test-results {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 6px;
}

.result-message {
  font-size: 14px;
  color: #666;
}
</style>
