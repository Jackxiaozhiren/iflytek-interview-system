<template>
  <div class="select-test-container">
    <el-card class="test-card">
      <template #header>
        <div class="card-header">
          <h3>选择框组件显示测试</h3>
          <p>验证"候选人等级"和"面试岗位"选择框的中文显示效果</p>
        </div>
      </template>
      
      <!-- 原始配置选择器测试 -->
      <div class="test-section">
        <h4>原始配置选择器样式</h4>
        <div class="config-selectors">
          <div class="selector-group">
            <label>候选人等级：</label>
            <el-select v-model="selectedLevel" placeholder="选择等级">
              <el-option label="初级" value="junior" />
              <el-option label="中级" value="intermediate" />
              <el-option label="高级" value="senior" />
              <el-option label="专家级" value="expert" />
            </el-select>
          </div>
          <div class="selector-group">
            <label>面试岗位：</label>
            <el-select v-model="selectedPosition" placeholder="选择岗位">
              <el-option label="AI工程师" value="ai" />
              <el-option label="大数据工程师" value="bigdata" />
              <el-option label="物联网工程师" value="iot" />
              <el-option label="全栈工程师" value="fullstack" />
              <el-option label="DevOps工程师" value="devops" />
            </el-select>
          </div>
        </div>
      </div>
      
      <!-- 标准表单选择器测试 -->
      <div class="test-section">
        <h4>标准表单选择器样式</h4>
        <el-form :model="formData" label-width="120px">
          <el-form-item label="技术领域">
            <el-select v-model="formData.domain" placeholder="选择技术领域">
              <el-option label="人工智能" value="ai" />
              <el-option label="大数据" value="bigdata" />
              <el-option label="物联网" value="iot" />
              <el-option label="云计算" value="cloud" />
              <el-option label="区块链" value="blockchain" />
            </el-select>
          </el-form-item>
          <el-form-item label="经验要求">
            <el-select v-model="formData.experience" placeholder="选择经验要求">
              <el-option label="初级 (0-2年)" value="junior" />
              <el-option label="中级 (3-5年)" value="middle" />
              <el-option label="高级 (5年以上)" value="senior" />
              <el-option label="专家级 (10年以上)" value="expert" />
            </el-select>
          </el-form-item>
          <el-form-item label="人才等级">
            <el-select v-model="formData.level" placeholder="选择人才等级">
              <el-option label="S级 - 顶尖人才" value="S" />
              <el-option label="A级 - 优秀人才" value="A" />
              <el-option label="B级 - 合格人才" value="B" />
              <el-option label="C级 - 潜力人才" value="C" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 多选和搜索功能测试 -->
      <div class="test-section">
        <h4>多选和搜索功能测试</h4>
        <el-form :model="advancedData" label-width="120px">
          <el-form-item label="技能标签">
            <el-select 
              v-model="advancedData.skills" 
              multiple 
              placeholder="选择技能标签"
              style="width: 100%"
            >
              <el-option label="Python编程" value="python" />
              <el-option label="机器学习" value="ml" />
              <el-option label="深度学习" value="dl" />
              <el-option label="数据分析" value="analysis" />
              <el-option label="算法设计" value="algorithm" />
              <el-option label="系统架构" value="architecture" />
            </el-select>
          </el-form-item>
          <el-form-item label="搜索选择">
            <el-select 
              v-model="advancedData.searchable" 
              filterable 
              placeholder="搜索并选择"
              style="width: 100%"
            >
              <el-option label="自然语言处理工程师" value="nlp" />
              <el-option label="计算机视觉工程师" value="cv" />
              <el-option label="推荐系统工程师" value="recsys" />
              <el-option label="语音识别工程师" value="asr" />
              <el-option label="知识图谱工程师" value="kg" />
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      
      <!-- 当前选择值显示 -->
      <div class="test-section">
        <h4>当前选择值</h4>
        <div class="selected-values">
          <p><strong>候选人等级：</strong>{{ getLevelLabel(selectedLevel) }}</p>
          <p><strong>面试岗位：</strong>{{ getPositionLabel(selectedPosition) }}</p>
          <p><strong>技术领域：</strong>{{ getDomainLabel(formData.domain) }}</p>
          <p><strong>经验要求：</strong>{{ getExperienceLabel(formData.experience) }}</p>
          <p><strong>人才等级：</strong>{{ getTalentLabel(formData.level) }}</p>
          <p><strong>技能标签：</strong>{{ advancedData.skills.join(', ') }}</p>
          <p><strong>搜索选择：</strong>{{ getSearchableLabel(advancedData.searchable) }}</p>
        </div>
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'

