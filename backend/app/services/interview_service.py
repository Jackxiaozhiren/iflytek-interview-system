"""
面试服务模块
管理面试流程、题目选择、会话状态等
"""
import random
from typing import Dict, Any, List, Optional
from sqlalchemy.orm import Session
from datetime import datetime

from app.models import InterviewSession, InterviewQuestion, InterviewResponse
from app.data.question_bank import get_questions_by_domain_position

class InterviewScenarioService:
    """面试场景服务"""
    
    def __init__(self):
        # 定义各领域的面试流程
        self.interview_flows = {
            "人工智能": {
                "技术岗": {
                    "total_questions": 5,
                    "question_types": ["technical", "scenario", "technical", "scenario", "technical"],
                    "difficulty_progression": ["easy", "medium", "medium", "hard", "hard"]
                },
                "运维测试岗": {
                    "total_questions": 4,
                    "question_types": ["technical", "scenario", "technical", "scenario"],
                    "difficulty_progression": ["easy", "medium", "medium", "hard"]
                },
                "产品岗": {
                    "total_questions": 4,
                    "question_types": ["behavioral", "scenario", "behavioral", "scenario"],
                    "difficulty_progression": ["easy", "medium", "medium", "hard"]
                }
            },
            "大数据": {
                "技术岗": {
                    "total_questions": 5,
                    "question_types": ["technical", "scenario", "technical", "scenario", "technical"],
                    "difficulty_progression": ["easy", "medium", "medium", "hard", "hard"]
                },
                "运维测试岗": {
                    "total_questions": 4,
                    "question_types": ["technical", "scenario", "technical", "scenario"],
                    "difficulty_progression": ["easy", "medium", "medium", "hard"]
                },
                "产品岗": {
                    "total_questions": 4,
                    "question_types": ["behavioral", "scenario", "behavioral", "scenario"],
                    "difficulty_progression": ["easy", "medium", "medium", "hard"]
                }
            },
            "物联网": {
                "技术岗": {
                    "total_questions": 5,
                    "question_types": ["technical", "scenario", "technical", "scenario", "technical"],
                    "difficulty_progression": ["easy", "medium", "medium", "hard", "hard"]
                },
                "运维测试岗": {
                    "total_questions": 4,
                    "question_types": ["technical", "scenario", "technical", "scenario"],
                    "difficulty_progression": ["easy", "medium", "medium", "hard"]
                },
                "产品岗": {
                    "total_questions": 4,
                    "question_types": ["behavioral", "scenario", "behavioral", "scenario"],
                    "difficulty_progression": ["easy", "medium", "medium", "hard"]
                }
            }
        }
    
    def get_interview_flow(self, domain: str, position: str) -> Dict[str, Any]:
        """获取面试流程配置"""
        return self.interview_flows.get(domain, {}).get(position, {
            "total_questions": 4,
            "question_types": ["technical", "scenario", "technical", "scenario"],
            "difficulty_progression": ["easy", "medium", "medium", "hard"]
        })
    
    def select_questions(self, domain: str, position: str, db: Session = None) -> List[Dict[str, Any]]:
        """
        为面试选择题目
        :param domain: 技术领域
        :param position: 岗位类型
        :param db: 数据库会话（可选，如果提供则从数据库获取）
        :return: 选中的题目列表
        """
        flow = self.get_interview_flow(domain, position)
        
        # 从题库获取所有题目
        if db:
            # 从数据库获取（如果数据库已初始化）
            all_questions = db.query(InterviewQuestion).filter(
                InterviewQuestion.domain == domain,
                InterviewQuestion.position == position
            ).all()
            
            questions_by_type_difficulty = {}
            for q in all_questions:
                key = (q.question_type, q.difficulty_level)
                if key not in questions_by_type_difficulty:
                    questions_by_type_difficulty[key] = []
                questions_by_type_difficulty[key].append({
                    "id": q.id,
                    "question": q.question_text,
                    "difficulty": q.difficulty_level,
                    "type": q.question_type,
                    "keywords": q.keywords,
                    "expected_points": q.expected_points
                })
        else:
            # 从内存题库获取
            all_questions = get_questions_by_domain_position(domain, position)
            questions_by_type_difficulty = {}
            for q in all_questions:
                key = (q["type"], q["difficulty"])
                if key not in questions_by_type_difficulty:
                    questions_by_type_difficulty[key] = []
                questions_by_type_difficulty[key].append(q)
        
        # 根据流程选择题目
        selected_questions = []
        question_types = flow["question_types"]
        difficulties = flow["difficulty_progression"]
        
        for i in range(len(question_types)):
            question_type = question_types[i]
            difficulty = difficulties[i]
            
            # 查找匹配的题目
            candidates = questions_by_type_difficulty.get((question_type, difficulty), [])
            
            # 如果没有完全匹配的，尝试同类型不同难度
            if not candidates:
                for (t, d), questions in questions_by_type_difficulty.items():
                    if t == question_type:
                        candidates.extend(questions)
            
            # 如果还是没有，使用任意题目
            if not candidates:
                for questions in questions_by_type_difficulty.values():
                    candidates.extend(questions)
            
            if candidates:
                # 随机选择一个题目，避免重复
                available = [q for q in candidates if q not in selected_questions]
                if available:
                    selected_questions.append(random.choice(available))
                elif candidates:
                    selected_questions.append(random.choice(candidates))
        
        return selected_questions
    
    def create_interview_session(self, domain: str, position: str, db: Session) -> InterviewSession:
        """创建面试会话"""
        # 选择题目
        questions = self.select_questions(domain, position, db)
        
        # 创建会话
        session = InterviewSession(
            domain=domain,
            position=position,
            status="active",
            total_questions=len(questions),
            session_data={
                "questions": questions,
                "current_question_index": 0,
                "start_time": datetime.now().isoformat()
            }
        )
        
        db.add(session)
        db.commit()
        db.refresh(session)
        
        return session
    
    def get_current_question(self, session: InterviewSession) -> Optional[Dict[str, Any]]:
        """获取当前题目"""
        if not session.session_data or "questions" not in session.session_data:
            return None
        
        questions = session.session_data["questions"]
        current_index = session.session_data.get("current_question_index", 0)
        
        if current_index < len(questions):
            return questions[current_index]
        
        return None
    
    def move_to_next_question(self, session: InterviewSession, db: Session) -> bool:
        """移动到下一题"""
        if not session.session_data:
            return False
        
        current_index = session.session_data.get("current_question_index", 0)
        total_questions = len(session.session_data.get("questions", []))
        
        if current_index + 1 < total_questions:
            session.session_data["current_question_index"] = current_index + 1
            db.commit()
            return True
        else:
            # 面试结束
            session.status = "completed"
            session.end_time = datetime.now()
            db.commit()
            return False
    
    def save_response(self, session_id: int, question_text: str, response_text: str, 
                     response_time: float, db: Session) -> InterviewResponse:
        """保存面试回答"""
        response = InterviewResponse(
            session_id=session_id,
            question_text=question_text,
            response_text=response_text,
            response_time=response_time
        )
        
        db.add(response)
        db.commit()
        db.refresh(response)
        
        return response

