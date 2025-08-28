<template>
  <el-dialog
    v-model="visible"
    title="加入人才库"
    width="600px"
    :before-close="handleClose"
    class="talent-dialog"
  >
    <div class="talent-form">
      <!-- 候选人信息 -->
      <div class="candidate-profile">
        <div class="profile-header">
          <div class="avatar-section">
            <el-avatar :size="60" :src="candidateInfo.avatar">
              {{ candidateInfo.name.charAt(0) }}
            </el-avatar>
          </div>
          <div class="basic-info">
            <h3>{{ candidateInfo.name }}</h3>
            <p>{{ candidateInfo.position }}</p>
            <div class="score-badge">
              <el-tag :type="getScoreType(candidateInfo.totalScore)" size="large">
                综合评分：{{ candidateInfo.totalScore }}分
              </el-tag>
            </div>
          </div>
        </div>
        
        <div class="skills-preview">
          <h4>技能标签</h4>
          <div class="skills-tags">
            <el-tag
              v-for="skill in candidateInfo.skills"
              :key="skill"
              class="skill-tag"
              :type="getSkillType(skill)"
            >
              {{ skill }}
            </el-tag>
          </div>
        </div>
      </div>

      <!-- 人才库表单 -->
      <el-form :model="talentForm" :rules="rules" ref="formRef" label-width="120px">
        <!-- 人才等级 -->
        <el-form-item label="人才等级" prop="level">
          <el-select v-model="talentForm.level" placeholder="选择人才等级" style="width: 100%">
            <el-option label="S级 - 顶尖人才" value="S" />
            <el-option label="A级 - 优秀人才" value="A" />
            <el-option label="B级 - 合格人才" value="B" />
            <el-option label="C级 - 潜力人才" value="C" />
          </el-select>
        </el-form-item>

        <!-- 专业领域 -->
        <el-form-item label="专业领域" prop="domains">
          <el-checkbox-group v-model="talentForm.domains">
            <el-checkbox value="ai">人工智能</el-checkbox>
            <el-checkbox value="bigdata">大数据</el-checkbox>
            <el-checkbox value="iot">物联网</el-checkbox>
            <el-checkbox value="frontend">前端开发</el-checkbox>
            <el-checkbox value="backend">后端开发</el-checkbox>
            <el-checkbox value="mobile">移动开发</el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <!-- 工作年限 -->
        <el-form-item label="工作年限" prop="experience">
          <el-select v-model="talentForm.experience" placeholder="选择工作年限">
            <el-option label="1-3年" value="1-3" />
            <el-option label="3-5年" value="3-5" />
            <el-option label="5-8年" value="5-8" />
            <el-option label="8年以上" value="8+" />
          </el-select>
        </el-form-item>

        <!-- 期望薪资 -->
        <el-form-item label="期望薪资" prop="expectedSalary">
          <el-input-number
            v-model="talentForm.expectedSalary"
            :min="0"
            :max="1000000"
            :step="1000"
            placeholder="期望薪资"
            style="width: 200px"
          />
          <span style="margin-left: 8px;">元/月</span>
        </el-form-item>

        <!-- 可入职时间 -->
        <el-form-item label="可入职时间" prop="availableDate">
          <el-date-picker
            v-model="talentForm.availableDate"
            type="date"
            placeholder="选择可入职时间"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD"
          />
        </el-form-item>

        <!-- 联系方式 -->
        <el-form-item label="联系邮箱" prop="email">
          <el-input v-model="talentForm.email" placeholder="请输入邮箱地址" />
        </el-form-item>

        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="talentForm.phone" placeholder="请输入手机号码" />
        </el-form-item>

        <!-- 标签管理 -->
        <el-form-item label="自定义标签">
          <div class="tags-input">
            <el-tag
              v-for="tag in talentForm.customTags"
              :key="tag"
              closable
              @close="removeTag(tag)"
              class="custom-tag"
            >
              {{ tag }}
            </el-tag>
            <el-input
              v-if="inputVisible"
              ref="inputRef"
              v-model="inputValue"
              size="small"
              @keyup.enter="handleInputConfirm"
              @blur="handleInputConfirm"
              style="width: 100px"
            />
            <el-button v-else size="small" @click="showInput">+ 添加标签</el-button>
          </div>
        </el-form-item>

        <!-- 备注信息 -->
        <el-form-item label="备注信息">
          <el-input
            v-model="talentForm.notes"
            type="textarea"
            :rows="4"
            placeholder="请输入备注信息，如特殊技能、项目经验等..."
          />
        </el-form-item>

        <!-- 跟进提醒 -->
        <el-form-item label="跟进提醒">
          <el-switch
            v-model="talentForm.followUpReminder"
            active-text="开启定期跟进提醒"
            inactive-text="不设置提醒"
          />
        </el-form-item>

        <el-form-item v-if="talentForm.followUpReminder" label="提醒频率">
          <el-select v-model="talentForm.reminderFrequency" placeholder="选择提醒频率">
            <el-option label="每月" value="monthly" />
            <el-option label="每季度" value="quarterly" />
            <el-option label="每半年" value="biannual" />
          </el-select>
        </el-form-item>
      </el-form>

      <!-- 操作预览 -->
      <div class="action-preview">
        <h4>加入人才库后的操作</h4>
        <ul class="action-list">
          <li>✅ 候选人信息将保存到企业人才数据库</li>
          <li>✅ 支持按技能、经验、薪资等条件快速检索</li>
          <li>✅ 可设置定期跟进提醒，保持人才联系</li>
          <li>✅ 适合职位时可快速邀请面试</li>
          <li>✅ 支持人才推荐和内部分享</li>
        </ul>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          加入人才库
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, reactive, computed, nextTick } from 'vue'
import { ElMessage } from 'element-plus'

