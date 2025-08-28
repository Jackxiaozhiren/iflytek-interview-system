"""
智能报告生成服务
生成详细的面试评估报告，包含可视化图表、问题定位和改进建议
"""
import json
import base64
from typing import Dict, List, Any, Optional
from datetime import datetime
import matplotlib.pyplot as plt
import matplotlib
matplotlib.use('Agg')  # 使用非交互式后端
import numpy as np
from io import BytesIO
import seaborn as sns
from matplotlib import font_manager
import jieba
import logging
from jinja2 import Template
import pandas as pd
from dataclasses import dataclass
from collections import defaultdict

# 设置中文字体
plt.rcParams['font.sans-serif'] = ['SimHei', 'DejaVu Sans']
plt.rcParams['axes.unicode_minus'] = False

logger = logging.getLogger(__name__)

@dataclass
class ReportMetrics:
    """报告指标数据类"""
    overall_score: float
    capability_scores: Dict[str, float]
    performance_trends: Dict[str, List[float]]
    improvement_areas: List[str]
    strengths: List[str]
    recommendations: List[Dict[str, Any]]

class ReportVisualizationService:
    """报告可视化服务"""
    
    def __init__(self):
        self.colors = {
            "primary": "#409EFF",
            "success": "#67C23A", 
            "warning": "#E6A23C",
            "danger": "#F56C6C",
            "info": "#909399"
        }
        
        # 能力指标中文名称
        self.capability_names = {
            "专业技能": "Professional Skills",
            "沟通表达": "Communication",
            "逻辑思维": "Logical Thinking", 
            "学习能力": "Learning Ability",
            "抗压能力": "Stress Resistance",
            "团队协作": "Teamwork"
        }
    
    def generate_radar_chart(self, capability_scores: Dict[str, float]) -> str:
        """生成能力雷达图"""
        # 准备数据
        categories = list(self.capability_names.keys())
        values = [capability_scores.get(cat, 0) for cat in categories]
        
        # 创建雷达图
        fig, ax = plt.subplots(figsize=(10, 10), subplot_kw=dict(projection='polar'))
        
        # 计算角度
        angles = np.linspace(0, 2 * np.pi, len(categories), endpoint=False).tolist()
        values += values[:1]  # 闭合图形
        angles += angles[:1]
        
        # 绘制雷达图
        ax.plot(angles, values, 'o-', linewidth=2, color=self.colors["primary"], label='当前能力')
        ax.fill(angles, values, alpha=0.25, color=self.colors["primary"])
        
        # 添加参考线
        reference_values = [80] * (len(categories) + 1)  # 80分参考线
        ax.plot(angles, reference_values, '--', linewidth=1, color=self.colors["warning"], alpha=0.7, label='优秀水平(80分)')
        
        # 设置标签
        ax.set_xticks(angles[:-1])
        ax.set_xticklabels(categories, fontsize=12)
        ax.set_ylim(0, 100)
        ax.set_yticks([20, 40, 60, 80, 100])
        ax.set_yticklabels(['20', '40', '60', '80', '100'], fontsize=10)
        ax.grid(True)
        
        # 添加标题和图例
        plt.title('面试能力评估雷达图', fontsize=16, fontweight='bold', pad=20)
        plt.legend(loc='upper right', bbox_to_anchor=(1.2, 1.0))
        
        # 保存为base64字符串
        buffer = BytesIO()
        plt.savefig(buffer, format='png', dpi=300, bbox_inches='tight')
        buffer.seek(0)
        image_base64 = base64.b64encode(buffer.getvalue()).decode()
        plt.close()
        
        return image_base64
    
    def generate_capability_breakdown_chart(self, detailed_scores: Dict[str, Dict]) -> str:
        """生成能力细分条形图"""
        fig, axes = plt.subplots(2, 3, figsize=(18, 12))
        axes = axes.flatten()
        
        for i, (capability, scores) in enumerate(detailed_scores.items()):
            if i >= 6:
                break
                
            ax = axes[i]
            
            # 提取子指标数据
            sub_indicators = list(scores.keys())
            sub_values = list(scores.values())
            
            # 创建条形图
            bars = ax.barh(sub_indicators, sub_values, color=self.colors["primary"], alpha=0.7)
            
            # 添加数值标签
            for j, (bar, value) in enumerate(zip(bars, sub_values)):
                ax.text(value + 1, j, f'{value:.1f}', va='center', fontsize=10)
            
            ax.set_xlim(0, 100)
            ax.set_title(f'{capability}细分评估', fontsize=14, fontweight='bold')
            ax.set_xlabel('得分', fontsize=12)
            ax.grid(axis='x', alpha=0.3)
        
        plt.tight_layout()
        
        # 保存为base64字符串
        buffer = BytesIO()
        plt.savefig(buffer, format='png', dpi=300, bbox_inches='tight')
        buffer.seek(0)
        image_base64 = base64.b64encode(buffer.getvalue()).decode()
        plt.close()
        
        return image_base64
    
    def generate_performance_trend_chart(self, question_scores: List[Dict]) -> str:
        """生成答题表现趋势图"""
        if not question_scores:
            return ""
        
        fig, ax = plt.subplots(figsize=(12, 6))
        
        # 准备数据
        question_nums = [i + 1 for i in range(len(question_scores))]
        scores = [q.get("overall_score", 0) for q in question_scores]
        difficulties = [q.get("difficulty", "中等") for q in question_scores]
        
        # 根据难度设置颜色
        difficulty_colors = {"简单": self.colors["success"], "中等": self.colors["warning"], "困难": self.colors["danger"]}
        colors = [difficulty_colors.get(d, self.colors["info"]) for d in difficulties]
        
        # 绘制折线图和散点图
        ax.plot(question_nums, scores, 'o-', linewidth=2, markersize=8, color=self.colors["primary"])
        ax.scatter(question_nums, scores, c=colors, s=100, alpha=0.7, edgecolors='white', linewidth=2)
        
        # 添加平均线
        avg_score = np.mean(scores)
        ax.axhline(y=avg_score, color=self.colors["info"], linestyle='--', alpha=0.7, label=f'平均分: {avg_score:.1f}')
        
        # 设置图表
        ax.set_xlabel('题目序号', fontsize=12)
        ax.set_ylabel('得分', fontsize=12)
        ax.set_title('答题表现趋势分析', fontsize=14, fontweight='bold')
        ax.set_ylim(0, 100)
        ax.grid(True, alpha=0.3)
        ax.legend()
        
        # 添加难度标注
        for i, (x, y, diff) in enumerate(zip(question_nums, scores, difficulties)):
            ax.annotate(diff, (x, y), textcoords="offset points", xytext=(0,10), ha='center', fontsize=9)
        
        plt.tight_layout()
        
        # 保存为base64字符串
        buffer = BytesIO()
        plt.savefig(buffer, format='png', dpi=300, bbox_inches='tight')
        buffer.seek(0)
        image_base64 = base64.b64encode(buffer.getvalue()).decode()
        plt.close()
        
        return image_base64

