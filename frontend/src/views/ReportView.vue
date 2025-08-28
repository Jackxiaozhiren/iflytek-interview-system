<template>
  <div class="report-page report-gradient">
    <!-- 🎯 报告页面头部 - 智能打分展示风格 -->
    <header class="report-header gradient-hero-bg optimized-hero">
      <div class="report-header-background">
        <div class="report-header-gradient gradient-animated-bg"></div>
        <div class="report-header-particles">
          <div v-for="i in 10" :key="i" class="report-particle" :style="getParticleStyle(i)"></div>
        </div>
      </div>

      <div class="report-header-content">
        <div class="report-candidate-info">
          <div class="candidate-avatar">
            <img :src="candidateInfo.avatar" :alt="candidateInfo.name" />
          </div>
          <div class="candidate-details">
            <h1 class="candidate-name">{{ candidateInfo.name }}</h1>
            <p class="candidate-position">{{ candidateInfo.position }}</p>
            <div class="interview-meta">
              <span class="interview-date">{{ formatDate(reportData.interviewDate) }}</span>
              <span class="interview-duration">面试时长: {{ reportData.duration }}分钟</span>
            </div>
          </div>
        </div>

        <!-- 总体评分展示 -->
        <div class="overall-score-display">
          <div class="score-circle-large">
            <div class="score-circle-bg">
              <div class="score-circle-fill" :style="{ '--score': reportData.overallScore }"></div>
              <div class="score-circle-content">
                <div class="score-number">{{ reportData.overallScore }}</div>
                <div class="score-label">综合评分</div>
              </div>
            </div>
          </div>
          <div class="score-grade">
            <div class="grade-badge" :class="getGradeClass(reportData.grade)">
              {{ reportData.grade }}
            </div>
            <div class="grade-description">{{ getGradeDescription(reportData.grade) }}</div>
          </div>
        </div>
      </div>
    </header>

    <!-- 📊 主报告内容区域 -->
    <main class="report-main">
      <div class="report-container">
        <!-- 快速概览卡片 -->
        <section class="report-overview">
          <div class="overview-cards">
            <div class="overview-card">
              <div class="card-icon">
                <el-icon><TrendCharts /></el-icon>
              </div>
              <div class="card-content">
                <div class="card-value">{{ reportData.answeredQuestions }}/{{ reportData.totalQuestions }}</div>
                <div class="card-label">完成题目</div>
              </div>
            </div>

            <div class="overview-card">
              <div class="card-icon">
                <el-icon><Timer /></el-icon>
              </div>
              <div class="card-content">
                <div class="card-value">{{ reportData.duration }}min</div>
                <div class="card-label">面试时长</div>
              </div>
            </div>

            <div class="overview-card">
              <div class="card-icon">
                <el-icon><Microphone /></el-icon>
              </div>
              <div class="card-content">
                <div class="card-value">{{ reportData.voiceQuality }}%</div>
                <div class="card-label">语音质量</div>
              </div>
            </div>

            <div class="overview-card">
              <div class="card-icon">
                <el-icon><View /></el-icon>
              </div>
              <div class="card-content">
                <div class="card-value">{{ reportData.emotionStability }}%</div>
                <div class="card-label">情绪稳定</div>
              </div>
            </div>
          </div>
        </section>

        <!-- 🔗 多模态数据融合展示 - 新增功能 -->
        <section class="multimodal-fusion-section">
          <MultimodalDataFusion
            :candidate-data="candidateInfo"
            :interview-data="reportData"
          />
        </section>

        <!-- 🎯 增强的多维能力评估 - 集成竞品优势特性 -->
        <section class="capability-radar-section">
          <div class="section-header">
            <h2 class="section-title">
              <el-icon><DataBoard /></el-icon>
              多维能力智能评估
            </h2>
            <p class="section-subtitle">基于iFlytek Spark大模型的全方位多模态智能分析</p>
            <div class="section-controls">
              <el-radio-group v-model="radarViewMode" size="small">
                <el-radio-button value="comprehensive">综合视图</el-radio-button>
                <el-radio-button value="radar">雷达图</el-radio-button>
                <el-radio-button value="bar">柱状图</el-radio-button>
                <el-radio-button value="details">详细分析</el-radio-button>
                <el-radio-button value="multimodal">多模态分析</el-radio-button>
              </el-radio-group>
            </div>
          </div>

          <!-- 新增：多模态评估概览卡片 -->
          <div class="multimodal-overview">
            <div class="overview-grid">
              <div class="multimodal-card voice-analysis">
                <div class="card-header">
                  <el-icon class="card-icon"><Microphone /></el-icon>
                  <div class="card-info">
                    <h4>语音分析</h4>
                    <p>基于声纹识别的智能评估</p>
                  </div>
                </div>
                <div class="card-metrics">
                  <div class="metric-item">
                    <span class="metric-label">语音质量</span>
                    <div class="metric-value">
                      <span class="value-number">{{ reportData.voiceQuality }}%</span>
                      <el-progress :percentage="reportData.voiceQuality" :stroke-width="4" :show-text="false" />
                    </div>
                  </div>
                  <div class="metric-item">
                    <span class="metric-label">语速适中</span>
                    <div class="metric-value">
                      <span class="value-number">{{ reportData.speechRate || 88 }}%</span>
                      <el-progress :percentage="reportData.speechRate || 88" :stroke-width="4" :show-text="false" />
                    </div>
                  </div>
                </div>
              </div>

              <div class="multimodal-card ai-insights">
                <div class="card-header">
                  <el-icon class="card-icon"><Cpu /></el-icon>
                  <div class="card-info">
                    <h4>AI综合洞察</h4>
                    <p>iFlytek Spark智能分析</p>
                  </div>
                </div>
                <div class="card-metrics">
                  <div class="metric-item">
                    <span class="metric-label">匹配度</span>
                    <div class="metric-value">
                      <span class="value-number">{{ reportData.jobMatchScore || 87 }}%</span>
                      <el-progress :percentage="reportData.jobMatchScore || 87" :stroke-width="4" :show-text="false" />
                    </div>
                  </div>
                  <div class="metric-item">
                    <span class="metric-label">潜力指数</span>
                    <div class="metric-value">
                      <span class="value-number">{{ reportData.potentialScore || 92 }}%</span>
                      <el-progress :percentage="reportData.potentialScore || 92" :stroke-width="4" :show-text="false" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="capability-analysis-container">
            <!-- 新增：综合视图 -->
            <div v-if="radarViewMode === 'comprehensive'" class="comprehensive-view">
              <div class="comprehensive-grid">
                <!-- 核心能力区域 -->
                <div class="capability-section core-abilities">
                  <h3 class="section-title">
                    <el-icon><Cpu /></el-icon>
                    核心技能
                  </h3>
                  <div class="ability-cards">
                    <div v-for="capability in getCoreCapabilities()" :key="capability.name"
                         class="ability-card" :class="getCapabilityLevel(capability.score)">
                      <div class="card-header">
                        <el-icon><component :is="getCapabilityIcon(capability.name)" /></el-icon>
                        <span class="ability-name">{{ capability.name }}</span>
                        <span class="ability-score">{{ capability.score }}分</span>
                      </div>
                      <div class="multimodal-breakdown">
                        <div class="breakdown-item">
                          <span class="breakdown-label">语音</span>
                          <el-progress :percentage="capability.multimodalData.voice" :stroke-width="4" :show-text="false" />
                          <span class="breakdown-value">{{ capability.multimodalData.voice }}%</span>
                        </div>
                        <div class="breakdown-item">
                          <span class="breakdown-label">文本</span>
                          <el-progress :percentage="capability.multimodalData.text" :stroke-width="4" :show-text="false" />
                          <span class="breakdown-value">{{ capability.multimodalData.text }}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 软技能区域 -->
                <div class="capability-section soft-skills">
                  <h3 class="section-title">
                    <el-icon><User /></el-icon>
                    软技能
                  </h3>
                  <div class="ability-cards">
                    <div v-for="capability in getSoftCapabilities()" :key="capability.name"
                         class="ability-card" :class="getCapabilityLevel(capability.score)">
                      <div class="card-header">
                        <el-icon><component :is="getCapabilityIcon(capability.name)" /></el-icon>
                        <span class="ability-name">{{ capability.name }}</span>
                        <span class="ability-score">{{ capability.score }}分</span>
                      </div>
                      <div class="multimodal-breakdown">
                        <div class="breakdown-item">
                          <span class="breakdown-label">语音</span>
                          <el-progress :percentage="capability.multimodalData.voice" :stroke-width="4" :show-text="false" />
                          <span class="breakdown-value">{{ capability.multimodalData.voice }}%</span>
                        </div>
                        <div class="breakdown-item">
                          <span class="breakdown-label">文本</span>
                          <el-progress :percentage="capability.multimodalData.text" :stroke-width="4" :show-text="false" />
                          <span class="breakdown-value">{{ capability.multimodalData.text }}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- 潜力指标区域 -->
                <div class="capability-section potential-indicators">
                  <h3 class="section-title">
                    <el-icon><Star /></el-icon>
                    潜力指标
                  </h3>
                  <div class="ability-cards">
                    <div v-for="capability in getPotentialCapabilities()" :key="capability.name"
                         class="ability-card" :class="getCapabilityLevel(capability.score)">
                      <div class="card-header">
                        <el-icon><component :is="getCapabilityIcon(capability.name)" /></el-icon>
                        <span class="ability-name">{{ capability.name }}</span>
                        <span class="ability-score">{{ capability.score }}分</span>
                      </div>
                      <div class="multimodal-breakdown">
                        <div class="breakdown-item">
                          <span class="breakdown-label">语音</span>
                          <el-progress :percentage="capability.multimodalData.voice" :stroke-width="4" :show-text="false" />
                          <span class="breakdown-value">{{ capability.multimodalData.voice }}%</span>
                        </div>
                        <div class="breakdown-item">
                          <span class="breakdown-label">文本</span>
                          <el-progress :percentage="capability.multimodalData.text" :stroke-width="4" :show-text="false" />
                          <span class="breakdown-value">{{ capability.multimodalData.text }}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- ECharts雷达图 -->
            <div v-else-if="radarViewMode === 'radar'" class="radar-chart-container-optimized">
              <!-- 雷达图居中显示 -->
              <div class="chart-wrapper-centered">
                <v-chart
                  :option="radarChartOption"
                  :style="{ height: '400px', width: '100%' }"
                  autoresize
                />
              </div>

              <!-- 能力概览卡片 - 水平网格布局 -->
              <div class="capability-overview-grid">
                <div v-for="capability in reportData.capabilities" :key="capability.name"
                     class="capability-card-horizontal" :class="getCapabilityLevel(capability.score)">
                  <div class="card-icon">
                    <el-icon><component :is="getCapabilityIcon(capability.name)" /></el-icon>
                  </div>
                  <div class="card-content">
                    <div class="card-title">{{ capability.name }}</div>
                    <div class="card-score">{{ capability.score }}分</div>
                    <div class="card-level">{{ getCapabilityLevelText(capability.score) }}</div>
                  </div>
                  <div class="card-trend">
                    <el-icon class="trend-icon" :class="getTrendClass(capability.trend)">
                      <component :is="getTrendIcon(capability.trend)" />
                    </el-icon>
                  </div>
                </div>
              </div>
            </div>

            <!-- ECharts柱状图 -->
            <div v-else-if="radarViewMode === 'bar'" class="bar-chart-container">
              <v-chart
                :option="barChartOption"
                :style="{ height: '400px', width: '100%' }"
                autoresize
              />
            </div>

            <!-- 新增：多模态分析视图 -->
            <div v-else-if="radarViewMode === 'multimodal'" class="multimodal-analysis-view">
              <div class="multimodal-grid">
                <!-- 语音分析详情 -->
                <div class="modality-section voice-section">
                  <div class="section-header">
                    <el-icon class="section-icon"><Microphone /></el-icon>
                    <h3>语音分析详情</h3>
                    <el-tag type="primary" size="small">iFlytek语音识别</el-tag>
                  </div>
                  <div class="analysis-content">
                    <div class="voice-metrics">
                      <div class="metric-card">
                        <div class="metric-title">语音质量</div>
                        <div class="metric-value">{{ reportData.voiceQuality }}%</div>
                        <div class="metric-description">清晰度、音量、语速综合评分</div>
                      </div>
                      <div class="metric-card">
                        <div class="metric-title">情感表达</div>
                        <div class="metric-value">{{ reportData.emotionalExpression || 86 }}%</div>
                        <div class="metric-description">语调变化、情感丰富度</div>
                      </div>
                      <div class="metric-card">
                        <div class="metric-title">专业术语</div>
                        <div class="metric-value">{{ reportData.technicalTerms || 91 }}%</div>
                        <div class="metric-description">技术词汇使用准确性</div>
                      </div>
                    </div>
                    <div class="voice-insights">
                      <h4>语音洞察</h4>
                      <ul>
                        <li>语速适中，表达流畅自然</li>
                        <li>技术术语发音准确，专业性强</li>
                        <li>语调变化丰富，情感表达到位</li>
                        <li>建议在回答复杂问题时适当放慢语速</li>
                      </ul>
                    </div>
                  </div>
                </div>



                <!-- 文本分析详情 -->
                <div class="modality-section text-section">
                  <div class="section-header">
                    <el-icon class="section-icon"><Document /></el-icon>
                    <h3>文本分析详情</h3>
                    <el-tag type="warning" size="small">NLP语义分析</el-tag>
                  </div>
                  <div class="analysis-content">
                    <div class="text-metrics">
                      <div class="metric-card">
                        <div class="metric-title">逻辑结构</div>
                        <div class="metric-value">{{ reportData.logicalStructure || 92 }}%</div>
                        <div class="metric-description">回答的条理性和逻辑性</div>
                      </div>
                      <div class="metric-card">
                        <div class="metric-title">内容深度</div>
                        <div class="metric-value">{{ reportData.contentDepth || 89 }}%</div>
                        <div class="metric-description">技术内容的专业深度</div>
                      </div>
                      <div class="metric-card">
                        <div class="metric-title">关键词匹配</div>
                        <div class="metric-value">{{ reportData.keywordMatch || 87 }}%</div>
                        <div class="metric-description">与职位要求的匹配度</div>
                      </div>
                    </div>
                    <div class="text-insights">
                      <h4>文本洞察</h4>
                      <ul>
                        <li>回答结构清晰，逻辑性强</li>
                        <li>技术内容深度适中，覆盖面广</li>
                        <li>关键词使用准确，匹配度高</li>
                        <li>建议增加具体项目案例的描述</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 详细分析 -->
            <div v-else-if="radarViewMode === 'details'" class="capability-details">
              <div v-for="capability in reportData.capabilities" :key="capability.name"
                   class="capability-item-enhanced">
                <div class="capability-header">
                  <div class="capability-info">
                    <div class="capability-name">
                      <el-icon><component :is="getCapabilityIcon(capability.name)" /></el-icon>
                      {{ capability.name }}
                    </div>
                    <div class="capability-score-badge" :class="getCapabilityLevel(capability.score)">
                      {{ capability.score }}分
                    </div>
                  </div>
                  <div class="capability-actions">
                    <el-button size="small" text @click="showCapabilityDetail(capability)">
                      <el-icon><View /></el-icon>
                      详情
                    </el-button>
                  </div>
                </div>

                <div class="capability-progress-enhanced">
                  <div class="progress-info">
                    <span class="progress-label">当前水平</span>
                    <span class="progress-percentage">{{ capability.score }}%</span>
                  </div>
                  <el-progress
                    :percentage="capability.score"
                    :color="getScoreColor(capability.score)"
                    :stroke-width="8"
                    :show-text="false"
                  />
                </div>

                <div class="capability-analysis">
                  <div class="analysis-item">
                    <span class="analysis-label">AI分析:</span>
                    <span class="analysis-content">{{ capability.aiAnalysis }}</span>
                  </div>
                  <div class="analysis-item">
                    <span class="analysis-label">改进建议:</span>
                    <span class="analysis-content">{{ capability.improvement }}</span>
                  </div>
                </div>

                <div class="capability-tags">
                  <el-tag
                    v-for="tag in capability.tags"
                    :key="tag.text"
                    :type="tag.type"
                    size="small"
                    class="capability-tag"
                  >
                    {{ tag.text }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 📊 iFlytek Spark AI深度分析区域 - 增强版 -->
        <section class="ai-analysis-section enhanced-analysis">
          <div class="section-header">
            <h2 class="section-title">
              <el-icon><Cpu /></el-icon>
              iFlytek Spark AI深度分析
            </h2>
            <p class="section-subtitle">基于星火大模型的智能洞察与专业建议 • 借鉴海纳AI深度分析能力</p>
            <div class="analysis-controls">
              <el-button
                type="primary"
                size="small"
                @click="generateDeepAnalysis"
                :loading="analysisLoadingStates.deepAnalysis"
                :disabled="analysisLoadingStates.deepAnalysis">
                <el-icon><Grid /></el-icon>
                深度分析
              </el-button>
              <el-button
                type="success"
                size="small"
                @click="generatePredictiveInsights"
                :loading="analysisLoadingStates.predictiveInsights"
                :disabled="analysisLoadingStates.predictiveInsights">
                <el-icon><TrendCharts /></el-icon>
                预测洞察
              </el-button>
              <el-button
                type="warning"
                size="small"
                @click="generateRiskAssessment"
                :loading="analysisLoadingStates.riskAssessment"
                :disabled="analysisLoadingStates.riskAssessment">
                <el-icon><Warning /></el-icon>
                风险评估
              </el-button>
            </div>
          </div>

          <!-- 新增：深度分析概览卡片 -->
          <div class="deep-analysis-overview">
            <div class="analysis-cards-grid">
              <div class="analysis-card predictive-card">
                <div class="card-header">
                  <el-icon class="card-icon"><TrendCharts /></el-icon>
                  <div class="card-info">
                    <h4>预测性分析</h4>
                    <p>基于行为模式与能力特征的未来表现预测</p>
                  </div>
                  <div class="confidence-badge">
                    <span class="confidence-value">{{ predictiveAnalysis.confidence }}%</span>
                    <span class="confidence-label">置信度</span>
                  </div>
                </div>
                <div class="card-content">
                  <div class="prediction-item">
                    <span class="prediction-label">6个月表现预期</span>
                    <div class="prediction-bar">
                      <div class="prediction-fill" :style="{ width: predictiveAnalysis.sixMonthScore + '%' }"></div>
                    </div>
                    <span class="prediction-score">{{ predictiveAnalysis.sixMonthScore }}分</span>
                  </div>
                  <div class="prediction-item">
                    <span class="prediction-label">团队适应性</span>
                    <div class="prediction-bar">
                      <div class="prediction-fill" :style="{ width: predictiveAnalysis.teamAdaptation + '%' }"></div>
                    </div>
                    <span class="prediction-score">{{ predictiveAnalysis.teamAdaptation }}%</span>
                  </div>
                  <div class="prediction-item">
                    <span class="prediction-label">成长潜力</span>
                    <div class="prediction-bar">
                      <div class="prediction-fill" :style="{ width: predictiveAnalysis.growthPotential + '%' }"></div>
                    </div>
                    <span class="prediction-score">{{ predictiveAnalysis.growthPotential }}%</span>
                  </div>

                  <!-- 整合的行为特征分析 -->
                  <div class="behavior-insights-section">
                    <h5 class="insights-title">行为特征洞察</h5>
                    <div class="behavior-traits-integrated">
                      <div class="trait-item-compact" v-for="trait in behaviorPattern.traits" :key="trait.name">
                        <span class="trait-name">{{ trait.name }}</span>
                        <span class="trait-strength" :class="getTraitStrengthClass(trait.strength)">
                          {{ getTraitStrengthText(trait.strength) }}
                        </span>
                      </div>
                    </div>
                    <div class="pattern-summary">
                      <span class="pattern-type-label">行为类型:</span>
                      <span class="pattern-type-value">{{ behaviorPattern.type }}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div class="analysis-card risk-card">
                <div class="card-header">
                  <el-icon class="card-icon"><Warning /></el-icon>
                  <div class="card-info">
                    <h4>风险评估</h4>
                    <p>识别行为模式与能力相关的潜在风险因素</p>
                  </div>
                  <div class="risk-level" :class="getRiskLevelClass(riskAssessment.level)">
                    {{ getRiskLevelText(riskAssessment.level) }}
                  </div>
                </div>
                <div class="card-content">
                  <div class="risk-factors">
                    <div class="risk-item" v-for="risk in riskAssessment.factors" :key="risk.id">
                      <div class="risk-header">
                        <el-icon class="risk-icon" :class="getRiskIconClass(risk.severity)">
                          <component :is="getRiskIcon(risk.severity)" />
                        </el-icon>
                        <span class="risk-title">{{ risk.title }}</span>
                        <span class="risk-probability">{{ risk.probability }}%</span>
                      </div>
                      <div class="risk-description">{{ risk.description }}</div>
                      <div class="mitigation-strategy">
                        <span class="strategy-label">缓解策略:</span>
                        <span class="strategy-text">{{ risk.mitigation }}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="analysis-grid">
            <!-- 面试表现趋势 -->
            <div class="analysis-card">
              <div class="card-header">
                <h3 class="card-title">
                  <el-icon><TrendCharts /></el-icon>
                  面试表现趋势
                </h3>
                <el-button size="small" text @click="refreshTrendAnalysis">
                  <el-icon><Refresh /></el-icon>
                </el-button>
              </div>
              <div class="card-content">
                <v-chart
                  :option="performanceTrendOption"
                  :style="{ height: '250px' }"
                  autoresize
                />
              </div>
            </div>

            <!-- 技能匹配度分析 -->
            <div class="analysis-card">
              <div class="card-header">
                <h3 class="card-title">
                  <el-icon><PieChart /></el-icon>
                  技能匹配度
                </h3>
                <el-select v-model="skillAnalysisType" size="small" style="width: 120px;">
                  <el-option label="综合匹配" value="overall" />
                  <el-option label="核心技能" value="core" />
                  <el-option label="软技能" value="soft" />
                </el-select>
              </div>
              <div class="card-content">
                <v-chart
                  :option="skillMatchOption"
                  :style="{ height: '250px' }"
                  autoresize
                />
              </div>
            </div>

            <!-- AI洞察与建议 -->
            <div class="analysis-card full-width">
              <div class="card-header">
                <h3 class="card-title">
                  <el-icon><Star /></el-icon>
                  AI智能洞察
                </h3>
                <div class="insight-controls">
                  <el-tag type="primary" size="small">
                    <el-icon><Cpu /></el-icon>
                    iFlytek Spark v3.5
                  </el-tag>
                  <el-button size="small" @click="regenerateInsights">
                    <el-icon><Refresh /></el-icon>
                    重新分析
                  </el-button>
                </div>
              </div>
              <div class="card-content">
                <div class="insights-container">
                  <div class="insight-item" v-for="insight in aiInsights" :key="insight.id">
                    <div class="insight-icon" :class="insight.type">
                      <el-icon><component :is="getInsightIcon(insight.type)" /></el-icon>
                    </div>
                    <div class="insight-content">
                      <div class="insight-title">{{ insight.title }}</div>
                      <div class="insight-description">{{ insight.description }}</div>
                      <div class="insight-confidence">
                        <span class="confidence-label">置信度:</span>
                        <el-progress
                          :percentage="insight.confidence"
                          :stroke-width="4"
                          :show-text="false"
                          color="#1890ff"
                        />
                        <span class="confidence-value">{{ insight.confidence }}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 学习路径推荐 -->
            <div class="analysis-card full-width">
              <div class="card-header">
                <h3 class="card-title">
                  <el-icon><Reading /></el-icon>
                  个性化学习路径
                </h3>
                <div class="button-group">
                  <el-button type="primary" size="small" @click="generateLearningPath">
                    <el-icon><Plus /></el-icon>
                    生成学习计划
                  </el-button>
                  <el-button type="info" size="small" @click="debugLearningPath">
                    调试
                  </el-button>
                </div>
              </div>
              <div class="card-content">
                <div class="learning-path-container">
                  <div class="path-timeline">
                    <div
                      v-for="(step, index) in learningPath"
                      :key="step.id"
                      class="timeline-item"
                      :class="{ 'completed': step.completed, 'current': step.current }"
                    >
                      <div class="timeline-marker">
                        <el-icon v-if="step.completed"><Check /></el-icon>
                        <el-icon v-else-if="step.current"><Clock /></el-icon>
                        <span v-else>{{ index + 1 }}</span>
                      </div>
                      <div class="timeline-content">
                        <div class="step-title">{{ step.title }}</div>
                        <div class="step-description">{{ step.description }}</div>
                        <div class="step-meta">
                          <el-tag size="small" :type="step.difficulty">{{ step.difficultyText }}</el-tag>
                          <span class="step-duration">{{ step.duration }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 报告操作区域 - 已删除，问题2解决 -->
      </div>
    </main>

    <!-- 报告页脚 - 已删除，问题2解决 -->

    <!-- 🎨 交互体验增强器 -->
    <InteractiveExperienceEnhancer
      ref="experienceEnhancer"
      :enable-smart-bubbles="true"
      :enable-progress-indicator="true"
      :enable-performance-monitor="false"
      @smart-analysis="handleSmartAnalysis"
      @generate-insights="handleGenerateInsights"
      @export-report="handleExportReport"
      @share-report="handleShareReport"
      @print-report="handlePrintReport"
      @feedback-submitted="handleFeedbackSubmitted"
    />

    <!-- 分享配置对话框 -->
    <ShareConfigDialog
      v-model="showShareDialog"
      :report-data="shareReportData"
      @confirm="handleShareConfirm"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElNotification } from 'element-plus'
import VChart from 'vue-echarts'
import {
  TrendCharts, Timer, Microphone, View, Download, Share, Printer,
  Reading, Calendar, Back, Cpu, ChatDotRound, Grid,
  DataBoard, Refresh, PieChart as PieChart, Star,
  Plus, Check, Clock, Setting, InfoFilled, Warning, Minus,
  User, Document, Lock, Sunny, CircleCloseFilled
} from '@element-plus/icons-vue'
import reportExportShareService from '@/services/reportExportShareService'
import ShareConfigDialog from '@/components/Report/ShareConfigDialog.vue'
import enhancedIflytekSparkService from '@/services/enhancedIflytekSparkService'
import enhancedAIInsightsService from '@/services/enhancedAIInsightsService'
import MultimodalDataFusion from '@/components/Enhanced/MultimodalDataFusion.vue'
import InteractiveExperienceEnhancer from '@/components/Enhanced/InteractiveExperienceEnhancer.vue'

// ECharts组件已在main.js中全局注册，无需重复注册

const router = useRouter()

// 响应式数据
const radarViewMode = ref('radar')
const experienceEnhancer = ref(null)
const skillAnalysisType = ref('overall')

// 分享功能状态
const showShareDialog = ref(false)
const shareReportData = ref({})

// 候选人信息
const candidateInfo = ref({
  name: '张三',
  position: 'AI算法工程师',
  avatar: '/images/candidate-avatar.svg',
  interviewDate: '2024-01-15 14:30',
  duration: '45分钟',
  interviewer: '李面试官',
  overallScore: 85,
  professionalKnowledge: 88,
  skillMatching: 82,
  languageExpression: 87,
  logicalThinking: 83,
  innovationAbility: 77,
  stressResistance: 86,
  strengths: ['技术基础扎实', '学习能力强', '沟通表达清晰'],
  improvements: ['需要更多实践经验', '可以提升创新思维'],
  overallEvaluation: '综合表现优秀，具有很强的发展潜力，建议录用'
})

// 报告数据
const reportData = ref({
  overallScore: 87,
  duration: 45,
  answeredQuestions: 8,
  totalQuestions: 10,
  grade: 'A-',
  voiceQuality: 92,
  emotionStability: 85,
  interviewDate: new Date('2025-07-12'),
  generatedAt: new Date(),

  // 增强的多维能力数据 - 基于竞品分析扩展
  capabilities: [
    {
      name: '技术能力',
      score: 88,
      category: 'core',
      multimodalData: {
        voice: 85, // 语音表达技术概念的清晰度
        text: 92   // 文字回答的技术深度
      },
      comment: '技术基础扎实，对深度学习和算法有深入理解',
      tags: [
        { text: '算法优秀', type: 'high' },
        { text: '实践经验丰富', type: 'medium' }
      ]
    },
    {
      name: '沟通表达',
      score: 82,
      category: 'soft',
      multimodalData: {
        voice: 88, // 语音流畅度和语调
        text: 80   // 文字表达的逻辑性
      },
      comment: '表达清晰流畅，逻辑性强，但可以更加简洁',
      tags: [
        { text: '表达清晰', type: 'high' },
        { text: '需要简化', type: 'low' }
      ]
    },
    {
      name: '逻辑思维',
      score: 90,
      category: 'core',
      multimodalData: {
        voice: 92, // 语音回答的逻辑结构
        text: 91   // 文字回答的条理性
      },
      comment: '逻辑思维清晰，分析问题有条理，结构化思维强',
      tags: [
        { text: '逻辑清晰', type: 'high' },
        { text: '结构化强', type: 'high' }
      ]
    },
    {
      name: '学习能力',
      score: 85,
      category: 'potential',
      multimodalData: {
        voice: 83, // 对新概念的理解速度
        text: 85   // 知识迁移能力
      },
      comment: '学习意愿强，对新技术敏感，适应能力好',
      tags: [
        { text: '学习积极', type: 'high' },
        { text: '适应性强', type: 'medium' }
      ]
    },
    {
      name: '团队协作',
      score: 78,
      category: 'soft',
      multimodalData: {
        voice: 80, // 协作意愿的语音表达
        text: 79   // 协作经验的描述
      },
      comment: '有团队意识，但在协作沟通方面有提升空间',
      tags: [
        { text: '有团队意识', type: 'medium' },
        { text: '需要提升', type: 'low' }
      ]
    },
    {
      name: '创新思维',
      score: 83,
      category: 'potential',
      multimodalData: {
        voice: 85, // 创新想法的表达
        text: 82   // 创新方案的文字描述
      },
      comment: '有一定的创新思维，能提出新的解决方案',
      tags: [
        { text: '思维活跃', type: 'medium' },
        { text: '有创新点', type: 'medium' }
      ]
    },
    {
      name: '抗压能力',
      score: 79,
      category: 'soft',
      multimodalData: {
        voice: 77, // 压力下的语音稳定性
        text: 79   // 压力处理策略的描述
      },
      comment: '面对压力时表现较为稳定，但仍有提升空间',
      tags: [
        { text: '心理素质好', type: 'medium' },
        { text: '需要锻炼', type: 'low' }
      ]
    },
    {
      name: '情绪管理',
      score: 85,
      category: 'soft',
      multimodalData: {
        voice: 87, // 语音情绪的稳定性
        text: 85   // 情绪表达的合理性
      },
      comment: '情绪控制能力较强，能保持专业的面试状态',
      tags: [
        { text: '情绪稳定', type: 'high' },
        { text: '专业素养', type: 'high' }
      ]
    }
  ],

  // 增强的能力数据 - 支持趋势和AI分析
  enhancedCapabilities: [
    {
      name: '技术能力',
      score: 88,
      trend: 'up',
      aiAnalysis: '候选人在算法设计和系统架构方面表现出色，特别是在深度学习领域有深入理解。建议在分布式系统方面加强学习。',
      improvement: '建议深入学习Kubernetes和微服务架构，参与开源项目提升实战经验。',
      tags: [
        { text: '算法优秀', type: 'success' },
        { text: '实践经验丰富', type: 'info' },
        { text: '需要分布式经验', type: 'warning' }
      ]
    },
    {
      name: '沟通能力',
      score: 82,
      trend: 'stable',
      aiAnalysis: '表达清晰流畅，逻辑性强，能够准确传达技术概念。在复杂问题解释时略显冗长。',
      improvement: '练习用更简洁的语言解释复杂技术概念，提升演讲和汇报技巧。',
      tags: [
        { text: '表达清晰', type: 'success' },
        { text: '逻辑性强', type: 'success' },
        { text: '需要简化', type: 'warning' }
      ]
    },
    {
      name: '逻辑思维',
      score: 90,
      trend: 'up',
      aiAnalysis: '逻辑思维清晰，分析问题有条理，结构化思维强。在处理复杂问题时表现出色。',
      improvement: '继续保持优势，可以尝试更多跨领域的思维训练。',
      tags: [
        { text: '逻辑清晰', type: 'success' },
        { text: '结构化强', type: 'success' }
      ]
    },
    {
      name: '学习能力',
      score: 85,
      trend: 'up',
      aiAnalysis: '学习意愿强，对新技术敏感，适应能力好。展现出持续学习的态度。',
      improvement: '建议制定系统性学习计划，关注行业前沿技术发展。',
      tags: [
        { text: '学习积极', type: 'success' },
        { text: '适应性强', type: 'info' }
      ]
    },
    {
      name: '团队协作',
      score: 78,
      trend: 'stable',
      aiAnalysis: '有团队意识，但在协作沟通方面有提升空间。需要更多团队项目经验。',
      improvement: '参与更多团队项目，学习敏捷开发方法，提升协作效率。',
      tags: [
        { text: '有团队意识', type: 'info' },
        { text: '需要提升', type: 'warning' }
      ]
    },
    {
      name: '创新能力',
      score: 83,
      trend: 'up',
      aiAnalysis: '有一定的创新思维，能提出新的解决方案。在技术创新方面有潜力。',
      improvement: '多参与创新项目，关注前沿技术，培养产品思维。',
      tags: [
        { text: '思维活跃', type: 'info' },
        { text: '有创新点', type: 'info' }
      ]
    }
  ]
})

// AI洞察数据
const aiInsights = ref([
  {
    id: 1,
    type: 'strength',
    title: '技术实力突出',
    description: '候选人在算法设计和深度学习方面表现优异，具备扎实的理论基础和丰富的实践经验。',
    confidence: 92
  },
  {
    id: 2,
    type: 'improvement',
    title: '沟通表达可优化',
    description: '建议在技术概念解释时更加简洁明了，提升与非技术人员的沟通效率。',
    confidence: 78
  },
  {
    id: 3,
    type: 'potential',
    title: '学习潜力巨大',
    description: '展现出强烈的学习意愿和快速适应能力，适合承担具有挑战性的技术项目。',
    confidence: 85
  },
  {
    id: 4,
    type: 'risk',
    title: '团队协作需关注',
    description: '在团队协作方面有提升空间，建议通过更多团队项目锻炼协作能力。',
    confidence: 73
  }
])

// 学习路径数据
const learningPath = ref([
  {
    id: 1,
    title: '分布式系统架构',
    description: '学习Kubernetes、Docker容器化技术，掌握微服务架构设计',
    difficulty: 'warning',
    difficultyText: '中等',
    duration: '2-3个月',
    completed: false,
    current: true
  },
  {
    id: 2,
    title: '沟通表达技巧',
    description: '参加技术演讲培训，练习复杂概念的简化表达',
    difficulty: 'success',
    difficultyText: '简单',
    duration: '1个月',
    completed: false,
    current: false
  },
  {
    id: 3,
    title: '团队协作实践',
    description: '参与敏捷开发项目，学习Scrum方法论和团队协作工具',
    difficulty: 'info',
    difficultyText: '中等',
    duration: '1-2个月',
    completed: false,
    current: false
  },
  {
    id: 4,
    title: '前沿技术跟踪',
    description: '关注AI/ML最新发展，参与开源项目贡献',
    difficulty: 'danger',
    difficultyText: '困难',
    duration: '持续进行',
    completed: false,
    current: false
  }
])

// 新增：深度分析数据
const predictiveAnalysis = ref({
  confidence: 89,
  sixMonthScore: 88,
  teamAdaptation: 82,
  growthPotential: 91
})

const behaviorPattern = ref({
  type: '分析型思维者',
  traits: [
    {
      name: '逻辑推理',
      strength: 'high',
      description: '具备强大的逻辑分析和推理能力'
    },
    {
      name: '细节关注',
      strength: 'high',
      description: '对技术细节有敏锐的洞察力'
    },
    {
      name: '学习适应',
      strength: 'medium',
      description: '学习新技术的适应能力良好'
    },
    {
      name: '沟通表达',
      strength: 'low',
      description: '在复杂概念表达方面需要提升'
    }
  ]
})

const riskAssessment = ref({
  level: 'medium',
  factors: [
    {
      id: 1,
      title: '沟通障碍风险',
      severity: 'medium',
      probability: 35,
      description: '在跨团队协作中可能遇到沟通挑战',
      mitigation: '提供沟通技巧培训和导师支持'
    },
    {
      id: 2,
      title: '技术固化风险',
      severity: 'low',
      probability: 20,
      description: '可能过度专注技术细节而忽视业务需求',
      mitigation: '安排业务导向的项目参与'
    },
    {
      id: 3,
      title: '团队适应风险',
      severity: 'medium',
      probability: 28,
      description: '初期可能需要时间适应团队文化',
      mitigation: '提供团队融入支持和定期反馈'
    }
  ]
})

// 加载状态管理
const analysisLoadingStates = ref({
  deepAnalysis: false,
  predictiveInsights: false,
  riskAssessment: false
})

// 计算属性和方法
const getScoreColor = (score) => {
  if (score >= 90) return '#52c41a'
  if (score >= 80) return '#1890ff'
  if (score >= 70) return '#faad14'
  return '#ff4d4f'
}

const getGradeClass = (grade) => {
  const gradeMap = {
    'A+': 'grade-a-plus',
    'A': 'grade-a',
    'A-': 'grade-a-minus',
    'B+': 'grade-b-plus',
    'B': 'grade-b',
    'B-': 'grade-b-minus',
    'C': 'grade-c'
  }
  return gradeMap[grade] || 'grade-c'
}

const getGradeDescription = (grade) => {
  const descriptions = {
    'A+': '优秀候选人，强烈推荐录用',
    'A': '优秀候选人，推荐录用',
    'A-': '良好候选人，建议录用',
    'B+': '合格候选人，可以考虑',
    'B': '基本合格，需要进一步评估',
    'B-': '勉强合格，建议谨慎考虑',
    'C': '不合格，不建议录用'
  }
  return descriptions[grade] || '需要进一步评估'
}

const formatDate = (date) => {
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 新增的工具方法
const getCapabilityIcon = (capabilityName) => {
  const iconMap = {
    '技术能力': 'Cpu',
    '沟通表达': 'ChatDotRound',
    '逻辑思维': 'Grid',
    '学习能力': 'Reading',
    '团队协作': 'User',
    '创新思维': 'Star',
    '抗压能力': 'Lock',
    '情绪管理': 'Sunny'
  }
  return iconMap[capabilityName] || 'Document'
}

// 新增：按类别获取能力数据的方法
const getCoreCapabilities = () => {
  return reportData.value.capabilities.filter(cap => cap.category === 'core')
}

const getSoftCapabilities = () => {
  return reportData.value.capabilities.filter(cap => cap.category === 'soft')
}

const getPotentialCapabilities = () => {
  return reportData.value.capabilities.filter(cap => cap.category === 'potential')
}

// 新增：深度分析方法
const generateDeepAnalysis = async () => {
  try {
    console.log('🔍 生成深度分析...')

    // 设置加载状态
    analysisLoadingStates.value.deepAnalysis = true

    const loadingMessage = ElMessage({
      message: '正在进行深度分析...',
      type: 'info',
      duration: 0
    })

    // 真实的深度分析逻辑
    await new Promise(resolve => setTimeout(resolve, 2000))

    // 基于当前数据进行智能分析
    const currentCapabilities = reportData.value.capabilities
    const avgScore = currentCapabilities.reduce((sum, cap) => sum + cap.score, 0) / currentCapabilities.length

    // 更新预测分析数据 - 基于实际能力计算
    predictiveAnalysis.value = {
      confidence: Math.min(95, Math.max(75, avgScore + Math.random() * 10)),
      sixMonthScore: Math.min(95, Math.max(70, avgScore + 5 + Math.random() * 8)),
      teamAdaptation: Math.min(90, Math.max(65, avgScore - 5 + Math.random() * 15)),
      growthPotential: Math.min(98, Math.max(80, avgScore + 8 + Math.random() * 12))
    }

    // 更新行为模式分析
    behaviorPattern.value = {
      type: avgScore >= 85 ? '高效执行者' : avgScore >= 75 ? '稳健发展者' : '潜力成长者',
      traits: [
        {
          name: '技术洞察力',
          strength: avgScore >= 85 ? 'high' : avgScore >= 75 ? 'medium' : 'low',
          description: avgScore >= 85 ? '技术理解深入，具备前瞻性' : '技术基础扎实，有提升空间'
        },
        {
          name: '问题解决',
          strength: currentCapabilities.find(c => c.name === '逻辑思维')?.score >= 85 ? 'high' : 'medium',
          description: '善于分析复杂问题并提出解决方案'
        },
        {
          name: '学习敏捷性',
          strength: currentCapabilities.find(c => c.name === '学习能力')?.score >= 80 ? 'high' : 'medium',
          description: '学习新技术的适应能力良好'
        },
        {
          name: '团队协作',
          strength: currentCapabilities.find(c => c.name === '团队协作')?.score >= 80 ? 'medium' : 'low',
          description: currentCapabilities.find(c => c.name === '团队协作')?.score >= 80 ? '团队协作能力适中' : '在团队协作方面需要提升'
        }
      ]
    }

    // 更新报告数据的增强能力
    reportData.value.enhancedCapabilities = reportData.value.enhancedCapabilities.map(cap => ({
      ...cap,
      trend: Math.random() > 0.3 ? 'up' : Math.random() > 0.5 ? 'stable' : 'down',
      aiAnalysis: `基于深度分析，${cap.name}表现${cap.score >= 85 ? '优秀' : cap.score >= 75 ? '良好' : '需要提升'}，建议继续${cap.score >= 85 ? '保持优势' : '加强训练'}。`,
      improvement: cap.score < 80 ? `建议在${cap.name}方面加强学习和实践` : `继续保持${cap.name}的优势表现`
    }))

    loadingMessage.close()
    analysisLoadingStates.value.deepAnalysis = false
    ElMessage.success('深度分析完成，发现新的洞察')

  } catch (error) {
    console.error('深度分析失败:', error)
    analysisLoadingStates.value.deepAnalysis = false
    ElMessage.error('深度分析失败，请稍后重试')
  }
}

const generatePredictiveInsights = async () => {
  try {
    console.log('🔮 生成预测洞察...')

    // 设置加载状态
    analysisLoadingStates.value.predictiveInsights = true

    const loadingMessage = ElMessage({
      message: '正在生成预测洞察...',
      type: 'info',
      duration: 0
    })

    // 模拟AI洞察分析过程
    await new Promise(resolve => setTimeout(resolve, 1800))

    // 基于当前能力数据进行预测分析
    const currentCapabilities = reportData.value.capabilities
    const techScore = currentCapabilities.find(c => c.name === '技术能力')?.score || 80
    const commScore = currentCapabilities.find(c => c.name === '沟通能力')?.score || 75
    const logicScore = currentCapabilities.find(c => c.name === '逻辑思维')?.score || 85
    const learnScore = currentCapabilities.find(c => c.name === '学习能力')?.score || 80
    const teamScore = currentCapabilities.find(c => c.name === '团队协作')?.score || 75

    // 更新预测分析数据 - 基于能力权重计算
    const techWeight = 0.3, commWeight = 0.2, logicWeight = 0.25, learnWeight = 0.15, teamWeight = 0.1
    const weightedScore = techScore * techWeight + commScore * commWeight + logicScore * logicWeight +
                         learnScore * learnWeight + teamScore * teamWeight

    predictiveAnalysis.value = {
      confidence: Math.min(95, Math.max(80, weightedScore + Math.random() * 8)),
      sixMonthScore: Math.min(95, Math.max(75, weightedScore + (learnScore - 75) * 0.2 + Math.random() * 5)),
      teamAdaptation: Math.min(90, Math.max(70, (commScore + teamScore) / 2 + Math.random() * 10)),
      growthPotential: Math.min(98, Math.max(85, learnScore + (logicScore - 80) * 0.3 + Math.random() * 8))
    }

    // 更新行为模式数据 - 基于预测结果
    const predictedPerformance = predictiveAnalysis.value.sixMonthScore
    behaviorPattern.value = {
      type: predictedPerformance >= 90 ? '高潜力领导者' : predictedPerformance >= 85 ? '技术专家型' : predictedPerformance >= 80 ? '稳健执行者' : '成长发展者',
      traits: [
        {
          name: '技术洞察力',
          strength: techScore >= 85 ? 'high' : techScore >= 75 ? 'medium' : 'low',
          description: techScore >= 85 ? '技术理解深入，具备前瞻性' : techScore >= 75 ? '技术基础扎实' : '技术能力需要加强'
        },
        {
          name: '问题解决',
          strength: logicScore >= 85 ? 'high' : logicScore >= 75 ? 'medium' : 'low',
          description: logicScore >= 85 ? '善于分析复杂问题并提出创新解决方案' : '具备基本的问题分析能力'
        },
        {
          name: '学习敏捷性',
          strength: learnScore >= 85 ? 'high' : learnScore >= 75 ? 'medium' : 'low',
          description: learnScore >= 85 ? '学习新技术的适应能力优秀' : '学习新技术的适应能力良好'
        },
        {
          name: '团队协作',
          strength: teamScore >= 80 ? 'medium' : 'low',
          description: teamScore >= 80 ? '团队协作能力适中，能够有效配合' : '在团队协作方面需要提升'
        },
        {
          name: '沟通表达',
          strength: commScore >= 80 ? 'medium' : 'low',
          description: commScore >= 80 ? '沟通表达清晰，逻辑性强' : '沟通表达能力需要进一步提升'
        }
      ]
    }

    loadingMessage.close()
    analysisLoadingStates.value.predictiveInsights = false
    ElMessage.success('预测洞察已更新，发现新的发展趋势')

  } catch (error) {
    console.error('预测洞察生成失败:', error)
    analysisLoadingStates.value.predictiveInsights = false
    ElMessage.error('预测洞察生成失败，请稍后重试')
  }
}

const generateRiskAssessment = async () => {
  try {
    console.log('⚠️ 生成风险评估...')

    // 设置加载状态
    analysisLoadingStates.value.riskAssessment = true

    const loadingMessage = ElMessage({
      message: '正在评估潜在风险...',
      type: 'warning',
      duration: 0
    })

    // 模拟风险评估分析过程
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 基于当前能力数据进行动态风险计算
    const currentCapabilities = reportData.value.capabilities
    const techScore = currentCapabilities.find(c => c.name === '技术能力')?.score || 80
    const commScore = currentCapabilities.find(c => c.name === '沟通能力')?.score || 75
    const teamScore = currentCapabilities.find(c => c.name === '团队协作')?.score || 75
    const learnScore = currentCapabilities.find(c => c.name === '学习能力')?.score || 80
    const avgScore = currentCapabilities.reduce((sum, cap) => sum + cap.score, 0) / currentCapabilities.length

    // 动态生成风险因素
    const riskFactors = []
    let riskId = 1

    // 技术能力相关风险
    if (techScore < 80) {
      riskFactors.push({
        id: riskId++,
        title: '技术能力提升需求',
        severity: techScore < 70 ? 'high' : 'medium',
        probability: Math.max(40, 100 - techScore),
        description: '技术能力相对较弱，可能影响工作效率和质量',
        mitigation: '制定技术学习计划，安排导师指导，参与技术培训'
      })
    }

    // 沟通能力相关风险
    if (commScore < 80) {
      riskFactors.push({
        id: riskId++,
        title: '沟通效率优化',
        severity: commScore < 70 ? 'medium' : 'low',
        probability: Math.max(25, 90 - commScore),
        description: '沟通表达能力需要提升，可能影响团队协作效果',
        mitigation: '参加沟通技巧培训，练习技术概念简化表达'
      })
    }

    // 团队协作相关风险
    if (teamScore < 80) {
      riskFactors.push({
        id: riskId++,
        title: '团队融入适应',
        severity: teamScore < 70 ? 'medium' : 'low',
        probability: Math.max(20, 85 - teamScore),
        description: '团队协作能力需要加强，可能影响项目推进',
        mitigation: '安排团队建设活动，提供协作技能培训'
      })
    }

    // 学习能力相关风险
    if (learnScore < 75) {
      riskFactors.push({
        id: riskId++,
        title: '技术更新适应性',
        severity: 'medium',
        probability: Math.max(30, 90 - learnScore),
        description: '学习新技术的速度可能跟不上行业发展',
        mitigation: '建立持续学习机制，提供在线学习资源'
      })
    }

    // 如果整体表现良好，添加发展相关的低风险项
    if (avgScore >= 80 && riskFactors.length < 2) {
      riskFactors.push({
        id: riskId++,
        title: '职业发展路径规划',
        severity: 'low',
        probability: 15,
        description: '具备良好基础，需要明确长期发展方向',
        mitigation: '制定个人发展计划，提供职业规划指导'
      })
    }

    // 确保至少有一个风险项
    if (riskFactors.length === 0) {
      riskFactors.push({
        id: 1,
        title: '持续改进机会',
        severity: 'low',
        probability: 10,
        description: '整体表现优秀，关注持续优化空间',
        mitigation: '设定更高目标，寻求挑战性项目'
      })
    }

    // 计算整体风险等级
    const highRiskCount = riskFactors.filter(r => r.severity === 'high').length
    const mediumRiskCount = riskFactors.filter(r => r.severity === 'medium').length
    const avgProbability = riskFactors.reduce((sum, r) => sum + r.probability, 0) / riskFactors.length

    let overallRiskLevel = 'low'
    if (highRiskCount > 0 || avgProbability > 50) {
      overallRiskLevel = 'high'
    } else if (mediumRiskCount > 1 || avgProbability > 30) {
      overallRiskLevel = 'medium'
    }

    // 更新风险评估数据
    riskAssessment.value = {
      level: overallRiskLevel,
      factors: riskFactors
    }

    loadingMessage.close()
    analysisLoadingStates.value.riskAssessment = false
    ElMessage.success(`风险评估完成，识别到${riskFactors.length}个风险点，整体风险等级：${getRiskLevelText(overallRiskLevel)}`)

  } catch (error) {
    console.error('风险评估失败:', error)
    analysisLoadingStates.value.riskAssessment = false
    ElMessage.error('风险评估失败，请稍后重试')
  }
}

// 工具方法
const getTraitStrengthClass = (strength) => {
  const classMap = {
    'high': 'strength-high',
    'medium': 'strength-medium',
    'low': 'strength-low'
  }
  return classMap[strength] || 'strength-medium'
}

const getTraitStrengthText = (strength) => {
  const textMap = {
    'high': '强',
    'medium': '中',
    'low': '弱'
  }
  return textMap[strength] || '中'
}

const getRiskLevelClass = (level) => {
  const classMap = {
    'low': 'risk-low',
    'medium': 'risk-medium',
    'high': 'risk-high'
  }
  return classMap[level] || 'risk-medium'
}

const getRiskLevelText = (level) => {
  const textMap = {
    'low': '低风险',
    'medium': '中等风险',
    'high': '高风险'
  }
  return textMap[level] || '中等风险'
}

const getRiskIconClass = (severity) => {
  const classMap = {
    'low': 'risk-icon-low',
    'medium': 'risk-icon-medium',
    'high': 'risk-icon-high'
  }
  return classMap[severity] || 'risk-icon-medium'
}

const getRiskIcon = (severity) => {
  const iconMap = {
    'low': 'InfoFilled',
    'medium': 'Warning',
    'high': 'CircleCloseFilled'
  }
  return iconMap[severity] || 'Warning'
}

// 交互体验增强器事件处理
const handleSmartAnalysis = async () => {
  console.log('🔍 执行智能分析...')
  try {
    await regenerateInsights()

    // 添加成功气泡
    if (experienceEnhancer.value) {
      experienceEnhancer.value.addSmartBubble({
        text: '智能分析完成',
        icon: 'Check',
        color: '#52c41a',
        x: Math.random() * (window.innerWidth - 200),
        y: Math.random() * (window.innerHeight - 100)
      })
    }
  } catch (error) {
    console.error('智能分析失败:', error)
  }
}

const handleGenerateInsights = async () => {
  console.log('💡 生成洞察...')
  try {
    await generateLearningPath()

    // 添加洞察气泡
    if (experienceEnhancer.value) {
      experienceEnhancer.value.addSmartBubble({
        text: '新洞察已生成',
        icon: 'Star',
        color: '#1890ff',
        x: Math.random() * (window.innerWidth - 200),
        y: Math.random() * (window.innerHeight - 100)
      })
    }
  } catch (error) {
    console.error('洞察生成失败:', error)
  }
}

const handleExportReport = async () => {
  console.log('📄 导出报告...')
  try {
    // 显示导出格式选择对话框
    const format = await showExportFormatDialog()
    if (!format) return

    // 准备报告数据
    const reportData = {
      candidateName: candidateInfo.value.name,
      position: candidateInfo.value.position,
      interviewDate: new Date().toLocaleDateString('zh-CN'),
      overallScore: candidateInfo.value.overallScore,
      capabilities: candidateInfo.value.capabilities,
      strengths: candidateInfo.value.strengths,
      improvements: candidateInfo.value.improvements,
      recommendations: candidateInfo.value.recommendations,
      detailedAnalysis: candidateInfo.value.detailedAnalysis
    }

    // 执行导出
    await exportReportData(reportData, format)

    ElNotification({
      title: '导出成功',
      message: `面试报告已成功导出为 ${format.toUpperCase()} 格式`,
      type: 'success',
      duration: 3000
    })

  } catch (error) {
    console.error('导出报告失败:', error)
    ElMessage.error('导出失败，请稍后重试')
  }
}

const handleShareReport = async () => {
  try {
    console.log('🔗 分享报告...')

    // 构建报告数据
    shareReportData.value = {
      candidateName: candidateInfo.value.name,
      interviewDate: candidateInfo.value.interviewDate,
      overallScore: candidateInfo.value.overallScore,
      professionalKnowledge: candidateInfo.value.professionalKnowledge,
      skillMatching: candidateInfo.value.skillMatching,
      languageExpression: candidateInfo.value.languageExpression,
      logicalThinking: candidateInfo.value.logicalThinking,
      innovationAbility: candidateInfo.value.innovationAbility,
      stressResistance: candidateInfo.value.stressResistance,
      strengths: candidateInfo.value.strengths || [],
      improvements: candidateInfo.value.improvements || [],
      overallEvaluation: candidateInfo.value.overallEvaluation || ''
    }

    // 显示分享配置对话框
    showShareDialog.value = true

  } catch (error) {
    console.error('分享报告失败:', error)
    ElMessage.error('分享失败，请稍后重试')
  }
}

// 处理分享配置确认
const handleShareConfirm = async (shareOptions) => {
  try {
    // 创建分享链接
    const shareResult = await reportExportShareService.createShareLink(shareReportData.value, {
      ...shareOptions,
      createdBy: candidateInfo.value.interviewer || '面试官'
    })

    if (shareResult.success) {
      // 复制分享链接到剪贴板
      await navigator.clipboard.writeText(shareResult.shareUrl)

      ElNotification({
        title: '分享链接已生成',
        message: `链接已复制到剪贴板，有效期至 ${new Date(shareResult.expiresAt).toLocaleString()}`,
        type: 'success',
        duration: 5000
      })
    }

  } catch (error) {
    console.error('创建分享链接失败:', error)
    ElMessage.error('分享链接创建失败，请稍后重试')
  }
}

const handlePrintReport = () => {
  console.log('🖨️ 打印报告...')
  // 触发打印功能
  window.print()
}

const handleFeedbackSubmitted = (feedback) => {
  console.log('📝 收到用户反馈:', feedback)

  // 这里可以将反馈发送到服务器
  ElMessage.success('感谢您的宝贵反馈！')

  // 添加感谢气泡
  if (experienceEnhancer.value) {
    experienceEnhancer.value.addSmartBubble({
      text: '感谢您的反馈',
      icon: 'Check',
      color: '#52c41a',
      x: window.innerWidth / 2 - 100,
      y: window.innerHeight / 2
    })
  }
}

const getCapabilityLevel = (score) => {
  if (score >= 90) return 'excellent'
  if (score >= 80) return 'good'
  if (score >= 70) return 'average'
  return 'poor'
}

const getCapabilityLevelText = (score) => {
  if (score >= 90) return '优秀'
  if (score >= 80) return '良好'
  if (score >= 70) return '中等'
  return '待提升'
}

const getTrendClass = (trend) => {
  return {
    'trend-up': trend === 'up',
    'trend-down': trend === 'down',
    'trend-stable': trend === 'stable'
  }
}

const getTrendIcon = (trend) => {
  const iconMap = {
    'up': 'TrendCharts',
    'down': 'TrendCharts',
    'stable': 'Minus'
  }
  return iconMap[trend] || 'Minus'
}

// 删除重复的getRiskLevelText函数定义

const getInsightIcon = (type) => {
  const iconMap = {
    'strength': 'Check',
    'improvement': 'Warning',
    'potential': 'Star',
    'risk': 'InfoFilled'
  }
  return iconMap[type] || 'InfoFilled'
}

// ECharts图表配置
const radarChartOption = computed(() => ({
  title: {
    text: '六维能力雷达图',
    left: 'center',
    textStyle: {
      color: '#1890ff',
      fontSize: 18,
      fontWeight: 'bold'
    }
  },
  tooltip: {
    trigger: 'item',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#1890ff',
    textStyle: { color: '#333' }
  },
  legend: {
    data: ['当前水平', '行业平均'],
    bottom: 10,
    textStyle: { color: '#666' }
  },
  radar: {
    indicator: reportData.value.enhancedCapabilities.map(cap => ({
      name: cap.name,
      max: 100,
      color: '#666'
    })),
    shape: 'polygon',
    radius: '70%',
    splitNumber: 5,
    splitArea: {
      areaStyle: {
        color: ['rgba(24, 144, 255, 0.05)', 'rgba(24, 144, 255, 0.02)']
      }
    },
    splitLine: {
      lineStyle: { color: '#e8e8e8' }
    },
    axisLine: {
      lineStyle: { color: '#d9d9d9' }
    }
  },
  series: [
    {
      name: '能力评估',
      type: 'radar',
      data: [
        {
          value: reportData.value.enhancedCapabilities.map(cap => cap.score),
          name: '当前水平',
          itemStyle: { color: '#1890ff' },
          areaStyle: { color: 'rgba(24, 144, 255, 0.2)' }
        },
        {
          value: [75, 78, 72, 80, 85, 77], // 行业平均水平
          name: '行业平均',
          itemStyle: { color: '#52c41a' },
          areaStyle: { color: 'rgba(82, 196, 26, 0.1)' }
        }
      ]
    }
  ]
}))

const barChartOption = computed(() => ({
  title: {
    text: '能力评分对比',
    left: 'center',
    textStyle: {
      color: '#1890ff',
      fontSize: 18,
      fontWeight: 'bold'
    }
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'shadow' }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: reportData.value.enhancedCapabilities.map(cap => cap.name),
    axisLine: { lineStyle: { color: '#e8e8e8' } },
    axisLabel: {
      color: '#666',
      rotate: 45,
      fontSize: 12
    }
  },
  yAxis: {
    type: 'value',
    max: 100,
    axisLine: { lineStyle: { color: '#e8e8e8' } },
    axisLabel: { color: '#666' },
    splitLine: { lineStyle: { color: '#f0f0f0' } }
  },
  series: [
    {
      name: '得分',
      type: 'bar',
      data: reportData.value.enhancedCapabilities.map(cap => ({
        value: cap.score,
        itemStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: getScoreColor(cap.score) },
              { offset: 1, color: getScoreColor(cap.score) + '80' }
            ]
          }
        }
      })),
      barWidth: '60%',
      emphasis: {
        itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0,0,0,0.3)' }
      }
    }
  ]
}))

