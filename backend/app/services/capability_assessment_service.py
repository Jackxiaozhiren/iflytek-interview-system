"""
能力评估服务
实现六大核心能力指标的详细评估算法
"""
import re
import jieba
import numpy as np
from typing import Dict, List, Any, Optional
from collections import Counter
import math

class ProfessionalSkillAssessor:
    """专业技能评估器"""
    
    def __init__(self):
        # 增强的各领域专业词汇库
        self.domain_keywords = {
            "人工智能": {
                "核心技术": [
                    "机器学习", "深度学习", "神经网络", "算法", "模型", "训练", "预测", "分类", "回归", "聚类",
                    "监督学习", "无监督学习", "半监督学习", "强化学习", "迁移学习", "元学习", "联邦学习"
                ],
                "框架工具": [
                    "TensorFlow", "PyTorch", "Keras", "Scikit-learn", "OpenCV", "NLTK", "Pandas", "NumPy",
                    "JAX", "MXNet", "Hugging Face", "LangChain", "OpenAI API", "Transformers"
                ],
                "应用领域": [
                    "计算机视觉", "自然语言处理", "语音识别", "推荐系统", "智能对话", "图像识别", "文本分析",
                    "医疗AI", "金融AI", "教育AI", "智能制造", "自动驾驶", "智能客服"
                ],
                "高级概念": [
                    "强化学习", "生成对抗网络", "迁移学习", "注意力机制", "Transformer", "BERT", "GPT",
                    "卷积神经网络", "循环神经网络", "残差网络", "批归一化", "Dropout", "正则化",
                    "大语言模型", "多模态AI", "可解释AI", "AutoML", "MLOps", "神经架构搜索"
                ]
            },
            "大数据": {
                "核心技术": [
                    "数据挖掘", "数据分析", "数据仓库", "ETL", "ELT", "数据清洗", "特征工程", "统计分析", "可视化",
                    "数据治理", "数据质量", "数据血缘", "元数据管理", "数据安全", "数据合规"
                ],
                "框架工具": [
                    "Hadoop", "Spark", "Kafka", "Hive", "HBase", "Elasticsearch", "Tableau", "Power BI",
                    "Flink", "Storm", "Presto", "Impala", "Druid", "Kylin", "Superset", "Grafana"
                ],
                "存储技术": [
                    "HDFS", "NoSQL", "MongoDB", "Redis", "Cassandra", "ClickHouse", "数据湖", "数据中台",
                    "对象存储", "列式存储", "时序数据库", "图数据库", "分布式存储", "湖仓一体"
                ],
                "处理技术": [
                    "流式处理", "批处理", "实时计算", "离线计算", "分布式计算", "并行处理",
                    "Lambda架构", "Kappa架构", "微批处理", "事件驱动", "CDC", "数据同步"
                ],
                "云平台": [
                    "AWS", "Azure", "阿里云", "腾讯云", "华为云", "百度云", "Serverless",
                    "容器化", "Kubernetes", "Docker", "微服务", "DevOps", "DataOps"
                ]
            },
            "物联网": {
                "核心技术": [
                    "传感器", "嵌入式", "无线通信", "边缘计算", "云计算", "数据采集", "设备管理", "协议栈",
                    "实时系统", "低功耗设计", "固件开发", "驱动开发", "RTOS", "裸机编程"
                ],
                "通信协议": [
                    "MQTT", "CoAP", "LoRa", "LoRaWAN", "NB-IoT", "WiFi", "蓝牙", "Zigbee", "5G",
                    "Thread", "Matter", "OPC UA", "Modbus", "CAN", "TCP/IP", "HTTP/HTTPS", "WebSocket"
                ],
                "硬件平台": [
                    "Arduino", "树莓派", "STM32", "ESP32", "ARM", "FPGA", "单片机", "开发板",
                    "MCU", "SoC", "DSP", "RISC-V", "Cortex-M", "Cortex-A", "传感器模块"
                ],
                "应用场景": [
                    "智能家居", "工业物联网", "智慧城市", "车联网", "农业物联网", "医疗物联网", "环境监测",
                    "智能制造", "智慧物流", "智能电网", "可穿戴设备", "智慧零售", "智能建筑"
                ],
                "安全技术": [
                    "设备认证", "数据加密", "安全通信", "固件更新", "密钥管理", "PKI",
                    "区块链", "零信任", "安全启动", "硬件安全模块", "TEE", "安全芯片"
                ]
            }
        }

        # 技术难度等级映射
        self.difficulty_levels = {
            "基础": ["核心技术"],
            "中级": ["框架工具", "通信协议", "硬件平台"],
            "高级": ["应用领域", "处理技术", "安全技术"],
            "专家": ["高级概念", "云平台"]
        }

        # 职位技能要求映射
        self.position_requirements = {
            "AI工程师": {
                "必备技能": ["深度学习", "机器学习", "Python", "TensorFlow", "PyTorch"],
                "加分技能": ["MLOps", "模型部署", "分布式训练", "AutoML", "大语言模型"],
                "基础知识": ["数学基础", "统计学", "线性代数", "概率论", "算法"]
            },
            "大数据工程师": {
                "必备技能": ["Hadoop", "Spark", "Kafka", "Python", "Scala", "SQL"],
                "加分技能": ["实时计算", "数据治理", "云平台", "容器化", "湖仓一体"],
                "基础知识": ["分布式系统", "数据结构", "算法", "Linux", "网络"]
            },
            "物联网工程师": {
                "必备技能": ["嵌入式开发", "C/C++", "MQTT", "传感器", "无线通信"],
                "加分技能": ["边缘计算", "5G", "安全协议", "云平台集成", "RTOS"],
                "基础知识": ["电子电路", "通信原理", "网络协议", "操作系统", "数字信号处理"]
            }
        }
    
    def assess_professional_skill(self, text: str, domain: str, position: str) -> Dict[str, Any]:
        """评估专业技能水平 - 增强版本"""
        if domain not in self.domain_keywords:
            return {"error": "不支持的技术领域"}

        # 分词处理
        words = list(jieba.cut(text))
        word_count = len(words)

        # 计算专业词汇覆盖率
        domain_words = self.domain_keywords[domain]
        coverage_scores = {}
        total_keywords_found = 0
        total_keywords = 0
        difficulty_weighted_score = 0.0

        for category, keywords in domain_words.items():
            found_keywords = []
            for keyword in keywords:
                if keyword in text:
                    found_keywords.append(keyword)
                    total_keywords_found += 1

                    # 根据难度等级加权
                    difficulty_weight = self._get_difficulty_weight(category)
                    difficulty_weighted_score += difficulty_weight

                total_keywords += 1

            coverage_scores[category] = {
                "found_keywords": found_keywords,
                "coverage_rate": len(found_keywords) / len(keywords) * 100,
                "keyword_count": len(found_keywords),
                "difficulty_level": self._get_category_difficulty(category)
            }

        # 计算技术深度得分
        depth_score = self._calculate_enhanced_technical_depth(text, domain_words, domain)

        # 计算专业表达准确性
        accuracy_score = self._calculate_enhanced_professional_accuracy(text, words, domain)

        # 计算创新思维体现
        innovation_score = self._calculate_enhanced_innovation_thinking(text, domain)

        # 计算职位匹配度
        position_match_score = self._calculate_position_match_score(text, position, domain)

        # 计算实践经验体现
        experience_score = self._calculate_practical_experience_score(text, domain)

        # 综合专业技能得分 - 增强权重分配
        overall_coverage = total_keywords_found / total_keywords * 100 if total_keywords > 0 else 0
        difficulty_bonus = difficulty_weighted_score / total_keywords_found if total_keywords_found > 0 else 0

        professional_score = (
            overall_coverage * 0.25 +          # 词汇覆盖率
            depth_score * 0.25 +               # 技术深度
            accuracy_score * 0.20 +            # 专业准确性
            innovation_score * 0.15 +          # 创新思维
            position_match_score * 0.10 +      # 职位匹配
            experience_score * 0.05 +          # 实践经验
            difficulty_bonus * 10              # 难度加成
        )

        return {
            "overall_score": min(100, max(0, professional_score)),
            "coverage_scores": coverage_scores,
            "detailed_scores": {
                "vocabulary_coverage": overall_coverage,
                "technical_depth": depth_score,
                "professional_accuracy": accuracy_score,
                "innovation_thinking": innovation_score,
                "position_match": position_match_score,
                "practical_experience": experience_score,
                "difficulty_bonus": difficulty_bonus
            },
            "total_keywords_found": total_keywords_found,
            "total_keywords": total_keywords,
            "word_count": word_count,
            "domain": domain,
            "position": position,
            "recommendations": self._generate_skill_recommendations(coverage_scores, position, domain)
        }

    def _get_difficulty_weight(self, category: str) -> float:
        """获取技术难度权重"""
        for level, categories in self.difficulty_levels.items():
            if category in categories:
                weights = {"基础": 1.0, "中级": 1.5, "高级": 2.0, "专家": 3.0}
                return weights.get(level, 1.0)
        return 1.0

    def _get_category_difficulty(self, category: str) -> str:
        """获取分类难度等级"""
        for level, categories in self.difficulty_levels.items():
            if category in categories:
                return level
        return "基础"

    def _calculate_enhanced_technical_depth(self, text: str, domain_words: Dict, domain: str) -> float:
        """计算增强的技术深度分数"""
        try:
            depth_score = 0.0

            # 检查技术概念的层次性描述
            depth_indicators = [
                "原理", "机制", "架构", "设计模式", "最佳实践", "性能优化",
                "算法复杂度", "系统设计", "技术选型", "方案对比"
            ]

            for indicator in depth_indicators:
                if indicator in text:
                    depth_score += 10

            # 检查技术细节描述
            detail_indicators = [
                "参数配置", "代码实现", "调优方法", "监控指标", "故障排查",
                "版本差异", "兼容性", "扩展性", "可维护性"
            ]

            for indicator in detail_indicators:
                if indicator in text:
                    depth_score += 8

            # 检查实际应用场景
            application_indicators = [
                "项目经验", "实际应用", "生产环境", "业务场景", "解决方案",
                "案例分析", "效果评估", "经验总结"
            ]

            for indicator in application_indicators:
                if indicator in text:
                    depth_score += 12

            return min(100, depth_score)

        except Exception as e:
            logger.error(f"技术深度计算失败: {e}")
            return 50
        
        return {
            "professional_score": min(100, professional_score),
            "keyword_coverage": coverage_scores,
            "overall_coverage_rate": overall_coverage,
            "technical_depth_score": depth_score,
            "professional_accuracy": accuracy_score,
            "innovation_thinking": innovation_score,
            "word_count": word_count,
            "total_keywords_found": total_keywords_found
        }
    
    def _calculate_technical_depth(self, text: str, domain_words: Dict[str, List[str]]) -> float:
        """计算技术深度得分"""
        depth_indicators = [
            "原理", "机制", "算法", "架构", "设计", "实现", "优化", "性能",
            "源码", "底层", "核心", "关键", "技术栈", "解决方案"
        ]
        
        depth_count = sum(1 for indicator in depth_indicators if indicator in text)
        
        # 检查是否有具体的技术细节描述
        detail_patterns = [
            r'\d+\s*(GB|MB|KB|TB)',  # 数据量描述
            r'\d+\s*(ms|秒|分钟|小时)',  # 时间性能描述
            r'\d+\s*(%|百分比|倍)',  # 性能提升描述
            r'版本\s*\d+',  # 版本号
            r'API|SDK|框架|库'  # 技术工具
        ]
        
        detail_score = sum(1 for pattern in detail_patterns if re.search(pattern, text))
        
        # 高级概念使用情况
        advanced_score = 0
        if "高级概念" in domain_words:
            advanced_keywords = domain_words["高级概念"]
            advanced_score = sum(1 for keyword in advanced_keywords if keyword in text)
        
        total_depth = depth_count + detail_score + advanced_score
        return min(100, total_depth * 10)  # 每个深度指标10分
    
    def _calculate_professional_accuracy(self, text: str, words: List[str]) -> float:
        """计算专业表达准确性"""
        # 检查专业术语使用是否准确
        accuracy_indicators = {
            "准确性": ["准确", "精确", "正确", "有效", "可靠"],
            "逻辑性": ["因此", "所以", "由于", "基于", "通过", "实现"],
            "专业性": ["技术", "方法", "方案", "策略", "机制", "流程"]
        }
        
        total_score = 0
        for category, indicators in accuracy_indicators.items():
            found_count = sum(1 for indicator in indicators if indicator in text)
            total_score += found_count
        
        # 检查是否有错误的技术表述（简单的否定词检查）
        error_indicators = ["不对", "错误", "不行", "不可能", "不会"]
        error_count = sum(1 for error in error_indicators if error in text)
        
        # 计算准确性得分
        accuracy_score = max(0, total_score * 5 - error_count * 10)
        return min(100, accuracy_score)
    
    def _calculate_innovation_thinking(self, text: str) -> float:
        """计算创新思维体现"""
        innovation_keywords = [
            "创新", "改进", "优化", "提升", "突破", "新颖", "独特",
            "解决", "改善", "增强", "扩展", "升级", "革新", "变革"
        ]
        
        future_keywords = [
            "未来", "趋势", "发展", "前景", "潜力", "可能", "预测",
            "展望", "方向", "演进", "进化", "下一代"
        ]
        
        innovation_count = sum(1 for keyword in innovation_keywords if keyword in text)
        future_count = sum(1 for keyword in future_keywords if keyword in text)
        
        # 检查是否提出了具体的改进建议或新想法
        suggestion_patterns = [
            r'建议|推荐|可以|应该|不如|或者',
            r'如果|假设|考虑|尝试|探索',
            r'另外|此外|同时|结合|整合'
        ]
        
        suggestion_score = sum(1 for pattern in suggestion_patterns if re.search(pattern, text))
        
        total_innovation = innovation_count + future_count + suggestion_score
        return min(100, total_innovation * 8)  # 每个创新指标8分

