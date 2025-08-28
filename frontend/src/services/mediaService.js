/**
 * 媒体资源管理服务
 * 管理演示页面的图片、动画和视觉资源
 */

class MediaService {
  constructor() {
    this.baseImagePath = '/demo/images'
    this.baseVideoPath = '/demo/videos'
    this.baseAnimationPath = '/demo/animations'
  }

  /**
   * 获取功能演示卡片的动态图标和图片
   */
  getFeatureMedia() {
    return {
      'multimodal-input': {
        icon: '🎤',
        image: `${this.baseImagePath}/multimodal-input.jpg`,
        animation: `${this.baseAnimationPath}/voice-wave.gif`,
        screenshot: `${this.baseImagePath}/screenshots/multimodal-interface.png`,
        description: '多模态输入界面展示'
      },
      'ai-analysis': {
        icon: '🧠',
        image: `${this.baseImagePath}/ai-analysis.jpg`,
        animation: `${this.baseAnimationPath}/brain-thinking.gif`,
        screenshot: `${this.baseImagePath}/screenshots/ai-analysis-dashboard.png`,
        description: 'AI分析处理界面'
      },
      'comprehensive-report': {
        icon: '📊',
        image: `${this.baseImagePath}/report-generation.jpg`,
        animation: `${this.baseAnimationPath}/chart-building.gif`,
        screenshot: `${this.baseImagePath}/screenshots/report-interface.png`,
        description: '综合报告生成界面'
      },
      'real-time-feedback': {
        icon: '⚡',
        image: `${this.baseImagePath}/real-time-feedback.jpg`,
        animation: `${this.baseAnimationPath}/pulse-feedback.gif`,
        screenshot: `${this.baseImagePath}/screenshots/feedback-panel.png`,
        description: '实时反馈界面'
      },
      'learning-path': {
        icon: '🎯',
        image: `${this.baseImagePath}/learning-path.jpg`,
        animation: `${this.baseAnimationPath}/path-progress.gif`,
        screenshot: `${this.baseImagePath}/screenshots/learning-dashboard.png`,
        description: '学习路径规划界面'
      },
      'ai-interaction': {
        icon: '🤖',
        image: `${this.baseImagePath}/ai-interaction.jpg`,
        animation: `${this.baseAnimationPath}/robot-chat.gif`,
        screenshot: `${this.baseImagePath}/screenshots/ai-chat-interface.png`,
        description: 'AI交互对话界面'
      }
    }
  }



  /**
   * 获取技术架构相关的图表和图片
   */
  getArchitectureMedia() {
    return {
      diagrams: {
        overview: `${this.baseImagePath}/architecture/system-overview.svg`,
        frontend: `${this.baseImagePath}/architecture/frontend-arch.svg`,
        backend: `${this.baseImagePath}/architecture/backend-arch.svg`,
        ai: `${this.baseImagePath}/architecture/ai-pipeline.svg`,
        data: `${this.baseImagePath}/architecture/data-flow.svg`
      },
      animations: {
        dataFlow: `${this.baseAnimationPath}/data-flow.gif`,
        aiProcessing: `${this.baseAnimationPath}/ai-processing.gif`,
        systemInteraction: `${this.baseAnimationPath}/system-interaction.gif`
      },
      icons: {
        vue: `${this.baseImagePath}/tech-icons/vue.svg`,
        python: `${this.baseImagePath}/tech-icons/python.svg`,
        fastapi: `${this.baseImagePath}/tech-icons/fastapi.svg`,
        spark: `${this.baseImagePath}/tech-icons/spark.svg`,
        postgresql: `${this.baseImagePath}/tech-icons/postgresql.svg`,
        redis: `${this.baseImagePath}/tech-icons/redis.svg`
      }
    }
  }

