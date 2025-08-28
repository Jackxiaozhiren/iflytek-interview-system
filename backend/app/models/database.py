from sqlalchemy import create_engine, Column, Integer, String, Float, DateTime, Text, JSON, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
import os

# 数据库配置
DATABASE_URL = "sqlite:///./interview_system.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class User(Base):
    """用户表"""
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class InterviewSession(Base):
    """面试会话表"""
    __tablename__ = "interview_sessions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, index=True)
    domain = Column(String(50))  # 技术领域：AI、大数据、物联网
    position = Column(String(50))  # 岗位类型：技术岗、运维测试岗、产品岗
    status = Column(String(20), default="active")  # active, completed, cancelled
    start_time = Column(DateTime, default=datetime.utcnow)
    end_time = Column(DateTime)
    total_questions = Column(Integer, default=0)
    session_data = Column(JSON)  # 存储会话的详细数据

class InterviewQuestion(Base):
    """面试问题表"""
    __tablename__ = "interview_questions"
    
    id = Column(Integer, primary_key=True, index=True)
    domain = Column(String(50))
    position = Column(String(50))
    question_text = Column(Text)
    difficulty_level = Column(String(20))  # easy, medium, hard
    question_type = Column(String(30))  # technical, behavioral, scenario
    keywords = Column(JSON)  # 关键词列表
    expected_points = Column(JSON)  # 期望回答要点

class InterviewResponse(Base):
    """面试回答表"""
    __tablename__ = "interview_responses"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, index=True)
    question_id = Column(Integer, index=True)
    question_text = Column(Text)
    response_text = Column(Text)
    response_time = Column(Float)  # 回答用时（秒）
    audio_file_path = Column(String(255))  # 音频文件路径
    video_file_path = Column(String(255))  # 视频文件路径
    created_at = Column(DateTime, default=datetime.utcnow)

class MultimodalAnalysis(Base):
    """多模态分析结果表"""
    __tablename__ = "multimodal_analysis"
    
    id = Column(Integer, primary_key=True, index=True)
    response_id = Column(Integer, index=True)
    
    # 语音分析结果
    speech_clarity = Column(Float)  # 语音清晰度 0-100
    speech_speed = Column(Float)  # 语速（字/分钟）
    emotion_score = Column(Float)  # 情感得分 0-100
    pause_frequency = Column(Float)  # 停顿频率
    
    # 视频分析结果
    eye_contact_score = Column(Float)  # 眼神交流得分 0-100
    facial_expression_score = Column(Float)  # 面部表情得分 0-100
    posture_score = Column(Float)  # 姿态得分 0-100
    gesture_appropriateness = Column(Float)  # 手势适当性 0-100
    
    # 文本分析结果
    content_relevance = Column(Float)  # 内容相关性 0-100
    logical_structure = Column(Float)  # 逻辑结构 0-100
    keyword_coverage = Column(Float)  # 关键词覆盖率 0-100
    innovation_score = Column(Float)  # 创新性得分 0-100
    
    analysis_timestamp = Column(DateTime, default=datetime.utcnow)

class EvaluationReport(Base):
    """评测报告表"""
    __tablename__ = "evaluation_reports"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, index=True)
    
    # 六项核心能力指标
    professional_knowledge = Column(Float)  # 专业知识水平 0-100
    skill_matching = Column(Float)  # 技能匹配度 0-100
    language_expression = Column(Float)  # 语言表达能力 0-100
    logical_thinking = Column(Float)  # 逻辑思维能力 0-100
    innovation_ability = Column(Float)  # 创新能力 0-100
    stress_resistance = Column(Float)  # 应变抗压能力 0-100
    
    overall_score = Column(Float)  # 综合得分 0-100
    strengths = Column(JSON)  # 优势点列表
    weaknesses = Column(JSON)  # 不足点列表
    improvement_suggestions = Column(JSON)  # 改进建议列表
    
    report_data = Column(JSON)  # 完整报告数据（包含图表数据）
    generated_at = Column(DateTime, default=datetime.utcnow)

class ResumeAnalysis(Base):
    """简历分析表"""
    __tablename__ = "resume_analysis"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(Integer, index=True)
    resume_file_path = Column(String(255))
    
    # 简历解析结果
    education_background = Column(JSON)  # 教育背景
    work_experience = Column(JSON)  # 工作经验
    skills = Column(JSON)  # 技能列表
    projects = Column(JSON)  # 项目经验
    
    # 匹配度分析
    position_match_score = Column(Float)  # 岗位匹配度 0-100
    skill_gap_analysis = Column(JSON)  # 技能差距分析
    
    analyzed_at = Column(DateTime, default=datetime.utcnow)


class LearningPath(Base):
    """学习路径表"""
    __tablename__ = "learning_paths"

    id = Column(Integer, primary_key=True, index=True)
    domain = Column(String(100), nullable=False)  # 技术领域
    position = Column(String(100), nullable=False)  # 岗位
    skill_level = Column(String(50), nullable=False)  # 技能水平：初级、中级、高级
    title = Column(String(200), nullable=False)  # 学习路径标题
    description = Column(Text)  # 描述
    duration_weeks = Column(Integer, default=12)  # 预计学习周期（周）
    difficulty_level = Column(Integer, default=1)  # 难度等级 1-5
    prerequisites = Column(JSON)  # 前置要求
    learning_objectives = Column(JSON)  # 学习目标
    path_data = Column(JSON)  # 完整的学习路径数据
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # 关系
    modules = relationship("LearningModule", back_populates="learning_path", cascade="all, delete-orphan")


class LearningModule(Base):
    """学习模块表"""
    __tablename__ = "learning_modules"

    id = Column(Integer, primary_key=True, index=True)
    path_id = Column(Integer, ForeignKey("learning_paths.id"))
    module_order = Column(Integer, nullable=False)  # 模块顺序
    title = Column(String(200), nullable=False)  # 模块标题
    description = Column(Text)  # 模块描述
    duration_hours = Column(Integer, default=40)  # 预计学习时长（小时）
    module_type = Column(String(50), default="theory")  # 模块类型：theory, practice, project
    content = Column(JSON)  # 模块内容
    resources = Column(JSON)  # 学习资源
    assessments = Column(JSON)  # 评估方式
    created_at = Column(DateTime, default=datetime.utcnow)

    # 关系
    learning_path = relationship("LearningPath", back_populates="modules")


class UserLearningProgress(Base):
    """用户学习进度表"""
    __tablename__ = "user_learning_progress"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String(100), nullable=False)  # 用户ID（可以是session或用户标识）
    path_id = Column(Integer, ForeignKey("learning_paths.id"))
    module_id = Column(Integer, ForeignKey("learning_modules.id"), nullable=True)
    progress_percentage = Column(Float, default=0.0)  # 进度百分比
    status = Column(String(50), default="not_started")  # 状态：not_started, in_progress, completed
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    notes = Column(Text)  # 学习笔记
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # 关系
    learning_path = relationship("LearningPath")
    learning_module = relationship("LearningModule")


# 创建所有表
def create_tables():
    Base.metadata.create_all(bind=engine)

# 获取数据库会话
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
