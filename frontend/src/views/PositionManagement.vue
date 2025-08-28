<template>
  <div class="position-management-enhanced">
    <!-- 页面头部 - 优化版 -->
    <div class="page-header-enhanced">
      <div class="header-content-grid">
        <div class="header-left-section">
          <el-button @click="goBack" link class="back-btn-enhanced">
            <el-icon><ArrowLeft /></el-icon>
            返回
          </el-button>
          <div class="page-title-enhanced">
            <h1>职位管理中心</h1>
            <p>基于iFlytek星火大模型的智能招聘管理系统</p>
          </div>
        </div>
        <div class="header-actions-enhanced">
          <el-button @click="exportPositions" class="action-btn">
            <el-icon><Document /></el-icon>
            导出职位
          </el-button>
          <el-button @click="openAIAssistant" type="info" class="action-btn">
            <el-icon><VideoCamera /></el-icon>
            AI助手
          </el-button>
          <el-button @click="createBatchInterview" type="success" class="action-btn">
            <el-icon><User /></el-icon>
            批量面试
          </el-button>
          <el-button @click="showBatchImportDialog = true" type="warning" class="action-btn">
            <el-icon><Upload /></el-icon>
            批量导入
          </el-button>
          <el-button
            type="primary"
            :icon="Plus"
            @click="createPosition"
            :disabled="false"
            class="primary-action-btn"
          >
            新增职位
          </el-button>
        </div>
      </div>
    </div>

    <!-- 统计卡片区域 - 增强版 -->
    <div class="stats-section-enhanced">
      <div class="stats-grid">
        <!-- 活跃职位卡片 -->
        <el-card
          class="stats-card-enhanced clickable-card"
          @click="handleStatsCardClick('active')"
          :class="{ 'active-filter': activeStatsFilter === 'active' }"
          shadow="hover"
        >
          <div class="stats-content-enhanced">
            <div class="stats-icon-enhanced active-icon">
              <el-icon><Setting /></el-icon>
            </div>
            <div class="stats-info-enhanced">
              <div class="stats-number-enhanced">{{ stats.activePositions }}</div>
              <div class="stats-label-enhanced">活跃职位</div>
              <div class="stats-trend-enhanced positive">
                <el-icon><TrendCharts /></el-icon>
                <span>+{{ stats.activeGrowth }}%</span>
                <span class="trend-period-enhanced">较上月</span>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 总职位数卡片 -->
        <el-card
          class="stats-card-enhanced clickable-card"
          @click="handleStatsCardClick('total')"
          :class="{ 'active-filter': activeStatsFilter === 'total' }"
          shadow="hover"
        >
          <div class="stats-content-enhanced">
            <div class="stats-icon-enhanced total-icon">
              <el-icon><Collection /></el-icon>
            </div>
            <div class="stats-info-enhanced">
              <div class="stats-number-enhanced">{{ stats.totalPositions }}</div>
              <div class="stats-label-enhanced">总职位数</div>
              <div class="stats-trend-enhanced positive">
                <el-icon><TrendCharts /></el-icon>
                <span>+{{ stats.totalGrowth }}%</span>
                <span class="trend-period-enhanced">较上月</span>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 紧急招聘卡片 -->
        <el-card
          class="stats-card-enhanced clickable-card"
          @click="handleStatsCardClick('urgent')"
          :class="{ 'active-filter': activeStatsFilter === 'urgent' }"
          shadow="hover"
        >
          <div class="stats-content-enhanced">
            <div class="stats-icon-enhanced urgent-icon">
              <el-icon><Warning /></el-icon>
            </div>
            <div class="stats-info-enhanced">
              <div class="stats-number-enhanced">{{ stats.urgentPositions }}</div>
              <div class="stats-label-enhanced">紧急招聘</div>
              <div class="stats-trend-enhanced negative">
                <el-icon><TrendCharts /></el-icon>
                <span>{{ stats.urgentChange }}%</span>
                <span class="trend-period-enhanced">较上月</span>
              </div>
            </div>
          </div>
        </el-card>

        <!-- 招聘周期卡片 -->
        <el-card
          class="stats-card-enhanced clickable-card"
          @click="handleStatsCardClick('cycle')"
          :class="{ 'active-filter': activeStatsFilter === 'cycle' }"
          shadow="hover"
        >
          <div class="stats-content-enhanced">
            <div class="stats-icon-enhanced cycle-icon">
              <el-icon><Timer /></el-icon>
            </div>
            <div class="stats-info-enhanced">
              <div class="stats-number-enhanced">{{ stats.avgRecruitCycle }}</div>
              <div class="stats-label-enhanced">平均招聘周期(天)</div>
              <div class="stats-trend-enhanced positive">
                <el-icon><TrendCharts /></el-icon>
                <span>-{{ stats.cycleImprovement }}%</span>
                <span class="trend-period-enhanced">较上月</span>
              </div>
            </div>
          </div>
        </el-card>
      </div>
    </div>

    <!-- 搜索和筛选区域 - 增强版 -->
    <div class="search-section-enhanced">
      <el-card class="search-card-enhanced" shadow="never">
        <div class="search-content-enhanced">
          <div class="search-row-primary">
            <!-- 智能搜索框 -->
            <div class="search-input-enhanced">
              <el-input
                v-model="searchQuery"
                placeholder="🔍 智能搜索职位名称、技能要求、工作描述..."
                :prefix-icon="Search"
                clearable
                size="large"
                class="smart-search-input"
                @input="handleSearchInput"
                :loading="isSearching"
              >
                <template #suffix>
                  <div class="search-suffix-actions">
                    <el-button
                      @click="triggerAISearch"
                      link
                      class="ai-search-btn"
                      title="AI智能搜索"
                    >
                      <el-icon><Search /></el-icon>
                    </el-button>
                  </div>
                </template>
              </el-input>

              <!-- 搜索建议下拉 -->
              <div v-if="searchSuggestions.length > 0" class="search-suggestions">
                <div
                  v-for="suggestion in searchSuggestions"
                  :key="suggestion.text"
                  class="suggestion-item"
                  @click="selectSuggestion(suggestion)"
                >
                  <el-icon><component :is="suggestion.icon" /></el-icon>
                  <span>{{ suggestion.text }}</span>
                  <span class="suggestion-type">{{ suggestion.type }}</span>
                </div>
              </div>
            </div>

            <!-- 快速筛选器 -->
            <div class="quick-filters-enhanced">
              <el-select
                v-model="filterDomain"
                placeholder="技术领域"
                clearable
                class="filter-select-enhanced"
                @change="handleFilterChange"
              >
                <el-option label="全部领域" value="" />
                <el-option label="AI算法" value="ai" />
                <el-option label="大数据" value="bigdata" />
                <el-option label="物联网" value="iot" />
                <el-option label="前端开发" value="frontend" />
                <el-option label="后端开发" value="backend" />
              </el-select>

              <el-select
                v-model="filterLevel"
                placeholder="职位级别"
                clearable
                class="filter-select-enhanced"
                @change="handleFilterChange"
              >
                <el-option label="全部级别" value="" />
                <el-option label="实习生" value="intern" />
                <el-option label="初级" value="junior" />
                <el-option label="中级" value="middle" />
                <el-option label="高级" value="senior" />
                <el-option label="专家" value="expert" />
              </el-select>

              <el-select
                v-model="filterStatus"
                placeholder="职位状态"
                clearable
                class="filter-select-enhanced"
                @change="handleFilterChange"
              >
                <el-option label="全部状态" value="" />
                <el-option label="活跃招聘" value="active" />
                <el-option label="暂停招聘" value="paused" />
                <el-option label="已关闭" value="closed" />
                <el-option label="待审核" value="pending" />
              </el-select>

              <!-- 高级筛选和AI助手 -->
              <div class="action-buttons-enhanced">
                <el-button
                  :icon="Search"
                  @click="toggleAdvancedFilter"
                  :type="showAdvancedFilter ? 'primary' : 'default'"
                  class="filter-btn-enhanced"
                >
                  高级筛选
                </el-button>
                <el-button
                  :icon="Setting"
                  @click="openAIFilterAssistant"
                  type="info"
                  class="ai-filter-btn-enhanced"
                  :loading="aiFilterAssistantOpen"
                >
                  AI筛选
                </el-button>
              </div>
            </div>
          </div>

          <!-- AI智能推荐区域 -->
          <div class="ai-recommendations-section">
            <div class="recommendations-header">
              <el-icon><Star /></el-icon>
              <span>AI智能推荐</span>
              <el-button
                size="small"
                type="primary"
                @click="generateSmartRecommendations"
                style="margin-left: 10px;"
              >
                刷新推荐
              </el-button>
            </div>
            <div v-if="smartRecommendations.length > 0" class="recommendations-list">
              <el-tag
                v-for="recommendation in smartRecommendations"
                :key="recommendation.id"
                :type="recommendation.type || 'info'"
                class="recommendation-tag"
                @click="applyRecommendation(recommendation)"
              >
                {{ recommendation.text }}
              </el-tag>
            </div>
            <div v-else class="no-recommendations">
              <p style="color: #999; font-style: italic;">暂无智能推荐，点击"刷新推荐"获取建议</p>
            </div>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 工具栏区域 - 增强版 -->
    <div class="toolbar-section-enhanced">
      <el-card class="toolbar-card-enhanced" shadow="never">
        <div class="toolbar-content-enhanced">
          <div class="toolbar-left-enhanced">
            <el-button-group class="view-toggle-enhanced">
              <el-button
                :type="viewMode === 'table' ? 'primary' : 'default'"
                :icon="Menu"
                @click="viewMode = 'table'"
                class="view-btn-enhanced"
              >
                列表视图
              </el-button>
              <el-button
                :type="viewMode === 'card' ? 'primary' : 'default'"
                :icon="Grid"
                @click="viewMode = 'card'"
                class="view-btn-enhanced"
              >
                卡片视图
              </el-button>
            </el-button-group>
          </div>

          <div class="toolbar-right-enhanced">
            <el-dropdown @command="handleBatchAction" v-if="selectedPositions.length > 0">
              <el-button type="warning" class="batch-btn-enhanced">
                批量操作({{ selectedPositions.length }})
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="delete">批量删除</el-dropdown-item>
                  <el-dropdown-item command="activate">批量激活</el-dropdown-item>
                  <el-dropdown-item command="pause">批量暂停</el-dropdown-item>
                  <el-dropdown-item command="urgent">设为紧急</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 高级筛选面板 - 增强版 -->
    <div v-show="showAdvancedFilter" class="advanced-filter-section-enhanced">
      <el-card class="advanced-filter-card-enhanced" shadow="never">
        <!-- 高级筛选面板 -->
        <div v-show="showAdvancedFilter" class="advanced-filter">
          <el-divider />
          <el-row :gutter="16">
            <el-col :span="6">
              <el-select v-model="filterSalaryRange" placeholder="薪资范围" clearable>
                <el-option label="全部" value="" />
                <el-option label="5K-10K" value="5-10" />
                <el-option label="10K-20K" value="10-20" />
                <el-option label="20K-30K" value="20-30" />
                <el-option label="30K以上" value="30+" />
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="filterLocation" placeholder="工作地点" clearable>
                <el-option label="全部" value="" />
                <el-option label="北京" value="beijing" />
                <el-option label="上海" value="shanghai" />
                <el-option label="深圳" value="shenzhen" />
                <el-option label="杭州" value="hangzhou" />
                <el-option label="广州" value="guangzhou" />
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-select v-model="filterUrgent" placeholder="紧急程度" clearable>
                <el-option label="全部" value="" />
                <el-option label="紧急招聘" :value="true" />
                <el-option label="常规招聘" :value="false" />
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-date-picker
                v-model="filterDateRange"
                type="daterange"
                range-separator="至"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                format="YYYY-MM-DD"
                value-format="YYYY-MM-DD"
                clearable
              />
            </el-col>
          </el-row>
          <div class="filter-actions">
            <el-button @click="resetFilters" :icon="Delete">重置筛选</el-button>
            <el-button type="primary" @click="saveFilterPreset" :icon="Setting">保存筛选</el-button>
            <el-dropdown @command="loadFilterPreset" v-if="filterPresets.length > 0">
              <el-button>
                常用筛选
                <el-icon class="el-icon--right"><ArrowDown /></el-icon>
              </el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="preset in filterPresets"
                    :key="preset.id"
                    :command="preset.id"
                  >
                    {{ preset.name }}
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-card>
    </div>

    <!-- 职位列表 -->
    <div class="positions-section">
      <el-card>
        <template #header>
          <div class="card-header">
            <span>职位列表 ({{ filteredPositions.length }})</span>
            <div class="header-actions">
              <el-button-group>
                <el-button :type="viewMode === 'table' ? 'primary' : ''" @click="viewMode = 'table'">
                  <el-icon><Menu /></el-icon>
                </el-button>
                <el-button :type="viewMode === 'card' ? 'primary' : ''" @click="viewMode = 'card'">
                  <el-icon><Grid /></el-icon>
                </el-button>
              </el-button-group>
            </div>
          </div>
        </template>

        <!-- 表格视图 -->
        <div v-if="viewMode === 'table'">
          <el-table
            :data="paginatedPositions"
            style="width: 100%"
            @selection-change="handleSelectionChange"
            row-key="id"
          >
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="职位名称" width="200">
              <template #default="scope">
                <div class="position-name">
                  <strong>{{ scope.row.name }}</strong>
                  <el-tag v-if="scope.row.urgent" type="danger" size="small">紧急</el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="domain" label="技术领域" width="120">
              <template #default="scope">
                <el-tag :color="getDomainColor(scope.row.domain)">
                  {{ getDomainLabel(scope.row.domain) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="level" label="级别" width="100">
              <template #default="scope">
                <el-tag :type="getLevelType(scope.row.level)">
                  {{ getLevelLabel(scope.row.level) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="状态" width="100">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">
                  {{ getStatusLabel(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column prop="candidates" label="候选人" width="100" />
            <el-table-column prop="interviews" label="面试数" width="100" />
            <el-table-column prop="createdAt" label="创建时间" width="120" />
            <el-table-column label="操作" width="240">
              <template #default="scope">
                <el-button size="small" :icon="View" @click="showPositionDetail(scope.row)">
                  预览
                </el-button>
                <el-button size="small" :icon="Edit" @click="editPosition(scope.row)">
                  编辑
                </el-button>
                <el-dropdown @command="handlePositionAction">
                  <el-button size="small">
                    更多<el-icon class="el-icon--right"><ArrowDown /></el-icon>
                  </el-button>
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item :command="{action: 'duplicate', position: scope.row}">
                        <el-icon><Document /></el-icon>
                        复制职位
                      </el-dropdown-item>
                      <el-dropdown-item :command="{action: 'pause', position: scope.row}">
                        <el-icon><Clock /></el-icon>
                        暂停招聘
                      </el-dropdown-item>
                      <el-dropdown-item :command="{action: 'urgent', position: scope.row}">
                        <el-icon><Warning /></el-icon>
                        设为紧急
                      </el-dropdown-item>
                      <el-dropdown-item :command="{action: 'delete', position: scope.row}" divided>
                        <el-icon><Delete /></el-icon>
                        删除职位
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <!-- 卡片视图 -->
        <div v-else class="positions-grid">
          <el-row :gutter="24">
            <el-col :span="8" v-for="position in paginatedPositions" :key="position.id">
              <el-card class="position-card" @click="showPositionDetail(position)">
                <div class="position-header">
                  <div class="position-title">
                    <h4>{{ position.name }}</h4>
                    <el-tag v-if="position.urgent" type="danger" size="small">紧急</el-tag>
                  </div>
                  <div class="position-status">
                    <el-tag :type="getStatusType(position.status)">
                      {{ getStatusLabel(position.status) }}
                    </el-tag>
                  </div>
                </div>
                
                <div class="position-info">
                  <div class="info-item">
                    <span class="label">技术领域：</span>
                    <el-tag :color="getDomainColor(position.domain)" size="small">
                      {{ getDomainLabel(position.domain) }}
                    </el-tag>
                  </div>
                  <div class="info-item">
                    <span class="label">职位级别：</span>
                    <el-tag :type="getLevelType(position.level)" size="small">
                      {{ getLevelLabel(position.level) }}
                    </el-tag>
                  </div>
                  <div class="info-item">
                    <span class="label">候选人数：</span>
                    <span class="value">{{ position.candidates }}</span>
                  </div>
                  <div class="info-item">
                    <span class="label">面试数量：</span>
                    <span class="value">{{ position.interviews }}</span>
                  </div>
                </div>
                
                <div class="position-actions">
                  <el-button size="small" @click.stop="editPosition(position)">编辑</el-button>
                  <el-button size="small" type="primary" @click.stop="showPositionDetail(position)">
                    查看详情
                  </el-button>
                </div>
              </el-card>
            </el-col>
          </el-row>
        </div>

        <!-- 分页 -->
        <div class="pagination-section">
          <el-pagination
            v-model:current-page="currentPage"
            v-model:page-size="pageSize"
            :page-sizes="[10, 20, 50, 100]"
            :total="filteredPositions.length"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
          />
        </div>
      </el-card>
    </div>

    <!-- 创建/编辑职位对话框 -->
    <el-dialog v-model="showPositionDialog" :title="editingPosition ? '编辑职位' : '创建职位'" width="600px">
      <el-form :model="positionForm" :rules="positionRules" ref="positionFormRef" label-width="100px">
        <el-form-item label="职位名称" prop="name">
          <el-input v-model="positionForm.name" placeholder="请输入职位名称" />
        </el-form-item>
        <el-form-item label="技术领域" prop="domain">
          <el-select v-model="positionForm.domain" placeholder="选择技术领域" style="width: 100%">
            <el-option label="AI技术" value="ai" />
            <el-option label="大数据" value="bigdata" />
            <el-option label="IoT物联网" value="iot" />
          </el-select>
        </el-form-item>
        <el-form-item label="职位级别" prop="level">
          <el-select v-model="positionForm.level" placeholder="选择职位级别" style="width: 100%">
            <el-option label="初级" value="junior" />
            <el-option label="中级" value="middle" />
            <el-option label="高级" value="senior" />
            <el-option label="专家" value="expert" />
          </el-select>
        </el-form-item>
        <el-form-item label="职位状态" prop="status">
          <el-select v-model="positionForm.status" placeholder="选择职位状态" style="width: 100%">
            <el-option label="招聘中" value="active" />
            <el-option label="暂停" value="paused" />
            <el-option label="已关闭" value="closed" />
          </el-select>
        </el-form-item>
        <el-form-item label="紧急招聘">
          <el-switch v-model="positionForm.urgent" />
        </el-form-item>
        <el-form-item label="职位描述">
          <el-input
            v-model="positionForm.description"
            type="textarea"
            :rows="4"
            placeholder="请输入职位描述"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showPositionDialog = false">取消</el-button>
        <el-button type="primary" @click="savePosition" :loading="saving">
          {{ editingPosition ? '更新' : '创建' }}
        </el-button>
      </template>
    </el-dialog>

    <!-- 职位详情预览对话框 -->
    <el-dialog v-model="showDetailDialog" :title="detailPosition?.name || '职位详情'" width="800px">
      <div v-if="detailPosition" class="position-detail">
        <el-row :gutter="24">
          <el-col :span="16">
            <div class="detail-section">
              <h3>基本信息</h3>
              <el-descriptions :column="2" border>
                <el-descriptions-item label="职位名称">
                  {{ detailPosition.name }}
                </el-descriptions-item>
                <el-descriptions-item label="技术领域">
                  <el-tag :color="getDomainColor(detailPosition.domain)">
                    {{ getDomainLabel(detailPosition.domain) }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="职位级别">
                  <el-tag :type="getLevelType(detailPosition.level)">
                    {{ getLevelLabel(detailPosition.level) }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="职位状态">
                  <el-tag :type="getStatusType(detailPosition.status)">
                    {{ getStatusLabel(detailPosition.status) }}
                  </el-tag>
                </el-descriptions-item>
                <el-descriptions-item label="紧急程度">
                  <el-tag v-if="detailPosition.urgent" type="danger">紧急招聘</el-tag>
                  <span v-else>常规招聘</span>
                </el-descriptions-item>
                <el-descriptions-item label="创建时间">
                  {{ detailPosition.createdAt }}
                </el-descriptions-item>
              </el-descriptions>
            </div>

            <div class="detail-section">
              <h3>职位描述</h3>
              <div class="position-description">
                {{ detailPosition.description || '暂无描述' }}
              </div>
            </div>
          </el-col>

          <el-col :span="8">
            <div class="detail-section">
              <h3>招聘数据</h3>
              <div class="stats-grid">
                <div class="stat-item">
                  <div class="stat-number">{{ detailPosition.candidates }}</div>
                  <div class="stat-label">候选人数</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">{{ detailPosition.interviews }}</div>
                  <div class="stat-label">面试数量</div>
                </div>
                <div class="stat-item">
                  <div class="stat-number">{{ Math.round(detailPosition.interviews / detailPosition.candidates * 100) || 0 }}%</div>
                  <div class="stat-label">面试转化率</div>
                </div>
              </div>
            </div>

            <div class="detail-section">
              <h3>快速操作</h3>
              <div class="quick-actions">
                <el-button type="primary" :icon="Edit" @click="editPosition(detailPosition)">
                  编辑职位
                </el-button>
                <el-button :icon="Document" @click="duplicatePosition(detailPosition)">
                  复制职位
                </el-button>
                <el-button
                  v-if="detailPosition.status === 'active'"
                  :icon="Clock"
                  @click="pausePosition(detailPosition)"
                >
                  暂停招聘
                </el-button>
                <el-button
                  v-else-if="detailPosition.status === 'paused'"
                  :icon="VideoCamera"
                  @click="activatePosition(detailPosition)"
                >
                  恢复招聘
                </el-button>
                <el-button
                  type="danger"
                  :icon="Delete"
                  @click="deletePosition(detailPosition)"
                >
                  删除职位
                </el-button>
              </div>
            </div>
          </el-col>
        </el-row>
      </div>
      <template #footer>
        <el-button @click="showDetailDialog = false">关闭</el-button>
      </template>
    </el-dialog>

    <!-- 数据可视化板块 -->
    <div class="charts-section">
      <el-row :gutter="24">
        <el-col :span="12">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>职位分布统计</span>
                <el-button-group size="small">
                  <el-button
                    :type="chartType === 'domain' ? 'primary' : ''"
                    @click="chartType = 'domain'"
                  >
                    技术领域
                  </el-button>
                  <el-button
                    :type="chartType === 'level' ? 'primary' : ''"
                    @click="chartType = 'level'"
                  >
                    职位级别
                  </el-button>
                  <el-button
                    :type="chartType === 'status' ? 'primary' : ''"
                    @click="chartType = 'status'"
                  >
                    职位状态
                  </el-button>
                </el-button-group>
              </div>
            </template>
            <div ref="pieChartRef" class="chart-container" v-show="!chartsLoading && !chartsError"></div>
            <div v-if="chartsLoading" class="chart-loading">
              <el-icon class="is-loading"><Loading /></el-icon>
              <span style="margin-left: 8px;">图表加载中...</span>
            </div>
            <div v-if="chartsError" class="chart-empty">
              <el-icon><Warning /></el-icon>
              <span>图表加载失败</span>
              <el-button size="small" @click="initPieChart" style="margin-top: 8px;">重试</el-button>
            </div>
          </el-card>
        </el-col>

        <el-col :span="12">
          <el-card>
            <template #header>
              <span>招聘漏斗分析</span>
            </template>
            <div ref="funnelChartRef" class="chart-container" v-show="!chartsLoading && !chartsError"></div>
            <div v-if="chartsLoading" class="chart-loading">
              <el-icon class="is-loading"><Loading /></el-icon>
              <span style="margin-left: 8px;">图表加载中...</span>
            </div>
            <div v-if="chartsError" class="chart-empty">
              <el-icon><Warning /></el-icon>
              <span>图表加载失败</span>
              <el-button size="small" @click="initFunnelChart" style="margin-top: 8px;">重试</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>

      <el-row :gutter="24" style="margin-top: 24px;">
        <el-col :span="24">
          <el-card>
            <template #header>
              <div class="card-header">
                <span>时间趋势分析</span>
                <el-button-group size="small">
                  <el-button
                    :type="trendType === 'positions' ? 'primary' : ''"
                    @click="trendType = 'positions'"
                  >
                    职位发布
                  </el-button>
                  <el-button
                    :type="trendType === 'candidates' ? 'primary' : ''"
                    @click="trendType = 'candidates'"
                  >
                    候选人数
                  </el-button>
                  <el-button
                    :type="trendType === 'interviews' ? 'primary' : ''"
                    @click="trendType = 'interviews'"
                  >
                    面试数量
                  </el-button>
                </el-button-group>
              </div>
            </template>
            <div ref="lineChartRef" class="chart-container-large" v-show="!chartsLoading && !chartsError"></div>
            <div v-if="chartsLoading" class="chart-loading">
              <el-icon class="is-loading"><Loading /></el-icon>
              <span style="margin-left: 8px;">图表加载中...</span>
            </div>
            <div v-if="chartsError" class="chart-empty">
              <el-icon><Warning /></el-icon>
              <span>图表加载失败</span>
              <el-button size="small" @click="initLineChart" style="margin-top: 8px;">重试</el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

    <!-- 导出格式选择对话框 -->
    <el-dialog v-model="showExportDialog" title="导出职位数据" width="400px">
      <div class="export-options">
        <div class="export-info">
          <p>即将导出 <strong>{{ filteredPositions.length }}</strong> 条职位数据</p>
          <p class="export-note">请选择导出格式：</p>
        </div>

        <!-- 完全重写的导出格式选择 - 避免Element Plus单选按钮重叠问题 -->
        <div class="custom-export-format-group">
          <div
            class="custom-format-option"
            :class="{ 'selected': exportFormat === 'excel' }"
            @click="exportFormat = 'excel'"
            style="position: relative; display: flex; align-items: center; gap: 20px; padding: 24px; border: 2px solid #e5e7eb; border-radius: 12px; min-height: 90px; background: #ffffff; cursor: pointer; transition: all 0.3s ease; margin-bottom: 16px;"
          >
            <!-- 自定义单选按钮指示器 -->
            <div
              class="custom-radio-indicator"
              :style="{
                position: 'absolute',
                top: '24px',
                left: '24px',
                width: '16px',
                height: '16px',
                border: exportFormat === 'excel' ? '2px solid #0066cc' : '2px solid #d1d5db',
                borderRadius: '50%',
                background: exportFormat === 'excel' ? '#0066cc' : '#ffffff',
                boxShadow: exportFormat === 'excel' ? 'inset 0 0 0 3px #ffffff' : 'none',
                transition: 'all 0.3s ease',
                zIndex: '10'
              }"
            ></div>

            <div class="format-icon excel" style="margin-left: 40px; width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 28px; color: white; flex-shrink: 0; background: linear-gradient(135deg, #059669, #10b981);">
              <el-icon><Document /></el-icon>
            </div>
            <div class="format-info" style="flex: 1; min-width: 0; padding-left: 16px;">
              <div class="format-name" style="font-size: 17px; font-weight: 600; color: #1f2937; margin-bottom: 8px; line-height: 1.4;">Excel 格式</div>
              <div class="format-desc" style="font-size: 14px; color: #6b7280; line-height: 1.5;">适合数据分析和编辑 (.xls)</div>
            </div>
          </div>

          <div
            class="custom-format-option"
            :class="{ 'selected': exportFormat === 'csv' }"
            @click="exportFormat = 'csv'"
            style="position: relative; display: flex; align-items: center; gap: 20px; padding: 24px; border: 2px solid #e5e7eb; border-radius: 12px; min-height: 90px; background: #ffffff; cursor: pointer; transition: all 0.3s ease; margin-bottom: 16px;"
          >
            <!-- 自定义单选按钮指示器 -->
            <div
              class="custom-radio-indicator"
              :style="{
                position: 'absolute',
                top: '24px',
                left: '24px',
                width: '16px',
                height: '16px',
                border: exportFormat === 'csv' ? '2px solid #0066cc' : '2px solid #d1d5db',
                borderRadius: '50%',
                background: exportFormat === 'csv' ? '#0066cc' : '#ffffff',
                boxShadow: exportFormat === 'csv' ? 'inset 0 0 0 3px #ffffff' : 'none',
                transition: 'all 0.3s ease',
                zIndex: '10'
              }"
            ></div>

            <div class="format-icon csv" style="margin-left: 40px; width: 56px; height: 56px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 28px; color: white; flex-shrink: 0; background: linear-gradient(135deg, #0066cc, #4c51bf);">
              <el-icon><Document /></el-icon>
            </div>
            <div class="format-info" style="flex: 1; min-width: 0; padding-left: 16px;">
              <div class="format-name" style="font-size: 17px; font-weight: 600; color: #1f2937; margin-bottom: 8px; line-height: 1.4;">CSV 格式</div>
              <div class="format-desc" style="font-size: 14px; color: #6b7280; line-height: 1.5;">通用格式，兼容性好 (.csv)</div>
            </div>
          </div>
        </div>

        <div class="export-settings">
          <el-checkbox v-model="includeDescription">包含职位描述</el-checkbox>
          <el-checkbox v-model="includeTimestamp">文件名包含时间戳</el-checkbox>
        </div>
      </div>

      <template #footer>
        <el-button @click="showExportDialog = false">取消</el-button>
        <el-button type="primary" @click="confirmExport" :loading="exporting">
          <el-icon><Document /></el-icon>
          开始导出
        </el-button>
      </template>
    </el-dialog>

    <!-- 批量导入对话框 -->
    <el-dialog v-model="showBatchImportDialog" title="批量导入职位" width="700px" :close-on-click-modal="false">
      <div class="batch-import-content">
        <!-- 步骤指示器 -->
        <el-steps :active="importStep" finish-status="success" align-center style="margin-bottom: 30px;">
          <el-step title="选择文件" description="上传Excel或CSV文件" />
          <el-step title="数据预览" description="确认导入数据" />
          <el-step title="导入完成" description="查看导入结果" />
        </el-steps>

        <!-- 步骤1: 文件上传 -->
        <div v-if="importStep === 0" class="import-step-content">
          <div class="upload-area">
            <el-upload
              ref="uploadRef"
              class="upload-dragger"
              drag
              :auto-upload="false"
              :on-change="handleFileChange"
              :before-upload="beforeUpload"
              accept=".xlsx,.xls,.csv"
              :limit="1"
              :on-exceed="handleExceed"
            >
              <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  支持 .xlsx、.xls、.csv 格式，文件大小不超过 10MB
                </div>
              </template>
            </el-upload>
          </div>

          <div class="template-download">
            <el-divider>或</el-divider>
            <div class="template-section">
              <h4>下载导入模板</h4>
              <p>如果您是首次使用批量导入功能，建议先下载模板文件</p>
              <el-button type="primary" plain @click="downloadTemplate">
                <el-icon><Download /></el-icon>
                下载Excel模板
              </el-button>
            </div>
          </div>
        </div>

        <!-- 步骤2: 数据预览 -->
        <div v-if="importStep === 1" class="import-step-content">
          <div class="preview-header">
            <h4>数据预览 (共 {{ previewData.length }} 条记录)</h4>
            <el-tag v-if="validationErrors.length > 0" type="warning">
              发现 {{ validationErrors.length }} 个问题
            </el-tag>
          </div>

          <!-- 验证错误提示 -->
          <el-alert
            v-if="validationErrors.length > 0"
            title="数据验证问题"
            type="warning"
            :closable="false"
            style="margin-bottom: 16px;"
          >
            <ul style="margin: 8px 0; padding-left: 20px;">
              <li v-for="error in validationErrors.slice(0, 5)" :key="error">{{ error }}</li>
              <li v-if="validationErrors.length > 5">
                还有 {{ validationErrors.length - 5 }} 个问题...
              </li>
            </ul>
          </el-alert>

          <!-- 数据预览表格 -->
          <el-table :data="previewData.slice(0, 10)" border style="width: 100%" max-height="300">
            <el-table-column prop="name" label="职位名称" width="150" />
            <el-table-column prop="domain" label="技术领域" width="100" />
            <el-table-column prop="level" label="职位级别" width="100" />
            <el-table-column prop="location" label="工作地点" width="120" />
            <el-table-column prop="salary" label="薪资范围" width="120" />
            <el-table-column prop="status" label="状态" width="80" />
          </el-table>

          <div v-if="previewData.length > 10" style="text-align: center; margin-top: 16px; color: #666;">
            仅显示前10条记录，实际将导入 {{ previewData.length }} 条记录
          </div>
        </div>

        <!-- 步骤3: 导入结果 -->
        <div v-if="importStep === 2" class="import-step-content">
          <div class="import-result">
            <el-result
              :icon="importResult.success ? 'success' : 'warning'"
              :title="importResult.title"
              :sub-title="importResult.message"
            >
              <template #extra>
                <div class="result-stats">
                  <el-statistic title="成功导入" :value="importResult.successCount" />
                  <el-statistic title="失败记录" :value="importResult.failureCount" />
                  <el-statistic title="总计记录" :value="importResult.totalCount" />
                </div>

                <div v-if="importResult.failures.length > 0" style="margin-top: 20px;">
                  <el-button type="warning" plain @click="showFailureDetails = !showFailureDetails">
                    查看失败详情
                  </el-button>
                </div>
              </template>
            </el-result>

            <!-- 失败详情 -->
            <el-collapse v-if="showFailureDetails && importResult.failures.length > 0" style="margin-top: 20px;">
              <el-collapse-item title="失败记录详情" name="failures">
                <el-table :data="importResult.failures" border style="width: 100%">
                  <el-table-column prop="row" label="行号" width="80" />
                  <el-table-column prop="name" label="职位名称" width="150" />
                  <el-table-column prop="error" label="失败原因" />
                </el-table>
              </el-collapse-item>
            </el-collapse>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="dialog-footer">
          <el-button v-if="importStep > 0" @click="prevStep">上一步</el-button>
          <el-button @click="closeBatchImportDialog">
            {{ importStep === 2 ? '完成' : '取消' }}
          </el-button>
          <el-button
            v-if="importStep < 2"
            type="primary"
            @click="nextStep"
            :disabled="!canProceed"
            :loading="importLoading"
          >
            {{ importStep === 0 ? '解析文件' : '开始导入' }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- AI助手对话框 -->
    <el-dialog
      v-model="isAIAssistantOpen"
      title="iFlytek星火AI助手"
      width="800px"
      :close-on-click-modal="false"
      class="ai-assistant-dialog"
    >
      <div class="ai-assistant-content">
        <div class="assistant-header">
          <div class="assistant-avatar">
            <el-icon><VideoCamera /></el-icon>
          </div>
          <div class="assistant-info">
            <h3>iFlytek星火大模型</h3>
            <p>智能招聘管理助手，为您提供专业的职位管理建议</p>
          </div>
          <div class="assistant-status">
            <el-tag :type="iflytekService ? 'success' : 'warning'">
              {{ iflytekService ? '已连接' : '连接中' }}
            </el-tag>
          </div>
        </div>

        <div class="assistant-features">
          <div class="feature-grid">
            <div class="feature-card" @click="requestAIAnalysis('position_trends')">
              <el-icon><TrendCharts /></el-icon>
              <h4>职位趋势分析</h4>
              <p>分析当前职位市场趋势和热门技能需求</p>
            </div>
            <div class="feature-card" @click="requestAIAnalysis('recruitment_optimization')">
              <el-icon><Odometer /></el-icon>
              <h4>招聘效率优化</h4>
              <p>基于数据分析提供招聘流程优化建议</p>
            </div>
            <div class="feature-card" @click="requestAIAnalysis('candidate_matching')">
              <el-icon><User /></el-icon>
              <h4>候选人匹配</h4>
              <p>智能匹配最适合的候选人和职位</p>
            </div>
            <div class="feature-card" @click="requestAIAnalysis('market_insights')">
              <el-icon><Grid /></el-icon>
              <h4>市场洞察</h4>
              <p>获取行业薪资水平和竞争态势分析</p>
            </div>
          </div>
        </div>

        <div v-if="aiAnalysisResults" class="analysis-results">
          <div class="results-header">
            <el-icon><Star /></el-icon>
            <span>AI分析结果</span>
          </div>
          <div class="results-content">
            <div v-if="aiAnalysisResults.summary" class="analysis-summary">
              <h4>分析摘要</h4>
              <p>{{ aiAnalysisResults.summary }}</p>
            </div>

            <div v-if="aiAnalysisResults.insights && aiAnalysisResults.insights.length > 0" class="insights-section">
              <h4>核心洞察</h4>
              <ul class="insights-list">
                <li v-for="(insight, index) in aiAnalysisResults.insights" :key="index">
                  <el-icon><TrendCharts /></el-icon>
                  {{ insight }}
                </li>
              </ul>
            </div>

            <div v-if="aiAnalysisResults.recommendations && aiAnalysisResults.recommendations.length > 0" class="recommendations">
              <h4>智能推荐</h4>
              <div class="recommendations-grid">
                <div v-for="rec in aiAnalysisResults.recommendations" :key="rec.id" class="recommendation-card">
                  <el-icon><Lightning /></el-icon>
                  <span>{{ rec.text }}</span>
                </div>
              </div>
            </div>

            <div v-if="aiAnalysisResults.trends && aiAnalysisResults.trends.length > 0" class="trends-section">
              <h4>市场趋势</h4>
              <div class="trends-list">
                <el-tag v-for="(trend, index) in aiAnalysisResults.trends" :key="index" type="info" class="trend-tag">
                  {{ trend }}
                </el-tag>
              </div>
            </div>

            <div v-if="aiAnalysisResults.predictions" class="predictions-section">
              <h4>预测指标</h4>
              <div class="predictions-grid">
                <div v-for="(value, key) in aiAnalysisResults.predictions" :key="key" class="prediction-item">
                  <span class="prediction-label">{{ getPredictionLabel(key) }}</span>
                  <span class="prediction-value">{{ formatPredictionValue(value) }}</span>
                </div>
              </div>
            </div>

            <!-- 行动项目 -->
            <div v-if="aiAnalysisResults.actionItems && aiAnalysisResults.actionItems.length > 0" class="action-items-section">
              <h4>行动项目</h4>
              <div class="action-items-list">
                <el-tag v-for="(item, index) in aiAnalysisResults.actionItems" :key="index" type="success" class="action-item-tag">
                  <el-icon><CircleCheck /></el-icon>
                  {{ item }}
                </el-tag>
              </div>
            </div>

            <!-- 市场分析（职位趋势分析专用） -->
            <div v-if="aiAnalysisResults.marketAnalysis" class="market-analysis-section">
              <h4>市场分析详情</h4>
              <div class="market-analysis-content">
                <div v-if="aiAnalysisResults.marketAnalysis.hotSkills" class="hot-skills">
                  <h5>热门技能</h5>
                  <el-tag v-for="skill in aiAnalysisResults.marketAnalysis.hotSkills" :key="skill" type="warning" class="skill-tag">
                    {{ skill }}
                  </el-tag>
                </div>
                <div v-if="aiAnalysisResults.marketAnalysis.salaryBenchmarks" class="salary-benchmarks">
                  <h5>薪资基准</h5>
                  <div class="salary-grid">
                    <div v-for="(salary, role) in aiAnalysisResults.marketAnalysis.salaryBenchmarks" :key="role" class="salary-item">
                      <span class="role-name">{{ role }}</span>
                      <span class="salary-range">{{ salary }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 流程优化（招聘效率优化专用） -->
            <div v-if="aiAnalysisResults.processOptimization" class="process-optimization-section">
              <h4>流程优化建议</h4>
              <div class="process-optimization-content">
                <div v-if="aiAnalysisResults.processOptimization.currentBottlenecks" class="bottlenecks">
                  <h5>当前瓶颈</h5>
                  <el-tag v-for="bottleneck in aiAnalysisResults.processOptimization.currentBottlenecks" :key="bottleneck" type="danger" class="bottleneck-tag">
                    {{ bottleneck }}
                  </el-tag>
                </div>
                <div v-if="aiAnalysisResults.processOptimization.quickWins" class="quick-wins">
                  <h5>快速改进</h5>
                  <el-tag v-for="win in aiAnalysisResults.processOptimization.quickWins" :key="win" type="success" class="quick-win-tag">
                    {{ win }}
                  </el-tag>
                </div>
                <div v-if="aiAnalysisResults.processOptimization.costAnalysis" class="cost-analysis">
                  <h5>成本分析</h5>
                  <div class="cost-metrics">
                    <div class="cost-item">
                      <span class="cost-label">当前成本</span>
                      <span class="cost-value">{{ aiAnalysisResults.processOptimization.costAnalysis.currentCost }}</span>
                    </div>
                    <div class="cost-item">
                      <span class="cost-label">优化后成本</span>
                      <span class="cost-value">{{ aiAnalysisResults.processOptimization.costAnalysis.optimizedCost }}</span>
                    </div>
                    <div class="cost-item">
                      <span class="cost-label">预计节省</span>
                      <span class="cost-value savings">{{ aiAnalysisResults.processOptimization.costAnalysis.savings }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 匹配策略（候选人匹配专用） -->
            <div v-if="aiAnalysisResults.matchingStrategies && aiAnalysisResults.matchingStrategies.length > 0" class="matching-strategies-section">
              <h4>匹配策略</h4>
              <div class="strategies-list">
                <div v-for="(strategy, index) in aiAnalysisResults.matchingStrategies" :key="index" class="strategy-item">
                  <el-icon><Connection /></el-icon>
                  <span>{{ strategy }}</span>
                </div>
              </div>
            </div>

            <!-- 详细分析（候选人匹配专用） -->
            <div v-if="aiAnalysisResults.detailedAnalysis" class="detailed-analysis-section">
              <h4>详细分析</h4>
              <div class="detailed-analysis-content">
                <el-collapse>
                  <el-collapse-item v-if="aiAnalysisResults.detailedAnalysis.skillMatching" title="技能匹配分析" name="skills">
                    <div class="analysis-details">
                      <p><strong>技术技能：</strong>{{ aiAnalysisResults.detailedAnalysis.skillMatching.technical }}</p>
                      <p><strong>软技能：</strong>{{ aiAnalysisResults.detailedAnalysis.skillMatching.soft }}</p>
                      <p><strong>领域知识：</strong>{{ aiAnalysisResults.detailedAnalysis.skillMatching.domain }}</p>
                    </div>
                  </el-collapse-item>
                  <el-collapse-item v-if="aiAnalysisResults.detailedAnalysis.performancePrediction" title="绩效预测" name="performance">
                    <div class="analysis-details">
                      <p><strong>准确率：</strong>{{ aiAnalysisResults.detailedAnalysis.performancePrediction.accuracy }}</p>
                      <p><strong>关键因素：</strong>{{ aiAnalysisResults.detailedAnalysis.performancePrediction.factors.join('、') }}</p>
                      <p><strong>改进建议：</strong>{{ aiAnalysisResults.detailedAnalysis.performancePrediction.improvement }}</p>
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </div>
            </div>

            <!-- 行业洞察（市场洞察专用） -->
            <div v-if="aiAnalysisResults.industryInsights" class="industry-insights-section">
              <h4>行业洞察</h4>
              <div class="industry-insights-content">
                <div v-if="aiAnalysisResults.industryInsights.hotSectors" class="hot-sectors">
                  <h5>热门行业</h5>
                  <el-tag v-for="sector in aiAnalysisResults.industryInsights.hotSectors" :key="sector" type="primary" class="sector-tag">
                    {{ sector }}
                  </el-tag>
                </div>
                <div v-if="aiAnalysisResults.industryInsights.salaryTrends" class="salary-trends">
                  <h5>薪资趋势</h5>
                  <div class="salary-trends-grid">
                    <div v-for="(trend, role) in aiAnalysisResults.industryInsights.salaryTrends" :key="role" class="salary-trend-item">
                      <span class="trend-role">{{ role }}</span>
                      <span class="trend-value" :class="{ positive: trend.startsWith('+') }">{{ trend }}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 竞争分析 -->
            <div v-if="aiAnalysisResults.competitiveAnalysis" class="competitive-analysis-section">
              <h4>竞争分析</h4>
              <div class="competitive-analysis-content">
                <div class="position-info">
                  <span class="position-label">市场地位：</span>
                  <el-tag :type="getPositionTagType(aiAnalysisResults.competitiveAnalysis.position)">
                    {{ getPositionText(aiAnalysisResults.competitiveAnalysis.position) }}
                  </el-tag>
                </div>
                <div v-if="aiAnalysisResults.competitiveAnalysis.strengths" class="strengths">
                  <h5>优势</h5>
                  <el-tag v-for="strength in aiAnalysisResults.competitiveAnalysis.strengths" :key="strength" type="success" class="strength-tag">
                    {{ strength }}
                  </el-tag>
                </div>
                <div v-if="aiAnalysisResults.competitiveAnalysis.improvements" class="improvements">
                  <h5>改进方向</h5>
                  <el-tag v-for="improvement in aiAnalysisResults.competitiveAnalysis.improvements" :key="improvement" type="warning" class="improvement-tag">
                    {{ improvement }}
                  </el-tag>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <template #footer>
        <el-button @click="isAIAssistantOpen = false">关闭</el-button>
        <el-button type="primary" @click="refreshAIService">
          <el-icon><Setting /></el-icon>
          刷新服务
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import * as echarts from 'echarts'
import {
  ArrowLeft, Plus, User, Collection, Warning,
  Search, Grid, ArrowDown, Document, TrendCharts,
  Timer, Star, Clock, InfoFilled, Setting, Edit, View,
  Calendar, Loading, VideoCamera,
  Menu, Delete, Sort, Location, Money,
  Rank, CirclePlus, OfficeBuilding, Trophy, Medal,
  Briefcase, Tools, Upload, UploadFilled, Download, Notification,
  Bell, Lightning, Phone, More, Share, Printer, Odometer,
  CircleCheck, Connection
} from '@element-plus/icons-vue'

const router = useRouter()

// 统计数据
const stats = reactive({
  activePositions: 28,
  totalPositions: 156,
  urgentPositions: 5,
  totalCandidates: 2456,
  // 新增统计指标
  activeGrowth: 12.5,
  totalGrowth: 8.3,
  urgentChange: -5.2,
  avgRecruitCycle: 18,
  cycleImprovement: 15.8,
  successRate: 78.5,
  successImprovement: 6.2,
  hotDomain: 'AI算法',
  hotDomainCount: 15,
  pendingReview: 3,
  recruitEfficiency: 85.2,
  efficiencyImprovement: 9.1
})

// 筛选和搜索
const searchQuery = ref('')
const filterStatus = ref('')
const filterDomain = ref('')
const filterLevel = ref('')
const filterSalaryRange = ref('')
const filterLocation = ref('')
const filterUrgent = ref(null)
const filterDateRange = ref(null)
const showAdvancedFilter = ref(false)
const viewMode = ref('table')
const currentPage = ref(1)
const pageSize = ref(20)

// 批量操作
const selectedPositions = ref([])

// 筛选预设
const filterPresets = ref([
  { id: 1, name: '紧急AI职位', filters: { domain: 'ai', urgent: true } },
  { id: 2, name: '高级职位', filters: { level: 'senior' } },
  { id: 3, name: '北京地区', filters: { location: 'beijing' } }
])

// 职位数据
const positions = ref([
  {
    id: 1,
    name: '高级前端工程师',
    domain: 'ai',
    level: 'senior',
    status: 'active',
    urgent: true,
    candidates: 45,
    interviews: 23,
    createdAt: '2024-01-15',
    description: '负责AI产品前端开发'
  },
  {
    id: 2,
    name: '算法工程师',
    domain: 'ai',
    level: 'expert',
    status: 'active',
    urgent: false,
    candidates: 32,
    interviews: 18,
    createdAt: '2024-01-10',
    description: '负责机器学习算法研发'
  },
  {
    id: 3,
    name: '大数据开发工程师',
    domain: 'bigdata',
    level: 'middle',
    status: 'paused',
    urgent: false,
    candidates: 28,
    interviews: 15,
    createdAt: '2024-01-08',
    description: '负责大数据平台开发'
  }
])

// 职位表单
const positionForm = reactive({
  name: '',
  domain: '',
  level: '',
  status: 'active',
  urgent: false,
  description: ''
})

const positionRules = {
  name: [{ required: true, message: '请输入职位名称', trigger: 'blur' }],
  domain: [{ required: true, message: '请选择技术领域', trigger: 'change' }],
  level: [{ required: true, message: '请选择职位级别', trigger: 'change' }],
  status: [{ required: true, message: '请选择职位状态', trigger: 'change' }]
}

// 状态变量
const showPositionDialog = ref(false)
const showDetailDialog = ref(false)
const editingPosition = ref(null)
const detailPosition = ref(null)
const saving = ref(false)
const positionFormRef = ref()

// 导出相关状态
const showExportDialog = ref(false)
const exportFormat = ref('excel')
const includeDescription = ref(true)
const includeTimestamp = ref(true)
const exporting = ref(false)

// 批量导入相关状态
const showBatchImportDialog = ref(false)
const importStep = ref(0)
const importLoading = ref(false)
const uploadRef = ref(null)
const selectedFile = ref(null)
const previewData = ref([])
const validationErrors = ref([])
const importResult = ref({
  success: false,
  title: '',
  message: '',
  successCount: 0,
  failureCount: 0,
  totalCount: 0,
  failures: []
})
const showFailureDetails = ref(false)

// 图表相关状态
const chartType = ref('domain')
const trendType = ref('positions')
const pieChartRef = ref()
const funnelChartRef = ref()
const lineChartRef = ref()
let pieChart = null
let funnelChart = null
let lineChart = null

// 计算属性
const filteredPositions = computed(() => {
  let result = positions.value

  // 搜索筛选
  if (searchQuery.value) {
    result = result.filter(p =>
      p.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      p.description.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  // 状态筛选
  if (filterStatus.value && filterStatus.value !== 'all') {
    result = result.filter(p => p.status === filterStatus.value)
  }

  // 技术领域筛选
  if (filterDomain.value && filterDomain.value !== 'all') {
    result = result.filter(p => p.domain === filterDomain.value)
  }

  // 职位级别筛选
  if (filterLevel.value && filterLevel.value !== 'all') {
    result = result.filter(p => p.level === filterLevel.value)
  }

  // 紧急程度筛选
  if (filterUrgent.value !== null) {
    result = result.filter(p => p.urgent === filterUrgent.value)
  }

  // 日期范围筛选
  if (filterDateRange.value && filterDateRange.value.length === 2) {
    const startDate = new Date(filterDateRange.value[0])
    const endDate = new Date(filterDateRange.value[1])
    result = result.filter(p => {
      const positionDate = new Date(p.createdAt)
      return positionDate >= startDate && positionDate <= endDate
    })
  }

  // 薪资范围筛选（模拟实现）
  if (filterSalaryRange.value) {
    // 实际应用中应该根据真实的薪资字段进行筛选
    // 这里暂时保持所有结果
  }

  // 工作地点筛选（模拟实现）
  if (filterLocation.value) {
    // 实际应用中应该根据真实的地点字段进行筛选
    // 这里暂时保持所有结果
  }

  return result
})

const paginatedPositions = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return filteredPositions.value.slice(start, end)
})

// 辅助工具函数
/**
 * 防抖函数
 */
const debounce = (func, wait) => {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// 批量导入计算属性
const canProceed = computed(() => {
  if (importStep.value === 0) {
    return selectedFile.value !== null
  } else if (importStep.value === 1) {
    return previewData.value.length > 0 && validationErrors.value.length === 0
  }
  return false
})

// 方法
const goBack = () => {
  router.go(-1)
}

const createBatchInterview = () => {
  router.push('/batch-interview-setup')
}

// 批量导入相关方法
const closeBatchImportDialog = () => {
  showBatchImportDialog.value = false
  resetImportState()
}

const resetImportState = () => {
  importStep.value = 0
  importLoading.value = false
  selectedFile.value = null
  previewData.value = []
  validationErrors.value = []
  showFailureDetails.value = false
  importResult.value = {
    success: false,
    title: '',
    message: '',
    successCount: 0,
    failureCount: 0,
    totalCount: 0,
    failures: []
  }
  if (uploadRef.value) {
    uploadRef.value.clearFiles()
  }
}

const handleFileChange = (file) => {
  selectedFile.value = file
  console.log('选择文件:', file.name)
}

const beforeUpload = (file) => {
  const isValidType = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                      'application/vnd.ms-excel',
                      'text/csv'].includes(file.type)
  const isLt10M = file.size / 1024 / 1024 < 10

  if (!isValidType) {
    ElMessage.error('只支持 Excel (.xlsx, .xls) 和 CSV (.csv) 格式的文件!')
    return false
  }
  if (!isLt10M) {
    ElMessage.error('文件大小不能超过 10MB!')
    return false
  }
  return false // 阻止自动上传
}

const handleExceed = () => {
  ElMessage.warning('只能选择一个文件进行导入')
}

const nextStep = async () => {
  if (importStep.value === 0) {
    // 解析文件
    await parseFile()
  } else if (importStep.value === 1) {
    // 开始导入
    await performImport()
  }
}

const prevStep = () => {
  if (importStep.value > 0) {
    importStep.value--
  }
}

const parseFile = async () => {
  if (!selectedFile.value) {
    ElMessage.error('请先选择文件')
    return
  }

  importLoading.value = true
  try {
    const fileData = await readFileContent(selectedFile.value.raw)
    const parsedData = await parseFileData(fileData, selectedFile.value.name)

    previewData.value = parsedData.data
    validationErrors.value = parsedData.errors

    if (parsedData.data.length === 0) {
      ElMessage.error('文件中没有找到有效的职位数据')
      return
    }

    importStep.value = 1
    ElMessage.success(`成功解析 ${parsedData.data.length} 条记录`)

  } catch (error) {
    console.error('文件解析失败:', error)
    ElMessage.error('文件解析失败: ' + error.message)
  } finally {
    importLoading.value = false
  }
}

const readFileContent = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = () => reject(new Error('文件读取失败'))

    if (file.name.endsWith('.csv')) {
      reader.readAsText(file, 'UTF-8')
    } else {
      reader.readAsArrayBuffer(file)
    }
  })
}

const parseFileData = async (fileData, fileName) => {
  const data = []
  const errors = []

  try {
    if (fileName.endsWith('.csv')) {
      // 解析CSV文件
      const lines = fileData.split('\n').filter(line => line.trim())
      if (lines.length < 2) {
        throw new Error('CSV文件格式不正确，至少需要标题行和一行数据')
      }

      const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''))

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''))
        if (values.length >= 6) {
          const position = {
            name: values[0] || '',
            domain: values[1] || '',
            level: values[2] || '',
            location: values[3] || '',
            salary: values[4] || '',
            status: values[5] || 'active'
          }

          const validation = validatePositionData(position, i + 1)
          if (validation.valid) {
            data.push(position)
          } else {
            errors.push(...validation.errors)
          }
        } else {
          errors.push(`第${i + 1}行: 数据列数不足，需要至少6列`)
        }
      }
    } else {
      // 解析Excel文件 (简化版本，实际项目中建议使用xlsx库)
      ElMessage.warning('Excel文件解析功能需要安装xlsx库，当前使用模拟数据')

      // 模拟Excel解析结果
      const mockData = [
        { name: '高级前端工程师', domain: 'ai', level: 'senior', location: '北京', salary: '20-30K', status: 'active' },
        { name: '算法工程师', domain: 'ai', level: 'expert', location: '上海', salary: '25-40K', status: 'active' },
        { name: '大数据开发工程师', domain: 'bigdata', level: 'middle', location: '深圳', salary: '18-25K', status: 'active' }
      ]

      mockData.forEach((position, index) => {
        const validation = validatePositionData(position, index + 1)
        if (validation.valid) {
          data.push(position)
        } else {
          errors.push(...validation.errors)
        }
      })
    }
  } catch (error) {
    throw new Error('文件解析失败: ' + error.message)
  }

  return { data, errors }
}

const validatePositionData = (position, rowNumber) => {
  const errors = []

  if (!position.name || position.name.trim() === '') {
    errors.push(`第${rowNumber}行: 职位名称不能为空`)
  }

  const validDomains = ['ai', 'bigdata', 'iot']
  if (!validDomains.includes(position.domain)) {
    errors.push(`第${rowNumber}行: 技术领域必须是 ${validDomains.join(', ')} 之一`)
  }

  const validLevels = ['junior', 'middle', 'senior', 'expert']
  if (!validLevels.includes(position.level)) {
    errors.push(`第${rowNumber}行: 职位级别必须是 ${validLevels.join(', ')} 之一`)
  }

  const validStatuses = ['active', 'paused', 'closed']
  if (!validStatuses.includes(position.status)) {
    errors.push(`第${rowNumber}行: 职位状态必须是 ${validStatuses.join(', ')} 之一`)
  }

  return {
    valid: errors.length === 0,
    errors
  }
}

const performImport = async () => {
  importLoading.value = true

  try {
    const successfulImports = []
    const failedImports = []

    // 模拟导入过程
    for (let i = 0; i < previewData.value.length; i++) {
      const position = previewData.value[i]

      // 模拟导入延迟
      await new Promise(resolve => setTimeout(resolve, 100))

      try {
        // 生成新的职位ID
        const newPosition = {
          ...position,
          id: Date.now() + i,
          candidates: 0,
          interviews: 0,
          createdAt: new Date().toISOString().split('T')[0],
          urgent: false
        }

        // 添加到职位列表
        positions.value.push(newPosition)
        successfulImports.push(newPosition)

      } catch (error) {
        failedImports.push({
          row: i + 1,
          name: position.name,
          error: error.message || '导入失败'
        })
      }
    }

    // 设置导入结果
    importResult.value = {
      success: failedImports.length === 0,
      title: failedImports.length === 0 ? '导入成功' : '部分导入成功',
      message: `成功导入 ${successfulImports.length} 条记录${failedImports.length > 0 ? `，${failedImports.length} 条记录导入失败` : ''}`,
      successCount: successfulImports.length,
      failureCount: failedImports.length,
      totalCount: previewData.value.length,
      failures: failedImports
    }

    importStep.value = 2

    // 刷新统计数据
    await updateStats()

    ElMessage.success(`批量导入完成！成功导入 ${successfulImports.length} 条记录`)

  } catch (error) {
    console.error('导入失败:', error)
    ElMessage.error('导入失败: ' + error.message)
  } finally {
    importLoading.value = false
  }
}

const downloadTemplate = () => {
  // 创建CSV模板内容
  const templateContent = [
    '职位名称,技术领域,职位级别,工作地点,薪资范围,职位状态',
    '高级前端工程师,ai,senior,北京,20-30K,active',
    '算法工程师,ai,expert,上海,25-40K,active',
    '大数据开发工程师,bigdata,middle,深圳,18-25K,active',
    '物联网工程师,iot,middle,杭州,15-25K,active'
  ].join('\n')

  // 创建下载链接
  const blob = new Blob(['\ufeff' + templateContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)

  link.setAttribute('href', url)
  link.setAttribute('download', 'iFlytek职位导入模板.csv')
  link.style.visibility = 'hidden'

  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  ElMessage.success('模板文件下载成功')
}

const getDomainLabel = (domain) => {
  const labels = {
    'ai': 'AI技术',
    'bigdata': '大数据',
    'iot': 'IoT物联网'
  }
  return labels[domain] || domain
}

const getDomainColor = (domain) => {
  const colors = {
    'ai': '#0066cc',
    'bigdata': '#059669',
    'iot': '#ea580c'
  }
  return colors[domain] || '#666'
}

const getLevelLabel = (level) => {
  const labels = {
    'junior': '初级',
    'middle': '中级',
    'senior': '高级',
    'expert': '专家'
  }
  return labels[level] || level
}

const getLevelType = (level) => {
  const types = {
    'junior': '',
    'middle': 'success',
    'senior': 'warning',
    'expert': 'danger'
  }
  return types[level] || ''
}

const getStatusLabel = (status) => {
  const labels = {
    'active': '招聘中',
    'paused': '暂停',
    'closed': '已关闭'
  }
  return labels[status] || status
}

const getStatusType = (status) => {
  const types = {
    'active': 'success',
    'paused': 'warning',
    'closed': 'info'
  }
  return types[status] || ''
}

const handleSearch = () => {
  currentPage.value = 1
}

const handleFilter = () => {
  currentPage.value = 1
}

const applyFilters = () => {
  ElMessage.success('筛选条件已应用')
}

// ===== 增强交互系统方法 =====

/**
 * 统计卡片点击处理 - 实现数据联动
 */
const handleStatsCardClick = async (filterType) => {
  try {
    // 设置活跃筛选器
    activeStatsFilter.value = activeStatsFilter.value === filterType ? '' : filterType

    // 根据点击的统计卡片类型设置筛选条件
    switch (filterType) {
      case 'active':
        filterStatus.value = 'active'
        break
      case 'urgent':
        filterUrgent.value = true
        break
      case 'pending':
        filterStatus.value = 'pending'
        break
      case 'hot':
        filterDomain.value = stats.hotDomain === 'AI算法' ? 'ai' : 'bigdata'
        break
      case 'success':
      case 'efficiency':
      case 'cycle':
        // 这些统计卡片主要用于显示趋势，点击时显示详细分析
        await showStatsDetailAnalysis(filterType)
        return
      default:
        // 清除所有筛选
        clearAllFilters()
        return
    }

    // 应用筛选并更新职位列表
    await applyFiltersWithAnimation()

    // 同步更新图表
    await updateChartsWithFilter(filterType)

    // 提供用户反馈
    ElMessage.success(`已筛选${getFilterTypeLabel(filterType)}职位`)

  } catch (error) {
    console.error('统计卡片点击处理失败:', error)
    ElMessage.error('筛选操作失败，请重试')
  }
}

/**
 * 智能搜索输入处理
 */
const handleSearchInput = debounce(async (value) => {
  if (!value || value.length < 2) {
    searchSuggestions.value = []
    return
  }

  try {
    isSearching.value = true
    lastSearchTime.value = Date.now()

    // 生成搜索建议
    const suggestions = await generateSearchSuggestions(value)
    searchSuggestions.value = suggestions

    // 如果启用了AI搜索，调用iFlytek服务
    if (iflytekService.value) {
      const aiSuggestions = await getAISearchSuggestions(value)
      searchSuggestions.value = [...suggestions, ...aiSuggestions]
    }

  } catch (error) {
    console.error('搜索建议生成失败:', error)
  } finally {
    isSearching.value = false
  }
}, 300)

/**
 * 筛选条件变化处理
 */
const handleFilterChange = async () => {
  try {
    // 记录筛选历史
    const currentFilters = {
      domain: filterDomain.value,
      level: filterLevel.value,
      status: filterStatus.value,
      timestamp: Date.now()
    }

    filterHistory.value.unshift(currentFilters)
    if (filterHistory.value.length > 10) {
      filterHistory.value = filterHistory.value.slice(0, 10)
    }

    // 应用筛选
    await applyFiltersWithAnimation()

    // 同步更新统计数据
    await updateStatsWithFilter()

    // 同步更新图表
    await updateChartsWithCurrentFilter()

  } catch (error) {
    console.error('筛选条件变化处理失败:', error)
  }
}

/**
 * 切换高级筛选
 */
const toggleAdvancedFilter = () => {
  showAdvancedFilter.value = !showAdvancedFilter.value

  if (showAdvancedFilter.value) {
    ElMessage.info('高级筛选已展开')
  }
}

/**
 * 打开AI助手
 */
const openAIAssistant = async () => {
  try {
    isAIAssistantOpen.value = true

    // 初始化iFlytek服务
    if (!iflytekService.value) {
      await initializeIflytekService()
    }

    // 获取智能推荐
    await generateSmartRecommendations()

    ElMessage.success('AI助手已启动')

  } catch (error) {
    console.error('AI助手启动失败:', error)
    ElMessage.error('AI助手暂时不可用')
  }
}

/**
 * 打开AI筛选助手
 */
const openAIFilterAssistant = async () => {
  try {
    aiFilterAssistantOpen.value = true

    if (!iflytekService.value) {
      await initializeIflytekService()
    }

    ElMessage.info('AI筛选助手已启动，请描述您的筛选需求')

  } catch (error) {
    console.error('AI筛选助手启动失败:', error)
    ElMessage.error('AI筛选助手暂时不可用')
  }
}

/**
 * 触发AI搜索
 */
const triggerAISearch = async () => {
  try {
    if (!searchQuery.value) {
      ElMessage.warning('请输入搜索关键词')
      return
    }

    if (!iflytekService.value) {
      await initializeIflytekService()
    }

    // 使用AI分析搜索意图
    const searchIntent = await analyzeSearchIntent(searchQuery.value)

    // 应用AI推荐的筛选条件
    await applyAIRecommendedFilters(searchIntent)

    ElMessage.success('AI搜索完成')

  } catch (error) {
    console.error('AI搜索失败:', error)
    ElMessage.error('AI搜索暂时不可用，使用普通搜索')
  }
}

const createPosition = () => {
  try {
    editingPosition.value = null
    Object.keys(positionForm).forEach(key => {
      if (key === 'status') {
        positionForm[key] = 'active'
      } else if (key === 'urgent') {
        positionForm[key] = false
      } else {
        positionForm[key] = ''
      }
    })
    showPositionDialog.value = true
  } catch (error) {
    console.error('创建职位函数执行失败:', error)
    ElMessage.error('打开对话框失败，请重试')
  }
}

const editPosition = (position) => {
  editingPosition.value = position
  Object.keys(positionForm).forEach(key => {
    positionForm[key] = position[key] || ''
  })
  showPositionDialog.value = true
}

// ===== iFlytek Spark 服务集成方法 =====

/**
 * 初始化iFlytek服务
 */
const initializeIflytekService = async () => {
  try {
    // 动态导入iFlytek服务
    const { default: enhancedIflytekSparkService } = await import('@/services/enhancedIflytekSparkService.js')
    iflytekService.value = enhancedIflytekSparkService

    console.log('iFlytek Spark服务初始化成功')
    return true
  } catch (error) {
    console.error('iFlytek服务初始化失败:', error)
    return false
  }
}

/**
 * 生成智能推荐
 */
const generateSmartRecommendations = async () => {
  try {
    console.log('🔄 开始生成智能推荐...')

    if (!iflytekService.value) {
      console.warn('⚠️ iFlytek服务未初始化')
      return
    }

    const analysisRequest = {
      dataScope: 'position_management',
      currentFilters: {
        domain: filterDomain.value,
        level: filterLevel.value,
        status: filterStatus.value
      },
      positionData: positions.value,
      statsData: stats
    }

    console.log('📊 分析请求数据:', analysisRequest)

    const insights = await iflytekService.value.generateDataDrivenInsights(analysisRequest)
    console.log('✅ 获取到洞察数据:', insights)

    smartRecommendations.value = insights.recommendations || []
    console.log('🎯 智能推荐数据:', smartRecommendations.value)

    if (smartRecommendations.value.length > 0) {
      console.log(`✅ 成功生成 ${smartRecommendations.value.length} 条智能推荐`)
    } else {
      console.warn('⚠️ 没有生成任何推荐内容')
    }

    return insights
  } catch (error) {
    console.error('❌ 智能推荐生成失败:', error)
    return null
  }
}

/**
 * 分析搜索意图
 */
const analyzeSearchIntent = async (searchText) => {
  try {
    if (!iflytekService.value) return null

    const analysisRequest = {
      text: searchText,
      context: 'position_search',
      domain: 'recruitment',
      language: 'chinese'
    }

    const result = await iflytekService.value.analyzeTextPrimary(analysisRequest)

    return {
      intent: result.searchIntent || 'general',
      suggestedFilters: result.suggestedFilters || {},
      keywords: result.extractedKeywords || [],
      confidence: result.confidence || 0.5
    }
  } catch (error) {
    console.error('搜索意图分析失败:', error)
    return null
  }
}

/**
 * 获取AI搜索建议
 */
const getAISearchSuggestions = async (query) => {
  try {
    if (!iflytekService.value) return []

    const suggestions = await iflytekService.value.generateRealTimeHint(null, {
      query,
      type: 'search_suggestions',
      domain: 'position_management'
    })

    return suggestions.hints || []
  } catch (error) {
    console.error('AI搜索建议获取失败:', error)
    return []
  }
}

/**
 * 应用AI推荐的筛选条件
 */
const applyAIRecommendedFilters = async (searchIntent) => {
  try {
    if (!searchIntent || !searchIntent.suggestedFilters) return

    const filters = searchIntent.suggestedFilters

    // 应用AI推荐的筛选条件
    if (filters.domain) filterDomain.value = filters.domain
    if (filters.level) filterLevel.value = filters.level
    if (filters.status) filterStatus.value = filters.status
    if (filters.urgent !== undefined) filterUrgent.value = filters.urgent

    // 应用筛选
    await applyFiltersWithAnimation()

    // 显示AI分析结果
    if (searchIntent.confidence > 0.7) {
      ElMessage.success(`AI理解您的需求：${searchIntent.intent}`)
    } else {
      ElMessage.info('AI已尽力理解您的需求，如结果不准确请手动调整筛选条件')
    }

  } catch (error) {
    console.error('应用AI筛选条件失败:', error)
  }
}



const savePosition = async () => {
  if (!positionFormRef.value) return
  
  try {
    await positionFormRef.value.validate()
    saving.value = true
    
    // 模拟保存过程
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (editingPosition.value) {
      // 更新职位
      const index = positions.value.findIndex(p => p.id === editingPosition.value.id)
      if (index !== -1) {
        positions.value[index] = { ...positions.value[index], ...positionForm }
      }
      ElMessage.success('职位更新成功')
    } else {
      // 创建新职位
      const newPosition = {
        id: Date.now(),
        ...positionForm,
        candidates: 0,
        interviews: 0,
        createdAt: new Date().toISOString().split('T')[0]
      }
      positions.value.unshift(newPosition)
      ElMessage.success('职位创建成功')
    }
    
    showPositionDialog.value = false
  } catch (error) {
    console.error('表单验证失败:', error)
  } finally {
    saving.value = false
  }
}



const handlePositionAction = (command) => {
  const { action, position } = command
  
  switch (action) {
    case 'duplicate':
      ElMessage.info(`复制职位: ${position.name}`)
      break
    case 'pause':
      ElMessage.info(`暂停招聘: ${position.name}`)
      break
    case 'delete':
      ElMessageBox.confirm(`确定要删除职位"${position.name}"吗？`, '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        const index = positions.value.findIndex(p => p.id === position.id)
        if (index !== -1) {
          positions.value.splice(index, 1)
          ElMessage.success('职位已删除')
        }
      }).catch(() => {
        // 用户取消
      })
      break
  }
}

const exportPositions = () => {
  showExportDialog.value = true
}

// 确认导出
const confirmExport = async () => {
  if (filteredPositions.value.length === 0) {
    ElMessage.warning('没有可导出的数据')
    return
  }

  exporting.value = true

  try {
    // 显示加载提示
    const loadingInstance = ElLoading.service({
      lock: true,
      text: '正在准备导出数据...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    // 模拟处理时间
    await new Promise(resolve => setTimeout(resolve, 1000))

    // 准备导出数据
    const exportData = prepareExportData()

    // 生成文件名
    const fileName = generateFileName()

    // 根据格式导出
    if (exportFormat.value === 'excel') {
      await exportToExcel(exportData, fileName)
    } else {
      await exportToCSV(exportData, fileName)
    }

    loadingInstance.close()
    showExportDialog.value = false

    ElMessage.success(`成功导出 ${filteredPositions.value.length} 条职位数据`)

  } catch (error) {
    console.error('导出失败:', error)
    ElMessage.error('导出失败，请重试')
  } finally {
    exporting.value = false
  }
}

// 准备导出数据
const prepareExportData = () => {
  return filteredPositions.value.map(position => {
    const baseData = {
      '职位名称': position.name,
      '技术领域': getDomainLabel(position.domain),
      '职位级别': getLevelLabel(position.level),
      '职位状态': getStatusLabel(position.status),
      '是否紧急': position.urgent ? '是' : '否',
      '候选人数': position.candidates,
      '面试数量': position.interviews,
      '创建时间': position.createdAt
    }

    // 根据设置决定是否包含描述
    if (includeDescription.value && position.description) {
      baseData['职位描述'] = position.description
    }

    return baseData
  })
}

// 生成文件名
const generateFileName = () => {
  let fileName = '职位列表'

  if (includeTimestamp.value) {
    const now = new Date()
    const timestamp = now.toISOString()
      .replace(/[-:]/g, '')
      .replace('T', '_')
      .substring(0, 15)
    fileName += `_${timestamp}`
  }

  return fileName
}



// 导出为Excel格式（使用XLSX库生成真正的Excel文件）
const exportToExcel = async (data, fileName) => {
  try {
    // 动态导入XLSX库
    const XLSX = await import('xlsx')
    const { saveAs } = await import('file-saver')

    // 创建工作簿
    const workbook = XLSX.utils.book_new()

    // 添加标题信息
    const titleData = [
      ['iFlytek 职位管理系统 - 职位数据导出'],
      [''],
      ['导出时间', new Date().toLocaleString('zh-CN')],
      ['数据条数', data.length],
      ['导出用户', 'iFlytek管理员'],
      ['']
    ]

    // 获取表头
    const headers = Object.keys(data[0] || {})

    // 合并标题和数据
    const worksheetData = [
      ...titleData,
      headers,
      ...data.map(row => headers.map(header => row[header] || ''))
    ]

    // 创建工作表
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)

    // 设置列宽
    const colWidths = headers.map(header => {
      const maxLength = Math.max(
        header.length,
        ...data.map(row => String(row[header] || '').length)
      )
      return { width: Math.min(Math.max(maxLength + 2, 10), 50) }
    })
    worksheet['!cols'] = colWidths

    // 设置标题样式（如果支持）
    if (worksheet['A1']) {
      worksheet['A1'].s = {
        font: { bold: true, sz: 14, color: { rgb: "1890FF" } },
        alignment: { horizontal: "center" }
      }
    }

    // 合并标题单元格
    worksheet['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: headers.length - 1 } }
    ]

    // 添加工作表到工作簿
    XLSX.utils.book_append_sheet(workbook, worksheet, '职位数据')

    // 生成Excel文件
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
      compression: true
    })

    // 创建正确的Blob
    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })

    // 使用file-saver下载
    saveAs(blob, `${fileName}.xlsx`)

  } catch (error) {
    console.error('Excel导出失败:', error)
    throw new Error('Excel导出失败: ' + error.message)
  }
}