  /**
   * 获取背景装饰元素
   */
  getBackgroundElements() {
    return {
      patterns: {
        grid: `${this.baseImagePath}/patterns/grid-pattern.svg`,
        dots: `${this.baseImagePath}/patterns/dots-pattern.svg`,
        waves: `${this.baseImagePath}/patterns/waves-pattern.svg`,
        circuit: `${this.baseImagePath}/patterns/circuit-pattern.svg`
      },
      particles: {
        floating: `${this.baseAnimationPath}/floating-particles.gif`,
        tech: `${this.baseAnimationPath}/tech-particles.gif`,
        data: `${this.baseAnimationPath}/data-particles.gif`
      },
      decorations: {
        glow: `${this.baseImagePath}/decorations/glow-effect.png`,
        gradient: `${this.baseImagePath}/decorations/gradient-overlay.png`,
        light: `${this.baseImagePath}/decorations/light-rays.png`
      }
    }
  }

  /**
   * 获取交互体验相关的媒体
   */
  getInteractiveMedia() {
    return {
      screenshots: {
        interview: `${this.baseImagePath}/screenshots/interview-process.png`,
        analysis: `${this.baseImagePath}/screenshots/analysis-results.png`,
        report: `${this.baseImagePath}/screenshots/final-report.png`,
        dashboard: `${this.baseImagePath}/screenshots/user-dashboard.png`
      },
      animations: {
        typing: `${this.baseAnimationPath}/typing-animation.gif`,
        loading: `${this.baseAnimationPath}/loading-spinner.gif`,
        progress: `${this.baseAnimationPath}/progress-bar.gif`,
        success: `${this.baseAnimationPath}/success-checkmark.gif`
      },
      mockups: {
        mobile: `${this.baseImagePath}/mockups/mobile-interface.png`,
        tablet: `${this.baseImagePath}/mockups/tablet-interface.png`,
        desktop: `${this.baseImagePath}/mockups/desktop-interface.png`
      }
    }
  }

  /**
   * 创建占位符图片URL（用于开发阶段）
   */
  createPlaceholder(width = 400, height = 300, text = 'Demo Image', bgColor = '667eea', textColor = 'ffffff') {
    // 尝试多个占位符服务
    const sources = [
      `https://via.placeholder.com/${width}x${height}/${bgColor}/${textColor}?text=${encodeURIComponent(text)}`,
      `https://dummyimage.com/${width}x${height}/${bgColor}/${textColor}&text=${encodeURIComponent(text)}`,
      this.createLocalPlaceholder(width, height, text, bgColor)
    ]

    return sources[0] // 主要使用第一个源
  }

  /**
   * 创建本地SVG占位符（作为最终备用）
   */
  createLocalPlaceholder(width = 400, height = 300, text = 'Demo Image', bgColor = '667eea') {
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#${bgColor};stop-opacity:1" />
            <stop offset="100%" style="stop-color:#${bgColor}88;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad)"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="16"
              fill="white" text-anchor="middle" dy=".3em">${text}</text>
      </svg>
    `
    return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`
  }

  /**
   * 创建图片URL（使用可用的图片源）
   */
  createUnsplashImage(keywords, width = 400, height = 300) {
    // 使用Picsum作为可靠的图片源
    const imageId = this.getImageIdFromKeywords(keywords)
    return `https://picsum.photos/${width}/${height}?random=${imageId}`
  }

  /**
   * 根据关键词生成图片ID
   */
  getImageIdFromKeywords(keywords) {
    // 为不同关键词分配特定的图片ID，确保一致性
    const keywordMap = {
      'microphone,voice,recording,technology': 1,
      'artificial-intelligence,neural-network,brain': 2,
      'charts,analytics,business,data': 3,
      'real-time,monitoring,dashboard': 4,
      'education,learning,books,growth': 5,
      'robot,ai,assistant,technology': 6,
      'interface,dashboard,microphone,camera': 7,
      'machine-learning,algorithm,data': 8,
      'business,report,presentation': 9,
      'live,streaming,broadcast': 10,
      'training,development,skills': 11,
      'chatbot,conversation,ai': 12,
      'big-data,analytics,visualization': 13,
      'iot,internet-of-things,sensors': 14,
      'voice,waveform,audio': 15,
      'recording,studio,professional': 16,
      'neural-network,deep-learning': 17,
      'data-visualization,charts': 18,
      'dashboard,interface,ui': 19,
      'feedback,rating,stars': 20,
      'learning-path,roadmap': 21,
      'ai-chat,conversation': 22,
      'technology,innovation,future': 23,
      'computer,programming,code': 24,
      'network,connection,cloud': 25,
      'database,storage,server': 26,
      'mobile,app,smartphone': 27,
      'security,lock,protection': 28,
      'analytics,graph,statistics': 29,
      'automation,robot,efficiency': 30
    }

    return keywordMap[keywords] || Math.abs(this.hashCode(keywords)) % 100 + 1
  }

