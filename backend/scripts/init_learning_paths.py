"""
初始化学习路径数据脚本
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.models.database import SessionLocal, LearningPath, LearningModule
import json

def create_sample_learning_paths():
    """创建示例学习路径数据"""
    db = SessionLocal()
    
    try:
        # 人工智能技术岗学习路径
        ai_tech_path = LearningPath(
            domain="人工智能",
            position="技术岗",
            skill_level="中级",
            title="人工智能技术岗进阶学习路径",
            description="针对有一定编程基础的学员，系统学习人工智能核心技术，包括机器学习、深度学习、自然语言处理等领域",
            duration_weeks=16,
            difficulty_level=4,
            prerequisites=["Python编程基础", "数学基础（线性代数、概率论）", "数据结构与算法"],
            learning_objectives=[
                "掌握机器学习核心算法原理和实现",
                "熟练使用深度学习框架进行模型开发",
                "具备独立完成AI项目的能力",
                "了解AI在各行业的应用场景"
            ],
            path_data={
                "career_goals": ["AI算法工程师", "机器学习工程师", "深度学习研究员"],
                "salary_range": "15K-50K",
                "market_demand": "高"
            }
        )
        
        db.add(ai_tech_path)
        db.flush()  # 获取ID
        
        # 添加学习模块
        ai_modules = [
            {
                "module_order": 1,
                "title": "Python机器学习基础",
                "description": "学习Python在机器学习中的应用，掌握NumPy、Pandas、Scikit-learn等核心库",
                "duration_hours": 60,
                "module_type": "theory",
                "content": {
                    "topics": ["NumPy数组操作", "Pandas数据处理", "Matplotlib可视化", "Scikit-learn算法库"],
                    "exercises": ["数据预处理实战", "特征工程练习", "模型评估实验"]
                },
                "resources": [
                    {"type": "video", "title": "Python机器学习入门", "url": "https://example.com/ml-python"},
                    {"type": "book", "title": "Python机器学习实战", "author": "Sebastian Raschka"},
                    {"type": "practice", "title": "Kaggle入门竞赛", "url": "https://kaggle.com/learn"}
                ]
            },
            {
                "module_order": 2,
                "title": "机器学习算法深入",
                "description": "深入学习监督学习、无监督学习、强化学习等核心算法",
                "duration_hours": 80,
                "module_type": "theory",
                "content": {
                    "topics": ["线性回归与逻辑回归", "决策树与随机森林", "支持向量机", "聚类算法", "神经网络基础"],
                    "projects": ["房价预测模型", "客户分群分析", "图像分类器"]
                },
                "resources": [
                    {"type": "course", "title": "机器学习课程", "platform": "Coursera"},
                    {"type": "book", "title": "统计学习方法", "author": "李航"},
                    {"type": "tool", "title": "Scikit-learn官方文档", "url": "https://scikit-learn.org/"}
                ]
            },
            {
                "module_order": 3,
                "title": "深度学习框架实战",
                "description": "掌握TensorFlow/PyTorch深度学习框架，实现各种神经网络模型",
                "duration_hours": 100,
                "module_type": "practice",
                "content": {
                    "topics": ["TensorFlow基础", "PyTorch入门", "卷积神经网络", "循环神经网络", "Transformer架构"],
                    "projects": ["图像识别系统", "文本情感分析", "语音识别模型"]
                },
                "resources": [
                    {"type": "course", "title": "深度学习专项课程", "platform": "Coursera"},
                    {"type": "book", "title": "深度学习", "author": "Ian Goodfellow"},
                    {"type": "practice", "title": "PyTorch官方教程", "url": "https://pytorch.org/tutorials/"}
                ]
            },
            {
                "module_order": 4,
                "title": "AI项目综合实战",
                "description": "完成端到端的AI项目，从数据收集到模型部署",
                "duration_hours": 120,
                "module_type": "project",
                "content": {
                    "projects": [
                        "智能推荐系统",
                        "计算机视觉应用",
                        "自然语言处理项目",
                        "AI模型部署与优化"
                    ],
                    "skills": ["项目管理", "团队协作", "技术文档编写", "模型部署"]
                },
                "assessments": [
                    {"type": "project", "weight": 60, "description": "完成一个完整的AI项目"},
                    {"type": "presentation", "weight": 20, "description": "项目成果展示"},
                    {"type": "code_review", "weight": 20, "description": "代码质量评估"}
                ]
            }
        ]
        
        for module_data in ai_modules:
            module = LearningModule(
                path_id=ai_tech_path.id,
                **module_data
            )
            db.add(module)
        
        # 大数据技术岗学习路径
        bigdata_tech_path = LearningPath(
            domain="大数据",
            position="技术岗",
            skill_level="中级",
            title="大数据技术岗专业学习路径",
            description="系统学习大数据处理技术，包括Hadoop生态、Spark计算框架、数据仓库等核心技术",
            duration_weeks=14,
            difficulty_level=3,
            prerequisites=["Java/Python编程基础", "Linux操作系统", "数据库基础"],
            learning_objectives=[
                "掌握大数据处理核心技术栈",
                "熟练使用Hadoop、Spark等框架",
                "具备数据仓库设计和优化能力",
                "了解实时数据处理技术"
            ],
            path_data={
                "career_goals": ["大数据工程师", "数据架构师", "数据平台工程师"],
                "salary_range": "12K-40K",
                "market_demand": "高"
            }
        )
        
        db.add(bigdata_tech_path)
        db.flush()
        
        # 物联网技术岗学习路径
        iot_tech_path = LearningPath(
            domain="物联网",
            position="技术岗",
            skill_level="中级",
            title="物联网技术岗全栈学习路径",
            description="全面学习物联网技术栈，包括嵌入式开发、通信协议、云平台集成等",
            duration_weeks=12,
            difficulty_level=3,
            prerequisites=["C/C++编程基础", "电子电路基础", "网络协议基础"],
            learning_objectives=[
                "掌握嵌入式系统开发",
                "熟悉物联网通信协议",
                "具备IoT系统架构设计能力",
                "了解边缘计算和云端集成"
            ],
            path_data={
                "career_goals": ["IoT工程师", "嵌入式开发工程师", "物联网架构师"],
                "salary_range": "10K-35K",
                "market_demand": "中高"
            }
        )
        
        db.add(iot_tech_path)
        
        # 提交所有更改
        db.commit()
        print("示例学习路径数据创建成功！")
        
        # 打印创建的路径信息
        paths = db.query(LearningPath).all()
        for path in paths:
            print(f"- {path.title} (ID: {path.id})")
            modules = db.query(LearningModule).filter(LearningModule.path_id == path.id).all()
            for module in modules:
                print(f"  └─ {module.title}")
        
    except Exception as e:
        db.rollback()
        print(f"创建学习路径数据失败: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_learning_paths()
