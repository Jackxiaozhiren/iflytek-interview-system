/**
 * HTTP请求工具
 * 基于axios封装的请求库，提供统一的请求和响应处理
 */
import axios from 'axios'
import { ElMessage, ElMessageBox } from 'element-plus'

// 创建axios实例
const service = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000',
  timeout: 30000, // 请求超时时间
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 在发送请求之前做些什么
    console.log('发送请求:', config.method?.toUpperCase(), config.url)
    
    // 可以在这里添加token等认证信息
    // const token = getToken()
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`
    // }
    
    return config
  },
  error => {
    // 对请求错误做些什么
    console.error('请求错误:', error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {
    // 对响应数据做点什么
    const res = response.data
    console.log('收到响应:', response.status, response.config.url)
    
    // 如果响应状态码不是200，则认为是错误
    if (response.status !== 200) {
      ElMessage.error(res.message || '请求失败')
      return Promise.reject(new Error(res.message || '请求失败'))
    }
    
    // 检查业务状态码
    if (res.success === false) {
      ElMessage.error(res.message || '操作失败')
      return Promise.reject(new Error(res.message || '操作失败'))
    }
    
    return res
  },
  error => {
    // 对响应错误做点什么
    console.error('响应错误:', error)
    
    let message = '网络错误'
    
    if (error.response) {
      // 服务器返回了错误状态码
      const { status, data } = error.response
      
      switch (status) {
        case 400:
          message = data.detail || '请求参数错误'
          break
        case 401:
          message = '未授权，请重新登录'
          // 可以在这里处理登录过期逻辑
          break
        case 403:
          message = '拒绝访问'
          break
        case 404:
          message = data.detail || '请求的资源不存在'
          break
        case 422:
          message = data.detail || '请求参数验证失败'
          break
        case 500:
          message = data.detail || '服务器内部错误'
          break
        case 502:
          message = '网关错误'
          break
        case 503:
          message = '服务不可用'
          break
        case 504:
          message = '网关超时'
          break
        default:
          message = data.detail || `连接错误${status}`
      }
    } else if (error.request) {
      // 请求已发出，但没有收到响应
      if (error.code === 'ECONNABORTED') {
        message = '请求超时，请稍后重试'
      } else {
        message = '网络连接失败，请检查网络设置'
      }
    } else {
      // 发生了一些问题，触发了一个错误
      message = error.message || '请求失败'
    }
    
    // 显示错误消息
    ElMessage.error(message)
    
    return Promise.reject(error)
  }
)

// 导出请求方法
export default service

// 便捷方法
export const request = {
  get(url, config) {
    return service.get(url, config)
  },
  
  post(url, data, config) {
    return service.post(url, data, config)
  },
  
  put(url, data, config) {
    return service.put(url, data, config)
  },
  
  delete(url, config) {
    return service.delete(url, config)
  },
  
  patch(url, data, config) {
    return service.patch(url, data, config)
  }
}

// 文件上传方法
export const uploadFile = (url, file, onProgress) => {
  const formData = new FormData()
  formData.append('file', file)
  
  return service.post(url, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(progress)
      }
    }
  })
}

// 下载文件方法
export const downloadFile = (url, filename) => {
  return service.get(url, {
    responseType: 'blob'
  }).then(response => {
    const blob = new Blob([response.data])
    const downloadUrl = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = downloadUrl
    link.download = filename || 'download'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(downloadUrl)
  })
}

// 批量请求方法
export const batchRequest = (requests) => {
  return Promise.allSettled(requests.map(req => {
    const { method = 'get', url, data, config } = req
    return service[method](url, data, config)
  }))
}

// 重试请求方法
export const retryRequest = (requestFn, maxRetries = 3, delay = 1000) => {
  return new Promise((resolve, reject) => {
    let retries = 0
    
    const attempt = () => {
      requestFn()
        .then(resolve)
        .catch(error => {
          retries++
          if (retries < maxRetries) {
            setTimeout(attempt, delay * retries)
          } else {
            reject(error)
          }
        })
    }
    
    attempt()
  })
}

// 请求缓存（简单实现）
const requestCache = new Map()

export const cachedRequest = (key, requestFn, ttl = 5 * 60 * 1000) => {
  const cached = requestCache.get(key)
  const now = Date.now()
  
  if (cached && (now - cached.timestamp) < ttl) {
    return Promise.resolve(cached.data)
  }
  
  return requestFn().then(data => {
    requestCache.set(key, {
      data,
      timestamp: now
    })
    return data
  })
}

// 清除缓存
export const clearCache = (key) => {
  if (key) {
    requestCache.delete(key)
  } else {
    requestCache.clear()
  }
}
