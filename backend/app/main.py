"""
多模态智能面试评测系统 - 主应用入口
简化版本，只保留核心功能
"""

import os
import asyncio
import logging
import traceback
from pathlib import Path
from typing import Optional, List, Dict, Any
from datetime import datetime
import json
import numpy as np
import hmac
import hashlib
import base64
import time
import urllib.parse

from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session
from dotenv import load_dotenv

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 加载环境变量
dotenv_path = Path(__file__).parent.parent / '软件杯.env'
load_dotenv(dotenv_path=dotenv_path)

# 确保iFlytek配置正确加载
if not os.getenv("SPARK_APPID"):
    # 直接设置环境变量作为备用方案
    os.environ["SPARK_APPID"] = "your_app_id_here"
    os.environ["SPARK_API_KEY"] = "your_api_key_here"
    os.environ["SPARK_API_SECRET"] = "your_api_secret_here"
    os.environ["SPARK_WSS_URL"] = "wss://spark-api.xf-yun.com/v1/x1"
    os.environ["SPARK_DOMAIN"] = "x1"
    os.environ["SPARK_HTTP_URL"] = "https://spark-api-open.xf-yun.com/v2/chat/completions"
    logger.info("iFlytek环境变量已直接设置")

# 导入数据库模型和服务
try:
    from .models import get_db, create_tables, InterviewSession, InterviewResponse, MultimodalAnalysis, EvaluationReport
    from .data.question_bank import get_questions_by_domain_position, get_all_domains, get_positions_by_domain
    from .services.iflytek_service import multimodal_service
    from .services.enhanced_multimodal_service import enhanced_multimodal_service
    from .services.learning_path_service import LearningPathService
    from .services.evaluation_service import evaluation_service
    from .services.enhanced_ai_capability_service import EnhancedAICapabilityService
except ImportError as e:
    logger.warning(f"相对导入失败: {e}")
    # 如果相对导入失败，尝试绝对导入
    try:
        from app.models import get_db, create_tables, InterviewSession, InterviewResponse, MultimodalAnalysis, EvaluationReport
        from app.data.question_bank import get_questions_by_domain_position, get_all_domains, get_positions_by_domain
        from app.services.iflytek_service import multimodal_service
        from app.services.enhanced_multimodal_service import enhanced_multimodal_service
        from app.services.learning_path_service import LearningPathService
        from app.services.evaluation_service import evaluation_service
        from app.services.enhanced_ai_capability_service import EnhancedAICapabilityService
    except ImportError as e2:
        logger.error(f"绝对导入也失败: {e2}")
        # 最后尝试直接导入
        import sys
        import os
        sys.path.append(os.path.dirname(__file__))
        from models import get_db, create_tables, InterviewSession, InterviewResponse, MultimodalAnalysis, EvaluationReport
        from data.question_bank import get_questions_by_domain_position, get_all_domains, get_positions_by_domain
        from services.iflytek_service import multimodal_service
        from services.enhanced_multimodal_service import enhanced_multimodal_service
        from services.learning_path_service import LearningPathService
        from services.evaluation_service import evaluation_service
        from services.enhanced_ai_capability_service import EnhancedAICapabilityService
from .services.enhanced_question_service import enhanced_question_service
from .services.advanced_interviewer_service import advanced_interviewer_service
from .services.report_generation_service import enhanced_report_service
from .services.enhanced_iflytek_service import get_enhanced_iflytek_service
from .services.system_monitor_service import get_system_monitor
from .services.localization_service import get_localization_service
from .middleware.performance_middleware import (
    PerformanceMiddleware, CompressionMiddleware,
    CacheMiddleware, SecurityMiddleware
)
from .core.config import Settings, IFlytekConfig



# 初始化配置
settings = Settings()
iflytek_config = IFlytekConfig(settings)

# 初始化增强的iFlytek服务
enhanced_iflytek_service = get_enhanced_iflytek_service(settings)

# 初始化系统监控
system_monitor = get_system_monitor()

# 初始化本地化服务
localization_service = get_localization_service()

# 创建FastAPI应用
app = FastAPI(
    title="多模态智能面试评测系统",
    description="基于iFlytek Spark大模型的智能面试评估平台",
    version="2.0.0"
)

# 配置CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 添加性能监控中间件 (简化配置，避免响应截断问题)
try:
    app.add_middleware(PerformanceMiddleware, enable_rate_limiting=False)  # 禁用限流避免问题
    logger.info("性能监控中间件已添加")
except Exception as e:
    logger.warning(f"性能监控中间件添加失败: {e}")

# 暂时禁用可能导致响应截断的中间件
# app.add_middleware(CompressionMiddleware)  # 压缩可能导致问题
# app.add_middleware(CacheMiddleware, cache_ttl=300)  # 缓存可能导致问题
# app.add_middleware(SecurityMiddleware)  # 安全中间件可能修改响应

# ==================== 全局异常处理器 ====================

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    """HTTP异常处理器"""
    logger.warning(f"HTTP异常: {exc.status_code} - {exc.detail} - URL: {request.url}")
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "error": {
                "code": exc.status_code,
                "message": exc.detail,
                "timestamp": datetime.now().isoformat(),
                "path": str(request.url)
            }
        }
    )

@app.exception_handler(Exception)
async def general_exception_handler(request, exc):
    """通用异常处理器"""
    error_id = f"ERR_{int(time.time())}"
    logger.error(f"未处理异常 [{error_id}]: {str(exc)} - URL: {request.url}")
    logger.error(f"异常详情 [{error_id}]: {traceback.format_exc()}")

    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "code": 500,
                "message": "服务器内部错误",
                "error_id": error_id,
                "timestamp": datetime.now().isoformat(),
                "path": str(request.url)
            }
        }
    )

@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    """值错误处理器"""
    logger.warning(f"参数错误: {str(exc)} - URL: {request.url}")
    return JSONResponse(
        status_code=400,
        content={
            "success": False,
            "error": {
                "code": 400,
                "message": f"参数错误: {str(exc)}",
                "timestamp": datetime.now().isoformat(),
                "path": str(request.url)
            }
        }
    )

