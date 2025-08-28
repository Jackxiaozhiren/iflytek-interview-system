"""
增强AI能力评估服务
提升6项核心能力评估的准确性和智能化水平
"""

import asyncio
import logging
import json
from typing import Dict, Any, List, Optional, Tuple
from datetime import datetime
import numpy as np
from dataclasses import dataclass

from ..core.config import settings
from .iflytek_service import MultimodalAnalysisService
from .enhanced_iflytek_service import get_enhanced_iflytek_service

logger = logging.getLogger(__name__)

@dataclass
class CapabilityMetrics:
    """能力评估指标"""
    professional_knowledge: float = 0.0
    skill_matching: float = 0.0
    language_expression: float = 0.0
    logical_thinking: float = 0.0
    innovation_ability: float = 0.0
    stress_resistance: float = 0.0
    
    def to_dict(self) -> Dict[str, float]:
        return {
            "professional_knowledge": self.professional_knowledge,
            "skill_matching": self.skill_matching,
            "language_expression": self.language_expression,
            "logical_thinking": self.logical_thinking,
            "innovation_ability": self.innovation_ability,
            "stress_resistance": self.stress_resistance
        }

class EnhancedAICapabilityService:
    """增强AI能力评估服务"""
    
    def __init__(self):
        self.iflytek_service = MultimodalAnalysisService()
        self.enhanced_iflytek_service = get_enhanced_iflytek_service()
        self.domain_keywords = self._load_domain_keywords()
        self.capability_weights = settings.capability_weights
        self.evaluation_history = []
        
    def _load_domain_keywords(self) -> Dict[str, List[str]]:
        """加载技术领域关键词库"""
        return {
            "人工智能": [
                "机器学习", "深度学习", "神经网络", "自然语言处理", "计算机视觉",
                "强化学习", "卷积神经网络", "循环神经网络", "Transformer", "BERT",
                "GPT", "算法优化", "模型训练", "特征工程", "数据预处理",
                "TensorFlow", "PyTorch", "Keras", "scikit-learn", "OpenCV"
            ],
            "大数据": [
                "Hadoop", "Spark", "Hive", "HBase", "Kafka", "Flink", "Storm",
                "数据挖掘", "数据仓库", "ETL", "数据清洗", "数据可视化",
                "分布式计算", "流式处理", "批处理", "NoSQL", "MongoDB",
                "Elasticsearch", "Redis", "数据分析", "统计学", "Python"
            ],
            "物联网": [
                "传感器", "嵌入式系统", "单片机", "Arduino", "树莓派",
                "MQTT", "CoAP", "LoRa", "NB-IoT", "5G", "边缘计算",
                "云计算", "物联网协议", "无线通信", "蓝牙", "WiFi",
                "Zigbee", "实时系统", "固件开发", "硬件设计"
            ]
        }
    
    async def enhanced_capability_assessment(
        self,
        text_data: Optional[str] = None,
        audio_analysis: Optional[Dict] = None,
        video_analysis: Optional[Dict] = None,
        question_context: Optional[str] = None,
        domain: str = "人工智能",
        position: str = "AI工程师"
    ) -> Dict[str, Any]:
        """
        增强版6项核心能力评估
        """
        try:
            logger.info(f"开始增强版能力评估 - 领域: {domain}, 职位: {position}")
            
            # 初始化评估结果
            capability_metrics = CapabilityMetrics()
            detailed_analysis = {}
            
            # 1. 专业知识水平评估 (25%)
            professional_score, professional_details = await self._assess_professional_knowledge(
                text_data, domain, question_context
            )
            capability_metrics.professional_knowledge = professional_score
            detailed_analysis["professional_knowledge"] = professional_details
            
            # 2. 技能匹配度评估 (20%)
            skill_score, skill_details = await self._assess_skill_matching(
                text_data, domain, position, question_context
            )
            capability_metrics.skill_matching = skill_score
            detailed_analysis["skill_matching"] = skill_details
            
            # 3. 语言表达能力评估 (15%)
            language_score, language_details = await self._assess_language_expression(
                text_data, audio_analysis
            )
            capability_metrics.language_expression = language_score
            detailed_analysis["language_expression"] = language_details
            
            # 4. 逻辑思维能力评估 (15%)
            logic_score, logic_details = await self._assess_logical_thinking(
                text_data, question_context
            )
            capability_metrics.logical_thinking = logic_score
            detailed_analysis["logical_thinking"] = logic_details
            
            # 5. 创新能力评估 (15%)
            innovation_score, innovation_details = await self._assess_innovation_ability(
                text_data, domain, question_context
            )
            capability_metrics.innovation_ability = innovation_score
            detailed_analysis["innovation_ability"] = innovation_details
            
            # 6. 应变抗压能力评估 (10%)
            stress_score, stress_details = await self._assess_stress_resistance(
                audio_analysis, video_analysis, text_data
            )
            capability_metrics.stress_resistance = stress_score
            detailed_analysis["stress_resistance"] = stress_details
            
            # 计算综合得分
            overall_score = self._calculate_weighted_score(capability_metrics)
            
            # 生成智能建议
            recommendations = await self._generate_intelligent_recommendations(
                capability_metrics, domain, position
            )
            
            # 生成能力雷达图数据
            radar_data = self._generate_radar_chart_data(capability_metrics)
            
            result = {
                "capability_scores": capability_metrics.to_dict(),
                "overall_score": overall_score,
                "detailed_analysis": detailed_analysis,
                "intelligent_recommendations": recommendations,
                "radar_chart_data": radar_data,
                "assessment_metadata": {
                    "domain": domain,
                    "position": position,
                    "timestamp": datetime.now().isoformat(),
                    "assessment_version": "2.0"
                }
            }
            
            # 记录评估历史
            self.evaluation_history.append(result)
            
            logger.info(f"增强版能力评估完成 - 综合得分: {overall_score:.2f}")
            return result
            
        except Exception as e:
            logger.error(f"增强版能力评估失败: {e}")
            return {
                "error": str(e),
                "capability_scores": CapabilityMetrics().to_dict(),
                "overall_score": 0.0
            }
    
    async def _assess_professional_knowledge(
        self, text_data: str, domain: str, question_context: str
    ) -> Tuple[float, Dict]:
        """评估专业知识水平"""
        try:
            if not text_data:
                return 0.5, {"error": "缺少文本数据"}
            
            # 关键词匹配分析
            domain_keywords = self.domain_keywords.get(domain, [])
            keyword_matches = sum(1 for keyword in domain_keywords if keyword in text_data)
            keyword_score = min(keyword_matches / max(len(domain_keywords) * 0.3, 1), 1.0)
            
            # 使用iFlytek Spark进行深度分析 - 增强版本
            prompt = f"""
            作为{domain}领域的资深技术专家，请客观分析以下技术回答的专业水平。

            【面试问题】：{question_context}
            【候选人回答】：{text_data}

            【分析要求】：
            请仔细评估回答的技术质量，特别注意：
            - 不要因为回答详细或结构化就认为是复制粘贴
            - 重点关注技术理解的深度和准确性
            - 考虑回答与问题的相关性和针对性
            - 评估是否体现了实际的技术思考过程

            【评分维度】（0-1分）：
            1. 专业术语使用准确性 - 技术词汇是否正确、恰当
            2. 技术概念理解深度 - 是否真正理解核心概念
            3. 实际应用经验体现 - 是否展现实践经验
            4. 前沿技术了解程度 - 对新技术的认知水平
            5. 回答针对性 - 是否直接回应了问题要求
            6. 逻辑思维清晰度 - 回答的逻辑结构是否合理

            【特别注意】：
            - 如果回答包含具体的技术方案、架构设计或实现细节，应给予较高评分
            - 如果回答展现了对技术挑战的深入思考，应认定为高质量回答
            - 不要仅因为回答长度或格式就判断为低质量

            请返回JSON格式：{{"scores": {{"accuracy": 0.8, "depth": 0.7, "experience": 0.6, "frontier": 0.5, "relevance": 0.8, "logic": 0.7}}, "analysis": "详细分析", "quality_level": "high/medium/low"}}
            """
            
            ai_analysis = await self.enhanced_iflytek_service.chat_with_spark([{"role": "user", "content": prompt}])
            
            # 解析AI分析结果 - 增强版本
            try:
                ai_result = json.loads(ai_analysis.get("content", "{}"))
                ai_scores = ai_result.get("scores", {})
                quality_level = ai_result.get("quality_level", "medium")

                if ai_scores:
                    # 加权计算AI分数，重点关注相关性和逻辑性
                    weights = {
                        "accuracy": 0.2,
                        "depth": 0.25,
                        "experience": 0.15,
                        "frontier": 0.1,
                        "relevance": 0.2,
                        "logic": 0.1
                    }

                    ai_score = sum(ai_scores.get(key, 0.5) * weight
                                 for key, weight in weights.items())

                    # 根据质量等级调整分数
                    if quality_level == "high":
                        ai_score = min(ai_score * 1.1, 1.0)
                    elif quality_level == "low":
                        ai_score = max(ai_score * 0.9, 0.0)
                else:
                    ai_score = 0.5
            except Exception as e:
                ai_score = 0.5
                ai_result = {"analysis": f"AI分析解析失败: {str(e)}", "quality_level": "medium"}

            # 综合评分 - 降低关键词权重，提高AI分析权重
            final_score = (keyword_score * 0.3 + ai_score * 0.7)
            
            details = {
                "keyword_analysis": {
                    "matches": keyword_matches,
                    "total_keywords": len(domain_keywords),
                    "score": keyword_score
                },
                "ai_analysis": ai_result,
                "final_score": final_score
            }
            
            return final_score, details
            
        except Exception as e:
            logger.error(f"专业知识评估失败: {e}")
            return 0.5, {"error": str(e)}
    
    def _calculate_weighted_score(self, metrics: CapabilityMetrics) -> float:
        """计算加权综合得分"""
        weights = self.capability_weights
        total_score = (
            metrics.professional_knowledge * weights["professional_knowledge"] +
            metrics.skill_matching * weights["skill_matching"] +
            metrics.language_expression * weights["language_expression"] +
            metrics.logical_thinking * weights["logical_thinking"] +
            metrics.innovation_ability * weights["innovation_ability"] +
            metrics.stress_resistance * weights["stress_resistance"]
        )
        return round(total_score * 100, 2)  # 转换为百分制
    
    async def _assess_skill_matching(
        self, text_data: str, domain: str, position: str, question_context: str
    ) -> Tuple[float, Dict]:
        """评估技能匹配度"""
        try:
            if not text_data:
                return 0.5, {"error": "缺少文本数据"}

            # 职位技能要求映射
            position_skills = {
                "AI工程师": ["Python", "机器学习", "深度学习", "数据分析", "算法设计"],
                "数据分析师": ["SQL", "Python", "R", "统计学", "数据可视化"],
                "IoT工程师": ["嵌入式开发", "C/C++", "传感器", "无线通信", "硬件设计"],
                "算法工程师": ["算法设计", "数学建模", "优化理论", "编程能力", "问题分析"],
                "数据工程师": ["ETL", "数据库", "分布式系统", "数据架构", "性能优化"]
            }

            required_skills = position_skills.get(position, [])
            skill_matches = sum(1 for skill in required_skills if skill in text_data)
            skill_score = skill_matches / max(len(required_skills), 1) if required_skills else 0.5

            # AI深度分析
            prompt = f"""
            分析候选人回答与{position}职位的匹配度：

            职位要求：{position}（{domain}领域）
            候选人回答：{text_data}

            评估维度（0-1分）：
            1. 技能覆盖度
            2. 经验相关性
            3. 职业理解度
            4. 发展潜力

            返回JSON：{{"scores": {{"coverage": 0.8, "relevance": 0.7, "understanding": 0.6, "potential": 0.9}}, "analysis": "分析"}}
            """

            ai_analysis = await self.enhanced_iflytek_service.chat_with_spark([{"role": "user", "content": prompt}])

            try:
                ai_result = json.loads(ai_analysis.get("content", "{}"))
                ai_scores = ai_result.get("scores", {})
                ai_score = np.mean(list(ai_scores.values())) if ai_scores else 0.5
            except:
                ai_score = 0.5
                ai_result = {"analysis": "AI分析解析失败"}

            final_score = (skill_score * 0.3 + ai_score * 0.7)

            details = {
                "skill_analysis": {
                    "required_skills": required_skills,
                    "matches": skill_matches,
                    "score": skill_score
                },
                "ai_analysis": ai_result,
                "final_score": final_score
            }

            return final_score, details

        except Exception as e:
            logger.error(f"技能匹配度评估失败: {e}")
            return 0.5, {"error": str(e)}

    async def _assess_language_expression(
        self, text_data: str, audio_analysis: Optional[Dict]
    ) -> Tuple[float, Dict]:
        """评估语言表达能力"""
        try:
            text_score = 0.5
            audio_score = 0.5

            # 文本表达分析
            if text_data:
                # 基础指标
                word_count = len(text_data.split())
                sentence_count = text_data.count('。') + text_data.count('！') + text_data.count('？')
                avg_sentence_length = word_count / max(sentence_count, 1)

                # 表达质量评分
                length_score = min(word_count / 100, 1.0)  # 100字为满分
                structure_score = min(avg_sentence_length / 20, 1.0)  # 平均句长20字为满分

                text_score = (length_score + structure_score) / 2

            # 音频表达分析
            if audio_analysis:
                fluency = audio_analysis.get("fluency_analysis", {}).get("fluency_score", 0.5)
                clarity = audio_analysis.get("quality_assessment", {}).get("clarity_score", 0.5)
                emotion = audio_analysis.get("emotion_analysis", {}).get("confidence", 0.5)

                audio_score = (fluency + clarity + emotion) / 3

            final_score = (text_score * 0.6 + audio_score * 0.4)

            details = {
                "text_analysis": {
                    "word_count": word_count if text_data else 0,
                    "sentence_count": sentence_count if text_data else 0,
                    "score": text_score
                },
                "audio_analysis": {
                    "fluency": audio_analysis.get("fluency_analysis", {}) if audio_analysis else {},
                    "score": audio_score
                },
                "final_score": final_score
            }

            return final_score, details

        except Exception as e:
            logger.error(f"语言表达能力评估失败: {e}")
            return 0.5, {"error": str(e)}

    async def _assess_logical_thinking(
        self, text_data: str, question_context: str
    ) -> Tuple[float, Dict]:
        """评估逻辑思维能力"""
        try:
            if not text_data:
                return 0.5, {"error": "缺少文本数据"}

            # 逻辑结构分析
            logical_words = ["首先", "其次", "然后", "最后", "因此", "所以", "由于", "因为"]
            logical_count = sum(1 for word in logical_words if word in text_data)
            structure_score = min(logical_count / 3, 1.0)  # 3个逻辑词为满分

            # AI逻辑分析
            prompt = f"""
            分析以下回答的逻辑思维能力：

            问题：{question_context}
            回答：{text_data}

            评估维度（0-1分）：
            1. 逻辑结构清晰度
            2. 论证充分性
            3. 因果关系合理性
            4. 结论准确性

            返回JSON：{{"scores": {{"structure": 0.8, "evidence": 0.7, "causality": 0.6, "conclusion": 0.9}}, "analysis": "分析"}}
            """

            ai_analysis = await self.enhanced_iflytek_service.chat_with_spark([{"role": "user", "content": prompt}])

            try:
                ai_result = json.loads(ai_analysis.get("content", "{}"))
                ai_scores = ai_result.get("scores", {})
                ai_score = np.mean(list(ai_scores.values())) if ai_scores else 0.5
            except:
                ai_score = 0.5
                ai_result = {"analysis": "AI分析解析失败"}

            final_score = (structure_score * 0.3 + ai_score * 0.7)

            details = {
                "structure_analysis": {
                    "logical_words": logical_count,
                    "score": structure_score
                },
                "ai_analysis": ai_result,
                "final_score": final_score
            }

            return final_score, details

        except Exception as e:
            logger.error(f"逻辑思维能力评估失败: {e}")
            return 0.5, {"error": str(e)}

    async def _assess_innovation_ability(
        self, text_data: str, domain: str, question_context: str
    ) -> Tuple[float, Dict]:
        """评估创新能力"""
        try:
            if not text_data:
                return 0.5, {"error": "缺少文本数据"}

            # 创新关键词分析
            innovation_words = ["创新", "改进", "优化", "新方法", "突破", "创造", "发明", "独特", "原创"]
            innovation_count = sum(1 for word in innovation_words if word in text_data)
            keyword_score = min(innovation_count / 2, 1.0)  # 2个创新词为满分

            # AI创新分析
            prompt = f"""
            分析以下回答的创新能力（{domain}领域）：

            问题：{question_context}
            回答：{text_data}

            评估维度（0-1分）：
            1. 思维独特性
            2. 解决方案创新性
            3. 技术前瞻性
            4. 实用性创新

            返回JSON：{{"scores": {{"uniqueness": 0.8, "innovation": 0.7, "foresight": 0.6, "practicality": 0.9}}, "analysis": "分析"}}
            """

            ai_analysis = await self.enhanced_iflytek_service.chat_with_spark([{"role": "user", "content": prompt}])

            try:
                ai_result = json.loads(ai_analysis.get("content", "{}"))
                ai_scores = ai_result.get("scores", {})
                ai_score = np.mean(list(ai_scores.values())) if ai_scores else 0.5
            except:
                ai_score = 0.5
                ai_result = {"analysis": "AI分析解析失败"}

            final_score = (keyword_score * 0.2 + ai_score * 0.8)

            details = {
                "keyword_analysis": {
                    "innovation_words": innovation_count,
                    "score": keyword_score
                },
                "ai_analysis": ai_result,
                "final_score": final_score
            }

            return final_score, details

        except Exception as e:
            logger.error(f"创新能力评估失败: {e}")
            return 0.5, {"error": str(e)}

    async def _assess_stress_resistance(
        self, audio_analysis: Optional[Dict], video_analysis: Optional[Dict], text_data: str
    ) -> Tuple[float, Dict]:
        """评估应变抗压能力"""
        try:
            audio_score = 0.5
            video_score = 0.5
            text_score = 0.5

            # 音频情绪稳定性分析
            if audio_analysis:
                emotion_data = audio_analysis.get("emotion_analysis", {})
                stability = emotion_data.get("stability", 0.5)
                confidence = emotion_data.get("confidence", 0.5)
                audio_score = (stability + confidence) / 2

            # 视频表现分析
            if video_analysis:
                facial_emotion = video_analysis.get("facial_analysis", {}).get("emotion_stability", 0.5)
                posture = video_analysis.get("posture_analysis", {}).get("confidence_score", 0.5)
                video_score = (facial_emotion + posture) / 2

            # 文本表达稳定性
            if text_data:
                # 检查消极词汇
                negative_words = ["紧张", "困难", "不会", "不懂", "害怕", "担心"]
                negative_count = sum(1 for word in negative_words if word in text_data)
                text_score = max(1.0 - negative_count * 0.2, 0.0)

            final_score = (audio_score * 0.4 + video_score * 0.4 + text_score * 0.2)

            details = {
                "audio_stability": {
                    "emotion_analysis": audio_analysis.get("emotion_analysis", {}) if audio_analysis else {},
                    "score": audio_score
                },
                "video_stability": {
                    "facial_analysis": video_analysis.get("facial_analysis", {}) if video_analysis else {},
                    "score": video_score
                },
                "text_stability": {
                    "negative_indicators": negative_count if text_data else 0,
                    "score": text_score
                },
                "final_score": final_score
            }

            return final_score, details

        except Exception as e:
            logger.error(f"应变抗压能力评估失败: {e}")
            return 0.5, {"error": str(e)}

    async def _generate_intelligent_recommendations(
        self, metrics: CapabilityMetrics, domain: str, position: str
    ) -> List[Dict[str, Any]]:
        """生成智能建议"""
        try:
            recommendations = []

            # 分析各项能力得分，生成针对性建议
            scores = metrics.to_dict()

            for capability, score in scores.items():
                if score < 0.6:  # 低于60分的能力需要改进
                    recommendation = await self._generate_capability_recommendation(
                        capability, score, domain, position
                    )
                    recommendations.append(recommendation)

            # 如果所有能力都不错，给出提升建议
            if not recommendations:
                recommendations.append({
                    "type": "excellence",
                    "title": "继续保持优秀表现",
                    "description": "您在各项能力上都表现出色，建议继续深化专业技能，关注行业前沿动态。",
                    "priority": "medium",
                    "actions": [
                        "参与开源项目贡献",
                        "发表技术文章或论文",
                        "参加行业会议和技术交流"
                    ]
                })

            return recommendations

        except Exception as e:
            logger.error(f"生成智能建议失败: {e}")
            return []

    async def _generate_capability_recommendation(
        self, capability: str, score: float, domain: str, position: str
    ) -> Dict[str, Any]:
        """为特定能力生成改进建议"""
        capability_names = {
            "professional_knowledge": "专业知识",
            "skill_matching": "技能匹配",
            "language_expression": "语言表达",
            "logical_thinking": "逻辑思维",
            "innovation_ability": "创新能力",
            "stress_resistance": "抗压能力"
        }

        capability_name = capability_names.get(capability, capability)

        # 基于能力类型和领域生成建议
        recommendations_map = {
            "professional_knowledge": {
                "title": f"提升{domain}专业知识",
                "description": f"您在{domain}专业知识方面还有提升空间",
                "actions": [
                    "系统学习相关理论知识",
                    "参与实际项目实践",
                    "关注技术发展趋势"
                ]
            },
            "skill_matching": {
                "title": f"增强{position}技能匹配度",
                "description": f"建议针对{position}职位要求补强相关技能",
                "actions": [
                    "学习职位核心技能",
                    "获得相关认证",
                    "积累项目经验"
                ]
            },
            "language_expression": {
                "title": "提升语言表达能力",
                "description": "建议加强口语和书面表达训练",
                "actions": [
                    "多参与技术分享",
                    "练习技术写作",
                    "参加演讲训练"
                ]
            }
        }

        default_rec = {
            "title": f"提升{capability_name}",
            "description": f"在{capability_name}方面需要进一步改进",
            "actions": ["制定学习计划", "寻求专业指导", "持续练习提升"]
        }

        rec = recommendations_map.get(capability, default_rec)

        return {
            "type": "improvement",
            "capability": capability,
            "score": score,
            "priority": "high" if score < 0.4 else "medium",
            **rec
        }

    def _generate_radar_chart_data(self, metrics: CapabilityMetrics) -> Dict:
        """生成雷达图数据"""
        return {
            "labels": ["专业知识", "技能匹配", "语言表达", "逻辑思维", "创新能力", "抗压能力"],
            "values": [
                metrics.professional_knowledge * 100,
                metrics.skill_matching * 100,
                metrics.language_expression * 100,
                metrics.logical_thinking * 100,
                metrics.innovation_ability * 100,
                metrics.stress_resistance * 100
            ],
            "max_value": 100
        }
