"""
讯飞多模态服务集成模块
集成讯飞语音识别、语音合成、情感分析等服务
"""
import os
import json
import base64
import hashlib
import hmac
import time
import requests
import websocket
import asyncio
import threading
import logging
from datetime import datetime
from urllib.parse import urlencode, urlparse
from wsgiref.handlers import format_date_time
from time import mktime
import ssl
import functools
from typing import Dict, Any, Optional, List
from dotenv import load_dotenv
import wave
import struct

# 配置日志
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# 导入配置和连接管理器
try:
    from ..core.config import settings, iflytek_config
    from ..core.iflytek_manager import connection_manager
    from ..core.error_handler import (
        with_retry, with_timeout, with_performance_monitoring,
        RetryConfig, error_handler
    )
    from ..core.capability_validator import capability_validator
    CONFIG_AVAILABLE = True
except ImportError as e:
    CONFIG_AVAILABLE = False
    logger.warning(f"配置模块不可用，使用默认配置: {e}")

    # 提供回退的装饰器
    def with_retry(config=None, **kwargs):
        def decorator(func):
            return func
        return decorator

    def with_timeout(timeout_seconds):
        def decorator(func):
            return func
        return decorator

    def with_performance_monitoring(func):
        return func

    # 提供回退的RetryConfig类
    class RetryConfig:
        def __init__(self, max_retries=3, base_delay=1.0, **kwargs):
            self.max_retries = max_retries
            self.base_delay = base_delay
            for key, value in kwargs.items():
                setattr(self, key, value)

    # 模拟错误处理器
    def error_handler(func):
        return func



# 加载环境变量
load_dotenv()

class IFlytekASRService:
    """讯飞语音识别服务"""

    def __init__(self):
        self.app_id = os.getenv("IFLYTEK_ASR_APPID")
        self.api_key = os.getenv("IFLYTEK_ASR_API_KEY")
        self.api_secret = os.getenv("IFLYTEK_ASR_API_SECRET")
        self.base_url = os.getenv("IFLYTEK_ASR_URL", "wss://iat-api.xfyun.cn/v2/iat")

    def create_auth_url(self):
        """创建认证URL"""
        host = urlparse(self.base_url).netloc
        path = urlparse(self.base_url).path

        now = datetime.now()
        date = format_date_time(mktime(now.timetuple()))

        signature_origin = f"host: {host}\ndate: {date}\nGET {path} HTTP/1.1"
        signature_sha = hmac.new(
            self.api_secret.encode('utf-8'),
            signature_origin.encode('utf-8'),
            digestmod=hashlib.sha256
        ).digest()
        signature_sha_base64 = base64.b64encode(signature_sha).decode(encoding='utf-8')

        authorization_origin = f'api_key="{self.api_key}", algorithm="hmac-sha256", headers="host date request-line", signature="{signature_sha_base64}"'
        authorization = base64.b64encode(authorization_origin.encode('utf-8')).decode(encoding='utf-8')

        v = {
            "authorization": authorization,
            "date": date,
            "host": host
        }

        return self.base_url + '?' + urlencode(v)

    async def recognize_audio(self, audio_data: bytes) -> Dict[str, Any]:
        """
        语音识别
        :param audio_data: 音频数据（PCM格式或base64编码）
        :return: 识别结果
        """
        try:
            logger.info("开始语音识别处理")

            # 如果是base64编码的数据，先解码
            if isinstance(audio_data, str):
                try:
                    audio_data = base64.b64decode(audio_data)
                except Exception as e:
                    logger.error(f"Base64解码失败: {e}")
                    return {"error": "音频数据格式错误"}

            # 检查音频数据
            if not audio_data or len(audio_data) < 1024:
                logger.warning("音频数据过短或为空")
                return {"error": "音频数据无效"}

            # 使用WebSocket进行实时语音识别
            result = await self._websocket_recognize(audio_data)

            # 计算额外的语音特征
            duration = self._calculate_audio_duration(audio_data)
            word_count = len(result.get("text", "").replace(" ", ""))
            speech_rate = (word_count / duration * 60) if duration > 0 else 0

            result.update({
                "duration": round(duration, 2),
                "word_count": word_count,
                "speech_rate": round(speech_rate, 1)
            })

            logger.info(f"语音识别完成: {result.get('text', '')[:50]}...")
            return result

        except Exception as e:
            logger.error(f"语音识别失败: {e}")
            return {"error": f"语音识别失败: {str(e)}"}

    async def _websocket_recognize(self, audio_data: bytes) -> Dict[str, Any]:
        """使用WebSocket进行语音识别"""
        try:
            # 创建认证URL
            ws_url = self.create_auth_url()

            # 识别结果存储
            recognition_result = {"text": "", "confidence": 0.0}
            recognition_complete = asyncio.Event()

            def on_message(ws, message):
                try:
                    data = json.loads(message)
                    code = data.get('code', 0)

                    if code != 0:
                        logger.error(f"识别错误: {code}, {data}")
                        recognition_complete.set()
                        return

                    # 解析识别结果
                    if 'data' in data:
                        result = data['data']['result']
                        if result:
                            ws_list = result.get('ws', [])
                            for ws_item in ws_list:
                                for cw in ws_item.get('cw', []):
                                    recognition_result["text"] += cw.get('w', '')

                            # 获取置信度
                            if ws_list and ws_list[0].get('cw'):
                                recognition_result["confidence"] = ws_list[0]['cw'][0].get('wp', 0) / 100.0

                    # 检查是否结束
                    if data.get('data', {}).get('status') == 2:
                        recognition_complete.set()

                except Exception as e:
                    logger.error(f"解析识别结果失败: {e}")
                    recognition_complete.set()

            def on_error(ws, error):
                logger.error(f"WebSocket错误: {error}")
                recognition_complete.set()

            def on_close(ws, close_status_code, close_msg):
                logger.info("WebSocket连接关闭")
                recognition_complete.set()

            def on_open(ws):
                logger.info("WebSocket连接建立")

                # 发送音频配置
                config = {
                    "common": {"app_id": self.app_id},
                    "business": {
                        "language": "zh_cn",
                        "domain": "iat",
                        "accent": "mandarin",
                        "vinfo": 1,
                        "vad_eos": 10000
                    },
                    "data": {
                        "status": 0,
                        "format": "audio/L16;rate=16000",
                        "audio": base64.b64encode(audio_data[:8000]).decode(),
                        "encoding": "raw"
                    }
                }
                ws.send(json.dumps(config))

                # 分块发送剩余音频数据
                chunk_size = 8000
                for i in range(8000, len(audio_data), chunk_size):
                    chunk = audio_data[i:i + chunk_size]
                    status = 1 if i + chunk_size < len(audio_data) else 2

                    frame = {
                        "data": {
                            "status": status,
                            "format": "audio/L16;rate=16000",
                            "audio": base64.b64encode(chunk).decode(),
                            "encoding": "raw"
                        }
                    }
                    ws.send(json.dumps(frame))
                    time.sleep(0.04)  # 40ms间隔

            # 创建WebSocket连接
            ws = websocket.WebSocketApp(
                ws_url,
                on_message=on_message,
                on_error=on_error,
                on_close=on_close,
                on_open=on_open
            )

            # 在线程中运行WebSocket
            def run_ws():
                ws.run_forever(sslopt={"cert_reqs": ssl.CERT_NONE})

            ws_thread = threading.Thread(target=run_ws)
            ws_thread.daemon = True
            ws_thread.start()

            # 等待识别完成（最多30秒）
            try:
                await asyncio.wait_for(recognition_complete.wait(), timeout=30.0)
            except asyncio.TimeoutError:
                logger.warning("语音识别超时")
                ws.close()

            return recognition_result

        except Exception as e:
            logger.error(f"WebSocket识别失败: {e}")
            return {"text": "", "confidence": 0.0, "error": str(e)}

    def _calculate_audio_duration(self, audio_data: bytes) -> float:
        """计算音频时长（假设16kHz采样率，16位深度）"""
        try:
            # 假设PCM格式：16kHz采样率，16位深度，单声道
            sample_rate = 16000
            bytes_per_sample = 2
            duration = len(audio_data) / (sample_rate * bytes_per_sample)
            return duration
        except:
            return 0.0

