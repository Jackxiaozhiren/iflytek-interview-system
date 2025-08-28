<template>
  <div class="learning-path-page">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1>
            <el-icon class="header-icon"><TrendCharts /></el-icon>
            智能学习路径推荐
            <span class="brand-tag">iFlytek Spark AI驱动</span>
          </h1>
          <p>基于iFlytek Spark人工智能技术分析您的面试表现，为您量身定制个性化学习成长路径</p>
          <div class="ai-indicator">
            <div class="pulse-dot"></div>
            <span>AI智能分析系统在线</span>
          </div>
        </div>
        <div class="header-stats">
          <div class="stat-item">
            <div class="stat-icon">
              <el-icon><Trophy /></el-icon>
            </div>
            <div class="stat-content">
              <span class="stat-number">{{ userStats.completedPaths }}</span>
              <span class="stat-label">已完成路径</span>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">
              <el-icon><Clock /></el-icon>
            </div>
            <div class="stat-content">
              <span class="stat-number">{{ userStats.totalHours }}</span>
              <span class="stat-label">学习时长(小时)</span>
            </div>
          </div>
          <div class="stat-item">
            <div class="stat-icon">
              <el-icon><Star /></el-icon>
            </div>
            <div class="stat-content">
              <span class="stat-number">{{ userStats.skillLevel }}</span>
              <span class="stat-label">技能等级</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 个性化推荐配置 -->
    <div class="recommendation-config">
      <el-card class="config-card">
        <template #header>
          <div class="card-header">
            <el-icon><Setting /></el-icon>
            <span>个性化推荐设置</span>
          </div>
        </template>
        <div class="config-content">
          <div class="config-row">
            <div class="config-item">
              <label>技术领域</label>
              <el-select v-model="selectedDomain" placeholder="选择技术领域" @change="updateRecommendations">
                <el-option v-for="domain in domains" :key="domain.value" :label="domain.label" :value="domain.value" />
              </el-select>
            </div>
            <div class="config-item">
              <label>目标岗位</label>
              <el-select v-model="selectedPosition" placeholder="选择目标岗位" @change="updateRecommendations">
                <el-option v-for="position in positions" :key="position.value" :label="position.label" :value="position.value" />
              </el-select>
            </div>
            <div class="config-item">
              <label>当前水平</label>
              <el-select v-model="selectedLevel" placeholder="选择技能水平" @change="updateRecommendations">
                <el-option label="初级 (0-2年)" value="beginner" />
                <el-option label="中级 (2-5年)" value="intermediate" />
                <el-option label="高级 (5年以上)" value="advanced" />
              </el-select>
            </div>
            <div class="config-item">
              <label>学习偏好</label>
              <el-select v-model="learningPreference" placeholder="选择学习方式" @change="updateRecommendations">
                <el-option label="理论为主" value="theory" />
                <el-option label="实践为主" value="practice" />
                <el-option label="项目驱动" value="project" />
                <el-option label="均衡发展" value="balanced" />
              </el-select>
            </div>
          </div>
          <div class="config-actions">
            <el-button type="primary" @click="generatePersonalizedPath" :loading="isGenerating">
              <el-icon><MagicStick /></el-icon>
              生成个性化路径
            </el-button>
            <el-button @click="resetConfig">重置配置</el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 推荐学习路径 -->
    <div class="learning-paths-section">
      <div class="section-header">
        <h2>
          <el-icon><Guide /></el-icon>
          推荐学习路径
        </h2>
        <div class="view-controls">
          <el-radio-group v-model="viewMode" size="small">
            <el-radio-button value="card">卡片视图</el-radio-button>
            <el-radio-button value="timeline">时间线视图</el-radio-button>
          </el-radio-group>
        </div>
      </div>

      <!-- 卡片视图 -->
      <div v-if="viewMode === 'card'" class="path-cards">
        <div v-for="path in enhancedLearningPaths" :key="path.id"
             class="enhanced-path-card"
             :data-personalized="path.personalizedScore ? 'true' : 'false'">
          <div class="card-header">
            <div class="path-info">
              <h3>{{ path.title }}</h3>
              <div class="path-meta">
                <el-tag :type="getDifficultyType(path.difficulty)" size="small">
                  {{ getDifficultyText(path.difficulty) }}
                </el-tag>
                <el-tag type="info" size="small">{{ path.domain }}</el-tag>
                <span class="duration">{{ path.duration }}</span>
              </div>
            </div>
            <div class="match-score">
              <el-progress
                type="circle"
                :percentage="path.personalizedScore || path.matchScore"
                :width="60"
                :stroke-width="6"
                :color="getMatchColor(path.personalizedScore || path.matchScore)"
              />
              <span class="match-label">
                {{ path.personalizedScore ? '个性化匹配' : '匹配度' }}
              </span>
            </div>
          </div>

          <div class="card-content">
            <p class="path-description">{{ path.description }}</p>

            <!-- 个性化推荐原因 -->
            <div v-if="path.recommendationReason" class="recommendation-reason">
              <el-alert
                :title="`推荐理由：${path.recommendationReason}`"
                type="success"
                :closable="false"
                show-icon
                class="reason-alert"
              />
            </div>

            <!-- 技能树预览 -->
            <div class="skill-tree-preview">
              <h4>技能发展路径</h4>
              <div class="skill-nodes">
                <div v-for="(skill, index) in path.skillTree.slice(0, 4)" :key="index" class="skill-node">
                  <div class="node-icon">
                    <el-icon><Star /></el-icon>
                  </div>
                  <span class="node-label">{{ skill.name }}</span>
                  <div class="node-progress">
                    <el-progress :percentage="skill.currentLevel" :show-text="false" :stroke-width="4" />
                  </div>
                </div>
                <div v-if="path.skillTree.length > 4" class="more-skills">
                  +{{ path.skillTree.length - 4 }}个技能
                </div>
              </div>
            </div>

            <!-- 学习模块 -->
            <div class="learning-modules">
              <h4>学习模块 ({{ path.modules.length }}个)</h4>
              <div class="module-list">
                <div v-for="module in path.modules.slice(0, 3)" :key="module.id" class="module-item">
                  <div class="module-icon">
                    <el-icon v-if="module.type === 'theory'"><Reading /></el-icon>
                    <el-icon v-else-if="module.type === 'practice'"><Tools /></el-icon>
                    <el-icon v-else><FolderOpened /></el-icon>
                  </div>
                  <div class="module-info">
                    <span class="module-name">{{ module.name }}</span>
                    <span class="module-duration">{{ module.duration }}小时</span>
                  </div>
                  <div class="module-status">
                    <el-tag v-if="module.status === 'completed'" type="success" size="small">已完成</el-tag>
                    <el-tag v-else-if="module.status === 'in_progress'" type="warning" size="small">进行中</el-tag>
                    <el-tag v-else type="info" size="small">未开始</el-tag>
                  </div>
                </div>
                <div v-if="path.modules.length > 3" class="more-modules">
                  查看全部{{ path.modules.length }}个模块
                </div>
              </div>
            </div>

            <!-- 学习资源 -->
            <div class="learning-resources">
              <h4>推荐资源</h4>
              <div class="resource-tags">
                <el-tag v-for="resource in path.resources.slice(0, 5)" :key="resource.id"
                        :type="getResourceType(resource.type)" size="small" class="resource-tag">
                  <el-icon v-if="resource.type === 'video'"><VideoPlay /></el-icon>
                  <el-icon v-else-if="resource.type === 'document'"><Document /></el-icon>
                  <el-icon v-else-if="resource.type === 'project'"><Folder /></el-icon>
                  <el-icon v-else><Link /></el-icon>
                  {{ resource.name }}
                </el-tag>
                <span v-if="path.resources.length > 5" class="more-resources">
                  +{{ path.resources.length - 5 }}个资源
                </span>
              </div>
            </div>
          </div>

          <div class="card-footer">
            <div class="path-stats">
              <span class="stat">
                <el-icon><Clock /></el-icon>
                预计{{ path.estimatedWeeks }}周
              </span>
              <span class="stat">
                <el-icon><User /></el-icon>
                {{ path.enrolledCount }}人已学习
              </span>
              <span class="stat">
                <el-icon><Trophy /></el-icon>
                完成率{{ path.completionRate }}%
              </span>
            </div>
            <div class="path-actions">
              <el-button @click="viewPathDetails(path.id)">查看详情</el-button>
              <el-button type="primary" @click="startLearning(path.id)">
                <el-icon><CaretRight /></el-icon>
                开始学习
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 时间线视图 -->
      <div v-if="viewMode === 'timeline'" class="timeline-view">
        <div class="timeline-container">
          <div v-for="(path, index) in enhancedLearningPaths" :key="path.id" class="timeline-item">
            <div class="timeline-marker">
              <div class="marker-circle">{{ index + 1 }}</div>
              <div v-if="index < enhancedLearningPaths.length - 1" class="marker-line"></div>
            </div>
            <div class="timeline-content">
              <div class="timeline-card">
                <h3>{{ path.title }}</h3>
                <p>{{ path.description }}</p>
                <div class="timeline-modules">
                  <div v-for="module in path.modules" :key="module.id" class="timeline-module">
                    <span class="module-name">{{ module.name }}</span>
                    <span class="module-duration">{{ module.duration }}h</span>
                  </div>
                </div>
                <div class="timeline-actions">
                  <el-button size="small" @click="viewPathDetails(path.id)">详情</el-button>
                  <el-button type="primary" size="small" @click="startLearning(path.id)">开始</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElNotification } from 'element-plus'
