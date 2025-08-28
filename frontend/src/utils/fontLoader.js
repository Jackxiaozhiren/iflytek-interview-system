/**
 * 中文字体加载检测和优化工具
 * 确保微软雅黑字体正确加载和渲染
 */

class FontLoader {
  constructor() {
    this.loadedFonts = new Set()
    this.fontLoadPromises = new Map()
    this.fallbackFonts = [
      'Microsoft YaHei',
      '微软雅黑',
      'SimHei',
      '黑体',
      'PingFang SC',
      '苹方-简',
      'Hiragino Sans GB',
      '冬青黑体简体中文',
      'Source Han Sans CN',
      '思源黑体 CN',
      'Noto Sans CJK SC',
      'WenQuanYi Micro Hei',
      '文泉驿微米黑',
      'sans-serif'
    ]
  }

  /**
   * 检测字体是否可用
   * @param {string} fontFamily 字体名称
   * @returns {boolean} 字体是否可用
   */
  isFontAvailable(fontFamily) {
    // 优先使用Font Loading API
    if ('fonts' in document) {
      try {
        // 检查字体是否已加载
        const fontFace = new FontFace(fontFamily, 'local("' + fontFamily + '")')
        return document.fonts.check(`16px "${fontFamily}"`)
      } catch (e) {
        // 如果Font Loading API失败，使用传统方法
      }
    }

    // 传统检测方法 - 改进版
    const testElement = document.createElement('div')
    testElement.style.fontFamily = `"${fontFamily}", serif`
    testElement.style.fontSize = '16px'
    testElement.style.position = 'absolute'
    testElement.style.left = '-9999px'
    testElement.style.top = '-9999px'
    testElement.style.visibility = 'hidden'
    testElement.textContent = '测试中文字体渲染效果微软雅黑'

    document.body.appendChild(testElement)

    // 获取渲染宽度和高度
    const targetWidth = testElement.offsetWidth
    const targetHeight = testElement.offsetHeight

    // 设置回退字体进行对比
    testElement.style.fontFamily = 'serif'
    const serifWidth = testElement.offsetWidth
    const serifHeight = testElement.offsetHeight

    // 再测试sans-serif
    testElement.style.fontFamily = 'sans-serif'
    const sansWidth = testElement.offsetWidth
    const sansHeight = testElement.offsetHeight

    document.body.removeChild(testElement)

    // 如果宽度或高度与回退字体不同，说明字体可用
    const isDifferentFromSerif = (targetWidth !== serifWidth || targetHeight !== serifHeight)
    const isDifferentFromSans = (targetWidth !== sansWidth || targetHeight !== sansHeight)

    return isDifferentFromSerif || isDifferentFromSans
  }

  /**
   * 获取最佳可用字体
   * @returns {string} 最佳字体名称
   */
  getBestAvailableFont() {
    // 检测操作系统
    const isWindows = navigator.platform.indexOf('Win') > -1
    const isMac = navigator.platform.indexOf('Mac') > -1

    // 根据操作系统优化字体检测顺序
    let fontsToCheck = [...this.fallbackFonts]
    if (isWindows) {
      // Windows系统优先检查Microsoft YaHei
      fontsToCheck = ['Microsoft YaHei', 'SimHei', '微软雅黑', '黑体', ...this.fallbackFonts.filter(f => !['Microsoft YaHei', 'SimHei'].includes(f))]
    } else if (isMac) {
      // Mac系统优先检查PingFang SC
      fontsToCheck = ['PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', ...this.fallbackFonts.filter(f => !['PingFang SC', 'Hiragino Sans GB'].includes(f))]
    }

    for (const font of fontsToCheck) {
      if (this.isFontAvailable(font)) {
        console.log(`✅ 检测到可用中文字体: ${font}`)
        return font
      }
    }

    // 如果是Windows系统，直接使用Microsoft YaHei（通常都有）
    if (isWindows) {
      console.log('🔧 Windows系统，使用Microsoft YaHei作为默认中文字体')
      return 'Microsoft YaHei, SimHei, sans-serif'
    }

    // 如果是Mac系统，使用PingFang SC
    if (isMac) {
      console.log('🔧 Mac系统，使用PingFang SC作为默认中文字体')
      return 'PingFang SC, Hiragino Sans GB, sans-serif'
    }

    console.warn('⚠️ 未检测到理想的中文字体，使用系统默认字体')
    return 'sans-serif'
  }

