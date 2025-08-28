"""
增强学习路径API
Enhanced Learning Paths API

提供智能化、个性化的学习路径推荐服务
集成iFlytek Spark LLM技术，支持六维能力评估
"""

from fastapi import APIRouter, HTTPException, Depends, BackgroundTasks
from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any
from datetime import datetime, timedelta
import uuid
import json
import logging

from app.services.enhanced_iflytek_service import EnhancedIflytekService
from app.core.database import get_db
from app.models.learning_path import LearningPath, LearningModule, LearningProgress

logger = logging.getLogger(__name__)
router = APIRouter()

# Pydantic模型
class SixDimensionScores(BaseModel):
    """六维能力评估分数"""
    technical: float = Field(..., ge=0, le=100, description="技术能力")
    communication: float = Field(..., ge=0, le=100, description="沟通表达")
    logic: float = Field(..., ge=0, le=100, description="逻辑思维")
    problem_solving: float = Field(..., ge=0, le=100, description="问题解决")
    learning: float = Field(..., ge=0, le=100, description="学习适应")
    teamwork: float = Field(..., ge=0, le=100, description="团队协作")

class LearningPathRequest(BaseModel):
    """学习路径生成请求"""
    domain: str = Field(..., description="技术领域")
    position: str = Field(..., description="目标岗位")
    skill_level: str = Field(..., description="技能水平")
    path_type: str = Field(default="comprehensive", description="路径类型")
    six_dimension_scores: Optional[SixDimensionScores] = None
    session_id: Optional[str] = None
    preferences: Optional[Dict[str, Any]] = None

class LearningModuleResponse(BaseModel):
    """学习模块响应"""
    id: str
    title: str
    description: str
    duration: int
    difficulty: str
    objectives: List[str]
    concepts: List[str]
    projects: List[str]
    assessment: List[str]
    order: int
    status: str = "not_started"
    communication_focus: Optional[List[str]] = None
    teamwork_focus: Optional[List[str]] = None
    problem_solving_focus: Optional[List[str]] = None

class LearningTimelineResponse(BaseModel):
    """学习时间线响应"""
    total_hours: int
    total_weeks: int
    weekly_hours: int
    estimated_completion: str
    milestones: List[Dict[str, Any]]

class LearningResourceResponse(BaseModel):
    """学习资源响应"""
    books: List[Dict[str, Any]]
    courses: List[Dict[str, Any]]
    tools: List[str]

class LearningPathResponse(BaseModel):
    """学习路径响应"""
    id: str
    title: str
    domain: str
    position: str
    skill_level: str
    path_type: str
    weak_areas: List[Dict[str, Any]]
    modules: List[LearningModuleResponse]
    timeline: LearningTimelineResponse
    resources: LearningResourceResponse
    created_at: str
    session_id: Optional[str] = None

class LearningProgressUpdate(BaseModel):
    """学习进度更新"""
    module_id: str
    progress: float = Field(..., ge=0, le=100)
    status: str = Field(..., regex="^(not_started|in_progress|completed)$")
    notes: Optional[str] = None

