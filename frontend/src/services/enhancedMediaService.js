/**
 * 增强多媒体内容服务
 * 提供丰富的技术领域案例、实际面试视频、交互式演示内容
 */

// 技术领域详细案例库
export const technicalDomainCases = {
  // 人工智能领域案例
  ai: {
    name: '人工智能',
    icon: 'cpu',
    color: '#1890ff',
    description: '涵盖机器学习、深度学习、自然语言处理、计算机视觉等前沿AI技术',
    subDomains: [
      {
        id: 'machine-learning',
        name: '机器学习',
        description: '监督学习、无监督学习、强化学习等核心算法',
        keyTechnologies: ['scikit-learn', 'TensorFlow', 'PyTorch', 'XGBoost', 'Random Forest'],
        interviewQuestions: [
          {
            id: 'ml-q1',
            question: '请解释偏差-方差权衡（Bias-Variance Tradeoff）的概念',
            difficulty: 'medium',
            expectedAnswer: '偏差-方差权衡是机器学习中的核心概念...',
            keyPoints: ['偏差定义', '方差定义', '权衡关系', '实际应用'],
            interactiveDemo: '/demos/ml-bias-variance',
            codeExample: `
# 演示偏差-方差权衡
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import validation_curve
import numpy as np

# 不同复杂度模型的偏差-方差分析
param_range = [1, 5, 10, 20, 50, 100]
train_scores, test_scores = validation_curve(
    RandomForestRegressor(), X, y, 
    param_name='n_estimators', 
    param_range=param_range, cv=5
)
            `
          },
          {
            id: 'ml-q2',
            question: '如何处理机器学习中的过拟合问题？',
            difficulty: 'medium',
            expectedAnswer: '过拟合可以通过多种方法解决...',
            keyPoints: ['正则化', '交叉验证', '早停', '数据增强'],
            practicalExample: {
              scenario: '电商推荐系统过拟合优化',
              solution: '使用L2正则化和Dropout技术',
              results: '模型泛化能力提升15%'
            }
          }
        ],
        realWorldProjects: [
          {
            title: '智能客服系统',
            description: '基于NLP和机器学习的智能客服解决方案',
            technologies: ['BERT', 'FastText', 'Redis', 'Flask'],
            challenges: ['多轮对话理解', '意图识别准确性', '响应速度优化'],
            achievements: ['准确率达到92%', '响应时间<200ms', '用户满意度提升30%']
          },
          {
            title: '金融风控模型',
            description: '基于机器学习的信贷风险评估系统',
            technologies: ['XGBoost', 'LightGBM', 'Feature Engineering', 'MLflow'],
            challenges: ['特征工程', '模型解释性', '实时预测'],
            achievements: ['风险识别率提升25%', '误报率降低40%']
          }
        ]
      },
      {
        id: 'deep-learning',
        name: '深度学习',
        description: '神经网络、CNN、RNN、Transformer等深度学习技术',
        keyTechnologies: ['TensorFlow', 'PyTorch', 'Keras', 'CUDA', 'Docker'],
        interviewQuestions: [
          {
            id: 'dl-q1',
            question: '请详细解释Transformer架构的核心机制',
            difficulty: 'hard',
            expectedAnswer: 'Transformer基于自注意力机制...',
            keyPoints: ['自注意力', '多头注意力', '位置编码', '残差连接'],
            visualDemo: '/demos/transformer-architecture.html',
            interactiveCode: true
          }
        ]
      },
      {
        id: 'computer-vision',
        name: '计算机视觉',
        description: '图像识别、目标检测、图像分割等视觉AI技术',
        keyTechnologies: ['OpenCV', 'YOLO', 'ResNet', 'U-Net', 'GAN'],
        practicalDemos: [
          {
            title: '实时目标检测演示',
            description: '使用YOLO模型进行实时目标检测',
            demoUrl: '/demos/object-detection-live.html',
            interactive: true,
            features: ['实时摄像头检测', '多类别识别', '置信度显示']
          }
        ]
      }
    ]
  },

  // 大数据领域案例
  bigdata: {
    name: '大数据',
    icon: 'database',
    color: '#52c41a',
    description: '分布式计算、数据仓库、实时流处理、数据挖掘等大数据技术',
    subDomains: [
      {
        id: 'distributed-computing',
        name: '分布式计算',
        description: 'Hadoop、Spark等分布式计算框架',
        keyTechnologies: ['Hadoop', 'Spark', 'Flink', 'Kafka', 'HBase'],
        interviewQuestions: [
          {
            id: 'spark-q1',
            question: '请解释Spark的RDD、DataFrame和Dataset的区别',
            difficulty: 'medium',
            expectedAnswer: 'RDD是Spark的基础抽象...',
            keyPoints: ['RDD特性', 'DataFrame优势', 'Dataset类型安全'],
            codeExample: `
# Spark RDD vs DataFrame vs Dataset 示例
from pyspark.sql import SparkSession

spark = SparkSession.builder.appName("DataStructures").getOrCreate()

# RDD 示例
rdd = spark.sparkContext.parallelize([1, 2, 3, 4, 5])
squared_rdd = rdd.map(lambda x: x ** 2)

# DataFrame 示例
df = spark.createDataFrame([(1, "Alice"), (2, "Bob")], ["id", "name"])
df.select("name").show()

# Dataset 示例 (Scala)
case class Person(name: String, age: Int)
val ds = Seq(Person("Alice", 25)).toDS()
            `
          }
        ],
        architecturePatterns: [
          {
            name: 'Lambda架构',
            description: '批处理和流处理结合的大数据架构',
            components: ['批处理层', '流处理层', '服务层'],
            useCase: '实时数据分析平台',
            diagram: '/diagrams/lambda-architecture.svg'
          }
        ]
      },
      {
        id: 'data-warehouse',
        name: '数据仓库',
        description: '数据建模、ETL、OLAP等数据仓库技术',
        keyTechnologies: ['Hive', 'Presto', 'ClickHouse', 'Snowflake', 'dbt'],
        realWorldProjects: [
          {
            title: '电商数据仓库建设',
            description: '构建支持千万级用户的电商数据仓库',
            architecture: '分层数据仓库架构（ODS-DWD-DWS-ADS）',
            technologies: ['Hive', 'Spark SQL', 'Airflow', 'Superset'],
            metrics: ['数据处理量: 10TB/day', '查询响应时间: <3s', '数据准确性: 99.9%']
          }
        ]
      }
    ]
  },

  // 物联网领域案例
  iot: {
    name: '物联网',
    icon: 'wifi',
    color: '#faad14',
    description: '嵌入式系统、传感器网络、边缘计算、物联网协议等技术',
    subDomains: [
      {
        id: 'embedded-systems',
        name: '嵌入式系统',
        description: '单片机、嵌入式Linux、实时操作系统',
        keyTechnologies: ['Arduino', 'Raspberry Pi', 'FreeRTOS', 'Linux', 'C/C++'],
        interviewQuestions: [
          {
            id: 'embedded-q1',
            question: '请解释嵌入式系统中断处理的原理和最佳实践',
            difficulty: 'medium',
            expectedAnswer: '中断是嵌入式系统响应外部事件的机制...',
            keyPoints: ['中断向量', '中断优先级', '中断嵌套', '中断延迟'],
            hardwareDemo: {
              title: 'Arduino中断演示',
              description: '使用Arduino演示外部中断处理',
              components: ['Arduino Uno', '按钮', 'LED', '示波器'],
              code: `
void setup() {
  pinMode(2, INPUT_PULLUP);
  pinMode(13, OUTPUT);
  attachInterrupt(digitalPinToInterrupt(2), buttonISR, FALLING);
}

void buttonISR() {
  digitalWrite(13, !digitalRead(13));
}
              `
            }
          }
        ]
      },
      {
        id: 'iot-protocols',
        name: '物联网协议',
        description: 'MQTT、CoAP、LoRa、NB-IoT等通信协议',
        keyTechnologies: ['MQTT', 'CoAP', 'LoRa', 'NB-IoT', 'Zigbee'],
        protocolComparison: [
          {
            protocol: 'MQTT',
            characteristics: ['轻量级', '发布订阅', '低带宽'],
            useCase: '智能家居设备通信',
            pros: ['简单易用', '支持QoS', '广泛支持'],
            cons: ['需要中心代理', '不适合点对点']
          },
          {
            protocol: 'CoAP',
            characteristics: ['RESTful', 'UDP基础', '低功耗'],
            useCase: '资源受限设备',
            pros: ['轻量级', '支持缓存', '易于集成'],
            cons: ['可靠性较低', '安全性需加强']
          }
        ]
      }
    ]
  }
};