class CommunicationAssessor:
    """沟通表达能力评估器"""
    
    def assess_communication_skill(self, text: str, audio_data: Dict = None, video_data: Dict = None) -> Dict[str, Any]:
        """评估沟通表达能力"""
        # 文本表达评估
        text_score = self._assess_text_expression(text)
        
        # 语音表达评估
        audio_score = self._assess_audio_expression(audio_data) if audio_data else 0
        
        # 视觉表达评估
        visual_score = self._assess_visual_expression(video_data) if video_data else 0
        
        # 综合沟通得分
        weights = {"text": 0.5, "audio": 0.3, "visual": 0.2}
        if not audio_data:
            weights = {"text": 0.7, "visual": 0.3}
        if not video_data:
            weights = {"text": 0.7, "audio": 0.3}
        if not audio_data and not video_data:
            weights = {"text": 1.0}
        
        communication_score = (
            text_score * weights.get("text", 0) +
            audio_score * weights.get("audio", 0) +
            visual_score * weights.get("visual", 0)
        )
        
        return {
            "communication_score": communication_score,
            "text_expression": text_score,
            "audio_expression": audio_score,
            "visual_expression": visual_score,
            "detailed_analysis": {
                "clarity": self._assess_clarity(text),
                "structure": self._assess_structure(text),
                "engagement": self._assess_engagement(text)
            }
        }
    
    def _assess_text_expression(self, text: str) -> float:
        """评估文本表达能力"""
        # 语言流畅性
        fluency_score = self._calculate_fluency(text)
        
        # 逻辑结构
        structure_score = self._calculate_structure(text)
        
        # 表达清晰度
        clarity_score = self._calculate_clarity(text)
        
        # 词汇丰富度
        vocabulary_score = self._calculate_vocabulary_richness(text)
        
        return (fluency_score + structure_score + clarity_score + vocabulary_score) / 4
    
    def _calculate_fluency(self, text: str) -> float:
        """计算语言流畅性"""
        sentences = re.split(r'[。！？]', text)
        sentences = [s.strip() for s in sentences if s.strip()]
        
        if not sentences:
            return 0
        
        # 句子长度分布
        sentence_lengths = [len(s) for s in sentences]
        avg_length = np.mean(sentence_lengths)
        length_variance = np.var(sentence_lengths)
        
        # 理想句子长度为15-25字
        length_score = max(0, 100 - abs(avg_length - 20) * 2)
        
        # 句子长度变化合理性（不宜过于单调或过于跳跃）
        variance_score = max(0, 100 - length_variance)
        
        return (length_score + variance_score) / 2
    
    def _calculate_structure(self, text: str) -> float:
        """计算逻辑结构得分"""
        structure_indicators = {
            "开头": ["首先", "第一", "开始", "起初", "最初"],
            "过程": ["然后", "接着", "其次", "随后", "进而", "同时"],
            "结论": ["最后", "总之", "综上", "因此", "所以", "总结"]
        }
        
        structure_score = 0
        for category, indicators in structure_indicators.items():
            if any(indicator in text for indicator in indicators):
                structure_score += 33.33
        
        return min(100, structure_score)
    
    def _calculate_clarity(self, text: str) -> float:
        """计算表达清晰度"""
        # 检查是否有明确的主题
        topic_indicators = ["主要", "核心", "关键", "重点", "重要", "主题"]
        topic_score = 20 if any(indicator in text for indicator in topic_indicators) else 0
        
        # 检查是否有具体例子
        example_indicators = ["例如", "比如", "举例", "具体", "实际", "案例"]
        example_score = 30 if any(indicator in text for indicator in example_indicators) else 0
        
        # 检查是否有数据支撑
        data_patterns = [r'\d+%', r'\d+倍', r'\d+个', r'\d+项', r'\d+年']
        data_score = 25 if any(re.search(pattern, text) for pattern in data_patterns) else 0
        
        # 检查表达的完整性
        completeness_score = 25 if len(text) > 50 else len(text) / 2
        
        return topic_score + example_score + data_score + completeness_score
    
    def _calculate_vocabulary_richness(self, text: str) -> float:
        """计算词汇丰富度"""
        words = list(jieba.cut(text))
        words = [w for w in words if len(w) > 1]  # 过滤单字词
        
        if not words:
            return 0
        
        # 词汇多样性（不重复词汇比例）
        unique_words = set(words)
        diversity_ratio = len(unique_words) / len(words)
        
        # 词汇复杂度（长词汇比例）
        complex_words = [w for w in words if len(w) >= 3]
        complexity_ratio = len(complex_words) / len(words)
        
        return (diversity_ratio * 60 + complexity_ratio * 40)
    
    def _assess_audio_expression(self, audio_data: Dict) -> float:
        """评估语音表达"""
        if not audio_data:
            return 0
        
        clarity = audio_data.get("speech_clarity", 0)
        speed = audio_data.get("speech_speed", 180)
        emotion = audio_data.get("emotion_score", 0)
        
        # 语速评估（理想语速180字/分钟）
        speed_score = max(0, 100 - abs(speed - 180) / 2)
        
        return (clarity + speed_score + emotion) / 3
    
    def _assess_visual_expression(self, video_data: Dict) -> float:
        """评估视觉表达"""
        if not video_data:
            return 0
        
        eye_contact = video_data.get("eye_contact_score", 0)
        expression = video_data.get("facial_expression_score", 0)
        posture = video_data.get("posture_score", 0)
        
        return (eye_contact + expression + posture) / 3
    
    def _assess_clarity(self, text: str) -> float:
        """评估表达清晰度"""
        return self._calculate_clarity(text)
    
    def _assess_structure(self, text: str) -> float:
        """评估结构性"""
        return self._calculate_structure(text)
    
    def _assess_engagement(self, text: str) -> float:
        """评估吸引力"""
        engagement_indicators = [
            "有趣", "吸引", "精彩", "生动", "形象", "具体",
            "问题", "思考", "探讨", "分析", "深入"
        ]
        
        engagement_count = sum(1 for indicator in engagement_indicators if indicator in text)
        return min(100, engagement_count * 15)

