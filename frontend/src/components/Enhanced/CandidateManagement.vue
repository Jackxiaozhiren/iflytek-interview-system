<template>
  <div class="candidate-management">
    <!-- 页面头部 -->
    <div class="page-header">
      <div class="header-content">
        <div class="header-left">
          <h1>候选人管理</h1>
          <p>管理和维护候选人信息，支持批量导入和数据分析</p>
        </div>
        <div class="header-actions">
          <el-button @click="showBatchImportDialog" type="primary">
            <el-icon><Upload /></el-icon>
            批量导入
          </el-button>
          <el-button @click="addCandidate">
            <el-icon><Plus /></el-icon>
            添加候选人
          </el-button>
          <el-button @click="exportCandidates">
            <el-icon><Download /></el-icon>
            导出数据
          </el-button>
        </div>
      </div>
    </div>

    <!-- 统计卡片 -->
    <div class="stats-section">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><User /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ candidateStats.total }}</div>
            <div class="stat-label">总候选人数</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><Check /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ candidateStats.passed }}</div>
            <div class="stat-label">已通过</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">
            <el-icon><Clock /></el-icon>
          </div>
          <div class="stat-content">
            <div class="stat-value">{{ candidateStats.pending }}</div>
            <div class="stat-label">待面试</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 搜索和筛选 -->
    <div class="filter-section">
      <div class="filter-content">
        <el-input
          v-model="searchQuery"
          placeholder="搜索候选人姓名、邮箱或电话"
          style="width: 300px"
          clearable
        >
          <template #prefix>
            <el-icon><Search /></el-icon>
          </template>
        </el-input>
        <el-select v-model="selectedDomain" placeholder="技术领域" style="width: 150px">
          <el-option label="全部" value="all" />
          <el-option label="AI技术" value="ai" />
          <el-option label="大数据" value="bigdata" />
          <el-option label="IoT物联网" value="iot" />
        </el-select>
        <el-select v-model="selectedStatus" placeholder="状态" style="width: 120px">
          <el-option label="全部" value="all" />
          <el-option label="待面试" value="pending" />
          <el-option label="已通过" value="passed" />
          <el-option label="未通过" value="failed" />
        </el-select>
      </div>
    </div>

    <!-- 候选人列表 -->
    <div class="candidates-section">
      <el-table :data="filteredCandidates" style="width: 100%">
        <el-table-column prop="name" label="姓名" width="120" />
        <el-table-column prop="email" label="邮箱" width="200" />
        <el-table-column prop="phone" label="电话" width="130" />
        <el-table-column prop="experience" label="经验" width="100" />
        <el-table-column prop="domain" label="技术领域" width="120">
          <template #default="scope">
            <el-tag :type="getDomainTagType(scope.row.domain)">
              {{ getDomainLabel(scope.row.domain) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="scope">
            <el-tag :type="getStatusTagType(scope.row.status)">
              {{ getStatusLabel(scope.row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="150" />
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <div class="action-buttons">
              <el-button size="small" @click="viewCandidate(scope.row)">查看</el-button>
              <el-button size="small" type="primary" @click="editCandidate(scope.row)">编辑</el-button>
              <el-button size="small" type="danger" @click="deleteCandidate(scope.row)">删除</el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 批量导入对话框 -->
    <el-dialog
      v-model="batchImportVisible"
      title="批量导入候选人"
      width="600px"
      :close-on-click-modal="false"
    >
      <div class="import-content">
        <div class="import-steps">
          <el-steps :active="importStep" finish-status="success">
            <el-step title="选择文件" />
            <el-step title="数据预览" />
            <el-step title="导入完成" />
          </el-steps>
        </div>

        <!-- 步骤1: 文件选择 -->
        <div v-if="importStep === 0" class="step-content">
          <div class="upload-section">
            <el-upload
              ref="uploadRef"
              :auto-upload="false"
              :on-change="handleFileChange"
              :before-upload="beforeUpload"
              accept=".xlsx,.xls,.csv"
              drag
            >
              <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
              <div class="el-upload__text">
                将文件拖到此处，或<em>点击上传</em>
              </div>
              <template #tip>
                <div class="el-upload__tip">
                  支持 Excel (.xlsx, .xls) 和 CSV (.csv) 格式，文件大小不超过10MB
                </div>
              </template>
            </el-upload>
          </div>
          
          <div class="template-section">
            <h4>数据格式要求：</h4>
            <p>请确保您的文件包含以下列（按顺序）：</p>
            <ul>
              <li>姓名 (必填)</li>
              <li>邮箱 (必填)</li>
              <li>电话 (必填)</li>
              <li>工作经验 (如：3-5年)</li>
              <li>技术领域 (ai/bigdata/iot)</li>
            </ul>
            <el-button @click="downloadTemplate" type="text">
              <el-icon><Download /></el-icon>
              下载模板文件
            </el-button>
          </div>
        </div>

        <!-- 步骤2: 数据预览 -->
        <div v-if="importStep === 1" class="step-content">
          <div class="preview-info">
            <p>共检测到 <strong>{{ previewData.length }}</strong> 条候选人记录</p>
            <p v-if="validationErrors.length > 0" class="error-info">
              发现 <strong>{{ validationErrors.length }}</strong> 条数据错误，请修正后重新上传
            </p>
          </div>
          
          <el-table :data="previewData.slice(0, 10)" style="width: 100%" max-height="300">
            <el-table-column prop="name" label="姓名" width="100" />
            <el-table-column prop="email" label="邮箱" width="180" />
            <el-table-column prop="phone" label="电话" width="120" />
            <el-table-column prop="experience" label="经验" width="80" />
            <el-table-column prop="domain" label="技术领域" width="100" />
          </el-table>
          
          <div v-if="previewData.length > 10" class="preview-more">
            <p>仅显示前10条记录，共{{ previewData.length }}条</p>
          </div>

          <!-- 验证错误列表 -->
          <div v-if="validationErrors.length > 0" class="validation-errors">
            <h4>数据验证错误：</h4>
            <ul>
              <li v-for="error in validationErrors.slice(0, 5)" :key="error.row">
                第{{ error.row }}行：{{ error.message }}
              </li>
            </ul>
            <p v-if="validationErrors.length > 5">
              还有{{ validationErrors.length - 5 }}个错误...
            </p>
          </div>
        </div>

        <!-- 步骤3: 导入完成 -->
        <div v-if="importStep === 2" class="step-content">
          <div class="import-result">
            <el-result
              :icon="importResult.success ? 'success' : 'warning'"
              :title="importResult.title"
              :sub-title="importResult.message"
            >
              <template #extra>
                <div class="result-stats">
                  <div class="stats-grid">
                    <div class="stat-item">
                      <span class="stat-label">总计</span>
                      <span class="stat-value">{{ importResult.totalCount }}</span>
                    </div>
                    <div class="stat-item success">
                      <span class="stat-label">成功</span>
                      <span class="stat-value">{{ importResult.successCount }}</span>
                    </div>
                    <div v-if="importResult.failCount > 0" class="stat-item error">
                      <span class="stat-label">失败</span>
                      <span class="stat-value">{{ importResult.failCount }}</span>
                    </div>
                  </div>

                  <!-- 失败详情 -->
                  <div v-if="importResult.failures.length > 0" class="failure-details">
                    <el-button @click="showFailureDetails = !showFailureDetails" type="text">
                      {{ showFailureDetails ? '隐藏' : '查看' }}失败详情
                    </el-button>

                    <div v-if="showFailureDetails" class="failure-list">
                      <el-table :data="importResult.failures.slice(0, 10)" size="small" style="margin-top: 10px;">
                        <el-table-column prop="row" label="行号" width="60" />
                        <el-table-column prop="data.name" label="姓名" width="100" />
                        <el-table-column prop="data.email" label="邮箱" width="180" />
                        <el-table-column prop="reason" label="失败原因" />
                      </el-table>
                      <p v-if="importResult.failures.length > 10" class="more-failures">
                        还有 {{ importResult.failures.length - 10 }} 条失败记录...
                      </p>
                    </div>
                  </div>
                </div>
              </template>
            </el-result>
          </div>
        </div>
      </div>

      <template #footer>
        <span class="dialog-footer">
          <el-button @click="batchImportVisible = false">取消</el-button>
          <el-button v-if="importStep === 0" @click="nextStep" type="primary" :disabled="!selectedFile">
            下一步
          </el-button>
          <el-button v-if="importStep === 1" @click="prevStep">上一步</el-button>
          <el-button 
            v-if="importStep === 1" 
            @click="startImport" 
            type="primary" 
            :disabled="validationErrors.length > 0"
            :loading="importing"
          >
            开始导入
          </el-button>
          <el-button v-if="importStep === 2" @click="finishImport" type="primary">
            完成
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, ElLoading } from 'element-plus'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import {
  User, Plus, Upload, Download, Search, Check, Clock,
  UploadFilled
} from '@element-plus/icons-vue'

// 响应式数据
const searchQuery = ref('')
const selectedDomain = ref('all')
const selectedStatus = ref('all')
const batchImportVisible = ref(false)
const importStep = ref(0)
const selectedFile = ref(null)
const previewData = ref([])
const validationErrors = ref([])
const importing = ref(false)
const showFailureDetails = ref(false)

// 候选人统计
const candidateStats = reactive({
  total: 2,
  passed: 1,
  pending: 1
})

// 候选人数据
const candidates = ref([
  {
    id: 1,
    name: '张三',
    email: 'zhangsan@example.com',
    phone: '13800138001',
    experience: '3-5年',
    domain: 'ai',
    status: 'passed',
    createTime: '2025-07-20'
  },
  {
    id: 2,
    name: '李四',
    email: 'lisi@example.com',
    phone: '13800138002',
    experience: '1-3年',
    domain: 'bigdata',
    status: 'pending',
    createTime: '2025-07-21'
  }
])

// 导入结果
const importResult = reactive({
  success: false,
  title: '',
  message: '',
  successCount: 0,
  failCount: 0,
  totalCount: 0,
  failures: []
})

// 计算属性
const filteredCandidates = computed(() => {
  let result = candidates.value

  if (searchQuery.value) {
    result = result.filter(candidate => 
      candidate.name.includes(searchQuery.value) ||
      candidate.email.includes(searchQuery.value) ||
      candidate.phone.includes(searchQuery.value)
    )
  }

  if (selectedDomain.value !== 'all') {
    result = result.filter(candidate => candidate.domain === selectedDomain.value)
  }

  if (selectedStatus.value !== 'all') {
    result = result.filter(candidate => candidate.status === selectedStatus.value)
  }

  return result
})

// 方法
const getDomainLabel = (domain) => {
  const labels = {
    'ai': 'AI技术',
    'bigdata': '大数据',
    'iot': 'IoT物联网'
  }
  return labels[domain] || domain
}

const getDomainTagType = (domain) => {
  const types = {
    'ai': 'primary',
    'bigdata': 'success',
    'iot': 'warning'
  }
  return types[domain] || 'info'
}

const getStatusLabel = (status) => {
  const labels = {
    'pending': '待面试',
    'passed': '已通过',
    'failed': '未通过'
  }
  return labels[status] || status
}

const getStatusTagType = (status) => {
  const types = {
    'pending': 'warning',
    'passed': 'success',
    'failed': 'danger'
  }
  return types[status] || 'info'
}

// 显示批量导入对话框
const showBatchImportDialog = () => {
  batchImportVisible.value = true
  importStep.value = 0
  selectedFile.value = null
  previewData.value = []
  validationErrors.value = []
}

// 文件选择处理
const handleFileChange = (file) => {
  selectedFile.value = file
}

// 文件上传前验证
const beforeUpload = (file) => {
  const isValidType = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
                     file.type === 'application/vnd.ms-excel' ||
                     file.type === 'text/csv'

  if (!isValidType) {
    ElMessage.error('只支持 Excel 和 CSV 格式的文件!')
    return false
  }

  const isLt10M = file.size / 1024 / 1024 < 10
  if (!isLt10M) {
    ElMessage.error('文件大小不能超过 10MB!')
    return false
  }

  return false // 阻止自动上传
}

// 下一步
const nextStep = async () => {
  if (!selectedFile.value) {
    ElMessage.error('请先选择文件')
    return
  }

  try {
    const loadingInstance = ElLoading.service({
      lock: true,
      text: '正在解析文件...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    await parseFile(selectedFile.value.raw)
    importStep.value = 1

    loadingInstance.close()
  } catch (error) {
    console.error('文件解析失败:', error)
    ElMessage.error('文件解析失败，请检查文件格式')
  }
}

// 上一步
const prevStep = () => {
  importStep.value = 0
}

// 解析文件
const parseFile = async (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        let data = []

        if (file.type === 'text/csv') {
          // 解析CSV
          const text = e.target.result
          const lines = text.split('\n')
          const headers = lines[0].split(',')

          for (let i = 1; i < lines.length; i++) {
            if (lines[i].trim()) {
              const values = lines[i].split(',')
              data.push({
                name: values[0]?.trim() || '',
                email: values[1]?.trim() || '',
                phone: values[2]?.trim() || '',
                experience: values[3]?.trim() || '',
                domain: values[4]?.trim() || ''
              })
            }
          }
        } else {
          // 解析Excel
          const workbook = XLSX.read(e.target.result, { type: 'binary' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

          for (let i = 1; i < jsonData.length; i++) {
            if (jsonData[i] && jsonData[i].length > 0) {
              data.push({
                name: jsonData[i][0] || '',
                email: jsonData[i][1] || '',
                phone: jsonData[i][2] || '',
                experience: jsonData[i][3] || '',
                domain: jsonData[i][4] || ''
              })
            }
          }
        }

        previewData.value = data
        validateData(data)
        resolve()
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => reject(new Error('文件读取失败'))

    if (file.type === 'text/csv') {
      reader.readAsText(file, 'UTF-8')
    } else {
      reader.readAsBinaryString(file)
    }
  })
}

// 数据验证
const validateData = (data) => {
  const errors = []

  data.forEach((item, index) => {
    const row = index + 2 // Excel行号从2开始（第1行是标题）

    if (!item.name) {
      errors.push({ row, message: '姓名不能为空' })
    }

    if (!item.email) {
      errors.push({ row, message: '邮箱不能为空' })
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(item.email)) {
      errors.push({ row, message: '邮箱格式不正确' })
    }

    if (!item.phone) {
      errors.push({ row, message: '电话不能为空' })
    } else if (!/^1[3-9]\d{9}$/.test(item.phone)) {
      errors.push({ row, message: '电话格式不正确' })
    }

    if (item.domain && !['ai', 'bigdata', 'iot'].includes(item.domain)) {
      errors.push({ row, message: '技术领域必须是 ai、bigdata 或 iot' })
    }
  })

  validationErrors.value = errors
}

// 开始导入
const startImport = async () => {
  if (validationErrors.value.length > 0) {
    ElMessage.error('请先修正数据错误')
    return
  }

  importing.value = true
  const totalCount = previewData.value.length
  let processedCount = 0
  let successCount = 0
  let failCount = 0
  const failures = []

  try {
    const loadingInstance = ElLoading.service({
      lock: true,
      text: '正在导入候选人数据... (0%)',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    // 批量处理，每次处理10条记录
    const batchSize = 10
    for (let i = 0; i < previewData.value.length; i += batchSize) {
      const batch = previewData.value.slice(i, i + batchSize)

      // 处理当前批次
      for (const item of batch) {
        try {
          // 检查邮箱是否已存在
          const existingCandidate = candidates.value.find(c => c.email === item.email)
          if (existingCandidate) {
            failures.push({
              row: i + batch.indexOf(item) + 2,
              data: item,
              reason: '邮箱已存在'
            })
            failCount++
          } else {
            const newCandidate = {
              id: Date.now() + Math.random() + Math.random(),
              name: item.name,
              email: item.email,
              phone: item.phone,
              experience: item.experience || '未知',
              domain: item.domain || 'ai',
              status: 'pending',
              createTime: new Date().toISOString().slice(0, 10)
            }

            candidates.value.push(newCandidate)
            successCount++
          }
        } catch (error) {
          failures.push({
            row: i + batch.indexOf(item) + 2,
            data: item,
            reason: error.message || '未知错误'
          })
          failCount++
        }

        processedCount++

        // 更新进度
        const progress = Math.round((processedCount / totalCount) * 100)
        loadingInstance.setText(`正在导入候选人数据... (${progress}%)`)
      }

      // 批次间延迟，避免界面卡顿
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    // 更新统计
    candidateStats.total += successCount
    candidateStats.pending += successCount

    // 设置导入结果
    importResult.success = failCount === 0
    importResult.title = importResult.success ? '导入成功' : '部分导入成功'
    importResult.message = `共处理 ${totalCount} 条记录，成功导入 ${successCount} 条${failCount > 0 ? `，失败 ${failCount} 条` : ''}`
    importResult.successCount = successCount
    importResult.failCount = failCount
    importResult.totalCount = totalCount
    importResult.failures = failures

    importStep.value = 2
    loadingInstance.close()

    // 显示详细结果
    if (failCount > 0) {
      ElMessage.warning(`导入完成，但有 ${failCount} 条记录失败`)
    } else {
      ElMessage.success(`成功导入 ${successCount} 条候选人记录`)
    }

  } catch (error) {
    console.error('导入失败:', error)
    ElMessage.error('导入过程中发生错误: ' + error.message)
  } finally {
    importing.value = false
  }
}

// 完成导入
const finishImport = () => {
  batchImportVisible.value = false
  ElMessage.success('候选人数据导入完成')
}

// 下载模板文件
const downloadTemplate = () => {
  try {
    // 创建模板数据
    const templateData = [
      ['姓名', '邮箱', '电话', '工作经验', '技术领域'],
      ['张三', 'zhangsan@example.com', '13800138001', '3-5年', 'ai'],
      ['李四', 'lisi@example.com', '13800138002', '1-3年', 'bigdata'],
      ['王五', 'wangwu@example.com', '13800138003', '5-8年', 'iot']
    ]

    // 创建工作簿
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.aoa_to_sheet(templateData)

    // 设置列宽
    worksheet['!cols'] = [
      { width: 12 }, // 姓名
      { width: 25 }, // 邮箱
      { width: 15 }, // 电话
      { width: 12 }, // 工作经验
      { width: 12 }  // 技术领域
    ]

    XLSX.utils.book_append_sheet(workbook, worksheet, '候选人模板')

    // 生成Excel文件
    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
      compression: true
    })

    const blob = new Blob([excelBuffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    })

    saveAs(blob, '候选人导入模板.xlsx')

    ElMessage.success('模板文件下载成功')

  } catch (error) {
    console.error('模板下载失败:', error)
    ElMessage.error('模板文件下载失败')
  }
}

// 其他操作方法
const addCandidate = () => {
  ElMessage.info('添加候选人功能开发中...')
}

const exportCandidates = () => {
  ElMessage.info('导出候选人数据功能开发中...')
}

const viewCandidate = (candidate) => {
  ElMessage.info(`查看候选人：${candidate.name}`)
}

const editCandidate = (candidate) => {
  ElMessage.info(`编辑候选人：${candidate.name}`)
}

const deleteCandidate = async (candidate) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除候选人 "${candidate.name}" 吗？`,
      '确认删除',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )

    const index = candidates.value.findIndex(c => c.id === candidate.id)
    if (index > -1) {
      candidates.value.splice(index, 1)
      candidateStats.total--
      if (candidate.status === 'pending') candidateStats.pending--
      if (candidate.status === 'passed') candidateStats.passed--

      ElMessage.success('删除成功')
    }
  } catch {
    // 用户取消删除
  }
}
</script>

<style scoped>
.candidate-management {
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
}

.page-header {
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-left h1 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 1.75rem;
  font-weight: 700;
}

.header-left p {
  margin: 0;
  color: #64748b;
}

.header-actions {
  display: flex;
  gap: 12px;
}

.stats-section {
  margin-bottom: 24px;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: linear-gradient(135deg, #1890ff 0%, #0066cc 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: #2c3e50;
  margin-bottom: 4px;
}

.stat-label {
  color: #64748b;
  font-size: 14px;
}

.filter-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.filter-content {
  display: flex;
  gap: 16px;
  align-items: center;
}

.candidates-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

/* 表格操作按钮样式 */
.action-buttons {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.action-buttons .el-button {
  margin: 0;
}

.import-content {
  padding: 20px 0;
}

.import-steps {
  margin-bottom: 30px;
}

.step-content {
  min-height: 300px;
}

.upload-section {
  margin-bottom: 30px;
}

.template-section h4 {
  color: #2c3e50;
  margin-bottom: 12px;
}

.template-section ul {
  margin: 12px 0;
  padding-left: 20px;
}

.template-section li {
  margin-bottom: 8px;
  color: #64748b;
}

.preview-info {
  margin-bottom: 20px;
  padding: 16px;
  background: #f6f8fa;
  border-radius: 8px;
}

.error-info {
  color: #ff4d4f;
  margin-top: 8px;
}

.preview-more {
  margin-top: 12px;
  text-align: center;
  color: #64748b;
}

.validation-errors {
  margin-top: 20px;
  padding: 16px;
  background: #fff2f0;
  border-radius: 8px;
  border-left: 4px solid #ff4d4f;
}

.validation-errors h4 {
  color: #ff4d4f;
  margin-bottom: 12px;
}

.validation-errors ul {
  margin: 0;
  padding-left: 20px;
}

.validation-errors li {
  color: #ff4d4f;
  margin-bottom: 8px;
}

.import-result {
  text-align: center;
}

.result-stats p {
  margin: 8px 0;
  font-size: 16px;
}

/* 增强的导入结果样式 */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 2px solid #e5e7eb;
}

.stat-item.success {
  background: #f0f9ff;
  border-color: #10b981;
}

.stat-item.error {
  background: #fef2f2;
  border-color: #ef4444;
}

.stat-label {
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 24px;
  font-weight: 600;
  color: #1f2937;
}

.stat-item.success .stat-value {
  color: #10b981;
}

.stat-item.error .stat-value {
  color: #ef4444;
}

.failure-details {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
}

.failure-list {
  margin-top: 10px;
}

.more-failures {
  margin-top: 10px;
  color: #6b7280;
  font-size: 14px;
  text-align: center;
}

/* 响应式设计 - 使用响应式框架 */
@media (max-width: 1200px) {
  .page-header {
    padding: var(--space-responsive-lg);
  }

  .header-actions {
    flex-wrap: wrap;
    gap: var(--space-responsive-sm);
  }

  .header-actions .el-button {
    min-width: 120px;
    font-size: var(--font-sm);
  }
}

@media (max-width: 992px) {
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--space-responsive-md);
  }

  .filter-content {
    flex-wrap: wrap;
    gap: var(--space-responsive-sm);
  }

  /* 表格响应式优化 */
  .candidates-section {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }

  .el-table {
    min-width: 800px;
    font-size: var(--font-sm);
  }
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: var(--space-responsive-md);
    align-items: flex-start;
  }

  .filter-content {
    flex-direction: column;
    align-items: stretch;
    gap: var(--space-responsive-md);
  }

  .stats-grid {
    grid-template-columns: 1fr;
    gap: var(--space-responsive-md);
  }

  .header-actions {
    width: 100%;
    justify-content: center;
    flex-direction: column;
  }

  .header-actions .el-button {
    width: 100%;
    max-width: 280px;
    height: var(--btn-height-md);
  }

  .el-table {
    font-size: var(--font-xs);
  }

  .el-table th,
  .el-table td {
    padding: var(--space-responsive-sm);
  }

  .action-buttons .el-button {
    min-height: var(--btn-height-sm);
    font-size: var(--font-xs);
    padding: 0 var(--space-responsive-sm);
  }

  /* 批量导入对话框移动端优化 */
  .el-dialog {
    width: 95vw !important;
    margin: 5vh auto !important;
  }

  .import-content {
    padding: var(--space-responsive-md) 0;
  }

  .step-content {
    min-height: 250px;
  }

  .upload-section {
    margin-bottom: var(--space-responsive-lg);
  }

  .template-section {
    padding: var(--space-responsive-md);
    background: #f8fafc;
    border-radius: var(--radius-md);
  }

  .preview-info {
    margin-bottom: var(--space-responsive-md);
    font-size: var(--font-sm);
  }

  .stats-grid {
    gap: var(--space-responsive-sm);
  }

  .stat-item {
    padding: var(--space-responsive-sm);
  }

  .stat-value {
    font-size: var(--font-xl);
  }
}

@media (max-width: 480px) {
  .page-header {
    padding: var(--space-responsive-md);
  }

  .candidates-section {
    padding: var(--space-responsive-md);
  }

  .stats-grid {
    gap: var(--space-responsive-sm);
  }

  .el-table {
    min-width: 600px;
    font-size: var(--font-xs);
  }

  .action-buttons .el-button {
    font-size: var(--font-xs);
    padding: 0 var(--space-responsive-xs);
  }

  .header-actions .el-button {
    height: var(--btn-height-sm);
    font-size: var(--font-sm);
  }

  /* 超小屏幕批量导入优化 */
  .el-dialog {
    width: 98vw !important;
    margin: 2vh auto !important;
  }

  .import-steps {
    margin-bottom: var(--space-responsive-md);
  }

  .step-content {
    min-height: 200px;
  }

  .template-section h4 {
    font-size: var(--font-base);
  }

  .template-section ul {
    padding-left: var(--space-responsive-md);
  }

  .template-section li {
    font-size: var(--font-sm);
    margin-bottom: var(--space-responsive-xs);
  }

  .failure-list .el-table {
    font-size: var(--font-xs);
  }

  .failure-list .el-table th,
  .failure-list .el-table td {
    padding: var(--space-responsive-xs);
  }
}

/* 大屏幕优化 */
@media (min-width: 1200px) {
  .stats-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .header-actions .el-button {
    min-width: 140px;
    font-size: var(--font-base);
  }

  .el-table {
    font-size: var(--font-base);
  }

  .action-buttons .el-button {
    min-height: var(--btn-height-md);
    font-size: var(--font-base);
  }
}
</style>
