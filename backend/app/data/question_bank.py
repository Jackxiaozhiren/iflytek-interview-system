# 面试题库数据
QUESTION_BANK = {
    "人工智能": {
        "技术岗": [
            {
                "question": "请解释一下机器学习中监督学习和无监督学习的区别，并举例说明它们的应用场景。",
                "difficulty": "medium",
                "type": "technical",
                "keywords": ["监督学习", "无监督学习", "机器学习", "分类", "聚类"],
                "expected_points": [
                    "监督学习需要标注数据，无监督学习不需要",
                    "监督学习用于分类和回归，无监督学习用于聚类和降维",
                    "举出具体应用例子"
                ]
            },
            {
                "question": "深度学习中的梯度消失问题是什么？有哪些解决方法？",
                "difficulty": "hard",
                "type": "technical", 
                "keywords": ["梯度消失", "深度学习", "反向传播", "激活函数"],
                "expected_points": [
                    "解释梯度消失的原因",
                    "提到ReLU激活函数、残差连接、批归一化等解决方案",
                    "理解深度网络训练的挑战"
                ]
            },
            {
                "question": "如果让你设计一个推荐系统，你会考虑哪些因素？请描述你的设计思路。",
                "difficulty": "medium",
                "type": "scenario",
                "keywords": ["推荐系统", "协同过滤", "内容过滤", "冷启动"],
                "expected_points": [
                    "用户行为数据收集",
                    "推荐算法选择（协同过滤、内容过滤等）",
                    "冷启动问题解决",
                    "系统架构设计"
                ]
            },
            {
                "question": "请解释Transformer架构的核心机制，以及它在NLP领域的革命性意义。",
                "difficulty": "hard",
                "type": "technical",
                "keywords": ["Transformer", "注意力机制", "BERT", "GPT", "自然语言处理"],
                "expected_points": [
                    "自注意力机制的原理和计算过程",
                    "位置编码的作用和实现方式",
                    "多头注意力的优势",
                    "Transformer相比RNN/CNN的优势",
                    "在BERT、GPT等模型中的应用"
                ],
                "code_example": """
# Transformer自注意力机制简化实现
import torch
import torch.nn as nn
import torch.nn.functional as F

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, num_heads):
        super().__init__()
        self.d_model = d_model
        self.num_heads = num_heads
        self.d_k = d_model // num_heads

        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)

    def forward(self, query, key, value, mask=None):
        batch_size = query.size(0)

        # 线性变换并重塑为多头
        Q = self.W_q(query).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        K = self.W_k(key).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)
        V = self.W_v(value).view(batch_size, -1, self.num_heads, self.d_k).transpose(1, 2)

        # 计算注意力
        attention_output = self.scaled_dot_product_attention(Q, K, V, mask)

        # 拼接多头输出
        attention_output = attention_output.transpose(1, 2).contiguous().view(
            batch_size, -1, self.d_model)

        return self.W_o(attention_output)
"""
            },
            {
                "question": "在实际项目中，如何处理机器学习模型的过拟合问题？请提供具体的解决方案。",
                "difficulty": "medium",
                "type": "scenario",
                "keywords": ["过拟合", "正则化", "交叉验证", "数据增强", "早停"],
                "expected_points": [
                    "识别过拟合的方法（训练集vs验证集性能差异）",
                    "正则化技术（L1/L2正则化、Dropout）",
                    "数据层面的解决方案（数据增强、更多训练数据）",
                    "模型复杂度控制",
                    "交叉验证和早停策略"
                ],
                "practical_tips": [
                    "使用学习曲线监控训练过程",
                    "合理设置验证集比例",
                    "尝试集成学习方法",
                    "特征选择和降维"
                ]
            },
            {
                "question": "请描述计算机视觉中目标检测的发展历程，从传统方法到深度学习的演进。",
                "difficulty": "hard",
                "type": "technical",
                "keywords": ["目标检测", "RCNN", "YOLO", "SSD", "计算机视觉"],
                "expected_points": [
                    "传统方法：滑动窗口、HOG特征、SVM分类器",
                    "两阶段检测：R-CNN、Fast R-CNN、Faster R-CNN",
                    "单阶段检测：YOLO、SSD的原理和优势",
                    "性能指标：mAP、IoU的含义",
                    "实际应用场景和挑战"
                ]
            },
            {
                "question": "如何设计一个大规模机器学习系统的MLOps流程？",
                "difficulty": "hard",
                "type": "scenario",
                "keywords": ["MLOps", "模型部署", "CI/CD", "监控", "版本控制"],
                "expected_points": [
                    "数据版本控制和管理",
                    "模型训练的自动化流程",
                    "模型版本管理和A/B测试",
                    "生产环境部署策略",
                    "模型性能监控和漂移检测",
                    "自动化重训练机制"
                ]
            }
        ],
        "运维测试岗": [
            {
                "question": "在AI模型部署过程中，你如何确保模型的性能和稳定性？",
                "difficulty": "medium",
                "type": "technical",
                "keywords": ["模型部署", "性能监控", "A/B测试", "模型版本管理"],
                "expected_points": [
                    "模型性能监控指标",
                    "A/B测试验证",
                    "模型版本管理",
                    "异常检测和回滚机制"
                ]
            },
            {
                "question": "AI系统在生产环境中出现预测准确率下降，你会如何排查和解决？",
                "difficulty": "hard",
                "type": "scenario",
                "keywords": ["模型漂移", "数据质量", "特征工程", "模型重训练"],
                "expected_points": [
                    "检查数据质量和分布变化",
                    "分析模型漂移现象",
                    "考虑重新训练或微调模型",
                    "建立监控和预警机制"
                ]
            }
        ],
        "产品岗": [
            {
                "question": "如何向非技术背景的客户解释AI产品的价值和局限性？",
                "difficulty": "medium",
                "type": "behavioral",
                "keywords": ["产品沟通", "AI解释", "客户教育", "价值传递"],
                "expected_points": [
                    "用通俗易懂的语言解释AI概念",
                    "强调AI带来的业务价值",
                    "诚实说明AI的局限性",
                    "提供具体的应用案例"
                ]
            }
        ]
    },
    "大数据": {
        "技术岗": [
            {
                "question": "请解释Hadoop生态系统的核心组件及其作用。",
                "difficulty": "medium",
                "type": "technical",
                "keywords": ["Hadoop", "HDFS", "MapReduce", "YARN", "Hive", "HBase"],
                "expected_points": [
                    "HDFS分布式文件系统",
                    "MapReduce计算框架",
                    "YARN资源管理",
                    "Hive数据仓库工具",
                    "HBase NoSQL数据库"
                ]
            },
            {
                "question": "在处理大规模数据时，如何选择合适的存储和计算方案？",
                "difficulty": "hard",
                "type": "scenario",
                "keywords": ["数据存储", "计算框架", "性能优化", "成本控制"],
                "expected_points": [
                    "根据数据特征选择存储方案",
                    "考虑计算复杂度和实时性要求",
                    "平衡性能和成本",
                    "可扩展性考虑"
                ]
            },
            {
                "question": "请详细解释Apache Spark的核心架构和RDD的工作原理。",
                "difficulty": "hard",
                "type": "technical",
                "keywords": ["Spark", "RDD", "DAG", "内存计算", "分布式计算"],
                "expected_points": [
                    "Spark架构：Driver、Executor、Cluster Manager",
                    "RDD的不可变性和容错机制",
                    "懒加载和DAG执行计划",
                    "内存计算的优势和缓存策略",
                    "与MapReduce的对比"
                ],
                "code_example": """
# Spark RDD操作示例
from pyspark import SparkContext, SparkConf

# 初始化Spark
conf = SparkConf().setAppName("RDD_Example")
sc = SparkContext(conf=conf)

# 创建RDD
data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
rdd = sc.parallelize(data)

# 转换操作（懒加载）
filtered_rdd = rdd.filter(lambda x: x % 2 == 0)
mapped_rdd = filtered_rdd.map(lambda x: x * x)

# 行动操作（触发计算）
result = mapped_rdd.collect()
print(f"结果: {result}")  # [4, 16, 36, 64, 100]

# 缓存RDD以提高性能
mapped_rdd.cache()
"""
            },
            {
                "question": "如何设计一个实时数据处理系统来处理每秒百万级的事件流？",
                "difficulty": "hard",
                "type": "scenario",
                "keywords": ["实时处理", "流计算", "Kafka", "Flink", "系统设计"],
                "expected_points": [
                    "消息队列选择和配置（Kafka、Pulsar）",
                    "流处理框架选择（Flink、Storm、Spark Streaming）",
                    "数据分区和负载均衡策略",
                    "容错和状态管理",
                    "监控和性能调优",
                    "背压处理机制"
                ],
                "architecture_example": {
                    "components": [
                        "数据源 → Kafka → Flink → 存储层",
                        "监控系统：Prometheus + Grafana",
                        "状态后端：RocksDB/HDFS",
                        "输出：ElasticSearch/HBase/Redis"
                    ]
                }
            },
            {
                "question": "请解释数据湖和数据仓库的区别，以及在什么场景下选择哪种方案？",
                "difficulty": "medium",
                "type": "technical",
                "keywords": ["数据湖", "数据仓库", "ETL", "ELT", "数据架构"],
                "expected_points": [
                    "数据仓库：结构化数据、预定义模式、OLAP",
                    "数据湖：多种数据类型、灵活存储、原始数据保留",
                    "ETL vs ELT的处理方式差异",
                    "成本和性能考虑",
                    "治理和安全性要求",
                    "混合架构的可能性"
                ]
            },
            {
                "question": "在大数据环境中，如何保证数据质量和数据治理？",
                "difficulty": "medium",
                "type": "scenario",
                "keywords": ["数据质量", "数据治理", "数据血缘", "元数据管理"],
                "expected_points": [
                    "数据质量检查：完整性、准确性、一致性",
                    "数据血缘追踪和影响分析",
                    "元数据管理和数据目录",
                    "数据安全和隐私保护",
                    "数据生命周期管理",
                    "自动化监控和告警机制"
                ]
            }
        ],
        "运维测试岗": [
            {
                "question": "大数据集群的监控指标有哪些？如何设计监控体系？",
                "difficulty": "medium",
                "type": "technical",
                "keywords": ["集群监控", "性能指标", "告警机制", "运维自动化"],
                "expected_points": [
                    "CPU、内存、磁盘、网络等基础指标",
                    "作业执行状态和性能指标",
                    "数据质量监控",
                    "告警和自动化处理机制"
                ]
            }
        ],
        "产品岗": [
            {
                "question": "如何设计一个数据可视化产品来帮助业务人员理解复杂的数据分析结果？",
                "difficulty": "medium",
                "type": "scenario",
                "keywords": ["数据可视化", "用户体验", "业务理解", "交互设计"],
                "expected_points": [
                    "了解业务人员的需求和痛点",
                    "选择合适的图表类型",
                    "设计直观的交互方式",
                    "提供数据钻取和筛选功能"
                ]
            }
        ]
    },
    "物联网": {
        "技术岗": [
            {
                "question": "请描述物联网系统的典型架构，包括感知层、网络层和应用层的功能。",
                "difficulty": "medium",
                "type": "technical",
                "keywords": ["物联网架构", "感知层", "网络层", "应用层", "传感器"],
                "expected_points": [
                    "感知层：传感器数据采集",
                    "网络层：数据传输和通信协议",
                    "应用层：数据处理和业务逻辑",
                    "各层之间的交互关系"
                ]
            },
            {
                "question": "在设计物联网设备时，如何平衡功耗、性能和成本？",
                "difficulty": "hard",
                "type": "scenario",
                "keywords": ["功耗优化", "性能平衡", "成本控制", "硬件设计"],
                "expected_points": [
                    "低功耗设计策略",
                    "性能需求分析",
                    "成本效益评估",
                    "技术选型权衡"
                ]
            },
            {
                "question": "请详细解释MQTT协议的工作原理，以及它在物联网中的应用优势。",
                "difficulty": "medium",
                "type": "technical",
                "keywords": ["MQTT", "发布订阅", "QoS", "物联网协议"],
                "expected_points": [
                    "发布-订阅模式的工作机制",
                    "三种QoS级别的区别和应用场景",
                    "主题（Topic）的层次结构设计",
                    "Keep Alive和Last Will机制",
                    "相比HTTP的优势：轻量级、低带宽、低功耗"
                ],
                "code_example": """
# MQTT客户端示例（Python）
import paho.mqtt.client as mqtt
import json
import time

class IoTDevice:
    def __init__(self, device_id, broker_host, broker_port=1883):
        self.device_id = device_id
        self.client = mqtt.Client(device_id)
        self.client.on_connect = self.on_connect
        self.client.on_message = self.on_message
        self.broker_host = broker_host
        self.broker_port = broker_port

    def on_connect(self, client, userdata, flags, rc):
        print(f"设备 {self.device_id} 连接结果: {rc}")
        # 订阅控制主题
        client.subscribe(f"device/{self.device_id}/control")

    def on_message(self, client, userdata, msg):
        try:
            command = json.loads(msg.payload.decode())
            print(f"收到命令: {command}")
            self.handle_command(command)
        except Exception as e:
            print(f"处理消息错误: {e}")

    def publish_sensor_data(self, sensor_type, value):
        topic = f"sensor/{self.device_id}/{sensor_type}"
        payload = {
            "device_id": self.device_id,
            "sensor_type": sensor_type,
            "value": value,
            "timestamp": time.time()
        }
        self.client.publish(topic, json.dumps(payload), qos=1)
"""
            },
            {
                "question": "如何设计一个智能家居系统的边缘计算架构？",
                "difficulty": "hard",
                "type": "scenario",
                "keywords": ["边缘计算", "智能家居", "本地处理", "云边协同"],
                "expected_points": [
                    "边缘网关的硬件选型和部署",
                    "本地数据处理和决策逻辑",
                    "云边协同的数据同步策略",
                    "离线模式下的系统可用性",
                    "安全性和隐私保护",
                    "设备管理和远程更新机制"
                ],
                "architecture_components": [
                    "边缘网关：Raspberry Pi 4 / NVIDIA Jetson",
                    "本地存储：SQLite / InfluxDB",
                    "通信协议：MQTT / CoAP / Zigbee",
                    "AI推理：TensorFlow Lite / OpenVINO",
                    "云服务：AWS IoT / Azure IoT Hub"
                ]
            },
            {
                "question": "请解释LoRaWAN网络的特点，以及它适用的物联网应用场景。",
                "difficulty": "medium",
                "type": "technical",
                "keywords": ["LoRaWAN", "LPWAN", "长距离通信", "低功耗"],
                "expected_points": [
                    "LoRa调制技术的特点：扩频、抗干扰",
                    "LoRaWAN网络架构：终端设备、网关、网络服务器",
                    "设备分类：Class A/B/C的区别",
                    "适用场景：农业监测、智慧城市、资产追踪",
                    "与其他LPWAN技术的对比（NB-IoT、Sigfox）"
                ]
            },
            {
                "question": "在工业物联网（IIoT）环境中，如何确保数据安全和系统可靠性？",
                "difficulty": "hard",
                "type": "scenario",
                "keywords": ["工业物联网", "数据安全", "系统可靠性", "OT安全"],
                "expected_points": [
                    "网络隔离和分段策略",
                    "设备身份认证和访问控制",
                    "数据加密：传输加密和存储加密",
                    "异常检测和入侵防护",
                    "系统冗余和故障转移",
                    "合规性要求（如IEC 62443标准）"
                ]
            },
            {
                "question": "如何设计一个可扩展的物联网数据采集和分析平台？",
                "difficulty": "hard",
                "type": "scenario",
                "keywords": ["数据采集", "可扩展性", "实时分析", "时序数据"],
                "expected_points": [
                    "数据采集层：协议适配和数据标准化",
                    "消息队列：Kafka/RabbitMQ处理高并发",
                    "时序数据库：InfluxDB/TimescaleDB存储",
                    "实时分析：Stream processing框架",
                    "可视化：Grafana/Kibana仪表板",
                    "水平扩展和负载均衡策略"
                ]
            }
        ],
        "运维测试岗": [
            {
                "question": "物联网设备大规模部署后，如何进行远程监控和维护？",
                "difficulty": "medium",
                "type": "technical",
                "keywords": ["远程监控", "设备管理", "OTA升级", "故障诊断"],
                "expected_points": [
                    "设备状态监控系统",
                    "远程诊断和故障排除",
                    "OTA固件升级机制",
                    "设备生命周期管理"
                ]
            }
        ],
        "产品岗": [
            {
                "question": "如何设计一个智能家居产品的用户体验，让技术小白也能轻松使用？",
                "difficulty": "medium",
                "type": "behavioral",
                "keywords": ["用户体验", "智能家居", "易用性", "产品设计"],
                "expected_points": [
                    "简化操作流程",
                    "直观的界面设计",
                    "智能化自动配置",
                    "完善的用户引导和帮助"
                ]
            }
        ]
    }
}

def get_questions_by_domain_position(domain: str, position: str) -> list:
    """根据领域和岗位获取问题列表"""
    return QUESTION_BANK.get(domain, {}).get(position, [])

def get_all_domains() -> list:
    """获取所有技术领域"""
    return list(QUESTION_BANK.keys())

def get_positions_by_domain(domain: str) -> list:
    """根据领域获取岗位列表"""
    return list(QUESTION_BANK.get(domain, {}).keys())