// 导出为CSV格式（优化中文支持和格式）
const exportToCSV = async (data, fileName) => {
  try {
    const { saveAs } = await import('file-saver')

    // 添加文件头信息
    const headerInfo = [
      'iFlytek 职位管理系统 - 职位数据导出',
      '',
      `导出时间,${new Date().toLocaleString('zh-CN')}`,
      `数据条数,${data.length}`,
      `导出用户,iFlytek管理员`,
      ''
    ]

    // 获取表头
    const headers = Object.keys(data[0] || {})

    // 构建CSV内容
    const csvRows = []

    // 添加头信息
    csvRows.push(...headerInfo)

    // 添加表头
    csvRows.push(headers.map(header => `"${header}"`).join(','))

    // 添加数据行
    data.forEach(row => {
      const values = headers.map(header => {
        const value = row[header] || ''
        // 确保所有值都被引号包围，避免CSV解析问题
        return `"${String(value).replace(/"/g, '""')}"`
      })
      csvRows.push(values.join(','))
    })

    const csvContent = csvRows.join('\n')

    // 添加UTF-8 BOM以确保中文正确显示
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], {
      type: 'text/csv;charset=utf-8'
    })

    // 使用file-saver下载
    saveAs(blob, `${fileName}.csv`)

  } catch (error) {
    console.error('CSV导出失败:', error)
    throw new Error('CSV导出失败: ' + error.message)
  }
}