import {
  TrendCharts, Setting, MagicStick, Guide, Star, Reading, Tools, FolderOpened,
  VideoPlay, Document, Folder, Link, Clock, User, Trophy, CaretRight
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 响应式数据
const viewMode = ref('card')
const isGenerating = ref(false)
const selectedDomain = ref('')
const selectedPosition = ref('')
const selectedLevel = ref('')
const learningPreference = ref('')

// 用户统计数据
const userStats = ref({
  completedPaths: 3,
  totalHours: 156,
  skillLevel: 'B+'
})

// 技术领域选项
const domains = ref([
  { label: '人工智能', value: 'ai' },
  { label: '大数据技术', value: 'bigdata' },
  { label: '物联网', value: 'iot' },
  { label: '云计算', value: 'cloud' },
  { label: '区块链', value: 'blockchain' },
  { label: '前端开发', value: 'frontend' },
  { label: '后端开发', value: 'backend' },
  { label: '移动开发', value: 'mobile' }
])

// 岗位选项
const positions = ref([
  { label: 'AI算法工程师', value: 'ai_engineer' },
  { label: '机器学习工程师', value: 'ml_engineer' },
  { label: '数据科学家', value: 'data_scientist' },
  { label: '大数据工程师', value: 'bigdata_engineer' },
  { label: '物联网工程师', value: 'iot_engineer' },
  { label: '云架构师', value: 'cloud_architect' },
  { label: '全栈工程师', value: 'fullstack_engineer' },
  { label: '技术专家', value: 'tech_expert' }
])

// 增强的学习路径数据
const enhancedLearningPaths = ref([
  {
    id: 1,
    title: 'AI算法基础强化路径',
    domain: '人工智能',
    difficulty: 4,
    duration: '16周',
    description: '基于iFlytek Spark技术栈，深入学习机器学习和深度学习核心算法，掌握AI工程化实践',
    matchScore: 92,
    estimatedWeeks: 16,
    enrolledCount: 1247,
    completionRate: 87,
    skillTree: [
      { name: 'Python基础', currentLevel: 85, targetLevel: 95 },
      { name: '机器学习', currentLevel: 60, targetLevel: 90 },
      { name: '深度学习', currentLevel: 45, targetLevel: 85 },
      { name: 'TensorFlow', currentLevel: 30, targetLevel: 80 },
      { name: '数据处理', currentLevel: 70, targetLevel: 90 },
      { name: '模型部署', currentLevel: 20, targetLevel: 75 }
    ],
    modules: [
      {
        id: 'm1',
        name: '机器学习算法基础',
        type: 'theory',
        duration: 45,
        status: 'completed',
        description: '深入理解机器学习核心算法原理，掌握监督学习、无监督学习基础',
        difficulty: 'intermediate',
        learningObjectives: ['理解ML算法分类', '掌握监督学习算法', '学会模型评估'],
        keyTopics: ['线性回归', '逻辑回归', '决策树', 'SVM', '聚类算法']
      },
      {
        id: 'm2',
        name: '深度学习与神经网络',
        type: 'practice',
        duration: 60,
        status: 'in_progress',
        description: '掌握深度学习核心概念，学习神经网络设计与训练方法',
        difficulty: 'advanced',
        learningObjectives: ['理解神经网络原理', '掌握深度学习框架', '设计训练模型'],
        keyTopics: ['神经网络基础', 'CNN', 'RNN', 'Transformer', '模型优化']
      },
      {
        id: 'm3',
        name: '自然语言处理技术',
        type: 'practice',
        duration: 55,
        status: 'not_started',
        description: '学习NLP核心技术，结合iFlytek Spark进行语言模型应用',
        difficulty: 'advanced',
        learningObjectives: ['掌握NLP基础', '理解语言模型', '应用iFlytek技术'],
        keyTopics: ['文本预处理', '词向量', '语言模型', 'BERT', 'iFlytek Spark API']
      },
      {
        id: 'm4',
        name: '计算机视觉应用',
        type: 'practice',
        duration: 50,
        status: 'not_started',
        description: '掌握计算机视觉核心技术，实现图像识别和处理应用',
        difficulty: 'advanced',
        learningObjectives: ['理解CV基础', '掌握图像处理', '实现视觉应用'],
        keyTopics: ['图像预处理', '特征提取', '目标检测', '图像分割', '视觉项目']
      },
      {
        id: 'm5',
        name: 'AI工程化与部署',
        type: 'project',
        duration: 70,
        status: 'not_started',
        description: '学习AI模型的工程化部署，包括模型优化、服务化和监控',
        difficulty: 'expert',
        learningObjectives: ['掌握模型部署', '学会性能优化', '实现服务监控'],
        keyTopics: ['模型压缩', '服务化部署', 'API设计', '性能监控', 'MLOps']
      }
    ],
    resources: [
      {
        id: 'r1',
        name: 'Python机器学习实战教程',
        type: 'video',
        difficulty: 'intermediate',
        estimatedTime: '8小时',
        description: '从零开始的机器学习实践课程'
      },
      {
        id: 'r2',
        name: 'TensorFlow深度学习指南',
        type: 'document',
        difficulty: 'advanced',
        estimatedTime: '12小时',
        description: 'TensorFlow框架完整学习资料'
      },
      {
        id: 'r3',
        name: '图像识别实战项目',
        type: 'project',
        difficulty: 'advanced',
        estimatedTime: '20小时',
        description: '端到端的图像识别项目实践'
      },
      {
        id: 'r4',
        name: 'Kaggle机器学习竞赛',
        type: 'practice',
        difficulty: 'expert',
        estimatedTime: '40小时',
        description: '参与真实的机器学习竞赛'
      },
      {
        id: 'r5',
        name: 'iFlytek开发者社区',
        type: 'community',
        difficulty: 'all',
        estimatedTime: '持续',
        description: 'iFlytek技术交流和资源分享平台'
      },
      {
        id: 'r6',
        name: 'AI前沿论文精读',
        type: 'document',
        difficulty: 'expert',
        estimatedTime: '15小时',
        description: '最新AI研究论文解读和分析'
      }
    ]
  },
  {
    id: 2,
    title: '大数据技术全栈路径',
    domain: '大数据',
    difficulty: 3,
    duration: '14周',
    description: '掌握大数据生态系统，从数据采集到分析可视化的完整技术栈',
    matchScore: 78,
    estimatedWeeks: 14,
    enrolledCount: 892,
    completionRate: 91,
    skillTree: [
      { name: 'Hadoop生态', currentLevel: 40, targetLevel: 85 },
      { name: 'Spark计算', currentLevel: 35, targetLevel: 80 },
      { name: '数据仓库', currentLevel: 50, targetLevel: 85 },
      { name: '实时计算', currentLevel: 25, targetLevel: 75 },
      { name: '数据可视化', currentLevel: 60, targetLevel: 85 }
    ],
    modules: [
      {
        id: 'm5',
        name: 'Hadoop生态系统基础',
        type: 'theory',
        duration: 50,
        status: 'not_started',
        description: '深入了解Hadoop分布式计算框架，掌握HDFS、MapReduce等核心组件',
        difficulty: 'intermediate',
        learningObjectives: ['理解分布式存储', '掌握Hadoop组件', '搭建管理集群'],
        keyTopics: ['HDFS架构', 'MapReduce编程', 'YARN资源管理', 'Hive数据仓库', 'HBase数据库']
      },
      {
        id: 'm6',
        name: 'Spark大数据计算',
        type: 'practice',
        duration: 55,
        status: 'not_started',
        description: '掌握Spark分布式计算引擎，学习RDD、DataFrame和Spark SQL',
        difficulty: 'intermediate',
        learningObjectives: ['理解Spark架构', '掌握Spark编程', '优化计算性能'],
        keyTopics: ['Spark Core', 'Spark SQL', 'Spark Streaming', 'MLlib', '性能调优']
      },
      {
        id: 'm7',
        name: '实时数据流处理',
        type: 'practice',
        duration: 45,
        status: 'not_started',
        description: '学习实时数据处理技术，掌握Kafka、Storm、Flink等流处理框架',
        difficulty: 'advanced',
        learningObjectives: ['理解流处理概念', '掌握实时计算', '构建流处理系统'],
        keyTopics: ['Kafka消息队列', 'Storm实时计算', 'Flink流处理', '实时监控', '数据管道']
      },
      {
        id: 'm8',
        name: '数据仓库与ETL',
        type: 'theory',
        duration: 40,
        status: 'not_started',
        description: '学习数据仓库设计原理，掌握ETL数据处理流程',
        difficulty: 'intermediate',
        learningObjectives: ['理解数仓架构', '掌握ETL流程', '设计数据模型'],
        keyTopics: ['数仓建模', 'ETL设计', '数据质量', '元数据管理', '数据治理']
      },
      {
        id: 'm9',
        name: '大数据可视化项目',
        type: 'project',
        duration: 60,
        status: 'not_started',
        description: '构建端到端的大数据分析和可视化项目，整合多种大数据技术',
        difficulty: 'advanced',
        learningObjectives: ['整合大数据技术', '实现数据可视化', '构建分析平台'],
        keyTopics: ['数据采集', '数据处理', '分析建模', '可视化展示', '项目部署']
      }
    ],
    resources: [
      {
        id: 'r7',
        name: 'Hadoop权威指南(第4版)',
        type: 'document',
        difficulty: 'intermediate',
        estimatedTime: '15小时',
        description: 'Hadoop生态系统完整学习指南'
      },
      {
        id: 'r8',
        name: 'Spark大数据实战课程',
        type: 'video',
        difficulty: 'intermediate',
        estimatedTime: '12小时',
        description: 'Spark从入门到精通的实战教程'
      },
      {
        id: 'r9',
        name: '电商大数据分析项目',
        type: 'project',
        difficulty: 'advanced',
        estimatedTime: '25小时',
        description: '基于真实电商数据的完整分析项目'
      },
      {
        id: 'r10',
        name: 'Kafka实时数据处理',
        type: 'practice',
        difficulty: 'intermediate',
        estimatedTime: '8小时',
        description: 'Kafka消息队列实践练习'
      },
      {
        id: 'r11',
        name: '数据可视化工具集',
        type: 'practice',
        difficulty: 'beginner',
        estimatedTime: '6小时',
        description: 'Tableau、Power BI等可视化工具使用'
      },
      {
        id: 'r12',
        name: '大数据架构设计案例',
        type: 'document',
        difficulty: 'advanced',
        estimatedTime: '10小时',
        description: '企业级大数据架构设计实例'
      }
    ]
  },
  {
    id: 3,
    title: '物联网系统开发路径',
    domain: '物联网',
    difficulty: 3,
    duration: '12周',
    description: '从硬件到云端的物联网全栈开发，结合iFlytek语音技术打造智能设备',
    matchScore: 85,
    estimatedWeeks: 12,
    enrolledCount: 634,
    completionRate: 89,
    skillTree: [
      { name: '嵌入式开发', currentLevel: 55, targetLevel: 80 },
      { name: '传感器技术', currentLevel: 45, targetLevel: 75 },
      { name: '通信协议', currentLevel: 40, targetLevel: 80 },
      { name: '云端集成', currentLevel: 60, targetLevel: 85 },
      { name: '语音交互', currentLevel: 30, targetLevel: 75 }
    ],
    modules: [
      {
        id: 'm10',
        name: '物联网系统架构设计',
        type: 'theory',
        duration: 40,
        status: 'not_started',
        description: '学习物联网系统的整体架构设计，包括感知层、网络层、应用层的设计原则',
        difficulty: 'intermediate',
        learningObjectives: ['理解IoT架构', '掌握传感器技术', '学会通信协议'],
        keyTopics: ['IoT架构模型', '传感器技术', '通信协议', '边缘计算', '云端集成']
      },
      {
        id: 'm11',
        name: '嵌入式系统开发',
        type: 'practice',
        duration: 45,
        status: 'not_started',
        description: '掌握嵌入式系统开发技术，学习单片机编程和硬件接口设计',
        difficulty: 'intermediate',
        learningObjectives: ['掌握嵌入式编程', '理解硬件接口', '实现设备控制'],
        keyTopics: ['单片机编程', '硬件接口', 'GPIO控制', '串口通信', '中断处理']
      },
      {
        id: 'm12',
        name: '传感器数据采集与处理',
        type: 'practice',
        duration: 35,
        status: 'not_started',
        description: '学习各类传感器的使用方法，掌握数据采集和预处理技术',
        difficulty: 'beginner',
        learningObjectives: ['掌握传感器使用', '学会数据采集', '实现数据处理'],
        keyTopics: ['温湿度传感器', '光照传感器', '运动传感器', '数据滤波', '数据校准']
      },
      {
        id: 'm13',
        name: '物联网通信技术',
        type: 'theory',
        duration: 40,
        status: 'not_started',
        description: '深入学习物联网通信协议，包括WiFi、蓝牙、LoRa、NB-IoT等技术',
        difficulty: 'intermediate',
        learningObjectives: ['理解通信协议', '选择合适技术', '实现设备连接'],
        keyTopics: ['WiFi通信', '蓝牙技术', 'LoRa远距离', 'NB-IoT窄带', 'MQTT协议']
      },
      {
        id: 'm14',
        name: '智能语音交互系统',
        type: 'project',
        duration: 50,
        status: 'not_started',
        description: '结合iFlytek语音技术，开发智能语音交互的物联网设备',
        difficulty: 'advanced',
        learningObjectives: ['集成语音技术', '实现语音交互', '开发智能设备'],
        keyTopics: ['iFlytek SDK', '语音识别', '语音合成', '自然语言理解', '智能对话']
      },
      {
        id: 'm15',
        name: '物联网云平台集成',
        type: 'project',
        duration: 60,
        status: 'not_started',
        description: '学习物联网云平台的设计和实现，包括设备管理、数据存储和分析',
        difficulty: 'advanced',
        learningObjectives: ['设计云平台', '实现设备管理', '构建数据分析'],
        keyTopics: ['设备接入', '数据存储', '实时监控', '数据分析', '远程控制']
      }
    ],
    resources: [
      {
        id: 'r13',
        name: 'Arduino物联网开发指南',
        type: 'document',
        difficulty: 'beginner',
        estimatedTime: '8小时',
        description: 'Arduino平台物联网项目开发教程'
      },
      {
        id: 'r14',
        name: '物联网系统架构设计',
        type: 'video',
        difficulty: 'intermediate',
        estimatedTime: '10小时',
        description: '企业级物联网架构设计课程'
      },
      {
        id: 'r15',
        name: '智能家居控制系统',
        type: 'project',
        difficulty: 'advanced',
        estimatedTime: '30小时',
        description: '完整的智能家居系统开发项目'
      },
      {
        id: 'r16',
        name: 'iFlytek语音开发套件',
        type: 'api',
        difficulty: 'intermediate',
        estimatedTime: '5小时',
        description: 'iFlytek语音技术集成开发资源'
      },
      {
        id: 'r17',
        name: '传感器技术实践',
        type: 'practice',
        difficulty: 'beginner',
        estimatedTime: '12小时',
        description: '各类传感器使用和数据处理练习'
      },
      {
        id: 'r18',
        name: '物联网安全防护',
        type: 'document',
        difficulty: 'advanced',
        estimatedTime: '6小时',
        description: '物联网系统安全设计和防护措施'
      }
    ]
  }
])

// 计算属性
const filteredPaths = computed(() => {
  return enhancedLearningPaths.value.filter(path => {
    if (selectedDomain.value && path.domain !== getDomainLabel(selectedDomain.value)) return false
    return true
  })
})

// 方法
const getDomainLabel = (value) => {
  const domain = domains.value.find(d => d.value === value)
  return domain ? domain.label : value
}

const getDifficultyType = (difficulty) => {
  if (difficulty <= 2) return 'success'
  if (difficulty <= 3) return 'warning'
  return 'danger'
}

const getDifficultyText = (difficulty) => {
  const levels = ['', '入门', '初级', '中级', '高级', '专家']
  return levels[difficulty] || '未知'
}

const getMatchColor = (score) => {
  if (score >= 90) return '#67c23a'
  if (score >= 80) return '#e6a23c'
  if (score >= 70) return '#f56c6c'
  return '#909399'
}

const getResourceType = (type) => {
  const typeMap = {
    video: 'warning',
    document: 'info',
    project: 'success',
    practice: 'primary',
    community: 'danger',
    api: 'warning'
  }
  return typeMap[type] || 'info'
}

// 个性化推荐算法
const calculatePersonalizedScore = (path, userProfile) => {
  let score = 0

  // 领域匹配度 (40%)
  if (path.domain === getDomainLabel(userProfile.domain)) {
    score += 40
  }

  // 难度匹配度 (30%)
  const levelMap = { 'beginner': 1, 'intermediate': 2, 'advanced': 3, 'expert': 4 }
  const userLevel = levelMap[userProfile.level] || 2
  const pathLevel = path.difficulty
  const levelDiff = Math.abs(userLevel - pathLevel)
  score += Math.max(0, 30 - levelDiff * 10)

  // 学习偏好匹配 (20%)
  if (userProfile.preference === 'practical' && path.modules.some(m => m.type === 'practice')) {
    score += 20
  } else if (userProfile.preference === 'theoretical' && path.modules.some(m => m.type === 'theory')) {
    score += 20
  } else if (userProfile.preference === 'project' && path.modules.some(m => m.type === 'project')) {
    score += 20
  }

  // 时间匹配度 (10%)
  const estimatedWeeks = parseInt(path.duration.replace('周', ''))
  if (userProfile.timeAvailable === 'full' && estimatedWeeks <= 20) {
    score += 10
  } else if (userProfile.timeAvailable === 'part' && estimatedWeeks <= 16) {
    score += 10
  } else if (userProfile.timeAvailable === 'limited' && estimatedWeeks <= 12) {
    score += 10
  }

  return Math.min(100, score)
}

const generatePersonalizedRecommendations = () => {
  if (!selectedDomain.value || !selectedLevel.value) {
    return enhancedLearningPaths.value
  }

  const userProfile = {
    domain: selectedDomain.value,
    position: selectedPosition.value,
    level: selectedLevel.value,
    preference: learningPreference.value,
    timeAvailable: 'part' // 可以从用户设置中获取
  }

  // 计算每个路径的个性化分数
  const pathsWithScores = enhancedLearningPaths.value.map(path => ({
    ...path,
    personalizedScore: calculatePersonalizedScore(path, userProfile),
    recommendationReason: generateRecommendationReason(path, userProfile)
  }))

  // 按分数排序
  return pathsWithScores.sort((a, b) => b.personalizedScore - a.personalizedScore)
}

const generateRecommendationReason = (path, userProfile) => {
  const reasons = []

  if (path.domain === getDomainLabel(userProfile.domain)) {
    reasons.push(`与您的${path.domain}专业背景高度匹配`)
  }

  const levelMap = { 'beginner': '入门', 'intermediate': '中级', 'advanced': '高级', 'expert': '专家' }
  const userLevelText = levelMap[userProfile.level]
  if (userLevelText) {
    reasons.push(`适合${userLevelText}水平学习者`)
  }

  if (userProfile.preference === 'practical' && path.modules.some(m => m.type === 'practice')) {
    reasons.push('包含丰富的实践练习')
  } else if (userProfile.preference === 'project' && path.modules.some(m => m.type === 'project')) {
    reasons.push('提供完整的项目实战')
  }

  if (path.completionRate >= 85) {
    reasons.push('学员完成率高，质量有保障')
  }

  return reasons.slice(0, 2).join('，')
}

const generatePersonalizedPath = async () => {
  if (!selectedDomain.value || !selectedPosition.value || !selectedLevel.value) {
    ElMessage.warning('请完善个性化推荐设置')
    return
  }

  isGenerating.value = true

  try {
    // 模拟智能分析过程
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 生成个性化推荐
    const personalizedPaths = generatePersonalizedRecommendations()

    // 更新路径数据
    enhancedLearningPaths.value = personalizedPaths

    ElNotification.success({
      title: '🎯 个性化推荐生成成功',
      message: `基于您的${getDomainLabel(selectedDomain.value)}背景和${selectedLevel.value}水平，为您重新排序了最适合的学习路径`,
      duration: 4000
    })

    // 显示推荐统计
    const topMatch = personalizedPaths[0]
    if (topMatch) {
      ElMessage.success(`最佳匹配：${topMatch.title}（匹配度${topMatch.personalizedScore}%）`)
    }

  } catch (error) {
    console.error('生成个性化路径失败:', error)
    ElMessage.error('生成失败，请重试')
  } finally {
    isGenerating.value = false
  }
}

const resetConfig = () => {
  selectedDomain.value = ''
  selectedPosition.value = ''
  selectedLevel.value = ''
  learningPreference.value = ''
  ElMessage.info('配置已重置')
}

const updateRecommendations = () => {
  // 根据选择更新推荐
  console.log('更新推荐:', {
    domain: selectedDomain.value,
    position: selectedPosition.value,
    level: selectedLevel.value,
    preference: learningPreference.value
  })
}

const viewPathDetails = (pathId) => {
  router.push(`/learning-path/${pathId}/details`)
}

const startLearning = (pathId) => {
  console.log('🎯 开始学习路径:', pathId)

  const path = enhancedLearningPaths.value.find(p => p.id === pathId)
  if (!path) {
    ElMessage.error('学习路径不存在')
    return
  }

  try {
    ElMessage.success('正在启动学习路径...')

    ElNotification.success({
      title: `🚀 ${path.title}`,
      message: `开始您的${path.domain}学习之旅！预计${path.estimatedWeeks}周完成`,
      duration: 4000
    })

    // 跳转到学习路径详情页面
    router.push(`/learning-path/${pathId}/study`)

  } catch (error) {
    console.error('❌ 启动学习路径失败:', error)
    ElMessage.error('启动学习路径失败，请重试')
  }
}

// 生命周期
onMounted(() => {
  // 确保页面滚动到顶部
  window.scrollTo(0, 0)

  // 如果有会话ID，基于面试结果推荐
  const sessionId = route.query.sessionId
  if (sessionId) {
    loadInterviewBasedRecommendations(sessionId)
  }

  // 初始化默认配置
  initializeDefaultConfig()
})

const loadInterviewBasedRecommendations = async (sessionId) => {
  try {
    // 这里可以调用API获取基于面试结果的推荐
    console.log('基于面试结果推荐学习路径:', sessionId)

    ElNotification.info({
      title: '🎯 智能推荐',
      message: '基于您的面试表现，我们为您推荐了最适合的学习路径',
      duration: 3000
    })
  } catch (error) {
    console.error('加载推荐失败:', error)
  }
}

const initializeDefaultConfig = () => {
  // 设置默认值
  selectedDomain.value = 'ai'
  selectedLevel.value = 'intermediate'
  learningPreference.value = 'balanced'
}
</script>

<style scoped>
/* 页面整体样式 */
.learning-path-page {
  min-height: 100vh;
  background: linear-gradient(135deg,
    rgba(24, 144, 255, 0.08) 0%,
    rgba(102, 126, 234, 0.06) 25%,
    rgba(0, 102, 204, 0.04) 50%,
    rgba(76, 81, 191, 0.06) 75%,
    rgba(118, 75, 162, 0.08) 100%
  );
  background-attachment: fixed;
  padding: 24px;
}

/* 页面头部 */
.page-header {
  margin-bottom: 32px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  max-width: 1400px;
  margin: 0 auto;
  padding: 32px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.header-left h1 {
  font-size: 32px;
  font-weight: 700;
  color: #1890ff;
  margin: 0 0 12px 0;
  display: flex;
  align-items: center;
  gap: 12px;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
}

.brand-tag {
  font-size: 12px;
  background: linear-gradient(135deg, #1890ff, #40a9ff);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  margin-left: 8px;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
}

.header-icon {
  font-size: 36px;
  color: #1890ff;
}

.header-left p {
  font-size: 16px;
  color: #666;
  margin: 0 0 12px 0;
  line-height: 1.6;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
}

.ai-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #52c41a;
  font-weight: 500;
}

.pulse-dot {
  width: 8px;
  height: 8px;
  background: #52c41a;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(82, 196, 26, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(82, 196, 26, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(82, 196, 26, 0);
  }
}

.header-stats {
  display: flex;
  gap: 32px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  background: rgba(24, 144, 255, 0.05);
  padding: 16px 20px;
  border-radius: 12px;
  border: 1px solid rgba(24, 144, 255, 0.1);
  transition: all 0.3s ease;
}

.stat-item:hover {
  background: rgba(24, 144, 255, 0.08);
  border-color: rgba(24, 144, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
}

.stat-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #1890ff, #40a9ff);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  color: white;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #1890ff;
  line-height: 1;
  margin-bottom: 4px;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
}

.stat-label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
}

