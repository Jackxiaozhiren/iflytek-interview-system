/**
 * iFlytek面试系统 - 报告导出分享服务
 * 支持Excel/CSV导出和企业级分享功能
 */

import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { ElMessage, ElNotification, ElMessageBox } from 'element-plus'

class ReportExportShareService {
  constructor() {
    this.exportFormats = {
      excel: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      csv: 'text/csv;charset=utf-8'
    }
    
    this.shareBaseUrl = window.location.origin + '/shared-reports'
    this.shareStorage = new Map() // 模拟分享存储
  }

  /**
   * 📊 导出单个报告 - 增强版
   */
  async exportSingleReport(reportData, format = 'excel', options = {}) {
    try {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')
      const candidateName = reportData.candidateName || '候选人'
      const fileName = `iFlytek面试报告_${candidateName}_${timestamp}`

      // 使用回调函数报告进度
      const progressCallback = options.progressCallback || (() => {})

      progressCallback({ status: 'preparing', progress: 0 })

      // 模拟准备阶段
      await this.delay(500)
      progressCallback({ status: 'processing', progress: 20 })

      let result
      if (format === 'excel') {
        result = await this.exportToExcel(reportData, fileName, {
          ...options,
          progressCallback
        })
      } else if (format === 'csv') {
        result = await this.exportToCSV(reportData, fileName, {
          ...options,
          progressCallback
        })
      } else {
        throw new Error(`不支持的导出格式: ${format}`)
      }

      progressCallback({ status: 'success', progress: 100 })

      // 如果没有使用进度对话框，显示通知
      if (!options.useProgressDialog) {
        ElNotification({
          title: '导出成功',
          message: `报告已成功导出为 ${format.toUpperCase()} 格式`,
          type: 'success',
          duration: 3000
        })
      }

      return result

    } catch (error) {
      console.error('报告导出失败:', error)

      if (options.progressCallback) {
        options.progressCallback({
          status: 'error',
          progress: 0,
          error: error.message
        })
      }

      if (!options.useProgressDialog) {
        ElMessage.error('报告导出失败，请稍后重试')
      }

      throw error
    }
  }