const handleSizeChange = (size) => {
  pageSize.value = size
  currentPage.value = 1
}

const handleCurrentChange = (page) => {
  currentPage.value = page
}

// 统计卡片点击事件
const viewStatsDetail = (type) => {
  switch (type) {
    case 'active':
      searchQuery.value = ''
      filterStatus.value = 'active'
      break
    case 'total':
      searchQuery.value = ''
      filterStatus.value = ''
      filterDomain.value = ''
      filterLevel.value = ''
      break
    case 'urgent':
      searchQuery.value = ''
      filterStatus.value = ''
      filterUrgent.value = true
      break
    case 'cycle':
      ElMessage.info('平均招聘周期详情功能开发中...')
      break
    case 'success':
      ElMessage.info('招聘成功率详情功能开发中...')
      break
    case 'hot':
      searchQuery.value = ''
      filterDomain.value = 'ai'
      break
    case 'pending':
      searchQuery.value = ''
      filterStatus.value = 'pending'
      break
    case 'efficiency':
      ElMessage.info('招聘效率详情功能开发中...')
      break
  }
}

// 重置筛选条件
const resetFilters = () => {
  searchQuery.value = ''
  filterStatus.value = ''
  filterDomain.value = ''
  filterLevel.value = ''
  filterSalaryRange.value = ''
  filterLocation.value = ''
  filterUrgent.value = null
  filterDateRange.value = null
  showAdvancedFilter.value = false
}

