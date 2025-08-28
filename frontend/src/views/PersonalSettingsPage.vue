<template>
  <div class="personal-settings">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item @click="router.push('/candidate')">求职者中心</el-breadcrumb-item>
            <el-breadcrumb-item>个人设置</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="settings-header">
          <div class="header-info">
            <h1>个人设置</h1>
            <p>管理您的个人信息和偏好设置</p>
          </div>
          
          <div class="header-actions">
            <el-button @click="router.back()">返回</el-button>
            <el-button @click="resetSettings" :disabled="!getters.hasUnsavedChanges.value">
              <el-icon><Refresh /></el-icon>
              重置设置
            </el-button>
            <el-button type="primary" @click="saveAllSettings" :loading="Object.values(loading).some(Boolean)">
              <el-icon><Check /></el-icon>
              保存所有设置
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 设置内容 -->
    <div class="settings-content">
      <div class="settings-container">
        <!-- 左侧导航 -->
        <div class="settings-nav">
          <el-menu
            v-model="activeTab"
            mode="vertical"
            class="settings-menu"
            @select="handleTabChange"
          >
            <el-menu-item index="profile">
              <el-icon><User /></el-icon>
              <span>基本信息</span>
            </el-menu-item>
            <el-menu-item index="preferences">
              <el-icon><Setting /></el-icon>
              <span>偏好设置</span>
            </el-menu-item>
            <el-menu-item index="account">
              <el-icon><Lock /></el-icon>
              <span>账户安全</span>
            </el-menu-item>
            <el-menu-item index="notifications">
              <el-icon><Bell /></el-icon>
              <span>通知设置</span>
            </el-menu-item>
            <el-menu-item index="privacy">
              <el-icon><View /></el-icon>
              <span>隐私设置</span>
            </el-menu-item>
          </el-menu>
        </div>

        <!-- 右侧设置面板 -->
        <div class="settings-panel">
          <!-- 基本信息 -->
          <div v-show="activeTab === 'profile'" class="settings-section">
            <el-card class="section-card">
              <template #header>
                <div class="card-header">
                  <el-icon><User /></el-icon>
                  <span>基本信息</span>
                </div>
              </template>
              
              <el-form ref="profileFormRef" :model="profileForm" :rules="profileRules" label-width="120px" class="profile-form">
                <div class="avatar-section">
                  <div class="avatar-upload">
                    <el-avatar :size="80" :src="profileForm.avatar" class="user-avatar">
                      <el-icon><User /></el-icon>
                    </el-avatar>
                    <el-upload
                      :show-file-list="false"
                      :before-upload="handleAvatarUpload"
                      accept="image/*"
                      :disabled="loading.avatar"
                    >
                      <el-button size="small" :loading="loading.avatar">
                        <el-icon><Camera /></el-icon>
                        {{ loading.avatar ? '上传中...' : '更换头像' }}
                      </el-button>
                    </el-upload>
                  </div>
                  <p class="help-text">支持 JPG、PNG 格式，文件大小不超过 2MB</p>
                </div>

                <el-form-item label="姓名" prop="name">
                  <el-input v-model="profileForm.name" placeholder="请输入您的姓名" clearable />
                </el-form-item>

                <el-form-item label="邮箱" prop="email">
                  <el-input v-model="profileForm.email" placeholder="请输入邮箱地址" clearable />
                </el-form-item>
                
                <el-form-item label="手机号" prop="phone">
                  <el-input v-model="profileForm.phone" placeholder="请输入手机号码" clearable />
                </el-form-item>

                <el-form-item label="职位">
                  <el-input v-model="profileForm.position" placeholder="请输入当前职位" clearable />
                </el-form-item>

                <el-form-item label="工作经验">
                  <el-select v-model="profileForm.experience" placeholder="请选择工作经验" style="width: 100%;">
                    <el-option label="应届毕业生" value="0年" />
                    <el-option label="1-3年" value="1-3年" />
                    <el-option label="3-5年" value="3-5年" />
                    <el-option label="5-10年" value="5-10年" />
                    <el-option label="10年以上" value="10年以上" />
                  </el-select>
                </el-form-item>

                <el-form-item label="技能领域">
                  <el-select v-model="profileForm.skills" multiple placeholder="请选择技能领域" style="width: 100%;">
                    <el-option label="人工智能" value="人工智能" />
                    <el-option label="大数据" value="大数据" />
                    <el-option label="物联网" value="物联网" />
                    <el-option label="前端开发" value="前端开发" />
                    <el-option label="后端开发" value="后端开发" />
                    <el-option label="移动开发" value="移动开发" />
                    <el-option label="数据分析" value="数据分析" />
                    <el-option label="云计算" value="云计算" />
                  </el-select>
                </el-form-item>

                <el-form-item label="个人简介">
                  <el-input
                    v-model="profileForm.bio"
                    type="textarea"
                    :rows="4"
                    placeholder="请简单介绍一下自己的技能特长和工作经验..."
                    maxlength="500"
                    show-word-limit
                  />
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="saveProfile" :loading="loading.profile">
                    <el-icon><Check /></el-icon>
                    保存个人资料
                  </el-button>
                  <el-button @click="profileFormRef?.resetFields()">
                    <el-icon><Refresh /></el-icon>
                    重置
                  </el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </div>

          <!-- 偏好设置 -->
          <div v-show="activeTab === 'preferences'" class="settings-section">
            <el-card class="section-card">
              <template #header>
                <div class="card-header">
                  <el-icon><Setting /></el-icon>
                  <span>偏好设置</span>
                </div>
              </template>
              
              <el-form :model="preferencesForm" label-width="150px" class="preferences-form">
                <el-form-item label="界面主题">
                  <div class="theme-selection">
                    <el-radio-group v-model="preferencesForm.theme" @change="previewTheme">
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
                    <p class="help-text">当前主题: {{ getters.effectiveTheme.value === 'light' ? '浅色' : '深色' }}</p>
                  </div>
                </el-form-item>

                <el-form-item label="字体大小">
                  <div class="font-size-selection">
                    <el-radio-group v-model="preferencesForm.fontSize" @change="previewFontSize">
                      <el-radio label="small">小号字体</el-radio>
                      <el-radio label="medium">中号字体</el-radio>
                      <el-radio label="large">大号字体</el-radio>
                    </el-radio-group>
                    <p class="help-text">字体大小会影响整个应用的文字显示</p>
                  </div>
                </el-form-item>

                <el-form-item label="语言设置">
                  <el-select v-model="preferencesForm.language" placeholder="请选择语言" style="width: 200px;">
                    <el-option label="简体中文" value="zh-CN" />
                    <el-option label="繁体中文" value="zh-TW" />
                    <el-option label="English" value="en-US" />
                  </el-select>
                </el-form-item>
                


                <el-form-item label="难度偏好">
                  <el-radio-group v-model="preferencesForm.difficulty">
                    <el-radio label="beginner">初级</el-radio>
                    <el-radio label="intermediate">中级</el-radio>
                    <el-radio label="advanced">高级</el-radio>
                  </el-radio-group>
                  <p class="help-text">系统将根据您的难度偏好推荐合适的题目</p>
                </el-form-item>

                <el-form-item label="自动保存">
                  <el-switch
                    v-model="preferencesForm.autoSave"
                    active-text="开启"
                    inactive-text="关闭"
                  />
                  <p class="help-text">自动保存您的答题进度和设置</p>
                </el-form-item>

                <el-form-item label="音效提示">
                  <el-switch
                    v-model="preferencesForm.soundEffects"
                    active-text="开启"
                    inactive-text="关闭"
                  />
                  <p class="help-text">开启操作音效和提示音</p>
                </el-form-item>

                <el-form-item label="学习提醒">
                  <el-switch
                    v-model="preferencesForm.learningReminder"
                    active-text="开启"
                    inactive-text="关闭"
                  />
                  <p class="help-text">定期提醒您进行学习和练习</p>
                </el-form-item>

                <el-form-item label="面试提醒">
                  <el-switch
                    v-model="preferencesForm.interviewReminder"
                    active-text="开启"
                    inactive-text="关闭"
                  />
                  <p class="help-text">面试前发送提醒通知</p>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="savePreferences" :loading="loading.preferences">
                    <el-icon><Check /></el-icon>
                    保存偏好设置
                  </el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </div>

          <!-- 账户安全 -->
          <div v-show="activeTab === 'account'" class="settings-section">
            <el-card class="section-card">
              <template #header>
                <div class="card-header">
                  <el-icon><Lock /></el-icon>
                  <span>账户安全</span>
                </div>
              </template>
              
              <el-form ref="accountFormRef" :model="accountForm" :rules="passwordRules" label-width="120px" class="account-form">
                <el-alert
                  title="密码安全提示"
                  description="为了您的账户安全，建议定期更换密码。新密码应包含大小写字母、数字和特殊字符。"
                  type="info"
                  :closable="false"
                  show-icon
                  style="margin-bottom: 24px;"
                />

                <el-form-item label="当前密码" prop="currentPassword">
                  <el-input
                    v-model="accountForm.currentPassword"
                    type="password"
                    placeholder="请输入当前密码"
                    show-password
                    clearable
                  />
                </el-form-item>

                <el-form-item label="新密码" prop="newPassword">
                  <el-input
                    v-model="accountForm.newPassword"
                    type="password"
                    placeholder="请输入新密码（至少8位，包含大小写字母、数字和特殊字符）"
                    show-password
                    clearable
                  />
                  <div class="password-strength" v-if="accountForm.newPassword">
                    <div class="strength-bar">
                      <div
                        class="strength-fill"
                        :class="getPasswordStrength(accountForm.newPassword).class"
                        :style="{ width: getPasswordStrength(accountForm.newPassword).width }"
                      ></div>
                    </div>
                    <span class="strength-text">
                      密码强度: {{ getPasswordStrength(accountForm.newPassword).text }}
                    </span>
                  </div>
                </el-form-item>

                <el-form-item label="确认密码" prop="confirmPassword">
                  <el-input
                    v-model="accountForm.confirmPassword"
                    type="password"
                    placeholder="请再次输入新密码"
                    show-password
                    clearable
                  />
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="changePassword" :loading="loading.account">
                    <el-icon><Lock /></el-icon>
                    修改密码
                  </el-button>
                  <el-button @click="accountFormRef?.resetFields()">
                    <el-icon><Refresh /></el-icon>
                    重置
                  </el-button>
                </el-form-item>
                
                <el-divider />
                
                <el-form-item label="两步验证">
                  <div class="two-factor-section">
                    <el-switch
                      v-model="accountForm.twoFactorEnabled"
                      active-text="已启用"
                      inactive-text="未启用"
                      @change="toggleTwoFactor"
                    />
                    <p class="help-text">启用两步验证可以提高账户安全性</p>
                  </div>
                </el-form-item>
                
                <el-form-item label="登录设备">
                  <div class="device-list">
                    <div v-for="device in loginDevices" :key="device.id" class="device-item">
                      <div class="device-info">
                        <strong>{{ device.name }}</strong>
                        <span class="device-time">{{ device.lastLogin }}</span>
                      </div>
                      <el-button size="small" type="danger" @click="removeDevice(device.id)">
                        移除
                      </el-button>
                    </div>
                  </div>
                </el-form-item>
              </el-form>
            </el-card>
          </div>

          <!-- 通知设置 -->
          <div v-show="activeTab === 'notifications'" class="settings-section">
            <el-card class="section-card">
              <template #header>
                <div class="card-header">
                  <el-icon><Bell /></el-icon>
                  <span>通知设置</span>
                </div>
              </template>
              
              <el-form :model="notificationForm" label-width="150px" class="notification-form">
                <div class="notification-summary">
                  <el-alert
                    :title="getters.notificationSummary.value"
                    type="info"
                    :closable="false"
                    show-icon
                  />
                </div>

                <el-form-item label="邮件通知">
                  <el-switch
                    v-model="notificationForm.email"
                    active-text="开启"
                    inactive-text="关闭"
                  />
                  <p class="help-text">接收重要通知和更新邮件</p>
                </el-form-item>

                <el-form-item label="短信通知">
                  <el-switch
                    v-model="notificationForm.sms"
                    active-text="开启"
                    inactive-text="关闭"
                  />
                  <p class="help-text">接收紧急通知短信</p>
                </el-form-item>

                <el-form-item label="浏览器推送">
                  <div class="browser-notification-section">
                    <el-switch
                      v-model="notificationForm.browser"
                      active-text="开启"
                      inactive-text="关闭"
                      @change="handleBrowserNotificationChange"
                    />
                    <div class="notification-status">
                      <span class="status-text" :class="notificationPermissionClass">
                        {{ notificationPermissionText }}
                      </span>
                      <el-button
                        v-if="showRequestPermissionButton"
                        size="small"
                        type="primary"
                        @click="requestNotificationPermission"
                      >
                        请求权限
                      </el-button>
                      <el-button
                        v-if="notificationPermission === 'granted'"
                        size="small"
                        @click="testNotification"
                      >
                        测试通知
                      </el-button>
                    </div>
                  </div>
                  <p class="help-text">在浏览器中显示桌面通知</p>
                </el-form-item>

                <el-form-item label="面试邀请通知">
                  <el-switch
                    v-model="notificationForm.interviewInvitation"
                    active-text="开启"
                    inactive-text="关闭"
                  />
                  <p class="help-text">收到面试邀请时通知</p>
                </el-form-item>

                <el-form-item label="学习进度通知">
                  <el-switch
                    v-model="notificationForm.learningProgress"
                    active-text="开启"
                    inactive-text="关闭"
                  />
                  <p class="help-text">学习进度更新提醒</p>
                </el-form-item>

                <el-form-item label="系统消息通知">
                  <el-switch
                    v-model="notificationForm.systemMessage"
                    active-text="开启"
                    inactive-text="关闭"
                  />
                  <p class="help-text">系统维护和更新通知</p>
                </el-form-item>

                <el-form-item label="营销邮件">
                  <el-switch
                    v-model="notificationForm.marketingEmails"
                    active-text="开启"
                    inactive-text="关闭"
                  />
                  <p class="help-text">接收产品推广和活动信息</p>
                </el-form-item>

                <el-form-item>
                  <el-button type="primary" @click="saveNotifications" :loading="loading.notifications">
                    <el-icon><Check /></el-icon>
                    保存通知设置
                  </el-button>
                </el-form-item>
              </el-form>
            </el-card>
          </div>

          <!-- 隐私设置 -->
          <div v-show="activeTab === 'privacy'" class="settings-section">
            <el-card class="section-card">
              <template #header>
                <div class="card-header">
                  <el-icon><View /></el-icon>
                  <span>隐私设置</span>
                </div>
              </template>
              
              <el-form :model="privacyForm" label-width="150px" class="privacy-form">
                <el-form-item label="个人资料可见性">
                  <el-radio-group v-model="privacyForm.profileVisibility">
                    <el-radio label="public">公开</el-radio>
                    <el-radio label="private">私密</el-radio>
                    <el-radio label="friends">仅好友可见</el-radio>
                  </el-radio-group>
                </el-form-item>
                
                <el-form-item label="学习记录可见性">
                  <el-radio-group v-model="privacyForm.learningVisibility">
                    <el-radio label="public">公开</el-radio>
                    <el-radio label="private">私密</el-radio>
                  </el-radio-group>
                </el-form-item>
                
                <el-form-item label="面试记录可见性">
                  <el-radio-group v-model="privacyForm.interviewVisibility">
                    <el-radio label="public">公开</el-radio>
                    <el-radio label="private">私密</el-radio>
                  </el-radio-group>
                </el-form-item>
                
                <el-form-item label="数据分析">
                  <el-switch
                    v-model="privacyForm.dataAnalytics"
                    active-text="允许"
                    inactive-text="禁止"
                  />
                  <p class="help-text">允许系统分析您的学习数据以提供个性化建议</p>
                </el-form-item>
                
                <el-form-item label="第三方数据共享">
                  <el-switch
                    v-model="privacyForm.thirdPartySharing"
                    active-text="允许"
                    inactive-text="禁止"
                  />
                  <p class="help-text">允许与合作伙伴共享匿名化数据</p>
                </el-form-item>
              </el-form>
            </el-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, ElNotification } from 'element-plus'