class ImprovementSuggestionService:
    """改进建议生成服务"""
    
    def __init__(self):
        # 改进建议模板
        self.improvement_templates = {
            "专业技能": {
                "low": [
                    "建议加强{domain}领域的基础知识学习，重点关注核心概念和技术原理",
                    "多参与实际项目，通过实践提升专业技能的应用能力",
                    "关注行业最新技术发展，定期学习新的工具和框架",
                    "建议系统学习相关技术文档和最佳实践案例"
                ],
                "medium": [
                    "继续深化{domain}专业知识，特别是高级概念和前沿技术",
                    "尝试解决更复杂的技术问题，提升问题分析和解决能力",
                    "参与开源项目或技术社区，与同行交流学习",
                    "考虑获得相关的专业认证或参加技术培训"
                ],
                "high": [
                    "保持技术敏锐度，持续关注{domain}领域的创新发展",
                    "考虑在专业领域进行深度研究或技术创新",
                    "分享技术经验，指导团队成员提升专业能力",
                    "探索跨领域技术融合的可能性"
                ]
            },
            "沟通表达": {
                "low": [
                    "练习清晰、有条理地表达观点，可以先列提纲再表达",
                    "多参与讨论和演讲活动，提升口语表达能力",
                    "学习使用具体例子和数据来支撑观点",
                    "注意语速和停顿，确保听众能够理解"
                ],
                "medium": [
                    "进一步提升表达的逻辑性和说服力",
                    "学习根据不同听众调整表达方式和内容",
                    "练习非语言沟通技巧，如眼神交流和肢体语言",
                    "尝试在更大的场合进行公开演讲"
                ],
                "high": [
                    "继续保持优秀的沟通表达能力",
                    "考虑指导他人提升沟通技巧",
                    "在重要场合代表团队或组织进行对外沟通",
                    "探索更高级的沟通策略和技巧"
                ]
            },
            "逻辑思维": {
                "low": [
                    "练习结构化思维，使用STAR法则组织回答",
                    "多做逻辑推理练习，提升分析问题的能力",
                    "学习使用思维导图等工具整理思路",
                    "注意因果关系的表达，避免逻辑跳跃"
                ],
                "medium": [
                    "进一步提升复杂问题的分析和解决能力",
                    "学习更多的思维模型和分析框架",
                    "练习从多个角度分析问题",
                    "提升论证的严密性和说服力"
                ],
                "high": [
                    "保持优秀的逻辑思维能力",
                    "尝试解决更复杂的系统性问题",
                    "指导他人提升逻辑思维能力",
                    "在决策制定中发挥更大作用"
                ]
            },
            "学习能力": {
                "low": [
                    "建立系统的学习计划，设定明确的学习目标",
                    "多尝试不同的学习方法，找到适合自己的方式",
                    "培养主动学习的习惯，定期更新知识",
                    "学会总结和反思，提升学习效率"
                ],
                "medium": [
                    "进一步提升学习的深度和广度",
                    "尝试跨领域学习，培养知识迁移能力",
                    "参与学习社群，与他人交流学习心得",
                    "建立个人知识管理体系"
                ],
                "high": [
                    "保持持续学习的优秀习惯",
                    "成为学习型组织的推动者",
                    "分享学习经验，帮助他人提升学习能力",
                    "探索前沿的学习理念和方法"
                ]
            },
            "抗压能力": {
                "low": [
                    "学习压力管理技巧，如深呼吸、冥想等放松方法",
                    "建立良好的工作生活平衡，确保充足的休息",
                    "寻求支持，与同事或朋友分享压力和困扰",
                    "将大任务分解为小步骤，逐步完成"
                ],
                "medium": [
                    "进一步提升情绪管理能力",
                    "学习更多的压力应对策略",
                    "培养积极的心态，将挑战视为成长机会",
                    "建立个人的压力预警和应对机制"
                ],
                "high": [
                    "保持优秀的抗压能力",
                    "在高压环境中发挥稳定的表现",
                    "帮助团队成员应对压力和挑战",
                    "成为团队的稳定力量"
                ]
            },
            "团队协作": {
                "low": [
                    "主动参与团队活动，增强团队归属感",
                    "学习倾听他人意见，尊重不同观点",
                    "练习清晰地表达自己的想法和需求",
                    "主动承担团队任务，展现责任感"
                ],
                "medium": [
                    "进一步提升协调和沟通能力",
                    "学习冲突解决技巧，促进团队和谐",
                    "尝试在团队中承担更多责任",
                    "培养同理心，理解团队成员的需求"
                ],
                "high": [
                    "保持优秀的团队协作能力",
                    "在团队中发挥领导作用",
                    "帮助团队提升整体协作效率",
                    "成为团队文化的建设者"
                ]
            }
        }
    
    def generate_improvement_suggestions(self, capability_scores: Dict[str, float], domain: str) -> Dict[str, List[str]]:
        """生成改进建议"""
        suggestions = {}
        
        for capability, score in capability_scores.items():
            if capability not in self.improvement_templates:
                continue
            
            # 根据分数确定水平
            if score < 60:
                level = "low"
            elif score < 80:
                level = "medium"
            else:
                level = "high"
            
            # 获取建议模板
            templates = self.improvement_templates[capability][level]
            
            # 生成具体建议
            capability_suggestions = []
            for template in templates:
                suggestion = template.format(domain=domain)
                capability_suggestions.append(suggestion)
            
            suggestions[capability] = capability_suggestions
        
        return suggestions
    
    def generate_priority_recommendations(self, capability_scores: Dict[str, float]) -> List[Dict[str, Any]]:
        """生成优先改进建议"""
        # 按分数排序，找出需要优先改进的能力
        sorted_capabilities = sorted(capability_scores.items(), key=lambda x: x[1])
        
        recommendations = []
        
        for i, (capability, score) in enumerate(sorted_capabilities[:3]):  # 取前3个最需要改进的
            priority = "高" if i == 0 else "中" if i == 1 else "低"
            urgency = "紧急" if score < 50 else "重要" if score < 70 else "一般"
            
            recommendations.append({
                "capability": capability,
                "score": score,
                "priority": priority,
                "urgency": urgency,
                "improvement_potential": min(100 - score, 30),  # 改进潜力
                "recommended_actions": self._get_specific_actions(capability, score)
            })
        
        return recommendations
    
    def _get_specific_actions(self, capability: str, score: float) -> List[str]:
        """获取具体的行动建议"""
        action_map = {
            "专业技能": [
                "制定3个月的技术学习计划",
                "每周完成1个实践项目",
                "参加相关技术培训或认证考试",
                "加入技术社区并积极参与讨论"
            ],
            "沟通表达": [
                "每天练习5分钟的口语表达",
                "参加演讲俱乐部或类似组织",
                "录制自己的表达视频并分析改进",
                "主动在会议中发言和提问"
            ],
            "逻辑思维": [
                "每天做逻辑推理练习题",
                "学习并应用结构化思维方法",
                "练习用STAR法则回答问题",
                "阅读逻辑思维相关书籍"
            ],
            "学习能力": [
                "建立个人知识管理系统",
                "每月学习一个新技能或知识点",
                "定期总结和反思学习成果",
                "寻找学习伙伴或导师"
            ],
            "抗压能力": [
                "学习并实践压力管理技巧",
                "建立规律的运动和休息习惯",
                "培养积极的心态和思维方式",
                "寻求专业的心理健康支持"
            ],
            "团队协作": [
                "主动参与团队建设活动",
                "练习倾听和同理心技巧",
                "学习冲突解决和协调方法",
                "承担团队项目的协调角色"
            ]
        }
        
        return action_map.get(capability, ["制定具体的改进计划", "寻求相关培训和指导"])