// 保存筛选预设
const saveFilterPreset = () => {
  ElMessageBox.prompt('请输入预设名称', '保存筛选条件', {
    confirmButtonText: '保存',
    cancelButtonText: '取消',
    inputPattern: /\S+/,
    inputErrorMessage: '预设名称不能为空'
  }).then(({ value }) => {
    const preset = {
      id: Date.now(),
      name: value,
      filters: {
        status: filterStatus.value,
        domain: filterDomain.value,
        level: filterLevel.value,
        salaryRange: filterSalaryRange.value,
        location: filterLocation.value,
        urgent: filterUrgent.value,
        dateRange: filterDateRange.value
      }
    }
    filterPresets.value.push(preset)
    ElMessage.success('筛选条件已保存')
  }).catch(() => {
    // 用户取消
  })
}

// 加载筛选预设
const loadFilterPreset = (presetId) => {
  const preset = filterPresets.value.find(p => p.id === presetId)
  if (preset) {
    filterStatus.value = preset.filters.status || ''
    filterDomain.value = preset.filters.domain || ''
    filterLevel.value = preset.filters.level || ''
    filterSalaryRange.value = preset.filters.salaryRange || ''
    filterLocation.value = preset.filters.location || ''
    filterUrgent.value = preset.filters.urgent
    filterDateRange.value = preset.filters.dateRange
    ElMessage.success(`已应用筛选条件：${preset.name}`)
  }
}

