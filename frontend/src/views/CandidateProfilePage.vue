<template>
  <div class="candidate-profile-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-container">
        <div class="header-content">
          <div class="page-title">
            <el-icon class="title-icon"><User /></el-icon>
            <h1>个人设置</h1>
          </div>
          <p class="page-subtitle">管理您的个人信息和面试偏好设置</p>
        </div>
        <div class="header-actions">
          <el-button @click="$router.back()">
            <el-icon><ArrowLeft /></el-icon>
            返回
          </el-button>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="page-content">
      <div class="content-container">
        <div class="profile-layout">
          <!-- 左侧导航 -->
          <div class="profile-sidebar">
            <div class="sidebar-menu">
              <div 
                v-for="tab in profileTabs" 
                :key="tab.id"
                class="menu-item"
                :class="{ active: activeTab === tab.id }"
                @click="activeTab = tab.id"
              >
                <el-icon><component :is="tab.icon" /></el-icon>
                <span>{{ tab.title }}</span>
              </div>
            </div>
          </div>

          <!-- 右侧内容 -->
          <div class="profile-content">
            <!-- 基本信息 -->
            <div v-if="activeTab === 'basic'" class="content-section">
              <div class="section-header">
                <h2>基本信息</h2>
                <p>完善您的个人基本信息</p>
              </div>
              
              <div class="profile-form">
                <div class="avatar-section">
                  <el-avatar :size="80" :src="profileData.avatar" />
                  <div class="avatar-actions">
                    <el-upload
                      ref="avatarUpload"
                      :show-file-list="false"
                      :before-upload="beforeAvatarUpload"
                      :on-success="handleAvatarSuccess"
                      :on-error="handleAvatarError"
                      action="#"
                      :auto-upload="false"
                      accept="image/*"
                    >
                      <el-button size="small" @click="selectAvatar">
                        <el-icon><Camera /></el-icon>
                        更换头像
                      </el-button>
                    </el-upload>
                  </div>
                </div>
                
                <el-form :model="profileData" label-width="100px" class="form-content">
                  <el-form-item label="姓名">
                    <el-input v-model="profileData.name" placeholder="请输入您的姓名" />
                  </el-form-item>
                  <el-form-item label="邮箱">
                    <el-input v-model="profileData.email" placeholder="请输入邮箱地址" />
                  </el-form-item>
                  <el-form-item label="手机号">
                    <el-input v-model="profileData.phone" placeholder="请输入手机号码" />
                  </el-form-item>
                  <el-form-item label="所在城市">
                    <el-select v-model="profileData.city" placeholder="请选择城市" filterable>
                      <el-option-group label="一线城市">
                        <el-option label="北京" value="beijing" />
                        <el-option label="上海" value="shanghai" />
                        <el-option label="广州" value="guangzhou" />
                        <el-option label="深圳" value="shenzhen" />
                      </el-option-group>
                      <el-option-group label="新一线城市">
                        <el-option label="成都" value="chengdu" />
                        <el-option label="重庆" value="chongqing" />
                        <el-option label="杭州" value="hangzhou" />
                        <el-option label="武汉" value="wuhan" />
                        <el-option label="西安" value="xian" />
                        <el-option label="天津" value="tianjin" />
                        <el-option label="苏州" value="suzhou" />
                        <el-option label="南京" value="nanjing" />
                        <el-option label="郑州" value="zhengzhou" />
                        <el-option label="长沙" value="changsha" />
                        <el-option label="东莞" value="dongguan" />
                        <el-option label="沈阳" value="shenyang" />
                        <el-option label="青岛" value="qingdao" />
                        <el-option label="合肥" value="hefei" />
                        <el-option label="佛山" value="foshan" />
                      </el-option-group>
                      <el-option-group label="二线城市">
                        <el-option label="厦门" value="xiamen" />
                        <el-option label="福州" value="fuzhou" />
                        <el-option label="无锡" value="wuxi" />
                        <el-option label="大连" value="dalian" />
                        <el-option label="昆明" value="kunming" />
                        <el-option label="哈尔滨" value="haerbin" />
                        <el-option label="济南" value="jinan" />
                        <el-option label="宁波" value="ningbo" />
                        <el-option label="温州" value="wenzhou" />
                        <el-option label="石家庄" value="shijiazhuang" />
                        <el-option label="长春" value="changchun" />
                        <el-option label="泉州" value="quanzhou" />
                        <el-option label="贵阳" value="guiyang" />
                        <el-option label="南宁" value="nanning" />
                        <el-option label="金华" value="jinhua" />
                        <el-option label="常州" value="changzhou" />
                        <el-option label="南昌" value="nanchang" />
                        <el-option label="惠州" value="huizhou" />
                        <el-option label="嘉兴" value="jiaxing" />
                        <el-option label="太原" value="taiyuan" />
                      </el-option-group>
                      <el-option-group label="其他城市">
                        <el-option label="兰州" value="lanzhou" />
                        <el-option label="台州" value="taizhou" />
                        <el-option label="徐州" value="xuzhou" />
                        <el-option label="保定" value="baoding" />
                        <el-option label="珠海" value="zhuhai" />
                        <el-option label="中山" value="zhongshan" />
                        <el-option label="海口" value="haikou" />
                        <el-option label="扬州" value="yangzhou" />
                        <el-option label="临沂" value="linyi" />
                        <el-option label="唐山" value="tangshan" />
                        <el-option label="乌鲁木齐" value="wulumuqi" />
                        <el-option label="银川" value="yinchuan" />
                        <el-option label="呼和浩特" value="huhehaote" />
                        <el-option label="西宁" value="xining" />
                        <el-option label="拉萨" value="lasa" />
                      </el-option-group>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="工作经验">
                    <el-select v-model="profileData.experience" placeholder="请选择工作经验">
                      <el-option label="应届毕业生" value="fresh" />
                      <el-option label="1-3年" value="1-3" />
                      <el-option label="3-5年" value="3-5" />
                      <el-option label="5-10年" value="5-10" />
                      <el-option label="10年以上" value="10+" />
                    </el-select>
                  </el-form-item>
                </el-form>
              </div>
            </div>

            <!-- 技能设置 -->
            <div v-if="activeTab === 'skills'" class="content-section">
              <div class="section-header">
                <h2>技能设置</h2>
                <p>管理您的专业技能和兴趣领域</p>
              </div>
              
              <div class="skills-management">
                <div class="skill-categories">
                  <div v-for="category in skillCategories" :key="category.id" class="category-section">
                    <h3>{{ category.title }}</h3>
                    <div class="skills-grid">
                      <div 
                        v-for="skill in category.skills" 
                        :key="skill.id"
                        class="skill-item"
                        :class="{ selected: selectedSkills.includes(skill.id) }"
                        @click="toggleSkill(skill.id)"
                      >
                        <span>{{ skill.name }}</span>
                        <el-icon v-if="selectedSkills.includes(skill.id)"><Check /></el-icon>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 面试偏好 -->
            <div v-if="activeTab === 'preferences'" class="content-section">
              <div class="section-header">
                <h2>面试偏好</h2>
                <p>设置您的面试相关偏好</p>
              </div>
              
              <el-form :model="preferences" label-width="120px" class="preferences-form">
                <el-form-item label="首选面试模式">
                  <el-radio-group v-model="preferences.interviewMode">
                    <el-radio label="text">文本面试</el-radio>
                    <el-radio label="voice">语音面试</el-radio>
                    <el-radio label="video">视频面试</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="难度偏好">
                  <el-radio-group v-model="preferences.difficulty">
                    <el-radio label="easy">简单</el-radio>
                    <el-radio label="medium">中等</el-radio>
                    <el-radio label="hard">困难</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item label="面试时长">
                  <el-select v-model="preferences.duration" placeholder="选择面试时长">
                    <el-option label="15分钟" value="15" />
                    <el-option label="30分钟" value="30" />
                    <el-option label="45分钟" value="45" />
                    <el-option label="60分钟" value="60" />
                  </el-select>
                </el-form-item>
                <el-form-item label="AI提示">
                  <el-switch v-model="preferences.aiHints" />
                  <span class="form-hint">开启后在面试中获得AI智能提示</span>
                </el-form-item>
                <el-form-item label="实时反馈">
                  <el-switch v-model="preferences.realTimeFeedback" />
                  <span class="form-hint">开启后获得实时面试表现反馈</span>
                </el-form-item>
              </el-form>
            </div>

            <!-- 隐私设置 -->
            <div v-if="activeTab === 'privacy'" class="content-section">
              <div class="section-header">
                <h2>隐私设置</h2>
                <p>管理您的隐私和数据设置</p>
              </div>
              
              <div class="privacy-settings">
                <div class="privacy-item">
                  <div class="privacy-info">
                    <h4>数据收集</h4>
                    <p>允许收集面试数据用于改进AI算法</p>
                  </div>
                  <el-switch v-model="privacy.dataCollection" />
                </div>
                <div class="privacy-item">
                  <div class="privacy-info">
                    <h4>语音录制</h4>
                    <p>允许录制语音用于语音分析和改进</p>
                  </div>
                  <el-switch v-model="privacy.voiceRecording" />
                </div>

                <div class="privacy-item">
                  <div class="privacy-info">
                    <h4>数据导出</h4>
                    <p>您可以随时导出您的个人数据</p>
                  </div>
                  <el-button size="small">导出数据</el-button>
                </div>
              </div>
            </div>

            <!-- 保存按钮 -->
            <div class="save-section">
              <el-button type="primary" size="large" @click="saveProfile">
                <el-icon><Check /></el-icon>
                保存设置
              </el-button>
              <el-button size="large" @click="resetForm">重置</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  User, ArrowLeft, Check, Setting, Lock, Star, Document, Camera
} from '@element-plus/icons-vue'

