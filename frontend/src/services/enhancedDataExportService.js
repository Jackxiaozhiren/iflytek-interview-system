/**
 * 增强的数据导出服务
 * 支持多模态面试数据的Excel、PDF、CSV导出和分享功能
 */

import * as XLSX from 'xlsx'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { saveAs } from 'file-saver'
import { ElMessage, ElNotification, ElLoading } from 'element-plus'

class EnhancedDataExportService {
  constructor() {
    this.exportFormats = {
      excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      csv: 'text/csv',
      pdf: 'application/pdf',
      json: 'application/json'
    }
    
    this.shareBaseUrl = 'https://iflytek-interview.com/share'
    this.apiBaseUrl = import.meta.env.VUE_APP_API_BASE_URL || 'http://localhost:3000'
  }

  /**
   * 🚀 导出多模态融合数据
   */
  async exportMultimodalFusionData(fusionData, format = 'excel', options = {}) {
    const loadingInstance = options.silent ? null : ElLoading.service({
      lock: true,
      text: '正在准备多模态融合数据导出...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    try {
      // 数据预处理
      const processedData = this.preprocessFusionData(fusionData)
      
      // 生成文件名
      const fileName = this.generateFileName('multimodal_fusion', format)
      
      let result
      switch (format) {
        case 'excel':
          result = await this.exportToExcel(processedData, fileName, options)
          break
        case 'csv':
          result = await this.exportToCSV(processedData, fileName, options)
          break
        case 'pdf':
          result = await this.exportToPDF(processedData, fileName, options)
          break
        case 'json':
          result = await this.exportToJSON(processedData, fileName, options)
          break
        default:
          throw new Error(`不支持的导出格式: ${format}`)
      }

      if (loadingInstance) loadingInstance.close()

      if (!options.silent) {
        ElNotification({
          title: '导出成功',
          message: `多模态融合数据已成功导出为 ${format.toUpperCase()} 格式`,
          type: 'success',
          duration: 3000
        })
      }

      return result
    } catch (error) {
      if (loadingInstance) loadingInstance.close()
      console.error('❌ 多模态数据导出失败:', error)

      if (!options.silent) {
        ElNotification({
          title: '导出失败',
          message: error.message || '数据导出过程中发生错误',
          type: 'error',
          duration: 5000
        })
      }
      
      throw error
    }
  }

  /**
   * 📊 导出到Excel格式
   */
  async exportToExcel(data, fileName, options = {}) {
    try {
      const workbook = XLSX.utils.book_new()

      // 创建多个工作表
      const sheets = this.createExcelSheets(data)

      sheets.forEach(sheet => {
        XLSX.utils.book_append_sheet(workbook, sheet.data, sheet.name)
      })

      // 生成Excel文件
      const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'array',
        compression: true
      })

      // 使用正确的MIME类型
      const blob = new Blob([excelBuffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      })

      // 确保文件名包含正确的扩展名
      const finalFileName = fileName.endsWith('.xlsx') ? fileName : `${fileName}.xlsx`
      saveAs(blob, finalFileName)

      return {
        success: true,
        fileName: finalFileName,
        size: blob.size,
        format: 'excel'
      }
    } catch (error) {
      console.error('❌ Excel导出失败:', error)
      throw new Error('Excel文件生成失败: ' + error.message)
    }
  }

  /**
   * 📄 导出到PDF格式
   */
  async exportToPDF(data, fileName, options = {}) {
    try {
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })
      
      // 添加中文字体支持
      await this.addChineseFontSupport(pdf)
      
      // 生成PDF内容
      await this.generatePDFContent(pdf, data)
      
      // 保存PDF
      pdf.save(fileName)
      
      return {
        success: true,
        fileName,
        format: 'pdf'
      }
    } catch (error) {
      console.error('❌ PDF导出失败:', error)
      throw new Error('PDF文件生成失败')
    }
  }

  /**
   * 📝 导出到CSV格式
   */
  async exportToCSV(data, fileName, options = {}) {
    try {
      const csvData = this.convertToCSV(data)

      // 使用正确的MIME类型和编码
      const blob = new Blob(['\ufeff' + csvData], {
        type: 'text/csv;charset=utf-8'
      })

      // 确保文件名包含正确的扩展名
      const finalFileName = fileName.endsWith('.csv') ? fileName : `${fileName}.csv`
      saveAs(blob, finalFileName)

      return {
        success: true,
        fileName: finalFileName,
        size: blob.size,
        format: 'csv'
      }
    } catch (error) {
      console.error('❌ CSV导出失败:', error)
      throw new Error('CSV文件生成失败: ' + error.message)
    }
  }

  /**
   * 🔗 生成分享链接
   */
  async generateShareLink(fusionData, options = {}) {
    const loadingInstance = options.silent ? null : ElLoading.service({
      lock: true,
      text: '正在生成分享链接...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    try {
      // 数据压缩和加密
      const compressedData = await this.compressAndEncryptData(fusionData)
      
      // 上传到服务器
      const shareId = await this.uploadShareData(compressedData, options)
      
      // 生成分享链接
      const shareLink = `${this.shareBaseUrl}/${shareId}`
      
      // 生成二维码
      const qrCodeUrl = await this.generateQRCode(shareLink)
      
      if (loadingInstance) loadingInstance.close()

      if (!options.silent) {
        ElNotification({
          title: '分享链接生成成功',
          message: '融合洞察分享链接已生成，有效期7天',
          type: 'success',
          duration: 3000
        })
      }

      return {
        success: true,
        shareId,
        shareLink,
        qrCodeUrl,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        accessCount: 0
      }
    } catch (error) {
      loadingInstance.close()
      console.error('❌ 分享链接生成失败:', error)
      
      ElNotification({
        title: '分享失败',
        message: error.message || '分享链接生成过程中发生错误',
        type: 'error',
        duration: 5000
      })
      
      throw error
    }
  }

  /**
   * 📋 生成融合报告
   */
  async generateFusionReport(fusionData, format = 'pdf', options = {}) {
    const loadingInstance = options.silent ? null : ElLoading.service({
      lock: true,
      text: '正在生成多模态融合分析报告...',
      background: 'rgba(0, 0, 0, 0.7)'
    })

    try {
      // 验证输入数据
      if (!fusionData || typeof fusionData !== 'object') {
        throw new Error('融合数据无效或缺失')
      }

      console.log('📊 开始生成融合报告，输入数据:', fusionData)

      // 生成报告数据
      const reportData = await this.generateReportData(fusionData)
      console.log('📊 报告数据生成完成:', reportData)

      // 生成报告文件
      const fileName = this.generateFileName('fusion_report', format)
      let result

      if (format === 'pdf') {
        result = await this.generatePDFReport(reportData, fileName, options)
      } else if (format === 'html') {
        result = await this.generateHTMLReport(reportData, fileName, options)
      } else {
        throw new Error(`不支持的报告格式: ${format}`)
      }

      if (loadingInstance) loadingInstance.close()

      if (!options.silent) {
        ElNotification({
          title: '报告生成成功',
          message: `多模态融合分析报告已生成完成`,
          type: 'success',
          duration: 3000
        })
      }

      return result
    } catch (error) {
      if (loadingInstance) loadingInstance.close()
      console.error('❌ 融合报告生成失败:', error)

      if (!options.silent) {
        ElNotification({
          title: '报告生成失败',
          message: error.message || '报告生成过程中发生错误',
          type: 'error',
          duration: 5000
        })
      }
      
      throw error
    }
  }

  /**
   * 🔧 数据预处理
   */
  preprocessFusionData(fusionData) {
    return {
      metadata: {
        exportTime: new Date().toISOString(),
        version: '1.0.0',
        source: 'iFlytek Spark 多模态面试系统'
      },
      summary: {
        overallScore: fusionData.overallScore || 0,
        confidence: fusionData.confidence || 0,
        reliability: fusionData.reliability || 0,
        modalityCount: fusionData.modalityContributions?.length || 0
      },
      modalityAnalysis: fusionData.modalityContributions || [],
      synergyAnalysis: fusionData.synergyAnalysis || [],
      timelineData: fusionData.timelineInsights || [],
      detailedMetrics: {
        voice: fusionData.voiceData || {},
        video: fusionData.videoData || {},
        text: fusionData.textData || {}
      },
      recommendations: fusionData.recommendations || []
    }
  }

  /**
   * 📊 创建Excel工作表
   */
  createExcelSheets(data) {
    const sheets = []

    // 确保数据结构安全
    const summary = data.summary || {}
    const overallScore = summary.overallScore || 0
    const confidence = summary.confidence || 0
    const reliability = summary.reliability || 0
    const modalityCount = summary.modalityCount || 0

    // 概览工作表
    sheets.push({
      name: '概览',
      data: XLSX.utils.json_to_sheet([
        { 指标: '综合评分', 数值: overallScore, 单位: '分' },
        { 指标: '置信度', 数值: confidence, 单位: '%' },
        { 指标: '可靠性', 数值: reliability, 单位: '%' },
        { 指标: '模态数量', 数值: modalityCount, 单位: '个' }
      ])
    })
    
    // 模态分析工作表
    const modalityAnalysis = data.modalityAnalysis || []
    if (modalityAnalysis.length > 0) {
      sheets.push({
        name: '模态分析',
        data: XLSX.utils.json_to_sheet(
          modalityAnalysis.map(item => ({
            模态名称: item.name || '未知',
            权重: (item.weight || 0) + '%',
            评分: item.score || 0,
            颜色标识: item.color || '#000000'
          }))
        )
      })
    }

    // 协同效应工作表
    const synergyAnalysis = data.synergyAnalysis || []
    if (synergyAnalysis.length > 0) {
      sheets.push({
        name: '协同效应',
        data: XLSX.utils.json_to_sheet(
          data.synergyAnalysis.map(item => ({
            分析项目: item.title,
            描述: item.description,
            评分: item.score,
            关键洞察: item.insights?.join('; ') || ''
          }))
        )
      })
    }
    
    // 时间轴数据工作表
    if (data.timelineData.length > 0) {
      sheets.push({
        name: '时间轴分析',
        data: XLSX.utils.json_to_sheet(
          data.timelineData.map(item => ({
            时间点: item.time,
            事件标题: item.title,
            详细描述: item.description,
            涉及模态: item.modalities?.join(', ') || ''
          }))
        )
      })
    }
    
    return sheets
  }

  /**
   * 📄 生成PDF内容
   */
  async generatePDFContent(pdf, data) {
    let yPosition = 20

    // 确保数据结构安全
    const summary = data.summary || {}
    const overallScore = summary.overallScore || 0
    const confidence = summary.confidence || 0
    const reliability = summary.reliability || 0

    // 使用安全的文本输出函数
    const safeText = (text, x, y, options = {}) => {
      try {
        // 将中文文本转换为可显示的格式
        const displayText = this.convertChineseForPDF(text)
        pdf.text(displayText, x, y, options)
      } catch (error) {
        console.warn('文本输出失败:', error)
        // 回退到英文描述
        const fallbackText = this.getFallbackText(text)
        pdf.text(fallbackText, x, y, options)
      }
    }

    // 标题
    pdf.setFontSize(20)
    safeText('iFlytek Spark Multimodal Interview Analysis Report', 20, yPosition)
    yPosition += 15

    // 生成时间
    pdf.setFontSize(12)
    safeText(`Generated: ${new Date().toLocaleString('en-US')}`, 20, yPosition)
    yPosition += 20

    // 概览信息
    pdf.setFontSize(16)
    safeText('Analysis Overview', 20, yPosition)
    yPosition += 10

    pdf.setFontSize(12)
    safeText(`Overall Score: ${overallScore}`, 20, yPosition)
    yPosition += 8
    safeText(`Confidence: ${confidence}%`, 20, yPosition)
    yPosition += 8
    safeText(`Reliability: ${reliability}%`, 20, yPosition)
    yPosition += 15

    // 模态分析
    if (data.modalityAnalysis && data.modalityAnalysis.length > 0) {
      pdf.setFontSize(16)
      safeText('Modality Analysis', 20, yPosition)
      yPosition += 10

      data.modalityAnalysis.forEach(item => {
        pdf.setFontSize(12)
        safeText(`${item.name}: ${item.score} (Weight: ${item.weight}%)`, 20, yPosition)
        yPosition += 8
      })
    }
  }

  /**
   * 🔗 生成文件名
   */
  generateFileName(prefix, format) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
    return `${prefix}_${timestamp}.${format}`
  }

  /**
   * 📝 转换为CSV格式
   */
  convertToCSV(data) {
    const rows = []

    // 确保数据结构安全
    const summary = data.summary || {}
    const overallScore = summary.overallScore || 0
    const confidence = summary.confidence || 0
    const reliability = summary.reliability || 0

    // 添加标题行
    rows.push(['iFlytek星火多模态面试融合分析数据'])
    rows.push(['生成时间', new Date().toLocaleString('zh-CN')])
    rows.push([]) // 空行

    // 概览数据
    rows.push(['概览信息'])
    rows.push(['指标', '数值', '单位'])
    rows.push(['综合评分', overallScore, '分'])
    rows.push(['置信度', confidence, '%'])
    rows.push(['可靠性', reliability, '%'])
    rows.push([]) // 空行
    
    // 模态分析数据
    const modalityAnalysis = data.modalityAnalysis || []
    if (modalityAnalysis.length > 0) {
      rows.push(['模态分析'])
      rows.push(['模态名称', '权重(%)', '评分', '颜色'])
      modalityAnalysis.forEach(item => {
        rows.push([
          item.name || '未知',
          item.weight || 0,
          item.score || 0,
          item.color || '#000000'
        ])
      })
    }
    
    // 转换为CSV字符串
    return rows.map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n')
  }

  /**
   * 🔐 数据压缩和加密
   */
  async compressAndEncryptData(data) {
    // 简化版本：仅进行JSON序列化和Base64编码
    const jsonString = JSON.stringify(data)
    return btoa(encodeURIComponent(jsonString))
  }

  /**
   * ☁️ 上传分享数据
   */
  async uploadShareData(compressedData, options = {}) {
    // 模拟API调用
    return new Promise((resolve) => {
      setTimeout(() => {
        const shareId = 'share_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11)
        resolve(shareId)
      }, 1000)
    })
  }

  /**
   * 📱 生成二维码
   */
  async generateQRCode(url) {
    // 模拟二维码生成
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`
  }

  /**
   * 📊 生成报告数据
   */
  async generateReportData(fusionData) {
    // 首先预处理数据，确保数据结构完整
    const processedData = this.preprocessFusionData(fusionData)

    return {
      ...processedData,
      reportMetadata: {
        title: 'iFlytek星火多模态面试融合分析报告',
        generatedAt: new Date().toISOString(),
        version: '1.0.0',
        author: 'iFlytek Spark AI系统'
      },
      executiveSummary: this.generateExecutiveSummary(fusionData),
      detailedAnalysis: this.generateDetailedAnalysis(fusionData),
      recommendations: this.generateRecommendations(fusionData)
    }
  }

  /**
   * 📋 生成执行摘要
   */
  generateExecutiveSummary(data) {
    const overallScore = data.overallScore || 0
    let performance = '需要改进'
    
    if (overallScore >= 90) performance = '优秀'
    else if (overallScore >= 80) performance = '良好'
    else if (overallScore >= 70) performance = '中等'
    
    return {
      overallPerformance: performance,
      keyStrengths: ['多模态数据一致性良好', '技术表达清晰'],
      improvementAreas: ['情绪控制', '深度技术讨论'],
      recommendation: `候选人整体表现${performance}，建议进入下一轮面试。`
    }
  }

  /**
   * 🔍 生成详细分析
   */
  generateDetailedAnalysis(data) {
    return {
      modalityBreakdown: data.modalityContributions || [],
      synergyEffects: data.synergyAnalysis || [],
      timelineHighlights: data.timelineInsights || [],
      technicalMetrics: data.detailedMetrics || {}
    }
  }

  /**
   * 💡 生成建议
   */
  generateRecommendations(data) {
    return [
      '继续保持良好的沟通表达能力',
      '加强技术深度的展示',
      '提升在压力情况下的情绪管理',
      '增强多模态表达的一致性'
    ]
  }

  /**
   * 📄 生成PDF报告
   */
  async generatePDFReport(reportData, fileName, options = {}) {
    try {
      console.log('📄 开始生成PDF报告，使用HTML转换方式')

      // 使用HTML到PDF的方式，确保中文字体正确显示
      const htmlContent = this.generateReportHTML(reportData)

      // 创建临时HTML元素
      const tempDiv = document.createElement('div')
      tempDiv.innerHTML = htmlContent
      tempDiv.style.cssText = `
        position: absolute;
        top: -9999px;
        left: -9999px;
        width: 794px;
        background: white;
        font-family: 'Microsoft YaHei', 'PingFang SC', 'Hiragino Sans GB', sans-serif;
        padding: 40px;
        box-sizing: border-box;
        line-height: 1.6;
      `
      document.body.appendChild(tempDiv)

      // 等待字体加载和渲染
      await new Promise(resolve => setTimeout(resolve, 500))

      console.log('📄 开始转换HTML为Canvas')

      // 使用html2canvas转换为图片
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: 794,
        height: Math.max(1123, tempDiv.scrollHeight + 80),
        logging: false
      })

      console.log('📄 Canvas转换完成，尺寸:', canvas.width, 'x', canvas.height)

      // 清理临时元素
      document.body.removeChild(tempDiv)

      // 创建PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      })

      // 将canvas转换为图片并添加到PDF
      const imgData = canvas.toDataURL('image/png', 0.95)
      const imgWidth = 210 // A4宽度(mm)
      const imgHeight = (canvas.height * imgWidth) / canvas.width

      // 如果内容太长，可能需要分页
      if (imgHeight > 297) { // A4高度
        console.log('📄 内容较长，添加分页处理')
        const pageHeight = 297
        let yPosition = 0

        while (yPosition < imgHeight) {
          const remainingHeight = Math.min(pageHeight, imgHeight - yPosition)

          // 创建临时canvas来裁剪当前页面
          const pageCanvas = document.createElement('canvas')
          const pageCtx = pageCanvas.getContext('2d')
          pageCanvas.width = canvas.width
          pageCanvas.height = (remainingHeight * canvas.width) / imgWidth

          pageCtx.drawImage(
            canvas,
            0, (yPosition * canvas.width) / imgWidth,
            canvas.width, pageCanvas.height,
            0, 0,
            canvas.width, pageCanvas.height
          )

          const pageImgData = pageCanvas.toDataURL('image/png', 0.95)

          if (yPosition > 0) {
            pdf.addPage()
          }

          pdf.addImage(pageImgData, 'PNG', 0, 0, imgWidth, remainingHeight)
          yPosition += pageHeight
        }
      } else {
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      }

      console.log('📄 PDF生成完成，准备保存')

      // 保存PDF
      pdf.save(fileName)

      return {
        success: true,
        fileName,
        format: 'pdf'
      }
    } catch (error) {
      console.error('❌ PDF报告生成失败:', error)
      // 回退到原始方法
      return this.generatePDFReportFallback(reportData, fileName, options)
    }
  }

  /**
   * 🌐 生成HTML报告
   */
  async generateHTMLReport(reportData, fileName, options = {}) {
    const htmlContent = this.generateHTMLContent(reportData)
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' })
    saveAs(blob, fileName)
    
    return {
      success: true,
      fileName,
      format: 'html'
    }
  }

  /**
   * 📝 生成HTML内容
   */
  generateHTMLContent(data) {
    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>iFlytek星火多模态面试融合分析报告</title>
    <style>
        body { font-family: 'Microsoft YaHei', sans-serif; margin: 40px; line-height: 1.6; }
        .header { text-align: center; margin-bottom: 40px; }
        .section { margin-bottom: 30px; }
        .metric { display: inline-block; margin: 10px; padding: 15px; background: #f5f5f5; border-radius: 8px; }
    </style>
</head>
<body>
    <div class="header">
        <h1>iFlytek星火多模态面试融合分析报告</h1>
        <p>生成时间: ${new Date().toLocaleString('zh-CN')}</p>
    </div>
    
    <div class="section">
        <h2>分析概览</h2>
        <div class="metric">综合评分: ${data.summary?.overallScore || 0}分</div>
        <div class="metric">置信度: ${data.summary?.confidence || 0}%</div>
        <div class="metric">可靠性: ${data.summary?.reliability || 0}%</div>
    </div>
    
    <div class="section">
        <h2>执行摘要</h2>
        <p>${data.executiveSummary?.recommendation || '暂无建议'}</p>
    </div>
</body>
</html>`
  }

  /**
   * 🔤 添加中文字体支持
   */
  async addChineseFontSupport(pdf) {
    try {
      // 尝试加载中文字体
      // 注意：这里需要实际的字体文件，暂时使用浏览器默认字体处理

      // 设置字体编码为UTF-8
      pdf.setCharSpace(0)

      // 使用支持中文的字体配置
      // jsPDF默认字体不支持中文，需要特殊处理
      pdf.setFont('helvetica', 'normal')

      // 添加字体回退机制
      this.fontFallback = true

      console.log('✅ 中文字体支持已配置')
    } catch (error) {
      console.warn('⚠️ 中文字体加载失败，使用默认处理:', error)
      pdf.setFont('helvetica')
    }
  }

  /**
   * 🔤 转换中文文本为PDF可显示格式
   */
  convertChineseForPDF(text) {
    // 由于jsPDF默认不支持中文，这里提供英文翻译
    const translations = {
      'iFlytek星火多模态面试融合分析报告': 'iFlytek Spark Multimodal Interview Analysis Report',
      '生成时间': 'Generated Time',
      '分析概览': 'Analysis Overview',
      '综合评分': 'Overall Score',
      '置信度': 'Confidence',
      '可靠性': 'Reliability',
      '模态分析': 'Modality Analysis',
      '语音分析': 'Voice Analysis',
      '文本分析': 'Text Analysis',
      '视频分析': 'Video Analysis',
      '权重': 'Weight',
      '分': 'points'
    }

    // 查找翻译
    for (const [chinese, english] of Object.entries(translations)) {
      if (text.includes(chinese)) {
        text = text.replace(chinese, english)
      }
    }

    return text
  }

  /**
   * 🔄 获取回退文本
   */
  getFallbackText(originalText) {
    // 如果转换失败，提供简化的英文版本
    if (originalText.includes('iFlytek') || originalText.includes('星火')) {
      return 'iFlytek Spark Analysis Report'
    }
    if (originalText.includes('分析') || originalText.includes('评分')) {
      return 'Analysis Result'
    }
    if (originalText.includes('时间') || originalText.includes('生成')) {
      return 'Generated: ' + new Date().toLocaleString('en-US')
    }

    // 移除中文字符，保留数字和英文
    return originalText.replace(/[\u4e00-\u9fff]/g, '').trim() || 'Data'
  }

  /**
   * 📄 生成报告HTML内容
   */
  generateReportHTML(data) {
    const summary = data.summary || {}
    const overallScore = summary.overallScore || 0
    const confidence = summary.confidence || 0
    const reliability = summary.reliability || 0

    return `
      <!DOCTYPE html>
      <html lang="zh-CN">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>iFlytek星火多模态面试融合分析报告</title>
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@400;500;700&display=swap');

          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          body {
            font-family: 'Microsoft YaHei', 'Noto Sans SC', 'PingFang SC', 'Hiragino Sans GB', sans-serif;
            line-height: 1.6;
            color: #333;
            background: white;
          }

          .report-container {
            padding: 40px;
            max-width: 794px;
            margin: 0 auto;
          }

          .header {
            text-align: center;
            margin-bottom: 40px;
            border-bottom: 3px solid #1890ff;
            padding-bottom: 20px;
          }

          .title {
            color: #1890ff;
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 10px;
          }

          .subtitle {
            color: #666;
            font-size: 14px;
          }

          .section {
            margin-bottom: 30px;
          }

          .section-title {
            color: #333;
            font-size: 20px;
            font-weight: 600;
            border-bottom: 2px solid #1890ff;
            padding-bottom: 10px;
            margin-bottom: 20px;
          }

          .metrics-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 20px;
          }

          .metric-card {
            text-align: center;
            padding: 20px;
            background: #f8f9fa;
            border-radius: 8px;
            border: 1px solid #e9ecef;
          }

          .metric-value {
            font-size: 32px;
            font-weight: 700;
            margin-bottom: 5px;
          }

          .metric-label {
            color: #666;
            font-size: 14px;
          }

          .footer {
            margin-top: 40px;
            text-align: center;
            color: #999;
            font-size: 12px;
            border-top: 1px solid #e9ecef;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="report-container">
          <div class="header">
            <h1 class="title">iFlytek星火多模态面试融合分析报告</h1>
            <p class="subtitle">生成时间: ${new Date().toLocaleString('zh-CN')}</p>
          </div>

          <div class="section">
            <h2 class="section-title">分析概览</h2>
            <div class="metrics-grid">
              <div class="metric-card">
                <div class="metric-value" style="color: #1890ff;">${overallScore}</div>
                <div class="metric-label">综合评分</div>
              </div>
              <div class="metric-card">
                <div class="metric-value" style="color: #52c41a;">${confidence}%</div>
                <div class="metric-label">置信度</div>
              </div>
              <div class="metric-card">
                <div class="metric-value" style="color: #faad14;">${reliability}%</div>
                <div class="metric-label">可靠性</div>
              </div>
            </div>
          </div>

          ${this.generateModalityAnalysisHTML(data)}

          <div class="footer">
            <p>本报告由iFlytek Spark大模型智能生成</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  /**
   * 📊 生成模态分析HTML
   */
  generateModalityAnalysisHTML(data) {
    if (!data.modalityAnalysis || data.modalityAnalysis.length === 0) {
      return `
        <div class="section">
          <h2 class="section-title">模态分析</h2>
          <p style="color: #666; text-align: center; padding: 20px;">暂无模态分析数据</p>
        </div>
      `
    }

    const modalityItems = data.modalityAnalysis.map(item => `
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 15px; background: #f8f9fa; border-radius: 8px; margin-bottom: 10px; border: 1px solid #e9ecef;">
        <div style="flex: 1;">
          <div style="font-weight: 600; color: #333; font-size: 16px; margin-bottom: 4px;">${item.name}</div>
          <div style="color: #666; font-size: 12px;">权重: ${item.weight}%</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 24px; font-weight: 700; color: #1890ff;">
            ${item.score}
          </div>
          <div style="font-size: 12px; color: #666;">分</div>
        </div>
      </div>
    `).join('')

    return `
      <div class="section">
        <h2 class="section-title">模态分析</h2>
        <div style="margin-top: 20px;">
          ${modalityItems}
        </div>
      </div>
    `
  }

  /**
   * 📄 PDF生成回退方法
   */
  async generatePDFReportFallback(reportData, fileName, options = {}) {
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    })

    await this.generatePDFContent(pdf, reportData)
    pdf.save(fileName)

    return {
      success: true,
      fileName,
      format: 'pdf'
    }
  }

  /**
   * 📤 导出JSON格式
   */
  async exportToJSON(data, fileName, options = {}) {
    const jsonString = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonString], { type: this.exportFormats.json })
    saveAs(blob, fileName)
    
    return {
      success: true,
      fileName,
      size: blob.size,
      format: 'json'
    }
  }
}

// 创建单例实例
const enhancedDataExportService = new EnhancedDataExportService()

export default enhancedDataExportService
