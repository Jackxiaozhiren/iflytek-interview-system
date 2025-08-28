// Element Plus 图标验证工具
// 用于检查项目中使用的图标是否都是有效的 Element Plus 图标

// Element Plus 中常用的有效图标列表
const validElementPlusIcons = [
  // 基础图标
  'Plus', 'Minus', 'Close', 'Check', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown',
  
  // 功能图标
  'User', 'Users', 'UserFilled', 'House', 'HomeFilled', 'Setting', 'Tools',
  'Search', 'Edit', 'Delete', 'View', 'Hide', 'Refresh', 'Download', 'Upload',
  
  // 媒体图标
  'VideoCamera', 'VideoPlay', 'VideoPause', 'Microphone', 'Picture', 'Camera',
  
  // 数据图标
  'TrendCharts', 'PieChart', 'DataBoard', 'TrendCharts', 'Cpu', 'Odometer',
  
  // 文档图标
  'Document', 'DocumentAdd', 'DocumentCopy', 'DocumentDelete', 'Folder', 'FolderAdd',
  
  // 通信图标
  'Message', 'Phone', 'Bell', 'ChatDotRound', 'Connection',
  
  // 状态图标
  'SuccessFilled', 'WarningFilled', 'InfoFilled', 'CircleCheckFilled',
  'Star', 'StarFilled', 'Medal', 'Trophy', 'Timer', 'Clock',
  
  // 办公图标
  'OfficeBuilding', 'School', 'Reading', 'Notebook'
]

// 检查图标是否有效
export function validateIcon(iconName) {
  return validElementPlusIcons.includes(iconName)
}

// 获取建议的替代图标
export function getSuggestedIcon(invalidIcon) {
  const suggestions = {
    // 基础图标替换
    'MemoryCard': 'Cpu',
    'Warning': 'WarningFilled',
    'Success': 'SuccessFilled',
    'Info': 'InfoFilled',
    'Error': 'CircleCheckFilled',
    'Users': 'User',
    'Memory': 'Odometer',
    'Storage': 'Odometer',
    'Database': 'DataBoard',
    'Chart': 'TrendCharts',
    'Graph': 'TrendCharts',

    // 新发现的无效图标替换方案
    'PieChart': 'TrendCharts',
    'Medal': 'Trophy',
    'Guide': 'QuestionFilled',
    'MagicStick': 'Star',
    'Notebook': 'Document',
    'Message': 'ChatDotRound',
    'UserFilled': 'User',
    'Tools': 'Setting',
    'Briefcase': 'OfficeBuilding',
    'Lock': 'Lock',
    'Bottom': 'ArrowDown',
    'ChatLineRound': 'ChatDotRound',
    'Bulb': 'Star',
    'DataLine': 'TrendCharts',
    'Plus': 'CirclePlus',
    'Filter': 'Search',
    'Pointer': 'Mouse',
    'Minus': 'Remove',
    'Delete': 'Delete',
    'Notification': 'Bell',
    'Bell': 'Bell',
    'Lightning': 'Promotion',
    'List': 'Menu',
    'Tickets': 'Document',
    'Sort': 'Sort',
    'Money': 'Coin',
    'Rank': 'TrendCharts',
    'Histogram': 'TrendCharts',
    'MoreFilled': 'More',
    'Printer': 'Printer'
  }

  return suggestions[invalidIcon] || 'QuestionFilled'
}

// 验证项目中的图标使用
export function validateProjectIcons() {
  console.log('Element Plus 图标验证工具')
  console.log('有效图标数量:', validElementPlusIcons.length)
  console.log('如需查看完整图标列表，请访问: https://element-plus.org/zh-CN/component/icon.html')
}

export default {
  validateIcon,
  getSuggestedIcon,
  validateProjectIcons,
  validElementPlusIcons
}