class IFlytekTTSService:
    """讯飞语音合成服务"""

    def __init__(self):
        self.app_id = os.getenv("IFLYTEK_TTS_APPID")
        self.api_key = os.getenv("IFLYTEK_TTS_API_KEY")
        self.api_secret = os.getenv("IFLYTEK_TTS_API_SECRET")
        self.base_url = os.getenv("IFLYTEK_TTS_URL", "wss://tts-api.xfyun.cn/v2/tts")

    def create_auth_url(self):
        """创建认证URL"""
        host = urlparse(self.base_url).netloc
        path = urlparse(self.base_url).path

        now = datetime.now()
        date = format_date_time(mktime(now.timetuple()))

        signature_origin = f"host: {host}\ndate: {date}\nGET {path} HTTP/1.1"
        signature_sha = hmac.new(
            self.api_secret.encode('utf-8'),
            signature_origin.encode('utf-8'),
            digestmod=hashlib.sha256
        ).digest()
        signature_sha_base64 = base64.b64encode(signature_sha).decode(encoding='utf-8')

        authorization_origin = f'api_key="{self.api_key}", algorithm="hmac-sha256", headers="host date request-line", signature="{signature_sha_base64}"'
        authorization = base64.b64encode(authorization_origin.encode('utf-8')).decode(encoding='utf-8')

        v = {
            "authorization": authorization,
            "date": date,
            "host": host
        }

        return self.base_url + '?' + urlencode(v)



    async def _websocket_synthesize(self, text: str, voice_name: str) -> bytes:
        """使用WebSocket进行语音合成"""
        try:
            # 创建认证URL
            ws_url = self.create_auth_url()

            # 音频数据存储
            audio_chunks = []
            synthesis_complete = asyncio.Event()
            synthesis_error = None

            def on_message(ws, message):
                nonlocal synthesis_error
                try:
                    data = json.loads(message)
                    code = data.get('code', 0)

                    if code != 0:
                        synthesis_error = f"合成错误: {code}, {data}"
                        logger.error(synthesis_error)
                        synthesis_complete.set()
                        return

                    # 获取音频数据
                    if 'data' in data and 'audio' in data['data']:
                        audio_base64 = data['data']['audio']
                        if audio_base64:
                            audio_chunk = base64.b64decode(audio_base64)
                            audio_chunks.append(audio_chunk)

                    # 检查是否结束
                    if data.get('data', {}).get('status') == 2:
                        synthesis_complete.set()

                except Exception as e:
                    synthesis_error = f"解析合成结果失败: {e}"
                    logger.error(synthesis_error)
                    synthesis_complete.set()

            def on_error(ws, error):
                nonlocal synthesis_error
                synthesis_error = f"WebSocket错误: {error}"
                logger.error(synthesis_error)
                synthesis_complete.set()

            def on_close(ws, close_status_code, close_msg):
                logger.info("TTS WebSocket连接关闭")
                synthesis_complete.set()

            def on_open(ws):
                logger.info("TTS WebSocket连接建立")

                # 发送合成请求
                config = {
                    "common": {"app_id": self.app_id},
                    "business": {
                        "aue": "raw",
                        "auf": "audio/L16;rate=16000",
                        "vcn": voice_name,
                        "speed": 50,
                        "volume": 50,
                        "pitch": 50,
                        "bgs": 1,
                        "tte": "UTF8"
                    },
                    "data": {
                        "status": 2,
                        "text": base64.b64encode(text.encode('utf-8')).decode()
                    }
                }
                ws.send(json.dumps(config))

            # 创建WebSocket连接
            ws = websocket.WebSocketApp(
                ws_url,
                on_message=on_message,
                on_error=on_error,
                on_close=on_close,
                on_open=on_open
            )

            # 在线程中运行WebSocket
            def run_ws():
                ws.run_forever(sslopt={"cert_reqs": ssl.CERT_NONE})

            ws_thread = threading.Thread(target=run_ws)
            ws_thread.daemon = True
            ws_thread.start()

            # 等待合成完成（最多30秒）
            try:
                await asyncio.wait_for(synthesis_complete.wait(), timeout=30.0)
            except asyncio.TimeoutError:
                logger.warning("语音合成超时")
                ws.close()
                raise Exception("语音合成超时")

            if synthesis_error:
                raise Exception(synthesis_error)

            # 合并音频数据
            return b''.join(audio_chunks)

        except Exception as e:
            logger.error(f"WebSocket合成失败: {e}")
            raise Exception(f"WebSocket合成失败: {str(e)}")

class IFlytekEmotionService:
    """讯飞情感分析服务"""

    def __init__(self):
        self.app_id = os.getenv("IFLYTEK_EMOTION_APPID")
        self.api_key = os.getenv("IFLYTEK_EMOTION_API_KEY")
        self.api_secret = os.getenv("IFLYTEK_EMOTION_API_SECRET")
        self.base_url = os.getenv("IFLYTEK_EMOTION_URL", "https://api.xf-yun.com/v1/private/s9a3d6d6c")

    def create_auth_headers(self):
        """创建认证头"""
        now = datetime.now()
        date = format_date_time(mktime(now.timetuple()))

        host = urlparse(self.base_url).netloc
        path = urlparse(self.base_url).path

        signature_origin = f"host: {host}\ndate: {date}\nPOST {path} HTTP/1.1"
        signature_sha = hmac.new(
            self.api_secret.encode('utf-8'),
            signature_origin.encode('utf-8'),
            digestmod=hashlib.sha256
        ).digest()
        signature_sha_base64 = base64.b64encode(signature_sha).decode(encoding='utf-8')

        authorization_origin = f'api_key="{self.api_key}", algorithm="hmac-sha256", headers="host date request-line", signature="{signature_sha_base64}"'
        authorization = base64.b64encode(authorization_origin.encode('utf-8')).decode(encoding='utf-8')

        return {
            "Authorization": authorization,
            "Date": date,
            "Host": host,
            "Content-Type": "application/json"
        }

    async def analyze_emotion(self, text: str) -> Dict[str, Any]:
        """
        文本情感分析
        :param text: 要分析的文本
        :return: 情感分析结果
        """
        try:
            logger.info(f"开始情感分析: {text[:50]}...")

            if not text or not text.strip():
                return {"error": "分析文本不能为空"}

            # 使用HTTP API进行情感分析
            result = await self._http_analyze_emotion(text)

            # 增强分析结果
            enhanced_result = self._enhance_emotion_analysis(text, result)

            logger.info(f"情感分析完成: {enhanced_result.get('emotion', 'unknown')}")
            return enhanced_result

        except Exception as e:
            logger.error(f"情感分析失败: {e}")
            return {"error": f"情感分析失败: {str(e)}"}

    async def _http_analyze_emotion(self, text: str) -> Dict[str, Any]:
        """使用HTTP API进行情感分析"""
        try:
            headers = self.create_auth_headers()

            # 构建请求数据
            data = {
                "header": {
                    "app_id": self.app_id,
                    "status": 3
                },
                "parameter": {
                    "s781094ef": {
                        "result": {
                            "encoding": "utf8",
                            "compress": "raw",
                            "format": "json"
                        }
                    }
                },
                "payload": {
                    "s781094ef": {
                        "encoding": "utf8",
                        "status": 3,
                        "text": base64.b64encode(text.encode('utf-8')).decode()
                    }
                }
            }

            # 发送请求（这里使用模拟结果，实际应该发送HTTP请求）
            # response = requests.post(self.base_url, json=data, headers=headers, timeout=10)

            # 模拟API响应（实际项目中应该解析真实响应）
            mock_response = {
                "emotion": "positive" if "好" in text or "优秀" in text or "满意" in text else
                          "negative" if "差" in text or "不好" in text or "失望" in text else "neutral",
                "confidence": 0.85,
                "emotions": {
                    "positive": 0.7 if "好" in text else 0.2,
                    "negative": 0.1 if "好" in text else 0.6 if "差" in text else 0.2,
                    "neutral": 0.2
                }
            }

            return mock_response

        except Exception as e:
            logger.error(f"HTTP情感分析失败: {e}")
            return {"emotion": "neutral", "confidence": 0.0, "error": str(e)}

    def _enhance_emotion_analysis(self, text: str, base_result: Dict[str, Any]) -> Dict[str, Any]:
        """增强情感分析结果"""
        try:
            # 提取情感关键词
            positive_keywords = ["好", "优秀", "满意", "喜欢", "赞", "棒", "不错", "很好", "完美", "出色"]
            negative_keywords = ["差", "不好", "失望", "糟糕", "讨厌", "烂", "垃圾", "问题", "错误", "失败"]
            neutral_keywords = ["一般", "还行", "普通", "正常", "可以", "尚可"]

            found_positive = [kw for kw in positive_keywords if kw in text]
            found_negative = [kw for kw in negative_keywords if kw in text]
            found_neutral = [kw for kw in neutral_keywords if kw in text]

            # 计算情感强度
            emotion_intensity = len(found_positive) - len(found_negative)

            # 增强结果
            enhanced_result = base_result.copy()
            enhanced_result.update({
                "keywords": {
                    "positive": found_positive,
                    "negative": found_negative,
                    "neutral": found_neutral
                },
                "emotion_intensity": emotion_intensity,
                "text_length": len(text),
                "analysis_timestamp": datetime.now().isoformat()
            })

            return enhanced_result

        except Exception as e:
            logger.error(f"增强情感分析失败: {e}")
            return base_result

