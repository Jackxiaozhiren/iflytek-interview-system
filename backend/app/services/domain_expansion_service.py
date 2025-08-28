"""
技术领域扩展服务
支持新技术领域的动态添加和管理
"""

import logging
import json
from typing import Dict, Any, List, Optional
from datetime import datetime
from dataclasses import dataclass, asdict
from enum import Enum

logger = logging.getLogger(__name__)

class DifficultyLevel(Enum):
    BEGINNER = "beginner"
    INTERMEDIATE = "intermediate"
    ADVANCED = "advanced"
    EXPERT = "expert"

class QuestionType(Enum):
    THEORY = "theory"
    CODING = "coding"
    SYSTEM_DESIGN = "system_design"
    PRACTICAL = "practical"
    CASE_STUDY = "case_study"

@dataclass
class TechnicalSkill:
    """技术技能定义"""
    name: str
    category: str
    description: str
    importance_level: int  # 1-10
    prerequisites: List[str]
    learning_resources: List[str]

@dataclass
class InterviewQuestion:
    """面试问题定义"""
    id: str
    question: str
    type: QuestionType
    difficulty: DifficultyLevel
    category: str
    expected_answer: str
    key_points: List[str]
    time_limit: int  # 秒
    scoring_criteria: Dict[str, int]
    follow_up_questions: List[str]

@dataclass
class TechnicalDomain:
    """技术领域定义"""
    id: str
    name: str
    description: str
    icon: str
    color: str
    core_skills: List[TechnicalSkill]
    interview_questions: List[InterviewQuestion]
    career_paths: List[str]
    salary_range: Dict[str, int]
    market_demand: int  # 1-10
    growth_trend: str  # "increasing", "stable", "decreasing"
    created_at: datetime
    updated_at: datetime

