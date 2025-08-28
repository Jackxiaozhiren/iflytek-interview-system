"""
增强的6核心能力评估算法
优化技术深度、沟通表达、逻辑思维、创新能力、学习能力、团队协作的评估
"""

import logging
import re
from typing import Dict, Any, List, Optional
from datetime import datetime
import math

from ..core.config import settings

logger = logging.getLogger(__name__)

class EnhancedCapabilityEvaluator:
    """增强的6核心能力评估器"""
    
    def __init__(self):
        # 领域专业词汇库
        self.domain_keywords = {
            "人工智能": {
                "基础": ["机器学习", "深度学习", "神经网络", "算法", "模型", "训练", "预测", "分类", "回归"],
                "进阶": ["卷积神经网络", "循环神经网络", "Transformer", "BERT", "GPT", "强化学习", "迁移学习"],
                "高级": ["生成对抗网络", "注意力机制", "多模态学习", "联邦学习", "元学习", "神经架构搜索"]
            },
            "大数据": {
                "基础": ["数据挖掘", "数据分析", "数据仓库", "ETL", "SQL", "NoSQL", "分布式", "集群"],
                "进阶": ["Hadoop", "Spark", "Kafka", "Flink", "数据湖", "实时计算", "流处理"],
                "高级": ["数据治理", "数据血缘", "数据中台", "湖仓一体", "边缘计算", "数据安全"]
            },
            "物联网": {
                "基础": ["传感器", "嵌入式", "通信协议", "MQTT", "CoAP", "设备管理", "数据采集"],
                "进阶": ["边缘计算", "雾计算", "LoRa", "NB-IoT", "5G", "数字孪生"],
                "高级": ["工业互联网", "车联网", "智慧城市", "区块链IoT", "AI+IoT", "安全IoT"]
            }
        }
        
        # 逻辑连接词
        self.logic_indicators = {
            "因果关系": ["因为", "所以", "由于", "导致", "造成", "引起", "结果"],
            "转折关系": ["但是", "然而", "不过", "虽然", "尽管", "相反"],
            "递进关系": ["而且", "并且", "此外", "另外", "更重要的是", "进一步"],
            "总结关系": ["总之", "综上", "总的来说", "综合以上", "最终"]
        }
        
        # 创新指标词汇
        self.innovation_indicators = [
            "创新", "改进", "优化", "突破", "新颖", "独特", "原创", "革新",
            "改良", "升级", "变革", "创造", "发明", "设计", "构思"
        ]
        
        # 学习能力指标
        self.learning_indicators = [
            "学习", "掌握", "理解", "吸收", "总结", "反思", "改进", "提升",
            "进步", "成长", "积累", "经验", "教训", "收获"
        ]
        
        # 团队协作指标
        self.teamwork_indicators = [
            "团队", "协作", "合作", "配合", "沟通", "交流", "分享", "协调",
            "领导", "组织", "管理", "指导", "帮助", "支持"
        ]

        # 基于竞品分析的六维能力评估权重配置
        self.capability_weights = {
            "technical_depth": 0.25,          # 技术深度 - 借鉴Hina.com的专业评估
            "practical_experience": 0.20,     # 实践经验 - 借鉴Offermore.cc的实战导向
            "communication_skills": 0.15,     # 沟通表达 - 借鉴Dayee.com的综合评估
            "problem_solving": 0.15,          # 问题解决 - 三平台共同重视
            "learning_adaptability": 0.15,    # 学习适应 - 技术人员核心能力
            "innovation_thinking": 0.10       # 创新思维 - 高级人才差异化指标
        }

        # 竞品特色评估维度映射
        self.competitor_evaluation_features = {
            "offermore_style": {
                "focus": ["实时技术能力", "实战经验", "快速应变"],
                "weight_adjustment": {
                    "practical_experience": 1.2,
                    "problem_solving": 1.1
                }
            },
            "hina_style": {
                "focus": ["多维度评估", "统一标准", "量化分析"],
                "weight_adjustment": {
                    "technical_depth": 1.2,
                    "communication_skills": 1.1
                }
            },
            "dayee_style": {
                "focus": ["系统化评估", "完整能力画像", "企业匹配"],
                "weight_adjustment": {
                    "learning_adaptability": 1.2,
                    "innovation_thinking": 1.1
                }
            }
        }

        # 评估阈值配置
        self.evaluation_thresholds = {
            "excellent": 0.85,
            "good": 0.70,
            "average": 0.55,
            "below_average": 0.40
        }

        # 技术难度权重
        self.technical_difficulty_weights = {
            "基础": 1.0,
            "进阶": 1.5,
            "高级": 2.0
        }

        # 应变抗压能力指标
        self.stress_resistance_indicators = {
            "压力应对": ["压力", "挑战", "困难", "问题", "解决", "应对", "处理"],
            "适应能力": ["适应", "调整", "变化", "灵活", "弹性", "应变"],
            "情绪管理": ["冷静", "稳定", "控制", "平衡", "理性", "客观"],
            "抗挫折": ["坚持", "毅力", "恢复", "重新", "继续", "不放弃"]
        }
    
    def evaluate_comprehensive(self, analysis_results: Dict[str, Any], domain: str = "人工智能",
                             evaluation_style: str = "balanced") -> Dict[str, Any]:
        """
        基于竞品分析的综合六维能力评估
        evaluation_style: 'offermore_style', 'hina_style', 'dayee_style', 'balanced'
        """
        try:
            logger.info(f"开始基于竞品分析的六维能力评估: domain={domain}, style={evaluation_style}")

            # 提取各模态的分析结果
            text_analysis = analysis_results.get("text_analysis", {})
            audio_analysis = analysis_results.get("audio_analysis", {})
            video_analysis = analysis_results.get("video_analysis", {})

            # 根据评估风格调整权重
            adjusted_weights = self._adjust_weights_by_style(evaluation_style)

            # 评估六维核心能力
            capabilities = {}

            # 1. 技术深度 - 借鉴Hina.com的专业技术评估
            capabilities["technical_depth"] = self._evaluate_technical_depth_enhanced(
                text_analysis, audio_analysis, domain
            )

            # 2. 实践经验 - 借鉴Offermore.cc的实战导向评估
            capabilities["practical_experience"] = self._evaluate_practical_experience_enhanced(
                text_analysis, audio_analysis, domain
            )

            # 3. 沟通表达 - 借鉴Dayee.com的综合表达能力评估
            capabilities["communication_skills"] = self._evaluate_communication_skills_enhanced(
                text_analysis, audio_analysis, video_analysis
            )

            # 4. 问题解决 - 三平台共同重视的核心能力
            capabilities["problem_solving"] = self._evaluate_problem_solving_enhanced(
                text_analysis, audio_analysis
            )

            # 5. 学习适应 - 技术人员核心竞争力
            capabilities["learning_adaptability"] = self._evaluate_learning_adaptability_enhanced(
                text_analysis, audio_analysis
            )

            # 6. 创新思维 - 高级人才差异化指标
            capabilities["innovation_thinking"] = self._evaluate_innovation_thinking_enhanced(
                text_analysis, audio_analysis
            )

            # 使用调整后的权重计算加权总分
            weighted_score = sum(
                capabilities[key] * adjusted_weights[key]
                for key in capabilities.keys()
            )

            # 生成基于竞品分析的详细评估报告
            evaluation_report = {
                "capabilities": capabilities,
                "overall_score": round(weighted_score, 3),
                "weights": adjusted_weights,
                "evaluation_style": evaluation_style,
                "domain": domain,
                "evaluation_details": self._generate_competitor_inspired_evaluation_details(
                    capabilities, domain, evaluation_style
                ),
                "improvement_suggestions": self._generate_competitor_inspired_suggestions(
                    capabilities, evaluation_style
                ),
                "competitor_features_applied": self._get_applied_competitor_features(evaluation_style),
                "assessment_quality": self._assess_evaluation_quality(capabilities),
                "timestamp": datetime.now().isoformat()
            }

            logger.info(f"基于竞品分析的六维能力评估完成: 总分={weighted_score:.3f}, 风格={evaluation_style}")
            return evaluation_report

        except Exception as e:
            logger.error(f"六维能力评估失败: {e}")
            return {
                "capabilities": {
                    "technical_depth": 0.5,
                    "practical_experience": 0.5,
                    "communication_skills": 0.5,
                    "problem_solving": 0.5,
                    "learning_adaptability": 0.5,
                    "innovation_thinking": 0.5
                },
                "overall_score": 0.5,
                "evaluation_style": evaluation_style,
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }

    def _adjust_weights_by_style(self, evaluation_style: str) -> Dict[str, float]:
        """根据评估风格调整权重"""
        base_weights = self.capability_weights.copy()

        if evaluation_style in self.competitor_evaluation_features:
            adjustments = self.competitor_evaluation_features[evaluation_style]["weight_adjustment"]

            # 应用权重调整
            for capability, multiplier in adjustments.items():
                if capability in base_weights:
                    base_weights[capability] *= multiplier

            # 重新归一化权重
            total_weight = sum(base_weights.values())
            base_weights = {k: v / total_weight for k, v in base_weights.items()}

        return base_weights

    def _evaluate_technical_depth_enhanced(self, text_analysis: Dict, audio_analysis: Dict, domain: str) -> float:
        """增强的技术深度评估 - 借鉴Hina.com的专业技术评估"""
        try:
            score = 0.0

            # 提取技术内容
            text_content = self._extract_technical_content(text_analysis, audio_analysis)
            if not text_content:
                return 0.3  # 基础分

            # 1. 技术术语深度分析 (35%) - Hina.com风格的量化评估
            terminology_score = self._analyze_technical_terminology_depth(text_content, domain)
            score += terminology_score * 0.35

            # 2. 技术概念理解准确性 (30%) - 专业知识掌握程度
            concept_accuracy = self._evaluate_concept_accuracy(text_content, domain)
            score += concept_accuracy * 0.30

            # 3. 技术实现细节描述 (25%) - 深度技术理解
            implementation_detail = self._evaluate_implementation_details(text_content, domain)
            score += implementation_detail * 0.25

            # 4. 前沿技术认知 (10%) - 技术发展趋势理解
            cutting_edge_awareness = self._evaluate_cutting_edge_awareness(text_content, domain)
            score += cutting_edge_awareness * 0.10

            return min(score, 1.0)

        except Exception as e:
            logger.error(f"技术深度评估失败: {e}")
            return 0.5

    def _evaluate_practical_experience_enhanced(self, text_analysis: Dict, audio_analysis: Dict, domain: str) -> float:
        """增强的实践经验评估 - 借鉴Offermore.cc的实战导向"""
        try:
            score = 0.0

            text_content = self._extract_technical_content(text_analysis, audio_analysis)
            if not text_content:
                return 0.3

            # 1. 项目经验描述 (40%) - Offermore.cc风格的实战评估
            project_experience = self._evaluate_project_experience(text_content, domain)
            score += project_experience * 0.40

            # 2. 问题解决案例 (30%) - 实际问题处理能力
            problem_cases = self._evaluate_problem_solving_cases(text_content)
            score += problem_cases * 0.30

            # 3. 工具和技术栈熟练度 (20%) - 实用技能掌握
            tool_proficiency = self._evaluate_tool_proficiency(text_content, domain)
            score += tool_proficiency * 0.20

            # 4. 实战经验的时效性 (10%) - 技术经验的新鲜度
            experience_recency = self._evaluate_experience_recency(text_content)
            score += experience_recency * 0.10

            return min(score, 1.0)

        except Exception as e:
            logger.error(f"实践经验评估失败: {e}")
            return 0.5

    def _evaluate_communication_skills_enhanced(self, text_analysis: Dict, audio_analysis: Dict,
                                              video_analysis: Dict) -> float:
        """增强的沟通表达评估 - 借鉴Dayee.com的综合表达能力评估"""
        try:
            score = 0.0

            text_content = self._extract_technical_content(text_analysis, audio_analysis)
            if not text_content:
                return 0.3

            # 1. 语言表达清晰度 (30%) - Dayee.com风格的表达能力评估
            clarity_score = self._evaluate_expression_clarity(text_content)
            score += clarity_score * 0.30

            # 2. 逻辑结构组织 (25%) - 思维逻辑的表达
            structure_score = self._evaluate_logical_structure(text_content)
            score += structure_score * 0.25

            # 3. 专业术语使用准确性 (20%) - 技术沟通能力
            terminology_usage = self._evaluate_terminology_usage(text_content)
            score += terminology_usage * 0.20

            # 4. 互动和回应能力 (15%) - 对话交流能力
            interaction_ability = self._evaluate_interaction_ability(text_analysis, audio_analysis)
            score += interaction_ability * 0.15

            # 5. 多媒体表达协调性 (10%) - 综合表达能力
            multimodal_coordination = self._evaluate_multimodal_coordination(
                text_analysis, audio_analysis, video_analysis
            )
            score += multimodal_coordination * 0.10

            return min(score, 1.0)

        except Exception as e:
            logger.error(f"沟通表达评估失败: {e}")
            return 0.5

    def _evaluate_problem_solving_enhanced(self, text_analysis: Dict, audio_analysis: Dict) -> float:
        """增强的问题解决评估 - 三平台共同重视的核心能力"""
        try:
            score = 0.0

            text_content = self._extract_technical_content(text_analysis, audio_analysis)
            if not text_content:
                return 0.3

            # 1. 问题分析能力 (35%) - 问题识别和分解
            analysis_ability = self._evaluate_problem_analysis(text_content)
            score += analysis_ability * 0.35

            # 2. 解决方案设计 (30%) - 方案构思和设计
            solution_design = self._evaluate_solution_design(text_content)
            score += solution_design * 0.30

            # 3. 实施路径规划 (20%) - 执行计划制定
            implementation_planning = self._evaluate_implementation_planning(text_content)
            score += implementation_planning * 0.20

            # 4. 风险评估和应对 (15%) - 风险意识和预案
            risk_assessment = self._evaluate_risk_assessment(text_content)
            score += risk_assessment * 0.15

            return min(score, 1.0)

        except Exception as e:
            logger.error(f"问题解决评估失败: {e}")
            return 0.5

    def _evaluate_learning_adaptability_enhanced(self, text_analysis: Dict, audio_analysis: Dict) -> float:
        """增强的学习适应评估 - 技术人员核心竞争力"""
        try:
            score = 0.0

            text_content = self._extract_technical_content(text_analysis, audio_analysis)
            if not text_content:
                return 0.3

            # 1. 学习能力表现 (40%) - 知识获取和理解
            learning_ability = self._evaluate_learning_indicators(text_content)
            score += learning_ability * 0.40

            # 2. 技术适应性 (30%) - 新技术接受和应用
            tech_adaptability = self._evaluate_tech_adaptability(text_content)
            score += tech_adaptability * 0.30

            # 3. 知识迁移能力 (20%) - 跨领域知识应用
            knowledge_transfer = self._evaluate_knowledge_transfer(text_content)
            score += knowledge_transfer * 0.20

            # 4. 持续改进意识 (10%) - 自我提升和优化
            continuous_improvement = self._evaluate_continuous_improvement(text_content)
            score += continuous_improvement * 0.10

            return min(score, 1.0)

        except Exception as e:
            logger.error(f"学习适应评估失败: {e}")
            return 0.5

    def _evaluate_innovation_thinking_enhanced(self, text_analysis: Dict, audio_analysis: Dict) -> float:
        """增强的创新思维评估 - 高级人才差异化指标"""
        try:
            score = 0.0

            text_content = self._extract_technical_content(text_analysis, audio_analysis)
            if not text_content:
                return 0.3

            # 1. 创新意识表现 (35%) - 创新思维的体现
            innovation_awareness = self._evaluate_innovation_awareness(text_content)
            score += innovation_awareness * 0.35

            # 2. 创造性解决方案 (30%) - 独特的解决思路
            creative_solutions = self._evaluate_creative_solutions(text_content)
            score += creative_solutions * 0.30

            # 3. 技术前瞻性 (20%) - 对技术发展的预见
            tech_foresight = self._evaluate_tech_foresight(text_content)
            score += tech_foresight * 0.20

            # 4. 跨界思维能力 (15%) - 跨领域整合思维
            cross_domain_thinking = self._evaluate_cross_domain_thinking(text_content)
            score += cross_domain_thinking * 0.15

            return min(score, 1.0)

        except Exception as e:
            logger.error(f"创新思维评估失败: {e}")
            return 0.5

    def _extract_technical_content(self, text_analysis: Dict, audio_analysis: Dict) -> str:
        """提取技术内容"""
        text_content = ""

        # 从文本分析中提取
        if text_analysis.get("spark_analysis", {}).get("content"):
            text_content = text_analysis["spark_analysis"]["content"]
        elif text_analysis.get("basic_features", {}).get("text"):
            text_content = text_analysis["basic_features"]["text"]

        # 从音频转录中提取
        if audio_analysis.get("transcription", {}).get("text"):
            text_content += " " + audio_analysis["transcription"]["text"]

        return text_content.strip()

    def _analyze_technical_terminology_depth(self, text_content: str, domain: str) -> float:
        """分析技术术语深度"""
        try:
            domain_keywords = self.domain_keywords.get(domain, {})
            score = 0.0

            # 基础术语 (权重1.0)
            basic_terms = domain_keywords.get("基础", [])
            basic_count = sum(1 for term in basic_terms if term in text_content)
            score += (basic_count / max(len(basic_terms), 1)) * 0.3

            # 进阶术语 (权重1.5)
            advanced_terms = domain_keywords.get("进阶", [])
            advanced_count = sum(1 for term in advanced_terms if term in text_content)
            score += (advanced_count / max(len(advanced_terms), 1)) * 0.4

            # 高级术语 (权重2.0)
            expert_terms = domain_keywords.get("高级", [])
            expert_count = sum(1 for term in expert_terms if term in text_content)
            score += (expert_count / max(len(expert_terms), 1)) * 0.3

            return min(score, 1.0)

        except Exception as e:
            logger.error(f"技术术语深度分析失败: {e}")
            return 0.3

    def _evaluate_concept_accuracy(self, text_content: str, domain: str) -> float:
        """评估技术概念准确性"""
        try:
            # 检查技术概念的正确使用
            accuracy_indicators = [
                "原理", "机制", "架构", "算法", "实现", "优化",
                "性能", "效率", "可靠性", "扩展性", "安全性"
            ]

            found_indicators = sum(1 for indicator in accuracy_indicators if indicator in text_content)
            accuracy_score = found_indicators / len(accuracy_indicators)

            # 检查是否有明显的技术错误表述
            error_indicators = ["不确定", "可能错了", "不太对", "有问题"]
            error_count = sum(1 for error in error_indicators if error in text_content)

            # 减去错误表述的影响
            final_score = max(0, accuracy_score - (error_count * 0.1))

            return min(final_score, 1.0)

        except Exception as e:
            logger.error(f"概念准确性评估失败: {e}")
            return 0.5

    def _evaluate_implementation_details(self, text_content: str, domain: str) -> float:
        """评估技术实现细节描述"""
        try:
            detail_indicators = [
                "具体实现", "代码", "配置", "参数", "步骤", "流程",
                "部署", "测试", "调试", "监控", "日志", "异常处理"
            ]

            found_details = sum(1 for detail in detail_indicators if detail in text_content)
            detail_score = found_details / len(detail_indicators)

            # 检查是否有具体的数字、版本、工具名称等
            specific_indicators = re.findall(r'\d+\.\d+|\d+%|[A-Z][a-z]+\s+\d+', text_content)
            specificity_bonus = min(len(specific_indicators) * 0.1, 0.3)

            return min(detail_score + specificity_bonus, 1.0)

        except Exception as e:
            logger.error(f"实现细节评估失败: {e}")
            return 0.4

    def _evaluate_cutting_edge_awareness(self, text_content: str, domain: str) -> float:
        """评估前沿技术认知"""
        try:
            # 根据领域定义前沿技术关键词
            cutting_edge_terms = {
                "人工智能": ["GPT", "BERT", "Transformer", "大模型", "多模态", "AIGC"],
                "大数据": ["实时计算", "流处理", "数据湖", "湖仓一体", "数据中台"],
                "物联网": ["边缘计算", "5G", "数字孪生", "工业互联网", "车联网"]
            }

            domain_cutting_edge = cutting_edge_terms.get(domain, [])
            found_terms = sum(1 for term in domain_cutting_edge if term in text_content)

            return min(found_terms / max(len(domain_cutting_edge), 1), 1.0)

        except Exception as e:
            logger.error(f"前沿技术认知评估失败: {e}")
            return 0.3

    def _generate_competitor_inspired_evaluation_details(self, capabilities: Dict, domain: str,
                                                       evaluation_style: str) -> Dict[str, Any]:
        """生成基于竞品分析的评估详情"""
        try:
            style_config = self.competitor_evaluation_features.get(evaluation_style, {})
            focus_areas = style_config.get("focus", [])

            details = {
                "evaluation_approach": self._get_evaluation_approach_description(evaluation_style),
                "focus_areas": focus_areas,
                "capability_analysis": {},
                "domain_specific_insights": self._get_domain_specific_insights(capabilities, domain),
                "competitive_advantages": self._identify_competitive_advantages(capabilities),
                "development_priorities": self._suggest_development_priorities(capabilities, evaluation_style)
            }

            # 为每个能力维度生成详细分析
            for capability, score in capabilities.items():
                details["capability_analysis"][capability] = {
                    "score": score,
                    "level": self._get_capability_level(score),
                    "description": self._get_capability_description(capability, score, evaluation_style),
                    "improvement_potential": self._assess_improvement_potential(capability, score)
                }

            return details

        except Exception as e:
            logger.error(f"生成评估详情失败: {e}")
            return {"error": str(e)}

    def _generate_competitor_inspired_suggestions(self, capabilities: Dict, evaluation_style: str) -> List[str]:
        """生成基于竞品分析的改进建议"""
        try:
            suggestions = []

            # 根据评估风格提供不同的建议策略
            if evaluation_style == "offermore_style":
                suggestions.extend(self._get_offermore_style_suggestions(capabilities))
            elif evaluation_style == "hina_style":
                suggestions.extend(self._get_hina_style_suggestions(capabilities))
            elif evaluation_style == "dayee_style":
                suggestions.extend(self._get_dayee_style_suggestions(capabilities))
            else:
                suggestions.extend(self._get_balanced_suggestions(capabilities))

            # 添加通用的提升建议
            suggestions.extend(self._get_universal_improvement_suggestions(capabilities))

            return suggestions[:10]  # 限制建议数量

        except Exception as e:
            logger.error(f"生成改进建议失败: {e}")
            return ["继续加强技术学习和实践应用"]

    def _get_applied_competitor_features(self, evaluation_style: str) -> List[str]:
        """获取应用的竞品特性"""
        feature_map = {
            "offermore_style": [
                "实时技术能力评估",
                "实战经验导向",
                "快速应变能力测试",
                "多平台技能适配"
            ],
            "hina_style": [
                "多维度量化评估",
                "统一评估标准",
                "科学准确的能力模型",
                "企业个性化要求匹配"
            ],
            "dayee_style": [
                "系统化能力画像",
                "完整招聘流程支持",
                "企业级服务标准",
                "综合人才评估体系"
            ],
            "balanced": [
                "综合三平台优势",
                "平衡各维度权重",
                "全面能力评估",
                "适应性评估策略"
            ]
        }
        return feature_map.get(evaluation_style, feature_map["balanced"])

    def _assess_evaluation_quality(self, capabilities: Dict) -> str:
        """评估评估质量"""
        avg_score = sum(capabilities.values()) / len(capabilities)
        score_variance = sum((score - avg_score) ** 2 for score in capabilities.values()) / len(capabilities)

        if avg_score > 0.8 and score_variance < 0.05:
            return "高质量评估：各维度表现均衡且优秀"
        elif avg_score > 0.6 and score_variance < 0.1:
            return "良好评估：整体表现良好，部分维度有提升空间"
        elif score_variance > 0.2:
            return "差异化评估：各维度表现差异较大，需要针对性提升"
        else:
            return "标准评估：符合一般技术人员水平"

    def _get_evaluation_approach_description(self, evaluation_style: str) -> str:
        """获取评估方法描述"""
        descriptions = {
            "offermore_style": "采用Offermore.cc风格的实时技术能力评估，重点关注实战经验和快速应变能力",
            "hina_style": "采用Hina.com风格的多维度量化评估，通过统一标准进行科学准确的能力测评",
            "dayee_style": "采用Dayee.com风格的系统化评估，构建完整的技术人才能力画像",
            "balanced": "综合三大平台优势，采用平衡的多维度评估方法"
        }
        return descriptions.get(evaluation_style, descriptions["balanced"])

    def _get_domain_specific_insights(self, capabilities: Dict, domain: str) -> Dict[str, str]:
        """获取领域特定洞察"""
        insights = {
            "人工智能": {
                "technical_depth": "AI领域技术深度体现在算法理解、模型设计和优化能力",
                "practical_experience": "AI实践经验重点关注项目落地、模型部署和效果优化",
                "innovation_thinking": "AI创新思维体现在新算法探索、跨领域应用和技术突破"
            },
            "大数据": {
                "technical_depth": "大数据技术深度体现在架构设计、性能优化和系统稳定性",
                "practical_experience": "大数据实践经验重点关注数据处理、系统运维和业务支撑",
                "problem_solving": "大数据问题解决能力体现在复杂数据场景的分析和处理"
            },
            "物联网": {
                "technical_depth": "IoT技术深度体现在硬件理解、协议掌握和系统集成",
                "practical_experience": "IoT实践经验重点关注设备接入、数据采集和应用开发",
                "learning_adaptability": "IoT学习适应能力体现在新技术跟进和跨领域整合"
            }
        }
        return insights.get(domain, insights["人工智能"])

    def _identify_competitive_advantages(self, capabilities: Dict) -> List[str]:
        """识别竞争优势"""
        advantages = []

        # 找出得分最高的能力维度
        sorted_capabilities = sorted(capabilities.items(), key=lambda x: x[1], reverse=True)

        for capability, score in sorted_capabilities[:3]:
            if score > 0.7:
                capability_name = {
                    "technical_depth": "技术深度",
                    "practical_experience": "实践经验",
                    "communication_skills": "沟通表达",
                    "problem_solving": "问题解决",
                    "learning_adaptability": "学习适应",
                    "innovation_thinking": "创新思维"
                }.get(capability, capability)

                advantages.append(f"{capability_name}表现突出（{score:.2f}）")

        return advantages or ["具备基础的技术能力"]

    def _suggest_development_priorities(self, capabilities: Dict, evaluation_style: str) -> List[str]:
        """建议发展优先级"""
        priorities = []

        # 找出得分最低的能力维度
        sorted_capabilities = sorted(capabilities.items(), key=lambda x: x[1])

        for capability, score in sorted_capabilities[:2]:
            if score < 0.6:
                capability_name = {
                    "technical_depth": "技术深度",
                    "practical_experience": "实践经验",
                    "communication_skills": "沟通表达",
                    "problem_solving": "问题解决",
                    "learning_adaptability": "学习适应",
                    "innovation_thinking": "创新思维"
                }.get(capability, capability)

                priorities.append(f"优先提升{capability_name}（当前{score:.2f}）")

        # 根据评估风格添加特定建议
        if evaluation_style == "offermore_style":
            priorities.append("重点加强实战项目经验和快速应变能力")
        elif evaluation_style == "hina_style":
            priorities.append("注重技术深度和多维度能力均衡发展")
        elif evaluation_style == "dayee_style":
            priorities.append("建立系统化的技能体系和持续学习机制")

        return priorities

    def _get_capability_level(self, score: float) -> str:
        """获取能力等级"""
        if score >= 0.85:
            return "优秀"
        elif score >= 0.70:
            return "良好"
        elif score >= 0.55:
            return "一般"
        else:
            return "待提升"

    def _get_capability_description(self, capability: str, score: float, evaluation_style: str) -> str:
        """获取能力描述"""
        level = self._get_capability_level(score)

        descriptions = {
            "technical_depth": f"技术深度{level}，在专业领域的理论掌握和技术应用能力表现{level}",
            "practical_experience": f"实践经验{level}，在项目实战和问题解决方面的经验积累{level}",
            "communication_skills": f"沟通表达{level}，在技术交流和团队协作中的表达能力{level}",
            "problem_solving": f"问题解决{level}，在面对复杂技术问题时的分析和解决能力{level}",
            "learning_adaptability": f"学习适应{level}，在新技术学习和环境适应方面的能力{level}",
            "innovation_thinking": f"创新思维{level}，在技术创新和创造性解决方案方面的思维能力{level}"
        }

        return descriptions.get(capability, f"该能力维度表现{level}")

    def _assess_improvement_potential(self, capability: str, score: float) -> str:
        """评估改进潜力"""
        if score < 0.4:
            return "高改进潜力：通过系统学习和实践可以显著提升"
        elif score < 0.7:
            return "中等改进潜力：通过针对性训练可以进一步提升"
        else:
            return "维持优势：继续保持并在高水平基础上精进"

    def _evaluate_professional_knowledge(self, text_analysis: Dict, audio_analysis: Dict, domain: str) -> float:
        """评估专业知识水平 - 增强版本"""
        try:
            score = 0.0
            factors = []

            # 从文本分析中提取技术内容
            text_content = ""
            if text_analysis.get("spark_analysis", {}).get("content"):
                text_content = text_analysis["spark_analysis"]["content"]
            elif text_analysis.get("basic_features", {}).get("text"):
                text_content = text_analysis["basic_features"]["text"]

            # 从音频转录中提取技术内容
            if audio_analysis.get("transcription", {}).get("text"):
                text_content += " " + audio_analysis["transcription"]["text"]

            if not text_content:
                return 0.3  # 基础分

            # 1. 技术术语覆盖度 (40%)
            terminology_score = self._calculate_terminology_coverage(text_content, domain)
            factors.append(("技术术语覆盖", terminology_score, 0.4))

            # 2. 技术深度层次 (30%)
            depth_score = self._calculate_technical_depth_level(text_content, domain)
            factors.append(("技术深度层次", depth_score, 0.3))

            # 3. 专业表达准确性 (20%)
            accuracy_score = self._calculate_professional_accuracy(text_content, domain)
            factors.append(("专业表达准确性", accuracy_score, 0.2))

            # 4. 实践经验体现 (10%)
            experience_score = self._calculate_practical_experience(text_content, domain)
            factors.append(("实践经验体现", experience_score, 0.1))

            # 计算加权分数
            score = sum(factor_score * weight for _, factor_score, weight in factors)

            return min(1.0, max(0.0, score))

        except Exception as e:
            logger.error(f"专业知识水平评估失败: {e}")
            return 0.5

    def _evaluate_skill_matching(self, text_analysis: Dict, audio_analysis: Dict, domain: str) -> float:
        """评估技能匹配度"""
        try:
            score = 0.0
            factors = []

            # 提取文本内容
            text_content = ""
            if text_analysis.get("spark_analysis", {}).get("content"):
                text_content = text_analysis["spark_analysis"]["content"]
            elif text_analysis.get("basic_features", {}).get("text"):
                text_content = text_analysis["basic_features"]["text"]

            if audio_analysis.get("transcription", {}).get("text"):
                text_content += " " + audio_analysis["transcription"]["text"]

            if not text_content:
                return 0.3

            # 1. 岗位技能匹配 (50%)
            position_match_score = self._calculate_position_skill_match(text_content, domain)
            factors.append(("岗位技能匹配", position_match_score, 0.5))

            # 2. 技术栈覆盖 (30%)
            tech_stack_score = self._calculate_tech_stack_coverage(text_content, domain)
            factors.append(("技术栈覆盖", tech_stack_score, 0.3))

            # 3. 项目经验相关性 (20%)
            project_relevance_score = self._calculate_project_relevance(text_content, domain)
            factors.append(("项目经验相关性", project_relevance_score, 0.2))

            # 计算加权分数
            score = sum(factor_score * weight for _, factor_score, weight in factors)

            return min(1.0, max(0.0, score))

        except Exception as e:
            logger.error(f"技能匹配度评估失败: {e}")
            return 0.5

    def _evaluate_language_expression(self, text_analysis: Dict, audio_analysis: Dict, video_analysis: Dict) -> float:
        """评估语言表达能力"""
        try:
            score = 0.0
            factors = []

            # 1. 语言表达清晰度 (30%)
            clarity_score = self._calculate_clarity_score(text_analysis, audio_analysis)
            factors.append(("表达清晰度", clarity_score, 0.3))

            # 2. 语音质量 (25%)
            voice_quality_score = self._calculate_voice_quality_score(audio_analysis)
            factors.append(("语音质量", voice_quality_score, 0.25))

            # 3. 结构化表达 (25%)
            structure_score = self._calculate_structure_score(text_analysis)
            factors.append(("结构化表达", structure_score, 0.25))

            # 4. 视觉表现 (20%)
            visual_score = self._calculate_visual_score(video_analysis)
            factors.append(("视觉表现", visual_score, 0.2))

            # 计算加权分数
            score = sum(factor_score * weight for _, factor_score, weight in factors)

            return min(1.0, max(0.0, score))

        except Exception as e:
            logger.error(f"语言表达能力评估失败: {e}")
            return 0.5

    def _evaluate_stress_resistance(self, text_analysis: Dict, audio_analysis: Dict) -> float:
        """评估应变抗压能力"""
        try:
            score = 0.0
            factors = []

            # 提取文本内容
            text_content = ""
            if text_analysis.get("spark_analysis", {}).get("content"):
                text_content = text_analysis["spark_analysis"]["content"]
            elif text_analysis.get("basic_features", {}).get("text"):
                text_content = text_analysis["basic_features"]["text"]

            if audio_analysis.get("transcription", {}).get("text"):
                text_content += " " + audio_analysis["transcription"]["text"]

            if not text_content:
                return 0.3

            # 1. 压力应对表达 (40%)
            stress_handling_score = self._calculate_stress_handling_score(text_content)
            factors.append(("压力应对", stress_handling_score, 0.4))

            # 2. 适应能力体现 (30%)
            adaptability_score = self._calculate_adaptability_score(text_content)
            factors.append(("适应能力", adaptability_score, 0.3))

            # 3. 情绪稳定性 (20%)
            emotional_stability_score = self._calculate_emotional_stability_score(text_content, audio_analysis)
            factors.append(("情绪稳定性", emotional_stability_score, 0.2))

            # 4. 抗挫折能力 (10%)
            resilience_score = self._calculate_resilience_score(text_content)
            factors.append(("抗挫折能力", resilience_score, 0.1))

            # 计算加权分数
            score = sum(factor_score * weight for _, factor_score, weight in factors)

            return min(1.0, max(0.0, score))

        except Exception as e:
            logger.error(f"应变抗压能力评估失败: {e}")
            return 0.5

    def _evaluate_technical_depth(self, text_analysis: Dict, audio_analysis: Dict, domain: str) -> float:
        """评估技术深度 - 增强版本"""
        try:
            score = 0.0
            factors = []

            # 从文本分析中提取技术内容
            text_content = ""
            if text_analysis.get("spark_analysis", {}).get("content"):
                text_content = text_analysis["spark_analysis"]["content"]
            elif text_analysis.get("basic_features", {}).get("text"):
                text_content = text_analysis["basic_features"]["text"]

            # 从音频转录中提取技术内容
            if audio_analysis.get("transcription", {}).get("text"):
                text_content += " " + audio_analysis["transcription"]["text"]

            if not text_content:
                return 0.3  # 基础分

            # 1. 专业术语覆盖度与准确性 (35%) - 增强权重
            terminology_score = self._calculate_enhanced_terminology_score(text_content, domain)
            factors.append(("专业术语", terminology_score, 0.35))

            # 2. 技术深度层次与复杂度 (30%)
            depth_score = self._calculate_enhanced_depth_score(text_content, domain)
            factors.append(("技术深度", depth_score, 0.30))

            # 3. 技术准确性与创新性 (20%)
            accuracy_innovation_score = self._calculate_accuracy_innovation_score(text_content, domain)
            factors.append(("准确性与创新", accuracy_innovation_score, 0.20))

            # 4. 实践经验与案例分析 (15%) - 增强权重
            experience_score = self._calculate_enhanced_experience_score(text_content)
            factors.append(("实践经验", experience_score, 0.15))

            # 计算加权分数
            score = sum(factor_score * weight for _, factor_score, weight in factors)

            # 领域特定调整
            domain_bonus = self._calculate_domain_specific_bonus(text_content, domain)
            score = min(1.0, score + domain_bonus)

            logger.debug(f"技术深度评估: {domain} - 分数={score:.3f}, 因子={factors}")

            return min(1.0, max(0.0, score))

        except Exception as e:
            logger.error(f"技术深度评估失败: {e}")
            return 0.3

    def _calculate_enhanced_terminology_score(self, text_content: str, domain: str) -> float:
        """计算增强的专业术语分数"""
        try:
            # 领域专业术语库
            domain_keywords = {
                "人工智能": [
                    # 基础概念
                    "机器学习", "深度学习", "神经网络", "算法", "模型", "训练", "预测",
                    # 高级概念
                    "卷积神经网络", "循环神经网络", "Transformer", "BERT", "GPT", "注意力机制",
                    "反向传播", "梯度下降", "过拟合", "正则化", "批归一化", "Dropout",
                    # 应用领域
                    "计算机视觉", "自然语言处理", "语音识别", "推荐系统", "强化学习",
                    # 技术框架
                    "TensorFlow", "PyTorch", "Keras", "Scikit-learn", "OpenCV", "NLTK"
                ],
                "大数据": [
                    # 基础概念
                    "数据挖掘", "数据分析", "数据仓库", "ETL", "数据清洗", "特征工程",
                    # 技术架构
                    "Hadoop", "Spark", "Kafka", "Hive", "HBase", "HDFS", "MapReduce",
                    # 数据库技术
                    "NoSQL", "MongoDB", "Redis", "Elasticsearch", "ClickHouse",
                    # 分析工具
                    "数据可视化", "BI", "OLAP", "数据湖", "流处理", "批处理",
                    # 云平台
                    "AWS", "Azure", "阿里云", "腾讯云", "数据中台"
                ],
                "物联网": [
                    # 硬件基础
                    "传感器", "嵌入式系统", "单片机", "Arduino", "树莓派", "RFID",
                    # 通信协议
                    "MQTT", "CoAP", "LoRa", "NB-IoT", "5G", "WiFi", "蓝牙", "Zigbee",
                    # 平台技术
                    "边缘计算", "云计算", "雾计算", "物联网平台", "设备管理",
                    # 应用场景
                    "智能家居", "工业4.0", "智慧城市", "车联网", "智能农业",
                    # 安全技术
                    "设备认证", "数据加密", "安全通信", "固件更新"
                ]
            }

            keywords = domain_keywords.get(domain, [])
            if not keywords:
                return 0.5

            # 计算术语覆盖率
            found_keywords = []
            for keyword in keywords:
                if keyword in text_content:
                    found_keywords.append(keyword)

            coverage_rate = len(found_keywords) / len(keywords)

            # 计算术语使用深度（基于上下文）
            depth_score = 0.0
            for keyword in found_keywords:
                # 检查关键词周围的上下文
                context_score = self._analyze_keyword_context(text_content, keyword)
                depth_score += context_score

            if found_keywords:
                depth_score = depth_score / len(found_keywords)

            # 综合评分
            final_score = (coverage_rate * 0.6 + depth_score * 0.4)

            return min(1.0, max(0.0, final_score))

        except Exception as e:
            logger.error(f"专业术语评估失败: {e}")
            return 0.5

    def _calculate_enhanced_depth_score(self, text_content: str, domain: str) -> float:
        """计算增强的技术深度分数"""
        try:
            depth_indicators = {
                "人工智能": [
                    "算法复杂度", "模型架构", "超参数调优", "损失函数", "优化器",
                    "数据增强", "迁移学习", "多任务学习", "元学习", "联邦学习"
                ],
                "大数据": [
                    "分布式计算", "数据分片", "一致性哈希", "CAP理论", "ACID",
                    "数据血缘", "元数据管理", "数据治理", "实时计算", "离线计算"
                ],
                "物联网": [
                    "协议栈", "网络拓扑", "功耗优化", "实时性", "可靠性",
                    "设备生命周期", "OTA更新", "边缘智能", "数字孪生"
                ]
            }

            indicators = depth_indicators.get(domain, [])
            if not indicators:
                return 0.5

            # 检查深度指标
            depth_count = 0
            for indicator in indicators:
                if indicator in text_content:
                    depth_count += 1

            depth_ratio = depth_count / len(indicators)

            # 检查技术细节描述
            detail_score = self._analyze_technical_details(text_content)

            # 综合评分
            final_score = (depth_ratio * 0.7 + detail_score * 0.3)

            return min(1.0, max(0.0, final_score))

        except Exception as e:
            logger.error(f"技术深度评估失败: {e}")
            return 0.5

    def _analyze_keyword_context(self, text_content: str, keyword: str) -> float:
        """分析关键词使用的上下文深度"""
        try:
            # 找到关键词在文本中的位置
            keyword_positions = []
            start = 0
            while True:
                pos = text_content.find(keyword, start)
                if pos == -1:
                    break
                keyword_positions.append(pos)
                start = pos + 1

            if not keyword_positions:
                return 0.0

            total_context_score = 0.0
            for pos in keyword_positions:
                # 提取关键词前后的上下文
                context_start = max(0, pos - 50)
                context_end = min(len(text_content), pos + len(keyword) + 50)
                context = text_content[context_start:context_end]

                # 分析上下文质量
                context_score = 0.0

                # 检查是否有技术描述词汇
                tech_descriptors = ["实现", "原理", "架构", "设计", "优化", "性能", "算法", "方案", "技术", "系统"]
                for descriptor in tech_descriptors:
                    if descriptor in context:
                        context_score += 0.1

                # 检查是否有具体数值或参数
                import re
                if re.search(r'\d+', context):
                    context_score += 0.2

                # 检查是否有比较或分析
                analysis_words = ["比较", "分析", "优势", "缺点", "适用", "场景", "效果"]
                for word in analysis_words:
                    if word in context:
                        context_score += 0.15

                total_context_score += min(1.0, context_score)

            return total_context_score / len(keyword_positions)

        except Exception as e:
            logger.error(f"关键词上下文分析失败: {e}")
            return 0.3

    def _analyze_technical_details(self, text_content: str) -> float:
        """分析技术细节描述的质量"""
        try:
            detail_score = 0.0

            # 检查技术细节指标
            detail_indicators = [
                "具体实现", "代码示例", "配置参数", "性能指标", "测试结果",
                "架构图", "流程图", "数据结构", "接口设计", "部署方案"
            ]

            for indicator in detail_indicators:
                if indicator in text_content:
                    detail_score += 0.1

            # 检查数量化描述
            import re
            numbers = re.findall(r'\d+(?:\.\d+)?', text_content)
            if numbers:
                detail_score += min(0.3, len(numbers) * 0.05)

            # 检查技术术语的连贯性
            coherence_score = self._analyze_technical_coherence(text_content)
            detail_score += coherence_score * 0.3

            return min(1.0, detail_score)

        except Exception as e:
            logger.error(f"技术细节分析失败: {e}")
            return 0.3

    def _analyze_technical_coherence(self, text_content: str) -> float:
        """分析技术描述的连贯性"""
        try:
            # 检查逻辑连接词
            logic_connectors = ["因此", "所以", "由于", "基于", "通过", "实现", "导致", "结果"]
            connector_count = sum(1 for connector in logic_connectors if connector in text_content)

            # 检查技术流程词
            process_words = ["首先", "然后", "接下来", "最后", "步骤", "阶段", "过程"]
            process_count = sum(1 for word in process_words if word in text_content)

            # 计算连贯性分数
            coherence_score = (connector_count * 0.1 + process_count * 0.15)

            return min(1.0, coherence_score)

        except Exception as e:
            logger.error(f"技术连贯性分析失败: {e}")
            return 0.3

    def _calculate_accuracy_innovation_score(self, text_content: str, domain: str) -> float:
        """计算准确性与创新性分数"""
        try:
            # 准确性评估 (70%)
            accuracy_score = self._evaluate_technical_accuracy(text_content, domain)

            # 创新性评估 (30%)
            innovation_score = self._evaluate_innovation_thinking(text_content)

            return accuracy_score * 0.7 + innovation_score * 0.3

        except Exception as e:
            logger.error(f"准确性与创新性评估失败: {e}")
            return 0.5

    def _evaluate_technical_accuracy(self, text_content: str, domain: str) -> float:
        """评估技术准确性"""
        try:
            # 检查技术概念的正确使用
            accuracy_score = 0.5  # 基础分

            # 检查是否有明显的技术错误
            common_errors = {
                "人工智能": ["人工智能就是机器人", "AI可以解决所有问题", "深度学习就是机器学习"],
                "大数据": ["大数据就是数据量大", "NoSQL比SQL更好", "Hadoop适合所有场景"],
                "物联网": ["物联网就是联网设备", "5G解决所有问题", "边缘计算替代云计算"]
            }

            errors = common_errors.get(domain, [])
            for error in errors:
                if error in text_content:
                    accuracy_score -= 0.2

            # 检查技术概念的准确描述
            if "原理" in text_content or "机制" in text_content:
                accuracy_score += 0.2

            if "优缺点" in text_content or "适用场景" in text_content:
                accuracy_score += 0.2

            return min(1.0, max(0.0, accuracy_score))

        except Exception as e:
            logger.error(f"技术准确性评估失败: {e}")
            return 0.5
    
    def _evaluate_communication_skills(self, text_analysis: Dict, audio_analysis: Dict, video_analysis: Dict) -> float:
        """评估沟通表达能力"""
        try:
            score = 0.0
            factors = []
            
            # 1. 语言表达清晰度 (30%)
            clarity_score = self._calculate_clarity_score(text_analysis, audio_analysis)
            factors.append(("表达清晰度", clarity_score, 0.3))
            
            # 2. 语音质量 (25%)
            voice_quality_score = self._calculate_voice_quality_score(audio_analysis)
            factors.append(("语音质量", voice_quality_score, 0.25))
            
            # 3. 结构化表达 (25%)
            structure_score = self._calculate_structure_score(text_analysis)
            factors.append(("结构化表达", structure_score, 0.25))
            
            # 4. 视觉表现 (20%)
            visual_score = self._calculate_visual_score(video_analysis)
            factors.append(("视觉表现", visual_score, 0.2))
            
            # 计算加权分数
            score = sum(factor_score * weight for _, factor_score, weight in factors)
            
            return min(1.0, max(0.0, score))
            
        except Exception as e:
            logger.error(f"沟通表达能力评估失败: {e}")
            return 0.5
    
    def _evaluate_logical_thinking(self, text_analysis: Dict, audio_analysis: Dict) -> float:
        """评估逻辑思维能力"""
        try:
            # 提取文本内容
            text_content = self._extract_text_content(text_analysis, audio_analysis)
            
            if not text_content:
                return 0.3
            
            score = 0.0
            factors = []
            
            # 1. 逻辑连接词使用 (40%)
            logic_score = self._calculate_logic_indicators_score(text_content)
            factors.append(("逻辑连接", logic_score, 0.4))
            
            # 2. 论证结构 (30%)
            argument_score = self._calculate_argument_structure_score(text_content)
            factors.append(("论证结构", argument_score, 0.3))
            
            # 3. 因果关系分析 (20%)
            causality_score = self._calculate_causality_score(text_content)
            factors.append(("因果分析", causality_score, 0.2))
            
            # 4. 思维连贯性 (10%)
            coherence_score = self._calculate_coherence_score(text_content)
            factors.append(("思维连贯", coherence_score, 0.1))
            
            # 计算加权分数
            score = sum(factor_score * weight for _, factor_score, weight in factors)
            
            return min(1.0, max(0.0, score))
            
        except Exception as e:
            logger.error(f"逻辑思维能力评估失败: {e}")
            return 0.5
    
    def _evaluate_innovation_ability(self, text_analysis: Dict, audio_analysis: Dict) -> float:
        """评估创新能力"""
        try:
            text_content = self._extract_text_content(text_analysis, audio_analysis)
            
            if not text_content:
                return 0.3
            
            score = 0.0
            factors = []
            
            # 1. 创新词汇使用 (40%)
            innovation_words_score = self._calculate_innovation_words_score(text_content)
            factors.append(("创新词汇", innovation_words_score, 0.4))
            
            # 2. 解决方案创新性 (30%)
            solution_score = self._calculate_solution_innovation_score(text_content)
            factors.append(("解决方案", solution_score, 0.3))
            
            # 3. 思维发散性 (20%)
            divergent_score = self._calculate_divergent_thinking_score(text_content)
            factors.append(("思维发散", divergent_score, 0.2))
            
            # 4. 前瞻性思考 (10%)
            forward_score = self._calculate_forward_thinking_score(text_content)
            factors.append(("前瞻思考", forward_score, 0.1))
            
            # 计算加权分数
            score = sum(factor_score * weight for _, factor_score, weight in factors)
            
            return min(1.0, max(0.0, score))
            
        except Exception as e:
            logger.error(f"创新能力评估失败: {e}")
            return 0.5
    
    def _evaluate_learning_ability(self, text_analysis: Dict, audio_analysis: Dict) -> float:
        """评估学习能力"""
        try:
            text_content = self._extract_text_content(text_analysis, audio_analysis)
            
            if not text_content:
                return 0.3
            
            score = 0.0
            factors = []
            
            # 1. 学习态度表达 (30%)
            attitude_score = self._calculate_learning_attitude_score(text_content)
            factors.append(("学习态度", attitude_score, 0.3))
            
            # 2. 知识整合能力 (30%)
            integration_score = self._calculate_knowledge_integration_score(text_content)
            factors.append(("知识整合", integration_score, 0.3))
            
            # 3. 自我反思能力 (25%)
            reflection_score = self._calculate_self_reflection_score(text_content)
            factors.append(("自我反思", reflection_score, 0.25))
            
            # 4. 持续改进意识 (15%)
            improvement_score = self._calculate_improvement_awareness_score(text_content)
            factors.append(("持续改进", improvement_score, 0.15))
            
            # 计算加权分数
            score = sum(factor_score * weight for _, factor_score, weight in factors)
            
            return min(1.0, max(0.0, score))
            
        except Exception as e:
            logger.error(f"学习能力评估失败: {e}")
            return 0.5
    
    def _evaluate_teamwork_skills(self, text_analysis: Dict, audio_analysis: Dict) -> float:
        """评估团队协作能力"""
        try:
            text_content = self._extract_text_content(text_analysis, audio_analysis)
            
            if not text_content:
                return 0.3
            
            score = 0.0
            factors = []
            
            # 1. 团队协作词汇 (40%)
            teamwork_words_score = self._calculate_teamwork_words_score(text_content)
            factors.append(("协作词汇", teamwork_words_score, 0.4))
            
            # 2. 沟通协调能力 (30%)
            coordination_score = self._calculate_coordination_score(text_content)
            factors.append(("沟通协调", coordination_score, 0.3))
            
            # 3. 领导力体现 (20%)
            leadership_score = self._calculate_leadership_score(text_content)
            factors.append(("领导力", leadership_score, 0.2))
            
            # 4. 团队贡献意识 (10%)
            contribution_score = self._calculate_contribution_score(text_content)
            factors.append(("贡献意识", contribution_score, 0.1))
            
            # 计算加权分数
            score = sum(factor_score * weight for _, factor_score, weight in factors)
            
            return min(1.0, max(0.0, score))
            
        except Exception as e:
            logger.error(f"团队协作能力评估失败: {e}")
            return 0.5

    def _extract_text_content(self, text_analysis: Dict, audio_analysis: Dict) -> str:
        """提取文本内容"""
        content_parts = []

        # 从文本分析中提取
        if text_analysis.get("spark_analysis", {}).get("content"):
            content_parts.append(text_analysis["spark_analysis"]["content"])

        # 从音频转录中提取
        if audio_analysis.get("transcription", {}).get("text"):
            content_parts.append(audio_analysis["transcription"]["text"])

        return " ".join(content_parts)

    def _calculate_terminology_score(self, text: str, domain: str) -> float:
        """计算专业术语得分"""
        if domain not in self.domain_keywords:
            return 0.5

        keywords = self.domain_keywords[domain]
        total_score = 0.0

        # 基础术语 (权重0.3)
        basic_found = sum(1 for kw in keywords["基础"] if kw in text)
        basic_score = min(1.0, basic_found / len(keywords["基础"])) * 0.3

        # 进阶术语 (权重0.4)
        advanced_found = sum(1 for kw in keywords["进阶"] if kw in text)
        advanced_score = min(1.0, advanced_found / len(keywords["进阶"])) * 0.4

        # 高级术语 (权重0.3)
        expert_found = sum(1 for kw in keywords["高级"] if kw in text)
        expert_score = min(1.0, expert_found / len(keywords["高级"])) * 0.3

        total_score = basic_score + advanced_score + expert_score
        return min(1.0, total_score)

    def _calculate_depth_score(self, text: str, domain: str) -> float:
        """计算技术深度得分"""
        # 检查技术深度指标
        depth_indicators = [
            "原理", "机制", "算法", "架构", "设计", "实现", "优化",
            "性能", "效率", "扩展", "可靠性", "安全性"
        ]

        found_indicators = sum(1 for indicator in depth_indicators if indicator in text)
        depth_score = min(1.0, found_indicators / len(depth_indicators))

        # 结合句子复杂度
        sentences = [s.strip() for s in text.split('。') if s.strip()]
        avg_sentence_length = sum(len(s) for s in sentences) / max(1, len(sentences))
        complexity_score = min(1.0, avg_sentence_length / 50)  # 50字为基准

        return (depth_score * 0.7 + complexity_score * 0.3)

    def _calculate_accuracy_score(self, text: str, domain: str) -> float:
        """计算技术准确性得分"""
        # 简化的准确性评估，基于术语使用的合理性
        # 实际应用中可以结合知识图谱或专家系统

        # 检查是否有明显的技术错误表述
        error_patterns = [
            "不确定", "可能", "大概", "应该是", "估计", "猜测"
        ]

        error_count = sum(1 for pattern in error_patterns if pattern in text)
        confidence_score = max(0.0, 1.0 - error_count * 0.2)

        return confidence_score

    def _calculate_experience_score(self, text: str) -> float:
        """计算实践经验得分"""
        experience_indicators = [
            "项目", "实践", "经验", "案例", "实际", "应用", "部署",
            "维护", "调试", "问题", "解决", "优化", "改进"
        ]

        found_indicators = sum(1 for indicator in experience_indicators if indicator in text)
        return min(1.0, found_indicators / len(experience_indicators))

    def _calculate_clarity_score(self, text_analysis: Dict, audio_analysis: Dict) -> float:
        """计算表达清晰度得分"""
        score = 0.5  # 基础分

        # 从文本分析中获取清晰度信息
        if text_analysis.get("basic_features"):
            features = text_analysis["basic_features"]
            # 基于句子长度和复杂度评估
            if features.get("avg_sentence_length"):
                avg_length = features["avg_sentence_length"]
                # 适中的句子长度得分更高
                if 10 <= avg_length <= 25:
                    score += 0.2
                elif 8 <= avg_length <= 30:
                    score += 0.1

        # 从音频分析中获取流畅度信息
        if audio_analysis.get("fluency_analysis"):
            fluency = audio_analysis["fluency_analysis"]
            if fluency.get("fluency_score"):
                score += fluency["fluency_score"] * 0.3

        return min(1.0, score)



    def _calculate_structure_score(self, text_analysis: Dict) -> float:
        """计算结构化表达得分"""
        if not text_analysis:
            return 0.3

        score = 0.3

        # 逻辑结构分析
        if text_analysis.get("logic_analysis"):
            logic = text_analysis["logic_analysis"]
            if logic.get("logical_structure_score"):
                score += logic["logical_structure_score"] * 0.4

            if logic.get("structure_quality") == "good":
                score += 0.3
            elif logic.get("structure_quality") == "average":
                score += 0.1

        return min(1.0, score)

    def _calculate_visual_score(self, video_analysis: Dict) -> float:
        """计算视觉表现得分"""
        if not video_analysis:
            return 0.5

        score = 0.5

        # 表情分析
        if video_analysis.get("expression_analysis"):
            expression = video_analysis["expression_analysis"]
            if expression.get("confidence_score"):
                score += expression["confidence_score"] * 0.3

        # 姿态分析
        if video_analysis.get("posture_analysis"):
            posture = video_analysis["posture_analysis"]
            if posture.get("professional_score"):
                score += posture["professional_score"] * 0.2

        return min(1.0, score)

    def _calculate_logic_indicators_score(self, text: str) -> float:
        """计算逻辑指示词得分"""
        total_indicators = 0
        found_indicators = 0

        for category, indicators in self.logic_indicators.items():
            total_indicators += len(indicators)
            found_indicators += sum(1 for indicator in indicators if indicator in text)

        return min(1.0, found_indicators / max(1, total_indicators))

    def _calculate_argument_structure_score(self, text: str) -> float:
        """计算论证结构得分"""
        # 检查论证结构关键词
        structure_words = [
            "首先", "其次", "再次", "最后", "总之", "综上所述",
            "一方面", "另一方面", "例如", "比如", "具体来说"
        ]

        found_words = sum(1 for word in structure_words if word in text)
        return min(1.0, found_words / len(structure_words))

    def _calculate_causality_score(self, text: str) -> float:
        """计算因果关系分析得分"""
        causality_words = self.logic_indicators["因果关系"]
        found_words = sum(1 for word in causality_words if word in text)
        return min(1.0, found_words / len(causality_words))

    def _calculate_coherence_score(self, text: str) -> float:
        """计算思维连贯性得分"""
        sentences = [s.strip() for s in text.split('。') if s.strip()]
        if len(sentences) < 2:
            return 0.5

        # 简单的连贯性评估：检查句子间的连接
        coherence_indicators = ["这", "那", "此", "该", "上述", "以上", "如前所述"]
        coherence_count = sum(1 for indicator in coherence_indicators if indicator in text)

        return min(1.0, coherence_count / max(1, len(sentences) - 1))

    def _calculate_innovation_words_score(self, text: str) -> float:
        """计算创新词汇得分"""
        found_words = sum(1 for word in self.innovation_indicators if word in text)
        return min(1.0, found_words / len(self.innovation_indicators))

    def _calculate_solution_innovation_score(self, text: str) -> float:
        """计算解决方案创新性得分"""
        innovation_phrases = [
            "新的方法", "创新方案", "改进方案", "优化策略", "新思路",
            "突破性", "革命性", "颠覆性", "前沿技术", "新兴技术"
        ]

        found_phrases = sum(1 for phrase in innovation_phrases if phrase in text)
        return min(1.0, found_phrases / len(innovation_phrases))

    def _calculate_divergent_thinking_score(self, text: str) -> float:
        """计算思维发散性得分"""
        divergent_indicators = [
            "多种", "各种", "不同", "另外", "还可以", "也能",
            "多角度", "多方面", "综合考虑", "全面分析"
        ]

        found_indicators = sum(1 for indicator in divergent_indicators if indicator in text)
        return min(1.0, found_indicators / len(divergent_indicators))

    def _calculate_forward_thinking_score(self, text: str) -> float:
        """计算前瞻性思考得分"""
        forward_indicators = [
            "未来", "趋势", "发展", "前景", "预测", "展望",
            "长远", "可持续", "演进", "变化", "潜力"
        ]

        found_indicators = sum(1 for indicator in forward_indicators if indicator in text)
        return min(1.0, found_indicators / len(forward_indicators))

    def _calculate_learning_attitude_score(self, text: str) -> float:
        """计算学习态度得分"""
        found_indicators = sum(1 for indicator in self.learning_indicators if indicator in text)
        return min(1.0, found_indicators / len(self.learning_indicators))

    def _calculate_knowledge_integration_score(self, text: str) -> float:
        """计算知识整合能力得分"""
        integration_indicators = [
            "结合", "融合", "整合", "综合", "关联", "联系",
            "统一", "协调", "平衡", "兼顾"
        ]

        found_indicators = sum(1 for indicator in integration_indicators if indicator in text)
        return min(1.0, found_indicators / len(integration_indicators))

    def _calculate_self_reflection_score(self, text: str) -> float:
        """计算自我反思能力得分"""
        reflection_indicators = [
            "反思", "总结", "回顾", "检讨", "反省", "思考",
            "认识到", "意识到", "发现", "不足", "改进"
        ]

        found_indicators = sum(1 for indicator in reflection_indicators if indicator in text)
        return min(1.0, found_indicators / len(reflection_indicators))

    def _calculate_improvement_awareness_score(self, text: str) -> float:
        """计算持续改进意识得分"""
        improvement_indicators = [
            "改进", "提升", "优化", "完善", "加强", "增强",
            "持续", "不断", "继续", "进一步", "更好"
        ]

        found_indicators = sum(1 for indicator in improvement_indicators if indicator in text)
        return min(1.0, found_indicators / len(improvement_indicators))

    def _calculate_teamwork_words_score(self, text: str) -> float:
        """计算团队协作词汇得分"""
        found_indicators = sum(1 for indicator in self.teamwork_indicators if indicator in text)
        return min(1.0, found_indicators / len(self.teamwork_indicators))

    def _calculate_coordination_score(self, text: str) -> float:
        """计算沟通协调能力得分"""
        coordination_indicators = [
            "协调", "沟通", "交流", "讨论", "商议", "协商",
            "配合", "合作", "同步", "对接"
        ]

        found_indicators = sum(1 for indicator in coordination_indicators if indicator in text)
        return min(1.0, found_indicators / len(coordination_indicators))

    def _calculate_leadership_score(self, text: str) -> float:
        """计算领导力得分"""
        leadership_indicators = [
            "领导", "带领", "指导", "管理", "组织", "安排",
            "决策", "规划", "统筹", "协调", "推动"
        ]

        found_indicators = sum(1 for indicator in leadership_indicators if indicator in text)
        return min(1.0, found_indicators / len(leadership_indicators))

    def _calculate_contribution_score(self, text: str) -> float:
        """计算团队贡献意识得分"""
        contribution_indicators = [
            "贡献", "帮助", "支持", "协助", "配合", "服务",
            "奉献", "付出", "责任", "担当", "承担"
        ]

        found_indicators = sum(1 for indicator in contribution_indicators if indicator in text)
        return min(1.0, found_indicators / len(contribution_indicators))

    def _generate_evaluation_details(self, capabilities: Dict[str, float], domain: str) -> Dict[str, Any]:
        """生成详细评估报告"""
        details = {}

        capability_names = {
            "technical_depth": "技术深度",
            "communication_skills": "沟通表达",
            "logical_thinking": "逻辑思维",
            "innovation_ability": "创新能力",
            "learning_ability": "学习能力",
            "teamwork_skills": "团队协作"
        }

        for key, score in capabilities.items():
            name = capability_names.get(key, key)

            if score >= 0.8:
                level = "优秀"
                description = f"{name}表现优秀，达到高水平标准"
            elif score >= 0.6:
                level = "良好"
                description = f"{name}表现良好，有进一步提升空间"
            elif score >= 0.4:
                level = "一般"
                description = f"{name}表现一般，需要重点改进"
            else:
                level = "待提升"
                description = f"{name}有待提升，建议加强相关训练"

            details[key] = {
                "name": name,
                "score": score,
                "level": level,
                "description": description
            }

        return details

    def _generate_improvement_suggestions(self, capabilities: Dict[str, float]) -> List[Dict[str, Any]]:
        """生成改进建议"""
        suggestions = []

        improvement_advice = {
            "technical_depth": {
                "low": "建议深入学习专业技术知识，多关注行业前沿技术发展",
                "medium": "继续提升技术深度，可以通过实际项目加深理解",
                "actions": ["阅读技术文档", "参与开源项目", "学习新技术"]
            },
            "communication_skills": {
                "low": "建议加强语言表达训练，提高沟通效果",
                "medium": "继续优化表达方式，注意逻辑性和清晰度",
                "actions": ["练习演讲", "参加辩论", "录制视频自我评估"]
            },
            "logical_thinking": {
                "low": "建议加强逻辑思维训练，提高分析问题的能力",
                "medium": "继续培养逻辑思维，多练习结构化思考",
                "actions": ["学习逻辑学", "练习思维导图", "分析案例研究"]
            },
            "innovation_ability": {
                "low": "建议培养创新思维，多关注新技术和新方法",
                "medium": "继续发挥创新能力，可以尝试更多创新实践",
                "actions": ["头脑风暴", "跨领域学习", "参与创新项目"]
            },
            "learning_ability": {
                "low": "建议建立持续学习的习惯，提高学习效率",
                "medium": "继续保持学习热情，可以尝试更多学习方法",
                "actions": ["制定学习计划", "总结学习经验", "分享学习成果"]
            },
            "teamwork_skills": {
                "low": "建议加强团队协作意识，提高沟通协调能力",
                "medium": "继续发挥团队精神，可以承担更多团队责任",
                "actions": ["参与团队项目", "练习协调沟通", "学习领导技能"]
            }
        }

        for capability, score in capabilities.items():
            if capability in improvement_advice:
                advice = improvement_advice[capability]

                if score < 0.5:
                    suggestions.append({
                        "capability": capability,
                        "priority": "high",
                        "suggestion": advice["low"],
                        "actions": advice["actions"]
                    })
                elif score < 0.7:
                    suggestions.append({
                        "capability": capability,
                        "priority": "medium",
                        "suggestion": advice["medium"],
                        "actions": advice["actions"]
                    })

        return suggestions

    # 新增的辅助计算方法
    def _calculate_terminology_coverage(self, text: str, domain: str) -> float:
        """计算技术术语覆盖度"""
        try:
            if domain not in self.domain_keywords:
                return 0.5

            total_score = 0.0
            total_weight = 0.0

            for level, keywords in self.domain_keywords[domain].items():
                weight = self.technical_difficulty_weights.get(level, 1.0)
                found_count = sum(1 for keyword in keywords if keyword in text)
                coverage = found_count / len(keywords) if keywords else 0
                total_score += coverage * weight
                total_weight += weight

            return total_score / total_weight if total_weight > 0 else 0.0

        except Exception as e:
            logger.error(f"术语覆盖度计算失败: {e}")
            return 0.5

    def _calculate_technical_depth_level(self, text: str, domain: str) -> float:
        """计算技术深度层次"""
        try:
            if domain not in self.domain_keywords:
                return 0.5

            max_level_score = 0.0

            for level, keywords in self.domain_keywords[domain].items():
                found_count = sum(1 for keyword in keywords if keyword in text)
                if found_count > 0:
                    level_weight = self.technical_difficulty_weights.get(level, 1.0)
                    coverage = found_count / len(keywords)
                    level_score = coverage * level_weight / 2.0  # 归一化到0-1
                    max_level_score = max(max_level_score, level_score)

            return min(1.0, max_level_score)

        except Exception as e:
            logger.error(f"技术深度层次计算失败: {e}")
            return 0.5

    def _calculate_stress_handling_score(self, text: str) -> float:
        """计算压力应对得分"""
        try:
            stress_indicators = self.stress_resistance_indicators["压力应对"]
            found_count = sum(1 for indicator in stress_indicators if indicator in text)
            return found_count / len(stress_indicators)
        except Exception as e:
            logger.error(f"压力应对得分计算失败: {e}")
            return 0.5

    def _calculate_adaptability_score(self, text: str) -> float:
        """计算适应能力得分"""
        try:
            adaptability_indicators = self.stress_resistance_indicators["适应能力"]
            found_count = sum(1 for indicator in adaptability_indicators if indicator in text)
            return found_count / len(adaptability_indicators)
        except Exception as e:
            logger.error(f"适应能力得分计算失败: {e}")
            return 0.5

    def _calculate_emotional_stability_score(self, text: str, audio_analysis: Dict) -> float:
        """计算情绪稳定性得分"""
        try:
            # 文本情绪指标
            emotion_indicators = self.stress_resistance_indicators["情绪管理"]
            text_score = sum(1 for indicator in emotion_indicators if indicator in text) / len(emotion_indicators)

            # 音频情绪分析（如果有）
            audio_score = 0.5
            if audio_analysis and "emotion_analysis" in audio_analysis:
                emotion_data = audio_analysis["emotion_analysis"]
                if "stability" in emotion_data:
                    audio_score = emotion_data["stability"]

            return (text_score * 0.6 + audio_score * 0.4)
        except Exception as e:
            logger.error(f"情绪稳定性得分计算失败: {e}")
            return 0.5

    def _calculate_resilience_score(self, text: str) -> float:
        """计算抗挫折能力得分"""
        try:
            resilience_indicators = self.stress_resistance_indicators["抗挫折"]
            found_count = sum(1 for indicator in resilience_indicators if indicator in text)
            return found_count / len(resilience_indicators)
        except Exception as e:
            logger.error(f"抗挫折能力得分计算失败: {e}")
            return 0.5

# 创建全局实例
enhanced_capability_evaluator = EnhancedCapabilityEvaluator()
