"""
测试报告生成服务
"""
import pytest
import numpy as np
from unittest.mock import Mock, patch
from app.services.report_generation_service import (
    ReportVisualizationService,
    ImprovementSuggestionService,
    visualization_service,
    suggestion_service
)

class TestReportVisualizationService:
    """测试报告可视化服务"""
    
    def setup_method(self):
        """设置测试环境"""
        self.service = ReportVisualizationService()
        self.sample_capability_scores = {
            "专业技能": 75.0,
            "沟通表达": 68.0,
            "逻辑思维": 82.0,
            "学习能力": 70.0,
            "抗压能力": 65.0,
            "团队协作": 78.0
        }
    
    def test_generate_radar_chart(self):
        """测试雷达图生成"""
        # 测试正常情况
        chart_base64 = self.service.generate_radar_chart(self.sample_capability_scores)
        
        # 验证返回的是base64字符串
        assert isinstance(chart_base64, str)
        assert len(chart_base64) > 0
        
        # 验证base64格式（简单检查）
        import base64
        try:
            base64.b64decode(chart_base64)
            is_valid_base64 = True
        except:
            is_valid_base64 = False
        assert is_valid_base64
    
    def test_generate_radar_chart_empty_data(self):
        """测试空数据的雷达图生成"""
        empty_scores = {}
        chart_base64 = self.service.generate_radar_chart(empty_scores)
        
        # 应该仍然返回有效的图表
        assert isinstance(chart_base64, str)
        assert len(chart_base64) > 0
    
    def test_generate_capability_breakdown_chart(self):
        """测试能力细分图表生成"""
        detailed_scores = {
            "专业技能": {
                "技术深度": 75.0,
                "实践经验": 70.0,
                "创新思维": 80.0,
                "技术更新": 72.0
            },
            "沟通表达": {
                "语言表达": 68.0,
                "逻辑清晰": 70.0,
                "情感传达": 65.0,
                "互动能力": 72.0
            }
        }
        
        chart_base64 = self.service.generate_capability_breakdown_chart(detailed_scores)
        
        # 验证返回的是base64字符串
        assert isinstance(chart_base64, str)
        assert len(chart_base64) > 0
    
    def test_generate_performance_trend_chart(self):
        """测试表现趋势图生成"""
        question_scores = [
            {"overall_score": 75, "difficulty": "简单"},
            {"overall_score": 68, "difficulty": "中等"},
            {"overall_score": 82, "difficulty": "困难"},
            {"overall_score": 70, "difficulty": "中等"}
        ]
        
        chart_base64 = self.service.generate_performance_trend_chart(question_scores)
        
        # 验证返回的是base64字符串
        assert isinstance(chart_base64, str)
        assert len(chart_base64) > 0
    
    def test_generate_performance_trend_chart_empty(self):
        """测试空数据的趋势图生成"""
        chart_base64 = self.service.generate_performance_trend_chart([])
        
        # 空数据应该返回空字符串
        assert chart_base64 == ""