// 交互式演示内容
export const interactiveDemos = {
  // AI演示
  aiDemos: [
    {
      id: 'neural-network-playground',
      title: '神经网络可视化训练',
      description: '实时观察神经网络的训练过程和参数变化',
      type: 'interactive',
      url: '/demos/neural-network-playground.html',
      features: [
        '可调整网络结构',
        '实时训练可视化',
        '损失函数图表',
        '参数权重热图'
      ],
      difficulty: 'beginner',
      estimatedTime: '10-15分钟'
    },
    {
      id: 'nlp-sentiment-analysis',
      title: 'NLP情感分析实时演示',
      description: '输入文本实时分析情感倾向',
      type: 'interactive',
      url: '/demos/sentiment-analysis.html',
      features: [
        '多语言支持',
        '实时分析',
        '置信度显示',
        '词云可视化'
      ]
    }
  ],

  // 大数据演示
  bigdataDemos: [
    {
      id: 'spark-streaming-dashboard',
      title: 'Spark流处理监控面板',
      description: '实时监控Spark Streaming作业的执行状态',
      type: 'dashboard',
      url: '/demos/spark-streaming-dashboard.html',
      features: [
        '实时数据流监控',
        '性能指标图表',
        '错误日志追踪',
        '资源使用统计'
      ]
    }
  ],

  // 物联网演示
  iotDemos: [
    {
      id: 'iot-device-simulator',
      title: '物联网设备模拟器',
      description: '模拟各种物联网设备的数据传输和控制',
      type: 'simulator',
      url: '/demos/iot-device-simulator.html',
      features: [
        '多种传感器模拟',
        '实时数据传输',
        '设备控制界面',
        'MQTT协议演示'
      ]
    }
  ]
};

