"""
错误处理和重试机制
提供统一的错误处理、重试逻辑和性能监控
"""

import asyncio
import functools
import logging
import time
from typing import Any, Callable, Dict, Optional, Type, Union
from enum import Enum

logger = logging.getLogger(__name__)

class ErrorType(Enum):
    """错误类型枚举"""
    NETWORK_ERROR = "network_error"
    TIMEOUT_ERROR = "timeout_error"
    AUTH_ERROR = "auth_error"
    RATE_LIMIT_ERROR = "rate_limit_error"
    SERVICE_ERROR = "service_error"
    VALIDATION_ERROR = "validation_error"
    UNKNOWN_ERROR = "unknown_error"

class RetryConfig:
    """重试配置"""
    def __init__(
        self,
        max_retries: int = 3,
        base_delay: float = 1.0,
        max_delay: float = 60.0,
        exponential_base: float = 2.0,
        jitter: bool = True
    ):
        self.max_retries = max_retries
        self.base_delay = base_delay
        self.max_delay = max_delay
        self.exponential_base = exponential_base
        self.jitter = jitter

class ErrorHandler:
    """错误处理器"""
    
    def __init__(self):
        self.error_stats = {
            "total_errors": 0,
            "error_by_type": {},
            "retry_stats": {
                "total_retries": 0,
                "successful_retries": 0,
                "failed_retries": 0
            }
        }
    
    def classify_error(self, error: Exception) -> ErrorType:
        """分类错误类型"""
        error_str = str(error).lower()
        error_type = type(error).__name__.lower()
        
        if "timeout" in error_str or "timeout" in error_type:
            return ErrorType.TIMEOUT_ERROR
        elif "network" in error_str or "connection" in error_str:
            return ErrorType.NETWORK_ERROR
        elif "auth" in error_str or "unauthorized" in error_str:
            return ErrorType.AUTH_ERROR
        elif "rate limit" in error_str or "too many requests" in error_str:
            return ErrorType.RATE_LIMIT_ERROR
        elif "service" in error_str or "server" in error_str:
            return ErrorType.SERVICE_ERROR
        elif "validation" in error_str or "invalid" in error_str:
            return ErrorType.VALIDATION_ERROR
        else:
            return ErrorType.UNKNOWN_ERROR
    
    def should_retry(self, error: Exception, attempt: int, max_retries: int) -> bool:
        """判断是否应该重试"""
        if attempt >= max_retries:
            return False
        
        error_type = self.classify_error(error)
        
        # 不重试的错误类型
        non_retryable_errors = {
            ErrorType.AUTH_ERROR,
            ErrorType.VALIDATION_ERROR
        }
        
        return error_type not in non_retryable_errors
    
    def calculate_delay(self, attempt: int, config: RetryConfig) -> float:
        """计算重试延迟"""
        delay = config.base_delay * (config.exponential_base ** attempt)
        delay = min(delay, config.max_delay)
        
        if config.jitter:
            import random
            delay *= (0.5 + random.random() * 0.5)  # 添加50%的随机抖动
        
        return delay
    
    def record_error(self, error: Exception):
        """记录错误统计"""
        self.error_stats["total_errors"] += 1
        error_type = self.classify_error(error)
        
        if error_type.value not in self.error_stats["error_by_type"]:
            self.error_stats["error_by_type"][error_type.value] = 0
        self.error_stats["error_by_type"][error_type.value] += 1
    
    def record_retry(self, success: bool):
        """记录重试统计"""
        self.error_stats["retry_stats"]["total_retries"] += 1
        if success:
            self.error_stats["retry_stats"]["successful_retries"] += 1
        else:
            self.error_stats["retry_stats"]["failed_retries"] += 1
    
    def get_stats(self) -> Dict[str, Any]:
        """获取错误统计"""
        return self.error_stats.copy()

# 全局错误处理器实例
error_handler = ErrorHandler()

