"""
评估报告生成服务
整合多模态分析结果，生成综合评估报告
"""
import json
from typing import Dict, Any, List, Optional
from datetime import datetime
from sqlalchemy.orm import Session
import numpy as np

from app.models import InterviewSession, InterviewResponse, MultimodalAnalysis, EvaluationReport
from app.services.capability_assessment_service import (
    professional_skill_assessor,
    communication_assessor,
    logical_thinking_assessor,
    learning_ability_assessor,
    stress_resistance_assessor,
    teamwork_assessor
)
from app.services.report_generation_service import (
    visualization_service,
    suggestion_service
)

class CapabilityEvaluator:
    """能力评估器"""
    
    def __init__(self):
        # 六大核心能力指标权重配置
        self.capability_weights = {
            "专业技能": {
                "text_weight": 0.6,    # 文本分析权重
                "audio_weight": 0.2,   # 语音分析权重
                "video_weight": 0.2,   # 视频分析权重
                "components": {
                    "content_relevance": 0.4,     # 内容相关性
                    "keyword_coverage": 0.3,      # 关键词覆盖
                    "innovation": 0.3             # 创新性
                }
            },
            "沟通表达": {
                "text_weight": 0.3,
                "audio_weight": 0.4,
                "video_weight": 0.3,
                "components": {
                    "logical_structure": 0.4,     # 逻辑结构
                    "speech_clarity": 0.3,        # 语音清晰度
                    "facial_expression": 0.3      # 面部表情
                }
            },
            "逻辑思维": {
                "text_weight": 0.7,
                "audio_weight": 0.2,
                "video_weight": 0.1,
                "components": {
                    "logical_structure": 0.6,     # 逻辑结构
                    "content_relevance": 0.4      # 内容相关性
                }
            },
            "学习能力": {
                "text_weight": 0.8,
                "audio_weight": 0.1,
                "video_weight": 0.1,
                "components": {
                    "innovation": 0.5,            # 创新性
                    "keyword_coverage": 0.3,      # 关键词覆盖
                    "content_relevance": 0.2      # 内容相关性
                }
            },
            "抗压能力": {
                "text_weight": 0.2,
                "audio_weight": 0.4,
                "video_weight": 0.4,
                "components": {
                    "emotion_score": 0.4,         # 情感得分
                    "speech_speed": 0.3,          # 语速稳定性
                    "posture_score": 0.3          # 身体姿态
                }
            },
            "团队协作": {
                "text_weight": 0.4,
                "audio_weight": 0.3,
                "video_weight": 0.3,
                "components": {
                    "content_relevance": 0.4,     # 内容相关性
                    "eye_contact": 0.3,           # 眼神交流
                    "gesture_appropriateness": 0.3 # 手势得体性
                }
            }
        }
    
    def calculate_capability_scores(self, analysis_results: List[Dict[str, Any]], session: InterviewSession) -> Dict[str, float]:
        """
        计算六大能力得分
        :param analysis_results: 多模态分析结果列表
        :param session: 面试会话信息
        :return: 能力得分字典
        """
        capability_scores = {}

        # 整合所有文本、音频、视频数据
        all_text = ""
        all_audio_data = []
        all_video_data = []

        for result in analysis_results:
            if "text_data" in result:
                all_text += result["text_data"] + " "
            if "audio_analysis" in result:
                all_audio_data.append(result["audio_analysis"])
            if "video_analysis" in result:
                all_video_data.append(result["video_analysis"])

        # 使用专门的评估器计算各项能力
        # 1. 专业技能
        professional_result = professional_skill_assessor.assess_professional_skill(
            all_text, session.domain, session.position
        )
        capability_scores["专业技能"] = professional_result["professional_score"]

        # 2. 沟通表达
        avg_audio = self._average_audio_data(all_audio_data) if all_audio_data else None
        avg_video = self._average_video_data(all_video_data) if all_video_data else None
        communication_result = communication_assessor.assess_communication_skill(
            all_text, avg_audio, avg_video
        )
        capability_scores["沟通表达"] = communication_result["communication_score"]

        # 3. 逻辑思维
        logical_result = logical_thinking_assessor.assess_logical_thinking(all_text)
        capability_scores["逻辑思维"] = logical_result["logical_thinking_score"]

        # 4. 学习能力
        learning_result = learning_ability_assessor.assess_learning_ability(all_text, session.domain)
        capability_scores["学习能力"] = learning_result["learning_ability_score"]

        # 5. 抗压能力
        stress_result = stress_resistance_assessor.assess_stress_resistance(
            all_text, avg_audio, avg_video
        )
        capability_scores["抗压能力"] = stress_result["stress_resistance_score"]

        # 6. 团队协作
        teamwork_result = teamwork_assessor.assess_teamwork_ability(all_text, avg_video)
        capability_scores["团队协作"] = teamwork_result["teamwork_score"]

        return capability_scores

    def _average_audio_data(self, audio_data_list: List[Dict]) -> Dict[str, float]:
        """计算音频数据的平均值"""
        if not audio_data_list:
            return {}

        avg_data = {}
        keys = set()
        for data in audio_data_list:
            keys.update(data.keys())

        for key in keys:
            values = [data.get(key, 0) for data in audio_data_list if key in data]
            avg_data[key] = np.mean(values) if values else 0

        return avg_data

    def _average_video_data(self, video_data_list: List[Dict]) -> Dict[str, float]:
        """计算视频数据的平均值"""
        if not video_data_list:
            return {}

        avg_data = {}
        keys = set()
        for data in video_data_list:
            keys.update(data.keys())

        for key in keys:
            values = [data.get(key, 0) for data in video_data_list if key in data]
            avg_data[key] = np.mean(values) if values else 0

        return avg_data

    def _calculate_single_capability_score(self, analysis_result: Dict[str, Any], config: Dict[str, Any]) -> Optional[float]:
        """计算单个分析结果的能力得分"""
        text_score = self._extract_text_score(analysis_result.get("text_analysis", {}), config["components"])
        audio_score = self._extract_audio_score(analysis_result.get("audio_analysis", {}), config["components"])
        video_score = self._extract_video_score(analysis_result.get("video_analysis", {}), config["components"])
        
        # 加权平均
        total_score = (
            text_score * config["text_weight"] +
            audio_score * config["audio_weight"] +
            video_score * config["video_weight"]
        )
        
        return min(100, max(0, total_score))
    
    def _extract_text_score(self, text_analysis: Dict[str, Any], components: Dict[str, float]) -> float:
        """从文本分析中提取得分"""
        score = 0.0
        
        for component, weight in components.items():
            if component == "content_relevance":
                relevance = text_analysis.get("content_relevance", {})
                score += relevance.get("overall_relevance", 0) * weight
            elif component == "logical_structure":
                structure = text_analysis.get("logical_structure", {})
                score += structure.get("structure_score", 0) * weight
            elif component == "keyword_coverage":
                coverage = text_analysis.get("keyword_coverage", {})
                score += coverage.get("coverage_rate", 0) * weight
            elif component == "innovation":
                innovation = text_analysis.get("innovation_analysis", {})
                score += innovation.get("innovation_score", 0) * weight
        
        return score
    
    def _extract_audio_score(self, audio_analysis: Dict[str, Any], components: Dict[str, float]) -> float:
        """从音频分析中提取得分"""
        score = 0.0
        
        for component, weight in components.items():
            if component == "speech_clarity":
                score += audio_analysis.get("speech_clarity", 0) * weight
            elif component == "emotion_score":
                score += audio_analysis.get("emotion_score", 0) * weight
            elif component == "speech_speed":
                # 语速稳定性评分（假设理想语速为180字/分钟）
                speed = audio_analysis.get("speech_speed", 180)
                speed_score = max(0, 100 - abs(speed - 180) / 2)
                score += speed_score * weight
        
        return score
    
    def _extract_video_score(self, video_analysis: Dict[str, Any], components: Dict[str, float]) -> float:
        """从视频分析中提取得分"""
        score = 0.0
        
        for component, weight in components.items():
            if component == "eye_contact":
                score += video_analysis.get("eye_contact_score", 0) * weight
            elif component == "facial_expression":
                score += video_analysis.get("facial_expression_score", 0) * weight
            elif component == "posture_score":
                score += video_analysis.get("posture_score", 0) * weight
            elif component == "gesture_appropriateness":
                score += video_analysis.get("gesture_appropriateness", 0) * weight
        
        return score

