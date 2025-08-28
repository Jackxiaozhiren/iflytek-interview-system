<template>
  <div class="env-debug-container">
    <div class="header">
      <h1>🔍 环境变量调试页面</h1>
      <p>检查 import.meta.env 在 Vue 组件中的工作状态</p>
    </div>

    <div class="debug-grid">
      <div class="debug-card">
        <h3>📋 import.meta 对象</h3>
        <pre>{{ importMetaInfo }}</pre>
      </div>

      <div class="debug-card">
        <h3>🌐 环境变量 (import.meta.env)</h3>
        <pre>{{ envInfo }}</pre>
      </div>

      <div class="debug-card">
        <h3>🚀 iFlytek 配置</h3>
        <pre>{{ iflytekConfig }}</pre>
      </div>

      <div class="debug-card">
        <h3>⚙️ 服务状态</h3>
        <pre>{{ serviceStatus }}</pre>
      </div>
    </div>

    <div class="actions">
      <el-button type="primary" @click="refreshData">
        🔄 刷新数据
      </el-button>
      <el-button @click="logToConsole">
        📝 输出到控制台
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { ElButton } from 'element-plus'
import enhancedIflytekSparkService from '@/services/enhancedIflytekSparkService'

const importMetaInfo = ref('')
const envInfo = ref('')
const iflytekConfig = ref('')
const serviceStatus = ref('')

const collectData = () => {
  // 1. import.meta 信息
  try {
    importMetaInfo.value = JSON.stringify({
      available: typeof import.meta !== 'undefined',
      env_available: typeof import.meta.env !== 'undefined',
      url: import.meta.url,
      hot: !!import.meta.hot
    }, null, 2)
  } catch (error) {
    importMetaInfo.value = `错误: ${error.message}`
  }

  // 2. 环境变量信息
  try {
    if (typeof import.meta.env !== 'undefined') {
      const env = import.meta.env
      const allKeys = Object.keys(env)
      const vueAppKeys = allKeys.filter(key => key.startsWith('VUE_APP_'))
      
      envInfo.value = JSON.stringify({
        total_vars: allKeys.length,
        vue_app_vars: vueAppKeys.length,
        mode: env.MODE,
        dev: env.DEV,
        prod: env.PROD,
        base_url: env.BASE_URL,
        vue_app_vars_detail: vueAppKeys.reduce((acc, key) => {
          acc[key] = env[key]
          return acc
        }, {})
      }, null, 2)
    } else {
      envInfo.value = 'import.meta.env 不可用'
    }
  } catch (error) {
    envInfo.value = `错误: ${error.message}`
  }

  // 3. iFlytek 配置
  try {
    const config = {
      api_url: import.meta.env.VUE_APP_IFLYTEK_API_URL,
      app_id: import.meta.env.VUE_APP_IFLYTEK_APP_ID,
      api_key: import.meta.env.VUE_APP_IFLYTEK_API_KEY ? '已配置' : '未配置',
      api_secret: import.meta.env.VUE_APP_IFLYTEK_API_SECRET ? '已配置' : '未配置',
      mock_mode: import.meta.env.VUE_APP_MOCK_API_RESPONSES,
      debug_mode: import.meta.env.VUE_APP_DEBUG_MODE
    }
    
    iflytekConfig.value = JSON.stringify(config, null, 2)
  } catch (error) {
    iflytekConfig.value = `错误: ${error.message}`
  }

  // 4. 服务状态
  try {
    if (enhancedIflytekSparkService) {
      const service = enhancedIflytekSparkService
      const status = {
        service_available: true,
        service_type: service.constructor.name,
        config_exists: !!service.config,
        config_details: service.config ? {
          base_url: service.config.baseUrl,
          app_id: service.config.appId,
          api_key: service.config.apiKey ? '已配置' : '未配置',
          api_secret: service.config.apiSecret ? '已配置' : '未配置',
          simulation_mode: service.config.appId === 'simulation_mode'
        } : null,
        methods: {
          callSparkAPI: typeof service.callSparkAPI === 'function',
          initializeInterviewSession: typeof service.initializeInterviewSession === 'function'
        }
      }
      
      serviceStatus.value = JSON.stringify(status, null, 2)
    } else {
      serviceStatus.value = '服务不可用'
    }
  } catch (error) {
    serviceStatus.value = `错误: ${error.message}`
  }
}

const refreshData = () => {
  collectData()
  console.log('🔄 数据已刷新')
}

const logToConsole = () => {
  console.log('🔍 环境变量调试信息:')
  console.log('import.meta:', import.meta)
  console.log('import.meta.env:', import.meta.env)
  console.log('iFlytek服务:', enhancedIflytekSparkService)
  console.log('服务配置:', enhancedIflytekSparkService?.config)
}

onMounted(() => {
  collectData()
  logToConsole()
})
</script>

<style scoped>
.env-debug-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
  color: white;
}

.header {
  text-align: center;
  margin-bottom: 30px;
}

.header h1 {
  font-size: 2.5em;
  margin-bottom: 10px;
}

.debug-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.debug-card {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 12px;
  backdrop-filter: blur(10px);
  border-left: 4px solid #4CAF50;
}

.debug-card h3 {
  margin-top: 0;
  margin-bottom: 15px;
  font-size: 1.2em;
}

.actions {
  text-align: center;
}

pre {
  background: rgba(0, 0, 0, 0.3);
  padding: 15px;
  border-radius: 8px;
  font-size: 0.85em;
  white-space: pre-wrap;
  overflow-x: auto;
  max-height: 400px;
  overflow-y: auto;
}
</style>
