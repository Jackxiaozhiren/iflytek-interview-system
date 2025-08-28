<template>
  <div class="learning-module-details">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="breadcrumb">
          <el-breadcrumb separator="/">
            <el-breadcrumb-item @click="router.push('/learning-path')">学习路径</el-breadcrumb-item>
            <el-breadcrumb-item @click="router.push(`/learning-path/${pathId}/details`)">{{ pathTitle }}</el-breadcrumb-item>
            <el-breadcrumb-item>{{ moduleDetails.name }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        
        <div class="module-header">
          <div class="module-info">
            <h1>{{ moduleDetails.name }}</h1>
            <div class="module-meta">
              <el-tag :type="getModuleTypeColor(moduleDetails.type)" size="large">
                {{ getModuleTypeName(moduleDetails.type) }}
              </el-tag>
              <span class="duration">学习时长：{{ moduleDetails.duration }}小时</span>
              <el-tag :type="getStatusType(moduleDetails.status)" size="large">
                {{ getStatusText(moduleDetails.status) }}
              </el-tag>
            </div>
            <p class="module-description">{{ moduleDetails.description }}</p>
          </div>
          
          <div class="module-actions">
            <el-button size="large" @click="router.back()">返回</el-button>
            <el-button v-if="moduleDetails.status === 'not_started'" type="primary" size="large" @click="startModule">
              <el-icon><CaretRight /></el-icon>
              开始学习
            </el-button>
            <el-button v-else-if="moduleDetails.status === 'in_progress'" type="warning" size="large" @click="continueModule">
              <el-icon><VideoPlay /></el-icon>
              继续学习
            </el-button>
            <el-button v-else type="success" size="large" @click="reviewModule">
              <el-icon><Refresh /></el-icon>
              复习回顾
            </el-button>
          </div>
        </div>
      </div>
    </div>

    <!-- 学习进度概览 -->
    <div class="progress-overview">
      <el-card class="progress-card">
        <template #header>
          <div class="card-header">
            <el-icon><TrendCharts /></el-icon>
            <span>学习进度</span>
          </div>
        </template>
        
        <div class="progress-content">
          <div class="progress-circle">
            <el-progress 
              type="circle" 
              :percentage="moduleProgress" 
              :width="100"
              :stroke-width="8"
              color="#1890ff"
            >
              <template #default="{ percentage }">
                <span class="progress-text">{{ percentage }}%</span>
              </template>
            </el-progress>
          </div>
          
          <div class="progress-stats">
            <div class="stat-item">
              <span class="stat-number">{{ completedSections }}</span>
              <span class="stat-label">已完成章节</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ totalSections }}</span>
              <span class="stat-label">总章节数</span>
            </div>
            <div class="stat-item">
              <span class="stat-number">{{ studyTime }}</span>
              <span class="stat-label">已学习时长(小时)</span>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 学习内容 -->
    <div class="learning-content">
      <el-card class="content-card">
        <template #header>
          <div class="card-header">
            <el-icon><Reading /></el-icon>
            <span>学习内容</span>
          </div>
        </template>
        
        <div class="content-sections">
          <div v-for="(section, index) in moduleDetails.sections" :key="section.id"
               :data-section-id="section.id" class="section-item">
            <div class="section-header">
              <div class="section-number">{{ index + 1 }}</div>
              <div class="section-info">
                <h4>{{ section.title }}</h4>
                <p>{{ section.description }}</p>
                <div class="section-meta">
                  <span class="section-duration">{{ section.duration }}分钟</span>
                  <el-tag :type="getSectionStatusType(section.status)" size="small">
                    {{ getSectionStatusText(section.status) }}
                  </el-tag>
                </div>
              </div>
              <div class="section-actions">
                <el-button v-if="section.status === 'not_started'" type="primary" size="small" @click="startSection(section.id)">
                  开始学习
                </el-button>
                <el-button v-else-if="section.status === 'in_progress'" type="warning" size="small" @click="continueSection(section.id)">
                  继续学习
                </el-button>
                <el-button v-else type="success" size="small" @click="reviewSection(section.id)">
                  复习回顾
                </el-button>
                <el-button size="small" text @click="openResourceLibrary">
                  查看资源
                </el-button>
              </div>
            </div>
            
            <!-- 章节内容预览 -->
            <div v-if="section.status !== 'not_started'" class="section-content">
              <div class="content-preview">
                <h5>学习要点</h5>
                <ul class="key-points">
                  <li v-for="point in section.keyPoints" :key="point">{{ point }}</li>
                </ul>
              </div>
              
              <div v-if="section.resources" class="section-resources">
                <h5>相关资源</h5>
                <div class="resource-list">
                  <div v-for="resource in section.resources" :key="resource.id" class="resource-item">
                    <el-icon v-if="resource.type === 'video'"><VideoPlay /></el-icon>
                    <el-icon v-else-if="resource.type === 'document'"><Document /></el-icon>
                    <el-icon v-else><Link /></el-icon>
                    <span>{{ resource.name }}</span>
                    <el-button size="small" text @click="openResource(resource)">查看</el-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- AI助手招聘效率优化模块 -->
    <div class="ai-recruitment-optimization" v-if="showAIOptimizationModule">
      <el-card class="optimization-card">
        <template #header>
          <div class="card-header">
            <el-icon><Cpu /></el-icon>
            <span>AI助手 - 招聘效率优化</span>
            <div class="header-actions">
              <el-button size="small" text @click="toggleAIModule">
                <el-icon><Close /></el-icon>
              </el-button>
            </div>
          </div>
        </template>

        <!-- 快速操作区域 -->
        <div class="quick-operations-section">
          <h4 class="section-title">
            <el-icon><Operation /></el-icon>
            快速操作
          </h4>
          <div class="quick-operations-grid">
            <el-button
              type="primary"
              size="large"
              :loading="optimizationLoading.analysis"
              @click="startOptimizationAnalysis"
            >
              <el-icon><Cpu /></el-icon>
              开始优化分析
            </el-button>
            <el-button
              type="success"
              size="large"
              :loading="optimizationLoading.report"
              @click="viewAnalysisReport"
            >
              <el-icon><Document /></el-icon>
              查看分析报告
            </el-button>
            <el-button
              type="warning"
              size="large"
              @click="configureOptimizationParams"
            >
              <el-icon><Setting /></el-icon>
              配置优化参数
            </el-button>
            <el-button
              type="info"
              size="large"
              :loading="optimizationLoading.export"
              @click="exportOptimizationResults"
            >
              <el-icon><Download /></el-icon>
              导出优化结果
            </el-button>
          </div>
        </div>

        <!-- 核心功能模块 -->
        <div class="core-features-section">
          <h4 class="section-title">
            <el-icon><Grid /></el-icon>
            核心功能模块
          </h4>
          <div class="features-grid">
            <div
              v-for="feature in coreFeatures"
              :key="feature.id"
              class="feature-card"
              @click="openFeatureDetail(feature)"
            >
              <div class="feature-icon">
                <el-icon>
                  <component :is="feature.icon" />
                </el-icon>
              </div>
              <div class="feature-content">
                <h5>{{ feature.title }}</h5>
                <p>{{ feature.description }}</p>
                <div class="feature-stats">
                  <span class="stat-item">
                    <el-icon><TrendCharts /></el-icon>
                    {{ feature.stats.efficiency }}% 效率提升
                  </span>
                  <span class="stat-item">
                    <el-icon><Timer /></el-icon>
                    {{ feature.stats.timeReduction }}% 时间节省
                  </span>
                </div>
              </div>
              <div class="feature-status">
                <el-tag :type="getFeatureStatusType(feature.status)">
                  {{ feature.status }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 学习笔记 -->
    <div class="learning-notes">
      <el-card class="notes-card">
        <template #header>
          <div class="card-header">
            <el-icon><EditPen /></el-icon>
            <span>学习笔记</span>
          </div>
        </template>

        <div class="notes-content">
          <el-input
            v-model="learningNotes"
            type="textarea"
            :rows="6"
            placeholder="记录您的学习心得和重要知识点..."
            @blur="saveNotes"
          />
          <div class="notes-actions">
            <el-button @click="saveNotes" type="primary">
              <el-icon><Check /></el-icon>
              保存笔记
            </el-button>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 学习操作详情弹窗 -->
    <el-dialog
      v-model="showLearningModal"
      :title="currentLearningContent.title"
      width="800px"
      :before-close="closeLearningModal"
      class="learning-modal"
    >
      <div class="learning-action-content">
        <!-- 基本描述 -->
        <div class="content-description">
          <p>{{ currentLearningContent.content }}</p>
        </div>

        <!-- 学习目标 (开始学习) -->
        <div v-if="currentLearningContent.learningGoals" class="learning-goals">
          <h4><el-icon><Trophy /></el-icon> 学习目标</h4>
          <div class="goals-grid">
            <div v-for="(goal, index) in currentLearningContent.learningGoals" :key="index" class="goal-item">
              <el-icon><Check /></el-icon>
              <span>{{ goal }}</span>
            </div>
          </div>
        </div>

        <!-- 学习路径信息 (开始学习) -->
        <div v-if="currentLearningContent.learningPath" class="learning-path-info">
          <h4><el-icon><TrendCharts /></el-icon> 学习路径</h4>
          <div class="path-stats">
            <div class="stat-item">
              <span class="label">总章节数</span>
              <span class="value">{{ currentLearningContent.learningPath.totalSections }}</span>
            </div>
            <div class="stat-item">
              <span class="label">预计时长</span>
              <span class="value">{{ currentLearningContent.learningPath.estimatedTime }}</span>
            </div>
            <div class="stat-item">
              <span class="label">难度等级</span>
              <span class="value">{{ currentLearningContent.learningPath.difficulty }}</span>
            </div>
          </div>
        </div>

        <!-- 进度详情 (继续学习) -->
        <div v-if="currentLearningContent.progressDetails" class="progress-details">
          <h4><el-icon><TrendCharts /></el-icon> 学习进度</h4>
          <div class="progress-info">
            <el-progress
              :percentage="currentLearningContent.progressDetails.percentage"
              :stroke-width="8"
              :color="getProgressColor(currentLearningContent.progressDetails.percentage)"
            />
            <div class="progress-stats">
              <span>已完成 {{ currentLearningContent.progressDetails.completedSections }}/{{ currentLearningContent.progressDetails.totalSections }} 章节</span>
              <span>学习时长：{{ currentLearningContent.progressDetails.studyTime }}小时</span>
              <span>剩余时间：{{ currentLearningContent.progressDetails.remainingTime }}小时</span>
            </div>
          </div>
        </div>

        <!-- 下一步学习 (继续学习) -->
        <div v-if="currentLearningContent.nextSteps" class="next-steps">
          <h4><el-icon><CaretRight /></el-icon> 下一步学习</h4>
          <div class="next-section-card" v-if="currentLearningContent.nextSteps.section">
            <div class="section-header">
              <h5>{{ currentLearningContent.nextSteps.section.title }}</h5>
              <el-tag :type="getDifficultyType(currentLearningContent.nextSteps.difficulty)">
                {{ currentLearningContent.nextSteps.difficulty }}
              </el-tag>
            </div>
            <p>{{ currentLearningContent.nextSteps.section.description }}</p>
            <div class="section-meta">
              <span>⏱️ {{ currentLearningContent.nextSteps.estimatedTime }}</span>
              <span>📋 {{ currentLearningContent.nextSteps.keyPoints?.length || 0 }} 个要点</span>
            </div>
          </div>
        </div>

        <!-- 学习成果总结 (复习) -->
        <div v-if="currentLearningContent.learningOutcomes" class="learning-outcomes">
          <h4><el-icon><Medal /></el-icon> 学习成果</h4>
          <div class="outcomes-grid">
            <div class="outcome-card">
              <div class="outcome-number">{{ currentLearningContent.learningOutcomes.completedSections }}</div>
              <div class="outcome-label">已完成章节</div>
            </div>
            <div class="outcome-card">
              <div class="outcome-number">{{ currentLearningContent.learningOutcomes.totalKeyPoints }}</div>
              <div class="outcome-label">掌握知识点</div>
            </div>
            <div class="outcome-card">
              <div class="outcome-number">{{ currentLearningContent.learningOutcomes.studyTime }}h</div>
              <div class="outcome-label">学习时长</div>
            </div>
            <div class="outcome-card">
              <div class="outcome-number">{{ currentLearningContent.learningOutcomes.masteryLevel }}</div>
              <div class="outcome-label">掌握程度</div>
            </div>
          </div>
        </div>

        <!-- 知识体系梳理 (复习) -->
        <div v-if="currentLearningContent.knowledgeMap" class="knowledge-map">
          <h4><el-icon><Link /></el-icon> 知识体系</h4>
          <div class="knowledge-sections">
            <div class="knowledge-section">
              <h5>核心主题</h5>
              <div class="topic-tags">
                <el-tag v-for="topic in currentLearningContent.knowledgeMap.coreTopics" :key="topic" type="primary">
                  {{ topic }}
                </el-tag>
              </div>
            </div>
            <div class="knowledge-section">
              <h5>应用场景</h5>
              <ul class="application-list">
                <li v-for="app in currentLearningContent.knowledgeMap.applications" :key="app">{{ app }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 个性化建议 -->
        <div v-if="currentLearningContent.personalizedTips" class="personalized-tips">
          <h4><el-icon><Star /></el-icon> 个性化建议</h4>
          <div class="tips-list">
            <div v-for="(tip, index) in currentLearningContent.personalizedTips" :key="index" class="tip-item">
              <el-icon><Star /></el-icon>
              <span>{{ tip }}</span>
            </div>
          </div>
        </div>

        <!-- 学习方法推荐 -->
        <div v-if="currentLearningContent.studyMethods" class="study-methods">
          <h4><el-icon><Tools /></el-icon> 学习方法</h4>
          <div class="methods-grid">
            <div v-for="method in currentLearningContent.studyMethods" :key="method.name" class="method-card">
              <div class="method-icon">{{ method.icon }}</div>
              <div class="method-content">
                <h5>{{ method.name }}</h5>
                <p>{{ method.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- 相关资源 -->
        <div v-if="currentLearningContent.resources?.length" class="related-resources">
          <h4><el-icon><Folder /></el-icon> 相关资源</h4>
          <div class="resource-grid">
            <div v-for="resource in currentLearningContent.resources" :key="resource.id || resource.name"
                 class="resource-card">
              <div class="resource-icon">
                <el-icon v-if="resource.type === 'video'"><VideoPlay /></el-icon>
                <el-icon v-else-if="resource.type === 'document'"><Document /></el-icon>
                <el-icon v-else-if="resource.type === 'practice'"><EditPen /></el-icon>
                <el-icon v-else><Link /></el-icon>
              </div>
              <div class="resource-info">
                <span class="resource-name">{{ resource.name }}</span>
                <span class="resource-type">{{ getResourceTypeName(resource.type) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 学习激励 (继续学习) -->
        <div v-if="currentLearningContent.motivation" class="motivation-section">
          <h4><el-icon><Trophy /></el-icon> 学习激励</h4>
          <div class="motivation-card">
            <div class="motivation-message">{{ currentLearningContent.motivation.message }}</div>
            <div class="motivation-tip">💡 {{ currentLearningContent.motivation.tip }}</div>
          </div>
        </div>

        <!-- 复习策略 (复习) -->
        <div v-if="currentLearningContent.reviewStrategies" class="review-strategies">
          <h4><el-icon><Reading /></el-icon> 复习策略</h4>
          <div class="strategies-list">
            <div v-for="strategy in currentLearningContent.reviewStrategies" :key="strategy.name" class="strategy-card">
              <div class="strategy-header">
                <h5>{{ strategy.name }}</h5>
                <el-tag :type="getEffectivenessType(strategy.effectiveness)">{{ strategy.effectiveness }}</el-tag>
              </div>
              <p>{{ strategy.description }}</p>
              <div class="strategy-meta">⏱️ {{ strategy.timeRequired }}</div>
            </div>
          </div>
        </div>

        <!-- 学习指导 (资源) -->
        <div v-if="currentLearningContent.learningGuide" class="learning-guide">
          <h4><el-icon><Document /></el-icon> 学习指导</h4>
          <div class="guide-sections">
            <div class="guide-section">
              <h5>📋 学习前准备</h5>
              <ul>
                <li v-for="tip in currentLearningContent.learningGuide.beforeStudy" :key="tip">{{ tip }}</li>
              </ul>
            </div>
            <div class="guide-section">
              <h5>📚 学习中建议</h5>
              <ul>
                <li v-for="tip in currentLearningContent.learningGuide.duringStudy" :key="tip">{{ tip }}</li>
              </ul>
            </div>
            <div class="guide-section">
              <h5>✅ 学习后总结</h5>
              <ul>
                <li v-for="tip in currentLearningContent.learningGuide.afterStudy" :key="tip">{{ tip }}</li>
              </ul>
            </div>
          </div>
        </div>

        <!-- 资源详情 -->
        <div v-if="currentLearningContent.resourceDetails" class="resource-details">
          <h4><el-icon><InfoFilled /></el-icon> 资源详情</h4>
          <div class="details-grid">
            <div class="detail-item">
              <span class="label">资源类型</span>
              <span class="value">{{ currentLearningContent.resourceDetails.type }}</span>
            </div>
            <div class="detail-item">
              <span class="label">难度等级</span>
              <span class="value">{{ currentLearningContent.resourceDetails.difficulty }}</span>
            </div>
            <div class="detail-item">
              <span class="label">预计时间</span>
              <span class="value">{{ currentLearningContent.resourceDetails.estimatedTime }}</span>
            </div>
            <div class="detail-item">
              <span class="label">资源格式</span>
              <span class="value">{{ currentLearningContent.resourceDetails.format }}</span>
            </div>
          </div>
        </div>

        <!-- 成就系统 -->
        <div v-if="currentLearningContent.achievements" class="achievements-section">
          <h4><el-icon><Medal /></el-icon> 可获得成就</h4>
          <div class="achievements-grid">
            <div v-for="achievement in currentLearningContent.achievements" :key="achievement.name"
                 class="achievement-card">
              <div class="achievement-icon">{{ achievement.icon }}</div>
              <div class="achievement-info">
                <h5>{{ achievement.name }}</h5>
                <p>{{ achievement.description }}</p>
                <el-progress :percentage="achievement.progress" :stroke-width="4" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeLearningModal">稍后学习</el-button>
          <el-button type="primary" @click="executeLearningAction">
            <el-icon><CaretRight /></el-icon>
            {{ getActionButtonText() }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 学习资源管理对话框 -->
    <el-dialog
      v-model="showResourceDialog"
      title="📚 学习资源管理"
      width="900px"
      :before-close="closeResourceDialog"
      class="resource-dialog"
    >
      <div class="resource-management-content">
        <!-- 资源搜索和筛选 -->
        <div class="resource-filters">
          <div class="filter-row">
            <el-input
              v-model="resourceSearchQuery"
              placeholder="搜索资源..."
              prefix-icon="Search"
              clearable
              @input="filterResources"
            />
            <el-select
              v-model="selectedResourceType"
              placeholder="资源类型"
              clearable
              @change="filterResources"
            >
              <el-option label="全部" value="" />
              <el-option label="视频教程" value="video" />
              <el-option label="文档资料" value="document" />
              <el-option label="练习题库" value="practice" />
              <el-option label="项目案例" value="project" />
            </el-select>
            <el-select
              v-model="selectedDifficulty"
              placeholder="难度等级"
              clearable
              @change="filterResources"
            >
              <el-option label="全部" value="" />
              <el-option label="入门级" value="beginner" />
              <el-option label="中级" value="intermediate" />
              <el-option label="高级" value="advanced" />
            </el-select>
          </div>
        </div>

        <!-- 资源列表 -->
        <div class="resource-list-container">
          <div class="resource-categories">
            <div v-for="category in resourceCategories" :key="category.name" class="resource-category">
              <h4 class="category-title">
                <el-icon>
                  <component :is="category.icon" />
                </el-icon>
                {{ category.name }}
                <el-tag size="small">{{ category.resources.length }}</el-tag>
              </h4>

              <div class="category-resources">
                <div
                  v-for="resource in category.resources"
                  :key="resource.id"
                  class="resource-item-card"
                  @click="viewResourceDetail(resource)"
                >
                  <div class="resource-header">
                    <div class="resource-icon">
                      <el-icon>
                        <component :is="getResourceIcon(resource.type)" />
                      </el-icon>
                    </div>
                    <div class="resource-info">
                      <h5>{{ resource.name }}</h5>
                      <p>{{ resource.description }}</p>
                    </div>
                    <div class="resource-actions">
                      <el-button
                        size="small"
                        type="primary"
                        @click.stop="addToFavorites(resource)"
                        :icon="resource.favorited ? 'StarFilled' : 'Star'"
                      />
                      <el-button
                        size="small"
                        @click.stop="downloadResource(resource)"
                        :disabled="!resource.downloadable"
                      >
                        <el-icon><Download /></el-icon>
                      </el-button>
                    </div>
                  </div>

                  <div class="resource-meta">
                    <el-tag :type="getDifficultyType(resource.difficulty)" size="small">
                      {{ getDifficultyText(resource.difficulty) }}
                    </el-tag>
                    <span class="resource-time">{{ resource.estimatedTime }}</span>
                    <span class="resource-format">{{ getResourceFormat(resource.type) }}</span>
                  </div>

                  <div class="resource-progress" v-if="resource.progress">
                    <el-progress
                      :percentage="resource.progress"
                      :stroke-width="4"
                      :show-text="false"
                    />
                    <span class="progress-text">{{ resource.progress }}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 推荐资源 -->
        <div class="recommended-resources" v-if="recommendedResources.length > 0">
          <h4 class="section-title">
            <el-icon><Star /></el-icon>
            智能推荐
          </h4>
          <div class="recommended-list">
            <div
              v-for="resource in recommendedResources"
              :key="resource.id"
              class="recommended-item"
            >
              <div class="recommendation-score">{{ resource.matchScore }}%</div>
              <div class="recommendation-content">
                <h5>{{ resource.name }}</h5>
                <p>{{ resource.reason }}</p>
              </div>
              <el-button size="small" type="primary" @click="viewResourceDetail(resource)">
                查看
              </el-button>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closeResourceDialog">关闭</el-button>
          <el-button type="primary" @click="openResourceLibrary">
            <el-icon><Folder /></el-icon>
            打开资源库
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ElMessage, ElNotification, ElMessageBox } from 'element-plus'
import {
  TrendCharts, Reading, CaretRight, VideoPlay, Refresh,
  Document, Link, EditPen, Check, Star, Folder, InfoFilled,
  Trophy, Tools, Medal, Cpu, Operation, Setting, Download,
  Close, Grid, Timer, DataAnalysis, UserFilled, Management,
  Monitor, Connection
} from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

// 路由参数
const pathId = ref(route.params.pathId)
const moduleId = ref(route.params.moduleId)
const mode = ref(route.params.mode || 'study') // study, review

// 页面数据
const pathTitle = ref('AI算法基础强化路径')
const learningNotes = ref('')

// AI优化模块相关数据
const showAIOptimizationModule = ref(true)
const optimizationLoading = ref({
  analysis: false,
  report: false,
  export: false
})

// 核心功能模块配置
const coreFeatures = ref([
  {
    id: 'interview-process',
    title: '面试流程优化',
    description: '智能分析面试流程，提供优化建议',
    icon: 'TrendCharts',
    status: '已启用',
    stats: {
      efficiency: 35,
      timeReduction: 25
    },
    details: {
      features: ['流程可视化编辑器', '拖拽式流程定制', '智能时间分配', '瓶颈识别'],
      benefits: ['减少面试轮次', '提高决策效率', '标准化流程', '降低成本'],
      implementation: '通过AI分析历史面试数据，识别流程中的低效环节'
    }
  },
  {
    id: 'candidate-screening',
    title: '候选人筛选策略',
    description: 'AI驱动的智能候选人筛选',
    icon: 'UserFilled',
    status: '已启用',
    stats: {
      efficiency: 45,
      timeReduction: 40
    },
    details: {
      features: ['多维度筛选条件', '智能匹配算法', '自动评分系统', '批量处理'],
      benefits: ['提高匹配精度', '减少人工筛选', '降低误判率', '加快筛选速度'],
      implementation: '基于机器学习算法，自动分析简历和职位匹配度'
    }
  },
  {
    id: 'evaluation-standards',
    title: '评估标准制定',
    description: '标准化评估体系设置',
    icon: 'Document',
    status: '配置中',
    stats: {
      efficiency: 30,
      timeReduction: 20
    },
    details: {
      features: ['权重配置系统', '评分规则定制', '多维度评估', '标准化模板'],
      benefits: ['统一评估标准', '减少主观偏差', '提高公平性', '便于比较'],
      implementation: '提供可配置的评估框架，支持不同岗位的个性化设置'
    }
  },
  {
    id: 'data-insights',
    title: '数据洞察分析',
    description: '深度挖掘招聘数据价值',
    icon: 'DataAnalysis',
    status: '已启用',
    stats: {
      efficiency: 50,
      timeReduction: 35
    },
    details: {
      features: ['实时数据仪表板', '趋势分析', '预测模型', '异常检测'],
      benefits: ['数据驱动决策', '识别招聘趋势', '优化资源配置', '提前预警'],
      implementation: '集成多源数据，提供可视化分析和智能洞察'
    }
  },
  {
    id: 'recommendation-system',
    title: '智能推荐系统',
    description: '个性化候选人和职位推荐',
    icon: 'Star',
    status: '已启用',
    stats: {
      efficiency: 40,
      timeReduction: 30
    },
    details: {
      features: ['协同过滤算法', '内容推荐', '实时更新', '反馈学习'],
      benefits: ['提高匹配成功率', '发现潜在候选人', '优化推荐精度', '个性化体验'],
      implementation: '基于用户行为和偏好，提供智能化的推荐服务'
    }
  },
  {
    id: 'automation-tools',
    title: '自动化工具',
    description: '提升招聘流程自动化水平',
    icon: 'Setting',
    status: '部分启用',
    stats: {
      efficiency: 60,
      timeReduction: 50
    },
    details: {
      features: ['自动邮件发送', '状态自动更新', '智能提醒', '工作流引擎'],
      benefits: ['减少重复工作', '提高响应速度', '降低遗漏风险', '释放人力资源'],
      implementation: '集成RPA技术，实现关键流程的自动化处理'
    }
  }
])

// 学习资源管理相关数据
const showResourceDialog = ref(false)
const resourceSearchQuery = ref('')
const selectedResourceType = ref('')
const selectedDifficulty = ref('')

// 资源分类数据
const resourceCategories = ref([
  {
    name: '视频教程',
    icon: 'VideoPlay',
    resources: [
      {
        id: 'v1',
        name: 'CNN架构详解视频',
        description: '深入讲解卷积神经网络的架构设计和实现原理',
        type: 'video',
        difficulty: 'intermediate',
        estimatedTime: '2小时',
        downloadable: true,
        favorited: false,
        progress: 65,
        format: 'MP4',
        size: '1.2GB'
      },
      {
        id: 'v2',
        name: 'TensorFlow实战教程',
        description: '从零开始学习TensorFlow深度学习框架',
        type: 'video',
        difficulty: 'beginner',
        estimatedTime: '3小时',
        downloadable: true,
        favorited: true,
        progress: 30,
        format: 'MP4',
        size: '2.1GB'
      }
    ]
  },
  {
    name: '文档资料',
    icon: 'Document',
    resources: [
      {
        id: 'd1',
        name: '机器学习算法手册',
        description: '涵盖主流机器学习算法的理论基础和实现方法',
        type: 'document',
        difficulty: 'intermediate',
        estimatedTime: '4小时',
        downloadable: true,
        favorited: false,
        progress: 0,
        format: 'PDF',
        size: '15MB'
      },
      {
        id: 'd2',
        name: '深度学习论文集',
        description: '精选的深度学习领域经典论文合集',
        type: 'document',
        difficulty: 'advanced',
        estimatedTime: '8小时',
        downloadable: true,
        favorited: true,
        progress: 20,
        format: 'PDF',
        size: '45MB'
      }
    ]
  },
  {
    name: '练习题库',
    icon: 'EditPen',
    resources: [
      {
        id: 'p1',
        name: '机器学习基础练习',
        description: '包含100道机器学习基础概念和算法练习题',
        type: 'practice',
        difficulty: 'beginner',
        estimatedTime: '2小时',
        downloadable: false,
        favorited: false,
        progress: 45,
        format: '在线练习',
        size: '-'
      },
      {
        id: 'p2',
        name: '深度学习项目实战',
        description: '5个完整的深度学习项目案例和代码实现',
        type: 'practice',
        difficulty: 'advanced',
        estimatedTime: '10小时',
        downloadable: true,
        favorited: true,
        progress: 0,
        format: 'Jupyter Notebook',
        size: '120MB'
      }
    ]
  }
])

// 推荐资源数据
const recommendedResources = ref([
  {
    id: 'r1',
    name: 'PyTorch入门指南',
    reason: '基于您当前的学习进度，推荐学习PyTorch框架',
    matchScore: 92,
    type: 'document',
    difficulty: 'intermediate'
  },
  {
    id: 'r2',
    name: '计算机视觉实战项目',
    reason: '与您正在学习的CNN内容高度相关',
    matchScore: 88,
    type: 'practice',
    difficulty: 'advanced'
  }
])

// 根据路由参数动态获取模块数据
const getModuleData = (moduleId, domain = 'ai') => {
  const moduleDataMap = {
    ai: {
      'm1': {
        id: 'm1',
        name: '机器学习算法基础',
        type: 'theory',
        duration: 45,
        status: 'in_progress',
        description: '深入理解机器学习核心算法原理，掌握监督学习、无监督学习和强化学习的基本概念与应用',
        difficulty: 'intermediate',
        prerequisites: ['Python编程基础', '数学基础', '统计学概念'],
        learningObjectives: [
          '理解机器学习算法分类和应用场景',
          '掌握常用监督学习算法的原理和实现',
          '学会模型评估和优化方法',
          '能够独立完成机器学习项目'
        ],
        sections: [
          {
            id: 's1',
            title: '机器学习概述与数学基础',
            description: '了解机器学习的基本概念、分类和数学基础知识',
            duration: 90,
            status: 'completed',
            difficulty: 'beginner',
            keyPoints: [
              '机器学习定义和分类',
              '线性代数基础',
              '概率论与统计学',
              '微积分在机器学习中的应用',
              '数据预处理方法'
            ],
            resources: [
              {
                id: 'r1',
                name: '机器学习数学基础教程',
                type: 'document',
                difficulty: 'beginner',
                estimatedTime: '2小时',
                description: '涵盖机器学习所需的核心数学知识'
              },
              {
                id: 'r2',
                name: '线性代数可视化课程',
                type: 'video',
                difficulty: 'beginner',
                estimatedTime: '3小时',
                description: '通过可视化方式理解线性代数概念'
              }
            ]
          },
          {
            id: 's2',
            title: '监督学习算法详解',
            description: '深入学习线性回归、逻辑回归、决策树等监督学习算法',
            duration: 120,
            status: 'in_progress',
            difficulty: 'intermediate',
            keyPoints: [
              '线性回归原理与实现',
              '逻辑回归与分类问题',
              '决策树算法',
              '随机森林集成方法',
              '支持向量机(SVM)',
              '模型评估指标'
            ],
            resources: [
              {
                id: 'r3',
                name: '监督学习实战项目',
                type: 'practice',
                difficulty: 'intermediate',
                estimatedTime: '4小时',
                description: '通过实际项目掌握监督学习算法'
              },
              {
                id: 'r4',
                name: 'Scikit-learn官方文档',
                type: 'document',
                difficulty: 'intermediate',
                estimatedTime: '1小时',
                description: 'Python机器学习库使用指南'
              }
            ]
          },
          {
            id: 's3',
            title: '无监督学习与聚类',
            description: '学习K-means、层次聚类等无监督学习方法',
            duration: 90,
            status: 'not_started',
            difficulty: 'intermediate',
            keyPoints: [
              'K-means聚类算法',
              '层次聚类方法',
              '密度聚类DBSCAN',
              '降维技术PCA',
              '聚类效果评估'
            ],
            learningPath: [
              { step: 1, topic: '聚类基础概念', duration: 20, type: 'theory' },
              { step: 2, topic: 'K-means算法实现', duration: 30, type: 'practice' },
              { step: 3, topic: '层次聚类应用', duration: 25, type: 'practice' },
              { step: 4, topic: '聚类评估方法', duration: 15, type: 'theory' }
            ],
            assessmentCriteria: [
              { criterion: '理论理解', weight: 30, description: '掌握聚类算法原理' },
              { criterion: '代码实现', weight: 40, description: '能够编写聚类算法' },
              { criterion: '结果分析', weight: 30, description: '能够评估聚类效果' }
            ],
            practiceProjects: [
              {
                name: '客户分群分析',
                description: '使用K-means对客户进行分群',
                difficulty: 'intermediate',
                estimatedTime: '3小时'
              },
              {
                name: '图像分割应用',
                description: '使用聚类算法进行图像分割',
                difficulty: 'advanced',
                estimatedTime: '4小时'
              }
            ],
            resources: [
              {
                id: 'r5',
                name: '聚类算法可视化演示',
                type: 'video',
                difficulty: 'intermediate',
                estimatedTime: '2小时',
                description: '直观理解各种聚类算法的工作原理'
              },
              {
                id: 'r6',
                name: 'Scikit-learn聚类教程',
                type: 'document',
                difficulty: 'intermediate',
                estimatedTime: '1.5小时',
                description: 'Python聚类算法实践指南'
              }
            ],
            milestones: [
              { name: '理解聚类概念', progress: 0, required: true },
              { name: '实现K-means', progress: 0, required: true },
              { name: '完成项目实战', progress: 0, required: false }
            ]
          }
        ]
      },
      'm2': {
        id: 'm2',
        name: '深度学习与神经网络',
        type: 'practice',
        duration: 60,
        status: 'not_started',
        description: '掌握深度学习核心概念，学习神经网络设计与训练方法',
        difficulty: 'advanced',
        prerequisites: ['机器学习基础', 'Python编程', '线性代数'],
        learningObjectives: [
          '理解神经网络基本原理',
          '掌握深度学习框架使用',
          '能够设计和训练深度学习模型',
          '了解CNN、RNN等网络架构'
        ],
        sections: [
          {
            id: 's4',
            title: '神经网络基础',
            description: '学习感知机、多层感知机和反向传播算法',
            duration: 120,
            status: 'not_started',
            difficulty: 'intermediate',
            keyPoints: [
              '感知机模型',
              '多层感知机结构',
              '反向传播算法',
              '激活函数选择',
              '梯度下降优化'
            ],
            learningPath: [
              { step: 1, topic: '感知机原理', duration: 30, type: 'theory' },
              { step: 2, topic: '多层感知机', duration: 40, type: 'theory' },
              { step: 3, topic: '反向传播实现', duration: 35, type: 'practice' },
              { step: 4, topic: '网络优化技巧', duration: 15, type: 'practice' }
            ],
            assessmentCriteria: [
              { criterion: '数学原理', weight: 35, description: '理解神经网络数学基础' },
              { criterion: '算法实现', weight: 45, description: '能够实现神经网络' },
              { criterion: '参数调优', weight: 20, description: '掌握网络调优技巧' }
            ],
            practiceProjects: [
              {
                name: '手写数字识别',
                description: '使用多层感知机识别MNIST数据集',
                difficulty: 'intermediate',
                estimatedTime: '4小时'
              },
              {
                name: '房价预测模型',
                description: '构建回归神经网络预测房价',
                difficulty: 'beginner',
                estimatedTime: '2小时'
              }
            ],
            resources: [
              {
                id: 'r7',
                name: '神经网络原理详解',
                type: 'document',
                difficulty: 'intermediate',
                estimatedTime: '3小时',
                description: '深入理解神经网络数学原理'
              },
              {
                id: 'r8',
                name: 'TensorFlow入门教程',
                type: 'video',
                difficulty: 'beginner',
                estimatedTime: '2小时',
                description: '使用TensorFlow构建神经网络'
              }
            ],
            milestones: [
              { name: '理解感知机', progress: 0, required: true },
              { name: '实现反向传播', progress: 0, required: true },
              { name: '完成MNIST项目', progress: 0, required: false }
            ]
          },
          {
            id: 's5',
            title: '卷积神经网络(CNN)',
            description: '学习CNN架构设计和图像处理应用',
            duration: 150,
            status: 'not_started',
            difficulty: 'advanced',
            keyPoints: [
              '卷积层原理',
              '池化层作用',
              '经典CNN架构',
              '图像分类应用',
              '迁移学习技术'
            ],
            learningPath: [
              { step: 1, topic: 'CNN基础概念', duration: 40, type: 'theory' },
              { step: 2, topic: '卷积和池化', duration: 50, type: 'practice' },
              { step: 3, topic: '经典网络架构', duration: 35, type: 'theory' },
              { step: 4, topic: '实战项目开发', duration: 25, type: 'project' }
            ],
            assessmentCriteria: [
              { criterion: '架构理解', weight: 30, description: '理解CNN网络结构' },
              { criterion: '实现能力', weight: 40, description: '能够构建CNN模型' },
              { criterion: '应用开发', weight: 30, description: '完成图像分类项目' }
            ],
            practiceProjects: [
              {
                name: '图像分类器',
                description: '构建CIFAR-10图像分类模型',
                difficulty: 'advanced',
                estimatedTime: '6小时'
              },
              {
                name: '物体检测系统',
                description: '实现简单的物体检测算法',
                difficulty: 'expert',
                estimatedTime: '8小时'
              }
            ],
            resources: [
              {
                id: 'r9',
                name: 'CNN架构详解',
                type: 'document',
                difficulty: 'advanced',
                estimatedTime: '4小时',
                description: '深入学习CNN网络设计'
              },
              {
                id: 'r10',
                name: 'PyTorch图像处理',
                type: 'video',
                difficulty: 'intermediate',
                estimatedTime: '3小时',
                description: '使用PyTorch进行图像处理'
              }
            ],
            milestones: [
              { name: '理解卷积原理', progress: 0, required: true },
              { name: '构建CNN模型', progress: 0, required: true },
              { name: '完成分类项目', progress: 0, required: true }
            ]
          }
        ]
      }
    },
    bigdata: {
      'm1': {
        id: 'm1',
        name: 'Hadoop生态系统基础',
        type: 'theory',
        duration: 50,
        status: 'not_started',
        description: '深入了解Hadoop分布式计算框架，掌握HDFS、MapReduce等核心组件',
        difficulty: 'intermediate',
        prerequisites: ['Linux基础', 'Java编程', '分布式系统概念'],
        learningObjectives: [
          '理解分布式存储和计算原理',
          '掌握Hadoop核心组件使用',
          '能够搭建和管理Hadoop集群',
          '学会大数据处理的基本方法'
        ],
        sections: [
          {
            id: 's1',
            title: 'Hadoop架构与HDFS',
            description: '学习Hadoop整体架构和分布式文件系统HDFS',
            duration: 100,
            status: 'not_started',
            difficulty: 'intermediate',
            keyPoints: [
              'Hadoop生态系统概览',
              'HDFS架构设计',
              '数据块和副本机制',
              'NameNode和DataNode',
              'HDFS命令行操作'
            ],
            learningPath: [
              { step: 1, topic: 'Hadoop生态介绍', duration: 25, type: 'theory' },
              { step: 2, topic: 'HDFS架构原理', duration: 35, type: 'theory' },
              { step: 3, topic: '集群搭建实践', duration: 30, type: 'practice' },
              { step: 4, topic: '命令行操作', duration: 10, type: 'practice' }
            ],
            assessmentCriteria: [
              { criterion: '架构理解', weight: 40, description: '理解Hadoop分布式架构' },
              { criterion: '实操能力', weight: 35, description: '能够操作HDFS系统' },
              { criterion: '问题解决', weight: 25, description: '能够解决常见问题' }
            ],
            practiceProjects: [
              {
                name: 'Hadoop集群搭建',
                description: '搭建3节点Hadoop集群环境',
                difficulty: 'intermediate',
                estimatedTime: '4小时'
              },
              {
                name: '大文件存储管理',
                description: '实现大文件的分布式存储和管理',
                difficulty: 'intermediate',
                estimatedTime: '3小时'
              }
            ],
            resources: [
              {
                id: 'r11',
                name: 'Hadoop权威指南',
                type: 'document',
                difficulty: 'intermediate',
                estimatedTime: '3小时',
                description: 'Hadoop核心概念和架构详解'
              },
              {
                id: 'r12',
                name: 'HDFS实战视频',
                type: 'video',
                difficulty: 'beginner',
                estimatedTime: '2小时',
                description: 'HDFS操作和管理实践'
              }
            ],
            milestones: [
              { name: '理解分布式概念', progress: 0, required: true },
              { name: '搭建Hadoop集群', progress: 0, required: true },
              { name: '熟练使用HDFS', progress: 0, required: true }
            ]
          },
          {
            id: 's2',
            title: 'MapReduce编程模型',
            description: '掌握MapReduce分布式计算编程模型',
            duration: 120,
            status: 'not_started',
            difficulty: 'intermediate',
            keyPoints: [
              'MapReduce工作原理',
              'Map和Reduce函数',
              '数据分区和排序',
              'Combiner优化',
              '作业调度机制'
            ],
            learningPath: [
              { step: 1, topic: 'MapReduce原理', duration: 30, type: 'theory' },
              { step: 2, topic: '编程实践', duration: 50, type: 'practice' },
              { step: 3, topic: '性能优化', duration: 25, type: 'practice' },
              { step: 4, topic: '实际应用', duration: 15, type: 'project' }
            ],
            assessmentCriteria: [
              { criterion: '原理掌握', weight: 30, description: '理解MapReduce工作机制' },
              { criterion: '编程能力', weight: 50, description: '能够编写MapReduce程序' },
              { criterion: '优化技能', weight: 20, description: '掌握性能优化方法' }
            ],
            practiceProjects: [
              {
                name: '词频统计程序',
                description: '实现经典的WordCount程序',
                difficulty: 'beginner',
                estimatedTime: '2小时'
              },
              {
                name: '日志分析系统',
                description: '分析Web服务器访问日志',
                difficulty: 'intermediate',
                estimatedTime: '4小时'
              }
            ],
            resources: [
              {
                id: 'r13',
                name: 'MapReduce编程指南',
                type: 'document',
                difficulty: 'intermediate',
                estimatedTime: '2.5小时',
                description: 'MapReduce编程详细教程'
              },
              {
                id: 'r14',
                name: 'Java MapReduce实战',
                type: 'video',
                difficulty: 'intermediate',
                estimatedTime: '3小时',
                description: 'Java语言MapReduce开发'
              }
            ],
            milestones: [
              { name: '理解Map-Reduce', progress: 0, required: true },
              { name: '编写WordCount', progress: 0, required: true },
              { name: '完成日志分析', progress: 0, required: false }
            ]
          }
        ]
      }
    },
    iot: {
      'm1': {
        id: 'm1',
        name: '物联网系统架构设计',
        type: 'theory',
        duration: 40,
        status: 'not_started',
        description: '学习物联网系统的整体架构设计，包括感知层、网络层、应用层的设计原则',
        difficulty: 'intermediate',
        prerequisites: ['计算机网络基础', '嵌入式系统', '数据库基础'],
        learningObjectives: [
          '理解物联网系统架构',
          '掌握传感器数据采集',
          '学会物联网通信协议',
          '能够设计物联网应用'
        ],
        sections: [
          {
            id: 's1',
            title: '物联网概述与架构',
            description: '了解物联网的基本概念和系统架构',
            duration: 80,
            status: 'not_started',
            difficulty: 'beginner',
            keyPoints: [
              '物联网定义和特征',
              '三层架构模型',
              '感知层技术',
              '网络层协议',
              '应用层服务'
            ],
            learningPath: [
              { step: 1, topic: '物联网基础概念', duration: 20, type: 'theory' },
              { step: 2, topic: '系统架构设计', duration: 30, type: 'theory' },
              { step: 3, topic: '技术栈选择', duration: 20, type: 'theory' },
              { step: 4, topic: '应用场景分析', duration: 10, type: 'case_study' }
            ],
            assessmentCriteria: [
              { criterion: '概念理解', weight: 40, description: '理解物联网基本概念' },
              { criterion: '架构设计', weight: 35, description: '掌握系统架构设计' },
              { criterion: '技术选型', weight: 25, description: '能够进行技术选型' }
            ],
            practiceProjects: [
              {
                name: '智能温控系统设计',
                description: '设计一个简单的温度监控系统',
                difficulty: 'beginner',
                estimatedTime: '3小时'
              },
              {
                name: '物联网架构方案',
                description: '为特定场景设计物联网解决方案',
                difficulty: 'intermediate',
                estimatedTime: '4小时'
              }
            ],
            resources: [
              {
                id: 'r15',
                name: '物联网技术概论',
                type: 'document',
                difficulty: 'beginner',
                estimatedTime: '2小时',
                description: '物联网基础知识和发展趋势'
              },
              {
                id: 'r16',
                name: '物联网架构设计',
                type: 'video',
                difficulty: 'intermediate',
                estimatedTime: '1.5小时',
                description: '物联网系统架构设计原则'
              }
            ],
            milestones: [
              { name: '理解IoT概念', progress: 0, required: true },
              { name: '掌握架构设计', progress: 0, required: true },
              { name: '完成方案设计', progress: 0, required: false }
            ]
          },
          {
            id: 's2',
            title: '传感器技术与数据采集',
            description: '学习各类传感器的使用和数据采集技术',
            duration: 100,
            status: 'not_started',
            difficulty: 'intermediate',
            keyPoints: [
              '传感器分类和原理',
              '数据采集方法',
              '信号处理技术',
              '数据预处理',
              '传感器网络'
            ],
            learningPath: [
              { step: 1, topic: '传感器基础', duration: 25, type: 'theory' },
              { step: 2, topic: '数据采集实践', duration: 40, type: 'practice' },
              { step: 3, topic: '信号处理', duration: 25, type: 'practice' },
              { step: 4, topic: '网络组建', duration: 10, type: 'practice' }
            ],
            assessmentCriteria: [
              { criterion: '硬件操作', weight: 40, description: '能够操作各类传感器' },
              { criterion: '数据处理', weight: 35, description: '掌握数据采集和处理' },
              { criterion: '系统集成', weight: 25, description: '能够构建传感器网络' }
            ],
            practiceProjects: [
              {
                name: '环境监测站',
                description: '构建多传感器环境监测系统',
                difficulty: 'intermediate',
                estimatedTime: '5小时'
              },
              {
                name: '智能农业系统',
                description: '开发农业物联网监测系统',
                difficulty: 'advanced',
                estimatedTime: '6小时'
              }
            ],
            resources: [
              {
                id: 'r17',
                name: '传感器技术手册',
                type: 'document',
                difficulty: 'intermediate',
                estimatedTime: '3小时',
                description: '各类传感器使用指南'
              },
              {
                id: 'r18',
                name: 'Arduino传感器实战',
                type: 'video',
                difficulty: 'beginner',
                estimatedTime: '2.5小时',
                description: 'Arduino平台传感器编程'
              }
            ],
            milestones: [
              { name: '掌握传感器原理', progress: 0, required: true },
              { name: '实现数据采集', progress: 0, required: true },
              { name: '构建监测系统', progress: 0, required: true }
            ]
          }
        ]
      }
    }
  }

  const domain_key = domain || 'ai'
  return moduleDataMap[domain_key]?.[moduleId] || moduleDataMap.ai.m1
}

// 模块详情数据
const moduleDetails = ref(getModuleData(moduleId.value, route.query.domain))

// 计算属性
const moduleProgress = computed(() => {
  const completed = moduleDetails.value.sections.filter(s => s.status === 'completed').length
  const inProgress = moduleDetails.value.sections.filter(s => s.status === 'in_progress').length * 0.5
  return Math.round((completed + inProgress) / moduleDetails.value.sections.length * 100)
})

const completedSections = computed(() => {
  return moduleDetails.value.sections.filter(s => s.status === 'completed').length
})

const totalSections = computed(() => {
  return moduleDetails.value.sections.length
})

const studyTime = computed(() => {
  const completed = moduleDetails.value.sections.filter(s => s.status === 'completed')
  const inProgress = moduleDetails.value.sections.filter(s => s.status === 'in_progress')
  return completed.reduce((total, section) => total + section.duration, 0) / 60 + 
         inProgress.reduce((total, section) => total + section.duration * 0.5, 0) / 60
})

// 方法
const getModuleTypeColor = (type) => {
  const colorMap = {
    theory: 'info',
    practice: 'warning',
    project: 'success'
  }
  return colorMap[type] || 'info'
}

const getModuleTypeName = (type) => {
  const nameMap = {
    theory: '理论学习',
    practice: '实践练习',
    project: '项目实战'
  }
  return nameMap[type] || '未知'
}

const getStatusType = (status) => {
  const typeMap = {
    completed: 'success',
    in_progress: 'warning',
    not_started: 'info'
  }
  return typeMap[status] || 'info'
}

const getStatusText = (status) => {
  const textMap = {
    completed: '已完成',
    in_progress: '进行中',
    not_started: '未开始'
  }
  return textMap[status] || '未知'
}

const getSectionStatusType = (status) => {
  return getStatusType(status)
}

const getSectionStatusText = (status) => {
  return getStatusText(status)
}

const startModule = () => {
  moduleDetails.value.status = 'in_progress'

  // 生成个性化的开始学习内容
  currentLearningAction.value = 'start_module'
  currentLearningContent.value = generateStartModuleContent()
  showLearningModal.value = true

  updateModuleStatus()
}

// 学习操作弹窗状态
const showLearningModal = ref(false)
const currentLearningAction = ref('')
const currentLearningContent = ref({})

const continueModule = () => {
  currentLearningAction.value = 'continue'
  currentLearningContent.value = generateContinueModuleContent()
  showLearningModal.value = true
}

const reviewModule = () => {
  currentLearningAction.value = 'review'
  currentLearningContent.value = generateReviewModuleContent()
  showLearningModal.value = true
}

const startSection = (sectionId) => {
  const section = moduleDetails.value.sections.find(s => s.id === sectionId)
  if (section) {
    section.status = 'in_progress'
    ElMessage.success(`开始学习：${section.title}`)
    updateModuleStatus()

    // 滚动到当前章节，而不是页面底部
    nextTick(() => {
      const sectionElement = document.querySelector(`[data-section-id="${sectionId}"]`)
      if (sectionElement) {
        sectionElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }
    })
  }
}

const continueSection = (sectionId) => {
  const section = moduleDetails.value.sections.find(s => s.id === sectionId)
  if (section) {
    currentLearningAction.value = 'continue_section'
    currentLearningContent.value = generateContinueSectionContent(section)
    showLearningModal.value = true
  }
}

const reviewSection = (sectionId) => {
  const section = moduleDetails.value.sections.find(s => s.id === sectionId)
  if (section) {
    currentLearningAction.value = 'review_section'
    currentLearningContent.value = generateReviewSectionContent(section)
    showLearningModal.value = true
  }
}

const openResource = (resource) => {
  currentLearningAction.value = 'view_resource'
  currentLearningContent.value = generateResourceContent(resource)
  showLearningModal.value = true
}

const saveNotes = () => {
  ElMessage.success('学习笔记已保存')
  // 这里可以实现笔记保存到后端的逻辑
}

// 智能内容生成函数
const generateStartModuleContent = () => {
  const module = moduleDetails.value
  const domain = route.query.domain || 'ai'

  return {
    title: `🚀 开始学习：${module.name}`,
    content: `欢迎开始您的${getDomainName(domain)}学习之旅！本模块将为您提供系统性的知识体系和实践技能。`,

    // 学习目标
    learningGoals: module.learningObjectives || [
      '掌握核心理论知识',
      '培养实践应用能力',
      '建立系统思维框架',
      '提升问题解决技能'
    ],

    // 学习路径
    learningPath: {
      totalSections: module.sections.length,
      estimatedTime: `${module.duration}小时`,
      difficulty: getDifficultyText(module.difficulty),
      prerequisites: module.prerequisites || ['基础编程能力', '数学基础']
    },

    // 个性化建议
    personalizedTips: generatePersonalizedTips('start', module),

    // 学习方法推荐
    studyMethods: getStudyMethodsForModule(module),

    // 首个章节预览
    firstSection: module.sections[0],

    // 相关资源
    resources: getRelevantResources('start'),

    // 成就系统
    achievements: getAvailableAchievements('start', module),

    // 学习计划建议
    studyPlan: generateStudyPlan(module)
  }
}

const generateContinueModuleContent = () => {
  const module = moduleDetails.value
  const progress = moduleProgress.value
  const nextSection = getNextSection()
  const completedSections = module.sections.filter(s => s.status === 'completed')
  const inProgressSections = module.sections.filter(s => s.status === 'in_progress')

  return {
    title: `📚 继续学习：${module.name}`,
    content: `您已完成 ${progress}% 的学习内容，继续保持这个节奏！`,

    // 当前进度详情
    progressDetails: {
      percentage: progress,
      completedSections: completedSections.length,
      totalSections: module.sections.length,
      studyTime: getStudiedTime(),
      remainingTime: getRemainingTime()
    },

    // 下一步学习内容
    nextSteps: nextSection ? {
      section: nextSection,
      estimatedTime: `${nextSection.duration}分钟`,
      keyPoints: nextSection.keyPoints?.slice(0, 3) || [],
      difficulty: nextSection.difficulty
    } : null,

    // 当前进行中的章节
    currentSections: inProgressSections.map(section => ({
      ...section,
      progress: getSectionProgress(section.id),
      timeSpent: getSectionTimeSpent(section.id),
      nextKeyPoint: getNextKeyPoint(section)
    })),

    // 学习状态分析
    learningAnalysis: {
      strengths: identifyStrengths(completedSections),
      challenges: identifyPotentialChallenges(nextSection),
      recommendations: getPersonalizedRecommendations('continue', module)
    },

    // 复习建议
    reviewSuggestions: generateReviewSuggestions(completedSections),

    // 相关资源
    resources: getRelevantResources('continue'),

    // 学习动机激励
    motivation: generateMotivationalContent(progress, module),

    // 同伴学习
    peerLearning: getPeerLearningData(module)
  }
}

const generateReviewModuleContent = () => {
  const module = moduleDetails.value
  const completedSections = module.sections.filter(s => s.status === 'completed')
  const allKeyPoints = completedSections.flatMap(s => s.keyPoints || [])

  return {
    title: `🔄 复习回顾：${module.name}`,
    content: `系统回顾已学内容，巩固核心知识点，提升理解深度。`,

    // 学习成果总结
    learningOutcomes: {
      completedSections: completedSections.length,
      totalKeyPoints: allKeyPoints.length,
      studyTime: getStudiedTime(),
      masteryLevel: calculateMasteryLevel(completedSections)
    },

    // 知识体系梳理
    knowledgeMap: {
      coreTopics: extractCoreTopics(completedSections),
      connections: findKnowledgeConnections(completedSections),
      applications: getApplicationScenarios(module)
    },

    // 重点知识回顾
    keyPointsReview: {
      critical: getCriticalKeyPoints(allKeyPoints),
      challenging: getChallengingConcepts(completedSections),
      practical: getPracticalApplications(completedSections)
    },

    // 复习策略
    reviewStrategies: [
      {
        name: '概念梳理法',
        description: '系统整理核心概念和定义',
        timeRequired: '30分钟',
        effectiveness: '高'
      },
      {
        name: '实践应用法',
        description: '通过实际案例巩固理论知识',
        timeRequired: '45分钟',
        effectiveness: '很高'
      },
      {
        name: '对比分析法',
        description: '比较不同方法的优缺点',
        timeRequired: '25分钟',
        effectiveness: '中高'
      }
    ],

    // 自测题目
    selfAssessment: generateSelfAssessmentQuestions(completedSections),

    // 薄弱环节分析
    weaknessAnalysis: identifyWeaknesses(completedSections),

    // 进阶学习建议
    advancedSuggestions: getAdvancedLearningSuggestions(module),

    // 复习资源
    resources: getRelevantResources('review')
  }
}

const generateContinueSectionContent = (section) => {
  const sectionProgress = getSectionProgress(section.id)
  const timeSpent = getSectionTimeSpent(section.id)

  return {
    title: `📖 继续学习：${section.title}`,
    content: `当前章节进度 ${sectionProgress}%，已学习 ${timeSpent} 分钟。`,

    // 章节进度详情
    sectionProgress: {
      percentage: sectionProgress,
      timeSpent: timeSpent,
      estimatedRemaining: section.duration - timeSpent,
      difficulty: section.difficulty
    },

    // 当前学习要点
    currentFocus: {
      nextKeyPoints: getNextKeyPoints(section, sectionProgress),
      currentTopic: getCurrentTopic(section, sectionProgress),
      practiceExercises: getPracticeExercises(section)
    },

    // 学习建议
    studyTips: getContextualStudyTips(section, sectionProgress),

    // 相关资源
    resources: section.resources || [],

    // 学习检查点
    checkpoints: generateLearningCheckpoints(section),

    // 预期成果
    expectedOutcomes: section.keyPoints || []
  }
}

const generateReviewSectionContent = (section) => {
  return {
    title: `🔍 复习章节：${section.title}`,
    content: `深度回顾章节内容，强化核心概念理解。`,

    // 章节总结
    sectionSummary: {
      keyPoints: section.keyPoints || [],
      mainConcepts: extractMainConcepts(section),
      practicalApplications: getApplicationExamples(section),
      timeSpent: getSectionTimeSpent(section.id)
    },

    // 知识点掌握度评估
    masteryAssessment: assessKeyPointsMastery(section),

    // 复习重点
    reviewFocus: {
      criticalConcepts: getCriticalConcepts(section),
      commonMistakes: getCommonMistakes(section),
      improvementAreas: getImprovementAreas(section)
    },

    // 复习方法
    reviewMethods: getOptimalReviewMethods(section),

    // 自测内容
    selfTest: generateSectionSelfTest(section),

    // 相关资源
    resources: section.resources || [],

    // 关联章节
    relatedSections: findRelatedSections(section)
  }
}

const generateResourceContent = (resource) => {
  return {
    title: `📚 学习资源：${resource.name}`,
    content: resource.description || '优质学习资源，助力您的学习进步。',

    // 资源详情
    resourceDetails: {
      type: getResourceTypeName(resource.type),
      difficulty: resource.difficulty || '适中',
      estimatedTime: resource.estimatedTime || '30分钟',
      format: getResourceFormat(resource.type),
      language: '中文'
    },

    // 学习指导
    learningGuide: {
      beforeStudy: getPreStudyTips(resource),
      duringStudy: getStudyTips(resource),
      afterStudy: getPostStudyTips(resource)
    },

    // 相关技能
    relatedSkills: getResourceSkills(resource),

    // 应用场景
    applicationScenarios: getResourceApplications(resource),

    // 补充资源
    supplementaryResources: getSupplementaryResources(resource),

    // 学习目标
    learningObjectives: getResourceObjectives(resource)
  }
}

// 核心辅助函数
const getNextSection = () => {
  return moduleDetails.value.sections.find(s => s.status === 'not_started')
}

const getRemainingTime = () => {
  const remainingSections = moduleDetails.value.sections.filter(s => s.status !== 'completed')
  return Math.round(remainingSections.reduce((total, section) => total + (section.duration || 0), 0) / 60 * 10) / 10
}

const getStudiedTime = () => {
  const completedSections = moduleDetails.value.sections.filter(s => s.status === 'completed')
  const inProgressSections = moduleDetails.value.sections.filter(s => s.status === 'in_progress')
  const completedTime = completedSections.reduce((total, section) => total + (section.duration || 0), 0)
  const inProgressTime = inProgressSections.reduce((total, section) => total + (section.duration || 0) * 0.5, 0)
  return Math.round((completedTime + inProgressTime) / 60 * 10) / 10
}

const getSectionProgress = (sectionId) => {
  const section = moduleDetails.value.sections.find(s => s.id === sectionId)
  if (section?.status === 'completed') return 100
  if (section?.status === 'in_progress') return Math.floor(Math.random() * 80) + 10
  return 0
}

const getSectionTimeSpent = (sectionId) => {
  const section = moduleDetails.value.sections.find(s => s.id === sectionId)
  if (section?.status === 'completed') return section.duration || 60
  if (section?.status === 'in_progress') return Math.floor((section.duration || 60) * 0.3)
  return 0
}

const getDomainName = (domain) => {
  const domainMap = {
    ai: '人工智能',
    bigdata: '大数据技术',
    iot: '物联网'
  }
  return domainMap[domain] || '技术'
}

const getDifficultyText = (difficulty) => {
  const difficultyMap = {
    beginner: '入门级',
    intermediate: '中级',
    advanced: '高级',
    expert: '专家级'
  }
  return difficultyMap[difficulty] || '中级'
}

// 智能内容生成辅助函数
const generatePersonalizedTips = (actionType, module) => {
  const domain = route.query.domain || 'ai'
  const tips = {
    ai: {
      start: [
        '建议先掌握数学基础，特别是线性代数和概率论',
        '多动手实践，理论与代码相结合',
        '关注最新的AI发展趋势和应用案例',
        '建立系统性的学习笔记和知识图谱'
      ]
    },
    bigdata: {
      start: [
        '熟悉分布式系统的基本概念',
        '掌握Linux命令行操作',
        '理解数据处理的基本流程',
        '关注数据安全和隐私保护'
      ]
    },
    iot: {
      start: [
        '了解硬件和软件的交互原理',
        '掌握基本的电路知识',
        '学习网络通信协议',
        '关注物联网安全问题'
      ]
    }
  }
  return tips[domain]?.[actionType] || tips.ai.start
}

const getStudyMethodsForModule = (module) => {
  const methods = []

  if (module.type === 'theory') {
    methods.push(
      { name: '概念图学习法', description: '构建知识概念图，理清概念间关系', icon: '🗺️' },
      { name: '案例分析法', description: '通过实际案例理解抽象概念', icon: '📋' }
    )
  }

  if (module.type === 'practice') {
    methods.push(
      { name: '项目驱动法', description: '通过完整项目掌握技能', icon: '🚀' },
      { name: '迭代练习法', description: '反复练习，逐步提升', icon: '🔄' }
    )
  }

  methods.push(
    { name: '费曼学习法', description: '用简单语言解释复杂概念', icon: '🎯' },
    { name: '间隔重复法', description: '定期复习，强化记忆', icon: '⏰' }
  )

  return methods
}

const getAvailableAchievements = (actionType, module) => {
  return [
    { name: '学习启航', description: '开始第一个学习模块', icon: '🌟', progress: 0 },
    { name: '理论大师', description: '完成所有理论章节', icon: '📚', progress: 30 },
    { name: '实践专家', description: '完成所有实践项目', icon: '⚡', progress: 60 },
    { name: '知识融合', description: '完成整个学习模块', icon: '🏆', progress: 100 }
  ]
}

const generateStudyPlan = (module) => {
  const totalHours = module.duration
  const weeksNeeded = Math.ceil(totalHours / 10) // 假设每周学习10小时

  return {
    duration: `${weeksNeeded}周`,
    weeklyHours: '10小时',
    dailyHours: '1.5小时',
    schedule: [
      { day: '周一/三/五', activity: '理论学习', time: '1小时' },
      { day: '周二/四', activity: '实践练习', time: '1.5小时' },
      { day: '周六', activity: '项目实战', time: '3小时' },
      { day: '周日', activity: '复习总结', time: '1小时' }
    ]
  }
}

const getRelevantResources = (actionType) => {
  const allResources = moduleDetails.value.sections.flatMap(s => s.resources || [])

  switch (actionType) {
    case 'start':
      return allResources.filter(r => r.type === 'document' || r.type === 'video').slice(0, 3)
    case 'continue':
      return allResources.filter(r => r.type === 'practice' || r.type === 'project').slice(0, 3)
    case 'review':
      return allResources.filter(r => r.type === 'document' || r.type === 'summary').slice(0, 3)
    default:
      return allResources.slice(0, 3)
  }
}

// 学习分析和推荐函数
const identifyStrengths = (completedSections) => {
  if (completedSections.length === 0) return ['积极的学习态度']

  const strengths = []
  if (completedSections.length >= 2) strengths.push('良好的学习持续性')
  if (completedSections.some(s => s.difficulty === 'advanced')) strengths.push('挑战困难的勇气')
  if (completedSections.length >= 3) strengths.push('系统性学习能力')

  return strengths.length > 0 ? strengths : ['扎实的基础知识']
}

const identifyPotentialChallenges = (nextSection) => {
  if (!nextSection) return []

  const challenges = []
  if (nextSection.difficulty === 'advanced') challenges.push('概念复杂度较高')
  if (nextSection.duration > 90) challenges.push('学习时间较长')
  if (nextSection.keyPoints?.length > 5) challenges.push('知识点较多')

  return challenges
}

const getPersonalizedRecommendations = (actionType, module) => {
  const recommendations = []

  switch (actionType) {
    case 'continue':
      recommendations.push('建议每次学习后做简单总结')
      recommendations.push('遇到困难时可以查看相关资源')
      recommendations.push('保持规律的学习节奏')
      break
    case 'review':
      recommendations.push('重点关注之前标记的难点')
      recommendations.push('尝试用自己的话解释核心概念')
      recommendations.push('做一些实践练习巩固理解')
      break
  }

  return recommendations
}

const generateReviewSuggestions = (completedSections) => {
  return completedSections.map(section => ({
    section: section.title,
    priority: section.difficulty === 'advanced' ? '高' : '中',
    method: '概念回顾 + 实践应用',
    timeNeeded: '15-20分钟'
  }))
}

const generateMotivationalContent = (progress, module) => {
  if (progress < 25) {
    return {
      message: '🌱 万事开头难，您已经迈出了重要的第一步！',
      tip: '每天进步一点点，积少成多见成效'
    }
  } else if (progress < 50) {
    return {
      message: '🚀 您的学习进展很棒，继续保持这个节奏！',
      tip: '现在是建立深度理解的关键时期'
    }
  } else if (progress < 75) {
    return {
      message: '💪 您已经掌握了大部分内容，胜利在望！',
      tip: '注意知识点之间的联系和应用'
    }
  } else {
    return {
      message: '🏆 恭喜！您即将完成这个学习模块！',
      tip: '是时候总结和应用所学知识了'
    }
  }
}

const getPeerLearningData = (module) => {
  return {
    activeStudents: Math.floor(Math.random() * 50) + 20,
    averageProgress: Math.floor(Math.random() * 30) + 40,
    studyGroups: [
      { name: 'AI算法讨论组', members: 15, activity: '活跃' },
      { name: '项目实战小组', members: 8, activity: '中等' }
    ]
  }
}

const getResourceTypeName = (type) => {
  const typeMap = {
    video: '视频教程',
    document: '文档资料',
    practice: '练习题库',
    project: '项目案例',
    summary: '总结资料'
  }
  return typeMap[type] || '其他资源'
}

// 复习和评估相关函数
const calculateMasteryLevel = (completedSections) => {
  if (completedSections.length === 0) return '初学者'

  const totalSections = moduleDetails.value.sections.length
  const completionRate = completedSections.length / totalSections

  if (completionRate >= 0.8) return '精通'
  if (completionRate >= 0.6) return '熟练'
  if (completionRate >= 0.4) return '理解'
  return '入门'
}

const extractCoreTopics = (completedSections) => {
  const allKeyPoints = completedSections.flatMap(s => s.keyPoints || [])
  return [...new Set(allKeyPoints)].slice(0, 5)
}

const findKnowledgeConnections = (completedSections) => {
  return [
    '理论基础与实践应用的结合',
    '不同算法之间的优缺点对比',
    '技术发展的历史脉络',
    '跨领域的应用场景'
  ]
}

const getApplicationScenarios = (module) => {
  const domain = route.query.domain || 'ai'
  const scenarios = {
    ai: ['智能推荐系统', '图像识别应用', '自然语言处理', '智能客服'],
    bigdata: ['用户行为分析', '实时监控系统', '商业智能报表', '数据挖掘'],
    iot: ['智能家居', '工业监控', '智慧城市', '健康监测']
  }
  return scenarios[domain] || scenarios.ai
}

const getCriticalKeyPoints = (allKeyPoints) => {
  return allKeyPoints.filter((_, index) => index % 2 === 0).slice(0, 3)
}

const getChallengingConcepts = (completedSections) => {
  return completedSections
    .filter(s => s.difficulty === 'advanced')
    .map(s => s.title)
    .slice(0, 3)
}

const getPracticalApplications = (completedSections) => {
  return [
    '项目实战应用',
    '案例分析练习',
    '算法实现代码',
    '性能优化实践'
  ]
}

const generateSelfAssessmentQuestions = (completedSections) => {
  return [
    {
      question: '请解释核心概念的基本原理',
      type: '概念理解',
      difficulty: '中等'
    },
    {
      question: '比较不同方法的优缺点',
      type: '分析对比',
      difficulty: '较难'
    },
    {
      question: '设计一个实际应用场景',
      type: '应用设计',
      difficulty: '困难'
    }
  ]
}

const identifyWeaknesses = (completedSections) => {
  // 模拟弱点识别
  return [
    { area: '理论理解', level: '需要加强', suggestion: '多看理论资料' },
    { area: '实践应用', level: '良好', suggestion: '继续保持' },
    { area: '问题解决', level: '待提升', suggestion: '多做练习题' }
  ]
}

const getAdvancedLearningSuggestions = (module) => {
  return [
    '深入研究相关论文和最新技术',
    '参与开源项目贡献代码',
    '尝试解决实际业务问题',
    '与行业专家交流学习'
  ]
}

const closeLearningModal = () => {
  showLearningModal.value = false
  currentLearningAction.value = ''
  currentLearningContent.value = {}
}

// 章节相关辅助函数
const getNextKeyPoints = (section, progress) => {
  const keyPoints = section.keyPoints || []
  const currentIndex = Math.floor((progress / 100) * keyPoints.length)
  return keyPoints.slice(currentIndex, currentIndex + 2)
}

const getCurrentTopic = (section, progress) => {
  const topics = ['基础概念', '核心原理', '实践应用', '高级技巧']
  const currentIndex = Math.floor((progress / 100) * topics.length)
  return topics[currentIndex] || topics[0]
}

const getPracticeExercises = (section) => {
  return [
    '概念理解练习',
    '代码实现练习',
    '案例分析练习'
  ]
}

const getContextualStudyTips = (section, progress) => {
  if (progress < 30) {
    return ['先理解基本概念，不要急于求成', '做好学习笔记，记录重点']
  } else if (progress < 70) {
    return ['结合实例理解抽象概念', '尝试用自己的话解释']
  } else {
    return ['总结核心要点', '思考实际应用场景']
  }
}

const generateLearningCheckpoints = (section) => {
  return [
    { point: '理解基本概念', completed: true },
    { point: '掌握核心原理', completed: false },
    { point: '完成实践练习', completed: false }
  ]
}

// 资源相关辅助函数
const getResourceFormat = (type) => {
  const formatMap = {
    video: 'MP4视频',
    document: 'PDF文档',
    practice: '在线练习',
    project: '项目文件'
  }
  return formatMap[type] || '在线内容'
}

const getPreStudyTips = (resource) => {
  return [
    '准备好学习环境和工具',
    '预留充足的学习时间',
    '准备笔记本记录要点'
  ]
}

const getStudyTips = (resource) => {
  if (resource.type === 'video') {
    return ['可以调整播放速度', '重要内容可以重复观看', '做好时间节点记录']
  } else if (resource.type === 'document') {
    return ['先浏览整体结构', '重点内容做标记', '不懂的地方记录下来']
  }
  return ['保持专注', '及时记录', '主动思考']
}

const getPostStudyTips = (resource) => {
  return [
    '总结学习要点',
    '思考实际应用',
    '与其他知识点建立联系'
  ]
}

const getResourceSkills = (resource) => {
  return ['理论理解', '实践应用', '问题解决']
}

const getResourceApplications = (resource) => {
  return ['项目开发', '技术研究', '问题解决']
}

const getSupplementaryResources = (resource) => {
  return [
    { name: '相关文档', type: 'document' },
    { name: '实践案例', type: 'practice' }
  ]
}

const getResourceObjectives = (resource) => {
  return [
    '理解核心概念',
    '掌握实用技能',
    '提升解决问题的能力'
  ]
}

// 缺失的辅助函数
const extractMainConcepts = (section) => {
  return section.keyPoints?.slice(0, 3) || ['核心概念1', '核心概念2', '核心概念3']
}

const getApplicationExamples = (section) => {
  return ['实际应用案例1', '实际应用案例2']
}

const assessKeyPointsMastery = (section) => {
  return section.keyPoints?.map(point => ({
    point,
    mastery: Math.floor(Math.random() * 40) + 60 // 60-100%
  })) || []
}

const getCriticalConcepts = (section) => {
  return section.keyPoints?.slice(0, 2) || ['重要概念']
}

const getCommonMistakes = (section) => {
  return ['常见错误1', '常见错误2']
}

const getImprovementAreas = (section) => {
  return ['需要改进的地方1', '需要改进的地方2']
}

const getOptimalReviewMethods = (section) => {
  return ['概念梳理', '实践应用', '案例分析']
}

const generateSectionSelfTest = (section) => {
  return [
    { question: '请解释核心概念', type: '简答题' },
    { question: '分析应用场景', type: '分析题' }
  ]
}

const findRelatedSections = (section) => {
  return moduleDetails.value.sections
    .filter(s => s.id !== section.id)
    .slice(0, 2)
    .map(s => ({ title: s.title, id: s.id }))
}

const getNextKeyPoint = (section) => {
  return section.keyPoints?.[0] || '下一个重点'
}

// 模板辅助函数
const getProgressColor = (percentage) => {
  if (percentage >= 80) return '#52c41a'
  if (percentage >= 60) return '#1890ff'
  if (percentage >= 40) return '#faad14'
  return '#f5222d'
}

const getDifficultyType = (difficulty) => {
  const typeMap = {
    'beginner': 'success',
    'intermediate': 'warning',
    'advanced': 'danger',
    'expert': 'info'
  }
  return typeMap[difficulty] || 'info'
}

const getEffectivenessType = (effectiveness) => {
  const typeMap = {
    '很高': 'success',
    '高': 'primary',
    '中高': 'warning',
    '中等': 'info'
  }
  return typeMap[effectiveness] || 'info'
}

const getActionButtonText = () => {
  const buttonTexts = {
    start_module: '🚀 开始学习',
    continue: '📚 继续学习',
    review: '🔄 开始复习',
    continue_section: '📖 继续章节',
    review_section: '🔍 开始复习',
    view_resource: '📚 查看资源'
  }
  return buttonTexts[currentLearningAction.value] || '开始学习'
}

const executeLearningAction = () => {
  const actionMessages = {
    start_module: '🚀 开始您的学习之旅！',
    continue: '📚 继续您的学习进程！',
    review: '🔄 开始系统复习！',
    continue_section: '📖 继续章节学习！',
    review_section: '🔍 开始章节复习！',
    view_resource: '📚 正在为您准备学习资源！'
  }

  const message = actionMessages[currentLearningAction.value] || '开始学习！'

  // 根据不同的学习动作执行相应的逻辑
  switch (currentLearningAction.value) {
    case 'continue_section':
      handleContinueSectionLearning()
      break
    case 'view_resource':
      handleViewResourceAction()
      break
    default:
      ElMessage.success(message)
      break
  }

  closeLearningModal()
}

// 处理继续章节学习的具体逻辑
const handleContinueSectionLearning = () => {
  // 实现真实的章节学习功能
  const currentSection = getCurrentLearningSection()
  if (currentSection) {
    // 更新学习进度
    updateSectionProgress(currentSection.id)
    // 保存学习时长
    saveLearningTime(currentSection.id)
    // 显示学习内容
    showSectionContent(currentSection)
    ElMessage.success('📖 继续章节学习！正在加载学习内容...')
  } else {
    ElMessage.warning('未找到当前学习章节')
  }
}

// 处理查看资源的具体逻辑
const handleViewResourceAction = () => {
  // 实现完整的资源管理功能
  const currentResource = getCurrentResource()
  if (currentResource) {
    // 记录资源访问
    recordResourceAccess(currentResource.id)
    // 显示资源内容
    showResourceContent(currentResource)
    ElMessage.success('📚 正在为您准备学习资源！')
  } else {
    ElMessage.warning('资源暂时不可用')
  }
}

const updateModuleStatus = () => {
  // 更新模块状态逻辑
  const sections = moduleDetails.value.sections
  const completedCount = sections.filter(s => s.status === 'completed').length
  const inProgressCount = sections.filter(s => s.status === 'in_progress').length

  if (completedCount === sections.length) {
    moduleDetails.value.status = 'completed'
  } else if (inProgressCount > 0 || completedCount > 0) {
    moduleDetails.value.status = 'in_progress'
  } else {
    moduleDetails.value.status = 'not_started'
  }
}

// 学习进度管理相关函数
const getCurrentLearningSection = () => {
  // 获取当前正在学习的章节
  return moduleDetails.value.sections.find(s => s.status === 'in_progress') ||
         moduleDetails.value.sections.find(s => s.status === 'not_started')
}

const getCurrentResource = () => {
  // 获取当前选择的资源
  return currentLearningContent.value.resources?.[0] || null
}

const updateSectionProgress = (sectionId) => {
  // 更新章节学习进度
  const section = moduleDetails.value.sections.find(s => s.id === sectionId)
  if (section) {
    // 模拟进度更新
    const currentProgress = getSectionProgress(sectionId)
    const newProgress = Math.min(currentProgress + 20, 100)

    // 如果进度达到100%，标记为完成
    if (newProgress >= 100) {
      section.status = 'completed'
    } else {
      section.status = 'in_progress'
    }

    // 更新模块整体状态
    updateModuleStatus()

    // 保存到本地存储
    saveProgressToStorage(sectionId, newProgress)
  }
}

const saveLearningTime = (sectionId) => {
  // 保存学习时长
  const currentTime = new Date().getTime()
  const storageKey = `learning_time_${moduleId.value}_${sectionId}`
  const existingTime = parseInt(localStorage.getItem(storageKey) || '0')

  // 假设每次学习增加15分钟
  const newTime = existingTime + 15
  localStorage.setItem(storageKey, newTime.toString())

  console.log(`章节 ${sectionId} 学习时长已更新: ${newTime} 分钟`)
}

const showSectionContent = (section) => {
  // 显示章节学习内容
  console.log('显示章节内容:', section.title)

  // 滚动到对应章节
  nextTick(() => {
    const sectionElement = document.querySelector(`[data-section-id="${section.id}"]`)
    if (sectionElement) {
      sectionElement.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      })

      // 高亮显示当前学习章节
      sectionElement.classList.add('current-learning')
      setTimeout(() => {
        sectionElement.classList.remove('current-learning')
      }, 3000)
    }
  })
}

const recordResourceAccess = (resourceId) => {
  // 记录资源访问
  const accessKey = `resource_access_${resourceId}`
  const accessCount = parseInt(localStorage.getItem(accessKey) || '0') + 1
  localStorage.setItem(accessKey, accessCount.toString())

  console.log(`资源 ${resourceId} 访问次数: ${accessCount}`)
}

const showResourceContent = (resource) => {
  // 显示资源内容
  console.log('显示资源内容:', resource.name)

  // 根据资源类型显示不同内容
  switch (resource.type) {
    case 'video':
      ElMessage.info('正在加载视频资源...')
      break
    case 'document':
      ElMessage.info('正在打开文档资源...')
      break
    case 'practice':
      ElMessage.info('正在准备练习内容...')
      break
    default:
      ElMessage.info('正在加载资源内容...')
  }
}

const saveProgressToStorage = (sectionId, progress) => {
  // 保存学习进度到本地存储
  const progressKey = `section_progress_${moduleId.value}_${sectionId}`
  localStorage.setItem(progressKey, progress.toString())
}

// 生命周期
onMounted(() => {
  console.log('学习模块详情页面已加载:', { pathId: pathId.value, moduleId: moduleId.value, mode: mode.value })

  // 根据路由参数加载对应的模块数据
  // 这里可以调用API获取具体的模块数据

  // 恢复学习进度
  restoreLearningProgress()
})

const restoreLearningProgress = () => {
  // 从本地存储恢复学习进度
  moduleDetails.value.sections.forEach(section => {
    const progressKey = `section_progress_${moduleId.value}_${section.id}`
    const savedProgress = localStorage.getItem(progressKey)

    if (savedProgress) {
      const progress = parseInt(savedProgress)
      if (progress >= 100) {
        section.status = 'completed'
      } else if (progress > 0) {
        section.status = 'in_progress'
      }
    }
  })

  // 更新模块整体状态
  updateModuleStatus()
}

// AI优化模块相关方法
const toggleAIModule = () => {
  showAIOptimizationModule.value = !showAIOptimizationModule.value
}

const startOptimizationAnalysis = async () => {
  optimizationLoading.value.analysis = true

  try {
    // 模拟AI分析过程
    await new Promise(resolve => setTimeout(resolve, 2000))

    ElMessage.success('🚀 AI优化分析已启动！正在分析招聘数据...')

    // 显示分析进度
    showAnalysisProgress()

  } catch (error) {
    ElMessage.error('分析启动失败，请稍后重试')
  } finally {
    optimizationLoading.value.analysis = false
  }
}

const showAnalysisProgress = () => {
  let progress = 0
  const progressInterval = setInterval(() => {
    progress += 10
    ElMessage.info(`分析进度: ${progress}%`)

    if (progress >= 100) {
      clearInterval(progressInterval)
      ElMessage.success('✅ AI分析完成！发现了多个优化机会')
    }
  }, 500)
}

const viewAnalysisReport = async () => {
  optimizationLoading.value.report = true

  try {
    // 模拟报告生成
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 显示可视化报告界面
    showReportDialog()

  } catch (error) {
    ElMessage.error('报告生成失败')
  } finally {
    optimizationLoading.value.report = false
  }
}

const showReportDialog = () => {
  ElMessageBox.alert(
    `
    📊 AI分析报告摘要：

    • 面试效率可提升 35%
    • 候选人筛选准确率提升 45%
    • 整体招聘时间缩短 30%
    • 发现 12 个流程优化点

    详细报告包含：
    ✓ 数据可视化图表
    ✓ 趋势分析
    ✓ 优化建议
    ✓ 实施方案
    `,
    '📈 AI分析报告',
    {
      confirmButtonText: '查看详细报告',
      type: 'success',
      dangerouslyUseHTMLString: true
    }
  ).then(() => {
    ElMessage.success('正在打开详细报告...')
  })
}

const configureOptimizationParams = () => {
  // 创建参数配置面板
  ElMessageBox.prompt(
    '请设置优化参数（JSON格式）：',
    '⚙️ 配置优化参数',
    {
      confirmButtonText: '保存配置',
      cancelButtonText: '取消',
      inputValue: JSON.stringify({
        analysisDepth: 'deep',
        optimizationTarget: 'efficiency',
        timeRange: '30days',
        includeHistoricalData: true
      }, null, 2),
      inputType: 'textarea'
    }
  ).then(({ value }) => {
    try {
      JSON.parse(value)
      ElMessage.success('✅ 优化参数配置已保存')
    } catch (error) {
      ElMessage.error('❌ 参数格式错误，请检查JSON格式')
    }
  }).catch(() => {
    ElMessage.info('已取消配置')
  })
}

const exportOptimizationResults = async () => {
  optimizationLoading.value.export = true

  try {
    // 模拟导出过程
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 创建导出数据
    const exportData = generateExportData()

    // 显示导出选项
    showExportOptions(exportData)

  } catch (error) {
    ElMessage.error('导出失败')
  } finally {
    optimizationLoading.value.export = false
  }
}

const generateExportData = () => {
  return {
    summary: {
      analysisDate: new Date().toLocaleDateString(),
      totalOptimizations: 12,
      expectedEfficiencyGain: '35%',
      estimatedTimeSaving: '30%'
    },
    optimizations: [
      { area: '面试流程', improvement: '25%', priority: 'high' },
      { area: '候选人筛选', improvement: '45%', priority: 'high' },
      { area: '评估标准', improvement: '20%', priority: 'medium' },
      { area: '数据分析', improvement: '50%', priority: 'high' }
    ],
    recommendations: [
      '实施自动化筛选系统',
      '优化面试流程设计',
      '建立标准化评估体系',
      '加强数据驱动决策'
    ]
  }
}

const showExportOptions = (data) => {
  ElMessageBox.confirm(
    '选择导出格式：',
    '📤 导出优化结果',
    {
      confirmButtonText: 'Excel格式',
      cancelButtonText: 'PDF格式',
      type: 'info'
    }
  ).then(() => {
    exportToExcel(data)
  }).catch(() => {
    exportToPDF(data)
  })
}

const exportToExcel = (data) => {
  // 模拟Excel导出
  ElMessage.success('📊 正在生成Excel报告...')
  setTimeout(() => {
    ElMessage.success('✅ Excel报告已生成并下载')
  }, 1000)
}

const exportToPDF = (data) => {
  // 模拟PDF导出
  ElMessage.success('📄 正在生成PDF报告...')
  setTimeout(() => {
    ElMessage.success('✅ PDF报告已生成并下载')
  }, 1000)
}

const openFeatureDetail = (feature) => {
  // 显示功能详情对话框
  const detailContent = `
    <div style="text-align: left;">
      <h3 style="color: #1890ff; margin-bottom: 16px;">${feature.title}</h3>

      <div style="margin-bottom: 20px;">
        <h4 style="color: #333; margin-bottom: 8px;">📋 核心功能</h4>
        <ul style="margin: 0; padding-left: 20px;">
          ${feature.details.features.map(f => `<li style="margin-bottom: 4px;">${f}</li>`).join('')}
        </ul>
      </div>

      <div style="margin-bottom: 20px;">
        <h4 style="color: #333; margin-bottom: 8px;">🎯 预期收益</h4>
        <ul style="margin: 0; padding-left: 20px;">
          ${feature.details.benefits.map(b => `<li style="margin-bottom: 4px;">${b}</li>`).join('')}
        </ul>
      </div>

      <div style="margin-bottom: 20px;">
        <h4 style="color: #333; margin-bottom: 8px;">⚙️ 实施方案</h4>
        <p style="margin: 0; color: #666; line-height: 1.6;">${feature.details.implementation}</p>
      </div>

      <div style="background: #f8f9fa; padding: 12px; border-radius: 6px; margin-top: 16px;">
        <div style="display: flex; justify-content: space-between;">
          <span><strong>效率提升:</strong> ${feature.stats.efficiency}%</span>
          <span><strong>时间节省:</strong> ${feature.stats.timeReduction}%</span>
        </div>
      </div>
    </div>
  `

  ElMessageBox.alert(detailContent, `${feature.title} - 详细信息`, {
    confirmButtonText: '启用功能',
    type: 'info',
    dangerouslyUseHTMLString: true,
    customStyle: {
      width: '600px'
    }
  }).then(() => {
    enableFeature(feature)
  })
}

const enableFeature = (feature) => {
  if (feature.status === '已启用') {
    ElMessage.info(`${feature.title} 已经启用`)
    return
  }

  feature.status = '已启用'
  ElNotification({
    title: '功能启用成功',
    message: `${feature.title} 已成功启用，系统将开始优化分析`,
    type: 'success',
    duration: 3000
  })
}

const getFeatureStatusType = (status) => {
  const statusMap = {
    '已启用': 'success',
    '配置中': 'warning',
    '部分启用': 'info',
    '未启用': 'danger'
  }
  return statusMap[status] || 'info'
}

// 学习资源管理相关方法
const openResourceLibrary = () => {
  showResourceDialog.value = true
}

const closeResourceDialog = () => {
  showResourceDialog.value = false
  // 重置筛选条件
  resourceSearchQuery.value = ''
  selectedResourceType.value = ''
  selectedDifficulty.value = ''
}

const filterResources = () => {
  // 实现资源搜索和筛选逻辑
  console.log('筛选资源:', {
    query: resourceSearchQuery.value,
    type: selectedResourceType.value,
    difficulty: selectedDifficulty.value
  })

  // 这里可以实现实际的筛选逻辑
  // 暂时只是日志输出
}

const getResourceIcon = (type) => {
  const iconMap = {
    video: 'VideoPlay',
    document: 'Document',
    practice: 'EditPen',
    project: 'Folder'
  }
  return iconMap[type] || 'Document'
}

const viewResourceDetail = (resource) => {
  // 显示资源详情
  const detailContent = `
    <div style="text-align: left;">
      <h3 style="color: #1890ff; margin-bottom: 16px;">${resource.name}</h3>

      <div style="margin-bottom: 16px;">
        <p style="color: #666; line-height: 1.6; margin: 0;">${resource.description}</p>
      </div>

      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 16px;">
        <div>
          <strong>资源类型:</strong> ${getResourceTypeName(resource.type)}
        </div>
        <div>
          <strong>难度等级:</strong> ${getDifficultyText(resource.difficulty)}
        </div>
        <div>
          <strong>预计时长:</strong> ${resource.estimatedTime}
        </div>
        <div>
          <strong>文件格式:</strong> ${resource.format}
        </div>
      </div>

      ${resource.progress ? `
        <div style="margin-bottom: 16px;">
          <strong>学习进度:</strong>
          <div style="margin-top: 8px;">
            <div style="background: #f0f0f0; border-radius: 4px; height: 8px; overflow: hidden;">
              <div style="background: #1890ff; height: 100%; width: ${resource.progress}%; transition: width 0.3s;"></div>
            </div>
            <span style="font-size: 12px; color: #666;">${resource.progress}% 已完成</span>
          </div>
        </div>
      ` : ''}

      <div style="background: #f8f9fa; padding: 12px; border-radius: 6px; margin-top: 16px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <span><strong>文件大小:</strong> ${resource.size}</span>
          <span style="color: ${resource.downloadable ? '#52c41a' : '#ff4d4f'};">
            ${resource.downloadable ? '✓ 可下载' : '✗ 仅在线'}
          </span>
        </div>
      </div>
    </div>
  `

  ElMessageBox.alert(detailContent, '📚 资源详情', {
    confirmButtonText: resource.downloadable ? '下载资源' : '开始学习',
    type: 'info',
    dangerouslyUseHTMLString: true,
    customStyle: {
      width: '500px'
    }
  }).then(() => {
    if (resource.downloadable) {
      downloadResource(resource)
    } else {
      startResourceLearning(resource)
    }
  })
}

const addToFavorites = (resource) => {
  resource.favorited = !resource.favorited
  const action = resource.favorited ? '添加到' : '从'
  ElMessage.success(`${action}收藏夹${resource.favorited ? '' : '移除'}`)
}

const downloadResource = (resource) => {
  if (!resource.downloadable) {
    ElMessage.warning('该资源不支持下载')
    return
  }

  ElMessage.success(`正在下载 ${resource.name}...`)

  // 模拟下载进度
  let progress = 0
  const downloadInterval = setInterval(() => {
    progress += 10
    ElMessage.info(`下载进度: ${progress}%`)

    if (progress >= 100) {
      clearInterval(downloadInterval)
      ElMessage.success(`✅ ${resource.name} 下载完成！`)
    }
  }, 300)
}

const startResourceLearning = (resource) => {
  ElMessage.success(`开始学习 ${resource.name}`)

  // 更新学习进度
  if (!resource.progress) {
    resource.progress = 0
  }

  // 模拟学习进度更新
  const progressInterval = setInterval(() => {
    if (resource.progress < 100) {
      resource.progress += 5
    } else {
      clearInterval(progressInterval)
      ElMessage.success(`🎉 恭喜完成 ${resource.name} 的学习！`)
    }
  }, 1000)
}
</script>

<style scoped>
/* 页面整体样式 */
.learning-module-details {
  min-height: 100vh;
  background: linear-gradient(135deg,
    rgba(24, 144, 255, 0.08) 0%,
    rgba(102, 126, 234, 0.06) 25%,
    rgba(0, 102, 204, 0.04) 50%,
    rgba(76, 81, 191, 0.06) 75%,
    rgba(118, 75, 162, 0.08) 100%
  );
  background-attachment: fixed;
  padding: 24px;
}

/* 页面头部 */
.page-header {
  margin-bottom: 32px;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
}

.breadcrumb {
  margin-bottom: 24px;
}

.breadcrumb :deep(.el-breadcrumb__item) {
  font-size: 14px;
}

.breadcrumb :deep(.el-breadcrumb__inner) {
  color: #1890ff;
  cursor: pointer;
}

.module-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 32px;
}

.module-info h1 {
  font-size: 28px;
  font-weight: 700;
  color: #262626;
  margin: 0 0 12px 0;
}

.module-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.duration {
  font-size: 14px;
  color: #8c8c8c;
  font-weight: 500;
}

.module-description {
  font-size: 16px;
  color: #666;
  line-height: 1.6;
  margin: 0;
}

.module-actions {
  display: flex;
  gap: 12px;
  flex-shrink: 0;
}

/* 卡片通用样式 */
.progress-overview,
.learning-content,
.learning-notes {
  max-width: 1200px;
  margin: 0 auto 32px auto;
}

.progress-card,
.content-card,
.notes-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  color: #1890ff;
}

/* 进度概览 */
.progress-content {
  display: flex;
  align-items: center;
  gap: 48px;
  padding: 8px 0;
}

.progress-circle {
  flex-shrink: 0;
}

.progress-text {
  font-size: 20px;
  font-weight: 700;
  color: #1890ff;
}

.progress-stats {
  display: flex;
  gap: 48px;
  flex: 1;
}

.stat-item {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 24px;
  font-weight: 700;
  color: #1890ff;
  line-height: 1;
}

.stat-label {
  display: block;
  font-size: 14px;
  color: #8c8c8c;
  margin-top: 4px;
}

/* 学习内容 */
.content-sections {
  padding: 8px 0;
}

.section-item {
  margin-bottom: 24px;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
}

.section-item:hover {
  border-color: #d9f7be;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.section-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: #fafafa;
}

.section-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #1890ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}

.section-info {
  flex: 1;
}

.section-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 8px 0;
}

.section-info p {
  font-size: 14px;
  color: #666;
  margin: 0 0 8px 0;
  line-height: 1.5;
}

.section-meta {
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-duration {
  font-size: 12px;
  color: #8c8c8c;
}

.section-actions {
  flex-shrink: 0;
}

.section-content {
  padding: 20px;
  border-top: 1px solid #f0f0f0;
  background: white;
}

.content-preview {
  margin-bottom: 20px;
}

.content-preview h5 {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 8px 0;
}

.key-points {
  margin: 0;
  padding-left: 20px;
}

.key-points li {
  font-size: 14px;
  color: #666;
  line-height: 1.6;
  margin-bottom: 4px;
}

.section-resources h5 {
  font-size: 14px;
  font-weight: 600;
  color: #262626;
  margin: 0 0 8px 0;
}

.resource-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.resource-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 14px;
}

.resource-item span {
  flex: 1;
  color: #666;
}

/* 学习笔记 */
.notes-content {
  padding: 8px 0;
}

.notes-actions {
  margin-top: 16px;
  text-align: right;
}

/* 学习操作弹窗样式 */
.learning-modal .el-dialog {
  border-radius: 12px;
}

.learning-action-content {
  padding: 8px 0;
  max-height: 70vh;
  overflow-y: auto;
}

.content-description {
  margin-bottom: 24px;
  padding: 16px;
  background: linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%);
  border-radius: 8px;
  border-left: 4px solid #1890ff;
}

