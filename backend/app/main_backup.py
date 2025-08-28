import os
import json
import asyncio
import base64
import hashlib
import hmac
from urllib.parse import urlencode
import ssl
from datetime import datetime
from time import mktime
from urllib.parse import urlparse
from wsgiref.handlers import format_date_time
import traceback
import functools
import re

from fastapi import FastAPI, HTTPException, Request, Depends, UploadFile, File, Form
import logging
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import numpy as np
from dotenv import load_dotenv
from pathlib import Path
import websocket
from sqlalchemy.orm import Session

# 导入数据库模型和服务
from app.models import get_db, create_tables, InterviewSession, InterviewResponse, MultimodalAnalysis, EvaluationReport
from app.data.question_bank import get_questions_by_domain_position, get_all_domains, get_positions_by_domain
from app.services.iflytek_service import multimodal_service
from app.services.enhanced_multimodal_service import enhanced_multimodal_service

# 配置日志
logger = logging.getLogger(__name__)
from app.services.video_analysis_service import video_analysis_service
from app.services.learning_path_service import LearningPathService
from app.services.text_analysis_service import text_analysis_service
from app.services.interview_service import interview_scenario_service, interview_question_service
from app.services.evaluation_service import evaluation_service
from app.services.enhanced_ai_capability_service import EnhancedAICapabilityService
# from app.services.performance_optimization_service import PerformanceOptimizationService
# from app.services.domain_expansion_service import DomainExpansionService
from app.services.report_generation_service import enhanced_report_service

# from app.services.spark_service import get_spark_response

# --- .env Configuration ---
dotenv_path = Path(__file__).parent.parent / '软件杯.env'
load_dotenv(dotenv_path=dotenv_path)

# --- FastAPI App Setup ---
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:5174", "http://127.0.0.1:5174", "http://localhost:5175", "http://127.0.0.1:5175", "http://localhost:5176", "http://127.0.0.1:5176", "http://localhost:5177", "http://127.0.0.1:5177"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Helper function to clean response ---
def clean_markdown_symbols(text: str) -> str:
    """Removes common markdown symbols for cleaner output."""
    # Remove headers (e.g., ### Title)
    text = re.sub(r'^\s*#+\s*', '', text, flags=re.MULTILINE)
    # Remove bold/italic markers (e.g., **, *)
    text = text.replace('**', '').replace('*', '')
    # Remove list markers (e.g., - , * ) at the beginning of lines
    text = re.sub(r'^\s*[-*]\s+', '', text, flags=re.MULTILINE)
    # Remove horizontal rules (e.g., ---)
    text = re.sub(r'^\s*-{3,}\s*$', '', text, flags=re.MULTILINE)
    return text.strip()

# --- Spark WebSocket Client ---

# Refactored to be thread-safe: No more global state.
# All WebSocket logic is now encapsulated within get_spark_response.
class WsParam:
    def __init__(self, APPID, APIKey, APISecret, gpt_url):
        self.APPID = APPID
        self.APIKey = APIKey
        self.APISecret = APISecret
        self.host = urlparse(gpt_url).netloc
        self.path = urlparse(gpt_url).path
        self.gpt_url = gpt_url

    def create_url(self):
        now = datetime.now()
        date = format_date_time(mktime(now.timetuple()))
        signature_origin = f"host: {self.host}\ndate: {date}\nGET {self.path} HTTP/1.1"
        signature_sha = hmac.new(self.APISecret.encode('utf-8'), signature_origin.encode('utf-8'), digestmod=hashlib.sha256).digest()
        signature_sha_base64 = base64.b64encode(signature_sha).decode(encoding='utf-8')
        authorization_origin = f'api_key="{self.APIKey}", algorithm="hmac-sha256", headers="host date request-line", signature="{signature_sha_base64}"'
        authorization = base64.b64encode(authorization_origin.encode('utf-8')).decode(encoding='utf-8')
        v = {"authorization": authorization, "date": date, "host": self.host}
        url = self.gpt_url + '?' + urlencode(v)
        return url

def gen_params(appid, messages, domain):
    data = {
        "header": {"app_id": appid, "uid": "1234"},
        "parameter": {"chat": {"domain": domain, "temperature": 0.5, "max_tokens": 4096}},
        "payload": {"message": {"text": messages}}
    }
    return data