const router = useRouter()

// 响应式数据
const activeTab = ref('basic')

// 标签页配置
const profileTabs = reactive([
  { id: 'basic', title: '基本信息', icon: 'User' },
  { id: 'skills', title: '技能设置', icon: 'Star' },
  { id: 'preferences', title: '面试偏好', icon: 'Setting' },
  { id: 'privacy', title: '隐私设置', icon: 'Lock' }
])

// 个人资料数据
const profileData = reactive({
  name: '张三',
  email: 'zhangsan@example.com',
  phone: '138****8888',
  city: 'beijing',
  experience: '3-5',
  avatar: '/images/default-avatar.png'
})

// 技能分类
const skillCategories = reactive([
  {
    id: 'programming',
    title: '编程语言',
    skills: [
      { id: 'python', name: 'Python' },
      { id: 'java', name: 'Java' },
      { id: 'javascript', name: 'JavaScript' },
      { id: 'cpp', name: 'C++' },
      { id: 'go', name: 'Go' }
    ]
  },
  {
    id: 'frameworks',
    title: '框架技术',
    skills: [
      { id: 'vue', name: 'Vue.js' },
      { id: 'react', name: 'React' },
      { id: 'spring', name: 'Spring' },
      { id: 'django', name: 'Django' },
      { id: 'tensorflow', name: 'TensorFlow' }
    ]
  },
  {
    id: 'tools',
    title: '工具平台',
    skills: [
      { id: 'git', name: 'Git' },
      { id: 'docker', name: 'Docker' },
      { id: 'kubernetes', name: 'Kubernetes' },
      { id: 'aws', name: 'AWS' },
      { id: 'mysql', name: 'MySQL' }
    ]
  }
])

