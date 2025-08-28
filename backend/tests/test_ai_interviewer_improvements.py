"""
测试AI面试官改进功能
验证回答类型检测和误判修正机制
"""

import pytest
import sys
import os

# 添加项目根目录到Python路径
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.advanced_interviewer_service import AdvancedInterviewerService


class TestAIInterviewerImprovements:
    """测试AI面试官改进功能"""
    
    def setup_method(self):
        """测试前准备"""
        self.interviewer_service = AdvancedInterviewerService()
    
    def test_professional_answer_detection(self):
        """测试专业回答的正确识别"""
        
        # 您提供的实际回答示例
        professional_answer = """
        在大数据时代，实时数据流处理成为了数据分析与处理的重要组成部分。尤其是在需要快速响应的场景中，数据流处理显得尤为关键。本文将详细介绍如何设计与实现一个基于Java的实时数据流处理框架，并通过代码实例来帮助你理解这一过程。

        实时数据流处理概述
        实时数据流处理(Stream Processing)是指对实时产生的数据流进行持续的处理与分析。不同于传统的批处理模式，实时流处理能够实时获取和处理数据，在数据产生的瞬间进行计算，从而实时反馈结果。

        常见的实时数据流处理框架有Apache Kafka、Apache Flink、Apache Storm等，但在本文中，我们将重点讨论如何基于Java从零开始设计一个简单的实时数据流处理框架。

        设计目标与思路
        在设计这个框架时，我们的目标是创建一个轻量级、易于扩展的实时数据流处理系统。框架的核心功能包括：

        数据源的实时输入：通过管道(例如Kafka)接收流数据。
        流数据的处理：包括数据的清洗、过滤、转换等处理逻辑。
        结果的实时输出：将处理后的数据实时发送到输出目标(如数据库、文件等)。
        框架的架构设计应当具备良好的可扩展性与高效性，以满足大规模数据流的实时处理需求。
        """
        
        # 测试回答类型检测
        response_type = self.interviewer_service._detect_response_type(professional_answer)
        
        # 应该被识别为专业回答，而不是"不知道"
        assert response_type == "confident_answer", f"专业回答被误判为: {response_type}"
        
        # 测试技术内容质量分析
        quality_analysis = self.interviewer_service._analyze_technical_content_quality(professional_answer)

        print(f"调试信息: {quality_analysis}")  # 添加调试信息

        assert quality_analysis["has_technical_terms"] == True, "未识别出技术术语"
        assert quality_analysis["word_count"] > 50, f"字数统计错误，实际字数: {quality_analysis['word_count']}"
        assert quality_analysis["technical_density"] > 0.01, f"技术密度过低: {quality_analysis['technical_density']}"
        assert quality_analysis["confidence_score"] > 0.3, f"置信度分数过低: {quality_analysis['confidence_score']}"
    
    def test_unknown_answer_detection(self):
        """测试"不知道"回答的正确识别"""
        
        unknown_answers = [
            "我不知道这个问题怎么回答",
            "完全不了解这个技术领域",
            "没有相关经验，不太懂",
            "不清楚具体的实现方式"
        ]
        
        for answer in unknown_answers:
            response_type = self.interviewer_service._detect_response_type(answer)
            assert response_type == "express_unknown", f"未正确识别不知道回答: {answer}"
    
    def test_validation_mechanism(self):
        """测试验证机制防止误判"""
        
        # 测试专业回答被误判的修正
        professional_answer = """
        对于实时流数据处理系统的设计，我认为需要考虑以下几个核心架构组件：
        
        1. 数据接入层：使用Apache Kafka作为消息队列，支持高吞吐量的数据接入
        2. 流处理引擎：采用Apache Flink进行实时计算，支持事件时间处理和状态管理
        3. 数据一致性保障：通过Checkpoint机制和两阶段提交协议确保Exactly-Once语义
        4. 存储层：结合Redis缓存和HBase存储，满足不同的数据访问需求
        
        在数据一致性方面，特别需要关注分布式环境下的事务处理和故障恢复机制。
        """
        
        # 假设初始分类错误
        initial_classification = "express_unknown"
        
        # 验证机制应该能够修正这个错误
        validation_result = self.interviewer_service.validate_response_classification(
            professional_answer, initial_classification, "大数据"
        )
        
        assert validation_result["potential_misjudgment"] == True, "未检测到误判"
        assert validation_result["final_classification"] == "confident_answer", "未正确修正分类"
        assert validation_result["confidence"] > 0.7, "修正置信度过低"
    
    def test_partial_knowledge_detection(self):
        """测试部分知识回答的识别"""
        
        partial_answers = [
            "我大概知道一些Kafka的基本概念，可能是用来做消息队列的",
            "听说过Flink，应该是用于流处理的框架",
            "我觉得可能需要考虑数据一致性问题"
        ]
        
        for answer in partial_answers:
            response_type = self.interviewer_service._detect_response_type(answer)
            assert response_type == "partial_knowledge", f"未正确识别部分知识回答: {answer}"
    
    def test_request_answer_detection(self):
        """测试请求答案回答的识别"""
        
        request_answers = [
            "请告诉我正确答案是什么",
            "能否给出标准的解决方案",
            "应该怎么设计这个系统？请指导一下"
        ]
        
        for answer in request_answers:
            response_type = self.interviewer_service._detect_response_type(answer)
            assert response_type == "request_answer", f"未正确识别请求答案: {answer}"


if __name__ == "__main__":
    # 运行测试
    test_instance = TestAIInterviewerImprovements()
    test_instance.setup_method()
    
    print("🧪 开始测试AI面试官改进功能...")
    
    try:
        test_instance.test_professional_answer_detection()
        print("✅ 专业回答检测测试通过")
        
        test_instance.test_unknown_answer_detection()
        print("✅ 不知道回答检测测试通过")
        
        test_instance.test_validation_mechanism()
        print("✅ 验证机制测试通过")
        
        test_instance.test_partial_knowledge_detection()
        print("✅ 部分知识检测测试通过")
        
        test_instance.test_request_answer_detection()
        print("✅ 请求答案检测测试通过")
        
        print("\n🎉 所有测试通过！AI面试官改进功能正常工作")
        
    except AssertionError as e:
        print(f"❌ 测试失败: {e}")
    except Exception as e:
        print(f"❌ 测试异常: {e}")