class InterviewQuestionService:
    """面试题目服务"""
    
    @staticmethod
    def get_question_by_criteria(domain: str, position: str, question_type: str, 
                               difficulty: str, db: Session) -> Optional[InterviewQuestion]:
        """根据条件获取题目"""
        return db.query(InterviewQuestion).filter(
            InterviewQuestion.domain == domain,
            InterviewQuestion.position == position,
            InterviewQuestion.question_type == question_type,
            InterviewQuestion.difficulty_level == difficulty
        ).first()
    
    @staticmethod
    def get_random_question(domain: str, position: str, db: Session) -> Optional[InterviewQuestion]:
        """随机获取题目"""
        questions = db.query(InterviewQuestion).filter(
            InterviewQuestion.domain == domain,
            InterviewQuestion.position == position
        ).all()
        
        return random.choice(questions) if questions else None
    
    @staticmethod
    def search_questions(keyword: str, domain: str = None, position: str = None, 
                        db: Session = None) -> List[InterviewQuestion]:
        """搜索题目"""
        query = db.query(InterviewQuestion)
        
        if domain:
            query = query.filter(InterviewQuestion.domain == domain)
        if position:
            query = query.filter(InterviewQuestion.position == position)
        
        # 在题目文本中搜索关键词
        query = query.filter(InterviewQuestion.question_text.contains(keyword))
        
        return query.all()

# 全局服务实例
interview_scenario_service = InterviewScenarioService()
interview_question_service = InterviewQuestionService()
