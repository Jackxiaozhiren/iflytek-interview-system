/**
 * 用户设置状态管理
 * 统一管理用户个人设置，包括主题、语言、字体大小、通知偏好等
 * 支持持久化存储和实时同步
 */

import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'

// 默认设置配置
const DEFAULT_SETTINGS = {
  // 界面设置
  theme: 'light', // light, dark, auto
  language: 'zh-CN',
  fontSize: 'medium', // small, medium, large
  
  // 个人信息
  profile: {
    avatar: '',
    name: '',
    email: '',
    phone: '',
    position: '',
    experience: '',
    skills: [],
    bio: ''
  },
  
  // 偏好设置
  preferences: {
    difficulty: 'intermediate',
    learningReminder: true,
    interviewReminder: true,
    autoSave: true,
    soundEffects: true
  },
  
  // 通知设置
  notifications: {
    email: true,
    sms: false,
    browser: true,
    interviewInvitation: true,
    learningProgress: true,
    systemMessage: true,
    marketingEmails: false
  },
  
  // 隐私设置
  privacy: {
    profileVisibility: 'public',
    learningVisibility: 'private',
    interviewVisibility: 'private',
    dataAnalytics: true,
    thirdPartySharing: false
  },
  
  // 账户安全
  security: {
    twoFactorEnabled: false,
    loginNotifications: true,
    sessionTimeout: 30 // 分钟
  }
}

// 全局状态
const state = reactive({
  ...JSON.parse(JSON.stringify(DEFAULT_SETTINGS)),
  
  // 运行时状态
  isLoading: false,
  hasUnsavedChanges: false,
  lastSaved: null,
  
  // 主题相关
  systemTheme: 'light',
  effectiveTheme: 'light'
})

// 计算属性
const getters = {
  // 获取有效主题
  effectiveTheme: computed(() => {
    if (state.theme === 'auto') {
      return state.systemTheme
    }
    return state.theme
  }),
  
  // 获取字体大小类名
  fontSizeClass: computed(() => {
    return `font-size-${state.fontSize}`
  }),
  
  // 检查是否有未保存的更改
  hasUnsavedChanges: computed(() => {
    return state.hasUnsavedChanges
  }),
  
  // 获取通知设置摘要
  notificationSummary: computed(() => {
    const enabled = Object.values(state.notifications).filter(Boolean).length
    const total = Object.keys(state.notifications).length
    return `${enabled}/${total} 项通知已启用`
  })
}

// 本地存储键名
const STORAGE_KEY = 'iflytek-user-settings'
const THEME_STORAGE_KEY = 'iflytek-theme-preference'

// 工具函数
const utils = {
  // 深度克隆对象
  deepClone(obj) {
    return JSON.parse(JSON.stringify(obj))
  },
  
  // 合并设置对象
  mergeSettings(target, source) {
    for (const key in source) {
      if (source.hasOwnProperty(key)) {
        if (typeof source[key] === 'object' && source[key] !== null && !Array.isArray(source[key])) {
          target[key] = target[key] || {}
          this.mergeSettings(target[key], source[key])
        } else {
          target[key] = source[key]
        }
      }
    }
    return target
  },
  
  // 验证设置数据
  validateSettings(settings) {
    const errors = []

    // 确保 settings 对象存在
    if (!settings || typeof settings !== 'object') {
      errors.push('设置对象无效')
      return errors
    }

    // 确保 profile 对象存在
    if (!settings.profile) {
      settings.profile = {
        name: '',
        email: '',
        phone: '',
        position: '',
        experience: '',
        skills: [],
        bio: ''
      }
    }

    // 验证主题
    if (!['light', 'dark', 'auto'].includes(settings.theme)) {
      errors.push('无效的主题设置')
    }

    // 验证语言
    if (!['zh-CN', 'zh-TW', 'en-US'].includes(settings.language)) {
      errors.push('无效的语言设置')
    }

    // 验证字体大小
    if (!['small', 'medium', 'large'].includes(settings.fontSize)) {
      errors.push('无效的字体大小设置')
    }
    
    // 验证邮箱格式
    if (settings.profile && settings.profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.profile.email)) {
      errors.push('邮箱格式不正确')
    }

    // 验证手机号格式
    if (settings.profile && settings.profile.phone && !/^1[3-9]\d{9}$/.test(settings.profile.phone)) {
      errors.push('手机号格式不正确')
    }
    
    return errors
  }
}

