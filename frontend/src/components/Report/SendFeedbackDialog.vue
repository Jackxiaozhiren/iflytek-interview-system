<template>
  <el-dialog
    v-model="visible"
    title="发送面试反馈"
    width="700px"
    :before-close="handleClose"
    class="feedback-dialog"
  >
    <div class="feedback-form">
      <!-- 候选人信息 -->
      <div class="candidate-summary">
        <div class="summary-header">
          <h4>{{ candidateInfo.name }} - {{ candidateInfo.position }}</h4>
          <el-tag :type="getResultType(candidateInfo.result)">
            {{ getResultText(candidateInfo.result) }}
          </el-tag>
        </div>
        <div class="summary-stats">
          <div class="stat-item">
            <span class="label">综合评分：</span>
            <span class="value">{{ candidateInfo.totalScore }}分</span>
          </div>
          <div class="stat-item">
            <span class="label">面试时间：</span>
            <span class="value">{{ candidateInfo.interviewDate }}</span>
          </div>
        </div>
      </div>

      <!-- 反馈表单 -->
      <el-form :model="feedbackForm" :rules="rules" ref="formRef" label-width="120px">
        <!-- 反馈类型 -->
        <el-form-item label="反馈类型" prop="feedbackType">
          <el-radio-group v-model="feedbackForm.feedbackType">
            <el-radio label="pass">通过 - 邀请下一轮</el-radio>
            <el-radio label="reject">不通过 - 感谢参与</el-radio>
            <el-radio label="pending">待定 - 需要补充材料</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 发送方式 -->
        <el-form-item label="发送方式" prop="sendMethod">
          <el-checkbox-group v-model="feedbackForm.sendMethod">
            <el-checkbox label="email">邮件通知</el-checkbox>
            <el-checkbox label="sms">短信通知</el-checkbox>
            <el-checkbox label="phone">电话通知</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- 联系信息 -->
        <el-form-item label="邮箱地址" prop="email" v-if="feedbackForm.sendMethod.includes('email')">
          <el-input v-model="feedbackForm.email" placeholder="请输入候选人邮箱" />
        </el-form-item>

        <el-form-item label="手机号码" prop="phone" v-if="feedbackForm.sendMethod.includes('sms')">
          <el-input v-model="feedbackForm.phone" placeholder="请输入候选人手机号" />
        </el-form-item>

        <!-- 反馈内容模板 -->
        <el-form-item label="内容模板" prop="template">
          <el-select v-model="feedbackForm.template" placeholder="选择反馈模板" @change="handleTemplateChange">
            <el-option
              v-for="template in feedbackTemplates"
              :key="template.id"
              :label="template.name"
              :value="template.id"
            />
          </el-select>
        </el-form-item>

        <!-- 反馈内容 -->
        <el-form-item label="反馈内容" prop="content">
          <el-input
            v-model="feedbackForm.content"
            type="textarea"
            :rows="8"
            placeholder="请输入详细的面试反馈..."
          />
        </el-form-item>

        <!-- 改进建议 -->
        <el-form-item label="改进建议" v-if="feedbackForm.feedbackType === 'reject'">
          <el-input
            v-model="feedbackForm.suggestions"
            type="textarea"
            :rows="4"
            placeholder="请提供具体的改进建议..."
          />
        </el-form-item>

        <!-- 下一步安排 -->
        <el-form-item label="下一步安排" v-if="feedbackForm.feedbackType === 'pass'">
          <el-input
            v-model="feedbackForm.nextSteps"
            type="textarea"
            :rows="3"
            placeholder="请说明下一轮面试安排..."
          />
        </el-form-item>

        <!-- 补充材料 -->
        <el-form-item label="需要材料" v-if="feedbackForm.feedbackType === 'pending'">
          <el-checkbox-group v-model="feedbackForm.requiredMaterials">
            <el-checkbox label="portfolio">作品集</el-checkbox>
            <el-checkbox label="certificate">技术证书</el-checkbox>
            <el-checkbox label="reference">推荐信</el-checkbox>
            <el-checkbox label="code_sample">代码样例</el-checkbox>
            <el-checkbox label="other">其他材料</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- 发送时间 -->
        <el-form-item label="发送时间" prop="sendTime">
          <el-radio-group v-model="feedbackForm.sendTime">
            <el-radio label="immediate">立即发送</el-radio>
            <el-radio label="scheduled">定时发送</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item v-if="feedbackForm.sendTime === 'scheduled'" label="发送时间">
          <el-date-picker
            v-model="feedbackForm.scheduledTime"
            type="datetime"
            placeholder="选择发送时间"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
          />
        </el-form-item>
      </el-form>

      <!-- 预览区域 -->
      <div class="preview-section" v-if="feedbackForm.content">
        <h4>反馈预览</h4>
        <div class="preview-content">
          <div class="preview-header">
            <strong>{{ getResultText(feedbackForm.feedbackType) }}</strong>
          </div>
          <div class="preview-body">
            {{ feedbackForm.content }}
          </div>
          <div class="preview-footer" v-if="feedbackForm.suggestions || feedbackForm.nextSteps">
            <div v-if="feedbackForm.suggestions">
              <strong>改进建议：</strong>
              <p>{{ feedbackForm.suggestions }}</p>
            </div>
            <div v-if="feedbackForm.nextSteps">
              <strong>下一步安排：</strong>
              <p>{{ feedbackForm.nextSteps }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button @click="handlePreview">预览</el-button>
        <el-button type="primary" @click="handleSend" :loading="sending">
          {{ feedbackForm.sendTime === 'immediate' ? '立即发送' : '定时发送' }}
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const props = defineProps({
  modelValue: Boolean,
  candidateInfo: {
    type: Object,
    default: () => ({
      name: '张三',
      position: 'AI算法工程师',
      totalScore: 78,
      result: 'pass',
      interviewDate: '2024-01-15'
    })
  }
})

const emit = defineEmits(['update:modelValue', 'sent'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const formRef = ref()
const sending = ref(false)

// 表单数据
const feedbackForm = reactive({
  feedbackType: 'pass',
  sendMethod: ['email'],
  email: '',
  phone: '',
  template: '',
  content: '',
  suggestions: '',
  nextSteps: '',
  requiredMaterials: [],
  sendTime: 'immediate',
  scheduledTime: ''
})

// 反馈模板
const feedbackTemplates = ref([
  {
    id: 'pass_technical',
    name: '技术面试通过模板',
    content: `尊敬的${props.candidateInfo.name}，

感谢您参加我们的技术面试。经过综合评估，您在技术能力、项目经验等方面表现优秀，我们很高兴地通知您已通过本轮面试。

您的技术深度和实践经验给我们留下了深刻印象，特别是在以下方面：
- 扎实的技术基础
- 丰富的项目实践经验
- 良好的问题解决能力

我们期待与您进一步交流，HR同事将在近期与您联系安排下一轮面试。

祝好！
iFlytek 招聘团队`
  },
  {
    id: 'reject_polite',
    name: '礼貌拒绝模板',
    content: `尊敬的${props.candidateInfo.name}，

感谢您参加我们的面试，我们很欣赏您抽出宝贵时间与我们交流。

经过仔细评估，虽然您展现了一定的技术能力，但目前可能还不完全符合我们这个职位的具体要求。这并不意味着您的能力有问题，只是在某些特定技能方面还有提升空间。

我们建议您可以在以下方面继续提升：
[具体建议将在下方填写]

希望您能继续关注我们公司，期待未来有机会再次合作。

祝您工作顺利！
iFlytek 招聘团队`
  }
])

// 表单验证规则
const rules = {
  feedbackType: [
    { required: true, message: '请选择反馈类型', trigger: 'change' }
  ],
  sendMethod: [
    { type: 'array', min: 1, message: '请至少选择一种发送方式', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入反馈内容', trigger: 'blur' },
    { min: 50, message: '反馈内容至少50个字符', trigger: 'blur' }
  ]
}

// 获取结果类型
const getResultType = (result) => {
  const typeMap = {
    pass: 'success',
    reject: 'danger',
    pending: 'warning'
  }
  return typeMap[result] || 'info'
}

// 获取结果文本
const getResultText = (result) => {
  const textMap = {
    pass: '面试通过',
    reject: '面试未通过',
    pending: '待定'
  }
  return textMap[result] || '未知'
}

// 处理模板变化
const handleTemplateChange = (templateId) => {
  const template = feedbackTemplates.value.find(t => t.id === templateId)
  if (template) {
    feedbackForm.content = template.content
  }
}

// 处理预览
const handlePreview = () => {
  if (!feedbackForm.content) {
    ElMessage.warning('请先输入反馈内容')
    return
  }
  
  ElMessageBox.alert(feedbackForm.content, '反馈预览', {
    confirmButtonText: '确定',
    type: 'info'
  })
}

// 处理关闭
const handleClose = () => {
  visible.value = false
}

// 处理发送
const handleSend = async () => {
  try {
    await formRef.value.validate()
    sending.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    const feedbackData = {
      ...feedbackForm,
      candidateId: props.candidateInfo.id,
      candidateName: props.candidateInfo.name,
      sentAt: new Date().toISOString()
    }
    
    emit('sent', feedbackData)
    ElMessage.success('反馈发送成功！')
    handleClose()
    
  } catch (error) {
    console.error('反馈发送失败:', error)
  } finally {
    sending.value = false
  }
}
</script>

<style scoped>
.feedback-dialog {
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
}

.feedback-form {
  max-height: 600px;
  overflow-y: auto;
}

.candidate-summary {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.summary-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.summary-header h4 {
  margin: 0;
  color: #1890ff;
  font-size: 16px;
  font-weight: 600;
}

.summary-stats {
  display: flex;
  gap: 24px;
}

.stat-item {
  display: flex;
  gap: 8px;
}

.stat-item .label {
  color: #666;
  font-weight: 500;
}

.stat-item .value {
  color: #333;
  font-weight: 600;
}

.preview-section {
  margin-top: 24px;
  border-top: 1px solid #e5e7eb;
  padding-top: 24px;
}

.preview-section h4 {
  margin: 0 0 16px 0;
  color: #1890ff;
  font-size: 16px;
  font-weight: 600;
}

.preview-content {
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
}

.preview-header {
  color: #1890ff;
  font-weight: 600;
  margin-bottom: 12px;
}

.preview-body {
  line-height: 1.6;
  margin-bottom: 16px;
  white-space: pre-line;
}

.preview-footer strong {
  color: #333;
}

.preview-footer p {
  margin: 8px 0;
  color: #666;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .feedback-dialog {
    width: 95% !important;
  }
  
  .summary-stats {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
