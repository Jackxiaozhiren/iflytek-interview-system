"""
性能监控中间件
提供请求响应时间监控、错误追踪、限流等功能
"""

import time
import logging
import traceback
from typing import Callable, Dict, Any
from datetime import datetime, timedelta
from collections import defaultdict, deque

from fastapi import Request, Response, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from ..services.system_monitor_service import get_system_monitor

logger = logging.getLogger(__name__)

class PerformanceMiddleware(BaseHTTPMiddleware):
    """性能监控中间件"""
    
    def __init__(self, app, enable_rate_limiting: bool = True, 
                 rate_limit_requests: int = 100, rate_limit_window: int = 60):
        super().__init__(app)
        self.enable_rate_limiting = enable_rate_limiting
        self.rate_limit_requests = rate_limit_requests
        self.rate_limit_window = rate_limit_window
        
        # 限流存储
        self.request_counts = defaultdict(lambda: deque())
        
        # 系统监控服务
        self.monitor = get_system_monitor()
        
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """处理请求"""
        start_time = time.time()
        client_ip = self._get_client_ip(request)
        
        try:
            # 限流检查
            if self.enable_rate_limiting and self._is_rate_limited(client_ip):
                return JSONResponse(
                    status_code=429,
                    content={
                        "error": "Rate limit exceeded",
                        "message": f"请求过于频繁，请在{self.rate_limit_window}秒后重试",
                        "retry_after": self.rate_limit_window
                    }
                )
            
            # 记录请求
            self._record_request(client_ip)
            
            # 处理请求
            response = await call_next(request)
            
            # 计算响应时间
            process_time = (time.time() - start_time) * 1000  # 转换为毫秒
            
            # 记录API调用指标
            self.monitor.record_api_call(
                endpoint=request.url.path,
                method=request.method,
                status_code=response.status_code,
                response_time_ms=process_time,
                user_agent=request.headers.get("user-agent"),
                ip_address=client_ip
            )
            
            # 添加性能头
            response.headers["X-Process-Time"] = str(process_time)
            response.headers["X-Timestamp"] = datetime.now().isoformat()
            
            return response
            
        except Exception as e:
            # 计算响应时间
            process_time = (time.time() - start_time) * 1000
            
            # 记录错误
            error_type = type(e).__name__
            error_message = str(e)
            stack_trace = traceback.format_exc()
            
            self.monitor.record_error(
                error_type=error_type,
                error_message=error_message,
                endpoint=request.url.path,
                stack_trace=stack_trace,
                user_context={
                    "method": request.method,
                    "ip_address": client_ip,
                    "user_agent": request.headers.get("user-agent"),
                    "query_params": dict(request.query_params)
                }
            )
            
            # 记录API调用（错误情况）
            status_code = 500
            if isinstance(e, HTTPException):
                status_code = e.status_code
                
            self.monitor.record_api_call(
                endpoint=request.url.path,
                method=request.method,
                status_code=status_code,
                response_time_ms=process_time,
                user_agent=request.headers.get("user-agent"),
                ip_address=client_ip
            )
            
            # 返回错误响应
            if isinstance(e, HTTPException):
                return JSONResponse(
                    status_code=e.status_code,
                    content={
                        "error": "HTTP Exception",
                        "message": e.detail,
                        "timestamp": datetime.now().isoformat()
                    }
                )
            else:
                logger.error(f"未处理的异常: {e}", exc_info=True)
                return JSONResponse(
                    status_code=500,
                    content={
                        "error": "Internal Server Error",
                        "message": "服务器内部错误，请稍后重试",
                        "timestamp": datetime.now().isoformat()
                    }
                )
    
    def _get_client_ip(self, request: Request) -> str:
        """获取客户端IP地址"""
        # 检查代理头
        forwarded_for = request.headers.get("X-Forwarded-For")
        if forwarded_for:
            return forwarded_for.split(",")[0].strip()
            
        real_ip = request.headers.get("X-Real-IP")
        if real_ip:
            return real_ip
            
        # 回退到直接连接IP
        return request.client.host if request.client else "unknown"
    
    def _is_rate_limited(self, client_ip: str) -> bool:
        """检查是否触发限流"""
        now = time.time()
        window_start = now - self.rate_limit_window
        
        # 清理过期的请求记录
        request_times = self.request_counts[client_ip]
        while request_times and request_times[0] < window_start:
            request_times.popleft()
        
        # 检查是否超过限制
        return len(request_times) >= self.rate_limit_requests
    
    def _record_request(self, client_ip: str):
        """记录请求时间"""
        self.request_counts[client_ip].append(time.time())

