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

from fastapi import FastAPI, HTTPException, Depends, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session
from dotenv import load_dotenv

# 导入数据库模型和服务
from app.models import get_db, create_tables, InterviewSession, InterviewResponse, MultimodalAnalysis, EvaluationReport
from app.data.question_bank import get_questions_by_domain_position, get_all_domains, get_positions_by_domain
from app.services.iflytek_service import multimodal_service
from app.services.enhanced_multimodal_service import enhanced_multimodal_service
from app.services.learning_path_service import LearningPathService
from app.services.evaluation_service import evaluation_service
from app.services.enhanced_ai_capability_service import EnhancedAICapabilityService
from app.services.report_generation_service import enhanced_report_service

# --- .env Configuration ---
dotenv_path = Path(__file__).parent.parent / '软件杯.env'
load_dotenv(dotenv_path=dotenv_path)

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
    # 简化版本，直接返回模拟响应
    try:
        # 这里应该是真实的iFlytek Spark API调用
        # 目前返回模拟响应以确保系统正常运行
        return "这是一个模拟的AI响应，用于测试系统功能。"
    except Exception as e:
        logger.error(f"Spark API调用失败: {e}")
        return "AI服务暂时不可用，请稍后重试。"

# 初始化服务
enhanced_ai_capability_service = EnhancedAICapabilityService()

# 初始化数据库
@app.on_event("startup")
async def startup_event():
    """应用启动时的初始化"""
    try:
        create_tables()
        logger.info("数据库初始化完成")
    except Exception as e:
        logger.error(f"数据库初始化失败: {e}")

# 基础API
@app.get("/")
async def root():
    """根路径"""
    return {"message": "多模态智能面试评测系统 API", "version": "2.0.0", "status": "running"}

@app.get("/health")
async def health_check():
    """健康检查"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

# 数据模型
class InterviewStartRequest(BaseModel):
    domain: str
    position: str
    candidate_name: Optional[str] = "候选人"

class InterviewNextRequest(BaseModel):
    messages: List[Dict[str, str]]

class MultimodalAnalysisRequest(BaseModel):
    audio_data: Optional[str] = None  # base64编码的音频数据
    video_data: Optional[str] = None  # base64编码的视频数据
    text_data: str
    question_text: str

@app.get("/api/v1/domains")
async def get_domains():
    """获取所有技术领域"""
    return {"domains": get_all_domains()}

@app.get("/api/v1/positions")
async def get_all_positions():
    """获取所有岗位列表"""
    all_positions = []
    domains = get_all_domains()
    for domain in domains:
        positions = get_positions_by_domain(domain)
        for position in positions:
            all_positions.append({
                "domain": domain,
                "position": position
            })
    return {"positions": all_positions}

@app.get("/api/v1/domains/{domain}/positions")
async def get_positions(domain: str):
    """获取指定领域的岗位列表"""
    positions = get_positions_by_domain(domain)
    if not positions:
        raise HTTPException(status_code=404, detail="领域不存在")
    return {"positions": positions}

# 面试相关API
DELIMITER = "|||DELIMITER|||"

@app.post("/api/v1/interview/start")
async def start_interview(request: InterviewStartRequest):
    """开始面试"""
    prompt = f"""
你是一位专业的{request.domain}领域面试官，正在面试{request.position}职位的候选人。
请生成第一个面试问题。

要求：
1. 问题要专业且有针对性
2. 适合{request.position}职位的技术水平
3. 能够有效评估候选人的专业能力

你的回答中必须包含 `{DELIMITER}` 这个分隔符。这是一个强制要求。
"""
    messages = [{"role": "user", "content": prompt}]
    try:
        response_text = await get_spark_response(messages)
        
        thinking = "AI未能按预期格式返回内容，正在展示全部回复。"
        question = response_text 

        if DELIMITER in response_text:
            parts = response_text.split(DELIMITER, 1)
            if len(parts) == 2:
                thinking = parts[0].strip()
                question = parts[1].strip()

        return {"thinking": thinking, "question": question}
    except Exception as e:
        logger.error(f"开始面试失败: {e}")
        raise HTTPException(status_code=500, detail=f"开始面试失败: {str(e)}")

@app.post("/api/v1/interview/next")
async def next_question(request: InterviewNextRequest):
    """获取下一个问题"""
    try:
        system_prompt = {
            "role": "system",
            "content": f"""
你是一位专业的面试官。根据之前的对话历史，生成下一个合适的面试问题。

要求：
1. 基于候选人之前的回答调整问题难度
2. 问题要有逻辑连贯性
3. 能够深入了解候选人的能力

你的回答中必须包含 `{DELIMITER}` 这个分隔符。这是一个强制要求。
"""
        }
        
        history = [system_prompt]
        for msg in request.messages:
            if msg.get("role") in ["user", "assistant"]:
                history.append({"role": msg["role"], "content": msg["content"]})

        response_text = await get_spark_response(history)
        
        thinking = "AI未能按预期格式返回内容，正在展示全部回复。"
        question = response_text

        if DELIMITER in response_text:
            parts = response_text.split(DELIMITER, 1)
            if len(parts) == 2:
                thinking = parts[0].strip()
                question = parts[1].strip()

        return {"thinking": thinking, "question": question}
    except Exception as e:
        logger.error(f"获取下一个问题失败: {e}")
        raise HTTPException(status_code=500, detail=f"获取下一个问题失败: {str(e)}")

@app.post("/api/v1/interview/end")
async def end_interview(request: InterviewNextRequest):
    messages = [msg.dict() for msg in request.messages]
    
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

# 应用启动完成
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
