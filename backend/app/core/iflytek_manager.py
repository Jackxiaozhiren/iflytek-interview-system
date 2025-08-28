"""
iFlytek Spark LLM 连接管理器
提供稳定的连接管理、错误处理和性能优化
"""

import asyncio
import json
import logging
import time
from typing import Dict, Any, Optional, Callable
from contextlib import asynccontextmanager
import websockets
from websockets.exceptions import ConnectionClosed, WebSocketException
import ssl
import certifi

from .config import iflytek_config, settings

logger = logging.getLogger(__name__)

class IFlytekConnectionManager:
    """iFlytek Spark LLM 增强连接管理器"""

    def __init__(self):
        self.config = iflytek_config
        self.connection_pool = {}
        self.connection_stats = {
            "total_connections": 0,
            "active_connections": 0,
            "failed_connections": 0,
            "total_requests": 0,
            "successful_requests": 0,
            "failed_requests": 0,
            "average_response_time": 0.0,
            "cache_hits": 0,
            "cache_misses": 0
        }
        self.response_times = []
        self.max_response_times = 100  # 保留最近100次响应时间
        self.request_cache = {}  # 请求缓存
        self.cache_timestamps = {}  # 缓存时间戳
        self.heartbeat_tasks = {}  # 心跳任务
    
    async def create_connection(self, connection_id: str = None) -> Optional[websockets.WebSocketServerProtocol]:
        """创建新的WebSocket连接"""
        if not self.config.is_configured:
            logger.warning("iFlytek配置未完成，无法创建连接")
            return None
        
        connection_id = connection_id or f"conn_{int(time.time())}"
        
        try:
            # 创建SSL上下文
            ssl_context = ssl.create_default_context(cafile=certifi.where())
            
            # 构建连接URL
            url = self._build_connection_url()
            
            # 创建连接
            websocket = await websockets.connect(
                url,
                ssl=ssl_context,
                ping_interval=20,
                ping_timeout=10,
                close_timeout=10
            )
            
            self.connection_pool[connection_id] = {
                "websocket": websocket,
                "created_at": time.time(),
                "last_used": time.time(),
                "request_count": 0,
                "status": "active"
            }

            # 启动心跳检测
            if hasattr(self.config.settings, 'iflytek_heartbeat_interval') and self.config.settings.iflytek_heartbeat_interval > 0:
                self.heartbeat_tasks[connection_id] = asyncio.create_task(
                    self._heartbeat_monitor(connection_id)
                )
            
            self.connection_stats["total_connections"] += 1
            self.connection_stats["active_connections"] += 1
            
            logger.info(f"iFlytek连接创建成功: {connection_id}")
            return websocket
            
        except Exception as e:
            self.connection_stats["failed_connections"] += 1
            logger.error(f"创建iFlytek连接失败: {e}")
            return None
    
    async def get_connection(self, connection_id: str = None) -> Optional[websockets.WebSocketServerProtocol]:
        """获取可用连接"""
        # 如果指定了连接ID，尝试获取该连接
        if connection_id and connection_id in self.connection_pool:
            conn_info = self.connection_pool[connection_id]
            websocket = conn_info["websocket"]
            
            # 检查连接是否仍然有效
            if not websocket.closed:
                conn_info["last_used"] = time.time()
                return websocket
            else:
                # 连接已关闭，从池中移除
                await self._remove_connection(connection_id)
        
        # 寻找可用的连接
        for conn_id, conn_info in list(self.connection_pool.items()):
            websocket = conn_info["websocket"]
            if not websocket.closed:
                conn_info["last_used"] = time.time()
                return websocket
            else:
                await self._remove_connection(conn_id)
        
        # 没有可用连接，创建新连接
        return await self.create_connection()
    
    async def send_request(self, message: Dict[str, Any], connection_id: str = None) -> Optional[Dict[str, Any]]:
        """发送请求并获取响应"""
        start_time = time.time()
        self.connection_stats["total_requests"] += 1
        
        try:
            websocket = await self.get_connection(connection_id)
            if not websocket:
                raise Exception("无法获取有效连接")
            
            # 发送消息
            await websocket.send(json.dumps(message, ensure_ascii=False))
            
            # 接收响应
            response_text = await asyncio.wait_for(
                websocket.recv(),
                timeout=self.config.settings.iflytek_timeout
            )
            
            response = json.loads(response_text)
            
            # 更新统计信息
            response_time = time.time() - start_time
            self._update_response_time(response_time)
            self.connection_stats["successful_requests"] += 1
            
            logger.debug(f"iFlytek请求成功，响应时间: {response_time:.2f}s")
            return response
            
        except asyncio.TimeoutError:
            self.connection_stats["failed_requests"] += 1
            logger.error("iFlytek请求超时")
            return None
            
        except (ConnectionClosed, WebSocketException) as e:
            self.connection_stats["failed_requests"] += 1
            logger.error(f"iFlytek连接错误: {e}")
            # 移除失效连接
            if connection_id:
                await self._remove_connection(connection_id)
            return None
            
        except Exception as e:
            self.connection_stats["failed_requests"] += 1
            logger.error(f"iFlytek请求失败: {e}")
            return None
    
    async def send_request_with_retry(self, message: Dict[str, Any], max_retries: int = None) -> Optional[Dict[str, Any]]:
        """带重试机制的请求发送"""
        max_retries = max_retries or self.config.settings.iflytek_retry_times
        retry_delay = self.config.settings.iflytek_retry_delay
        
        for attempt in range(max_retries + 1):
            try:
                response = await self.send_request(message)
                if response:
                    return response
                
                if attempt < max_retries:
                    logger.warning(f"iFlytek请求失败，{retry_delay}秒后重试 (第{attempt + 1}次)")
                    await asyncio.sleep(retry_delay)
                    retry_delay *= 2  # 指数退避
                    
            except Exception as e:
                logger.error(f"iFlytek请求异常 (第{attempt + 1}次): {e}")
                if attempt < max_retries:
                    await asyncio.sleep(retry_delay)
                    retry_delay *= 2
        
        logger.error(f"iFlytek请求最终失败，已重试{max_retries}次")
        return None
    
    @asynccontextmanager
    async def get_managed_connection(self):
        """获取托管连接的上下文管理器"""
        connection_id = f"managed_{int(time.time())}"
        websocket = None
        
        try:
            websocket = await self.create_connection(connection_id)
            yield websocket
        finally:
            if connection_id in self.connection_pool:
                await self._remove_connection(connection_id)
    
    async def _remove_connection(self, connection_id: str):
        """移除连接"""
        if connection_id in self.connection_pool:
            conn_info = self.connection_pool[connection_id]
            websocket = conn_info["websocket"]
            
            try:
                if not websocket.closed:
                    await websocket.close()
            except Exception as e:
                logger.warning(f"关闭连接时出错: {e}")
            
            del self.connection_pool[connection_id]
            self.connection_stats["active_connections"] = max(0, self.connection_stats["active_connections"] - 1)
            
            logger.debug(f"连接已移除: {connection_id}")
    
    def _build_connection_url(self) -> str:
        """构建连接URL"""
        base_url = self.config.settings.iflytek_spark_url
        params = {
            "authorization": self._generate_auth_header(),
            "date": self._get_rfc1123_date(),
            "host": "spark-api.xf-yun.com"
        }
        
        # 这里应该实现正确的URL签名逻辑
        # 为了简化，暂时返回基础URL
        return base_url
    
    def _generate_auth_header(self) -> str:
        """生成认证头"""
        # 这里应该实现iFlytek的认证逻辑
        # 为了简化，返回空字符串
        return ""
    
    def _get_rfc1123_date(self) -> str:
        """获取RFC1123格式的日期"""
        from email.utils import formatdate
        return formatdate(timeval=None, localtime=False, usegmt=True)
    
    def _update_response_time(self, response_time: float):
        """更新响应时间统计"""
        self.response_times.append(response_time)
        if len(self.response_times) > self.max_response_times:
            self.response_times.pop(0)
        
        # 计算平均响应时间
        if self.response_times:
            self.connection_stats["average_response_time"] = sum(self.response_times) / len(self.response_times)
    
    async def cleanup_idle_connections(self, max_idle_time: int = 300):
        """清理空闲连接"""
        current_time = time.time()
        idle_connections = []
        
        for conn_id, conn_info in self.connection_pool.items():
            if current_time - conn_info["last_used"] > max_idle_time:
                idle_connections.append(conn_id)
        
        for conn_id in idle_connections:
            await self._remove_connection(conn_id)
            logger.info(f"清理空闲连接: {conn_id}")
    
    async def close_all_connections(self):
        """关闭所有连接"""
        connection_ids = list(self.connection_pool.keys())
        for conn_id in connection_ids:
            await self._remove_connection(conn_id)
        
        logger.info("所有iFlytek连接已关闭")
    
    def get_stats(self) -> Dict[str, Any]:
        """获取连接统计信息"""
        return {
            **self.connection_stats,
            "active_connection_count": len(self.connection_pool),
            "success_rate": (
                self.connection_stats["successful_requests"] /
                max(1, self.connection_stats["total_requests"])
            ) * 100,
            "cache_hit_rate": (
                self.connection_stats["cache_hits"] /
                max(1, self.connection_stats["cache_hits"] + self.connection_stats["cache_misses"])
            ) * 100 if hasattr(self, 'request_cache') else 0
        }

    async def _heartbeat_monitor(self, connection_id: str):
        """心跳监控"""
        try:
            while connection_id in self.connection_pool:
                await asyncio.sleep(self.config.settings.iflytek_heartbeat_interval)

                conn_info = self.connection_pool.get(connection_id)
                if not conn_info:
                    break

                websocket = conn_info["websocket"]
                try:
                    # 发送心跳包
                    await websocket.ping()
                    logger.debug(f"心跳检测成功: {connection_id}")
                except Exception as e:
                    logger.warning(f"心跳检测失败: {connection_id}, {e}")
                    await self.close_connection(connection_id)
                    break
        except Exception as e:
            logger.error(f"心跳监控异常: {connection_id}, {e}")

    async def _cleanup_idle_connections(self):
        """清理空闲连接"""
        current_time = time.time()
        idle_connections = []

        for conn_id, conn_info in self.connection_pool.items():
            # 如果连接空闲超过5分钟，标记为待清理
            if current_time - conn_info["last_used"] > 300:
                idle_connections.append(conn_id)

        for conn_id in idle_connections:
            await self.close_connection(conn_id)
            logger.info(f"清理空闲连接: {conn_id}")

    def _get_cache_key(self, request_data: dict) -> str:
        """生成缓存键"""
        import hashlib
        import json

        # 移除时间戳等动态字段
        cache_data = {k: v for k, v in request_data.items()
                     if k not in ['timestamp', 'request_id']}

        cache_str = json.dumps(cache_data, sort_keys=True)
        return hashlib.md5(cache_str.encode()).hexdigest()

    def _is_cache_valid(self, cache_key: str) -> bool:
        """检查缓存是否有效"""
        if not hasattr(self.config.settings, 'iflytek_enable_cache') or not self.config.settings.iflytek_enable_cache:
            return False

        if cache_key not in self.cache_timestamps:
            return False

        cache_time = self.cache_timestamps[cache_key]
        ttl = getattr(self.config.settings, 'iflytek_cache_ttl', 300)

        return time.time() - cache_time < ttl

    def get_cached_response(self, request_data: dict) -> Optional[dict]:
        """获取缓存响应"""
        cache_key = self._get_cache_key(request_data)

        if self._is_cache_valid(cache_key):
            self.connection_stats["cache_hits"] += 1
            logger.debug(f"缓存命中: {cache_key}")
            return self.request_cache[cache_key]

        self.connection_stats["cache_misses"] += 1
        return None

    def cache_response(self, request_data: dict, response_data: dict):
        """缓存响应"""
        if not hasattr(self.config.settings, 'iflytek_enable_cache') or not self.config.settings.iflytek_enable_cache:
            return

        cache_key = self._get_cache_key(request_data)
        self.request_cache[cache_key] = response_data
        self.cache_timestamps[cache_key] = time.time()

        # 限制缓存大小
        if len(self.request_cache) > 1000:
            # 删除最旧的缓存项
            oldest_key = min(self.cache_timestamps.keys(),
                           key=lambda k: self.cache_timestamps[k])
            del self.request_cache[oldest_key]
            del self.cache_timestamps[oldest_key]

# 全局连接管理器实例
connection_manager = IFlytekConnectionManager()

# 导出
__all__ = ["IFlytekConnectionManager", "connection_manager"]
