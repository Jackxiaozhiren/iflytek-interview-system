<template>
  <div class="enhanced-learning-path">
    <div class="page-header">
      <h1>增强学习路径</h1>
      <p>智能化个性学习推荐系统</p>
    </div>
    <div class="content">
      <p>增强学习路径功能正在开发中...</p>
    </div>
  </div>
</template>

<script setup>
// 简化版本
</script>

<style scoped>
.enhanced-learning-path {
  min-height: 100vh;
  background: linear-gradient(135deg,
    rgba(24, 144, 255, 0.08) 0%,
    rgba(102, 126, 234, 0.06) 25%,
    rgba(0, 102, 204, 0.04) 50%,
    rgba(76, 81, 191, 0.06) 75%,
    rgba(118, 75, 162, 0.08) 100%
  );
  background-attachment: fixed;
  position: relative;
  padding: 24px;
}

.enhanced-learning-path::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(24, 144, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(102, 126, 234, 0.08) 0%, transparent 50%),
    radial-gradient(circle at 40% 60%, rgba(0, 102, 204, 0.06) 0%, transparent 50%);
  pointer-events: none;
  z-index: 0;
}

.enhanced-learning-path > * {
  position: relative;
  z-index: 1;
}

.page-header {
  text-align: center;
  margin-bottom: 32px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 32px 24px;
  box-shadow:
    0 8px 32px rgba(24, 144, 255, 0.1),
    0 4px 16px rgba(0, 0, 0, 0.05);
  border: 1px solid rgba(24, 144, 255, 0.1);
}

.page-header h1 {
  color: #1890ff;
  font-weight: 700;
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
  text-shadow: 0 2px 4px rgba(24, 144, 255, 0.1);
  margin: 0 0 8px 0;
}

.page-header p {
  color: #666;
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
  margin: 0;
}

.content {
  max-width: 800px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  padding: 32px;
  border-radius: 16px;
  text-align: center;
  box-shadow:
    0 8px 32px rgba(24, 144, 255, 0.08),
    0 4px 16px rgba(0, 0, 0, 0.04);
  border: 1px solid rgba(24, 144, 255, 0.08);
}
</style>