def clean_markdown_symbols(text: str) -> str:
    """清理Markdown符号"""
    if not text:
        return ""
    
    # 移除常见的Markdown符号
    text = text.replace("**", "").replace("*", "").replace("_", "")
    text = text.replace("#", "").replace("`", "").replace("~", "")
    text = text.replace("[", "").replace("]", "").replace("(", "").replace(")", "")
    
    return text.strip()

# --- Spark WebSocket Client ---
class WsParam:
    def __init__(self, APPID, APIKey, APISecret, gpt_url):
        self.APPID = APPID
        self.APIKey = APIKey
        self.APISecret = APISecret
        self.host = gpt_url.split("//")[1].split("/")[0]
        self.path = "/" + "/".join(gpt_url.split("//")[1].split("/")[1:])
        self.gpt_url = gpt_url

def gen_params(appid, domain, messages):
    data = {
        "header": {"app_id": appid, "uid": "1234"},
        "parameter": {"chat": {"domain": domain, "temperature": 0.5, "max_tokens": 4096}},
        "payload": {"message": {"text": messages}}
    }
    return data

async def get_spark_response(messages):
    """
    调用iFlytek Spark大模型API
    使用增强的iFlytek服务
    """
    try:
        response = await enhanced_iflytek_service.chat_with_spark(messages)
        return response.get("content", "AI服务暂时不可用，请稍后重试。")
    except Exception as e:
        logger.error(f"Spark API调用失败: {e}")
        return "AI服务暂时不可用，请稍后重试。"

# 删除了旧的API调用函数，现在使用增强的iFlytek服务

# 删除了旧的API调用函数，现在使用增强的iFlytek服务

# 初始化服务
enhanced_ai_capability_service = EnhancedAICapabilityService()