# 学习路径生成服务
class EnhancedLearningPathService:
    def __init__(self):
        self.iflytek_service = EnhancedIflytekService()
        self.domain_data = self._initialize_domain_data()
        self.path_types = self._initialize_path_types()
        
    def _initialize_domain_data(self):
        """初始化技术领域数据"""
        return {
            "人工智能": {
                "positions": ["AI算法工程师", "ML工程师", "AI产品经理", "AI研究员", "数据科学家"],
                "skill_levels": {
                    "初级": {"months": 6, "weekly_hours": 15},
                    "中级": {"months": 12, "weekly_hours": 20},
                    "高级": {"months": 18, "weekly_hours": 25}
                },
                "modules": {
                    "初级": [
                        {
                            "title": "Python编程基础",
                            "description": "掌握Python语法、数据结构和面向对象编程",
                            "duration": 40,
                            "difficulty": "beginner",
                            "objectives": ["Python语法掌握", "数据结构理解", "OOP概念"],
                            "concepts": ["变量与数据类型", "控制流", "函数与模块", "类与对象"],
                            "projects": ["计算器程序", "文件处理工具", "简单爬虫"],
                            "assessment": ["编程练习", "项目作品", "代码审查"]
                        },
                        {
                            "title": "机器学习入门",
                            "description": "理解机器学习基本概念和常用算法",
                            "duration": 60,
                            "difficulty": "beginner",
                            "objectives": ["ML基本概念", "监督学习算法", "模型评估"],
                            "concepts": ["监督学习", "无监督学习", "特征工程", "模型评估"],
                            "projects": ["房价预测", "鸢尾花分类", "客户聚类"],
                            "assessment": ["理论测试", "算法实现", "项目报告"]
                        },
                        {
                            "title": "iFlytek语音技术基础",
                            "description": "学习科大讯飞语音识别和合成技术",
                            "duration": 30,
                            "difficulty": "beginner",
                            "objectives": ["语音识别原理", "TTS技术", "SDK使用"],
                            "concepts": ["语音信号处理", "ASR技术", "TTS技术", "API调用"],
                            "projects": ["语音助手", "语音转文字工具", "智能客服"],
                            "assessment": ["技术文档", "Demo演示", "集成测试"]
                        }
                    ]
                }
            },
            "大数据": {
                "positions": ["大数据工程师", "数据分析师", "数据架构师", "大数据产品经理", "BI工程师"],
                "skill_levels": {
                    "初级": {"months": 4, "weekly_hours": 12},
                    "中级": {"months": 10, "weekly_hours": 18},
                    "高级": {"months": 16, "weekly_hours": 22}
                },
                "modules": {
                    "初级": [
                        {
                            "title": "Hadoop生态系统",
                            "description": "分布式存储和计算基础",
                            "duration": 50,
                            "difficulty": "beginner",
                            "objectives": ["HDFS理解", "MapReduce编程", "集群管理"],
                            "concepts": ["分布式存储", "MapReduce", "YARN", "Hive"],
                            "projects": ["日志分析系统", "数据仓库搭建", "批处理任务"],
                            "assessment": ["集群搭建", "程序开发", "性能优化"]
                        }
                    ]
                }
            },
            "物联网": {
                "positions": ["IoT工程师", "嵌入式工程师", "硬件工程师", "IoT产品经理", "系统架构师"],
                "skill_levels": {
                    "初级": {"months": 5, "weekly_hours": 14},
                    "中级": {"months": 11, "weekly_hours": 19},
                    "高级": {"months": 17, "weekly_hours": 24}
                },
                "modules": {
                    "初级": [
                        {
                            "title": "嵌入式系统基础",
                            "description": "微控制器编程和硬件接口",
                            "duration": 45,
                            "difficulty": "beginner",
                            "objectives": ["单片机编程", "传感器接口", "通信协议"],
                            "concepts": ["ARM架构", "GPIO控制", "I2C/SPI", "UART通信"],
                            "projects": ["温度监控系统", "智能灯控", "环境监测站"],
                            "assessment": ["硬件调试", "程序功能", "系统稳定性"]
                        }
                    ]
                }
            }
        }
    
    def _initialize_path_types(self):
        """初始化学习路径类型"""
        return {
            "quick_boost": {
                "name": "快速提升",
                "description": "针对薄弱环节，快速提升核心技能",
                "duration": "2-4个月",
                "intensity": "高强度",
                "focus": "专项突破"
            },
            "comprehensive": {
                "name": "全面发展",
                "description": "系统性学习，全面提升技术能力",
                "duration": "6-12个月",
                "intensity": "中等强度",
                "focus": "全栈发展"
            },
            "specialized": {
                "name": "专项突破",
                "description": "深度专精某一技术方向",
                "duration": "8-18个月",
                "intensity": "深度学习",
                "focus": "专家级"
            }
        }
    
    async def generate_personalized_path(self, request: LearningPathRequest) -> LearningPathResponse:
        """生成个性化学习路径"""
        try:
            # 分析薄弱环节
            weak_areas = []
            if request.six_dimension_scores:
                weak_areas = self._analyze_weak_areas(request.six_dimension_scores.dict())
            
            # 生成学习模块
            modules = self._generate_learning_modules(
                request.domain, 
                request.skill_level, 
                weak_areas
            )
            
            # 计算学习时间线
            timeline = self._calculate_timeline(modules, request.skill_level)
            
            # 获取推荐资源
            resources = self._get_recommended_resources(request.domain, request.skill_level)
            
            # 使用iFlytek Spark优化学习路径
            if request.session_id:
                optimized_modules = await self._optimize_with_iflytek(modules, request)
                modules = optimized_modules
            
            path_id = str(uuid.uuid4())
            
            return LearningPathResponse(
                id=path_id,
                title=f"{request.domain}{request.position}学习路径",
                domain=request.domain,
                position=request.position,
                skill_level=request.skill_level,
                path_type=request.path_type,
                weak_areas=weak_areas,
                modules=[LearningModuleResponse(**module) for module in modules],
                timeline=LearningTimelineResponse(**timeline),
                resources=LearningResourceResponse(**resources),
                created_at=datetime.now().isoformat(),
                session_id=request.session_id
            )
            
        except Exception as e:
            logger.error(f"生成学习路径失败: {e}")
            raise HTTPException(status_code=500, detail=f"生成学习路径失败: {str(e)}")
    
    def _analyze_weak_areas(self, scores: Dict[str, float]) -> List[Dict[str, Any]]:
        """分析六维能力薄弱环节"""
        dimensions = [
            {"key": "technical", "name": "技术能力", "threshold": 70},
            {"key": "communication", "name": "沟通表达", "threshold": 75},
            {"key": "logic", "name": "逻辑思维", "threshold": 70},
            {"key": "problem_solving", "name": "问题解决", "threshold": 75},
            {"key": "learning", "name": "学习适应", "threshold": 70},
            {"key": "teamwork", "name": "团队协作", "threshold": 75}
        ]
        
        weak_areas = []
        for dim in dimensions:
            if scores.get(dim["key"], 0) < dim["threshold"]:
                weak_areas.append({
                    "dimension": dim["key"],
                    "name": dim["name"],
                    "score": scores[dim["key"]],
                    "improvement": dim["threshold"] - scores[dim["key"]]
                })
        
        return sorted(weak_areas, key=lambda x: x["improvement"], reverse=True)
    
    def _generate_learning_modules(self, domain: str, skill_level: str, weak_areas: List[Dict]) -> List[Dict]:
        """生成学习模块"""
        domain_info = self.domain_data.get(domain, {})
        modules = domain_info.get("modules", {}).get(skill_level, [])
        
        # 根据薄弱环节增强模块
        enhanced_modules = []
        for i, module in enumerate(modules):
            enhanced_module = module.copy()
            enhanced_module["id"] = f"module_{i + 1}"
            enhanced_module["order"] = i + 1
            enhanced_module["status"] = "not_started"
            
            # 根据薄弱环节添加特定内容
            for area in weak_areas:
                if area["dimension"] == "communication":
                    enhanced_module["communication_focus"] = [
                        "技术文档写作", "代码注释规范", "项目演示技巧"
                    ]
                elif area["dimension"] == "teamwork":
                    enhanced_module["teamwork_focus"] = [
                        "代码协作规范", "版本控制使用", "团队沟通技巧"
                    ]
                elif area["dimension"] == "problem_solving":
                    enhanced_module["problem_solving_focus"] = [
                        "调试技巧", "性能优化", "故障排查"
                    ]
            
            enhanced_modules.append(enhanced_module)
        
        return enhanced_modules
    
    def _calculate_timeline(self, modules: List[Dict], skill_level: str) -> Dict[str, Any]:
        """计算学习时间线"""
        total_hours = sum(module["duration"] for module in modules)
        weekly_hours = {"初级": 15, "中级": 20, "高级": 25}.get(skill_level, 20)
        total_weeks = max(1, total_hours // weekly_hours)
        
        # 生成里程碑
        milestones = []
        current_week = 0
        for module in modules:
            module_weeks = max(1, module["duration"] // weekly_hours)
            current_week += module_weeks
            milestones.append({
                "module_id": module["id"],
                "title": module["title"],
                "target_week": current_week,
                "target_date": (datetime.now() + timedelta(weeks=current_week)).strftime("%Y-%m-%d")
            })
        
        return {
            "total_hours": total_hours,
            "total_weeks": total_weeks,
            "weekly_hours": weekly_hours,
            "estimated_completion": (datetime.now() + timedelta(weeks=total_weeks)).strftime("%Y-%m-%d"),
            "milestones": milestones
        }
    
    def _get_recommended_resources(self, domain: str, skill_level: str) -> Dict[str, Any]:
        """获取推荐资源"""
        # 这里可以从数据库或外部API获取资源
        return {
            "books": [
                {
                    "title": "机器学习实战",
                    "author": "Peter Harrington",
                    "level": skill_level,
                    "rating": 4.5
                }
            ],
            "courses": [
                {
                    "title": "Andrew Ng机器学习课程",
                    "platform": "Coursera",
                    "duration": "11周",
                    "level": skill_level
                }
            ],
            "tools": ["Python", "TensorFlow", "Jupyter", "iFlytek SDK"]
        }
    
    async def _optimize_with_iflytek(self, modules: List[Dict], request: LearningPathRequest) -> List[Dict]:
        """使用iFlytek Spark优化学习路径"""
        try:
            # 构建优化提示
            prompt = f"""
            基于以下信息优化学习路径：
            - 技术领域：{request.domain}
            - 目标岗位：{request.position}
            - 技能水平：{request.skill_level}
            - 当前模块：{[m['title'] for m in modules]}
            
            请提供优化建议，包括：
            1. 模块顺序调整
            2. 重点关注领域
            3. 学习方法建议
            """
            
            response = await self.iflytek_service.chat_completion([
                {"role": "user", "content": prompt}
            ])
            
            # 这里可以根据iFlytek的响应进一步优化模块
            logger.info(f"iFlytek优化建议: {response}")
            
        except Exception as e:
            logger.warning(f"iFlytek优化失败: {e}")
        
        return modules

# 初始化服务
learning_path_service = EnhancedLearningPathService()

# API端点
@router.post("/personalized", response_model=LearningPathResponse)
async def generate_personalized_learning_path(
    request: LearningPathRequest,
    background_tasks: BackgroundTasks
):
    """生成个性化学习路径"""
    return await learning_path_service.generate_personalized_path(request)

@router.get("/domains")
async def get_available_domains():
    """获取可用的技术领域"""
    return {
        "domains": list(learning_path_service.domain_data.keys()),
        "path_types": learning_path_service.path_types
    }

@router.get("/{path_id}")
async def get_learning_path(path_id: str):
    """获取学习路径详情"""
    # 这里应该从数据库获取
    return {"message": f"获取学习路径 {path_id} 的详情"}

@router.put("/{path_id}/progress")
async def update_learning_progress(
    path_id: str,
    progress_update: LearningProgressUpdate
):
    """更新学习进度"""
    # 这里应该更新数据库中的进度
    return {
        "message": f"已更新路径 {path_id} 中模块 {progress_update.module_id} 的进度",
        "progress": progress_update.progress,
        "status": progress_update.status
    }