.content-description p {
  font-size: 15px;
  color: #0c4a6e;
  line-height: 1.6;
  margin: 0;
  font-weight: 500;
}

/* 通用标题样式 */
.learning-action-content h4 {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1890ff;
  margin: 24px 0 16px 0;
  padding-bottom: 8px;
  border-bottom: 2px solid #f0f0f0;
}

.learning-action-content h4:first-of-type {
  margin-top: 0;
}

/* 学习目标样式 */
.learning-goals {
  margin-bottom: 24px;
}

.goals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.goal-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 3px solid #52c41a;
}

.goal-item .el-icon {
  color: #52c41a;
  font-size: 16px;
}

/* 学习路径信息样式 */
.learning-path-info {
  margin-bottom: 24px;
}

.path-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.path-stats .stat-item {
  text-align: center;
  padding: 16px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border-radius: 8px;
}

.path-stats .label {
  display: block;
  font-size: 12px;
  opacity: 0.8;
  margin-bottom: 4px;
}

.path-stats .value {
  display: block;
  font-size: 18px;
  font-weight: 700;
}

/* 进度详情样式 */
.progress-details {
  margin-bottom: 24px;
}

.progress-info {
  background: #fafafa;
  padding: 20px;
  border-radius: 8px;
}

.progress-stats {
  display: flex;
  justify-content: space-between;
  margin-top: 12px;
  font-size: 13px;
  color: #666;
}