// 动作方法
const actions = {
  // 初始化设置
  async initializeSettings() {
    try {
      state.isLoading = true
      
      // 从本地存储加载设置
      const savedSettings = localStorage.getItem(STORAGE_KEY)
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings)
        utils.mergeSettings(state, parsed)
      }
      
      // 检测系统主题
      this.detectSystemTheme()
      
      // 应用设置
      this.applyAllSettings()
      
      console.log('✅ 用户设置初始化完成')
    } catch (error) {
      console.error('❌ 用户设置初始化失败:', error)
      ElMessage.error('设置加载失败，已恢复默认设置')
      this.resetToDefaults()
    } finally {
      state.isLoading = false
    }
  },
  
  // 保存设置到本地存储
  saveSettings() {
    try {
      const settingsToSave = utils.deepClone(state)
      
      // 移除运行时状态
      delete settingsToSave.isLoading
      delete settingsToSave.hasUnsavedChanges
      delete settingsToSave.lastSaved
      delete settingsToSave.systemTheme
      delete settingsToSave.effectiveTheme
      
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settingsToSave))
      state.lastSaved = new Date().toISOString()
      state.hasUnsavedChanges = false
      
      console.log('💾 用户设置已保存')
      return true
    } catch (error) {
      console.error('❌ 设置保存失败:', error)
      ElMessage.error('设置保存失败')
      return false
    }
  },
  
  // 更新设置
  updateSettings(newSettings) {
    try {
      // 验证设置
      const errors = utils.validateSettings(newSettings)
      if (errors.length > 0) {
        ElMessage.error(`设置验证失败: ${errors.join(', ')}`)
        return false
      }
      
      // 合并设置
      utils.mergeSettings(state, newSettings)
      state.hasUnsavedChanges = true
      
      // 应用设置
      this.applyAllSettings()
      
      return true
    } catch (error) {
      console.error('❌ 设置更新失败:', error)
      ElMessage.error('设置更新失败')
      return false
    }
  },
  
  // 应用所有设置
  applyAllSettings() {
    this.applyTheme()
    this.applyFontSize()
    this.applyLanguage()
  },
  
  // 应用主题设置
  applyTheme() {
    const theme = getters.effectiveTheme.value
    const body = document.body
    const html = document.documentElement
    
    // 移除所有主题类
    body.classList.remove('theme-light', 'theme-dark')
    html.classList.remove('light', 'dark')
    
    // 添加新主题类
    body.classList.add(`theme-${theme}`)
    html.classList.add(theme)
    
    // 更新CSS变量
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark')
    } else {
      html.removeAttribute('data-theme')
    }
    
    console.log(`🎨 主题已切换到: ${theme}`)
  },
  
  // 应用字体大小设置
  applyFontSize() {
    const body = document.body
    
    // 移除所有字体大小类
    body.classList.remove('font-size-small', 'font-size-medium', 'font-size-large')
    
    // 添加新字体大小类
    body.classList.add(getters.fontSizeClass.value)
    
    console.log(`📝 字体大小已设置为: ${state.fontSize}`)
  },
  
  // 应用语言设置
  applyLanguage() {
    document.documentElement.lang = state.language
    console.log(`🌐 语言已设置为: ${state.language}`)
  },
  
  // 检测系统主题
  detectSystemTheme() {
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      state.systemTheme = mediaQuery.matches ? 'dark' : 'light'
      
      // 监听系统主题变化
      mediaQuery.addEventListener('change', (e) => {
        state.systemTheme = e.matches ? 'dark' : 'light'
        if (state.theme === 'auto') {
          this.applyTheme()
        }
      })
    }
  },
  
  // 重置为默认设置
  resetToDefaults() {
    Object.assign(state, utils.deepClone(DEFAULT_SETTINGS))
    state.hasUnsavedChanges = true
    this.applyAllSettings()
    ElMessage.success('设置已重置为默认值')
  }
}

// 监听设置变化
watch(
  () => state.theme,
  () => {
    actions.applyTheme()
    state.hasUnsavedChanges = true
  }
)

watch(
  () => state.fontSize,
  () => {
    actions.applyFontSize()
    state.hasUnsavedChanges = true
  }
)

// 导出状态管理
export default {
  state,
  getters,
  actions,
  utils
}

// 导出便捷方法
export const useUserSettings = () => {
  return {
    state,
    getters,
    actions,
    utils
  }
}