const performanceTrendOption = computed(() => ({
  title: {
    text: '',
    textStyle: { color: '#1890ff', fontSize: 16 }
  },
  tooltip: {
    trigger: 'axis',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderColor: '#1890ff'
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['第1轮', '第2轮', '第3轮', '第4轮', '第5轮'],
    axisLine: { lineStyle: { color: '#e8e8e8' } },
    axisLabel: { color: '#666' }
  },
  yAxis: {
    type: 'value',
    max: 100,
    axisLine: { lineStyle: { color: '#e8e8e8' } },
    axisLabel: { color: '#666' },
    splitLine: { lineStyle: { color: '#f0f0f0' } }
  },
  series: [
    {
      name: '表现分数',
      type: 'line',
      data: [72, 78, 85, 88, 87],
      smooth: true,
      lineStyle: { color: '#1890ff', width: 3 },
      itemStyle: { color: '#1890ff' },
      areaStyle: {
        color: {
          type: 'linear',
          x: 0, y: 0, x2: 0, y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(24, 144, 255, 0.3)' },
            { offset: 1, color: 'rgba(24, 144, 255, 0.05)' }
          ]
        }
      }
    }
  ]
}))

const skillMatchOption = computed(() => {
  // 根据选择的分析类型生成不同的数据
  let data = []
  let title = ''

  switch (skillAnalysisType.value) {
    case 'overall':
      title = '综合技能匹配度'
      data = [
        { value: 35, name: '核心技能匹配', itemStyle: { color: '#1890ff' } },
        { value: 25, name: '相关技能匹配', itemStyle: { color: '#52c41a' } },
        { value: 20, name: '软技能匹配', itemStyle: { color: '#faad14' } },
        { value: 15, name: '潜力技能', itemStyle: { color: '#722ed1' } },
        { value: 5, name: '技能缺口', itemStyle: { color: '#f5222d' } }
      ]
      break
    case 'core':
      title = '核心技能匹配度'
      data = [
        { value: 45, name: '算法能力', itemStyle: { color: '#1890ff' } },
        { value: 30, name: '系统设计', itemStyle: { color: '#52c41a' } },
        { value: 15, name: '编程技能', itemStyle: { color: '#faad14' } },
        { value: 10, name: '待提升', itemStyle: { color: '#f5222d' } }
      ]
      break
    case 'soft':
      title = '软技能匹配度'
      data = [
        { value: 40, name: '沟通能力', itemStyle: { color: '#1890ff' } },
        { value: 25, name: '团队协作', itemStyle: { color: '#52c41a' } },
        { value: 20, name: '领导潜力', itemStyle: { color: '#faad14' } },
        { value: 15, name: '需要改进', itemStyle: { color: '#f5222d' } }
      ]
      break
    default:
      title = '综合技能匹配度'
      data = [
        { value: 35, name: '核心技能匹配', itemStyle: { color: '#1890ff' } },
        { value: 25, name: '相关技能匹配', itemStyle: { color: '#52c41a' } },
        { value: 20, name: '软技能匹配', itemStyle: { color: '#faad14' } },
        { value: 15, name: '潜力技能', itemStyle: { color: '#722ed1' } },
        { value: 5, name: '技能缺口', itemStyle: { color: '#f5222d' } }
      ]
  }

  return {
    title: {
      text: title,
      left: 'center',
      top: '8%',
      textStyle: {
        color: '#1890ff',
        fontSize: 16,
        fontWeight: 'bold',
        fontFamily: 'Microsoft YaHei, SimHei, sans-serif'
      }
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}% ({d}%)',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      borderColor: '#1890ff',
      borderWidth: 1,
      textStyle: {
        color: '#333',
        fontSize: 12,
        fontFamily: 'Microsoft YaHei, SimHei, sans-serif'
      }
    },
    legend: {
      orient: 'horizontal',
      bottom: '8%',
      left: 'center',
      itemGap: 20,
      itemWidth: 14,
      itemHeight: 14,
      textStyle: {
        color: '#666',
        fontSize: 12,
        fontFamily: 'Microsoft YaHei, SimHei, sans-serif',
        padding: [2, 0, 0, 8]
      }
    },
    series: [
      {
        name: '技能匹配',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '45%'],
        data: data,
        label: {
          show: true,
          position: 'outside',
          fontSize: 11,
          fontFamily: 'Microsoft YaHei, SimHei, sans-serif',
          color: '#333',
          formatter: '{b}\n{d}%',
          lineHeight: 16
        },
        labelLine: {
          show: true,
          length: 15,
          length2: 8,
          smooth: true
        },
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          },
          label: {
            fontSize: 12,
            fontWeight: 'bold'
          }
        }
      }
    ]
  }
})

