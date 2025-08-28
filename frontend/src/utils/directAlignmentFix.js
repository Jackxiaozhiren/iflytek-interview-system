/**
 * iFlytek 星火大模型智能面试系统 - 直接对齐修复工具
 * Direct Alignment Fix Tool for iFlytek Spark Interview System
 *
 * 版本: 6.0
 * 更新: 2025-07-20
 * 
 * 直接通过JavaScript应用样式修复，绕过CSS加载问题
 */

// 直接修复主页快速开始按钮对齐
export function fixQuickStartButtons() {
  console.log('🔧 开始直接修复主页快速开始按钮...')
  
  const buttons = document.querySelectorAll('.quick-start-actions .el-button')
  let fixedCount = 0
  
  buttons.forEach((button, index) => {
    try {
      // 修复按钮本身
      button.style.display = 'inline-flex'
      button.style.alignItems = 'center'
      button.style.justifyContent = 'center'
      button.style.flexDirection = 'row'
      button.style.textAlign = 'center'
      button.style.verticalAlign = 'middle'
      button.style.lineHeight = '1'
      button.style.whiteSpace = 'nowrap'
      button.style.boxSizing = 'border-box'
      button.style.padding = '16px 24px'
      button.style.minHeight = '48px'
      
      // 修复按钮内的图标
      const icon = button.querySelector('.el-icon, .btn-icon')
      if (icon) {
        icon.style.display = 'inline-flex'
        icon.style.alignItems = 'center'
        icon.style.justifyContent = 'center'
        icon.style.verticalAlign = 'middle'
        icon.style.margin = '0 8px 0 0'
        icon.style.padding = '0'
        icon.style.fontSize = '16px'
        icon.style.width = '16px'
        icon.style.height = '16px'
        icon.style.position = 'relative'
        icon.style.top = '-0.05em'
        icon.style.flexShrink = '0'
        icon.style.flexGrow = '0'
        icon.style.border = 'none'
        icon.style.background = 'transparent'
        icon.style.outline = 'none'
        icon.style.lineHeight = '1'
      }
      
      // 修复按钮内的文本
      const spans = button.querySelectorAll('span')
      spans.forEach(span => {
        span.style.lineHeight = '1.2'
        span.style.verticalAlign = 'middle'
        span.style.display = 'inline-block'
        span.style.position = 'relative'
        span.style.top = '0.02em'
        span.style.fontFamily = "'Microsoft YaHei', 'PingFang SC', sans-serif"
        span.style.fontSize = '16px'
        span.style.fontWeight = '600'
        span.style.margin = '0'
        span.style.padding = '0'
      })
      
      fixedCount++
      console.log(`✅ 已修复按钮 ${index + 1}: "${button.textContent.trim()}"`)
      
    } catch (error) {
      console.error(`❌ 修复按钮 ${index + 1} 时出错:`, error)
    }
  })
  
  console.log(`🎉 快速开始按钮修复完成，共修复 ${fixedCount} 个按钮`)
  return fixedCount
}

// 直接修复技术特性卡片对齐
export function fixFeatureCards() {
  console.log('🔧 开始直接修复技术特性卡片...')
  
  const cards = document.querySelectorAll('.feature-card')
  let fixedCount = 0
  
  cards.forEach((card, index) => {
    try {
      // 修复卡片本身
      card.style.display = 'flex'
      card.style.flexDirection = 'column'
      card.style.alignItems = 'center'
      card.style.justifyContent = 'center'
      card.style.textAlign = 'center'
      card.style.padding = '20px'
      card.style.gap = '12px'
      card.style.boxSizing = 'border-box'
      
      // 修复图标容器
      const iconContainer = card.querySelector('.card-icon')
      if (iconContainer) {
        iconContainer.style.display = 'flex'
        iconContainer.style.alignItems = 'center'
        iconContainer.style.justifyContent = 'center'
        iconContainer.style.width = '40px'
        iconContainer.style.height = '40px'
        iconContainer.style.margin = '0 auto 8px auto'
        iconContainer.style.borderRadius = '8px'
        
        // 修复图标元素
        const iconElement = iconContainer.querySelector('.el-icon, svg, i')
        if (iconElement) {
          iconElement.style.display = 'flex'
          iconElement.style.alignItems = 'center'
          iconElement.style.justifyContent = 'center'
          iconElement.style.fontSize = '18px'
          iconElement.style.width = '18px'
          iconElement.style.height = '18px'
          iconElement.style.color = 'white'
          iconElement.style.position = 'relative'
          iconElement.style.top = '0'
          iconElement.style.margin = '0'
          iconElement.style.padding = '0'
          iconElement.style.flexShrink = '0'
          iconElement.style.flexGrow = '0'
        }
      }
      
      // 修复文本
      const textSpan = card.querySelector('span')
      if (textSpan) {
        textSpan.style.display = 'block'
        textSpan.style.textAlign = 'center'
        textSpan.style.lineHeight = '1.3'
        textSpan.style.fontFamily = "'Microsoft YaHei', 'PingFang SC', sans-serif"
        textSpan.style.fontSize = '14px'
        textSpan.style.fontWeight = '500'
        textSpan.style.margin = '0'
        textSpan.style.padding = '0'
      }
      
      fixedCount++
      console.log(`✅ 已修复技术特性卡片 ${index + 1}: "${textSpan ? textSpan.textContent.trim() : '未知'}"`)
      
    } catch (error) {
      console.error(`❌ 修复技术特性卡片 ${index + 1} 时出错:`, error)
    }
  })
  
  console.log(`🎉 技术特性卡片修复完成，共修复 ${fixedCount} 个卡片`)
  return fixedCount
}

