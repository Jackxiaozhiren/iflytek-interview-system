<template>
  <el-dialog
    v-model="visible"
    title="安排下一轮面试"
    width="800px"
    :before-close="handleClose"
    class="schedule-dialog"
  >
    <div class="schedule-form">
      <!-- 候选人信息 -->
      <div class="candidate-info">
        <h4>候选人信息</h4>
        <div class="info-grid">
          <div class="info-item">
            <label>姓名：</label>
            <span>{{ candidateInfo.name }}</span>
          </div>
          <div class="info-item">
            <label>职位：</label>
            <span>{{ candidateInfo.position }}</span>
          </div>
          <div class="info-item">
            <label>上轮评分：</label>
            <el-tag :type="getScoreType(candidateInfo.lastScore)">
              {{ candidateInfo.lastScore }}分
            </el-tag>
          </div>
        </div>
      </div>

      <!-- 面试安排表单 -->
      <el-form :model="scheduleForm" :rules="rules" ref="formRef" label-width="120px">
        <!-- 面试类型 -->
        <el-form-item label="面试类型" prop="interviewType">
          <el-select v-model="scheduleForm.interviewType" placeholder="请选择面试类型" style="width: 100%">
            <el-option label="技术深度面试" value="technical_deep" />
            <el-option label="项目经验面试" value="project_experience" />
            <el-option label="综合能力面试" value="comprehensive" />
            <el-option label="终面/HR面试" value="final_hr" />
          </el-select>
        </el-form-item>

        <!-- 面试时间 -->
        <el-form-item label="面试时间" prop="interviewTime">
          <el-date-picker
            v-model="scheduleForm.interviewTime"
            type="datetime"
            placeholder="选择面试时间"
            style="width: 100%"
            :disabled-date="disabledDate"
            :disabled-hours="disabledHours"
            format="YYYY-MM-DD HH:mm"
            value-format="YYYY-MM-DD HH:mm"
          />
        </el-form-item>

        <!-- 面试时长 -->
        <el-form-item label="预计时长" prop="duration">
          <el-select v-model="scheduleForm.duration" placeholder="选择面试时长">
            <el-option label="30分钟" :value="30" />
            <el-option label="45分钟" :value="45" />
            <el-option label="60分钟" :value="60" />
            <el-option label="90分钟" :value="90" />
          </el-select>
        </el-form-item>

        <!-- 面试官分配 -->
        <el-form-item label="面试官" prop="interviewer">
          <el-select v-model="scheduleForm.interviewer" placeholder="选择面试官" style="width: 100%">
            <el-option
              v-for="interviewer in interviewers"
              :key="interviewer.id"
              :label="`${interviewer.name} - ${interviewer.title}`"
              :value="interviewer.id"
            >
              <div class="interviewer-option">
                <span>{{ interviewer.name }}</span>
                <span class="interviewer-title">{{ interviewer.title }}</span>
                <el-tag size="small" :type="interviewer.available ? 'success' : 'danger'">
                  {{ interviewer.available ? '可用' : '忙碌' }}
                </el-tag>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <!-- 面试方式 -->
        <el-form-item label="面试方式" prop="method">
          <el-radio-group v-model="scheduleForm.method">
            <el-radio value="online">在线面试</el-radio>
            <el-radio value="offline">现场面试</el-radio>
            <el-radio value="phone">电话面试</el-radio>
          </el-radio-group>
        </el-form-item>

        <!-- 面试地点/链接 -->
        <el-form-item 
          :label="scheduleForm.method === 'online' ? '会议链接' : '面试地点'" 
          prop="location"
          v-if="scheduleForm.method !== 'phone'"
        >
          <el-input
            v-model="scheduleForm.location"
            :placeholder="scheduleForm.method === 'online' ? '请输入会议室链接' : '请输入面试地点'"
          />
        </el-form-item>

        <!-- 面试重点 -->
        <el-form-item label="面试重点" prop="focus">
          <el-checkbox-group v-model="scheduleForm.focus">
            <el-checkbox value="technical">技术深度</el-checkbox>
            <el-checkbox value="project">项目经验</el-checkbox>
            <el-checkbox value="communication">沟通能力</el-checkbox>
            <el-checkbox value="leadership">领导力</el-checkbox>
            <el-checkbox value="problem_solving">问题解决</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- 备注 -->
        <el-form-item label="备注信息">
          <el-input
            v-model="scheduleForm.notes"
            type="textarea"
            :rows="3"
            placeholder="请输入面试备注信息..."
          />
        </el-form-item>
      </el-form>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          确认安排
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: Boolean,
  candidateInfo: {
    type: Object,
    default: () => ({
      name: '张三',
      position: 'AI算法工程师',
      lastScore: 78
    })
  }
})

