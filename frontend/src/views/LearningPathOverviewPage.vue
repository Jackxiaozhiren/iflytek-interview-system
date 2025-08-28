<template>
  <div class="learning-path-overview">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item @click="router.push('/learning-path')">学习路径</el-breadcrumb-item>
            <el-breadcrumb-item>{{ pathData.title }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="path-header">
          <div class="path-info">
            <h1>{{ pathData.title }}</h1>
            <p class="path-description">{{ pathData.description }}</p>
            <div class="path-meta">
              <el-tag :type="getDifficultyType(pathData.difficulty)" size="large">
                {{ getDifficultyText(pathData.difficulty) }}
              </el-tag>
              <el-tag type="info" size="large">{{ pathData.domain }}</el-tag>
              <span class="duration">预计学习时间：{{ pathData.duration }}</span>
            </div>
          </div>
          
          <div class="path-actions">
            <el-button size="large" @click="router.back()">返回</el-button>
            <el-button type="primary" size="large" @click="startLearning">
              <el-icon><CaretRight /></el-icon>
              开始学习
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 路径概览信息 -->
    <div class="overview-content">
      <!-- 学习目标 -->
      <el-card class="overview-card">
        <template #header>
          <div class="card-header">
            <el-icon><Trophy /></el-icon>
            <span>学习目标</span>
          </div>
        </template>
        <div class="learning-objectives">
          <div v-for="(objective, index) in pathData.learningObjectives" :key="index" class="objective-item">
            <el-icon><Check /></el-icon>
            <span>{{ objective }}</span>
          </div>
        </div>
      </el-card>

      <!-- 课程大纲 -->
      <el-card class="overview-card">
        <template #header>
          <div class="card-header">
            <el-icon><Reading /></el-icon>
            <span>课程大纲</span>
          </div>
        </template>
        <div class="course-outline">
          <div v-for="(module, index) in pathData.modules" :key="module.id" class="module-outline">
            <div class="module-header">
              <div class="module-number">{{ index + 1 }}</div>
              <div class="module-info">
                <h4>{{ module.name }}</h4>
                <p>{{ module.description }}</p>
                <div class="module-meta">
                  <el-tag size="small" :type="getDifficultyType(module.difficulty)">
                    {{ getDifficultyText(module.difficulty) }}
                  </el-tag>
                  <span class="module-duration">{{ module.duration }}小时</span>
                </div>
              </div>
            </div>
            <div class="module-topics" v-if="module.keyTopics">
              <span class="topics-label">核心主题：</span>
              <el-tag v-for="topic in module.keyTopics" :key="topic" size="small" class="topic-tag">
                {{ topic }}
              </el-tag>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 技能要求 -->
      <el-card class="overview-card">
        <template #header>
          <div class="card-header">
            <el-icon><Star /></el-icon>
            <span>技能要求</span>
          </div>
        </template>
        <div class="skill-requirements">
          <div class="prerequisites">
            <h4>前置技能</h4>
            <div class="skill-list">
              <el-tag v-for="skill in pathData.prerequisites" :key="skill" type="warning" class="skill-tag">
                {{ skill }}
              </el-tag>
            </div>
          </div>
          <div class="target-skills">
            <h4>目标技能</h4>
            <div class="skill-list">
              <el-tag v-for="skill in pathData.targetSkills" :key="skill" type="success" class="skill-tag">
                {{ skill }}
              </el-tag>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 时长安排 -->
      <el-card class="overview-card">
        <template #header>
          <div class="card-header">
            <el-icon><Clock /></el-icon>
            <span>时长安排</span>
          </div>
        </template>
        <div class="time-schedule">
          <div class="schedule-overview">
            <div class="schedule-item">
              <span class="label">总学习时长</span>
              <span class="value">{{ pathData.duration }}</span>
            </div>
            <div class="schedule-item">
              <span class="label">预计完成时间</span>
              <span class="value">{{ pathData.estimatedWeeks }}周</span>
            </div>
            <div class="schedule-item">
              <span class="label">建议学习频率</span>
              <span class="value">每周{{ pathData.weeklyHours || '10' }}小时</span>
            </div>
          </div>
          <div class="weekly-plan">
            <h4>建议学习计划</h4>
            <div class="plan-grid">
              <div class="plan-item">
                <span class="day">周一/三/五</span>
                <span class="activity">理论学习</span>
                <span class="time">2小时/天</span>
              </div>
              <div class="plan-item">
                <span class="day">周二/四</span>
                <span class="activity">实践练习</span>
                <span class="time">2小时/天</span>
              </div>
              <div class="plan-item">
                <span class="day">周六</span>
                <span class="activity">项目实战</span>
                <span class="time">4小时</span>
              </div>
              <div class="plan-item">
                <span class="day">周日</span>
                <span class="activity">复习总结</span>
                <span class="time">2小时</span>
              </div>
            </div>
          </div>
        </div>
      </el-card>

      <!-- 学习统计 -->
      <el-card class="overview-card">
        <template #header>
          <div class="card-header">
            <el-icon><TrendCharts /></el-icon>
            <span>学习统计</span>
          </div>
        </template>
        <div class="learning-stats">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">{{ pathData.enrolledStudents || '1247' }}</div>
              <div class="stat-label">已学习人数</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ pathData.completionRate || '87' }}%</div>
              <div class="stat-label">完成率</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ pathData.averageRating || '4.8' }}</div>
              <div class="stat-label">平均评分</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ pathData.certificateEarned || '1089' }}</div>
              <div class="stat-label">获得证书</div>
            </div>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { 
  CaretRight, Trophy, Check, Reading, Star, Clock, TrendCharts
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 路径ID
const pathId = computed(() => route.params.id)

// 路径数据
const pathData = ref({})

// 获取路径数据
const getPathData = (id) => {
  const pathDataMap = {
    'ai-algorithm': {
      id: 'ai-algorithm',
      title: 'AI算法基础强化路径',
      description: '系统学习人工智能核心算法，从机器学习基础到深度学习应用，构建完整的AI技术体系',
      domain: '人工智能',
      difficulty: 'intermediate',
      duration: '280小时',
      estimatedWeeks: '16',
      weeklyHours: '18',
      enrolledStudents: 1247,
      completionRate: 87,
      averageRating: 4.8,
      certificateEarned: 1089,
      learningObjectives: [
        '掌握机器学习核心算法原理和实现',
        '理解深度学习网络架构设计',
        '具备独立开发AI应用的能力',
        '熟练使用主流AI开发框架',
        '能够解决实际业务中的AI问题'
      ],
      prerequisites: [
        'Python编程基础',
        '高等数学基础',
        '线性代数知识',
        '概率论与统计学'
      ],
      targetSkills: [
        '机器学习算法',
        '深度学习框架',
        '数据预处理',
        '模型优化',
        'AI项目开发'
      ],
      modules: [
        {
          id: 'm1',
          name: '机器学习算法基础',
          description: '深入理解机器学习核心算法原理，掌握监督学习、无监督学习基础',
          difficulty: 'intermediate',
          duration: 45,
          keyTopics: ['线性回归', '逻辑回归', '决策树', 'SVM', '聚类算法']
        },
        {
          id: 'm2',
          name: '深度学习与神经网络',
          description: '掌握深度学习核心概念，学习神经网络设计与训练方法',
          difficulty: 'advanced',
          duration: 60,
          keyTopics: ['神经网络基础', 'CNN', 'RNN', 'Transformer', '模型优化']
        },
        {
          id: 'm3',
          name: '自然语言处理技术',
          description: '学习NLP核心技术，结合iFlytek Spark进行语言模型应用',
          difficulty: 'advanced',
          duration: 55,
          keyTopics: ['文本预处理', '词向量', '语言模型', 'BERT', 'iFlytek Spark API']
        },
        {
          id: 'm4',
          name: '计算机视觉应用',
          description: '掌握计算机视觉核心技术，实现图像识别和处理应用',
          difficulty: 'advanced',
          duration: 50,
          keyTopics: ['图像预处理', '特征提取', '目标检测', '图像分割', '视觉项目']
        },
        {
          id: 'm5',
          name: 'AI工程化与部署',
          description: '学习AI模型的工程化部署，包括模型优化、服务化和监控',
          difficulty: 'expert',
          duration: 70,
          keyTopics: ['模型压缩', '服务化部署', 'API设计', '性能监控', 'MLOps']
        }
      ]
    },
    'bigdata-fullstack': {
      id: 'bigdata-fullstack',
      title: '大数据技术全栈路径',
      description: '全面掌握大数据技术栈，从数据采集到分析应用，构建完整的大数据解决方案',
      domain: '大数据技术',
      difficulty: 'intermediate',
      duration: '320小时',
      estimatedWeeks: '18',
      weeklyHours: '18',
      enrolledStudents: 892,
      completionRate: 82,
      averageRating: 4.6,
      certificateEarned: 731,
      learningObjectives: [
        '掌握Hadoop生态系统核心组件',
        '熟练使用Spark进行大数据处理',
        '理解实时数据流处理技术',
        '具备大数据架构设计能力',
        '能够构建完整的数据分析平台'
      ],
      prerequisites: [
        'Java编程基础',
        'Linux系统操作',
        '数据库基础知识',
        '分布式系统概念'
      ],
      targetSkills: [
        'Hadoop生态系统',
        'Spark数据处理',
        '实时流处理',
        '数据仓库设计',
        '大数据可视化'
      ],
      modules: [
        {
          id: 'm5',
          name: 'Hadoop生态系统基础',
          description: '深入了解Hadoop分布式计算框架，掌握HDFS、MapReduce等核心组件',
          difficulty: 'intermediate',
          duration: 50,
          keyTopics: ['HDFS架构', 'MapReduce编程', 'YARN资源管理', 'Hive数据仓库', 'HBase数据库']
        },
        {
          id: 'm6',
          name: 'Spark大数据计算',
          description: '掌握Spark分布式计算引擎，学习RDD、DataFrame和Spark SQL',
          difficulty: 'intermediate',
          duration: 55,
          keyTopics: ['Spark Core', 'Spark SQL', 'Spark Streaming', 'MLlib', '性能调优']
        },
        {
          id: 'm7',
          name: '实时数据流处理',
          description: '学习实时数据处理技术，掌握Kafka、Storm、Flink等流处理框架',
          difficulty: 'advanced',
          duration: 45,
          keyTopics: ['Kafka消息队列', 'Storm实时计算', 'Flink流处理', '实时监控', '数据管道']
        },
        {
          id: 'm8',
          name: '数据仓库与ETL',
          description: '学习数据仓库设计原理，掌握ETL数据处理流程',
          difficulty: 'intermediate',
          duration: 40,
          keyTopics: ['数仓建模', 'ETL设计', '数据质量', '元数据管理', '数据治理']
        },
        {
          id: 'm9',
          name: '大数据可视化项目',
          description: '构建端到端的大数据分析和可视化项目，整合多种大数据技术',
          difficulty: 'advanced',
          duration: 60,
          keyTopics: ['数据采集', '数据处理', '分析建模', '可视化展示', '项目部署']
        }
      ]
    },
    'iot-system': {
      id: 'iot-system',
      title: '物联网系统开发路径',
      description: '全面学习物联网系统开发技术，从硬件控制到云端应用，构建完整的IoT解决方案',
      domain: '物联网',
      difficulty: 'intermediate',
      duration: '260小时',
      estimatedWeeks: '15',
      weeklyHours: '17',
      enrolledStudents: 634,
      completionRate: 79,
      averageRating: 4.5,
      certificateEarned: 501,
      learningObjectives: [
        '掌握物联网系统架构设计',
        '熟练进行嵌入式系统开发',
        '理解传感器技术和数据采集',
        '具备物联网通信协议应用能力',
        '能够开发完整的IoT应用系统'
      ],
      prerequisites: [
        'C/C++编程基础',
        '电路基础知识',
        '计算机网络基础',
        '数据库基础'
      ],
      targetSkills: [
        '嵌入式开发',
        '传感器技术',
        '物联网通信',
        '云平台集成',
        'IoT应用开发'
      ],
      modules: [
        {
          id: 'm10',
          name: '物联网系统架构设计',
          description: '学习物联网系统的整体架构设计，包括感知层、网络层、应用层的设计原则',
          difficulty: 'intermediate',
          duration: 40,
          keyTopics: ['IoT架构模型', '传感器技术', '通信协议', '边缘计算', '云端集成']
        },
        {
          id: 'm11',
          name: '嵌入式系统开发',
          description: '掌握嵌入式系统开发技术，学习单片机编程和硬件接口设计',
          difficulty: 'intermediate',
          duration: 45,
          keyTopics: ['单片机编程', '硬件接口', 'GPIO控制', '串口通信', '中断处理']
        },
        {
          id: 'm12',
          name: '传感器数据采集与处理',
          description: '学习各类传感器的使用方法，掌握数据采集和预处理技术',
          difficulty: 'beginner',
          duration: 35,
          keyTopics: ['温湿度传感器', '光照传感器', '运动传感器', '数据滤波', '数据校准']
        },
        {
          id: 'm13',
          name: '物联网通信技术',
          description: '深入学习物联网通信协议，包括WiFi、蓝牙、LoRa、NB-IoT等技术',
          difficulty: 'intermediate',
          duration: 40,
          keyTopics: ['WiFi通信', '蓝牙技术', 'LoRa远距离', 'NB-IoT窄带', 'MQTT协议']
        },
        {
          id: 'm14',
          name: '智能语音交互系统',
          description: '结合iFlytek语音技术，开发智能语音交互的物联网设备',
          difficulty: 'advanced',
          duration: 50,
          keyTopics: ['iFlytek SDK', '语音识别', '语音合成', '自然语言理解', '智能对话']
        },
        {
          id: 'm15',
          name: '物联网云平台集成',
          description: '学习物联网云平台的设计和实现，包括设备管理、数据存储和分析',
          difficulty: 'advanced',
          duration: 60,
          keyTopics: ['设备接入', '数据存储', '实时监控', '数据分析', '远程控制']
        }
      ]
    }
  }
  
  return pathDataMap[id] || pathDataMap['ai-algorithm']
}

// 辅助函数
const getDifficultyType = (difficulty) => {
  const typeMap = {
    'beginner': 'success',
    'intermediate': 'warning', 
    'advanced': 'danger',
    'expert': 'info'
  }
  return typeMap[difficulty] || 'info'
}

const getDifficultyText = (difficulty) => {
  const textMap = {
    'beginner': '入门级',
    'intermediate': '中级',
    'advanced': '高级', 
    'expert': '专家级'
  }
  return textMap[difficulty] || '中级'
}

const startLearning = () => {
  ElMessage.success('正在启动学习路径...')
  router.push(`/learning-path/${pathId.value}/study`)
}

// 生命周期
onMounted(() => {
  // 确保页面滚动到顶部
  window.scrollTo(0, 0)

  // 获取路径数据
  pathData.value = getPathData(pathId.value)
})
</script>

<style scoped>
/* 页面整体样式 */
.learning-path-overview {
  min-height: 100vh;
  background: #f5f7fa;
}

/* 页面头部 */
.page-header {
  background: linear-gradient(135deg, #1890ff 0%, #667eea 50%, #764ba2 100%);
  color: white;
  padding: 30px 0;
  position: relative;
  overflow: hidden;
}

.page-header::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse"><path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
  opacity: 0.3;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  position: relative;
  z-index: 1;
}

.breadcrumb {
  margin-bottom: 20px;
}

.breadcrumb .el-breadcrumb-item {
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
}

.breadcrumb .el-breadcrumb-item:hover {
  color: white;
}

.path-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 40px;
}