// 直接修复面试页面元数据对齐
export function fixInterviewMeta() {
  console.log('🔧 开始直接修复面试页面元数据...')
  
  const metaItems = document.querySelectorAll('.interview-meta .meta-item')
  let fixedCount = 0
  
  metaItems.forEach((item, index) => {
    try {
      // 修复元数据项容器
      item.style.display = 'flex'
      item.style.alignItems = 'center'
      item.style.justifyContent = 'flex-start'
      item.style.gap = '6px'
      item.style.padding = '8px 12px'
      item.style.minHeight = '36px'
      item.style.boxSizing = 'border-box'
      item.style.background = 'rgba(255, 255, 255, 0.9)'
      item.style.borderRadius = '6px'
      item.style.border = '1px solid rgba(24, 144, 255, 0.1)'
      
      // 修复图标
      const icon = item.querySelector('.el-icon, .meta-icon')
      if (icon) {
        icon.style.display = 'inline-flex'
        icon.style.alignItems = 'center'
        icon.style.justifyContent = 'center'
        icon.style.width = '14px'
        icon.style.height = '14px'
        icon.style.fontSize = '14px'
        icon.style.color = '#1890ff'
        icon.style.flexShrink = '0'
        icon.style.flexGrow = '0'
        icon.style.position = 'relative'
        icon.style.top = '0'
        icon.style.margin = '0'
        icon.style.padding = '0'
        icon.style.border = 'none'
        icon.style.background = 'transparent'
        icon.style.outline = 'none'
        icon.style.verticalAlign = 'middle'
        icon.style.lineHeight = '1'
      }
      
      // 修复标签
      const label = item.querySelector('.meta-label')
      if (label) {
        label.style.fontSize = '12px'
        label.style.color = '#666'
        label.style.lineHeight = '1.2'
        label.style.margin = '0 4px 0 0'
        label.style.padding = '0'
        label.style.fontFamily = "'Microsoft YaHei', 'PingFang SC', sans-serif"
        label.style.fontWeight = '400'
        label.style.whiteSpace = 'nowrap'
        label.style.display = 'inline-block'
        label.style.verticalAlign = 'middle'
      }
      
      // 修复值
      const value = item.querySelector('.meta-value')
      if (value) {
        value.style.fontSize = '14px'
        value.style.fontWeight = '500'
        value.style.color = '#333'
        value.style.lineHeight = '1.2'
        value.style.margin = '0'
        value.style.padding = '0'
        value.style.fontFamily = "'Microsoft YaHei', 'PingFang SC', sans-serif"
        value.style.whiteSpace = 'nowrap'
        value.style.display = 'inline-block'
        value.style.verticalAlign = 'middle'
      }
      
      fixedCount++
      console.log(`✅ 已修复元数据项 ${index + 1}: "${label ? label.textContent.trim() : '未知'}"`)
      
    } catch (error) {
      console.error(`❌ 修复元数据项 ${index + 1} 时出错:`, error)
    }
  })
  
  console.log(`🎉 面试页面元数据修复完成，共修复 ${fixedCount} 个项目`)
  return fixedCount
}

// 一键修复所有对齐问题
export function fixAllAlignmentIssues() {
  console.log('🚀 开始一键修复所有对齐问题...')
  
  const results = {
    quickStartButtons: 0,
    featureCards: 0,
    interviewMeta: 0,
    total: 0
  }
  
  // 修复快速开始按钮
  results.quickStartButtons = fixQuickStartButtons()
  
  // 修复技术特性卡片
  results.featureCards = fixFeatureCards()
  
  // 修复面试页面元数据
  results.interviewMeta = fixInterviewMeta()
  
  results.total = results.quickStartButtons + results.featureCards + results.interviewMeta
  
  console.log('\n📊 修复总结:')
  console.log(`快速开始按钮: ${results.quickStartButtons} 个`)
  console.log(`技术特性卡片: ${results.featureCards} 个`)
  console.log(`面试页面元数据: ${results.interviewMeta} 个`)
  console.log(`总计修复: ${results.total} 个元素`)
  
  if (results.total > 0) {
    console.log('🎉 所有对齐问题修复完成！')
    console.log('💡 建议运行 checkAlignmentIssues() 验证修复效果')
  } else {
    console.log('ℹ️ 当前页面没有找到需要修复的元素')
  }
  
  return results
}

// 将函数挂载到全局对象，方便在控制台调用
if (typeof window !== 'undefined') {
  window.fixQuickStartButtons = fixQuickStartButtons
  window.fixFeatureCards = fixFeatureCards
  window.fixInterviewMeta = fixInterviewMeta
  window.fixAllAlignmentIssues = fixAllAlignmentIssues
}