import { User, Setting, Lock, Bell, View, Check, Upload, Camera, Edit, Refresh } from '@element-plus/icons-vue'
import { useUserSettings } from '@/stores/userSettingsStore'
import notificationService from '@/utils/notificationService'

const router = useRouter()
const { state: userSettings, getters, actions, utils } = useUserSettings()

// 当前激活的标签页
const activeTab = ref('profile')

// 表单引用
const profileFormRef = ref(null)
const accountFormRef = ref(null)

// 加载状态
const loading = reactive({
  profile: false,
  preferences: false,
  account: false,
  notifications: false,
  privacy: false,
  avatar: false
})

// 基本信息表单
const profileForm = reactive({
  avatar: '',
  name: '张三',
  email: 'zhangsan@example.com',
  phone: '13800138000',
  position: '前端开发工程师',
  experience: '3-5年',
  skills: ['人工智能', '前端开发'],
  bio: '热爱技术，专注于前端开发和人工智能领域，具有丰富的项目经验...'
})

// 偏好设置表单（直接使用userSettings中的数据）
const preferencesForm = reactive({
  theme: userSettings.theme,
  language: userSettings.language,
  fontSize: userSettings.fontSize,
  difficulty: userSettings.preferences.difficulty,
  learningReminder: userSettings.preferences.learningReminder,
  interviewReminder: userSettings.preferences.interviewReminder,
  autoSave: userSettings.preferences.autoSave,
  soundEffects: userSettings.preferences.soundEffects
})