async def get_spark_response(messages):
    # This function is now completely self-contained and thread-safe.
    
    SPARKAI_URL = os.environ.get("SPARK_WSS_URL")
    SPARKAI_APP_ID = os.environ.get("SPARK_APPID")
    SPARKAI_API_KEY = os.environ.get("SPARK_API_KEY")
    SPARKAI_API_SECRET = os.environ.get("SPARK_API_SECRET")
    SPARKAI_DOMAIN = os.environ.get("SPARK_DOMAIN")

    ws_param = WsParam(SPARKAI_APP_ID, SPARKAI_API_KEY, SPARKAI_API_SECRET, SPARKAI_URL)
    ws_url = ws_param.create_url()

    # --- Closure-based WebSocket handlers ---
    response_parts = []
    ws_closed = asyncio.Event()

    def on_message(ws, message):
        data = json.loads(message)
        try:
            code = data['header']['code']
            if code != 0:
                print(f'请求错误: {code}, {data}')
                if not ws_closed.is_set():
                    ws_closed.set()
            else:
                choices = data["payload"]["choices"]
                status = choices["status"]
                text_chunk = choices["text"][0]

                # FINAL FIX #2: Handle both 'content' and 'reasoning_content'
                if "content" in text_chunk:
                    response_parts.append(text_chunk["content"])
                elif "reasoning_content" in text_chunk:
                    # We now capture reasoning content as well, ensuring no text is lost.
                    response_parts.append(text_chunk["reasoning_content"])

                if status == 2:
                    if not ws_closed.is_set():
                        ws_closed.set()
        except KeyError as e:
            print(f"--- PARSING ERROR: Key not found: {e}")
            print(json.dumps(data, indent=2, ensure_ascii=False))
            if not ws_closed.is_set():
                ws_closed.set()

    def on_error(ws, error):
        print("### WebSocket Error:", error)
        if not ws_closed.is_set():
            ws_closed.set()

    def on_close(ws, close_status_code, close_msg):
        # The 'status == 2' in on_message is the primary signal for completion.
        # This is a fallback to ensure the wait lock is always released.
        if not ws_closed.is_set():
            ws_closed.set()

    def on_open(ws):
        # Note: appid, domain, and messages are passed via the ws object itself
        ws_data = json.dumps(gen_params(appid=ws.appid, messages=ws.messages, domain=ws.domain))
        ws.send(ws_data)

    ws = websocket.WebSocketApp(ws_url, on_message=on_message, on_error=on_error, on_close=on_close, on_open=on_open)
    ws.appid = SPARKAI_APP_ID
    ws.messages = messages
    ws.domain = SPARKAI_DOMAIN
    
    loop = asyncio.get_event_loop()
    run_with_options = functools.partial(ws.run_forever, sslopt={"cert_reqs": ssl.CERT_NONE})
    # Run the blocking WebSocket client in a separate thread
    loop.run_in_executor(None, run_with_options)

    # Wait for the ws_closed event to be set by the callbacks
    await ws_closed.wait()
    
    # Join the collected parts and return
    return "".join(response_parts)

# --- Pydantic Models ---
class InterviewStartRequest(BaseModel):
    domain: str
    position: str

class Message(BaseModel):
    role: str
    content: str

class InterviewNextRequest(BaseModel):
    messages: List[Message]
    domain: str
    position: str

# --- API Endpoints ---
@app.get("/")
async def read_root():
    return {"message": "Backend is running"}

@app.get("/health")
async def simple_health_check():
    """简单健康检查端点"""
    return {"status": "healthy", "message": "Backend is running"}

@app.post("/api/v1/interview/start")
async def start_interview(request: InterviewStartRequest):
    DELIMITER = "THINKING_ENDS_HERE"
    prompt = f"""你现在是一位专业的面试官，正在为一个【{request.domain}】领域的【{request.position}】岗位进行面试。
你的任务是提出第一个面试问题。
你必须严格遵循以下格式，不得有任何偏差：
1.  首先，在这里进行你的详细思考过程。
2.  思考过程结束后，你必须另起一行，只写 `{DELIMITER}` 这个词，它本身单独占一行。
3.  在新的一行，写下你最终的面试问题。

你的回答中必须包含 `{DELIMITER}` 这个分隔符。这是一个强制要求。
"""
    messages = [{"role": "user", "content": prompt}]
    try:
        response_text = await get_spark_response(messages)
        print("--- RAW AI RESPONSE (start_interview) ---")
        print(f"'{response_text}'")
        print("-----------------------------------------")

        if not response_text or response_text.isspace():
             raise HTTPException(status_code=500, detail="从讯飞API未收到有效回复。")

        thinking = "AI未能按预期格式返回内容，正在展示全部回复。"
        question = response_text 

        if DELIMITER in response_text:
            parts = response_text.split(DELIMITER, 1)
            if len(parts) == 2:
                thinking = parts[0].strip()
                question = parts[1].strip()
        
        return {"thinking": thinking, "question": question}
    except Exception as e:
        print("--- GENERAL EXCEPTION IN START_INTERVIEW ---")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"处理讯飞API响应时出错: {e}")

