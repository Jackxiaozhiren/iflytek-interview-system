"""
系统配置文件
优化iFlytek Spark LLM集成和系统性能
"""

import os
from typing import Optional, Dict, Any
from dotenv import load_dotenv

# 加载环境变量文件
load_dotenv("软件杯.env")

try:
    from pydantic_settings import BaseSettings
    from pydantic import Field
except ImportError:
    try:
        from pydantic import BaseSettings, Field
    except ImportError:
        # 回退方案 - 简化的配置类
        class BaseSettings:
            def __init__(self, **kwargs):
                # 设置默认值
                self.app_name = "多模态面试评估系统"
                self.app_version = "1.0.0"
                self.debug = False
                self.database_url = "sqlite:///./interview_system.db"
                self.iflytek_app_id = os.getenv("SPARK_APPID", "")
                self.iflytek_api_key = os.getenv("SPARK_API_KEY", "")
                self.iflytek_api_secret = os.getenv("SPARK_API_SECRET", "")
                self.iflytek_spark_url = os.getenv("SPARK_WSS_URL", "wss://spark-api.xf-yun.com/v3.5/chat")
                self.iflytek_max_tokens = 2048
                self.iflytek_temperature = 0.7
                self.iflytek_timeout = 30
                self.iflytek_retry_times = 3
                self.iflytek_retry_delay = 1.0
                self.log_level = "INFO"
                self.log_file = "logs/app.log"
                self.secret_key = "your-secret-key-here"
                self.cors_origins = ["http://localhost:3000", "http://localhost:5173"]
                self.capability_weights = {
                    "professional_knowledge": 0.25,
                    "skill_matching": 0.20,
                    "language_expression": 0.15,
                    "logical_thinking": 0.15,
                    "innovation_ability": 0.15,
                    "stress_resistance": 0.10
                }
                self.supported_domains = ["人工智能", "大数据", "物联网"]
                self.multimodal_weights = {
                    "text": 0.4,
                    "audio": 0.35,
                    "video": 0.25
                }

                # 应用传入的参数
                for key, value in kwargs.items():
                    setattr(self, key, value)

        def Field(default=None, **kwargs):
            return default
import logging

class Settings(BaseSettings):
    """系统配置类"""
    
    # 基础配置
    app_name: str = "多模态面试评估系统"
    app_version: str = "1.0.0"
    debug: bool = Field(default=False, env="DEBUG")
    
    # 数据库配置
    database_url: str = Field(default="sqlite:///./interview_system.db", env="DATABASE_URL")
    
    # iFlytek Spark 配置 - 增强版
    iflytek_app_id: str = Field(default=os.getenv("SPARK_APPID", ""), env="SPARK_APPID")
    iflytek_api_key: str = Field(default=os.getenv("SPARK_API_KEY", ""), env="SPARK_API_KEY")
    iflytek_api_secret: str = Field(default=os.getenv("SPARK_API_SECRET", ""), env="SPARK_API_SECRET")
    iflytek_spark_url: str = Field(default=os.getenv("SPARK_WSS_URL", "wss://spark-api.xf-yun.com/v1/x1"), env="SPARK_WSS_URL")
    iflytek_spark_domain: str = Field(default=os.getenv("SPARK_DOMAIN", "x1"), env="SPARK_DOMAIN")
    iflytek_spark_http_url: str = Field(default=os.getenv("SPARK_HTTP_URL", "https://spark-api-open.xf-yun.com/v2/chat/completions"), env="SPARK_HTTP_URL")
    
    # iFlytek 服务配置 - 增强版
    iflytek_max_tokens: int = Field(default=2048, env="IFLYTEK_MAX_TOKENS")
    iflytek_temperature: float = Field(default=0.7, env="IFLYTEK_TEMPERATURE")
    iflytek_timeout: int = Field(default=30, env="IFLYTEK_TIMEOUT")
    iflytek_retry_times: int = Field(default=3, env="IFLYTEK_RETRY_TIMES")
    iflytek_retry_delay: float = Field(default=1.0, env="IFLYTEK_RETRY_DELAY")

    # 连接池配置
    iflytek_max_connections: int = Field(default=10, env="IFLYTEK_MAX_CONNECTIONS")
    iflytek_connection_timeout: int = Field(default=60, env="IFLYTEK_CONNECTION_TIMEOUT")
    iflytek_heartbeat_interval: int = Field(default=30, env="IFLYTEK_HEARTBEAT_INTERVAL")

    # 性能优化配置
    iflytek_enable_cache: bool = Field(default=True, env="IFLYTEK_ENABLE_CACHE")
    iflytek_cache_ttl: int = Field(default=300, env="IFLYTEK_CACHE_TTL")  # 5分钟
    iflytek_enable_compression: bool = Field(default=True, env="IFLYTEK_ENABLE_COMPRESSION")
    
    # 语音识别配置
    asr_max_audio_size: int = Field(default=10 * 1024 * 1024, env="ASR_MAX_AUDIO_SIZE")  # 10MB
    asr_supported_formats: list = Field(default=["wav", "mp3", "flac", "m4a"], env="ASR_SUPPORTED_FORMATS")
    asr_sample_rate: int = Field(default=16000, env="ASR_SAMPLE_RATE")
    
    # 视频分析配置
    video_max_size: int = Field(default=50 * 1024 * 1024, env="VIDEO_MAX_SIZE")  # 50MB
    video_supported_formats: list = Field(default=["mp4", "avi", "mov", "webm"], env="VIDEO_SUPPORTED_FORMATS")
    video_max_duration: int = Field(default=300, env="VIDEO_MAX_DURATION")  # 5分钟
    
    # 缓存配置
    redis_url: str = Field(default="redis://localhost:6379/0", env="REDIS_URL")
    cache_ttl: int = Field(default=3600, env="CACHE_TTL")  # 1小时
    
    # 日志配置
    log_level: str = Field(default="INFO", env="LOG_LEVEL")
    log_file: str = Field(default="logs/app.log", env="LOG_FILE")
    
    # 性能配置
    max_concurrent_requests: int = Field(default=100, env="MAX_CONCURRENT_REQUESTS")
    request_timeout: int = Field(default=60, env="REQUEST_TIMEOUT")
    
    # 安全配置
    secret_key: str = Field(default="your-secret-key-here", env="SECRET_KEY")
    cors_origins: list = Field(default=["http://localhost:3000", "http://localhost:5173"], env="CORS_ORIGINS")
    
    # 6个核心能力指标权重配置
    capability_weights: Dict[str, float] = {
        "professional_knowledge": 0.25,    # 专业知识水平
        "skill_matching": 0.20,           # 技能匹配度
        "language_expression": 0.15,      # 语言表达能力
        "logical_thinking": 0.15,         # 逻辑思维能力
        "innovation_ability": 0.15,       # 创新能力
        "stress_resistance": 0.10         # 应变抗压能力
    }
    
    # 技术领域配置
    supported_domains: list = Field(default=["人工智能", "大数据", "物联网"], env="SUPPORTED_DOMAINS")
    
    # 多模态分析配置
    multimodal_weights: Dict[str, float] = {
        "text": 0.4,    # 文本分析权重
        "audio": 0.35,  # 音频分析权重
        "video": 0.25   # 视频分析权重
    }
    
    class Config:
        env_file = ".env"
        case_sensitive = False

