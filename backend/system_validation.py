#!/usr/bin/env python3
"""
系统验证脚本
验证多模态面试评估系统的核心功能
"""

import sys
import os
import asyncio
import logging

# 添加项目路径
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# 配置日志
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

def test_imports():
    """测试模块导入"""
    print("=== 模块导入测试 ===")
    
    try:
        from app.services.iflytek_service import multimodal_service
        print("✓ iFlytek服务导入成功")
        return multimodal_service
    except Exception as e:
        print(f"✗ iFlytek服务导入失败: {e}")
        return None

def test_capability_validator():
    """测试能力验证器"""
    print("\n=== 能力验证器测试 ===")
    
    try:
        from app.core.capability_validator import capability_validator
        print("✓ 能力验证器导入成功")
        
        # 测试验证功能
        test_scores = {
            'professional_knowledge': 85.0,
            'skill_matching': 80.0,
            'language_expression': 90.0,
            'logical_thinking': 85.0,
            'innovation_ability': 75.0,
            'stress_resistance': 80.0
        }
        
        validation_results = capability_validator.validate_capability_scores(
            test_scores, '人工智能', '初级'
        )
        
        print(f"✓ 能力验证完成，验证了 {len(validation_results)} 个指标")
        return True
        
    except Exception as e:
        print(f"✗ 能力验证器测试失败: {e}")
        return False

async def test_multimodal_analysis(service):
    """测试多模态分析"""
    print("\n=== 多模态分析测试 ===")
    
    if not service:
        print("✗ 服务不可用，跳过测试")
        return False
    
    try:
        # 测试健康检查
        health_result = await service.health_check()
        print(f"✓ 健康检查完成，状态: {health_result.get('status', 'unknown')}")
        
        # 测试文本分析
        test_text = "我在机器学习项目中使用了深度学习技术，特别是卷积神经网络和循环神经网络。"
        
        analysis_result = await service.analyze_multimodal_response(
            text_data=test_text,
            question_context="请介绍您的机器学习经验",
            domain="人工智能"
        )
        
        if 'error' not in analysis_result:
            print("✓ 多模态分析成功")
            
            # 检查能力分数
            if 'capability_scores' in analysis_result:
                scores = analysis_result['capability_scores']
                capability_count = len([k for k in scores.keys() if not k.startswith('_')])
                print(f"✓ 生成了 {capability_count} 个能力指标")
                
                # 检查验证信息
                validation_info = scores.get('_validation', {})
                if validation_info.get('validated'):
                    confidence = validation_info.get('overall_confidence', 0)
                    print(f"✓ 能力分数验证通过，置信度: {confidence:.2f}")
                else:
                    reason = validation_info.get('reason', '未知原因')
                    print(f"⚠ 能力分数验证失败: {reason}")
                
                return True
            else:
                print("⚠ 未生成能力分数")
                return False
        else:
            print(f"✗ 多模态分析失败: {analysis_result['error']}")
            return False
            
    except Exception as e:
        print(f"✗ 多模态分析异常: {e}")
        return False

def test_database_models():
    """测试数据库模型"""
    print("\n=== 数据库模型测试 ===")
    
    try:
        from app.models.database import (
            InterviewSession, InterviewResponse, 
            MultimodalAnalysis, EvaluationReport
        )
        print("✓ 数据库模型导入成功")
        
        # 测试模型创建
        session = InterviewSession(
            user_id=1,
            domain="人工智能",
            position="AI工程师",
            status="active"
        )
        print("✓ 面试会话模型创建成功")
        
        return True
        
    except Exception as e:
        print(f"✗ 数据库模型测试失败: {e}")
        return False

def test_api_endpoints():
    """测试API端点"""
    print("\n=== API端点测试 ===")
    
    try:
        from app.main import app
        print("✓ FastAPI应用导入成功")
        
        # 检查路由
        routes = [route.path for route in app.routes]
        key_routes = [
            "/health",
            "/api/v1/health",
            "/api/v1/interview/create",
            "/api/v1/analysis/multimodal"
        ]
        
        missing_routes = [route for route in key_routes if route not in routes]
        if missing_routes:
            print(f"⚠ 缺少路由: {missing_routes}")
        else:
            print("✓ 关键API路由检查通过")
        
        return len(missing_routes) == 0
        
    except Exception as e:
        print(f"✗ API端点测试失败: {e}")
        return False

async def main():
    """主测试函数"""
    print("🚀 多模态面试评估系统验证开始\n")
    
    results = []
    
    # 1. 测试模块导入
    service = test_imports()
    results.append(service is not None)
    
    # 2. 测试能力验证器
    validator_ok = test_capability_validator()
    results.append(validator_ok)
    
    # 3. 测试多模态分析
    analysis_ok = await test_multimodal_analysis(service)
    results.append(analysis_ok)
    
    # 4. 测试数据库模型
    db_ok = test_database_models()
    results.append(db_ok)
    
    # 5. 测试API端点
    api_ok = test_api_endpoints()
    results.append(api_ok)
    
    # 总结
    print("\n" + "="*50)
    print("📊 验证结果总结")
    print("="*50)
    
    test_names = [
        "模块导入",
        "能力验证器", 
        "多模态分析",
        "数据库模型",
        "API端点"
    ]
    
    passed = sum(results)
    total = len(results)
    
    for i, (name, result) in enumerate(zip(test_names, results)):
        status = "✓ 通过" if result else "✗ 失败"
        print(f"{i+1}. {name}: {status}")
    
    print(f"\n总体结果: {passed}/{total} 项测试通过")
    
    if passed == total:
        print("🎉 系统验证完全通过！")
        return 0
    elif passed >= total * 0.8:
        print("⚠ 系统基本可用，但有部分问题需要修复")
        return 1
    else:
        print("❌ 系统存在严重问题，需要修复后再使用")
        return 2

if __name__ == "__main__":
    try:
        exit_code = asyncio.run(main())
        sys.exit(exit_code)
    except KeyboardInterrupt:
        print("\n用户中断验证")
        sys.exit(1)
    except Exception as e:
        print(f"\n验证过程中发生异常: {e}")
        sys.exit(2)
