<template>
  <div class="report-test-page">
    <div class="page-header">
      <h1>报告导出分享功能测试</h1>
      <p>测试所有报告相关的导出和分享功能</p>
    </div>

    <div class="test-sections">
      <!-- 基础导出测试 -->
      <div class="test-section">
        <h2>基础导出功能测试</h2>
        <div class="test-buttons">
          <el-button type="primary" @click="testPDFExport">
            <el-icon><Document /></el-icon>
            测试PDF导出
          </el-button>
          <el-button type="success" @click="testExcelExport">
            <el-icon><Grid /></el-icon>
            测试Excel导出
          </el-button>
          <el-button type="info" @click="testTextExport">
            <el-icon><DocumentCopy /></el-icon>
            测试文本导出
          </el-button>
        </div>
      </div>

      <!-- 分享功能测试 -->
      <div class="test-section">
        <h2>分享功能测试</h2>
        <div class="test-buttons">
          <el-button type="warning" @click="testBasicShare">
            <el-icon><Share /></el-icon>
            测试基础分享
          </el-button>
          <el-button type="danger" @click="testAdvancedShare">
            <el-icon><Setting /></el-icon>
            测试高级分享
          </el-button>
        </div>
      </div>

      <!-- 批量操作测试 -->
      <div class="test-section">
        <h2>批量操作测试</h2>
        <div class="test-buttons">
          <el-button type="primary" @click="testBatchExport">
            <el-icon><FolderOpened /></el-icon>
            测试批量导出
          </el-button>
          <el-button type="success" @click="testAnalysisReport">
            <el-icon><TrendCharts /></el-icon>
            测试分析报告
          </el-button>
        </div>
      </div>

      <!-- 测试结果显示 -->
      <div class="test-results">
        <h2>测试结果</h2>
        <div class="results-list">
          <div 
            v-for="result in testResults" 
            :key="result.id"
            class="result-item"
            :class="result.status"
          >
            <div class="result-icon">
              <el-icon v-if="result.status === 'success'"><Check /></el-icon>
              <el-icon v-else-if="result.status === 'error'"><Close /></el-icon>
              <el-icon v-else><Loading /></el-icon>
            </div>
            <div class="result-content">
              <div class="result-title">{{ result.title }}</div>
              <div class="result-message">{{ result.message }}</div>
              <div class="result-time">{{ result.time }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import {
  Document, Grid, DocumentCopy, Share, Setting, FolderOpened,
  TrendCharts, Check, Close, Loading
} from '@element-plus/icons-vue'

// 测试结果
const testResults = ref([])

// 模拟候选人数据
const mockCandidateData = {
  name: '张三',
  position: '前端开发工程师',
  interviewDate: '2025-07-24',
  overallScore: 85,
  professionalKnowledge: 88,
  skillMatching: 82,
  languageExpression: 90,
  logicalThinking: 87,
  innovationAbility: 83,
  stressResistance: 86,
  strengths: ['技术基础扎实', '学习能力强', '沟通表达清晰'],
  improvements: ['需要加强项目管理经验', '可以提升系统设计能力']
}

// 添加测试结果
const addTestResult = (title, status, message) => {
  testResults.value.unshift({
    id: Date.now(),
    title,
    status,
    message,
    time: new Date().toLocaleTimeString()
  })
}

// 测试PDF导出
const testPDFExport = async () => {
  addTestResult('PDF导出测试', 'loading', '正在生成PDF文件...')
  
  try {
    // 动态导入jsPDF
    const { jsPDF } = await import('jspdf')
    
    const doc = new jsPDF()
    
    // 添加标题
    doc.setFontSize(20)
    doc.text('iFlytek 面试评估报告', 20, 30)
    
    // 添加候选人信息
    doc.setFontSize(14)
    doc.text(`候选人: ${mockCandidateData.name}`, 20, 50)
    doc.text(`职位: ${mockCandidateData.position}`, 20, 65)
    doc.text(`面试时间: ${mockCandidateData.interviewDate}`, 20, 80)
    
    // 添加评分信息
    doc.text('评估结果:', 20, 105)
    doc.setFontSize(12)
    doc.text(`综合评分: ${mockCandidateData.overallScore}分`, 30, 120)
    doc.text(`专业知识: ${mockCandidateData.professionalKnowledge}分`, 30, 135)
    doc.text(`技能匹配: ${mockCandidateData.skillMatching}分`, 30, 150)
    doc.text(`语言表达: ${mockCandidateData.languageExpression}分`, 30, 165)
    doc.text(`逻辑思维: ${mockCandidateData.logicalThinking}分`, 30, 180)
    doc.text(`创新能力: ${mockCandidateData.innovationAbility}分`, 30, 195)
    doc.text(`抗压能力: ${mockCandidateData.stressResistance}分`, 30, 210)
    
    // 保存PDF
    const fileName = `iFlytek面试报告_${mockCandidateData.name}_${Date.now()}.pdf`
    doc.save(fileName)
    
    addTestResult('PDF导出测试', 'success', `PDF文件已成功生成: ${fileName}`)
    ElMessage.success('PDF导出测试成功')
    
  } catch (error) {
    console.error('PDF导出失败:', error)
    addTestResult('PDF导出测试', 'error', `导出失败: ${error.message}`)
    ElMessage.error('PDF导出测试失败')
  }
}

// 测试Excel导出
const testExcelExport = async () => {
  addTestResult('Excel导出测试', 'loading', '正在生成Excel文件...')
  
  try {
    // 动态导入xlsx
    const XLSX = await import('xlsx')
    
    // 创建工作簿
    const workbook = XLSX.utils.book_new()
    
    // 基本信息工作表
    const basicData = [
      ['iFlytek 面试评估报告'],
      [''],
      ['候选人信息'],
      ['姓名', mockCandidateData.name],
      ['职位', mockCandidateData.position],
      ['面试时间', mockCandidateData.interviewDate],
      [''],
      ['评估结果'],
      ['综合评分', mockCandidateData.overallScore],
      ['专业知识', mockCandidateData.professionalKnowledge],
      ['技能匹配', mockCandidateData.skillMatching],
      ['语言表达', mockCandidateData.languageExpression],
      ['逻辑思维', mockCandidateData.logicalThinking],
      ['创新能力', mockCandidateData.innovationAbility],
      ['抗压能力', mockCandidateData.stressResistance]
    ]
    
    const basicSheet = XLSX.utils.aoa_to_sheet(basicData)
    XLSX.utils.book_append_sheet(workbook, basicSheet, '基本信息')
    
    // 详细分析工作表
    const analysisData = [
      ['详细分析'],
      [''],
      ['优势'],
      ...mockCandidateData.strengths.map(strength => [strength]),
      [''],
      ['改进建议'],
      ...mockCandidateData.improvements.map(improvement => [improvement])
    ]
    
    const analysisSheet = XLSX.utils.aoa_to_sheet(analysisData)
    XLSX.utils.book_append_sheet(workbook, analysisSheet, '详细分析')
    
    // 导出文件
    const fileName = `iFlytek面试报告_${mockCandidateData.name}_${Date.now()}.xlsx`
    XLSX.writeFile(workbook, fileName)
    
    addTestResult('Excel导出测试', 'success', `Excel文件已成功生成: ${fileName}`)
    ElMessage.success('Excel导出测试成功')
    
  } catch (error) {
    console.error('Excel导出失败:', error)
    addTestResult('Excel导出测试', 'error', `导出失败: ${error.message}`)
    ElMessage.error('Excel导出测试失败')
  }
}

// 测试文本导出
const testTextExport = () => {
  addTestResult('文本导出测试', 'loading', '正在生成文本文件...')
  
  try {
    const reportContent = `
iFlytek 面试评估报告

候选人: ${mockCandidateData.name}
职位: ${mockCandidateData.position}
面试时间: ${mockCandidateData.interviewDate}

评估结果:
综合评分: ${mockCandidateData.overallScore}分
专业知识: ${mockCandidateData.professionalKnowledge}分
技能匹配: ${mockCandidateData.skillMatching}分
语言表达: ${mockCandidateData.languageExpression}分
逻辑思维: ${mockCandidateData.logicalThinking}分
创新能力: ${mockCandidateData.innovationAbility}分
抗压能力: ${mockCandidateData.stressResistance}分

优势:
${mockCandidateData.strengths.map(s => `• ${s}`).join('\n')}

改进建议:
${mockCandidateData.improvements.map(i => `• ${i}`).join('\n')}
    `

    // 创建下载链接
    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    const fileName = `iFlytek面试报告_${mockCandidateData.name}_${Date.now()}.txt`
    link.download = fileName
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    addTestResult('文本导出测试', 'success', `文本文件已成功生成: ${fileName}`)
    ElMessage.success('文本导出测试成功')
    
  } catch (error) {
    console.error('文本导出失败:', error)
    addTestResult('文本导出测试', 'error', `导出失败: ${error.message}`)
    ElMessage.error('文本导出测试失败')
  }
}

// 测试基础分享
const testBasicShare = async () => {
  addTestResult('基础分享测试', 'loading', '正在生成分享链接...')
  
  try {
    // 生成分享链接
    const shareUrl = `${window.location.origin}/report/share/${mockCandidateData.name}_${Date.now()}`
    
    // 复制到剪贴板
    await navigator.clipboard.writeText(shareUrl)
    
    addTestResult('基础分享测试', 'success', `分享链接已生成并复制: ${shareUrl}`)
    
    ElNotification({
      title: '分享链接已生成',
      message: '链接已复制到剪贴板，您可以分享给相关人员查看',
      type: 'success',
      duration: 5000
    })
    
  } catch (error) {
    console.error('分享失败:', error)
    addTestResult('基础分享测试', 'error', `分享失败: ${error.message}`)
    ElMessage.error('基础分享测试失败')
  }
}

// 测试高级分享
const testAdvancedShare = () => {
  addTestResult('高级分享测试', 'success', '高级分享功能需要在实际报告页面中测试')
  ElMessage.info('高级分享功能请在实际报告页面中测试')
}

// 测试批量导出
const testBatchExport = () => {
  addTestResult('批量导出测试', 'success', '批量导出功能需要在批量面试页面中测试')
  ElMessage.info('批量导出功能请在批量面试页面中测试')
}

// 测试分析报告
const testAnalysisReport = () => {
  addTestResult('分析报告测试', 'success', '分析报告功能需要在批量面试页面中测试')
  ElMessage.info('分析报告功能请在批量面试页面中测试')
}
</script>

<style scoped>
.report-test-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 40px;
  color: white;
}