// 表格选择变化处理
const handleSelectionChange = (selection) => {
  selectedPositions.value = selection.map(item => item.id)
}

// 查看职位详情
const showPositionDetail = (position) => {
  detailPosition.value = position
  showDetailDialog.value = true
}

// 复制职位
const duplicatePosition = (position) => {
  const newPosition = {
    ...position,
    id: Date.now(),
    name: `${position.name} (副本)`,
    createdAt: new Date().toISOString().split('T')[0],
    candidates: 0,
    interviews: 0
  }
  positions.value.unshift(newPosition)
  showDetailDialog.value = false
  ElMessage.success('职位复制成功')
}

// 暂停职位
const pausePosition = (position) => {
  position.status = 'paused'
  showDetailDialog.value = false
  ElMessage.success('职位已暂停')
}

// 激活职位
const activatePosition = (position) => {
  position.status = 'active'
  showDetailDialog.value = false
  ElMessage.success('职位已激活')
}

// 删除职位
const deletePosition = (position) => {
  ElMessageBox.confirm(
    `确定要删除职位"${position.name}"吗？`,
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    const index = positions.value.findIndex(p => p.id === position.id)
    if (index > -1) {
      positions.value.splice(index, 1)
      showDetailDialog.value = false
      ElMessage.success('职位删除成功')
    }
  }).catch(() => {
    // 用户取消
  })
}

// 批量操作处理
const handleBatchAction = (command) => {
  if (selectedPositions.value.length === 0) {
    ElMessage.warning('请先选择要操作的职位')
    return
  }

  const actionMap = {
    delete: '删除',
    activate: '激活',
    pause: '暂停',
    urgent: '设为紧急'
  }

  ElMessageBox.confirm(
    `确定要${actionMap[command]}选中的 ${selectedPositions.value.length} 个职位吗？`,
    '批量操作确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  ).then(() => {
    // 执行批量操作
    switch (command) {
      case 'delete':
        positions.value = positions.value.filter(p => !selectedPositions.value.includes(p.id))
        break
      case 'activate':
        positions.value.forEach(p => {
          if (selectedPositions.value.includes(p.id)) {
            p.status = 'active'
          }
        })
        break
      case 'pause':
        positions.value.forEach(p => {
          if (selectedPositions.value.includes(p.id)) {
            p.status = 'paused'
          }
        })
        break
      case 'urgent':
        positions.value.forEach(p => {
          if (selectedPositions.value.includes(p.id)) {
            p.urgent = true
          }
        })
        break
    }
    selectedPositions.value = []
    ElMessage.success(`批量${actionMap[command]}操作完成`)
  }).catch(() => {
    // 用户取消
  })
}

// ===== 辅助方法和工具函数 =====

/**
 * 生成搜索建议
 */
const generateSearchSuggestions = async (query) => {
  const suggestions = []

  // 基于职位名称的建议
  positions.value.forEach(position => {
    if (position.name.toLowerCase().includes(query.toLowerCase())) {
      suggestions.push({
        type: 'position',
        text: position.name,
        icon: 'Setting'
      })
    }
  })

  // 基于技能的建议
  const skills = ['JavaScript', 'Python', 'Java', 'React', 'Vue.js', 'Node.js', 'AI', '机器学习', '大数据']
  skills.forEach(skill => {
    if (skill.toLowerCase().includes(query.toLowerCase())) {
      suggestions.push({
        type: 'skill',
        text: skill,
        icon: 'Star'
      })
    }
  })

  return suggestions.slice(0, 5)
}

/**
 * 应用筛选并添加动画效果
 */
const applyFiltersWithAnimation = async () => {
  try {
    // 添加加载动画
    const loadingInstance = ElLoading.service({
      target: '.position-list',
      text: '正在筛选职位...'
    })

    // 模拟筛选延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    loadingInstance.close()

    // 更新当前页为第一页
    currentPage.value = 1

  } catch (error) {
    console.error('筛选应用失败:', error)
  }
}

/**
 * 更新图表与筛选联动
 */
const updateChartsWithFilter = async (filterType) => {
  try {
    // 根据筛选类型更新图表数据
    switch (filterType) {
      case 'active':
        chartType.value = 'status'
        break
      case 'urgent':
        chartType.value = 'priority'
        break
      case 'hot':
        chartType.value = 'domain'
        break
      default:
        chartType.value = 'domain'
    }

    // 重新初始化图表
    await nextTick()
    initPieChart()
    initFunnelChart()
    initLineChart()

  } catch (error) {
    console.error('图表更新失败:', error)
  }
}

/**
 * 清除所有筛选条件
 */
const clearAllFilters = () => {
  searchQuery.value = ''
  filterDomain.value = ''
  filterLevel.value = ''
  filterStatus.value = ''
  filterUrgent.value = null
  filterDateRange.value = null
  filterSalaryRange.value = ''
  filterLocation.value = ''
  activeStatsFilter.value = ''
}

/**
 * 获取筛选类型标签
 */
const getFilterTypeLabel = (filterType) => {
  const labels = {
    'active': '活跃',
    'urgent': '紧急',
    'pending': '待审核',
    'hot': '热门领域',
    'success': '高成功率',
    'efficiency': '高效率',
    'cycle': '短周期'
  }
  return labels[filterType] || '相关'
}

/**
 * 选择搜索建议
 */
const selectSuggestion = (suggestion) => {
  searchQuery.value = suggestion.text
  searchSuggestions.value = []
  handleSearchInput(suggestion.text)
}

/**
 * 应用AI推荐
 */
const applyRecommendation = async (recommendation) => {
  try {
    console.log('应用AI推荐:', recommendation)

    switch (recommendation.action) {
      case 'filter':
        // 应用筛选条件
        if (recommendation.filters) {
          Object.keys(recommendation.filters).forEach(key => {
            switch (key) {
              case 'domain':
                filterDomain.value = recommendation.filters[key]
                break
              case 'level':
                filterLevel.value = recommendation.filters[key]
                break
              case 'status':
                filterStatus.value = recommendation.filters[key]
                break
              case 'urgent':
                filterUrgent.value = recommendation.filters[key]
                break
            }
          })
          await handleFilterChange()
        }
        break

      case 'optimize_descriptions':
        ElMessage.info('职位描述优化功能开发中，敬请期待...')
        break

      case 'batch_optimize':
        ElMessage.info('批量优化功能开发中，敬请期待...')
        break

      case 'view_trends':
        ElMessage.info(`正在分析${recommendation.domain || '技术'}领域趋势...`)
        break

      case 'increase_recruitment':
        ElMessage.warning(`建议加强${recommendation.domain || '相关'}领域人才招聘`)
        break

      case 'enable_ai_matching':
        ElMessage.success('iFlytek AI智能匹配功能已启用')
        break

      case 'view_report':
        ElMessage.info('数据分析报告功能开发中，敬请期待...')
        break

      case 'enable_smart_features':
        ElMessage.success('iFlytek智能推荐系统已启用')
        break

      default:
        ElMessage.info(`推荐建议：${recommendation.text}`)
    }

    ElMessage.success(`已应用AI推荐：${recommendation.text}`)

  } catch (error) {
    console.error('应用AI推荐失败:', error)
    ElMessage.error('应用推荐失败')
  }
}



/**
 * 请求AI分析
 */
const requestAIAnalysis = async (analysisType) => {
  try {
    if (!iflytekService.value) {
      await initializeIflytekService()
    }

    const analysisRequest = {
      type: analysisType,
      dataScope: 'position_management',
      currentData: {
        positions: positions.value,
        stats: stats,
        filters: {
          domain: filterDomain.value,
          level: filterLevel.value,
          status: filterStatus.value
        }
      }
    }

    const results = await iflytekService.value.generateDataDrivenInsights(analysisRequest)
    aiAnalysisResults.value = results

    ElMessage.success('AI分析完成')

  } catch (error) {
    console.error('AI分析请求失败:', error)
    ElMessage.error('AI分析暂时不可用')
  }
}

