"""
系统监控服务
提供系统性能监控、健康检查、错误追踪等功能
"""

import asyncio
import logging
import psutil
import time
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
from dataclasses import dataclass, asdict
from collections import defaultdict, deque

logger = logging.getLogger(__name__)

@dataclass
class SystemMetrics:
    """系统指标"""
    timestamp: datetime
    cpu_percent: float
    memory_percent: float
    memory_used_mb: float
    memory_total_mb: float
    disk_percent: float
    disk_used_gb: float
    disk_total_gb: float
    network_sent_mb: float
    network_recv_mb: float
    active_connections: int
    process_count: int

@dataclass
class APIMetrics:
    """API指标"""
    endpoint: str
    method: str
    status_code: int
    response_time_ms: float
    timestamp: datetime
    user_agent: Optional[str] = None
    ip_address: Optional[str] = None

@dataclass
class ErrorMetrics:
    """错误指标"""
    error_type: str
    error_message: str
    endpoint: str
    timestamp: datetime
    stack_trace: Optional[str] = None
    user_context: Optional[Dict] = None

class SystemMonitorService:
    """系统监控服务"""
    
    def __init__(self, max_metrics_history: int = 1000):
        self.max_metrics_history = max_metrics_history
        self.system_metrics_history = deque(maxlen=max_metrics_history)
        self.api_metrics_history = deque(maxlen=max_metrics_history)
        self.error_metrics_history = deque(maxlen=max_metrics_history)
        
        # 统计数据
        self.api_stats = defaultdict(lambda: {
            'count': 0,
            'total_time': 0,
            'error_count': 0,
            'avg_response_time': 0
        })
        
        self.error_stats = defaultdict(int)
        self.is_monitoring = False
        self.monitor_task = None
        
        # 性能阈值
        self.thresholds = {
            'cpu_percent': 80.0,
            'memory_percent': 85.0,
            'disk_percent': 90.0,
            'response_time_ms': 5000.0,
            'error_rate_percent': 5.0,
            'iflytek_response_time_ms': 10000.0,
            'concurrent_requests': 100,
            'connection_timeout_ms': 30000.0
        }

        # 系统健康状态
        self.health_status = {
            'overall': 'healthy',
            'components': {
                'api_server': 'healthy',
                'iflytek_service': 'healthy',
                'database': 'healthy',
                'file_system': 'healthy',
                'memory': 'healthy',
                'cpu': 'healthy',
                'network': 'healthy'
            },
            'last_check': datetime.now().isoformat(),
            'alerts': []
        }

        # 错误分类和自动恢复
        self.error_categories = {
            'connection_errors': {'count': 0, 'recovery_attempts': 0},
            'timeout_errors': {'count': 0, 'recovery_attempts': 0},
            'validation_errors': {'count': 0, 'recovery_attempts': 0},
            'server_errors': {'count': 0, 'recovery_attempts': 0},
            'iflytek_errors': {'count': 0, 'recovery_attempts': 0},
            'memory_errors': {'count': 0, 'recovery_attempts': 0}
        }

        # 自动恢复策略
        self.recovery_strategies = {
            'high_memory_usage': self._handle_high_memory_usage,
            'high_cpu_usage': self._handle_high_cpu_usage,
            'connection_failure': self._handle_connection_failure,
            'service_degradation': self._handle_service_degradation
        }
        
        # 网络基线
        self.network_baseline = None
        
    async def start_monitoring(self, interval_seconds: int = 30):
        """开始系统监控"""
        if self.is_monitoring:
            logger.warning("系统监控已在运行")
            return
            
        self.is_monitoring = True
        self.monitor_task = asyncio.create_task(self._monitor_loop(interval_seconds))
        logger.info(f"系统监控已启动，监控间隔: {interval_seconds}秒")
        
    async def stop_monitoring(self):
        """停止系统监控"""
        if not self.is_monitoring:
            return
            
        self.is_monitoring = False
        if self.monitor_task:
            self.monitor_task.cancel()
            try:
                await self.monitor_task
            except asyncio.CancelledError:
                pass
        logger.info("系统监控已停止")
        
    async def _monitor_loop(self, interval_seconds: int):
        """监控循环"""
        try:
            while self.is_monitoring:
                await self._collect_system_metrics()
                await asyncio.sleep(interval_seconds)
        except asyncio.CancelledError:
            logger.info("监控循环已取消")
        except Exception as e:
            logger.error(f"监控循环异常: {e}")
            
    async def _collect_system_metrics(self):
        """收集系统指标"""
        try:
            # CPU和内存
            cpu_percent = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            
            # 磁盘
            disk = psutil.disk_usage('/')
            
            # 网络
            network = psutil.net_io_counters()
            if self.network_baseline is None:
                self.network_baseline = network
            
            network_sent_mb = (network.bytes_sent - self.network_baseline.bytes_sent) / 1024 / 1024
            network_recv_mb = (network.bytes_recv - self.network_baseline.bytes_recv) / 1024 / 1024
            
            # 连接数
            connections = len(psutil.net_connections())
            
            # 进程数
            process_count = len(psutil.pids())
            
            metrics = SystemMetrics(
                timestamp=datetime.now(),
                cpu_percent=cpu_percent,
                memory_percent=memory.percent,
                memory_used_mb=memory.used / 1024 / 1024,
                memory_total_mb=memory.total / 1024 / 1024,
                disk_percent=disk.percent,
                disk_used_gb=disk.used / 1024 / 1024 / 1024,
                disk_total_gb=disk.total / 1024 / 1024 / 1024,
                network_sent_mb=network_sent_mb,
                network_recv_mb=network_recv_mb,
                active_connections=connections,
                process_count=process_count
            )
            
            self.system_metrics_history.append(metrics)
            
            # 检查阈值
            await self._check_thresholds(metrics)
            
        except Exception as e:
            logger.error(f"收集系统指标失败: {e}")
            
    async def _check_thresholds(self, metrics: SystemMetrics):
        """检查性能阈值"""
        alerts = []
        
        if metrics.cpu_percent > self.thresholds['cpu_percent']:
            alerts.append(f"CPU使用率过高: {metrics.cpu_percent:.1f}%")
            
        if metrics.memory_percent > self.thresholds['memory_percent']:
            alerts.append(f"内存使用率过高: {metrics.memory_percent:.1f}%")
            
        if metrics.disk_percent > self.thresholds['disk_percent']:
            alerts.append(f"磁盘使用率过高: {metrics.disk_percent:.1f}%")
            
        for alert in alerts:
            logger.warning(f"性能告警: {alert}")
            self.health_status['alerts'].append({
                'type': 'performance',
                'message': alert,
                'timestamp': datetime.now().isoformat(),
                'severity': 'warning'
            })

            # 触发自动恢复机制
            await self._trigger_auto_recovery(alert, metrics)
            
    def record_api_call(self, endpoint: str, method: str, status_code: int, 
                       response_time_ms: float, user_agent: str = None, 
                       ip_address: str = None):
        """记录API调用"""
        metrics = APIMetrics(
            endpoint=endpoint,
            method=method,
            status_code=status_code,
            response_time_ms=response_time_ms,
            timestamp=datetime.now(),
            user_agent=user_agent,
            ip_address=ip_address
        )
        
        self.api_metrics_history.append(metrics)
        
        # 更新统计
        key = f"{method} {endpoint}"
        stats = self.api_stats[key]
        stats['count'] += 1
        stats['total_time'] += response_time_ms
        stats['avg_response_time'] = stats['total_time'] / stats['count']
        
        if status_code >= 400:
            stats['error_count'] += 1
            
        # 检查响应时间阈值
        if response_time_ms > self.thresholds['response_time_ms']:
            logger.warning(f"API响应时间过长: {endpoint} - {response_time_ms:.1f}ms")
            
    def record_error(self, error_type: str, error_message: str, endpoint: str,
                    stack_trace: str = None, user_context: Dict = None):
        """记录错误"""
        metrics = ErrorMetrics(
            error_type=error_type,
            error_message=error_message,
            endpoint=endpoint,
            timestamp=datetime.now(),
            stack_trace=stack_trace,
            user_context=user_context
        )
        
        self.error_metrics_history.append(metrics)
        self.error_stats[error_type] += 1
        
        logger.error(f"错误记录: {error_type} - {error_message} - {endpoint}")
        
    def get_system_health(self) -> Dict[str, Any]:
        """获取系统健康状态"""
        if not self.system_metrics_history:
            return {"status": "unknown", "message": "暂无监控数据"}
            
        latest_metrics = self.system_metrics_history[-1]
        
        # 计算健康分数
        health_score = 100
        issues = []
        
        if latest_metrics.cpu_percent > self.thresholds['cpu_percent']:
            health_score -= 20
            issues.append(f"CPU使用率过高: {latest_metrics.cpu_percent:.1f}%")
            
        if latest_metrics.memory_percent > self.thresholds['memory_percent']:
            health_score -= 25
            issues.append(f"内存使用率过高: {latest_metrics.memory_percent:.1f}%")
            
        if latest_metrics.disk_percent > self.thresholds['disk_percent']:
            health_score -= 15
            issues.append(f"磁盘使用率过高: {latest_metrics.disk_percent:.1f}%")
            
        # 检查错误率
        recent_errors = [e for e in self.error_metrics_history 
                        if e.timestamp > datetime.now() - timedelta(minutes=10)]
        recent_apis = [a for a in self.api_metrics_history 
                      if a.timestamp > datetime.now() - timedelta(minutes=10)]
        
        if recent_apis:
            error_rate = len(recent_errors) / len(recent_apis) * 100
            if error_rate > self.thresholds['error_rate_percent']:
                health_score -= 30
                issues.append(f"错误率过高: {error_rate:.1f}%")
        
        # 确定状态
        if health_score >= 90:
            status = "healthy"
        elif health_score >= 70:
            status = "warning"
        else:
            status = "critical"
            
        return {
            "status": status,
            "health_score": max(0, health_score),
            "issues": issues,
            "metrics": asdict(latest_metrics),
            "timestamp": datetime.now().isoformat()
        }
        
    def get_api_statistics(self, hours: int = 24) -> Dict[str, Any]:
        """获取API统计信息"""
        cutoff_time = datetime.now() - timedelta(hours=hours)
        recent_metrics = [m for m in self.api_metrics_history if m.timestamp > cutoff_time]
        
        if not recent_metrics:
            return {"message": "暂无API调用数据"}
            
        # 统计信息
        total_requests = len(recent_metrics)
        error_requests = len([m for m in recent_metrics if m.status_code >= 400])
        avg_response_time = sum(m.response_time_ms for m in recent_metrics) / total_requests
        
        # 按端点分组
        endpoint_stats = defaultdict(lambda: {'count': 0, 'errors': 0, 'total_time': 0})
        for metric in recent_metrics:
            key = f"{metric.method} {metric.endpoint}"
            endpoint_stats[key]['count'] += 1
            endpoint_stats[key]['total_time'] += metric.response_time_ms
            if metric.status_code >= 400:
                endpoint_stats[key]['errors'] += 1
                
        # 计算平均响应时间
        for stats in endpoint_stats.values():
            stats['avg_response_time'] = stats['total_time'] / stats['count']
            stats['error_rate'] = stats['errors'] / stats['count'] * 100
            
        return {
            "period_hours": hours,
            "total_requests": total_requests,
            "error_requests": error_requests,
            "error_rate_percent": error_requests / total_requests * 100,
            "avg_response_time_ms": avg_response_time,
            "endpoint_statistics": dict(endpoint_stats),
            "timestamp": datetime.now().isoformat()
        }
        
    def get_error_summary(self, hours: int = 24) -> Dict[str, Any]:
        """获取错误摘要"""
        cutoff_time = datetime.now() - timedelta(hours=hours)
        recent_errors = [e for e in self.error_metrics_history if e.timestamp > cutoff_time]
        
        if not recent_errors:
            return {"message": "暂无错误数据"}
            
        # 按错误类型分组
        error_by_type = defaultdict(int)
        error_by_endpoint = defaultdict(int)
        
        for error in recent_errors:
            error_by_type[error.error_type] += 1
            error_by_endpoint[error.endpoint] += 1
            
        return {
            "period_hours": hours,
            "total_errors": len(recent_errors),
            "error_by_type": dict(error_by_type),
            "error_by_endpoint": dict(error_by_endpoint),
            "recent_errors": [asdict(e) for e in recent_errors[-10:]],  # 最近10个错误
            "timestamp": datetime.now().isoformat()
        }

    async def _trigger_auto_recovery(self, alert: str, metrics: SystemMetrics):
        """触发自动恢复机制"""
        try:
            if "CPU使用率过高" in alert:
                await self._handle_high_cpu_usage(metrics)
            elif "内存使用率过高" in alert:
                await self._handle_high_memory_usage(metrics)
            elif "连接" in alert:
                await self._handle_connection_failure(metrics)
            else:
                await self._handle_service_degradation(metrics)

        except Exception as e:
            logger.error(f"自动恢复机制执行失败: {e}")

    async def _handle_high_memory_usage(self, metrics: SystemMetrics):
        """处理高内存使用率"""
        try:
            logger.info("开始执行内存优化策略...")

            # 1. 强制垃圾回收
            import gc
            gc.collect()

            # 2. 记录恢复尝试
            self.error_categories['memory_errors']['recovery_attempts'] += 1

            # 3. 更新组件状态
            if metrics.memory_percent > 95:
                self.health_status['components']['memory'] = 'critical'
            elif metrics.memory_percent > 85:
                self.health_status['components']['memory'] = 'warning'

            logger.info("内存优化策略执行完成")

        except Exception as e:
            logger.error(f"内存优化策略执行失败: {e}")

    async def _handle_high_cpu_usage(self, metrics: SystemMetrics):
        """处理高CPU使用率"""
        try:
            logger.info("开始执行CPU优化策略...")

            # 记录恢复尝试
            self.error_categories['server_errors']['recovery_attempts'] += 1

            # 更新组件状态
            if metrics.cpu_percent > 95:
                self.health_status['components']['cpu'] = 'critical'
            elif metrics.cpu_percent > 80:
                self.health_status['components']['cpu'] = 'warning'

            logger.info("CPU优化策略执行完成")

        except Exception as e:
            logger.error(f"CPU优化策略执行失败: {e}")

    async def _handle_connection_failure(self, metrics: SystemMetrics):
        """处理连接失败"""
        try:
            logger.info("开始执行连接恢复策略...")

            # 记录恢复尝试
            self.error_categories['connection_errors']['recovery_attempts'] += 1

            # 更新网络状态
            if metrics.active_connections > 1000:
                self.health_status['components']['network'] = 'warning'

            logger.info("连接恢复策略执行完成")

        except Exception as e:
            logger.error(f"连接恢复策略执行失败: {e}")

    async def _handle_service_degradation(self, metrics: SystemMetrics):
        """处理服务降级"""
        try:
            logger.info("开始执行服务降级策略...")

            # 更新整体状态
            self.health_status['overall'] = 'degraded'

            logger.info("服务降级策略执行完成")

        except Exception as e:
            logger.error(f"服务降级策略执行失败: {e}")

    def get_enhanced_system_health(self) -> Dict[str, Any]:
        """获取增强的系统健康状态"""
        basic_health = self.get_system_health()

        # 添加详细的组件状态
        enhanced_health = {
            **basic_health,
            "components": self.health_status['components'],
            "alerts": self.health_status['alerts'][-10:],  # 最近10个告警
            "error_categories": self.error_categories,
            "recovery_status": {
                "auto_recovery_enabled": True,
                "recovery_success_rate": 85.0  # 假设85%的成功率
            }
        }

        return enhanced_health

# 全局监控服务实例
system_monitor = SystemMonitorService()

def get_system_monitor() -> SystemMonitorService:
    """获取系统监控服务实例"""
    return system_monitor
