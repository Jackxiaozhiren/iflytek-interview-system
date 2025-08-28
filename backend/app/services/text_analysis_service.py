"""
文本分析服务模块
实现内容相关性分析、逻辑结构分析、关键词匹配、创新性评估等功能
"""
import re
import jieba
import jieba.analyse
from typing import Dict, Any, List, Set
from collections import Counter
import numpy as np
from datetime import datetime

class ContentRelevanceAnalyzer:
    """内容相关性分析器"""
    
    def __init__(self):
        # 初始化jieba分词
        jieba.initialize()
        
        # 技术领域关键词库
        self.domain_keywords = {
            "人工智能": [
                "机器学习", "深度学习", "神经网络", "算法", "模型", "训练", "预测",
                "分类", "回归", "聚类", "特征", "数据", "监督学习", "无监督学习",
                "强化学习", "自然语言处理", "计算机视觉", "推荐系统", "梯度下降",
                "反向传播", "卷积", "循环神经网络", "transformer", "注意力机制"
            ],
            "大数据": [
                "hadoop", "spark", "mapreduce", "hdfs", "hive", "hbase", "kafka",
                "storm", "flink", "elasticsearch", "数据仓库", "数据湖", "etl",
                "数据挖掘", "数据分析", "分布式", "集群", "并行计算", "流处理",
                "批处理", "nosql", "mongodb", "redis", "数据可视化", "olap"
            ],
            "物联网": [
                "传感器", "嵌入式", "单片机", "arduino", "树莓派", "mqtt", "coap",
                "zigbee", "wifi", "蓝牙", "lora", "nb-iot", "边缘计算", "云计算",
                "协议", "通信", "网关", "智能家居", "工业物联网", "车联网",
                "可穿戴设备", "远程监控", "数据采集", "实时控制"
            ]
        }
        
        # 岗位相关关键词
        self.position_keywords = {
            "技术岗": [
                "开发", "编程", "代码", "架构", "设计", "实现", "优化", "调试",
                "测试", "部署", "维护", "技术栈", "框架", "库", "api", "数据库",
                "性能", "安全", "扩展性", "可维护性"
            ],
            "运维测试岗": [
                "运维", "测试", "部署", "监控", "日志", "性能", "稳定性", "可用性",
                "自动化", "脚本", "ci/cd", "容器", "docker", "kubernetes", "devops",
                "故障排查", "备份", "恢复", "安全", "权限管理"
            ],
            "产品岗": [
                "产品", "需求", "用户", "体验", "界面", "交互", "设计", "原型",
                "迭代", "版本", "功能", "特性", "市场", "竞品", "分析", "调研",
                "数据驱动", "增长", "转化", "留存", "商业模式"
            ]
        }
    
    def analyze_relevance(self, text: str, domain: str, position: str) -> Dict[str, Any]:
        """
        分析文本与领域/岗位的相关性
        :param text: 待分析文本
        :param domain: 技术领域
        :param position: 岗位类型
        :return: 相关性分析结果
        """
        # 分词
        words = list(jieba.cut(text.lower()))
        word_set = set(words)
        
        # 获取领域和岗位关键词
        domain_kw = set(kw.lower() for kw in self.domain_keywords.get(domain, []))
        position_kw = set(kw.lower() for kw in self.position_keywords.get(position, []))
        
        # 计算匹配度
        domain_matches = word_set.intersection(domain_kw)
        position_matches = word_set.intersection(position_kw)
        
        # 计算相关性得分
        domain_score = len(domain_matches) / len(domain_kw) if domain_kw else 0
        position_score = len(position_matches) / len(position_kw) if position_kw else 0
        
        # 综合相关性得分
        overall_relevance = (domain_score * 0.6 + position_score * 0.4) * 100
        
        return {
            "overall_relevance": min(100, overall_relevance),
            "domain_relevance": domain_score * 100,
            "position_relevance": position_score * 100,
            "domain_keywords_matched": list(domain_matches),
            "position_keywords_matched": list(position_matches),
            "total_words": len(words),
            "unique_words": len(word_set)
        }