/* 下一步学习样式 */
.next-steps {
  margin-bottom: 24px;
}

.next-section-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.section-header h5 {
  margin: 0;
  color: #333;
  font-size: 16px;
}

.section-meta {
  display: flex;
  gap: 16px;
  margin-top: 12px;
  font-size: 13px;
  color: #666;
}

/* 学习成果样式 */
.learning-outcomes {
  margin-bottom: 24px;
}

.outcomes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
}

.outcome-card {
  text-align: center;
  padding: 20px;
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
  color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.3);
}

.outcome-number {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
}

.outcome-label {
  font-size: 12px;
  opacity: 0.9;
}

/* 知识体系样式 */
.knowledge-map {
  margin-bottom: 24px;
}

.knowledge-sections {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.knowledge-section h5 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 14px;
  font-weight: 600;
}

.topic-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.application-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.application-list li {
  padding: 6px 0;
  color: #666;
  font-size: 14px;
  border-bottom: 1px solid #f0f0f0;
}

.application-list li:last-child {
  border-bottom: none;
}

/* 个性化建议样式 */
.personalized-tips {
  margin-bottom: 24px;
}

.tips-list {
  background: #fff7e6;
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid #faad14;
}

.tip-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;
  font-size: 14px;
  color: #ad6800;
}