/* 推荐配置区域 */
.recommendation-config {
  max-width: 1400px;
  margin: 0 auto 32px auto;
}

.config-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #1890ff;
}

.config-content {
  padding: 8px 0;
}

.config-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.config-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.config-item label {
  font-size: 14px;
  font-weight: 500;
  color: #262626;
}

.config-actions {
  display: flex;
  gap: 16px;
  justify-content: center;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
}

/* 学习路径区域 */
.learning-paths-section {
  max-width: 1400px;
  margin: 0 auto;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 0 8px;
}

.section-header h2 {
  font-size: 24px;
  font-weight: 600;
  color: #262626;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

/* 卡片视图样式 */
.path-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.enhanced-path-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  backdrop-filter: blur(10px);
  transition: all 0.3s ease;
  overflow: hidden;
}

.enhanced-path-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 24px 16px 24px;
}

.path-info h3 {
  font-size: 20px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 8px 0;
}

.path-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.duration {
  font-size: 14px;
  color: #8c8c8c;
  font-weight: 500;
}

.match-score {
  text-align: center;
}

.match-label {
  display: block;
  font-size: 12px;
  color: #8c8c8c;
  margin-top: 4px;
}

.card-content {
  padding: 0 24px 16px 24px;
}

.path-description {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 20px 0;
}