/**
 * 刷新AI服务
 */
const refreshAIService = async () => {
  try {
    iflytekService.value = null
    await initializeIflytekService()
    ElMessage.success('AI服务已刷新')
  } catch (error) {
    console.error('AI服务刷新失败:', error)
    ElMessage.error('AI服务刷新失败')
  }
}

/**
 * 获取预测指标标签
 */
const getPredictionLabel = (key) => {
  const labels = {
    successRate: '成功率',
    retentionRate: '留存率',
    performanceScore: '绩效评分',
    culturalFitScore: '文化匹配度',
    growthRate: '增长率',
    demandIndex: '需求指数',
    competitionLevel: '竞争水平',
    efficiencyScore: '效率评分',
    timeReduction: '时间节省',
    costSaving: '成本节约',
    qualityImprovement: '质量提升',
    matchAccuracy: '匹配准确度',
    marketGrowth: '市场增长',
    salaryInflation: '薪资涨幅',
    talentShortage: '人才短缺度',
    demandShift: '需求变化',
    salaryGrowth: '薪资增长',
    marketSaturation: '市场饱和度',
    throughputIncrease: '处理量提升',
    candidateExperience: '候选人体验',
    skillGrowthPotential: '技能成长潜力',
    teamIntegrationScore: '团队融合度',
    remoteWorkAdoption: '远程工作接受度',
    skillDiversification: '技能多样化'
  }
  return labels[key] || key
}

/**
 * 格式化预测值
 */
const formatPredictionValue = (value) => {
  if (typeof value === 'number') {
    if (value <= 1) {
      return `${Math.round(value * 100)}%`
    } else {
      return Math.round(value).toString()
    }
  }
  return value
}

/**
 * 获取市场地位标签类型
 */
const getPositionTagType = (position) => {
  const typeMap = {
    'above_average': 'success',
    'average': 'info',
    'below_average': 'warning',
    'excellent': 'success',
    'good': 'primary',
    'poor': 'danger'
  }
  return typeMap[position] || 'info'
}

/**
 * 获取市场地位文本
 */
const getPositionText = (position) => {
  const textMap = {
    'above_average': '高于平均水平',
    'average': '平均水平',
    'below_average': '低于平均水平',
    'excellent': '优秀',
    'good': '良好',
    'poor': '较差'
  }
  return textMap[position] || position
}

/**
 * 处理AI筛选
 */
const processAIFilter = async () => {
  try {
    if (!aiFilterQuery.value.trim()) {
      ElMessage.warning('请输入筛选需求描述')
      return
    }

    processingAIFilter.value = true

    if (!iflytekService.value) {
      await initializeIflytekService()
    }

    const analysisRequest = {
      text: aiFilterQuery.value,
      context: 'filter_parsing',
      domain: 'recruitment',
      language: 'chinese'
    }

    const result = await iflytekService.value.analyzeTextPrimary(analysisRequest)

    aiFilterResults.value = {
      filters: result.extractedFilters || {},
      confidence: result.confidence || 0.5,
      suggestions: result.suggestions || []
    }

    // 如果置信度足够高，自动应用筛选条件
    if (result.confidence > 0.7 && result.extractedFilters) {
      await applyAIRecommendedFilters({ suggestedFilters: result.extractedFilters })
      aiFilterAssistantOpen.value = false
    }

    ElMessage.success('AI筛选分析完成')

  } catch (error) {
    console.error('AI筛选处理失败:', error)
    ElMessage.error('AI筛选分析失败')
  } finally {
    processingAIFilter.value = false
  }
}

/**
 * 应用筛选模板
 */
const applyFilterTemplate = async (template) => {
  try {
    aiFilterQuery.value = `我需要找到${template.name}相关的职位`

    // 直接应用模板筛选条件
    if (template.filters) {
      Object.keys(template.filters).forEach(key => {
        switch (key) {
          case 'domain':
            filterDomain.value = template.filters[key]
            break
          case 'level':
            filterLevel.value = template.filters[key]
            break
          case 'urgent':
            filterUrgent.value = template.filters[key]
            break
          case 'location':
            filterLocation.value = template.filters[key]
            break
        }
      })

      await handleFilterChange()
      ElMessage.success(`已应用筛选模板：${template.name}`)
    }

  } catch (error) {
    console.error('应用筛选模板失败:', error)
    ElMessage.error('应用模板失败')
  }
}

// 图表数据计算
const chartData = computed(() => {
  const data = positions.value

  // 按技术领域分组
  const domainData = data.reduce((acc, pos) => {
    const domain = getDomainLabel(pos.domain)
    acc[domain] = (acc[domain] || 0) + 1
    return acc
  }, {})

  // 按职位级别分组
  const levelData = data.reduce((acc, pos) => {
    const level = getLevelLabel(pos.level)
    acc[level] = (acc[level] || 0) + 1
    return acc
  }, {})

  // 按职位状态分组
  const statusData = data.reduce((acc, pos) => {
    const status = getStatusLabel(pos.status)
    acc[status] = (acc[status] || 0) + 1
    return acc
  }, {})

  return {
    domain: Object.entries(domainData).map(([name, value]) => ({ name, value })),
    level: Object.entries(levelData).map(([name, value]) => ({ name, value })),
    status: Object.entries(statusData).map(([name, value]) => ({ name, value }))
  }
})

// 漏斗图数据
const funnelData = computed(() => {
  const totalPositions = positions.value.length
  const totalCandidates = positions.value.reduce((sum, p) => sum + p.candidates, 0)
  const totalInterviews = positions.value.reduce((sum, p) => sum + p.interviews, 0)
  const successfulHires = Math.round(totalInterviews * 0.3) // 假设30%的面试成功率

  return [
    { value: totalPositions, name: '职位发布' },
    { value: totalCandidates, name: '简历投递' },
    { value: totalInterviews, name: '面试邀请' },
    { value: successfulHires, name: '成功入职' }
  ]
})

// 时间趋势数据（模拟数据）
const trendData = computed(() => {
  const months = ['1月', '2月', '3月', '4月', '5月', '6月']

  const positionsData = [12, 18, 25, 32, 28, 35]
  const candidatesData = [120, 180, 250, 320, 280, 350]
  const interviewsData = [45, 68, 95, 128, 112, 140]

  return {
    months,
    positions: positionsData,
    candidates: candidatesData,
    interviews: interviewsData
  }
})

// 图表加载状态
const chartsLoading = ref(true)
const chartsError = ref(false)

// 增强交互系统状态
const activeStatsFilter = ref('')
const isAIAssistantOpen = ref(false)
const aiFilterAssistantOpen = ref(false)
const searchSuggestions = ref([])
const isSearching = ref(false)
const filterHistory = ref([])
const lastSearchTime = ref(0)

// iFlytek Spark 服务集成
const iflytekService = ref(null)
const aiAnalysisResults = ref(null)

const smartRecommendations = ref([])

// 实时数据同步状态
const realTimeSync = ref(true)
const lastSyncTime = ref(Date.now())
const syncInterval = ref(null)

// AI助手相关状态
const aiFilterQuery = ref('')
const aiFilterResults = ref(null)
const processingAIFilter = ref(false)
const filterTemplates = ref([
  { id: 1, name: '高级AI工程师', filters: { domain: 'ai', level: 'senior' } },
  { id: 2, name: '紧急招聘职位', filters: { urgent: true } },
  { id: 3, name: '北京地区职位', filters: { location: 'beijing' } },
  { id: 4, name: '高薪职位', filters: { salaryRange: '25+' } }
])

// 初始化饼图 - 性能优化版
const initPieChart = () => {
  try {
    if (!pieChartRef.value) {
      console.warn('饼图容器未找到')
      return
    }

    // 确保容器有正确的尺寸
    const container = pieChartRef.value
    if (container.clientWidth === 0 || container.clientHeight === 0) {
      // 使用requestAnimationFrame优化性能
      requestAnimationFrame(() => {
        setTimeout(initPieChart, 100)
      })
      return
    }

    // 性能优化：避免重复初始化
    if (pieChart && !pieChart.isDisposed()) {
      pieChart.dispose()
    }

    // 使用高性能配置初始化
    pieChart = echarts.init(container, null, {
      renderer: 'canvas',
      useDirtyRect: true,
      width: container.clientWidth,
      height: container.clientHeight
    })

    updatePieChart()

    // 添加交互事件 - 优化版
    pieChart.on('click', (params) => {
      // 触发统计卡片联动
      const domainMap = {
        'AI算法': 'ai',
        '大数据': 'bigdata',
        '物联网': 'iot'
      }

      if (domainMap[params.name]) {
        filterDomain.value = domainMap[params.name]
        handleFilterChange()
        ElMessage.success(`已筛选${params.name}相关职位`)
      } else {
        ElMessage.info(`${params.name}: ${params.value}个职位`)
      }
    })

    chartsError.value = false

  } catch (error) {
    console.error('饼图初始化失败:', error)
    chartsError.value = true
    ElMessage.error('图表加载失败，请刷新页面重试')
  }
}

// 更新饼图
const updatePieChart = () => {
  try {
    if (!pieChart) return

    const data = chartData.value[chartType.value]
    if (!data || data.length === 0) {
      pieChart.setOption({
        title: {
          text: '暂无数据',
          left: 'center',
          top: 'middle',
          textStyle: {
            color: '#999',
            fontSize: 14
          }
        }
      })
      return
    }

    const colors = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#722ed1']

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: {
        fontSize: 12
      }
    },
    color: colors,
    series: [
      {
        name: chartType.value === 'domain' ? '技术领域' :
              chartType.value === 'level' ? '职位级别' : '职位状态',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['60%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderRadius: 8,
          borderColor: '#fff',
          borderWidth: 2
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: '18',
            fontWeight: 'bold'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        labelLine: {
          show: false
        },
        data: data
      }
    ]
  }

    pieChart.setOption(option, true) // true表示不合并，提高性能

  } catch (error) {
    console.error('饼图更新失败:', error)
    ElMessage.error('饼图更新失败')
  }
}

// 初始化漏斗图
const initFunnelChart = () => {
  try {
    if (!funnelChartRef.value) {
      console.warn('漏斗图容器未找到')
      return
    }

    // 确保容器有正确的尺寸
    const container = funnelChartRef.value
    if (container.clientWidth === 0 || container.clientHeight === 0) {
      // 静默延迟初始化，避免控制台噪音
      setTimeout(initFunnelChart, 100)
      return
    }

    funnelChart = echarts.init(container)
    updateFunnelChart()

    // 添加点击事件
    funnelChart.on('click', (params) => {
      ElMessage.info(`${params.name}: ${params.value}`)
    })

  } catch (error) {
    console.error('漏斗图初始化失败:', error)
    chartsError.value = true
    ElMessage.error('漏斗图初始化失败')
  }
}

// 更新漏斗图
const updateFunnelChart = () => {
  try {
    if (!funnelChart) return

    const data = funnelData.value
    if (!data || data.length === 0) {
      funnelChart.setOption({
        title: {
          text: '暂无数据',
          left: 'center',
          top: 'middle',
          textStyle: {
            color: '#999',
            fontSize: 14
          }
        }
      })
      return
    }

  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c}'
    },
    color: ['#1890ff', '#52c41a', '#faad14', '#f5222d'],
    series: [
      {
        name: '招聘漏斗',
        type: 'funnel',
        left: '10%',
        top: 60,
        bottom: 60,
        width: '80%',
        min: 0,
        max: Math.max(...funnelData.value.map(d => d.value)),
        minSize: '0%',
        maxSize: '100%',
        sort: 'descending',
        gap: 2,
        label: {
          show: true,
          position: 'inside',
          formatter: '{b}: {c}',
          fontSize: 12,
          color: '#fff'
        },
        labelLine: {
          length: 10,
          lineStyle: {
            width: 1,
            type: 'solid'
          }
        },
        itemStyle: {
          borderColor: '#fff',
          borderWidth: 1
        },
        emphasis: {
          label: {
            fontSize: 14
          }
        },
        data: data
      }
    ]
  }

    funnelChart.setOption(option, true)

  } catch (error) {
    console.error('漏斗图更新失败:', error)
    ElMessage.error('漏斗图更新失败')
  }
}

// 初始化折线图
const initLineChart = () => {
  try {
    if (!lineChartRef.value) {
      console.warn('折线图容器未找到')
      return
    }

    // 确保容器有正确的尺寸
    const container = lineChartRef.value
    if (container.clientWidth === 0 || container.clientHeight === 0) {
      // 静默延迟初始化，避免控制台噪音
      setTimeout(initLineChart, 100)
      return
    }

    lineChart = echarts.init(container)
    updateLineChart()

    // 添加数据区域缩放功能
    lineChart.on('datazoom', (params) => {
      console.log('数据缩放:', params)
    })

  } catch (error) {
    console.error('折线图初始化失败:', error)
    chartsError.value = true
    ElMessage.error('折线图初始化失败')
  }
}

// 更新折线图
const updateLineChart = () => {
  try {
    if (!lineChart) return

    const data = trendData.value
    let seriesData = []
    let yAxisName = ''

  switch (trendType.value) {
    case 'positions':
      seriesData = data.positions
      yAxisName = '职位数量'
      break
    case 'candidates':
      seriesData = data.candidates
      yAxisName = '候选人数'
      break
    case 'interviews':
      seriesData = data.interviews
      yAxisName = '面试数量'
      break
  }

  const option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    legend: {
      data: [yAxisName],
      top: 10
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: data.months,
        axisLine: {
          lineStyle: {
            color: '#d9d9d9'
          }
        },
        axisLabel: {
          color: '#666'
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: yAxisName,
        nameTextStyle: {
          color: '#666'
        },
        axisLine: {
          lineStyle: {
            color: '#d9d9d9'
          }
        },
        axisLabel: {
          color: '#666'
        },
        splitLine: {
          lineStyle: {
            color: '#f0f0f0'
          }
        }
      }
    ],
    series: [
      {
        name: yAxisName,
        type: 'line',
        stack: 'Total',
        smooth: true,
        lineStyle: {
          width: 3,
          color: '#1890ff'
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(24, 144, 255, 0.3)'
              },
              {
                offset: 1,
                color: 'rgba(24, 144, 255, 0.05)'
              }
            ]
          }
        },
        emphasis: {
          focus: 'series'
        },
        data: seriesData,
        markPoint: {
          data: [
            { type: 'max', name: '最大值' },
            { type: 'min', name: '最小值' }
          ]
        },
        markLine: {
          data: [{ type: 'average', name: '平均值' }]
        }
      }
    ]
  }

    // 添加数据缩放组件
    option.dataZoom = [
      {
        type: 'inside',
        start: 0,
        end: 100
      },
      {
        start: 0,
        end: 100,
        handleIcon: 'path://M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23.1h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
        handleSize: '80%',
        handleStyle: {
          color: '#fff',
          shadowBlur: 3,
          shadowColor: 'rgba(0, 0, 0, 0.6)',
          shadowOffsetX: 2,
          shadowOffsetY: 2
        }
      }
    ]

    lineChart.setOption(option, true)

  } catch (error) {
    console.error('折线图更新失败:', error)
    ElMessage.error('折线图更新失败')
  }
}

// 图表切换监听
watch(chartType, () => {
  nextTick(() => {
    updatePieChart()
  })
})

watch(trendType, () => {
  nextTick(() => {
    updateLineChart()
  })
})

// 图表更新防抖处理
const debouncedUpdateCharts = debounce(() => {
  if (pieChart) updatePieChart()
  if (funnelChart) updateFunnelChart()
  if (lineChart) updateLineChart()
}, 500)

// 监听数据变化，自动更新图表（防抖处理）
watch(() => positions.value.length, () => {
  nextTick(() => {
    debouncedUpdateCharts()
  })
}, { deep: true })



// 窗口大小变化时重新调整图表（防抖处理）
const handleResize = debounce(() => {
  if (pieChart) pieChart.resize()
  if (funnelChart) funnelChart.resize()
  if (lineChart) lineChart.resize()
}, 300)

// 错误边界处理
const handleError = (error, context = '未知操作') => {
  console.error(`${context}失败:`, error)

  // 根据错误类型提供不同的用户反馈
  if (error.name === 'NetworkError') {
    ElMessage.error('网络连接失败，请检查网络设置')
  } else if (error.name === 'TypeError') {
    ElMessage.error('数据格式错误，请刷新页面重试')
  } else {
    ElMessage.error(`${context}失败，请重试`)
  }
}

// 性能监控
const performanceMonitor = {
  startTime: 0,

  start(operation) {
    this.startTime = performance.now()
    console.log(`开始执行: ${operation}`)
  },

  end(operation) {
    const duration = performance.now() - this.startTime
    console.log(`${operation} 执行完成，耗时: ${duration.toFixed(2)}ms`)

    // 如果操作耗时过长，给出优化建议
    if (duration > 1000) {
      console.warn(`${operation} 执行时间较长，建议优化`)
    }
  }
}

// 图表初始化函数 - 优化版
const initializeCharts = async () => {
  try {
    performanceMonitor.start('图表初始化')

    // 并行初始化图表以提升性能
    const chartPromises = [
      new Promise(resolve => {
        try {
          initPieChart()
          resolve()
        } catch (error) {
          console.error('饼图初始化失败:', error)
          resolve()
        }
      }),
      new Promise(resolve => {
        try {
          initFunnelChart()
          resolve()
        } catch (error) {
          console.error('漏斗图初始化失败:', error)
          resolve()
        }
      }),
      new Promise(resolve => {
        try {
          initLineChart()
          resolve()
        } catch (error) {
          console.error('折线图初始化失败:', error)
          resolve()
        }
      })
    ]

    await Promise.allSettled(chartPromises)

    chartsLoading.value = false
    performanceMonitor.end('图表初始化')

  } catch (error) {
    handleError(error, '图表初始化')
    chartsLoading.value = false
    chartsError.value = true
  }
}

