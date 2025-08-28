/**
 * 演示页面状态管理
 * 统一管理多媒体播放器组件间的数据传递和状态同步
 */

import { ref, reactive, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'

// 全局状态
const state = reactive({
  // 当前播放状态
  currentVideo: null,
  isPlaying: false,
  currentTime: 0,
  duration: 0,
  volume: 80,
  playbackRate: 1,
  quality: 'auto',
  
  // 播放历史
  playHistory: [],
  
  // 章节状态
  currentChapter: 0,
  chaptersWatched: new Set(),
  
  // 统计数据
  totalPlayTime: 0,
  sessionStartTime: null,
  
  // UI状态
  showChaptersList: false,
  showSubtitles: false,
  isFullscreen: false,
  isPictureInPicture: false,
  
  // 性能监控
  loadingTimes: [],
  errorCount: 0,
  
  // 用户偏好
  preferences: {
    autoplay: false,
    defaultQuality: 'auto',
    defaultVolume: 80,
    defaultPlaybackRate: 1,
    showSubtitles: false,
    rememberPosition: true
  }
})

// 响应式引用
const activeTab = ref('overview')
const demoProgress = ref(0)
const isLoading = ref(false)
const error = ref(null)

// 计算属性
const playProgress = computed(() => {
  if (state.duration === 0) return 0
  return (state.currentTime / state.duration) * 100
})

const formattedPlayTime = computed(() => {
  const minutes = Math.floor(state.totalPlayTime / 60)
  const seconds = Math.floor(state.totalPlayTime % 60)
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
})

const currentVideoInfo = computed(() => {
  if (!state.currentVideo) return null
  
  return {
    ...state.currentVideo,
    progress: playProgress.value,
    currentChapter: state.currentChapter,
    chaptersWatched: state.chaptersWatched.size,
    totalChapters: state.currentVideo.chapters?.length || 0
  }
})

const performanceStats = computed(() => ({
  averageLoadTime: state.loadingTimes.length > 0 
    ? state.loadingTimes.reduce((a, b) => a + b, 0) / state.loadingTimes.length 
    : 0,
  errorRate: state.errorCount / Math.max(state.playHistory.length, 1),
  totalVideosWatched: state.playHistory.length,
  totalChaptersWatched: state.chaptersWatched.size
}))

// 动作方法
const actions = {
  // 设置当前视频
  setCurrentVideo(video) {
    state.currentVideo = video
    state.currentTime = 0
    state.currentChapter = 0
    
    // 记录播放历史
    if (video && !state.playHistory.find(v => v.id === video.id)) {
      state.playHistory.push({
        ...video,
        playedAt: new Date().toISOString(),
        completed: false
      })
    }
    
    console.log('📹 设置当前视频:', video?.title)
  },

  // 更新播放状态
  updatePlayState(isPlaying) {
    state.isPlaying = isPlaying
    
    if (isPlaying) {
      state.sessionStartTime = state.sessionStartTime || Date.now()
    }
    
    console.log('▶️ 播放状态更新:', isPlaying ? '播放' : '暂停')
  },

  // 更新播放进度
  updateProgress(currentTime, duration) {
    state.currentTime = currentTime
    state.duration = duration
    
    // 更新总播放时间
    if (state.isPlaying && state.sessionStartTime) {
      const sessionTime = (Date.now() - state.sessionStartTime) / 1000
      state.totalPlayTime += sessionTime / 60 // 转换为分钟
      state.sessionStartTime = Date.now()
    }
  },

  // 跳转到章节
  jumpToChapter(chapterIndex) {
    if (!state.currentVideo?.chapters?.[chapterIndex]) return
    
    state.currentChapter = chapterIndex
    state.chaptersWatched.add(chapterIndex)
    
    const chapter = state.currentVideo.chapters[chapterIndex]
    ElMessage.success(`跳转到章节: ${chapter.title}`)
    
    console.log('📖 跳转到章节:', chapter.title)
  },

  // 设置音量
  setVolume(volume) {
    state.volume = Math.max(0, Math.min(100, volume))
    state.preferences.defaultVolume = state.volume
    
    // 保存到本地存储
    localStorage.setItem('demo-volume', state.volume.toString())
  },

  // 设置播放速度
  setPlaybackRate(rate) {
    state.playbackRate = rate
    state.preferences.defaultPlaybackRate = rate
    
    localStorage.setItem('demo-playback-rate', rate.toString())
    ElMessage.success(`播放速度设置为 ${rate}x`)
  },

  // 设置视频质量
  setQuality(quality) {
    state.quality = quality
    state.preferences.defaultQuality = quality
    
    localStorage.setItem('demo-quality', quality)
    ElMessage.success(`视频质量设置为 ${quality}`)
  },

  // 切换字幕
  toggleSubtitles() {
    state.showSubtitles = !state.showSubtitles
    state.preferences.showSubtitles = state.showSubtitles
    
    localStorage.setItem('demo-subtitles', state.showSubtitles.toString())
    ElMessage.success(state.showSubtitles ? '字幕已开启' : '字幕已关闭')
  },

  // 切换章节列表
  toggleChaptersList() {
    state.showChaptersList = !state.showChaptersList
  },

  // 记录加载时间
  recordLoadTime(time) {
    state.loadingTimes.push(time)
    
    // 只保留最近50次记录
    if (state.loadingTimes.length > 50) {
      state.loadingTimes.shift()
    }
  },

  // 记录错误
  recordError(error) {
    state.errorCount++
    console.error('🚨 播放器错误:', error)
  },

  // 标记视频完成
  markVideoCompleted(videoId) {
    const historyItem = state.playHistory.find(v => v.id === videoId)
    if (historyItem) {
      historyItem.completed = true
      historyItem.completedAt = new Date().toISOString()
    }
    
    ElMessage.success('视频观看完成！')
  },

  // 重置状态
  reset() {
    state.currentVideo = null
    state.isPlaying = false
    state.currentTime = 0
    state.duration = 0
    state.currentChapter = 0
    state.sessionStartTime = null
    
    console.log('🔄 播放器状态已重置')
  },

  // 加载用户偏好
  loadPreferences() {
    try {
      const volume = localStorage.getItem('demo-volume')
      if (volume) state.volume = parseInt(volume)
      
      const playbackRate = localStorage.getItem('demo-playback-rate')
      if (playbackRate) state.playbackRate = parseFloat(playbackRate)
      
      const quality = localStorage.getItem('demo-quality')
      if (quality) state.quality = quality
      
      const subtitles = localStorage.getItem('demo-subtitles')
      if (subtitles) state.showSubtitles = subtitles === 'true'
      
      console.log('⚙️ 用户偏好已加载')
    } catch (error) {
      console.warn('⚠️ 加载用户偏好失败:', error)
    }
  },

  // 导出播放统计
  exportStats() {
    return {
      playHistory: state.playHistory,
      totalPlayTime: state.totalPlayTime,
      chaptersWatched: Array.from(state.chaptersWatched),
      performance: performanceStats.value,
      preferences: state.preferences,
      exportedAt: new Date().toISOString()
    }
  }
}

// 监听器
watch(() => state.currentTime, (newTime) => {
  // 自动检测当前章节
  if (state.currentVideo?.chapters) {
    const chapters = state.currentVideo.chapters
    for (let i = chapters.length - 1; i >= 0; i--) {
      const chapterTime = parseFloat(chapters[i].time.replace(':', '.'))
      const currentTimeMinutes = newTime / 60
      
      if (currentTimeMinutes >= chapterTime) {
        if (state.currentChapter !== i) {
          state.currentChapter = i
          state.chaptersWatched.add(i)
        }
        break
      }
    }
  }
})

// 初始化
actions.loadPreferences()

// 导出
export default {
  // 状态
  state,
  activeTab,
  demoProgress,
  isLoading,
  error,
  
  // 计算属性
  playProgress,
  formattedPlayTime,
  currentVideoInfo,
  performanceStats,
  
  // 动作
  ...actions
}
