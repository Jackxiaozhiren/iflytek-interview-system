/**
 * 面试相关API接口
 */
import request from '@/utils/request'

export const interviewApi = {
  /**
   * 获取所有技术领域
   */
  getDomains() {
    return request({
      url: '/api/v1/domains',
      method: 'get'
    })
  },

  /**
   * 获取指定领域的岗位列表
   * @param {string} domain - 技术领域
   */
  getPositions(domain) {
    return request({
      url: `/api/v1/domains/${domain}/positions`,
      method: 'get'
    })
  },

  /**
   * 获取指定领域和岗位的面试题目
   * @param {string} domain - 技术领域
   * @param {string} position - 岗位类型
   */
  getQuestions(domain, position) {
    return request({
      url: '/api/v1/questions',
      method: 'post',
      data: {
        domain,
        position
      }
    })
  },

  /**
   * 创建面试会话
   * @param {string} domain - 技术领域
   * @param {string} position - 岗位类型
   */
  createSession(domain, position) {
    return request({
      url: '/api/v1/interview/session',
      method: 'post',
      data: {
        domain,
        position
      }
    })
  },

  /**
   * 获取面试会话信息
   * @param {number} sessionId - 会话ID
   */
  getSession(sessionId) {
    return request({
      url: `/api/v1/interview/session/${sessionId}`,
      method: 'get'
    })
  },

  /**
   * 获取当前题目
   * @param {number} sessionId - 会话ID
   */
  getCurrentQuestion(sessionId) {
    return request({
      url: `/api/v1/interview/session/${sessionId}/current-question`,
      method: 'get'
    })
  },

  /**
   * 移动到下一题
   * @param {number} sessionId - 会话ID
   */
  moveToNextQuestion(sessionId) {
    return request({
      url: `/api/v1/interview/session/${sessionId}/next-question`,
      method: 'post'
    })
  },

  /**
   * 多模态分析接口
   * @param {Object} data - 分析数据
   * @param {number} data.session_id - 会话ID
   * @param {string} data.text_data - 文本数据
   * @param {string} data.question_text - 题目文本
   * @param {string} [data.audio_data] - 音频数据(base64)
   * @param {string} [data.video_data] - 视频数据(base64)
   */
  analyzeMultimodal(data) {
    return request({
      url: '/api/v1/analysis/multimodal',
      method: 'post',
      data,
      timeout: 30000 // 30秒超时，因为分析可能需要较长时间
    })
  },

  /**
   * 开始面试对话
   * @param {Object} data - 面试数据
   */
  startInterview(data) {
    return request({
      url: '/api/v1/interview/start',
      method: 'post',
      data
    })
  },

  /**
   * 增强版开始面试 - 使用专业问题库和智能分析
   * @param {Object} data - 面试数据
   */
  enhancedStartInterview(data) {
    return request({
      url: '/api/v1/interview/enhanced-start',
      method: 'post',
      data
    })
  },

  /**
   * 继续面试对话
   * @param {Object} data - 对话数据
   */
  continueInterview(data) {
    return request({
      url: '/api/v1/interview/next',
      method: 'post',
      data
    })
  },

  /**
   * 增强版继续面试 - 智能引导和专业追问
   * @param {Object} data - 对话数据
   */
  enhancedContinueInterview(data) {
    return request({
      url: '/api/v1/interview/enhanced-next',
      method: 'post',
      data
    })
  },

  /**
   * 高级AI面试官开始 - 深度分析思路和专业问题
   * @param {Object} data - 面试数据
   */
  advancedStartInterview(data) {
    return request({
      url: '/api/v1/interview/advanced-start',
      method: 'post',
      data
    })
  },

  /**
   * 高级AI面试官继续 - 智能分析和针对性引导
   * @param {Object} data - 对话数据
   */
  advancedContinueInterview(data) {
    return request({
      url: '/api/v1/interview/advanced-next',
      method: 'post',
      data
    })
  },

  /**
   * 结束面试
   * @param {Object} data - 结束面试数据
   */
  endInterview(data) {
    return request({
      url: '/api/v1/interview/end',
      method: 'post',
      data
    })
  },

  /**
   * 获取面试报告
   * @param {number} sessionId - 会话ID
   */
  getInterviewReport(sessionId) {
    return request({
      url: `/api/v1/interview/report/${sessionId}`,
      method: 'get'
    })
  },

  /**
   * 生成面试评估报告
   * @param {number} sessionId - 会话ID
   */
  generateReport(sessionId) {
    return request({
      url: `/api/v1/interview/generate-report/${sessionId}`,
      method: 'post'
    })
  },

  /**
   * 增强版6项核心能力评估
   * @param {Object} data - 评估数据
   * @param {string} [data.text_data] - 文本数据
   * @param {Object} [data.audio_analysis] - 音频分析结果
   * @param {Object} [data.video_analysis] - 视频分析结果
   * @param {string} [data.question_context] - 问题上下文
   * @param {string} data.domain - 技术领域
   * @param {string} data.position - 职位类型
   */
  enhancedCapabilityAssessment(data) {
    return request({
      url: '/api/v1/analysis/enhanced-capability',
      method: 'post',
      data,
      timeout: 45000 // 45秒超时，AI分析需要较长时间
    })
  },

  /**
   * 获取能力评估历史记录
   */
  getCapabilityHistory() {
    return request({
      url: '/api/v1/analysis/capability-history',
      method: 'get'
    })
  }
}

