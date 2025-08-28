<template>
  <div class="domain-demos">
    <!-- 无障碍跳转链接 -->
    <nav class="skip-links" aria-label="页面跳转导航">
      <a href="#domain-selector" class="sr-only">跳转到领域选择</a>
      <a href="#domain-overview" class="sr-only">跳转到领域概览</a>
      <a href="#application-scenarios" class="sr-only">跳转到应用场景</a>
      <a href="#positions-section" class="sr-only">跳转到岗位类型</a>
    </nav>

    <div class="domain-header" data-aos="fade-up">
      <h2>
        <el-icon><Grid /></el-icon>
        技术领域专业演示
      </h2>
      <p>深入了解AI、大数据、物联网、面试评估四大技术领域的专业面试场景</p>
    </div>

    <!-- 领域选择器 -->
    <div id="domain-selector" class="domain-selector" data-aos="fade-up" data-aos-delay="200">
      <div class="domain-tabs domains-grid">
        <div
          class="domain-tab"
          :class="[domain.theme, { 'active': activeDomain === domain.key }]"
          v-for="domain in domains"
          :key="domain.key"
          @click="activeDomain = domain.key"
        >
          <div class="tab-icon"
               :class="getTabIconClass(domain.theme)"
               :style="{ background: domain.color }">
            <el-icon><component :is="domain.icon" /></el-icon>
          </div>
          <div class="tab-content">
            <h3>{{ domain.name }}</h3>
            <p>{{ domain.description }}</p>
            <div class="tab-stats">
              <span>{{ domain.positionCount }}+ 岗位</span>
              <span>{{ domain.companies }}+ 企业</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 当前领域详情 -->
    <div class="domain-content" v-if="currentDomain" data-aos="fade-up" data-aos-delay="400">
      <!-- 领域概览 -->
      <div id="domain-overview" class="domain-overview">
        <div class="overview-header">
          <div class="domain-info">
            <div class="domain-icon-large" :style="{ background: currentDomain.color }">
              <el-icon><component :is="currentDomain.icon" /></el-icon>
            </div>
            <div class="domain-details">
              <h3>{{ currentDomain.name }}</h3>
              <p>{{ currentDomain.fullDescription }}</p>
              <div class="domain-tags">
                <el-tag 
                  v-for="tag in currentDomain.tags" 
                  :key="tag"
                  :type="getTagType(tag)"
                  size="large"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
          </div>
          
          <div class="domain-actions">
            <el-button
              type="primary"
              size="large"
              @click="startDomainDemo"
              :aria-label="`开始${currentDomain.name}技术领域演示`"
            >
              <el-icon><VideoPlay /></el-icon>
              开始演示
            </el-button>
            <el-button
              size="large"
              @click="viewDomainVideo"
              :aria-label="`观看${currentDomain.name}技术领域介绍视频`"
            >
              <el-icon><VideoCamera /></el-icon>
              观看视频
            </el-button>
          </div>
        </div>

        <!-- 技能要求 -->
        <div class="skills-section">
          <h4>
            <el-icon><Star /></el-icon>
            核心技能要求
          </h4>
          <div class="skills-grid grid grid-auto-fit-sm grid-gap-md">
            <div
              class="skill-item"
              v-for="skill in currentDomain.skills"
              :key="skill.name"
            >
              <div class="skill-header">
                <span class="skill-name">{{ skill.name }}</span>
                <span class="skill-level" :class="getLevelClass(skill.level)">
                  {{ skill.level }}
                </span>
              </div>
              <div class="skill-progress">
                <div
                  class="progress-bar"
                  role="progressbar"
                  :aria-valuenow="skill.importance"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  :aria-label="`${skill.name}重要度${skill.importance}%`"
                >
                  <div
                    class="progress-fill"
                    :style="{
                      width: skill.importance + '%',
                      background: currentDomain.color
                    }"
                  ></div>
                </div>
                <span class="importance">重要度: {{ skill.importance }}%</span>
              </div>
              <p class="skill-description">{{ skill.description }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 岗位类型 -->
      <div id="positions-section" class="positions-section">
        <h4>
          <el-icon><Folder /></el-icon>
          热门岗位类型
        </h4>
        <div class="positions-grid grid grid-auto-fit-md grid-gap-lg">
          <div
            class="position-card"
            v-for="position in currentDomain.positions"
            :key="position.name"
            @click="selectPosition(position)"
            @keydown.enter="selectPosition(position)"
            @keydown.space.prevent="selectPosition(position)"
            tabindex="0"
            role="button"
            :aria-label="`选择${position.name}岗位，薪资范围${position.salaryRange}，需求量${position.demand}`"
          >
            <div class="position-header">
              <h5>{{ position.name }}</h5>
              <span class="salary-range">{{ position.salaryRange }}</span>
            </div>
            <p class="position-description">{{ position.description }}</p>
            <div class="position-requirements">
              <h6>主要要求:</h6>
              <ul>
                <li v-for="req in position.requirements.slice(0, 3)" :key="req">
                  {{ req }}
                </li>
              </ul>
            </div>
            <div class="position-stats">
              <span class="demand">需求量: {{ position.demand }}</span>
              <span class="growth">增长率: {{ position.growth }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 面试题目示例 -->
      <div class="questions-section">
        <h4>
          <el-icon><VideoCamera /></el-icon>
          典型面试题目
        </h4>
        <div class="questions-container">
          <div class="question-categories">
            <el-tabs v-model="activeQuestionType">
              <el-tab-pane 
                v-for="category in currentDomain.questionCategories"
                :key="category.type"
                :label="category.name"
                :name="category.type"
              >
                <div class="questions-list">
                  <div 
                    class="question-item"
                    v-for="(question, index) in category.questions"
                    :key="index"
                  >
                    <div class="question-header">
                      <span class="question-number">Q{{ index + 1 }}</span>
                      <span class="question-difficulty" :class="getDifficultyClass(question.difficulty)">
                        {{ question.difficulty }}
                      </span>
                    </div>
                    <h6 class="question-title">{{ question.title }}</h6>
                    <p class="question-content">{{ question.content }}</p>
                    <div class="question-meta">
                      <span class="question-type">{{ question.type }}</span>
                      <span class="estimated-time">预计时间: {{ question.estimatedTime }}</span>
                    </div>
                    <div class="question-actions">
                      <el-button size="small" @click="previewAnswer(question)">
                        查看解答思路
                      </el-button>
                      <el-button size="small" type="primary" @click="practiceQuestion(question)">
                        开始练习
                      </el-button>
                    </div>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </div>
        </div>
      </div>

      <!-- 应用场景展示 -->
      <div id="application-scenarios" class="application-scenarios">
        <h4>
          <el-icon><VideoPlay /></el-icon>
          实际应用场景
        </h4>
        <p class="scenarios-description">
          探索 {{ currentDomain.name }} 技术在真实企业环境中的应用场景，了解面试中的重点考察内容
        </p>
        <p v-if="!currentDomain.applicationScenarios || currentDomain.applicationScenarios.length === 0" style="color: red;">
          调试信息：应用场景数据为空或未定义
        </p>
        <p v-else style="color: green;">
          调试信息：找到 {{ currentDomain.applicationScenarios.length }} 个应用场景
        </p>
        <div class="scenarios-grid grid grid-auto-fit-md grid-gap-lg">
          <div
            class="scenario-card"
            v-for="scenario in currentDomain.applicationScenarios"
            :key="scenario.id"
            @click="viewScenarioDetails(scenario)"
            @keydown.enter="viewScenarioDetails(scenario)"
            @keydown.space.prevent="viewScenarioDetails(scenario)"
            tabindex="0"
            role="button"
            :aria-label="`查看${scenario.title}场景详情，难度${scenario.difficulty}，复杂度${scenario.complexity}%`"
            :aria-describedby="`scenario-desc-${scenario.id}`"
          >
            <div class="scenario-header">
              <div class="scenario-icon" :style="{ background: scenario.color }">
                <el-icon><component :is="scenario.icon" /></el-icon>
              </div>
              <div class="scenario-meta">
                <span class="scenario-category">{{ scenario.category }}</span>
                <span class="scenario-difficulty" :class="getDifficultyClass(scenario.difficulty)">
                  {{ scenario.difficulty }}
                </span>
              </div>
            </div>
            <div class="scenario-content">
              <h5>{{ scenario.title }}</h5>
              <p :id="`scenario-desc-${scenario.id}`">{{ scenario.description }}</p>
              <div class="scenario-tags">
                <el-tag
                  v-for="tag in scenario.technologies"
                  :key="tag"
                  size="small"
                  type="info"
                >
                  {{ tag }}
                </el-tag>
              </div>
            </div>
            <div class="scenario-stats">
              <div class="stat-item">
                <span class="stat-label">复杂度</span>
                <div
                  class="stat-bar"
                  role="progressbar"
                  :aria-valuenow="scenario.complexity"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  :aria-label="`复杂度${scenario.complexity}%`"
                >
                  <div class="stat-fill" :style="{ width: scenario.complexity + '%' }"></div>
                </div>
              </div>
              <div class="stat-item">
                <span class="stat-label">面试频率</span>
                <div
                  class="stat-bar"
                  role="progressbar"
                  :aria-valuenow="scenario.interviewFrequency"
                  aria-valuemin="0"
                  aria-valuemax="100"
                  :aria-label="`面试频率${scenario.interviewFrequency}%`"
                >
                  <div class="stat-fill" :style="{ width: scenario.interviewFrequency + '%' }"></div>
                </div>
              </div>
            </div>
            <div class="scenario-actions">
              <el-button
                size="small"
                type="primary"
                @click.stop="startScenarioDemo(scenario)"
                :aria-label="`观看${scenario.title}演示视频`"
              >
                <el-icon><VideoPlay /></el-icon>
                观看演示
              </el-button>
              <el-button
                size="small"
                @click.stop="viewTechDetails(scenario)"
                :aria-label="`查看${scenario.title}技术架构详情`"
              >
                <el-icon><Document /></el-icon>
                技术细节
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 成功案例 -->
      <div class="success-cases">
        <h4>
          <el-icon><Star /></el-icon>
          成功案例分享
        </h4>
        <div class="cases-grid grid grid-auto-fit-lg grid-gap-xl">
          <div
            class="case-card"
            v-for="case_ in currentDomain.successCases"
            :key="case_.id"
          >
            <div class="case-header">
              <img :src="case_.avatar" :alt="case_.name" class="case-avatar" />
              <div class="case-info">
                <h5>{{ case_.name }}</h5>
                <p>{{ case_.position }} @ {{ case_.company }}</p>
                <div class="case-score">
                  <el-icon><Star /></el-icon>
                  <span>面试得分: {{ case_.score }}</span>
                </div>
              </div>
            </div>
            <blockquote class="case-testimonial">
              "{{ case_.testimonial }}"
            </blockquote>
            <div class="case-highlights">
              <h6>关键亮点:</h6>
              <ul>
                <li v-for="highlight in case_.highlights" :key="highlight">
                  {{ highlight }}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, markRaw, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Grid, VideoPlay, VideoCamera, Star, Folder, Cpu, Setting, Document, TrendCharts
} from '@element-plus/icons-vue'

// 动态导入Mermaid
let mermaid = null
const initMermaid = async () => {
  try {
    const mermaidModule = await import('mermaid')
    mermaid = mermaidModule.default
    mermaid.initialize({
      startOnLoad: false,
      theme: 'default',
      themeVariables: {
        primaryColor: '#4c51bf',
        primaryTextColor: '#ffffff',
        primaryBorderColor: '#4c51bf',
        lineColor: '#4a5568',
        secondaryColor: '#6b21a8',
        tertiaryColor: '#9C27B0',
        background: '#ffffff',
        mainBkg: '#4c51bf',
        secondBkg: '#6b21a8',
        tertiaryBkg: '#9C27B0',
        primaryTextColor: '#ffffff',
        secondaryTextColor: '#ffffff',
        tertiaryTextColor: '#ffffff',
        edgeLabelBackground: '#ffffff',
        nodeTextColor: '#ffffff',
        clusterBkg: '#f8f9fa',
        clusterBorder: '#4c51bf',
        defaultLinkColor: '#4a5568',
        titleColor: '#1a202c',
        darkMode: false
      },
      flowchart: {
        useMaxWidth: true,
        htmlLabels: true,
        curve: 'basis',
        padding: 20,
        nodeSpacing: 50,
        rankSpacing: 50
      },
      fontFamily: 'Microsoft YaHei, SimHei, sans-serif'
    })
  } catch (error) {
    console.warn('Mermaid not available:', error)
  }
}

// Vue Router 实例
const router = useRouter()

const activeDomain = ref('ai')
const activeQuestionType = ref('basic')

// 领域数据
const domains = ref([
  {
    key: 'ai',
    name: '人工智能',
    description: '机器学习、深度学习、NLP等前沿技术',
    fullDescription: '人工智能领域涵盖机器学习、深度学习、自然语言处理、计算机视觉等前沿技术方向，是当前最热门的技术领域之一。',
    icon: 'Cpu',
    color: 'var(--ai-gradient-primary)',
    theme: 'ai-theme',
    positionCount: '50',
    companies: '200',
    tags: ['机器学习', '深度学习', 'NLP', '计算机视觉', 'TensorFlow', 'PyTorch'],
    skills: [
      {
        name: '机器学习算法',
        level: '高级',
        importance: 95,
        description: '掌握监督学习、无监督学习、强化学习等核心算法'
      },
      {
        name: '深度学习框架',
        level: '中级',
        importance: 85,
        description: '熟练使用TensorFlow、PyTorch等主流深度学习框架'
      },
      {
        name: '数据处理',
        level: '中级',
        importance: 80,
        description: '具备数据清洗、特征工程、数据可视化能力'
      },
      {
        name: '编程能力',
        level: '高级',
        importance: 90,
        description: '精通Python、熟悉C++、Java等编程语言'
      }
    ],
    positions: [
      {
        name: '机器学习工程师',
        salaryRange: '20K-50K',
        description: '负责机器学习模型的设计、开发和优化',
        requirements: ['机器学习算法', 'Python编程', '数据处理', '模型优化'],
        demand: '高',
        growth: '+25%'
      },
      {
        name: 'AI算法工程师',
        salaryRange: '25K-60K',
        description: '专注于AI算法研究和工程化实现',
        requirements: ['深度学习', '算法设计', '论文阅读', '工程实现'],
        demand: '很高',
        growth: '+30%'
      },
      {
        name: 'NLP工程师',
        salaryRange: '22K-55K',
        description: '专门从事自然语言处理相关技术开发',
        requirements: ['NLP技术', '语言模型', '文本处理', 'Transformer'],
        demand: '高',
        growth: '+28%'
      }
    ],
    questionCategories: [
      {
        type: 'basic',
        name: '基础概念',
        questions: [
          {
            title: '机器学习基础',
            content: '请解释监督学习、无监督学习和强化学习的区别，并举例说明各自的应用场景。',
            difficulty: '中级',
            type: '概念理解',
            estimatedTime: '5分钟'
          },
          {
            title: '神经网络原理',
            content: '请详细说明反向传播算法的工作原理，以及梯度消失问题的成因和解决方案。',
            difficulty: '高级',
            type: '技术深度',
            estimatedTime: '8分钟'
          }
        ]
      },
      {
        type: 'practical',
        name: '实践应用',
        questions: [
          {
            title: '项目经验分享',
            content: '请分享一个您参与的机器学习项目，包括问题定义、数据处理、模型选择和优化过程。',
            difficulty: '中级',
            type: '项目经验',
            estimatedTime: '10分钟'
          }
        ]
      }
    ],
    applicationScenarios: [
      {
        id: 1,
        title: '智能推荐系统',
        description: '构建电商平台的个性化推荐引擎，提升用户体验和转化率',
        category: '机器学习应用',
        difficulty: '中级',
        complexity: 75,
        interviewFrequency: 85,
        icon: markRaw(TrendCharts),
        color: 'linear-gradient(45deg, #4c51bf 0%, #6b21a8 100%)',
        technologies: ['协同过滤', '深度学习', 'TensorFlow', 'Redis'],
        businessValue: '提升20%转化率',
        technicalChallenges: ['冷启动问题', '实时推荐', '数据稀疏性'],
        interviewPoints: ['算法选择', '系统架构', '性能优化', 'A/B测试'],
        realWorldExample: {
          company: '淘宝',
          scale: '日活2亿用户',
          technology: '深度学习+协同过滤',
          result: '点击率提升15%'
        }
      },
      {
        id: 2,
        title: '计算机视觉质检',
        description: '工业生产线上的自动化质量检测系统，替代人工检测',
        category: '计算机视觉',
        difficulty: '高级',
        complexity: 90,
        interviewFrequency: 70,
        icon: markRaw(VideoCamera),
        color: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
        technologies: ['CNN', 'OpenCV', 'PyTorch', '边缘计算'],
        businessValue: '降低60%人工成本',
        technicalChallenges: ['光照变化', '实时处理', '误检率控制'],
        interviewPoints: ['模型设计', '数据增强', '部署优化', '精度召回'],
        realWorldExample: {
          company: '富士康',
          scale: '100条生产线',
          technology: 'YOLO+ResNet',
          result: '检测精度99.5%'
        }
      },
      {
        id: 3,
        title: '智能客服对话',
        description: 'NLP驱动的智能客服系统，理解用户意图并提供准确回答',
        category: '自然语言处理',
        difficulty: '中级',
        complexity: 80,
        interviewFrequency: 90,
        icon: markRaw(VideoCamera),
        color: 'linear-gradient(45deg, #a8edea 0%, #fed6e3 100%)',
        technologies: ['BERT', 'Transformer', '意图识别', '知识图谱'],
        businessValue: '处理80%常见问题',
        technicalChallenges: ['意图理解', '多轮对话', '知识更新'],
        interviewPoints: ['模型选择', '数据标注', '对话管理', '效果评估'],
        realWorldExample: {
          company: '支付宝',
          scale: '日处理1000万次对话',
          technology: 'BERT+知识图谱',
          result: '问题解决率85%'
        }
      },
      {
        id: 4,
        title: '自动驾驶感知',
        description: '车载AI系统的环境感知模块，识别道路、车辆、行人等',
        category: '深度学习',
        difficulty: '高级',
        complexity: 95,
        interviewFrequency: 60,
        icon: markRaw(Cpu),
        color: 'linear-gradient(45deg, #4c51bf 0%, #6b21a8 100%)',
        technologies: ['多传感器融合', '3D检测', 'RNN', '强化学习'],
        businessValue: '提升行车安全',
        technicalChallenges: ['实时性要求', '恶劣天气', '长尾场景'],
        interviewPoints: ['传感器融合', '3D算法', '安全设计', '测试验证'],
        realWorldExample: {
          company: '特斯拉',
          scale: '全球100万辆车',
          technology: '纯视觉+神经网络',
          result: '事故率降低40%'
        }
      }
    ],
    successCases: [
      {
        id: 1,
        name: '张小明',
        position: '高级AI工程师',
        company: '字节跳动',
        score: '92分',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        testimonial: '系统的多模态分析帮助我全面展示了技术能力，特别是在算法讲解和代码实现方面得到了很好的评估。',
        highlights: ['算法理解深入', '代码实现能力强', '表达清晰有逻辑', '项目经验丰富']
      }
    ]
  },
  {
    key: 'bigdata',
    name: '大数据',
    description: 'Hadoop、Spark、数据仓库等技术栈',
    fullDescription: '大数据领域专注于海量数据的存储、处理、分析和挖掘，涵盖分布式计算、数据仓库、实时计算等核心技术。',
    icon: 'DataBoard',
    color: 'var(--bigdata-gradient-primary)',
    theme: 'bigdata-theme',
    positionCount: '40',
    companies: '150',
    tags: ['Hadoop', 'Spark', '数据仓库', 'Kafka', 'Flink', 'ClickHouse'],
    skills: [
      {
        name: '分布式计算',
        level: '高级',
        importance: 95,
        description: '掌握Hadoop、Spark等分布式计算框架'
      },
      {
        name: '数据仓库',
        level: '中级',
        importance: 85,
        description: '熟悉Hive、ClickHouse等数据仓库技术'
      },
      {
        name: '实时计算',
        level: '中级',
        importance: 80,
        description: '掌握Kafka、Flink等实时数据处理技术'
      },
      {
        name: 'SQL优化',
        level: '高级',
        importance: 90,
        description: '具备复杂SQL查询优化和性能调优能力'
      }
    ],
    positions: [
      {
        name: '大数据工程师',
        salaryRange: '18K-45K',
        description: '负责大数据平台的搭建、维护和数据处理',
        requirements: ['Hadoop生态', 'Spark开发', 'SQL优化', 'Linux运维'],
        demand: '高',
        growth: '+22%'
      },
      {
        name: '数据仓库工程师',
        salaryRange: '20K-50K',
        description: '专注于企业级数据仓库的设计和实现',
        requirements: ['数据建模', 'ETL开发', 'Hive/ClickHouse', '数据治理'],
        demand: '很高',
        growth: '+25%'
      },
      {
        name: '实时计算工程师',
        salaryRange: '22K-55K',
        description: '负责实时数据流处理和分析系统开发',
        requirements: ['Flink/Storm', 'Kafka', '流式计算', '性能优化'],
        demand: '高',
        growth: '+30%'
      }
    ],
    applicationScenarios: [
      {
        id: 1,
        title: '电商实时数据分析',
        description: '构建电商平台的实时数据分析系统，支持实时监控和决策',
        category: '实时计算',
        difficulty: '中级',
        complexity: 80,
        interviewFrequency: 90,
        icon: markRaw(TrendCharts),
        color: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
        technologies: ['Kafka', 'Flink', 'Redis', 'ClickHouse'],
        businessValue: '实时监控GMV',
        technicalChallenges: ['数据延迟', '峰值处理', '数据一致性'],
        interviewPoints: ['流式架构', '窗口计算', '状态管理', '容错机制'],
        realWorldExample: {
          company: '阿里巴巴',
          scale: '日处理万亿条消息',
          technology: 'Flink+Kafka',
          result: '延迟降至秒级'
        }
      },
      {
        id: 2,
        title: '用户行为数据仓库',
        description: '构建企业级用户行为数据仓库，支持多维分析和报表',
        category: '数据仓库',
        difficulty: '高级',
        complexity: 85,
        interviewFrequency: 85,
        icon: markRaw(DataBoard),
        color: 'linear-gradient(45deg, #4c51bf 0%, #6b21a8 100%)',
        technologies: ['Hive', 'Spark SQL', 'Airflow', 'Presto'],
        businessValue: '支撑业务决策',
        technicalChallenges: ['数据建模', 'ETL性能', '数据质量'],
        interviewPoints: ['维度建模', 'ETL设计', '性能优化', '数据治理'],
        realWorldExample: {
          company: '字节跳动',
          scale: 'PB级数据存储',
          technology: 'Hive+Spark',
          result: '查询性能提升10倍'
        }
      },
      {
        id: 3,
        title: '日志分析平台',
        description: '构建企业级日志收集、存储、分析平台，支持运维监控',
        category: '数据处理',
        difficulty: '中级',
        complexity: 75,
        interviewFrequency: 80,
        icon: markRaw(Document),
        color: 'linear-gradient(45deg, #a8edea 0%, #fed6e3 100%)',
        technologies: ['ELK Stack', 'Flume', 'HBase', 'Grafana'],
        businessValue: '提升运维效率',
        technicalChallenges: ['海量日志', '实时检索', '存储优化'],
        interviewPoints: ['日志收集', '索引设计', '查询优化', '监控告警'],
        realWorldExample: {
          company: '美团',
          scale: '日处理TB级日志',
          technology: 'ELK+Kafka',
          result: '故障定位时间减少80%'
        }
      },
      {
        id: 4,
        title: '推荐系统离线计算',
        description: '构建推荐系统的离线特征计算和模型训练平台',
        category: '机器学习',
        difficulty: '高级',
        complexity: 90,
        interviewFrequency: 70,
        icon: markRaw(Cpu),
        color: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
        technologies: ['Spark MLlib', 'HDFS', 'Yarn', 'TensorFlow'],
        businessValue: '提升推荐效果',
        technicalChallenges: ['特征工程', '模型训练', '资源调度'],
        interviewPoints: ['特征计算', '模型pipeline', '资源优化', 'A/B测试'],
        realWorldExample: {
          company: '网易云音乐',
          scale: '亿级用户特征',
          technology: 'Spark+TensorFlow',
          result: '推荐点击率提升20%'
        }
      }
    ],
    questionCategories: [
      {
        type: 'basic',
        name: '基础概念',
        questions: [
          {
            title: 'Hadoop生态系统',
            content: '请详细介绍Hadoop生态系统的核心组件，包括HDFS、MapReduce、Yarn的作用和工作原理。',
            difficulty: '中级',
            type: '概念理解',
            estimatedTime: '6分钟'
          },
          {
            title: 'Spark vs MapReduce',
            content: '比较Spark和MapReduce的优缺点，说明在什么场景下选择哪种计算框架。',
            difficulty: '中级',
            type: '技术对比',
            estimatedTime: '5分钟'
          }
        ]
      },
      {
        type: 'practical',
        name: '实践应用',
        questions: [
          {
            title: '数据倾斜处理',
            content: '在Spark作业中遇到数据倾斜问题时，你会采用哪些方法来解决？请结合具体案例说明。',
            difficulty: '高级',
            type: '问题解决',
            estimatedTime: '8分钟'
          }
        ]
      }
    ],
    successCases: [
      {
        id: 1,
        name: '李大数',
        position: '高级大数据工程师',
        company: '阿里云',
        score: '89分',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
        testimonial: '系统全面评估了我的大数据技术栈掌握情况，特别是在Spark优化和数据仓库设计方面给出了专业的反馈。',
        highlights: ['Spark调优经验丰富', '数据架构设计能力强', '问题分析思路清晰', '实战项目经验充足']
      }
    ]
  },
  {
    key: 'iot',
    name: '物联网',
    description: '嵌入式开发、传感器、通信协议',
    fullDescription: '物联网技术涵盖嵌入式系统开发、传感器技术、无线通信、边缘计算等多个技术方向。',
    icon: 'Setting',
    color: 'var(--iot-gradient-primary)',
    theme: 'iot-theme',
    positionCount: '30',
    companies: '120',
    tags: ['嵌入式', '传感器', '通信协议', '边缘计算', 'MQTT', 'LoRa'],
    skills: [
      {
        name: '嵌入式开发',
        level: '高级',
        importance: 95,
        description: '掌握C/C++、ARM、单片机等嵌入式开发技术'
      },
      {
        name: '通信协议',
        level: '中级',
        importance: 85,
        description: '熟悉MQTT、CoAP、LoRa等物联网通信协议'
      },
      {
        name: '传感器技术',
        level: '中级',
        importance: 80,
        description: '了解各类传感器原理和数据采集技术'
      },
      {
        name: '边缘计算',
        level: '高级',
        importance: 90,
        description: '具备边缘设备部署和边缘AI算法优化能力'
      }
    ],
    positions: [
      {
        name: '嵌入式工程师',
        salaryRange: '15K-40K',
        description: '负责物联网设备的嵌入式软件开发',
        requirements: ['C/C++编程', 'ARM架构', '实时操作系统', '硬件调试'],
        demand: '高',
        growth: '+18%'
      },
      {
        name: 'IoT架构师',
        salaryRange: '25K-60K',
        description: '设计物联网系统的整体架构和技术方案',
        requirements: ['系统架构', '通信协议', '云平台', '安全设计'],
        demand: '很高',
        growth: '+25%'
      },
      {
        name: '边缘计算工程师',
        salaryRange: '20K-50K',
        description: '专注于边缘设备的AI算法部署和优化',
        requirements: ['边缘AI', '模型优化', '设备适配', '性能调优'],
        demand: '高',
        growth: '+30%'
      }
    ],
    applicationScenarios: [
      {
        id: 1,
        title: '智能工厂监控',
        description: '构建工业4.0智能工厂的设备监控和预测性维护系统',
        category: '工业物联网',
        difficulty: '高级',
        complexity: 90,
        interviewFrequency: 85,
        icon: markRaw(Setting),
        color: 'linear-gradient(45deg, #a8edea 0%, #fed6e3 100%)',
        technologies: ['工业传感器', 'Modbus', '边缘计算', '时序数据库'],
        businessValue: '降低30%维护成本',
        technicalChallenges: ['实时性要求', '恶劣环境', '数据可靠性'],
        interviewPoints: ['传感器选型', '通信协议', '数据处理', '故障预测'],
        realWorldExample: {
          company: '西门子',
          scale: '1000+设备监控',
          technology: 'Modbus+边缘AI',
          result: '故障预测准确率95%'
        }
      },
      {
        id: 2,
        title: '智慧城市路灯',
        description: '智能路灯系统，支持远程控制、环境监测、应急通信',
        category: '智慧城市',
        difficulty: '中级',
        complexity: 75,
        interviewFrequency: 80,
        icon: markRaw(VideoCamera),
        color: 'linear-gradient(45deg, #4c51bf 0%, #6b21a8 100%)',
        technologies: ['LoRa', 'NB-IoT', '太阳能', '环境传感器'],
        businessValue: '节能50%',
        technicalChallenges: ['低功耗设计', '网络覆盖', '设备管理'],
        interviewPoints: ['低功耗设计', '无线通信', '能源管理', '远程运维'],
        realWorldExample: {
          company: '华为',
          scale: '10万盏路灯',
          technology: 'NB-IoT+云平台',
          result: '运维成本降低60%'
        }
      },
      {
        id: 3,
        title: '农业物联网监控',
        description: '智慧农业环境监控系统，实时监测土壤、气候、作物状态',
        category: '智慧农业',
        difficulty: '中级',
        complexity: 70,
        interviewFrequency: 75,
        icon: markRaw(TrendCharts),
        color: 'linear-gradient(45deg, #f093fb 0%, #f5576c 100%)',
        technologies: ['土壤传感器', 'LoRa', '太阳能供电', '数据分析'],
        businessValue: '提升20%产量',
        technicalChallenges: ['户外环境', '电源管理', '数据传输'],
        interviewPoints: ['传感器网络', '数据采集', '电源设计', '环境适应'],
        realWorldExample: {
          company: '大疆农业',
          scale: '覆盖100万亩农田',
          technology: 'LoRa+AI分析',
          result: '节水30%，增产15%'
        }
      },
      {
        id: 4,
        title: '智能家居系统',
        description: '全屋智能家居控制系统，支持语音控制、场景联动、远程管理',
        category: '消费物联网',
        difficulty: '中级',
        complexity: 80,
        interviewFrequency: 90,
        icon: markRaw(Grid),
        color: 'linear-gradient(45deg, #a8edea 0%, #fed6e3 100%)',
        technologies: ['WiFi', 'Zigbee', '语音识别', '移动APP'],
        businessValue: '提升生活品质',
        technicalChallenges: ['设备互联', '协议兼容', '用户体验'],
        interviewPoints: ['协议选择', '设备发现', '场景联动', '安全设计'],
        realWorldExample: {
          company: '小米',
          scale: '5000万+设备连接',
          technology: 'WiFi+Zigbee',
          result: '用户满意度90%+'
        }
      }
    ],
    questionCategories: [
      {
        type: 'basic',
        name: '基础概念',
        questions: [
          {
            title: '物联网通信协议',
            content: '比较MQTT、CoAP、HTTP在物联网应用中的优缺点，说明各自适用的场景。',
            difficulty: '中级',
            type: '概念理解',
            estimatedTime: '6分钟'
          },
          {
            title: '嵌入式实时系统',
            content: '解释实时操作系统的特点，以及在物联网设备中如何保证实时性要求。',
            difficulty: '高级',
            type: '技术深度',
            estimatedTime: '7分钟'
          }
        ]
      },
      {
        type: 'practical',
        name: '实践应用',
        questions: [
          {
            title: '低功耗设计',
            content: '在设计电池供电的物联网设备时，你会采用哪些低功耗设计策略？请结合具体案例说明。',
            difficulty: '高级',
            type: '设计方案',
            estimatedTime: '8分钟'
          }
        ]
      }
    ],
    successCases: [
      {
        id: 1,
        name: '王物联',
        position: '高级IoT工程师',
        company: '华为',
        score: '91分',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        testimonial: '系统很好地评估了我的嵌入式开发能力和物联网系统设计思路，特别是在低功耗设计和通信协议方面的深度理解。',
        highlights: ['嵌入式开发经验丰富', '通信协议理解深入', '系统设计思路清晰', '实际项目落地能力强']
      }
    ]
  },
  {
    key: 'interview',
    name: '面试评估',
    description: '多模态智能面试、六维能力评估',
    fullDescription: '面试评估领域专注于智能面试技术、多模态分析、能力评估算法等前沿技术，结合AI技术提升面试效率和准确性。',
    icon: 'User',
    color: 'var(--interview-gradient-primary)',
    theme: 'interview-theme',
    positionCount: '25',
    companies: '80',
    tags: ['智能面试', '多模态分析', '能力评估', '语音识别', 'NLP', '计算机视觉'],
    skills: [
      {
        name: '多模态分析',
        level: '高级',
        importance: 95,
        description: '掌握语音、视频、文本多维度智能分析技术'
      },
      {
        name: '机器学习',
        level: '中级',
        importance: 85,
        description: '熟练运用机器学习算法进行能力评估建模'
      },
      {
        name: '自然语言处理',
        level: '中级',
        importance: 80,
        description: '具备文本分析、情感识别、语义理解能力'
      },
      {
        name: '系统架构',
        level: '高级',
        importance: 90,
        description: '设计高并发、高可用的面试评估系统架构'
      }
    ],
    positions: [
      {
        name: '智能面试系统工程师',
        salaryRange: '18K-45K',
        description: '负责智能面试系统的设计、开发和优化',
        requirements: ['多模态分析', 'Python编程', '机器学习', '系统设计'],
        demand: '高',
        growth: '+35%'
      },
      {
        name: 'AI评估算法工程师',
        salaryRange: '22K-50K',
        description: '专注于面试评估算法的研究和实现',
        requirements: ['机器学习', '算法设计', 'NLP', '数据分析'],
        demand: '很高',
        growth: '+40%'
      },
      {
        name: '产品技术经理',
        salaryRange: '25K-55K',
        description: '负责面试评估产品的技术规划和团队管理',
        requirements: ['技术管理', '产品设计', '团队协作', '业务理解'],
        demand: '中',
        growth: '+20%'
      }
    ],
    applicationScenarios: [
      {
        id: 1,
        title: '企业招聘面试',
        description: '为企业提供智能化的候选人评估服务',
        icon: 'Office',
        benefits: ['提升面试效率', '减少人为偏见', '标准化评估'],
        techStack: ['iFlytek Spark', 'Vue.js', 'Python', 'TensorFlow']
      },
      {
        id: 2,
        title: '在线教育评估',
        description: '为在线教育平台提供学习能力评估',
        icon: 'School',
        benefits: ['个性化学习', '能力诊断', '学习路径推荐'],
        techStack: ['机器学习', 'NLP', '数据分析', 'Web开发']
      },
      {
        id: 3,
        title: '职业技能认证',
        description: '为职业技能认证提供智能化评估方案',
        icon: 'Medal',
        benefits: ['客观评估', '技能认证', '职业发展'],
        techStack: ['多模态分析', '评估算法', '系统集成', 'API开发']
      }
    ],
    successCases: [
      {
        id: 1,
        company: 'iFlytek科大讯飞',
        position: '智能面试系统架构师',
        candidate: '张同学',
        score: 92,
        testimonial: '系统全面评估了我的技术能力和沟通表达，特别是在多模态分析和系统设计方面的专业深度。',
        highlights: ['系统架构设计能力强', '多模态技术理解深入', '沟通表达清晰', '项目经验丰富']
      },
      {
        id: 2,
        company: '某知名互联网公司',
        position: 'AI评估算法工程师',
        candidate: '李同学',
        score: 88,
        testimonial: '面试过程很智能，能够准确识别我的技术优势和改进空间，评估结果很有参考价值。',
        highlights: ['算法设计能力突出', '机器学习基础扎实', '问题分析思路清晰', '学习能力强']
      }
    ]
  }
])

const currentDomain = computed(() => {
  return domains.value.find(d => d.key === activeDomain.value)
})

// 获取标签图标主题类
const getTabIconClass = (theme) => {
  const iconClassMap = {
    'ai-theme': 'ai-icon',
    'bigdata-theme': 'bigdata-icon',
    'iot-theme': 'iot-icon',
    'interview-theme': 'interview-icon'
  }
  return iconClassMap[theme] || 'ai-icon'
}

const getTagType = (tag) => {
  const typeMap = {
    '机器学习': 'primary',
    '深度学习': 'success',
    'NLP': 'warning',
    '计算机视觉': 'info',
    'Hadoop': 'primary',
    'Spark': 'success',
    '嵌入式': 'primary',
    '传感器': 'warning'
  }
  return typeMap[tag] || 'info'
}

const getLevelClass = (level) => {
  const classMap = {
    '入门': 'level-beginner',
    '中级': 'level-intermediate', 
    '高级': 'level-advanced'
  }
  return classMap[level] || ''
}

const getDifficultyClass = (difficulty) => {
  const classMap = {
    '入门': 'difficulty-beginner',
    '中级': 'difficulty-intermediate',
    '高级': 'difficulty-advanced'
  }
  return classMap[difficulty] || ''
}

const startDomainDemo = () => {
  ElMessage.success(`正在启动 ${currentDomain.value.name} 领域演示...`)

  // 创建演示弹窗
  const demoContent = createDemoContent(currentDomain.value)

  ElMessageBox({
    title: `${currentDomain.value.name} 领域演示`,
    message: demoContent,
    showCancelButton: true,
    confirmButtonText: '开始面试体验',
    cancelButtonText: '继续观看',
    type: 'info',
    customClass: 'domain-demo-dialog',
    dangerouslyUseHTMLString: true
  }).then(() => {
    // 跳转到面试页面
    router.push('/interview-selection')
  }).catch(() => {
    ElMessage.info('您可以继续观看其他演示内容')
  })
}

const viewDomainVideo = () => {
  ElMessage.success(`正在加载 ${currentDomain.value.name} 领域视频...`)

  // 创建视频播放器弹窗
  const videoContent = createVideoContent(currentDomain.value)

  ElMessageBox({
    title: `${currentDomain.value.name} 技术视频`,
    message: videoContent,
    showCancelButton: true,
    confirmButtonText: '观看完整视频',
    cancelButtonText: '关闭',
    type: 'success',
    customClass: 'domain-video-dialog',
    dangerouslyUseHTMLString: true
  }).then(() => {
    // 打开视频页面
    router.push('/demo?tab=video')
  })
}

const selectPosition = (position) => {
  ElMessage.success(`正在加载 ${position.name} 详细信息...`)

  // 创建岗位详情弹窗
  const positionContent = createPositionContent(position)

  ElMessageBox({
    title: position.name,
    message: positionContent,
    showCancelButton: true,
    confirmButtonText: '开始模拟面试',
    cancelButtonText: '查看更多岗位',
    type: 'info',
    customClass: 'position-detail-dialog',
    dangerouslyUseHTMLString: true
  }).then(() => {
    // 跳转到面试页面，传递岗位信息
    router.push(`/interview-selection?position=${encodeURIComponent(position.name)}`)
  })
}

const previewAnswer = (question) => {
  ElMessage.success(`正在加载解答思路: ${question.title}`)

  // 创建解答思路内容
  const answerContent = createAnswerContent(question)

  ElMessageBox({
    title: `解答思路 - ${question.title}`,
    message: answerContent,
    showCancelButton: true,
    confirmButtonText: '开始练习',
    cancelButtonText: '查看其他题目',
    type: 'info',
    customClass: 'answer-preview-dialog',
    dangerouslyUseHTMLString: true
  }).then(() => {
    practiceQuestion(question)
  })
}

const practiceQuestion = (question) => {
  ElMessage.success(`正在启动练习模式: ${question.title}`)

  // 创建练习界面
  const practiceContent = createPracticeContent(question)

  ElMessageBox({
    title: `练习模式 - ${question.title}`,
    message: practiceContent,
    showCancelButton: true,
    confirmButtonText: '提交答案',
    cancelButtonText: '退出练习',
    type: 'warning',
    customClass: 'practice-dialog',
    dangerouslyUseHTMLString: true
  }).then(() => {
    ElMessage.success('答案已提交，正在生成评估报告...')
    setTimeout(() => {
      ElMessage.info('评估完成！您可以查看详细的反馈报告')
    }, 2000)
  })
}

// 应用场景相关方法
const viewScenarioDetails = (scenario) => {
  console.log('viewScenarioDetails called with:', scenario)
  ElMessage.success(`正在加载场景详情: ${scenario.title}`)

  // 创建场景详情弹窗
  const scenarioContent = createScenarioContent(scenario)

  ElMessageBox({
    title: `应用场景 - ${scenario.title}`,
    message: scenarioContent,
    showCancelButton: true,
    confirmButtonText: '开始场景演示',
    cancelButtonText: '查看其他场景',
    type: 'info',
    customClass: 'scenario-detail-dialog',
    dangerouslyUseHTMLString: true
  }).then(() => {
    startScenarioDemo(scenario)
  })
}

const startScenarioDemo = (scenario) => {
  ElMessage.success(`正在启动场景演示: ${scenario.title}`)

  // 创建场景演示内容
  const demoContent = createScenarioDemoContent(scenario)

  ElMessageBox({
    title: `场景演示 - ${scenario.title}`,
    message: demoContent,
    showCancelButton: true,
    confirmButtonText: '开始模拟面试',
    cancelButtonText: '继续观看',
    type: 'success',
    customClass: 'scenario-demo-dialog',
    dangerouslyUseHTMLString: true
  }).then(() => {
    // 跳转到面试页面，传递场景信息
    router.push(`/interview-selection?scenario=${encodeURIComponent(scenario.title)}`)
  })
}

const viewTechDetails = (scenario) => {
  ElMessage.success(`正在加载技术细节: ${scenario.title}`)

  // 创建技术细节内容
  const techContent = createTechDetailsContent(scenario)

  ElMessageBox({
    title: `技术细节 - ${scenario.title}`,
    message: techContent,
    showCancelButton: true,
    confirmButtonText: '查看面试要点',
    cancelButtonText: '返回场景',
    type: 'warning',
    customClass: 'tech-details-dialog',
    dangerouslyUseHTMLString: true,
    callback: (action) => {
      if (action === 'confirm') {
        viewInterviewPoints(scenario)
      }
    }
  })

  // 延迟渲染Mermaid图表，确保弹窗DOM已加载
  setTimeout(async () => {
    const architectureId = `architecture-mermaid-${scenario.id}`
    const sparkIntegrationId = `spark-integration-mermaid-${scenario.id}`

    // 渲染系统架构图
    const architectureElement = document.getElementById(architectureId)
    if (architectureElement && mermaid) {
      try {
        await renderMermaidDiagram(architectureId, `
          graph TB
            A[用户界面层<br/>Vue.js + Element Plus] --> B[API网关层<br/>FastAPI]
            B --> C[AI服务层<br/>iFlytek Spark LLM]
            C --> D[数据处理层<br/>${scenario.technologies.slice(0, 2).join(' + ')}]
            D --> E[数据存储层<br/>MySQL + Redis]

            A1[用户交互] --> A
            A --> A2[数据可视化]

            B1[身份认证] --> B
            B --> B2[请求路由]
            B --> B3[限流控制]

            C1[多模态分析] --> C
            C --> C2[智能评估]
            C --> C3[自然语言处理]

            D1[数据清洗] --> D
            D --> D2[特征提取]
            D --> D3[实时处理]

            E1[关系数据库] --> E
            E --> E2[缓存系统]
            E --> E3[文件存储]

            classDef frontend fill:#409EFF,stroke:#333,stroke-width:2px,color:#fff
            classDef gateway fill:#E6A23C,stroke:#333,stroke-width:2px,color:#fff
            classDef ai fill:#9C27B0,stroke:#333,stroke-width:2px,color:#fff
            classDef processing fill:#FF5722,stroke:#333,stroke-width:2px,color:#fff
            classDef storage fill:#607D8B,stroke:#333,stroke-width:2px,color:#fff

            class A,A1,A2 frontend
            class B,B1,B2,B3 gateway
            class C,C1,C2,C3 ai
            class D,D1,D2,D3 processing
            class E,E1,E2,E3 storage
        `)
      } catch (error) {
        console.error('Failed to render architecture diagram:', error)
      }
    }

    // 渲染iFlytek Spark集成流程图
    const sparkElement = document.getElementById(sparkIntegrationId)
    if (sparkElement && mermaid) {
      try {
        await renderMermaidDiagram(sparkIntegrationId, createSparkIntegrationDiagram(scenario))
      } catch (error) {
        console.error('Failed to render Spark integration diagram:', error)
      }
    }

    // 渲染六维能力评估算法图
    const assessmentId = `assessment-algorithm-mermaid-${scenario.id}`
    const assessmentElement = document.getElementById(assessmentId)
    if (assessmentElement && mermaid) {
      try {
        await renderMermaidDiagram(assessmentId, createAssessmentAlgorithmDiagram())
      } catch (error) {
        console.error('Failed to render assessment algorithm diagram:', error)
      }
    }
  }, 500)
}

const viewInterviewPoints = (scenario) => {
  ElMessage.success(`正在加载面试要点: ${scenario.title}`)

  // 创建面试要点内容
  const interviewContent = createInterviewPointsContent(scenario)

  ElMessageBox({
    title: `面试要点 - ${scenario.title}`,
    message: interviewContent,
    showCancelButton: true,
    confirmButtonText: '开始练习',
    cancelButtonText: '查看案例',
    type: 'info',
    customClass: 'interview-points-dialog',
    dangerouslyUseHTMLString: true
  }).then(() => {
    ElMessage.success('正在为您准备针对性的面试练习...')
    setTimeout(() => {
      router.push(`/interview-selection?focus=${encodeURIComponent(scenario.category)}`)
    }, 1000)
  })
}

// 创建演示内容的辅助函数
const createDemoContent = (domain) => {
  return `
    <div class="demo-content-wrapper">
      <div class="demo-preview">
        <div class="demo-video-placeholder" style="background: ${domain.color}; height: 200px; border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-size: 18px; margin-bottom: 20px;">
          <i class="el-icon-video-play" style="font-size: 48px;"></i>
          <span style="margin-left: 10px;">${domain.name} 演示视频</span>
        </div>
        <div class="demo-features">
          <h4 style="color: #409EFF; margin-bottom: 15px;">🎯 演示亮点</h4>
          <ul style="list-style: none; padding: 0;">
            <li style="margin-bottom: 10px; padding: 8px; background: #f0f9ff; border-radius: 6px;">
              <strong>智能评估:</strong> 实时分析技术能力和表达水平
            </li>
            <li style="margin-bottom: 10px; padding: 8px; background: #f0f9ff; border-radius: 6px;">
              <strong>多维反馈:</strong> 六维能力评估报告
            </li>
            <li style="margin-bottom: 10px; padding: 8px; background: #f0f9ff; border-radius: 6px;">
              <strong>个性化建议:</strong> 针对性的改进建议
            </li>
          </ul>
        </div>
      </div>
    </div>
  `
}

// 创建视频内容的辅助函数
const createVideoContent = (domain) => {
  return `
    <div class="video-content-wrapper">
      <div class="video-preview">
        <div class="video-player-placeholder iflytek-card-header" style="height: 250px; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; margin-bottom: 20px; box-shadow: 0 8px 30px rgba(76, 81, 191, 0.3);">
          <i class="el-icon-video-camera" style="font-size: 64px; margin-bottom: 10px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);"></i>
          <h3 style="margin: 0; font-size: 20px; font-weight: 600; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);">${domain.name} 技术深度解析</h3>
          <p style="margin: 10px 0 0 0; opacity: 0.95; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);">时长: 15分钟 | 高清画质</p>
        </div>
        <div class="video-chapters">
          <h4 style="color: #409EFF; margin-bottom: 15px;">📚 视频章节</h4>
          <div style="display: grid; gap: 10px;">
            <div style="padding: 12px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #409EFF;">
              <strong>第1章:</strong> ${domain.name}技术概览 (3分钟)
            </div>
            <div style="padding: 12px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #67C23A;">
              <strong>第2章:</strong> 核心算法与实现 (6分钟)
            </div>
            <div style="padding: 12px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #E6A23C;">
              <strong>第3章:</strong> 实际应用案例 (4分钟)
            </div>
            <div style="padding: 12px; background: #f8f9fa; border-radius: 8px; border-left: 4px solid #F56C6C;">
              <strong>第4章:</strong> 面试技巧分享 (2分钟)
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

// 创建岗位详情内容的辅助函数
const createPositionContent = (position) => {
  return `
    <div class="position-content-wrapper">
      <div class="position-overview">
        <div style="background: linear-gradient(45deg, #409EFF, #67C23A); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; font-size: 24px;">${position.name}</h3>
          <p style="margin: 0; font-size: 18px; opacity: 0.9;">薪资范围: ${position.salaryRange}</p>
        </div>
        <div class="position-details">
          <h4 style="color: #409EFF; margin-bottom: 15px;">💼 岗位详情</h4>
          <p style="line-height: 1.6; margin-bottom: 20px;">${position.description}</p>

          <h4 style="color: #409EFF; margin-bottom: 15px;">🎯 核心要求</h4>
          <ul style="list-style: none; padding: 0;">
            ${position.requirements.map(req => `
              <li style="margin-bottom: 8px; padding: 8px 12px; background: #f0f9ff; border-radius: 6px; border-left: 3px solid #409EFF;">
                ${req}
              </li>
            `).join('')}
          </ul>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px;">
            <div style="text-align: center; padding: 15px; background: #f0f9ff; border-radius: 8px;">
              <div style="font-size: 24px; font-weight: bold; color: #409EFF;">${position.demand}</div>
              <div style="color: #666; margin-top: 5px;">市场需求</div>
            </div>
            <div style="text-align: center; padding: 15px; background: #f0f9ff; border-radius: 8px;">
              <div style="font-size: 24px; font-weight: bold; color: #67C23A;">${position.growth}</div>
              <div style="color: #666; margin-top: 5px;">薪资增长</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

// 创建解答思路内容的辅助函数
const createAnswerContent = (question) => {
  return `
    <div class="answer-content-wrapper">
      <div class="question-overview">
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #409EFF;">
          <h4 style="margin: 0 0 10px 0; color: #409EFF;">题目内容</h4>
          <p style="margin: 0; line-height: 1.6;">${question.content}</p>
        </div>

        <div class="answer-approach">
          <h4 style="color: #409EFF; margin-bottom: 15px;">💡 解答思路</h4>
          <div style="background: #fff7e6; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h5 style="margin: 0 0 10px 0; color: #E6A23C;">第一步: 理解题目核心</h5>
            <p style="margin: 0; line-height: 1.6;">分析题目的关键词和考察点，明确回答方向</p>
          </div>
          <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
            <h5 style="margin: 0 0 10px 0; color: #409EFF;">第二步: 结构化回答</h5>
            <p style="margin: 0; line-height: 1.6;">按照逻辑顺序组织答案，确保条理清晰</p>
          </div>
          <div style="background: #f0fff0; padding: 15px; border-radius: 8px;">
            <h5 style="margin: 0 0 10px 0; color: #67C23A;">第三步: 举例说明</h5>
            <p style="margin: 0; line-height: 1.6;">结合具体案例或项目经验，增强说服力</p>
          </div>
        </div>

        <div style="background: #fff2f0; padding: 15px; border-radius: 8px; margin-top: 20px;">
          <h5 style="margin: 0 0 10px 0; color: #F56C6C;">⚠️ 注意事项</h5>
          <ul style="margin: 0; padding-left: 20px; line-height: 1.6;">
            <li>保持逻辑清晰，避免跳跃性思维</li>
            <li>适当展示技术深度，但不要过于复杂</li>
            <li>结合实际项目经验，增加可信度</li>
          </ul>
        </div>
      </div>
    </div>
  `
}

// 创建练习内容的辅助函数
const createPracticeContent = (question) => {
  return `
    <div class="practice-content-wrapper">
      <div class="practice-interface">
        <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
          <h4 style="margin: 0 0 10px 0; color: #409EFF;">📝 练习题目</h4>
          <p style="margin: 0; line-height: 1.6; font-weight: 500;">${question.content}</p>
          <div style="margin-top: 10px; display: flex; gap: 15px; font-size: 14px; color: #666;">
            <span>难度: ${question.difficulty}</span>
            <span>类型: ${question.type}</span>
            <span>预计时间: ${question.estimatedTime}</span>
          </div>
        </div>

        <div class="answer-input">
          <h4 style="color: #409EFF; margin-bottom: 15px;">✍️ 您的回答</h4>
          <textarea
            placeholder="请在这里输入您的答案..."
            style="width: 100%; height: 150px; padding: 15px; border: 2px solid #e4e7ed; border-radius: 8px; font-size: 14px; line-height: 1.6; resize: vertical; font-family: inherit;"
          ></textarea>
        </div>

        <div class="practice-tips">
          <h4 style="color: #E6A23C; margin: 20px 0 15px 0;">💡 答题提示</h4>
          <div style="background: #fff7e6; padding: 15px; border-radius: 8px;">
            <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
              <li>思考清楚再作答，注意逻辑结构</li>
              <li>可以结合具体例子来说明观点</li>
              <li>展示您的技术理解和实践经验</li>
              <li>回答完整但要控制在合理篇幅内</li>
            </ul>
          </div>
        </div>

        <div style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin-top: 20px; text-align: center;">
          <p style="margin: 0; color: #409EFF; font-weight: 500;">⏱️ 建议答题时间: ${question.estimatedTime}</p>
        </div>
      </div>
    </div>
  `
}

// 创建场景详情内容的辅助函数
const createScenarioContent = (scenario) => {
  return `
    <div class="scenario-content-wrapper">
      <div class="scenario-overview">
        <div style="background: ${scenario.color}; color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <h3 style="margin: 0 0 10px 0; font-size: 24px;">${scenario.title}</h3>
          <p style="margin: 0; font-size: 16px; opacity: 0.9;">${scenario.description}</p>
          <div style="margin-top: 15px; display: flex; gap: 15px; font-size: 14px;">
            <span>类别: ${scenario.category}</span>
            <span>难度: ${scenario.difficulty}</span>
            <span>面试频率: ${scenario.interviewFrequency}%</span>
          </div>
        </div>

        <div class="scenario-details">
          <h4 style="color: #409EFF; margin-bottom: 15px;">💼 商业价值</h4>
          <p style="background: #f0f9ff; padding: 15px; border-radius: 8px; margin-bottom: 20px; line-height: 1.6;">
            ${scenario.businessValue}
          </p>

          <h4 style="color: #E6A23C; margin-bottom: 15px;">🛠️ 技术栈</h4>
          <div style="display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 20px;">
            ${scenario.technologies.map(tech => `
              <span style="background: #fff7e6; color: #E6A23C; padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;">
                ${tech}
              </span>
            `).join('')}
          </div>

          <h4 style="color: #F56C6C; margin-bottom: 15px;">⚡ 技术挑战</h4>
          <ul style="list-style: none; padding: 0; margin-bottom: 20px;">
            ${scenario.technicalChallenges.map(challenge => `
              <li style="margin-bottom: 8px; padding: 10px; background: #fff2f0; border-radius: 6px; border-left: 3px solid #F56C6C;">
                ${challenge}
              </li>
            `).join('')}
          </ul>

          <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
            <h5 style="margin: 0 0 10px 0; color: #67C23A;">🏢 真实案例</h5>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div>
                <strong>公司:</strong> ${scenario.realWorldExample.company}<br>
                <strong>规模:</strong> ${scenario.realWorldExample.scale}
              </div>
              <div>
                <strong>技术:</strong> ${scenario.realWorldExample.technology}<br>
                <strong>效果:</strong> ${scenario.realWorldExample.result}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

// 创建场景演示内容的辅助函数
const createScenarioDemoContent = (scenario) => {
  return `
    <div class="scenario-demo-wrapper">
      <div class="demo-interface">
        <div class="iflytek-card-header" style="padding: 25px; border-radius: 12px; margin-bottom: 20px; text-align: center; box-shadow: 0 8px 30px rgba(76, 81, 191, 0.3);">
          <h3 style="margin: 0 0 15px 0; font-size: 28px; font-weight: 600; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);">🎬 ${scenario.title}</h3>
          <p style="margin: 0; font-size: 18px; opacity: 0.95; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);">沉浸式场景演示体验</p>
          <div style="margin-top: 20px; display: flex; justify-content: center; gap: 20px; font-size: 16px; flex-wrap: wrap;">
            <span style="text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);">⏱️ 演示时长: 10分钟</span>
            <span style="text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);">🎯 难度: ${scenario.difficulty}</span>
            <span style="text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);">📊 复杂度: ${scenario.complexity}%</span>
          </div>
        </div>

        <!-- 视频播放器占位符 -->
        <div class="video-player-placeholder" style="background: linear-gradient(135deg, #4c51bf 0%, #6b21a8 100%); height: 300px; border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; color: #ffffff !important; margin-bottom: 25px; box-shadow: 0 8px 30px rgba(76, 81, 191, 0.3);">
          <i class="el-icon-video-play" style="font-size: 72px; margin-bottom: 15px; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3); color: #ffffff !important;"></i>
          <h3 style="margin: 0; font-size: 24px; font-weight: 600; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3); color: #ffffff !important;">${scenario.title} - 专业演示</h3>
          <p style="margin: 10px 0 0 0; opacity: 0.95; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2); font-size: 16px; color: #ffffff !important;">高清画质 | 中文字幕 | iFlytek Spark技术驱动</p>
          <div style="margin-top: 20px; padding: 10px 20px; background: rgba(255, 255, 255, 0.2); border-radius: 20px; font-size: 14px; color: #ffffff !important;">
            点击"开始模拟面试"体验完整功能
          </div>
        </div>

        <!-- 演示内容概览 -->
        <div class="demo-content-overview">
          <h4 style="color: #409EFF; margin-bottom: 20px; font-size: 20px; font-weight: 600;">
            <i class="el-icon-star-on" style="margin-right: 8px; color: #409EFF;"></i>
            演示内容概览
          </h4>
          <div style="display: grid; gap: 15px; margin-bottom: 25px;">
            <div style="padding: 20px; background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%); border-radius: 12px; border-left: 5px solid #409EFF; box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                <div style="background: #409EFF; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: bold;">1</div>
                <strong style="color: #1565c0; font-size: 16px;">真实场景模拟</strong>
              </div>
              <p style="margin: 0; color: #424242; line-height: 1.6;">基于 <strong>${scenario.realWorldExample.company}</strong> 的实际项目案例，深入了解企业级应用场景和技术挑战。通过真实的业务需求分析，掌握技术方案的设计思路和实现路径。</p>
            </div>

            <div style="padding: 20px; background: linear-gradient(135deg, #f0fff0 0%, #e8f5e8 100%); border-radius: 12px; border-left: 5px solid #67C23A; box-shadow: 0 2px 8px rgba(103, 194, 58, 0.1);">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                <div style="background: #67C23A; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: bold;">2</div>
                <strong style="color: #2e7d32; font-size: 16px;">核心技术深度解析</strong>
              </div>
              <p style="margin: 0; color: #424242; line-height: 1.6;">详细讲解 <strong>${scenario.technologies.join('、')}</strong> 等核心技术的原理、应用场景和最佳实践。从基础概念到高级应用，全面提升技术理解深度。</p>
            </div>

            <div style="padding: 20px; background: linear-gradient(135deg, #fff7e6 0%, #fef3c7 100%); border-radius: 12px; border-left: 5px solid #E6A23C; box-shadow: 0 2px 8px rgba(230, 162, 60, 0.1);">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                <div style="background: #E6A23C; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: bold;">3</div>
                <strong style="color: #f57c00; font-size: 16px;">面试要点精准提炼</strong>
              </div>
              <p style="margin: 0; color: #424242; line-height: 1.6;">重点关注 <strong>${scenario.interviewPoints.join('、')}</strong> 等高频面试考点。结合iFlytek Spark LLM的智能分析，精准把握面试官的关注重点和评分标准。</p>
            </div>

            <div style="padding: 20px; background: linear-gradient(135deg, #fff2f0 0%, #fee2e2 100%); border-radius: 12px; border-left: 5px solid #F56C6C; box-shadow: 0 2px 8px rgba(245, 108, 108, 0.1);">
              <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 10px;">
                <div style="background: #F56C6C; color: white; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 16px; font-weight: bold;">4</div>
                <strong style="color: #d32f2f; font-size: 16px;">技术挑战解决方案</strong>
              </div>
              <p style="margin: 0; color: #424242; line-height: 1.6;">深入分析如何应对 <strong>${scenario.technicalChallenges.join('、')}</strong> 等技术难题。提供多种解决思路和最佳实践，培养解决复杂问题的能力。</p>
            </div>
          </div>
        </div>

        <!-- iFlytek Spark技术亮点 -->
        <div class="iflytek-highlights">
          <h4 style="color: #9C27B0; margin-bottom: 20px; font-size: 20px; font-weight: 600;">
            <i class="el-icon-magic-stick" style="margin-right: 8px; color: #9C27B0;"></i>
            iFlytek Spark 技术亮点
          </h4>
          <div style="background: linear-gradient(135deg, #f3e5f5 0%, #faf2ff 100%); padding: 20px; border-radius: 12px; margin-bottom: 25px; border: 1px solid #e1bee7;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
              <div style="text-align: center; padding: 15px;">
                <div style="background: linear-gradient(135deg, #9C27B0, #7b1fa2); color: white; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; font-size: 20px; box-shadow: 0 4px 12px rgba(156, 39, 176, 0.3);">🧠</div>
                <h5 style="margin: 0 0 8px 0; color: #7b1fa2; font-weight: 600;">多模态理解</h5>
                <p style="margin: 0; color: #4a4a4a; font-size: 14px; line-height: 1.4;">同时处理文本、语音、图像数据，实现全方位智能分析</p>
              </div>

              <div style="text-align: center; padding: 15px;">
                <div style="background: linear-gradient(135deg, #673AB7, #512da8); color: white; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; font-size: 20px; box-shadow: 0 4px 12px rgba(103, 58, 183, 0.3);">⚡</div>
                <h5 style="margin: 0 0 8px 0; color: #512da8; font-weight: 600;">实时响应</h5>
                <p style="margin: 0; color: #4a4a4a; font-size: 14px; line-height: 1.4;">毫秒级响应速度，支持实时交互和即时反馈</p>
              </div>

              <div style="text-align: center; padding: 15px;">
                <div style="background: linear-gradient(135deg, #3F51B5, #303f9f); color: white; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; font-size: 20px; box-shadow: 0 4px 12px rgba(63, 81, 181, 0.3);">🎯</div>
                <h5 style="margin: 0 0 8px 0; color: #303f9f; font-weight: 600;">中文优化</h5>
                <p style="margin: 0; color: #4a4a4a; font-size: 14px; line-height: 1.4;">专门针对中文语境优化，理解更准确</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 学习收益预期 -->
        <div class="learning-outcomes">
          <h4 style="color: #4CAF50; margin-bottom: 20px; font-size: 20px; font-weight: 600;">
            <i class="el-icon-trophy" style="margin-right: 8px; color: #4CAF50;"></i>
            学习收益预期
          </h4>
          <div style="background: linear-gradient(135deg, #f1f8e9 0%, #e8f5e8 100%); padding: 25px; border-radius: 12px; border: 1px solid #c8e6c9;">
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px;">
              <div style="text-align: center; padding: 20px; background: white; border-radius: 10px; box-shadow: 0 2px 8px rgba(76, 175, 80, 0.1);">
                <div style="background: linear-gradient(135deg, #67C23A, #4caf50); color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 24px; font-weight: bold; box-shadow: 0 4px 12px rgba(103, 194, 58, 0.3);">85%</div>
                <h5 style="margin: 0 0 8px 0; color: #2e7d32; font-weight: 600;">技术理解提升</h5>
                <p style="margin: 0; color: #4a4a4a; font-size: 14px; line-height: 1.4;">深入理解核心技术原理和应用场景</p>
              </div>

              <div style="text-align: center; padding: 20px; background: white; border-radius: 10px; box-shadow: 0 2px 8px rgba(64, 158, 255, 0.1);">
                <div style="background: linear-gradient(135deg, #409EFF, #2196f3); color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 24px; font-weight: bold; box-shadow: 0 4px 12px rgba(64, 158, 255, 0.3);">90%</div>
                <h5 style="margin: 0 0 8px 0; color: #1565c0; font-weight: 600;">面试通过率</h5>
                <p style="margin: 0; color: #4a4a4a; font-size: 14px; line-height: 1.4;">掌握面试要点，提高面试成功概率</p>
              </div>

              <div style="text-align: center; padding: 20px; background: white; border-radius: 10px; box-shadow: 0 2px 8px rgba(230, 162, 60, 0.1);">
                <div style="background: linear-gradient(135deg, #E6A23C, #ff9800); color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-size: 24px; font-weight: bold; box-shadow: 0 4px 12px rgba(230, 162, 60, 0.3);">75%</div>
                <h5 style="margin: 0 0 8px 0; color: #f57c00; font-weight: 600;">实战能力增强</h5>
                <p style="margin: 0; color: #4a4a4a; font-size: 14px; line-height: 1.4;">提升解决实际问题的能力和经验</p>
              </div>
            </div>

            <div style="background: white; padding: 20px; border-radius: 10px; text-align: center;">
              <h5 style="margin: 0 0 15px 0; color: #4CAF50; font-weight: 600;">🎓 专业认证</h5>
              <p style="margin: 0; color: #4a4a4a; line-height: 1.6;">完成演示学习后，您将获得由iFlytek Spark技术团队认证的专业技能证书，为您的职业发展增添有力证明。</p>
            </div>
          </div>
        </div>

        <!-- 演示流程说明 -->
        <div class="demo-process">
          <h4 style="color: #607D8B; margin-bottom: 20px; font-size: 20px; font-weight: 600;">
            <i class="el-icon-guide" style="margin-right: 8px; color: #607D8B;"></i>
            演示流程说明
          </h4>
          <div style="background: linear-gradient(135deg, #f5f5f5 0%, #eeeeee 100%); padding: 20px; border-radius: 12px; border: 1px solid #e0e0e0;">
            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
              <div style="background: #607D8B; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; flex-shrink: 0;">1</div>
              <div>
                <strong style="color: #424242;">观看专业演示视频</strong>
                <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">高清画质技术讲解，配备中文字幕和详细注释</p>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 15px; margin-bottom: 15px;">
              <div style="background: #607D8B; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; flex-shrink: 0;">2</div>
              <div>
                <strong style="color: #424242;">互动式技术解析</strong>
                <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">实时问答和技术要点讲解，加深理解</p>
              </div>
            </div>

            <div style="display: flex; align-items: center; gap: 15px;">
              <div style="background: #607D8B; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; font-weight: bold; flex-shrink: 0;">3</div>
              <div>
                <strong style="color: #424242;">模拟面试实战</strong>
                <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">基于iFlytek Spark的智能面试官，真实面试体验</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

// 创建技术细节内容的辅助函数
const createTechDetailsContent = (scenario) => {
  return `
    <div class="tech-details-wrapper">
      <div class="tech-overview">
        <div style="background: linear-gradient(135deg, #4c51bf 0%, #6b21a8 100%); color: #ffffff !important; padding: 25px; border-radius: 15px; margin-bottom: 25px; text-align: center; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);">
          <h3 style="margin: 0 0 10px 0; font-size: 24px; font-weight: bold; color: #ffffff !important; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);">🏗️ ${scenario.title}</h3>
          <h4 style="margin: 0 0 15px 0; font-size: 18px; color: #ffffff !important; opacity: 0.95; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);">技术架构深度解析</h4>
          <p style="margin: 0; line-height: 1.6; color: #ffffff !important; opacity: 0.9; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);">${scenario.description}</p>
        </div>

        <!-- 系统技术架构图 -->
        <div class="system-architecture">
          <h4 style="color: #409EFF; margin-bottom: 20px; font-size: 20px;">
            <i class="el-icon-cpu" style="margin-right: 8px;"></i>
            系统技术架构图
          </h4>
          <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
            <!-- 架构图表展示区域 -->
            <div class="mermaid-diagram" style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
              <div id="architecture-mermaid-${scenario.id}" style="min-height: 400px; display: flex; align-items: center; justify-content: center;">
                <div style="text-align: center; color: #666;">
                  <i class="el-icon-loading" style="font-size: 48px; margin-bottom: 15px; color: #409EFF;"></i>
                  <p style="margin: 0; font-size: 16px;">正在加载交互式架构图...</p>
                  <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.8;">基于Mermaid技术的专业架构可视化</p>
                </div>
              </div>
              <div style="margin-top: 15px; padding: 10px; background: #f0f9ff; border-radius: 6px; font-size: 12px; color: #666;">
                💡 架构图将在弹窗完全加载后自动渲染 | 支持缩放和拖拽操作
              </div>
            </div>

            <!-- 架构层级说明 -->
            <div class="architecture-layers" style="display: flex; flex-direction: column; gap: 15px;">
              <div class="layer" style="background: linear-gradient(90deg, #409EFF, #67C23A); color: white; padding: 20px; border-radius: 10px; position: relative;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <h5 style="margin: 0 0 8px 0; font-size: 18px;">前端展示层 (Vue.js + Element Plus)</h5>
                    <p style="margin: 0; opacity: 0.9; font-size: 14px;">用户界面、交互体验、数据可视化</p>
                  </div>
                  <div style="background: rgba(255,255,255,0.2); padding: 8px 12px; border-radius: 6px; font-size: 12px;">
                    Vue 3.x
                  </div>
                </div>
              </div>

              <div class="layer" style="background: linear-gradient(90deg, #E6A23C, #F56C6C); color: white; padding: 20px; border-radius: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <h5 style="margin: 0 0 8px 0; font-size: 18px;">API网关层 (FastAPI)</h5>
                    <p style="margin: 0; opacity: 0.9; font-size: 14px;">请求路由、身份认证、限流控制</p>
                  </div>
                  <div style="background: rgba(255,255,255,0.2); padding: 8px 12px; border-radius: 6px; font-size: 12px;">
                    FastAPI
                  </div>
                </div>
              </div>

              <div class="layer" style="background: linear-gradient(90deg, #9C27B0, #673AB7); color: #ffffff; padding: 20px; border-radius: 10px; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <h5 style="margin: 0 0 8px 0; font-size: 18px; color: #ffffff; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);">AI服务层 (iFlytek Spark LLM)</h5>
                    <p style="margin: 0; opacity: 0.95; font-size: 14px; color: #ffffff; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);">多模态分析、智能评估、自然语言处理</p>
                  </div>
                  <div style="background: rgba(255,255,255,0.25); padding: 8px 12px; border-radius: 6px; font-size: 12px; color: #ffffff; font-weight: 500; text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);">
                    Spark V3.5
                  </div>
                </div>
              </div>

              <div class="layer" style="background: linear-gradient(90deg, #FF5722, #795548); color: white; padding: 20px; border-radius: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <h5 style="margin: 0 0 8px 0; font-size: 18px;">数据处理层</h5>
                    <p style="margin: 0; opacity: 0.9; font-size: 14px;">数据清洗、特征提取、实时处理</p>
                  </div>
                  <div style="background: rgba(255,255,255,0.2); padding: 8px 12px; border-radius: 6px; font-size: 12px;">
                    ${scenario.technologies.slice(0, 2).join(' + ')}
                  </div>
                </div>
              </div>

              <div class="layer" style="background: linear-gradient(90deg, #607D8B, #455A64); color: white; padding: 20px; border-radius: 10px;">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                  <div>
                    <h5 style="margin: 0 0 8px 0; font-size: 18px;">数据存储层</h5>
                    <p style="margin: 0; opacity: 0.9; font-size: 14px;">关系数据库、缓存系统、文件存储</p>
                  </div>
                  <div style="background: rgba(255,255,255,0.2); padding: 8px 12px; border-radius: 6px; font-size: 12px;">
                    MySQL + Redis
                  </div>
                </div>
              </div>
            </div>

            <!-- 架构连接线 -->
            <div style="text-align: center; margin-top: 15px; color: #666; font-size: 12px;">
              ↕️ 数据流向：用户请求 → API网关 → AI分析 → 数据处理 → 结果返回
            </div>
          </div>
        </div>

        <!-- iFlytek Spark LLM集成架构 -->
        <div class="spark-integration-architecture">
          <h4 style="color: #E6A23C; margin-bottom: 20px; font-size: 20px;">
            <i class="el-icon-connection" style="margin-right: 8px;"></i>
            iFlytek Spark LLM集成架构
          </h4>
          <div style="background: #fff7e6; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
            <!-- iFlytek Spark集成流程图展示区域 -->
            <div class="spark-mermaid-diagram" style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
              <div id="spark-integration-mermaid-${scenario.id}" style="min-height: 350px; display: flex; align-items: center; justify-content: center;">
                <div style="text-align: center; color: #666;">
                  <i class="el-icon-loading" style="font-size: 48px; margin-bottom: 15px; color: #E6A23C;"></i>
                  <p style="margin: 0; font-size: 16px;">正在加载iFlytek Spark集成流程图...</p>
                  <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.8;">多模态数据处理流程可视化</p>
                </div>
              </div>
              <div style="margin-top: 15px; padding: 10px; background: #f0f9ff; border-radius: 6px; font-size: 12px; color: #666;">
                🔗 iFlytek Spark LLM深度集成流程图将在弹窗加载后自动渲染
              </div>
            </div>

            <!-- API集成详细步骤 -->
            <div class="integration-steps" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px;">
              <div class="step" style="background: white; padding: 20px; border-radius: 10px; border-left: 5px solid #409EFF; text-align: center;">
                <div style="background: #409EFF; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-weight: bold;">1</div>
                <h5 style="margin: 0 0 10px 0; color: #409EFF;">身份认证</h5>
                <p style="margin: 0; font-size: 14px; color: #666;">API密钥验证<br/>权限检查</p>
              </div>

              <div class="step" style="background: white; padding: 20px; border-radius: 10px; border-left: 5px solid #67C23A; text-align: center;">
                <div style="background: #67C23A; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-weight: bold;">2</div>
                <h5 style="margin: 0 0 10px 0; color: #67C23A;">数据预处理</h5>
                <p style="margin: 0; font-size: 14px; color: #666;">格式转换<br/>特征提取</p>
              </div>

              <div class="step" style="background: white; padding: 20px; border-radius: 10px; border-left: 5px solid #E6A23C; text-align: center;">
                <div style="background: #E6A23C; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-weight: bold;">3</div>
                <h5 style="margin: 0 0 10px 0; color: #E6A23C;">AI分析调用</h5>
                <p style="margin: 0; font-size: 14px; color: #666;">Spark LLM<br/>智能分析</p>
              </div>

              <div class="step" style="background: white; padding: 20px; border-radius: 10px; border-left: 5px solid #F56C6C; text-align: center;">
                <div style="background: #F56C6C; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 15px; font-weight: bold;">4</div>
                <h5 style="margin: 0 0 10px 0; color: #F56C6C;">结果处理</h5>
                <p style="margin: 0; font-size: 14px; color: #666;">数据解析<br/>报告生成</p>
              </div>
            </div>

            <!-- iFlytek Spark技术特性 -->
            <div class="spark-features" style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
              <h5 style="margin: 0 0 15px 0; color: #7b1fa2; font-size: 16px; font-weight: 600;">🌟 iFlytek Spark LLM核心特性</h5>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 15px;">
                <div style="padding: 15px; background: linear-gradient(135deg, #f3e5f5 0%, #faf2ff 100%); border-radius: 8px; border-left: 4px solid #9C27B0; box-shadow: 0 2px 4px rgba(156, 39, 176, 0.1);">
                  <strong style="color: #7b1fa2; font-weight: 600;">多模态理解</strong>
                  <p style="margin: 5px 0 0 0; color: #4a4a4a; font-size: 14px; line-height: 1.4;">支持文本、语音、图像的综合理解和分析</p>
                </div>
                <div style="padding: 15px; background: #e8f5e8; border-radius: 8px; border-left: 4px solid #67C23A;">
                  <strong style="color: #67C23A;">实时响应</strong>
                  <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">毫秒级响应速度，支持实时交互和分析</p>
                </div>
                <div style="padding: 15px; background: #fff7e6; border-radius: 8px; border-left: 4px solid #E6A23C;">
                  <strong style="color: #E6A23C;">智能评估</strong>
                  <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">基于深度学习的智能评估和打分算法</p>
                </div>
                <div style="padding: 15px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #409EFF;">
                  <strong style="color: #409EFF;">中文优化</strong>
                  <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">专门针对中文语境优化的AI模型</p>
                </div>
              </div>
            </div>

            <div style="margin-top: 20px; padding: 15px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #409EFF;">
              <strong style="color: #409EFF;">集成优势：</strong>
              <span style="color: #666;">实时响应 < 500ms | 支持并发 1000+ | 准确率 > 95% | 中文深度优化 | 多模态融合分析</span>
            </div>
          </div>
        </div>

        <!-- 核心技术栈 -->
        <div class="tech-stack">
          <h4 style="color: #67C23A; margin-bottom: 20px; font-size: 20px;">
            <i class="el-icon-cpu" style="margin-right: 8px;"></i>
            核心技术栈组件
          </h4>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 25px;">
            ${scenario.technologies.map((tech, index) => {
              const colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C', '#9C27B0', '#FF5722'];
              const color = colors[index % colors.length];
              return `
                <div style="background: linear-gradient(135deg, ${color}, ${color}dd); color: white; padding: 20px; border-radius: 12px; text-align: center; position: relative; overflow: hidden;">
                  <div style="position: absolute; top: -20px; right: -20px; width: 60px; height: 60px; background: rgba(255,255,255,0.1); border-radius: 50%;"></div>
                  <div style="font-size: 20px; font-weight: bold; margin-bottom: 8px;">${tech}</div>
                  <div style="font-size: 12px; opacity: 0.8; margin-bottom: 10px;">核心组件 ${index + 1}</div>
                  <div style="font-size: 14px; opacity: 0.9;">
                    ${getTechDescription(tech, scenario.category)}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- 多模态数据处理流程 -->
        <div class="multimodal-processing">
          <h4 style="color: #7b1fa2; margin-bottom: 20px; font-size: 20px; font-weight: 600;">
            <i class="el-icon-video-camera" style="margin-right: 8px; color: #7b1fa2;"></i>
            多模态数据处理流程
          </h4>
          <div style="background: linear-gradient(135deg, #f3e5f5 0%, #faf2ff 100%); padding: 25px; border-radius: 12px; margin-bottom: 25px; border: 1px solid #e1bee7;">
            <div class="processing-pipeline" style="display: flex; flex-direction: column; gap: 20px;">
              <div class="pipeline-step" style="display: flex; align-items: center; gap: 20px;">
                <div style="background: linear-gradient(135deg, #9C27B0, #7b1fa2); color: #ffffff; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; box-shadow: 0 4px 12px rgba(156, 39, 176, 0.3); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);">
                  🎤
                </div>
                <div style="flex: 1; background: white; padding: 20px; border-radius: 10px; border-left: 5px solid #9C27B0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                  <h5 style="margin: 0 0 8px 0; color: #7b1fa2; font-size: 16px; font-weight: 600;">语音数据处理</h5>
                  <p style="margin: 0; color: #4a4a4a; font-size: 14px; line-height: 1.5;">音频采集 → 降噪处理 → 语音识别 → 情感分析 → 语义理解</p>
                  <div style="margin-top: 10px; font-size: 12px; color: #737373;">技术栈: WebRTC, 语音识别API, 情感分析模型</div>
                </div>
              </div>

              <div class="pipeline-step" style="display: flex; align-items: center; gap: 20px;">
                <div style="background: linear-gradient(135deg, #673AB7, #512da8); color: #ffffff; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0; box-shadow: 0 4px 12px rgba(103, 58, 183, 0.3); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);">
                  📹
                </div>
                <div style="flex: 1; background: white; padding: 20px; border-radius: 10px; border-left: 5px solid #673AB7; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                  <h5 style="margin: 0 0 8px 0; color: #512da8; font-size: 16px; font-weight: 600;">视频数据处理</h5>
                  <p style="margin: 0; color: #4a4a4a; font-size: 14px; line-height: 1.5;">视频采集 → 帧提取 → 人脸检测 → 表情识别 → 行为分析</p>
                  <div style="margin-top: 10px; font-size: 12px; color: #737373;">技术栈: OpenCV, 人脸识别, 表情分析, 姿态估计</div>
                </div>
              </div>

              <div class="pipeline-step" style="display: flex; align-items: center; gap: 20px;">
                <div style="background: #3F51B5; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0;">
                  📝
                </div>
                <div style="flex: 1; background: white; padding: 20px; border-radius: 10px; border-left: 5px solid #3F51B5;">
                  <h5 style="margin: 0 0 8px 0; color: #3F51B5; font-size: 16px;">文本数据处理</h5>
                  <p style="margin: 0; color: #666; font-size: 14px;">文本输入 → 分词处理 → 语法分析 → 关键词提取 → 语义分析</p>
                  <div style="margin-top: 10px; font-size: 12px; color: #999;">技术栈: NLP, 分词器, 语法分析器, 关键词提取</div>
                </div>
              </div>

              <div class="pipeline-step" style="display: flex; align-items: center; gap: 20px;">
                <div style="background: #FF5722; color: white; width: 60px; height: 60px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 24px; flex-shrink: 0;">
                  🔄
                </div>
                <div style="flex: 1; background: white; padding: 20px; border-radius: 10px; border-left: 5px solid #FF5722;">
                  <h5 style="margin: 0 0 8px 0; color: #FF5722; font-size: 16px;">数据融合分析</h5>
                  <p style="margin: 0; color: #666; font-size: 14px;">多模态特征融合 → iFlytek Spark分析 → 综合评估 → 结果输出</p>
                  <div style="margin-top: 10px; font-size: 12px; color: #999;">技术栈: 特征融合算法, iFlytek Spark LLM, 评估模型</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 六维能力评估算法架构 -->
        <div class="assessment-algorithm">
          <h4 style="color: #FF5722; margin-bottom: 20px; font-size: 20px;">
            <i class="el-icon-data-analysis" style="margin-right: 8px;"></i>
            六维能力评估算法架构
          </h4>
          <div style="background: #fff3e0; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
            <!-- 六维能力评估算法流程图展示区域 -->
            <div class="assessment-mermaid-diagram" style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; text-align: center;">
              <div id="assessment-algorithm-mermaid-${scenario.id}" style="min-height: 400px; display: flex; align-items: center; justify-content: center;">
                <div style="text-align: center; color: #666;">
                  <i class="el-icon-loading" style="font-size: 48px; margin-bottom: 15px; color: #FF5722;"></i>
                  <p style="margin: 0; font-size: 16px;">正在加载六维能力评估算法流程图...</p>
                  <p style="margin: 10px 0 0 0; font-size: 14px; opacity: 0.8;">多模态数据融合分析可视化</p>
                </div>
              </div>
              <div style="margin-top: 15px; padding: 10px; background: #f0f9ff; border-radius: 6px; font-size: 12px; color: #666;">
                📊 六维能力评估算法流程图将在弹窗加载后自动渲染
              </div>
            </div>

            <!-- 六维评估详细说明 -->
            <div class="assessment-dimensions" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 20px;">
              <div class="dimension" style="background: white; padding: 20px; border-radius: 10px; border-left: 5px solid #409EFF;">
                <h5 style="margin: 0 0 10px 0; color: #409EFF; font-size: 16px;">🧠 技术能力</h5>
                <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">算法理解、编程能力、技术深度</p>
                <div style="font-size: 12px; color: #999;">权重: 25% | 评估指标: 代码质量、算法复杂度、技术广度</div>
              </div>

              <div class="dimension" style="background: white; padding: 20px; border-radius: 10px; border-left: 5px solid #67C23A;">
                <h5 style="margin: 0 0 10px 0; color: #67C23A; font-size: 16px;">💬 沟通表达</h5>
                <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">语言表达、思路清晰、交流效果</p>
                <div style="font-size: 12px; color: #999;">权重: 20% | 评估指标: 语音清晰度、表达逻辑、互动质量</div>
              </div>

              <div class="dimension" style="background: white; padding: 20px; border-radius: 10px; border-left: 5px solid #E6A23C;">
                <h5 style="margin: 0 0 10px 0; color: #E6A23C; font-size: 16px;">🔍 逻辑思维</h5>
                <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">分析能力、推理逻辑、思维结构</p>
                <div style="font-size: 12px; color: #999;">权重: 20% | 评估指标: 问题分析、逻辑推理、结构化思维</div>
              </div>

              <div class="dimension" style="background: white; padding: 20px; border-radius: 10px; border-left: 5px solid #F56C6C;">
                <h5 style="margin: 0 0 10px 0; color: #F56C6C; font-size: 16px;">🛠️ 问题解决</h5>
                <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">解决方案、创新思维、实践能力</p>
                <div style="font-size: 12px; color: #999;">权重: 15% | 评估指标: 方案设计、创新程度、可行性分析</div>
              </div>

              <div class="dimension" style="background: white; padding: 20px; border-radius: 10px; border-left: 5px solid #9C27B0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                <h5 style="margin: 0 0 10px 0; color: #7b1fa2; font-size: 16px; font-weight: 600;">📚 学习适应</h5>
                <p style="margin: 0 0 10px 0; color: #4a4a4a; font-size: 14px; line-height: 1.4;">学习能力、适应性、成长潜力</p>
                <div style="font-size: 12px; color: #737373;">权重: 10% | 评估指标: 学习速度、知识更新、技能拓展</div>
              </div>

              <div class="dimension" style="background: white; padding: 20px; border-radius: 10px; border-left: 5px solid #607D8B;">
                <h5 style="margin: 0 0 10px 0; color: #607D8B; font-size: 16px;">🤝 团队协作</h5>
                <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">协作意识、沟通配合、领导力</p>
                <div style="font-size: 12px; color: #999;">权重: 10% | 评估指标: 团队意识、协作能力、领导潜质</div>
              </div>
            </div>

            <!-- 算法计算流程 -->
            <div class="algorithm-process" style="background: white; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
              <h5 style="margin: 0 0 15px 0; color: #FF5722; font-size: 16px;">⚙️ 算法计算流程</h5>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px;">
                <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                  <div style="background: #409EFF; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; font-size: 14px; font-weight: bold;">1</div>
                  <strong style="color: #409EFF; font-size: 14px;">数据采集</strong>
                  <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">多模态输入数据收集</p>
                </div>
                <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                  <div style="background: #67C23A; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; font-size: 14px; font-weight: bold;">2</div>
                  <strong style="color: #67C23A; font-size: 14px;">特征提取</strong>
                  <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">关键特征识别和提取</p>
                </div>
                <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                  <div style="background: #E6A23C; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; font-size: 14px; font-weight: bold;">3</div>
                  <strong style="color: #E6A23C; font-size: 14px;">AI分析</strong>
                  <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">iFlytek Spark智能分析</p>
                </div>
                <div style="text-align: center; padding: 15px; background: #f8f9fa; border-radius: 8px;">
                  <div style="background: #F56C6C; color: white; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 10px; font-size: 14px; font-weight: bold;">4</div>
                  <strong style="color: #F56C6C; font-size: 14px;">综合评分</strong>
                  <p style="margin: 5px 0 0 0; color: #666; font-size: 12px;">六维权重计算评分</p>
                </div>
              </div>
            </div>

            <div style="margin-top: 20px; padding: 15px; background: #f0f9ff; border-radius: 8px; border-left: 4px solid #FF5722;">
              <strong style="color: #FF5722;">算法优势：</strong>
              <span style="color: #666;">多维度综合评估 | 权重动态调整 | 实时计算分析 | 个性化建议生成 | iFlytek Spark深度集成</span>
            </div>
          </div>
        </div>

        <!-- 实时分析处理架构 -->
        <div class="realtime-analysis">
          <h4 style="color: #607D8B; margin-bottom: 20px; font-size: 20px;">
            <i class="el-icon-timer" style="margin-right: 8px;"></i>
            实时分析处理架构
          </h4>
          <div style="background: #f5f5f5; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
            <div class="realtime-components" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px;">
              <div class="component" style="background: white; padding: 20px; border-radius: 10px; border-top: 4px solid #607D8B;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                  <div style="background: #607D8B; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                    ⚡
                  </div>
                  <h5 style="margin: 0; color: #607D8B; font-size: 16px;">数据采集层</h5>
                </div>
                <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">实时采集用户音视频和文本输入</p>
                <div style="font-size: 12px; color: #999;">
                  • WebRTC实时通信<br/>
                  • 音视频流处理<br/>
                  • 数据格式标准化
                </div>
              </div>

              <div class="component" style="background: white; padding: 20px; border-radius: 10px; border-top: 4px solid #795548;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                  <div style="background: #795548; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                    🔄
                  </div>
                  <h5 style="margin: 0; color: #795548; font-size: 16px;">流处理引擎</h5>
                </div>
                <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">实时数据流处理和特征提取</p>
                <div style="font-size: 12px; color: #999;">
                  • 流式数据处理<br/>
                  • 特征实时提取<br/>
                  • 数据质量监控
                </div>
              </div>

              <div class="component" style="background: white; padding: 20px; border-radius: 10px; border-top: 4px solid #9C27B0; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                  <div style="background: linear-gradient(135deg, #9C27B0, #7b1fa2); color: #ffffff; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px; box-shadow: 0 2px 8px rgba(156, 39, 176, 0.3); text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);">
                    🧠
                  </div>
                  <h5 style="margin: 0; color: #7b1fa2; font-size: 16px; font-weight: 600;">AI分析引擎</h5>
                </div>
                <p style="margin: 0 0 10px 0; color: #4a4a4a; font-size: 14px; line-height: 1.4;">iFlytek Spark LLM智能分析</p>
                <div style="font-size: 12px; color: #737373; line-height: 1.3;">
                  • 多模态理解<br/>
                  • 智能评估算法<br/>
                  • 实时推理计算
                </div>
              </div>

              <div class="component" style="background: white; padding: 20px; border-radius: 10px; border-top: 4px solid #FF5722;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 15px;">
                  <div style="background: #FF5722; color: white; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 18px;">
                    📊
                  </div>
                  <h5 style="margin: 0; color: #FF5722; font-size: 16px;">结果输出层</h5>
                </div>
                <p style="margin: 0 0 10px 0; color: #666; font-size: 14px;">实时反馈和报告生成</p>
                <div style="font-size: 12px; color: #999;">
                  • 实时评分反馈<br/>
                  • 可视化报告<br/>
                  • 建议推荐生成
                </div>
              </div>
            </div>

            <div style="margin-top: 25px; padding: 20px; background: linear-gradient(90deg, #607D8B, #795548); color: white; border-radius: 10px;">
              <h5 style="margin: 0 0 10px 0; font-size: 16px;">⚡ 性能指标</h5>
              <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px; font-size: 14px;">
                <div>响应延迟: < 500ms</div>
                <div>处理吞吐: 1000+ QPS</div>
                <div>准确率: > 95%</div>
                <div>可用性: 99.9%</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 性能监控与优化 -->
        <div class="performance-monitoring">
          <h4 style="color: #4CAF50; margin-bottom: 20px; font-size: 20px;">
            <i class="el-icon-monitor" style="margin-right: 8px;"></i>
            性能监控与优化
          </h4>
          <div style="background: #f1f8e9; padding: 25px; border-radius: 12px; margin-bottom: 25px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <h5 style="margin: 0 0 15px 0; color: #4CAF50; font-size: 16px;">系统性能指标</h5>
                <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #666;">响应时间</span>
                    <strong style="color: #4CAF50;">< 500ms</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #666;">并发处理</span>
                    <strong style="color: #4CAF50;">1000+ 用户</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #666;">系统可用性</span>
                    <strong style="color: #4CAF50;">99.9%</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: #666;">数据准确率</span>
                    <strong style="color: #4CAF50;">> 95%</strong>
                  </div>
                </div>
              </div>

              <div>
                <h5 style="margin: 0 0 15px 0; color: #4CAF50; font-size: 16px;">业务效果指标</h5>
                <div style="background: white; padding: 15px; border-radius: 8px; margin-bottom: 15px;">
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #666;">评估效率</span>
                    <strong style="color: #4CAF50;">${scenario.businessValue}</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #666;">用户满意度</span>
                    <strong style="color: #4CAF50;">95%+</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                    <span style="color: #666;">成本节约</span>
                    <strong style="color: #4CAF50;">40%</strong>
                  </div>
                  <div style="display: flex; justify-content: space-between;">
                    <span style="color: #666;">面试效率</span>
                    <strong style="color: #4CAF50;">提升3倍</strong>
                  </div>
                </div>
              </div>
            </div>

            <div style="margin-top: 20px; padding: 15px; background: #e8f5e8; border-radius: 8px; border-left: 4px solid #4CAF50;">
              <strong style="color: #4CAF50;">技术优势：</strong>
              <span style="color: #666;">iFlytek Spark LLM深度集成 | 多模态数据融合 | 实时智能分析 | 个性化评估报告</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  `
}

// 获取技术描述的辅助函数
const getTechDescription = (tech, category) => {
  const techDescriptions = {
    // AI领域技术描述
    '协同过滤': '基于用户行为和物品特征的推荐算法',
    '深度学习': '多层神经网络模型，支持复杂模式识别',
    'TensorFlow': 'Google开源的机器学习框架',
    'PyTorch': 'Facebook开源的深度学习框架',
    'Redis': '高性能内存数据库，支持缓存和实时计算',
    'OpenCV': '开源计算机视觉库，支持图像处理',
    'YOLO': '实时目标检测算法，速度快精度高',
    'ResNet': '残差神经网络，解决深度网络退化问题',
    'BERT': '双向编码器表示，NLP预训练模型',
    'GPT': '生成式预训练变换器，文本生成模型',

    // 大数据技术描述
    'Kafka': 'Apache分布式流处理平台',
    'Flink': 'Apache实时流处理引擎',
    'Spark': 'Apache大数据处理引擎',
    'Hadoop': 'Apache分布式存储和计算框架',
    'ClickHouse': '列式数据库，支持实时分析',
    'Elasticsearch': '分布式搜索和分析引擎',
    'HBase': 'Apache分布式NoSQL数据库',
    'Storm': 'Apache实时计算系统',
    'Hive': 'Apache数据仓库软件',
    'Zookeeper': 'Apache分布式协调服务',

    // IoT技术描述
    '工业传感器': '采集温度、压力、振动等物理量',
    'Modbus': '工业通信协议，设备间数据交换',
    '边缘计算': '在数据源附近进行计算处理',
    '时序数据库': '专门存储时间序列数据',
    'MQTT': '轻量级消息传输协议',
    'LoRaWAN': '低功耗广域网通信技术',
    'Zigbee': '低功耗无线通信协议',
    'OPC UA': '工业自动化通信标准',
    'CoAP': '受限应用协议，IoT设备通信',
    'NB-IoT': '窄带物联网通信技术'
  }

  return techDescriptions[tech] || `${category}领域核心技术组件`
}

// 创建面试要点内容的辅助函数
const createInterviewPointsContent = (scenario) => {
  return `
    <div class="interview-points-wrapper">
      <div class="points-overview">
        <div style="background: linear-gradient(45deg, #f093fb 0%, #f5576c 100%); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px; text-align: center;">
          <h3 style="margin: 0 0 10px 0; font-size: 24px;">🎯 ${scenario.title}</h3>
          <p style="margin: 0; font-size: 16px; opacity: 0.9;">面试重点考察内容</p>
        </div>

        <div class="key-points">
          <h4 style="color: #409EFF; margin-bottom: 15px;">🔍 核心考察点</h4>
          <div style="display: grid; gap: 15px; margin-bottom: 25px;">
            ${scenario.interviewPoints.map((point, index) => `
              <div style="background: #f0f9ff; padding: 18px; border-radius: 10px; border-left: 5px solid #409EFF;">
                <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
                  <span style="background: #409EFF; color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: bold;">
                    ${index + 1}
                  </span>
                  <strong style="color: #409EFF; font-size: 16px;">${point}</strong>
                </div>
                <p style="margin: 0; color: #666; line-height: 1.6; padding-left: 34px;">
                  ${getInterviewPointDescription(point, scenario)}
                </p>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="common-questions">
          <h4 style="color: #E6A23C; margin-bottom: 15px;">❓ 常见面试问题</h4>
          <div style="background: #fff7e6; padding: 20px; border-radius: 10px; margin-bottom: 20px;">
            <div style="display: grid; gap: 12px;">
              ${getCommonQuestions(scenario).map(question => `
                <div style="padding: 12px; background: white; border-radius: 8px; border-left: 3px solid #E6A23C;">
                  <strong>Q:</strong> ${question}
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <div class="preparation-tips">
          <h4 style="color: #67C23A; margin-bottom: 15px;">💡 准备建议</h4>
          <div style="background: #f0fff0; padding: 20px; border-radius: 10px;">
            <ul style="margin: 0; padding-left: 20px; line-height: 1.8;">
              <li><strong>理论基础:</strong> 深入理解${scenario.technologies.slice(0, 2).join('、')}等核心技术原理</li>
              <li><strong>实践经验:</strong> 准备1-2个相关项目的详细案例和技术细节</li>
              <li><strong>问题解决:</strong> 思考如何应对${scenario.technicalChallenges.slice(0, 2).join('、')}等挑战</li>
              <li><strong>业务理解:</strong> 了解技术方案对业务的价值和影响</li>
              <li><strong>发展趋势:</strong> 关注${scenario.category}领域的最新技术发展</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  `
}

// 获取面试要点描述的辅助函数
const getInterviewPointDescription = (point, scenario) => {
  const descriptions = {
    '算法选择': '考察候选人对不同算法的理解和在具体场景下的选择能力',
    '系统架构': '评估系统设计思维和大规模系统的架构能力',
    '性能优化': '了解性能瓶颈识别和优化策略的实践经验',
    '传感器选型': '考察对不同传感器特性和应用场景的理解',
    '通信协议': '评估对各种通信协议优缺点和适用场景的掌握',
    '数据处理': '了解数据采集、清洗、分析的完整流程',
    '流式架构': '考察实时数据处理系统的设计和实现能力',
    '窗口计算': '评估对时间窗口、滑动窗口等概念的理解',
    '状态管理': '了解分布式系统中状态一致性的处理方案',
    '容错机制': '考察系统容错设计和故障恢复策略'
  }
  return descriptions[point] || '考察相关技术的深度理解和实践应用能力'
}

// 获取常见面试问题的辅助函数
const getCommonQuestions = (scenario) => {
  const questionSets = {
    '机器学习应用': [
      '如何解决推荐系统中的冷启动问题？',
      '如何评估推荐算法的效果？',
      '如何处理推荐系统中的数据稀疏性？'
    ],
    '计算机视觉': [
      '如何提高目标检测的精度和召回率？',
      '如何处理光照变化对检测效果的影响？',
      '如何优化模型以满足实时性要求？'
    ],
    '自然语言处理': [
      '如何提高意图识别的准确率？',
      '如何处理多轮对话的上下文理解？',
      '如何评估对话系统的效果？'
    ],
    '实时计算': [
      '如何保证流式计算的数据一致性？',
      '如何处理数据倾斜问题？',
      '如何设计容错的流式处理系统？'
    ],
    '数据仓库': [
      '如何设计高效的数据模型？',
      '如何优化ETL的性能？',
      '如何保证数据质量？'
    ],
    '工业物联网': [
      '如何选择合适的工业传感器？',
      '如何保证工业环境下的通信可靠性？',
      '如何实现设备的预测性维护？'
    ]
  }
  return questionSets[scenario.category] || [
    '请介绍一个相关的项目经验',
    '如何解决技术实现中的主要挑战？',
    '如何评估方案的效果和价值？'
  ]
}

// 渲染Mermaid图表的函数
const renderMermaidDiagram = async (elementId, diagramDefinition) => {
  if (!mermaid) {
    await initMermaid()
  }

  if (mermaid) {
    try {
      await nextTick()
      const element = document.getElementById(elementId)
      if (element) {
        const { svg } = await mermaid.render(`${elementId}-svg`, diagramDefinition)
        element.innerHTML = svg

        // 添加交互功能
        const svgElement = element.querySelector('svg')
        if (svgElement) {
          svgElement.style.cursor = 'grab'
          svgElement.style.maxWidth = '100%'
          svgElement.style.height = 'auto'

          // 添加点击事件
          svgElement.addEventListener('click', () => {
            ElMessage.success('架构图交互功能已激活')
          })
        }
      }
    } catch (error) {
      console.error('Mermaid rendering error:', error)
    }
  }
}

// 创建iFlytek Spark集成流程图
const createSparkIntegrationDiagram = (scenario) => {
  return `
    graph LR
      A[用户输入] --> B[数据预处理]
      B --> C[格式转换]
      C --> D[iFlytek Spark API]
      D --> E[多模态分析]
      E --> F[智能评估]
      F --> G[结果生成]
      G --> H[报告输出]

      B1[音频处理] --> B
      B2[视频处理] --> B
      B3[文本处理] --> B

      D1[身份认证] --> D
      D2[API调用] --> D
      D3[参数配置] --> D

      E1[语音分析] --> E
      E2[视觉分析] --> E
      E3[文本分析] --> E

      F1[技术能力] --> F
      F2[沟通表达] --> F
      F3[逻辑思维] --> F
      F4[问题解决] --> F
      F5[学习适应] --> F
      F6[团队协作] --> F

      classDef input fill:#409EFF,stroke:#333,stroke-width:2px,color:#fff
      classDef process fill:#67C23A,stroke:#333,stroke-width:2px,color:#fff
      classDef ai fill:#9C27B0,stroke:#333,stroke-width:2px,color:#fff
      classDef output fill:#E6A23C,stroke:#333,stroke-width:2px,color:#fff

      class A,B1,B2,B3 input
      class B,C,D1,D2,D3 process
      class D,E,E1,E2,E3,F,F1,F2,F3,F4,F5,F6 ai
      class G,H output
  `
}

// 创建六维评估算法流程图
const createAssessmentAlgorithmDiagram = () => {
  return `
    graph TD
      A[多模态数据输入] --> B[特征提取]
      B --> C[数据融合]
      C --> D[iFlytek Spark分析]
      D --> E[六维评估计算]

      E --> F1[技术能力评估<br/>25%权重]
      E --> F2[沟通表达评估<br/>20%权重]
      E --> F3[逻辑思维评估<br/>20%权重]
      E --> F4[问题解决评估<br/>15%权重]
      E --> F5[学习适应评估<br/>10%权重]
      E --> F6[团队协作评估<br/>10%权重]

      F1 --> G[综合评分计算]
      F2 --> G
      F3 --> G
      F4 --> G
      F5 --> G
      F6 --> G

      G --> H[个性化建议生成]
      H --> I[评估报告输出]

      classDef input fill:#409EFF,stroke:#333,stroke-width:2px,color:#fff
      classDef process fill:#67C23A,stroke:#333,stroke-width:2px,color:#fff
      classDef assessment fill:#E6A23C,stroke:#333,stroke-width:2px,color:#fff
      classDef output fill:#F56C6C,stroke:#333,stroke-width:2px,color:#fff

      class A input
      class B,C,D process
      class E,F1,F2,F3,F4,F5,F6,G assessment
      class H,I output
  `
}

// 组件挂载时初始化
onMounted(async () => {
  await initMermaid()

  // 延迟渲染图表，确保DOM已完全加载
  setTimeout(() => {
    // 这里可以根据需要渲染特定的图表
    // renderMermaidDiagram('architecture-mermaid-1', createSparkIntegrationDiagram())
  }, 1000)
})
</script>

<style scoped>
.domain-demos {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.domain-header {
  text-align: center;
  margin-bottom: 3rem;
}

.domain-header h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}

.domain-header p {
  font-size: 1.2rem;
  color: #7f8c8d;
}

.domain-selector {
  margin-bottom: 3rem;
}

.domain-tabs {
  /* 使用增强网格系统 */
}

.domain-tab {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.domain-tab::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--theme-gradient, linear-gradient(135deg, #4c51bf 0%, #6b21a8 100%));
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 0;
}

.domain-tab:hover::before {
  opacity: 0.1;
}

.domain-tab.active::before {
  opacity: 0.15;
}

.domain-tab > * {
  position: relative;
  z-index: 1;
}

.domain-tab:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
}

.domain-tab.active {
  border-color: var(--theme-primary, #409EFF);
  box-shadow: 0 20px 40px var(--theme-shadow, rgba(64, 158, 255, 0.3));
  transform: translateY(-5px);
}

/* AI主题领域卡片 */
.domain-tab.ai-theme {
  --theme-primary: var(--ai-primary);
  --theme-gradient: var(--ai-gradient-primary);
  --theme-shadow: rgba(0, 102, 204, 0.3);
}

.domain-tab.ai-theme:hover {
  box-shadow: 0 20px 40px rgba(0, 102, 204, 0.25);
}

.domain-tab.ai-theme.active {
  border-color: var(--ai-primary);
  box-shadow: 0 20px 40px rgba(0, 102, 204, 0.4);
}

/* 大数据主题领域卡片 */
.domain-tab.bigdata-theme {
  --theme-primary: var(--bigdata-primary);
  --theme-gradient: var(--bigdata-gradient-primary);
  --theme-shadow: rgba(5, 150, 105, 0.3);
}

.domain-tab.bigdata-theme:hover {
  box-shadow: 0 20px 40px rgba(5, 150, 105, 0.25);
}

.domain-tab.bigdata-theme.active {
  border-color: var(--bigdata-primary);
  box-shadow: 0 20px 40px rgba(5, 150, 105, 0.4);
}

/* IoT主题领域卡片 */
.domain-tab.iot-theme {
  --theme-primary: var(--iot-primary);
  --theme-gradient: var(--iot-gradient-primary);
  --theme-shadow: rgba(234, 88, 12, 0.3);
}

.domain-tab.iot-theme:hover {
  box-shadow: 0 20px 40px rgba(234, 88, 12, 0.25);
}

.domain-tab.iot-theme.active {
  border-color: var(--iot-primary);
  box-shadow: 0 20px 40px rgba(234, 88, 12, 0.4);
}

/* 面试评估主题领域卡片 */
.domain-tab.interview-theme {
  --theme-primary: var(--interview-primary);
  --theme-gradient: var(--interview-gradient-primary);
  --theme-shadow: rgba(124, 58, 237, 0.3);
}

.domain-tab.interview-theme:hover {
  box-shadow: 0 20px 40px rgba(124, 58, 237, 0.25);
}

.domain-tab.interview-theme.active {
  border-color: var(--interview-primary);
  box-shadow: 0 20px 40px rgba(124, 58, 237, 0.4);
}

.tab-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  color: white;
  font-size: 2rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.tab-icon::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  transform: scale(0);
  transition: transform 0.3s ease;
}

.domain-tab:hover .tab-icon::before {
  transform: scale(1);
}

.domain-tab:hover .tab-icon {
  transform: scale(1.1);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);
}

.domain-tab.active .tab-icon {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.tab-content h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
  text-align: center;
}

.tab-content p {
  color: #7f8c8d;
  text-align: center;
  margin-bottom: 1rem;
}

.tab-stats {
  display: flex;
  justify-content: center;
  gap: 1rem;
  font-size: 0.9rem;
  color: #95a5a6;
}

.domain-content {
  background: white;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}

.domain-overview {
  margin-bottom: 3rem;
}

.overview-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  gap: 2rem;
}

.domain-info {
  display: flex;
  gap: 2rem;
  flex: 1;
}

.domain-icon-large {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
  flex-shrink: 0;
}

.domain-details h3 {
  font-size: 2rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
}

.domain-details p {
  color: #7f8c8d;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.domain-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 16px;
  align-items: center;
}

.domain-tags .el-tag {
  margin: 0 !important;
  padding: 6px 16px !important;
  line-height: 1.4 !important;
  font-size: 13px !important;
  border-radius: 20px !important;
  font-weight: 500 !important;
  display: inline-flex !important;
  align-items: center !important;
  word-wrap: break-word !important;
}

.domain-actions {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.skills-section,
.positions-section,
.questions-section,
.success-cases {
  margin-bottom: 3rem;
}

.skills-section h4,
.positions-section h4,
.questions-section h4,
.success-cases h4 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.skill-item {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 12px;
  border-left: 4px solid #409EFF;
}

.skill-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.skill-name {
  font-weight: 600;
  color: #2c3e50;
}

.skill-level {
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.level-beginner {
  background: #d4edda;
  color: #155724;
}

.level-intermediate {
  background: #fff3cd;
  color: #856404;
}

.level-advanced {
  background: #f8d7da;
  color: #721c24;
}

.skill-progress {
  margin-bottom: 1rem;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e9ecef;
  border-radius: 4px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.3s ease;
}

.importance {
  font-size: 0.8rem;
  color: #6c757d;
}

.skill-description {
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.4;
  margin: 0;
}

.positions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
}

.position-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 2rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.position-card:hover {
  border-color: #409EFF;
  box-shadow: 0 5px 20px rgba(64, 158, 255, 0.2);
}

.position-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.position-header h5 {
  font-size: 1.2rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
}

.salary-range {
  background: #e6f7ff;
  color: #1890ff;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 500;
}

.position-description {
  color: #7f8c8d;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.position-requirements h6 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.position-requirements ul {
  margin: 0 0 1.5rem 0;
  padding-left: 1.5rem;
}

.position-requirements li {
  color: #6c757d;
  margin-bottom: 0.25rem;
}

.position-stats {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: #6c757d;
}

.questions-container {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 2rem;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.question-item {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.question-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}

.question-number {
  background: #409EFF;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
}

.question-difficulty {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
}

.difficulty-beginner {
  background: #d4edda;
  color: #155724;
}

.difficulty-intermediate {
  background: #fff3cd;
  color: #856404;
}

.difficulty-advanced {
  background: #f8d7da;
  color: #721c24;
}

.question-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.question-content {
  color: #495057;
  line-height: 1.6;
  margin-bottom: 1rem;
}

.question-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #6c757d;
}

.question-actions {
  display: flex;
  gap: 1rem;
}

.cases-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.case-card {
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 12px;
  padding: 2rem;
}

.case-header {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.case-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
}

.case-info h5 {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2c3e50;
  margin: 0 0 0.25rem 0;
}

.case-info p {
  color: #6c757d;
  margin: 0 0 0.5rem 0;
  font-size: 0.9rem;
}

.case-score {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: #f39c12;
  font-size: 0.9rem;
  font-weight: 500;
}

.case-testimonial {
  background: #f8f9fa;
  border-left: 4px solid #409EFF;
  padding: 1rem;
  margin: 0 0 1.5rem 0;
  font-style: italic;
  color: #495057;
}

.case-highlights h6 {
  color: #2c3e50;
  margin-bottom: 0.5rem;
}

.case-highlights ul {
  margin: 0;
  padding-left: 1.5rem;
}

.case-highlights li {
  color: #6c757d;
  margin-bottom: 0.25rem;
}

@media (max-width: 768px) {
  .domain-demos {
    padding: 1rem;
  }
  
  .domain-tabs {
    grid-template-columns: 1fr;
  }
  
  .overview-header {
    flex-direction: column;
  }
  
  .domain-info {
    flex-direction: column;
    text-align: center;
  }
  
  .skills-grid,
  .positions-grid,
  .cases-grid {
    grid-template-columns: 1fr;
  }
  
  .question-actions {
    flex-direction: column;
  }

  .scenarios-grid {
    grid-template-columns: 1fr;
  }

  .scenario-card {
    margin-bottom: 1rem;
  }

  .scenario-actions {
    flex-direction: column;
    gap: 0.5rem;
  }
}

/* 应用场景样式 */
.application-scenarios {
  margin-bottom: 3rem;
}

.application-scenarios h4 {
  font-size: 1.5rem;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.scenarios-description {
  color: #7f8c8d;
  margin-bottom: 2rem;
  line-height: 1.6;
  text-align: center;
}

.scenarios-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
}

.scenario-card {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  border: 1px solid rgba(76, 81, 191, 0.1);
  position: relative;
  overflow: hidden;
}

.scenario-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--iflytek-gradient-primary);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.scenario-card:hover::before {
  transform: scaleX(1);
}

.scenario-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(76, 81, 191, 0.15);
  border-color: rgba(76, 81, 191, 0.3);
}

.scenario-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.scenario-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.scenario-icon::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.scenario-card:hover .scenario-icon::before {
  opacity: 1;
}

.scenario-card:hover .scenario-icon {
  transform: scale(1.05);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2);
}

.scenario-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;
}

.scenario-category {
  background: #f0f9ff;
  color: #409EFF;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
}

.scenario-difficulty {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
}

.difficulty-beginner {
  background: #f0fff0;
  color: #67C23A;
}

.difficulty-intermediate {
  background: #fff7e6;
  color: #E6A23C;
}

.difficulty-advanced {
  background: #fff2f0;
  color: #F56C6C;
}

.scenario-content h5 {
  font-size: 1.3rem;
  font-weight: 600;
  color: #1a202c;
  margin: 0 0 12px 0;
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
  line-height: 1.3;
}

.scenario-content p {
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 16px;
  font-size: 0.95rem;
}

.scenario-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 20px;
}

.scenario-tags .el-tag {
  border-radius: 20px !important;
  font-size: 12px !important;
  font-weight: 500 !important;
  padding: 6px 14px !important;
  border: none !important;
  background: var(--iflytek-blue-100) !important;
  color: var(--iflytek-blue-700) !important;
  transition: all 0.3s ease !important;
  margin: 0 !important;
  line-height: 1.3 !important;
  display: inline-flex !important;
  align-items: center !important;
  word-wrap: break-word !important;
  min-height: 28px !important;
}

.scenario-tags .el-tag:hover {
  background: var(--iflytek-blue-200);
  transform: translateY(-1px);
}

.scenario-stats {
  margin-bottom: 1.5rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.stat-label {
  font-size: 0.9rem;
  color: #6c757d;
  font-weight: 500;
}

.stat-bar {
  flex: 1;
  height: 6px;
  background: #f0f0f0;
  border-radius: 3px;
  margin-left: 1rem;
  overflow: hidden;
}

.stat-fill {
  height: 100%;
  background: linear-gradient(45deg, #409EFF 0%, #67C23A 100%);
  border-radius: 3px;
  transition: width 0.3s ease;
}

.scenario-actions {
  display: flex;
  gap: 12px;
  margin-top: 20px;
}

.scenario-actions .el-button {
  flex: 1;
  border-radius: 8px;
  font-weight: 500;
  padding: 10px 16px;
  transition: all 0.3s ease;
  border: none;
}

.scenario-actions .el-button--primary {
  background: var(--iflytek-gradient-primary);
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
  box-shadow: 0 2px 8px rgba(76, 81, 191, 0.3);
}

.scenario-actions .el-button--primary:hover {
  background: var(--iflytek-gradient-secondary);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(76, 81, 191, 0.4);
}

.scenario-actions .el-button--default {
  background: white;
  color: var(--iflytek-blue-600);
  border: 2px solid var(--iflytek-blue-200);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.scenario-actions .el-button--default:hover {
  background: var(--iflytek-blue-50);
  border-color: var(--iflytek-blue-400);
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

/* 弹窗样式 */
:deep(.scenario-detail-dialog) {
  width: 80%;
  max-width: 800px;
}

:deep(.scenario-demo-dialog) {
  width: 85%;
  max-width: 900px;
}

:deep(.tech-details-dialog) {
  width: 90%;
  max-width: 1000px;
}

:deep(.interview-points-dialog) {
  width: 85%;
  max-width: 900px;
}

:deep(.el-message-box__content) {
  max-height: 70vh;
  overflow-y: auto;
}

/* 技术架构图弹窗样式 - 全面优化 */
:deep(.tech-details-dialog) {
  width: 95vw !important;
  max-width: 1400px !important;
  border-radius: 16px !important;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3) !important;
  backdrop-filter: blur(8px) !important;
  border: 1px solid rgba(76, 81, 191, 0.2) !important;
}

:deep(.tech-details-dialog .el-message-box__header) {
  background: var(--iflytek-gradient-primary) !important;
  color: white !important;
  padding: 24px !important;
  border-radius: 16px 16px 0 0 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
}

:deep(.tech-details-dialog .el-message-box__title) {
  color: white !important;
  font-size: 1.5rem !important;
  font-weight: 600 !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3) !important;
}

:deep(.tech-details-dialog .el-message-box__headerbtn) {
  color: white !important;
  font-size: 20px !important;
  opacity: 0.8 !important;
  transition: all 0.3s ease !important;
}

:deep(.tech-details-dialog .el-message-box__headerbtn:hover) {
  opacity: 1 !important;
  transform: scale(1.1) !important;
}

:deep(.tech-details-dialog .el-message-box__content) {
  max-height: 80vh;
  overflow-y: auto;
  padding: 0;
  background: linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%);
}

:deep(.tech-details-dialog .el-message-box__message) {
  padding: 0;
  margin: 0;
}

:deep(.tech-details-dialog .el-message-box__btns) {
  padding: 20px 24px !important;
  background: white !important;
  border-radius: 0 0 16px 16px !important;
  border-top: 1px solid #e5e7eb !important;
}

:deep(.tech-details-dialog .el-button) {
  border-radius: 8px !important;
  font-weight: 500 !important;
  padding: 12px 24px !important;
  transition: all 0.3s ease !important;
}

:deep(.tech-details-dialog .el-button--primary) {
  background: var(--iflytek-gradient-primary) !important;
  border: none !important;
  color: white !important;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2) !important;
  box-shadow: 0 4px 12px rgba(76, 81, 191, 0.3) !important;
}

:deep(.tech-details-dialog .el-button--primary:hover) {
  background: var(--iflytek-gradient-secondary) !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 20px rgba(76, 81, 191, 0.4) !important;
}

:deep(.tech-details-dialog .el-button--default) {
  background: white !important;
  border: 2px solid var(--iflytek-blue-200) !important;
  color: var(--iflytek-blue-600) !important;
}

:deep(.tech-details-dialog .el-button--default:hover) {
  background: var(--iflytek-blue-50) !important;
  border-color: var(--iflytek-blue-400) !important;
  transform: translateY(-1px) !important;
}

/* Mermaid图表样式优化 - iFlytek品牌风格 */
.mermaid-diagram {
  transition: all 0.3s ease;
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(76, 81, 191, 0.1);
  position: relative;
  overflow: hidden;
}

.mermaid-diagram::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--iflytek-gradient-primary);
}

.mermaid-diagram:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
  border-color: rgba(76, 81, 191, 0.3);
}

.mermaid svg {
  max-width: 100% !important;
  height: auto !important;
  border-radius: 8px;
  background: linear-gradient(135deg, #fafafa 0%, #ffffff 100%);
  filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.1));
}

/* Mermaid图表节点样式优化 */
:deep(.mermaid .node rect) {
  stroke-width: 2px !important;
  rx: 8px !important;
  ry: 8px !important;
}

:deep(.mermaid .node .label) {
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif !important;
  font-weight: 500 !important;
  font-size: 14px !important;
}

:deep(.mermaid .edgePath .path) {
  stroke-width: 2px !important;
  stroke-dasharray: none !important;
}

:deep(.mermaid .edgeLabel) {
  background: white !important;
  border-radius: 4px !important;
  padding: 4px 8px !important;
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif !important;
  font-size: 12px !important;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
}

/* 架构层级样式增强 - 更流畅的动画 */
.architecture-layers .layer {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  transform-origin: left center;
}

.architecture-layers .layer:hover {
  transform: translateX(8px) scale(1.02);
  box-shadow: 0 8px 25px rgba(76, 81, 191, 0.15);
  z-index: 10;
}

.architecture-layers .layer::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
  transition: left 0.6s ease-out;
}

.architecture-layers .layer:hover::before {
  left: 100%;
}

.architecture-layers .layer::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.architecture-layers .layer:hover::after {
  opacity: 1;
}

/* 集成步骤样式增强 - 更丰富的动画 */
.integration-steps .step {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.integration-steps .step::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, rgba(76, 81, 191, 0.05), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.integration-steps .step:hover::before {
  opacity: 1;
}

.integration-steps .step:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow: 0 12px 35px rgba(76, 81, 191, 0.15);
}

.integration-steps .step .step-number {
  transition: all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}

.integration-steps .step:hover .step-number {
  transform: scale(1.15) rotate(5deg);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* 步骤连接线动画 */
.integration-steps .step:not(:last-child)::after {
  content: '→';
  position: absolute;
  right: -15px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--iflytek-blue-400);
  font-size: 1.5rem;
  opacity: 0.6;
  transition: all 0.3s ease;
}

.integration-steps .step:hover::after {
  opacity: 1;
  transform: translateY(-50%) scale(1.2);
  color: var(--iflytek-blue-600);
}

/* 技术栈组件样式增强 */
.tech-stack .tech-card {
  transition: all 0.3s ease;
  cursor: pointer;
}

.tech-stack .tech-card:hover {
  transform: translateY(-3px) scale(1.02);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

/* 多模态处理流程样式 */
.processing-pipeline .pipeline-step {
  transition: all 0.3s ease;
}

.processing-pipeline .pipeline-step:hover {
  transform: translateX(10px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

/* 评估维度样式增强 */
.assessment-dimensions .dimension {
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
}

.assessment-dimensions .dimension:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.assessment-dimensions .dimension::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3));
  transition: width 0.3s ease;
}

.assessment-dimensions .dimension:hover::after {
  width: 100%;
}

/* 实时分析组件样式 */
.realtime-components .component {
  transition: all 0.3s ease;
  cursor: pointer;
}

.realtime-components .component:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

/* 算法流程样式 */
.algorithm-process .process-step {
  transition: all 0.3s ease;
}

.algorithm-process .process-step:hover {
  transform: scale(1.05);
  background: #f0f9ff !important;
}

/* 响应式设计 - 全面优化 */

/* 超小屏幕 (手机竖屏) */
@media (max-width: 480px) {
  :deep(.tech-details-dialog) {
    width: 100vw !important;
    height: 100vh !important;
    margin: 0 !important;
    border-radius: 0 !important;
  }

  :deep(.tech-details-dialog .el-message-box__header) {
    padding: 16px !important;
    border-radius: 0 !important;
  }

  :deep(.tech-details-dialog .el-message-box__title) {
    font-size: 1.2rem !important;
  }

  .scenario-card {
    padding: 16px;
    margin-bottom: 12px;
  }

  .scenario-icon {
    width: 48px;
    height: 48px;
    font-size: 1.3rem;
  }

  .scenario-content h5 {
    font-size: 1.1rem;
  }

  .scenario-actions {
    flex-direction: column;
    gap: 8px;
  }

  .architecture-layers .layer {
    padding: 16px;
    margin-bottom: 12px;
  }

  .integration-steps {
    grid-template-columns: 1fr !important;
    gap: 12px !important;
  }

  .integration-steps .step {
    padding: 16px;
  }

  .mermaid-diagram {
    padding: 12px;
  }
}

/* 小屏幕 (手机横屏/小平板) */
@media (min-width: 481px) and (max-width: 768px) {
  :deep(.tech-details-dialog) {
    width: 95vw !important;
    margin: 20px !important;
    border-radius: 12px !important;
  }

  .scenario-card {
    padding: 20px;
  }

  .scenario-actions {
    gap: 10px;
  }

  .architecture-layers {
    gap: 12px !important;
  }

  .integration-steps {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 15px !important;
  }

  .assessment-dimensions {
    grid-template-columns: 1fr !important;
    gap: 15px !important;
  }

  .realtime-components {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 15px !important;
  }

  .processing-pipeline .pipeline-step {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
}

/* 中等屏幕 (平板) */
@media (min-width: 769px) and (max-width: 1024px) {
  :deep(.tech-details-dialog) {
    width: 90vw !important;
    max-width: 900px !important;
  }

  .integration-steps {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 18px !important;
  }

  .assessment-dimensions {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 18px !important;
  }

  .realtime-components {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 18px !important;
  }
}

/* 大屏幕优化 */
@media (min-width: 1400px) {
  :deep(.tech-details-dialog) {
    max-width: 1600px !important;
  }

  .integration-steps {
    grid-template-columns: repeat(4, 1fr) !important;
  }

  .assessment-dimensions {
    grid-template-columns: repeat(3, 1fr) !important;
  }

  .realtime-components {
    grid-template-columns: repeat(4, 1fr) !important;
  }
}

/* 触摸设备优化 */
@media (hover: none) and (pointer: coarse) {
  .scenario-card:hover {
    transform: none;
  }

  .scenario-card:active {
    transform: scale(0.98);
    transition: transform 0.1s ease;
  }

  .integration-steps .step:hover {
    transform: none;
  }

  .integration-steps .step:active {
    transform: scale(0.98);
  }

  .el-button:hover {
    transform: none;
  }

  .el-button:active {
    transform: scale(0.95);
  }
}

/* 高对比度模式支持 */
@media (prefers-contrast: high) {
  .scenario-card {
    border: 2px solid #000;
  }

  .scenario-content h5 {
    color: #000;
  }

  .scenario-content p {
    color: #333;
  }

  .el-button {
    border: 2px solid #000;
  }
}

/* 减少动画模式 */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }

  .scenario-card:hover {
    transform: none;
  }

  .integration-steps .step:hover {
    transform: none;
  }
}

/* 无障碍设计增强 */
/* 焦点可见性优化 */
.scenario-card:focus,
.el-button:focus,
.integration-steps .step:focus {
  outline: 3px solid var(--iflytek-blue-500);
  outline-offset: 2px;
}

/* 键盘导航优化 */
.scenario-card[tabindex]:focus {
  box-shadow: 0 0 0 3px rgba(76, 81, 191, 0.3);
}

/* 屏幕阅读器优化 */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* 跳转链接样式 */
.skip-links {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 9999;
}

.skip-links a {
  position: absolute;
  left: -9999px;
  top: 0;
  background: var(--iflytek-blue-600);
  color: white;
  padding: 8px 16px;
  text-decoration: none;
  border-radius: 0 0 4px 0;
  font-weight: 500;
  font-size: 14px;
  transition: all 0.3s ease;
}

.skip-links a:focus {
  left: 0;
  outline: 3px solid var(--iflytek-blue-300);
  outline-offset: 2px;
}

/* 高对比度模式增强 */
@media (prefers-contrast: high) {
  .scenario-card {
    border: 2px solid #000;
    background: #fff;
  }

  .scenario-content h5 {
    color: #000;
  }

  .scenario-content p {
    color: #333;
  }

  .el-button {
    border: 2px solid #000;
    background: #fff;
    color: #000;
  }

  .el-button--primary {
    background: #000;
    color: #fff;
  }

  .tech-details-wrapper {
    background: #fff;
    color: #000;
  }
}

/* 大字体支持 */
@media (min-resolution: 1.5dppx) {
  .scenario-content h5 {
    font-size: 1.4rem;
  }

  .scenario-content p {
    font-size: 1rem;
  }

  .el-button {
    font-size: 1rem;
    padding: 12px 20px;
  }
}

/* 触摸设备专用优化 */
@media (hover: none) and (pointer: coarse) {
  /* 增大触摸目标 */
  .scenario-card {
    min-height: 200px;
    padding: 24px;
  }

  .scenario-actions .el-button {
    min-height: 48px;
    padding: 14px 20px;
    font-size: 1rem;
  }

  .integration-steps .step {
    min-height: 120px;
    padding: 20px;
  }

  /* 移除悬停效果 */
  .scenario-card:hover,
  .integration-steps .step:hover,
  .architecture-layers .layer:hover {
    transform: none;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  }

  /* 添加触摸反馈 */
  .scenario-card:active {
    transform: scale(0.98);
    transition: transform 0.1s ease;
  }

  .el-button:active {
    transform: scale(0.95);
    transition: transform 0.1s ease;
  }
}

/* 极小屏幕优化 (小于375px) */
@media (max-width: 374px) {
  :deep(.tech-details-dialog) {
    width: 100vw !important;
    height: 100vh !important;
    margin: 0 !important;
    border-radius: 0 !important;
  }

  .scenario-card {
    padding: 16px;
    margin-bottom: 12px;
  }

  .scenario-icon {
    width: 44px;
    height: 44px;
    font-size: 1.2rem;
  }

  .scenario-content h5 {
    font-size: 1rem;
    line-height: 1.3;
  }

  .scenario-content p {
    font-size: 0.85rem;
  }

  .scenario-actions {
    flex-direction: column;
    gap: 8px;
  }

  .scenario-actions .el-button {
    width: 100%;
    min-height: 44px;
  }

  .architecture-layers .layer {
    padding: 12px;
    margin-bottom: 8px;
  }

  .integration-steps {
    grid-template-columns: 1fr !important;
    gap: 8px !important;
  }

  .integration-steps .step {
    padding: 12px;
    min-height: auto;
  }
}

/* 超宽屏幕优化 (大于1920px) */
@media (min-width: 1921px) {
  :deep(.tech-details-dialog) {
    max-width: 1800px !important;
  }

  .scenario-card {
    padding: 32px;
  }

  .scenario-content h5 {
    font-size: 1.5rem;
  }

  .scenario-content p {
    font-size: 1.1rem;
  }

  .integration-steps {
    grid-template-columns: repeat(4, 1fr) !important;
    gap: 24px !important;
  }

  .assessment-dimensions {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 24px !important;
  }
}

/* 加载动画 - 增强版 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInLeft {
  from {
    opacity: 0;
    transform: translateX(-30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

/* 页面元素进入动画 */
.tech-details-wrapper > div {
  animation: fadeInUp 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
  opacity: 0;
}

.tech-details-wrapper > div:nth-child(1) {
  animation-delay: 0.1s;
}

.tech-details-wrapper > div:nth-child(2) {
  animation-delay: 0.2s;
}

.tech-details-wrapper > div:nth-child(3) {
  animation-delay: 0.3s;
}

.tech-details-wrapper > div:nth-child(4) {
  animation-delay: 0.4s;
}

.tech-details-wrapper > div:nth-child(5) {
  animation-delay: 0.5s;
}

/* 场景卡片进入动画 */
.scenario-card {
  animation: scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

.scenario-card:nth-child(1) { animation-delay: 0.1s; }
.scenario-card:nth-child(2) { animation-delay: 0.2s; }
.scenario-card:nth-child(3) { animation-delay: 0.3s; }
.scenario-card:nth-child(4) { animation-delay: 0.4s; }

/* 按钮点击动画 */
.scenario-actions .el-button:active {
  transform: scale(0.95);
  transition: transform 0.1s ease;
}

/* 加载状态动画 */
.loading-spinner {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(76, 81, 191, 0.3);
  border-top: 2px solid var(--iflytek-blue-500);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 成功状态动画 */
.success-checkmark {
  animation: checkmark 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards;
}

@keyframes checkmark {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.2);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* 滚动条样式 */
:deep(.el-message-box__content)::-webkit-scrollbar {
  width: 6px;
}

:deep(.el-message-box__content)::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

:deep(.el-message-box__content)::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

:deep(.el-message-box__content)::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* 中文字体优化 - 全面增强 */
.phase-title,
.interviewer-info h4,
.suggestion-content h4,
.scenario-content h5,
.tech-details-wrapper h3,
.tech-details-wrapper h4,
.tech-details-wrapper h5 {
  font-family: 'Microsoft YaHei Optimized', 'Microsoft YaHei', '微软雅黑', 'SimHei', '黑体', sans-serif;
  font-weight: 600;
  letter-spacing: 0.01em;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* 技术架构图中文字体优化 */
.tech-details-wrapper p,
.tech-details-wrapper span,
.tech-details-wrapper div {
  font-family: 'Microsoft YaHei Optimized', 'Microsoft YaHei', '微软雅黑', sans-serif;
  color: #2d3748;
  line-height: 1.6;
  text-rendering: optimizeLegibility;
}

/* 弹窗标题中文字体优化 */
:deep(.el-message-box__title) {
  font-family: 'Microsoft YaHei Optimized', 'Microsoft YaHei', '微软雅黑', sans-serif !important;
  font-weight: 600 !important;
  letter-spacing: 0.01em !important;
  text-rendering: optimizeLegibility !important;
}

/* 按钮中文字体优化 */
.el-button {
  font-family: 'Microsoft YaHei Optimized', 'Microsoft YaHei', '微软雅黑', sans-serif;
  font-weight: 500;
  letter-spacing: 0.02em;
  text-rendering: optimizeLegibility;
}

/* 标签中文字体优化 */
.el-tag {
  font-family: 'Microsoft YaHei Optimized', 'Microsoft YaHei', '微软雅黑', sans-serif;
  font-weight: 500;
  letter-spacing: 0.01em;
}

/* Mermaid图表中文字体优化 */
:deep(.mermaid text) {
  font-family: 'Microsoft YaHei Optimized', 'Microsoft YaHei', '微软雅黑', sans-serif !important;
  font-weight: 500 !important;
  text-rendering: optimizeLegibility !important;
}

/* 高对比度中文文本 */
.high-contrast-chinese {
  color: #1a202c;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  font-weight: 500;
  font-family: 'Microsoft YaHei Optimized', 'Microsoft YaHei', '微软雅黑', sans-serif;
}

/* 强调中文文本 */
.emphasis-chinese {
  font-weight: 600;
  color: var(--iflytek-blue-700);
  text-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
  font-family: 'Microsoft YaHei Optimized', 'Microsoft YaHei', '微软雅黑', sans-serif;
}

/* iFlytek品牌色彩 */
.start-interview-btn,
.record-btn[type="primary"] {
  background: var(--iflytek-gradient-primary);
  border: none;
  font-family: 'Microsoft YaHei Optimized', 'Microsoft YaHei', '微软雅黑', sans-serif;
  font-weight: 500;
}
</style>
