/**
 * 多模态演示内容服务
 * 为AI、大数据、IoT三个技术领域生成丰富的演示内容
 * 集成enhanced-chinese-video-generator.js功能
 */

import {
  ENHANCED_VIDEO_CONFIGS,
  generateVideoMetadata,
  generateChapterMarkers
} from '../../enhanced-chinese-video-generator.js'

class MultimodalDemoContentService {
  constructor() {
    this.demoTemplates = {
      ai: this.getAIDemoTemplates(),
      bigdata: this.getBigDataDemoTemplates(),
      iot: this.getIoTDemoTemplates()
    }

    this.interactiveElements = {
      codeEditor: this.getCodeEditorConfigs(),
      dataVisualization: this.getDataVisualizationConfigs(),
      realTimeDemo: this.getRealTimeDemoConfigs()
    }

    // iFlytek集成配置
    this.iflytekIntegration = {
      sparkModel: 'v3.5',
      chineseOptimization: true,
      brandColors: ['#4c51bf', '#6b21a8'],
      voiceSupport: false,
      realTimeAnalysis: true
    }

    // 面试场景配置
    this.interviewScenarios = {
      technical_assessment: true,
      behavioral_evaluation: true,
      coding_challenge: true,
      system_design: true,
      chinese_communication: true
    }
  }

  /**
   * 生成AI领域演示内容
   */
  getAIDemoTemplates() {
    return [
      {
        id: 'ai_transformer_demo',
        title: 'Transformer架构深度解析',
        category: 'technical_deep_dive',
        duration: 480,
        difficulty: 'advanced',
        scenes: [
          {
            id: 'intro',
            title: '架构概览',
            duration: 60,
            content: {
              chinese_title: 'Transformer：革命性的注意力机制',
              description: '深入理解现代NLP的基石架构',
              visual_elements: [
                'architecture_diagram',
                'attention_visualization',
                'code_walkthrough'
              ],
              interactive_demo: {
                type: 'attention_heatmap',
                data: 'real_sentence_analysis',
                user_input: true
              }
            }
          },
          {
            id: 'self_attention',
            title: '自注意力机制',
            duration: 120,
            content: {
              chinese_title: '自注意力：让模型理解上下文',
              description: '数学原理与代码实现的完美结合',
              visual_elements: [
                'mathematical_formula',
                'step_by_step_calculation',
                'pytorch_implementation'
              ],
              interactive_demo: {
                type: 'live_coding',
                framework: 'pytorch',
                real_time_execution: true
              }
            }
          },
          {
            id: 'multi_head_attention',
            title: '多头注意力',
            duration: 100,
            content: {
              chinese_title: '多头注意力：并行处理的艺术',
              description: '如何通过多个注意力头捕获不同类型的关系',
              visual_elements: [
                'multi_head_visualization',
                'parallel_processing_demo',
                'performance_comparison'
              ],
              interactive_demo: {
                type: 'parameter_tuning',
                adjustable_params: ['num_heads', 'd_model', 'd_k'],
                real_time_feedback: true
              }
            }
          },
          {
            id: 'practical_application',
            title: '实际应用案例',
            duration: 120,
            content: {
              chinese_title: '从理论到实践：BERT与GPT',
              description: 'Transformer在实际项目中的应用',
              visual_elements: [
                'bert_gpt_comparison',
                'fine_tuning_process',
                'performance_metrics'
              ],
              interactive_demo: {
                type: 'model_playground',
                models: ['bert-base-chinese', 'gpt-3.5-turbo'],
                tasks: ['sentiment_analysis', 'text_generation']
              }
            }
          },
          {
            id: 'optimization_tips',
            title: '优化技巧',
            duration: 80,
            content: {
              chinese_title: '性能优化：让Transformer更快更强',
              description: '生产环境中的优化策略',
              visual_elements: [
                'optimization_techniques',
                'benchmark_results',
                'memory_usage_analysis'
              ],
              interactive_demo: {
                type: 'optimization_comparison',
                techniques: ['gradient_checkpointing', 'mixed_precision', 'model_parallelism'],
                metrics: ['speed', 'memory', 'accuracy']
              }
            }
          }
        ],
        assessment_criteria: [
          '对Transformer架构的理解深度',
          '数学原理的掌握程度',
          '代码实现能力',
          '实际应用经验',
          '优化思维'
        ],
        iflytek_integration: {
          spark_model_demo: true,
          chinese_nlp_focus: true,
          real_time_inference: true
        }
      },
      {
        id: 'ai_computer_vision_demo',
        title: '计算机视觉实战：从CNN到Vision Transformer',
        category: 'hands_on_practice',
        duration: 420,
        difficulty: 'intermediate',
        scenes: [
          {
            id: 'cnn_basics',
            title: 'CNN基础',
            duration: 90,
            content: {
              chinese_title: '卷积神经网络：图像识别的基石',
              description: '从LeNet到ResNet的演进历程',
              visual_elements: [
                'convolution_animation',
                'feature_map_visualization',
                'architecture_evolution'
              ],
              interactive_demo: {
                type: 'cnn_playground',
                datasets: ['CIFAR-10', 'ImageNet'],
                architectures: ['LeNet', 'AlexNet', 'ResNet'],
                real_time_training: true
              }
            }
          },
          {
            id: 'object_detection',
            title: '目标检测',
            duration: 120,
            content: {
              chinese_title: '目标检测：让AI看懂世界',
              description: '从R-CNN到YOLO的技术演进',
              visual_elements: [
                'detection_pipeline',
                'anchor_box_visualization',
                'nms_algorithm_demo'
              ],
              interactive_demo: {
                type: 'real_time_detection',
                models: ['YOLOv5', 'Faster R-CNN', 'SSD'],
                input_sources: ['webcam', 'video_file', 'image_upload'],
                chinese_labels: true
              }
            }
          },
          {
            id: 'vision_transformer',
            title: 'Vision Transformer',
            duration: 110,
            content: {
              chinese_title: 'Vision Transformer：注意力机制在视觉领域的应用',
              description: 'Transformer如何革命性地改变计算机视觉',
              visual_elements: [
                'patch_embedding_process',
                'attention_map_visualization',
                'vit_vs_cnn_comparison'
              ],
              interactive_demo: {
                type: 'vit_analysis',
                model: 'vit-base-patch16-224',
                visualization: 'attention_rollout',
                chinese_image_classification: true
              }
            }
          },
          {
            id: 'practical_project',
            title: '实战项目',
            duration: 100,
            content: {
              chinese_title: '端到端项目：智能监控系统',
              description: '构建一个完整的计算机视觉应用',
              visual_elements: [
                'system_architecture',
                'deployment_pipeline',
                'performance_monitoring'
              ],
              interactive_demo: {
                type: 'full_stack_demo',
                components: ['data_collection', 'model_training', 'deployment', 'monitoring'],
                chinese_interface: true,
                iflytek_integration: true
              }
            }
          }
        ],
        assessment_criteria: [
          'CNN架构理解',
          '目标检测算法掌握',
          'Vision Transformer原理',
          '实际项目经验',
          '系统设计能力'
        ]
      }
    ]
  }