class LogicalStructureAnalyzer:
    """逻辑结构分析器"""
    
    def __init__(self):
        # 逻辑连接词
        self.logical_connectors = [
            "首先", "其次", "然后", "最后", "因此", "所以", "由于", "因为",
            "但是", "然而", "不过", "虽然", "尽管", "另外", "此外", "而且",
            "总之", "综上", "总的来说", "换句话说", "例如", "比如", "具体来说"
        ]
        
        # STAR结构关键词
        self.star_keywords = {
            "situation": ["情况", "背景", "当时", "项目", "任务"],
            "task": ["任务", "目标", "要求", "需要", "负责"],
            "action": ["行动", "做法", "方法", "实施", "执行", "采用"],
            "result": ["结果", "效果", "成果", "收获", "提升", "改善"]
        }
    
    def analyze_logical_structure(self, text: str) -> Dict[str, Any]:
        """
        分析文本的逻辑结构
        :param text: 待分析文本
        :return: 逻辑结构分析结果
        """
        sentences = re.split(r'[。！？；]', text)
        sentences = [s.strip() for s in sentences if s.strip()]
        
        # 检测逻辑连接词
        connector_count = 0
        connectors_found = []
        
        for sentence in sentences:
            for connector in self.logical_connectors:
                if connector in sentence:
                    connector_count += 1
                    connectors_found.append(connector)
        
        # 检测STAR结构
        star_structure = {}
        for category, keywords in self.star_keywords.items():
            matches = []
            for sentence in sentences:
                for keyword in keywords:
                    if keyword in sentence:
                        matches.append(keyword)
            star_structure[category] = len(matches) > 0
        
        # 计算逻辑结构得分
        connector_score = min(100, (connector_count / len(sentences)) * 100) if sentences else 0
        star_score = sum(star_structure.values()) / len(star_structure) * 100
        
        # 段落结构分析
        paragraphs = text.split('\n')
        paragraph_count = len([p for p in paragraphs if p.strip()])
        
        structure_score = (connector_score * 0.4 + star_score * 0.6)
        
        return {
            "structure_score": structure_score,
            "logical_connectors": {
                "count": connector_count,
                "found": list(set(connectors_found)),
                "score": connector_score
            },
            "star_structure": {
                "detected": star_structure,
                "completeness": star_score,
                "has_complete_star": all(star_structure.values())
            },
            "paragraph_structure": {
                "paragraph_count": paragraph_count,
                "sentence_count": len(sentences),
                "avg_sentence_length": np.mean([len(s) for s in sentences]) if sentences else 0
            }
        }

class KeywordCoverageAnalyzer:
    """关键词覆盖率分析器"""
    
    def analyze_keyword_coverage(self, text: str, expected_keywords: List[str]) -> Dict[str, Any]:
        """
        分析关键词覆盖率
        :param text: 待分析文本
        :param expected_keywords: 期望的关键词列表
        :return: 关键词覆盖分析结果
        """
        text_lower = text.lower()
        
        # 检查关键词覆盖
        covered_keywords = []
        for keyword in expected_keywords:
            if keyword.lower() in text_lower:
                covered_keywords.append(keyword)
        
        # 计算覆盖率
        coverage_rate = len(covered_keywords) / len(expected_keywords) if expected_keywords else 0
        
        # 提取文本中的关键词
        keywords_extracted = jieba.analyse.extract_tags(text, topK=10, withWeight=True)
        
        return {
            "coverage_rate": coverage_rate * 100,
            "covered_keywords": covered_keywords,
            "missing_keywords": [kw for kw in expected_keywords if kw not in covered_keywords],
            "extracted_keywords": [{"word": word, "weight": weight} for word, weight in keywords_extracted],
            "total_expected": len(expected_keywords),
            "total_covered": len(covered_keywords)
        }