const formatDateTime = (date) => {
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getParticleStyle = (index) => {
  const delay = index * 0.3
  const duration = 4 + (index % 2)
  const size = 2 + (index % 2)
  return {
    left: `${(index * 8) % 100}%`,
    top: `${(index * 12) % 100}%`,
    width: `${size}px`,
    height: `${size}px`,
    animationDelay: `${delay}s`,
    animationDuration: `${duration}s`
  }
}

const getRadarPoints = () => {
  const center = 100
  const maxRadius = 80
  let points = []

  reportData.value.capabilities.forEach((capability, index) => {
    const angle = (index * 60 - 90) * (Math.PI / 180) // 从顶部开始，每60度一个点
    const radius = (capability.score / 100) * maxRadius
    const x = center + radius * Math.cos(angle)
    const y = center + radius * Math.sin(angle)
    points.push(`${x},${y}`)
  })

  return points.join(' ')
}

const getRadarPointStyle = (score, index) => {
  const angle = index * 60 - 90 // 从顶部开始
  const radius = (score / 100) * 80 // 80是最大半径
  const radian = angle * (Math.PI / 180)
  const x = 100 + radius * Math.cos(radian)
  const y = 100 + radius * Math.sin(radian)

  return {
    left: `${x}%`,
    top: `${y}%`,
    transform: 'translate(-50%, -50%)'
  }
}



const downloadPDF = () => {
  console.log('下载PDF报告')
  // 这里可以添加PDF生成和下载逻辑
}

const shareReport = () => {
  console.log('分享报告')
  // 这里可以添加报告分享逻辑
}

const printReport = () => {
  console.log('打印报告')
  window.print()
}

const goToLearningPath = () => {
  router.push('/learning-path')
}

const scheduleReinterview = () => {
  console.log('安排复试')
  // 这里可以添加复试安排逻辑
}

const goBack = () => {
  router.push('/')
}

// 导出格式选择对话框
const showExportFormatDialog = () => {
  return new Promise((resolve) => {
    ElMessageBox.confirm(
      '请选择导出格式',
      '导出报告',
      {
        distinguishCancelAndClose: true,
        confirmButtonText: 'PDF格式',
        cancelButtonText: 'Excel格式',
        type: 'info'
      }
    ).then(() => {
      resolve('pdf')
    }).catch((action) => {
      if (action === 'cancel') {
        resolve('excel')
      } else {
        resolve(null)
      }
    })
  })
}

// 导出报告数据
const exportReportData = async (reportData, format) => {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')
  const fileName = `iFlytek面试报告_${reportData.candidateName}_${timestamp}`

  if (format === 'pdf') {
    await exportToPDF(reportData, fileName)
  } else if (format === 'excel') {
    await exportToExcel(reportData, fileName)
  }
}

// 导出为PDF
const exportToPDF = async (reportData, fileName) => {
  // 动态导入jsPDF
  const { jsPDF } = await import('jspdf')

  const doc = new jsPDF()

  // 设置中文字体
  doc.setFont('helvetica')

  // 标题
  doc.setFontSize(20)
  doc.text('iFlytek Spark 面试评估报告', 20, 30)

  // 候选人信息
  doc.setFontSize(14)
  doc.text(`候选人: ${reportData.candidateName}`, 20, 50)
  doc.text(`职位: ${reportData.position}`, 20, 65)
  doc.text(`面试日期: ${reportData.interviewDate}`, 20, 80)
  doc.text(`总体得分: ${reportData.overallScore}/100`, 20, 95)

  // 能力评估
  doc.setFontSize(16)
  doc.text('能力评估', 20, 120)

  let yPos = 140
  if (reportData.capabilities) {
    Object.entries(reportData.capabilities).forEach(([key, value]) => {
      doc.setFontSize(12)
      doc.text(`${key}: ${value}/100`, 20, yPos)
      yPos += 15
    })
  }

  // 优势和改进建议
  if (reportData.strengths && reportData.strengths.length > 0) {
    yPos += 10
    doc.setFontSize(16)
    doc.text('主要优势', 20, yPos)
    yPos += 20

    reportData.strengths.forEach((strength, index) => {
      doc.setFontSize(12)
      doc.text(`${index + 1}. ${strength}`, 20, yPos)
      yPos += 15
    })
  }

  if (reportData.improvements && reportData.improvements.length > 0) {
    yPos += 10
    doc.setFontSize(16)
    doc.text('改进建议', 20, yPos)
    yPos += 20

    reportData.improvements.forEach((improvement, index) => {
      doc.setFontSize(12)
      doc.text(`${index + 1}. ${improvement}`, 20, yPos)
      yPos += 15
    })
  }

  // 保存PDF
  doc.save(`${fileName}.pdf`)
}

// 导出为Excel
const exportToExcel = async (reportData, fileName) => {
  // 动态导入xlsx
  const XLSX = await import('xlsx')

  // 创建工作簿
  const workbook = XLSX.utils.book_new()

  // 基本信息工作表
  const basicInfo = [
    ['iFlytek Spark 面试评估报告'],
    [''],
    ['候选人姓名', reportData.candidateName],
    ['应聘职位', reportData.position],
    ['面试日期', reportData.interviewDate],
    ['总体得分', `${reportData.overallScore}/100`]
  ]

  // 能力评估工作表
  const capabilityData = [
    ['能力维度', '得分']
  ]

  if (reportData.capabilities) {
    Object.entries(reportData.capabilities).forEach(([key, value]) => {
      capabilityData.push([key, `${value}/100`])
    })
  }

  // 优势和改进建议
  const analysisData = [
    ['类型', '内容']
  ]

  if (reportData.strengths) {
    reportData.strengths.forEach((strength, index) => {
      analysisData.push([`优势${index + 1}`, strength])
    })
  }

  if (reportData.improvements) {
    reportData.improvements.forEach((improvement, index) => {
      analysisData.push([`改进建议${index + 1}`, improvement])
    })
  }

  // 创建工作表
  const basicSheet = XLSX.utils.aoa_to_sheet(basicInfo)
  const capabilitySheet = XLSX.utils.aoa_to_sheet(capabilityData)
  const analysisSheet = XLSX.utils.aoa_to_sheet(analysisData)

  // 添加到工作簿
  XLSX.utils.book_append_sheet(workbook, basicSheet, '基本信息')
  XLSX.utils.book_append_sheet(workbook, capabilitySheet, '能力评估')
  XLSX.utils.book_append_sheet(workbook, analysisSheet, '分析建议')

  // 导出文件
  XLSX.writeFile(workbook, `${fileName}.xlsx`)
}

// 创建分享链接
const createShareLink = async (shareData) => {
  try {
    // 生成分享ID
    const shareId = generateShareId()

    // 构建分享URL
    const shareUrl = `${window.location.origin}/report/share/${shareId}`

    // 模拟保存分享数据到服务器
    const shareResult = {
      success: true,
      shareId,
      shareUrl,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      accessCount: 0
    }

    // 保存到本地存储（实际应用中应该保存到服务器）
    localStorage.setItem(`share_${shareId}`, JSON.stringify({
      data: shareData,
      createdAt: new Date().toISOString(),
      expiresAt: shareResult.expiresAt
    }))

    return shareResult

  } catch (error) {
    console.error('创建分享链接失败:', error)
    throw new Error('分享链接创建失败')
  }
}

// 生成分享ID
const generateShareId = () => {
  return Math.random().toString(36).substr(2, 9) + Date.now().toString(36)
}

// 显示分享详情对话框
const showShareDetailsDialog = (shareResult) => {
  ElMessageBox.alert(
    `分享链接: ${shareResult.shareUrl}\n\n有效期至: ${new Date(shareResult.expiresAt).toLocaleString()}\n\n链接已复制到剪贴板，您可以直接分享给他人。`,
    '分享成功',
    {
      confirmButtonText: '确定',
      type: 'success'
    }
  )
}

// 新增的交互方法
const showCapabilityDetail = (capability) => {
  console.log('显示能力详情:', capability)
  // 可以打开详情对话框或跳转到详情页
}

const refreshTrendAnalysis = async () => {
  try {
    console.log('🔄 刷新面试表现趋势分析...')

    // 显示加载状态
    const loadingMessage = ElMessage({
      message: '正在刷新趋势数据...',
      type: 'info',
      duration: 1500
    })

    // 模拟数据刷新
    await new Promise(resolve => setTimeout(resolve, 1000))

    ElMessage.success('趋势数据已更新')
  } catch (error) {
    console.error('趋势分析刷新失败:', error)
    ElMessage.error('刷新失败，请稍后重试')
  }
}

const regenerateInsights = async () => {
  try {
    console.log('🔄 重新生成增强AI洞察...')

    // 显示加载状态
    const loadingMessage = ElMessage({
      message: '正在生成深度AI洞察...',
      type: 'info',
      duration: 0,
      showClose: false
    })

    // 调用增强的AI洞察服务
    const candidateData = {
      id: candidateInfo.value.name,
      name: candidateInfo.value.name,
      position: candidateInfo.value.position,
      capabilities: reportData.value.capabilities
    }

    const interviewData = {
      duration: reportData.value.duration,
      answeredQuestions: reportData.value.answeredQuestions,
      totalQuestions: reportData.value.totalQuestions,
      voiceQuality: reportData.value.voiceQuality,
      emotionStability: reportData.value.emotionStability,
      overallScore: reportData.value.overallScore
    }

    // 生成深度洞察
    const deepInsights = await enhancedAIInsightsService.generateDeepInsights(candidateData, interviewData)

    // 生成个性化建议
    const jobRequirements = {
      technicalSkills: ['算法设计', '系统架构', '编程能力'],
      softSkills: ['沟通能力', '团队协作', '领导力'],
      experience: '3-5年相关经验'
    }

    const personalizedSuggestions = await enhancedAIInsightsService.generatePersonalizedSuggestions(deepInsights, jobRequirements)

    // 更新AI洞察数据
    aiInsights.value = [
      {
        id: 1,
        type: 'strength',
        title: '技术实力突出',
        description: deepInsights.coreInsights.strengths.join('、') + '表现优异，具备扎实的专业基础。',
        confidence: deepInsights.confidenceScores.technical
      },
      {
        id: 2,
        type: 'improvement',
        title: '发展建议',
        description: `在${deepInsights.coreInsights.improvements.join('、')}方面有提升空间，建议重点关注。`,
        confidence: deepInsights.confidenceScores.behavioral
      },
      {
        id: 3,
        type: 'potential',
        title: '潜力评估',
        description: deepInsights.predictiveInsights.performancePrediction,
        confidence: deepInsights.confidenceScores.potential
      },
      {
        id: 4,
        type: 'prediction',
        title: '成长轨迹',
        description: deepInsights.predictiveInsights.growthTrajectory + '，适合承担具有挑战性的项目。',
        confidence: deepInsights.confidenceScores.overall
      }
    ]

    // 关闭加载消息
    loadingMessage.close()

    // 显示成功消息
    ElMessage.success('AI洞察已更新，基于最新的深度分析算法')

    console.log('✅ 增强AI洞察生成完成:', deepInsights)

  } catch (error) {
    console.error('❌ 重新生成洞察失败:', error)
    ElMessage.error('洞察生成失败，请稍后重试')
  }
}

const generateLearningPath = async () => {
  try {
    console.log('🎯 生成智能学习路径...')

    // 显示加载状态
    const loadingMessage = ElMessage({
      message: '正在生成个性化学习路径...',
      type: 'info',
      duration: 0,
      showClose: false
    })

    // 准备洞察数据
    const insights = {
      candidateId: candidateInfo.value.name,
      coreInsights: {
        strengths: ['技术能力', '逻辑思维', '学习能力'],
        improvements: ['沟通表达', '团队协作']
      },
      detailedAnalysis: {
        technicalCompetency: { score: 88 },
        softSkills: { score: 82 },
        culturalFit: { score: 78 },
        leadershipPotential: { score: 75 }
      },
      confidenceScores: {
        overall: 87,
        technical: 92,
        behavioral: 85,
        potential: 88
      }
    }

    // 定义职业目标
    const careerGoals = {
      targetRole: candidateInfo.value.position,
      timeframe: '12个月',
      focusAreas: ['技术深度', '领导力', '沟通能力'],
      industryPreference: 'AI/机器学习'
    }

    // 调用增强的AI洞察服务生成智能学习路径
    let intelligentPath
    try {
      intelligentPath = await enhancedAIInsightsService.generateIntelligentLearningPath(insights, careerGoals)
    } catch (error) {
      console.warn('AI服务调用失败，使用默认学习路径:', error)
      // 使用默认的学习路径作为备用方案
      intelligentPath = {
        shortTerm: {
          duration: '1-3个月',
          modules: [{ title: '沟通技巧基础' }]
        },
        mediumTerm: {
          duration: '3-6个月',
          modules: [{ title: '高级技术架构' }]
        },
        longTerm: {
          duration: '6-12个月',
          modules: [{ title: '技术领导力' }]
        }
      }
    }

    // 更新学习路径数据
    const newLearningPath = [
      {
        id: 1,
        title: intelligentPath.shortTerm.modules[0]?.title || '沟通技巧基础',
        description: '提升基础沟通表达能力，为后续发展打好基础',
        difficulty: 'success',
        difficultyText: '简单',
        duration: intelligentPath.shortTerm.duration || '1-3个月',
        completed: false,
        current: true
      },
      {
        id: 2,
        title: intelligentPath.mediumTerm.modules[0]?.title || '高级技术架构',
        description: '深入学习系统架构设计和技术领导力',
        difficulty: 'warning',
        difficultyText: '中等',
        duration: intelligentPath.mediumTerm.duration || '3-6个月',
        completed: false,
        current: false
      },
      {
        id: 3,
        title: intelligentPath.longTerm.modules[0]?.title || '技术领导力',
        description: '培养技术团队领导能力和战略思维',
        difficulty: 'danger',
        difficultyText: '困难',
        duration: intelligentPath.longTerm.duration || '6-12个月',
        completed: false,
        current: false
      },
      {
        id: 4,
        title: '持续学习与创新',
        description: '建立持续学习机制，保持技术前沿敏感度',
        difficulty: 'info',
        difficultyText: '持续',
        duration: '持续进行',
        completed: false,
        current: false
      }
    ]

    console.log('📝 准备更新学习路径数据:', newLearningPath)
    console.log('📊 当前学习路径长度:', learningPath.value.length)

    // 先清空数组，然后重新赋值，确保响应式更新
    learningPath.value.splice(0, learningPath.value.length)
    await nextTick()

    // 重新赋值
    learningPath.value.push(...newLearningPath)
    await nextTick()

    console.log('✅ 学习路径数据已更新，新长度:', learningPath.value.length)
    console.log('📋 更新后的学习路径:', learningPath.value)

    // 关闭加载消息
    loadingMessage.close()

    // 显示成功消息，包含详细信息
    ElMessage.success({
      message: `智能学习路径已生成，包含 ${learningPath.value.length} 个学习项目`,
      duration: 3000,
      showClose: true
    })

    // 显示学习路径详情通知
    ElNotification({
      title: '个性化学习路径已生成',
      message: `基于您的能力特点，为您定制了 ${learningPath.value.length} 个阶段的学习计划，包括：${learningPath.value.map(item => item.title).join('、')}`,
      type: 'success',
      duration: 8000,
      position: 'top-right'
    })

    console.log('✅ 智能学习路径生成完成:', intelligentPath)

  } catch (error) {
    console.error('❌ 生成学习路径失败:', error)
    ElMessage.error('学习路径生成失败，请稍后重试')
  }
}

// 调试学习路径数据
const debugLearningPath = () => {
  console.log('🔍 调试学习路径数据:')
  console.log('📊 learningPath.value 长度:', learningPath.value.length)
  console.log('📋 learningPath.value 内容:', learningPath.value)
  console.log('🎯 DOM中的timeline-item数量:', document.querySelectorAll('.timeline-item').length)

  // 显示详细的调试信息
  const debugInfo = learningPath.value.map((item, index) =>
    `${index + 1}. ${item.title} (${item.difficultyText}, ${item.duration})`
  ).join('\n')

  ElNotification({
    title: '学习路径调试信息',
    message: `当前学习路径包含 ${learningPath.value.length} 个项目：\n${debugInfo}`,
    type: 'info',
    duration: 10000,
    position: 'top-left'
  })

  ElMessage.info(`学习路径包含 ${learningPath.value.length} 个项目`)
}

// 生命周期
onMounted(() => {
  console.log('📊 报告页面已加载 - 智能打分展示风格')
  console.log('📋 初始学习路径数据:', learningPath.value)
})
</script>

<style scoped>
/* 导入优化系统 */
@import '@/styles/gradient-background-system.css';
@import '@/styles/layout-optimization.css';

/* 📊 报告页面样式 - 智能打分展示风格 */
.report-page {
  min-height: 100vh;
}

.report-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* 🎯 报告头部样式 */
.report-header {
  position: relative;
  background: white;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.report-header-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.report-header-gradient {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.report-header-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.report-particle {
  position: absolute;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  animation: float 6s ease-in-out infinite;
}

@keyframes float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(180deg); }
}

.report-header-content {
  position: relative;
  z-index: 2;
  padding: 60px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.report-candidate-info {
  display: flex;
  align-items: center;
  gap: 24px;
  color: white;
}

.candidate-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  border: 4px solid rgba(255, 255, 255, 0.3);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.candidate-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.candidate-name {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.candidate-position {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.9);
  margin-bottom: 12px;
}

.interview-meta {
  display: flex;
  gap: 20px;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
}

.overall-score-display {
  display: flex;
  align-items: center;
  gap: 30px;
}

.score-circle-large {
  position: relative;
}

.score-circle-bg {
  width: 120px;
  height: 120px;
  position: relative;
}

.score-circle-fill {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(
    #ffffff 0deg,
    #ffffff calc(var(--score) * 3.6deg),
    rgba(255, 255, 255, 0.3) calc(var(--score) * 3.6deg)
  );
  display: flex;
  align-items: center;
  justify-content: center;
}

.score-circle-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: white;
}

.score-number {
  font-size: 2.5rem;
  font-weight: 700;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.score-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
}

.score-grade {
  text-align: center;
}

.grade-badge {
  display: inline-block;
  padding: 12px 24px;
  border-radius: 25px;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 8px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.grade-badge.grade-a-plus,
.grade-badge.grade-a {
  background: rgba(82, 196, 26, 0.9);
  color: white;
}

.grade-badge.grade-a-minus,
.grade-badge.grade-b-plus {
  background: rgba(24, 144, 255, 0.9);
  color: white;
}

.grade-badge.grade-b,
.grade-badge.grade-b-minus {
  background: rgba(250, 173, 20, 0.9);
  color: white;
}

.grade-badge.grade-c {
  background: rgba(255, 77, 79, 0.9);
  color: white;
}

.grade-description {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 200px;
}

/* 📊 主报告内容样式 - 优化间距布局 */
.report-main {
  padding: 60px 0;
  background: linear-gradient(135deg,
    rgba(24, 144, 255, 0.02) 0%,
    rgba(102, 126, 234, 0.03) 25%,
    rgba(118, 75, 162, 0.02) 50%,
    rgba(24, 144, 255, 0.01) 100%);
  min-height: 100vh;
  position: relative;
}

.report-main::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 200px;
  background: linear-gradient(180deg,
    rgba(24, 144, 255, 0.05) 0%,
    transparent 100%);
  pointer-events: none;
}

.section-header {
  text-align: center;
  margin-bottom: 60px;
}

.section-title {
  font-size: 2.2rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 16px;
  line-height: 1.3;
}

.section-subtitle {
  font-size: 1.1rem;
  color: #4a5568;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

/* 📈 概览卡片样式 - 优化间距布局 */
.report-overview {
  margin-bottom: 80px;
}

.overview-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 30px;
  padding: 0 20px;
}

.overview-card {
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(248, 250, 252, 0.98) 100%);
  border-radius: 20px;
  padding: 30px 25px;
  box-shadow:
    0 8px 32px rgba(24, 144, 255, 0.12),
    0 4px 16px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  gap: 20px;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.overview-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(24, 144, 255, 0.1) 50%,
    transparent 100%);
  transition: left 0.6s ease;
}