# 初始化数据库和服务
@app.on_event("startup")
async def startup_event():
    """应用启动时的初始化"""
    try:
        create_tables()
        logger.info("数据库初始化完成")

        # 初始化增强的iFlytek服务
        await enhanced_iflytek_service.initialize()
        logger.info("iFlytek服务初始化完成")

        # 启动系统监控
        await system_monitor.start_monitoring(interval_seconds=30)
        logger.info("系统监控已启动")

        # 初始化本地化服务
        import os
        locales_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), "frontend", "src", "locales")
        localization_service.load_translations(locales_path)
        logger.info("本地化服务初始化完成")

    except Exception as e:
        logger.error(f"系统初始化失败: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    """应用关闭时的清理"""
    try:
        await enhanced_iflytek_service.cleanup()
        await system_monitor.stop_monitoring()
        logger.info("系统清理完成")
    except Exception as e:
        logger.error(f"系统清理失败: {e}")

# 基础API
@app.get("/")
async def root():
    """根路径"""
    return {"message": "多模态智能面试评测系统 API", "version": "2.0.0", "status": "running"}

@app.get("/health")
async def health_check():
    """健康检查"""
    return system_monitor.get_system_health()

@app.get("/api/v1/system/status")
async def get_system_status():
    """获取系统状态"""
    return {
        "health": system_monitor.get_system_health(),
        "api_stats": system_monitor.get_api_statistics(hours=1),
        "error_summary": system_monitor.get_error_summary(hours=1)
    }

@app.get("/api/v1/system/metrics")
async def get_system_metrics():
    """获取系统指标"""
    return {
        "api_statistics": system_monitor.get_api_statistics(hours=24),
        "error_summary": system_monitor.get_error_summary(hours=24),
        "health": system_monitor.get_system_health()
    }

@app.get("/api/v1/iflytek/health")
async def get_iflytek_health():
    """获取iFlytek服务健康状态"""
    try:
        health_info = await enhanced_iflytek_service.health_check()
        performance_metrics = await enhanced_iflytek_service.get_performance_metrics()

        return {
            "status": "success",
            "data": {
                "health": health_info,
                "performance": performance_metrics,
                "service_status": "operational" if health_info["status"] == "healthy" else "degraded"
            },
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"获取iFlytek健康状态失败: {e}")
        return {
            "status": "error",
            "data": {
                "health": {"status": "unhealthy", "error": str(e)},
                "service_status": "error"
            },
            "timestamp": datetime.now().isoformat()
        }

@app.get("/api/v1/iflytek/stats")
async def get_iflytek_stats():
    """获取iFlytek服务统计信息"""
    try:
        stats = enhanced_iflytek_service.get_stats()
        return {
            "status": "success",
            "data": stats,
            "timestamp": datetime.now().isoformat()
        }
    except Exception as e:
        logger.error(f"获取iFlytek统计信息失败: {e}")
        raise HTTPException(status_code=500, detail="获取统计信息失败")

@app.get("/api/v1/system/localization")
async def get_localization_status():
    """获取本地化状态"""
    return localization_service.get_localization_status()

@app.get("/api/v1/system/localization/validate")
async def validate_localization():
    """验证本地化完整性"""
    return localization_service.validate_translations()

# 数据模型
class InterviewStartRequest(BaseModel):
    domain: str
    position: str
    candidate_name: Optional[str] = "候选人"

class InterviewNextRequest(BaseModel):
    messages: List[Dict[str, str]]
    domain: Optional[str] = None
    position: Optional[str] = None

class DomainPositionRequest(BaseModel):
    domain: str
    position: str

class MultimodalAnalysisRequest(BaseModel):
    audio_data: Optional[str] = None  # base64编码的音频数据
    video_data: Optional[str] = None  # base64编码的视频数据
    text_data: str
    question_text: str

@app.get("/api/v1/domains")
async def get_domains():
    """获取所有技术领域"""
    try:
        domains = get_all_domains()
        return {
            "success": True,
            "data": domains,
            "message": "获取技术领域成功"
        }
    except Exception as e:
        logger.error(f"获取技术领域失败: {e}")
        raise HTTPException(status_code=500, detail=f"获取技术领域失败: {str(e)}")

@app.get("/api/v1/positions")
async def get_all_positions():
    """获取所有岗位列表"""
    try:
        all_positions = []
        domains = get_all_domains()
        for domain in domains:
            positions = get_positions_by_domain(domain)
            for position in positions:
                all_positions.append({
                    "domain": domain,
                    "position": position
                })
        return {
            "success": True,
            "data": all_positions,
            "message": "获取岗位列表成功"
        }
    except Exception as e:
        logger.error(f"获取岗位列表失败: {e}")
        raise HTTPException(status_code=500, detail=f"获取岗位列表失败: {str(e)}")

@app.get("/api/v1/domains/{domain}/positions")
async def get_positions(domain: str):
    """获取指定领域的岗位列表"""
    try:
        positions = get_positions_by_domain(domain)
        if not positions:
            raise HTTPException(status_code=404, detail="领域不存在")
        return {
            "success": True,
            "data": positions,
            "message": "获取岗位列表成功"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"获取岗位列表失败: {e}")
        raise HTTPException(status_code=500, detail=f"获取岗位列表失败: {str(e)}")

@app.post("/api/v1/questions")
async def get_questions(request: DomainPositionRequest):
    """获取指定领域和岗位的面试题目"""
    try:
        questions = get_questions_by_domain_position(request.domain, request.position)
        if not questions:
            raise HTTPException(status_code=404, detail=f"未找到 '{request.domain}' 领域 '{request.position}' 岗位的题目")
        return {
            "success": True,
            "questions": questions,
            "message": "获取面试题目成功"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"获取面试题目失败: {e}")
        raise HTTPException(status_code=500, detail=f"获取面试题目失败: {str(e)}")

# ==================== 面试会话管理API ====================

class InterviewSessionRequest(BaseModel):
    domain: str
    position: str
    candidate_name: Optional[str] = "候选人"
    mode: str = "standard"  # standard, practice, challenge
    analysis_types: List[str] = ["text"]  # text, audio, video

@app.post("/api/v1/interview/session")
async def create_interview_session(request: InterviewSessionRequest, db: Session = Depends(get_db)):
    """创建面试会话"""
    try:
        # 创建新的面试会话
        session = InterviewSession(
            domain=request.domain,
            position=request.position,
            status="active",
            start_time=datetime.now(),
            session_data={
                "candidate_name": request.candidate_name,
                "mode": request.mode,
                "analysis_types": request.analysis_types,
                "current_question_index": 0,
                "total_questions": 0
            }
        )

        db.add(session)
        db.commit()
        db.refresh(session)

        logger.info(f"创建面试会话成功: {session.id}")

        return {
            "success": True,
            "data": {
                "session_id": session.id,
                "domain": session.domain,
                "position": session.position,
                "candidate_name": request.candidate_name,
                "status": session.status,
                "start_time": session.start_time.isoformat(),
                "mode": request.mode,
                "analysis_types": request.analysis_types
            },
            "message": "面试会话创建成功"
        }
    except Exception as e:
        logger.error(f"创建面试会话失败: {e}")
        raise HTTPException(status_code=500, detail=f"创建面试会话失败: {str(e)}")

@app.get("/api/v1/interview/session/{session_id}")
async def get_interview_session(session_id: int, db: Session = Depends(get_db)):
    """获取面试会话信息"""
    try:
        session = db.query(InterviewSession).filter(InterviewSession.id == session_id).first()
        if not session:
            raise HTTPException(status_code=404, detail="面试会话不存在")

        session_data = session.session_data or {}
        return {
            "success": True,
            "data": {
                "session_id": session.id,
                "domain": session.domain,
                "position": session.position,
                "candidate_name": session_data.get("candidate_name", "候选人"),
                "status": session.status,
                "start_time": session.start_time.isoformat() if session.start_time else None,
                "end_time": session.end_time.isoformat() if session.end_time else None,
                "session_data": session_data
            },
            "message": "获取面试会话成功"
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"获取面试会话失败: {e}")
        raise HTTPException(status_code=500, detail=f"获取面试会话失败: {str(e)}")

# 面试相关API
DELIMITER = "|||DELIMITER|||"

@app.post("/api/v1/interview/start")
async def start_interview(request: InterviewStartRequest):
    """开始面试"""
    prompt = f"""
你是一位资深的{request.domain}领域技术面试官，拥有10年以上的行业经验，正在为{request.position}职位进行专业面试。

【面试背景】
- 技术领域：{request.domain}
- 目标岗位：{request.position}
- 面试目标：全面评估候选人的技术能力、实践经验和发展潜力

【你的任务】
1. 首先进行详细的思考分析（这部分会显示给候选人，展示你的专业思考过程）
2. 然后提出一个高质量的开场面试问题

【思考要求】
在分隔符前，请详细展示你的思考过程，包括：
- 对该岗位核心技能要求的分析
- 选择这个问题的理由和考察目标
- 对候选人回答的期望和评估标准

【问题要求】
- 问题要具有技术深度和实践性
- 能够有效区分不同水平的候选人
- 鼓励候选人展示具体的项目经验
- 为后续深入追问奠定基础

请严格按照以下格式回答：
[详细的思考分析过程]
{DELIMITER}
[具体的面试问题]
"""
    messages = [{"role": "user", "content": prompt}]
    try:
        response_text = await get_spark_response(messages)
        
        thinking = ""
        question = response_text

        if DELIMITER in response_text:
            parts = response_text.split(DELIMITER, 1)
            if len(parts) == 2:
                thinking = parts[0].strip()
                question = parts[1].strip()
        else:
            # 如果没有分隔符，将整个响应作为问题
            thinking = "AI 分析思路"
            question = response_text

        return {"thinking": thinking, "question": question}
    except Exception as e:
        logger.error(f"开始面试失败: {e}")
        raise HTTPException(status_code=500, detail=f"开始面试失败: {str(e)}")

@app.post("/api/v1/interview/next")
async def next_question(request: InterviewNextRequest):
    """获取下一个问题"""
    try:
        # 分析候选人的最后一次回答
        last_user_message = None
        for msg in reversed(request.messages):
            if msg.get("role") == "user":
                last_user_message = msg.get("content", "")
                break

        # 检测是否需要引导
        needs_guidance = any(phrase in (last_user_message or "").lower() for phrase in [
            "不知道", "不清楚", "没有经验", "不了解", "不会", "没做过", "不太懂"
        ])

        system_prompt = {
            "role": "system",
            "content": f"""
你是一位资深的技术面试官，正在进行深度面试对话。

【当前情况分析】
候选人最后的回答："{last_user_message or '无'}"
是否需要引导：{'是' if needs_guidance else '否'}

【你的任务】
1. 首先进行详细的思考分析（展示给候选人）
2. 根据情况提供适当的回应或下一个问题

【思考要求】
在分隔符前详细展示你的分析：
- 对候选人回答的评估和理解
- 识别出的知识盲点或优势
- 下一步的面试策略和目标

【回应策略】
{'如果候选人表示不知道或缺乏经验：' if needs_guidance else '基于候选人的回答：'}
{'- 提供适当的引导和提示' if needs_guidance else '- 进行深入的技术追问'}
{'- 给出相关的技术背景或示例场景' if needs_guidance else '- 探索更复杂的技术细节'}
{'- 降低问题难度或换个角度' if needs_guidance else '- 评估实际项目经验'}
{'- 鼓励候选人从基础概念开始回答' if needs_guidance else '- 挑战候选人的技术深度'}

请严格按照以下格式回答：
[详细的思考分析过程]
{DELIMITER}
[你的回应或下一个问题]
"""
        }
        
        history = [system_prompt]
        for msg in request.messages:
            if msg.get("role") in ["user", "assistant"]:
                history.append({"role": msg["role"], "content": msg["content"]})

        response_text = await get_spark_response(history)
        
        thinking = ""
        question = response_text

        if DELIMITER in response_text:
            parts = response_text.split(DELIMITER, 1)
            if len(parts) == 2:
                thinking = parts[0].strip()
                question = parts[1].strip()
        else:
            # 如果没有分隔符，将整个响应作为问题
            thinking = "AI 分析思路"
            question = response_text

        return {"thinking": thinking, "question": question}
    except Exception as e:
        logger.error(f"获取下一个问题失败: {e}")
        raise HTTPException(status_code=500, detail=f"获取下一个问题失败: {str(e)}")

# ==================== 增强的智能面试API ====================

@app.post("/api/v1/interview/enhanced-start")
async def enhanced_start_interview(request: InterviewStartRequest):
    """增强版开始面试 - 使用专业问题库和智能分析"""
    try:
        # 生成专业技术问题
        question_data = enhanced_question_service.generate_professional_question(
            request.domain, request.position, difficulty="medium"
        )

        # 构建增强的prompt
        enhanced_prompt = f"""
你是一位资深的{request.domain}领域技术专家和面试官，拥有15年以上的行业经验。

【面试背景】
- 技术领域：{request.domain}
- 目标岗位：{request.position}
- 问题类别：{question_data['category']}
- 难度等级：{question_data['difficulty']}

【专业分析要求】
请进行详细的专业思考分析，包括：
1. 该问题在{request.domain}领域的重要性和应用价值
2. 对{request.position}岗位候选人的能力要求分析
3. 预期的回答要点和评估标准
4. 可能的追问方向和深度挖掘点

【问题内容】
{question_data['question']}

【评估维度】
{', '.join(question_data['evaluation_criteria'])}

【期望关键词】
{', '.join(question_data['expected_keywords'])}

请严格按照以下格式回答：
[详细的专业分析和思考过程]
{DELIMITER}
{question_data['question']}
"""

        messages = [{"role": "user", "content": enhanced_prompt}]
        response_text = await get_spark_response(messages)

        thinking = ""
        question = question_data['question']  # 使用专业问题作为备用

        if DELIMITER in response_text:
            parts = response_text.split(DELIMITER, 1)
            if len(parts) == 2:
                thinking = parts[0].strip()
                question = parts[1].strip()
        else:
            thinking = f"基于{request.domain}领域{request.position}岗位的专业要求，我为您准备了一个{question_data['category']}类型的问题。这个问题旨在评估您的{', '.join(question_data['evaluation_criteria'][:2])}。"

        return {
            "thinking": thinking,
            "question": question,
            "question_metadata": {
                "category": question_data['category'],
                "difficulty": question_data['difficulty'],
                "evaluation_criteria": question_data['evaluation_criteria'],
                "expected_keywords": question_data['expected_keywords'],
                "follow_up_questions": question_data['follow_up_questions']
            }
        }
    except Exception as e:
        logger.error(f"增强版开始面试失败: {e}")
        raise HTTPException(status_code=500, detail=f"增强版开始面试失败: {str(e)}")

@app.post("/api/v1/interview/enhanced-next")
async def enhanced_next_question(request: InterviewNextRequest):
    """增强版下一个问题 - 智能引导和专业追问"""
    try:
        # 分析候选人的最后一次回答
        last_user_message = None
        for msg in reversed(request.messages):
            if msg.get("role") == "user":
                last_user_message = msg.get("content", "")
                break

        # 检测是否需要引导
        needs_guidance = any(phrase in (last_user_message or "").lower() for phrase in [
            "不知道", "不清楚", "没有经验", "不了解", "不会", "没做过", "不太懂", "不确定"
        ])

        if needs_guidance:
            # 生成引导性回应
            guidance_data = enhanced_question_service.generate_guidance_response(
                last_user_message or "", request.domain, request.position
            )

            enhanced_prompt = f"""
你是一位经验丰富的{request.domain}领域技术面试官，擅长引导和启发候选人。

【当前情况】
候选人回答："{last_user_message}"
分析结果：候选人在这个问题上缺乏经验或知识

【引导策略】
{guidance_data['guidance']}

【引导目标】
1. 降低问题难度，从基础概念开始
2. 提供具体的场景和示例
3. 鼓励候选人从已知领域类比
4. 给出适当的提示和方向

【回答建议】
{chr(10).join(guidance_data['suggestions'])}

【相关示例】
{chr(10).join(guidance_data['examples'])}

请进行详细的思考分析，然后提供一个引导性的回应或简化的问题。

请严格按照以下格式回答：
[详细的分析和引导思路]
{DELIMITER}
[引导性回应或简化问题]
"""
        else:
            # 生成深度追问
            enhanced_prompt = f"""
你是一位资深的{request.domain}领域技术面试官，正在进行深度技术面试。

【对话历史分析】
候选人最新回答："{last_user_message}"

【深度追问策略】
1. 基于候选人的回答识别技术亮点和深入点
2. 探索实际项目经验和技术细节
3. 评估技术深度和解决问题的能力
4. 挑战候选人的技术边界

【追问方向】
- 技术实现细节和原理
- 实际项目中的挑战和解决方案
- 技术选型的考虑因素
- 性能优化和系统设计
- 团队协作和技术领导力

请进行详细的专业分析，然后提出一个有深度的追问问题。

请严格按照以下格式回答：
[详细的分析和追问策略]
{DELIMITER}
[深度追问问题]
"""

        messages = [{"role": "user", "content": enhanced_prompt}]
        response_text = await get_spark_response(messages)

        thinking = ""
        question = response_text

        if DELIMITER in response_text:
            parts = response_text.split(DELIMITER, 1)
            if len(parts) == 2:
                thinking = parts[0].strip()
                question = parts[1].strip()
        else:
            if needs_guidance:
                thinking = "我注意到您在这个问题上可能需要一些引导。让我换个角度来帮助您思考这个问题。"
            else:
                thinking = "基于您的回答，我想进一步了解您的技术深度和实践经验。"

        return {
            "thinking": thinking,
            "question": question,
            "guidance_provided": needs_guidance,
            "response_type": "guidance" if needs_guidance else "follow_up"
        }
    except Exception as e:
        logger.error(f"增强版获取下一个问题失败: {e}")
        raise HTTPException(status_code=500, detail=f"增强版获取下一个问题失败: {str(e)}")

# ==================== 高级AI面试官API ====================

@app.post("/api/v1/interview/advanced-start")
async def advanced_start_interview(request: InterviewStartRequest):
    """高级AI面试官 - 深度分析思路和专业问题生成"""
    try:
        # 生成专业技术问题
        question_data = enhanced_question_service.generate_professional_question(
            request.domain, request.position, difficulty="medium"
        )

        # 生成深度AI分析思路
        deep_analysis = advanced_interviewer_service.generate_deep_analysis(
            question_data['question'],
            request.domain,
            request.position,
            question_data
        )

        return {
            "thinking": deep_analysis,
            "question": question_data['question'],
            "question_metadata": {
                "category": question_data['category'],
                "difficulty": question_data['difficulty'],
                "evaluation_criteria": question_data['evaluation_criteria'],
                "expected_keywords": question_data['expected_keywords'],
                "follow_up_questions": question_data['follow_up_questions']
            },
            "analysis_type": "deep_professional_analysis"
        }
    except Exception as e:
        logger.error(f"高级面试开始失败: {e}")
        raise HTTPException(status_code=500, detail=f"高级面试开始失败: {str(e)}")

@app.post("/api/v1/interview/advanced-next")
async def advanced_next_question(request: InterviewNextRequest):
    """高级AI面试官 - 智能分析和针对性引导"""
    try:
        # 获取最后的AI问题和用户回答
        last_ai_question = None
        last_user_message = None

        for msg in reversed(request.messages):
            if msg.get("role") == "user" and not last_user_message:
                last_user_message = msg.get("content", "")
            elif msg.get("role") == "assistant" and not last_ai_question:
                last_ai_question = msg.get("content", "")

            if last_user_message and last_ai_question:
                break

        # 分析候选人回答
        response_analysis = advanced_interviewer_service.analyze_candidate_response(
            last_user_message or "",
            last_ai_question or "",
            request.domain or "人工智能",
            request.position or "技术岗"
        )

        # 验证分类准确性，防止误判
        validation_result = advanced_interviewer_service.validate_response_classification(
            last_user_message or "", response_analysis['response_type'],
            request.domain or "人工智能"
        )

        # 如果检测到误判，使用修正后的分类
        if validation_result['potential_misjudgment']:
            response_analysis['response_type'] = validation_result['final_classification']
            response_analysis['validation_info'] = validation_result

        # 生成智能的分析思路 - 基于验证结果
        final_response_type = response_analysis['response_type']
        key_concepts_text = ', '.join(response_analysis['key_concepts']) if response_analysis['key_concepts'] else "相关技术概念"

        # 如果有验证信息，使用验证结果
        validation_info = response_analysis.get('validation_info', {})
        if validation_info and validation_info.get('potential_misjudgment'):
            validation_reason = validation_info.get('validation_reason', '')
            analysis_thinking = f"""让我仔细分析一下您刚才的回答。

{validation_reason}

从您的回答中，我能看出您对{key_concepts_text}等技术要点有着{_get_accurate_assessment_description(final_response_type, validation_info.get('quality_analysis', {}))}。

{_evaluate_response_quality_enhanced(last_user_message, last_ai_question, final_response_type, validation_info.get('quality_analysis', {}))}

基于这样的分析，我认为最合适的方式是{_get_natural_strategy_description(response_analysis['guidance_strategy'])}。"""
        else:
            # 使用原有逻辑但改进描述
            analysis_thinking = f"""让我分析一下您刚才的回答。

从您的回答中，我识别出这是一个{_get_response_type_description(final_response_type)}的情况。我注意到这个问题涉及到{key_concepts_text}等技术要点。

{_evaluate_response_quality(last_user_message, last_ai_question, response_analysis)}

考虑到您的情况，我觉得最好的方式是{_get_natural_strategy_description(response_analysis['guidance_strategy'])}。我会确保我们的讨论紧密围绕原问题展开，这样既能帮助您理解相关技术，也能让我更好地了解您的技术思维和学习能力。"""

        # 根据分析结果生成相应的引导内容
        if response_analysis['needs_technical_guidance']:
            # 候选人明确要求答案，提供技术指导
            guidance_content = advanced_interviewer_service.generate_technical_guidance(
                last_ai_question or "",
                response_analysis['key_concepts'],
                response_analysis['technical_context'],
                request.domain or "人工智能"
            )
        elif response_analysis['needs_hints']:
            # 候选人表示不知道，提供提示和引导
            guidance_content = advanced_interviewer_service.generate_hint_based_guidance(
                last_ai_question or "",
                response_analysis['key_concepts'],
                response_analysis['technical_context'],
                request.domain or "人工智能"
            )
        else:
            # 其他情况，进行深度追问
            guidance_content = f"""基于您的回答，我想进一步了解您的技术深度。

让我们深入探讨一下：您能详细说明其中的技术实现细节吗？"""

        return {
            "thinking": analysis_thinking,
            "question": guidance_content,
            "response_analysis": {
                "response_type": response_analysis['response_type'],
                "key_concepts": response_analysis['key_concepts'],
                "guidance_strategy": response_analysis['guidance_strategy']['approach']
            },
            "guidance_provided": response_analysis['needs_technical_guidance'] or response_analysis['needs_hints'],
            "analysis_type": "deep_response_analysis"
        }
    except Exception as e:
        logger.error(f"高级面试下一个问题失败: {e}")
        raise HTTPException(status_code=500, detail=f"高级面试下一个问题失败: {str(e)}")

def _get_response_type_description(response_type: str) -> str:
    """获取回答类型的自然描述 - 增强版本"""
    type_descriptions = {
        'request_answer': '主动寻求技术指导',
        'express_unknown': '坦诚表达知识盲点',
        'partial_knowledge': '展现部分技术理解',
        'confident_answer': '展现专业技术能力'
    }
    return type_descriptions.get(response_type, '技术交流')

def _get_accurate_assessment_description(response_type: str, quality_analysis: Dict) -> str:
    """获取准确的评估描述"""
    if response_type == 'confident_answer':
        if quality_analysis.get('detailed_explanation', False):
            return "深入的理解和详细的技术解释能力"
        elif quality_analysis.get('technical_word_count', 0) > 5:
            return "扎实的专业知识和丰富的技术词汇"
        else:
            return "良好的技术理解和实践基础"
    elif response_type == 'partial_knowledge':
        return "一定的技术基础和学习潜力"
    elif response_type == 'request_answer':
        return "积极的学习态度和求知欲"
    else:
        return "诚实的态度和学习意愿"

def _evaluate_response_quality_enhanced(user_response: str, original_question: str,
                                      response_type: str, quality_analysis: Dict) -> str:
    """评估回答质量 - 基于验证结果的增强版本"""
    if response_type == 'confident_answer':
        if quality_analysis.get('detailed_explanation', False):
            return f"您的回答展现了深度的技术理解，包含了{quality_analysis.get('technical_word_count', 0)}个专业术语，并且提供了详细的实现步骤和解释。这表明您不仅掌握了理论知识，还有着丰富的实践经验。"
        elif quality_analysis.get('professional_indicators', 0) > 5:
            return f"您的回答体现了扎实的专业功底，涵盖了{quality_analysis.get('professional_indicators', 0)}个专业指标，技术表达清晰准确。"
        else:
            return "您展现了良好的技术理解能力和专业素养。"
    elif response_type == 'partial_knowledge':
        return "您展现了对这个领域的基础理解，这是一个很好的起点。让我们在您现有知识的基础上，进一步深入探讨相关的技术细节。"
    elif response_type == 'request_answer':
        return "我注意到您希望获得这个问题的具体指导，这种主动学习的态度很好。作为面试官，我很乐意为您详细解析这个技术问题。"
    else:
        return "您很诚实地表达了对这个问题的不确定性，这在面试中其实是一种很好的品质。我们可以从基础开始，一步步来探讨这个话题。"

def _get_natural_strategy_description(guidance_strategy: Dict) -> str:
    """获取引导策略的自然描述"""
    strategy_map = {
        'provide_technical_guidance': '为您提供详细的技术解析和实践指导',
        'provide_hints_and_examples': '通过提示和实例来引导您思考',
        'build_on_existing_knowledge': '在您现有理解的基础上进一步深入',
        'encourage_exploration': '鼓励您探索和表达自己的想法'
    }
    strategy_key = guidance_strategy.get('response_strategy', 'provide_hints_and_examples')
    return strategy_map.get(strategy_key, '采用适合的引导方式')

def _evaluate_response_quality(user_response: str, original_question: str,
                             response_analysis: Dict) -> str:
    """评估回答质量 - 增强版本"""
    response_type = response_analysis.get('response_type', 'partial_knowledge')

    if response_type == 'request_answer':
        return "我注意到您希望获得这个问题的具体指导，这种主动学习的态度很好。作为面试官，我很乐意为您详细解析这个技术问题，这样既能帮助您理解，也能让我更好地评估您的学习能力。"
    elif response_type == 'express_unknown':
        return "您很诚实地表达了对这个问题的不确定性，这在面试中其实是一种很好的品质。我们可以从基础开始，一步步来探讨这个话题。"
    elif response_type == 'confident_answer':
        return "从您的回答中我能看出您对这个技术领域有着扎实的理解和丰富的实践经验。让我们在此基础上进行更深入的技术讨论，探索一些更具挑战性的场景。"
    elif response_type == 'partial_knowledge':
        return "您展现了对这个领域的基础理解，这是一个很好的起点。让我们在您现有知识的基础上，进一步深入探讨相关的技术细节。"
    else:
        return "从您的回答中我能感受到您对这个领域有一定的了解，让我们在此基础上进一步深入探讨。"

@app.post("/api/v1/interview/end")
async def end_interview(request: InterviewNextRequest):
    messages = request.messages
    
    messages.append({
        "role": "user",
        "content": "面试结束了，辛苦了。请对我刚才的整体表现做一个简短的、总结性的评价吧。"
    })

    try:
        response_text = await get_spark_response(messages)
        clean_response = clean_markdown_symbols(response_text)
        return {"question": clean_response}
    except Exception as e:
        logger.error(f"结束面试失败: {e}")
        raise HTTPException(status_code=500, detail=f"结束面试失败: {str(e)}")

# 多模态分析API
@app.post("/api/v1/analysis/multimodal")
async def analyze_multimodal(request: MultimodalAnalysisRequest):
    """多模态分析"""
    try:
        result = await enhanced_multimodal_service.analyze_comprehensive_multimodal(
            text_data=request.text_data,
            audio_data=request.audio_data,
            video_data=request.video_data,
            question_context=request.question_text
        )
        return {"success": True, "data": result}
    except Exception as e:
        logger.error(f"多模态分析失败: {e}")
        raise HTTPException(status_code=500, detail=f"多模态分析失败: {str(e)}")

# 能力评估API
@app.post("/api/v1/analysis/enhanced-capability")
async def enhanced_capability_analysis(
    text_data: str = Form(...),
    domain: str = Form(...),
    position: str = Form(...),
    audio_data: Optional[str] = Form(None),
    video_data: Optional[str] = Form(None),
    question_context: Optional[str] = Form(None)
):
    """增强版6项核心能力评估"""
    try:
        result = await enhanced_ai_capability_service.enhanced_capability_assessment(
            text_data=text_data,
            audio_analysis={"data": audio_data} if audio_data else None,
            video_analysis={"data": video_data} if video_data else None,
            question_context=question_context,
            domain=domain,
            position=position
        )
        return {"success": True, "data": result}
    except Exception as e:
        logger.error(f"增强能力评估失败: {e}")
        raise HTTPException(status_code=500, detail=f"增强能力评估失败: {str(e)}")

# ==================== 系统监控和健康检查端点 ====================

@app.get("/health")
async def health_check():
    """系统健康检查端点"""
    try:
        # 检查数据库连接
        db = next(get_db())
        db.execute("SELECT 1")
        db_status = "healthy"
    except Exception as e:
        db_status = f"unhealthy: {str(e)}"

    # 检查iFlytek服务状态
    try:
        iflytek_service = get_enhanced_iflytek_service()
        iflytek_stats = iflytek_service.get_stats()
        iflytek_status = "healthy"
    except Exception as e:
        iflytek_stats = {}
        iflytek_status = f"unhealthy: {str(e)}"

    # 系统资源状态
    try:
        import psutil
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')

        system_status = {
            "cpu_usage": f"{cpu_percent}%",
            "memory_usage": f"{memory.percent}%",
            "memory_available": f"{memory.available / (1024**3):.2f}GB",
            "disk_usage": f"{disk.percent}%",
            "disk_free": f"{disk.free / (1024**3):.2f}GB"
        }
    except Exception as e:
        system_status = {"error": str(e)}

    health_data = {
        "status": "healthy" if db_status == "healthy" and iflytek_status == "healthy" else "unhealthy",
        "timestamp": datetime.now().isoformat(),
        "version": "2.0.0",
        "services": {
            "database": db_status,
            "iflytek_service": iflytek_status,
            "iflytek_stats": iflytek_stats
        },
        "system": system_status,
        "uptime": time.time() - app.state.start_time if hasattr(app.state, 'start_time') else 0
    }

    status_code = 200 if health_data["status"] == "healthy" else 503
    return JSONResponse(content=health_data, status_code=status_code)

@app.get("/metrics")
async def get_metrics():
    """获取系统性能指标"""
    try:
        import psutil

        # CPU信息
        cpu_info = {
            "usage_percent": psutil.cpu_percent(interval=1),
            "count": psutil.cpu_count(),
            "load_average": os.getloadavg() if hasattr(os, 'getloadavg') else None
        }

        # 内存信息
        memory = psutil.virtual_memory()
        memory_info = {
            "total": memory.total,
            "available": memory.available,
            "percent": memory.percent,
            "used": memory.used,
            "free": memory.free
        }

        # 磁盘信息
        disk = psutil.disk_usage('/')
        disk_info = {
            "total": disk.total,
            "used": disk.used,
            "free": disk.free,
            "percent": disk.percent
        }

        # 网络信息
        network = psutil.net_io_counters()
        network_info = {
            "bytes_sent": network.bytes_sent,
            "bytes_recv": network.bytes_recv,
            "packets_sent": network.packets_sent,
            "packets_recv": network.packets_recv
        }

        # iFlytek服务统计
        try:
            iflytek_service = get_enhanced_iflytek_service()
            iflytek_metrics = iflytek_service.get_stats()
        except Exception:
            iflytek_metrics = {}

        return {
            "timestamp": datetime.now().isoformat(),
            "cpu": cpu_info,
            "memory": memory_info,
            "disk": disk_info,
            "network": network_info,
            "iflytek_service": iflytek_metrics
        }

    except Exception as e:
        logger.error(f"获取系统指标失败: {e}")
        raise HTTPException(status_code=500, detail=f"获取系统指标失败: {str(e)}")

@app.get("/status")
async def get_system_status():
    """获取系统状态概览"""
    try:
        # 获取系统监控服务
        monitor = get_system_monitor()

        # 基本状态信息
        status_info = {
            "service_name": "多模态智能面试评测系统",
            "version": "2.0.0",
            "environment": os.getenv("ENVIRONMENT", "development"),
            "timestamp": datetime.now().isoformat(),
            "uptime_seconds": time.time() - app.state.start_time if hasattr(app.state, 'start_time') else 0
        }

        # 服务状态
        services_status = {
            "database": "healthy",
            "iflytek_service": "healthy",
            "multimodal_service": "healthy",
            "evaluation_service": "healthy"
        }

        # 尝试检查各服务状态
        try:
            db = next(get_db())
            db.execute("SELECT 1")
        except Exception:
            services_status["database"] = "unhealthy"

        try:
            iflytek_service = get_enhanced_iflytek_service()
            iflytek_service.get_stats()
        except Exception:
            services_status["iflytek_service"] = "unhealthy"

        return {
            "status": status_info,
            "services": services_status,
            "health": "healthy" if all(status == "healthy" for status in services_status.values()) else "degraded"
        }

    except Exception as e:
        logger.error(f"获取系统状态失败: {e}")
        raise HTTPException(status_code=500, detail=f"获取系统状态失败: {str(e)}")

# ==================== 学习路径相关API ====================

class LearningPathRequest(BaseModel):
    domain: str
    position: str
    skill_level: str = "中级"

class PersonalizedPathRequest(BaseModel):
    domain: str
    position: str
    skill_level: str = "中级"
    session_id: Optional[int] = None
    evaluation_scores: Optional[dict] = None

@app.get("/api/v1/learning-paths/domains/{domain}")
async def get_learning_paths_by_domain(domain: str, position: Optional[str] = None, db: Session = Depends(get_db)):
    """根据技术领域获取学习路径列表"""
    try:
        learning_service = LearningPathService(db)
        paths = learning_service.get_learning_paths_by_domain(domain, position)
        return {
            "success": True,
            "data": paths,
            "message": "获取学习路径成功"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取学习路径失败: {str(e)}")

@app.get("/api/v1/learning-paths/{path_id}")
async def get_learning_path_detail(path_id: int, db: Session = Depends(get_db)):
    """获取学习路径详情"""
    try:
        learning_service = LearningPathService(db)
        path_detail = learning_service.get_learning_path_detail(path_id)

        if not path_detail:
            raise HTTPException(status_code=404, detail="学习路径不存在")

        return {
            "success": True,
            "data": path_detail,
            "message": "获取学习路径详情成功"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取学习路径详情失败: {str(e)}")

@app.post("/api/v1/learning-paths/personalized")
async def generate_personalized_learning_path(request: PersonalizedPathRequest, db: Session = Depends(get_db)):
    """生成个性化学习路径"""
    try:
        learning_service = LearningPathService(db)

        # 如果提供了session_id，尝试获取评估分数
        evaluation_scores = request.evaluation_scores
        if request.session_id and not evaluation_scores:
            try:
                # 获取评估报告
                report = db.query(EvaluationReport).filter(
                    EvaluationReport.session_id == request.session_id
                ).first()

                if report:
                    evaluation_scores = {
                        "professional_knowledge": float(getattr(report, 'professional_knowledge', 0) or 0),
                        "skill_matching": float(getattr(report, 'skill_matching', 0) or 0),
                        "language_expression": float(getattr(report, 'language_expression', 0) or 0),
                        "logical_thinking": float(getattr(report, 'logical_thinking', 0) or 0),
                        "innovation_ability": float(getattr(report, 'innovation_ability', 0) or 0),
                        "stress_resistance": float(getattr(report, 'stress_resistance', 0) or 0)
                    }
            except Exception as e:
                logger.warning(f"获取评估分数失败: {e}")

        # 如果没有评估分数，使用默认值
        if not evaluation_scores:
            evaluation_scores = {
                "professional_knowledge": 50,
                "skill_matching": 50,
                "language_expression": 50,
                "logical_thinking": 50,
                "innovation_ability": 50,
                "stress_resistance": 50
            }

        # 生成个性化学习路径
        personalized_path = learning_service.generate_personalized_path(
            request.domain,
            request.position,
            request.skill_level,
            evaluation_scores
        )

        return {
            "success": True,
            "data": personalized_path,
            "message": "生成个性化学习路径成功"
        }
    except Exception as e:
        logger.error(f"生成个性化学习路径失败: {e}")
        raise HTTPException(status_code=500, detail=f"生成个性化学习路径失败: {str(e)}")

# ==================== 增强学习路径API ====================

class EnhancedSixDimensionScores(BaseModel):
    """六维能力评估分数"""
    technical: float = 75.0
    communication: float = 70.0
    logic: float = 80.0
    problem_solving: float = 75.0
    learning: float = 85.0
    teamwork: float = 70.0

class EnhancedLearningPathRequest(BaseModel):
    """增强学习路径生成请求"""
    domain: str
    position: str
    skill_level: str = "中级"
    path_type: str = "comprehensive"
    six_dimension_scores: Optional[EnhancedSixDimensionScores] = None
    session_id: Optional[str] = None
    preferences: Optional[dict] = None

@app.post("/api/v1/enhanced-learning-paths/personalized")
async def generate_enhanced_personalized_learning_path(request: EnhancedLearningPathRequest, db: Session = Depends(get_db)):
    """生成增强版个性化学习路径"""
    try:
        # 导入增强学习路径服务
        from app.api.v1.enhanced_learning_paths import learning_path_service

        # 转换请求格式
        from app.api.v1.enhanced_learning_paths import LearningPathRequest

        enhanced_request = LearningPathRequest(
            domain=request.domain,
            position=request.position,
            skill_level=request.skill_level,
            path_type=request.path_type,
            six_dimension_scores=request.six_dimension_scores,
            session_id=request.session_id,
            preferences=request.preferences
        )

        # 生成增强学习路径
        enhanced_path = await learning_path_service.generate_personalized_path(enhanced_request)

        return {
            "success": True,
            "data": enhanced_path.dict(),
            "message": "生成增强版个性化学习路径成功"
        }

    except Exception as e:
        logger.error(f"生成增强版学习路径失败: {e}")
        raise HTTPException(status_code=500, detail=f"生成增强版学习路径失败: {str(e)}")

@app.get("/api/v1/enhanced-learning-paths/domains")
async def get_enhanced_learning_domains():
    """获取增强版学习路径可用领域"""
    try:
        from app.api.v1.enhanced_learning_paths import learning_path_service

        return {
            "success": True,
            "data": {
                "domains": list(learning_path_service.domain_data.keys()),
                "path_types": learning_path_service.path_types
            },
            "message": "获取领域信息成功"
        }

    except Exception as e:
        logger.error(f"获取增强版学习领域失败: {e}")
        raise HTTPException(status_code=500, detail=f"获取增强版学习领域失败: {str(e)}")

@app.get("/api/v1/enhanced-learning-paths/resources")
async def get_enhanced_learning_resources(domain: str, skill_level: str = "中级"):
    """获取增强版学习资源"""
    try:
        from app.api.v1.enhanced_learning_paths import learning_path_service

        resources = learning_path_service._get_recommended_resources(domain, skill_level)

        return {
            "success": True,
            "data": resources,
            "message": "获取学习资源成功"
        }

    except Exception as e:
        logger.error(f"获取增强版学习资源失败: {e}")
        raise HTTPException(status_code=500, detail=f"获取增强版学习资源失败: {str(e)}")

# 应用启动事件
@app.on_event("startup")
async def startup_event():
    """应用启动时的初始化"""
    app.state.start_time = time.time()
    logger.info("多模态智能面试评测系统启动完成")
    logger.info(f"启动时间: {datetime.now().isoformat()}")

@app.on_event("shutdown")
async def shutdown_event():
    """应用关闭时的清理"""
    try:
        # 清理iFlytek服务连接
        iflytek_service = get_enhanced_iflytek_service()
        await iflytek_service.close()
        logger.info("iFlytek服务连接已清理")
    except Exception as e:
        logger.error(f"清理iFlytek服务连接失败: {e}")

    logger.info("多模态智能面试评测系统已关闭")

# 应用启动完成
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