// 组件挂载时初始化 - 性能优化版
onMounted(async () => {
  try {
    performanceMonitor.start('页面初始化')
    console.log('职位管理页面已加载')

    // 第一阶段：修复UI问题
    nextTick(() => {
      setTimeout(() => {
        fixOverlapIssues()
      }, 200)
    })

    // 第二阶段：初始化图表（使用requestIdleCallback优化）
    chartsLoading.value = true

    if (window.requestIdleCallback) {
      window.requestIdleCallback(() => {
        initializeCharts()
      })
    } else {
      setTimeout(initializeCharts, 100)
    }

    // 第三阶段：初始化AI服务（后台进行）
    initializeIflytekService().then(async (success) => {
      if (success) {
        // AI服务初始化成功后，生成智能推荐
        try {
          await generateSmartRecommendations()
          console.log('智能推荐已生成')
        } catch (error) {
          console.warn('智能推荐生成失败:', error)
        }
      }
    }).catch(error => {
      console.warn('AI服务初始化失败，将在需要时重试:', error)
    })

    // 监听窗口大小变化
    window.addEventListener('resize', handleResize)

    performanceMonitor.end('页面初始化')

  } catch (error) {
    handleError(error, '页面初始化')
    chartsLoading.value = false
    chartsError.value = true
  }
})

// 修复重叠问题的函数
const fixOverlapIssues = () => {
  // 静默修复重叠问题，避免控制台噪音

  // 修复导出对话框中的单选按钮
  const exportOptions = document.querySelectorAll('.export-format-option')
  exportOptions.forEach((option, index) => {
    const radioInput = option.querySelector('.el-radio__input')
    const formatOption = option.querySelector('.format-option')
    const radioLabel = option.querySelector('.el-radio__label')

    if (radioInput) {
      radioInput.style.cssText = `
        position: absolute !important;
        top: 30px !important;
        left: 30px !important;
        z-index: 1000 !important;
        margin: 0 !important;
        transform: none !important;
      `
    }

    if (formatOption) {
      formatOption.style.cssText = `
        display: flex !important;
        align-items: center !important;
        gap: 20px !important;
        padding: 30px 30px 30px 80px !important;
        border: 2px solid #e5e7eb !important;
        border-radius: 12px !important;
        min-height: 100px !important;
        background: #ffffff !important;
        cursor: pointer !important;
      `
    }

    if (radioLabel) {
      radioLabel.style.cssText = `
        padding-left: 0 !important;
        width: 100% !important;
        display: block !important;
      `
    }

    // 静默修复，减少控制台输出
  })

  // 重叠问题修复完成
}

