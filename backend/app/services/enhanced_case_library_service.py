"""
增强的技术领域案例库服务
提供丰富的面试案例、技术问题和评估标准
"""

import json
import logging
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
from datetime import datetime
from enum import Enum

logger = logging.getLogger(__name__)

class DifficultyLevel(Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"

class QuestionType(Enum):
    TECHNICAL = "technical"
    SCENARIO = "scenario"
    BEHAVIORAL = "behavioral"
    CODING = "coding"

@dataclass
class TechnicalCase:
    """技术案例数据结构"""
    id: str
    title: str
    domain: str
    difficulty: DifficultyLevel
    question_type: QuestionType
    question: str
    expected_answer: str
    key_points: List[str]
    code_example: Optional[str] = None
    practical_tips: Optional[List[str]] = None
    follow_up_questions: Optional[List[str]] = None
    time_limit: int = 300  # 秒
    tags: List[str] = None
    created_at: datetime = None
    updated_at: datetime = None

class EnhancedCaseLibraryService:
    """增强的案例库服务"""
    
    def __init__(self):
        self.case_library = {}
        self.domain_stats = {}
        self.difficulty_distribution = {}
        self._initialize_enhanced_cases()
        
    def _initialize_enhanced_cases(self):
        """初始化增强的案例库"""
        logger.info("初始化增强技术案例库...")
        
        # AI领域案例
        self._add_ai_cases()
        
        # 大数据领域案例
        self._add_bigdata_cases()
        
        # 物联网领域案例
        self._add_iot_cases()
        
        # 更新统计信息
        self._update_statistics()
        
        logger.info(f"案例库初始化完成，共加载 {self.get_total_cases_count()} 个案例")
    
    def _add_ai_cases(self):
        """添加AI领域案例"""
        ai_cases = [
            TechnicalCase(
                id="ai_transformer_architecture",
                title="Transformer架构深度解析",
                domain="人工智能",
                difficulty=DifficultyLevel.ADVANCED,
                question_type=QuestionType.TECHNICAL,
                question="请详细解释Transformer架构的核心机制，包括自注意力机制、位置编码和多头注意力的工作原理。",
                expected_answer="""
Transformer架构是现代NLP的基础，其核心创新包括：

1. 自注意力机制（Self-Attention）：
   - 计算序列中每个位置与其他位置的关联度
   - 公式：Attention(Q,K,V) = softmax(QK^T/√d_k)V
   - 允许并行计算，解决了RNN的序列依赖问题

2. 位置编码（Positional Encoding）：
   - 使用正弦和余弦函数编码位置信息
   - PE(pos,2i) = sin(pos/10000^(2i/d_model))
   - PE(pos,2i+1) = cos(pos/10000^(2i/d_model))

3. 多头注意力（Multi-Head Attention）：
   - 将注意力分解为多个子空间
   - 每个头关注不同的表示子空间
   - 最后拼接所有头的输出

4. 前馈网络和残差连接：
   - 每个子层都有残差连接和层归一化
   - 提高训练稳定性和收敛速度
                """,
                key_points=[
                    "自注意力机制的数学原理",
                    "位置编码的必要性和实现",
                    "多头注意力的优势",
                    "残差连接和层归一化的作用",
                    "与RNN/CNN的对比优势"
                ],
                code_example="""
import torch
import torch.nn as nn
import math

class MultiHeadAttention(nn.Module):
    def __init__(self, d_model, num_heads):
        super().__init__()
        assert d_model % num_heads == 0
        
        self.d_model = d_model
        self.num_heads = num_heads
        self.d_k = d_model // num_heads
        
        self.W_q = nn.Linear(d_model, d_model)
        self.W_k = nn.Linear(d_model, d_model)
        self.W_v = nn.Linear(d_model, d_model)
        self.W_o = nn.Linear(d_model, d_model)
        
    def scaled_dot_product_attention(self, Q, K, V, mask=None):
        scores = torch.matmul(Q, K.transpose(-2, -1)) / math.sqrt(self.d_k)
        
        if mask is not None:
            scores = scores.masked_fill(mask == 0, -1e9)
        
        attention_weights = torch.softmax(scores, dim=-1)
        output = torch.matmul(attention_weights, V)
        
        return output, attention_weights
""",
                practical_tips=[
                    "理解注意力权重的可视化对调试很有帮助",
                    "位置编码的选择会影响模型对长序列的处理能力",
                    "多头注意力的头数通常选择8或16",
                    "残差连接对深层网络的训练至关重要"
                ],
                follow_up_questions=[
                    "如何处理Transformer在长序列上的计算复杂度问题？",
                    "BERT和GPT在Transformer基础上做了哪些改进？",
                    "如何在实际项目中选择合适的Transformer变体？"
                ],
                tags=["深度学习", "NLP", "注意力机制", "神经网络架构"],
                time_limit=600
            ),
            
            TechnicalCase(
                id="ai_mlops_pipeline",
                title="MLOps流程设计与实现",
                domain="人工智能",
                difficulty=DifficultyLevel.EXPERT,
                question_type=QuestionType.SCENARIO,
                question="设计一个完整的MLOps流程，包括数据管理、模型训练、部署和监控。如何确保模型在生产环境中的稳定性和可维护性？",
                expected_answer="""
完整的MLOps流程设计：

1. 数据管理层：
   - 数据版本控制（DVC、Git LFS）
   - 数据质量监控和验证
   - 特征存储（Feature Store）
   - 数据血缘追踪

2. 模型开发层：
   - 实验跟踪（MLflow、Weights & Biases）
   - 模型版本管理
   - 超参数优化（Optuna、Hyperopt）
   - 代码版本控制和协作

3. CI/CD流程：
   - 自动化测试（单元测试、集成测试）
   - 模型验证和A/B测试
   - 自动化部署流水线
   - 回滚机制

4. 生产部署：
   - 容器化部署（Docker、Kubernetes）
   - 模型服务化（FastAPI、TorchServe）
   - 负载均衡和自动扩缩容
   - 蓝绿部署或金丝雀发布

5. 监控和维护：
   - 模型性能监控
   - 数据漂移检测
   - 模型漂移检测
   - 自动化重训练触发
                """,
                key_points=[
                    "端到端的自动化流程",
                    "数据和模型的版本控制",
                    "生产环境的稳定性保证",
                    "监控和告警机制",
                    "团队协作和治理"
                ],
                tags=["MLOps", "DevOps", "模型部署", "生产环境"],
                time_limit=900
            )
        ]
        
        self.case_library["人工智能"] = ai_cases
    
    def _add_bigdata_cases(self):
        """添加大数据领域案例"""
        bigdata_cases = [
            TechnicalCase(
                id="bigdata_realtime_architecture",
                title="实时大数据处理架构设计",
                domain="大数据",
                difficulty=DifficultyLevel.ADVANCED,
                question_type=QuestionType.SCENARIO,
                question="设计一个能够处理每秒百万级事件的实时数据处理系统，包括数据摄取、处理、存储和查询。",
                expected_answer="""
实时大数据处理架构设计：

1. 数据摄取层：
   - Apache Kafka：高吞吐量消息队列
   - 分区策略：按业务键或时间分区
   - 副本配置：保证数据可靠性
   - 生产者优化：批量发送、压缩

2. 流处理层：
   - Apache Flink：低延迟流处理
   - 窗口操作：滑动窗口、会话窗口
   - 状态管理：RocksDB状态后端
   - 检查点机制：保证exactly-once语义

3. 存储层：
   - 热数据：Redis/HBase（毫秒级查询）
   - 温数据：Elasticsearch（秒级查询）
   - 冷数据：HDFS/S3（批量分析）

4. 查询层：
   - Apache Druid：OLAP查询引擎
   - 预聚合：提高查询性能
   - 缓存策略：多级缓存

5. 监控和运维：
   - Prometheus + Grafana：指标监控
   - ELK Stack：日志分析
   - 背压监控：防止系统过载
                """,
                key_points=[
                    "高吞吐量数据摄取",
                    "低延迟流处理",
                    "多层存储策略",
                    "容错和恢复机制",
                    "性能监控和调优"
                ],
                tags=["实时处理", "流计算", "系统架构", "高并发"],
                time_limit=720
            )
        ]
        
        self.case_library["大数据"] = bigdata_cases
    
    def _add_iot_cases(self):
        """添加物联网领域案例"""
        iot_cases = [
            TechnicalCase(
                id="iot_edge_computing",
                title="边缘计算架构设计",
                domain="物联网",
                difficulty=DifficultyLevel.ADVANCED,
                question_type=QuestionType.SCENARIO,
                question="设计一个智能制造场景下的边缘计算系统，需要处理设备数据、本地决策和云边协同。",
                expected_answer="""
智能制造边缘计算架构：

1. 边缘设备层：
   - 工业传感器：温度、压力、振动
   - 边缘网关：数据采集和预处理
   - 本地存储：时序数据库（InfluxDB）

2. 边缘计算层：
   - 实时数据处理：Apache Kafka + Flink
   - AI推理：TensorFlow Lite、OpenVINO
   - 本地决策：规则引擎 + ML模型
   - 设备控制：MQTT、OPC-UA协议

3. 云边协同：
   - 数据同步：增量同步、压缩传输
   - 模型更新：OTA升级机制
   - 远程监控：设备状态、性能指标
   - 离线模式：本地自主运行

4. 安全机制：
   - 设备认证：证书管理
   - 数据加密：端到端加密
   - 网络隔离：工业网络分段
   - 入侵检测：异常行为监控
                """,
                key_points=[
                    "边缘设备的计算能力利用",
                    "实时性和可靠性保证",
                    "云边协同的数据策略",
                    "工业级安全要求",
                    "离线场景的处理能力"
                ],
                tags=["边缘计算", "工业物联网", "实时控制", "云边协同"],
                time_limit=600
            )
        ]
        
        self.case_library["物联网"] = iot_cases
    
    def get_cases_by_domain(self, domain: str) -> List[TechnicalCase]:
        """根据领域获取案例"""
        return self.case_library.get(domain, [])
    
    def get_cases_by_difficulty(self, difficulty: DifficultyLevel) -> List[TechnicalCase]:
        """根据难度获取案例"""
        cases = []
        for domain_cases in self.case_library.values():
            cases.extend([case for case in domain_cases if case.difficulty == difficulty])
        return cases
    
    def get_case_by_id(self, case_id: str) -> Optional[TechnicalCase]:
        """根据ID获取案例"""
        for domain_cases in self.case_library.values():
            for case in domain_cases:
                if case.id == case_id:
                    return case
        return None
    
    def search_cases(self, query: str, domain: str = None) -> List[TechnicalCase]:
        """搜索案例"""
        results = []
        search_domains = [domain] if domain else self.case_library.keys()
        
        for search_domain in search_domains:
            domain_cases = self.case_library.get(search_domain, [])
            for case in domain_cases:
                if (query.lower() in case.title.lower() or 
                    query.lower() in case.question.lower() or
                    any(query.lower() in tag.lower() for tag in case.tags or [])):
                    results.append(case)
        
        return results
    
    def get_total_cases_count(self) -> int:
        """获取案例总数"""
        return sum(len(cases) for cases in self.case_library.values())
    
    def _update_statistics(self):
        """更新统计信息"""
        self.domain_stats = {}
        self.difficulty_distribution = {}
        
        for domain, cases in self.case_library.items():
            self.domain_stats[domain] = len(cases)
            
            for case in cases:
                difficulty = case.difficulty.value
                self.difficulty_distribution[difficulty] = self.difficulty_distribution.get(difficulty, 0) + 1
    
    def get_statistics(self) -> Dict[str, Any]:
        """获取案例库统计信息"""
        return {
            "total_cases": self.get_total_cases_count(),
            "domain_distribution": self.domain_stats,
            "difficulty_distribution": self.difficulty_distribution,
            "supported_domains": list(self.case_library.keys()),
            "last_updated": datetime.now().isoformat()
        }

# 创建全局实例
enhanced_case_library_service = EnhancedCaseLibraryService()
