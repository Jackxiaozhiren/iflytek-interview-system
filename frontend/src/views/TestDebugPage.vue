<template>
  <div class="debug-container">
    <h1>🔍 测试结果调试</h1>
    
    <div class="test-results">
      <h3>测试结果详情</h3>
      <pre>{{ JSON.stringify(results, null, 2) }}</pre>
    </div>

    <div class="calculations">
      <h3>计算结果</h3>
      <p>通过的测试: {{ passedTests }}</p>
      <p>总测试数: {{ totalTests }}</p>
      <p>所有测试通过: {{ allTestsPassed }}</p>
    </div>

    <div class="individual-tests">
      <h3>单个测试状态</h3>
      <div v-for="(value, key) in results" :key="key" class="test-item">
        <span :class="value ? 'success' : 'error'">
          {{ value ? '✅' : '❌' }} {{ key }}: {{ value }}
        </span>
      </div>
    </div>

    <button @click="runDebugTest">运行调试测试</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import enhancedIflytekSparkService from '@/services/enhancedIflytekSparkService'

const results = ref({
  envSystem: false,
  serviceImport: false,
  configValid: false,
  apiReady: false
})

const allTestsPassed = computed(() => {
  console.log('计算 allTestsPassed:', Object.values(results.value))
  return Object.values(results.value).every(result => result === true)
})

const passedTests = computed(() => {
  const passed = Object.values(results.value).filter(result => result === true).length
  console.log('计算 passedTests:', passed)
  return passed
})

const totalTests = computed(() => {
  const total = Object.keys(results.value).length
  console.log('计算 totalTests:', total)
  return total
})

const runDebugTest = () => {
  console.log('🚀 开始调试测试...')
  
  // 重置
  results.value = {
    envSystem: false,
    serviceImport: false,
    configValid: false,
    apiReady: false
  }
  
  console.log('重置后的结果:', results.value)
  
  // 测试1: 环境变量
  try {
    if (typeof import.meta.env !== 'undefined') {
      results.value.envSystem = true
      console.log('✅ 环境变量测试通过')
    }
  } catch (error) {
    console.error('❌ 环境变量测试失败:', error)
  }
  
  // 测试2: 服务导入
  try {
    if (enhancedIflytekSparkService) {
      results.value.serviceImport = true
      console.log('✅ 服务导入测试通过')
    }
  } catch (error) {
    console.error('❌ 服务导入测试失败:', error)
  }
  
  // 测试3: 配置验证
  try {
    if (enhancedIflytekSparkService && enhancedIflytekSparkService.config) {
      const config = enhancedIflytekSparkService.config
      const hasValidConfig = config.baseUrl && config.appId && config.apiKey && config.apiSecret
      const isSimulationMode = config.appId === 'simulation_mode'
      
      console.log('配置检查:', {
        hasValidConfig,
        isSimulationMode,
        baseUrl: config.baseUrl,
        appId: config.appId,
        apiKey: config.apiKey,
        apiSecret: config.apiSecret
      })
      
      if (hasValidConfig || isSimulationMode) {
        results.value.configValid = true
        console.log('✅ 配置验证测试通过')
      } else {
        console.log('❌ 配置验证测试失败: 配置不完整且非模拟模式')
      }
    }
  } catch (error) {
    console.error('❌ 配置验证测试失败:', error)
  }
  
  // 测试4: API就绪
  try {
    if (enhancedIflytekSparkService && 
        typeof enhancedIflytekSparkService.callSparkAPI === 'function' &&
        enhancedIflytekSparkService.config) {
      results.value.apiReady = true
      console.log('✅ API就绪测试通过')
    }
  } catch (error) {
    console.error('❌ API就绪测试失败:', error)
  }
  
  console.log('测试完成后的结果:', results.value)
  console.log('通过测试数:', passedTests.value)
  console.log('总测试数:', totalTests.value)
  console.log('所有测试通过:', allTestsPassed.value)
}
</script>

<style scoped>
.debug-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Microsoft YaHei', sans-serif;
}

.test-results, .calculations, .individual-tests {
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background: #f9f9f9;
}

.test-item {
  margin: 5px 0;
}

.success {
  color: #4CAF50;
}

.error {
  color: #f44336;
}

pre {
  background: #f0f0f0;
  padding: 10px;
  border-radius: 4px;
  overflow-x: auto;
}

button {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  background: #45a049;
}
</style>