class CompressionMiddleware(BaseHTTPMiddleware):
    """响应压缩中间件"""
    
    def __init__(self, app, minimum_size: int = 1024):
        super().__init__(app)
        self.minimum_size = minimum_size
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """处理请求"""
        response = await call_next(request)
        
        # 检查是否需要压缩
        if self._should_compress(request, response):
            # 这里可以添加gzip压缩逻辑
            # 由于FastAPI已经内置了压缩支持，这里主要是示例
            response.headers["X-Compression"] = "enabled"
        
        return response
    
    def _should_compress(self, request: Request, response: Response) -> bool:
        """判断是否应该压缩响应"""
        # 检查Accept-Encoding头
        accept_encoding = request.headers.get("accept-encoding", "")
        if "gzip" not in accept_encoding:
            return False
        
        # 检查响应大小
        content_length = response.headers.get("content-length")
        if content_length and int(content_length) < self.minimum_size:
            return False
        
        # 检查内容类型
        content_type = response.headers.get("content-type", "")
        compressible_types = [
            "application/json",
            "text/html",
            "text/css",
            "text/javascript",
            "application/javascript"
        ]
        
        return any(ct in content_type for ct in compressible_types)

class CacheMiddleware(BaseHTTPMiddleware):
    """缓存中间件"""
    
    def __init__(self, app, cache_ttl: int = 300):
        super().__init__(app)
        self.cache_ttl = cache_ttl
        self.cache = {}
        self.cache_times = {}
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """处理请求"""
        # 只缓存GET请求
        if request.method != "GET":
            return await call_next(request)
        
        # 生成缓存键
        cache_key = self._generate_cache_key(request)
        
        # 检查缓存
        if self._is_cached(cache_key):
            cached_response = self.cache[cache_key]
            cached_response.headers["X-Cache"] = "HIT"
            return cached_response
        
        # 处理请求
        response = await call_next(request)
        
        # 缓存响应（仅缓存成功响应）
        if response.status_code == 200 and self._should_cache(request):
            self.cache[cache_key] = response
            self.cache_times[cache_key] = time.time()
            response.headers["X-Cache"] = "MISS"
        
        return response
    
    def _generate_cache_key(self, request: Request) -> str:
        """生成缓存键"""
        return f"{request.method}:{request.url.path}:{request.url.query}"
    
    def _is_cached(self, cache_key: str) -> bool:
        """检查是否已缓存且未过期"""
        if cache_key not in self.cache:
            return False
        
        cache_time = self.cache_times.get(cache_key, 0)
        return time.time() - cache_time < self.cache_ttl
    
    def _should_cache(self, request: Request) -> bool:
        """判断是否应该缓存"""
        # 不缓存包含认证信息的请求
        if request.headers.get("authorization"):
            return False
        
        # 可以添加更多缓存策略
        cacheable_paths = ["/api/v1/domains", "/api/v1/positions", "/health"]
        return any(request.url.path.startswith(path) for path in cacheable_paths)

class SecurityMiddleware(BaseHTTPMiddleware):
    """安全中间件"""
    
    def __init__(self, app):
        super().__init__(app)
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """处理请求"""
        response = await call_next(request)
        
        # 添加安全头
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        response.headers["Content-Security-Policy"] = "default-src 'self'"
        
        return response