.tip-item:last-child {
  margin-bottom: 0;
}

.tip-item .el-icon {
  color: #faad14;
  margin-top: 2px;
  flex-shrink: 0;
}

/* 学习方法样式 */
.study-methods {
  margin-bottom: 24px;
}

.methods-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.method-card {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.method-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.method-content h5 {
  margin: 0 0 8px 0;
  color: #333;
  font-size: 14px;
}

.method-content p {
  margin: 0;
  color: #666;
  font-size: 13px;
  line-height: 1.4;
}

/* 激励内容样式 */
.motivation-section {
  margin-bottom: 24px;
}

.motivation-card {
  background: linear-gradient(135deg, #52c41a 0%, #73d13d 100%);
  color: white;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
}

.motivation-message {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 8px;
}

.motivation-tip {
  font-size: 14px;
  opacity: 0.9;
}

/* 复习策略样式 */
.review-strategies {
  margin-bottom: 24px;
}

.strategies-list {
  display: grid;
  gap: 16px;
}

.strategy-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
}

.strategy-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.strategy-header h5 {
  margin: 0;
  color: #333;
  font-size: 15px;
}

.strategy-meta {
  font-size: 13px;
  color: #666;
  margin-top: 8px;
}

/* 学习指导样式 */
.learning-guide {
  margin-bottom: 24px;
}

.guide-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.guide-section {
  background: #fafafa;
  padding: 16px;
  border-radius: 8px;
}

.guide-section h5 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 14px;
  font-weight: 600;
}

