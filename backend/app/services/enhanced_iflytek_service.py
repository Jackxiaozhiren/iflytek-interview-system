"""
增强的iFlytek Spark大模型服务
提供稳定的API调用、错误处理、重试机制和性能优化
"""

import asyncio
import json
import logging
import time
import hmac
import hashlib
import base64
import urllib.parse
from typing import Dict, List, Any, Optional
from datetime import datetime, timedelta
from functools import lru_cache
import weakref

import aiohttp
import websockets

from ..core.config import Settings, IFlytekConfig

logger = logging.getLogger(__name__)

# 全局连接池管理
_connection_pools = weakref.WeakValueDictionary()

# 响应缓存
class ResponseCache:
    """简单的响应缓存机制"""
    def __init__(self, max_size: int = 100, ttl_seconds: int = 300):
        self.cache = {}
        self.max_size = max_size
        self.ttl_seconds = ttl_seconds

    def _generate_key(self, messages: List[Dict], **kwargs) -> str:
        """生成缓存键"""
        content = json.dumps(messages, sort_keys=True, ensure_ascii=False)
        params = json.dumps(kwargs, sort_keys=True)
        return hashlib.md5(f"{content}:{params}".encode()).hexdigest()

    def get(self, messages: List[Dict], **kwargs) -> Optional[Dict]:
        """获取缓存"""
        key = self._generate_key(messages, **kwargs)
        if key in self.cache:
            data, timestamp = self.cache[key]
            if time.time() - timestamp < self.ttl_seconds:
                return data
            else:
                del self.cache[key]
        return None

    def set(self, messages: List[Dict], response: Dict, **kwargs):
        """设置缓存"""
        if len(self.cache) >= self.max_size:
            # 删除最旧的缓存项
            oldest_key = min(self.cache.keys(), key=lambda k: self.cache[k][1])
            del self.cache[oldest_key]

        key = self._generate_key(messages, **kwargs)
        self.cache[key] = (response, time.time())

    def clear(self):
        """清空缓存"""
        self.cache.clear()

