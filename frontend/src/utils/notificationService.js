/**
 * 浏览器通知服务
 * 处理浏览器推送通知的权限请求和发送
 */

import { ElMessage, ElNotification } from 'element-plus'

class NotificationService {
  constructor() {
    this.permission = 'default'
    this.isSupported = 'Notification' in window
    this.init()
  }

  // 初始化通知服务
  init() {
    if (!this.isSupported) {
      console.warn('⚠️ 当前浏览器不支持桌面通知')
      return
    }

    this.permission = Notification.permission
    console.log(`🔔 通知权限状态: ${this.permission}`)
  }

  // 请求通知权限
  async requestPermission() {
    if (!this.isSupported) {
      ElMessage.error('当前浏览器不支持桌面通知')
      return false
    }

    if (this.permission === 'granted') {
      return true
    }

    if (this.permission === 'denied') {
      ElMessage.warning('通知权限已被拒绝，请在浏览器设置中手动开启')
      return false
    }

    try {
      const permission = await Notification.requestPermission()
      this.permission = permission

      if (permission === 'granted') {
        ElNotification({
          title: '通知权限已开启',
          message: '您将收到重要的桌面通知',
          type: 'success'
        })
        return true
      } else {
        ElMessage.warning('通知权限被拒绝')
        return false
      }
    } catch (error) {
      console.error('请求通知权限失败:', error)
      ElMessage.error('请求通知权限失败')
      return false
    }
  }

  // 发送桌面通知
  sendNotification(title, options = {}) {
    if (!this.isSupported) {
      console.warn('浏览器不支持桌面通知')
      return null
    }

    if (this.permission !== 'granted') {
      console.warn('没有通知权限')
      return null
    }

    const defaultOptions = {
      icon: '/favicon.ico',
      badge: '/favicon.ico',
      tag: 'iflytek-notification',
      requireInteraction: false,
      silent: false,
      ...options
    }

    try {
      const notification = new Notification(title, defaultOptions)

      // 设置点击事件
      notification.onclick = () => {
        window.focus()
        notification.close()
        if (options.onClick) {
          options.onClick()
        }
      }

      // 自动关闭
      if (!defaultOptions.requireInteraction) {
        setTimeout(() => {
          notification.close()
        }, options.duration || 5000)
      }

      return notification
    } catch (error) {
      console.error('发送通知失败:', error)
      return null
    }
  }

  // 发送面试提醒通知
  sendInterviewReminder(interviewInfo) {
    return this.sendNotification('面试提醒', {
      body: `您有一场${interviewInfo.position}面试即将开始`,
      icon: '/icons/interview.png',
      tag: 'interview-reminder',
      requireInteraction: true,
      onClick: () => {
        // 跳转到面试页面
        window.location.href = `/interview/${interviewInfo.id}`
      }
    })
  }

  // 发送学习进度通知
  sendLearningProgress(progressInfo) {
    return this.sendNotification('学习进度更新', {
      body: `恭喜！您已完成${progressInfo.moduleName}的学习`,
      icon: '/icons/learning.png',
      tag: 'learning-progress'
    })
  }

  // 发送系统消息通知
  sendSystemMessage(message) {
    return this.sendNotification('系统消息', {
      body: message.content,
      icon: '/icons/system.png',
      tag: 'system-message',
      requireInteraction: message.important || false
    })
  }

  // 检查通知权限状态
  checkPermission() {
    if (!this.isSupported) {
      return 'unsupported'
    }
    return Notification.permission
  }

  // 获取通知设置建议
  getNotificationSettings() {
    const permission = this.checkPermission()
    
    return {
      isSupported: this.isSupported,
      permission,
      canRequest: permission === 'default',
      isGranted: permission === 'granted',
      isDenied: permission === 'denied',
      suggestions: this.getPermissionSuggestions(permission)
    }
  }

  // 获取权限建议
  getPermissionSuggestions(permission) {
    switch (permission) {
      case 'granted':
        return '通知权限已开启，您将收到重要提醒'
      case 'denied':
        return '通知权限被拒绝，请在浏览器设置中手动开启以接收重要提醒'
      case 'default':
        return '建议开启通知权限以接收面试提醒和学习进度更新'
      case 'unsupported':
        return '当前浏览器不支持桌面通知功能'
      default:
        return '未知的通知权限状态'
    }
  }

  // 测试通知功能
  testNotification() {
    if (this.permission !== 'granted') {
      ElMessage.warning('请先开启通知权限')
      return
    }

    this.sendNotification('测试通知', {
      body: 'iFlytek面试系统通知功能正常工作',
      icon: '/favicon.ico',
      tag: 'test-notification'
    })

    ElMessage.success('测试通知已发送')
  }
}

// 创建单例实例
const notificationService = new NotificationService()

export default notificationService

// 导出便捷方法
export const {
  requestPermission,
  sendNotification,
  sendInterviewReminder,
  sendLearningProgress,
  sendSystemMessage,
  checkPermission,
  getNotificationSettings,
  testNotification
} = notificationService