.guide-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.guide-section li {
  padding: 4px 0;
  color: #666;
  font-size: 13px;
  position: relative;
  padding-left: 16px;
}

.guide-section li::before {
  content: '•';
  color: #1890ff;
  position: absolute;
  left: 0;
}

/* 成就系统样式 */
.achievements-section {
  margin-bottom: 24px;
}

.achievements-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.achievement-card {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
}

.achievement-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.achievement-info h5 {
  margin: 0 0 4px 0;
  color: #333;
  font-size: 14px;
}

.achievement-info p {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 12px;
}

.resource-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 12px;
}

.resource-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e9ecef;
}

.resource-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1890ff;
  color: white;
  border-radius: 6px;
}

.resource-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.resource-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.resource-type {
  font-size: 12px;
  color: #666;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 6px;
}

.detail-item .label {
  font-size: 12px;
  color: #666;
  font-weight: 500;
}

.detail-item .value {
  font-size: 14px;
  color: #333;
  font-weight: 600;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* AI优化模块样式 */
.ai-recruitment-optimization {
  max-width: 1200px;
  margin: 0 auto 32px auto;
}

.optimization-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 2px solid #1890ff;
}

.optimization-card .card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 18px;
  font-weight: 600;
  color: #1890ff;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.quick-operations-section {
  margin-bottom: 32px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f0f0f0;
}