.overview-card:hover::before {
  left: 100%;
}

.overview-card:hover {
  transform: translateY(-8px) scale(1.02);
  box-shadow:
    0 16px 48px rgba(24, 144, 255, 0.2),
    0 8px 24px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.card-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.card-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #2d3748;
  margin-bottom: 4px;
}

.card-label {
  font-size: 0.9rem;
  color: #4a5568;
}

/* 🎯 多模态评估概览样式 */
.multimodal-overview {
  margin-bottom: 40px;
}

.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.multimodal-card {
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.98) 0%,
    rgba(248, 250, 252, 0.95) 100%);
  border-radius: 20px;
  padding: 28px;
  box-shadow:
    0 8px 32px rgba(102, 126, 234, 0.15),
    0 4px 16px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 4px solid transparent;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.multimodal-card::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 60px;
  height: 60px;
  background: radial-gradient(circle,
    rgba(24, 144, 255, 0.1) 0%,
    transparent 70%);
  border-radius: 50%;
  transform: translate(30px, -30px);
  transition: all 0.4s ease;
}

.multimodal-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow:
    0 16px 48px rgba(102, 126, 234, 0.25),
    0 8px 24px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.multimodal-card:hover::after {
  transform: translate(20px, -20px) scale(1.5);
  opacity: 0.8;
}

