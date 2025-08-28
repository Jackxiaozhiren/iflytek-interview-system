"""
增强的多模态分析服务
集成iFlytek Spark LLM，提供稳定、准确的多模态分析
"""

import asyncio
import logging
import time
from typing import Dict, Any, Optional, List
from datetime import datetime
import json
import base64

from ..core.config import settings
from ..core.iflytek_manager import connection_manager
from .iflytek_service import MultimodalAnalysisService
from .enhanced_capability_evaluator import enhanced_capability_evaluator

logger = logging.getLogger(__name__)

class EnhancedMultimodalService:
    """增强的多模态分析服务"""
    
    def __init__(self):
        self.iflytek_service = MultimodalAnalysisService()
        self.connection_manager = connection_manager
        self.analysis_cache = {}
        self.performance_metrics = {
            "total_analyses": 0,
            "successful_analyses": 0,
            "failed_analyses": 0,
            "average_processing_time": 0.0,
            "modality_stats": {
                "text": {"count": 0, "avg_time": 0.0},
                "audio": {"count": 0, "avg_time": 0.0},
                "video": {"count": 0, "avg_time": 0.0}
            }
        }
    
    async def analyze_comprehensive(
        self, 
        text_data: Optional[str] = None,
        audio_data: Optional[bytes] = None,
        video_data: Optional[bytes] = None,
        question_context: Optional[str] = None,
        domain: Optional[str] = None,
        session_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        综合多模态分析 - 增强版
        """
        start_time = time.time()
        analysis_id = f"analysis_{int(time.time())}_{session_id or 'default'}"
        
        try:
            logger.info(f"开始综合多模态分析: {analysis_id}")
            
            # 检查缓存
            cache_key = self._generate_cache_key(text_data, audio_data, video_data, question_context, domain)
            cached_result = self.connection_manager.get_cached_response({"cache_key": cache_key})
            
            if cached_result:
                logger.info(f"使用缓存结果: {analysis_id}")
                return cached_result
            
            # 并行处理各模态数据
            analysis_tasks = []
            modalities_processed = []
            
            # 文本分析
            if text_data:
                analysis_tasks.append(self._analyze_text_enhanced(text_data, question_context, domain))
                modalities_processed.append("text")
            
            # 音频分析
            if audio_data:
                analysis_tasks.append(self._analyze_audio_enhanced(audio_data, question_context))
                modalities_processed.append("audio")
            
            # 视频分析
            if video_data:
                analysis_tasks.append(self._analyze_video_enhanced(video_data, question_context))
                modalities_processed.append("video")
            
            # 并行执行分析
            if analysis_tasks:
                analysis_results = await asyncio.gather(*analysis_tasks, return_exceptions=True)
            else:
                analysis_results = []
            
            # 处理分析结果
            processed_results = {}
            for i, result in enumerate(analysis_results):
                modality = modalities_processed[i]
                if isinstance(result, Exception):
                    logger.error(f"{modality}分析失败: {result}")
                    processed_results[f"{modality}_analysis"] = {"error": str(result)}
                else:
                    processed_results[f"{modality}_analysis"] = result
            
            # 多模态融合分析
            fusion_result = await self._intelligent_fusion(processed_results, question_context, domain)
            
            # 计算6核心能力指标 - 使用增强评估器
            capability_scores = enhanced_capability_evaluator.evaluate_comprehensive(
                processed_results, domain
            )
            
            # 生成智能建议 - 使用评估器的建议
            recommendations = capability_scores.get("improvement_suggestions", [])

            # 补充多模态特定建议
            additional_recommendations = await self._generate_enhanced_recommendations(
                processed_results, capability_scores, domain
            )
            recommendations.extend(additional_recommendations)
            
            # 构建最终结果
            final_result = {
                "analysis_id": analysis_id,
                "session_id": session_id,
                "timestamp": datetime.now().isoformat(),
                "modalities_processed": modalities_processed,
                "individual_analyses": processed_results,
                "fusion_result": fusion_result,
                "capability_scores": capability_scores,
                "overall_assessment": self._generate_overall_assessment(capability_scores.get("capabilities", {})),
                "intelligent_recommendations": recommendations,
                "processing_metadata": {
                    "total_processing_time": round(time.time() - start_time, 3),
                    "analysis_quality": "high",
                    "confidence_level": fusion_result.get("confidence_score", 0.8)
                }
            }
            
            # 缓存结果
            self.connection_manager.cache_response({"cache_key": cache_key}, final_result)
            
            # 更新性能指标
            self._update_performance_metrics(start_time, True, modalities_processed)
            
            logger.info(f"综合多模态分析完成: {analysis_id}")
            return final_result
            
        except Exception as e:
            self._update_performance_metrics(start_time, False, [])
            logger.error(f"综合多模态分析失败: {analysis_id}, {e}")
            return {
                "analysis_id": analysis_id,
                "error": str(e),
                "timestamp": datetime.now().isoformat(),
                "processing_metadata": {
                    "total_processing_time": round(time.time() - start_time, 3),
                    "analysis_quality": "failed",
                    "confidence_level": 0.0
                }
            }
    
    async def _analyze_text_enhanced(self, text_data: str, question_context: str, domain: str) -> Dict[str, Any]:
        """增强文本分析"""
        start_time = time.time()
        
        try:
            # 使用iFlytek Spark进行文本分析
            spark_analysis = await self.iflytek_service.analyze_text_with_spark(
                text_data, question_context, domain
            )
            
            # 基础文本特征分析
            basic_features = self._extract_text_features(text_data)
            
            # 专业术语分析
            domain_analysis = self._analyze_domain_terminology(text_data, domain)
            
            # 逻辑结构分析
            logic_analysis = self._analyze_text_logic(text_data)
            
            processing_time = time.time() - start_time
            self.performance_metrics["modality_stats"]["text"]["count"] += 1
            self.performance_metrics["modality_stats"]["text"]["avg_time"] = (
                (self.performance_metrics["modality_stats"]["text"]["avg_time"] * 
                 (self.performance_metrics["modality_stats"]["text"]["count"] - 1) + processing_time) /
                self.performance_metrics["modality_stats"]["text"]["count"]
            )
            
            return {
                "spark_analysis": spark_analysis,
                "basic_features": basic_features,
                "domain_analysis": domain_analysis,
                "logic_analysis": logic_analysis,
                "processing_time": round(processing_time, 3),
                "quality_score": self._calculate_text_quality_score(
                    spark_analysis, basic_features, domain_analysis, logic_analysis
                )
            }
            
        except Exception as e:
            logger.error(f"增强文本分析失败: {e}")
            return {"error": str(e)}
    
    async def _analyze_audio_enhanced(self, audio_data: bytes, question_context: str) -> Dict[str, Any]:
        """增强音频分析"""
        start_time = time.time()
        
        try:
            # 使用iFlytek ASR进行语音识别
            asr_result = await self.iflytek_service.recognize_audio(audio_data)
            
            # 语音特征分析
            speech_features = await self.iflytek_service.analyze_speech_features(audio_data)
            
            # 情感分析
            emotion_analysis = {}
            if asr_result.get("text"):
                emotion_analysis = await self.iflytek_service.analyze_emotion(asr_result["text"])
            
            # 语音质量评估
            quality_assessment = self._assess_audio_quality(speech_features)
            
            # 流畅度分析
            fluency_analysis = self._analyze_speech_fluency(speech_features, asr_result)
            
            processing_time = time.time() - start_time
            self.performance_metrics["modality_stats"]["audio"]["count"] += 1
            self.performance_metrics["modality_stats"]["audio"]["avg_time"] = (
                (self.performance_metrics["modality_stats"]["audio"]["avg_time"] * 
                 (self.performance_metrics["modality_stats"]["audio"]["count"] - 1) + processing_time) /
                self.performance_metrics["modality_stats"]["audio"]["count"]
            )
            
            return {
                "transcription": asr_result,
                "speech_features": speech_features,
                "emotion_analysis": emotion_analysis,
                "quality_assessment": quality_assessment,
                "fluency_analysis": fluency_analysis,
                "processing_time": round(processing_time, 3),
                "comprehensive_score": self._calculate_audio_comprehensive_score(
                    asr_result, speech_features, emotion_analysis, quality_assessment
                )
            }
            
        except Exception as e:
            logger.error(f"增强音频分析失败: {e}")
            return {"error": str(e)}
    
    async def _analyze_video_enhanced(self, video_data: bytes, question_context: str) -> Dict[str, Any]:
        """增强视频分析"""
        start_time = time.time()
        
        try:
            # 基础视频特征提取
            video_features = self._extract_video_features(video_data)
            
            # 表情分析（模拟）
            expression_analysis = self._analyze_facial_expressions(video_data)
            
            # 姿态分析（模拟）
            posture_analysis = self._analyze_body_posture(video_data)
            
            # 视觉印象评估
            visual_impression = self._assess_visual_impression(
                expression_analysis, posture_analysis
            )
            
            processing_time = time.time() - start_time
            self.performance_metrics["modality_stats"]["video"]["count"] += 1
            self.performance_metrics["modality_stats"]["video"]["avg_time"] = (
                (self.performance_metrics["modality_stats"]["video"]["avg_time"] * 
                 (self.performance_metrics["modality_stats"]["video"]["count"] - 1) + processing_time) /
                self.performance_metrics["modality_stats"]["video"]["count"]
            )
            
            return {
                "video_features": video_features,
                "expression_analysis": expression_analysis,
                "posture_analysis": posture_analysis,
                "visual_impression": visual_impression,
                "processing_time": round(processing_time, 3),
                "overall_score": self._calculate_video_overall_score(
                    expression_analysis, posture_analysis, visual_impression
                )
            }
            
        except Exception as e:
            logger.error(f"增强视频分析失败: {e}")
            return {"error": str(e)}
    
    def _generate_cache_key(self, text_data, audio_data, video_data, question_context, domain) -> str:
        """生成缓存键"""
        import hashlib
        
        # 创建内容摘要
        content_parts = []
        if text_data:
            content_parts.append(f"text:{hashlib.md5(text_data.encode()).hexdigest()[:8]}")
        if audio_data:
            content_parts.append(f"audio:{hashlib.md5(audio_data).hexdigest()[:8]}")
        if video_data:
            content_parts.append(f"video:{hashlib.md5(video_data).hexdigest()[:8]}")
        if question_context:
            content_parts.append(f"context:{hashlib.md5(question_context.encode()).hexdigest()[:8]}")
        if domain:
            content_parts.append(f"domain:{domain}")
        
        return "_".join(content_parts)
    
    def _update_performance_metrics(self, start_time: float, success: bool, modalities: List[str]):
        """更新性能指标"""
        processing_time = time.time() - start_time
        
        self.performance_metrics["total_analyses"] += 1
        if success:
            self.performance_metrics["successful_analyses"] += 1
        else:
            self.performance_metrics["failed_analyses"] += 1
        
        # 更新平均处理时间
        total_analyses = self.performance_metrics["total_analyses"]
        current_avg = self.performance_metrics["average_processing_time"]
        self.performance_metrics["average_processing_time"] = (
            (current_avg * (total_analyses - 1) + processing_time) / total_analyses
        )
    
    async def get_performance_metrics(self) -> Dict[str, Any]:
        """获取性能指标"""
        return {
            **self.performance_metrics,
            "success_rate": (
                self.performance_metrics["successful_analyses"] / 
                max(1, self.performance_metrics["total_analyses"])
            ) * 100,
            "connection_manager_stats": self.connection_manager.get_stats()
        }

    async def _intelligent_fusion(self, analysis_results: Dict[str, Any], question_context: str, domain: str) -> Dict[str, Any]:
        """智能多模态融合"""
        try:
            # 计算各模态的一致性
            consistency_scores = self._calculate_modality_consistency(analysis_results)

            # 计算融合置信度
            confidence_score = self._calculate_fusion_confidence(analysis_results, consistency_scores)

            # 生成融合洞察
            fusion_insights = self._generate_fusion_insights(analysis_results, consistency_scores)

            return {
                "confidence_score": confidence_score,
                "consistency_analysis": consistency_scores,
                "overall_coherence": sum(consistency_scores.values()) / len(consistency_scores) if consistency_scores else 0.5,
                "multimodal_insights": fusion_insights,
                "fusion_quality": "high" if confidence_score > 0.8 else "medium" if confidence_score > 0.6 else "low"
            }
        except Exception as e:
            logger.error(f"智能融合失败: {e}")
            return {
                "confidence_score": 0.5,
                "consistency_analysis": {},
                "overall_coherence": 0.5,
                "multimodal_insights": ["融合分析过程中出现错误"],
                "fusion_quality": "low"
            }

    def _calculate_enhanced_capabilities(self, analysis_results: Dict[str, Any], fusion_result: Dict[str, Any], domain: str) -> Dict[str, Any]:
        """计算增强的6核心能力指标"""
        try:
            capabilities = {}

            # 1. 专业知识水平 (25%)
            capabilities["professional_knowledge"] = self._assess_professional_knowledge(analysis_results, domain)

            # 2. 技能匹配度 (20%)
            capabilities["skill_matching"] = self._assess_skill_matching(analysis_results, domain)

            # 3. 语言表达能力 (15%)
            capabilities["language_expression"] = self._assess_language_expression(analysis_results)

            # 4. 逻辑思维能力 (15%)
            capabilities["logical_thinking"] = self._assess_logical_thinking(analysis_results)

            # 5. 创新能力 (15%)
            capabilities["innovation_ability"] = self._assess_innovation_ability(analysis_results)

            # 6. 应变抗压能力 (10%)
            capabilities["stress_resistance"] = self._assess_stress_resistance(analysis_results)

            # 计算加权总分
            weights = settings.capability_weights
            weighted_score = sum(
                capabilities[key] * weights.get(key, 0.1)
                for key in capabilities.keys()
            )

            capabilities["overall_score"] = round(weighted_score, 2)
            capabilities["assessment_quality"] = fusion_result.get("fusion_quality", "medium")

            return capabilities

        except Exception as e:
            logger.error(f"能力评估失败: {e}")
            return {
                "professional_knowledge": 0.5,
                "skill_matching": 0.5,
                "language_expression": 0.5,
                "logical_thinking": 0.5,
                "innovation_ability": 0.5,
                "stress_resistance": 0.5,
                "overall_score": 0.5,
                "assessment_quality": "low"
            }

    async def _generate_enhanced_recommendations(self, analysis_results: Dict[str, Any], capability_scores: Dict[str, Any], domain: str) -> List[Dict[str, Any]]:
        """生成增强建议"""
        try:
            recommendations = []

            # 基于能力分数生成建议
            for capability, score in capability_scores.items():
                if capability == "overall_score" or capability == "assessment_quality":
                    continue

                if score < 0.6:
                    recommendations.append({
                        "type": "improvement",
                        "capability": capability,
                        "priority": "high" if score < 0.4 else "medium",
                        "suggestion": self._get_improvement_suggestion(capability, score, domain),
                        "specific_actions": self._get_specific_actions(capability, domain)
                    })
                elif score > 0.8:
                    recommendations.append({
                        "type": "strength",
                        "capability": capability,
                        "priority": "maintain",
                        "suggestion": f"{self._get_capability_name(capability)}表现优秀，继续保持",
                        "specific_actions": ["继续发挥优势", "可以在此领域深入发展"]
                    })

            # 基于多模态分析结果生成建议
            if "text_analysis" in analysis_results:
                text_recommendations = self._generate_text_recommendations(analysis_results["text_analysis"])
                recommendations.extend(text_recommendations)

            if "audio_analysis" in analysis_results:
                audio_recommendations = self._generate_audio_recommendations(analysis_results["audio_analysis"])
                recommendations.extend(audio_recommendations)

            if "video_analysis" in analysis_results:
                video_recommendations = self._generate_video_recommendations(analysis_results["video_analysis"])
                recommendations.extend(video_recommendations)

            return recommendations[:10]  # 限制建议数量

        except Exception as e:
            logger.error(f"生成建议失败: {e}")
            return [{
                "type": "general",
                "priority": "medium",
                "suggestion": "建议继续练习和提升面试技能",
                "specific_actions": ["多练习", "总结经验"]
            }]

    def _generate_overall_assessment(self, capability_scores: Dict[str, Any]) -> Dict[str, Any]:
        """生成整体评估"""
        overall_score = capability_scores.get("overall_score", 0.5)

        if overall_score >= 0.8:
            level = "优秀"
            description = "综合表现优秀，各项能力均达到较高水平"
        elif overall_score >= 0.6:
            level = "良好"
            description = "综合表现良好，部分能力需要进一步提升"
        elif overall_score >= 0.4:
            level = "一般"
            description = "综合表现一般，多项能力需要重点改进"
        else:
            level = "待提升"
            description = "综合表现有待提升，建议加强各项能力训练"

        return {
            "overall_score": overall_score,
            "performance_level": level,
            "description": description,
            "assessment_timestamp": datetime.now().isoformat()
        }

    # 辅助方法
    def _extract_text_features(self, text: str) -> Dict[str, Any]:
        """提取文本特征"""
        return {
            "word_count": len(text.split()),
            "sentence_count": len([s for s in text.split('.') if s.strip()]),
            "avg_sentence_length": len(text.split()) / max(1, len([s for s in text.split('.') if s.strip()])),
            "complexity_score": min(1.0, len(set(text.split())) / max(1, len(text.split())))
        }

    def _analyze_domain_terminology(self, text: str, domain: str) -> Dict[str, Any]:
        """分析领域术语"""
        domain_keywords = {
            "人工智能": ["机器学习", "深度学习", "神经网络", "算法", "模型", "训练", "预测"],
            "大数据": ["数据挖掘", "数据分析", "数据仓库", "ETL", "Hadoop", "Spark", "分布式"],
            "物联网": ["传感器", "嵌入式", "通信协议", "边缘计算", "设备管理", "数据采集"]
        }

        keywords = domain_keywords.get(domain, [])
        found_keywords = [kw for kw in keywords if kw in text]

        return {
            "domain_keywords_found": found_keywords,
            "domain_relevance_score": len(found_keywords) / max(1, len(keywords)),
            "professional_terminology_count": len(found_keywords)
        }

    def _analyze_text_logic(self, text: str) -> Dict[str, Any]:
        """分析文本逻辑"""
        sentences = [s.strip() for s in text.split('.') if s.strip()]

        # 简单的逻辑连接词检测
        logic_words = ["因为", "所以", "但是", "然而", "首先", "其次", "最后", "总之"]
        logic_count = sum(1 for word in logic_words if word in text)

        return {
            "logical_structure_score": min(1.0, logic_count / max(1, len(sentences))),
            "coherence_indicators": logic_count,
            "structure_quality": "good" if logic_count > 2 else "average" if logic_count > 0 else "poor"
        }

# 创建全局实例
enhanced_multimodal_service = EnhancedMultimodalService()