  /**
   * 简单的字符串哈希函数
   */
  hashCode(str) {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // 转换为32位整数
    }
    return hash
  }

  /**
   * 获取所有媒体资源的占位符版本（用于开发）
   */
  getPlaceholderMedia() {
    return {
      features: {
        'multimodal-input': {
          image: this.createUnsplashImage('microphone,voice,recording,technology', 400, 300),
          screenshot: this.createUnsplashImage('interface,dashboard,microphone,camera', 800, 600),
          animation: this.createPlaceholder(200, 200, '语音波形', '1890ff'),
          thumbnail: this.createUnsplashImage('voice,waveform,audio', 300, 200),
          demo: this.createUnsplashImage('recording,studio,professional', 600, 400),
          gallery: [
            this.createUnsplashImage('microphone,professional,studio', 400, 300),
            this.createUnsplashImage('camera,video,recording', 400, 300),
            this.createUnsplashImage('keyboard,typing,text', 400, 300),
            this.createUnsplashImage('interface,ui,modern', 400, 300)
          ]
        },
        'ai-analysis': {
          image: this.createUnsplashImage('artificial-intelligence,brain,neural-network', 400, 300),
          screenshot: this.createUnsplashImage('analytics,dashboard,ai,charts', 800, 600),
          animation: this.createPlaceholder(200, 200, 'AI分析', '722ed1'),
          thumbnail: this.createUnsplashImage('brain,technology,analysis', 300, 200),
          demo: this.createUnsplashImage('machine-learning,data,visualization', 600, 400),
          gallery: [
            this.createUnsplashImage('neural-network,ai,technology', 400, 300),
            this.createUnsplashImage('data-analysis,charts,graphs', 400, 300),
            this.createUnsplashImage('algorithm,code,programming', 400, 300),
            this.createUnsplashImage('robot,artificial-intelligence', 400, 300)
          ]
        },
        'comprehensive-report': {
          image: this.createUnsplashImage('report,chart,analytics,business', 400, 300),
          screenshot: this.createUnsplashImage('dashboard,charts,graphs,data', 800, 600),
          animation: this.createPlaceholder(200, 200, '报告生成', 'faad14'),
          thumbnail: this.createUnsplashImage('document,chart,report', 300, 200),
          demo: this.createUnsplashImage('presentation,business,analytics', 600, 400),
          gallery: [
            this.createUnsplashImage('charts,graphs,analytics', 400, 300),
            this.createUnsplashImage('report,document,business', 400, 300),
            this.createUnsplashImage('dashboard,metrics,kpi', 400, 300),
            this.createUnsplashImage('presentation,slides,meeting', 400, 300)
          ]
        },
        'real-time-feedback': {
          image: this.createUnsplashImage('feedback,real-time,dashboard,live', 400, 300),
          screenshot: this.createUnsplashImage('live,dashboard,real-time,monitoring', 800, 600),
          animation: this.createPlaceholder(200, 200, '实时反馈', 'ff4d4f'),
          thumbnail: this.createUnsplashImage('live,streaming,real-time', 300, 200),
          demo: this.createUnsplashImage('monitoring,dashboard,live', 600, 400),
          gallery: [
            this.createUnsplashImage('live,streaming,broadcast', 400, 300),
            this.createUnsplashImage('monitoring,dashboard,control', 400, 300),
            this.createUnsplashImage('feedback,rating,evaluation', 400, 300),
            this.createUnsplashImage('real-time,instant,immediate', 400, 300)
          ]
        },
        'learning-path': {
          image: this.createUnsplashImage('learning,path,education,growth', 400, 300),
          screenshot: this.createUnsplashImage('education,course,learning,progress', 800, 600),
          animation: this.createPlaceholder(200, 200, '学习路径', '722ed1'),
          thumbnail: this.createUnsplashImage('education,book,learning', 300, 200),
          demo: this.createUnsplashImage('course,training,development', 600, 400),
          gallery: [
            this.createUnsplashImage('books,education,learning', 400, 300),
            this.createUnsplashImage('course,online,education', 400, 300),
            this.createUnsplashImage('progress,growth,development', 400, 300),
            this.createUnsplashImage('certificate,achievement,success', 400, 300)
          ]
        },
        'ai-interaction': {
          image: this.createUnsplashImage('robot,chat,interaction,ai', 400, 300),
          screenshot: this.createUnsplashImage('chatbot,interface,conversation', 800, 600),
          animation: this.createPlaceholder(200, 200, 'AI对话', '13c2c2'),
          thumbnail: this.createUnsplashImage('robot,communication,technology', 300, 200),
          demo: this.createUnsplashImage('ai,assistant,interaction', 600, 400),
          gallery: [
            this.createUnsplashImage('robot,ai,technology', 400, 300),
            this.createUnsplashImage('chat,conversation,communication', 400, 300),
            this.createUnsplashImage('assistant,help,support', 400, 300),
            this.createUnsplashImage('interaction,interface,user', 400, 300)
          ]
        }
      },
      // 功能演示图片
      demos: {
        textInterview: this.createUnsplashImage('interview,meeting,professional,business', 800, 450),
        voiceAnalysis: this.createUnsplashImage('microphone,voice,audio,technology', 800, 450),
        aiEvaluation: this.createUnsplashImage('analysis,data,charts,dashboard', 800, 450),
        reportGeneration: this.createUnsplashImage('report,presentation,business,analytics', 800, 450),
        // 技术领域图片
        aiTech: this.createUnsplashImage('artificial-intelligence,technology,neural-network', 800, 450),
        bigdataTech: this.createUnsplashImage('big-data,analytics,visualization,database', 800, 450),
        iotTech: this.createUnsplashImage('iot,internet-of-things,sensors,connectivity', 800, 450),
        // 系统功能图片
        dashboard: {
          intro: this.createUnsplashImage('introduction,welcome,technology', 400, 225),
          setup: this.createUnsplashImage('setup,configuration,settings', 400, 225),
          interaction: this.createUnsplashImage('interaction,user,interface', 400, 225),
          evaluation: this.createUnsplashImage('evaluation,assessment,analysis', 400, 225),
          report: this.createUnsplashImage('report,results,analytics', 400, 225),
          learning: this.createUnsplashImage('learning,education,growth', 400, 225)
        }
      },
      architecture: {
        systemOverview: this.createUnsplashImage('architecture,system,diagram,technology', 800, 600),
        dataFlow: this.createUnsplashImage('data-flow,process,workflow,diagram', 600, 400),
        aiPipeline: this.createUnsplashImage('ai,pipeline,machine-learning,process', 700, 500),
        microservices: this.createUnsplashImage('microservices,architecture,cloud,containers', 800, 600),
        database: this.createUnsplashImage('database,storage,data,server', 600, 400),
        api: this.createUnsplashImage('api,integration,network,connection', 700, 500),
        security: this.createUnsplashImage('security,protection,encryption,shield', 600, 400),
        deployment: this.createUnsplashImage('deployment,cloud,server,infrastructure', 800, 600),
        // 技术栈图标
        techStack: {
          frontend: this.createUnsplashImage('frontend,web,javascript,react', 300, 200),
          backend: this.createUnsplashImage('backend,server,api,nodejs', 300, 200),
          database: this.createUnsplashImage('database,mysql,mongodb,data', 300, 200),
          ai: this.createUnsplashImage('ai,machine-learning,neural-network', 300, 200),
          cloud: this.createUnsplashImage('cloud,aws,azure,infrastructure', 300, 200),
          mobile: this.createUnsplashImage('mobile,app,smartphone,responsive', 300, 200)
        }
      },
      screenshots: {
        // 主要界面截图
        dashboard: this.createUnsplashImage('dashboard,interface,modern,analytics', 600, 400),
        interview: this.createUnsplashImage('interview,meeting,professional,video-call', 600, 400),
        analysis: this.createUnsplashImage('analytics,data,visualization,charts', 600, 400),
        report: this.createUnsplashImage('report,document,business,presentation', 600, 400),
        // 用户流程截图
        login: this.createUnsplashImage('login,interface,security,authentication', 600, 400),
        profile: this.createUnsplashImage('profile,user,interface,personal', 600, 400),
        settings: this.createUnsplashImage('settings,configuration,interface,controls', 600, 400),
        results: this.createUnsplashImage('results,success,achievement,analytics', 600, 400),
        // 技术领域截图
        aiInterface: this.createUnsplashImage('ai,interface,machine-learning,dashboard', 600, 400),
        bigdataInterface: this.createUnsplashImage('big-data,analytics,visualization,dashboard', 600, 400),
        iotInterface: this.createUnsplashImage('iot,sensors,monitoring,dashboard', 600, 400),
        // 多模态交互截图
        voiceInput: this.createUnsplashImage('voice,microphone,recording,interface', 600, 400),
        videoInput: this.createUnsplashImage('video,camera,recording,interface', 600, 400),
        textInput: this.createUnsplashImage('text,typing,keyboard,interface', 600, 400),
        // 评测结果截图
        scoreBoard: this.createUnsplashImage('scoreboard,results,evaluation,metrics', 600, 400),
        radarChart: this.createUnsplashImage('radar-chart,analytics,assessment,visualization', 600, 400),
        improvement: this.createUnsplashImage('improvement,growth,development,progress', 600, 400)
      },
      backgrounds: {
        particles: this.createPlaceholder(1920, 1080, 'Particles Background', '000000', '667eea'),
        pattern: this.createPlaceholder(400, 400, 'Pattern', 'f8fafc', 'e2e8f0'),
        gradient: this.createPlaceholder(1920, 1080, 'Gradient Background', '667eea', '764ba2'),
        tech: this.createUnsplashImage('technology,abstract,digital,background', 1920, 1080)
      },
      // 技术领域专门资源
      domains: {
        ai: {
          icon: this.createUnsplashImage('artificial-intelligence,brain,robot', 100, 100),
          banner: this.createUnsplashImage('ai,technology,neural-network,banner', 800, 300),
          gallery: [
            this.createUnsplashImage('machine-learning,algorithm,code', 400, 300),
            this.createUnsplashImage('neural-network,ai,technology', 400, 300),
            this.createUnsplashImage('robot,automation,ai', 400, 300),
            this.createUnsplashImage('data-science,analytics,ai', 400, 300)
          ]
        },
        bigdata: {
          icon: this.createUnsplashImage('big-data,database,analytics', 100, 100),
          banner: this.createUnsplashImage('big-data,analytics,visualization,banner', 800, 300),
          gallery: [
            this.createUnsplashImage('data-visualization,charts,graphs', 400, 300),
            this.createUnsplashImage('database,server,storage', 400, 300),
            this.createUnsplashImage('analytics,metrics,dashboard', 400, 300),
            this.createUnsplashImage('cloud,data,processing', 400, 300)
          ]
        },
        iot: {
          icon: this.createUnsplashImage('iot,sensors,connectivity', 100, 100),
          banner: this.createUnsplashImage('iot,internet-of-things,sensors,banner', 800, 300),
          gallery: [
            this.createUnsplashImage('sensors,monitoring,iot', 400, 300),
            this.createUnsplashImage('smart-home,automation,iot', 400, 300),
            this.createUnsplashImage('connectivity,network,iot', 400, 300),
            this.createUnsplashImage('industrial,iot,manufacturing', 400, 300)
          ]
        }
      }
    }
  }

  /**
   * 获取技术领域相关的媒体资源
   */
  getDomainMedia(domain) {
    const placeholderMedia = this.getPlaceholderMedia()
    return placeholderMedia.domains[domain] || placeholderMedia.domains.ai
  }

  /**
   * 获取功能演示的图片库
   */
  getFeatureGallery(featureId) {
    const placeholderMedia = this.getPlaceholderMedia()
    return placeholderMedia.features[featureId]?.gallery || []
  }

  /**
   * 获取视频章节缩略图
   */
  getChapterThumbnail(chapterKey) {
    const placeholderMedia = this.getPlaceholderMedia()
    return placeholderMedia.videos.chapters[chapterKey] ||
           this.createUnsplashImage('video,chapter,tutorial', 400, 225)
  }

  /**
   * 获取技术栈图标
   */
  getTechStackIcon(techName) {
    const placeholderMedia = this.getPlaceholderMedia()
    return placeholderMedia.architecture.techStack[techName] ||
           this.createUnsplashImage(`${techName},technology,icon`, 300, 200)
  }

  /**
   * 获取界面截图
   */
  getInterfaceScreenshot(screenType) {
    const placeholderMedia = this.getPlaceholderMedia()
    return placeholderMedia.screenshots[screenType] ||
           this.createUnsplashImage(`${screenType},interface,screenshot`, 600, 400)
  }

  /**
   * 生成多媒体内容集合
   */
  generateMediaCollection(category, count = 4) {
    const keywords = {
      interview: ['interview', 'meeting', 'professional', 'business'],
      technology: ['technology', 'innovation', 'digital', 'modern'],
      analytics: ['analytics', 'data', 'charts', 'visualization'],
      education: ['education', 'learning', 'training', 'development'],
      ai: ['artificial-intelligence', 'machine-learning', 'neural-network', 'robot'],
      bigdata: ['big-data', 'database', 'analytics', 'visualization'],
      iot: ['iot', 'sensors', 'connectivity', 'smart-devices']
    }

    const categoryKeywords = keywords[category] || keywords.technology
    const collection = []

    for (let i = 0; i < count; i++) {
      const keyword = categoryKeywords[i % categoryKeywords.length]
      collection.push({
        id: `${category}-${i + 1}`,
        title: `${category.toUpperCase()} 演示 ${i + 1}`,
        image: this.createUnsplashImage(`${keyword},professional,demo`, 400, 300),
        thumbnail: this.createUnsplashImage(`${keyword},thumbnail`, 200, 150),
        description: `专业的${category}功能演示内容`
      })
    }

    return collection
  }

  /**
   * 获取响应式图片源集
   */
  getResponsiveImageSources(keywords, baseWidth = 400, baseHeight = 300) {
    return {
      mobile: this.createUnsplashImage(keywords, Math.floor(baseWidth * 0.5), Math.floor(baseHeight * 0.5)),
      tablet: this.createUnsplashImage(keywords, Math.floor(baseWidth * 0.75), Math.floor(baseHeight * 0.75)),
      desktop: this.createUnsplashImage(keywords, baseWidth, baseHeight),
      large: this.createUnsplashImage(keywords, Math.floor(baseWidth * 1.5), Math.floor(baseHeight * 1.5))
    }
  }

  /**
   * 检查图片是否存在
   */
  async checkImageExists(url) {
    try {
      const response = await fetch(url, { method: 'HEAD' })
      return response.ok
    } catch {
      return false
    }
  }

  /**
   * 获取图片或返回占位符
   */
  async getImageOrPlaceholder(originalUrl, placeholderUrl) {
    const exists = await this.checkImageExists(originalUrl)
    return exists ? originalUrl : placeholderUrl
  }
}

export default new MediaService()