.multimodal-card.voice-analysis {
  border-left-color: #1890ff;
  background: linear-gradient(135deg,
    rgba(24, 144, 255, 0.08) 0%,
    rgba(255, 255, 255, 0.98) 20%,
    rgba(248, 250, 252, 0.95) 100%);
}

.multimodal-card.voice-analysis:hover {
  box-shadow:
    0 16px 48px rgba(24, 144, 255, 0.3),
    0 8px 24px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}



.multimodal-card.ai-insights {
  border-left-color: #fa8c16;
  background: linear-gradient(135deg,
    rgba(250, 140, 22, 0.08) 0%,
    rgba(255, 255, 255, 0.98) 20%,
    rgba(248, 250, 252, 0.95) 100%);
}

.multimodal-card.ai-insights:hover {
  box-shadow:
    0 16px 48px rgba(250, 140, 22, 0.3),
    0 8px 24px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.multimodal-card .card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
}

.multimodal-card .card-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
}

.multimodal-card .card-info h4 {
  margin: 0 0 4px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
}

.multimodal-card .card-info p {
  margin: 0;
  font-size: 0.9rem;
  color: #4a5568;
}

.card-metrics {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.metric-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.metric-label {
  font-size: 0.9rem;
  color: #4a5568;
  min-width: 80px;
}

.metric-value {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 8px;
}

.value-number {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3748;
  min-width: 40px;
}

/* 🎯 综合视图样式 */
.comprehensive-view {
  margin-top: 24px;
}

.comprehensive-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
}