/* 技能树预览 */
.skill-tree-preview {
  margin-bottom: 20px;
}

.skill-tree-preview h4 {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 12px 0;
}

.skill-nodes {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
}

.skill-node {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
}

.node-icon {
  color: #1890ff;
  font-size: 16px;
}

.node-label {
  font-size: 12px;
  color: #262626;
  font-weight: 500;
}

.node-progress {
  width: 100%;
}

.more-skills {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: #8c8c8c;
  background: #f0f0f0;
  border-radius: 8px;
  padding: 8px;
}

/* 学习模块 */
.learning-modules {
  margin-bottom: 20px;
}

.learning-modules h4 {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 12px 0;
}

.module-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.module-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.module-icon {
  color: #1890ff;
  font-size: 16px;
}

.module-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.module-name {
  font-size: 14px;
  color: #262626;
  font-weight: 500;
}

.module-duration {
  font-size: 12px;
  color: #8c8c8c;
}

.more-modules {
  font-size: 12px;
  color: #1890ff;
  text-align: center;
  padding: 8px;
  cursor: pointer;
}

.more-modules:hover {
  background: #f0f8ff;
  border-radius: 4px;
}

/* 学习资源 */
.learning-resources h4 {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 12px 0;
}

.resource-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.resource-tag {
  display: flex;
  align-items: center;
  gap: 4px;
}

