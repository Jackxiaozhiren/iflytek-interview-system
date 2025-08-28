"""
6个核心能力指标验证器
确保评估算法的准确性和一致性
"""

import logging
import statistics
from typing import Dict, List, Any, Tuple, Optional
from dataclasses import dataclass
from enum import Enum

logger = logging.getLogger(__name__)

class CapabilityType(Enum):
    """能力类型枚举"""
    PROFESSIONAL_KNOWLEDGE = "professional_knowledge"
    SKILL_MATCHING = "skill_matching"
    LANGUAGE_EXPRESSION = "language_expression"
    LOGICAL_THINKING = "logical_thinking"
    INNOVATION_ABILITY = "innovation_ability"
    STRESS_RESISTANCE = "stress_resistance"

@dataclass
class ValidationResult:
    """验证结果"""
    is_valid: bool
    score: float
    confidence: float
    issues: List[str]
    recommendations: List[str]

@dataclass
class CapabilityBenchmark:
    """能力基准数据"""
    domain: str
    position_level: str
    expected_ranges: Dict[str, Tuple[float, float]]  # (min, max)
    weight_distribution: Dict[str, float]

class CapabilityValidator:
    """能力指标验证器"""
    
    def __init__(self):
        self.benchmarks = self._load_benchmarks()
        self.validation_rules = self._load_validation_rules()
        self.validation_history = []
    
    def _load_benchmarks(self) -> Dict[str, CapabilityBenchmark]:
        """加载基准数据"""
        return {
            "人工智能_初级": CapabilityBenchmark(
                domain="人工智能",
                position_level="初级",
                expected_ranges={
                    "professional_knowledge": (60.0, 85.0),
                    "skill_matching": (65.0, 90.0),
                    "language_expression": (70.0, 95.0),
                    "logical_thinking": (65.0, 90.0),
                    "innovation_ability": (50.0, 80.0),
                    "stress_resistance": (60.0, 85.0)
                },
                weight_distribution={
                    "professional_knowledge": 0.30,
                    "skill_matching": 0.25,
                    "language_expression": 0.15,
                    "logical_thinking": 0.15,
                    "innovation_ability": 0.10,
                    "stress_resistance": 0.05
                }
            ),
            "人工智能_中级": CapabilityBenchmark(
                domain="人工智能",
                position_level="中级",
                expected_ranges={
                    "professional_knowledge": (70.0, 95.0),
                    "skill_matching": (75.0, 95.0),
                    "language_expression": (75.0, 95.0),
                    "logical_thinking": (70.0, 95.0),
                    "innovation_ability": (60.0, 90.0),
                    "stress_resistance": (65.0, 90.0)
                },
                weight_distribution={
                    "professional_knowledge": 0.25,
                    "skill_matching": 0.20,
                    "language_expression": 0.15,
                    "logical_thinking": 0.20,
                    "innovation_ability": 0.15,
                    "stress_resistance": 0.05
                }
            ),
            "大数据_初级": CapabilityBenchmark(
                domain="大数据",
                position_level="初级",
                expected_ranges={
                    "professional_knowledge": (65.0, 85.0),
                    "skill_matching": (70.0, 90.0),
                    "language_expression": (70.0, 95.0),
                    "logical_thinking": (70.0, 95.0),
                    "innovation_ability": (55.0, 80.0),
                    "stress_resistance": (65.0, 85.0)
                },
                weight_distribution={
                    "professional_knowledge": 0.25,
                    "skill_matching": 0.25,
                    "language_expression": 0.15,
                    "logical_thinking": 0.20,
                    "innovation_ability": 0.10,
                    "stress_resistance": 0.05
                }
            ),
            "物联网_初级": CapabilityBenchmark(
                domain="物联网",
                position_level="初级",
                expected_ranges={
                    "professional_knowledge": (60.0, 85.0),
                    "skill_matching": (65.0, 90.0),
                    "language_expression": (70.0, 95.0),
                    "logical_thinking": (65.0, 90.0),
                    "innovation_ability": (60.0, 85.0),
                    "stress_resistance": (60.0, 85.0)
                },
                weight_distribution={
                    "professional_knowledge": 0.25,
                    "skill_matching": 0.25,
                    "language_expression": 0.15,
                    "logical_thinking": 0.15,
                    "innovation_ability": 0.15,
                    "stress_resistance": 0.05
                }
            )
        }
    
    def _load_validation_rules(self) -> Dict[str, Any]:
        """加载验证规则"""
        return {
            "score_range": (0.0, 100.0),
            "min_confidence": 0.6,
            "max_score_variance": 15.0,  # 最大分数方差
            "consistency_threshold": 0.8,  # 一致性阈值
            "outlier_threshold": 2.0,  # 异常值阈值（标准差倍数）
        }
    
    def validate_capability_scores(
        self, 
        scores: Dict[str, float], 
        domain: str = None, 
        position_level: str = "初级"
    ) -> Dict[str, ValidationResult]:
        """验证能力分数"""
        results = {}
        
        for capability, score in scores.items():
            result = self._validate_single_capability(
                capability, score, domain, position_level
            )
            results[capability] = result
        
        # 验证整体一致性
        overall_consistency = self._validate_overall_consistency(scores, domain, position_level)
        results["overall"] = overall_consistency
        
        # 记录验证历史
        self.validation_history.append({
            "scores": scores,
            "domain": domain,
            "position_level": position_level,
            "results": results,
            "timestamp": logger.info("能力分数验证完成")
        })
        
        return results
    
    def _validate_single_capability(
        self, 
        capability: str, 
        score: float, 
        domain: str = None, 
        position_level: str = "初级"
    ) -> ValidationResult:
        """验证单个能力分数"""
        issues = []
        recommendations = []
        confidence = 1.0
        
        # 基本范围检查
        min_score, max_score = self.validation_rules["score_range"]
        if not (min_score <= score <= max_score):
            issues.append(f"分数 {score} 超出有效范围 [{min_score}, {max_score}]")
            confidence *= 0.5
        
        # 基准比较
        if domain:
            benchmark_key = f"{domain}_{position_level}"
            if benchmark_key in self.benchmarks:
                benchmark = self.benchmarks[benchmark_key]
                if capability in benchmark.expected_ranges:
                    expected_min, expected_max = benchmark.expected_ranges[capability]
                    if not (expected_min <= score <= expected_max):
                        issues.append(
                            f"{capability} 分数 {score} 不在预期范围 "
                            f"[{expected_min}, {expected_max}] 内"
                        )
                        confidence *= 0.7
                        recommendations.append(
                            f"建议重新评估 {capability}，预期范围应为 "
                            f"{expected_min}-{expected_max}"
                        )
        
        # 历史一致性检查
        historical_scores = self._get_historical_scores(capability, domain)
        if len(historical_scores) >= 3:
            mean_score = statistics.mean(historical_scores)
            std_dev = statistics.stdev(historical_scores)
            
            if abs(score - mean_score) > self.validation_rules["outlier_threshold"] * std_dev:
                issues.append(f"{capability} 分数与历史数据差异较大")
                confidence *= 0.8
                recommendations.append("建议检查评估算法的一致性")
        
        is_valid = len(issues) == 0 and confidence >= self.validation_rules["min_confidence"]
        
        return ValidationResult(
            is_valid=is_valid,
            score=score,
            confidence=confidence,
            issues=issues,
            recommendations=recommendations
        )
    
    def _validate_overall_consistency(
        self, 
        scores: Dict[str, float], 
        domain: str = None, 
        position_level: str = "初级"
    ) -> ValidationResult:
        """验证整体一致性"""
        issues = []
        recommendations = []
        confidence = 1.0
        
        # 检查分数方差
        score_values = list(scores.values())
        if len(score_values) > 1:
            variance = statistics.variance(score_values)
            if variance > self.validation_rules["max_score_variance"]:
                issues.append(f"能力分数方差过大: {variance:.2f}")
                confidence *= 0.8
                recommendations.append("建议检查评估算法的平衡性")
        
        # 检查权重分布合理性
        if domain:
            benchmark_key = f"{domain}_{position_level}"
            if benchmark_key in self.benchmarks:
                benchmark = self.benchmarks[benchmark_key]
                weighted_score = sum(
                    scores.get(cap, 0) * weight 
                    for cap, weight in benchmark.weight_distribution.items()
                )
                
                # 检查加权分数是否合理
                avg_score = statistics.mean(score_values)
                if abs(weighted_score - avg_score) > 10.0:
                    issues.append("加权分数与平均分数差异较大")
                    confidence *= 0.9
        
        overall_score = statistics.mean(score_values) if score_values else 0.0
        is_valid = len(issues) == 0 and confidence >= self.validation_rules["min_confidence"]
        
        return ValidationResult(
            is_valid=is_valid,
            score=overall_score,
            confidence=confidence,
            issues=issues,
            recommendations=recommendations
        )
    
    def _get_historical_scores(self, capability: str, domain: str = None) -> List[float]:
        """获取历史分数"""
        historical_scores = []
        for record in self.validation_history:
            if domain and record.get("domain") != domain:
                continue
            if capability in record.get("scores", {}):
                historical_scores.append(record["scores"][capability])
        return historical_scores[-10:]  # 最近10次记录
    
    def get_validation_report(self, validation_results: Dict[str, ValidationResult]) -> Dict[str, Any]:
        """生成验证报告"""
        total_capabilities = len([k for k in validation_results.keys() if k != "overall"])
        valid_capabilities = len([
            r for k, r in validation_results.items() 
            if k != "overall" and r.is_valid
        ])
        
        all_issues = []
        all_recommendations = []
        
        for capability, result in validation_results.items():
            all_issues.extend(result.issues)
            all_recommendations.extend(result.recommendations)
        
        overall_confidence = statistics.mean([
            r.confidence for r in validation_results.values()
        ]) if validation_results else 0.0
        
        return {
            "summary": {
                "total_capabilities": total_capabilities,
                "valid_capabilities": valid_capabilities,
                "validation_rate": valid_capabilities / max(total_capabilities, 1),
                "overall_confidence": overall_confidence
            },
            "details": validation_results,
            "issues": all_issues,
            "recommendations": all_recommendations,
            "status": "passed" if valid_capabilities == total_capabilities else "failed"
        }
    
    def calibrate_algorithm(self, test_cases: List[Dict[str, Any]]) -> Dict[str, Any]:
        """校准评估算法"""
        calibration_results = []
        
        for test_case in test_cases:
            expected_scores = test_case.get("expected_scores", {})
            actual_scores = test_case.get("actual_scores", {})
            
            # 计算误差
            errors = {}
            for capability in expected_scores:
                if capability in actual_scores:
                    error = abs(expected_scores[capability] - actual_scores[capability])
                    errors[capability] = error
            
            calibration_results.append({
                "test_case": test_case.get("name", "unknown"),
                "errors": errors,
                "mean_error": statistics.mean(errors.values()) if errors else 0.0
            })
        
        # 计算整体校准指标
        all_errors = []
        for result in calibration_results:
            all_errors.extend(result["errors"].values())
        
        return {
            "calibration_results": calibration_results,
            "overall_metrics": {
                "mean_absolute_error": statistics.mean(all_errors) if all_errors else 0.0,
                "max_error": max(all_errors) if all_errors else 0.0,
                "error_std_dev": statistics.stdev(all_errors) if len(all_errors) > 1 else 0.0
            },
            "recommendations": self._generate_calibration_recommendations(all_errors)
        }
    
    def _generate_calibration_recommendations(self, errors: List[float]) -> List[str]:
        """生成校准建议"""
        recommendations = []
        
        if not errors:
            return ["无足够数据进行校准分析"]
        
        mean_error = statistics.mean(errors)
        if mean_error > 10.0:
            recommendations.append("平均误差较大，建议调整评估算法参数")
        
        if len(errors) > 1:
            std_dev = statistics.stdev(errors)
            if std_dev > 15.0:
                recommendations.append("误差方差较大，建议提高算法稳定性")
        
        max_error = max(errors)
        if max_error > 25.0:
            recommendations.append("存在较大异常误差，建议检查极端情况处理")
        
        return recommendations

# 全局验证器实例
capability_validator = CapabilityValidator()

# 导出
__all__ = ["CapabilityValidator", "ValidationResult", "CapabilityBenchmark", "capability_validator"]