class LogicalThinkingAssessor:
    """逻辑思维能力评估器"""
    
    def assess_logical_thinking(self, text: str, question: str = "") -> Dict[str, Any]:
        """评估逻辑思维能力"""
        # 逻辑结构分析
        structure_score = self._analyze_logical_structure(text)
        
        # 因果关系分析
        causality_score = self._analyze_causality(text)
        
        # 论证完整性
        argumentation_score = self._analyze_argumentation(text)
        
        # 问题解决思路
        problem_solving_score = self._analyze_problem_solving(text, question)
        
        # 综合逻辑思维得分
        logical_score = (
            structure_score * 0.3 +
            causality_score * 0.25 +
            argumentation_score * 0.25 +
            problem_solving_score * 0.2
        )
        
        return {
            "logical_thinking_score": logical_score,
            "structure_analysis": structure_score,
            "causality_analysis": causality_score,
            "argumentation_completeness": argumentation_score,
            "problem_solving_approach": problem_solving_score,
            "detailed_breakdown": {
                "logical_connectors": self._count_logical_connectors(text),
                "reasoning_depth": self._assess_reasoning_depth(text),
                "conclusion_validity": self._assess_conclusion_validity(text)
            }
        }
    
    def _analyze_logical_structure(self, text: str) -> float:
        """分析逻辑结构"""
        # STAR结构检测
        star_indicators = {
            "Situation": ["情况", "背景", "场景", "环境", "当时"],
            "Task": ["任务", "目标", "要求", "需要", "职责"],
            "Action": ["行动", "做法", "方法", "措施", "步骤", "实施"],
            "Result": ["结果", "效果", "成果", "收获", "总结"]
        }
        
        star_score = 0
        for category, indicators in star_indicators.items():
            if any(indicator in text for indicator in indicators):
                star_score += 25
        
        # 总分结构检测
        summary_indicators = ["总的来说", "综合", "整体", "全面", "总结"]
        summary_score = 20 if any(indicator in text for indicator in summary_indicators) else 0
        
        return min(100, star_score + summary_score)
    
    def _analyze_causality(self, text: str) -> float:
        """分析因果关系"""
        causality_indicators = [
            "因为", "由于", "因此", "所以", "导致", "造成", "引起",
            "结果", "影响", "带来", "产生", "形成", "促使"
        ]
        
        causality_count = sum(1 for indicator in causality_indicators if indicator in text)
        return min(100, causality_count * 15)
    
    def _analyze_argumentation(self, text: str) -> float:
        """分析论证完整性"""
        # 论点
        viewpoint_indicators = ["认为", "观点", "看法", "主张", "立场"]
        viewpoint_score = 30 if any(indicator in text for indicator in viewpoint_indicators) else 0
        
        # 论据
        evidence_indicators = ["数据", "事实", "证据", "研究", "调查", "统计", "报告"]
        evidence_score = 40 if any(indicator in text for indicator in evidence_indicators) else 0
        
        # 论证过程
        reasoning_indicators = ["分析", "推理", "证明", "说明", "解释", "阐述"]
        reasoning_score = 30 if any(indicator in text for indicator in reasoning_indicators) else 0
        
        return viewpoint_score + evidence_score + reasoning_score
    
    def _analyze_problem_solving(self, text: str, question: str) -> float:
        """分析问题解决思路"""
        # 问题识别
        problem_indicators = ["问题", "挑战", "困难", "障碍", "瓶颈"]
        problem_score = 25 if any(indicator in text for indicator in problem_indicators) else 0
        
        # 解决方案
        solution_indicators = ["解决", "方案", "办法", "策略", "措施", "方法"]
        solution_score = 35 if any(indicator in text for indicator in solution_indicators) else 0
        
        # 实施步骤
        step_indicators = ["步骤", "阶段", "过程", "流程", "计划", "安排"]
        step_score = 25 if any(indicator in text for indicator in step_indicators) else 0
        
        # 效果评估
        evaluation_indicators = ["评估", "检验", "验证", "测试", "效果", "结果"]
        evaluation_score = 15 if any(indicator in text for indicator in evaluation_indicators) else 0
        
        return problem_score + solution_score + step_score + evaluation_score
    
    def _count_logical_connectors(self, text: str) -> int:
        """统计逻辑连接词"""
        connectors = [
            "首先", "其次", "然后", "最后", "另外", "此外", "同时",
            "但是", "然而", "不过", "虽然", "尽管", "即使",
            "因此", "所以", "由此", "综上", "总之"
        ]
        
        return sum(1 for connector in connectors if connector in text)
    
    def _assess_reasoning_depth(self, text: str) -> float:
        """评估推理深度"""
        depth_indicators = [
            "深入", "深层", "根本", "本质", "核心", "关键",
            "进一步", "更深", "详细", "具体", "全面"
        ]
        
        depth_count = sum(1 for indicator in depth_indicators if indicator in text)
        return min(100, depth_count * 12)
    
    def _assess_conclusion_validity(self, text: str) -> float:
        """评估结论有效性"""
        conclusion_indicators = ["结论", "总结", "综上", "因此", "最终", "总的来说"]
        
        has_conclusion = any(indicator in text for indicator in conclusion_indicators)
        if not has_conclusion:
            return 0
        
        # 检查结论是否有支撑
        support_indicators = ["基于", "根据", "通过", "经过", "证明", "表明"]
        has_support = any(indicator in text for indicator in support_indicators)
        
        return 100 if has_support else 60

