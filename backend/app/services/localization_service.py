"""
中文本地化服务
确保系统的中文本地化完整性和准确性
"""

import json
import logging
from typing import Dict, List, Any, Optional
from pathlib import Path

logger = logging.getLogger(__name__)

class LocalizationService:
    """中文本地化服务"""
    
    def __init__(self):
        self.translations = {}
        self.missing_keys = set()
        self.validation_errors = []
        
    def load_translations(self, locale_path: str = "locales"):
        """加载翻译文件"""
        try:
            locale_dir = Path(locale_path)
            logger.info(f"尝试加载本地化目录: {locale_dir.absolute()}")

            if not locale_dir.exists():
                logger.warning(f"本地化目录不存在: {locale_path}")
                return

            # 加载中文翻译
            zh_cn_file = locale_dir / "zh-cn.json"
            logger.info(f"尝试加载翻译文件: {zh_cn_file.absolute()}")

            if zh_cn_file.exists():
                with open(zh_cn_file, 'r', encoding='utf-8') as f:
                    self.translations = json.load(f)
                logger.info(f"中文翻译文件加载成功，包含 {len(self.translations)} 个顶级键")
            else:
                logger.warning(f"中文翻译文件不存在: {zh_cn_file}")

        except Exception as e:
            logger.error(f"加载翻译文件失败: {e}")
    
    def get_text(self, key: str, default: Optional[str] = None, **kwargs) -> str:
        """获取翻译文本"""
        try:
            # 支持嵌套键，如 "interview.status.inProgress"
            keys = key.split('.')
            value = self.translations
            
            for k in keys:
                if isinstance(value, dict) and k in value:
                    value = value[k]
                else:
                    self.missing_keys.add(key)
                    return default or key
            
            # 支持参数替换
            if isinstance(value, str) and kwargs:
                try:
                    return value.format(**kwargs)
                except KeyError as e:
                    logger.warning(f"翻译参数缺失: {key} - {e}")
                    return value
            
            return value if isinstance(value, str) else str(value)
            
        except Exception as e:
            logger.error(f"获取翻译文本失败: {key} - {e}")
            return default or key
    
    def validate_translations(self) -> Dict[str, Any]:
        """验证翻译完整性"""
        validation_result = {
            "status": "success",
            "errors": [],
            "warnings": [],
            "statistics": {}
        }
        
        try:
            # 检查必需的翻译键
            required_keys = [
                "app.title",
                "app.description",
                "interview.start",
                "interview.end",
                "interview.status.inProgress",
                "interview.status.completed",
                "ai.sparkModel",
                "capabilities.technical",
                "capabilities.problem_solving",
                "capabilities.communication",
                "capabilities.learning",
                "capabilities.teamwork",
                "capabilities.innovation",
                "domains.ai",
                "domains.bigdata",
                "domains.iot",
                "report.title",
                "report.summary",
                "error.network",
                "error.server",
                "error.validation"
            ]
            
            missing_required = []
            for key in required_keys:
                if not self._has_translation(key):
                    missing_required.append(key)
            
            if missing_required:
                validation_result["errors"].append({
                    "type": "missing_required_keys",
                    "message": "缺少必需的翻译键",
                    "keys": missing_required
                })
                validation_result["status"] = "error"
            
            # 检查翻译质量
            quality_issues = self._check_translation_quality()
            if quality_issues:
                validation_result["warnings"].extend(quality_issues)
                if validation_result["status"] == "success":
                    validation_result["status"] = "warning"
            
            # 统计信息
            validation_result["statistics"] = {
                "total_keys": self._count_translation_keys(),
                "missing_keys": len(self.missing_keys),
                "coverage_percent": self._calculate_coverage()
            }
            
        except Exception as e:
            logger.error(f"翻译验证失败: {e}")
            validation_result["status"] = "error"
            validation_result["errors"].append({
                "type": "validation_error",
                "message": str(e)
            })
        
        return validation_result
    
    def _has_translation(self, key: str) -> bool:
        """检查是否存在翻译"""
        keys = key.split('.')
        value = self.translations
        
        for k in keys:
            if isinstance(value, dict) and k in value:
                value = value[k]
            else:
                return False
        
        return isinstance(value, str) and len(value.strip()) > 0
    
    def _check_translation_quality(self) -> List[Dict[str, Any]]:
        """检查翻译质量"""
        issues = []
        
        def check_node(node, path=""):
            if isinstance(node, dict):
                for key, value in node.items():
                    current_path = f"{path}.{key}" if path else key
                    check_node(value, current_path)
            elif isinstance(node, str):
                # 检查空翻译
                if not node.strip():
                    issues.append({
                        "type": "empty_translation",
                        "key": path,
                        "message": "翻译内容为空"
                    })
                
                # 检查可能的英文残留
                if self._contains_english(node):
                    issues.append({
                        "type": "english_content",
                        "key": path,
                        "message": "翻译中包含英文内容",
                        "content": node
                    })
                
                # 检查格式化参数
                if '{' in node and '}' in node:
                    if not self._validate_format_params(node):
                        issues.append({
                            "type": "invalid_format",
                            "key": path,
                            "message": "格式化参数无效",
                            "content": node
                        })
        
        check_node(self.translations)
        return issues
    
    def _contains_english(self, text: str) -> bool:
        """检查是否包含英文"""
        # 简单检查：如果包含连续的英文字母且比例较高
        english_chars = sum(1 for c in text if c.isalpha() and ord(c) < 128)
        total_chars = len([c for c in text if c.isalnum()])
        
        if total_chars == 0:
            return False
        
        english_ratio = english_chars / total_chars
        return english_ratio > 0.3  # 如果英文字符超过30%，认为可能有问题
    
    def _validate_format_params(self, text: str) -> bool:
        """验证格式化参数"""
        try:
            # 尝试格式化，看是否有语法错误
            text.format()
            return True
        except (KeyError, ValueError):
            # KeyError是正常的（缺少参数），ValueError表示语法错误
            return False
        except Exception:
            return False
    
    def _count_translation_keys(self) -> int:
        """计算翻译键总数"""
        def count_keys(node):
            if isinstance(node, dict):
                return sum(count_keys(value) for value in node.values())
            else:
                return 1
        
        return count_keys(self.translations)
    
    def _calculate_coverage(self) -> float:
        """计算翻译覆盖率"""
        total_keys = self._count_translation_keys()
        if total_keys == 0:
            return 0.0
        
        missing_count = len(self.missing_keys)
        return max(0.0, (total_keys - missing_count) / total_keys * 100)
    
    def generate_missing_keys_template(self) -> Dict[str, str]:
        """生成缺失键的模板"""
        template = {}
        for key in sorted(self.missing_keys):
            template[key] = f"TODO: 翻译 '{key}'"
        return template
    
    def get_localization_status(self) -> Dict[str, Any]:
        """获取本地化状态"""
        validation = self.validate_translations()
        
        return {
            "validation": validation,
            "missing_keys": list(self.missing_keys),
            "missing_keys_template": self.generate_missing_keys_template(),
            "recommendations": self._get_recommendations(validation)
        }
    
    def _get_recommendations(self, validation: Dict[str, Any]) -> List[str]:
        """获取改进建议"""
        recommendations = []
        
        if validation["status"] == "error":
            recommendations.append("请添加缺失的必需翻译键")
        
        if validation["statistics"]["coverage_percent"] < 90:
            recommendations.append("建议提高翻译覆盖率至90%以上")
        
        if len(self.missing_keys) > 0:
            recommendations.append("请翻译缺失的键值")
        
        # 检查警告
        for warning in validation.get("warnings", []):
            if warning["type"] == "english_content":
                recommendations.append("请检查并翻译包含英文的内容")
            elif warning["type"] == "empty_translation":
                recommendations.append("请填充空的翻译内容")
        
        if not recommendations:
            recommendations.append("本地化状态良好，无需改进")
        
        return recommendations

# 全局本地化服务实例
localization_service = LocalizationService()

def get_localization_service() -> LocalizationService:
    """获取本地化服务实例"""
    return localization_service

def t(key: str, default: Optional[str] = None, **kwargs) -> str:
    """翻译函数的简写"""
    return localization_service.get_text(key, default, **kwargs)