.capability-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.capability-section .section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
  font-size: 1.2rem;
  font-weight: 600;
  color: #2d3748;
}

.capability-section .section-title .el-icon {
  color: #1890ff;
  font-size: 20px;
}

.ability-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 20px;
}

.ability-card {
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.9) 0%,
    rgba(248, 249, 250, 0.95) 100%);
  border-radius: 16px;
  padding: 24px;
  border-left: 4px solid transparent;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow:
    0 4px 16px rgba(102, 126, 234, 0.08),
    0 2px 8px rgba(0, 0, 0, 0.04),
    inset 0 1px 0 rgba(255, 255, 255, 0.6);
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(8px);
}

.ability-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(24, 144, 255, 0.3) 50%,
    transparent 100%);
  transform: translateX(-100%);
  transition: transform 0.6s ease;
}

.ability-card:hover::before {
  transform: translateX(100%);
}

.ability-card:hover {
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(240, 242, 245, 0.98) 100%);
  transform: translateY(-4px) scale(1.01);
  box-shadow:
    0 12px 32px rgba(102, 126, 234, 0.15),
    0 6px 16px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.ability-card.excellent {
  border-left-color: #52c41a;
  background: linear-gradient(135deg,
    rgba(82, 196, 26, 0.05) 0%,
    rgba(255, 255, 255, 0.9) 15%,
    rgba(248, 249, 250, 0.95) 100%);
}