class DomainExpansionService:
    """技术领域扩展服务"""
    
    def __init__(self):
        self.domains = {}
        self.domain_templates = {}
        self._initialize_default_domains()
        self._load_domain_templates()
    
    def _initialize_default_domains(self):
        """初始化默认技术领域"""
        # 云计算领域
        cloud_computing = TechnicalDomain(
            id="cloud_computing",
            name="云计算",
            description="云服务、容器化、微服务架构等现代云计算技术",
            icon="CloudServer",
            color="#1890ff",
            core_skills=[
                TechnicalSkill(
                    name="AWS/Azure/GCP",
                    category="云平台",
                    description="主流云服务平台的使用和管理",
                    importance_level=9,
                    prerequisites=["Linux基础", "网络知识"],
                    learning_resources=["AWS官方文档", "云计算认证课程"]
                ),
                TechnicalSkill(
                    name="Docker",
                    category="容器化",
                    description="容器技术和容器编排",
                    importance_level=8,
                    prerequisites=["Linux基础"],
                    learning_resources=["Docker官方教程", "容器化实战"]
                ),
                TechnicalSkill(
                    name="Kubernetes",
                    category="容器编排",
                    description="容器集群管理和编排",
                    importance_level=9,
                    prerequisites=["Docker", "分布式系统"],
                    learning_resources=["K8s官方文档", "CKA认证"]
                )
            ],
            interview_questions=[
                InterviewQuestion(
                    id="cloud_q1",
                    question="请解释微服务架构的优缺点，以及如何在云环境中部署微服务",
                    type=QuestionType.SYSTEM_DESIGN,
                    difficulty=DifficultyLevel.INTERMEDIATE,
                    category="架构设计",
                    expected_answer="微服务架构将应用拆分为独立的服务...",
                    key_points=["服务拆分", "通信机制", "数据一致性", "部署策略"],
                    time_limit=600,
                    scoring_criteria={"理论理解": 30, "实践经验": 40, "架构设计": 30},
                    follow_up_questions=["如何处理微服务间的数据一致性？", "服务发现机制有哪些？"]
                )
            ],
            career_paths=["云架构师", "DevOps工程师", "云安全专家"],
            salary_range={"junior": 150000, "senior": 300000, "expert": 500000},
            market_demand=9,
            growth_trend="increasing",
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        # 区块链领域
        blockchain = TechnicalDomain(
            id="blockchain",
            name="区块链",
            description="分布式账本、智能合约、加密货币等区块链技术",
            icon="Link",
            color="#722ed1",
            core_skills=[
                TechnicalSkill(
                    name="Solidity",
                    category="智能合约",
                    description="以太坊智能合约开发语言",
                    importance_level=8,
                    prerequisites=["编程基础", "密码学基础"],
                    learning_resources=["Solidity官方文档", "智能合约开发教程"]
                ),
                TechnicalSkill(
                    name="Web3.js",
                    category="前端集成",
                    description="与区块链交互的JavaScript库",
                    importance_level=7,
                    prerequisites=["JavaScript", "区块链基础"],
                    learning_resources=["Web3.js文档", "DApp开发教程"]
                )
            ],
            interview_questions=[
                InterviewQuestion(
                    id="blockchain_q1",
                    question="请解释区块链的共识机制，比较PoW、PoS和DPoS的优缺点",
                    type=QuestionType.THEORY,
                    difficulty=DifficultyLevel.INTERMEDIATE,
                    category="共识机制",
                    expected_answer="共识机制是区块链网络中节点达成一致的方法...",
                    key_points=["PoW工作量证明", "PoS权益证明", "DPoS委托权益证明", "安全性对比"],
                    time_limit=480,
                    scoring_criteria={"理论知识": 40, "对比分析": 35, "实际应用": 25},
                    follow_up_questions=["如何防止51%攻击？", "分叉是如何产生的？"]
                )
            ],
            career_paths=["区块链开发工程师", "智能合约审计师", "加密货币分析师"],
            salary_range={"junior": 180000, "senior": 350000, "expert": 600000},
            market_demand=7,
            growth_trend="increasing",
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        # 网络安全领域
        cybersecurity = TechnicalDomain(
            id="cybersecurity",
            name="网络安全",
            description="信息安全、渗透测试、安全防护等网络安全技术",
            icon="Shield",
            color="#f5222d",
            core_skills=[
                TechnicalSkill(
                    name="渗透测试",
                    category="安全测试",
                    description="系统安全漏洞发现和利用",
                    importance_level=9,
                    prerequisites=["网络基础", "操作系统", "编程基础"],
                    learning_resources=["Kali Linux教程", "OSCP认证"]
                ),
                TechnicalSkill(
                    name="密码学",
                    category="加密技术",
                    description="加密算法和密码学原理",
                    importance_level=8,
                    prerequisites=["数学基础", "计算机基础"],
                    learning_resources=["密码学导论", "现代密码学"]
                )
            ],
            interview_questions=[
                InterviewQuestion(
                    id="security_q1",
                    question="请描述一次完整的渗透测试流程，包括信息收集、漏洞发现和利用",
                    type=QuestionType.PRACTICAL,
                    difficulty=DifficultyLevel.ADVANCED,
                    category="渗透测试",
                    expected_answer="渗透测试包括前期信息收集、漏洞扫描、漏洞利用...",
                    key_points=["信息收集", "漏洞扫描", "漏洞利用", "权限提升", "报告编写"],
                    time_limit=900,
                    scoring_criteria={"流程完整性": 30, "技术深度": 40, "实战经验": 30},
                    follow_up_questions=["如何避免在测试中造成系统损坏？", "常见的提权方法有哪些？"]
                )
            ],
            career_paths=["安全工程师", "渗透测试工程师", "安全架构师"],
            salary_range={"junior": 160000, "senior": 320000, "expert": 550000},
            market_demand=8,
            growth_trend="increasing",
            created_at=datetime.now(),
            updated_at=datetime.now()
        )
        
        self.domains = {
            "cloud_computing": cloud_computing,
            "blockchain": blockchain,
            "cybersecurity": cybersecurity
        }
    
    def _load_domain_templates(self):
        """加载领域模板"""
        self.domain_templates = {
            "web_development": {
                "name": "Web开发",
                "description": "前端和后端Web开发技术",
                "icon": "Monitor",
                "color": "#52c41a",
                "core_skills_template": [
                    "HTML/CSS/JavaScript",
                    "React/Vue/Angular",
                    "Node.js/Python/Java",
                    "数据库设计",
                    "RESTful API"
                ]
            },
            "mobile_development": {
                "name": "移动开发",
                "description": "iOS和Android移动应用开发",
                "icon": "Phone",
                "color": "#fa8c16",
                "core_skills_template": [
                    "Swift/Kotlin",
                    "React Native/Flutter",
                    "移动UI设计",
                    "应用商店发布",
                    "移动安全"
                ]
            },
            "game_development": {
                "name": "游戏开发",
                "description": "游戏引擎、图形编程、游戏设计",
                "icon": "Trophy",
                "color": "#eb2f96",
                "core_skills_template": [
                    "Unity/Unreal Engine",
                    "C#/C++",
                    "3D图形学",
                    "游戏物理",
                    "游戏设计"
                ]
            }
        }
    
    def add_new_domain(self, domain_data: Dict[str, Any]) -> Dict[str, Any]:
        """添加新的技术领域"""
        try:
            # 验证必要字段
            required_fields = ["id", "name", "description", "icon", "color"]
            for field in required_fields:
                if field not in domain_data:
                    raise ValueError(f"缺少必要字段: {field}")
            
            # 检查ID是否已存在
            if domain_data["id"] in self.domains:
                raise ValueError(f"领域ID已存在: {domain_data['id']}")
            
            # 创建技术技能列表
            core_skills = []
            for skill_data in domain_data.get("core_skills", []):
                skill = TechnicalSkill(**skill_data)
                core_skills.append(skill)
            
            # 创建面试问题列表
            interview_questions = []
            for question_data in domain_data.get("interview_questions", []):
                question = InterviewQuestion(
                    id=question_data["id"],
                    question=question_data["question"],
                    type=QuestionType(question_data["type"]),
                    difficulty=DifficultyLevel(question_data["difficulty"]),
                    category=question_data["category"],
                    expected_answer=question_data["expected_answer"],
                    key_points=question_data["key_points"],
                    time_limit=question_data["time_limit"],
                    scoring_criteria=question_data["scoring_criteria"],
                    follow_up_questions=question_data.get("follow_up_questions", [])
                )
                interview_questions.append(question)
            
            # 创建技术领域
            domain = TechnicalDomain(
                id=domain_data["id"],
                name=domain_data["name"],
                description=domain_data["description"],
                icon=domain_data["icon"],
                color=domain_data["color"],
                core_skills=core_skills,
                interview_questions=interview_questions,
                career_paths=domain_data.get("career_paths", []),
                salary_range=domain_data.get("salary_range", {}),
                market_demand=domain_data.get("market_demand", 5),
                growth_trend=domain_data.get("growth_trend", "stable"),
                created_at=datetime.now(),
                updated_at=datetime.now()
            )
            
            # 保存到领域字典
            self.domains[domain.id] = domain
            
            logger.info(f"成功添加新技术领域: {domain.name}")
            return {
                "success": True,
                "domain_id": domain.id,
                "message": f"技术领域 '{domain.name}' 添加成功"
            }
            
        except Exception as e:
            logger.error(f"添加技术领域失败: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def get_all_domains(self) -> Dict[str, Any]:
        """获取所有技术领域"""
        try:
            domains_data = {}
            for domain_id, domain in self.domains.items():
                domains_data[domain_id] = asdict(domain)
            
            return {
                "success": True,
                "domains": domains_data,
                "total_count": len(self.domains)
            }
            
        except Exception as e:
            logger.error(f"获取技术领域失败: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def get_domain_by_id(self, domain_id: str) -> Dict[str, Any]:
        """根据ID获取技术领域"""
        try:
            if domain_id not in self.domains:
                return {
                    "success": False,
                    "error": f"技术领域不存在: {domain_id}"
                }
            
            domain = self.domains[domain_id]
            return {
                "success": True,
                "domain": asdict(domain)
            }
            
        except Exception as e:
            logger.error(f"获取技术领域失败: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def update_domain(self, domain_id: str, update_data: Dict[str, Any]) -> Dict[str, Any]:
        """更新技术领域"""
        try:
            if domain_id not in self.domains:
                return {
                    "success": False,
                    "error": f"技术领域不存在: {domain_id}"
                }
            
            domain = self.domains[domain_id]
            
            # 更新基本信息
            for field in ["name", "description", "icon", "color", "career_paths", "salary_range", "market_demand", "growth_trend"]:
                if field in update_data:
                    setattr(domain, field, update_data[field])
            
            # 更新时间戳
            domain.updated_at = datetime.now()
            
            logger.info(f"成功更新技术领域: {domain.name}")
            return {
                "success": True,
                "message": f"技术领域 '{domain.name}' 更新成功"
            }
            
        except Exception as e:
            logger.error(f"更新技术领域失败: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def delete_domain(self, domain_id: str) -> Dict[str, Any]:
        """删除技术领域"""
        try:
            if domain_id not in self.domains:
                return {
                    "success": False,
                    "error": f"技术领域不存在: {domain_id}"
                }
            
            domain_name = self.domains[domain_id].name
            del self.domains[domain_id]
            
            logger.info(f"成功删除技术领域: {domain_name}")
            return {
                "success": True,
                "message": f"技术领域 '{domain_name}' 删除成功"
            }
            
        except Exception as e:
            logger.error(f"删除技术领域失败: {e}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def get_domain_templates(self) -> Dict[str, Any]:
        """获取领域模板"""
        return {
            "success": True,
            "templates": self.domain_templates
        }
    
    def create_domain_from_template(self, template_id: str, custom_data: Dict[str, Any]) -> Dict[str, Any]:
        """从模板创建技术领域"""
        try:
            if template_id not in self.domain_templates:
                return {
                    "success": False,
                    "error": f"模板不存在: {template_id}"
                }
            
            template = self.domain_templates[template_id]
            
            # 合并模板和自定义数据
            domain_data = {
                "id": custom_data.get("id", template_id),
                "name": custom_data.get("name", template["name"]),
                "description": custom_data.get("description", template["description"]),
                "icon": custom_data.get("icon", template["icon"]),
                "color": custom_data.get("color", template["color"]),
                "core_skills": custom_data.get("core_skills", []),
                "interview_questions": custom_data.get("interview_questions", []),
                "career_paths": custom_data.get("career_paths", []),
                "salary_range": custom_data.get("salary_range", {}),
                "market_demand": custom_data.get("market_demand", 5),
                "growth_trend": custom_data.get("growth_trend", "stable")
            }
            
            return self.add_new_domain(domain_data)
            
        except Exception as e:
            logger.error(f"从模板创建领域失败: {e}")
            return {
                "success": False,
                "error": str(e)
            }