@app.post("/api/v1/interview/next")
async def next_question(request: Request):
    try:
        body = await request.json()
        messages = body.get("messages", [])
        domain = body.get("domain")
        position = body.get("position")
        DELIMITER = "THINKING_ENDS_HERE"

        system_prompt = {
            "role": "system",
            "content": f"""你是一位专业的面试官，为【{domain}】领域的【{position}】岗位进行面试。
你的任务是根据对话历史进行追问或提出下一个问题。
你必须严格遵循以下格式，不得有任何偏差：
1.  首先，在这里进行你的详细思考过程。
2.  思考过程结束后，你必须另起一行，只写 `{DELIMITER}` 这个词，它本身单独占一行。
3.  在新的一行，写下你最终的面试问题。

你的回答中必须包含 `{DELIMITER}` 这个分隔符。这是一个强制要求。
"""
        }
        
        history = [system_prompt]
        for msg in messages:
            if msg.get("role") in ["user", "assistant"]:
                history.append({"role": msg["role"], "content": msg["content"]})

        response_text = await get_spark_response(history)
        print("--- RAW AI RESPONSE (next_question) ---")
        print(f"'{response_text}'")
        print("---------------------------------------")
        if not response_text or response_text.isspace():
            raise HTTPException(status_code=500, detail="从讯飞API未收到有效回复。")

        thinking = "AI未能按预期格式返回内容，正在展示全部回复。"
        question = response_text

        if DELIMITER in response_text:
            parts = response_text.split(DELIMITER, 1)
            if len(parts) == 2:
                thinking = parts[0].strip()
                question = parts[1].strip()

        return {"thinking": thinking, "question": question}
    except Exception as e:
        print("--- GENERAL EXCEPTION IN NEXT_QUESTION ---")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"处理讯飞API响应时出错: {e}")

@app.post("/api/v1/interview/end")
async def end_interview(request: InterviewNextRequest):
    messages = [msg.dict() for msg in request.messages]
    
    # 优化：使用更自然的语言来引导模型进行总结
    messages.append({
        "role": "user",
        "content": "面试结束了，辛苦了。请对我刚才的整体表现做一个简短的、总结性的评价吧。"
    })

    try:
        response_text = await get_spark_response(messages)
        clean_response = clean_markdown_symbols(response_text)
        if not clean_response or clean_response.isspace():
             raise HTTPException(status_code=500, detail="从讯飞API未收到有效回复。")
        return {"question": clean_response}
    except Exception as e:
        print("--- GENERAL EXCEPTION IN END_INTERVIEW ---")
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=f"处理讯飞API响应时出错: {e}")

# 生成面试评估报告
@app.post("/api/v1/interview/generate-report/{session_id}")
async def generate_interview_report(session_id: int, db: Session = Depends(get_db)):
    """生成综合面试评估报告"""
    try:
        report = evaluation_service.generate_comprehensive_report(session_id, db)
        return {"success": True, "report": report}
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"生成报告失败: {str(e)}")