def with_retry(
    config: Optional[RetryConfig] = None,
    exceptions: tuple = (Exception,),
    on_retry: Optional[Callable] = None,
    on_failure: Optional[Callable] = None
):
    """重试装饰器"""
    if config is None:
        config = RetryConfig()
    
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        async def async_wrapper(*args, **kwargs):
            last_exception = None
            
            for attempt in range(config.max_retries + 1):
                try:
                    start_time = time.time()
                    result = await func(*args, **kwargs)
                    
                    # 记录成功的重试
                    if attempt > 0:
                        error_handler.record_retry(True)
                        logger.info(f"函数 {func.__name__} 在第 {attempt + 1} 次尝试后成功")
                    
                    return result
                    
                except exceptions as e:
                    last_exception = e
                    error_handler.record_error(e)
                    
                    # 判断是否应该重试
                    if not error_handler.should_retry(e, attempt, config.max_retries):
                        logger.error(f"函数 {func.__name__} 遇到不可重试错误: {e}")
                        break
                    
                    if attempt < config.max_retries:
                        delay = error_handler.calculate_delay(attempt, config)
                        logger.warning(
                            f"函数 {func.__name__} 第 {attempt + 1} 次尝试失败: {e}, "
                            f"{delay:.2f}秒后重试"
                        )
                        
                        if on_retry:
                            await on_retry(e, attempt)
                        
                        await asyncio.sleep(delay)
                    else:
                        logger.error(f"函数 {func.__name__} 在 {config.max_retries} 次重试后仍然失败")
                        error_handler.record_retry(False)
            
            # 所有重试都失败了
            if on_failure:
                await on_failure(last_exception)
            
            raise last_exception
        
        @functools.wraps(func)
        def sync_wrapper(*args, **kwargs):
            # 同步版本的重试逻辑
            last_exception = None
            
            for attempt in range(config.max_retries + 1):
                try:
                    result = func(*args, **kwargs)
                    
                    if attempt > 0:
                        error_handler.record_retry(True)
                        logger.info(f"函数 {func.__name__} 在第 {attempt + 1} 次尝试后成功")
                    
                    return result
                    
                except exceptions as e:
                    last_exception = e
                    error_handler.record_error(e)
                    
                    if not error_handler.should_retry(e, attempt, config.max_retries):
                        logger.error(f"函数 {func.__name__} 遇到不可重试错误: {e}")
                        break
                    
                    if attempt < config.max_retries:
                        delay = error_handler.calculate_delay(attempt, config)
                        logger.warning(
                            f"函数 {func.__name__} 第 {attempt + 1} 次尝试失败: {e}, "
                            f"{delay:.2f}秒后重试"
                        )
                        
                        time.sleep(delay)
                    else:
                        logger.error(f"函数 {func.__name__} 在 {config.max_retries} 次重试后仍然失败")
                        error_handler.record_retry(False)
            
            raise last_exception
        
        # 根据函数类型返回相应的包装器
        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        else:
            return sync_wrapper
    
    return decorator

def with_timeout(timeout_seconds: float):
    """超时装饰器"""
    def decorator(func: Callable) -> Callable:
        @functools.wraps(func)
        async def async_wrapper(*args, **kwargs):
            try:
                return await asyncio.wait_for(func(*args, **kwargs), timeout=timeout_seconds)
            except asyncio.TimeoutError:
                logger.error(f"函数 {func.__name__} 执行超时 ({timeout_seconds}秒)")
                raise
        
        @functools.wraps(func)
        def sync_wrapper(*args, **kwargs):
            # 同步函数的超时处理比较复杂，这里简化处理
            return func(*args, **kwargs)
        
        if asyncio.iscoroutinefunction(func):
            return async_wrapper
        else:
            return sync_wrapper
    
    return decorator

def with_performance_monitoring(func: Callable) -> Callable:
    """性能监控装饰器"""
    @functools.wraps(func)
    async def async_wrapper(*args, **kwargs):
        start_time = time.time()
        try:
            result = await func(*args, **kwargs)
            execution_time = time.time() - start_time
            logger.debug(f"函数 {func.__name__} 执行时间: {execution_time:.3f}秒")
            return result
        except Exception as e:
            execution_time = time.time() - start_time
            logger.error(f"函数 {func.__name__} 执行失败 (耗时: {execution_time:.3f}秒): {e}")
            raise
    
    @functools.wraps(func)
    def sync_wrapper(*args, **kwargs):
        start_time = time.time()
        try:
            result = func(*args, **kwargs)
            execution_time = time.time() - start_time
            logger.debug(f"函数 {func.__name__} 执行时间: {execution_time:.3f}秒")
            return result
        except Exception as e:
            execution_time = time.time() - start_time
            logger.error(f"函数 {func.__name__} 执行失败 (耗时: {execution_time:.3f}秒): {e}")
            raise
    
    if asyncio.iscoroutinefunction(func):
        return async_wrapper
    else:
        return sync_wrapper

# 导出
__all__ = [
    "ErrorType", "RetryConfig", "ErrorHandler", "error_handler",
    "with_retry", "with_timeout", "with_performance_monitoring"
]
