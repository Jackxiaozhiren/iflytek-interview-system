"""
智能对话管理服务
基于竞品分析优化的对话式面试AI系统
借鉴Offermore.cc、Hina.com、Dayee.com的优秀特性
"""

import asyncio
import json
import logging
import time
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime, timedelta
from dataclasses import dataclass
from enum import Enum

logger = logging.getLogger(__name__)

class ConversationState(Enum):
    """对话状态枚举"""
    INITIAL = "initial"
    EXPLORING = "exploring"
    DEEPENING = "deepening"
    EVALUATING = "evaluating"
    CONCLUDING = "concluding"

class ResponseQuality(Enum):
    """回答质量枚举"""
    EXCELLENT = "excellent"
    GOOD = "good"
    AVERAGE = "average"
    POOR = "poor"
    UNKNOWN = "unknown"

@dataclass
class ConversationContext:
    """对话上下文"""
    session_id: str
    domain: str
    position: str
    current_state: ConversationState
    conversation_history: List[Dict[str, Any]]
    candidate_profile: Dict[str, Any]
    assessment_scores: Dict[str, float]
    last_interaction_time: datetime
    total_interaction_count: int

class IntelligentConversationManager:
    """智能对话管理器 - 基于竞品分析的优化版本"""
    
    def __init__(self):
        self.active_sessions = {}
        self.conversation_analytics = {}
        
        # 基于竞品分析的对话策略
        self.conversation_strategies = {
            "offermore_style": {
                "name": "实时智能助手",
                "features": ["实时语音识别", "即时回答建议", "隐蔽支持"],
                "approach": "提供实时技术指导和精准回答建议"
            },
            "hina_style": {
                "name": "多维度评估",
                "features": ["统一招聘标准", "量化评估", "科学准确"],
                "approach": "根据企业个性化要求进行多维度考察"
            },
            "dayee_style": {
                "name": "系统化管理",
                "features": ["完整招聘流程", "多产品集成", "企业级服务"],
                "approach": "提供完整的人才评估和管理解决方案"
            }
        }
        
        # 智能引导模板
        self.guidance_templates = self._load_guidance_templates()
        
        # 评估维度（基于竞品分析）
        self.assessment_dimensions = {
            "technical_depth": "技术深度",
            "practical_experience": "实践经验", 
            "problem_solving": "问题解决能力",
            "communication": "沟通表达能力",
            "learning_ability": "学习适应能力",
            "innovation": "创新思维能力"
        }

    def _load_guidance_templates(self) -> Dict[str, Dict]:
        """加载智能引导模板"""
        return {
            "unknown_response": {
                "offermore_approach": "没关系，让我为您提供一些实时的技术指导和思路提示。",
                "hina_approach": "我们可以从多个维度来分析这个问题，让我引导您逐步思考。",
                "dayee_approach": "让我们系统化地分解这个问题，从基础概念开始建立完整的理解。"
            },
            "partial_knowledge": {
                "offermore_approach": "您的理解很好，让我帮您进一步深化和完善这个技术点。",
                "hina_approach": "基于您现有的知识基础，我们可以进行更深入的技术评估。",
                "dayee_approach": "您的回答显示了良好的基础，让我们系统性地扩展相关知识。"
            },
            "confident_answer": {
                "offermore_approach": "很好的回答！让我们进行更深层次的技术讨论和挑战。",
                "hina_approach": "您的技术理解很扎实，让我们从多个维度进行深度评估。",
                "dayee_approach": "优秀的技术表达！让我们探讨更复杂的系统性问题。"
            }
        }

    async def start_conversation_session(self, session_id: str, domain: str, 
                                       position: str, candidate_info: Dict = None) -> Dict[str, Any]:
        """开始对话会话"""
        try:
            context = ConversationContext(
                session_id=session_id,
                domain=domain,
                position=position,
                current_state=ConversationState.INITIAL,
                conversation_history=[],
                candidate_profile=candidate_info or {},
                assessment_scores={dim: 0.0 for dim in self.assessment_dimensions.keys()},
                last_interaction_time=datetime.now(),
                total_interaction_count=0
            )
            
            self.active_sessions[session_id] = context
            
            # 生成开场白
            opening_message = self._generate_opening_message(domain, position)
            
            return {
                "status": "success",
                "session_id": session_id,
                "opening_message": opening_message,
                "conversation_state": context.current_state.value,
                "assessment_dimensions": list(self.assessment_dimensions.values()),
                "features": ["智能对话引导", "实时分析反馈", "多维度评估"]
            }
            
        except Exception as e:
            logger.error(f"启动对话会话失败: {e}")
            return {
                "status": "error",
                "message": f"会话启动失败: {str(e)}"
            }

    async def process_user_response(self, session_id: str, user_response: str, 
                                  question_context: Dict = None) -> Dict[str, Any]:
        """处理用户回答 - 核心智能对话处理"""
        try:
            if session_id not in self.active_sessions:
                return {"status": "error", "message": "会话不存在"}
            
            context = self.active_sessions[session_id]
            context.total_interaction_count += 1
            context.last_interaction_time = datetime.now()
            
            # 1. 分析用户回答质量
            response_analysis = await self._analyze_response_quality(
                user_response, context.domain, question_context
            )
            
            # 2. 更新评估分数
            self._update_assessment_scores(context, response_analysis)
            
            # 3. 确定对话策略
            conversation_strategy = self._determine_conversation_strategy(
                response_analysis, context
            )
            
            # 4. 生成智能回复
            ai_response = await self._generate_intelligent_response(
                user_response, response_analysis, conversation_strategy, context
            )
            
            # 5. 更新对话状态
            self._update_conversation_state(context, response_analysis)
            
            # 6. 记录对话历史
            self._record_conversation_history(context, user_response, ai_response, response_analysis)
            
            return {
                "status": "success",
                "ai_response": ai_response,
                "response_analysis": response_analysis,
                "conversation_state": context.current_state.value,
                "assessment_scores": context.assessment_scores,
                "strategy_applied": conversation_strategy,
                "interaction_count": context.total_interaction_count,
                "session_analytics": self._get_session_analytics(session_id)
            }
            
        except Exception as e:
            logger.error(f"处理用户回答失败: {e}")
            return {
                "status": "error",
                "message": f"回答处理失败: {str(e)}"
            }

    async def _analyze_response_quality(self, user_response: str, domain: str, 
                                      question_context: Dict = None) -> Dict[str, Any]:
        """分析回答质量 - 基于竞品分析的多维度评估"""
        try:
            # 基础质量指标
            word_count = len(user_response.strip())
            
            # 技术术语分析
            technical_terms = self._extract_technical_terms(user_response, domain)
            
            # 结构化分析
            structure_analysis = self._analyze_response_structure(user_response)
            
            # 专业度评估
            professionalism_score = self._calculate_professionalism_score(
                user_response, technical_terms, structure_analysis
            )
            
            # 确定回答类型
            response_type = self._classify_response_type(user_response, professionalism_score)
            
            # 质量等级
            quality_level = self._determine_quality_level(professionalism_score, word_count)
            
            return {
                "response_type": response_type,
                "quality_level": quality_level.value,
                "professionalism_score": professionalism_score,
                "word_count": word_count,
                "technical_terms": technical_terms,
                "structure_analysis": structure_analysis,
                "analysis_timestamp": datetime.now().isoformat(),
                "domain": domain
            }
            
        except Exception as e:
            logger.error(f"回答质量分析失败: {e}")
            return {
                "response_type": "unknown",
                "quality_level": ResponseQuality.UNKNOWN.value,
                "error": str(e)
            }

    def _generate_opening_message(self, domain: str, position: str) -> str:
        """生成开场白"""
        opening_templates = {
            "人工智能": f"您好！我是您的AI面试官，专注于{domain}领域的技术评估。今天我们将通过对话的方式了解您在机器学习、深度学习等方面的技术能力和项目经验。请放轻松，这是一个相互了解的过程。",
            "大数据": f"您好！欢迎参加{domain}领域的技术面试。我将通过智能对话的方式评估您在分布式计算、数据处理、系统架构等方面的专业能力。让我们开始这次技术交流吧！",
            "物联网": f"您好！我是专门负责{domain}技术评估的AI面试官。今天我们将探讨您在硬件接口、通信协议、边缘计算等方面的技术理解和实践经验。期待与您的深入交流！"
        }
        
        return opening_templates.get(domain, f"您好！欢迎参加{position}岗位的技术面试，让我们开始愉快的技术交流！")

    def _extract_technical_terms(self, response: str, domain: str) -> List[str]:
        """提取技术术语"""
        domain_terms = {
            "人工智能": ["机器学习", "深度学习", "神经网络", "算法", "模型", "训练", "tensorflow", "pytorch"],
            "大数据": ["hadoop", "spark", "kafka", "分布式", "集群", "实时计算", "数据仓库", "ETL"],
            "物联网": ["传感器", "mqtt", "边缘计算", "嵌入式", "协议", "网关", "设备管理"]
        }
        
        terms = domain_terms.get(domain, [])
        found_terms = [term for term in terms if term.lower() in response.lower()]
        return found_terms

    def _analyze_response_structure(self, response: str) -> Dict[str, Any]:
        """分析回答结构"""
        return {
            "has_examples": "例如" in response or "比如" in response,
            "has_steps": "首先" in response or "然后" in response or "最后" in response,
            "has_reasoning": "因为" in response or "由于" in response,
            "paragraph_count": len(response.split('\n\n')),
            "sentence_count": len([s for s in response.split('。') if s.strip()])
        }

    def _calculate_professionalism_score(self, response: str, technical_terms: List[str], 
                                       structure_analysis: Dict) -> float:
        """计算专业度分数"""
        score = 0.0
        
        # 技术术语权重 (40%)
        score += min(len(technical_terms) * 0.1, 0.4)
        
        # 回答长度权重 (20%)
        word_count = len(response.strip())
        if word_count > 200:
            score += 0.2
        elif word_count > 100:
            score += 0.15
        elif word_count > 50:
            score += 0.1
        
        # 结构化表达权重 (25%)
        if structure_analysis["has_examples"]:
            score += 0.08
        if structure_analysis["has_steps"]:
            score += 0.08
        if structure_analysis["has_reasoning"]:
            score += 0.09
        
        # 表达清晰度权重 (15%)
        if structure_analysis["sentence_count"] > 3:
            score += 0.15
        elif structure_analysis["sentence_count"] > 1:
            score += 0.1
        
        return min(score, 1.0)

    def _classify_response_type(self, response: str, professionalism_score: float) -> str:
        """分类回答类型"""
        response_lower = response.lower()
        
        if "不知道" in response_lower or "不清楚" in response_lower:
            return "express_unknown"
        elif "请告诉我" in response_lower or "答案是什么" in response_lower:
            return "request_answer"
        elif professionalism_score > 0.7:
            return "confident_answer"
        else:
            return "partial_knowledge"

    def _determine_quality_level(self, professionalism_score: float, word_count: int) -> ResponseQuality:
        """确定质量等级"""
        if professionalism_score > 0.8 and word_count > 150:
            return ResponseQuality.EXCELLENT
        elif professionalism_score > 0.6 and word_count > 100:
            return ResponseQuality.GOOD
        elif professionalism_score > 0.4 and word_count > 50:
            return ResponseQuality.AVERAGE
        else:
            return ResponseQuality.POOR

    def _update_assessment_scores(self, context: ConversationContext,
                                response_analysis: Dict[str, Any]):
        """更新评估分数"""
        try:
            professionalism_score = response_analysis.get("professionalism_score", 0.0)
            technical_terms_count = len(response_analysis.get("technical_terms", []))
            structure_score = self._calculate_structure_score(response_analysis.get("structure_analysis", {}))

            # 基于竞品分析的多维度评估
            context.assessment_scores["technical_depth"] = min(
                context.assessment_scores["technical_depth"] + (technical_terms_count * 0.1), 1.0
            )
            context.assessment_scores["practical_experience"] = min(
                context.assessment_scores["practical_experience"] + (professionalism_score * 0.2), 1.0
            )
            context.assessment_scores["communication"] = min(
                context.assessment_scores["communication"] + (structure_score * 0.15), 1.0
            )
            context.assessment_scores["problem_solving"] = min(
                context.assessment_scores["problem_solving"] + (professionalism_score * 0.1), 1.0
            )

        except Exception as e:
            logger.error(f"更新评估分数失败: {e}")

    def _calculate_structure_score(self, structure_analysis: Dict) -> float:
        """计算结构化分数"""
        score = 0.0
        if structure_analysis.get("has_examples", False):
            score += 0.3
        if structure_analysis.get("has_steps", False):
            score += 0.3
        if structure_analysis.get("has_reasoning", False):
            score += 0.4
        return min(score, 1.0)

    def _determine_conversation_strategy(self, response_analysis: Dict,
                                       context: ConversationContext) -> str:
        """确定对话策略"""
        response_type = response_analysis.get("response_type", "unknown")
        quality_level = response_analysis.get("quality_level", "unknown")
        interaction_count = context.total_interaction_count

        # 基于竞品分析的策略选择
        if response_type == "express_unknown":
            return "hina_style"  # 多维度引导
        elif response_type == "confident_answer" and quality_level in ["excellent", "good"]:
            return "offermore_style"  # 实时深度追问
        elif response_type == "partial_knowledge":
            return "dayee_style"  # 系统化扩展
        else:
            # 根据交互次数动态调整
            if interaction_count <= 3:
                return "hina_style"
            elif interaction_count <= 6:
                return "dayee_style"
            else:
                return "offermore_style"

    async def _generate_intelligent_response(self, user_response: str, response_analysis: Dict,
                                           strategy: str, context: ConversationContext) -> Dict[str, Any]:
        """生成智能回复"""
        try:
            response_type = response_analysis.get("response_type", "unknown")
            quality_level = response_analysis.get("quality_level", "unknown")

            # 获取策略模板
            strategy_config = self.conversation_strategies.get(strategy, {})
            guidance_template = self.guidance_templates.get(response_type, {})

            # 生成基础回复
            base_response = guidance_template.get(f"{strategy}_approach",
                                                "让我们继续深入探讨这个技术话题。")

            # 根据策略生成具体内容
            if strategy == "offermore_style":
                content = await self._generate_offermore_response(
                    user_response, response_analysis, context
                )
            elif strategy == "hina_style":
                content = await self._generate_hina_response(
                    user_response, response_analysis, context
                )
            elif strategy == "dayee_style":
                content = await self._generate_dayee_response(
                    user_response, response_analysis, context
                )
            else:
                content = base_response

            # 添加个性化元素
            personalized_content = self._add_personalization(content, context)

            return {
                "content": personalized_content,
                "strategy": strategy,
                "strategy_features": strategy_config.get("features", []),
                "response_type": response_type,
                "quality_assessment": quality_level,
                "timestamp": datetime.now().isoformat(),
                "interaction_count": context.total_interaction_count
            }

        except Exception as e:
            logger.error(f"生成智能回复失败: {e}")
            return {
                "content": "让我们继续探讨这个技术话题，我会根据您的回答提供更有针对性的指导。",
                "strategy": "fallback",
                "error": str(e)
            }

    async def _generate_offermore_response(self, user_response: str, response_analysis: Dict,
                                         context: ConversationContext) -> str:
        """生成Offermore.cc风格的回复 - 实时智能助手"""
        quality_level = response_analysis.get("quality_level", "unknown")
        technical_terms = response_analysis.get("technical_terms", [])

        if quality_level == "excellent":
            return f"""很棒的回答！您提到的{', '.join(technical_terms[:3])}都是{context.domain}领域的核心技术。

让我们进行更深层次的技术讨论：
1. 在生产环境中，您如何优化这些技术的性能？
2. 面对大规模数据处理时，您会采用什么策略？
3. 如何确保系统的高可用性和容错能力？

请选择其中一个方面详细展开，我会根据您的回答提供实时的技术指导。"""

        elif quality_level == "good":
            return f"""您的理解很不错！基于您提到的技术点，让我为您提供一些实时的深化建议：

技术深化方向：
• {technical_terms[0] if technical_terms else '相关技术'}的高级应用场景
• 与其他技术栈的集成方案
• 性能优化的最佳实践

实际应用思考：
• 在您的项目经验中，是否遇到过相关的技术挑战？
• 如何平衡技术复杂度和开发效率？

请继续分享您的想法，我会提供针对性的技术指导。"""

        else:
            return """让我为您提供一些实时的技术指导和思路提示：

从基础开始：
• 这个技术的核心原理是什么？
• 它主要解决什么样的实际问题？
• 有哪些常用的工具和框架？

实践角度：
• 您可以从简单的示例项目开始
• 关注技术文档和最佳实践
• 多参与开源项目和技术社区

我会根据您的学习进度提供个性化的指导建议。"""

    async def _generate_hina_response(self, user_response: str, response_analysis: Dict,
                                    context: ConversationContext) -> str:
        """生成Hina.com风格的回复 - 多维度评估"""
        current_scores = context.assessment_scores

        return f"""基于多维度评估体系，让我为您提供专业的技术分析：

当前能力评估：
• 技术深度：{current_scores['technical_depth']:.1f}/1.0
• 实践经验：{current_scores['practical_experience']:.1f}/1.0
• 沟通表达：{current_scores['communication']:.1f}/1.0
• 问题解决：{current_scores['problem_solving']:.1f}/1.0

针对性提升建议：
1. 技术理论：建议加强{context.domain}领域的核心概念理解
2. 实践应用：可以通过具体项目来验证技术掌握程度
3. 表达能力：尝试用更结构化的方式组织技术回答

评估重点：
我们主要考察您在{context.domain}领域的综合技术能力，包括理论掌握、实践经验和解决问题的思路。

请继续分享您的技术经验，我会从多个维度进行科学评估。"""

    async def _generate_dayee_response(self, user_response: str, response_analysis: Dict,
                                     context: ConversationContext) -> str:
        """生成Dayee.com风格的回复 - 系统化管理"""
        return f"""让我们系统化地分析和扩展这个技术话题：

知识体系构建：
1. 基础理论 → 您当前的理解水平
2. 技术实践 → 项目应用和实战经验
3. 系统设计 → 架构思维和整体规划
4. 优化改进 → 性能调优和持续改进

{context.domain}领域技能发展路径：
• 初级：掌握基础概念和常用工具
• 中级：具备项目实践和问题解决能力
• 高级：拥有系统设计和架构优化能力
• 专家：能够创新技术方案和指导团队

综合评估维度：
- 技术广度和深度的平衡
- 理论知识与实践经验的结合
- 学习能力和适应性
- 团队协作和沟通能力

基于您的回答，我建议重点关注：{self._get_improvement_suggestions(response_analysis, context)}

让我们继续深入探讨，建立完整的技术知识体系。"""

    def _get_improvement_suggestions(self, response_analysis: Dict, context: ConversationContext) -> str:
        """获取改进建议"""
        quality_level = response_analysis.get("quality_level", "unknown")
        technical_terms_count = len(response_analysis.get("technical_terms", []))

        if quality_level == "poor" or technical_terms_count == 0:
            return "基础概念的理解和技术术语的掌握"
        elif quality_level == "average":
            return "实践经验的积累和技术深度的提升"
        else:
            return "系统性思维和架构设计能力的培养"

    def _add_personalization(self, content: str, context: ConversationContext) -> str:
        """添加个性化元素"""
        domain_specific = {
            "人工智能": "在AI技术快速发展的今天",
            "大数据": "在数据驱动的时代背景下",
            "物联网": "在万物互联的技术趋势中"
        }

        prefix = domain_specific.get(context.domain, "在当前的技术环境中")
        return f"{prefix}，{content}"

    def _update_conversation_state(self, context: ConversationContext, response_analysis: Dict):
        """更新对话状态"""
        quality_level = response_analysis.get("quality_level", "unknown")
        interaction_count = context.total_interaction_count

        if interaction_count <= 2:
            context.current_state = ConversationState.EXPLORING
        elif interaction_count <= 5:
            if quality_level in ["excellent", "good"]:
                context.current_state = ConversationState.DEEPENING
            else:
                context.current_state = ConversationState.EXPLORING
        elif interaction_count <= 8:
            context.current_state = ConversationState.EVALUATING
        else:
            context.current_state = ConversationState.CONCLUDING

    def _record_conversation_history(self, context: ConversationContext, user_response: str,
                                   ai_response: Dict, response_analysis: Dict):
        """记录对话历史"""
        history_entry = {
            "timestamp": datetime.now().isoformat(),
            "user_response": user_response,
            "ai_response": ai_response,
            "response_analysis": response_analysis,
            "conversation_state": context.current_state.value,
            "assessment_scores": context.assessment_scores.copy()
        }
        context.conversation_history.append(history_entry)

    def _get_session_analytics(self, session_id: str) -> Dict[str, Any]:
        """获取会话分析"""
        if session_id not in self.active_sessions:
            return {}

        context = self.active_sessions[session_id]

        return {
            "session_duration": (datetime.now() - context.conversation_history[0]["timestamp"] if context.conversation_history else timedelta()).total_seconds(),
            "total_interactions": context.total_interaction_count,
            "current_state": context.current_state.value,
            "average_scores": {
                dim: score for dim, score in context.assessment_scores.items()
            },
            "conversation_quality": self._assess_conversation_quality(context),
            "engagement_level": self._calculate_engagement_level(context)
        }

    def _assess_conversation_quality(self, context: ConversationContext) -> str:
        """评估对话质量"""
        avg_score = sum(context.assessment_scores.values()) / len(context.assessment_scores)

        if avg_score > 0.8:
            return "excellent"
        elif avg_score > 0.6:
            return "good"
        elif avg_score > 0.4:
            return "average"
        else:
            return "needs_improvement"

    def _calculate_engagement_level(self, context: ConversationContext) -> float:
        """计算参与度"""
        if not context.conversation_history:
            return 0.0

        # 基于回答长度、技术术语使用、交互频率等计算参与度
        total_words = sum(len(entry["user_response"]) for entry in context.conversation_history)
        avg_words_per_response = total_words / len(context.conversation_history)

        engagement = min(avg_words_per_response / 100, 1.0)  # 标准化到0-1
        return engagement

    async def end_conversation_session(self, session_id: str) -> Dict[str, Any]:
        """结束对话会话"""
        try:
            if session_id not in self.active_sessions:
                return {"status": "error", "message": "会话不存在"}

            context = self.active_sessions[session_id]

            # 生成最终评估报告
            final_report = self._generate_final_assessment_report(context)

            # 清理会话
            del self.active_sessions[session_id]

            return {
                "status": "success",
                "final_report": final_report,
                "session_summary": self._get_session_analytics(session_id)
            }

        except Exception as e:
            logger.error(f"结束对话会话失败: {e}")
            return {
                "status": "error",
                "message": f"会话结束失败: {str(e)}"
            }

    def _generate_final_assessment_report(self, context: ConversationContext) -> Dict[str, Any]:
        """生成最终评估报告"""
        return {
            "overall_assessment": self._get_overall_assessment(context),
            "dimension_scores": context.assessment_scores,
            "strengths": self._identify_strengths(context),
            "improvement_areas": self._identify_improvement_areas(context),
            "recommendations": self._generate_recommendations(context),
            "conversation_quality": self._assess_conversation_quality(context),
            "total_interactions": context.total_interaction_count,
            "domain": context.domain,
            "position": context.position
        }

    def _get_overall_assessment(self, context: ConversationContext) -> str:
        """获取整体评估"""
        avg_score = sum(context.assessment_scores.values()) / len(context.assessment_scores)

        if avg_score > 0.8:
            return f"优秀：候选人在{context.domain}领域表现出色，具备扎实的技术基础和丰富的实践经验。"
        elif avg_score > 0.6:
            return f"良好：候选人在{context.domain}领域有较好的技术理解，建议进一步加强实践应用。"
        elif avg_score > 0.4:
            return f"一般：候选人对{context.domain}领域有基础了解，需要系统性提升技术能力。"
        else:
            return f"待提升：建议候选人加强{context.domain}领域的基础学习和实践训练。"

    def _identify_strengths(self, context: ConversationContext) -> List[str]:
        """识别优势"""
        strengths = []
        for dim, score in context.assessment_scores.items():
            if score > 0.7:
                strengths.append(f"{self.assessment_dimensions[dim]}表现突出")
        return strengths or ["积极的学习态度"]

    def _identify_improvement_areas(self, context: ConversationContext) -> List[str]:
        """识别改进领域"""
        improvements = []
        for dim, score in context.assessment_scores.items():
            if score < 0.5:
                improvements.append(f"需要加强{self.assessment_dimensions[dim]}")
        return improvements or ["继续保持当前水平"]

    def _generate_recommendations(self, context: ConversationContext) -> List[str]:
        """生成建议"""
        avg_score = sum(context.assessment_scores.values()) / len(context.assessment_scores)

        if avg_score > 0.7:
            return [
                f"继续深化{context.domain}领域的前沿技术研究",
                "考虑承担更具挑战性的技术项目",
                "分享技术经验，指导团队成员"
            ]
        elif avg_score > 0.5:
            return [
                f"系统性学习{context.domain}领域的核心技术",
                "通过实际项目积累更多实践经验",
                "加强技术表达和沟通能力"
            ]
        else:
            return [
                f"从基础开始，建立{context.domain}领域的知识体系",
                "多参与技术培训和学习活动",
                "寻找导师或加入技术社区"
            ]

# 创建全局实例
intelligent_conversation_manager = IntelligentConversationManager()
