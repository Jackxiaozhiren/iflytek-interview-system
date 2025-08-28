/**
 * iFlytek语音服务 - 前端集成
 * 集成iFlytek Spark语音识别和语音合成功能
 */

class IFlytekVoiceService {
  constructor() {
    this.config = {
      baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
      endpoints: {
        asr: '/api/v1/iflytek/asr',
        tts: '/api/v1/iflytek/tts',
        voiceAnalysis: '/api/v1/iflytek/voice-analysis'
      }
    }
    
    this.isInitialized = false
    this.currentRecognitionSession = null
    this.recognitionCallbacks = new Map()
    
    console.log('🎤 iFlytek语音服务初始化')
  }

  /**
   * 初始化语音服务
   */
  async initialize() {
    try {
      // 检查后端服务可用性
      const response = await fetch(`${this.config.baseUrl}/api/v1/health`)
      if (!response.ok) {
        throw new Error('后端服务不可用')
      }
      
      this.isInitialized = true
      console.log('✅ iFlytek语音服务初始化成功')
      return true
    } catch (error) {
      console.error('❌ iFlytek语音服务初始化失败:', error)
      this.isInitialized = false
      return false
    }
  }

  /**
   * 语音识别 - 实时流式识别
   * @param {Blob} audioBlob - 音频数据
   * @param {Object} options - 识别选项
   */
  async recognizeAudio(audioBlob, options = {}) {
    if (!this.isInitialized) {
      await this.initialize()
    }

    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'audio.wav')
      formData.append('language', options.language || 'zh-CN')
      formData.append('format', options.format || 'wav')
      formData.append('sample_rate', options.sampleRate || '16000')