// 组件卸载时清理
onUnmounted(() => {
  if (pieChart) {
    pieChart.dispose()
    pieChart = null
  }
  if (funnelChart) {
    funnelChart.dispose()
    funnelChart = null
  }
  if (lineChart) {
    lineChart.dispose()
    lineChart = null
  }
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
/* ===== 增强版职位管理页面样式 ===== */
.position-management-enhanced {
  padding: 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
}

/* 页面头部增强样式 */
.page-header-enhanced {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 32px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.8);
}

.header-content-grid {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 32px;
  align-items: center;
}

.header-left-section {
  display: flex;
  align-items: center;
  gap: 20px;
}

.back-btn-enhanced {
  color: #6b7280;
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.back-btn-enhanced:hover {
  background: #f3f4f6;
  color: #1890ff;
}

.page-title-enhanced h1 {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  margin: 0 0 8px 0;
  background: linear-gradient(135deg, #1890ff, #667eea);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-title-enhanced p {
  font-size: 16px;
  color: #6b7280;
  margin: 0;
  line-height: 1.5;
}

.header-actions-enhanced {
  display: flex;
  gap: 16px;
  align-items: center;
}

.action-btn {
  padding: 12px 20px;
  border-radius: 10px;
  font-weight: 500;
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.primary-action-btn {
  padding: 12px 24px;
  border-radius: 10px;
  font-weight: 600;
  background: linear-gradient(135deg, #1890ff, #667eea);
  border: none;
  transition: all 0.3s ease;
}

.primary-action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(24, 144, 255, 0.4);
  background: linear-gradient(135deg, #0066cc, #4c51bf);
}

/* 统计卡片区域增强样式 */
.stats-section-enhanced {
  margin-bottom: 32px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
}

.stats-card-enhanced {
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.stats-card-enhanced::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #1890ff, #667eea);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.stats-card-enhanced:hover::before,
.stats-card-enhanced.active-filter::before {
  transform: scaleX(1);
}

.clickable-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  border-color: rgba(24, 144, 255, 0.3);
}

.stats-card-enhanced.active-filter {
  border-color: #1890ff;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f3ff 100%);
  box-shadow: 0 4px 20px rgba(24, 144, 255, 0.2);
}

.stats-content-enhanced {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 24px;
}

.stats-icon-enhanced {
  width: 64px;
  height: 64px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: white;
  flex-shrink: 0;
  position: relative;
  overflow: hidden;
}

.stats-icon-enhanced::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: inherit;
  opacity: 0.1;
  border-radius: inherit;
}

.active-icon {
  background: linear-gradient(135deg, #10b981, #059669);
}

.total-icon {
  background: linear-gradient(135deg, #1890ff, #0066cc);
}

.urgent-icon {
  background: linear-gradient(135deg, #f59e0b, #d97706);
}

.cycle-icon {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.success-icon {
  background: linear-gradient(135deg, #06b6d4, #0891b2);
}

.hot-icon {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.pending-icon {
  background: linear-gradient(135deg, #6b7280, #4b5563);
}

.efficiency-icon {
  background: linear-gradient(135deg, #84cc16, #65a30d);
}

.stats-info-enhanced {
  flex: 1;
  min-width: 0;
}

.stats-number-enhanced {
  font-size: 32px;
  font-weight: 700;
  color: #1f2937;
  margin-bottom: 4px;
  line-height: 1.2;
}

.stats-label-enhanced {
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 8px;
  font-weight: 500;
}

.stats-trend-enhanced {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  font-weight: 500;
}

.stats-trend-enhanced.positive {
  color: #059669;
}

.stats-trend-enhanced.negative {
  color: #dc2626;
}

.stats-trend-enhanced.warning {
  color: #d97706;
}

.trend-period-enhanced {
  color: #9ca3af;
  font-weight: 400;
}

.hot-indicator {
  font-size: 16px;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* 搜索区域增强样式 */
.search-section-enhanced {
  margin-bottom: 32px;
}

.search-card-enhanced {
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 24px;
}

.search-content-enhanced {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search-row-primary {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 24px;
  align-items: center;
}

.search-input-enhanced {
  flex: 1;
  min-width: 0;
}

.smart-search-input {
  border-radius: 12px;
  border: 2px solid #e5e7eb;
  transition: all 0.3s ease;
}

.smart-search-input:focus-within {
  border-color: #1890ff;
  box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
}

.ai-search-btn {
  color: #1890ff;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.ai-search-btn:hover {
  background: #f0f7ff;
  color: #0066cc;
}

.quick-filters-enhanced {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

.filter-select-enhanced {
  min-width: 140px;
  border-radius: 10px;
}

.action-buttons-enhanced {
  display: flex;
  gap: 12px;
  align-items: center;
}

.filter-btn-enhanced,
.ai-filter-btn-enhanced {
  padding: 10px 16px;
  border-radius: 10px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.filter-btn-enhanced:hover,
.ai-filter-btn-enhanced:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 搜索建议样式 */
.search-suggestions {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  max-height: 200px;
  overflow-y: auto;
}

.suggestion-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.suggestion-item:hover {
  background-color: #f3f4f6;
}

.suggestion-type {
  margin-left: auto;
  font-size: 12px;
  color: #9ca3af;
  background: #f3f4f6;
  padding: 2px 8px;
  border-radius: 4px;
}

/* 搜索后缀操作按钮 */
.search-suffix-actions {
  display: flex;
  gap: 4px;
  align-items: center;
}

.ai-search-btn {
  color: #6b7280;
  padding: 4px;
  border-radius: 6px;
  transition: all 0.3s ease;
}

.ai-search-btn:hover {
  background: #f3f4f6;
  color: #1890ff;
}

/* AI推荐区域样式 */
.ai-recommendations-section {
  margin-top: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f3ff 100%);
  border-radius: 12px;
  border: 1px solid rgba(24, 144, 255, 0.2);
}

.recommendations-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
  font-weight: 600;
  color: #1890ff;
}

.recommendations-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.recommendation-tag {
  cursor: pointer;
  transition: all 0.3s ease;
}

.recommendation-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* 工具栏增强样式 */
.toolbar-section-enhanced {
  margin-bottom: 24px;
}

.toolbar-card-enhanced {
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 16px;
}

.toolbar-content-enhanced {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.view-toggle-enhanced {
  border-radius: 8px;
  overflow: hidden;
}

.view-btn-enhanced {
  padding: 8px 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.batch-btn-enhanced {
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.batch-btn-enhanced:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 高级筛选面板增强样式 */
.advanced-filter-section-enhanced {
  margin-bottom: 24px;
}

.advanced-filter-card-enhanced {
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.8);
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  padding: 20px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .header-content-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .stats-grid {
    grid-template-columns: 1fr;
  }

  .search-row-primary {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .quick-filters-enhanced {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-select-enhanced {
    min-width: auto;
  }
}

/* AI助手对话框样式 */
.ai-assistant-dialog :deep(.el-dialog__body) {
  padding: 0;
}

.ai-assistant-content {
  padding: 24px;
}

.assistant-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f3ff 100%);
  border-radius: 12px;
  margin-bottom: 24px;
}

.assistant-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #1890ff, #667eea);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 24px;
}

.assistant-info {
  flex: 1;
}

.assistant-info h3 {
  margin: 0 0 4px 0;
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.assistant-info p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
}

.assistant-status {
  display: flex;
  align-items: center;
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

.feature-card {
  padding: 20px;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
}

.feature-card:hover {
  border-color: #1890ff;
  box-shadow: 0 4px 12px rgba(24, 144, 255, 0.15);
  transform: translateY(-2px);
}

.feature-card .el-icon {
  font-size: 32px;
  color: #1890ff;
  margin-bottom: 12px;
}

.feature-card h4 {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.feature-card p {
  margin: 0;
  font-size: 14px;
  color: #6b7280;
  line-height: 1.5;
}

.analysis-results {
  background: #f8fafc;
  border-radius: 12px;
  padding: 20px;
  border: 1px solid #e5e7eb;
}

.results-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  font-weight: 600;
  color: #1890ff;
}

.results-content p {
  margin: 0 0 16px 0;
  line-height: 1.6;
  color: #374151;
}

/* AI分析结果各部分样式 */
.analysis-summary h4,
.insights-section h4,
.recommendations h4,
.trends-section h4,
.predictions-section h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 8px;
}

.analysis-summary {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.insights-section {
  margin-bottom: 20px;
}

.insights-list {
  margin: 0;
  padding: 0;
  list-style: none;
}

.insights-list li {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 12px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border-left: 3px solid #1890ff;
  color: #374151;
  line-height: 1.5;
}

.insights-list li .el-icon {
  color: #1890ff;
  margin-top: 2px;
  flex-shrink: 0;
}

.recommendations {
  margin-bottom: 20px;
}

.recommendations-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}

.recommendation-card {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  color: #374151;
  line-height: 1.5;
  transition: all 0.3s ease;
}

.recommendation-card:hover {
  border-color: #1890ff;
  box-shadow: 0 2px 8px rgba(24, 144, 255, 0.1);
}

.recommendation-card .el-icon {
  color: #faad14;
  flex-shrink: 0;
}

.trends-section {
  margin-bottom: 20px;
}

.trends-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.trend-tag {
  margin: 0;
}

.predictions-section {
  margin-bottom: 0;
}

.predictions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.prediction-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  text-align: center;
}

.prediction-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.prediction-value {
  font-size: 18px;
  font-weight: 600;
  color: #1890ff;
}

/* 新增分析部分样式 */
.action-items-section,
.market-analysis-section,
.process-optimization-section,
.matching-strategies-section,
.detailed-analysis-section,
.industry-insights-section,
.competitive-analysis-section {
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 1px solid #e5e7eb;
}

.action-items-section h4,
.market-analysis-section h4,
.process-optimization-section h4,
.matching-strategies-section h4,
.detailed-analysis-section h4,
.industry-insights-section h4,
.competitive-analysis-section h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-items-list,
.hot-skills,
.hot-sectors {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

.action-item-tag,
.skill-tag,
.sector-tag {
  margin: 0;
}

.salary-benchmarks h5,
.bottlenecks h5,
.quick-wins h5,
.cost-analysis h5,
.salary-trends h5 {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
}

.salary-grid,
.salary-trends-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 8px;
  margin-bottom: 16px;
}

.salary-item,
.salary-trend-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}

.role-name,
.trend-role {
  font-weight: 500;
  color: #374151;
}

.salary-range,
.trend-value {
  font-weight: 600;
  color: #1890ff;
}

.trend-value.positive {
  color: #10b981;
}

.bottlenecks,
.quick-wins {
  margin-bottom: 16px;
}

.bottleneck-tag {
  margin: 0 4px 4px 0;
}

.quick-win-tag {
  margin: 0 4px 4px 0;
}

.cost-metrics {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
}

.cost-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  text-align: center;
}

.cost-label {
  font-size: 12px;
  color: #6b7280;
  margin-bottom: 4px;
}

.cost-value {
  font-size: 14px;
  font-weight: 600;
  color: #1890ff;
}

.cost-value.savings {
  color: #10b981;
}

.strategies-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.strategy-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  background: white;
  border-radius: 8px;
  border-left: 3px solid #10b981;
  color: #374151;
  line-height: 1.5;
}

.strategy-item .el-icon {
  color: #10b981;
  flex-shrink: 0;
}

.analysis-details {
  padding: 12px;
  background: #f9fafb;
  border-radius: 6px;
}

.analysis-details p {
  margin: 0 0 8px 0;
  line-height: 1.5;
  color: #374151;
}

.analysis-details p:last-child {
  margin-bottom: 0;
}

.position-info {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.position-label {
  font-weight: 500;
  color: #374151;
}

.strengths,
.improvements {
  margin-bottom: 16px;
}

.strength-tag,
.improvement-tag {
  margin: 0 4px 4px 0;
}

/* AI筛选对话框样式 */
.ai-filter-dialog :deep(.el-dialog__body) {
  padding: 24px;
}

.filter-input-section {
  margin-bottom: 24px;
}

.filter-input-section h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.filter-query-input {
  border-radius: 8px;
}

.filter-suggestions {
  margin-bottom: 24px;
}

.filter-suggestions h4 {
  margin: 0 0 12px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.suggestion-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.template-tag {
  cursor: pointer;
  transition: all 0.3s ease;
}

.template-tag:hover {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.filter-results {
  background: #f0f7ff;
  border-radius: 8px;
  padding: 16px;
  border: 1px solid rgba(24, 144, 255, 0.2);
}

.filter-results h4 {
  margin: 0 0 12px 0;
  font-size: 14px;
  font-weight: 600;
  color: #1890ff;
}

.parsed-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

/* 保留原有样式以确保兼容性 */
.position-management {
  min-height: 100vh;
  background: #f5f7fa;
}

.page-header {
  background: white;
  border-bottom: 1px solid #e4e7ed;
  padding: 24px 0;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.back-btn {
  color: #0066cc;
}

.page-title h1 {
  margin: 0 0 4px 0;
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.page-title p {
  margin: 0;
  color: #6b7280;
  font-size: 14px;
}

.stats-section {
  max-width: 1200px;
  margin: 24px auto;
  padding: 0 24px;
}

.stats-card {
  border: none;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.stats-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.stats-card.clickable {
  cursor: pointer;
}

.stats-card.clickable:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.2);
}

.stats-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stats-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
}

.stats-icon.active {
  background: linear-gradient(135deg, #0066cc, #4c51bf);
}

.stats-icon.total {
  background: linear-gradient(135deg, #059669, #10b981);
}

.stats-icon.urgent {
  background: linear-gradient(135deg, #ea580c, #f59e0b);
}

.stats-icon.candidates {
  background: linear-gradient(135deg, #7c3aed, #a855f7);
}

.stats-icon.cycle {
  background: linear-gradient(135deg, #0ea5e9, #3b82f6);
}

.stats-icon.success {
  background: linear-gradient(135deg, #10b981, #059669);
}

.stats-icon.hot {
  background: linear-gradient(135deg, #f59e0b, #ea580c);
}

.stats-icon.pending {
  background: linear-gradient(135deg, #6b7280, #4b5563);
}

.stats-icon.efficiency {
  background: linear-gradient(135deg, #8b5cf6, #7c3aed);
}

.stats-number {
  font-size: 28px;
  font-weight: 700;
  color: #1f2937;
  line-height: 1;
}

.stats-label {
  font-size: 14px;
  color: #6b7280;
  margin-top: 4px;
}

.stats-trend {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  margin-top: 8px;
}

.stats-trend.positive {
  color: #67c23a;
}

.stats-trend.negative {
  color: #f56c6c;
}

.stats-trend.warning {
  color: #e6a23c;
}

.trend-period {
  color: #999;
  margin-left: 4px;
}

.hot-indicator {
  font-size: 14px;
}

/* 搜索和筛选样式 */
.search-section {
  margin-bottom: 24px;
}

.search-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}

.search-left {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.search-input {
  width: 300px;
}

.filter-select {
  width: 150px;
}

.search-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.view-toggle {
  margin-left: 8px;
}

.advanced-filter {
  margin-top: 16px;
  padding-top: 16px;
}

.filter-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  justify-content: flex-end;
}

/* 职位详情对话框样式 */
.position-detail {
  padding: 16px 0;
}

.detail-section {
  margin-bottom: 24px;
}

.detail-section h3 {
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 8px;
}

.position-description {
  background: #f9fafb;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  line-height: 1.6;
  color: #374151;
  min-height: 100px;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.stat-item {
  text-align: center;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #1890ff;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #64748b;
}

.quick-actions {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.quick-actions .el-button {
  justify-content: flex-start;
}

/* 数据可视化样式 */
.charts-section {
  margin-bottom: 24px;
}

.chart-container {
  height: 300px;
  width: 100%;
  min-height: 300px;
}

.chart-container-large {
  height: 400px;
  width: 100%;
  min-height: 400px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-header span {
  font-weight: 600;
  color: #1f2937;
}

/* 图表加载状态 */
.chart-loading {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
  color: #999;
  font-size: 14px;
}

.chart-empty {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 300px;
  color: #999;
  font-size: 14px;
}

.chart-empty .el-icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: #d9d9d9;
}

/* 响应式设计 - 使用响应式框架 */
@media (max-width: 1200px) {
  .position-management {
    padding: 0 var(--space-responsive-md);
  }

  .stats-section .el-col {
    margin-bottom: var(--space-responsive-md);
  }

  .search-left {
    flex-wrap: wrap;
    gap: var(--space-responsive-sm);
  }

  .search-input {
    width: clamp(200px, 40vw, 250px);
    font-size: var(--font-base);
  }

  .filter-select {
    width: clamp(100px, 20vw, 120px);
    font-size: var(--font-sm);
  }
}

@media (max-width: 992px) {
  .stats-section .el-row {
    flex-direction: column;
  }

  .stats-section .el-col {
    width: 100%;
    margin-bottom: var(--space-responsive-md);
  }

  .search-content {
    flex-direction: column;
    gap: var(--space-responsive-md);
    align-items: stretch;
  }

  .search-left {
    justify-content: center;
    flex-wrap: wrap;
  }

  .search-right {
    justify-content: center;
    flex-wrap: wrap;
    gap: var(--space-responsive-sm);
  }

  .charts-section .el-col {
    margin-bottom: var(--space-responsive-lg);
  }

  .chart-container,
  .chart-container-large {
    height: clamp(200px, 30vw, 250px);
    min-height: 200px;
  }

  /* 表格响应式优化 */
  .table-responsive-wrapper {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .el-table {
    min-width: 800px;
    font-size: var(--font-sm);
  }
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    gap: var(--space-responsive-md);
    align-items: stretch;
  }

  .header-left {
    justify-content: center;
    text-align: center;
  }

  .search-input {
    width: 100%;
    font-size: var(--font-base);
    height: var(--btn-height-md);
  }

  .filter-select {
    width: 100%;
    font-size: var(--font-base);
  }

  .advanced-filter .el-col {
    margin-bottom: var(--space-responsive-md);
  }

  .position-card {
    margin-bottom: var(--space-responsive-md);
    padding: var(--space-responsive-md);
  }

  .stats-content {
    padding: var(--space-responsive-md);
  }

  .stats-icon {
    width: var(--icon-lg);
    height: var(--icon-lg);
  }

  .stats-number {
    font-size: var(--font-xl);
  }

  .chart-container,
  .chart-container-large {
    height: clamp(180px, 25vw, 200px);
    min-height: 180px;
  }

  /* 移动端表格优化 */
  .el-table {
    font-size: var(--font-xs);
  }

  .el-table th,
  .el-table td {
    padding: var(--space-responsive-sm);
  }

  /* 操作按钮移动端优化 */
  .action-buttons .el-button {
    min-height: var(--btn-height-sm);
    font-size: var(--font-xs);
    padding: 0 var(--space-responsive-sm);
  }
}

@media (max-width: 480px) {
  .position-management {
    padding: 0 var(--space-responsive-sm);
  }

  .stats-section .el-col {
    padding: 0 var(--space-responsive-xs);
  }

  .search-left {
    flex-direction: column;
    gap: var(--space-responsive-sm);
  }

  .search-right {
    flex-direction: column;
    gap: var(--space-responsive-sm);
  }

  .view-toggle {
    width: 100%;
  }

  .el-table {
    font-size: var(--font-xs);
    min-width: 600px;
  }

  .position-card {
    padding: var(--space-responsive-sm);
  }

  .chart-container,
  .chart-container-large {
    height: clamp(150px, 20vw, 180px);
    min-height: 150px;
  }

  .stats-icon {
    width: var(--icon-base);
    height: var(--icon-base);
  }

  .stats-number {
    font-size: var(--font-lg);
  }

  .stats-label {
    font-size: var(--font-xs);
  }

  /* 超小屏幕按钮优化 */
  .action-buttons .el-button {
    min-height: var(--btn-height-sm);
    font-size: var(--font-xs);
    padding: 0 var(--space-responsive-xs);
  }

  /* 表格在超小屏幕的优化 */
  .table-responsive-wrapper {
    border-radius: var(--radius-md);
    box-shadow: var(--shadow-sm);
  }
}

/* 大屏幕优化 */
@media (min-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }

  .search-input {
    width: 300px;
  }

  .filter-select {
    width: 140px;
  }

  .chart-container {
    height: 350px;
  }

  .chart-container-large {
    height: 400px;
  }

  .el-table {
    font-size: var(--font-base);
  }

  .action-buttons .el-button {
    min-height: var(--btn-height-md);
    font-size: var(--font-base);
  }
}

.filter-section,
.positions-section {
  max-width: 1200px;
  margin: 24px auto;
  padding: 0 24px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: 600;
}

.filter-actions {
  display: flex;
  gap: 12px;
}

.position-name {
  display: flex;
  align-items: center;
  gap: 8px;
}

.positions-grid {
  margin-top: 16px;
}

.position-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid #e5e7eb;
}

.position-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #0066cc;
}

.position-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.position-title h4 {
  margin: 0 0 4px 0;
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.position-info {
  margin-bottom: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.info-item .label {
  font-size: 14px;
  color: #6b7280;
}

.info-item .value {
  font-weight: 500;
  color: #1f2937;
}

.position-actions {
  display: flex;
  gap: 8px;
}

.pagination-section {
  margin-top: 24px;
  display: flex;
  justify-content: center;
}

/* 导出对话框样式 - 完全重写避免重叠问题 */
.export-options {
  padding: 24px 0 !important;
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif !important;
}

/* 自定义导出格式选择组 */
.custom-export-format-group {
  display: flex !important;
  flex-direction: column !important;
  gap: 0 !important;
  margin-bottom: 32px !important;
  padding: 0 8px !important;
}

/* 自定义格式选项 */
.custom-format-option {
  position: relative !important;
  display: flex !important;
  align-items: center !important;
  gap: 20px !important;
  padding: 24px !important;
  border: 2px solid #e5e7eb !important;
  border-radius: 12px !important;
  min-height: 90px !important;
  background: #ffffff !important;
  cursor: pointer !important;
  transition: all 0.3s ease !important;
  margin-bottom: 16px !important;
  box-sizing: border-box !important;
}

/* 悬停效果 */
.custom-format-option:hover {
  border-color: #0066cc !important;
  box-shadow: 0 2px 8px rgba(0, 102, 204, 0.1) !important;
}

/* 选中状态 */
.custom-format-option.selected {
  border-color: #0066cc !important;
  background: #f0f7ff !important;
  box-shadow: 0 2px 8px rgba(0, 102, 204, 0.15) !important;
}

/* 自定义单选按钮指示器 */
.custom-radio-indicator {
  position: absolute !important;
  top: 24px !important;
  left: 24px !important;
  width: 16px !important;
  height: 16px !important;
  border-radius: 50% !important;
  transition: all 0.3s ease !important;
  z-index: 10 !important;
}

.export-info {
  margin-bottom: 28px !important;
  text-align: center !important;
  padding: 0 8px !important;
}

.export-info p {
  margin: 12px 0 !important;
  color: #374151 !important;
  line-height: 1.6 !important;
  font-size: 14px !important;
}

.export-note {
  font-weight: 500 !important;
  color: #1f2937 !important;
  margin-top: 16px !important;
}

.export-format-group {
  display: flex !important;
  flex-direction: column !important;
  gap: 24px !important;
  margin-bottom: 32px !important;
  padding: 0 8px !important;
}

.export-format-option {
  width: 100% !important;
  margin: 0 !important;
  position: relative !important;
  display: block !important;
}

/* 强制修复单选按钮与文字重叠问题 */
.export-format-option :deep(.el-radio__input) {
  position: absolute !important;
  top: 26px !important;
  left: 26px !important;
  z-index: 10 !important;
  margin: 0 !important;
  transform: none !important;
}

.export-format-option :deep(.el-radio__label) {
  padding-left: 0 !important;
  padding-right: 0 !important;
  width: 100% !important;
  display: block !important;
}

.format-option {
  display: flex !important;
  align-items: center !important;
  gap: 24px !important;
  padding: 26px 26px 26px 76px !important; /* 为单选按钮留出更多空间 */
  border: 2px solid #e5e7eb !important;
  border-radius: 12px !important;
  transition: all 0.3s ease !important;
  cursor: pointer !important;
  min-height: 92px !important;
  box-sizing: border-box !important;
  background: #ffffff !important;
}

.export-format-option.is-checked .format-option {
  border-color: #0066cc !important;
  background: #f0f7ff !important;
  box-shadow: 0 2px 8px rgba(0, 102, 204, 0.15) !important;
}

.format-icon {
  width: 56px !important;
  height: 56px !important;
  border-radius: 12px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  font-size: 28px !important;
  color: white !important;
  flex-shrink: 0 !important;
}

.format-icon.excel {
  background: linear-gradient(135deg, #059669, #10b981) !important;
}

.format-icon.csv {
  background: linear-gradient(135deg, #0066cc, #4c51bf) !important;
}

.format-info {
  flex: 1 !important;
  min-width: 0 !important; /* 防止文字溢出 */
  padding-right: 12px !important;
}

.format-name {
  font-size: 17px !important;
  font-weight: 600 !important;
  color: #1f2937 !important;
  margin-bottom: 8px !important;
  line-height: 1.4 !important;
  word-wrap: break-word !important;
}

.format-desc {
  font-size: 14px !important;
  color: #6b7280 !important;
  line-height: 1.5 !important;
  word-wrap: break-word !important;
}

.export-settings {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 20px;
  background: #f8fafc;
  border-radius: 12px;
  margin-top: 4px;
}

.export-settings .el-checkbox {
  margin: 0;
  line-height: 1.6;
}

/* 修复复选框文字对齐 */
.export-settings .el-checkbox :deep(.el-checkbox__label) {
  font-size: 14px;
  color: #374151;
  padding-left: 8px;
}

/* 对话框全局优化 */
.el-dialog {
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
}

.el-dialog__header {
  padding: 24px 24px 16px;
}

.el-dialog__title {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
  line-height: 1.4;
}

.el-dialog__body {
  padding: 8px 24px 24px;
}

.el-dialog__footer {
  padding: 16px 24px 24px;
  text-align: right;
}

/* 修复UI重叠问题 */
.header-section {
  position: relative;
  z-index: 10;
  margin-bottom: 20px;
}

.stats-section {
  position: relative;
  z-index: 9;
  margin-bottom: 20px;
}

.filter-section {
  position: relative;
  z-index: 8;
  margin-bottom: 20px;
}

.toolbar-section-enhanced {
  position: relative;
  z-index: 7;
  margin-bottom: 20px;
}

.advanced-filter-section-enhanced {
  position: relative;
  z-index: 6;
  margin-bottom: 20px;
}

.positions-section {
  position: relative;
  z-index: 5;
}

/* 修复按钮和文字重叠 */
.action-btn {
  margin-right: 12px !important;
  margin-bottom: 8px !important;
  white-space: nowrap !important;
  min-width: auto !important;
  padding: 8px 16px !important;
  line-height: 1.4 !important;
}

.action-btn .el-icon {
  margin-right: 6px !important;
}

/* 修复工具栏按钮重叠 */
.toolbar-content-enhanced {
  display: flex !important;
  justify-content: space-between !important;
  align-items: center !important;
  flex-wrap: wrap !important;
  gap: 12px !important;
  padding: 16px !important;
}

.toolbar-left-enhanced,
.toolbar-right-enhanced {
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
  flex-wrap: wrap !important;
}

.view-btn-enhanced {
  margin-right: 0 !important;
  white-space: nowrap !important;
}

.batch-btn-enhanced {
  white-space: nowrap !important;
  min-width: auto !important;
}

/* 修复表格操作按钮重叠 */
.el-table .el-button {
  margin-right: 8px !important;
  margin-bottom: 4px !important;
  white-space: nowrap !important;
}

.el-table .el-button:last-child {
  margin-right: 0 !important;
}

/* 修复推荐标签重叠 */
.recommendations-list {
  display: flex !important;
  flex-wrap: wrap !important;
  gap: 8px !important;
  margin-top: 12px !important;
}

.recommendation-tag {
  margin-right: 0 !important;
  margin-bottom: 0 !important;
  white-space: nowrap !important;
  cursor: pointer !important;
}

/* 响应式设计优化 */
@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .action-btn {
    margin-right: 8px !important;
    margin-bottom: 8px !important;
    padding: 6px 12px !important;
    font-size: 14px !important;
  }

  .toolbar-content-enhanced {
    flex-direction: column !important;
    align-items: stretch !important;
    gap: 16px !important;
  }

  .toolbar-left-enhanced,
  .toolbar-right-enhanced {
    justify-content: center !important;
  }

  .stats-section,
  .filter-section,
  .positions-section {
    padding: 0 16px;
  }

  .positions-grid .el-col {
    margin-bottom: 16px;
  }

  /* 移动端导出对话框优化 */
  .el-dialog {
    width: 90% !important;
    margin: 5vh auto;
  }

  .format-option {
    padding: 16px 16px 16px 50px;
    min-height: 70px;
  }

  .format-icon {
    width: 44px;
    height: 44px;
    font-size: 22px;
  }

  .format-name {
    font-size: 15px;
  }

  .format-desc {
    font-size: 12px;
  }

  .export-format-option :deep(.el-radio__input) {
    top: 16px;
    left: 16px;
  }

  .export-settings {
    padding: 16px;
  }

  /* 移动端表格操作按钮优化 */
  .el-table .el-button {
    margin-right: 4px !important;
    margin-bottom: 4px !important;
    padding: 4px 8px !important;
    font-size: 12px !important;
  }

  .recommendations-list {
    gap: 6px !important;
  }

  .recommendation-tag {
    font-size: 12px !important;
    padding: 4px 8px !important;
  }
}

/* 批量导入对话框样式 */
.batch-import-content {
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
}

.import-step-content {
  min-height: 300px;
  padding: 20px 0;
}

.upload-area {
  margin-bottom: 30px;
}

.upload-dragger {
  width: 100%;
}

.upload-dragger .el-upload-dragger {
  width: 100%;
  height: 180px;
  border: 2px dashed #d9d9d9;
  border-radius: 8px;
  background: #fafafa;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.upload-dragger .el-upload-dragger:hover {
  border-color: #1890ff;
  background: #f0f7ff;
}

.upload-dragger .el-icon--upload {
  font-size: 48px;
  color: #c0c4cc;
  margin-bottom: 16px;
}

.upload-dragger .el-upload__text {
  color: #606266;
  font-size: 16px;
  margin-bottom: 8px;
}

.upload-dragger .el-upload__text em {
  color: #1890ff;
  font-style: normal;
  text-decoration: underline;
}

.upload-dragger .el-upload__tip {
  color: #999;
  font-size: 14px;
  margin-top: 8px;
}

.template-download {
  text-align: center;
}

.template-section {
  padding: 20px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e4e7ed;
}

.template-section h4 {
  margin: 0 0 8px 0;
  color: #1f2937;
  font-size: 16px;
  font-weight: 600;
}

.template-section p {
  margin: 0 0 16px 0;
  color: #6b7280;
  font-size: 14px;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.preview-header h4 {
  margin: 0;
  color: #1f2937;
  font-size: 16px;
  font-weight: 600;
}

.import-result {
  text-align: center;
}

.result-stats {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin: 20px 0;
}

.result-stats .el-statistic {
  text-align: center;
}

.dialog-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 模板选择对话框样式 */
:deep(.template-selection-dialog) {
  .el-message-box__content {
    max-height: 500px;
    overflow-y: auto;
  }
}

/* 预览对话框样式 */
:deep(.preview-dialog) {
  .el-message-box {
    width: 700px;
  }

  .el-message-box__content {
    max-height: 600px;
    overflow-y: auto;
  }
}

/* 时间安排对话框样式 */
:deep(.schedule-dialog) {
  .el-message-box {
    width: 600px;
  }

  .el-message-box__content {
    max-height: 500px;
    overflow-y: auto;
  }
}
</style>