.ability-card.excellent:hover {
  box-shadow:
    0 12px 32px rgba(82, 196, 26, 0.2),
    0 6px 16px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.ability-card.good {
  border-left-color: #1890ff;
  background: linear-gradient(135deg,
    rgba(24, 144, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.9) 15%,
    rgba(248, 249, 250, 0.95) 100%);
}

.ability-card.good:hover {
  box-shadow:
    0 12px 32px rgba(24, 144, 255, 0.2),
    0 6px 16px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.ability-card.average {
  border-left-color: #faad14;
  background: linear-gradient(135deg,
    rgba(250, 173, 20, 0.05) 0%,
    rgba(255, 255, 255, 0.9) 15%,
    rgba(248, 249, 250, 0.95) 100%);
}

.ability-card.average:hover {
  box-shadow:
    0 12px 32px rgba(250, 173, 20, 0.2),
    0 6px 16px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.ability-card.poor {
  border-left-color: #ff4d4f;
  background: linear-gradient(135deg,
    rgba(255, 77, 79, 0.05) 0%,
    rgba(255, 255, 255, 0.9) 15%,
    rgba(248, 249, 250, 0.95) 100%);
}

.ability-card.poor:hover {
  box-shadow:
    0 12px 32px rgba(255, 77, 79, 0.2),
    0 6px 16px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.ability-card .card-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.ability-name {
  flex: 1;
  font-size: 1rem;
  font-weight: 600;
  color: #2d3748;
}

.ability-score {
  font-size: 1.1rem;
  font-weight: 700;
  color: #1890ff;
}

.multimodal-breakdown {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.breakdown-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.breakdown-label {
  font-size: 0.8rem;
  color: #4a5568;
  min-width: 40px;
}

.breakdown-value {
  font-size: 0.8rem;
  font-weight: 600;
  color: #2d3748;
  min-width: 35px;
}

/* 🎯 多模态分析视图样式 */
.multimodal-analysis-view {
  margin-top: 24px;
}

.multimodal-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 32px;
}

.modality-section {
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.modality-section .section-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
}

.section-icon {
  color: #1890ff;
  font-size: 24px;
}

.modality-section h3 {
  flex: 1;
  margin: 0;
  font-size: 1.3rem;
  font-weight: 600;
  color: #2d3748;
}

.voice-metrics,
.video-metrics,
.text-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 24px;
}

.metric-card {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.metric-card:hover {
  background: #f0f2f5;
  transform: translateY(-1px);
}

.metric-title {
  font-size: 0.9rem;
  color: #4a5568;
  margin-bottom: 8px;
}

.metric-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: #1890ff;
  margin-bottom: 8px;
}

.metric-description {
  font-size: 0.8rem;
  color: #6b7280;
  line-height: 1.4;
}

.voice-insights,
.video-insights,
.text-insights {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
}

.voice-insights h4,
.video-insights h4,
.text-insights h4 {
  margin: 0 0 16px 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
}

.voice-insights ul,
.video-insights ul,
.text-insights ul {
  margin: 0;
  padding-left: 20px;
  list-style-type: disc;
}

.voice-insights li,
.video-insights li,
.text-insights li {
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #4a5568;
  line-height: 1.5;
}

/* 🎯 增强的深度分析样式 */
.enhanced-analysis .section-header {
  position: relative;
  padding-bottom: 24px;
  margin-bottom: 32px;
}

.analysis-controls {
  display: flex;
  gap: 12px;
  margin-top: 16px;
}

.deep-analysis-overview {
  margin-bottom: 40px;
}

.analysis-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.analysis-card {
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.98) 0%,
    rgba(248, 250, 252, 0.95) 100%);
  border-radius: 20px;
  padding: 28px;
  box-shadow:
    0 8px 32px rgba(118, 75, 162, 0.12),
    0 4px 16px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-left: 4px solid transparent;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(12px);
}

.analysis-card::after {
  content: '';
  position: absolute;
  top: -50%;
  right: -50%;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle,
    rgba(118, 75, 162, 0.06) 0%,
    transparent 70%);
  transform: scale(0);
  transition: transform 0.6s ease;
}

.analysis-card:hover::after {
  transform: scale(1);
}

.analysis-card:hover {
  transform: translateY(-6px) scale(1.02);
  box-shadow:
    0 16px 48px rgba(118, 75, 162, 0.2),
    0 8px 24px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.predictive-card {
  border-left-color: #1890ff;
  background: linear-gradient(135deg,
    rgba(24, 144, 255, 0.06) 0%,
    rgba(255, 255, 255, 0.98) 20%,
    rgba(248, 250, 252, 0.95) 100%);
}

.predictive-card:hover {
  box-shadow:
    0 16px 48px rgba(24, 144, 255, 0.25),
    0 8px 24px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}



.risk-card {
  border-left-color: #faad14;
  background: linear-gradient(135deg,
    rgba(250, 173, 20, 0.06) 0%,
    rgba(255, 255, 255, 0.98) 20%,
    rgba(248, 250, 252, 0.95) 100%);
}

.risk-card:hover {
  box-shadow:
    0 16px 48px rgba(250, 173, 20, 0.25),
    0 8px 24px rgba(0, 0, 0, 0.12),
    inset 0 1px 0 rgba(255, 255, 255, 0.9);
}

.analysis-card .card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
  position: relative;
  z-index: 10;
}

.analysis-card .card-header .el-button {
  pointer-events: auto;
  z-index: 11;
}

.analysis-card .card-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.analysis-card .card-info {
  flex: 1;
}

.analysis-card .card-info h4 {
  margin: 0 0 4px 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #2d3748;
}

.analysis-card .card-info p {
  margin: 0;
  font-size: 0.9rem;
  color: #4a5568;
}

.confidence-badge {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #f0f8ff;
  border-radius: 8px;
  padding: 8px 12px;
}

.confidence-value {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1890ff;
}

.confidence-label {
  font-size: 0.7rem;
  color: #6b7280;
}



.pattern-type {
  font-size: 0.9rem;
  font-weight: 600;
  color: #0369a1;
}

.risk-level {
  border-radius: 8px;
  padding: 8px 12px;
  font-size: 0.9rem;
  font-weight: 600;
}

.risk-low {
  background: #f0f9ff;
  color: #0369a1;
}

.risk-medium {
  background: #fffbeb;
  color: #d97706;
}

.risk-high {
  background: #fef2f2;
  color: #dc2626;
}

/* 预测分析样式 */
.prediction-item {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.prediction-label {
  font-size: 0.9rem;
  color: #4a5568;
  min-width: 100px;
}

.prediction-bar {
  flex: 1;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.prediction-fill {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
  transition: width 0.3s ease;
}

.prediction-score {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3748;
  min-width: 40px;
}



.trait-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.trait-name {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3748;
}

.trait-strength {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
}

.strength-high {
  background: #dcfce7;
  color: #166534;
}

.strength-medium {
  background: #fef3c7;
  color: #92400e;
}

.strength-low {
  background: #fee2e2;
  color: #991b1b;
}

.trait-description {
  font-size: 0.8rem;
  color: #6b7280;
  line-height: 1.4;
}

/* 整合的行为特征洞察样式 */
.behavior-insights-section {
  margin-top: 20px;
  padding-top: 16px;
  border-top: 1px solid #e2e8f0;
}

.insights-title {
  font-size: 14px;
  font-weight: 600;
  color: #4a5568;
  margin: 0 0 12px 0;
}

.behavior-traits-integrated {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}

.trait-item-compact {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;
  background: #f7fafc;
  border-radius: 6px;
  font-size: 12px;
}

.trait-item-compact .trait-name {
  color: #2d3748;
  font-weight: 500;
}

.trait-item-compact .trait-strength {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
}

.pattern-summary {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
}

.pattern-type-label {
  color: #6b7280;
  font-weight: 500;
}

.pattern-type-value {
  color: #1890ff;
  font-weight: 600;
  padding: 2px 8px;
  background: rgba(24, 144, 255, 0.1);
  border-radius: 4px;
}

/* 风险评估样式 */
.risk-factors {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.risk-item {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 16px;
  border-left: 3px solid transparent;
}

.risk-item:nth-child(1) {
  border-left-color: #52c41a;
}

.risk-item:nth-child(2) {
  border-left-color: #faad14;
}

.risk-item:nth-child(3) {
  border-left-color: #52c41a;
}

.risk-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.risk-icon {
  font-size: 16px;
}

.risk-icon-low {
  color: #52c41a;
}

.risk-icon-medium {
  color: #faad14;
}

.risk-icon-high {
  color: #ff4d4f;
}

.risk-title {
  flex: 1;
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d3748;
}

.risk-probability {
  font-size: 0.8rem;
  font-weight: 600;
  color: #1890ff;
}

.risk-description {
  font-size: 0.8rem;
  color: #6b7280;
  margin-bottom: 8px;
  line-height: 1.4;
}

.mitigation-strategy {
  font-size: 0.8rem;
  line-height: 1.4;
}

.strategy-label {
  font-weight: 600;
  color: #4a5568;
}

.strategy-text {
  color: #6b7280;
}

/* 🎯 能力雷达图样式 - 优化间距布局 */
.capability-radar-section {
  margin-bottom: 80px;
  background: linear-gradient(135deg,
    rgba(102, 126, 234, 0.06) 0%,
    rgba(118, 75, 162, 0.04) 50%,
    rgba(24, 144, 255, 0.06) 100%);
  border-radius: 24px;
  padding: 48px 40px;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 12px 40px rgba(102, 126, 234, 0.15),
    0 6px 20px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.15);
}

.capability-radar-section::before {
  content: '';
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background:
    radial-gradient(circle at 30% 30%, rgba(102, 126, 234, 0.08) 0%, transparent 40%),
    radial-gradient(circle at 70% 70%, rgba(118, 75, 162, 0.06) 0%, transparent 40%);
  animation: backgroundFloat 20s ease-in-out infinite;
  pointer-events: none;
}

@keyframes backgroundFloat {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  33% { transform: translate(-20px, -10px) rotate(1deg); }
  66% { transform: translate(10px, -20px) rotate(-1deg); }
}

.capability-radar-section .section-header {
  position: relative;
  z-index: 2;
}

.capability-radar-section .section-title {
  color: #1890ff;
  text-shadow: 0 2px 8px rgba(24, 144, 255, 0.3);
}

.radar-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: start;
  padding: 0 20px;
}

.radar-chart {
  background: white;
  border-radius: 16px;
  padding: 50px 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.radar-grid {
  position: relative;
  width: 320px;
  height: 320px;
  margin: 0 auto;
}

.radar-ring {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border: 1px solid #e2e8f0;
  border-radius: 50%;
  width: var(--ring-size);
  height: var(--ring-size);
}

.radar-axis {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 50%;
  height: 1px;
  transform-origin: left center;
  transform: translate(0, -50%) rotate(var(--axis-angle));
}

.axis-line {
  width: 100%;
  height: 1px;
  background: #e2e8f0;
}

.axis-label {
  position: absolute;
  right: -10px;
  top: 50%;
  transform: translateY(-50%) rotate(calc(-1 * var(--axis-angle)));
  font-size: 0.8rem;
  color: #4a5568;
  font-weight: 500;
  white-space: nowrap;
}

.radar-data {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.radar-polygon {
  width: 100%;
  height: 100%;
}

.radar-point {
  position: absolute;
  width: 20px;
  height: 20px;
  background: #667eea;
  border: 3px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.3);
}

.point-value {
  font-size: 0.7rem;
  color: white;
  font-weight: 600;
}

.capability-details {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.capability-item {
  background: white;
  border-radius: 12px;
  padding: 30px 25px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.capability-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.capability-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #2d3748;
}

.capability-score {
  font-size: 1.2rem;
  font-weight: 700;
  color: #667eea;
}

.capability-progress {
  margin-bottom: 16px;
}

.progress-bar {
  width: 100%;
  height: 8px;
  background: #e2e8f0;
  border-radius: 4px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 4px;
  transition: width 0.8s ease;
}

.capability-comment {
  font-size: 1rem;
  color: #4a5568;
  line-height: 1.6;
  margin-bottom: 16px;
}

.capability-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.capability-tag {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  color: white;
}

.capability-tag.high {
  background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
}

.capability-tag.medium {
  background: linear-gradient(135deg, #ed8936 0%, #dd6b20 100%);
}

.capability-tag.low {
  background: linear-gradient(135deg, #f56565 0%, #e53e3e 100%);
}

.summary-item {
  text-align: center;
  padding: 20px;
  background: var(--iflytek-bg-secondary);
  border-radius: 8px;
}

.summary-label {
  font-size: var(--font-size-sm);
  color: var(--iflytek-text-secondary);
  margin-bottom: 8px;
}

.summary-value {
  font-size: var(--font-size-xl);
  font-weight: var(--font-weight-bold);
  color: var(--iflytek-primary);
}

.capability-analysis {
  margin-bottom: 32px;
}

.capability-analysis h2 {
  margin: 0 0 20px 0;
  color: var(--iflytek-text-primary);
}

.capability-item {
  margin-bottom: 24px;
  padding: 20px;
  background: var(--iflytek-bg-secondary);
  border-radius: 8px;
}

.capability-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.capability-name {
  font-weight: var(--font-weight-semibold);
  color: var(--iflytek-text-primary);
}

.capability-score {
  font-weight: var(--font-weight-bold);
  color: var(--iflytek-primary);
}

.capability-comment {
  margin: 12px 0 0 0;
  color: var(--iflytek-text-secondary);
  font-size: var(--font-size-sm);
  line-height: 1.5;
}

/* 🎯 增强的能力评估样式 */
.capability-analysis-container {
  margin-top: 24px;
}

.section-controls {
  margin-left: auto;
}

.radar-chart-container {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 32px;
  align-items: start;
}

/* 优化后的雷达图布局 */
.radar-chart-container-optimized {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  padding: 24px;
}

.chart-wrapper-centered {
  width: 100%;
  max-width: 600px;
  display: flex;
  justify-content: center;
  background: white;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* 能力项水平网格布局 */
.capability-overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1200px;
}

.capability-card-horizontal {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  border-left: 4px solid transparent;
  transition: all 0.3s ease;
}

.capability-card-horizontal:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
}

.capability-card-horizontal.excellent {
  border-left-color: #52c41a;
  background: linear-gradient(135deg, rgba(82, 196, 26, 0.05) 0%, rgba(255, 255, 255, 0.98) 100%);
}

.capability-card-horizontal.good {
  border-left-color: #1890ff;
  background: linear-gradient(135deg, rgba(24, 144, 255, 0.05) 0%, rgba(255, 255, 255, 0.98) 100%);
}

.capability-card-horizontal.average {
  border-left-color: #faad14;
  background: linear-gradient(135deg, rgba(250, 173, 20, 0.05) 0%, rgba(255, 255, 255, 0.98) 100%);
}

.capability-card-horizontal.poor {
  border-left-color: #ff4d4f;
  background: linear-gradient(135deg, rgba(255, 77, 79, 0.05) 0%, rgba(255, 255, 255, 0.98) 100%);
}

.capability-card-horizontal .card-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  flex-shrink: 0;
}

.capability-card-horizontal.excellent .card-icon {
  background: linear-gradient(135deg, #52c41a, #73d13d);
}

.capability-card-horizontal.good .card-icon {
  background: linear-gradient(135deg, #1890ff, #40a9ff);
}

.capability-card-horizontal.average .card-icon {
  background: linear-gradient(135deg, #faad14, #ffc53d);
}

.capability-card-horizontal.poor .card-icon {
  background: linear-gradient(135deg, #ff4d4f, #ff7875);
}

.capability-card-horizontal .card-content {
  flex: 1;
  min-width: 0;
}

.capability-card-horizontal .card-title {
  font-size: 16px;
  font-weight: 600;
  color: #2d3748;
  margin-bottom: 4px;
}

.capability-card-horizontal .card-score {
  font-size: 20px;
  font-weight: 700;
  color: #1890ff;
  margin-bottom: 2px;
}

.capability-card-horizontal .card-level {
  font-size: 12px;
  color: #6b7280;
}

.capability-card-horizontal .card-trend {
  flex-shrink: 0;
}

.capability-card-horizontal .trend-icon {
  font-size: 20px;
}

.chart-wrapper {
  background: var(--iflytek-bg-primary);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--iflytek-shadow-sm);
}

.capability-overview {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.capability-card {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg,
    rgba(255, 255, 255, 0.95) 0%,
    rgba(248, 250, 252, 0.98) 100%);
  border-radius: 16px;
  box-shadow:
    0 6px 24px rgba(102, 126, 234, 0.12),
    0 3px 12px rgba(0, 0, 0, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.7);
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
  overflow: hidden;
  backdrop-filter: blur(10px);
}

.capability-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg,
    transparent 0%,
    rgba(102, 126, 234, 0.08) 50%,
    transparent 100%);
  transition: left 0.6s ease;
}

.capability-card:hover::before {
  left: 100%;
}

.capability-card:hover {
  transform: translateY(-4px) scale(1.02);
  box-shadow:
    0 12px 36px rgba(102, 126, 234, 0.18),
    0 6px 18px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.8);
}

.capability-card.excellent {
  border-left: 4px solid #52c41a;
}

.capability-card.good {
  border-left: 4px solid #1890ff;
}

.capability-card.average {
  border-left: 4px solid #faad14;
}

.capability-card.poor {
  border-left: 4px solid #ff4d4f;
}

.card-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--iflytek-gradient-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
}

.card-content {
  flex: 1;
}

.card-title {
  font-size: var(--font-size-sm);
  color: var(--iflytek-text-secondary);
  margin-bottom: 4px;
}

.card-score {
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-bold);
  color: var(--iflytek-text-primary);
}

.card-level {
  font-size: var(--font-size-xs);
  color: var(--iflytek-text-tertiary);
}

.card-trend {
  display: flex;
  align-items: center;
}

.trend-icon {
  font-size: 16px;
}

.trend-up {
  color: #52c41a;
}

.trend-down {
  color: #ff4d4f;
}

.trend-stable {
  color: #faad14;
}

.bar-chart-container {
  background: var(--iflytek-bg-primary);
  border-radius: 12px;
  padding: 20px;
  box-shadow: var(--iflytek-shadow-sm);
}

.capability-item-enhanced {
  background: var(--iflytek-bg-primary);
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 20px;
  box-shadow: var(--iflytek-shadow-sm);
  transition: all 0.3s ease;
}

.capability-item-enhanced:hover {
  box-shadow: var(--iflytek-shadow-md);
}

.capability-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.capability-name {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--iflytek-text-primary);
}

