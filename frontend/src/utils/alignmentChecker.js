/**
 * iFlytek Spark 智能面试系统 - 通用对齐检测工具
 * Universal Alignment Checker for iFlytek Spark Interview System
 *
 * 可以在任何页面上运行的对齐检测工具
 */

// 通用对齐检测函数
export function checkAlignmentIssues() {
  const results = {
    quickStartButtons: [],
    featureCards: [],
    metaItems: [],
    summary: {
      totalIssues: 0,
      fixedIssues: 0,
      pageType: 'unknown'
    }
  }

  // 检测当前页面类型
  const currentPath = window.location.pathname
  if (currentPath === '/' || currentPath === '/home') {
    results.summary.pageType = 'home'
  } else if (currentPath === '/interviewing') {
    results.summary.pageType = 'interview'
  } else if (currentPath === '/demo') {
    results.summary.pageType = 'demo'
  } else {
    results.summary.pageType = 'other'
  }

  console.log(`🔍 检测页面类型: ${results.summary.pageType}`)

  // 1. 检查主页快速开始按钮
  const quickStartButtons = document.querySelectorAll('.quick-start-actions .el-button')
  if (quickStartButtons.length > 0) {
    console.log(`✅ 找到 ${quickStartButtons.length} 个快速开始按钮`)
    
    quickStartButtons.forEach((btn, index) => {
      const icon = btn.querySelector('.el-icon, .btn-icon')
      const text = btn.textContent.trim()
      const btnStyle = window.getComputedStyle(btn)
      const iconStyle = icon ? window.getComputedStyle(icon) : null
      
      const buttonResult = {
        index: index + 1,
        text: text,
        hasIcon: !!icon,
        buttonAlignment: {
          display: btnStyle.display,
          alignItems: btnStyle.alignItems,
          justifyContent: btnStyle.justifyContent,
          lineHeight: btnStyle.lineHeight,
          flexDirection: btnStyle.flexDirection,
          isCorrect: (btnStyle.display === 'inline-flex' || btnStyle.display === 'flex') && btnStyle.alignItems === 'center'
        },
        iconAlignment: iconStyle ? {
          display: iconStyle.display,
          alignItems: iconStyle.alignItems,
          justifyContent: iconStyle.justifyContent,
          marginRight: iconStyle.marginRight,
          position: iconStyle.position,
          top: iconStyle.top,
          fontSize: iconStyle.fontSize,
          width: iconStyle.width,
          height: iconStyle.height,
          isCorrect: (iconStyle.display === 'inline-flex' || iconStyle.display === 'flex') && iconStyle.alignItems === 'center'
        } : null
      }
      
      results.quickStartButtons.push(buttonResult)
      
      if (!buttonResult.buttonAlignment.isCorrect || (buttonResult.iconAlignment && !buttonResult.iconAlignment.isCorrect)) {
        results.summary.totalIssues++
        console.log(`❌ 按钮 "${text}" 对齐问题:`, buttonResult)
      } else {
        results.summary.fixedIssues++
        console.log(`✅ 按钮 "${text}" 对齐正确`)
      }
    })
  } else {
    console.log(`ℹ️ 当前页面未找到快速开始按钮`)
  }

  // 2. 检查技术特性卡片
  const featureCards = document.querySelectorAll('.feature-card')
  if (featureCards.length > 0) {
    console.log(`✅ 找到 ${featureCards.length} 个技术特性卡片`)
    
    featureCards.forEach((card, index) => {
      const icon = card.querySelector('.card-icon')
      const iconElement = icon ? icon.querySelector('.el-icon, svg, i') : null
      const text = card.querySelector('span') ? card.querySelector('span').textContent.trim() : '未知'
      const cardStyle = window.getComputedStyle(card)
      const iconStyle = icon ? window.getComputedStyle(icon) : null
      const iconElementStyle = iconElement ? window.getComputedStyle(iconElement) : null
      
      const cardResult = {
        index: index + 1,
        text: text,
        hasIcon: !!icon,
        cardAlignment: {
          display: cardStyle.display,
          alignItems: cardStyle.alignItems,
          justifyContent: cardStyle.justifyContent,
          textAlign: cardStyle.textAlign,
          isCorrect: cardStyle.display === 'flex' && cardStyle.alignItems === 'center'
        },
        iconContainerAlignment: iconStyle ? {
          display: iconStyle.display,
          alignItems: iconStyle.alignItems,
          justifyContent: iconStyle.justifyContent,
          width: iconStyle.width,
          height: iconStyle.height,
          isCorrect: iconStyle.display === 'flex' && iconStyle.alignItems === 'center'
        } : null,
        iconElementAlignment: iconElementStyle ? {
          display: iconElementStyle.display,
          alignItems: iconElementStyle.alignItems,
          fontSize: iconElementStyle.fontSize,
          isCorrect: iconElementStyle.display === 'flex'
        } : null
      }
      
      results.featureCards.push(cardResult)
      
      const hasIssues = !cardResult.cardAlignment.isCorrect || 
                       (cardResult.iconContainerAlignment && !cardResult.iconContainerAlignment.isCorrect)
      
      if (hasIssues) {
        results.summary.totalIssues++
        console.log(`❌ 技术特性卡片 "${text}" 对齐问题:`, cardResult)
      } else {
        results.summary.fixedIssues++
        console.log(`✅ 技术特性卡片 "${text}" 对齐正确`)
      }
    })
  } else {
    console.log(`ℹ️ 当前页面未找到技术特性卡片`)
  }

  // 3. 检查面试页面元数据
  const metaItems = document.querySelectorAll('.interview-meta .meta-item')
  if (metaItems.length > 0) {
    console.log(`✅ 找到 ${metaItems.length} 个面试元数据项`)
    
    metaItems.forEach((item, index) => {
      const icon = item.querySelector('.el-icon, .meta-icon')
      const label = item.querySelector('.meta-label')
      const value = item.querySelector('.meta-value')
      const itemStyle = window.getComputedStyle(item)
      const iconStyle = icon ? window.getComputedStyle(icon) : null
      
      const metaResult = {
        index: index + 1,
        label: label ? label.textContent.trim() : '未知',
        value: value ? value.textContent.trim() : '未知',
        hasIcon: !!icon,
        itemAlignment: {
          display: itemStyle.display,
          alignItems: itemStyle.alignItems,
          gap: itemStyle.gap,
          isCorrect: itemStyle.display === 'flex' && itemStyle.alignItems === 'center'
        },
        iconAlignment: iconStyle ? {
          display: iconStyle.display,
          alignItems: iconStyle.alignItems,
          width: iconStyle.width,
          height: iconStyle.height,
          fontSize: iconStyle.fontSize,
          position: iconStyle.position,
          top: iconStyle.top,
          isCorrect: iconStyle.display === 'inline-flex' && iconStyle.alignItems === 'center'
        } : null
      }
      
      results.metaItems.push(metaResult)
      
      const hasIssues = !metaResult.itemAlignment.isCorrect || 
                       (metaResult.iconAlignment && !metaResult.iconAlignment.isCorrect)
      
      if (hasIssues) {
        results.summary.totalIssues++
        console.log(`❌ 元数据项 "${metaResult.label}" 对齐问题:`, metaResult)
      } else {
        results.summary.fixedIssues++
        console.log(`✅ 元数据项 "${metaResult.label}" 对齐正确`)
      }
    })
  } else {
    console.log(`ℹ️ 当前页面未找到面试元数据`)
  }

  // 生成总结报告
  const totalElements = results.quickStartButtons.length + results.featureCards.length + results.metaItems.length
  
  console.log('\n📊 对齐检测总结报告:')
  console.log(`页面类型: ${results.summary.pageType}`)
  console.log(`检测元素总数: ${totalElements}`)
  console.log(`发现问题: ${results.summary.totalIssues}`)
  console.log(`已修复: ${results.summary.fixedIssues}`)
  console.log(`修复率: ${totalElements > 0 ? Math.round((results.summary.fixedIssues / totalElements) * 100) : 0}%`)

  if (results.summary.totalIssues === 0 && totalElements > 0) {
    console.log('🎉 所有对齐问题已解决！')
  } else if (totalElements === 0) {
    console.log('ℹ️ 当前页面没有需要检测的元素')
  } else {
    console.log('⚠️ 仍有对齐问题需要解决')
  }

  return results
}