// 账户安全表单
const accountForm = reactive({
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
  twoFactorEnabled: userSettings.security.twoFactorEnabled,
  loginNotifications: userSettings.security.loginNotifications,
  sessionTimeout: userSettings.security.sessionTimeout
})

// 通知设置表单（直接使用userSettings中的数据）
const notificationForm = reactive({
  email: userSettings.notifications.email,
  sms: userSettings.notifications.sms,
  browser: userSettings.notifications.browser,
  interviewInvitation: userSettings.notifications.interviewInvitation,
  learningProgress: userSettings.notifications.learningProgress,
  systemMessage: userSettings.notifications.systemMessage,
  marketingEmails: userSettings.notifications.marketingEmails
})

// 隐私设置表单（直接使用userSettings中的数据）
const privacyForm = reactive({
  profileVisibility: userSettings.privacy.profileVisibility,
  learningVisibility: userSettings.privacy.learningVisibility,
  interviewVisibility: userSettings.privacy.interviewVisibility,
  dataAnalytics: userSettings.privacy.dataAnalytics,
  thirdPartySharing: userSettings.privacy.thirdPartySharing
})

// 登录设备列表
const loginDevices = ref([
  {
    id: 1,
    name: 'Chrome on Windows',
    lastLogin: '2024-01-15 14:30',
    current: true
  },
  {
    id: 2,
    name: 'Safari on iPhone',
    lastLogin: '2024-01-14 09:15',
    current: false
  }
])