const selectedSkills = ref(['python', 'vue', 'git', 'tensorflow'])

// 面试偏好
const preferences = reactive({
  interviewMode: 'text',
  difficulty: 'medium',
  duration: '30',
  aiHints: true,
  realTimeFeedback: true
})

// 隐私设置
const privacy = reactive({
  dataCollection: true,
  voiceRecording: true
})

// 方法
const toggleSkill = (skillId) => {
  const index = selectedSkills.value.indexOf(skillId)
  if (index > -1) {
    selectedSkills.value.splice(index, 1)
  } else {
    selectedSkills.value.push(skillId)
  }
}

const saveProfile = () => {
  ElMessage.success('设置保存成功！')
  // 这里可以调用API保存数据
}

const resetForm = () => {
  ElMessage.info('已重置为默认设置')
  // 重置表单数据
}

// 头像上传相关方法
const avatarUpload = ref(null)

const selectAvatar = () => {
  // 触发文件选择
  const input = document.createElement('input')
  input.type = 'file'
  input.accept = 'image/*'
  input.onchange = (event) => {
    const file = event.target.files[0]
    if (file) {
      handleAvatarFile(file)
    }
  }
  input.click()
}

const beforeAvatarUpload = (file) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    return false
  }
  return true
}

const handleAvatarFile = (file) => {
  if (!beforeAvatarUpload(file)) {
    return
  }

  // 创建预览
  const reader = new FileReader()
  reader.onload = (e) => {
    profileData.avatar = e.target.result
    ElMessage.success('头像更换成功!')
  }
  reader.readAsDataURL(file)
}

const handleAvatarSuccess = (response, file) => {
  profileData.avatar = URL.createObjectURL(file.raw)
  ElMessage.success('头像上传成功!')
}

const handleAvatarError = (error) => {
  console.error('头像上传失败:', error)
  ElMessage.error('头像上传失败，请重试')
}
</script>

<style scoped>
.candidate-profile-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.page-header {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 20px 0;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.page-title {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.title-icon {
  font-size: 28px;
  color: #1890ff;
}

.page-title h1 {
  margin: 0;
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
}

.page-subtitle {
  margin: 0;
  color: #666;
  font-size: 16px;
}

.page-content {
  padding: 40px 0;
}

.content-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

.profile-layout {
  display: grid;
  grid-template-columns: 250px 1fr;
  gap: 30px;
}

.profile-sidebar {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  height: fit-content;
}

.sidebar-menu {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #666;
}

.menu-item:hover {
  background: #f0f9ff;
  color: #1890ff;
}

.menu-item.active {
  background: #1890ff;
  color: white;
}

.profile-content {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 32px;
}

.section-header {
  margin-bottom: 32px;
}

.section-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.section-header p {
  color: #666;
  margin: 0;
}

.avatar-section {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
}

.form-content {
  max-width: 500px;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
  margin-bottom: 24px;
}

.skill-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 12px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.skill-item:hover {
  border-color: #1890ff;
}

.skill-item.selected {
  background: #1890ff;
  color: white;
  border-color: #1890ff;
}

.category-section {
  margin-bottom: 32px;
}

.category-section h3 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.preferences-form {
  max-width: 500px;
}

.form-hint {
  margin-left: 12px;
  font-size: 12px;
  color: #999;
}

.privacy-settings {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.privacy-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.privacy-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.privacy-info p {
  color: #666;
  margin: 0;
  font-size: 14px;
}

.save-section {
  margin-top: 40px;
  padding-top: 24px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  gap: 16px;
}

@media (max-width: 768px) {
  .profile-layout {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  
  .sidebar-menu {
    flex-direction: row;
    overflow-x: auto;
  }
  
  .menu-item {
    white-space: nowrap;
  }
}
</style>