.path-info h1 {
  font-size: 36px;
  font-weight: 700;
  margin: 0 0 12px 0;
  font-family: 'Microsoft YaHei', 'PingFang SC', sans-serif;
}

.path-description {
  font-size: 16px;
  line-height: 1.6;
  margin: 0 0 20px 0;
  opacity: 0.9;
  max-width: 600px;
}

.path-meta {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.duration {
  font-size: 14px;
  opacity: 0.8;
}

.path-actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

/* 概览内容 */
.overview-content {
  max-width: 1200px;
  margin: -20px auto 0;
  padding: 0 20px 40px;
  position: relative;
  z-index: 2;
}

.overview-card {
  margin-bottom: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border: none;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #1890ff;
}

/* 学习目标 */
.learning-objectives {
  display: grid;
  gap: 16px;
}

.objective-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #52c41a;
}

.objective-item .el-icon {
  color: #52c41a;
  font-size: 18px;
  flex-shrink: 0;
}

.objective-item span {
  font-size: 15px;
  color: #333;
  line-height: 1.5;
}

/* 课程大纲 */
.course-outline {
  display: grid;
  gap: 20px;
}

.module-outline {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 20px;
  background: #fff;
}

.module-header {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.module-number {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #1890ff, #40a9ff);
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 16px;
  flex-shrink: 0;
}

.module-info h4 {
  margin: 0 0 8px 0;
  font-size: 18px;
  color: #333;
}

.module-info p {
  margin: 0 0 12px 0;
  color: #666;
  line-height: 1.5;
}

.module-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.module-duration {
  font-size: 13px;
  color: #666;
}

.module-topics {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.topics-label {
  font-size: 13px;
  color: #666;
  font-weight: 500;
}

.topic-tag {
  margin: 0;
}

/* 技能要求 */
.skill-requirements {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
}

.skill-requirements h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #333;
}

.skill-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  margin: 0;
}