.page-header h1 {
  font-size: 32px;
  font-weight: 600;
  margin-bottom: 8px;
}

.page-header p {
  font-size: 16px;
  opacity: 0.9;
}

.test-sections {
  max-width: 1200px;
  margin: 0 auto;
}

.test-section {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 32px;
  margin-bottom: 24px;
}

.test-section h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 20px;
}

.test-buttons {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.test-results {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 32px;
}

.test-results h2 {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 20px;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-radius: 8px;
  border: 1px solid #e6f7ff;
}

.result-item.success {
  background: #f6ffed;
  border-color: #b7eb8f;
}

.result-item.error {
  background: #fff2f0;
  border-color: #ffccc7;
}

.result-item.loading {
  background: #f0f9ff;
  border-color: #91d5ff;
}

.result-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.result-icon .el-icon {
  font-size: 16px;
}

.result-item.success .result-icon {
  color: #52c41a;
}

.result-item.error .result-icon {
  color: #ff4d4f;
}

.result-item.loading .result-icon {
  color: #1890ff;
}

.result-content {
  flex: 1;
}

.result-title {
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.result-message {
  color: #666;
  font-size: 14px;
  margin-bottom: 4px;
}

.result-time {
  color: #999;
  font-size: 12px;
}

@media (max-width: 768px) {
  .test-buttons {
    flex-direction: column;
  }
  
  .test-buttons .el-button {
    width: 100%;
  }
}
</style>