// 通知权限状态
const notificationPermission = ref('default')
const showRequestPermissionButton = ref(false)

// 计算属性：通知权限状态类名
const notificationPermissionClass = computed(() => {
  switch (notificationPermission.value) {
    case 'granted':
      return 'status-granted'
    case 'denied':
      return 'status-denied'
    default:
      return 'status-default'
  }
})

// 计算属性：通知权限状态文本
const notificationPermissionText = computed(() => {
  switch (notificationPermission.value) {
    case 'granted':
      return '✅ 已授权'
    case 'denied':
      return '❌ 已拒绝'
    case 'unsupported':
      return '⚠️ 不支持'
    default:
      return '⏳ 未授权'
  }
})

// 表单验证规则
const profileRules = {
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度在 2 到 20 个字符', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号', trigger: 'blur' }
  ]
}

const passwordRules = {
  currentPassword: [
    { required: true, message: '请输入当前密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 8, message: '密码长度不能少于8位', trigger: 'blur' },
    {
      pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      message: '密码必须包含大小写字母、数字和特殊字符',
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule, value, callback) => {
        if (value !== accountForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 方法
const handleTabChange = (key) => {
  activeTab.value = key
  // 保存当前标签页状态
  localStorage.setItem('settings-active-tab', key)
}

// 头像上传处理
const handleAvatarUpload = (file) => {
  loading.avatar = true

  // 验证文件类型和大小
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    loading.avatar = false
    return false
  }

  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB!')
    loading.avatar = false
    return false
  }

  // 模拟上传过程
  setTimeout(() => {
    const reader = new FileReader()
    reader.onload = (e) => {
      profileForm.avatar = e.target.result
      ElMessage.success('头像上传成功')
      loading.avatar = false
    }
    reader.readAsDataURL(file)
  }, 1000)

  return false // 阻止自动上传
}

// 保存个人资料
const saveProfile = async () => {
  if (!profileFormRef.value) return

  try {
    await profileFormRef.value.validate()
    loading.profile = true

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 更新用户设置中的个人信息
    actions.updateSettings({
      profile: { ...profileForm }
    })

    ElNotification({
      title: '保存成功',
      message: '个人资料已更新',
      type: 'success'
    })
  } catch (error) {
    console.error('个人资料保存失败:', error)
    ElMessage.error('个人资料保存失败')
  } finally {
    loading.profile = false
  }
}

// 保存偏好设置
const savePreferences = () => {
  loading.preferences = true

  try {
    // 更新用户设置
    actions.updateSettings({
      theme: preferencesForm.theme,
      language: preferencesForm.language,
      fontSize: preferencesForm.fontSize,
      preferences: {
        difficulty: preferencesForm.difficulty,
        learningReminder: preferencesForm.learningReminder,
        interviewReminder: preferencesForm.interviewReminder,
        autoSave: preferencesForm.autoSave,
        soundEffects: preferencesForm.soundEffects
      }
    })

    ElNotification({
      title: '保存成功',
      message: '偏好设置已更新',
      type: 'success'
    })
  } catch (error) {
    console.error('偏好设置保存失败:', error)
    ElMessage.error('偏好设置保存失败')
  } finally {
    loading.preferences = false
  }
}

// 修改密码
const changePassword = async () => {
  if (!accountFormRef.value) return

  try {
    await accountFormRef.value.validate()
    loading.account = true

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500))

    ElNotification({
      title: '密码修改成功',
      message: '请使用新密码重新登录',
      type: 'success'
    })

    // 清空表单
    accountForm.currentPassword = ''
    accountForm.newPassword = ''
    accountForm.confirmPassword = ''
  } catch (error) {
    console.error('密码修改失败:', error)
    ElMessage.error('密码修改失败')
  } finally {
    loading.account = false
  }
}

// 切换两步验证
const toggleTwoFactor = async (enabled) => {
  try {
    loading.account = true

    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 更新用户设置
    actions.updateSettings({
      security: {
        ...userSettings.security,
        twoFactorEnabled: enabled
      }
    })

    ElNotification({
      title: enabled ? '两步验证已启用' : '两步验证已关闭',
      message: enabled ? '您的账户安全性已提升' : '两步验证功能已关闭',
      type: 'success'
    })
  } catch (error) {
    console.error('两步验证设置失败:', error)
    ElMessage.error('两步验证设置失败')
    accountForm.twoFactorEnabled = !enabled // 回滚状态
  } finally {
    loading.account = false
  }
}

// 保存通知设置
const saveNotifications = () => {
  loading.notifications = true

  try {
    // 更新用户设置
    actions.updateSettings({
      notifications: { ...notificationForm }
    })

    ElNotification({
      title: '保存成功',
      message: '通知设置已更新',
      type: 'success'
    })
  } catch (error) {
    console.error('通知设置保存失败:', error)
    ElMessage.error('通知设置保存失败')
  } finally {
    loading.notifications = false
  }
}

// 保存隐私设置
const savePrivacy = () => {
  loading.privacy = true

  try {
    // 更新用户设置
    actions.updateSettings({
      privacy: { ...privacyForm }
    })

    ElNotification({
      title: '保存成功',
      message: '隐私设置已更新',
      type: 'success'
    })
  } catch (error) {
    console.error('隐私设置保存失败:', error)
    ElMessage.error('隐私设置保存失败')
  } finally {
    loading.privacy = false
  }
}

// 保存所有设置
const saveAllSettings = async () => {
  try {
    // 验证所有表单
    if (profileFormRef.value) {
      await profileFormRef.value.validate()
    }

    // 保存所有设置
    await Promise.all([
      saveProfile(),
      savePreferences(),
      saveNotifications(),
      savePrivacy()
    ])

    // 保存到本地存储
    actions.saveSettings()

    ElNotification({
      title: '保存成功',
      message: '所有设置已保存',
      type: 'success',
      duration: 3000
    })
  } catch (error) {
    console.error('设置保存失败:', error)
    ElMessage.error('部分设置保存失败，请检查表单内容')
  }
}

// 重置设置
const resetSettings = () => {
  ElMessageBox.confirm(
    '确定要重置所有设置为默认值吗？此操作不可撤销。',
    '重置设置',
    {
      confirmButtonText: '确定重置',
      cancelButtonText: '取消',
      type: 'warning',
      dangerouslyUseHTMLString: true
    }
  ).then(() => {
    actions.resetToDefaults()

    // 重新同步表单数据
    syncFormData()

    ElNotification({
      title: '重置成功',
      message: '所有设置已重置为默认值',
      type: 'success'
    })
  }).catch(() => {
    ElMessage.info('已取消重置操作')
  })
}

// 移除登录设备
const removeDevice = (deviceId) => {
  ElMessageBox.confirm('确定要移除此设备吗？', '确认操作', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))

      const index = loginDevices.value.findIndex(d => d.id === deviceId)
      if (index > -1) {
        loginDevices.value.splice(index, 1)
        ElMessage.success('设备已移除')
      }
    } catch (error) {
      ElMessage.error('设备移除失败')
    }
  }).catch(() => {
    ElMessage.info('已取消操作')
  })
}

