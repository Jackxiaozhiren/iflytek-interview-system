"""
增强的面试问题服务
提供更专业、更有针对性的技术面试问题
"""

import random
from typing import Dict, List, Any, Optional
from ..core.config import settings

class EnhancedQuestionService:
    """增强的面试问题服务"""
    
    def __init__(self):
        self.question_templates = self._load_question_templates()
        self.guidance_templates = self._load_guidance_templates()
        self.technical_scenarios = self._load_technical_scenarios()
    
    def _load_question_templates(self) -> Dict[str, Dict[str, List[Dict]]]:
        """加载问题模板"""
        return {
            "人工智能": {
                "技术岗": [
                    {
                        "category": "基础理论",
                        "difficulty": "medium",
                        "template": "在{scenario}场景下，如何选择合适的{algorithm}算法？请详细说明你的选择理由和实现思路。",
                        "scenarios": ["推荐系统", "图像识别", "自然语言处理", "时间序列预测"],
                        "algorithms": ["机器学习", "深度学习", "强化学习", "集成学习"],
                        "follow_up": [
                            "你在实际项目中遇到过哪些算法性能问题？",
                            "如何评估和优化模型的效果？",
                            "数据预处理在这个场景中有什么特殊考虑？"
                        ]
                    },
                    {
                        "category": "实践经验",
                        "difficulty": "hard",
                        "template": "请描述一个你参与的{domain}项目，重点说明{challenge}方面的技术挑战和解决方案。",
                        "domains": ["计算机视觉", "自然语言处理", "语音识别", "推荐系统"],
                        "challenges": ["数据质量", "模型优化", "系统架构", "性能调优"],
                        "follow_up": [
                            "项目中最大的技术难点是什么？",
                            "如何保证模型在生产环境的稳定性？",
                            "团队协作中你承担了什么角色？"
                        ]
                    },
                    {
                        "category": "系统设计",
                        "difficulty": "hard",
                        "template": "如果要设计一个{scale}的{system}系统，你会如何考虑{aspect}方面的技术选型和架构设计？",
                        "scales": ["大规模", "实时", "分布式", "高并发"],
                        "systems": ["推荐引擎", "搜索引擎", "智能客服", "风控系统"],
                        "aspects": ["数据存储", "计算框架", "模型部署", "监控运维"],
                        "follow_up": [
                            "如何处理系统的扩展性问题？",
                            "数据一致性如何保证？",
                            "如何进行A/B测试和效果评估？"
                        ]
                    }
                ],
                "运维测试岗": [
                    {
                        "category": "系统运维",
                        "difficulty": "medium",
                        "template": "在{environment}环境中部署{model_type}模型时，你会关注哪些{aspect}指标？",
                        "environments": ["Kubernetes", "Docker", "云平台", "边缘计算"],
                        "model_types": ["深度学习", "机器学习", "实时推理", "批处理"],
                        "aspects": ["性能监控", "资源管理", "故障恢复", "版本控制"],
                        "follow_up": [
                            "如何实现模型的灰度发布？",
                            "遇到模型性能下降如何排查？",
                            "如何设计模型的监控告警？"
                        ]
                    }
                ]
            },
            "大数据": {
                "技术岗": [
                    {
                        "category": "架构设计",
                        "difficulty": "hard",
                        "template": "设计一个处理{data_scale}数据的{system_type}系统，需要考虑{challenge}问题，你的技术方案是什么？",
                        "data_scales": ["PB级", "实时流", "多源异构", "高频交易"],
                        "system_types": ["数据湖", "数据仓库", "实时计算", "离线分析"],
                        "challenges": ["数据一致性", "计算性能", "存储成本", "查询效率"],
                        "follow_up": [
                            "如何保证数据质量？",
                            "系统如何进行容错和恢复？",
                            "如何优化查询性能？"
                        ]
                    }
                ]
            },
            "物联网": {
                "技术岗": [
                    {
                        "category": "系统架构",
                        "difficulty": "medium",
                        "template": "在{scenario}场景下，如何设计{device_type}设备的{aspect}方案？",
                        "scenarios": ["智能家居", "工业物联网", "智慧城市", "车联网"],
                        "device_types": ["传感器", "网关", "边缘计算", "云端"],
                        "aspects": ["通信协议", "数据采集", "安全认证", "设备管理"],
                        "follow_up": [
                            "如何处理设备离线和网络不稳定？",
                            "数据传输的安全性如何保证？",
                            "如何实现设备的远程升级？"
                        ]
                    }
                ]
            }
        }
    
    def _load_guidance_templates(self) -> Dict[str, List[str]]:
        """加载引导模板"""
        return {
            "基础概念引导": [
                "让我们从基础概念开始。你了解{concept}的基本定义吗？",
                "我们可以先讨论一下{concept}的核心原理，你觉得它主要解决什么问题？",
                "不用担心，我们从简单的开始。{concept}在实际应用中你见过哪些例子？"
            ],
            "场景引导": [
                "让我给你一个具体场景：{scenario}，在这种情况下你会怎么思考？",
                "假设你是{role}，面对{problem}问题，你的第一反应是什么？",
                "我们换个角度，如果从{perspective}的角度来看这个问题，你有什么想法？"
            ],
            "经验引导": [
                "虽然你可能没有直接经验，但你在学习或项目中有没有接触过类似的{topic}？",
                "你可以分享一下你对{topic}的理解，哪怕是理论层面的也可以。",
                "从你的知识背景出发，你觉得{topic}可能会涉及哪些技术要点？"
            ]
        }
    
    def _load_technical_scenarios(self) -> Dict[str, List[Dict]]:
        """加载技术场景"""
        return {
            "人工智能": [
                {
                    "scenario": "电商推荐系统",
                    "context": "用户行为数据稀疏，冷启动问题严重",
                    "challenges": ["数据稀疏性", "实时性要求", "多样性平衡"],
                    "technologies": ["协同过滤", "深度学习", "强化学习"]
                },
                {
                    "scenario": "智能客服系统",
                    "context": "需要理解用户意图并提供准确回答",
                    "challenges": ["意图识别", "多轮对话", "知识图谱"],
                    "technologies": ["NLP", "对话系统", "知识推理"]
                }
            ],
            "大数据": [
                {
                    "scenario": "实时风控系统",
                    "context": "毫秒级响应，高并发交易处理",
                    "challenges": ["实时计算", "规则引擎", "模型部署"],
                    "technologies": ["Flink", "Kafka", "Redis"]
                }
            ],
            "物联网": [
                {
                    "scenario": "智能工厂监控",
                    "context": "设备状态实时监控，预测性维护",
                    "challenges": ["数据采集", "边缘计算", "故障预测"],
                    "technologies": ["MQTT", "时序数据库", "机器学习"]
                }
            ]
        }
    
    def generate_professional_question(self, domain: str, position: str, difficulty: str = "medium") -> Dict[str, Any]:
        """生成专业技术问题"""
        templates = self.question_templates.get(domain, {}).get(position, [])
        if not templates:
            return self._get_fallback_question(domain, position)
        
        # 根据难度筛选模板
        suitable_templates = [t for t in templates if t.get("difficulty") == difficulty]
        if not suitable_templates:
            suitable_templates = templates
        
        template = random.choice(suitable_templates)
        
        # 生成具体问题
        question_text = template["template"]
        
        # 替换模板变量
        for key, values in template.items():
            if key.endswith("s") and isinstance(values, list):  # 复数形式的变量
                placeholder = "{" + key[:-1] + "}"  # 去掉s作为占位符
                if placeholder in question_text:
                    question_text = question_text.replace(placeholder, random.choice(values))
        
        return {
            "question": question_text,
            "category": template.get("category", "技术问题"),
            "difficulty": template.get("difficulty", "medium"),
            "follow_up_questions": template.get("follow_up", []),
            "expected_keywords": self._extract_keywords(question_text, domain),
            "evaluation_criteria": self._get_evaluation_criteria(template.get("category", ""))
        }
    
    def generate_guidance_response(self, user_answer: str, domain: str, position: str) -> Dict[str, Any]:
        """生成引导性回应"""
        guidance_type = self._determine_guidance_type(user_answer)
        templates = self.guidance_templates.get(guidance_type, self.guidance_templates["基础概念引导"])
        
        template = random.choice(templates)
        
        # 根据领域选择合适的概念或场景
        scenarios = self.technical_scenarios.get(domain, [])
        if scenarios:
            scenario = random.choice(scenarios)
            guidance_text = template.format(
                concept=self._get_domain_concept(domain),
                scenario=scenario["scenario"],
                role="技术负责人",
                problem=random.choice(scenario["challenges"]),
                perspective="用户体验",
                topic=self._get_domain_concept(domain)
            )
        else:
            guidance_text = template.format(
                concept=self._get_domain_concept(domain),
                scenario="实际项目",
                role="开发者",
                problem="技术选型",
                perspective="系统设计",
                topic=self._get_domain_concept(domain)
            )
        
        return {
            "guidance": guidance_text,
            "type": guidance_type,
            "suggestions": self._get_answer_suggestions(domain, position),
            "examples": self._get_domain_examples(domain)
        }
    
    def _determine_guidance_type(self, user_answer: str) -> str:
        """确定引导类型"""
        answer_lower = user_answer.lower()
        
        if any(phrase in answer_lower for phrase in ["不知道", "不清楚", "没有经验"]):
            return "基础概念引导"
        elif any(phrase in answer_lower for phrase in ["没做过", "不了解", "不太懂"]):
            return "场景引导"
        else:
            return "经验引导"
    
    def _get_domain_concept(self, domain: str) -> str:
        """获取领域核心概念"""
        concepts = {
            "人工智能": "机器学习算法",
            "大数据": "分布式计算",
            "物联网": "设备通信协议"
        }
        return concepts.get(domain, "核心技术")
    
    def _get_domain_examples(self, domain: str) -> List[str]:
        """获取领域示例"""
        examples = {
            "人工智能": [
                "图像识别中的卷积神经网络应用",
                "推荐系统中的协同过滤算法",
                "自然语言处理中的Transformer模型"
            ],
            "大数据": [
                "Hadoop生态系统的HDFS和MapReduce",
                "Spark的RDD和DataFrame操作",
                "Kafka的消息队列和流处理"
            ],
            "物联网": [
                "MQTT协议在智能家居中的应用",
                "LoRa技术在远程监控中的使用",
                "边缘计算在工业物联网中的部署"
            ]
        }
        return examples.get(domain, ["相关技术应用案例"])
    
    def _get_answer_suggestions(self, domain: str, position: str) -> List[str]:
        """获取回答建议"""
        return [
            "可以从基本概念和原理开始说明",
            "结合具体的应用场景来解释",
            "分享你的学习经历或理论理解",
            "说明你对这个技术的认知和看法",
            "描述你认为可能的解决思路"
        ]
    
    def _extract_keywords(self, question: str, domain: str) -> List[str]:
        """提取问题关键词"""
        domain_keywords = {
            "人工智能": ["算法", "模型", "训练", "预测", "分类", "聚类", "神经网络", "深度学习"],
            "大数据": ["分布式", "集群", "存储", "计算", "流处理", "批处理", "数据仓库", "ETL"],
            "物联网": ["传感器", "网关", "协议", "通信", "边缘计算", "云平台", "设备管理", "数据采集"]
        }
        return domain_keywords.get(domain, ["技术", "系统", "架构", "设计"])
    
    def _get_evaluation_criteria(self, category: str) -> List[str]:
        """获取评估标准"""
        criteria = {
            "基础理论": ["概念理解准确性", "原理阐述清晰度", "知识体系完整性"],
            "实践经验": ["项目经验丰富度", "问题解决能力", "技术应用深度"],
            "系统设计": ["架构设计合理性", "技术选型准确性", "扩展性考虑"],
            "系统运维": ["运维经验丰富度", "故障处理能力", "监控体系理解"]
        }
        return criteria.get(category, ["技术理解", "实践能力", "表达清晰"])
    
    def _get_fallback_question(self, domain: str, position: str) -> Dict[str, Any]:
        """获取备用问题"""
        fallback_questions = {
            "人工智能": "请介绍一下你对机器学习的理解，以及它在实际项目中的应用。",
            "大数据": "请说明大数据处理的基本流程，以及你了解的相关技术栈。",
            "物联网": "请描述物联网系统的基本架构，以及各组件的作用。"
        }
        
        return {
            "question": fallback_questions.get(domain, "请介绍一下你的技术背景和项目经验。"),
            "category": "综合技术",
            "difficulty": "medium",
            "follow_up_questions": ["能详细说明一下吗？", "你遇到过什么技术挑战？"],
            "expected_keywords": self._extract_keywords("", domain),
            "evaluation_criteria": ["技术理解", "实践能力", "表达清晰"]
        }

# 创建全局实例
enhanced_question_service = EnhancedQuestionService()