const props = defineProps({
  modelValue: Boolean,
  candidateInfo: {
    type: Object,
    default: () => ({
      name: '张三',
      position: 'AI算法工程师',
      totalScore: 78,
      avatar: '',
      skills: ['Python', 'TensorFlow', '机器学习', '深度学习']
    })
  }
})

const emit = defineEmits(['update:modelValue', 'added'])

const visible = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val)
})

const formRef = ref()
const inputRef = ref()
const submitting = ref(false)
const inputVisible = ref(false)
const inputValue = ref('')

// 表单数据
const talentForm = reactive({
  level: 'A',
  domains: ['ai'],
  experience: '3-5',
  expectedSalary: 25000,
  availableDate: '',
  email: '',
  phone: '',
  customTags: [],
  notes: '',
  followUpReminder: true,
  reminderFrequency: 'quarterly'
})

// 表单验证规则
const rules = {
  level: [
    { required: true, message: '请选择人才等级', trigger: 'change' }
  ],
  domains: [
    { type: 'array', min: 1, message: '请至少选择一个专业领域', trigger: 'change' }
  ],
  experience: [
    { required: true, message: '请选择工作年限', trigger: 'change' }
  ],
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号码', trigger: 'blur' }
  ]
}

// 获取评分类型
const getScoreType = (score) => {
  if (score >= 85) return 'success'
  if (score >= 70) return 'warning'
  return 'danger'
}

// 获取技能类型
const getSkillType = (skill) => {
  const types = ['', 'success', 'info', 'warning', 'danger']
  return types[skill.length % types.length]
}

// 显示输入框
const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    inputRef.value?.focus()
  })
}

// 确认输入
const handleInputConfirm = () => {
  if (inputValue.value && !talentForm.customTags.includes(inputValue.value)) {
    talentForm.customTags.push(inputValue.value)
  }
  inputVisible.value = false
  inputValue.value = ''
}

// 移除标签
const removeTag = (tag) => {
  const index = talentForm.customTags.indexOf(tag)
  if (index > -1) {
    talentForm.customTags.splice(index, 1)
  }
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
    
    const talentData = {
      ...talentForm,
      candidateId: props.candidateInfo.id,
      candidateName: props.candidateInfo.name,
      candidatePosition: props.candidateInfo.position,
      candidateScore: props.candidateInfo.totalScore,
      candidateSkills: props.candidateInfo.skills,
      addedAt: new Date().toISOString()
    }
    
    emit('added', talentData)
    ElMessage.success('已成功加入人才库！')
    handleClose()
    
  } catch (error) {
    console.error('加入人才库失败:', error)
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.talent-dialog {
  font-family: 'Microsoft YaHei', 'SimHei', sans-serif;
}

.talent-form {
  max-height: 600px;
  overflow-y: auto;
}

.candidate-profile {
  background: #f8fafc;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 24px;
}

.profile-header {
  display: flex;
  gap: 16px;
  margin-bottom: 20px;
}

.basic-info h3 {
  margin: 0 0 4px 0;
  color: #1890ff;
  font-size: 18px;
  font-weight: 600;
}

.basic-info p {
  margin: 0 0 8px 0;
  color: #666;
  font-size: 14px;
}

.skills-preview h4 {
  margin: 0 0 12px 0;
  color: #333;
  font-size: 14px;
  font-weight: 600;
}

.skills-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.skill-tag {
  margin: 0;
}

.tags-input {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.custom-tag {
  margin: 0;
}

.action-preview {
  background: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 8px;
  padding: 16px;
  margin-top: 24px;
}

.action-preview h4 {
  margin: 0 0 12px 0;
  color: #0369a1;
  font-size: 14px;
  font-weight: 600;
}

.action-list {
  margin: 0;
  padding-left: 0;
  list-style: none;
}

.action-list li {
  margin-bottom: 8px;
  color: #0369a1;
  font-size: 13px;
  line-height: 1.4;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .talent-dialog {
    width: 95% !important;
  }
  
  .profile-header {
    flex-direction: column;
    text-align: center;
  }
}
</style>