/* 时长安排 */
.time-schedule {
  display: grid;
  gap: 24px;
}

.schedule-overview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
}

.schedule-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  text-align: center;
}

.schedule-item .label {
  font-size: 13px;
  color: #666;
}

.schedule-item .value {
  font-size: 18px;
  font-weight: 700;
  color: #1890ff;
}

.weekly-plan h4 {
  margin: 0 0 16px 0;
  font-size: 16px;
  color: #333;
}

.plan-grid {
  display: grid;
  gap: 12px;
}

.plan-item {
  display: grid;
  grid-template-columns: 100px 1fr 80px;
  gap: 16px;
  padding: 12px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  align-items: center;
}

.plan-item .day {
  font-weight: 500;
  color: #333;
}

.plan-item .activity {
  color: #666;
}

.plan-item .time {
  color: #1890ff;
  font-weight: 500;
  text-align: right;
}

/* 学习统计 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 20px;
}

.stat-card {
  text-align: center;
  padding: 24px;
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 13px;
  opacity: 0.9;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .path-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .path-actions {
    width: 100%;
    justify-content: flex-end;
  }

  .skill-requirements {
    grid-template-columns: 1fr;
    gap: 20px;
  }

  .plan-item {
    grid-template-columns: 1fr;
    gap: 8px;
    text-align: center;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