  /**
   * 生成大数据领域演示内容
   */
  getBigDataDemoTemplates() {
    return [
      {
        id: 'bigdata_realtime_processing',
        title: '实时大数据处理架构设计与实现',
        category: 'system_architecture',
        duration: 450,
        difficulty: 'advanced',
        scenes: [
          {
            id: 'architecture_overview',
            title: '架构概览',
            duration: 80,
            content: {
              chinese_title: '实时大数据处理：Lambda vs Kappa架构',
              description: '选择合适的架构模式',
              visual_elements: [
                'lambda_architecture_diagram',
                'kappa_architecture_diagram',
                'comparison_matrix'
              ],
              interactive_demo: {
                type: 'architecture_simulator',
                scenarios: ['high_throughput', 'low_latency', 'fault_tolerance'],
                metrics: ['latency', 'throughput', 'cost']
              }
            }
          },
          {
            id: 'kafka_streaming',
            title: 'Kafka流处理',
            duration: 120,
            content: {
              chinese_title: 'Apache Kafka：构建实时数据管道',
              description: '高吞吐量消息队列的设计与优化',
              visual_elements: [
                'kafka_cluster_topology',
                'partition_strategy',
                'consumer_group_demo'
              ],
              interactive_demo: {
                type: 'kafka_playground',
                features: ['producer_tuning', 'consumer_optimization', 'monitoring'],
                real_data_simulation: true,
                chinese_monitoring_dashboard: true
              }
            }
          },
          {
            id: 'flink_processing',
            title: 'Flink流计算',
            duration: 130,
            content: {
              chinese_title: 'Apache Flink：低延迟流处理引擎',
              description: '状态管理与容错机制',
              visual_elements: [
                'flink_runtime_architecture',
                'checkpoint_mechanism',
                'watermark_handling'
              ],
              interactive_demo: {
                type: 'flink_job_development',
                use_cases: ['real_time_analytics', 'fraud_detection', 'recommendation'],
                state_backend: ['memory', 'rocksdb', 'hdfs'],
                chinese_sql_interface: true
              }
            }
          },
          {
            id: 'performance_optimization',
            title: '性能优化',
            duration: 120,
            content: {
              chinese_title: '性能调优：从理论到实践',
              description: '系统瓶颈识别与优化策略',
              visual_elements: [
                'performance_profiling',
                'bottleneck_analysis',
                'optimization_results'
              ],
              interactive_demo: {
                type: 'performance_tuning_lab',
                tools: ['jvm_tuning', 'network_optimization', 'storage_optimization'],
                metrics_dashboard: true,
                chinese_recommendations: true
              }
            }
          }
        ],
        assessment_criteria: [
          '架构设计能力',
          'Kafka使用经验',
          'Flink开发技能',
          '性能调优能力',
          '故障排查经验'
        ]
      }
    ]
  }