.more-resources {
  font-size: 12px;
  color: #8c8c8c;
}

/* 卡片底部 */
.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px 24px 24px;
  border-top: 1px solid #f0f0f0;
}

.path-stats {
  display: flex;
  gap: 16px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #8c8c8c;
}

.path-actions {
  display: flex;
  gap: 8px;
}

/* 时间线视图 */
.timeline-view {
  max-width: 800px;
  margin: 0 auto;
}

.timeline-container {
  position: relative;
}

.timeline-item {
  display: flex;
  margin-bottom: 32px;
}

.timeline-marker {
  position: relative;
  margin-right: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.marker-circle {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #1890ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 16px;
}

.marker-line {
  width: 2px;
  height: 60px;
  background: #e6f7ff;
  margin-top: 8px;
}

.timeline-content {
  flex: 1;
}

.timeline-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}

.timeline-card h3 {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 8px 0;
}

.timeline-card p {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin: 0 0 16px 0;
}

.timeline-modules {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.timeline-module {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 4px 8px;
  background: #f0f8ff;
  border-radius: 4px;
  font-size: 12px;
}

.timeline-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

/* 响应式设计 */
@media (max-width: 1200px) {
  .header-content {
    flex-direction: column;
    gap: 24px;
    text-align: center;
  }

  .header-stats {
    justify-content: center;
  }

  .path-cards {
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  }
}

@media (max-width: 768px) {
  .learning-path-page {
    padding: 16px;
  }

  .header-content {
    padding: 24px 20px;
  }

  .header-left h1 {
    font-size: 24px;
  }

  .header-stats {
    gap: 20px;
  }

  .stat-number {
    font-size: 20px;
  }

  .config-row {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .config-actions {
    flex-direction: column;
    align-items: center;
  }

  .section-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .path-cards {
    grid-template-columns: 1fr;
  }

  .enhanced-path-card {
    margin: 0 -8px;
  }

  .card-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .match-score {
    align-self: center;
  }

  .skill-nodes {
    grid-template-columns: repeat(2, 1fr);
  }

  .card-footer {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .path-stats {
    flex-wrap: wrap;
    gap: 12px;
  }

  .path-actions {
    width: 100%;
    justify-content: center;
  }

  .timeline-item {
    margin-bottom: 24px;
  }

  .timeline-marker {
    margin-right: 16px;
  }

  .marker-circle {
    width: 32px;
    height: 32px;
    font-size: 14px;
  }

  .marker-line {
    height: 40px;
  }
}

@media (max-width: 480px) {
  .learning-path-page {
    padding: 12px;
  }

  .header-content {
    padding: 20px 16px;
  }

  .header-left h1 {
    font-size: 20px;
  }

  .header-left p {
    font-size: 14px;
  }

  .stat-number {
    font-size: 18px;
  }

  .stat-label {
    font-size: 12px;
  }

  .enhanced-path-card {
    border-radius: 12px;
  }

  .card-header,
  .card-content,
  .card-footer {
    padding-left: 16px;
    padding-right: 16px;
  }

  .skill-nodes {
    grid-template-columns: 1fr;
  }

  .resource-tags {
    flex-direction: column;
    align-items: flex-start;
  }
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.enhanced-path-card {
  animation: fadeInUp 0.6s ease-out;
}

.enhanced-path-card:nth-child(2) {
  animation-delay: 0.1s;
}

.enhanced-path-card:nth-child(3) {
  animation-delay: 0.2s;
}

/* 加载状态 */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

/* iFlytek品牌色彩 */
.el-button--primary {
  background-color: #1890ff;
  border-color: #1890ff;
}

.el-button--primary:hover {
  background-color: #40a9ff;
  border-color: #40a9ff;
}

.el-progress__text {
  color: #1890ff !important;
}

.el-tag--primary {
  background-color: #e6f7ff;
  border-color: #91d5ff;
  color: #1890ff;
}

/* 个性化推荐样式 */
.recommendation-reason {
  margin: 12px 0;
}

.reason-alert {
  border-radius: 8px;
  border: none;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
}

.reason-alert .el-alert__icon {
  color: #1890ff;
}

.reason-alert .el-alert__title {
  color: #0c4a6e;
  font-size: 13px;
  font-weight: 500;
}

.match-label {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
  display: block;
  text-align: center;
}

/* 个性化匹配度高亮 */
.enhanced-path-card[data-personalized="true"] {
  border: 2px solid #1890ff;
  box-shadow: 0 4px 20px rgba(24, 144, 255, 0.15);
  position: relative;
}

.enhanced-path-card[data-personalized="true"]::before {
  content: "🎯 个性化推荐";
  position: absolute;
  top: -1px;
  right: 20px;
  background: linear-gradient(135deg, #1890ff, #40a9ff);
  color: white;
  padding: 4px 12px;
  border-radius: 0 0 8px 8px;
  font-size: 12px;
  font-weight: 500;
  z-index: 1;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .recommendation-reason {
    margin: 8px 0;
  }

  .reason-alert .el-alert__title {
    font-size: 12px;
  }

  .match-score {
    transform: scale(0.8);
  }
}
</style>
