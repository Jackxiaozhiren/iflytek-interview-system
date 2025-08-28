"""
系统集成测试
验证多模态面试评估系统的整体功能
"""

import pytest
import asyncio
import json
import base64
from typing import Dict, Any
from fastapi.testclient import TestClient
import sys
import os

# 添加项目根目录到路径
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app
from app.services.iflytek_service import multimodal_service
from app.core.capability_validator import capability_validator

class TestSystemIntegration:
    """系统集成测试类"""
    
    def setup_method(self):
        """测试前设置"""
        self.client = TestClient(app)
        self.test_data = self._prepare_test_data()
    
    def _prepare_test_data(self) -> Dict[str, Any]:
        """准备测试数据"""
        return {
            "ai_domain_test": {
                "text_response": "我在机器学习项目中使用了深度学习技术，特别是卷积神经网络和循环神经网络。在数据预处理阶段，我使用了特征工程和数据增强技术。模型训练过程中，我采用了Adam优化器和学习率调度策略。最终模型在测试集上达到了95%的准确率。",
                "domain": "人工智能",
                "position": "AI工程师",
                "expected_scores": {
                    "professional_knowledge": 85.0,
                    "skill_matching": 80.0,
                    "language_expression": 90.0,
                    "logical_thinking": 85.0,
                    "innovation_ability": 75.0,
                    "stress_resistance": 80.0
                }
            },
            "bigdata_domain_test": {
                "text_response": "在大数据项目中，我使用Hadoop生态系统进行数据存储和处理。通过Spark进行分布式计算，使用Hive进行数据仓库管理。在数据分析阶段，我运用了统计学方法和机器学习算法，包括聚类分析和回归分析。项目处理了TB级别的数据，显著提升了业务决策效率。",
                "domain": "大数据",
                "position": "数据工程师",
                "expected_scores": {
                    "professional_knowledge": 80.0,
                    "skill_matching": 85.0,
                    "language_expression": 85.0,
                    "logical_thinking": 90.0,
                    "innovation_ability": 70.0,
                    "stress_resistance": 75.0
                }
            },
            "iot_domain_test": {
                "text_response": "在物联网项目中，我负责传感器数据采集和边缘计算实现。使用MQTT协议进行设备通信，通过LoRa技术实现长距离低功耗传输。在云平台集成方面，我使用了AWS IoT Core和阿里云物联网平台。项目实现了实时监控和预警功能，大大提高了设备管理效率。",
                "domain": "物联网",
                "position": "IoT工程师",
                "expected_scores": {
                    "professional_knowledge": 75.0,
                    "skill_matching": 80.0,
                    "language_expression": 80.0,
                    "logical_thinking": 80.0,
                    "innovation_ability": 85.0,
                    "stress_resistance": 75.0
                }
            }
        }
    
    def test_health_check(self):
        """测试健康检查端点"""
        response = self.client.get("/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert "message" in data
    
    def test_detailed_health_check(self):
        """测试详细健康检查端点"""
        response = self.client.get("/api/v1/health")
        assert response.status_code == 200
        data = response.json()
        assert "status" in data
        assert "services" in data
        assert "timestamp" in data
    
    def test_system_stats(self):
        """测试系统统计端点"""
        response = self.client.get("/api/v1/system/stats")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "data" in data
        assert "iflytek_service" in data["data"]
        assert "database" in data["data"]
    
    def test_performance_metrics(self):
        """测试性能指标端点"""
        response = self.client.get("/api/v1/system/performance")
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "data" in data
    
    def test_create_interview_session(self):
        """测试创建面试会话"""
        session_data = {
            "user_name": "测试用户",
            "domain": "人工智能",
            "position": "AI工程师",
            "difficulty": "中等"
        }
        
        response = self.client.post("/api/v1/interview/create", json=session_data)
        assert response.status_code == 200
        data = response.json()
        assert "session_id" in data
        assert data["domain"] == "人工智能"
        assert data["position"] == "AI工程师"
        
        return data["session_id"]
    
    def test_multimodal_analysis_ai_domain(self):
        """测试AI领域的多模态分析"""
        session_id = self.test_create_interview_session()
        test_case = self.test_data["ai_domain_test"]
        
        analysis_request = {
            "session_id": session_id,
            "question_text": "请介绍您在机器学习项目中的经验",
            "text_data": test_case["text_response"]
        }
        
        response = self.client.post("/api/v1/analysis/multimodal", json=analysis_request)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        assert "analysis_results" in data
        
        # 验证分析结果结构
        analysis_results = data["analysis_results"]
        assert "capability_scores" in analysis_results
        assert "overall_assessment" in analysis_results
        
        # 验证6个核心能力指标
        capability_scores = analysis_results["capability_scores"]
        expected_capabilities = [
            "professional_knowledge", "skill_matching", "language_expression",
            "logical_thinking", "innovation_ability", "stress_resistance"
        ]
        
        for capability in expected_capabilities:
            assert capability in capability_scores
            score = capability_scores[capability]
            assert 0 <= score <= 100, f"{capability} 分数 {score} 超出有效范围"
        
        return analysis_results
    
    def test_multimodal_analysis_bigdata_domain(self):
        """测试大数据领域的多模态分析"""
        # 创建大数据领域的会话
        session_data = {
            "user_name": "测试用户",
            "domain": "大数据",
            "position": "数据工程师",
            "difficulty": "中等"
        }
        
        response = self.client.post("/api/v1/interview/create", json=session_data)
        session_id = response.json()["session_id"]
        
        test_case = self.test_data["bigdata_domain_test"]
        
        analysis_request = {
            "session_id": session_id,
            "question_text": "请描述您在大数据项目中的技术实现",
            "text_data": test_case["text_response"]
        }
        
        response = self.client.post("/api/v1/analysis/multimodal", json=analysis_request)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        
        return data["analysis_results"]
    
    def test_multimodal_analysis_iot_domain(self):
        """测试物联网领域的多模态分析"""
        # 创建物联网领域的会话
        session_data = {
            "user_name": "测试用户",
            "domain": "物联网",
            "position": "IoT工程师",
            "difficulty": "中等"
        }
        
        response = self.client.post("/api/v1/interview/create", json=session_data)
        session_id = response.json()["session_id"]
        
        test_case = self.test_data["iot_domain_test"]
        
        analysis_request = {
            "session_id": session_id,
            "question_text": "请介绍您在物联网项目中的技术方案",
            "text_data": test_case["text_response"]
        }
        
        response = self.client.post("/api/v1/analysis/multimodal", json=analysis_request)
        assert response.status_code == 200
        data = response.json()
        assert data["success"] is True
        
        return data["analysis_results"]
    
    @pytest.mark.asyncio
    async def test_capability_validation(self):
        """测试能力指标验证功能"""
        # 测试AI领域
        ai_results = self.test_multimodal_analysis_ai_domain()
        capability_scores = ai_results["capability_scores"]
        
        # 移除验证信息进行独立验证
        scores_to_validate = {k: v for k, v in capability_scores.items() if not k.startswith("_")}
        
        validation_results = capability_validator.validate_capability_scores(
            scores_to_validate, "人工智能", "初级"
        )
        
        assert "overall" in validation_results
        overall_result = validation_results["overall"]
        assert hasattr(overall_result, 'confidence')
        assert overall_result.confidence > 0.5, "验证置信度过低"
    
    def test_cross_domain_consistency(self):
        """测试跨领域评估一致性"""
        ai_results = self.test_multimodal_analysis_ai_domain()
        bigdata_results = self.test_multimodal_analysis_bigdata_domain()
        iot_results = self.test_multimodal_analysis_iot_domain()
        
        # 检查评估结果的一致性
        all_results = [ai_results, bigdata_results, iot_results]
        
        for result in all_results:
            assert "capability_scores" in result
            assert "overall_assessment" in result
            
            # 检查分数范围
            capability_scores = result["capability_scores"]
            for capability, score in capability_scores.items():
                if not capability.startswith("_"):
                    assert 0 <= score <= 100, f"分数 {score} 超出范围"
    
    def test_report_generation(self):
        """测试报告生成功能"""
        session_id = self.test_create_interview_session()
        
        # 先进行分析
        analysis_request = {
            "session_id": session_id,
            "question_text": "测试问题",
            "text_data": self.test_data["ai_domain_test"]["text_response"]
        }
        
        self.client.post("/api/v1/analysis/multimodal", json=analysis_request)
        
        # 生成报告
        response = self.client.post(f"/api/v1/report/generate/{session_id}")
        assert response.status_code == 200
        data = response.json()
        assert "report_id" in data
        
        # 获取报告
        report_id = data["report_id"]
        response = self.client.get(f"/api/v1/report/{report_id}")
        assert response.status_code == 200
        report_data = response.json()
        assert "overall_score" in report_data
        assert "capability_breakdown" in report_data

if __name__ == "__main__":
    # 运行测试
    pytest.main([__file__, "-v"])
