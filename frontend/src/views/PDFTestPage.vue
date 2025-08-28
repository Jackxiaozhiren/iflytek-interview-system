<template>
  <div class="pdf-test-page">
    <div class="test-container">
      <h1>PDF中文字体测试页面</h1>
      
      <div class="test-section">
        <h2>测试数据</h2>
        <div class="test-data">
          <p><strong>报告标题:</strong> iFlytek星火多模态面试融合分析报告</p>
          <p><strong>生成时间:</strong> {{ new Date().toLocaleString('zh-CN') }}</p>
          <p><strong>综合评分:</strong> 87分</p>
          <p><strong>置信度:</strong> 92%</p>
          <p><strong>可靠性:</strong> 89%</p>
        </div>
      </div>

      <div class="test-section">
        <h2>模态分析数据</h2>
        <div class="modality-list">
          <div class="modality-item" v-for="item in testModalityData" :key="item.name">
            <span class="name">{{ item.name }}</span>
            <span class="score">{{ item.score }}分</span>
            <span class="weight">(权重: {{ item.weight }}%)</span>
          </div>
        </div>
      </div>

      <div class="action-section">
        <el-button 
          type="primary" 
          @click="testPDFExport"
          :loading="isExporting"
          size="large"
        >
          <el-icon><Document /></el-icon>
          测试PDF导出
        </el-button>
        
        <el-button 
          type="success" 
          @click="testHTMLExport"
          size="large"
        >
          <el-icon><View /></el-icon>
          预览HTML版本
        </el-button>
      </div>

      <div v-if="exportResult" class="result-section">
        <el-alert
          :title="exportResult.success ? '导出成功' : '导出失败'"
          :type="exportResult.success ? 'success' : 'error'"
          :description="exportResult.message"
          show-icon
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Document, View } from '@element-plus/icons-vue'
import enhancedDataExportService from '@/services/enhancedDataExportService'

const isExporting = ref(false)
const exportResult = ref(null)

const testModalityData = ref([
  { name: '语音分析', score: 88, weight: 50 },
  { name: '文本分析', score: 89, weight: 50 },
  { name: '视频分析', score: 85, weight: 30 }
])

const testPDFExport = async () => {
  isExporting.value = true
  exportResult.value = null

  try {
    const testData = {
      summary: {
        overallScore: 87,
        confidence: 92,
        reliability: 89
      },
      modalityAnalysis: testModalityData.value
    }

    console.log('🧪 开始测试PDF导出，数据:', testData)
    
    const result = await enhancedDataExportService.generateFusionReport(testData, 'pdf', { silent: false })
    
    exportResult.value = {
      success: true,
      message: `PDF文件已生成: ${result.fileName || '测试报告.pdf'}`
    }
    
    ElMessage.success('PDF导出测试完成！请检查下载的文件中文显示是否正常。')
    
  } catch (error) {
    console.error('❌ PDF导出测试失败:', error)
    exportResult.value = {
      success: false,
      message: `导出失败: ${error.message}`
    }
    ElMessage.error('PDF导出测试失败')
  } finally {
    isExporting.value = false
  }
}

const testHTMLExport = async () => {
  try {
    const testData = {
      summary: {
        overallScore: 87,
        confidence: 92,
        reliability: 89
      },
      modalityAnalysis: testModalityData.value
    }

    const result = await enhancedDataExportService.generateFusionReport(testData, 'html', { silent: false })
    ElMessage.success('HTML版本已生成，请检查下载的文件')
    
  } catch (error) {
    console.error('❌ HTML导出失败:', error)
    ElMessage.error('HTML导出失败')
  }
}
</script>

<style scoped>
.pdf-test-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  padding: 40px 20px;
}

.test-container {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

h1 {
  text-align: center;
  color: #1890ff;
  margin-bottom: 40px;
  font-size: 28px;
}

.test-section {
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.test-section h2 {
  color: #333;
  margin-bottom: 15px;
  font-size: 18px;
}

.test-data p {
  margin: 10px 0;
  font-size: 16px;
}

.modality-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.modality-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: white;
  border-radius: 6px;
  border-left: 4px solid #1890ff;
}

.name {
  font-weight: bold;
  color: #333;
}

.score {
  font-size: 18px;
  font-weight: bold;
  color: #1890ff;
}

.weight {
  color: #666;
  font-size: 14px;
}

.action-section {
  text-align: center;
  margin: 40px 0;
}

.action-section .el-button {
  margin: 0 10px;
}

.result-section {
  margin-top: 30px;
}
</style>