  /**
   * 使用Font Loading API加载字体
   * @param {string} fontFamily 字体名称
   * @param {string} fontWeight 字体粗细
   * @returns {Promise} 加载Promise
   */
  async loadFontWithAPI(fontFamily, fontWeight = 'normal') {
    if (!('fonts' in document)) {
      console.warn('浏览器不支持Font Loading API')
      return false
    }

    const fontKey = `${fontFamily}-${fontWeight}`
    
    if (this.loadedFonts.has(fontKey)) {
      return true
    }

    if (this.fontLoadPromises.has(fontKey)) {
      return this.fontLoadPromises.get(fontKey)
    }

    const fontFace = new FontFace(fontFamily, `local("${fontFamily}")`, {
      weight: fontWeight,
      display: 'swap'
    })

    const loadPromise = fontFace.load().then(() => {
      document.fonts.add(fontFace)
      this.loadedFonts.add(fontKey)
      console.log(`✅ 字体加载成功: ${fontFamily} (${fontWeight})`)
      return true
    }).catch((error) => {
      console.warn(`⚠️ 字体加载失败: ${fontFamily}`, error)
      return false
    })

    this.fontLoadPromises.set(fontKey, loadPromise)
    return loadPromise
  }

  /**
   * 预加载所有中文字体
   * @returns {Promise} 加载Promise
   */
  async preloadChineseFonts() {
    const fontPromises = []
    
    // 预加载主要字体的不同粗细
    const mainFonts = ['Microsoft YaHei', '微软雅黑', 'SimHei', '黑体']
    const weights = ['normal', 'bold', '500', '600']
    
    for (const font of mainFonts) {
      for (const weight of weights) {
        fontPromises.push(this.loadFontWithAPI(font, weight))
      }
    }
    
    try {
      const results = await Promise.allSettled(fontPromises)
      const successCount = results.filter(r => r.status === 'fulfilled' && r.value).length
      console.log(`📝 中文字体预加载完成: ${successCount}/${fontPromises.length} 成功`)
      return true
    } catch (error) {
      console.error('中文字体预加载失败:', error)
      return false
    }
  }

  /**
   * 应用最佳字体到页面
   */
  applyBestFont() {
    const bestFont = this.getBestAvailableFont()
    
    // 创建动态样式
    const style = document.createElement('style')
    style.id = 'dynamic-chinese-font'
    style.textContent = `
      * {
        font-family: "${bestFont}", ${this.fallbackFonts.join(', ')} !important;
      }
      
      .chinese-optimized {
        font-family: "${bestFont}", ${this.fallbackFonts.join(', ')};
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-rendering: optimizeLegibility;
      }
    `
    
    // 移除旧样式
    const oldStyle = document.getElementById('dynamic-chinese-font')
    if (oldStyle) {
      oldStyle.remove()
    }
    
    document.head.appendChild(style)
    console.log(`🎨 已应用最佳中文字体: ${bestFont}`)
  }

  /**
   * 监听字体加载状态
   */
  watchFontLoading() {
    if (!('fonts' in document)) {
      return
    }

    document.fonts.addEventListener('loadingdone', () => {
      console.log('📚 所有字体加载完成')
      this.applyBestFont()
    })

    document.fonts.addEventListener('loadingerror', (event) => {
      console.warn('⚠️ 字体加载错误:', event)
    })
  }

  /**
   * 检测字体渲染质量
   * @param {string} text 测试文本
   * @returns {Object} 渲染质量信息
   */
  checkRenderingQuality(text = '测试中文字体渲染效果ABCabc123') {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    
    canvas.width = 400
    canvas.height = 100
    
    ctx.font = '16px Microsoft YaHei, 微软雅黑, SimHei, sans-serif'
    ctx.fillStyle = '#000'
    ctx.textBaseline = 'top'
    ctx.fillText(text, 10, 10)
    
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    const data = imageData.data
    
    let pixelCount = 0
    let antiAliasedPixels = 0
    
    for (let i = 0; i < data.length; i += 4) {
      const alpha = data[i + 3]
      if (alpha > 0) {
        pixelCount++
        if (alpha < 255) {
          antiAliasedPixels++
        }
      }
    }
    
    const antiAliasRatio = antiAliasedPixels / pixelCount
    
    return {
      totalPixels: pixelCount,
      antiAliasedPixels,
      antiAliasRatio,
      quality: antiAliasRatio > 0.1 ? 'good' : 'poor'
    }
  }

  /**
   * 初始化字体加载器
   */
  async init() {
    console.log('🚀 初始化中文字体加载器...')
    
    // 检测当前字体渲染质量
    const quality = this.checkRenderingQuality()
    console.log('📊 字体渲染质量:', quality)
    
    // 监听字体加载
    this.watchFontLoading()
    
    // 预加载字体
    await this.preloadChineseFonts()
    
    // 应用最佳字体
    this.applyBestFont()
    
    // 添加字体加载完成的CSS类
    document.documentElement.classList.add('fonts-loaded')
    
    console.log('✅ 中文字体加载器初始化完成')
  }
}

// 创建全局实例
const fontLoader = new FontLoader()

// 导出
export default fontLoader

// 自动初始化（如果在浏览器环境）
if (typeof window !== 'undefined') {
  // 等待DOM加载完成
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      fontLoader.init()
    })
  } else {
    fontLoader.init()
  }
}