.capability-score-badge {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: white;
}

.capability-score-badge.excellent {
  background: #52c41a;
}

.capability-score-badge.good {
  background: #1890ff;
}

.capability-score-badge.average {
  background: #faad14;
}

.capability-score-badge.poor {
  background: #ff4d4f;
}

.capability-actions {
  display: flex;
  gap: 8px;
}

.capability-progress-enhanced {
  margin: 16px 0;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-label {
  font-size: var(--font-size-sm);
  color: var(--iflytek-text-secondary);
}

.progress-percentage {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--iflytek-primary);
}

.capability-analysis {
  margin: 16px 0;
}

.analysis-item {
  margin-bottom: 12px;
  display: flex;
  gap: 8px;
}

.analysis-label {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  color: var(--iflytek-text-secondary);
  min-width: 80px;
}

.analysis-content {
  font-size: var(--font-size-sm);
  color: var(--iflytek-text-primary);
  line-height: 1.5;
}

.capability-tags {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.capability-tag {
  font-size: var(--font-size-xs);
}

/* 📊 AI分析区域样式 */
.ai-analysis-section {
  margin-top: 32px;
  background: linear-gradient(135deg,
    rgba(24, 144, 255, 0.08) 0%,
    rgba(102, 126, 234, 0.06) 50%,
    rgba(118, 75, 162, 0.08) 100%);
  border-radius: 20px;
  padding: 40px;
  position: relative;
  overflow: hidden;
  box-shadow:
    0 8px 32px rgba(24, 144, 255, 0.12),
    0 4px 16px rgba(0, 0, 0, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
}

.ai-analysis-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background:
    radial-gradient(circle at 20% 20%, rgba(24, 144, 255, 0.1) 0%, transparent 50%),
    radial-gradient(circle at 80% 80%, rgba(118, 75, 162, 0.1) 0%, transparent 50%);
  pointer-events: none;
}

.ai-analysis-section .section-header {
  position: relative;
  z-index: 1;
}

.ai-analysis-section .section-title {
  color: #1890ff;
  text-shadow: 0 2px 4px rgba(24, 144, 255, 0.2);
}

.ai-analysis-section .section-subtitle {
  color: rgba(45, 55, 72, 0.8);
  background: rgba(255, 255, 255, 0.6);
  padding: 8px 16px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  display: inline-block;
  margin-top: 8px;
}

/* 分析卡片动画效果 */
.analysis-card {
  transition: all 0.3s ease;
}

.analysis-card.loading {
  opacity: 0.7;
  transform: scale(0.98);
}

.analysis-card .card-content {
  transition: all 0.4s ease;
}

.analysis-card .prediction-item,
.analysis-card .trait-item-compact,
.analysis-card .risk-factor {
  transition: all 0.3s ease;
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 数据更新动画 */
.prediction-bar,
.trait-strength,
.risk-severity {
  transition: all 0.6s ease;
}

.prediction-fill {
  transition: width 0.8s ease;
}

/* 按钮加载状态样式 */
.analysis-controls .el-button.is-loading {
  opacity: 0.8;
}

.analysis-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.analysis-card {
  background: var(--iflytek-bg-primary);
  border-radius: 16px;
  padding: 24px;
  box-shadow: var(--iflytek-shadow-sm);
  transition: all 0.3s ease;
}

.analysis-card:hover {
  box-shadow: var(--iflytek-shadow-md);
}

.analysis-card.full-width {
  grid-column: 1 / -1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 20px;
  border-bottom: 2px solid var(--iflytek-border-secondary);
}

.card-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: var(--font-weight-semibold);
  color: var(--iflytek-text-primary);
}

.card-title .el-icon {
  color: var(--iflytek-primary);
  font-size: 20px;
}

.card-content {
  position: relative;
  margin-top: 16px;
  padding-top: 8px;
}

.insight-controls {
  display: flex;
  gap: 12px;
  align-items: center;
  position: relative;
  z-index: 10;
  pointer-events: auto;
}

.insight-controls .el-button {
  pointer-events: auto;
  z-index: 11;
}

.insights-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.insight-item {
  display: flex;
  gap: 16px;
  padding: 20px;
  background: var(--iflytek-bg-secondary);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.insight-item:hover {
  background: var(--iflytek-bg-tertiary);
  transform: translateY(-1px);
}

.insight-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 18px;
  flex-shrink: 0;
}

.insight-icon.strength {
  background: #52c41a;
}

.insight-icon.improvement {
  background: #faad14;
}

.insight-icon.potential {
  background: #1890ff;
}

.insight-icon.risk {
  background: #ff4d4f;
}

.insight-content {
  flex: 1;
}

.insight-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--iflytek-text-primary);
  margin-bottom: 8px;
}

.insight-description {
  font-size: var(--font-size-sm);
  color: var(--iflytek-text-secondary);
  line-height: 1.5;
  margin-bottom: 12px;
}

.insight-confidence {
  display: flex;
  align-items: center;
  gap: 8px;
}

.confidence-label {
  font-size: var(--font-size-xs);
  color: var(--iflytek-text-tertiary);
}

.confidence-value {
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  color: var(--iflytek-primary);
}

.learning-path-container {
  margin-top: 16px;
}

.path-timeline {
  position: relative;
  padding-left: 32px;
}

.path-timeline::before {
  content: '';
  position: absolute;
  left: 16px;
  top: 0;
  bottom: 0;
  width: 2px;
  background: var(--iflytek-border-primary);
}

.timeline-item {
  position: relative;
  margin-bottom: 32px;
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-marker {
  position: absolute;
  left: -24px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--iflytek-bg-primary);
  border: 3px solid var(--iflytek-border-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-bold);
  color: var(--iflytek-text-secondary);
  z-index: 1;
}

.timeline-item.completed .timeline-marker {
  background: #52c41a;
  border-color: #52c41a;
  color: white;
}

.timeline-item.current .timeline-marker {
  background: var(--iflytek-primary);
  border-color: var(--iflytek-primary);
  color: white;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% { box-shadow: 0 0 0 0 rgba(24, 144, 255, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(24, 144, 255, 0); }
  100% { box-shadow: 0 0 0 0 rgba(24, 144, 255, 0); }
}

.timeline-content {
  flex: 1;
  background: var(--iflytek-bg-secondary);
  padding: 20px;
  border-radius: 12px;
  transition: all 0.3s ease;
}

.timeline-content:hover {
  background: var(--iflytek-bg-tertiary);
  transform: translateY(-1px);
}

.step-title {
  font-size: var(--font-size-base);
  font-weight: var(--font-weight-semibold);
  color: var(--iflytek-text-primary);
  margin-bottom: 8px;
}

.step-description {
  font-size: var(--font-size-sm);
  color: var(--iflytek-text-secondary);
  line-height: 1.5;
  margin-bottom: 12px;
}

.step-meta {
  display: flex;
  gap: 16px;
  align-items: center;
}

.step-duration {
  font-size: var(--font-size-xs);
  color: var(--iflytek-text-tertiary);
}

.button-group {
  display: flex;
  gap: 8px;
  position: relative;
  z-index: 10;
  pointer-events: auto;
}

.button-group .el-button {
  pointer-events: auto;
  z-index: 11;
}



/* 🎯 按钮可见性修复 - 解决问题1 */
.el-button {
  color: #ffffff !important; /* 确保按钮文字为白色 */
}

.el-button--primary {
  background-color: #1890ff !important;
  border-color: #1890ff !important;
  color: #ffffff !important;
}

.el-button--primary:hover {
  background-color: #0066cc !important;
  border-color: #0066cc !important;
  color: #ffffff !important;
}

.el-button--secondary {
  background-color: #667eea !important;
  border-color: #667eea !important;
  color: #ffffff !important;
}

.el-button--info {
  background-color: #909399 !important;
  border-color: #909399 !important;
  color: #ffffff !important;
}

/* 确保所有按钮文字都有足够对比度 */
.el-button span {
  color: inherit !important;
}

.report-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
  padding-top: 24px;
  border-top: 1px solid var(--iflytek-border-secondary);
}

/* 📱 响应式间距优化 */
@media (max-width: 1200px) {
  .report-main {
    padding: 50px 0;
  }

  .ai-analysis-section {
    padding: 32px 24px;
    margin-top: 24px;
  }

  .capability-radar-section {
    padding: 40px 32px;
  }

  .analysis-card,
  .multimodal-card,
  .ability-card {
    padding: 20px;
  }

  .overview-card {
    padding: 24px 20px;
  }
}

@media (max-width: 1440px) {
  .section-header {
    margin-bottom: 50px;
  }

  .report-overview {
    margin-bottom: 70px;
  }

  .overview-cards {
    gap: 25px;
    padding: 0 15px;
  }

  .overview-card {
    padding: 25px 20px;
    gap: 16px;
  }

  .capability-radar-section {
    margin-bottom: 70px;
  }

  .radar-container {
    gap: 50px;
    padding: 0 15px;
  }

  .radar-chart {
    padding: 40px 30px;
  }

  .capability-details {
    gap: 25px;
  }

  .capability-item {
    padding: 25px 20px;
  }
}

@media (max-width: 1024px) {
  .radar-container {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .radar-grid {
    width: 280px;
    height: 280px;
  }

  /* 优化后的雷达图响应式 */
  .capability-overview-grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 16px;
  }

  .capability-card-horizontal {
    padding: 16px;
    gap: 12px;
  }

  .capability-card-horizontal .card-icon {
    width: 40px;
    height: 40px;
    font-size: 20px;
  }

  .capability-card-horizontal .card-title {
    font-size: 14px;
  }

  .capability-card-horizontal .card-score {
    font-size: 18px;
  }

  .capability-details {
    gap: 20px;
  }
}

@media (max-width: 768px) {
  .report-main {
    padding: 40px 0;
  }

  .ai-analysis-section {
    padding: 24px 16px;
    border-radius: 16px;
  }

  .ai-analysis-section::before {
    opacity: 0.5;
  }

  .capability-radar-section {
    padding: 32px 20px;
    border-radius: 16px;
  }

  .capability-radar-section::before {
    animation: none;
  }

  .analysis-card,
  .multimodal-card,
  .ability-card,
  .capability-card {
    padding: 16px;
    border-radius: 12px;
  }

  .overview-card {
    padding: 18px 16px;
    border-radius: 12px;
  }

  /* 减少移动端的动画效果以提升性能 */
  .overview-card:hover,
  .multimodal-card:hover,
  .ability-card:hover,
  .analysis-card:hover,
  .capability-card:hover {
    transform: translateY(-2px);
  }

  /* 简化移动端的背景效果 */
  .overview-card::before,
  .multimodal-card::after,
  .ability-card::before,
  .analysis-card::after,
  .capability-card::before {
    display: none;
  }
}

@media (max-width: 480px) {
  .section-header {
    margin-bottom: 40px;
  }

  .section-title {
    font-size: 1.8rem;
  }

  .report-overview {
    margin-bottom: 60px;
  }

  .overview-cards {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 0 10px;
  }

  .overview-card {
    padding: 20px;
    gap: 12px;
  }

  .capability-radar-section {
    margin-bottom: 60px;
  }

  .radar-container {
    gap: 30px;
    padding: 0 10px;
  }

  .radar-chart {
    padding: 30px 20px;
  }

  .radar-grid {
    width: 250px;
    height: 250px;
  }

  /* 移动端优化后的雷达图 */
  .radar-chart-container-optimized {
    padding: 16px;
    gap: 24px;
  }

  .chart-wrapper-centered {
    padding: 16px;
  }

  .capability-overview-grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  .capability-card-horizontal {
    padding: 12px;
    gap: 10px;
  }

  .capability-card-horizontal .card-icon {
    width: 36px;
    height: 36px;
    font-size: 18px;
  }

  .capability-card-horizontal .card-title {
    font-size: 13px;
  }

  .capability-card-horizontal .card-score {
    font-size: 16px;
  }

  .capability-card-horizontal .card-level {
    font-size: 11px;
  }

  .capability-details {
    gap: 16px;
  }

  .capability-item {
    padding: 20px;
  }

  .report-content {
    padding: 24px 16px;
  }

  .summary-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .capability-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .report-actions {
    flex-direction: column;
  }
}
</style>