// 检查样式文件是否加载
export function checkStylesLoaded() {
  const styleChecks = {
    criticalAlignmentFixes: false,
    forceIconAlignment: false,
    preciseAlignmentFixes: false
  }

  // 检查关键对齐修复样式
  const criticalStyles = document.querySelector('style[data-vite-dev-id*="critical-alignment-fixes"]') ||
                        document.querySelector('link[href*="critical-alignment-fixes"]')
  styleChecks.criticalAlignmentFixes = !!criticalStyles

  // 检查强制图标对齐样式
  const forceStyles = document.querySelector('style[data-vite-dev-id*="force-icon-alignment"]') ||
                     document.querySelector('link[href*="force-icon-alignment"]')
  styleChecks.forceIconAlignment = !!forceStyles

  // 检查精确对齐修复样式
  const preciseStyles = document.querySelector('style[data-vite-dev-id*="precise-alignment-fixes"]') ||
                        document.querySelector('link[href*="precise-alignment-fixes"]')
  styleChecks.preciseAlignmentFixes = !!preciseStyles

  console.log('🎨 样式文件加载状态:')
  console.log(`关键对齐修复: ${styleChecks.criticalAlignmentFixes ? '✅' : '❌'}`)
  console.log(`强制图标对齐: ${styleChecks.forceIconAlignment ? '✅' : '❌'}`)
  console.log(`精确对齐修复: ${styleChecks.preciseAlignmentFixes ? '✅' : '❌'}`)

  const allLoaded = Object.values(styleChecks).every(loaded => loaded)
  console.log(`总体状态: ${allLoaded ? '✅ 所有样式已加载' : '❌ 部分样式未加载'}`)

  return styleChecks
}

