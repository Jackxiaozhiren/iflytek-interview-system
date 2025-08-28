"""
学习路径服务模块
提供学习路径生成、管理和推荐功能
"""

from typing import List, Dict, Any, Optional
from sqlalchemy.orm import Session
from ..models.database import LearningPath, LearningModule, UserLearningProgress
import json
from datetime import datetime


class LearningPathService:
    """学习路径服务类"""
    
    def __init__(self, db: Session):
        self.db = db
    
    def get_learning_paths_by_domain(self, domain: str, position: Optional[str] = None) -> List[Dict[str, Any]]:
        """根据技术领域获取学习路径"""
        query = self.db.query(LearningPath).filter(LearningPath.domain == domain)
        if position:
            query = query.filter(LearningPath.position == position)
        
        paths = query.all()
        return [self._format_learning_path(path) for path in paths]
    
    def get_learning_path_detail(self, path_id: int) -> Optional[Dict[str, Any]]:
        """获取学习路径详情"""
        path = self.db.query(LearningPath).filter(LearningPath.id == path_id).first()
        if not path:
            return None
        
        # 获取模块信息
        modules = self.db.query(LearningModule).filter(
            LearningModule.path_id == path_id
        ).order_by(LearningModule.module_order).all()
        
        path_data = self._format_learning_path(path)
        path_data["modules"] = [self._format_learning_module(module) for module in modules]
        
        return path_data
    
    def generate_personalized_path(self, domain: str, position: str, 
                                 skill_level: str, evaluation_scores: Dict[str, float]) -> Dict[str, Any]:
        """基于评估结果生成个性化学习路径"""
        
        # 分析薄弱环节
        weak_areas = self._identify_weak_areas(evaluation_scores)
        
        # 生成学习路径
        learning_path = self._create_personalized_path(domain, position, skill_level, weak_areas)
        
        return learning_path
    
    def _identify_weak_areas(self, scores: Dict[str, float]) -> List[str]:
        """识别薄弱环节"""
        weak_areas = []
        threshold = 60.0  # 低于60分认为是薄弱环节
        
        score_mapping = {
            "professional_knowledge": "专业技能",
            "skill_matching": "技能匹配",
            "language_expression": "沟通表达",
            "logical_thinking": "逻辑思维",
            "innovation_ability": "创新能力",
            "stress_resistance": "抗压能力"
        }
        
        for key, score in scores.items():
            if score < threshold and key in score_mapping:
                weak_areas.append(score_mapping[key])
        
        return weak_areas
    
    def _create_personalized_path(self, domain: str, position: str, 
                                skill_level: str, weak_areas: List[str]) -> Dict[str, Any]:
        """创建个性化学习路径"""
        
        # 基础学习路径模板
        base_paths = {
            "人工智能": {
                "技术岗": self._get_ai_tech_path(skill_level, weak_areas),
                "产品岗": self._get_ai_product_path(skill_level, weak_areas),
                "运维测试岗": self._get_ai_ops_path(skill_level, weak_areas)
            },
            "大数据": {
                "技术岗": self._get_bigdata_tech_path(skill_level, weak_areas),
                "产品岗": self._get_bigdata_product_path(skill_level, weak_areas),
                "运维测试岗": self._get_bigdata_ops_path(skill_level, weak_areas)
            },
            "物联网": {
                "技术岗": self._get_iot_tech_path(skill_level, weak_areas),
                "产品岗": self._get_iot_product_path(skill_level, weak_areas),
                "运维测试岗": self._get_iot_ops_path(skill_level, weak_areas)
            }
        }
        
        return base_paths.get(domain, {}).get(position, self._get_default_path())
    
    def _get_ai_tech_path(self, skill_level: str, weak_areas: List[str]) -> Dict[str, Any]:
        """人工智能技术岗学习路径"""
        modules = []
        
        # 基础模块
        if skill_level in ["初级", "中级"]:
            modules.extend([
                {
                    "title": "Python编程基础",
                    "description": "掌握Python语法、数据结构和面向对象编程",
                    "duration_hours": 60,
                    "type": "theory",
                    "resources": [
                        {"type": "video", "title": "Python入门教程", "url": "https://example.com/python-basic"},
                        {"type": "book", "title": "Python编程：从入门到实践", "author": "Eric Matthes"},
                        {"type": "practice", "title": "Python练习题集", "url": "https://example.com/python-exercises"}
                    ]
                },
                {
                    "title": "机器学习基础",
                    "description": "理解机器学习基本概念、算法原理和应用场景",
                    "duration_hours": 80,
                    "type": "theory",
                    "resources": [
                        {"type": "course", "title": "机器学习入门", "platform": "Coursera"},
                        {"type": "book", "title": "机器学习实战", "author": "Peter Harrington"},
                        {"type": "tool", "title": "Scikit-learn官方文档", "url": "https://scikit-learn.org/"}
                    ]
                }
            ])
        
        # 根据薄弱环节添加针对性模块
        if "专业技能" in weak_areas:
            modules.append({
                "title": "深度学习进阶",
                "description": "深入学习神经网络、深度学习框架和前沿技术",
                "duration_hours": 100,
                "type": "theory",
                "priority": "high"
            })
        
        if "沟通表达" in weak_areas:
            modules.append({
                "title": "技术演讲与汇报",
                "description": "提升技术方案展示和团队沟通能力",
                "duration_hours": 30,
                "type": "practice",
                "priority": "medium"
            })
        
        # 实践项目
        modules.append({
            "title": "AI项目实战",
            "description": "完成端到端的AI项目开发",
            "duration_hours": 120,
            "type": "project",
            "projects": [
                "图像分类系统",
                "自然语言处理应用",
                "推荐系统开发"
            ]
        })
        
        return {
            "title": f"人工智能技术岗学习路径（{skill_level}）",
            "description": "针对人工智能技术岗位的系统性学习路径",
            "duration_weeks": 16,
            "difficulty_level": 3 if skill_level == "初级" else 4,
            "modules": modules,
            "career_goals": [
                "AI算法工程师",
                "机器学习工程师",
                "深度学习研究员"
            ]
        }
    
    def _get_ai_product_path(self, skill_level: str, weak_areas: List[str]) -> Dict[str, Any]:
        """人工智能产品岗学习路径"""
        # 类似的实现...
        return {
            "title": f"人工智能产品岗学习路径（{skill_level}）",
            "description": "针对AI产品经理的学习路径",
            "duration_weeks": 12,
            "difficulty_level": 2,
            "modules": []
        }
    
    def _get_ai_ops_path(self, skill_level: str, weak_areas: List[str]) -> Dict[str, Any]:
        """人工智能运维测试岗学习路径"""
        # 类似的实现...
        return {
            "title": f"人工智能运维测试岗学习路径（{skill_level}）",
            "description": "针对AI运维测试的学习路径",
            "duration_weeks": 10,
            "difficulty_level": 2,
            "modules": []
        }
    
    def _get_bigdata_tech_path(self, skill_level: str, weak_areas: List[str]) -> Dict[str, Any]:
        """大数据技术岗学习路径"""
        return {
            "title": f"大数据技术岗学习路径（{skill_level}）",
            "description": "针对大数据技术岗位的学习路径",
            "duration_weeks": 14,
            "difficulty_level": 3,
            "modules": []
        }
    
    def _get_bigdata_product_path(self, skill_level: str, weak_areas: List[str]) -> Dict[str, Any]:
        """大数据产品岗学习路径"""
        return {
            "title": f"大数据产品岗学习路径（{skill_level}）",
            "description": "针对大数据产品经理的学习路径",
            "duration_weeks": 12,
            "difficulty_level": 2,
            "modules": []
        }
    
    def _get_bigdata_ops_path(self, skill_level: str, weak_areas: List[str]) -> Dict[str, Any]:
        """大数据运维测试岗学习路径"""
        return {
            "title": f"大数据运维测试岗学习路径（{skill_level}）",
            "description": "针对大数据运维测试的学习路径",
            "duration_weeks": 10,
            "difficulty_level": 2,
            "modules": []
        }
    
    def _get_iot_tech_path(self, skill_level: str, weak_areas: List[str]) -> Dict[str, Any]:
        """物联网技术岗学习路径"""
        return {
            "title": f"物联网技术岗学习路径（{skill_level}）",
            "description": "针对物联网技术岗位的学习路径",
            "duration_weeks": 14,
            "difficulty_level": 3,
            "modules": []
        }
    
    def _get_iot_product_path(self, skill_level: str, weak_areas: List[str]) -> Dict[str, Any]:
        """物联网产品岗学习路径"""
        return {
            "title": f"物联网产品岗学习路径（{skill_level}）",
            "description": "针对物联网产品经理的学习路径",
            "duration_weeks": 12,
            "difficulty_level": 2,
            "modules": []
        }
    
    def _get_iot_ops_path(self, skill_level: str, weak_areas: List[str]) -> Dict[str, Any]:
        """物联网运维测试岗学习路径"""
        return {
            "title": f"物联网运维测试岗学习路径（{skill_level}）",
            "description": "针对物联网运维测试的学习路径",
            "duration_weeks": 10,
            "difficulty_level": 2,
            "modules": []
        }
    
    def _get_default_path(self) -> Dict[str, Any]:
        """默认学习路径"""
        return {
            "title": "通用技术学习路径",
            "description": "适用于各种技术岗位的通用学习路径",
            "duration_weeks": 12,
            "difficulty_level": 2,
            "modules": []
        }
    
    def _format_learning_path(self, path: LearningPath) -> Dict[str, Any]:
        """格式化学习路径数据"""
        return {
            "id": path.id,
            "domain": path.domain,
            "position": path.position,
            "skill_level": path.skill_level,
            "title": path.title,
            "description": path.description,
            "duration_weeks": path.duration_weeks,
            "difficulty_level": path.difficulty_level,
            "prerequisites": path.prerequisites,
            "learning_objectives": path.learning_objectives,
            "created_at": path.created_at.isoformat() if path.created_at else None
        }
    
    def _format_learning_module(self, module: LearningModule) -> Dict[str, Any]:
        """格式化学习模块数据"""
        return {
            "id": module.id,
            "order": module.module_order,
            "title": module.title,
            "description": module.description,
            "duration_hours": module.duration_hours,
            "type": module.module_type,
            "content": module.content,
            "resources": module.resources,
            "assessments": module.assessments
        }
