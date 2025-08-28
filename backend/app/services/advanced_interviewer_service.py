"""
高级AI面试官服务
专门解决AI分析思路深度不足和缺乏针对性引导的问题
"""

import re
from typing import Dict, List, Any, Optional, Tuple
from ..core.config import settings

class AdvancedInterviewerService:
    """高级AI面试官服务"""
    
    def __init__(self):
        self.technical_knowledge_base = self._load_technical_knowledge_base()
        self.guidance_strategies = self._load_guidance_strategies()
        self.analysis_frameworks = self._load_analysis_frameworks()
    
    def _load_technical_knowledge_base(self) -> Dict[str, Dict]:
        """加载技术知识库"""
        return {
            "Kubernetes": {
                "core_concepts": [
                    "Pod生命周期管理", "Service网络配置", "ConfigMap和Secret管理",
                    "Deployment版本控制", "Ingress流量管理", "PersistentVolume存储"
                ],
                "ml_deployment": {
                    "version_control_metrics": [
                        "模型版本标签(model version tags)",
                        "容器镜像版本(container image versions)", 
                        "配置文件版本(config file versions)",
                        "依赖库版本(dependency versions)",
                        "数据版本(data versions)"
                    ],
                    "monitoring_aspects": [
                        "模型性能指标(accuracy, latency)",
                        "资源使用率(CPU, Memory, GPU)",
                        "请求响应时间(response time)",
                        "错误率和异常监控(error rate)",
                        "模型漂移检测(model drift)"
                    ],
                    "best_practices": [
                        "使用Helm Charts管理部署配置",
                        "实施蓝绿部署或金丝雀发布",
                        "配置健康检查和就绪探针",
                        "设置资源限制和请求",
                        "实现日志聚合和监控告警"
                    ]
                }
            },
            "机器学习算法": {
                "core_categories": [
                    "监督学习(分类、回归)", "无监督学习(聚类、降维)",
                    "强化学习", "深度学习", "集成学习"
                ],
                "practical_aspects": [
                    "数据预处理和特征工程",
                    "模型选择和超参数调优",
                    "交叉验证和模型评估",
                    "过拟合和欠拟合处理",
                    "模型部署和监控"
                ],
                "project_examples": [
                    "推荐系统：协同过滤 + 深度学习",
                    "图像识别：CNN + 迁移学习",
                    "自然语言处理：Transformer + 预训练模型",
                    "时间序列预测：LSTM + 注意力机制",
                    "异常检测：孤立森林 + 自编码器"
                ]
            }
        }
    
    def _load_guidance_strategies(self) -> Dict[str, Dict]:
        """加载引导策略 - 增强版本"""
        return {
            "request_answer": {
                "detection_patterns": [
                    r"请给出.*答案", r"正确答案是什么", r"告诉我答案",
                    r"应该怎么.*", r"标准答案", r"参考答案",
                    r"能否告诉我", r"请指导", r"请教"
                ],
                "response_strategy": "provide_technical_guidance",
                "approach": "提供技术指导和分步解析"
            },
            "express_unknown": {
                "detection_patterns": [
                    r"不知道", r"不清楚", r"没有经验", r"不了解",
                    r"不会", r"没做过", r"不太懂", r"不确定",
                    r"完全不懂", r"一点都不知道", r"从来没接触过"
                ],
                "response_strategy": "provide_hints_and_examples",
                "approach": "提供提示、示例和引导性问题"
            },
            "partial_knowledge": {
                "detection_patterns": [
                    r"有一些了解", r"听说过", r"大概知道", r"可能是",
                    r"应该是", r"我觉得", r"可能", r"似乎", r"大概"
                ],
                "response_strategy": "build_on_existing_knowledge",
                "approach": "基于现有知识进行扩展和深化"
            },
            "confident_answer": {
                "detection_patterns": [],  # 通过质量分析判断，不依赖关键词
                "response_strategy": "deep_technical_discussion",
                "approach": "进行深入的技术讨论和挑战性追问"
            }
        }
    
    def _load_analysis_frameworks(self) -> Dict[str, List[str]]:
        """加载分析框架"""
        return {
            "technical_depth_analysis": [
                "技术背景和应用场景分析",
                "核心技术要点和关键概念",
                "实际应用中的挑战和解决方案",
                "行业最佳实践和标准",
                "技能要求和能力评估标准"
            ],
            "candidate_assessment": [
                "理论知识掌握程度",
                "实践经验丰富度",
                "问题解决能力",
                "技术思维逻辑性",
                "学习能力和适应性"
            ],
            "question_design_rationale": [
                "问题设计的技术考量",
                "考察的核心能力维度",
                "难度设置的合理性",
                "与岗位要求的匹配度",
                "后续追问的方向"
            ]
        }
    
    def generate_deep_analysis(self, question: str, domain: str, position: str,
                             question_metadata: Dict = None) -> str:
        """生成深度的AI分析思路"""

        # 提取问题中的关键技术概念
        key_concepts = self._extract_key_concepts(question)

        # 获取相关技术知识
        technical_context = self._get_technical_context(key_concepts, domain)

        # 生成自然的深度分析
        analysis = f"""作为一位在{domain}领域工作了15年的技术面试官，让我分析一下这个问题。

从技术角度来看，{self._analyze_technical_background(question, key_concepts, technical_context)}

我选择这个问题是因为{self._analyze_question_design(question, domain, position, question_metadata)}

通过这个问题，我主要想了解候选人的几个方面：{self._analyze_assessment_focus(question, position, question_metadata)}

我会从这些维度来评估回答的质量：{self._define_evaluation_criteria(question, key_concepts, position)}

理想的回答应该包含：{self._outline_expected_answer_framework(question, key_concepts, technical_context)}

根据候选人的回答情况，我会采用不同的追问策略：{self._plan_follow_up_strategy(question, domain, position)}"""

        return analysis
    
    def analyze_candidate_response(self, user_response: str, original_question: str, 
                                 domain: str, position: str) -> Dict[str, Any]:
        """分析候选人回答并确定引导策略"""
        
        # 检测回答类型
        response_type = self._detect_response_type(user_response)
        
        # 提取原问题的关键概念
        key_concepts = self._extract_key_concepts(original_question)
        
        # 获取技术上下文
        technical_context = self._get_technical_context(key_concepts, domain)
        
        return {
            "response_type": response_type,
            "key_concepts": key_concepts,
            "technical_context": technical_context,
            "guidance_strategy": self.guidance_strategies[response_type],
            "needs_technical_guidance": response_type == "request_answer",
            "needs_hints": response_type == "express_unknown",
            "can_build_on": response_type == "partial_knowledge"
        }
    
    def generate_technical_guidance(self, original_question: str, key_concepts: List[str],
                                  technical_context: Dict, domain: str) -> str:
        """生成技术指导内容"""

        guidance = f"""好的，让我来为您详细解析这个技术问题。

首先，{self._explain_question_core(original_question, key_concepts)}

{self._explain_key_concepts(key_concepts, technical_context)}

让我给您举个实际的例子：{self._provide_practical_scenarios(key_concepts, technical_context)}

如果我们要解决这个问题，我建议按照这样的思路来思考：
{self._provide_step_by_step_approach(original_question, key_concepts, technical_context)}

在实际工作中，我们通常会遵循这些最佳实践：
{self._provide_best_practices(key_concepts, technical_context)}

基于我们刚才的讨论，我建议您可以重点关注：{self._suggest_learning_areas(key_concepts, domain)}

现在，您觉得从哪个角度开始比较容易入手？我们可以一步步来探讨。"""

        return guidance
    
    def generate_hint_based_guidance(self, original_question: str, key_concepts: List[str],
                                   technical_context: Dict, domain: str) -> str:
        """生成基于提示的引导"""

        guidance = f"""没关系，这个问题确实有一定的技术深度。让我换个角度来帮助您思考。

我们可以先把这个问题简化一下：{self._simplify_question(original_question, key_concepts)}

给您几个思考的方向：
{self._provide_key_hints(key_concepts, technical_context)}

{self._provide_analogies(key_concepts, domain)}

或者我们可以从这些角度来思考：
{self._generate_leading_questions(original_question, key_concepts)}

在实际工作中，{self._provide_real_world_examples(key_concepts, technical_context)}

您看，从这些提示中，有没有哪个方面是您比较熟悉或者感兴趣的？我们可以从那里开始聊。"""

        return guidance
    
    def _detect_response_type(self, user_response: str) -> str:
        """检测用户回答类型 - 增强版本，优先考虑技术内容质量"""
        if not user_response or len(user_response.strip()) < 10:
            return "express_unknown"

        response_lower = user_response.lower()

        # 1. 优先分析技术内容质量
        technical_quality = self._analyze_technical_content_quality(user_response)

        # 2. 检查明确的请求答案表达
        request_patterns = [
            r"请给出.*答案", r"正确答案是什么", r"告诉我答案",
            r"应该怎么.*", r"标准答案", r"参考答案",
            r"能否告诉我", r"请指导", r"请教",
            r"能否给出", r"给出.*解决方案", r"标准.*解决方案"
        ]

        for pattern in request_patterns:
            if re.search(pattern, response_lower):
                return "request_answer"

        # 3. 检查明确的"不知道"表达，但要结合技术内容质量
        unknown_patterns = [
            r"不知道", r"不清楚", r"没有经验", r"不了解",
            r"不会", r"没做过", r"不太懂", r"不确定",
            r"完全不懂", r"一点都不知道", r"从来没接触过"
        ]

        unknown_count = sum(1 for pattern in unknown_patterns if re.search(pattern, response_lower))

        # 4. 检查部分知识表达
        partial_patterns = [
            r"有一些了解", r"听说过", r"大概知道", r"可能是",
            r"应该是", r"我觉得", r"可能", r"似乎", r"大概"
        ]

        partial_count = sum(1 for pattern in partial_patterns if re.search(pattern, response_lower))

        # 5. 智能综合判断 - 技术内容质量优先
        # 如果包含大量技术内容，即使有"不知道"等词汇，也可能是专业回答
        if technical_quality["has_technical_terms"] and technical_quality["word_count"] > 100:
            if technical_quality["confidence_score"] > 0.6 and technical_quality["technical_word_count"] > 3:
                # 高质量技术回答，即使包含不确定表达也认为是专业回答
                return "confident_answer"
            elif technical_quality["confidence_score"] > 0.4:
                return "partial_knowledge"

        # 6. 对于较短但技术密度高的回答
        if (technical_quality["technical_density"] > 0.05 and
            technical_quality["technical_word_count"] > 2 and
            technical_quality["word_count"] > 50):
            return "confident_answer"

        # 7. 传统关键词判断（降低优先级）
        if unknown_count >= 2 and not technical_quality["has_technical_terms"]:
            return "express_unknown"
        elif partial_count > 0:
            return "partial_knowledge"
        elif unknown_count > 0 and technical_quality["word_count"] < 50:
            return "express_unknown"
        else:
            # 默认情况：根据内容长度和质量判断
            if technical_quality["word_count"] > 80 and technical_quality["has_technical_terms"]:
                return "confident_answer"
            else:
                return "partial_knowledge"

    def validate_response_classification(self, user_response: str, initial_classification: str,
                                       domain: str) -> Dict[str, Any]:
        """验证回答分类的准确性，防止误判 - 增强版本"""

        # 获取技术内容质量分析
        quality_analysis = self._analyze_technical_content_quality(user_response)

        # 检查是否可能存在误判
        potential_misjudgment = False
        corrected_classification = initial_classification
        confidence = 1.0
        validation_reason = "分类准确，无需调整"

        # 情况1：被误判为"不知道"的专业回答（重点修复）
        if initial_classification == "express_unknown":
            # 强化专业回答识别条件
            if (quality_analysis["has_technical_terms"] and
                quality_analysis["word_count"] > 80 and
                (quality_analysis["technical_density"] > 0.02 or
                 quality_analysis["technical_word_count"] > 2 or
                 quality_analysis["professional_indicators"] > 3)):

                potential_misjudgment = True
                corrected_classification = "confident_answer"
                confidence = 0.9
                validation_reason = f"检测到高质量技术回答：{quality_analysis['technical_word_count']}个技术术语，{quality_analysis['professional_indicators']}个专业指标"

            # 检查是否包含详细技术解释
            elif quality_analysis["detailed_explanation"]:
                potential_misjudgment = True
                corrected_classification = "confident_answer"
                confidence = 0.85
                validation_reason = "检测到详细的技术解释和实现步骤"

        # 情况2：被误判为"部分知识"的专业回答
        elif initial_classification == "partial_knowledge":
            if (quality_analysis["confidence_score"] > 0.6 and
                quality_analysis["technical_word_count"] > 4 and
                quality_analysis["professional_indicators"] > 5):

                corrected_classification = "confident_answer"
                confidence = 0.9
                validation_reason = f"回答质量评分{quality_analysis['confidence_score']:.2f}，包含{quality_analysis['technical_word_count']}个技术术语"

        # 情况3：被误判为"专业回答"的实际不知道（保持原有逻辑但降低误判率）
        elif initial_classification == "confident_answer":
            unknown_indicators = ["不知道", "不清楚", "没有经验", "不了解", "完全不懂"]
            unknown_count = sum(1 for indicator in unknown_indicators
                              if indicator in user_response.lower())

            # 只有在明确表达不知道且缺乏技术内容时才调整
            if (unknown_count >= 2 and
                not quality_analysis["has_technical_terms"] and
                quality_analysis["word_count"] < 100):
                potential_misjudgment = True
                corrected_classification = "express_unknown"
                confidence = 0.7
                validation_reason = "检测到明确的不知道表达且缺乏技术内容"

        # 情况4：请求答案但实际提供了技术内容
        elif initial_classification == "request_answer":
            if (quality_analysis["has_technical_terms"] and
                quality_analysis["word_count"] > 150 and
                quality_analysis["professional_indicators"] > 4):
                corrected_classification = "confident_answer"
                confidence = 0.8
                validation_reason = "虽然请求指导但实际提供了专业技术内容"

        return {
            "original_classification": initial_classification,
            "final_classification": corrected_classification,
            "potential_misjudgment": potential_misjudgment,
            "confidence": confidence,
            "quality_analysis": quality_analysis,
            "validation_reason": validation_reason,
            "recommended_strategy": self._get_recommended_strategy(corrected_classification, quality_analysis)
        }

    def _get_recommended_strategy(self, classification: str, quality_analysis: Dict) -> Dict[str, Any]:
        """根据分类结果推荐面试策略"""
        strategies = {
            "confident_answer": {
                "approach": "深度追问",
                "focus": "技术细节和实践经验",
                "next_question_type": "深入技术问题",
                "guidance_level": "minimal"
            },
            "partial_knowledge": {
                "approach": "引导式提问",
                "focus": "知识点补充和扩展",
                "next_question_type": "相关基础问题",
                "guidance_level": "moderate"
            },
            "express_unknown": {
                "approach": "教育式引导",
                "focus": "基础概念和实例",
                "next_question_type": "基础知识问题",
                "guidance_level": "high"
            },
            "request_answer": {
                "approach": "技术指导",
                "focus": "提供学习方向和资源",
                "next_question_type": "引导性问题",
                "guidance_level": "educational"
            }
        }

        base_strategy = strategies.get(classification, strategies["partial_knowledge"])

        # 根据质量分析调整策略
        if quality_analysis.get("technical_word_count", 0) > 5:
            base_strategy["technical_depth"] = "high"
        elif quality_analysis.get("technical_word_count", 0) > 2:
            base_strategy["technical_depth"] = "medium"
        else:
            base_strategy["technical_depth"] = "low"

        return base_strategy

    def _get_validation_reason(self, original: str, corrected: str,
                             quality_analysis: Dict) -> str:
        """获取验证调整的原因说明 - 增强版本"""
        if original == corrected:
            return "分类准确，无需调整"

        if original == "express_unknown" and corrected == "confident_answer":
            if quality_analysis.get("detailed_explanation", False):
                return f"检测到详细技术解释：包含{quality_analysis['technical_word_count']}个技术术语，{quality_analysis['professional_indicators']}个专业指标，回答长度{quality_analysis['word_count']}字"
            else:
                return f"检测到专业技术回答：包含{quality_analysis['technical_word_count']}个技术术语，回答长度{quality_analysis['word_count']}字，技术密度{quality_analysis['technical_density']:.3f}"

        if original == "partial_knowledge" and corrected == "confident_answer":
            return f"回答质量较高：置信度{quality_analysis['confidence_score']:.2f}，技术术语{quality_analysis['technical_word_count']}个，专业指标{quality_analysis['professional_indicators']}个"

        if original == "confident_answer" and corrected == "express_unknown":
            return "检测到明确的不知道表达且缺乏技术内容"

        if original == "request_answer" and corrected == "confident_answer":
            return f"虽然请求指导但提供了专业内容：{quality_analysis['technical_word_count']}个技术术语，{quality_analysis['professional_indicators']}个专业指标"

        return "基于内容质量分析进行调整"

    def _analyze_technical_content_quality(self, user_response: str) -> Dict[str, Any]:
        """分析回答的技术内容质量 - 增强版本"""
        if not user_response:
            return {
                "has_technical_terms": False,
                "word_count": 0,
                "confidence_score": 0.0,
                "technical_density": 0.0,
                "technical_word_count": 0,
                "professional_indicators": 0,
                "detailed_explanation": False
            }

        # 扩展的技术术语词典
        technical_terms = {
            # 大数据相关
            "hadoop", "spark", "kafka", "flink", "storm", "hbase", "hdfs", "yarn",
            "mapreduce", "streaming", "batch", "etl", "olap", "oltp", "数据仓库",
            "数据湖", "实时计算", "流处理", "批处理", "数据一致性", "分布式",
            "集群", "节点", "分片", "副本", "索引", "查询优化",

            # AI相关
            "机器学习", "深度学习", "神经网络", "算法", "模型", "训练", "推理",
            "tensorflow", "pytorch", "sklearn", "pandas", "numpy", "特征工程",
            "监督学习", "无监督学习", "强化学习", "卷积", "循环神经网络", "transformer",
            "梯度下降", "反向传播", "过拟合", "正则化", "交叉验证",

            # IoT相关
            "物联网", "传感器", "mqtt", "coap", "边缘计算", "云计算", "协议",
            "嵌入式", "微控制器", "网关", "设备管理", "zigbee", "lora", "nb-iot",

            # 容器和云原生
            "docker", "kubernetes", "k8s", "pod", "service", "deployment", "ingress",
            "configmap", "secret", "namespace", "helm", "容器化", "镜像", "版本控制",
            "蓝绿部署", "金丝雀发布", "滚动更新", "健康检查", "探针",

            # 通用技术术语
            "架构", "设计模式", "微服务", "api", "rest", "grpc", "数据库", "缓存",
            "消息队列", "负载均衡", "高可用", "容灾", "监控", "日志", "性能优化",
            "并发", "异步", "同步", "线程", "进程", "内存", "cpu", "网络"
        }

        response_lower = user_response.lower()
        # 更准确的字数统计
        clean_text = ''.join(user_response.split())
        word_count = len(clean_text)

        # 计算技术术语数量和密度
        technical_word_count = sum(1 for term in technical_terms if term in response_lower)
        technical_density = technical_word_count / max(word_count, 1) if word_count > 0 else 0

        # 检查是否包含技术术语
        has_technical_terms = technical_word_count > 0

        # 专业指标检查（更全面）
        professional_indicators = [
            len(user_response) > 150,  # 回答长度充分
            technical_density > 0.03,  # 技术术语密度合理
            technical_word_count > 3,  # 包含多个技术术语
            "实现" in response_lower or "方案" in response_lower or "解决" in response_lower,
            "系统" in response_lower or "架构" in response_lower or "设计" in response_lower,
            "配置" in response_lower or "部署" in response_lower or "运维" in response_lower,
            "监控" in response_lower or "性能" in response_lower or "优化" in response_lower,
            bool(re.search(r"[0-9]+", user_response)),  # 包含数字（技术参数）
            bool(re.search(r"[A-Za-z]+", user_response)),  # 包含英文（技术术语）
            "：" in user_response or "；" in user_response,  # 结构化表达
        ]

        professional_count = sum(1 for indicator in professional_indicators if indicator)
        confidence_score = professional_count / len(professional_indicators)

        # 检查是否包含详细解释
        detailed_explanation = (
            word_count > 200 and
            ("因为" in response_lower or "由于" in response_lower or "通过" in response_lower) and
            ("步骤" in response_lower or "流程" in response_lower or "过程" in response_lower or
             "首先" in response_lower or "然后" in response_lower or "最后" in response_lower)
        )

        return {
            "has_technical_terms": has_technical_terms,
            "word_count": word_count,
            "confidence_score": confidence_score,
            "technical_density": technical_density,
            "technical_word_count": technical_word_count,
            "professional_indicators": professional_count,
            "detailed_explanation": detailed_explanation
        }

    def _extract_key_concepts(self, question: str) -> List[str]:
        """提取问题中的关键技术概念"""
        concepts = []
        
        # 技术关键词匹配
        tech_keywords = {
            "kubernetes", "k8s", "docker", "容器", "pod", "service", "deployment",
            "机器学习", "深度学习", "算法", "模型", "训练", "预测", "分类", "聚类",
            "版本控制", "监控", "部署", "运维", "测试", "性能", "优化"
        }
        
        question_lower = question.lower()
        for keyword in tech_keywords:
            if keyword in question_lower:
                concepts.append(keyword)
        
        return concepts
    
    def _get_technical_context(self, key_concepts: List[str], domain: str) -> Dict:
        """获取技术上下文"""
        context = {}
        
        for concept in key_concepts:
            if "kubernetes" in concept.lower() or "k8s" in concept.lower():
                context.update(self.technical_knowledge_base.get("Kubernetes", {}))
            elif any(ml_term in concept.lower() for ml_term in ["机器学习", "算法", "模型"]):
                context.update(self.technical_knowledge_base.get("机器学习算法", {}))
        
        return context
    
    def _analyze_technical_background(self, question: str, key_concepts: List[str],
                                    technical_context: Dict) -> str:
        """分析技术背景"""
        if "kubernetes" in " ".join(key_concepts).lower():
            return """这个问题涉及到Kubernetes环境下的机器学习模型部署，这是当前云原生AI应用的核心技术栈。版本控制在这个场景下不仅仅是代码版本，还包括模型版本、数据版本、配置版本等多个维度，是保证生产环境稳定性的关键。"""
        elif "机器学习" in " ".join(key_concepts):
            return """机器学习项目经验能够很好地反映一个技术人员的综合能力，从数据理解到模型选择，从算法实现到系统部署，每个环节都有不同的技术挑战。"""
        else:
            return """这个技术问题需要候选人结合理论知识和实践经验来回答，能够很好地体现技术深度和实际应用能力。"""
    
    def _analyze_question_design(self, question: str, domain: str, position: str,
                               question_metadata: Dict = None) -> str:
        """分析问题设计"""
        return f"""它既有足够的开放性让候选人展示自己的技术思路，又有具体的技术场景来确保讨论的深度。对于{domain}领域的{position}岗位来说，这样的问题能够很好地反映实际工作中会遇到的技术挑战。"""
    
    def _analyze_assessment_focus(self, question: str, position: str, 
                                question_metadata: Dict = None) -> str:
        """分析考察重点"""
        if "运维" in position:
            return """重点考察：1) 运维实践经验和故障处理能力；2) 对容器化部署的深度理解；3) 版本管理和监控体系的掌握；4) 生产环境问题解决思路。"""
        else:
            return """重点考察：1) 技术理论掌握程度；2) 实际项目经验丰富度；3) 问题分析和解决能力；4) 技术表达和沟通能力。"""
    
    def _define_evaluation_criteria(self, question: str, key_concepts: List[str], 
                                  position: str) -> str:
        """定义评估标准"""
        return """优秀回答应包含：具体的技术实现细节、实际遇到的挑战和解决方案、最佳实践的应用、对技术发展趋势的理解。评分维度：技术深度(30%)、实践经验(25%)、表达清晰度(20%)、创新思维(15%)、学习能力(10%)。"""
    
    def _outline_expected_answer_framework(self, question: str, key_concepts: List[str], 
                                         technical_context: Dict) -> str:
        """概述预期回答框架"""
        if "kubernetes" in " ".join(key_concepts).lower():
            return """期望回答框架：1) 模型版本管理策略；2) 容器镜像版本控制；3) 配置和依赖管理；4) 监控指标设计；5) 回滚和灾难恢复；6) 具体工具和实践案例。"""
        else:
            return """期望回答框架：1) 项目背景和目标；2) 技术选型和架构；3) 实现过程和挑战；4) 解决方案和优化；5) 项目成果和收获；6) 技术反思和改进。"""
    
    def _plan_follow_up_strategy(self, question: str, domain: str, position: str) -> str:
        """规划追问策略"""
        return """追问策略：根据回答质量进行分层追问 - 基础层：核心概念理解；应用层：实际操作经验；高级层：架构设计和优化；专家层：行业趋势和创新思考。每层追问深入挖掘技术细节和实践智慧。"""
    
    def _explain_question_core(self, question: str, key_concepts: List[str]) -> str:
        """解释问题核心"""
        if "kubernetes" in " ".join(key_concepts).lower():
            return """这个问题的核心是考察您对Kubernetes环境下机器学习模型部署的版本控制理解。版本控制不仅仅是代码版本，还包括模型版本、数据版本、配置版本、环境版本等多个维度。"""
        else:
            return f"""这个问题要求您分享具体的项目经验，展示从理论到实践的转化能力。核心考察点包括：{', '.join(key_concepts)}等技术要素的实际应用。"""
    
    def _explain_key_concepts(self, key_concepts: List[str], technical_context: Dict) -> str:
        """解释关键概念"""
        explanations = []
        
        if "kubernetes" in " ".join(key_concepts).lower() and "ml_deployment" in technical_context:
            ml_deployment = technical_context["ml_deployment"]
            explanations.append("版本控制指标包括：")
            for metric in ml_deployment.get("version_control_metrics", []):
                explanations.append(f"• {metric}")
        
        return "\n".join(explanations) if explanations else "相关技术概念需要结合具体场景来理解。"
    
    def _provide_practical_scenarios(self, key_concepts: List[str], technical_context: Dict) -> str:
        """提供实际应用场景"""
        if "kubernetes" in " ".join(key_concepts).lower():
            return """实际场景：假设您需要在生产环境部署一个推荐系统模型，需要考虑模型A/B测试、灰度发布、性能监控、快速回滚等需求。这时版本控制就变得至关重要。"""
        else:
            return """实际场景：比如开发一个图像识别系统，从数据收集、模型训练、到部署上线的完整流程，每个环节都有具体的技术挑战需要解决。"""
    
    def _provide_step_by_step_approach(self, question: str, key_concepts: List[str], 
                                     technical_context: Dict) -> str:
        """提供分步解决思路"""
        if "kubernetes" in " ".join(key_concepts).lower():
            return """分步思路：
1. 模型版本标记：使用语义化版本号标记模型
2. 容器镜像管理：构建包含模型的Docker镜像
3. 配置版本化：使用ConfigMap管理配置文件
4. 部署策略：实施蓝绿部署或金丝雀发布
5. 监控设置：配置性能和业务指标监控
6. 回滚机制：设计快速回滚策略"""
        else:
            return """分步思路：
1. 项目背景：说明项目目标和业务需求
2. 技术选型：解释选择特定算法的原因
3. 数据处理：描述数据预处理和特征工程
4. 模型开发：详述模型训练和调优过程
5. 部署上线：说明模型部署和监控方案
6. 效果评估：展示项目成果和改进方向"""
    
    def _provide_best_practices(self, key_concepts: List[str], technical_context: Dict) -> str:
        """提供最佳实践建议"""
        if "kubernetes" in " ".join(key_concepts).lower() and "ml_deployment" in technical_context:
            practices = technical_context["ml_deployment"].get("best_practices", [])
            return "最佳实践：\n" + "\n".join(f"• {practice}" for practice in practices)
        else:
            return """最佳实践：
• 遵循软件工程规范，确保代码质量
• 建立完整的实验记录和版本管理
• 重视数据质量和特征工程
• 实施持续集成和持续部署
• 建立监控和告警机制"""
    
    def _suggest_learning_areas(self, key_concepts: List[str], domain: str) -> str:
        """建议学习领域"""
        if "kubernetes" in " ".join(key_concepts).lower():
            return "Kubernetes基础、Docker容器化、CI/CD流水线、监控告警系统、云原生架构"
        else:
            return f"{domain}基础理论、实际项目实践、相关工具使用、行业最佳实践、技术发展趋势"
    
    def _simplify_question(self, question: str, key_concepts: List[str]) -> str:
        """简化问题"""
        if "kubernetes" in " ".join(key_concepts).lower():
            return "简化理解：在K8s中部署ML模型时，如何管理不同版本？比如模型更新了，如何确保能追踪版本变化？"
        else:
            return "简化理解：您是否参与过任何与机器学习相关的项目？可以是学习项目、实习项目或工作项目。"
    
    def _provide_key_hints(self, key_concepts: List[str], technical_context: Dict) -> str:
        """提供关键提示"""
        if "kubernetes" in " ".join(key_concepts).lower():
            return """关键提示：
• 想想软件开发中的版本控制（如Git），ML模型部署也需要类似机制
• 考虑模型文件、配置文件、依赖库都需要版本管理
• 思考如何快速回滚到之前的稳定版本"""
        else:
            return """关键提示：
• 可以从学习过程中的小项目开始分享
• 重点说明您在项目中的具体贡献
• 描述遇到的技术挑战和解决思路"""
    
    def _provide_analogies(self, key_concepts: List[str], domain: str) -> str:
        """提供类比示例"""
        if "kubernetes" in " ".join(key_concepts).lower():
            return "类比：就像手机APP更新一样，需要版本号、更新日志、回滚机制。ML模型部署也需要类似的版本管理体系。"
        else:
            return "类比：就像学习做菜一样，从选材料（数据）、选菜谱（算法）、到实际烹饪（训练）、品尝改进（优化），每个步骤都有学问。"
    
    def _generate_leading_questions(self, question: str, key_concepts: List[str]) -> str:
        """生成引导性问题"""
        if "kubernetes" in " ".join(key_concepts).lower():
            return """引导问题：
• 您了解Docker容器吗？
• 您知道什么是版本号吗？
• 您听说过蓝绿部署吗？
• 您觉得模型更新时需要注意什么？"""
        else:
            return """引导问题：
• 您学习过哪些机器学习算法？
• 您用过Python的机器学习库吗？
• 您处理过什么类型的数据？
• 您对哪个应用场景比较感兴趣？"""
    
    def _provide_real_world_examples(self, key_concepts: List[str], technical_context: Dict) -> str:
        """提供真实案例"""
        if "kubernetes" in " ".join(key_concepts).lower():
            return """实际案例：Netflix使用K8s部署推荐算法，通过版本控制实现A/B测试；Uber使用容器化部署机器学习模型，确保服务稳定性。"""
        else:
            return """实际案例：图像识别（如人脸识别门禁）、推荐系统（如电商商品推荐）、语音助手（如Siri、小爱同学）等都是机器学习的典型应用。"""

    def generate_intelligent_guidance(self, user_response: str, original_question: str,
                                    domain: str, response_type: str) -> Dict[str, Any]:
        """生成基于竞品分析的智能引导内容"""
        try:
            guidance_content = {}

            # 基于竞品分析的智能引导策略
            if response_type == "request_answer":
                guidance_content = self._generate_competitor_inspired_technical_guidance(original_question, domain)
            elif response_type == "express_unknown":
                guidance_content = self._generate_hina_style_educational_hints(original_question, domain)
            elif response_type == "partial_knowledge":
                guidance_content = self._generate_dayee_style_knowledge_expansion(user_response, original_question, domain)
            elif response_type == "confident_answer":
                guidance_content = self._generate_offermore_style_deep_questions(user_response, original_question, domain)

            return {
                "guidance_type": response_type,
                "content": guidance_content,
                "educational_value": self._assess_educational_value(guidance_content),
                "next_steps": self._suggest_next_steps(response_type, domain),
                "competitor_features": self._get_applied_competitor_features(response_type),
                "conversation_quality": "enhanced"
            }

        except Exception as e:
            logger.error(f"智能引导生成失败: {e}")
            return {
                "guidance_type": "fallback",
                "content": {"message": "让我们继续探讨这个技术话题，我会根据您的回答提供更有针对性的指导"},
                "educational_value": "medium",
                "next_steps": ["继续当前话题", "转换到相关问题"],
                "competitor_features": ["智能对话", "实时引导"]
            }

    def _generate_competitor_inspired_technical_guidance(self, question: str, domain: str) -> Dict[str, Any]:
        """生成受竞品启发的技术指导 - 借鉴Offermore.cc的实时助手功能"""
        guidance_templates = {
            "人工智能": {
                "key_concepts": ["机器学习算法选择", "数据预处理技巧", "模型训练优化", "性能评估方法"],
                "learning_path": ["理论基础 → 算法实现 → 项目实践 → 生产部署 → 性能优化"],
                "resources": ["官方文档深度学习", "开源项目实战", "技术博客跟进", "实战课程系统学习"],
                "real_time_tips": [
                    "建议从经典算法开始，如线性回归、决策树",
                    "重点关注数据质量，好的数据胜过复杂的算法",
                    "实践中多做A/B测试验证模型效果",
                    "关注模型的可解释性，特别是在业务应用中"
                ]
            },
            "大数据": {
                "key_concepts": ["分布式计算架构", "数据存储策略", "实时流处理", "数据分析框架"],
                "learning_path": ["基础架构理解 → 工具熟练使用 → 系统设计能力 → 性能调优 → 架构创新"],
                "resources": ["Hadoop生态深入", "Spark官方文档", "实际案例分析", "大厂架构设计"],
                "real_time_tips": [
                    "先掌握Hadoop基础，再学习Spark等新技术",
                    "理解CAP定理对分布式系统设计的影响",
                    "实践中注重数据一致性和系统可用性的平衡",
                    "关注实时计算和批处理的结合使用"
                ]
            },
            "物联网": {
                "key_concepts": ["硬件接口设计", "通信协议选择", "数据采集优化", "边缘计算应用"],
                "learning_path": ["硬件基础 → 协议学习 → 系统集成 → 应用开发 → 安全优化"],
                "resources": ["硬件开发手册", "协议标准文档", "开发板实践", "项目案例学习"],
                "real_time_tips": [
                    "从简单的传感器开始，逐步学习复杂系统",
                    "重点理解MQTT、CoAP等IoT专用协议",
                    "实践中考虑设备功耗和网络稳定性",
                    "关注数据安全和隐私保护"
                ]
            }
        }

        domain_guidance = guidance_templates.get(domain, guidance_templates["人工智能"])

        return {
            "approach": "实时技术指导",
            "key_concepts": domain_guidance["key_concepts"],
            "learning_path": domain_guidance["learning_path"],
            "recommended_resources": domain_guidance["resources"],
            "real_time_tips": domain_guidance["real_time_tips"],
            "practical_advice": [
                "建议结合实际项目进行学习",
                "多参与开源项目贡献代码",
                "关注行业最新技术发展",
                "建立技术学习的持续反馈机制"
            ],
            "competitor_inspiration": "Offermore.cc实时助手功能"
        }

    def _generate_multidimensional_educational_hints(self, question: str, domain: str) -> Dict[str, Any]:
        """生成多维度教育性提示 - 统一招聘标准和多维度考察"""
        return {
            "approach": "多维度渐进式引导",
            "evaluation_dimensions": [
                "技术理论掌握程度",
                "实践经验丰富度",
                "问题解决能力",
                "学习适应能力",
                "沟通表达能力",
                "创新思维能力"
            ],
            "progressive_hints": [
                "让我们从最基础的概念开始理解",
                "可以考虑这个技术在实际工作中的应用场景",
                "想想您在学习或项目中接触过的相关工具",
                "考虑这项技术解决了什么样的实际问题"
            ],
            "examples": self._get_domain_examples(domain),
            "simplified_explanation": "我来提供一些背景信息和引导性问题帮助您思考",
            "encouragement": "这是一个很好的学习和展示机会，让我们一起深入探讨",
            "assessment_focus": f"在{domain}领域，我们主要关注您的技术深度和实践能力",
            "methodology": "多维度考察和统一标准"
        }

    def _generate_technical_guidance(self, question: str, domain: str) -> Dict[str, Any]:
        """生成技术指导内容"""
        guidance_templates = {
            "人工智能": {
                "key_concepts": ["机器学习算法", "数据预处理", "模型训练", "性能评估"],
                "learning_path": ["基础理论 → 实践项目 → 优化调参 → 生产部署"],
                "resources": ["官方文档", "开源项目", "技术博客", "实战课程"]
            },
            "大数据": {
                "key_concepts": ["分布式计算", "数据存储", "实时处理", "数据分析"],
                "learning_path": ["基础架构 → 工具使用 → 系统设计 → 性能优化"],
                "resources": ["Hadoop生态", "Spark文档", "实际案例", "架构设计"]
            },
            "物联网": {
                "key_concepts": ["硬件接口", "通信协议", "数据采集", "边缘计算"],
                "learning_path": ["硬件基础 → 协议学习 → 系统集成 → 应用开发"],
                "resources": ["硬件手册", "协议标准", "开发板", "项目实例"]
            }
        }

        domain_guidance = guidance_templates.get(domain, guidance_templates["人工智能"])

        return {
            "approach": "技术指导",
            "key_concepts": domain_guidance["key_concepts"],
            "learning_path": domain_guidance["learning_path"],
            "recommended_resources": domain_guidance["resources"],
            "practical_tips": [
                "从基础概念开始学习",
                "结合实际项目练习",
                "关注行业最佳实践",
                "持续跟进技术发展"
            ]
        }

    def _generate_educational_hints(self, question: str, domain: str) -> Dict[str, Any]:
        """生成教育性提示"""
        return {
            "approach": "渐进式引导",
            "hints": [
                "让我们从基础概念开始",
                "可以考虑这个技术的应用场景",
                "想想相关的工具或框架",
                "考虑实际项目中的需求"
            ],
            "examples": self._get_domain_examples(domain),
            "simplified_explanation": "我来提供一些背景信息帮助您思考",
            "encouragement": "这是一个很好的学习机会，让我们一起探讨"
        }

    def _get_domain_examples(self, domain: str) -> List[str]:
        """获取领域示例"""
        examples = {
            "人工智能": [
                "推荐系统：如Netflix的电影推荐",
                "图像识别：如人脸识别门禁系统",
                "自然语言处理：如智能客服机器人"
            ],
            "大数据": [
                "实时分析：如电商平台的实时销售统计",
                "数据仓库：如企业的历史数据分析",
                "流处理：如股票交易的实时监控"
            ],
            "物联网": [
                "智能家居：如温度自动调节系统",
                "工业监控：如设备状态实时监测",
                "车联网：如车辆位置和状态追踪"
            ]
        }
        return examples.get(domain, examples["人工智能"])

    def _assess_educational_value(self, guidance_content: Dict) -> str:
        """评估教育价值"""
        if "challenge_questions" in guidance_content:
            return "high"
        elif "expansion_points" in guidance_content:
            return "medium"
        else:
            return "basic"

    def _generate_systematic_knowledge_expansion(self, user_response: str, original_question: str, domain: str) -> Dict[str, Any]:
        """生成系统化知识扩展 - 完整的招聘管理系统和多产品集成"""
        return {
            "approach": "系统化知识扩展",
            "expansion_points": [
                "基于您现有的理解，我们可以进一步探讨相关的高级概念",
                "让我们将这个知识点与实际的业务场景结合起来",
                "我们可以从系统架构的角度来分析这个问题",
                "考虑一下这项技术在不同行业中的应用差异"
            ],
            "integration_aspects": [
                "技术栈集成：如何与现有系统整合",
                "业务流程：技术如何支撑业务目标",
                "团队协作：跨部门技术协作要点",
                "项目管理：技术项目的管理方法"
            ],
            "industry_applications": self._get_industry_specific_applications(domain),
            "skill_development_path": [
                "当前技能评估",
                "目标技能定义",
                "学习计划制定",
                "实践项目规划",
                "能力验证方法"
            ],
            "system_thinking": "从单点技术到系统性思维的转变",
            "methodology": "系统化招聘管理"
        }

    def _generate_offermore_style_deep_questions(self, user_response: str, original_question: str, domain: str) -> Dict[str, Any]:
        """生成Offermore.cc风格的深度问题 - 借鉴其AI面试实时助手和多平台支持"""
        return {
            "approach": "实时深度追问",
            "challenge_questions": [
                "基于您刚才的回答，如果在生产环境中遇到性能瓶颈，您会如何优化？",
                "您提到的技术方案很有意思，能否分析一下它的优缺点和适用场景？",
                "如果让您向非技术人员解释这个概念，您会如何表达？",
                "在实际项目中，您如何平衡技术先进性和项目稳定性？"
            ],
            "real_time_analysis": {
                "technical_depth": "评估技术理解的深度和广度",
                "practical_experience": "验证实际项目经验的真实性",
                "problem_solving": "考察解决复杂问题的思路",
                "communication": "评估技术沟通和表达能力"
            },
            "multi_platform_thinking": [
                "考虑技术方案的跨平台兼容性",
                "分析不同环境下的技术选择",
                "评估技术栈的可扩展性",
                "思考技术演进的路径"
            ],
            "adaptive_questioning": "根据回答质量动态调整问题难度",
            "competitor_inspiration": "Offermore.cc实时AI助手和多平台支持"
        }

    def _get_applied_competitor_features(self, response_type: str) -> List[str]:
        """获取应用的竞品特性"""
        feature_map = {
            "confident_answer": ["Offermore.cc实时深度追问", "多维度技术评估", "自适应问题难度"],
            "partial_knowledge": ["Dayee.com系统化扩展", "完整学习路径", "技能发展规划"],
            "express_unknown": ["Hina.com多维度引导", "渐进式教学", "统一评估标准"],
            "request_answer": ["三平台综合优势", "实时技术指导", "个性化学习建议"]
        }
        return feature_map.get(response_type, ["智能对话引导"])

    def _get_industry_specific_applications(self, domain: str) -> List[str]:
        """获取行业特定应用"""
        applications = {
            "人工智能": [
                "金融风控：机器学习在信贷审批中的应用",
                "医疗诊断：深度学习在影像识别中的实践",
                "智能制造：AI在质量检测中的部署",
                "电商推荐：个性化推荐系统的设计与优化"
            ],
            "大数据": [
                "零售分析：用户行为数据的实时分析",
                "金融监管：大数据在反欺诈中的应用",
                "智慧城市：城市数据的集成与分析",
                "工业4.0：生产数据的实时监控与优化"
            ],
            "物联网": [
                "智能家居：设备互联与自动化控制",
                "工业监控：设备状态的实时监测",
                "智慧农业：环境数据的采集与分析",
                "车联网：车辆数据的实时传输与处理"
            ]
        }
        return applications.get(domain, applications["人工智能"])

    def _suggest_next_steps(self, response_type: str, domain: str) -> List[str]:
        """建议下一步行动 - 基于竞品分析优化"""
        next_steps_map = {
            "confident_answer": [
                "深入技术细节和架构设计",
                "探讨实际应用和优化策略",
                "讨论行业最佳实践",
                "分析技术发展趋势"
            ],
            "partial_knowledge": [
                "系统化补充相关知识",
                "提供具体项目示例",
                "引导实践思考和动手练习",
                "建立完整的学习路径"
            ],
            "express_unknown": [
                "从基础概念开始介绍",
                "提供多维度学习资源",
                "从简单示例逐步深入",
                "建立渐进式学习计划"
            ],
            "request_answer": [
                "提供实时技术指导",
                "推荐个性化学习路径",
                "分享行业最佳实践",
                "建立持续学习机制"
            ]
        }
        return next_steps_map.get(response_type, ["继续当前话题", "深化技术讨论"])

# 创建全局实例
advanced_interviewer_service = AdvancedInterviewerService()