// 同步表单数据
const syncFormData = () => {
  // 同步偏好设置
  Object.assign(preferencesForm, {
    theme: userSettings.theme,
    language: userSettings.language,
    fontSize: userSettings.fontSize,
    difficulty: userSettings.preferences.difficulty,
    learningReminder: userSettings.preferences.learningReminder,
    interviewReminder: userSettings.preferences.interviewReminder,
    autoSave: userSettings.preferences.autoSave,
    soundEffects: userSettings.preferences.soundEffects
  })

  // 同步通知设置
  Object.assign(notificationForm, userSettings.notifications)

  // 同步隐私设置
  Object.assign(privacyForm, userSettings.privacy)

  // 同步账户安全设置
  Object.assign(accountForm, {
    twoFactorEnabled: userSettings.security.twoFactorEnabled,
    loginNotifications: userSettings.security.loginNotifications,
    sessionTimeout: userSettings.security.sessionTimeout,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
}

// 实时预览主题变化
const previewTheme = (theme) => {
  actions.updateSettings({ theme })
}

// 实时预览字体大小变化
const previewFontSize = (fontSize) => {
  actions.updateSettings({ fontSize })
}

// 密码强度检查
const getPasswordStrength = (password) => {
  if (!password) return { text: '无', class: 'weak', width: '0%' }

  let score = 0
  const checks = {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /\d/.test(password),
    symbols: /[^A-Za-z0-9]/.test(password)
  }

  // 计算分数
  Object.values(checks).forEach(check => {
    if (check) score++
  })

  // 长度加分
  if (password.length >= 12) score += 1
  if (password.length >= 16) score += 1

  // 返回强度信息
  if (score <= 2) {
    return { text: '弱', class: 'weak', width: '25%' }
  } else if (score <= 4) {
    return { text: '中等', class: 'medium', width: '50%' }
  } else if (score <= 5) {
    return { text: '强', class: 'strong', width: '75%' }
  } else {
    return { text: '很强', class: 'very-strong', width: '100%' }
  }
}

// 处理浏览器通知开关变化
const handleBrowserNotificationChange = async (enabled) => {
  if (enabled && notificationPermission.value !== 'granted') {
    // 如果用户开启通知但没有权限，尝试请求权限
    const granted = await requestNotificationPermission()
    if (!granted) {
      // 如果权限被拒绝，关闭开关
      notificationForm.browser = false
      return
    }
  }

  // 更新设置
  actions.updateSettings({
    notifications: {
      ...userSettings.notifications,
      browser: enabled
    }
  })
}

// 请求通知权限
const requestNotificationPermission = async () => {
  try {
    const granted = await notificationService.requestPermission()
    updateNotificationPermissionStatus()
    return granted
  } catch (error) {
    console.error('请求通知权限失败:', error)
    ElMessage.error('请求通知权限失败')
    return false
  }
}

// 测试通知
const testNotification = () => {
  notificationService.testNotification()
}

// 更新通知权限状态
const updateNotificationPermissionStatus = () => {
  const permission = notificationService.checkPermission()
  notificationPermission.value = permission
  showRequestPermissionButton.value = permission === 'default'

  // 如果权限被拒绝，自动关闭浏览器通知开关
  if (permission === 'denied' && notificationForm.browser) {
    notificationForm.browser = false
    actions.updateSettings({
      notifications: {
        ...userSettings.notifications,
        browser: false
      }
    })
  }
}

// 组件挂载时初始化
onMounted(async () => {
  try {
    // 初始化用户设置
    await actions.initializeSettings()

    // 同步表单数据
    syncFormData()

    // 恢复上次的标签页状态
    const savedTab = localStorage.getItem('settings-active-tab')
    if (savedTab) {
      activeTab.value = savedTab
    }

    // 初始化通知权限状态
    updateNotificationPermissionStatus()

    // 显示欢迎提示
    ElNotification({
      title: '个人设置',
      message: '您可以在这里管理个人信息和偏好设置',
      type: 'info',
      duration: 3000
    })
  } catch (error) {
    console.error('个人设置页面初始化失败:', error)
    ElMessage.error('页面初始化失败，请刷新重试')
  }
})

// 监听设置变化，实时同步
watch(
  () => userSettings.theme,
  (newTheme) => {
    preferencesForm.theme = newTheme
  }
)

watch(
  () => userSettings.fontSize,
  (newFontSize) => {
    preferencesForm.fontSize = newFontSize
  }
)

// 监听表单变化，实时预览
watch(
  () => preferencesForm.theme,
  (newTheme) => {
    if (newTheme !== userSettings.theme) {
      previewTheme(newTheme)
    }
  }
)

watch(
  () => preferencesForm.fontSize,
  (newFontSize) => {
    if (newFontSize !== userSettings.fontSize) {
      previewFontSize(newFontSize)
    }
  }
)
</script>

<style scoped>
/* 页面整体样式 */
.personal-settings {
  min-height: 100vh;
  background: linear-gradient(135deg,
    rgba(24, 144, 255, 0.08) 0%,
    rgba(102, 126, 234, 0.06) 25%,
    rgba(0, 102, 204, 0.04) 50%,
    rgba(76, 81, 191, 0.06) 75%,
    rgba(118, 75, 162, 0.08) 100%
  );
  background-attachment: fixed;
  padding: 24px;
}

/* 页面头部 */
.page-header {
  margin-bottom: 32px;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.breadcrumb {
  margin-bottom: 24px;
}

.breadcrumb :deep(.el-breadcrumb__item) {
  font-size: 14px;
}

.breadcrumb :deep(.el-breadcrumb__inner) {
  color: #1890ff;
  cursor: pointer;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 32px;
}

.header-info h1 {
  font-size: 28px;
  font-weight: 700;
  color: #262626;
  margin: 0 0 8px 0;
}

.header-info p {
  font-size: 16px;
  color: #666;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

/* 设置内容 */
.settings-content {
  max-width: 1200px;
  margin: 0 auto;
}

.settings-container {
  display: flex;
  gap: 32px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  overflow: hidden;
}

/* 左侧导航 */
.settings-nav {
  width: 240px;
  flex-shrink: 0;
  background: #fafafa;
  border-right: 1px solid #f0f0f0;
}

.settings-menu {
  border: none;
  background: transparent;
}

.settings-menu :deep(.el-menu-item) {
  height: 56px;
  line-height: 56px;
  padding: 0 24px;
  margin: 0;
  border-radius: 0;
  color: #666;
  font-size: 14px;
  font-weight: 500;
}

.settings-menu :deep(.el-menu-item:hover) {
  background: rgba(24, 144, 255, 0.08);
  color: #1890ff;
}

.settings-menu :deep(.el-menu-item.is-active) {
  background: rgba(24, 144, 255, 0.12);
  color: #1890ff;
  border-right: 3px solid #1890ff;
}

.settings-menu :deep(.el-menu-item .el-icon) {
  margin-right: 12px;
  font-size: 16px;
}

/* 右侧设置面板 */
.settings-panel {
  flex: 1;
  padding: 32px;
}

.settings-section {
  width: 100%;
}

.section-card {
  border: none;
  box-shadow: none;
  background: transparent;
}

.section-card :deep(.el-card__header) {
  padding: 0 0 24px 0;
  border-bottom: 1px solid #f0f0f0;
}

.section-card :deep(.el-card__body) {
  padding: 24px 0 0 0;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 20px;
  font-weight: 600;
  color: #1890ff;
}

/* 表单样式 */
.profile-form,
.preferences-form,
.account-form,
.notification-form,
.privacy-form {
  max-width: 600px;
}

.profile-form :deep(.el-form-item),
.preferences-form :deep(.el-form-item),
.account-form :deep(.el-form-item),
.notification-form :deep(.el-form-item),
.privacy-form :deep(.el-form-item) {
  margin-bottom: 24px;
}

.profile-form :deep(.el-form-item__label),
.preferences-form :deep(.el-form-item__label),
.account-form :deep(.el-form-item__label),
.notification-form :deep(.el-form-item__label),
.privacy-form :deep(.el-form-item__label) {
  font-weight: 500;
  color: #262626;
}

/* 头像上传区域 */
.avatar-section {
  margin-bottom: 32px;
  padding: 24px;
  background: var(--current-bg-secondary);
  border-radius: 12px;
  text-align: center;
  border: 2px dashed var(--current-border-primary);
  transition: all 0.3s ease;
}

.avatar-section:hover {
  border-color: var(--current-iflytek-primary);
  background: var(--current-bg-tertiary);
}

/* 主题选择样式 */
.theme-selection {
  margin-bottom: 16px;
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

/* 字体大小选择样式 */
.font-size-selection {
  margin-bottom: 16px;
}



/* 通知摘要样式 */
.notification-summary {
  margin-bottom: 24px;
}

/* 浏览器通知设置样式 */
.browser-notification-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.notification-status {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.status-text {
  font-size: 12px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 4px;
}

.status-granted {
  color: #52c41a;
  background: rgba(82, 196, 26, 0.1);
}

.status-denied {
  color: #ff4d4f;
  background: rgba(255, 77, 79, 0.1);
}

.status-default {
  color: #faad14;
  background: rgba(250, 173, 20, 0.1);
}

/* 帮助文本样式 */
.help-text {
  margin: 4px 0 0 0;
  font-size: 12px;
  color: var(--current-text-tertiary);
  line-height: 1.4;
}

/* 设备列表样式 */
.device-list {
  max-width: 500px;
}

.device-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  background: var(--current-bg-secondary);
  border: 1px solid var(--current-border-secondary);
  border-radius: 8px;
  margin-bottom: 8px;
}

.device-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.device-time {
  font-size: 12px;
  color: var(--current-text-tertiary);
}

/* 密码强度显示样式 */
.password-strength {
  margin-top: 8px;
}

.strength-bar {
  width: 100%;
  height: 4px;
  background: var(--current-border-secondary);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 4px;
}

.strength-fill {
  height: 100%;
  transition: width 0.3s ease, background-color 0.3s ease;
  border-radius: 2px;
}

.strength-fill.weak {
  background-color: #ff4d4f;
}

.strength-fill.medium {
  background-color: #faad14;
}

.strength-fill.strong {
  background-color: #52c41a;
}

.strength-fill.very-strong {
  background-color: #1890ff;
}

.strength-text {
  font-size: 12px;
  color: var(--current-text-tertiary);
}

/* 加载状态样式 */
.loading-overlay {
  position: relative;
}

.loading-overlay::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
}

/* 表单验证样式 */
.el-form-item.is-error .el-input__inner {
  border-color: var(--el-color-danger);
}

.el-form-item.is-success .el-input__inner {
  border-color: var(--el-color-success);
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .settings-container {
    gap: 16px;
  }

  .settings-nav {
    min-width: 200px;
  }
}

@media (max-width: 768px) {
  .personal-settings {
    padding: 0;
  }

  .page-header {
    padding: 16px;
    margin-bottom: 0;
  }

  .header-content {
    flex-direction: column;
    gap: 16px;
  }

  .settings-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .header-actions {
    width: 100%;
    flex-direction: row;
    gap: 8px;
  }

  .header-actions .el-button {
    flex: 1;
    min-width: 0;
  }

  .settings-container {
    flex-direction: column;
    padding: 16px;
    gap: 16px;
  }

  .settings-nav {
    width: 100%;
    margin-bottom: 0;
    order: 2;
  }

  .settings-menu {
    display: flex;
    overflow-x: auto;
    border-right: none;
    border-bottom: 1px solid var(--current-border-secondary);
    background: var(--current-bg-primary);
    padding: 0 8px;
  }

  .settings-menu .el-menu-item {
    flex-shrink: 0;
    min-width: 120px;
    text-align: center;
    border-right: none;
    border-bottom: 3px solid transparent;
    height: 48px;
    line-height: 48px;
  }

  .settings-menu .el-menu-item.is-active {
    border-right: none;
    border-bottom: 3px solid var(--current-iflytek-primary);
    background: var(--current-bg-tertiary);
  }

  .settings-panel {
    width: 100%;
    order: 1;
  }

  .profile-form,
  .preferences-form,
  .account-form,
  .notification-form,
  .privacy-form {
    max-width: 100%;
  }

  .profile-form :deep(.el-form-item__label),
  .preferences-form :deep(.el-form-item__label),
  .account-form :deep(.el-form-item__label),
  .notification-form :deep(.el-form-item__label),
  .privacy-form :deep(.el-form-item__label) {
    width: 100px !important;
    font-size: 14px;
  }

  .avatar-section {
    text-align: center;
    padding: 16px;
  }

  .avatar-upload {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .theme-selection .el-radio-group {
    flex-direction: column;
    gap: 12px;
  }

  .font-size-selection .el-radio-group {
    flex-direction: column;
    gap: 8px;
  }

  .device-list {
    max-width: 100%;
  }

  .device-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    padding: 12px;
  }

  .device-info {
    width: 100%;
  }

  .test-actions {
    flex-direction: column;
    gap: 8px;
  }

  .test-actions .el-button {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: 12px;
  }

  .settings-header h1 {
    font-size: 20px;
  }

  .settings-container {
    padding: 12px;
  }

  .section-card {
    margin-bottom: 12px;
  }

  .profile-form :deep(.el-form-item__label),
  .preferences-form :deep(.el-form-item__label),
  .account-form :deep(.el-form-item__label),
  .notification-form :deep(.el-form-item__label),
  .privacy-form :deep(.el-form-item__label) {
    width: 80px !important;
    font-size: 13px;
  }

  .settings-menu {
    padding: 0 4px;
  }

  .settings-menu .el-menu-item {
    min-width: 100px;
    font-size: 13px;
    padding: 0 8px;
  }

  .header-actions {
    flex-direction: column;
  }

  .header-actions .el-button {
    width: 100%;
  }

  .theme-option {
    font-size: 14px;
  }

  .help-text {
    font-size: 11px;
  }
}

/* 横屏适配 */
@media (max-width: 768px) and (orientation: landscape) {
  .settings-nav {
    order: 1;
  }

  .settings-panel {
    order: 2;
  }

  .settings-container {
    flex-direction: row;
    height: calc(100vh - 120px);
    overflow: hidden;
  }

  .settings-nav {
    width: 200px;
    height: 100%;
    overflow-y: auto;
  }

  .settings-menu {
    flex-direction: column;
    height: 100%;
    overflow-x: visible;
    overflow-y: auto;
  }

  .settings-panel {
    flex: 1;
    height: 100%;
    overflow-y: auto;
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .el-button {
    min-height: 44px;
  }

  .el-input__inner {
    min-height: 44px;
  }

  .el-switch {
    min-height: 44px;
    display: flex;
    align-items: center;
  }

  .settings-menu .el-menu-item {
    min-height: 48px;
  }

  .device-item .el-button {
    min-height: 36px;
    padding: 8px 16px;
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .theme-preview {
    border-width: 2px;
  }

  .strength-bar {
    border: 1px solid var(--current-text-primary);
  }

  .device-item {
    border-width: 2px;
  }
}

/* 减少动画模式支持 */
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }

  .strength-fill {
    transition: none;
  }
}

.avatar-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.user-avatar {
  border: 3px solid #1890ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.2);
}

/* 两步验证区域 */
.two-factor-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.help-text {
  font-size: 12px;
  color: #8c8c8c;
  margin: 0;
  line-height: 1.4;
}

/* 设备列表 */
.device-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.device-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.device-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.device-info strong {
  font-size: 14px;
  color: #262626;
}

.device-time {
  font-size: 12px;
  color: #8c8c8c;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .personal-settings {
    padding: 16px;
  }

  .settings-container {
    flex-direction: column;
    gap: 0;
  }

  .settings-nav {
    width: 100%;
  }

  .settings-menu {
    display: flex;
    overflow-x: auto;
  }

  .settings-menu :deep(.el-menu-item) {
    flex-shrink: 0;
    white-space: nowrap;
  }

  .settings-panel {
    padding: 24px 16px;
  }

  .settings-header {
    flex-direction: column;
    gap: 16px;
  }

  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }
}
</style>