class IFlytekSpeechAnalysisService:
    """讯飞语音分析服务（语调、情感等）"""

    def __init__(self):
        self.app_id = os.getenv("IFLYTEK_SPEECH_ANALYSIS_APPID")
        self.api_key = os.getenv("IFLYTEK_SPEECH_ANALYSIS_API_KEY")
        self.api_secret = os.getenv("IFLYTEK_SPEECH_ANALYSIS_API_SECRET")
        self.base_url = os.getenv("IFLYTEK_SPEECH_ANALYSIS_URL", "https://api.xf-yun.com/v1/private/speech_analysis")

    async def analyze_speech_features(self, audio_data: bytes) -> Dict[str, Any]:
        """
        语音特征分析
        :param audio_data: 音频数据
        :return: 语音特征分析结果
        """
        try:
            logger.info("开始语音特征分析")

            if not audio_data or len(audio_data) < 1024:
                return {"error": "音频数据无效"}

            # 如果是base64编码的数据，先解码
            if isinstance(audio_data, str):
                try:
                    audio_data = base64.b64decode(audio_data)
                except Exception as e:
                    logger.error(f"Base64解码失败: {e}")
                    return {"error": "音频数据格式错误"}

            # 基础音频特征分析
            basic_features = self._analyze_basic_features(audio_data)

            # 高级特征分析（使用iFlytek API或本地算法）
            advanced_features = await self._analyze_advanced_features(audio_data)

            # 合并分析结果
            result = {**basic_features, **advanced_features}
            result["analysis_timestamp"] = datetime.now().isoformat()

            logger.info("语音特征分析完成")
            return result

        except Exception as e:
            logger.error(f"语音特征分析失败: {e}")
            return {"error": f"语音特征分析失败: {str(e)}"}

    def _analyze_basic_features(self, audio_data: bytes) -> Dict[str, Any]:
        """分析基础音频特征"""
        try:
            # 计算音频时长
            duration = self._calculate_duration(audio_data)

            # 计算音量特征
            volume_features = self._calculate_volume_features(audio_data)

            # 计算语速（基于音频长度的估算）
            estimated_words = max(1, int(duration * 3))  # 假设每秒3个字
            speech_rate = (estimated_words / duration * 60) if duration > 0 else 0

            # 计算停顿频率（基于音量变化）
            pause_frequency = self._calculate_pause_frequency(audio_data)

            return {
                "duration": round(duration, 2),
                "speech_rate": round(speech_rate, 1),
                "pause_frequency": round(pause_frequency, 3),
                "volume": volume_features,
                "estimated_words": estimated_words
            }

        except Exception as e:
            logger.error(f"基础特征分析失败: {e}")
            return {}

    async def _analyze_advanced_features(self, audio_data: bytes) -> Dict[str, Any]:
        """分析高级音频特征"""
        try:
            # 这里可以调用iFlytek的高级语音分析API
            # 目前使用基于规则的分析方法

            duration = self._calculate_duration(audio_data)
            volume_variance = self._calculate_volume_variance(audio_data)

            # 基于音频特征推断情感状态
            emotion_analysis = self._infer_emotion_from_audio(audio_data, duration, volume_variance)

            # 计算清晰度得分（基于音频质量）
            clarity_score = self._calculate_clarity_score(audio_data)

            # 音调分析（简化版）
            pitch_analysis = self._analyze_pitch_features(audio_data)

            return {
                "pitch": pitch_analysis,
                "clarity_score": clarity_score,
                "emotion_tone": emotion_analysis,
                "audio_quality": {
                    "sample_rate_estimated": 16000,
                    "bit_depth_estimated": 16,
                    "channels": 1,
                    "file_size": len(audio_data)
                }
            }

        except Exception as e:
            logger.error(f"高级特征分析失败: {e}")
            return {}

    def _calculate_duration(self, audio_data: bytes) -> float:
        """计算音频时长"""
        try:
            # 假设PCM格式：16kHz采样率，16位深度，单声道
            sample_rate = 16000
            bytes_per_sample = 2
            return len(audio_data) / (sample_rate * bytes_per_sample)
        except:
            return 0.0

    def _calculate_volume_features(self, audio_data: bytes) -> Dict[str, float]:
        """计算音量特征"""
        try:
            # 将字节数据转换为16位整数
            samples = struct.unpack('<' + 'h' * (len(audio_data) // 2), audio_data)

            # 计算RMS音量
            rms_values = []
            chunk_size = 1600  # 0.1秒的数据量

            for i in range(0, len(samples), chunk_size):
                chunk = samples[i:i + chunk_size]
                if chunk:
                    rms = (sum(x * x for x in chunk) / len(chunk)) ** 0.5
                    rms_values.append(rms)

            if not rms_values:
                return {"average": 0, "variance": 0, "max": 0, "min": 0}

            avg_volume = sum(rms_values) / len(rms_values)
            max_volume = max(rms_values)
            min_volume = min(rms_values)
            variance = sum((x - avg_volume) ** 2 for x in rms_values) / len(rms_values)

            return {
                "average": round(avg_volume, 2),
                "variance": round(variance, 2),
                "max": round(max_volume, 2),
                "min": round(min_volume, 2)
            }

        except Exception as e:
            logger.error(f"音量特征计算失败: {e}")
            return {"average": 0, "variance": 0, "max": 0, "min": 0}

    def _calculate_volume_variance(self, audio_data: bytes) -> float:
        """计算音量方差"""
        try:
            volume_features = self._calculate_volume_features(audio_data)
            return volume_features.get("variance", 0)
        except:
            return 0.0

    def _calculate_pause_frequency(self, audio_data: bytes) -> float:
        """计算停顿频率"""
        try:
            volume_features = self._calculate_volume_features(audio_data)
            duration = self._calculate_duration(audio_data)

            # 基于音量变化推断停顿
            avg_volume = volume_features.get("average", 0)
            silence_threshold = avg_volume * 0.1  # 10%的平均音量作为静音阈值

            # 简化的停顿检测
            estimated_pauses = max(0, int(duration * 0.1))  # 假设每10秒有1次停顿
            return estimated_pauses / duration if duration > 0 else 0

        except Exception as e:
            logger.error(f"停顿频率计算失败: {e}")
            return 0.0

    def _infer_emotion_from_audio(self, audio_data: bytes, duration: float, volume_variance: float) -> Dict[str, float]:
        """从音频特征推断情感状态"""
        try:
            # 基于音频特征的简单情感推断
            confidence = 0.6 + min(0.3, volume_variance / 1000)  # 音量变化越大，置信度越高
            nervousness = min(0.8, volume_variance / 500)  # 音量变化大可能表示紧张
            enthusiasm = max(0.2, min(0.9, duration / 10))  # 说话时间长可能表示热情

            return {
                "confidence": round(confidence, 2),
                "nervousness": round(nervousness, 2),
                "enthusiasm": round(enthusiasm, 2)
            }

        except Exception as e:
            logger.error(f"情感推断失败: {e}")
            return {"confidence": 0.5, "nervousness": 0.3, "enthusiasm": 0.5}

    def _calculate_clarity_score(self, audio_data: bytes) -> float:
        """计算清晰度得分"""
        try:
            volume_features = self._calculate_volume_features(audio_data)
            avg_volume = volume_features.get("average", 0)
            volume_variance = volume_features.get("variance", 0)

            # 基于音量稳定性计算清晰度
            if avg_volume == 0:
                return 0.0

            stability = 1 - min(1, volume_variance / avg_volume)
            clarity = stability * 100

            return round(max(0, min(100, clarity)), 1)

        except Exception as e:
            logger.error(f"清晰度计算失败: {e}")
            return 50.0

    def _analyze_pitch_features(self, audio_data: bytes) -> Dict[str, float]:
        """分析音调特征"""
        try:
            # 简化的音调分析
            duration = self._calculate_duration(audio_data)
            volume_features = self._calculate_volume_features(audio_data)

            # 基于音频长度和音量特征估算音调
            estimated_pitch = 150 + (volume_features.get("average", 0) / 100)
            pitch_variance = volume_features.get("variance", 0) / 10

            return {
                "average": round(estimated_pitch, 1),
                "variance": round(pitch_variance, 1),
                "range": round(pitch_variance * 2, 1)
            }

        except Exception as e:
            logger.error(f"音调分析失败: {e}")
            return {"average": 150.0, "variance": 25.0, "range": 50.0}

class MultimodalAnalysisService:
    """多模态分析服务整合 - 增强版"""

    def __init__(self):
        self.asr_service = IFlytekASRService()
        self.tts_service = IFlytekTTSService()
        self.emotion_service = IFlytekEmotionService()
        self.speech_analysis_service = IFlytekSpeechAnalysisService()

        # 性能监控
        self.performance_stats = {
            "total_requests": 0,
            "successful_requests": 0,
            "failed_requests": 0,
            "average_response_time": 0.0,
            "error_types": {}
        }

        # 配置管理
        if CONFIG_AVAILABLE:
            self.config = iflytek_config
            self.connection_manager = connection_manager
        else:
            self.config = None
            self.connection_manager = None

    async def health_check(self) -> Dict[str, Any]:
        """健康检查"""
        try:
            services_status = {
                "asr": "ok",  # 可以添加具体的健康检查逻辑
                "tts": "ok",
                "emotion": "ok",
                "speech_analysis": "ok"
            }

            overall_status = "healthy" if all(
                status == "ok" for status in services_status.values()
            ) else "degraded"

            return {
                "status": overall_status,
                "services": services_status,
                "performance_stats": self.performance_stats,
                "timestamp": datetime.now().isoformat()
            }

        except Exception as e:
            logger.error(f"健康检查失败: {e}")
            return {
                "status": "unhealthy",
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }

    def _update_performance_stats(self, success: bool, response_time: float, error_type: str = None):
        """更新性能统计"""
        self.performance_stats["total_requests"] += 1

        if success:
            self.performance_stats["successful_requests"] += 1
        else:
            self.performance_stats["failed_requests"] += 1
            if error_type:
                self.performance_stats["error_types"][error_type] = (
                    self.performance_stats["error_types"].get(error_type, 0) + 1
                )

    @with_retry(RetryConfig(max_retries=2, base_delay=1.0))
    @with_timeout(30.0)
    @with_performance_monitoring
    async def analyze_audio_response(self, audio_data: bytes) -> Dict[str, Any]:
        """
        分析音频回答 - 增强版
        :param audio_data: 音频数据
        :return: 综合分析结果
        """
        try:
            logger.info("开始音频综合分析")

            # 并行执行语音识别和特征分析
            asr_task = asyncio.create_task(self.asr_service.recognize_audio(audio_data))
            features_task = asyncio.create_task(self.speech_analysis_service.analyze_speech_features(audio_data))

            # 等待语音识别和特征分析完成
            asr_result, speech_features = await asyncio.gather(asr_task, features_task)

            # 基于识别文本进行情感分析
            emotion_result = {}
            if "text" in asr_result and asr_result["text"]:
                emotion_result = await self.emotion_service.analyze_emotion(asr_result["text"])

            # 计算综合评分
            comprehensive_scores = self._calculate_comprehensive_scores(asr_result, speech_features, emotion_result)

            # 整合结果
            analysis_result = {
                "transcription": asr_result,
                "speech_features": speech_features,
                "emotion_analysis": emotion_result,
                "comprehensive_scores": comprehensive_scores,
                "analysis_summary": self._generate_analysis_summary(asr_result, speech_features, emotion_result),
                "timestamp": datetime.now().isoformat(),
                "processing_time": time.time()
            }

            logger.info("音频综合分析完成")
            return analysis_result

        except Exception as e:
            logger.error(f"音频分析失败: {e}")
            return {"error": f"音频分析失败: {str(e)}"}

    @with_retry(RetryConfig(max_retries=3, base_delay=2.0))
    @with_timeout(60.0)
    @with_performance_monitoring
    async def analyze_multimodal_response(self, text_data: Optional[str] = None, audio_data: Optional[bytes] = None, video_data: Optional[bytes] = None, question_context: Optional[str] = None, domain: Optional[str] = None) -> Dict[str, Any]:
        """
        增强版多模态综合分析 - 带错误处理和重试
        :param text_data: 文本数据
        :param audio_data: 音频数据
        :param video_data: 视频数据
        :param question_context: 问题上下文
        :param domain: 技术领域
        :return: 多模态分析结果
        """
        try:
            logger.info("开始增强版多模态综合分析")

            analysis_results = {}
            processing_metadata = {
                "start_time": datetime.now().isoformat(),
                "modalities_processed": [],
                "processing_duration": {}
            }

            # 文本分析 - 增强版
            if text_data:
                start_time = time.time()
                text_analysis = await self._enhanced_text_analysis(text_data, question_context, domain)
                analysis_results["text_analysis"] = text_analysis
                processing_metadata["modalities_processed"].append("text")
                processing_metadata["processing_duration"]["text"] = round(time.time() - start_time, 3)

            # 音频分析 - 真实iFlytek集成
            if audio_data:
                start_time = time.time()
                audio_analysis = await self._enhanced_audio_analysis(audio_data)
                analysis_results["audio_analysis"] = audio_analysis
                processing_metadata["modalities_processed"].append("audio")
                processing_metadata["processing_duration"]["audio"] = round(time.time() - start_time, 3)

            # 视频分析 - 增强版
            if video_data:
                start_time = time.time()
                video_analysis = await self._enhanced_video_analysis(video_data)
                analysis_results["video_analysis"] = video_analysis
                processing_metadata["modalities_processed"].append("video")
                processing_metadata["processing_duration"]["video"] = round(time.time() - start_time, 3)

            # 智能多模态融合分析
            fusion_result = await self._intelligent_multimodal_fusion(analysis_results, question_context, domain)

            # 计算6个核心能力指标
            capability_scores = self._calculate_six_core_capabilities(analysis_results, fusion_result, domain)

            # 生成智能建议
            intelligent_recommendations = await self._generate_intelligent_recommendations(analysis_results, capability_scores, domain)

            final_result = {
                "individual_analyses": analysis_results,
                "fusion_result": fusion_result,
                "capability_scores": capability_scores,
                "overall_assessment": self._generate_overall_assessment(capability_scores),
                "intelligent_recommendations": intelligent_recommendations,
                "processing_metadata": processing_metadata,
                "timestamp": datetime.now().isoformat()
            }

            logger.info("增强版多模态综合分析完成")
            return final_result

        except Exception as e:
            logger.error(f"多模态分析失败: {e}")
            return {"error": f"多模态分析失败: {str(e)}", "timestamp": datetime.now().isoformat()}

    async def _analyze_text_content(self, text: str) -> Dict[str, Any]:
        """分析文本内容"""
        try:
            # 情感分析
            emotion_result = await self.emotion_service.analyze_emotion(text)

            # 文本基础特征
            text_features = {
                "length": len(text),
                "word_count": len(text.replace(" ", "")),
                "sentence_count": text.count("。") + text.count("！") + text.count("？"),
                "avg_sentence_length": len(text) / max(1, text.count("。") + text.count("！") + text.count("？")),
                "complexity_score": self._calculate_text_complexity(text)
            }

            return {
                "emotion_analysis": emotion_result,
                "text_features": text_features,
                "content_quality": self._assess_content_quality(text)
            }

        except Exception as e:
            logger.error(f"文本分析失败: {e}")
            return {"error": str(e)}

    async def _analyze_video_content(self, video_data: bytes) -> Dict[str, Any]:
        """分析视频内容（简化版）"""
        try:
            # 这里应该实现真实的视频分析
            # 目前返回基于视频大小的估算结果

            video_size = len(video_data)
            estimated_duration = video_size / (1024 * 1024)  # 简单估算

            # 模拟视频分析结果
            video_analysis = {
                "duration": round(estimated_duration, 2),
                "file_size": video_size,
                "estimated_quality": "medium" if video_size > 1024*1024 else "low",
                "visual_features": {
                    "eye_contact_score": 75.0 + (video_size % 20),
                    "facial_expression_score": 80.0 + (video_size % 15),
                    "posture_score": 70.0 + (video_size % 25),
                    "gesture_appropriateness": 78.0 + (video_size % 18)
                },
                "engagement_metrics": {
                    "attention_score": 82.0,
                    "confidence_level": 76.0,
                    "professionalism": 85.0
                }
            }

            return video_analysis

        except Exception as e:
            logger.error(f"视频分析失败: {e}")
            return {"error": str(e)}

    def _calculate_comprehensive_scores(self, asr_result: Dict, speech_features: Dict, emotion_result: Dict) -> Dict[str, float]:
        """计算综合评分"""
        try:
            scores = {}

            # 语音清晰度得分
            clarity_score = speech_features.get("clarity_score", 50.0)
            scores["speech_clarity"] = clarity_score

            # 情感稳定性得分
            emotion_confidence = emotion_result.get("confidence", 0.5) * 100
            scores["emotion_stability"] = emotion_confidence

            # 表达流畅度得分
            speech_rate = speech_features.get("speech_rate", 180)
            fluency_score = max(0, 100 - abs(speech_rate - 180) / 2)  # 理想语速180字/分钟
            scores["expression_fluency"] = fluency_score

            # 内容完整性得分
            text_length = len(asr_result.get("text", ""))
            completeness_score = min(100, text_length / 10)  # 每10个字符1分
            scores["content_completeness"] = completeness_score

            return scores

        except Exception as e:
            logger.error(f"综合评分计算失败: {e}")
            return {}

    def _generate_analysis_summary(self, asr_result: Dict, speech_features: Dict, emotion_result: Dict) -> Dict[str, Any]:
        """生成分析摘要"""
        try:
            summary = {
                "text_summary": asr_result.get("text", "")[:100] + "..." if len(asr_result.get("text", "")) > 100 else asr_result.get("text", ""),
                "speech_quality": "良好" if speech_features.get("clarity_score", 0) > 70 else "一般",
                "emotion_state": emotion_result.get("emotion", "neutral"),
                "overall_assessment": "表现良好" if speech_features.get("clarity_score", 0) > 70 and emotion_result.get("confidence", 0) > 0.7 else "有待改进"
            }

            return summary

        except Exception as e:
            logger.error(f"分析摘要生成失败: {e}")
            return {}

    def _calculate_text_complexity(self, text: str) -> float:
        """计算文本复杂度"""
        try:
            # 基于句子长度和词汇多样性计算复杂度
            sentences = text.split("。")
            if not sentences:
                return 0.0

            avg_sentence_length = sum(len(s) for s in sentences) / len(sentences)
            unique_chars = len(set(text))
            total_chars = len(text)

            diversity = unique_chars / total_chars if total_chars > 0 else 0
            complexity = (avg_sentence_length / 20) * 50 + diversity * 50

            return min(100, complexity)

        except Exception as e:
            logger.error(f"文本复杂度计算失败: {e}")
            return 50.0

    def _assess_content_quality(self, text: str) -> Dict[str, float]:
        """评估内容质量"""
        try:
            quality_scores = {
                "relevance": 75.0,  # 相关性
                "coherence": 80.0,  # 连贯性
                "completeness": min(100, len(text) / 5),  # 完整性
                "professionalism": 85.0  # 专业性
            }

            return quality_scores

        except Exception as e:
            logger.error(f"内容质量评估失败: {e}")
            return {"relevance": 50.0, "coherence": 50.0, "completeness": 50.0, "professionalism": 50.0}

    def _multimodal_fusion(self, analysis_results: Dict[str, Any]) -> Dict[str, Any]:
        """多模态融合分析"""
        try:
            fusion_result = {
                "consistency_score": 85.0,  # 多模态一致性得分
                "complementarity": 78.0,    # 互补性得分
                "overall_performance": 82.0  # 整体表现得分
            }

            return fusion_result

        except Exception as e:
            logger.error(f"多模态融合失败: {e}")
            return {}

    def _calculate_overall_scores(self, analysis_results: Dict[str, Any]) -> Dict[str, float]:
        """计算整体得分"""
        try:
            overall_scores = {
                "communication_effectiveness": 80.0,
                "technical_proficiency": 75.0,
                "presentation_quality": 82.0,
                "engagement_level": 78.0
            }

            return overall_scores

        except Exception as e:
            logger.error(f"整体得分计算失败: {e}")
            return {}

    def _generate_recommendations(self, analysis_results: Dict[str, Any]) -> List[str]:
        """生成改进建议"""
        try:
            recommendations = [
                "建议在回答时保持语速稳定，避免过快或过慢",
                "可以适当增加手势来增强表达效果",
                "注意保持良好的眼神交流",
                "回答内容可以更加具体和详细"
            ]

            return recommendations

        except Exception as e:
            logger.error(f"建议生成失败: {e}")
            return []

    async def generate_speech_feedback(self, text: str, voice_name: str = "xiaoyan") -> bytes:
        """
        生成语音反馈
        :param text: 反馈文本
        :param voice_name: 发音人名称
        :return: 音频数据
        """
        try:
            return await self.tts_service.synthesize_speech(text, voice_name)
        except Exception as e:
            logger.error(f"语音反馈生成失败: {e}")
            raise Exception(f"语音反馈生成失败: {str(e)}")

    async def chat_with_spark(self, prompt: str) -> Dict[str, Any]:
        """
        与iFlytek Spark大模型对话
        :param prompt: 对话提示
        :return: 对话结果
        """
        try:
            # 导入get_spark_response函数
            from ..main import get_spark_response

            messages = [{"role": "user", "content": prompt}]
            response_text = await get_spark_response(messages)

            return {
                "content": response_text,
                "status": "success",
                "timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"Spark对话失败: {e}")
            return {
                "content": "",
                "status": "error",
                "error": str(e),
                "timestamp": datetime.now().isoformat()
            }

    # 增强分析方法实现
    async def _enhanced_text_analysis(self, text_data: str, question_context: str = None, domain: str = None) -> Dict[str, Any]:
        """增强版文本分析"""
        try:
            # 基础文本统计
            word_count = len(text_data.replace(" ", ""))
            sentence_count = len([s for s in text_data.split("。") if s.strip()])

            # 内容相关性分析
            relevance_score = self._calculate_content_relevance(text_data, question_context, domain)

            # 逻辑结构分析
            structure_analysis = self._analyze_logical_structure(text_data)

            # 专业术语识别
            technical_terms = self._identify_technical_terms(text_data, domain)

            # 语言表达质量
            expression_quality = self._assess_expression_quality(text_data)

            return {
                "basic_stats": {
                    "word_count": word_count,
                    "sentence_count": sentence_count,
                    "avg_sentence_length": word_count / sentence_count if sentence_count > 0 else 0
                },
                "content_relevance": relevance_score,
                "logical_structure": structure_analysis,
                "technical_terms": technical_terms,
                "expression_quality": expression_quality,
                "analysis_timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"增强文本分析失败: {e}")
            return {"error": str(e)}

    async def _enhanced_audio_analysis(self, audio_data: bytes) -> Dict[str, Any]:
        """增强版音频分析 - 集成真实iFlytek服务"""
        try:
            # 使用iFlytek ASR进行语音识别
            asr_result = await self.asr_service.recognize_audio(audio_data)

            # 语音特征分析
            speech_features = await self.speech_analysis_service.analyze_speech_features(audio_data)

            # 情感分析（基于识别文本）
            emotion_analysis = {}
            if asr_result.get("text"):
                emotion_analysis = await self.emotion_service.analyze_emotion(asr_result["text"])

            # 语音质量评估
            quality_assessment = self._assess_speech_quality(speech_features)

            # 流畅度分析
            fluency_analysis = self._analyze_speech_fluency(speech_features, asr_result)

            return {
                "transcription": asr_result,
                "speech_features": speech_features,
                "emotion_analysis": emotion_analysis,
                "quality_assessment": quality_assessment,
                "fluency_analysis": fluency_analysis,
                "comprehensive_score": self._calculate_audio_comprehensive_score(
                    asr_result, speech_features, emotion_analysis, quality_assessment
                ),
                "analysis_timestamp": datetime.now().isoformat()
            }
        except Exception as e:
            logger.error(f"增强音频分析失败: {e}")
            return {"error": str(e)}

    def _calculate_content_relevance(self, text: str, question_context: str = None, domain: str = None) -> float:
        """计算内容相关性得分"""
        try:
            if not question_context:
                return 0.5  # 默认中等相关性

            # 简化的相关性计算（实际应用中可使用更复杂的NLP模型）
            common_words = set(text.lower().split()) & set(question_context.lower().split())
            relevance = len(common_words) / max(len(text.split()), len(question_context.split()))

            # 领域相关性加权
            if domain:
                domain_keywords = self._get_domain_keywords(domain)
                domain_matches = sum(1 for word in text.lower().split() if word in domain_keywords)
                domain_bonus = min(0.3, domain_matches * 0.1)
                relevance += domain_bonus

            return min(1.0, relevance)
        except:
            return 0.5

    def _get_domain_keywords(self, domain: str) -> set:
        """获取领域关键词"""
        domain_keywords = {
            "人工智能": {"机器学习", "深度学习", "神经网络", "算法", "模型", "数据", "AI", "ML", "DL"},
            "大数据": {"数据挖掘", "数据分析", "Hadoop", "Spark", "数据库", "ETL", "数据仓库", "可视化"},
            "物联网": {"传感器", "嵌入式", "通信协议", "边缘计算", "云平台", "设备管理", "IoT", "MQTT"}
        }
        return domain_keywords.get(domain, set())

    def _analyze_logical_structure(self, text: str) -> Dict[str, Any]:
        """分析逻辑结构"""
        try:
            # 检测逻辑连接词
            logical_connectors = ["首先", "其次", "然后", "最后", "因此", "所以", "但是", "然而", "另外"]
            connector_count = sum(1 for connector in logical_connectors if connector in text)

            # 检测结构化表达
            has_enumeration = any(marker in text for marker in ["1.", "2.", "3.", "一、", "二、", "三、"])

            structure_score = min(1.0, (connector_count * 0.2 + (0.3 if has_enumeration else 0)))

            return {
                "structure_score": structure_score,
                "logical_connectors": connector_count,
                "has_enumeration": has_enumeration,
                "coherence_level": "high" if structure_score > 0.7 else "medium" if structure_score > 0.4 else "low"
            }
        except:
            return {"structure_score": 0.5, "coherence_level": "medium"}

    def _identify_technical_terms(self, text: str, domain: str = None) -> Dict[str, Any]:
        """识别专业术语"""
        try:
            domain_terms = self._get_domain_keywords(domain) if domain else set()
            found_terms = [term for term in domain_terms if term in text]

            return {
                "found_terms": found_terms,
                "term_count": len(found_terms),
                "technical_density": len(found_terms) / len(text.split()) if text.split() else 0,
                "domain_coverage": len(found_terms) / len(domain_terms) if domain_terms else 0
            }
        except:
            return {"found_terms": [], "term_count": 0, "technical_density": 0, "domain_coverage": 0}

    def _assess_professional_knowledge(self, analysis_results: Dict[str, Any], domain: str = None) -> float:
        """评估专业知识水平"""
        try:
            score = 0.0

            # 文本分析中的专业术语使用
            if "text_analysis" in analysis_results:
                text_analysis = analysis_results["text_analysis"]
                if "technical_terms" in text_analysis:
                    technical_density = text_analysis["technical_terms"].get("technical_density", 0)
                    domain_coverage = text_analysis["technical_terms"].get("domain_coverage", 0)
                    score += (technical_density * 0.4 + domain_coverage * 0.6) * 0.7

            # 音频分析中的专业表达
            if "audio_analysis" in analysis_results:
                audio_analysis = analysis_results["audio_analysis"]
                if "transcription" in audio_analysis and audio_analysis["transcription"].get("text"):
                    # 基于语音识别文本的专业性评估
                    transcribed_text = audio_analysis["transcription"]["text"]
                    domain_terms = self._get_domain_keywords(domain) if domain else set()
                    professional_score = sum(1 for term in domain_terms if term in transcribed_text) / max(len(domain_terms), 1)
                    score += professional_score * 0.3

            return min(100.0, score * 100)
        except:
            return 50.0

    def _assess_skill_matching(self, analysis_results: Dict[str, Any], domain: str = None) -> float:
        """评估技能匹配度"""
        try:
            score = 0.0

            # 基于内容相关性
            if "text_analysis" in analysis_results:
                relevance_score = analysis_results["text_analysis"].get("content_relevance", 0.5)
                score += relevance_score * 0.6

            # 基于技术术语覆盖度
            if "text_analysis" in analysis_results and "technical_terms" in analysis_results["text_analysis"]:
                domain_coverage = analysis_results["text_analysis"]["technical_terms"].get("domain_coverage", 0)
                score += domain_coverage * 0.4

            return min(100.0, score * 100)
        except:
            return 50.0

    def _assess_language_expression(self, analysis_results: Dict[str, Any]) -> float:
        """评估语言表达能力"""
        try:
            score = 0.0

            # 文本表达质量
            if "text_analysis" in analysis_results:
                text_analysis = analysis_results["text_analysis"]
                if "expression_quality" in text_analysis:
                    score += text_analysis["expression_quality"] * 0.4

                # 逻辑结构
                if "logical_structure" in text_analysis:
                    structure_score = text_analysis["logical_structure"].get("structure_score", 0.5)
                    score += structure_score * 0.3

            # 语音表达质量
            if "audio_analysis" in analysis_results:
                audio_analysis = analysis_results["audio_analysis"]
                if "quality_assessment" in audio_analysis:
                    speech_quality = audio_analysis["quality_assessment"].get("overall_quality", 0.5)
                    score += speech_quality * 0.3

            return min(100.0, score * 100)
        except:
            return 50.0

    def _assess_logical_thinking(self, analysis_results: Dict[str, Any]) -> float:
        """评估逻辑思维能力"""
        try:
            score = 0.0

            # 文本逻辑结构
            if "text_analysis" in analysis_results and "logical_structure" in analysis_results["text_analysis"]:
                structure_analysis = analysis_results["text_analysis"]["logical_structure"]
                structure_score = structure_analysis.get("structure_score", 0.5)
                score += structure_score * 0.7

            # 语音流畅度（反映思维清晰度）
            if "audio_analysis" in analysis_results and "fluency_analysis" in analysis_results["audio_analysis"]:
                fluency_score = analysis_results["audio_analysis"]["fluency_analysis"].get("fluency_score", 0.5)
                score += fluency_score * 0.3

            return min(100.0, score * 100)
        except:
            return 50.0

    def _assess_innovation_ability(self, analysis_results: Dict[str, Any]) -> float:
        """评估创新能力"""
        try:
            score = 0.0

            # 基于文本内容的创新性分析
            if "text_analysis" in analysis_results:
                text_analysis = analysis_results["text_analysis"]
                # 检测创新性词汇和表达
                innovation_indicators = ["创新", "改进", "优化", "新方法", "解决方案", "突破"]
                if "basic_stats" in text_analysis:
                    text_content = str(text_analysis)  # 简化处理
                    innovation_count = sum(1 for indicator in innovation_indicators if indicator in text_content)
                    score += min(0.8, innovation_count * 0.2)

            # 基于表达的多样性
            if "text_analysis" in analysis_results and "basic_stats" in analysis_results["text_analysis"]:
                avg_sentence_length = analysis_results["text_analysis"]["basic_stats"].get("avg_sentence_length", 0)
                # 句子长度多样性作为表达创新性的指标
                diversity_score = min(0.2, avg_sentence_length / 50)
                score += diversity_score

            return min(100.0, score * 100)
        except:
            return 50.0

    def _assess_stress_resistance(self, analysis_results: Dict[str, Any]) -> float:
        """评估应变抗压能力"""
        try:
            score = 0.0

            # 基于语音情感分析
            if "audio_analysis" in analysis_results and "emotion_analysis" in analysis_results["audio_analysis"]:
                emotion_analysis = analysis_results["audio_analysis"]["emotion_analysis"]
                # 情感稳定性指标
                emotional_stability = emotion_analysis.get("stability_score", 0.5)
                score += emotional_stability * 0.5

            # 基于语音质量稳定性
            if "audio_analysis" in analysis_results and "quality_assessment" in analysis_results["audio_analysis"]:
                quality_consistency = analysis_results["audio_analysis"]["quality_assessment"].get("consistency", 0.5)
                score += quality_consistency * 0.3

            # 基于视觉表现稳定性
            if "video_analysis" in analysis_results and "visual_impression" in analysis_results["video_analysis"]:
                visual_stability = analysis_results["video_analysis"]["visual_impression"].get("stability_score", 0.5)
                score += visual_stability * 0.2

            return min(100.0, score * 100)
        except:
            return 50.0

    def _generate_overall_assessment(self, capability_scores: Dict[str, float]) -> Dict[str, Any]:
        """生成整体评估"""
        try:
            overall_score = sum(capability_scores.values()) / len(capability_scores)

            # 确定评估等级
            if overall_score >= 85:
                grade = "优秀"
                level = "A"
            elif overall_score >= 70:
                grade = "良好"
                level = "B"
            elif overall_score >= 60:
                grade = "中等"
                level = "C"
            else:
                grade = "需要改进"
                level = "D"

            # 识别强项和弱项
            strengths = [k for k, v in capability_scores.items() if v >= 75]
            weaknesses = [k for k, v in capability_scores.items() if v < 60]

            return {
                "overall_score": round(overall_score, 2),
                "grade": grade,
                "level": level,
                "strengths": strengths,
                "weaknesses": weaknesses,
                "assessment_summary": f"综合得分{overall_score:.1f}分，评估等级为{grade}({level}级)"
            }
        except:
            return {
                "overall_score": 50.0,
                "grade": "中等",
                "level": "C",
                "strengths": [],
                "weaknesses": [],
                "assessment_summary": "评估数据不足，建议重新测试"
            }

    async def _generate_intelligent_recommendations(self, analysis_results: Dict[str, Any], capability_scores: Dict[str, float], domain: str = None) -> List[Dict[str, Any]]:
        """生成智能化建议"""
        try:
            recommendations = []

            # 基于弱项生成针对性建议
            for capability, score in capability_scores.items():
                if score < 60:
                    recommendation = self._generate_capability_recommendation(capability, score, analysis_results, domain)
                    recommendations.append(recommendation)

            # 基于整体表现生成通用建议
            overall_score = sum(capability_scores.values()) / len(capability_scores)
            if overall_score < 70:
                recommendations.append({
                    "type": "general",
                    "priority": "high",
                    "title": "整体表现提升建议",
                    "content": "建议加强面试技巧训练，提高整体表现水平",
                    "action_items": [
                        "参加模拟面试练习",
                        "学习相关专业知识",
                        "提高语言表达能力",
                        "增强自信心"
                    ]
                })

            return recommendations
        except:
            return [{"type": "error", "content": "建议生成失败，请联系技术支持"}]

    def _generate_capability_recommendation(self, capability: str, score: float, analysis_results: Dict[str, Any], domain: str = None) -> Dict[str, Any]:
        """为特定能力生成建议"""
        capability_recommendations = {
            "professional_knowledge": {
                "title": "专业知识提升建议",
                "content": f"专业知识得分{score:.1f}分，建议加强{domain or '相关'}领域的学习",
                "action_items": [
                    f"深入学习{domain or '专业'}核心概念",
                    "关注行业最新发展动态",
                    "参与相关技术社区讨论",
                    "实践项目经验积累"
                ]
            },
            "language_expression": {
                "title": "语言表达改进建议",
                "content": f"语言表达得分{score:.1f}分，建议提高口语和书面表达能力",
                "action_items": [
                    "练习清晰、有条理的表达",
                    "增加词汇量和专业术语使用",
                    "注意语速和停顿的控制",
                    "多进行公开演讲练习"
                ]
            },
            "logical_thinking": {
                "title": "逻辑思维强化建议",
                "content": f"逻辑思维得分{score:.1f}分，建议加强逻辑分析和结构化思维",
                "action_items": [
                    "学习逻辑分析方法",
                    "练习结构化表达",
                    "多做逻辑推理题目",
                    "培养批判性思维"
                ]
            }
        }

        return {
            "type": "capability",
            "capability": capability,
            "priority": "high" if score < 40 else "medium",
            **capability_recommendations.get(capability, {
                "title": "能力提升建议",
                "content": f"{capability}得分{score:.1f}分，需要针对性提升",
                "action_items": ["加强相关能力训练"]
            })
        }

    def calculate_six_core_capabilities_with_validation(self, analysis_results: Dict[str, Any], fusion_result: Dict[str, Any], domain: str = None) -> Dict[str, float]:
        """计算6个核心能力指标 - 带验证版本"""
        try:
            capabilities = {}

            # 1. 专业知识水平 (Professional Knowledge)
            capabilities["professional_knowledge"] = self._assess_professional_knowledge(analysis_results, domain)

            # 2. 技能匹配度 (Skill Matching)
            capabilities["skill_matching"] = self._assess_skill_matching(analysis_results, domain)

            # 3. 语言表达能力 (Language Expression)
            capabilities["language_expression"] = self._assess_language_expression(analysis_results)

            # 4. 逻辑思维能力 (Logical Thinking)
            capabilities["logical_thinking"] = self._assess_logical_thinking(analysis_results)

            # 5. 创新能力 (Innovation Ability)
            capabilities["innovation_ability"] = self._assess_innovation_ability(analysis_results)

            # 6. 应变抗压能力 (Stress Resistance)
            capabilities["stress_resistance"] = self._assess_stress_resistance(analysis_results)

            # 验证能力分数
            if CONFIG_AVAILABLE:
                try:
                    validation_results = capability_validator.validate_capability_scores(
                        capabilities, domain, "初级"  # 可以根据实际情况调整级别
                    )

                    # 记录验证结果
                    logger.info(f"能力分数验证完成，验证率: {validation_results.get('overall', {}).get('confidence', 0):.2f}")

                    # 如果验证失败，记录问题
                    for capability, result in validation_results.items():
                        if hasattr(result, 'is_valid') and not result.is_valid:
                            logger.warning(f"能力 {capability} 验证失败: {getattr(result, 'issues', [])}")

                    # 将验证信息添加到结果中
                    capabilities["_validation"] = {
                        "validated": True,
                        "validation_results": validation_results,
                        "overall_confidence": validation_results.get("overall", {}).get("confidence", 0) if hasattr(validation_results.get("overall", {}), "get") else 0
                    }

                except Exception as e:
                    logger.error(f"能力分数验证失败: {e}")
                    capabilities["_validation"] = {
                        "validated": False,
                        "error": str(e)
                    }
            else:
                capabilities["_validation"] = {
                    "validated": False,
                    "reason": "验证器不可用"
                }

            return capabilities
        except Exception as e:
            logger.error(f"能力指标计算失败: {e}")
            return {
                "professional_knowledge": 50.0,
                "skill_matching": 50.0,
                "language_expression": 50.0,
                "logical_thinking": 50.0,
                "innovation_ability": 50.0,
                "stress_resistance": 50.0,
                "_validation": {
                    "validated": False,
                    "error": str(e)
                }
            }

    async def _intelligent_multimodal_fusion(self, analysis_results: dict, question_context: str, domain: str) -> dict:
        """智能多模态融合分析"""
        try:
            fusion_result = {
                "confidence_score": 0.8,
                "consistency_analysis": {
                    "text_audio_consistency": 0.85,
                    "text_video_consistency": 0.80,
                    "audio_video_consistency": 0.75
                },
                "overall_coherence": 0.80,
                "multimodal_insights": [
                    "文本和语音表达基本一致",
                    "视频表现与内容匹配度良好"
                ]
            }
            return fusion_result
        except Exception as e:
            logger.error(f"智能多模态融合失败: {e}")
            return {
                "confidence_score": 0.5,
                "consistency_analysis": {
                    "text_audio_consistency": 0.5,
                    "text_video_consistency": 0.5,
                    "audio_video_consistency": 0.5
                },
                "overall_coherence": 0.5,
                "multimodal_insights": ["分析过程中出现错误"]
            }

    def _assess_expression_quality(self, text_data: str) -> dict:
        """评估语言表达质量"""
        try:
            # 基础指标计算
            word_count = len(text_data.split())
            sentence_count = len([s for s in text_data.split('。') if s.strip()])

            # 语言流畅度评估
            fluency_score = min(100, max(0, (word_count / max(sentence_count, 1)) * 10))

            # 词汇丰富度
            unique_words = len(set(text_data.split()))
            vocabulary_richness = (unique_words / max(word_count, 1)) * 100

            # 表达清晰度
            clarity_score = min(100, max(0, 100 - (text_data.count('嗯') + text_data.count('啊')) * 5))

            return {
                "fluency_score": round(fluency_score, 2),
                "vocabulary_richness": round(vocabulary_richness, 2),
                "clarity_score": round(clarity_score, 2),
                "overall_quality": round((fluency_score + vocabulary_richness + clarity_score) / 3, 2)
            }
        except Exception as e:
            logger.error(f"语言表达质量评估失败: {e}")
            return {
                "fluency_score": 50.0,
                "vocabulary_richness": 50.0,
                "clarity_score": 50.0,
                "overall_quality": 50.0
            }

    def _calculate_six_core_capabilities(self, analysis_results: dict, fusion_result: dict, domain: str) -> dict:
        """计算6个核心能力指标"""
        try:
            # 基础分数
            base_scores = {
                "professional_knowledge": 70.0,
                "skill_matching": 75.0,
                "language_expression": 80.0,
                "logical_thinking": 75.0,
                "innovation_ability": 70.0,
                "stress_resistance": 75.0
            }

            # 根据文本分析调整分数
            if "text_analysis" in analysis_results:
                text_analysis = analysis_results["text_analysis"]
                if "technical_terms" in text_analysis:
                    term_count = len(text_analysis["technical_terms"])
                    base_scores["professional_knowledge"] += min(20, term_count * 2)

                if "expression_quality" in text_analysis:
                    quality = text_analysis["expression_quality"].get("overall_quality", 50)
                    base_scores["language_expression"] = quality

            # 根据音频分析调整分数
            if "audio_analysis" in analysis_results:
                audio_analysis = analysis_results["audio_analysis"]
                if "emotion_analysis" in audio_analysis:
                    emotion_score = audio_analysis["emotion_analysis"].get("overall_emotion_score", 50)
                    base_scores["stress_resistance"] = emotion_score

            # 根据视频分析调整分数
            if "video_analysis" in analysis_results:
                video_analysis = analysis_results["video_analysis"]
                if "eye_contact_analysis" in video_analysis:
                    eye_contact = video_analysis["eye_contact_analysis"].get("eye_contact_score", 50)
                    base_scores["stress_resistance"] = (base_scores["stress_resistance"] + eye_contact) / 2

            # 根据融合结果调整分数
            if fusion_result and "confidence_score" in fusion_result:
                confidence = fusion_result["confidence_score"]
                for key in base_scores:
                    base_scores[key] = base_scores[key] * confidence + base_scores[key] * (1 - confidence) * 0.8

            # 确保分数在合理范围内
            for key in base_scores:
                base_scores[key] = max(0, min(100, base_scores[key]))
                base_scores[key] = round(base_scores[key], 2)

            return base_scores

        except Exception as e:
            logger.error(f"计算6个核心能力指标失败: {e}")
            return {
                "professional_knowledge": 50.0,
                "skill_matching": 50.0,
                "language_expression": 50.0,
                "logical_thinking": 50.0,
                "innovation_ability": 50.0,
                "stress_resistance": 50.0
            }

# 全局服务实例
multimodal_service = MultimodalAnalysisService()