const emit = defineEmits(['update:modelValue', 'scheduled'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const formRef = ref()
const submitting = ref(false)

// 表单数据
const scheduleForm = reactive({
  interviewType: '',
  interviewTime: '',
  duration: 60,
  interviewer: '',
  method: 'online',
  location: '',
  focus: [],
  notes: ''
})

// 面试官列表
const interviewers = ref([
  { id: 1, name: '李技术', title: '技术总监', available: true },
  { id: 2, name: '王架构', title: '架构师', available: true },
  { id: 3, name: '陈专家', title: 'AI专家', available: false },
  { id: 4, name: '刘经理', title: 'HR经理', available: true }
])

// 表单验证规则
const rules = {
  interviewType: [
    { required: true, message: '请选择面试类型', trigger: 'change' }
  ],
  interviewTime: [
    { required: true, message: '请选择面试时间', trigger: 'change' }
  ],
  interviewer: [
    { required: true, message: '请选择面试官', trigger: 'change' }
  ],
  method: [
    { required: true, message: '请选择面试方式', trigger: 'change' }
  ],
  location: [
    { required: true, message: '请输入面试地点或链接', trigger: 'blur' }
  ],
  focus: [
    { type: 'array', min: 1, message: '请至少选择一个面试重点', trigger: 'change' }
  ]
}

// 禁用过去的日期
const disabledDate = (time) => {
  return time.getTime() < Date.now() - 8.64e7 // 禁用昨天之前的日期
}

// 禁用非工作时间
const disabledHours = () => {
  const hours = []
  for (let i = 0; i < 9; i++) hours.push(i) // 9点前
  for (let i = 18; i < 24; i++) hours.push(i) // 18点后
  return hours
}

// 获取评分类型
const getScoreType = (score) => {
  if (score >= 85) return 'success'
  if (score >= 70) return 'warning'
  return 'danger'
}

// 处理关闭
const handleClose = () => {
  visible.value = false
}

// 处理提交
const handleSubmit = async () => {
  try {
    await formRef.value.validate()
    submitting.value = true
    
    // 模拟API调用
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const scheduleData = {
      ...scheduleForm,
      candidateId: props.candidateInfo.id,
      candidateName: props.candidateInfo.name,
      scheduledAt: new Date().toISOString()
    }
    
    emit('scheduled', scheduleData)
    ElMessage.success('面试安排成功！已发送通知给相关人员')
    handleClose()
    
  } catch (error) {
    console.error('面试安排失败:', error)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.schedule-dialog {
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
}

.schedule-form {
  max-height: 600px;
  overflow-y: auto;
}

.candidate-info {
  background: #f8fafc;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 24px;
}

.candidate-info h4 {
  margin: 0 0 12px 0;
  color: #1890ff;
  font-size: 16px;
  font-weight: 600;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-item label {
  font-weight: 500;
  color: #666;
}

.interviewer-option {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.interviewer-title {
  color: #999;
  font-size: 12px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .schedule-dialog {
    width: 95% !important;
  }
  
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