# 获取面试评估报告
@app.get("/api/v1/interview/report/{session_id}")
async def get_interview_report(session_id: int, db: Session = Depends(get_db)):
    """获取已生成的面试评估报告"""
    try:
        report = db.query(EvaluationReport).filter(EvaluationReport.session_id == session_id).first()
        if not report:
            raise HTTPException(status_code=404, detail="报告不存在")

        return {
            "success": True,
            "report": report.report_data,
            "generated_at": report.generated_at.isoformat()
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取报告失败: {str(e)}")

# 初始化增强AI能力评估服务
enhanced_ai_capability_service = EnhancedAICapabilityService()

# 初始化性能优化服务
# performance_service = PerformanceOptimizationService()

# 初始化领域扩展服务
# domain_expansion_service = DomainExpansionService()

# 初始化数据库
@app.on_event("startup")
async def startup_event():
    create_tables()

# 新增API接口

class DomainPositionRequest(BaseModel):
    domain: str
    position: str

class MultimodalAnalysisRequest(BaseModel):
    session_id: int
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

@app.post("/api/v1/questions")
async def get_questions(request: DomainPositionRequest):
    """获取指定领域和岗位的面试题目"""
    questions = get_questions_by_domain_position(request.domain, request.position)
    if not questions:
        raise HTTPException(status_code=404, detail="未找到相关题目")
    return {"questions": questions}

@app.post("/api/v1/interview/session")
async def create_interview_session(request: InterviewStartRequest, db: Session = Depends(get_db)):
    """创建面试会话"""
    try:
        # 使用面试场景服务创建会话
        session = interview_scenario_service.create_interview_session(
            request.domain, request.position, db
        )

        # 获取第一个问题
        first_question = interview_scenario_service.get_current_question(session)

        return {
            "session_id": session.id,
            "message": "面试会话创建成功",
            "first_question": first_question,
            "total_questions": session.total_questions
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"创建会话失败: {str(e)}")

@app.get("/api/v1/interview/session/{session_id}/current-question")
async def get_current_question(session_id: int, db: Session = Depends(get_db)):
    """获取当前题目"""
    session = db.query(InterviewSession).filter(InterviewSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="会话不存在")

    current_question = interview_scenario_service.get_current_question(session)
    if not current_question:
        return {"message": "面试已结束", "finished": True}

    return {
        "question": current_question,
        "current_index": session.session_data.get("current_question_index", 0),
        "total_questions": session.total_questions,
        "finished": False
    }

@app.post("/api/v1/interview/session/{session_id}/next-question")
async def move_to_next_question(session_id: int, db: Session = Depends(get_db)):
    """移动到下一题"""
    session = db.query(InterviewSession).filter(InterviewSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="会话不存在")

    has_next = interview_scenario_service.move_to_next_question(session, db)

    if has_next:
        next_question = interview_scenario_service.get_current_question(session)
        return {
            "has_next": True,
            "question": next_question,
            "current_index": session.session_data.get("current_question_index", 0)
        }
    else:
        return {
            "has_next": False,
            "message": "面试已结束",
            "session_status": "completed"
        }

@app.post("/api/v1/analysis/multimodal")
async def analyze_multimodal_response(request: MultimodalAnalysisRequest, db: Session = Depends(get_db)):
    """增强版多模态分析接口"""
    try:
        # 获取会话信息
        session = db.query(InterviewSession).filter(InterviewSession.id == request.session_id).first()
        if not session:
            raise HTTPException(status_code=404, detail="面试会话不存在")

        # 准备分析数据
        text_data = request.text_data
        audio_data = None
        video_data = None

        # 处理音频数据
        if request.audio_data:
            try:
                audio_data = base64.b64decode(request.audio_data)
            except Exception as e:
                print(f"音频数据解码失败: {e}")

        # 处理视频数据
        if request.video_data:
            try:
                video_data = base64.b64decode(request.video_data)
            except Exception as e:
                print(f"视频数据解码失败: {e}")

        # 使用增强版多模态分析服务
        analysis_result = await multimodal_service.analyze_multimodal_response(
            text_data=text_data,
            audio_data=audio_data,
            video_data=video_data,
            question_context=request.question_text,
            domain=getattr(session, 'domain', None)
        )

        # 保存分析结果到数据库
        try:
            multimodal_analysis = MultimodalAnalysis(
                response_id=request.session_id,  # 这里应该是response_id，但为了兼容暂时使用session_id
                speech_clarity=analysis_result.get("capability_scores", {}).get("language_expression", 0.0),
                emotion_score=analysis_result.get("individual_analyses", {}).get("audio_analysis", {}).get("emotion_analysis", {}).get("overall_emotion_score", 0.0),
                eye_contact_score=analysis_result.get("individual_analyses", {}).get("video_analysis", {}).get("eye_contact_analysis", {}).get("eye_contact_score", 0.0),
                facial_expression_score=analysis_result.get("individual_analyses", {}).get("video_analysis", {}).get("facial_analysis", {}).get("expression_score", 0.0),
                posture_score=analysis_result.get("individual_analyses", {}).get("video_analysis", {}).get("posture_analysis", {}).get("posture_score", 0.0),
                text_coherence_score=analysis_result.get("capability_scores", {}).get("logical_thinking", 0.0),
                technical_accuracy_score=analysis_result.get("capability_scores", {}).get("professional_knowledge", 0.0),
                overall_confidence_score=analysis_result.get("overall_assessment", {}).get("overall_score", 0.0),
                analysis_data=analysis_result
            )

            db.add(multimodal_analysis)
            db.commit()
        except Exception as e:
            print(f"数据库保存失败: {e}")
            # 即使数据库保存失败，也返回分析结果

        # 返回增强版分析结果
        return {
            "success": True,
            "analysis_results": analysis_result,
            "message": "多模态分析完成"
        }

    except Exception as e:
        print(f"多模态分析失败: {e}")
        raise HTTPException(status_code=500, detail=f"多模态分析失败: {str(e)}")

@app.get("/api/v1/interview/session/{session_id}")
async def get_interview_session(session_id: int, db: Session = Depends(get_db)):
    """获取面试会话信息"""
    session = db.query(InterviewSession).filter(InterviewSession.id == session_id).first()
    if not session:
        raise HTTPException(status_code=404, detail="会话不存在")

    return {
        "session_id": session.id,
        "domain": session.domain,
        "position": session.position,
        "status": session.status,
        "start_time": session.start_time,
        "end_time": session.end_time,
        "total_questions": session.total_questions
    }


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

        # 如果提供了session_id，从评估报告中获取分数
        evaluation_scores = request.evaluation_scores
        if request.session_id and not evaluation_scores:
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
        raise HTTPException(status_code=500, detail=f"生成个性化学习路径失败: {str(e)}")

@app.get("/api/v1/learning-paths/recommendations/{session_id}")
async def get_learning_path_recommendations(session_id: int, db: Session = Depends(get_db)):
    """基于面试评估结果推荐学习路径"""
    try:
        # 获取面试会话信息
        session = db.query(InterviewSession).filter(InterviewSession.id == session_id).first()
        if not session:
            raise HTTPException(status_code=404, detail="面试会话不存在")

        # 获取评估报告
        report = db.query(EvaluationReport).filter(
            EvaluationReport.session_id == session_id
        ).first()

        if not report:
            raise HTTPException(status_code=404, detail="评估报告不存在")

        # 生成推荐学习路径
        learning_service = LearningPathService(db)
        evaluation_scores = {
            "professional_knowledge": float(getattr(report, 'professional_knowledge', 0) or 0),
            "skill_matching": float(getattr(report, 'skill_matching', 0) or 0),
            "language_expression": float(getattr(report, 'language_expression', 0) or 0),
            "logical_thinking": float(getattr(report, 'logical_thinking', 0) or 0),
            "innovation_ability": float(getattr(report, 'innovation_ability', 0) or 0),
            "stress_resistance": float(getattr(report, 'stress_resistance', 0) or 0)
        }

        # 根据分数确定技能水平
        avg_score = sum(evaluation_scores.values()) / len(evaluation_scores)
        if avg_score >= 80:
            skill_level = "高级"
        elif avg_score >= 60:
            skill_level = "中级"
        else:
            skill_level = "初级"

        personalized_path = learning_service.generate_personalized_path(
            str(getattr(session, 'domain', '')),
            str(getattr(session, 'position', '')),
            skill_level,
            evaluation_scores
        )

        return {
            "success": True,
            "data": {
                "session_info": {
                    "session_id": getattr(session, 'id', 0),
                    "domain": str(getattr(session, 'domain', '')),
                    "position": str(getattr(session, 'position', '')),
                    "overall_score": float(getattr(report, 'overall_score', 0) or 0)
                },
                "skill_level": skill_level,
                "learning_path": personalized_path,
                "weak_areas": learning_service._identify_weak_areas(evaluation_scores)
            },
            "message": "获取学习路径推荐成功"
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取学习路径推荐失败: {str(e)}")

# 系统健康检查和监控端点
@app.get("/api/v1/health")
async def health_check():
    """系统健康检查"""
    try:
        # 检查数据库连接
        db_status = "ok"
        try:
            db = next(get_db())
            # 使用text()来执行原生SQL
            from sqlalchemy import text
            db.execute(text("SELECT 1"))
            db.close()
        except Exception as e:
            db_status = f"error: {str(e)}"

        # 检查iFlytek服务状态
        iflytek_status = "ok"
        try:
            health_result = await multimodal_service.health_check()
            iflytek_status = health_result.get("status", "unknown")
        except Exception as e:
            iflytek_status = f"error: {str(e)}"

        # 整体状态评估
        overall_status = "healthy" if all([
            db_status == "ok",
            iflytek_status in ["healthy", "ok"]
        ]) else "degraded"

        return {
            "status": overall_status,
            "timestamp": datetime.now().isoformat(),
            "services": {
                "database": db_status,
                "iflytek": iflytek_status
            },
            "version": "1.0.0"
        }

    except Exception as e:
        return {
            "status": "unhealthy",
            "timestamp": datetime.now().isoformat(),
            "error": str(e),
            "version": "1.0.0"
        }

@app.get("/api/v1/system/stats")
async def get_system_stats():
    """获取系统统计信息"""
    try:
        # 获取iFlytek服务统计
        iflytek_stats = {}
        try:
            health_result = await multimodal_service.health_check()
            iflytek_stats = health_result.get("performance_stats", {})
        except Exception as e:
            iflytek_stats = {"error": str(e)}

        # 获取数据库统计
        db_stats = {}
        try:
            db = next(get_db())

            # 统计各种数据
            session_count = db.query(InterviewSession).count()
            response_count = db.query(InterviewResponse).count()
            analysis_count = db.query(MultimodalAnalysis).count()
            report_count = db.query(EvaluationReport).count()

            db_stats = {
                "total_sessions": session_count,
                "total_responses": response_count,
                "total_analyses": analysis_count,
                "total_reports": report_count
            }

            db.close()

        except Exception as e:
            db_stats = {"error": str(e)}

        return {
            "success": True,
            "data": {
                "iflytek_service": iflytek_stats,
                "database": db_stats,
                "timestamp": datetime.now().isoformat()
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取系统统计失败: {str(e)}")

@app.get("/api/v1/system/performance")
async def get_performance_metrics():
    """获取性能指标"""
    try:
        # 获取iFlytek连接管理器统计
        connection_stats = {}
        try:
            # 这里需要导入连接管理器
            # connection_stats = connection_manager.get_stats()
            connection_stats = {"status": "not_available"}
        except Exception as e:
            connection_stats = {"error": str(e)}

        # 获取多模态服务性能统计
        service_stats = {}
        try:
            health_result = await multimodal_service.health_check()
            service_stats = health_result.get("performance_stats", {})
        except Exception as e:
            service_stats = {"error": str(e)}

        return {
            "success": True,
            "data": {
                "connection_manager": connection_stats,
                "multimodal_service": service_stats,
                "timestamp": datetime.now().isoformat()
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"获取性能指标失败: {str(e)}")

@app.post("/api/v1/multimodal/analyze-enhanced")
async def analyze_multimodal_enhanced(
    text_data: Optional[str] = Form(None),
    audio_file: Optional[UploadFile] = File(None),
    video_file: Optional[UploadFile] = File(None),
    question_context: Optional[str] = Form(None),
    domain: Optional[str] = Form(None),
    session_id: Optional[str] = Form(None)
):
    """增强多模态分析接口"""
    try:
        logger.info(f"开始增强多模态分析: session_id={session_id}, domain={domain}")

        # 处理音频数据
        audio_data = None
        if audio_file:
            audio_data = await audio_file.read()
            logger.info(f"接收音频文件: {audio_file.filename}, 大小: {len(audio_data)} bytes")

        # 处理视频数据
        video_data = None
        if video_file:
            video_data = await video_file.read()
            logger.info(f"接收视频文件: {video_file.filename}, 大小: {len(video_data)} bytes")

        # 调用增强多模态分析服务
        result = await enhanced_multimodal_service.analyze_comprehensive(
            text_data=text_data,
            audio_data=audio_data,
            video_data=video_data,
            question_context=question_context,
            domain=domain,
            session_id=session_id
        )

        logger.info(f"增强多模态分析完成: {result.get('analysis_id', 'unknown')}")
        return {"success": True, "data": result}

    except Exception as e:
        logger.error(f"增强多模态分析失败: {e}")
        raise HTTPException(status_code=500, detail=f"增强多模态分析失败: {str(e)}")

@app.get("/api/v1/multimodal/performance")
async def get_multimodal_performance():
    """获取增强多模态服务性能指标"""
    try:
        performance_metrics = await enhanced_multimodal_service.get_performance_metrics()
        return {"success": True, "data": performance_metrics}
    except Exception as e:
        logger.error(f"获取性能指标失败: {e}")
        raise HTTPException(status_code=500, detail=f"获取性能指标失败: {str(e)}")

# 增强AI能力评估API
class EnhancedCapabilityRequest(BaseModel):
    text_data: Optional[str] = None
    audio_analysis: Optional[dict] = None
    video_analysis: Optional[dict] = None
    question_context: Optional[str] = None
    domain: str = "人工智能"
    position: str = "AI工程师"

@app.post("/api/v1/analysis/enhanced-capability")
async def enhanced_capability_assessment(request: EnhancedCapabilityRequest):
    """增强版6项核心能力评估"""
    try:
        logger.info(f"开始增强版能力评估 - 领域: {request.domain}, 职位: {request.position}")

        result = await enhanced_ai_capability_service.enhanced_capability_assessment(
            text_data=request.text_data,
            audio_analysis=request.audio_analysis,
            video_analysis=request.video_analysis,
            question_context=request.question_context,
            domain=request.domain,
            position=request.position
        )

        return {
            "success": True,
            "data": result,
            "message": "增强版能力评估完成"
        }

    except Exception as e:
        logger.error(f"增强版能力评估失败: {e}")
        raise HTTPException(status_code=500, detail=f"增强版能力评估失败: {str(e)}")

@app.get("/api/v1/analysis/capability-history")
async def get_capability_assessment_history():
    """获取能力评估历史记录"""
    try:
        history = enhanced_ai_capability_service.evaluation_history
        return {
            "success": True,
            "data": {
                "total_assessments": len(history),
                "recent_assessments": history[-10:] if len(history) > 10 else history
            },
            "message": "获取评估历史成功"
        }
    except Exception as e:
        logger.error(f"获取评估历史失败: {e}")
        raise HTTPException(status_code=500, detail=f"获取评估历史失败: {str(e)}")

# 性能优化API - 暂时注释掉，等待修复依赖问题
# 所有有问题的API端点已暂时移除，等待依赖修复后重新添加

# 应用启动完成
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
async def get_performance_report():
    """获取性能分析报告"""
    try:
        report = await performance_service.get_performance_report()
        return {
            "success": True,
            "data": report,
            "message": "性能报告生成成功"
        }
    except Exception as e:
        logger.error(f"生成性能报告失败: {e}")
        raise HTTPException(status_code=500, detail=f"生成性能报告失败: {str(e)}")

@app.post("/api/v1/performance/optimize/database")
async def optimize_database():
    """优化数据库性能"""
    try:
        result = await performance_service.optimize_database_performance()
        return {
            "success": True,
            "data": result,
            "message": "数据库优化完成"
        }
    except Exception as e:
        logger.error(f"数据库优化失败: {e}")
        raise HTTPException(status_code=500, detail=f"数据库优化失败: {str(e)}")

@app.post("/api/v1/performance/optimize/memory")
async def optimize_memory():
    """优化内存使用"""
    try:
        result = await performance_service.optimize_memory_usage()
        return {
            "success": True,
            "data": result,
            "message": "内存优化完成"
        }
    except Exception as e:
        logger.error(f"内存优化失败: {e}")
        raise HTTPException(status_code=500, detail=f"内存优化失败: {str(e)}")

class PerformanceTrackingRequest(BaseModel):
    request_id: str
    action: str  # 'start' or 'end'
    success: Optional[bool] = True

@app.post("/api/v1/performance/track")
async def track_request_performance(request: PerformanceTrackingRequest):
    """跟踪请求性能"""
    try:
        if request.action == 'start':
            start_time = performance_service.track_request_start(request.request_id)
            return {
                "success": True,
                "data": {"start_time": start_time},
                "message": "开始跟踪请求"
            }
        elif request.action == 'end':
            # 这里需要从某个地方获取开始时间，简化处理
            import time
            performance_service.track_request_end(request.request_id, time.time() - 1, request.success)
            return {
                "success": True,
                "message": "请求跟踪结束"
            }
        else:
            raise HTTPException(status_code=400, detail="无效的action参数")
    except Exception as e:
        logger.error(f"性能跟踪失败: {e}")
        raise HTTPException(status_code=500, detail=f"性能跟踪失败: {str(e)}")

@app.get("/api/v1/performance/cache/stats")
async def get_cache_stats():
    """获取缓存统计信息"""
    try:
        cache_metrics = performance_service._get_cache_metrics()
        return {
            "success": True,
            "data": cache_metrics,
            "message": "缓存统计获取成功"
        }
    except Exception as e:
        logger.error(f"获取缓存统计失败: {e}")
        raise HTTPException(status_code=500, detail=f"获取缓存统计失败: {str(e)}")

@app.post("/api/v1/performance/cache/clear")
async def clear_cache():
    """清理缓存"""
    try:
        result = performance_service._cleanup_expired_cache()
        return {
            "success": True,
            "data": result,
            "message": "缓存清理完成"
        }
    except Exception as e:
        logger.error(f"缓存清理失败: {e}")
        raise HTTPException(status_code=500, detail=f"缓存清理失败: {str(e)}")

# 技术领域扩展API
@app.get("/api/v1/domains")
async def get_all_domains():
    """获取所有技术领域"""
    try:
        result = domain_expansion_service.get_all_domains()
        return result
    except Exception as e:
        logger.error(f"获取技术领域失败: {e}")
        raise HTTPException(status_code=500, detail=f"获取技术领域失败: {str(e)}")

@app.get("/api/v1/domains/{domain_id}")
async def get_domain_by_id(domain_id: str):
    """根据ID获取技术领域"""
    try:
        result = domain_expansion_service.get_domain_by_id(domain_id)
        if not result["success"]:
            raise HTTPException(status_code=404, detail=result["error"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"获取技术领域失败: {e}")
        raise HTTPException(status_code=500, detail=f"获取技术领域失败: {str(e)}")

class NewDomainRequest(BaseModel):
    id: str
    name: str
    description: str
    icon: str
    color: str
    core_skills: List[Dict[str, Any]] = []
    interview_questions: List[Dict[str, Any]] = []
    career_paths: List[str] = []
    salary_range: Dict[str, int] = {}
    market_demand: int = 5
    growth_trend: str = "stable"

@app.post("/api/v1/domains")
async def add_new_domain(request: NewDomainRequest):
    """添加新的技术领域"""
    try:
        result = domain_expansion_service.add_new_domain(request.dict())
        if not result["success"]:
            raise HTTPException(status_code=400, detail=result["error"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"添加技术领域失败: {e}")
        raise HTTPException(status_code=500, detail=f"添加技术领域失败: {str(e)}")

@app.get("/api/v1/domains/templates")
async def get_domain_templates():
    """获取领域模板"""
    try:
        result = domain_expansion_service.get_domain_templates()
        return result
    except Exception as e:
        logger.error(f"获取领域模板失败: {e}")
        raise HTTPException(status_code=500, detail=f"获取领域模板失败: {str(e)}")

class CreateFromTemplateRequest(BaseModel):
    template_id: str
    custom_data: Dict[str, Any]

@app.post("/api/v1/domains/from-template")
async def create_domain_from_template(request: CreateFromTemplateRequest):
    """从模板创建技术领域"""
    try:
        result = domain_expansion_service.create_domain_from_template(
            request.template_id, request.custom_data
        )
        if not result["success"]:
            raise HTTPException(status_code=400, detail=result["error"])
        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"从模板创建领域失败: {e}")
        raise HTTPException(status_code=500, detail=f"从模板创建领域失败: {str(e)}")

# 增强报告生成API
class ComprehensiveReportRequest(BaseModel):
    session_id: str
    export_format: str = "html"
    include_charts: bool = True

@app.post("/api/v1/reports/comprehensive")
async def generate_comprehensive_report(request: ComprehensiveReportRequest):
    """生成综合评估报告"""
    try:
        # 获取会话数据和分析结果（这里需要从数据库获取）
        session_data = {"session_id": request.session_id, "candidate_name": "测试候选人"}
        analysis_results = {
            "capability_scores": {
                "专业知识": 0.85,
                "技能匹配": 0.78,
                "语言表达": 0.82,
                "逻辑思维": 0.88,
                "创新能力": 0.75,
                "抗压能力": 0.80
            }
        }

        result = await enhanced_report_service.generate_comprehensive_report(
            session_data, analysis_results, request.export_format
        )

        if not result["success"]:
            raise HTTPException(status_code=500, detail=result["error"])

        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"生成综合报告失败: {e}")
        raise HTTPException(status_code=500, detail=f"生成综合报告失败: {str(e)}")

class ComparisonReportRequest(BaseModel):
    session_ids: List[str]
    export_format: str = "html"

@app.post("/api/v1/reports/comparison")
async def generate_comparison_report(request: ComparisonReportRequest):
    """生成对比报告"""
    try:
        if len(request.session_ids) < 2:
            raise HTTPException(status_code=400, detail="对比报告至少需要2个会话")

        # 模拟分析结果数据
        analysis_results = []
        for session_id in request.session_ids:
            analysis_results.append({
                "capability_scores": {
                    "专业知识": np.random.uniform(0.6, 0.9),
                    "技能匹配": np.random.uniform(0.6, 0.9),
                    "语言表达": np.random.uniform(0.6, 0.9),
                    "逻辑思维": np.random.uniform(0.6, 0.9),
                    "创新能力": np.random.uniform(0.6, 0.9),
                    "抗压能力": np.random.uniform(0.6, 0.9)
                }
            })

        result = await enhanced_report_service.generate_comparison_report(
            request.session_ids, analysis_results
        )

        if not result["success"]:
            raise HTTPException(status_code=500, detail=result["error"])

        return result
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"生成对比报告失败: {e}")
        raise HTTPException(status_code=500, detail=f"生成对比报告失败: {str(e)}")