// 实际面试视频案例
export const realInterviewCases = {
  successCases: [
    {
      id: 'ai-engineer-success',
      title: 'AI工程师面试成功案例',
      candidate: '张同学 - 计算机科学硕士',
      position: 'AI算法工程师',
      company: '某知名互联网公司',
      duration: '45分钟',
      score: 92,
      highlights: [
        '深度学习理论扎实',
        '项目经验丰富',
        '表达清晰有条理',
        '技术视野开阔'
      ],
      videoSegments: [
        {
          title: '自我介绍',
          duration: '3分钟',
          keyPoints: ['教育背景', '项目经验', '技术栈'],
          score: 95
        },
        {
          title: '技术问答',
          duration: '25分钟',
          keyPoints: ['算法原理', '代码实现', '优化思路'],
          score: 90
        },
        {
          title: '项目讨论',
          duration: '15分钟',
          keyPoints: ['架构设计', '技术选型', '问题解决'],
          score: 94
        }
      ],
      learningPoints: [
        '准备充分的项目案例',
        '理论与实践相结合',
        '主动展示技术深度',
        '良好的沟通表达能力'
      ]
    }
  ],
  improvementCases: [
    {
      id: 'bigdata-engineer-improvement',
      title: '大数据工程师面试改进案例',
      candidate: '李同学 - 软件工程本科',
      position: '大数据开发工程师',
      initialScore: 65,
      improvedScore: 88,
      improvementPeriod: '2个月',
      weaknesses: [
        '分布式系统理解不深',
        '缺乏大规模数据处理经验',
        '表达不够自信'
      ],
      improvements: [
        '系统学习Hadoop生态',
        '完成3个实战项目',
        '参加技术分享提升表达'
      ],
      results: [
        '技术能力显著提升',
        '项目经验更加丰富',
        '面试表现更加自信'
      ]
    }
  ]
};

// 多媒体资源管理
export const mediaResourceManager = {
  // 获取高质量图片
  getOptimizedImage(category, name, size = 'medium') {
    const baseUrl = '/assets/images';
    const sizes = {
      small: '400x300',
      medium: '800x600',
      large: '1200x900'
    };
    return `${baseUrl}/${category}/${name}-${sizes[size]}.webp`;
  },

  // 获取视频资源
  getVideoResource(id, quality = 'hd') {
    const baseUrl = '/assets/videos';
    const qualities = {
      sd: '480p',
      hd: '720p',
      fhd: '1080p'
    };
    return `${baseUrl}/${id}-${qualities[quality]}.webm`;
  },

  // 获取交互式演示
  getInteractiveDemo(demoId) {
    return `/demos/${demoId}/index.html`;
  },

  // 预加载关键资源
  preloadCriticalResources() {
    const criticalResources = [
      '/assets/images/hero/main-banner-800x600.webp',
      '/assets/images/demo/intro-preview.webp',
      '/demos/neural-network-playground/index.html'
    ];
    
    criticalResources.forEach(resource => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = resource;
      link.as = resource.includes('.html') ? 'document' : 'image';
      document.head.appendChild(link);
    });
  }
};

// 内容个性化推荐
export const contentRecommendationEngine = {
  // 基于用户兴趣推荐内容
  getPersonalizedContent(userProfile) {
    const { domain, experience, interests } = userProfile;
    
    const recommendations = [];
    
    // 基于技术领域推荐
    if (domain === 'ai') {
      recommendations.push(...this.getAIRecommendations(experience));
    } else if (domain === 'bigdata') {
      recommendations.push(...this.getBigDataRecommendations(experience));
    } else if (domain === 'iot') {
      recommendations.push(...this.getIoTRecommendations(experience));
    }
    
    // 基于兴趣推荐
    interests.forEach(interest => {
      recommendations.push(...this.getInterestBasedContent(interest));
    });
    
    return this.rankAndFilterRecommendations(recommendations);
  },

  getAIRecommendations(experience) {
    if (experience === 'beginner') {
      return [
        { type: 'video', id: 'ai-basics', priority: 10 },
        { type: 'demo', id: 'neural-network-playground', priority: 9 },
        { type: 'case', id: 'simple-ml-project', priority: 8 }
      ];
    } else if (experience === 'intermediate') {
      return [
        { type: 'video', id: 'advanced-ml', priority: 10 },
        { type: 'case', id: 'production-ai-system', priority: 9 },
        { type: 'interview', id: 'ai-engineer-success', priority: 8 }
      ];
    }
    return [];
  },

  rankAndFilterRecommendations(recommendations) {
    return recommendations
      .sort((a, b) => b.priority - a.priority)
      .slice(0, 10); // 返回前10个推荐
  }
};

export default {
  technicalDomainCases,
  interactiveDemos,
  realInterviewCases,
  mediaResourceManager,
  contentRecommendationEngine
};
