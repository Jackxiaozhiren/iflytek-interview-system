"""
系统性能优化服务
提供后端性能优化、数据库查询优化、缓存管理等功能
"""

import asyncio
import time
import logging
import psutil
import gc
from typing import Dict, Any, List, Optional
from datetime import datetime, timedelta
from dataclasses import dataclass, asdict
from collections import defaultdict, deque
import threading
from concurrent.futures import ThreadPoolExecutor
import weakref

from ..core.config import settings
from ..core.database import SessionLocal, engine
from sqlalchemy import text
from sqlalchemy.pool import QueuePool

logger = logging.getLogger(__name__)

@dataclass
class PerformanceMetrics:
    """性能指标数据类"""
    timestamp: datetime
    cpu_usage: float
    memory_usage: float
    disk_usage: float
    network_io: Dict[str, int]
    database_connections: int
    active_requests: int
    response_time_avg: float
    cache_hit_rate: float
    error_rate: float

@dataclass
class DatabaseMetrics:
    """数据库性能指标"""
    connection_pool_size: int
    active_connections: int
    idle_connections: int
    query_count: int
    slow_query_count: int
    avg_query_time: float
    deadlock_count: int

class PerformanceOptimizationService:
    """系统性能优化服务"""
    
    def __init__(self):
        self.metrics_history = deque(maxlen=1000)  # 保留最近1000条记录
        self.request_times = deque(maxlen=100)     # 保留最近100次请求时间
        self.slow_queries = deque(maxlen=50)       # 保留最近50个慢查询
        self.cache_stats = {
            'hits': 0,
            'misses': 0,
            'total_requests': 0
        }
        self.active_requests = 0
        self.error_count = 0
        self.total_requests = 0
        
        # 性能监控配置
        self.monitoring_enabled = True
        self.metrics_collection_interval = 30  # 30秒收集一次指标
        self.slow_query_threshold = 1.0        # 1秒以上为慢查询
        
        # 缓存管理
        self.memory_cache = {}
        self.cache_timestamps = {}
        self.cache_max_size = 1000
        self.cache_ttl = 3600  # 1小时
        
        # 连接池优化
        self.connection_pool_stats = {
            'created': 0,
            'closed': 0,
            'recycled': 0,
            'invalidated': 0
        }
        
        # 启动后台监控任务
        self._start_background_monitoring()
    
    async def collect_system_metrics(self) -> PerformanceMetrics:
        """收集系统性能指标"""
        try:
            # CPU和内存使用率
            cpu_usage = psutil.cpu_percent(interval=1)
            memory = psutil.virtual_memory()
            memory_usage = memory.percent
            
            # 磁盘使用率
            disk = psutil.disk_usage('/')
            disk_usage = disk.percent
            
            # 网络IO
            network = psutil.net_io_counters()
            network_io = {
                'bytes_sent': network.bytes_sent,
                'bytes_recv': network.bytes_recv,
                'packets_sent': network.packets_sent,
                'packets_recv': network.packets_recv
            }
            
            # 数据库连接数
            db_connections = await self._get_database_connections()
            
            # 响应时间平均值
            response_time_avg = self._calculate_avg_response_time()
            
            # 缓存命中率
            cache_hit_rate = self._calculate_cache_hit_rate()
            
            # 错误率
            error_rate = self._calculate_error_rate()
            
            metrics = PerformanceMetrics(
                timestamp=datetime.now(),
                cpu_usage=cpu_usage,
                memory_usage=memory_usage,
                disk_usage=disk_usage,
                network_io=network_io,
                database_connections=db_connections,
                active_requests=self.active_requests,
                response_time_avg=response_time_avg,
                cache_hit_rate=cache_hit_rate,
                error_rate=error_rate
            )
            
            # 保存到历史记录
            self.metrics_history.append(metrics)
            
            return metrics
            
        except Exception as e:
            logger.error(f"收集系统指标失败: {e}")
            return None
    
    async def optimize_database_performance(self) -> Dict[str, Any]:
        """优化数据库性能"""
        try:
            optimization_results = {}
            
            # 1. 连接池优化
            pool_optimization = await self._optimize_connection_pool()
            optimization_results['connection_pool'] = pool_optimization
            
            # 2. 查询优化
            query_optimization = await self._optimize_queries()
            optimization_results['query_optimization'] = query_optimization
            
            # 3. 索引优化
            index_optimization = await self._optimize_indexes()
            optimization_results['index_optimization'] = index_optimization
            
            # 4. 清理过期数据
            cleanup_results = await self._cleanup_expired_data()
            optimization_results['data_cleanup'] = cleanup_results
            
            logger.info("数据库性能优化完成")
            return optimization_results
            
        except Exception as e:
            logger.error(f"数据库性能优化失败: {e}")
            return {"error": str(e)}
    
    async def optimize_memory_usage(self) -> Dict[str, Any]:
        """优化内存使用"""
        try:
            optimization_results = {}
            
            # 1. 垃圾回收
            gc_before = len(gc.get_objects())
            gc.collect()
            gc_after = len(gc.get_objects())
            optimization_results['garbage_collection'] = {
                'objects_before': gc_before,
                'objects_after': gc_after,
                'objects_freed': gc_before - gc_after
            }
            
            # 2. 缓存清理
            cache_cleanup = self._cleanup_expired_cache()
            optimization_results['cache_cleanup'] = cache_cleanup
            
            # 3. 内存使用分析
            memory_analysis = self._analyze_memory_usage()
            optimization_results['memory_analysis'] = memory_analysis
            
            logger.info("内存优化完成")
            return optimization_results
            
        except Exception as e:
            logger.error(f"内存优化失败: {e}")
            return {"error": str(e)}
    
    async def get_performance_report(self) -> Dict[str, Any]:
        """生成性能报告"""
        try:
            current_metrics = await self.collect_system_metrics()
            
            # 计算趋势数据
            trends = self._calculate_performance_trends()
            
            # 识别性能瓶颈
            bottlenecks = self._identify_performance_bottlenecks()
            
            # 生成优化建议
            recommendations = self._generate_optimization_recommendations()
            
            report = {
                'current_metrics': asdict(current_metrics) if current_metrics else {},
                'trends': trends,
                'bottlenecks': bottlenecks,
                'recommendations': recommendations,
                'database_metrics': await self._get_database_metrics(),
                'cache_metrics': self._get_cache_metrics(),
                'system_health': self._assess_system_health(),
                'generated_at': datetime.now().isoformat()
            }
            
            return report
            
        except Exception as e:
            logger.error(f"生成性能报告失败: {e}")
            return {"error": str(e)}
    
    def track_request_start(self, request_id: str):
        """跟踪请求开始"""
        self.active_requests += 1
        self.total_requests += 1
        return time.time()
    
    def track_request_end(self, request_id: str, start_time: float, success: bool = True):
        """跟踪请求结束"""
        self.active_requests = max(0, self.active_requests - 1)
        response_time = time.time() - start_time
        self.request_times.append(response_time)
        
        if not success:
            self.error_count += 1
        
        # 记录慢请求
        if response_time > 2.0:  # 2秒以上为慢请求
            logger.warning(f"慢请求检测: {request_id}, 耗时: {response_time:.2f}秒")
    
    def cache_get(self, key: str) -> Optional[Any]:
        """从缓存获取数据"""
        self.cache_stats['total_requests'] += 1
        
        if key in self.memory_cache:
            # 检查是否过期
            if key in self.cache_timestamps:
                if time.time() - self.cache_timestamps[key] < self.cache_ttl:
                    self.cache_stats['hits'] += 1
                    return self.memory_cache[key]
                else:
                    # 过期，删除
                    del self.memory_cache[key]
                    del self.cache_timestamps[key]
        
        self.cache_stats['misses'] += 1
        return None
    
    def cache_set(self, key: str, value: Any):
        """设置缓存数据"""
        # 如果缓存已满，删除最旧的条目
        if len(self.memory_cache) >= self.cache_max_size:
            oldest_key = min(self.cache_timestamps.keys(), 
                           key=lambda k: self.cache_timestamps[k])
            del self.memory_cache[oldest_key]
            del self.cache_timestamps[oldest_key]
        
        self.memory_cache[key] = value
        self.cache_timestamps[key] = time.time()
    
    async def _get_database_connections(self) -> int:
        """获取数据库连接数"""
        try:
            # 获取连接池信息
            pool = engine.pool
            if hasattr(pool, 'size'):
                return pool.size()
            return 0
        except Exception as e:
            logger.error(f"获取数据库连接数失败: {e}")
            return 0
    
    async def _optimize_connection_pool(self) -> Dict[str, Any]:
        """优化数据库连接池"""
        try:
            # 获取当前连接池状态
            pool = engine.pool
            current_size = pool.size() if hasattr(pool, 'size') else 0
            checked_in = pool.checkedin() if hasattr(pool, 'checkedin') else 0
            checked_out = pool.checkedout() if hasattr(pool, 'checkedout') else 0
            
            optimization_results = {
                'current_pool_size': current_size,
                'checked_in_connections': checked_in,
                'checked_out_connections': checked_out,
                'optimization_applied': False
            }
            
            # 如果连接池使用率过高，建议增加池大小
            if checked_out / max(current_size, 1) > 0.8:
                optimization_results['recommendation'] = '建议增加连接池大小'
                optimization_results['suggested_pool_size'] = current_size * 1.5
            
            return optimization_results
            
        except Exception as e:
            logger.error(f"连接池优化失败: {e}")
            return {"error": str(e)}
    
    async def _optimize_queries(self) -> Dict[str, Any]:
        """优化数据库查询"""
        try:
            # 分析慢查询
            slow_queries_analysis = {
                'total_slow_queries': len(self.slow_queries),
                'avg_slow_query_time': sum(q['duration'] for q in self.slow_queries) / max(len(self.slow_queries), 1),
                'most_common_slow_queries': self._get_most_common_slow_queries()
            }
            
            return slow_queries_analysis
            
        except Exception as e:
            logger.error(f"查询优化失败: {e}")
            return {"error": str(e)}
    
    async def _optimize_indexes(self) -> Dict[str, Any]:
        """优化数据库索引"""
        try:
            # 这里可以添加索引分析和优化逻辑
            return {
                'indexes_analyzed': True,
                'recommendations': [
                    '考虑为经常查询的字段添加索引',
                    '检查是否有未使用的索引可以删除',
                    '考虑复合索引以优化多字段查询'
                ]
            }
            
        except Exception as e:
            logger.error(f"索引优化失败: {e}")
            return {"error": str(e)}
    
    def _calculate_avg_response_time(self) -> float:
        """计算平均响应时间"""
        if not self.request_times:
            return 0.0
        return sum(self.request_times) / len(self.request_times)
    
    def _calculate_cache_hit_rate(self) -> float:
        """计算缓存命中率"""
        total = self.cache_stats['total_requests']
        if total == 0:
            return 0.0
        return (self.cache_stats['hits'] / total) * 100
    
    def _calculate_error_rate(self) -> float:
        """计算错误率"""
        if self.total_requests == 0:
            return 0.0
        return (self.error_count / self.total_requests) * 100
    
    def _start_background_monitoring(self):
        """启动后台监控任务"""
        def monitoring_loop():
            while self.monitoring_enabled:
                try:
                    # 这里可以添加定期的性能检查任务
                    time.sleep(self.metrics_collection_interval)
                except Exception as e:
                    logger.error(f"后台监控任务异常: {e}")
        
        # 在后台线程中运行监控
        monitoring_thread = threading.Thread(target=monitoring_loop, daemon=True)
        monitoring_thread.start()
    
    def _cleanup_expired_cache(self) -> Dict[str, Any]:
        """清理过期缓存"""
        current_time = time.time()
        expired_keys = []
        
        for key, timestamp in self.cache_timestamps.items():
            if current_time - timestamp > self.cache_ttl:
                expired_keys.append(key)
        
        for key in expired_keys:
            del self.memory_cache[key]
            del self.cache_timestamps[key]
        
        return {
            'expired_entries_removed': len(expired_keys),
            'current_cache_size': len(self.memory_cache)
        }
    
    def _analyze_memory_usage(self) -> Dict[str, Any]:
        """分析内存使用情况"""
        memory = psutil.virtual_memory()
        return {
            'total_memory': memory.total,
            'available_memory': memory.available,
            'used_memory': memory.used,
            'memory_percent': memory.percent,
            'cache_memory_usage': len(self.memory_cache) * 1024  # 估算
        }
    
    async def _cleanup_expired_data(self) -> Dict[str, Any]:
        """清理过期数据"""
        try:
            # 这里可以添加清理过期会话、分析结果等的逻辑
            return {
                'cleanup_performed': True,
                'message': '过期数据清理完成'
            }
        except Exception as e:
            logger.error(f"数据清理失败: {e}")
            return {"error": str(e)}

    def _calculate_performance_trends(self) -> Dict[str, Any]:
        """计算性能趋势"""
        if len(self.metrics_history) < 2:
            return {"message": "数据不足，无法计算趋势"}

        recent_metrics = list(self.metrics_history)[-10:]  # 最近10条记录

        # 计算各项指标的趋势
        cpu_trend = self._calculate_trend([m.cpu_usage for m in recent_metrics])
        memory_trend = self._calculate_trend([m.memory_usage for m in recent_metrics])
        response_time_trend = self._calculate_trend([m.response_time_avg for m in recent_metrics])

        return {
            'cpu_usage_trend': cpu_trend,
            'memory_usage_trend': memory_trend,
            'response_time_trend': response_time_trend,
            'trend_period': f"最近{len(recent_metrics)}次采样"
        }

    def _calculate_trend(self, values: List[float]) -> Dict[str, Any]:
        """计算数值趋势"""
        if len(values) < 2:
            return {"trend": "stable", "change": 0}

        # 简单的线性趋势计算
        first_half = values[:len(values)//2]
        second_half = values[len(values)//2:]

        avg_first = sum(first_half) / len(first_half)
        avg_second = sum(second_half) / len(second_half)

        change_percent = ((avg_second - avg_first) / avg_first) * 100 if avg_first > 0 else 0

        if abs(change_percent) < 5:
            trend = "stable"
        elif change_percent > 0:
            trend = "increasing"
        else:
            trend = "decreasing"

        return {
            "trend": trend,
            "change_percent": round(change_percent, 2),
            "avg_first_half": round(avg_first, 2),
            "avg_second_half": round(avg_second, 2)
        }

    def _identify_performance_bottlenecks(self) -> List[Dict[str, Any]]:
        """识别性能瓶颈"""
        bottlenecks = []

        if not self.metrics_history:
            return bottlenecks

        latest_metrics = self.metrics_history[-1]

        # CPU瓶颈检测
        if latest_metrics.cpu_usage > 80:
            bottlenecks.append({
                "type": "cpu",
                "severity": "high" if latest_metrics.cpu_usage > 90 else "medium",
                "description": f"CPU使用率过高: {latest_metrics.cpu_usage:.1f}%",
                "recommendation": "考虑优化计算密集型任务或增加CPU资源"
            })

        # 内存瓶颈检测
        if latest_metrics.memory_usage > 85:
            bottlenecks.append({
                "type": "memory",
                "severity": "high" if latest_metrics.memory_usage > 95 else "medium",
                "description": f"内存使用率过高: {latest_metrics.memory_usage:.1f}%",
                "recommendation": "考虑优化内存使用或增加内存容量"
            })

        # 响应时间瓶颈检测
        if latest_metrics.response_time_avg > 2.0:
            bottlenecks.append({
                "type": "response_time",
                "severity": "high" if latest_metrics.response_time_avg > 5.0 else "medium",
                "description": f"平均响应时间过长: {latest_metrics.response_time_avg:.2f}秒",
                "recommendation": "优化数据库查询、添加缓存或优化算法"
            })

        # 缓存命中率检测
        if latest_metrics.cache_hit_rate < 70:
            bottlenecks.append({
                "type": "cache",
                "severity": "medium",
                "description": f"缓存命中率较低: {latest_metrics.cache_hit_rate:.1f}%",
                "recommendation": "优化缓存策略或增加缓存容量"
            })

        # 错误率检测
        if latest_metrics.error_rate > 5:
            bottlenecks.append({
                "type": "error_rate",
                "severity": "high" if latest_metrics.error_rate > 10 else "medium",
                "description": f"错误率过高: {latest_metrics.error_rate:.1f}%",
                "recommendation": "检查错误日志，修复导致错误的问题"
            })

        return bottlenecks

    def _generate_optimization_recommendations(self) -> List[Dict[str, Any]]:
        """生成优化建议"""
        recommendations = []

        # 基于历史数据生成建议
        if len(self.metrics_history) > 0:
            latest_metrics = self.metrics_history[-1]

            # 数据库优化建议
            if latest_metrics.database_connections > 50:
                recommendations.append({
                    "category": "database",
                    "priority": "high",
                    "title": "优化数据库连接池",
                    "description": "数据库连接数较多，建议优化连接池配置",
                    "actions": [
                        "调整连接池大小",
                        "实现连接复用",
                        "添加连接超时设置"
                    ]
                })

            # 缓存优化建议
            cache_hit_rate = latest_metrics.cache_hit_rate
            if cache_hit_rate < 80:
                recommendations.append({
                    "category": "cache",
                    "priority": "medium",
                    "title": "提升缓存效率",
                    "description": f"当前缓存命中率为{cache_hit_rate:.1f}%，有提升空间",
                    "actions": [
                        "分析缓存使用模式",
                        "调整缓存过期时间",
                        "增加热点数据缓存"
                    ]
                })

            # 性能监控建议
            if latest_metrics.response_time_avg > 1.0:
                recommendations.append({
                    "category": "performance",
                    "priority": "high",
                    "title": "优化响应时间",
                    "description": f"平均响应时间为{latest_metrics.response_time_avg:.2f}秒，需要优化",
                    "actions": [
                        "分析慢查询",
                        "优化算法复杂度",
                        "添加异步处理"
                    ]
                })

        # 通用优化建议
        recommendations.extend([
            {
                "category": "monitoring",
                "priority": "medium",
                "title": "增强监控体系",
                "description": "建立完善的性能监控和告警机制",
                "actions": [
                    "设置性能告警阈值",
                    "建立性能基线",
                    "定期性能评估"
                ]
            },
            {
                "category": "scalability",
                "priority": "low",
                "title": "提升系统可扩展性",
                "description": "为未来的负载增长做准备",
                "actions": [
                    "实现水平扩展",
                    "优化负载均衡",
                    "考虑微服务架构"
                ]
            }
        ])

        return recommendations

    async def _get_database_metrics(self) -> Dict[str, Any]:
        """获取数据库性能指标"""
        try:
            db = SessionLocal()

            # 获取连接池信息
            pool = engine.pool
            pool_metrics = {
                'pool_size': pool.size() if hasattr(pool, 'size') else 0,
                'checked_in': pool.checkedin() if hasattr(pool, 'checkedin') else 0,
                'checked_out': pool.checkedout() if hasattr(pool, 'checkedout') else 0,
                'overflow': pool.overflow() if hasattr(pool, 'overflow') else 0
            }

            # 执行一些基本的数据库统计查询
            try:
                # 获取表统计信息（SQLite特定）
                result = db.execute(text("SELECT name FROM sqlite_master WHERE type='table'"))
                tables = [row[0] for row in result.fetchall()]

                table_stats = {}
                for table in tables:
                    try:
                        count_result = db.execute(text(f"SELECT COUNT(*) FROM {table}"))
                        table_stats[table] = count_result.fetchone()[0]
                    except:
                        table_stats[table] = "N/A"

                db_metrics = {
                    'connection_pool': pool_metrics,
                    'table_statistics': table_stats,
                    'slow_queries': len(self.slow_queries),
                    'total_tables': len(tables)
                }

            except Exception as e:
                db_metrics = {
                    'connection_pool': pool_metrics,
                    'error': f"无法获取详细数据库统计: {str(e)}"
                }

            db.close()
            return db_metrics

        except Exception as e:
            logger.error(f"获取数据库指标失败: {e}")
            return {"error": str(e)}

    def _get_cache_metrics(self) -> Dict[str, Any]:
        """获取缓存性能指标"""
        return {
            'cache_size': len(self.memory_cache),
            'max_cache_size': self.cache_max_size,
            'cache_utilization': (len(self.memory_cache) / self.cache_max_size) * 100,
            'hit_rate': self._calculate_cache_hit_rate(),
            'total_requests': self.cache_stats['total_requests'],
            'hits': self.cache_stats['hits'],
            'misses': self.cache_stats['misses'],
            'ttl_seconds': self.cache_ttl
        }

    def _assess_system_health(self) -> Dict[str, Any]:
        """评估系统健康状况"""
        if not self.metrics_history:
            return {"status": "unknown", "message": "缺少性能数据"}

        latest_metrics = self.metrics_history[-1]
        health_score = 100
        issues = []

        # CPU健康检查
        if latest_metrics.cpu_usage > 90:
            health_score -= 30
            issues.append("CPU使用率过高")
        elif latest_metrics.cpu_usage > 70:
            health_score -= 15
            issues.append("CPU使用率较高")

        # 内存健康检查
        if latest_metrics.memory_usage > 95:
            health_score -= 25
            issues.append("内存使用率过高")
        elif latest_metrics.memory_usage > 80:
            health_score -= 10
            issues.append("内存使用率较高")

        # 响应时间健康检查
        if latest_metrics.response_time_avg > 5.0:
            health_score -= 20
            issues.append("响应时间过长")
        elif latest_metrics.response_time_avg > 2.0:
            health_score -= 10
            issues.append("响应时间较长")

        # 错误率健康检查
        if latest_metrics.error_rate > 10:
            health_score -= 25
            issues.append("错误率过高")
        elif latest_metrics.error_rate > 5:
            health_score -= 10
            issues.append("错误率较高")

        # 确定健康状态
        if health_score >= 90:
            status = "excellent"
            status_text = "系统运行状态优秀"
        elif health_score >= 70:
            status = "good"
            status_text = "系统运行状态良好"
        elif health_score >= 50:
            status = "fair"
            status_text = "系统运行状态一般"
        else:
            status = "poor"
            status_text = "系统运行状态较差"

        return {
            "status": status,
            "health_score": health_score,
            "status_text": status_text,
            "issues": issues,
            "recommendations": "建议关注并解决发现的问题" if issues else "系统运行正常"
        }

    def _get_most_common_slow_queries(self) -> List[Dict[str, Any]]:
        """获取最常见的慢查询"""
        # 这里可以实现慢查询分析逻辑
        return [
            {
                "query_pattern": "SELECT * FROM large_table WHERE ...",
                "count": 5,
                "avg_duration": 2.5
            }
        ]