  /**
   * 生成IoT领域演示内容
   */
  getIoTDemoTemplates() {
    return [
      {
        id: 'iot_edge_computing',
        title: '边缘计算与智能IoT系统设计',
        category: 'edge_computing',
        duration: 390,
        difficulty: 'intermediate',
        scenes: [
          {
            id: 'edge_architecture',
            title: '边缘计算架构',
            duration: 90,
            content: {
              chinese_title: '边缘计算：让智能更靠近数据源',
              description: '云边协同的系统设计',
              visual_elements: [
                'edge_cloud_topology',
                'data_flow_diagram',
                'latency_comparison'
              ],
              interactive_demo: {
                type: 'edge_deployment_simulator',
                scenarios: ['smart_factory', 'autonomous_vehicle', 'smart_city'],
                hardware: ['raspberry_pi', 'jetson_nano', 'industrial_gateway'],
                chinese_interface: true
              }
            }
          },
          {
            id: 'protocol_design',
            title: '通信协议设计',
            duration: 100,
            content: {
              chinese_title: 'IoT通信协议：连接万物的桥梁',
              description: 'MQTT、CoAP、LoRaWAN协议对比',
              visual_elements: [
                'protocol_stack_comparison',
                'message_flow_analysis',
                'power_consumption_metrics'
              ],
              interactive_demo: {
                type: 'protocol_testing_lab',
                protocols: ['mqtt', 'coap', 'lorawan', 'nb_iot'],
                test_scenarios: ['indoor', 'outdoor', 'mobile'],
                chinese_monitoring: true
              }
            }
          },
          {
            id: 'sensor_integration',
            title: '传感器集成',
            duration: 100,
            content: {
              chinese_title: '传感器网络：感知物理世界',
              description: '多传感器数据融合与处理',
              visual_elements: [
                'sensor_network_topology',
                'data_fusion_algorithms',
                'calibration_procedures'
              ],
              interactive_demo: {
                type: 'sensor_data_playground',
                sensors: ['temperature', 'humidity', 'accelerometer', 'camera'],
                fusion_algorithms: ['kalman_filter', 'particle_filter', 'dempster_shafer'],
                real_time_visualization: true
              }
            }
          },
          {
            id: 'ai_at_edge',
            title: '边缘AI',
            duration: 100,
            content: {
              chinese_title: '边缘AI：在设备端运行智能算法',
              description: '模型压缩与推理优化',
              visual_elements: [
                'model_compression_techniques',
                'inference_optimization',
                'hardware_acceleration'
              ],
              interactive_demo: {
                type: 'edge_ai_deployment',
                models: ['mobilenet', 'efficientnet', 'yolo_nano'],
                hardware: ['cpu', 'gpu', 'npu', 'fpga'],
                optimization_tools: ['tensorrt', 'openvino', 'tflite'],
                chinese_performance_analysis: true
              }
            }
          }
        ],
        assessment_criteria: [
          '边缘计算理解',
          '协议选择能力',
          '传感器集成经验',
          'AI模型部署',
          '系统优化能力'
        ]
      }
    ]
  }