class ReportGenerator:
    """报告生成器"""
    
    def __init__(self):
        self.evaluator = CapabilityEvaluator()
    
    def generate_comprehensive_report(self, session_id: int, db: Session) -> Dict[str, Any]:
        """
        生成综合评估报告
        :param session_id: 面试会话ID
        :param db: 数据库会话
        :return: 评估报告
        """
        # 获取面试会话信息
        session = db.query(InterviewSession).filter(InterviewSession.id == session_id).first()
        if not session:
            raise ValueError("面试会话不存在")
        
        # 获取所有回答记录
        responses = db.query(InterviewResponse).filter(InterviewResponse.session_id == session_id).all()
        
        # 获取多模态分析结果
        # 通过response_id关联获取分析结果
        response_ids = [r.id for r in responses]
        analysis_records = db.query(MultimodalAnalysis).filter(
            MultimodalAnalysis.response_id.in_(response_ids)
        ).all() if response_ids else []
        
        # 整理分析结果
        analysis_results = []
        for record in analysis_records:
            if record.analysis_result:
                analysis_results.append(record.analysis_result)
        
        # 计算能力得分
        capability_scores = self.evaluator.calculate_capability_scores(analysis_results, session)
        
        # 生成详细分析
        detailed_analysis = self._generate_detailed_analysis(analysis_results)
        
        # 生成改进建议
        improvement_suggestions = suggestion_service.generate_improvement_suggestions(capability_scores, session.domain)
        priority_recommendations = suggestion_service.generate_priority_recommendations(capability_scores)

        # 生成可视化图表
        radar_chart = visualization_service.generate_radar_chart(capability_scores)

        # 计算总体得分
        overall_score = np.mean(list(capability_scores.values()))
        
        # 生成报告
        report = {
            "session_info": {
                "session_id": session_id,
                "domain": session.domain,
                "position": session.position,
                "start_time": session.start_time.isoformat() if session.start_time else None,
                "end_time": session.end_time.isoformat() if session.end_time else None,
                "total_questions": session.total_questions,
                "completed_questions": len(responses)
            },
            "overall_score": round(overall_score, 1),
            "capability_scores": {k: round(v, 1) for k, v in capability_scores.items()},
            "detailed_analysis": detailed_analysis,
            "improvement_suggestions": improvement_suggestions,
            "priority_recommendations": priority_recommendations,
            "performance_level": self._get_performance_level(overall_score),
            "visualizations": {
                "radar_chart": radar_chart,
                "radar_chart_data": self._prepare_radar_chart_data(capability_scores)
            },
            "generated_at": datetime.now().isoformat()
        }
        
        # 保存报告到数据库
        self._save_report_to_db(session_id, report, db)
        
        return report
    
    def _generate_detailed_analysis(self, analysis_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """生成详细分析"""
        if not analysis_results:
            return {"message": "暂无分析数据"}
        
        # 统计各项指标
        text_stats = self._calculate_text_statistics(analysis_results)
        audio_stats = self._calculate_audio_statistics(analysis_results)
        video_stats = self._calculate_video_statistics(analysis_results)
        
        return {
            "text_analysis": text_stats,
            "audio_analysis": audio_stats,
            "video_analysis": video_stats,
            "total_responses": len(analysis_results)
        }
    
    def _calculate_text_statistics(self, analysis_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """计算文本分析统计"""
        relevance_scores = []
        structure_scores = []
        innovation_scores = []
        
        for result in analysis_results:
            text_analysis = result.get("text_analysis", {})
            
            relevance = text_analysis.get("content_relevance", {})
            if "overall_relevance" in relevance:
                relevance_scores.append(relevance["overall_relevance"])
            
            structure = text_analysis.get("logical_structure", {})
            if "structure_score" in structure:
                structure_scores.append(structure["structure_score"])
            
            innovation = text_analysis.get("innovation_analysis", {})
            if "innovation_score" in innovation:
                innovation_scores.append(innovation["innovation_score"])
        
        return {
            "average_relevance": round(np.mean(relevance_scores), 1) if relevance_scores else 0,
            "average_structure": round(np.mean(structure_scores), 1) if structure_scores else 0,
            "average_innovation": round(np.mean(innovation_scores), 1) if innovation_scores else 0,
            "consistency": {
                "relevance": round(1 - np.std(relevance_scores) / 100, 2) if len(relevance_scores) > 1 else 1,
                "structure": round(1 - np.std(structure_scores) / 100, 2) if len(structure_scores) > 1 else 1,
                "innovation": round(1 - np.std(innovation_scores) / 100, 2) if len(innovation_scores) > 1 else 1
            }
        }
    
    def _calculate_audio_statistics(self, analysis_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """计算音频分析统计"""
        clarity_scores = []
        emotion_scores = []
        speed_values = []
        
        for result in analysis_results:
            audio_analysis = result.get("audio_analysis", {})
            
            if "speech_clarity" in audio_analysis:
                clarity_scores.append(audio_analysis["speech_clarity"])
            if "emotion_score" in audio_analysis:
                emotion_scores.append(audio_analysis["emotion_score"])
            if "speech_speed" in audio_analysis:
                speed_values.append(audio_analysis["speech_speed"])
        
        return {
            "average_clarity": round(np.mean(clarity_scores), 1) if clarity_scores else 0,
            "average_emotion": round(np.mean(emotion_scores), 1) if emotion_scores else 0,
            "average_speed": round(np.mean(speed_values), 1) if speed_values else 0,
            "speed_stability": round(1 - np.std(speed_values) / np.mean(speed_values), 2) if len(speed_values) > 1 else 1
        }
    
    def _calculate_video_statistics(self, analysis_results: List[Dict[str, Any]]) -> Dict[str, Any]:
        """计算视频分析统计"""
        eye_contact_scores = []
        expression_scores = []
        posture_scores = []
        
        for result in analysis_results:
            video_analysis = result.get("video_analysis", {})
            
            if "eye_contact_score" in video_analysis:
                eye_contact_scores.append(video_analysis["eye_contact_score"])
            if "facial_expression_score" in video_analysis:
                expression_scores.append(video_analysis["facial_expression_score"])
            if "posture_score" in video_analysis:
                posture_scores.append(video_analysis["posture_score"])
        
        return {
            "average_eye_contact": round(np.mean(eye_contact_scores), 1) if eye_contact_scores else 0,
            "average_expression": round(np.mean(expression_scores), 1) if expression_scores else 0,
            "average_posture": round(np.mean(posture_scores), 1) if posture_scores else 0,
            "visual_consistency": round(np.mean([
                1 - np.std(eye_contact_scores) / 100 if len(eye_contact_scores) > 1 else 1,
                1 - np.std(expression_scores) / 100 if len(expression_scores) > 1 else 1,
                1 - np.std(posture_scores) / 100 if len(posture_scores) > 1 else 1
            ]), 2)
        }
    

    
    def _get_performance_level(self, overall_score: float) -> Dict[str, Any]:
        """获取表现等级"""
        if overall_score >= 90:
            return {"level": "优秀", "description": "表现出色，各项能力均达到高水平", "color": "#67C23A"}
        elif overall_score >= 80:
            return {"level": "良好", "description": "表现良好，大部分能力达到要求", "color": "#409EFF"}
        elif overall_score >= 70:
            return {"level": "中等", "description": "表现中等，部分能力需要提升", "color": "#E6A23C"}
        elif overall_score >= 60:
            return {"level": "及格", "description": "基本达到要求，多项能力需要改进", "color": "#F56C6C"}
        else:
            return {"level": "不及格", "description": "表现不佳，需要全面提升", "color": "#909399"}
    
    def _prepare_radar_chart_data(self, capability_scores: Dict[str, float]) -> Dict[str, Any]:
        """准备雷达图数据"""
        return {
            "categories": list(capability_scores.keys()),
            "values": list(capability_scores.values()),
            "max_value": 100
        }
    
    def _save_report_to_db(self, session_id: int, report: Dict[str, Any], db: Session):
        """保存报告到数据库"""
        capability_scores = report["capability_scores"]

        evaluation_report = EvaluationReport(
            session_id=session_id,
            overall_score=report["overall_score"],
            # 映射六项核心能力到数据库字段
            professional_knowledge=capability_scores.get("专业技能", 0),
            skill_matching=capability_scores.get("沟通表达", 0),
            language_expression=capability_scores.get("逻辑思维", 0),
            logical_thinking=capability_scores.get("学习能力", 0),
            innovation_ability=capability_scores.get("抗压能力", 0),
            stress_resistance=capability_scores.get("团队协作", 0),
            strengths=report.get("detailed_analysis", {}).get("strengths", []),
            weaknesses=report.get("detailed_analysis", {}).get("weaknesses", []),
            improvement_suggestions=report["improvement_suggestions"],
            report_data=report
        )
        
        db.add(evaluation_report)
        db.commit()

# 全局服务实例
evaluation_service = ReportGenerator()