// 响应式数据
const selectedLevel = ref('senior')
const selectedPosition = ref('ai')

const formData = ref({
  domain: 'ai',
  experience: 'middle',
  level: 'A'
})

const advancedData = ref({
  skills: ['python', 'ml'],
  searchable: 'nlp'
})

// 标签转换函数
const getLevelLabel = (level) => {
  const labels = {
    junior: '初级',
    intermediate: '中级',
    senior: '高级',
    expert: '专家级'
  }
  return labels[level] || '未选择'
}

const getPositionLabel = (position) => {
  const labels = {
    ai: 'AI工程师',
    bigdata: '大数据工程师',
    iot: '物联网工程师',
    fullstack: '全栈工程师',
    devops: 'DevOps工程师'
  }
  return labels[position] || '未选择'
}

const getDomainLabel = (domain) => {
  const labels = {
    ai: '人工智能',
    bigdata: '大数据',
    iot: '物联网',
    cloud: '云计算',
    blockchain: '区块链'
  }
  return labels[domain] || '未选择'
}

const getExperienceLabel = (experience) => {
  const labels = {
    junior: '初级 (0-2年)',
    middle: '中级 (3-5年)',
    senior: '高级 (5年以上)',
    expert: '专家级 (10年以上)'
  }
  return labels[experience] || '未选择'
}

const getTalentLabel = (level) => {
  const labels = {
    S: 'S级 - 顶尖人才',
    A: 'A级 - 优秀人才',
    B: 'B级 - 合格人才',
    C: 'C级 - 潜力人才'
  }
  return labels[level] || '未选择'
}

const getSearchableLabel = (value) => {
  const labels = {
    nlp: '自然语言处理工程师',
    cv: '计算机视觉工程师',
    recsys: '推荐系统工程师',
    asr: '语音识别工程师',
    kg: '知识图谱工程师'
  }
  return labels[value] || '未选择'
}
</script>

<style scoped>
.select-test-container {
  padding: 24px;
  background: #f5f7fa;
  min-height: 100vh;
}

.test-card {
  max-width: 800px;
  margin: 0 auto;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.card-header h3 {
  margin: 0 0 8px 0;
  color: #1890ff;
  font-size: 20px;
  font-weight: 600;
}

.card-header p {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.test-section {
  margin-bottom: 32px;
  padding: 20px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #e6e6e6;
}

.test-section h4 {
  margin: 0 0 16px 0;
  color: #333;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 2px solid #1890ff;
  padding-bottom: 8px;
}

.selected-values {
  background: #ffffff;
  padding: 16px;
  border-radius: 6px;
  border: 1px solid #e6e6e6;
}

.selected-values p {
  margin: 8px 0;
  font-size: 14px;
  line-height: 1.5;
}

.selected-values strong {
  color: #1890ff;
  font-weight: 600;
}

/* 配置选择器样式 */
.config-selectors {
  display: flex;
  gap: 24px;
  flex-wrap: wrap;
}

.selector-group {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 200px;
}

.selector-group label {
  font-weight: 500;
  min-width: 90px;
  font-size: 14px;
  white-space: nowrap;
  color: #333;
}
</style>