  /**
   * ⏱️ 延迟函数
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * 📈 导出到Excel格式 - 增强版
   */
  async exportToExcel(reportData, fileName, options = {}) {
    const progressCallback = options.progressCallback || (() => {})

    progressCallback({ status: 'processing', progress: 30 })
    const workbook = XLSX.utils.book_new()

    // 基本信息工作表
    progressCallback({ status: 'processing', progress: 40 })
    const basicInfoSheet = this.createBasicInfoSheet(reportData)
    XLSX.utils.book_append_sheet(workbook, basicInfoSheet, '基本信息')

    // 评分详情工作表
    progressCallback({ status: 'processing', progress: 50 })
    const scoreSheet = this.createScoreSheet(reportData)
    XLSX.utils.book_append_sheet(workbook, scoreSheet, '评分详情')

    // 问答记录工作表
    progressCallback({ status: 'processing', progress: 60 })
    const qaSheet = this.createQASheet(reportData)
    XLSX.utils.book_append_sheet(workbook, qaSheet, '问答记录')

    // 分析建议工作表
    progressCallback({ status: 'processing', progress: 70 })
    const analysisSheet = this.createAnalysisSheet(reportData)
    XLSX.utils.book_append_sheet(workbook, analysisSheet, '分析建议')

    // 生成Excel文件
    progressCallback({ status: 'processing', progress: 80 })
    await this.delay(300) // 模拟处理时间

    const excelBuffer = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
      compression: true
    })

    progressCallback({ status: 'processing', progress: 90 })
    const blob = new Blob([excelBuffer], { type: this.exportFormats.excel })

    progressCallback({ status: 'processing', progress: 95 })
    saveAs(blob, `${fileName}.xlsx`)

    return {
      success: true,
      fileName: `${fileName}.xlsx`,
      format: 'excel',
      size: blob.size,
      reportCount: 1
    }
  }

  /**
   * 📄 导出到CSV格式 - 增强版
   */
  async exportToCSV(reportData, fileName, options = {}) {
    const progressCallback = options.progressCallback || (() => {})

    progressCallback({ status: 'processing', progress: 40 })
    await this.delay(200)

    progressCallback({ status: 'processing', progress: 60 })
    const csvData = this.convertReportToCSV(reportData)

    progressCallback({ status: 'processing', progress: 80 })
    const blob = new Blob(['\uFEFF' + csvData], { type: this.exportFormats.csv })

    progressCallback({ status: 'processing', progress: 95 })
    saveAs(blob, `${fileName}.csv`)

    return {
      success: true,
      fileName: `${fileName}.csv`,
      format: 'csv',
      size: blob.size,
      reportCount: 1
    }
  }

  /**
   * 📋 创建基本信息工作表
   */
  createBasicInfoSheet(reportData) {
    const data = [
      ['iFlytek星火智能面试评估报告'],
      [''],
      ['候选人姓名', reportData.candidateName || '未知'],
      ['面试时间', reportData.interviewDate || new Date().toLocaleString()],
      ['面试时长', reportData.duration || '未知'],
      ['技术领域', reportData.domain || '综合'],
      ['面试模式', reportData.mode || '文本面试'],
      [''],
      ['综合评分', reportData.overallScore || 0],
      ['专业知识', reportData.professionalKnowledge || 0],
      ['技能匹配', reportData.skillMatching || 0],
      ['语言表达', reportData.languageExpression || 0],
      ['逻辑思维', reportData.logicalThinking || 0],
      ['创新能力', reportData.innovationAbility || 0],
      ['应变能力', reportData.stressResistance || 0],
      [''],
      ['报告生成时间', new Date().toLocaleString()],
      ['生成系统', 'iFlytek星火智能面试系统']
    ]

    return XLSX.utils.aoa_to_sheet(data)
  }

  /**
   * 📊 创建评分详情工作表
   */
  createScoreSheet(reportData) {
    const headers = ['评估维度', '得分', '等级', '说明']
    const scores = [
      ['专业知识水平', reportData.professionalKnowledge || 0, this.getScoreLevel(reportData.professionalKnowledge), '技术专业性和深度'],
      ['技能匹配度', reportData.skillMatching || 0, this.getScoreLevel(reportData.skillMatching), '与岗位要求的匹配程度'],
      ['语言表达能力', reportData.languageExpression || 0, this.getScoreLevel(reportData.languageExpression), '沟通和表达的清晰度'],
      ['逻辑思维能力', reportData.logicalThinking || 0, this.getScoreLevel(reportData.logicalThinking), '分析和推理能力'],
      ['创新能力', reportData.innovationAbility || 0, this.getScoreLevel(reportData.innovationAbility), '创新思维和解决方案'],
      ['应变抗压能力', reportData.stressResistance || 0, this.getScoreLevel(reportData.stressResistance), '压力下的表现能力']
    ]

    const data = [headers, ...scores]
    return XLSX.utils.aoa_to_sheet(data)
  }

  /**
   * 💬 创建问答记录工作表
   */
  createQASheet(reportData) {
    const headers = ['问题序号', '问题内容', '候选人回答', '评分', '评价']
    const qaData = (reportData.qaRecords || []).map((record, index) => [
      index + 1,
      record.question || '',
      record.answer || '',
      record.score || 0,
      record.evaluation || ''
    ])

    const data = [headers, ...qaData]
    return XLSX.utils.aoa_to_sheet(data)
  }

  /**
   * 📝 创建分析建议工作表
   */
  createAnalysisSheet(reportData) {
    const data = [
      ['分析建议'],
      [''],
      ['优势分析'],
      ...(reportData.strengths || []).map(strength => ['', strength]),
      [''],
      ['改进建议'],
      ...(reportData.improvements || []).map(improvement => ['', improvement]),
      [''],
      ['总体评价'],
      ['', reportData.overallEvaluation || '暂无评价']
    ]

    return XLSX.utils.aoa_to_sheet(data)
  }

  /**
   * 📄 转换报告为CSV格式
   */
  convertReportToCSV(reportData) {
    const lines = []
    
    // 基本信息
    lines.push('iFlytek星火智能面试评估报告')
    lines.push('')
    lines.push(`候选人姓名,${reportData.candidateName || '未知'}`)
    lines.push(`面试时间,${reportData.interviewDate || new Date().toLocaleString()}`)
    lines.push(`综合评分,${reportData.overallScore || 0}`)
    lines.push('')
    
    // 各项评分
    lines.push('评估维度,得分,等级')
    lines.push(`专业知识水平,${reportData.professionalKnowledge || 0},${this.getScoreLevel(reportData.professionalKnowledge)}`)
    lines.push(`技能匹配度,${reportData.skillMatching || 0},${this.getScoreLevel(reportData.skillMatching)}`)
    lines.push(`语言表达能力,${reportData.languageExpression || 0},${this.getScoreLevel(reportData.languageExpression)}`)
    lines.push(`逻辑思维能力,${reportData.logicalThinking || 0},${this.getScoreLevel(reportData.logicalThinking)}`)
    lines.push(`创新能力,${reportData.innovationAbility || 0},${this.getScoreLevel(reportData.innovationAbility)}`)
    lines.push(`应变抗压能力,${reportData.stressResistance || 0},${this.getScoreLevel(reportData.stressResistance)}`)
    lines.push('')
    
    // 问答记录
    if (reportData.qaRecords && reportData.qaRecords.length > 0) {
      lines.push('问答记录')
      lines.push('问题序号,问题内容,候选人回答,评分')
      reportData.qaRecords.forEach((record, index) => {
        const question = (record.question || '').replace(/,/g, '，').replace(/"/g, '""')
        const answer = (record.answer || '').replace(/,/g, '，').replace(/"/g, '""')
        lines.push(`${index + 1},"${question}","${answer}",${record.score || 0}`)
      })
    }
    
    return lines.join('\n')
  }

  /**
   * 🏆 获取评分等级
   */
  getScoreLevel(score) {
    if (score >= 90) return '优秀'
    if (score >= 80) return '良好'
    if (score >= 70) return '中等'
    if (score >= 60) return '及格'
    return '待改进'
  }

  /**
   * 📤 批量导出报告
   */
  async exportBatchReports(reports, format = 'excel', options = {}) {
    try {
      const timestamp = new Date().toISOString().slice(0, 19).replace(/[:-]/g, '')
      const fileName = `iFlytek批量面试报告_${timestamp}`

      // 显示进度
      const loadingInstance = ElMessage({
        message: `正在导出 ${reports.length} 份报告...`,
        type: 'info',
        duration: 0
      })

      if (format === 'excel') {
        await this.exportBatchToExcel(reports, fileName, options)
      } else {
        await this.exportBatchToCSV(reports, fileName, options)
      }

      loadingInstance.close()
      
      ElNotification({
        title: '批量导出成功',
        message: `已成功导出 ${reports.length} 份报告`,
        type: 'success',
        duration: 3000
      })

    } catch (error) {
      console.error('批量导出失败:', error)
      ElMessage.error('批量导出失败，请稍后重试')
      throw error
    }
  }

  /**
   * 📊 批量导出到Excel
   */
  async exportBatchToExcel(reports, fileName, options = {}) {
    const workbook = XLSX.utils.book_new()

    // 汇总信息工作表
    const summarySheet = this.createBatchSummarySheet(reports)
    XLSX.utils.book_append_sheet(workbook, summarySheet, '汇总信息')

    // 为每个报告创建单独的工作表
    reports.forEach((report, index) => {
      const reportSheet = this.createSingleReportSheet(report)
      const sheetName = `${report.candidateName || `候选人${index + 1}`}`.substring(0, 31)
      XLSX.utils.book_append_sheet(workbook, reportSheet, sheetName)
    })

    const excelBuffer = XLSX.write(workbook, { 
      bookType: 'xlsx', 
      type: 'array',
      compression: true
    })
    
    const blob = new Blob([excelBuffer], { type: this.exportFormats.excel })
    saveAs(blob, `${fileName}.xlsx`)
  }

  /**
   * 📋 创建批量汇总工作表
   */
  createBatchSummarySheet(reports) {
    const headers = ['序号', '候选人姓名', '面试时间', '综合评分', '专业知识', '技能匹配', '语言表达', '逻辑思维', '创新能力', '应变能力', '评价等级']
    
    const data = reports.map((report, index) => [
      index + 1,
      report.candidateName || '未知',
      report.interviewDate || '',
      report.overallScore || 0,
      report.professionalKnowledge || 0,
      report.skillMatching || 0,
      report.languageExpression || 0,
      report.logicalThinking || 0,
      report.innovationAbility || 0,
      report.stressResistance || 0,
      this.getScoreLevel(report.overallScore)
    ])

    return XLSX.utils.aoa_to_sheet([headers, ...data])
  }

  /**
   * 📄 创建单个报告工作表
   */
  createSingleReportSheet(report) {
    const data = [
      ['候选人', report.candidateName || '未知'],
      ['面试时间', report.interviewDate || ''],
      ['综合评分', report.overallScore || 0],
      ['专业知识', report.professionalKnowledge || 0],
      ['技能匹配', report.skillMatching || 0],
      ['语言表达', report.languageExpression || 0],
      ['逻辑思维', report.logicalThinking || 0],
      ['创新能力', report.innovationAbility || 0],
      ['应变能力', report.stressResistance || 0]
    ]

    return XLSX.utils.aoa_to_sheet(data)
  }

  /**
   * 🔗 企业级分享功能
   */

  /**
   * 📤 创建分享链接
   */
  async createShareLink(reportData, options = {}) {
    try {
      const shareId = this.generateShareId()
      const shareConfig = {
        id: shareId,
        reportData: reportData,
        createdAt: new Date().toISOString(),
        expiresAt: options.expiresAt || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 默认7天
        accessCount: 0,
        maxAccess: options.maxAccess || 100,
        password: options.password || null,
        permissions: options.permissions || {
          canView: true,
          canDownload: options.allowDownload !== false,
          canPrint: options.allowPrint !== false
        },
        createdBy: options.createdBy || '系统管理员',
        title: options.title || `${reportData.candidateName || '候选人'}的面试报告`
      }

      // 存储分享配置（实际项目中应该存储到后端）
      this.shareStorage.set(shareId, shareConfig)

      const shareUrl = `${this.shareBaseUrl}/${shareId}`

      ElNotification({
        title: '分享链接已生成',
        message: `报告分享链接已创建，有效期${this.getExpiryDescription(shareConfig.expiresAt)}`,
        type: 'success',
        duration: 4000
      })

      return {
        success: true,
        shareId,
        shareUrl,
        expiresAt: shareConfig.expiresAt,
        permissions: shareConfig.permissions,
        qrCode: await this.generateQRCode(shareUrl)
      }

    } catch (error) {
      console.error('创建分享链接失败:', error)
      ElMessage.error('分享链接创建失败，请稍后重试')
      throw error
    }
  }

  /**
   * 🔍 获取分享信息
   */
  getShareInfo(shareId) {
    const shareConfig = this.shareStorage.get(shareId)

    if (!shareConfig) {
      throw new Error('分享链接不存在或已失效')
    }

    if (new Date() > new Date(shareConfig.expiresAt)) {
      this.shareStorage.delete(shareId)
      throw new Error('分享链接已过期')
    }

    if (shareConfig.accessCount >= shareConfig.maxAccess) {
      throw new Error('分享链接访问次数已达上限')
    }

    return shareConfig
  }

  /**
   * 📊 访问分享报告
   */
  async accessSharedReport(shareId, password = null) {
    try {
      const shareConfig = this.getShareInfo(shareId)

      // 验证密码
      if (shareConfig.password && shareConfig.password !== password) {
        throw new Error('访问密码错误')
      }

      // 增加访问计数
      shareConfig.accessCount++
      this.shareStorage.set(shareId, shareConfig)

      return {
        success: true,
        reportData: shareConfig.reportData,
        permissions: shareConfig.permissions,
        title: shareConfig.title,
        accessCount: shareConfig.accessCount,
        expiresAt: shareConfig.expiresAt
      }

    } catch (error) {
      console.error('访问分享报告失败:', error)
      throw error
    }
  }

  /**
   * 🔒 更新分享权限
   */
  async updateSharePermissions(shareId, newPermissions) {
    try {
      const shareConfig = this.shareStorage.get(shareId)

      if (!shareConfig) {
        throw new Error('分享链接不存在')
      }

      shareConfig.permissions = { ...shareConfig.permissions, ...newPermissions }
      shareConfig.updatedAt = new Date().toISOString()

      this.shareStorage.set(shareId, shareConfig)

      ElMessage.success('分享权限已更新')

      return {
        success: true,
        permissions: shareConfig.permissions
      }

    } catch (error) {
      console.error('更新分享权限失败:', error)
      ElMessage.error('权限更新失败')
      throw error
    }
  }

  /**
   * ❌ 撤销分享链接
   */
  async revokeShareLink(shareId) {
    try {
      const shareConfig = this.shareStorage.get(shareId)

      if (!shareConfig) {
        throw new Error('分享链接不存在')
      }

      this.shareStorage.delete(shareId)

      ElMessage.success('分享链接已撤销')

      return { success: true }

    } catch (error) {
      console.error('撤销分享链接失败:', error)
      ElMessage.error('撤销失败')
      throw error
    }
  }

  /**
   * 📋 获取分享列表
   */
  getShareList() {
    const shares = Array.from(this.shareStorage.values())
    return shares.map(share => ({
      id: share.id,
      title: share.title,
      createdAt: share.createdAt,
      expiresAt: share.expiresAt,
      accessCount: share.accessCount,
      maxAccess: share.maxAccess,
      permissions: share.permissions,
      isExpired: new Date() > new Date(share.expiresAt)
    }))
  }

  /**
   * 🔧 工具方法
   */

  /**
   * 生成分享ID
   */
  generateShareId() {
    return 'share_' + Date.now() + '_' + Math.random().toString(36).substring(2, 11)
  }

  /**
   * 生成二维码
   */
  async generateQRCode(url) {
    // 简单的二维码生成（实际项目中可以使用qrcode库）
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(url)}`
  }

  /**
   * 获取过期时间描述
   */
  getExpiryDescription(expiresAt) {
    const now = new Date()
    const expiry = new Date(expiresAt)
    const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))

    if (diffDays <= 1) return '1天内'
    if (diffDays <= 7) return `${diffDays}天`
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)}周`
    return `${Math.ceil(diffDays / 30)}个月`
  }

  /**
   * 📱 显示格式选择对话框 - 增强版
   */
  async showFormatDialog() {
    return new Promise((resolve) => {
      const formatOptions = `
        <div style="padding: 20px; text-align: center;">
          <div style="margin-bottom: 20px; color: #666; font-size: 14px;">
            请选择要导出的文件格式：
          </div>
          <div style="display: flex; gap: 16px; justify-content: center; flex-wrap: wrap;">
            <div style="
              padding: 16px 20px;
              border: 2px solid #1890ff;
              border-radius: 8px;
              cursor: pointer;
              background: #f0f8ff;
              min-width: 120px;
              text-align: center;
            " onclick="selectFormat('excel')">
              <div style="font-size: 24px; margin-bottom: 8px;">📊</div>
              <div style="font-weight: 600; color: #1890ff;">Excel格式</div>
              <div style="font-size: 12px; color: #666; margin-top: 4px;">
                支持多工作表<br/>
                完整数据结构
              </div>
            </div>
            <div style="
              padding: 16px 20px;
              border: 2px solid #52c41a;
              border-radius: 8px;
              cursor: pointer;
              background: #f6ffed;
              min-width: 120px;
              text-align: center;
            " onclick="selectFormat('csv')">
              <div style="font-size: 24px; margin-bottom: 8px;">📄</div>
              <div style="font-weight: 600; color: #52c41a;">CSV格式</div>
              <div style="font-size: 12px; color: #666; margin-top: 4px;">
                轻量级格式<br/>
                通用兼容性
              </div>
            </div>
          </div>
          <div style="margin-top: 16px; font-size: 12px; color: #999;">
            💡 提示：Excel格式包含更丰富的数据结构，CSV格式更轻量便于处理
          </div>
        </div>
        <script>
          function selectFormat(format) {
            window.selectedFormat = format;
            document.querySelector('.el-message-box__btns .el-button--primary').click();
          }
        </script>
      `

      ElMessageBox({
        title: 'iFlytek报告导出',
        dangerouslyUseHTMLString: true,
        message: formatOptions,
        showCancelButton: true,
        confirmButtonText: '确认导出',
        cancelButtonText: '取消',
        distinguishCancelAndClose: true,
        customClass: 'export-format-dialog',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            const selectedFormat = window.selectedFormat || 'excel'
            resolve(selectedFormat)
          } else if (action === 'cancel') {
            resolve(null)
          } else {
            resolve(null)
          }
          done()
        }
      }).then(() => {
        // 这里会被beforeClose处理
      }).catch(() => {
        resolve(null)
      })
    })
  }

  /**
   * 📤 显示分享选项对话框
   */
  async showShareDialog(reportData) {
    // 返回一个Promise，由组件来处理对话框显示
    return new Promise((resolve) => {
      // 这个方法将由Vue组件调用，传入resolve函数
      this._shareDialogResolver = resolve
    })
  }

  /**
   * 🔧 设置分享对话框解析器（由Vue组件调用）
   */
  setShareDialogResolver(resolver) {
    this._shareDialogResolver = resolver
  }

  /**
   * ✅ 确认分享配置（由Vue组件调用）
   */
  confirmShareConfig(config) {
    if (this._shareDialogResolver) {
      this._shareDialogResolver(config)
      this._shareDialogResolver = null
    }
  }

  /**
   * ❌ 取消分享配置（由Vue组件调用）
   */
  cancelShareConfig() {
    if (this._shareDialogResolver) {
      this._shareDialogResolver(null)
      this._shareDialogResolver = null
    }
  }
}

export default new ReportExportShareService()