class LearningAbilityAssessor:
    """学习能力评估器"""

    def assess_learning_ability(self, text: str, domain: str) -> Dict[str, Any]:
        """评估学习能力"""
        # 知识更新意识
        update_awareness_score = self._assess_update_awareness(text)

        # 学习方法论
        learning_methodology_score = self._assess_learning_methodology(text)

        # 知识迁移能力
        knowledge_transfer_score = self._assess_knowledge_transfer(text, domain)

        # 自我反思能力
        self_reflection_score = self._assess_self_reflection(text)

        # 综合学习能力得分
        learning_score = (
            update_awareness_score * 0.3 +
            learning_methodology_score * 0.3 +
            knowledge_transfer_score * 0.25 +
            self_reflection_score * 0.15
        )

        return {
            "learning_ability_score": learning_score,
            "update_awareness": update_awareness_score,
            "learning_methodology": learning_methodology_score,
            "knowledge_transfer": knowledge_transfer_score,
            "self_reflection": self_reflection_score,
            "learning_indicators": {
                "curiosity_level": self._assess_curiosity(text),
                "adaptability": self._assess_adaptability(text),
                "growth_mindset": self._assess_growth_mindset(text)
            }
        }

    def _assess_update_awareness(self, text: str) -> float:
        """评估知识更新意识"""
        update_indicators = [
            "最新", "新技术", "新方法", "更新", "升级", "发展", "趋势",
            "前沿", "先进", "创新", "改进", "优化", "演进", "变化"
        ]

        time_indicators = [
            "近期", "最近", "当前", "现在", "目前", "今年", "未来",
            "2023", "2024", "新版本", "最新版"
        ]

        update_count = sum(1 for indicator in update_indicators if indicator in text)
        time_count = sum(1 for indicator in time_indicators if indicator in text)

        return min(100, (update_count * 12 + time_count * 8))

    def _assess_learning_methodology(self, text: str) -> float:
        """评估学习方法论"""
        method_indicators = [
            "学习", "研究", "探索", "实践", "练习", "总结", "反思",
            "阅读", "文档", "教程", "课程", "培训", "经验", "积累"
        ]

        systematic_indicators = [
            "系统", "体系", "框架", "结构", "计划", "步骤", "方法论",
            "理论", "实践", "结合", "循序渐进", "由浅入深"
        ]

        method_count = sum(1 for indicator in method_indicators if indicator in text)
        systematic_count = sum(1 for indicator in systematic_indicators if indicator in text)

        return min(100, (method_count * 8 + systematic_count * 12))

    def _assess_knowledge_transfer(self, text: str, domain: str) -> float:
        """评估知识迁移能力"""
        # 跨领域思维
        cross_domain_indicators = [
            "类似", "相似", "借鉴", "参考", "迁移", "应用", "结合",
            "融合", "整合", "综合", "关联", "联系", "对比", "比较"
        ]

        # 抽象思维
        abstract_indicators = [
            "抽象", "概念", "模式", "规律", "原理", "本质", "核心",
            "通用", "普遍", "一般", "共同", "基础", "底层"
        ]

        cross_count = sum(1 for indicator in cross_domain_indicators if indicator in text)
        abstract_count = sum(1 for indicator in abstract_indicators if indicator in text)

        return min(100, (cross_count * 15 + abstract_count * 10))

    def _assess_self_reflection(self, text: str) -> float:
        """评估自我反思能力"""
        reflection_indicators = [
            "反思", "总结", "回顾", "思考", "认识", "理解", "感悟",
            "收获", "体会", "经验", "教训", "不足", "改进", "提升"
        ]

        self_awareness_indicators = [
            "我认为", "我觉得", "我发现", "我意识到", "我学到",
            "我的理解", "我的看法", "我的经验", "我需要", "我应该"
        ]

        reflection_count = sum(1 for indicator in reflection_indicators if indicator in text)
        awareness_count = sum(1 for indicator in self_awareness_indicators if indicator in text)

        return min(100, (reflection_count * 12 + awareness_count * 8))

    def _assess_curiosity(self, text: str) -> float:
        """评估好奇心水平"""
        curiosity_indicators = [
            "为什么", "如何", "怎样", "原因", "机制", "原理",
            "探索", "发现", "研究", "了解", "深入", "详细"
        ]

        question_patterns = [r'\?', r'？', r'疑问', r'困惑', r'想知道']

        curiosity_count = sum(1 for indicator in curiosity_indicators if indicator in text)
        question_count = sum(1 for pattern in question_patterns if re.search(pattern, text))

        return min(100, (curiosity_count * 10 + question_count * 15))

    def _assess_adaptability(self, text: str) -> float:
        """评估适应性"""
        adaptability_indicators = [
            "适应", "调整", "改变", "灵活", "变通", "应对", "处理",
            "面对", "应变", "转换", "切换", "多样", "不同", "各种"
        ]

        adaptability_count = sum(1 for indicator in adaptability_indicators if indicator in text)
        return min(100, adaptability_count * 12)

    def _assess_growth_mindset(self, text: str) -> float:
        """评估成长型思维"""
        growth_indicators = [
            "成长", "进步", "提升", "发展", "改善", "完善", "突破",
            "挑战", "机会", "可能", "潜力", "努力", "坚持", "持续"
        ]

        fixed_mindset_indicators = [
            "不可能", "做不到", "太难", "不会", "不行", "没办法"
        ]

        growth_count = sum(1 for indicator in growth_indicators if indicator in text)
        fixed_count = sum(1 for indicator in fixed_mindset_indicators if indicator in text)

        return min(100, max(0, growth_count * 10 - fixed_count * 15))