class InnovationAnalyzer:
    """创新性分析器"""
    
    def __init__(self):
        # 创新性指示词
        self.innovation_indicators = [
            "创新", "新颖", "独特", "原创", "突破", "改进", "优化", "革新",
            "新方法", "新思路", "新技术", "新模式", "创造性", "前沿",
            "先进", "领先", "开创", "首次", "率先", "探索"
        ]
        
        # 常见词汇（降低创新性得分）
        self.common_phrases = [
            "众所周知", "大家都知道", "通常情况下", "一般来说", "传统方法",
            "常规做法", "标准流程", "按照惯例", "老生常谈"
        ]
    
    def analyze_innovation(self, text: str) -> Dict[str, Any]:
        """
        分析文本的创新性
        :param text: 待分析文本
        :return: 创新性分析结果
        """
        text_lower = text.lower()
        
        # 检测创新性指示词
        innovation_count = 0
        innovation_words = []
        
        for indicator in self.innovation_indicators:
            if indicator in text_lower:
                innovation_count += 1
                innovation_words.append(indicator)
        
        # 检测常见词汇
        common_count = 0
        common_words = []
        
        for phrase in self.common_phrases:
            if phrase in text_lower:
                common_count += 1
                common_words.append(phrase)
        
        # 计算词汇多样性
        words = list(jieba.cut(text))
        word_count = len(words)
        unique_words = len(set(words))
        diversity_ratio = unique_words / word_count if word_count > 0 else 0
        
        # 计算创新性得分
        innovation_score = innovation_count * 10  # 创新词汇加分
        innovation_score -= common_count * 5     # 常见词汇减分
        innovation_score += diversity_ratio * 30  # 词汇多样性加分
        innovation_score = max(0, min(100, innovation_score))
        
        return {
            "innovation_score": innovation_score,
            "innovation_indicators": {
                "count": innovation_count,
                "words": innovation_words
            },
            "common_phrases": {
                "count": common_count,
                "phrases": common_words
            },
            "vocabulary_diversity": {
                "total_words": word_count,
                "unique_words": unique_words,
                "diversity_ratio": diversity_ratio
            }
        }

class TextAnalysisService:
    """文本分析服务整合"""
    
    def __init__(self):
        self.relevance_analyzer = ContentRelevanceAnalyzer()
        self.structure_analyzer = LogicalStructureAnalyzer()
        self.keyword_analyzer = KeywordCoverageAnalyzer()
        self.innovation_analyzer = InnovationAnalyzer()
    
    def analyze_response(self, text: str, domain: str, position: str, expected_keywords: List[str] = None) -> Dict[str, Any]:
        """
        综合分析文本回答
        :param text: 回答文本
        :param domain: 技术领域
        :param position: 岗位类型
        :param expected_keywords: 期望关键词列表
        :return: 综合分析结果
        """
        if not text or not text.strip():
            return {"error": "文本内容为空"}
        
        try:
            # 内容相关性分析
            relevance_result = self.relevance_analyzer.analyze_relevance(text, domain, position)
            
            # 逻辑结构分析
            structure_result = self.structure_analyzer.analyze_logical_structure(text)
            
            # 关键词覆盖分析
            keyword_result = {}
            if expected_keywords:
                keyword_result = self.keyword_analyzer.analyze_keyword_coverage(text, expected_keywords)
            
            # 创新性分析
            innovation_result = self.innovation_analyzer.analyze_innovation(text)
            
            # 基础统计
            word_count = len(list(jieba.cut(text)))
            char_count = len(text)
            
            return {
                "timestamp": datetime.now().isoformat(),
                "basic_stats": {
                    "word_count": word_count,
                    "char_count": char_count,
                    "avg_word_length": char_count / word_count if word_count > 0 else 0
                },
                "content_relevance": relevance_result,
                "logical_structure": structure_result,
                "keyword_coverage": keyword_result,
                "innovation_analysis": innovation_result
            }
            
        except Exception as e:
            return {"error": f"文本分析失败: {str(e)}"}

# 全局服务实例
text_analysis_service = TextAnalysisService()
