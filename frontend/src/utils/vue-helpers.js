/**
 * Vue辅助工具函数
 * 用于解决组件响应式警告问题
 */

import { markRaw } from 'vue'

/**
 * 批量标记图标组件为非响应式
 * @param {Object} icons - 图标对象集合
 * @returns {Object} - 标记后的图标对象
 */
export function markRawIcons(icons) {
  const result = {}
  for (const [key, icon] of Object.entries(icons)) {
    result[key] = markRaw(icon)
  }
  return result
}

/**
 * 标记数组中的图标组件
 * @param {Array} items - 包含图标的数组
 * @param {string} iconKey - 图标属性名，默认为'icon'
 * @returns {Array} - 处理后的数组
 */
export function markRawIconsInArray(items, iconKey = 'icon') {
  return items.map(item => ({
    ...item,
    [iconKey]: typeof item[iconKey] === 'object' ? markRaw(item[iconKey]) : item[iconKey]
  }))
}

/**
 * 创建安全的组件引用
 * @param {Object} component - Vue组件
 * @returns {Object} - 标记为非响应式的组件
 */
export function createSafeComponentRef(component) {
  return markRaw(component)
}

export default {
  markRawIcons,
  markRawIconsInArray,
  createSafeComponentRef
}