// 面试状态管理
export const interviewStatus = {
  PREPARING: 'preparing',    // 准备中
  ACTIVE: 'active',         // 进行中
  PAUSED: 'paused',         // 暂停
  COMPLETED: 'completed',   // 已完成
  CANCELLED: 'cancelled'    // 已取消
}

// 题目类型
export const questionTypes = {
  TECHNICAL: 'technical',     // 技术题
  BEHAVIORAL: 'behavioral',   // 行为题
  SCENARIO: 'scenario',       // 场景题
  CODING: 'coding'           // 编程题
}

// 难度等级
export const difficultyLevels = {
  EASY: 'easy',      // 简单
  MEDIUM: 'medium',  // 中等
  HARD: 'hard'       // 困难
}

// 技术领域
export const domains = {
  AI: '人工智能',
  BIG_DATA: '大数据',
  IOT: '物联网'
}

// 岗位类型
export const positions = {
  TECHNICAL: '技术岗',
  DEVOPS_TEST: '运维测试岗',
  PRODUCT: '产品岗'
}

// 分析指标
export const analysisMetrics = {
  // 文本分析指标
  CONTENT_RELEVANCE: 'content_relevance',      // 内容相关性
  LOGICAL_STRUCTURE: 'logical_structure',      // 逻辑结构
  KEYWORD_COVERAGE: 'keyword_coverage',        // 关键词覆盖
  INNOVATION: 'innovation',                    // 创新性
  
  // 语音分析指标
  SPEECH_CLARITY: 'speech_clarity',            // 语音清晰度
  SPEECH_SPEED: 'speech_speed',                // 语速
  EMOTION_SCORE: 'emotion_score',              // 情感得分
  PAUSE_FREQUENCY: 'pause_frequency',          // 停顿频率
  
  // 视频分析指标
  EYE_CONTACT: 'eye_contact_score',            // 眼神交流
  FACIAL_EXPRESSION: 'facial_expression_score', // 面部表情
  POSTURE: 'posture_score',                    // 身体姿态
  GESTURE: 'gesture_appropriateness'           // 手势得体性
}

// 工具函数
export const interviewUtils = {
  /**
   * 格式化时间
   * @param {number} seconds - 秒数
   * @returns {string} 格式化后的时间字符串
   */
  formatTime(seconds) {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  },

  /**
   * 计算进度百分比
   * @param {number} current - 当前进度
   * @param {number} total - 总数
   * @returns {number} 百分比
   */
  calculateProgress(current, total) {
    return total > 0 ? Math.round((current / total) * 100) : 0
  },

  /**
   * 获取难度等级颜色
   * @param {string} difficulty - 难度等级
   * @returns {string} 颜色类型
   */
  getDifficultyColor(difficulty) {
    switch(difficulty) {
      case difficultyLevels.EASY:
        return 'success'
      case difficultyLevels.MEDIUM:
        return 'warning'
      case difficultyLevels.HARD:
        return 'danger'
      default:
        return 'info'
    }
  },

  /**
   * 获取分析得分等级
   * @param {number} score - 得分 (0-100)
   * @returns {Object} 等级信息
   */
  getScoreLevel(score) {
    if (score >= 90) {
      return { level: '优秀', color: '#67C23A', icon: 'el-icon-success' }
    } else if (score >= 80) {
      return { level: '良好', color: '#409EFF', icon: 'el-icon-info' }
    } else if (score >= 70) {
      return { level: '中等', color: '#E6A23C', icon: 'el-icon-warning' }
    } else if (score >= 60) {
      return { level: '及格', color: '#F56C6C', icon: 'el-icon-error' }
    } else {
      return { level: '不及格', color: '#909399', icon: 'el-icon-close' }
    }
  },

  /**
   * 验证音频文件
   * @param {File} file - 音频文件
   * @returns {boolean} 是否有效
   */
  validateAudioFile(file) {
    const validTypes = ['audio/wav', 'audio/mp3', 'audio/ogg', 'audio/webm']
    const maxSize = 50 * 1024 * 1024 // 50MB
    
    return validTypes.includes(file.type) && file.size <= maxSize
  },

  /**
   * 验证视频文件
   * @param {File} file - 视频文件
   * @returns {boolean} 是否有效
   */
  validateVideoFile(file) {
    const validTypes = ['video/mp4', 'video/webm', 'video/ogg']
    const maxSize = 100 * 1024 * 1024 // 100MB
    
    return validTypes.includes(file.type) && file.size <= maxSize
  },

  /**
   * 将Blob转换为Base64
   * @param {Blob} blob - Blob对象
   * @returns {Promise<string>} Base64字符串
   */
  blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result.split(',')[1]
        resolve(base64)
      }
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }
}