  /**
   * 获取代码编辑器配置
   */
  getCodeEditorConfigs() {
    return {
      ai: {
        languages: ['python', 'pytorch', 'tensorflow'],
        themes: ['vs-dark', 'github-light'],
        features: ['intellisense', 'debugging', 'jupyter_integration'],
        chinese_comments: true
      },
      bigdata: {
        languages: ['scala', 'java', 'sql', 'python'],
        frameworks: ['spark', 'flink', 'kafka'],
        features: ['cluster_connection', 'job_submission', 'monitoring'],
        chinese_error_messages: true
      },
      iot: {
        languages: ['c', 'cpp', 'python', 'javascript'],
        platforms: ['arduino', 'raspberry_pi', 'esp32'],
        features: ['serial_monitor', 'hardware_debugging', 'ota_updates'],
        chinese_documentation: true
      }
    }
  }

  /**
   * 获取数据可视化配置
   */
  getDataVisualizationConfigs() {
    return {
      real_time_charts: {
        types: ['line', 'bar', 'scatter', 'heatmap', 'gauge'],
        update_frequency: [100, 500, 1000, 5000], // ms
        chinese_labels: true,
        iflytek_theme: true
      },
      interactive_dashboards: {
        components: ['filters', 'drill_down', 'cross_filtering'],
        export_formats: ['png', 'pdf', 'excel'],
        chinese_interface: true
      },
      3d_visualizations: {
        types: ['network_graph', 'point_cloud', 'volume_rendering'],
        interaction: ['rotation', 'zoom', 'selection'],
        chinese_tooltips: true
      }
    }
  }

  /**
   * 获取实时演示配置
   */
  getRealTimeDemoConfigs() {
    return {
      ai: {
        model_inference: {
          input_types: ['text', 'image'], // 音频输入已禁用
          output_visualization: true,
          chinese_processing: true,
          iflytek_models: ['spark_nlp', 'spark_vision'] // spark_speech已禁用
        }
      },
      bigdata: {
        stream_processing: {
          data_sources: ['kafka', 'kinesis', 'pubsub'],
          processing_engines: ['flink', 'spark_streaming', 'storm'],
          output_sinks: ['elasticsearch', 'redis', 'hbase'],
          chinese_monitoring: true
        }
      },
      iot: {
        device_simulation: {
          device_types: ['sensor', 'actuator', 'gateway'],
          protocols: ['mqtt', 'coap', 'http'],
          data_patterns: ['periodic', 'event_driven', 'burst'],
          chinese_device_names: true
        }
      }
    }
  }

  /**
   * 生成交互式演示案例
   */
  generateInteractiveDemo(domain, demoType, config = {}) {
    const template = this.demoTemplates[domain]
    const interactiveConfig = this.interactiveElements[demoType]
    
    if (!template || !interactiveConfig) {
      throw new Error(`不支持的演示类型: ${domain}/${demoType}`)
    }

    return {
      id: `${domain}_${demoType}_${Date.now()}`,
      domain,
      type: demoType,
      config: {
        ...interactiveConfig,
        ...config,
        chinese_optimization: true,
        iflytek_branding: true,
        real_time_feedback: true
      },
      metadata: {
        created_at: new Date().toISOString(),
        language: 'zh-CN',
        target_audience: 'technical_professionals',
        difficulty_level: config.difficulty || 'intermediate'
      }
    }
  }

  /**
   * 获取所有可用的演示模板
   */
  getAllDemoTemplates() {
    return {
      ai: this.demoTemplates.ai,
      bigdata: this.demoTemplates.bigdata,
      iot: this.demoTemplates.iot
    }
  }