class EnhancedIFlytekService:
    """增强的iFlytek Spark服务"""

    def __init__(self, settings: Settings):
        self.settings = settings
        self.config = IFlytekConfig(settings)
        self.session_pool = {}

        # 初始化缓存
        self.response_cache = ResponseCache(max_size=200, ttl_seconds=600)  # 10分钟缓存

        # 连接池配置
        self.connector = None
        self.session = None

        # 健康检查
        self.health_status = {
            'is_healthy': True,
            'last_check': None,
            'consecutive_failures': 0,
            'max_failures': 5,
            'last_error': None
        }

        # 性能统计
        self.stats = {
            'total_requests': 0,
            'successful_requests': 0,
            'failed_requests': 0,
            'cache_hits': 0,
            'average_response_time': 0.0,
            'last_request_time': None,
            'connection_errors': 0,
            'timeout_errors': 0,
            'rate_limit_errors': 0,
            'server_errors': 0
        }

        # 错误恢复策略
        self.recovery_strategies = {
            'connection_error': self._handle_connection_error,
            'timeout_error': self._handle_timeout_error,
            'rate_limit_error': self._handle_rate_limit_error,
            'server_error': self._handle_server_error
        }

    async def _get_session(self) -> aiohttp.ClientSession:
        """获取或创建HTTP会话"""
        if self.session is None or self.session.closed:
            # 创建优化的连接器
            self.connector = aiohttp.TCPConnector(
                limit=self.settings.iflytek_max_connections,
                limit_per_host=20,
                ttl_dns_cache=300,
                use_dns_cache=True,
                keepalive_timeout=60,
                enable_cleanup_closed=True,
                force_close=False,
                ssl=False  # 根据需要调整
            )

            # 创建会话
            timeout = aiohttp.ClientTimeout(
                total=self.settings.iflytek_timeout,
                connect=15,
                sock_read=45
            )

            self.session = aiohttp.ClientSession(
                connector=self.connector,
                timeout=timeout,
                headers={
                    'User-Agent': 'iFlytek-Interview-System/2.0',
                    'Accept': 'application/json',
                    'Accept-Encoding': 'gzip, deflate'
                }
            )

            logger.info("创建新的iFlytek HTTP会话")

        return self.session

    async def _ensure_session_health(self):
        """确保会话健康"""
        try:
            if self.session and not self.session.closed:
                # 检查连接器状态
                if self.connector and self.connector.closed:
                    logger.warning("连接器已关闭，重新创建会话")
                    await self.session.close()
                    self.session = None

        except Exception as e:
            logger.error(f"检查会话健康状态时出错: {e}")
            if self.session:
                await self.session.close()
            self.session = None

    async def _cleanup_connections(self):
        """清理连接"""
        try:
            if self.session and not self.session.closed:
                await self.session.close()
                logger.info("HTTP会话已关闭")

            if self.connector and not self.connector.closed:
                await self.connector.close()
                logger.info("连接器已关闭")

        except Exception as e:
            logger.error(f"清理连接时出错: {e}")
        finally:
            self.session = None
            self.connector = None

    async def close(self):
        """关闭连接和清理资源"""
        if self.session and not self.session.closed:
            await self.session.close()
            logger.info("iFlytek HTTP会话已关闭")

        if self.connector:
            await self.connector.close()
            logger.info("iFlytek连接器已关闭")

        self.response_cache.clear()
        logger.info("iFlytek服务资源已清理")

    def get_stats(self) -> Dict[str, Any]:
        """获取性能统计"""
        stats = self.stats.copy()
        stats['health_status'] = self.health_status.copy()
        stats['cache_size'] = len(self.response_cache.cache)
        stats['success_rate'] = (
            self.stats['successful_requests'] / max(self.stats['total_requests'], 1) * 100
        )
        return stats

    def reset_stats(self):
        """重置性能统计"""
        self.stats = {
            'total_requests': 0,
            'successful_requests': 0,
            'failed_requests': 0,
            'cache_hits': 0,
            'average_response_time': 0.0,
            'last_request_time': None,
            'connection_errors': 0,
            'timeout_errors': 0,
            'rate_limit_errors': 0,
            'server_errors': 0
        }
        self.health_status['consecutive_failures'] = 0
        self.health_status['is_healthy'] = True
        self.health_status['last_error'] = None

    async def health_check(self) -> Dict[str, Any]:
        """执行健康检查"""
        try:
            start_time = time.time()

            # 简单的ping测试
            test_messages = [{"role": "user", "content": "ping"}]
            response = await self.chat_with_spark(test_messages, max_retries=1, use_cache=False)

            response_time = time.time() - start_time

            if response.get("status") == "success":
                self._update_health_status(True)
                return {
                    "status": "healthy",
                    "response_time": response_time,
                    "timestamp": datetime.now().isoformat(),
                    "details": self.health_status
                }
            else:
                self._update_health_status(False, "健康检查响应异常")
                return {
                    "status": "unhealthy",
                    "response_time": response_time,
                    "timestamp": datetime.now().isoformat(),
                    "details": self.health_status
                }

        except Exception as e:
            self._update_health_status(False, str(e))
            return {
                "status": "unhealthy",
                "error": str(e),
                "timestamp": datetime.now().isoformat(),
                "details": self.health_status
            }

    async def get_performance_metrics(self) -> Dict[str, Any]:
        """获取详细的性能指标"""
        return {
            "stats": self.get_stats(),
            "health": await self.health_check(),
            "cache_info": {
                "size": len(self.response_cache.cache),
                "hit_rate": (
                    self.stats['cache_hits'] / max(self.stats['total_requests'], 1) * 100
                )
            },
            "connection_info": {
                "session_active": self.session is not None and not self.session.closed,
                "connector_active": self.connector is not None and not self.connector.closed
            }
        }
        
    async def initialize(self):
        """初始化服务"""
        if self.config.is_configured:
            logger.info("iFlytek Spark服务初始化成功")
            await self._test_connection()
        else:
            logger.warning("iFlytek配置不完整，将使用模拟模式")
    
    async def _test_connection(self):
        """测试连接"""
        try:
            test_messages = [{"role": "user", "content": "测试连接"}]
            response = await self.chat_with_spark(test_messages, max_retries=1)
            if response.get("status") == "success":
                logger.info("iFlytek Spark连接测试成功")
                self.health_status['is_healthy'] = True
                self.health_status['consecutive_failures'] = 0
            else:
                logger.warning("iFlytek Spark连接测试失败，将使用模拟模式")
                self._update_health_status(False, "连接测试失败")
        except Exception as e:
            logger.error(f"iFlytek Spark连接测试异常: {e}")
            self._update_health_status(False, str(e))

    def _update_health_status(self, is_healthy: bool, error_msg: str = None):
        """更新健康状态"""
        self.health_status['last_check'] = datetime.now().isoformat()

        if not is_healthy:
            self.health_status['consecutive_failures'] += 1
            self.health_status['last_error'] = error_msg

            if self.health_status['consecutive_failures'] >= self.health_status['max_failures']:
                self.health_status['is_healthy'] = False
                logger.error(f"iFlytek服务健康检查失败，连续失败次数: {self.health_status['consecutive_failures']}")
        else:
            self.health_status['is_healthy'] = True
            self.health_status['consecutive_failures'] = 0
            self.health_status['last_error'] = None

    async def _handle_connection_error(self, error: Exception) -> Dict[str, Any]:
        """处理连接错误"""
        self.stats['connection_errors'] += 1
        logger.warning(f"连接错误，尝试重新建立连接: {error}")

        # 关闭现有连接
        if self.session and not self.session.closed:
            await self.session.close()
        self.session = None

        # 等待一段时间后重试
        await asyncio.sleep(2)

        return {
            "status": "error",
            "error_type": "connection_error",
            "message": "连接失败，已尝试重新连接",
            "timestamp": datetime.now().isoformat()
        }

    async def _handle_timeout_error(self, error: Exception) -> Dict[str, Any]:
        """处理超时错误"""
        self.stats['timeout_errors'] += 1
        logger.warning(f"请求超时: {error}")

        return {
            "status": "error",
            "error_type": "timeout_error",
            "message": "请求超时，请稍后重试",
            "timestamp": datetime.now().isoformat()
        }

    async def _handle_rate_limit_error(self, error: Exception) -> Dict[str, Any]:
        """处理速率限制错误"""
        self.stats['rate_limit_errors'] += 1
        logger.warning(f"触发速率限制: {error}")

        # 增加延迟时间
        await asyncio.sleep(5)

        return {
            "status": "error",
            "error_type": "rate_limit_error",
            "message": "请求过于频繁，请稍后重试",
            "timestamp": datetime.now().isoformat()
        }

    async def _handle_server_error(self, error: Exception) -> Dict[str, Any]:
        """处理服务器错误"""
        self.stats['server_errors'] += 1
        logger.error(f"服务器错误: {error}")

        return {
            "status": "error",
            "error_type": "server_error",
            "message": "服务器暂时不可用，请稍后重试",
            "timestamp": datetime.now().isoformat()
        }
    
    async def chat_with_spark(self, messages: List[Dict[str, str]], **kwargs) -> Dict[str, Any]:
        """
        与iFlytek Spark大模型对话 - 增强版本
        支持重试机制、缓存、错误处理和性能统计
        """
        start_time = time.time()
        self.stats['total_requests'] += 1

        max_retries = kwargs.get('max_retries', 3)
        retry_delay = kwargs.get('retry_delay', 1)

        for attempt in range(max_retries):
            try:
                # 检查配置 - 强制尝试真实API调用
                if not self.config.is_configured:
                    logger.warning("iFlytek配置不完整，但仍尝试调用真实API")
                    # 不直接返回模拟响应，继续尝试API调用

                # 速率限制
                await self._rate_limit()

                # 检查增强缓存
                use_cache = kwargs.get('use_cache', True)
                if use_cache:
                    cached_response = self.response_cache.get(messages, **kwargs)
                    if cached_response:
                        self.stats['cache_hits'] += 1
                        logger.info("使用增强缓存响应")
                        return {
                            **cached_response,
                            "from_cache": True,
                            "timestamp": datetime.now().isoformat()
                        }

                # 调用API
                if self.settings.iflytek_spark_http_url:
                    response = await self._call_http_api(messages, **kwargs)
                else:
                    response = await self._call_websocket_api(messages, **kwargs)

                # 更新统计信息
                response_time = time.time() - start_time
                self.stats['successful_requests'] += 1
                self.stats['last_request_time'] = datetime.now().isoformat()

                # 更新平均响应时间
                if self.stats['successful_requests'] > 0:
                    self.stats['average_response_time'] = (
                        (self.stats['average_response_time'] * (self.stats['successful_requests'] - 1) + response_time) /
                        self.stats['successful_requests']
                    )

                # 缓存响应到增强缓存
                if use_cache and response.get('status') == 'success':
                    self.response_cache.set(messages, response, **kwargs)

                # 兼容旧缓存
                if hasattr(self.settings, 'iflytek_enable_cache') and self.settings.iflytek_enable_cache:
                    cache_key = self._generate_cache_key(messages)
                    self.request_cache[cache_key] = {
                        "data": response,
                        "timestamp": time.time()
                    }

                return response

            except aiohttp.ClientConnectorError as e:
                self.stats['failed_requests'] += 1
                logger.warning(f"iFlytek Spark连接失败 (尝试 {attempt + 1}/{max_retries}): {e}")

                if attempt < max_retries - 1:
                    await self._handle_connection_error(e)
                    await asyncio.sleep(retry_delay * (2 ** attempt))  # 指数退避
                    continue
                else:
                    self._update_health_status(False, f"连接失败: {e}")
                    return await self._handle_connection_error(e)

            except asyncio.TimeoutError as e:
                self.stats['failed_requests'] += 1
                logger.warning(f"iFlytek Spark请求超时 (尝试 {attempt + 1}/{max_retries}): {e}")

                if attempt < max_retries - 1:
                    await asyncio.sleep(retry_delay * (2 ** attempt))
                    continue
                else:
                    return await self._handle_timeout_error(e)

            except aiohttp.ClientResponseError as e:
                self.stats['failed_requests'] += 1

                if e.status == 429:  # 速率限制
                    logger.warning(f"iFlytek Spark速率限制 (尝试 {attempt + 1}/{max_retries})")
                    if attempt < max_retries - 1:
                        await self._handle_rate_limit_error(e)
                        continue
                    else:
                        return await self._handle_rate_limit_error(e)
                elif e.status >= 500:  # 服务器错误
                    logger.error(f"iFlytek Spark服务器错误 {e.status} (尝试 {attempt + 1}/{max_retries})")
                    if attempt < max_retries - 1:
                        await asyncio.sleep(retry_delay * (2 ** attempt))
                        continue
                    else:
                        return await self._handle_server_error(e)
                else:
                    logger.error(f"iFlytek Spark客户端错误 {e.status}: {e}")
                    return {
                        "status": "error",
                        "error_type": "client_error",
                        "message": f"客户端错误: {e.status}",
                        "timestamp": datetime.now().isoformat()
                    }

            except Exception as e:
                self.stats['failed_requests'] += 1
                logger.error(f"iFlytek Spark未知错误 (尝试 {attempt + 1}/{max_retries}): {e}")

                if attempt < max_retries - 1:
                    await asyncio.sleep(retry_delay * (2 ** attempt))
                    continue
                else:
                    self._update_health_status(False, f"未知错误: {e}")
                    return {
                        "status": "error",
                        "error_type": "unknown_error",
                        "message": f"未知错误: {str(e)}",
                        "timestamp": datetime.now().isoformat()
                    }

        # 如果所有重试都失败，返回模拟响应
        self.stats['failed_requests'] += 1
        return await self._get_mock_response(messages)
    
    async def _call_http_api(self, messages: List[Dict[str, str]], **kwargs) -> Dict[str, Any]:
        """HTTP API调用 - 增强版本，支持重试和连接池优化"""
        max_retries = kwargs.get('max_retries', 3)
        retry_delay = kwargs.get('retry_delay', 1.0)

        for attempt in range(max_retries):
            try:
                # 确保会话健康
                await self._ensure_session_health()

                # 构建请求头
                timestamp = str(int(time.time()))
                signature = self._generate_signature(timestamp)

                headers = {
                    'Content-Type': 'application/json',
                    'Authorization': f'Bearer {self.settings.iflytek_api_key}',
                    'X-Spark-Appid': self.settings.iflytek_app_id,
                    'X-Timestamp': timestamp,
                    'X-Signature': signature,
                    'User-Agent': 'iFlytek-Interview-System/2.0',
                    'Accept': 'application/json',
                    'Connection': 'keep-alive'
                }

                # 构建请求体
                payload = {
                    'model': kwargs.get('model', 'spark-3.5'),
                    'messages': messages,
                    'max_tokens': kwargs.get('max_tokens', self.settings.iflytek_max_tokens),
                    'temperature': kwargs.get('temperature', self.settings.iflytek_temperature),
                    'stream': False,
                    'top_p': kwargs.get('top_p', 0.9),
                    'frequency_penalty': kwargs.get('frequency_penalty', 0.0),
                    'presence_penalty': kwargs.get('presence_penalty', 0.0)
                }

                # 优化的超时配置
                timeout = aiohttp.ClientTimeout(
                    total=self.settings.iflytek_timeout,
                    connect=10,  # 连接超时
                    sock_read=30  # 读取超时
                )

                # 优化的连接器配置
                connector = aiohttp.TCPConnector(
                    limit=self.settings.iflytek_max_connections,
                    limit_per_host=10,
                    ttl_dns_cache=300,  # DNS缓存5分钟
                    use_dns_cache=True,
                    keepalive_timeout=30,
                    enable_cleanup_closed=True
                )

                # 使用共享会话
                session = await self._get_session()
                start_time = time.time()

                async with session.post(
                    self.settings.iflytek_spark_http_url,
                    headers=headers,
                    json=payload,
                    ssl=False  # 如果有SSL问题可以设置为False
                ) as response:
                    response_time = time.time() - start_time

                    if response.status == 200:
                        result = await response.json()
                        content = result.get('choices', [{}])[0].get('message', {}).get('content', '')

                        # 记录成功的API调用
                        logger.info(f"iFlytek API调用成功: 响应时间={response_time:.2f}s, 内容长度={len(content)}")

                        return {
                            "content": content,
                            "status": "success",
                            "timestamp": datetime.now().isoformat(),
                            "model": payload['model'],
                            "usage": result.get('usage', {}),
                            "response_time": response_time,
                            "attempt": attempt + 1
                        }
                    else:
                        error_text = await response.text()
                        logger.warning(f"iFlytek API调用失败 (尝试 {attempt + 1}/{max_retries}): {response.status} - {error_text}")

                        # 如果是最后一次尝试，抛出异常
                        if attempt == max_retries - 1:
                            raise aiohttp.ClientError(f"HTTP {response.status}: {error_text}")

                        # 等待后重试
                        await asyncio.sleep(retry_delay * (attempt + 1))

            except asyncio.TimeoutError:
                logger.warning(f"iFlytek API超时 (尝试 {attempt + 1}/{max_retries})")
                if attempt == max_retries - 1:
                    raise
                await asyncio.sleep(retry_delay * (attempt + 1))

            except aiohttp.ClientError as e:
                logger.warning(f"iFlytek API网络错误 (尝试 {attempt + 1}/{max_retries}): {e}")
                if attempt == max_retries - 1:
                    raise
                await asyncio.sleep(retry_delay * (attempt + 1))

            except Exception as e:
                logger.error(f"iFlytek API未知错误 (尝试 {attempt + 1}/{max_retries}): {e}")
                if attempt == max_retries - 1:
                    raise
                await asyncio.sleep(retry_delay * (attempt + 1))
    
    async def _call_websocket_api(self, messages: List[Dict[str, str]], **kwargs) -> Dict[str, Any]:
        """WebSocket API调用"""
        try:
            # 构建WebSocket URL
            ws_url = self._build_websocket_url()
            
            # 构建请求参数
            params = self._gen_params(messages, **kwargs)
            
            # 连接WebSocket
            async with websockets.connect(
                ws_url,
                ping_interval=self.settings.iflytek_heartbeat_interval,
                ping_timeout=10,
                close_timeout=10
            ) as websocket:
                # 发送请求
                await websocket.send(json.dumps(params))
                
                # 接收响应
                response_text = ""
                async for message in websocket:
                    data = json.loads(message)
                    code = data.get('header', {}).get('code', -1)
                    
                    if code != 0:
                        error_msg = data.get('header', {}).get('message', '未知错误')
                        logger.error(f"WebSocket API错误: {code} - {error_msg}")
                        raise websockets.exceptions.ConnectionClosedError(None, None)
                    
                    # 提取文本内容
                    choices = data.get('payload', {}).get('choices', {}).get('text', [])
                    for choice in choices:
                        response_text += choice.get('content', '')
                    
                    # 检查是否结束
                    status = data.get('header', {}).get('status', 0)
                    if status == 2:  # 结束
                        break
                
                return {
                    "content": response_text,
                    "status": "success",
                    "timestamp": datetime.now().isoformat(),
                    "model": "spark-websocket"
                }
                
        except Exception as e:
            logger.error(f"WebSocket API调用异常: {e}")
            raise
    
    def _generate_signature(self, timestamp: str) -> str:
        """生成API签名"""
        try:
            # 构建签名字符串
            sign_string = f"{self.settings.iflytek_app_id}{timestamp}"
            
            # 使用HMAC-SHA256生成签名
            signature = hmac.new(
                self.settings.iflytek_api_secret.encode('utf-8'),
                sign_string.encode('utf-8'),
                hashlib.sha256
            ).digest()
            
            # Base64编码
            return base64.b64encode(signature).decode('utf-8')
        except Exception as e:
            logger.error(f"签名生成失败: {e}")
            return ""
    
    def _build_websocket_url(self) -> str:
        """构建WebSocket连接URL"""
        try:
            # 时间戳
            timestamp = str(int(time.time()))
            
            # 构建签名
            signature_origin = f"host: spark-api.xf-yun.com\ndate: {timestamp}\nGET /v3.5/chat HTTP/1.1"
            signature_sha = hmac.new(
                self.settings.iflytek_api_secret.encode('utf-8'),
                signature_origin.encode('utf-8'),
                hashlib.sha256
            ).digest()
            signature_sha_base64 = base64.b64encode(signature_sha).decode('utf-8')
            
            authorization_origin = f'api_key="{self.settings.iflytek_api_key}", algorithm="hmac-sha256", headers="host date request-line", signature="{signature_sha_base64}"'
            authorization = base64.b64encode(authorization_origin.encode('utf-8')).decode('utf-8')
            
            # 构建URL参数
            params = {
                'authorization': authorization,
                'date': timestamp,
                'host': 'spark-api.xf-yun.com'
            }
            
            return f"{self.settings.iflytek_spark_url}?{urllib.parse.urlencode(params)}"
        except Exception as e:
            logger.error(f"WebSocket URL构建失败: {e}")
            return self.settings.iflytek_spark_url
    
    def _gen_params(self, messages: List[Dict[str, str]], **kwargs) -> Dict[str, Any]:
        """生成请求参数"""
        return {
            "header": {
                "app_id": self.settings.iflytek_app_id,
                "uid": "1234"
            },
            "parameter": {
                "chat": {
                    "domain": self.settings.iflytek_spark_domain,
                    "temperature": kwargs.get('temperature', self.settings.iflytek_temperature),
                    "max_tokens": kwargs.get('max_tokens', self.settings.iflytek_max_tokens)
                }
            },
            "payload": {
                "message": {
                    "text": messages
                }
            }
        }
    
    async def _rate_limit(self):
        """速率限制"""
        current_time = time.time()
        time_since_last = current_time - self.last_request_time
        if time_since_last < self.rate_limit_delay:
            await asyncio.sleep(self.rate_limit_delay - time_since_last)
        self.last_request_time = time.time()
    
    def _generate_cache_key(self, messages: List[Dict[str, str]]) -> str:
        """生成缓存键"""
        content = json.dumps(messages, sort_keys=True, ensure_ascii=False)
        return hashlib.md5(content.encode('utf-8')).hexdigest()
    
    def _is_cache_valid(self, cached_response: Dict[str, Any]) -> bool:
        """检查缓存是否有效"""
        if not self.settings.iflytek_enable_cache:
            return False
        
        cache_time = cached_response.get("timestamp", 0)
        current_time = time.time()
        return (current_time - cache_time) < self.settings.iflytek_cache_ttl
    
    async def _get_mock_response(self, messages: List[Dict[str, str]]) -> Dict[str, Any]:
        """生成基于竞品分析的智能模拟响应"""
        try:
            # 根据消息内容生成智能模拟响应
            last_message = messages[-1] if messages else {}
            content = last_message.get('content', '').lower()

            # 基于竞品分析的智能对话策略
            if '面试' in content or '问题' in content:
                # 借鉴Offermore.cc的实时助手功能
                mock_responses = [
                    "请详细介绍一个您在AI/大数据/物联网领域的具体项目经验，包括技术选型、实现过程和遇到的挑战。",
                    "基于您的技术背景，请分析一下当前行业中的技术发展趋势，以及您认为的关键技术突破点。",
                    "请描述一个您解决过的复杂技术问题，重点说明您的分析思路、解决方案和最终效果。",
                    "在团队协作中，您如何平衡技术深度和沟通效率？请结合具体案例说明。",
                    "请谈谈您对技术学习和知识更新的方法论，以及如何保持技术竞争力。"
                ]
                import random
                response_content = random.choice(mock_responses)

            elif '不知道' in content or '不清楚' in content or '没有经验' in content:
                # 借鉴Hina.com的智能引导功能
                response_content = """没关系，让我换个角度来帮助您思考这个问题。

我们可以从基础概念开始：这个技术问题涉及到的核心原理是什么？您在学习或工作中是否接触过相关的工具或框架？

或者我们可以从应用场景入手：您觉得这项技术主要解决什么样的实际问题？在您熟悉的领域中，有没有类似的应用案例？

请不要担心，面试是一个相互了解的过程，我们可以一步步来探讨。"""

            elif '评估' in content or '分析' in content:
                # 借鉴Dayee.com的专业评估功能
                response_content = """基于您刚才的回答，我从以下几个维度进行分析：

技术理解深度：您对核心概念的掌握程度较好，建议进一步加强实践应用。
问题解决能力：您的分析思路清晰，可以继续深化技术细节的表达。
表达沟通能力：您的技术表达较为准确，建议增加更多具体案例。

接下来，我想了解您在实际项目中是如何应用这些技术的？"""

            elif '项目' in content or '经验' in content:
                # 深度追问机制
                response_content = """您提到的项目很有意思。让我们深入探讨一下：

1. 在项目的技术选型阶段，您是如何评估不同方案的优缺点的？
2. 在实现过程中，遇到的最大技术挑战是什么？您是如何解决的？
3. 项目上线后的效果如何？有哪些可以改进的地方？
4. 如果让您重新设计这个项目，您会采用什么不同的技术方案？

请选择其中一个方面详细展开。"""

            else:
                # 通用智能引导
                response_content = """感谢您的回答。基于您的表达，我想进一步了解：

您刚才提到的技术点很有价值，能否结合具体的应用场景来详细说明？这样可以帮助我更好地评估您的技术深度和实践能力。

同时，我也很想了解您在学习这项技术时的思考过程和方法。"""

            return {
                "content": response_content,
                "status": "success",
                "timestamp": datetime.now().isoformat(),
                "model": "enhanced-mock",
                "is_mock": True,
                "guidance_type": "intelligent_conversation",
                "features": ["深度追问", "智能引导", "专业评估"]
            }

        except Exception as e:
            logger.error(f"智能模拟响应生成失败: {e}")
            return {
                "content": "AI面试官暂时不可用，请稍后重试。我们的系统正在优化中，感谢您的耐心。",
                "status": "error",
                "error": str(e),
                "timestamp": datetime.now().isoformat(),
                "is_mock": True
            }
    
    async def cleanup(self):
        """清理资源"""
        # 清理会话池
        for session in self.session_pool.values():
            if not session.closed:
                await session.close()
        self.session_pool.clear()
        
        # 清理缓存
        self.request_cache.clear()
        
        logger.info("iFlytek服务资源清理完成")

# 全局服务实例
enhanced_iflytek_service = None

def get_enhanced_iflytek_service(settings: Optional[Settings] = None) -> EnhancedIFlytekService:
    """获取增强的iFlytek服务实例"""
    global enhanced_iflytek_service
    if enhanced_iflytek_service is None:
        if settings is None:
            from ..core.config import Settings
            settings = Settings()
        enhanced_iflytek_service = EnhancedIFlytekService(settings)
    return enhanced_iflytek_service