class TestImprovementSuggestionService:
    """测试改进建议服务"""
    
    def setup_method(self):
        """设置测试环境"""
        self.service = ImprovementSuggestionService()
        self.sample_capability_scores = {
            "专业技能": 55.0,  # 低分，需要改进
            "沟通表达": 75.0,  # 中等分数
            "逻辑思维": 85.0,  # 高分
            "学习能力": 65.0,  # 中等偏低
            "抗压能力": 45.0,  # 低分
            "团队协作": 80.0   # 高分
        }
    
    def test_generate_improvement_suggestions(self):
        """测试改进建议生成"""
        domain = "人工智能"
        suggestions = self.service.generate_improvement_suggestions(
            self.sample_capability_scores, domain
        )
        
        # 验证返回的是字典
        assert isinstance(suggestions, dict)
        
        # 验证包含所有能力的建议
        for capability in self.sample_capability_scores.keys():
            assert capability in suggestions
            assert isinstance(suggestions[capability], list)
            assert len(suggestions[capability]) > 0
        
        # 验证建议内容包含领域信息
        professional_suggestions = suggestions.get("专业技能", [])
        assert any(domain in suggestion for suggestion in professional_suggestions)
    
    def test_generate_priority_recommendations(self):
        """测试优先级建议生成"""
        recommendations = self.service.generate_priority_recommendations(
            self.sample_capability_scores
        )
        
        # 验证返回的是列表
        assert isinstance(recommendations, list)
        assert len(recommendations) <= 3  # 最多3个优先建议
        
        # 验证建议按分数排序（最低分优先）
        if len(recommendations) > 1:
            for i in range(len(recommendations) - 1):
                assert recommendations[i]["score"] <= recommendations[i + 1]["score"]
        
        # 验证每个建议的结构
        for rec in recommendations:
            assert "capability" in rec
            assert "score" in rec
            assert "priority" in rec
            assert "urgency" in rec
            assert "improvement_potential" in rec
            assert "recommended_actions" in rec
            
            # 验证优先级和紧急程度的值
            assert rec["priority"] in ["高", "中", "低"]
            assert rec["urgency"] in ["紧急", "重要", "一般"]
            assert isinstance(rec["recommended_actions"], list)
    
    def test_priority_assignment(self):
        """测试优先级分配逻辑"""
        recommendations = self.service.generate_priority_recommendations(
            self.sample_capability_scores
        )
        
        # 验证最低分的能力获得最高优先级
        if recommendations:
            lowest_score_rec = recommendations[0]
            assert lowest_score_rec["priority"] == "高"
            
            # 验证分数低于50的标记为紧急
            if lowest_score_rec["score"] < 50:
                assert lowest_score_rec["urgency"] == "紧急"
    
    def test_get_specific_actions(self):
        """测试具体行动建议"""
        # 测试专业技能的行动建议
        actions = self.service._get_specific_actions("专业技能", 55.0)
        
        assert isinstance(actions, list)
        assert len(actions) > 0
        
        # 验证行动建议的内容
        assert all(isinstance(action, str) for action in actions)
        assert all(len(action) > 0 for action in actions)
    
    def test_empty_capability_scores(self):
        """测试空能力分数"""
        empty_scores = {}
        
        suggestions = self.service.generate_improvement_suggestions(empty_scores, "AI")
        assert isinstance(suggestions, dict)
        assert len(suggestions) == 0
        
        recommendations = self.service.generate_priority_recommendations(empty_scores)
        assert isinstance(recommendations, list)
        assert len(recommendations) == 0

class TestServiceIntegration:
    """测试服务集成"""
    
    def test_global_service_instances(self):
        """测试全局服务实例"""
        # 验证全局实例存在且类型正确
        assert isinstance(visualization_service, ReportVisualizationService)
        assert isinstance(suggestion_service, ImprovementSuggestionService)
    
    def test_service_integration(self):
        """测试服务集成使用"""
        capability_scores = {
            "专业技能": 60.0,
            "沟通表达": 70.0,
            "逻辑思维": 80.0,
            "学习能力": 65.0,
            "抗压能力": 55.0,
            "团队协作": 75.0
        }
        
        # 测试可视化服务
        radar_chart = visualization_service.generate_radar_chart(capability_scores)
        assert isinstance(radar_chart, str)
        assert len(radar_chart) > 0
        
        # 测试建议服务
        suggestions = suggestion_service.generate_improvement_suggestions(
            capability_scores, "大数据"
        )
        assert isinstance(suggestions, dict)
        assert len(suggestions) > 0
        
        priority_recs = suggestion_service.generate_priority_recommendations(
            capability_scores
        )
        assert isinstance(priority_recs, list)
        assert len(priority_recs) > 0

if __name__ == "__main__":
    pytest.main([__file__])