# 全局服务实例
visualization_service = ReportVisualizationService()
suggestion_service = ImprovementSuggestionService()

class EnhancedReportGenerationService:
    """增强报告生成服务"""

    def __init__(self):
        self.visualization_service = visualization_service
        self.suggestion_service = suggestion_service
        self.report_templates = self._load_report_templates()
        self.export_formats = ["html", "pdf", "json", "excel"]

    def _load_report_templates(self) -> Dict[str, str]:
        """加载报告模板"""
        return {
            "comprehensive": """
            <!DOCTYPE html>
            <html lang="zh-CN">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>{{ report_title }}</title>
                <style>
                    body { font-family: 'Microsoft YaHei', sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
                    .container { max-width: 1200px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                    .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #409EFF; padding-bottom: 20px; }
                    .title { color: #409EFF; font-size: 28px; font-weight: bold; margin-bottom: 10px; }
                    .subtitle { color: #666; font-size: 16px; }
                    .section { margin-bottom: 30px; }
                    .section-title { color: #333; font-size: 20px; font-weight: bold; margin-bottom: 15px; border-left: 4px solid #409EFF; padding-left: 10px; }
                    .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px; }
                    .metric-card { background: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; border: 1px solid #e9ecef; }
                    .metric-value { font-size: 24px; font-weight: bold; color: #409EFF; }
                    .metric-label { color: #666; margin-top: 5px; }
                    .chart-container { text-align: center; margin: 20px 0; }
                    .recommendations { background: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #409EFF; }
                    .recommendation-item { margin-bottom: 15px; padding: 10px; background: white; border-radius: 5px; }
                    .priority-high { border-left: 4px solid #F56C6C; }
                    .priority-medium { border-left: 4px solid #E6A23C; }
                    .priority-low { border-left: 4px solid #67C23A; }
                    .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e9ecef; color: #666; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <div class="title">{{ report_title }}</div>
                        <div class="subtitle">生成时间: {{ generation_time }}</div>
                    </div>

                    <div class="section">
                        <div class="section-title">评估概览</div>
                        <div class="metrics-grid">
                            {% for metric_name, metric_value in overview_metrics.items() %}
                            <div class="metric-card">
                                <div class="metric-value">{{ metric_value }}</div>
                                <div class="metric-label">{{ metric_name }}</div>
                            </div>
                            {% endfor %}
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">能力雷达图</div>
                        <div class="chart-container">
                            <img src="data:image/png;base64,{{ radar_chart }}" alt="能力雷达图" style="max-width: 100%; height: auto;">
                        </div>
                    </div>

                    <div class="section">
                        <div class="section-title">改进建议</div>
                        <div class="recommendations">
                            {% for recommendation in recommendations %}
                            <div class="recommendation-item priority-{{ recommendation.priority }}">
                                <h4>{{ recommendation.title }}</h4>
                                <p>{{ recommendation.description }}</p>
                                <ul>
                                    {% for action in recommendation.actions %}
                                    <li>{{ action }}</li>
                                    {% endfor %}
                                </ul>
                            </div>
                            {% endfor %}
                        </div>
                    </div>

                    <div class="footer">
                        <p>本报告由多模态面试评估系统自动生成</p>
                    </div>
                </div>
            </body>
            </html>
            """,
            "summary": """
            <div class="summary-report">
                <h2>{{ candidate_name }} - 面试评估摘要</h2>
                <div class="summary-metrics">
                    <div class="overall-score">总体得分: {{ overall_score }}/100</div>
                    <div class="recommendation">{{ main_recommendation }}</div>
                </div>
            </div>
            """
        }

    async def generate_comprehensive_report(
        self,
        session_data: Dict[str, Any],
        analysis_results: Dict[str, Any],
        export_format: str = "html"
    ) -> Dict[str, Any]:
        """生成综合评估报告"""
        try:
            logger.info(f"开始生成综合报告，格式: {export_format}")

            # 准备报告数据
            report_data = await self._prepare_report_data(session_data, analysis_results)

            # 生成可视化图表
            charts = await self._generate_report_charts(report_data)

            # 根据格式生成报告
            if export_format == "html":
                report_content = await self._generate_html_report(report_data, charts)
            elif export_format == "pdf":
                report_content = await self._generate_pdf_report(report_data, charts)
            elif export_format == "json":
                report_content = await self._generate_json_report(report_data)
            elif export_format == "excel":
                report_content = await self._generate_excel_report(report_data)
            else:
                raise ValueError(f"不支持的导出格式: {export_format}")

            return {
                "success": True,
                "report_content": report_content,
                "format": export_format,
                "generated_at": datetime.now().isoformat(),
                "metadata": {
                    "candidate_name": session_data.get("candidate_name", "未知"),
                    "session_id": session_data.get("session_id"),
                    "overall_score": report_data["overall_score"]
                }
            }

        except Exception as e:
            logger.error(f"生成综合报告失败: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    async def _prepare_report_data(
        self, session_data: Dict[str, Any], analysis_results: Dict[str, Any]
    ) -> Dict[str, Any]:
        """准备报告数据"""
        # 提取能力评分
        capability_scores = analysis_results.get("capability_scores", {})

        # 计算总体得分
        overall_score = sum(capability_scores.values()) / len(capability_scores) if capability_scores else 0
        overall_score = round(overall_score * 100, 1)

        # 识别优势和改进领域
        strengths = [k for k, v in capability_scores.items() if v > 0.8]
        improvement_areas = [k for k, v in capability_scores.items() if v < 0.6]

        # 生成改进建议
        recommendations = []
        for area in improvement_areas:
            suggestions = self.suggestion_service.generate_improvement_suggestions(area, capability_scores[area])
            recommendations.extend(suggestions)

        return {
            "session_id": session_data.get("session_id"),
            "candidate_name": session_data.get("candidate_name", "候选人"),
            "interview_date": session_data.get("created_at", datetime.now().isoformat()),
            "overall_score": overall_score,
            "capability_scores": capability_scores,
            "strengths": strengths,
            "improvement_areas": improvement_areas,
            "recommendations": recommendations,
            "analysis_results": analysis_results
        }

    async def _generate_report_charts(self, report_data: Dict[str, Any]) -> Dict[str, str]:
        """生成报告图表"""
        charts = {}

        # 生成能力雷达图
        radar_chart = self.visualization_service.generate_radar_chart(report_data["capability_scores"])
        charts["radar_chart"] = radar_chart

        # 生成能力分布图
        capability_chart = self.visualization_service.generate_capability_distribution(report_data["capability_scores"])
        charts["capability_chart"] = capability_chart

        # 生成改进优先级图
        if report_data["improvement_areas"]:
            priority_chart = self._generate_improvement_priority_chart(report_data["improvement_areas"])
            charts["priority_chart"] = priority_chart

        return charts

    def _generate_improvement_priority_chart(self, improvement_areas: List[str]) -> str:
        """生成改进优先级图表"""
        try:
            fig, ax = plt.subplots(figsize=(10, 6))

            # 模拟优先级数据
            priorities = np.random.uniform(0.3, 0.9, len(improvement_areas))
            colors = ['#F56C6C' if p > 0.7 else '#E6A23C' if p > 0.5 else '#67C23A' for p in priorities]

            bars = ax.barh(improvement_areas, priorities, color=colors)
            ax.set_xlabel('改进优先级')
            ax.set_title('能力改进优先级分析')
            ax.set_xlim(0, 1)

            # 添加数值标签
            for bar, priority in zip(bars, priorities):
                width = bar.get_width()
                ax.text(width + 0.01, bar.get_y() + bar.get_height()/2,
                       f'{priority:.2f}', ha='left', va='center')

            plt.tight_layout()

            # 转换为base64
            buffer = BytesIO()
            plt.savefig(buffer, format='png', dpi=300, bbox_inches='tight')
            buffer.seek(0)
            chart_base64 = base64.b64encode(buffer.getvalue()).decode()
            plt.close()

            return chart_base64

        except Exception as e:
            logger.error(f"生成改进优先级图表失败: {e}")
            return ""

    async def _generate_html_report(
        self, report_data: Dict[str, Any], charts: Dict[str, str]
    ) -> str:
        """生成HTML格式报告"""
        try:
            template = Template(self.report_templates["comprehensive"])

            # 准备模板数据
            template_data = {
                "report_title": f"{report_data['candidate_name']} - 面试评估报告",
                "generation_time": datetime.now().strftime("%Y年%m月%d日 %H:%M"),
                "overview_metrics": {
                    "总体得分": f"{report_data['overall_score']}/100",
                    "优势能力": f"{len(report_data['strengths'])}项",
                    "改进领域": f"{len(report_data['improvement_areas'])}项",
                    "建议数量": f"{len(report_data['recommendations'])}条"
                },
                "radar_chart": charts.get("radar_chart", ""),
                "recommendations": report_data["recommendations"]
            }

            return template.render(**template_data)

        except Exception as e:
            logger.error(f"生成HTML报告失败: {e}")
            return f"<html><body><h1>报告生成失败</h1><p>{str(e)}</p></body></html>"

    async def _generate_json_report(self, report_data: Dict[str, Any]) -> str:
        """生成JSON格式报告"""
        try:
            return json.dumps(report_data, ensure_ascii=False, indent=2)
        except Exception as e:
            logger.error(f"生成JSON报告失败: {e}")
            return json.dumps({"error": str(e)}, ensure_ascii=False)

    async def _generate_excel_report(self, report_data: Dict[str, Any]) -> bytes:
        """生成Excel格式报告"""
        try:
            # 创建DataFrame
            df_overview = pd.DataFrame([{
                "指标": "总体得分",
                "数值": report_data["overall_score"],
                "说明": "基于多维度能力评估的综合得分"
            }])

            df_capabilities = pd.DataFrame([
                {"能力维度": k, "得分": v*100, "等级": self._get_score_level(v)}
                for k, v in report_data["capability_scores"].items()
            ])

            df_recommendations = pd.DataFrame([
                {"建议类型": rec.get("category", "通用"), "优先级": rec.get("priority", "中"),
                 "建议内容": rec.get("title", ""), "详细说明": rec.get("description", "")}
                for rec in report_data["recommendations"]
            ])

            # 保存到BytesIO
            output = BytesIO()
            with pd.ExcelWriter(output, engine='openpyxl') as writer:
                df_overview.to_excel(writer, sheet_name='评估概览', index=False)
                df_capabilities.to_excel(writer, sheet_name='能力详情', index=False)
                df_recommendations.to_excel(writer, sheet_name='改进建议', index=False)

            output.seek(0)
            return output.getvalue()

        except Exception as e:
            logger.error(f"生成Excel报告失败: {e}")
            return b""

    def _get_score_level(self, score: float) -> str:
        """获取得分等级"""
        if score >= 0.9:
            return "优秀"
        elif score >= 0.8:
            return "良好"
        elif score >= 0.7:
            return "中等"
        elif score >= 0.6:
            return "及格"
        else:
            return "需改进"

    async def generate_comparison_report(
        self, session_ids: List[str], analysis_results: List[Dict[str, Any]]
    ) -> Dict[str, Any]:
        """生成对比报告"""
        try:
            if len(session_ids) < 2:
                raise ValueError("对比报告至少需要2个会话数据")

            # 准备对比数据
            comparison_data = []
            for i, (session_id, results) in enumerate(zip(session_ids, analysis_results)):
                capability_scores = results.get("capability_scores", {})
                overall_score = sum(capability_scores.values()) / len(capability_scores) if capability_scores else 0

                comparison_data.append({
                    "session_id": session_id,
                    "candidate": f"候选人{i+1}",
                    "overall_score": overall_score * 100,
                    "capability_scores": capability_scores
                })

            # 生成对比图表
            comparison_chart = self._generate_comparison_chart(comparison_data)

            return {
                "success": True,
                "comparison_data": comparison_data,
                "comparison_chart": comparison_chart,
                "summary": self._generate_comparison_summary(comparison_data)
            }

        except Exception as e:
            logger.error(f"生成对比报告失败: {e}")
            return {
                "success": False,
                "error": str(e)
            }

    def _generate_comparison_chart(self, comparison_data: List[Dict[str, Any]]) -> str:
        """生成对比图表"""
        try:
            fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(15, 6))

            # 总体得分对比
            candidates = [data["candidate"] for data in comparison_data]
            overall_scores = [data["overall_score"] for data in comparison_data]

            bars = ax1.bar(candidates, overall_scores, color=['#409EFF', '#67C23A', '#E6A23C'][:len(candidates)])
            ax1.set_title('总体得分对比')
            ax1.set_ylabel('得分')
            ax1.set_ylim(0, 100)

            # 添加数值标签
            for bar, score in zip(bars, overall_scores):
                height = bar.get_height()
                ax1.text(bar.get_x() + bar.get_width()/2., height + 1,
                        f'{score:.1f}', ha='center', va='bottom')

            # 能力维度对比雷达图
            if comparison_data:
                capabilities = list(comparison_data[0]["capability_scores"].keys())
                angles = np.linspace(0, 2 * np.pi, len(capabilities), endpoint=False).tolist()
                angles += angles[:1]  # 闭合图形

                ax2 = plt.subplot(122, projection='polar')

                colors = ['#409EFF', '#67C23A', '#E6A23C', '#F56C6C']
                for i, data in enumerate(comparison_data):
                    values = [data["capability_scores"].get(cap, 0) * 100 for cap in capabilities]
                    values += values[:1]  # 闭合图形

                    ax2.plot(angles, values, 'o-', linewidth=2,
                            label=data["candidate"], color=colors[i % len(colors)])
                    ax2.fill(angles, values, alpha=0.25, color=colors[i % len(colors)])

                ax2.set_xticks(angles[:-1])
                ax2.set_xticklabels(capabilities)
                ax2.set_ylim(0, 100)
                ax2.set_title('能力维度对比')
                ax2.legend()

            plt.tight_layout()

            # 转换为base64
            buffer = BytesIO()
            plt.savefig(buffer, format='png', dpi=300, bbox_inches='tight')
            buffer.seek(0)
            chart_base64 = base64.b64encode(buffer.getvalue()).decode()
            plt.close()

            return chart_base64

        except Exception as e:
            logger.error(f"生成对比图表失败: {e}")
            return ""

    def _generate_comparison_summary(self, comparison_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """生成对比摘要"""
        try:
            # 找出最高分和最低分
            best_candidate = max(comparison_data, key=lambda x: x["overall_score"])
            worst_candidate = min(comparison_data, key=lambda x: x["overall_score"])

            # 计算平均分
            avg_score = sum(data["overall_score"] for data in comparison_data) / len(comparison_data)

            return {
                "best_performer": {
                    "candidate": best_candidate["candidate"],
                    "score": best_candidate["overall_score"]
                },
                "lowest_performer": {
                    "candidate": worst_candidate["candidate"],
                    "score": worst_candidate["overall_score"]
                },
                "average_score": round(avg_score, 1),
                "score_range": round(best_candidate["overall_score"] - worst_candidate["overall_score"], 1)
            }

        except Exception as e:
            logger.error(f"生成对比摘要失败: {e}")
            return {}

# 创建增强报告生成服务实例
enhanced_report_service = EnhancedReportGenerationService()