class StressResistanceAssessor:
    """抗压能力评估器"""

    def assess_stress_resistance(self, text: str, audio_data: Dict = None, video_data: Dict = None) -> Dict[str, Any]:
        """评估抗压能力"""
        # 文本情绪稳定性
        text_stability_score = self._assess_text_emotional_stability(text)

        # 语音稳定性
        audio_stability_score = self._assess_audio_stability(audio_data) if audio_data else 0

        # 视觉稳定性
        visual_stability_score = self._assess_visual_stability(video_data) if video_data else 0

        # 压力应对策略
        coping_strategy_score = self._assess_coping_strategies(text)

        # 综合抗压能力得分
        weights = {"text": 0.4, "audio": 0.3, "visual": 0.2, "coping": 0.1}
        if not audio_data:
            weights = {"text": 0.5, "visual": 0.3, "coping": 0.2}
        if not video_data:
            weights = {"text": 0.5, "audio": 0.4, "coping": 0.1}
        if not audio_data and not video_data:
            weights = {"text": 0.7, "coping": 0.3}

        stress_resistance_score = (
            text_stability_score * weights["text"] +
            audio_stability_score * weights.get("audio", 0) +
            visual_stability_score * weights.get("visual", 0) +
            coping_strategy_score * weights["coping"]
        )

        return {
            "stress_resistance_score": stress_resistance_score,
            "emotional_stability": text_stability_score,
            "audio_stability": audio_stability_score,
            "visual_stability": visual_stability_score,
            "coping_strategies": coping_strategy_score,
            "stress_indicators": {
                "confidence_level": self._assess_confidence(text),
                "composure": self._assess_composure(text),
                "resilience": self._assess_resilience(text)
            }
        }

    def _assess_text_emotional_stability(self, text: str) -> float:
        """评估文本情绪稳定性"""
        # 积极情绪词汇
        positive_emotions = [
            "自信", "乐观", "积极", "正面", "良好", "顺利", "成功",
            "满意", "高兴", "开心", "兴奋", "期待", "希望", "相信"
        ]

        # 消极情绪词汇
        negative_emotions = [
            "紧张", "焦虑", "担心", "害怕", "恐惧", "压力", "困难",
            "失败", "挫折", "沮丧", "失望", "无助", "绝望", "痛苦"
        ]

        # 中性/稳定词汇
        stable_emotions = [
            "冷静", "平静", "稳定", "理性", "客观", "中性", "平衡",
            "控制", "管理", "处理", "应对", "解决", "面对", "接受"
        ]

        positive_count = sum(1 for emotion in positive_emotions if emotion in text)
        negative_count = sum(1 for emotion in negative_emotions if emotion in text)
        stable_count = sum(1 for emotion in stable_emotions if emotion in text)

        # 情绪稳定性得分
        stability_score = (positive_count * 8 + stable_count * 10 - negative_count * 5)
        return min(100, max(0, stability_score))

    def _assess_audio_stability(self, audio_data: Dict) -> float:
        """评估语音稳定性"""
        if not audio_data:
            return 0

        # 语速稳定性
        speed = audio_data.get("speech_speed", 180)
        speed_stability = max(0, 100 - abs(speed - 180) / 2)

        # 情绪稳定性
        emotion_score = audio_data.get("emotion_score", 50)
        emotion_stability = min(100, emotion_score)

        # 停顿频率（过多停顿可能表示紧张）
        pause_frequency = audio_data.get("pause_frequency", 0)
        pause_score = max(0, 100 - pause_frequency * 10)

        return (speed_stability + emotion_stability + pause_score) / 3

    def _assess_visual_stability(self, video_data: Dict) -> float:
        """评估视觉稳定性"""
        if not video_data:
            return 0

        # 眼神交流稳定性
        eye_contact = video_data.get("eye_contact_score", 0)

        # 面部表情稳定性
        facial_expression = video_data.get("facial_expression_score", 0)

        # 身体姿态稳定性
        posture = video_data.get("posture_score", 0)

        return (eye_contact + facial_expression + posture) / 3

    def _assess_coping_strategies(self, text: str) -> float:
        """评估压力应对策略"""
        coping_indicators = [
            "应对", "处理", "解决", "克服", "面对", "接受", "调整",
            "适应", "管理", "控制", "缓解", "减轻", "化解", "转化"
        ]

        strategy_indicators = [
            "方法", "策略", "技巧", "方式", "途径", "办法", "措施",
            "计划", "准备", "预案", "备选", "替代", "应急"
        ]

        coping_count = sum(1 for indicator in coping_indicators if indicator in text)
        strategy_count = sum(1 for indicator in strategy_indicators if indicator in text)

        return min(100, (coping_count * 12 + strategy_count * 8))

    def _assess_confidence(self, text: str) -> float:
        """评估自信水平"""
        confidence_indicators = [
            "自信", "确信", "肯定", "相信", "坚信", "确定", "明确",
            "能够", "可以", "会", "擅长", "熟悉", "掌握", "了解"
        ]

        uncertainty_indicators = [
            "不确定", "可能", "也许", "大概", "应该", "似乎", "好像",
            "不太", "不是很", "不够", "缺乏", "不足", "有限"
        ]

        confidence_count = sum(1 for indicator in confidence_indicators if indicator in text)
        uncertainty_count = sum(1 for indicator in uncertainty_indicators if indicator in text)

        return min(100, max(0, confidence_count * 10 - uncertainty_count * 5))

    def _assess_composure(self, text: str) -> float:
        """评估镇定程度"""
        composure_indicators = [
            "冷静", "镇定", "沉着", "稳重", "从容", "淡定", "理性",
            "客观", "分析", "思考", "考虑", "评估", "判断", "决策"
        ]

        composure_count = sum(1 for indicator in composure_indicators if indicator in text)
        return min(100, composure_count * 15)

    def _assess_resilience(self, text: str) -> float:
        """评估韧性"""
        resilience_indicators = [
            "坚持", "坚韧", "毅力", "恒心", "持续", "继续", "不放弃",
            "重新", "再次", "重来", "恢复", "反弹", "振作", "重振"
        ]

        resilience_count = sum(1 for indicator in resilience_indicators if indicator in text)
        return min(100, resilience_count * 12)