// 高亮显示所有图标（用于视觉检查）
export function highlightAllIcons() {
  const icons = document.querySelectorAll('.el-icon, .btn-icon, .meta-icon, .card-icon, .control-icon, .feature-icon')
  
  icons.forEach((icon, index) => {
    icon.style.border = '2px solid red'
    icon.style.backgroundColor = 'rgba(255, 0, 0, 0.1)'
    icon.style.position = 'relative'
    icon.style.zIndex = '9999'
    
    // 添加序号标签
    const label = document.createElement('div')
    label.textContent = index + 1
    label.style.position = 'absolute'
    label.style.top = '-10px'
    label.style.right = '-10px'
    label.style.background = 'red'
    label.style.color = 'white'
    label.style.fontSize = '10px'
    label.style.padding = '2px 4px'
    label.style.borderRadius = '50%'
    label.style.zIndex = '10000'
    label.className = 'alignment-debug-label'
    
    icon.appendChild(label)
  })
  
  console.log(`🔍 已高亮 ${icons.length} 个图标`)
  return icons.length
}

// 重置高亮
export function resetHighlight() {
  const icons = document.querySelectorAll('.el-icon, .btn-icon, .meta-icon, .card-icon, .control-icon, .feature-icon')
  
  icons.forEach(icon => {
    icon.style.border = ''
    icon.style.backgroundColor = ''
    icon.style.position = ''
    icon.style.zIndex = ''
    
    // 移除调试标签
    const label = icon.querySelector('.alignment-debug-label')
    if (label) {
      label.remove()
    }
  })
  
  console.log('🔄 已重置图标高亮')
}

// 将函数挂载到全局对象，方便在控制台调用
if (typeof window !== 'undefined') {
  window.checkAlignmentIssues = checkAlignmentIssues
  window.checkStylesLoaded = checkStylesLoaded
  window.highlightAllIcons = highlightAllIcons
  window.resetHighlight = resetHighlight
}