  /**
   * 根据技能水平推荐演示内容
   */
  recommendDemoContent(domain, skillLevel, interests = []) {
    const templates = this.demoTemplates[domain] || []
    
    return templates.filter(template => {
      // 根据技能水平过滤
      const levelMatch = this.matchSkillLevel(template.difficulty, skillLevel)
      
      // 根据兴趣过滤
      const interestMatch = interests.length === 0 || 
        interests.some(interest => 
          template.category.includes(interest) ||
          template.assessment_criteria.some(criteria => 
            criteria.includes(interest)
          )
        )
      
      return levelMatch && interestMatch
    }).sort((a, b) => {
      // 按相关性排序
      return this.calculateRelevanceScore(b, skillLevel, interests) - 
             this.calculateRelevanceScore(a, skillLevel, interests)
    })
  }

  /**
   * 匹配技能水平
   */
  matchSkillLevel(templateDifficulty, userSkillLevel) {
    const difficultyLevels = {
      'beginner': 1,
      'intermediate': 2,
      'advanced': 3,
      'expert': 4
    }
    
    const templateLevel = difficultyLevels[templateDifficulty] || 2
    const userLevel = difficultyLevels[userSkillLevel] || 2
    
    // 允许用户选择稍高一级的难度
    return Math.abs(templateLevel - userLevel) <= 1
  }

  /**
   * 计算相关性分数
   */
  calculateRelevanceScore(template, skillLevel, interests) {
    let score = 0

    // 技能水平匹配度
    if (template.difficulty === skillLevel) {
      score += 10
    }

    // 兴趣匹配度
    interests.forEach(interest => {
      if (template.category.includes(interest)) {
        score += 5
      }
      template.assessment_criteria.forEach(criteria => {
        if (criteria.includes(interest)) {
          score += 3
        }
      })
    })

    return score
  }

  /**
   * 生成面试场景模拟内容
   */
  generateInterviewScenario(domain, difficulty = 'intermediate', duration = 300) {
    const templates = this.demoTemplates[domain] || []
    const selectedTemplate = templates.find(t => t.difficulty === difficulty) || templates[0]

    if (!selectedTemplate) {
      throw new Error(`未找到${domain}领域的演示模板`)
    }

    // 集成enhanced-chinese-video-generator.js的功能
    const videoConfig = ENHANCED_VIDEO_CONFIGS.find(config =>
      config.id.includes(domain) || config.metadata.technical_domains.some(d =>
        d.includes(domain === 'ai' ? '人工智能' : domain === 'bigdata' ? '大数据' : '物联网')
      )
    )

    const scenario = {
      id: `interview_${domain}_${Date.now()}`,
      title: `${selectedTemplate.title} - 面试场景`,
      domain,
      difficulty,
      duration,
      multimodal_content: {
        video: videoConfig ? generateVideoMetadata(videoConfig) : null,
        interactive_demos: selectedTemplate.scenes.map(scene => ({
          ...scene,
          assessment_points: this.generateAssessmentPoints(scene, domain),
          chinese_guidance: this.generateChineseGuidance(scene, domain),
          iflytek_enhanced: true
        })),
        real_time_evaluation: {
          enabled: true,
          criteria: selectedTemplate.assessment_criteria,
          iflytek_ai_scoring: true,
          chinese_feedback: true,
          multimodal_analysis: {
            video_analysis: true,
            audio_analysis: false, // 音频分析已禁用
            text_analysis: true,
            gesture_recognition: true
          }
        }
      },
      iflytek_integration: {
        ...this.iflytekIntegration,
        domain_specific_models: this.getDomainSpecificModels(domain),
        chinese_interview_flow: true,
        real_time_coaching: true
      }
    }

    return scenario
  }

  /**
   * 生成评估要点
   */
  generateAssessmentPoints(scene, domain) {
    const domainPoints = {
      ai: [
        '算法理解深度',
        '代码实现能力',
        '优化思维',
        '实际应用经验',
        '中文技术表达'
      ],
      bigdata: [
        '架构设计能力',
        '性能优化经验',
        '故障排查技能',
        '工具使用熟练度',
        '数据治理理解'
      ],
      iot: [
        '硬件理解',
        '协议选择',
        '系统集成',
        '边缘计算应用',
        '安全意识'
      ]
    }

    return domainPoints[domain] || []
  }