class TeamworkAssessor:
    """团队协作能力评估器"""

    def assess_teamwork_ability(self, text: str, video_data: Dict = None) -> Dict[str, Any]:
        """评估团队协作能力"""
        # 协作意识
        collaboration_awareness_score = self._assess_collaboration_awareness(text)

        # 沟通协调能力
        coordination_score = self._assess_coordination_ability(text)

        # 角色适应性
        role_adaptability_score = self._assess_role_adaptability(text)

        # 冲突处理能力
        conflict_resolution_score = self._assess_conflict_resolution(text)

        # 视觉协作表现
        visual_collaboration_score = self._assess_visual_collaboration(video_data) if video_data else 0

        # 综合团队协作得分
        weights = {"awareness": 0.3, "coordination": 0.25, "adaptability": 0.2, "conflict": 0.15, "visual": 0.1}
        if not video_data:
            weights = {"awareness": 0.35, "coordination": 0.3, "adaptability": 0.2, "conflict": 0.15}

        teamwork_score = (
            collaboration_awareness_score * weights["awareness"] +
            coordination_score * weights["coordination"] +
            role_adaptability_score * weights["adaptability"] +
            conflict_resolution_score * weights["conflict"] +
            visual_collaboration_score * weights.get("visual", 0)
        )

        return {
            "teamwork_score": teamwork_score,
            "collaboration_awareness": collaboration_awareness_score,
            "coordination_ability": coordination_score,
            "role_adaptability": role_adaptability_score,
            "conflict_resolution": conflict_resolution_score,
            "visual_collaboration": visual_collaboration_score,
            "teamwork_indicators": {
                "empathy": self._assess_empathy(text),
                "leadership": self._assess_leadership_potential(text),
                "support": self._assess_support_behavior(text)
            }
        }

    def _assess_collaboration_awareness(self, text: str) -> float:
        """评估协作意识"""
        collaboration_indicators = [
            "团队", "协作", "合作", "配合", "协调", "共同", "一起",
            "集体", "大家", "我们", "彼此", "相互", "互相", "共享"
        ]

        individual_indicators = [
            "我", "自己", "个人", "独自", "单独", "独立", "私人"
        ]

        collaboration_count = sum(1 for indicator in collaboration_indicators if indicator in text)
        individual_count = sum(1 for indicator in individual_indicators if indicator in text)

        # 协作意识得分（协作词汇加分，个人词汇适度减分）
        awareness_score = collaboration_count * 8 - individual_count * 2
        return min(100, max(0, awareness_score))

    def _assess_coordination_ability(self, text: str) -> float:
        """评估沟通协调能力"""
        coordination_indicators = [
            "沟通", "交流", "讨论", "商量", "协商", "对话", "联系",
            "反馈", "汇报", "通知", "告知", "分享", "传达", "表达"
        ]

        coordination_count = sum(1 for indicator in coordination_indicators if indicator in text)
        return min(100, coordination_count * 12)

    def _assess_role_adaptability(self, text: str) -> float:
        """评估角色适应性"""
        role_indicators = [
            "角色", "职责", "任务", "分工", "负责", "承担", "担任",
            "领导", "跟随", "支持", "配合", "辅助", "协助", "帮助"
        ]

        adaptability_indicators = [
            "适应", "调整", "灵活", "变通", "转换", "切换", "改变",
            "根据", "按照", "依据", "结合", "考虑", "兼顾"
        ]

        role_count = sum(1 for indicator in role_indicators if indicator in text)
        adaptability_count = sum(1 for indicator in adaptability_indicators if indicator in text)

        return min(100, (role_count * 8 + adaptability_count * 10))

    def _assess_conflict_resolution(self, text: str) -> float:
        """评估冲突处理能力"""
        conflict_indicators = [
            "冲突", "分歧", "争议", "矛盾", "问题", "困难", "挑战"
        ]

        resolution_indicators = [
            "解决", "处理", "化解", "调解", "协调", "平衡", "妥协",
            "理解", "包容", "接受", "尊重", "倾听", "考虑"
        ]

        conflict_count = sum(1 for indicator in conflict_indicators if indicator in text)
        resolution_count = sum(1 for indicator in resolution_indicators if indicator in text)

        # 如果提到冲突但没有解决方案，得分较低
        if conflict_count > 0 and resolution_count == 0:
            return 30
        elif conflict_count > 0 and resolution_count > 0:
            return min(100, resolution_count * 20)
        else:
            return min(100, resolution_count * 15)

    def _assess_visual_collaboration(self, video_data: Dict) -> float:
        """评估视觉协作表现"""
        if not video_data:
            return 0

        # 眼神交流（重要的协作信号）
        eye_contact = video_data.get("eye_contact_score", 0)

        # 手势得体性（协作中的非语言沟通）
        gesture = video_data.get("gesture_appropriateness", 0)

        # 面部表情（友好、开放的表情有利于协作）
        expression = video_data.get("facial_expression_score", 0)

        return (eye_contact * 0.4 + gesture * 0.3 + expression * 0.3)

    def _assess_empathy(self, text: str) -> float:
        """评估同理心"""
        empathy_indicators = [
            "理解", "体谅", "同情", "关心", "关注", "考虑", "顾及",
            "换位", "站在", "角度", "立场", "感受", "想法", "需要"
        ]

        empathy_count = sum(1 for indicator in empathy_indicators if indicator in text)
        return min(100, empathy_count * 12)

    def _assess_leadership_potential(self, text: str) -> float:
        """评估领导潜力"""
        leadership_indicators = [
            "领导", "带领", "指导", "引导", "组织", "安排", "规划",
            "决策", "决定", "负责", "承担", "推动", "促进", "激励"
        ]

        leadership_count = sum(1 for indicator in leadership_indicators if indicator in text)
        return min(100, leadership_count * 10)

    def _assess_support_behavior(self, text: str) -> float:
        """评估支持行为"""
        support_indicators = [
            "支持", "帮助", "协助", "辅助", "配合", "支援", "援助",
            "鼓励", "激励", "赞同", "认同", "肯定", "赞赏", "表扬"
        ]

        support_count = sum(1 for indicator in support_indicators if indicator in text)
        return min(100, support_count * 10)

# 全局服务实例
professional_skill_assessor = ProfessionalSkillAssessor()
communication_assessor = CommunicationAssessor()
logical_thinking_assessor = LogicalThinkingAssessor()
learning_ability_assessor = LearningAbilityAssessor()
stress_resistance_assessor = StressResistanceAssessor()
teamwork_assessor = TeamworkAssessor()
