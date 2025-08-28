<template>
  <div id="app">
    <h1>🎉 Vue应用测试成功！</h1>
    <p>如果您能看到这个文字，说明Vue应用正在工作</p>
    <div class="test-info">
      <p>✅ Vue 3 组件正常渲染</p>
      <p>✅ 模板语法正常工作</p>
      <p>✅ CSS样式正常应用</p>
    </div>
    <button @click="testClick">点击测试响应性</button>
    <p v-if="clicked">🎯 点击事件正常工作！</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

console.log('📦 App_simple.vue 组件脚本执行');

const clicked = ref(false)

const testClick = () => {
  console.log('🖱️ 按钮被点击');
  clicked.value = true
}

console.log('✅ App_simple.vue 组件设置完成');
</script>

<style>
#app {
  padding: 20px !important;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Microsoft YaHei', sans-serif !important;
  background: linear-gradient(135deg, #4c51bf 0%, #6b21a8 100%) !important;
  min-height: 100vh !important;
  color: white !important;
  display: block !important;
  position: relative !important;
}

h1 {
  color: #ffffff;
  font-size: 2.5rem;
  margin-bottom: 20px;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

p {
  color: #f0f8ff;
  font-size: 1.2rem;
  margin: 10px 0;
}

.test-info {
  background: rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 10px;
  margin: 20px 0;
  backdrop-filter: blur(10px);
}

button {
  background: #1890ff;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  margin: 20px 0;
  transition: background 0.3s ease;
}

button:hover {
  background: #40a9ff;
}
</style>