  /**
   * 生成中文指导内容
   */
  generateChineseGuidance(scene, domain) {
    return {
      introduction: `欢迎进入${scene.content.chinese_title}演示环节`,
      instructions: [
        '请仔细观察演示内容',
        '可以随时提问或要求详细解释',
        '建议结合自己的实际经验进行思考',
        '演示结束后会有相关技术问题',
        'iFlytek星火大模型将提供实时指导'
      ],
      tips: [
        '注意关键技术点的实现细节',
        '思考在实际项目中的应用场景',
        '准备分享自己的相关经验',
        '保持自然的中文表达'
      ],
      iflytek_features: [
        '实时智能问答',
        '个性化学习建议',
        '多模态分析反馈'
      ]
    }
  }

  /**
   * 获取领域特定模型
   */
  getDomainSpecificModels(domain) {
    const models = {
      ai: [
        'spark_transformer_chinese',
        'spark_cv_detection',
        'spark_nlp_sentiment',
        'spark_code_analysis'
      ],
      bigdata: [
        'spark_sql_optimizer',
        'spark_stream_analyzer',
        'spark_performance_tuner',
        'spark_architecture_advisor'
      ],
      iot: [
        'spark_edge_optimizer',
        'spark_protocol_analyzer',
        'spark_device_manager',
        'spark_security_scanner'
      ]
    }

    return models[domain] || []
  }

  /**
   * 创建真实面试场景模拟
   */
  createRealInterviewSimulation(candidateProfile) {
    const { domain, experience_level, preferred_language = 'zh-CN' } = candidateProfile

    const simulation = {
      id: `real_interview_${domain}_${Date.now()}`,
      type: 'comprehensive_assessment',
      phases: [
        {
          name: 'warm_up',
          duration: 300, // 5分钟
          chinese_title: '热身环节',
          description: '自我介绍和基础问题',
          activities: [
            'self_introduction',
            'background_questions',
            'motivation_assessment'
          ],
          iflytek_analysis: {
            speech_fluency: false, // 语音流畅度分析已禁用
            confidence_level: true,
            chinese_proficiency: true
          }
        },
        {
          name: 'technical_deep_dive',
          duration: 1200, // 20分钟
          chinese_title: '技术深入',
          description: '核心技术能力评估',
          activities: [
            'concept_explanation',
            'problem_solving',
            'code_review',
            'system_design'
          ],
          iflytek_analysis: {
            technical_accuracy: true,
            problem_solving_approach: true,
            communication_clarity: true
          }
        },
        {
          name: 'practical_demonstration',
          duration: 900, // 15分钟
          chinese_title: '实践演示',
          description: '动手能力和实际经验',
          activities: [
            'live_coding',
            'debugging_session',
            'architecture_design',
            'best_practices_discussion'
          ],
          iflytek_analysis: {
            coding_proficiency: true,
            debugging_skills: true,
            architectural_thinking: true
          }
        },
        {
          name: 'scenario_based_questions',
          duration: 600, // 10分钟
          chinese_title: '场景问题',
          description: '实际工作场景模拟',
          activities: [
            'case_study_analysis',
            'decision_making',
            'trade_off_discussion',
            'team_collaboration'
          ],
          iflytek_analysis: {
            analytical_thinking: true,
            decision_rationale: true,
            collaboration_mindset: true
          }
        }
      ],
      evaluation_framework: {
        technical_competency: {
          weight: 0.4,
          sub_criteria: [
            'domain_knowledge',
            'problem_solving',
            'code_quality',
            'system_thinking'
          ]
        },
        communication_skills: {
          weight: 0.3,
          sub_criteria: [
            'clarity_of_expression',
            'technical_explanation',
            'chinese_fluency',
            'active_listening'
          ]
        },
        practical_experience: {
          weight: 0.2,
          sub_criteria: [
            'real_world_application',
            'best_practices_awareness',
            'troubleshooting_ability',
            'continuous_learning'
          ]
        },
        cultural_fit: {
          weight: 0.1,
          sub_criteria: [
            'team_collaboration',
            'adaptability',
            'growth_mindset',
            'chinese_work_culture'
          ]
        }
      },
      iflytek_enhancements: {
        real_time_transcription: true,
        sentiment_analysis: true,
        stress_level_detection: true,
        chinese_accent_analysis: true,
        technical_term_recognition: true,
        automated_scoring: true,
        personalized_feedback: true
      }
    }

    return simulation
  }
}

// 创建全局实例
const multimodalDemoContentService = new MultimodalDemoContentService()

export default multimodalDemoContentService
