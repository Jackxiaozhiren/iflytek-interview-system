"""
面试题库初始化脚本
将题库数据导入数据库
"""
from sqlalchemy.orm import Session
from app.models import SessionLocal, InterviewQuestion
from app.data.question_bank import QUESTION_BANK

def init_question_database():
    """初始化面试题库数据库"""
    db = SessionLocal()
    
    try:
        # 清空现有题目
        db.query(InterviewQuestion).delete()
        
        # 插入新题目
        for domain, positions in QUESTION_BANK.items():
            for position, questions in positions.items():
                for question_data in questions:
                    question = InterviewQuestion(
                        domain=domain,
                        position=position,
                        question_text=question_data["question"],
                        difficulty_level=question_data["difficulty"],
                        question_type=question_data["type"],
                        keywords=question_data["keywords"],
                        expected_points=question_data["expected_points"]
                    )
                    db.add(question)
        
        db.commit()
        print(f"成功初始化面试题库，共导入 {db.query(InterviewQuestion).count()} 道题目")
        
    except Exception as e:
        db.rollback()
        print(f"初始化题库失败: {str(e)}")
    finally:
        db.close()

def get_questions_from_db(domain: str, position: str, db: Session) -> list:
    """从数据库获取题目"""
    questions = db.query(InterviewQuestion).filter(
        InterviewQuestion.domain == domain,
        InterviewQuestion.position == position
    ).all()
    
    return [
        {
            "id": q.id,
            "question": q.question_text,
            "difficulty": q.difficulty_level,
            "type": q.question_type,
            "keywords": q.keywords,
            "expected_points": q.expected_points
        }
        for q in questions
    ]

if __name__ == "__main__":
    init_question_database()