class IFlytekConfig:
    """iFlytek 专用配置类"""
    
    def __init__(self, settings: Settings):
        self.settings = settings
        self.validate_config()
    
    def validate_config(self):
        """验证iFlytek配置"""
        required_fields = ["iflytek_app_id", "iflytek_api_key", "iflytek_api_secret"]
        missing_fields = []
        
        for field in required_fields:
            if not getattr(self.settings, field):
                missing_fields.append(field)
        
        if missing_fields:
            logging.warning(f"iFlytek配置缺失: {missing_fields}")
            logging.warning("将使用模拟模式运行")
    
    @property
    def is_configured(self) -> bool:
        """检查iFlytek是否正确配置"""
        return all([
            self.settings.iflytek_app_id,
            self.settings.iflytek_api_key,
            self.settings.iflytek_api_secret
        ])
    
    @property
    def connection_params(self) -> Dict[str, Any]:
        """获取连接参数"""
        return {
            "app_id": self.settings.iflytek_app_id,
            "api_key": self.settings.iflytek_api_key,
            "api_secret": self.settings.iflytek_api_secret,
            "spark_url": self.settings.iflytek_spark_url,
            "max_tokens": self.settings.iflytek_max_tokens,
            "temperature": self.settings.iflytek_temperature,
            "timeout": self.settings.iflytek_timeout,
            "retry_times": self.settings.iflytek_retry_times,
            "retry_delay": self.settings.iflytek_retry_delay
        }

class LoggingConfig:
    """日志配置类"""
    
    @staticmethod
    def setup_logging(settings: Settings):
        """设置日志配置"""
        # 创建日志目录
        log_dir = os.path.dirname(settings.log_file)
        if log_dir and not os.path.exists(log_dir):
            os.makedirs(log_dir)
        
        # 配置日志格式
        log_format = "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        
        # 配置根日志器
        logging.basicConfig(
            level=getattr(logging, settings.log_level.upper()),
            format=log_format,
            handlers=[
                logging.FileHandler(settings.log_file, encoding='utf-8'),
                logging.StreamHandler()
            ]
        )
        
        # 设置第三方库日志级别
        logging.getLogger("uvicorn").setLevel(logging.INFO)
        logging.getLogger("sqlalchemy").setLevel(logging.WARNING)

# 全局配置实例
settings = Settings()
iflytek_config = IFlytekConfig(settings)

# 设置日志
LoggingConfig.setup_logging(settings)

# 导出配置
__all__ = ["settings", "iflytek_config", "IFlytekConfig", "LoggingConfig"]
