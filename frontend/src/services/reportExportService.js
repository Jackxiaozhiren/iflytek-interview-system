/**
 * 报告导出服务
 * 支持PDF和Word格式的报告导出
 */

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { Document, Packer, Paragraph, TextRun, ImageRun, HeadingLevel, AlignmentType } from 'docx'
import { saveAs } from 'file-saver'

class ReportExportService {
  constructor() {
    this.defaultOptions = {
      pdf: {
        format: 'a4',
        orientation: 'portrait',
        unit: 'mm',
        compress: true
      },
      word: {
        creator: 'iFlytek面试评估系统',
        title: '面试评估报告',
        description: '基于iFlytek星火大模型的智能面试评估报告'
      }
    }
  }

  /**
   * 导出PDF报告
   */
  async exportToPDF(reportData, chartImages = {}) {
    try {
      const pdf = new jsPDF({
        orientation: this.defaultOptions.pdf.orientation,
        unit: this.defaultOptions.pdf.unit,
        format: this.defaultOptions.pdf.format,
        compress: this.defaultOptions.pdf.compress
      })

      // 设置中文字体支持
      pdf.addFont('/fonts/NotoSansCJK-Regular.ttf', 'NotoSansCJK', 'normal')
      pdf.setFont('NotoSansCJK')

      let yPosition = 20

      // 添加标题
      pdf.setFontSize(24)
      pdf.setTextColor(51, 51, 51)
      pdf.text('面试评估报告', 105, yPosition, { align: 'center' })
      yPosition += 15

      // 添加副标题
      pdf.setFontSize(12)
      pdf.setTextColor(102, 102, 102)
      pdf.text('基于iFlytek星火大模型V3.5的智能分析结果', 105, yPosition, { align: 'center' })
      yPosition += 20

      // 添加基本信息
      pdf.setFontSize(14)
      pdf.setTextColor(51, 51, 51)
      pdf.text('基本信息', 20, yPosition)
      yPosition += 10

      pdf.setFontSize(10)
      const basicInfo = [
        `候选人姓名：${reportData.candidateName || '张三'}`,
        `面试时间：${new Date(reportData.date).toLocaleString('zh-CN')}`,
        `面试时长：${reportData.duration || '25分钟'}`,
        `技术领域：${reportData.domain || '人工智能'}`,
        `面试官：iFlytek AI面试官`,
        `评估模型：iFlytek星火大模型V3.5`
      ]

      basicInfo.forEach(info => {
        pdf.text(info, 25, yPosition)
        yPosition += 6
      })

      yPosition += 10

      // 添加总体评分
      pdf.setFontSize(14)
      pdf.text('总体评分', 20, yPosition)
      yPosition += 10

      pdf.setFontSize(12)
      pdf.setTextColor(102, 126, 234)
      pdf.text(`综合得分：${reportData.overallScore || 82}分`, 25, yPosition)
      yPosition += 8

      pdf.setFontSize(10)
      pdf.setTextColor(51, 51, 51)
      pdf.text(`评估等级：${this.getScoreLevel(reportData.overallScore || 82)}`, 25, yPosition)
      yPosition += 15

      // 添加能力评估详情
      pdf.setFontSize(14)
      pdf.text('六维能力评估', 20, yPosition)
      yPosition += 10

      const capabilities = reportData.capabilities || [
        { name: '技术理解能力', score: 85, description: '对技术概念理解深入，能够准确把握核心要点' },
        { name: '问题解决能力', score: 78, description: '具备良好的分析和解决问题的思路' },
        { name: '沟通表达能力', score: 82, description: '表达清晰，逻辑性强，专业术语使用恰当' },
        { name: '学习适应能力', score: 88, description: '学习能力强，对新技术接受度高' },
        { name: '团队协作能力', score: 75, description: '具备基本的团队合作意识' },
        { name: '创新思维能力', score: 80, description: '思维活跃，能提出创新性的解决方案' }
      ]

      capabilities.forEach(capability => {
        pdf.setFontSize(11)
        pdf.setTextColor(51, 51, 51)
        pdf.text(`${capability.name}：${capability.score}分`, 25, yPosition)
        yPosition += 6

        pdf.setFontSize(9)
        pdf.setTextColor(102, 102, 102)
        const lines = pdf.splitTextToSize(capability.description, 160)
        lines.forEach(line => {
          pdf.text(line, 30, yPosition)
          yPosition += 5
        })
        yPosition += 3
      })

      // 添加新页面用于图表
      if (Object.keys(chartImages).length > 0) {
        pdf.addPage()
        yPosition = 20

        pdf.setFontSize(16)
        pdf.setTextColor(51, 51, 51)
        pdf.text('数据可视化分析', 105, yPosition, { align: 'center' })
        yPosition += 20

        // 添加雷达图
        if (chartImages.radar) {
          pdf.setFontSize(12)
          pdf.text('六维能力雷达图', 20, yPosition)
          yPosition += 10
          
          try {
            pdf.addImage(chartImages.radar, 'PNG', 20, yPosition, 170, 100)
            yPosition += 110
          } catch (error) {
            console.warn('添加雷达图失败:', error)
          }
        }

        // 添加饼图
        if (chartImages.pie && yPosition < 200) {
          pdf.setFontSize(12)
          pdf.text('技术领域分布', 20, yPosition)
          yPosition += 10
          
          try {
            pdf.addImage(chartImages.pie, 'PNG', 20, yPosition, 170, 100)
          } catch (error) {
            console.warn('添加饼图失败:', error)
          }
        }
      }

      // 添加建议和总结
      pdf.addPage()
      yPosition = 20

      pdf.setFontSize(16)
      pdf.text('评估建议', 20, yPosition)
      yPosition += 15

      const suggestions = reportData.suggestions || [
        '继续深化技术理解，关注前沿技术发展趋势',
        '加强实际项目经验积累，提升问题解决能力',
        '保持良好的沟通表达习惯，增强技术分享能力',
        '培养团队协作意识，提升跨部门沟通效率'
      ]

      pdf.setFontSize(11)
      suggestions.forEach((suggestion, index) => {
        pdf.text(`${index + 1}. ${suggestion}`, 25, yPosition)
        yPosition += 8
      })

      yPosition += 15

      // 添加总结
      pdf.setFontSize(16)
      pdf.text('总结', 20, yPosition)
      yPosition += 10

      pdf.setFontSize(11)
      const summary = reportData.summary || 
        '候选人在本次面试中表现良好，技术基础扎实，学习能力强。建议在实际项目经验和团队协作方面进一步提升。总体而言，符合岗位要求，建议进入下一轮面试。'
      
      const summaryLines = pdf.splitTextToSize(summary, 170)
      summaryLines.forEach(line => {
        pdf.text(line, 25, yPosition)
        yPosition += 6
      })

      // 添加页脚
      const pageCount = pdf.internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        pdf.setPage(i)
        pdf.setFontSize(8)
        pdf.setTextColor(153, 153, 153)
        pdf.text(`第 ${i} 页，共 ${pageCount} 页`, 105, 290, { align: 'center' })
        pdf.text('iFlytek面试评估系统 - 智能面试，精准评估', 105, 295, { align: 'center' })
      }

      // 保存PDF
      const fileName = `面试评估报告_${reportData.candidateName || '候选人'}_${new Date().toISOString().split('T')[0]}.pdf`
      pdf.save(fileName)

      return { success: true, fileName }
    } catch (error) {
      console.error('PDF导出失败:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * 导出Word报告
   */
  async exportToWord(reportData, chartImages = {}) {
    try {
      const doc = new Document({
        creator: this.defaultOptions.word.creator,
        title: this.defaultOptions.word.title,
        description: this.defaultOptions.word.description,
        sections: [{
          properties: {},
          children: [
            // 标题
            new Paragraph({
              children: [
                new TextRun({
                  text: '面试评估报告',
                  bold: true,
                  size: 32,
                  color: '333333'
                })
              ],
              heading: HeadingLevel.TITLE,
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 }
            }),

            // 副标题
            new Paragraph({
              children: [
                new TextRun({
                  text: '基于iFlytek星火大模型V3.5的智能分析结果',
                  size: 20,
                  color: '666666'
                })
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 600 }
            }),

            // 基本信息
            new Paragraph({
              children: [
                new TextRun({
                  text: '基本信息',
                  bold: true,
                  size: 24
                })
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 }
            }),

            ...this.createBasicInfoParagraphs(reportData),

            // 总体评分
            new Paragraph({
              children: [
                new TextRun({
                  text: '总体评分',
                  bold: true,
                  size: 24
                })
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `综合得分：${reportData.overallScore || 82}分`,
                  bold: true,
                  size: 20,
                  color: '667eea'
                })
              ],
              spacing: { after: 200 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: `评估等级：${this.getScoreLevel(reportData.overallScore || 82)}`,
                  size: 18
                })
              ],
              spacing: { after: 400 }
            }),

            // 六维能力评估
            new Paragraph({
              children: [
                new TextRun({
                  text: '六维能力评估',
                  bold: true,
                  size: 24
                })
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 }
            }),

            ...this.createCapabilityParagraphs(reportData.capabilities),

            // 评估建议
            new Paragraph({
              children: [
                new TextRun({
                  text: '评估建议',
                  bold: true,
                  size: 24
                })
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 }
            }),

            ...this.createSuggestionParagraphs(reportData.suggestions),

            // 总结
            new Paragraph({
              children: [
                new TextRun({
                  text: '总结',
                  bold: true,
                  size: 24
                })
              ],
              heading: HeadingLevel.HEADING_1,
              spacing: { before: 400, after: 200 }
            }),

            new Paragraph({
              children: [
                new TextRun({
                  text: reportData.summary || 
                    '候选人在本次面试中表现良好，技术基础扎实，学习能力强。建议在实际项目经验和团队协作方面进一步提升。总体而言，符合岗位要求，建议进入下一轮面试。',
                  size: 18
                })
              ],
              spacing: { after: 400 }
            })
          ]
        }]
      })

      // 生成并保存Word文档
      const buffer = await Packer.toBuffer(doc)
      const fileName = `面试评估报告_${reportData.candidateName || '候选人'}_${new Date().toISOString().split('T')[0]}.docx`
      
      saveAs(new Blob([buffer]), fileName)

      return { success: true, fileName }
    } catch (error) {
      console.error('Word导出失败:', error)
      return { success: false, error: error.message }
    }
  }

  /**
   * 创建基本信息段落
   */
  createBasicInfoParagraphs(reportData) {
    const basicInfo = [
      `候选人姓名：${reportData.candidateName || '张三'}`,
      `面试时间：${new Date(reportData.date).toLocaleString('zh-CN')}`,
      `面试时长：${reportData.duration || '25分钟'}`,
      `技术领域：${reportData.domain || '人工智能'}`,
      `面试官：iFlytek AI面试官`,
      `评估模型：iFlytek星火大模型V3.5`
    ]

    return basicInfo.map(info => new Paragraph({
      children: [
        new TextRun({
          text: info,
          size: 18
        })
      ],
      spacing: { after: 100 }
    }))
  }

  /**
   * 创建能力评估段落
   */
  createCapabilityParagraphs(capabilities) {
    const defaultCapabilities = [
      { name: '技术理解能力', score: 85, description: '对技术概念理解深入，能够准确把握核心要点' },
      { name: '问题解决能力', score: 78, description: '具备良好的分析和解决问题的思路' },
      { name: '沟通表达能力', score: 82, description: '表达清晰，逻辑性强，专业术语使用恰当' },
      { name: '学习适应能力', score: 88, description: '学习能力强，对新技术接受度高' },
      { name: '团队协作能力', score: 75, description: '具备基本的团队合作意识' },
      { name: '创新思维能力', score: 80, description: '思维活跃，能提出创新性的解决方案' }
    ]

    const capabilityData = capabilities || defaultCapabilities
    const paragraphs = []

    capabilityData.forEach(capability => {
      paragraphs.push(
        new Paragraph({
          children: [
            new TextRun({
              text: `${capability.name}：${capability.score}分`,
              bold: true,
              size: 18
            })
          ],
          spacing: { before: 200, after: 100 }
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: capability.description,
              size: 16,
              color: '666666'
            })
          ],
          spacing: { after: 200 }
        })
      )
    })

    return paragraphs
  }

  /**
   * 创建建议段落
   */
  createSuggestionParagraphs(suggestions) {
    const defaultSuggestions = [
      '继续深化技术理解，关注前沿技术发展趋势',
      '加强实际项目经验积累，提升问题解决能力',
      '保持良好的沟通表达习惯，增强技术分享能力',
      '培养团队协作意识，提升跨部门沟通效率'
    ]

    const suggestionData = suggestions || defaultSuggestions

    return suggestionData.map((suggestion, index) => new Paragraph({
      children: [
        new TextRun({
          text: `${index + 1}. ${suggestion}`,
          size: 18
        })
      ],
      spacing: { after: 150 }
    }))
  }

  /**
   * 获取分数等级
   */
  getScoreLevel(score) {
    if (score >= 90) return '优秀'
    if (score >= 80) return '良好'
    if (score >= 70) return '中等'
    if (score >= 60) return '及格'
    return '不及格'
  }

  /**
   * 导出Excel格式的详细数据
   */
  async exportToExcel(reportData) {
    // 这里可以集成 xlsx 库来生成Excel文件
    console.log('Excel导出功能待实现')
    return { success: false, error: 'Excel导出功能正在开发中' }
  }
}

// 创建全局实例
const reportExportService = new ReportExportService()

export default reportExportService
