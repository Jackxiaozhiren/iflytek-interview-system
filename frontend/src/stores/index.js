/**
 * iFlytek面试系统 - 状态管理配置
 * 基于Pinia的全局状态管理
 */

import { createPinia } from 'pinia'

// 创建Pinia实例
const pinia = createPinia()

// 开发环境下启用调试
if (import.meta.env.DEV) {
  pinia.use(({ store }) => {
    // 添加状态变化日志
    store.$subscribe((mutation, state) => {
      console.log(`🔄 [${store.$id}] ${mutation.type}:`, mutation.payload)
    })
  })
}

export default pinia

// 导出所有store
export { useIntervieweeStore } from './intervieweeStore.js'