      const response = await fetch(`${this.config.baseUrl}${this.config.endpoints.asr}`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`语音识别请求失败: ${response.status}`)
      }

      const result = await response.json()
      
      return {
        text: result.text || '',
        confidence: result.confidence || 0,
        segments: result.segments || [],
        duration: result.duration || 0,
        success: result.success || false
      }
    } catch (error) {
      console.error('语音识别失败:', error)
      return {
        text: '',
        confidence: 0,
        segments: [],
        duration: 0,
        success: false,
        error: error.message
      }
    }
  }

  /**
   * 实时语音识别 - WebSocket连接
   * @param {Object} options - 识别选项
   * @param {Function} onResult - 结果回调
   * @param {Function} onError - 错误回调
   */
  async startRealtimeRecognition(options = {}, onResult, onError) {
    if (!this.isInitialized) {
      await this.initialize()
    }

    try {
      // 创建WebSocket连接
      const wsUrl = `${this.config.baseUrl.replace('http', 'ws')}/api/v1/iflytek/asr/realtime`
      const ws = new WebSocket(wsUrl)
      
      const sessionId = Date.now().toString()
      this.currentRecognitionSession = {
        id: sessionId,
        ws: ws,
        isActive: true
      }

      ws.onopen = () => {
        console.log('🔗 实时语音识别连接建立')
        // 发送配置信息
        ws.send(JSON.stringify({
          action: 'start',
          config: {
            language: options.language || 'zh-CN',
            format: options.format || 'wav',
            sample_rate: options.sampleRate || 16000,
            enable_intermediate_result: true
          }
        }))
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          if (data.type === 'result' && onResult) {
            onResult({
              text: data.text || '',
              confidence: data.confidence || 0,
              isFinal: data.is_final || false,
              timestamp: data.timestamp || Date.now()
            })
          }
        } catch (error) {
          console.error('解析识别结果失败:', error)
        }
      }

      ws.onerror = (error) => {
        console.error('实时语音识别错误:', error)
        if (onError) {
          onError(error)
        }
      }

      ws.onclose = () => {
        console.log('🔌 实时语音识别连接关闭')
        this.currentRecognitionSession = null
      }

      return sessionId
    } catch (error) {
      console.error('启动实时语音识别失败:', error)
      if (onError) {
        onError(error)
      }
      return null
    }
  }

  /**
   * 发送音频数据到实时识别
   * @param {ArrayBuffer} audioData - 音频数据
   */
  sendAudioData(audioData) {
    if (this.currentRecognitionSession && this.currentRecognitionSession.ws.readyState === WebSocket.OPEN) {
      // 将音频数据转换为Base64
      const base64Audio = this.arrayBufferToBase64(audioData)
      this.currentRecognitionSession.ws.send(JSON.stringify({
        action: 'audio',
        data: base64Audio
      }))
    }
  }

  /**
   * 停止实时语音识别
   */
  stopRealtimeRecognition() {
    if (this.currentRecognitionSession) {
      this.currentRecognitionSession.ws.send(JSON.stringify({
        action: 'stop'
      }))
      this.currentRecognitionSession.ws.close()
      this.currentRecognitionSession = null
    }
  }

  /**
   * 语音合成
   * @param {string} text - 要合成的文本
   * @param {Object} options - 合成选项
   */
  async synthesizeText(text, options = {}) {
    if (!this.isInitialized) {
      await this.initialize()
    }

    try {
      const response = await fetch(`${this.config.baseUrl}${this.config.endpoints.tts}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          text: text,
          voice: options.voice || 'xiaoyan',
          speed: options.speed || 50,
          volume: options.volume || 50,
          pitch: options.pitch || 50,
          format: options.format || 'wav'
        })
      })

      if (!response.ok) {
        throw new Error(`语音合成请求失败: ${response.status}`)
      }

      const audioBlob = await response.blob()
      return {
        audio: audioBlob,
        success: true
      }
    } catch (error) {
      console.error('语音合成失败:', error)
      return {
        audio: null,
        success: false,
        error: error.message
      }
    }
  }

  /**
   * 语音质量分析
   * @param {Blob} audioBlob - 音频数据
   */
  async analyzeVoiceQuality(audioBlob) {
    if (!this.isInitialized) {
      await this.initialize()
    }

    try {
      const formData = new FormData()
      formData.append('audio', audioBlob, 'audio.wav')

      const response = await fetch(`${this.config.baseUrl}${this.config.endpoints.voiceAnalysis}`, {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        throw new Error(`语音分析请求失败: ${response.status}`)
      }

      const result = await response.json()
      
      return {
        quality_score: result.quality_score || 0,
        clarity: result.clarity || 0,
        fluency: result.fluency || 0,
        pronunciation: result.pronunciation || 0,
        emotion: result.emotion || 'neutral',
        speech_rate: result.speech_rate || 0,
        volume_level: result.volume_level || 0,
        success: result.success || false
      }
    } catch (error) {
      console.error('语音质量分析失败:', error)
      return {
        quality_score: 0,
        clarity: 0,
        fluency: 0,
        pronunciation: 0,
        emotion: 'neutral',
        speech_rate: 0,
        volume_level: 0,
        success: false,
        error: error.message
      }
    }
  }

  /**
   * 工具方法：ArrayBuffer转Base64
   */
  arrayBufferToBase64(buffer) {
    let binary = ''
    const bytes = new Uint8Array(buffer)
    const len = bytes.byteLength
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return window.btoa(binary)
  }

  /**
   * 检查服务状态
   */
  isServiceAvailable() {
    return this.isInitialized
  }

  /**
   * 获取支持的语音列表
   */
  async getSupportedVoices() {
    try {
      const response = await fetch(`${this.config.baseUrl}/api/v1/iflytek/voices`)
      if (response.ok) {
        const data = await response.json()
        return data.voices || []
      }
    } catch (error) {
      console.error('获取语音列表失败:', error)
    }
    return []
  }
}

// 创建单例实例
const iflytekVoiceService = new IFlytekVoiceService()

export default iflytekVoiceService