.quick-operations-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}

.core-features-section {
  margin-top: 24px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.feature-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.feature-card:hover {
  border-color: #1890ff;
  box-shadow: 0 4px 16px rgba(24, 144, 255, 0.15);
  transform: translateY(-2px);
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #1890ff 0%, #40a9ff 100%);
}

.feature-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
}

.feature-icon .el-icon {
  font-size: 24px;
  color: white;
}

.feature-content h5 {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  margin: 0 0 8px 0;
}

.feature-content p {
  font-size: 14px;
  color: #666;
  line-height: 1.5;
  margin: 0 0 16px 0;
}

.feature-stats {
  display: flex;
  gap: 16px;
  margin-bottom: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #52c41a;
  font-weight: 500;
}

.stat-item .el-icon {
  font-size: 14px;
}

.feature-status {
  position: absolute;
  top: 16px;
  right: 16px;
}

/* 当前学习章节高亮 */
.section-item.current-learning {
  border-color: #52c41a;
  box-shadow: 0 4px 16px rgba(82, 196, 26, 0.2);
  background: linear-gradient(135deg, #f6ffed 0%, #f0f9ff 100%);
}

.section-item.current-learning .section-number {
  background: #52c41a;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(82, 196, 26, 0.7);
  }
  70% {
    box-shadow: 0 0 0 10px rgba(82, 196, 26, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(82, 196, 26, 0);
  }
}

/* 学习资源管理对话框样式 */
.resource-dialog .el-dialog {
  border-radius: 12px;
}

.resource-management-content {
  max-height: 70vh;
  overflow-y: auto;
}

.resource-filters {
  margin-bottom: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 8px;
}

.filter-row {
  display: flex;
  gap: 12px;
  align-items: center;
}

.filter-row .el-input {
  flex: 2;
}

.filter-row .el-select {
  flex: 1;
}

.resource-list-container {
  margin-bottom: 24px;
}

.resource-category {
  margin-bottom: 32px;
}

.category-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #1890ff;
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 2px solid #f0f0f0;
}

.category-resources {
  display: grid;
  gap: 16px;
}

.resource-item-card {
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.resource-item-card:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.15);
}

.resource-header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.resource-header .resource-icon {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  background: linear-gradient(135deg, #1890ff 0%, #40a9ff 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.resource-header .resource-icon .el-icon {
  font-size: 20px;
  color: white;
}

.resource-info {
  flex: 1;
}

.resource-info h5 {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.resource-info p {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
  margin: 0;
}

.resource-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

.resource-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.resource-time,
.resource-format {
  font-size: 12px;
  color: #8c8c8c;
}

.resource-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-text {
  font-size: 12px;
  color: #1890ff;
  font-weight: 500;
  min-width: 35px;
}

.recommended-resources {
  background: #fff7e6;
  border-radius: 8px;
  padding: 16px;
  border-left: 4px solid #faad14;
}

.recommended-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recommended-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #ffe58f;
}

.recommendation-score {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #faad14 0%, #ffd666 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.recommendation-content {
  flex: 1;
}

.recommendation-content h5 {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin: 0 0 4px 0;
}

.recommendation-content p {
  font-size: 12px;
  color: #ad6800;
  margin: 0;
}

/* 章节滚动优化 */
.section-item {
  scroll-margin-top: 100px;
}
</style>
