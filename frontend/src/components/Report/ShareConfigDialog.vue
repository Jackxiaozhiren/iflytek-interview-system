<template>
  <el-dialog
    v-model="visible"
    title="分享报告设置"
    width="500px"
    :before-close="handleClose"
    class="share-config-dialog"
  >
    <div class="share-config-content">
      <!-- 基本设置 -->
      <div class="config-section">
        <h4 class="section-title">
          <el-icon><Setting /></el-icon>
          基本设置
        </h4>
        
        <el-form :model="shareConfig" label-width="100px" class="share-form">
          <el-form-item label="分享标题">
            <el-input 
              v-model="shareConfig.title" 
              placeholder="请输入分享标题"
              maxlength="50"
              show-word-limit
            />
          </el-form-item>
          
          <el-form-item label="有效期">
            <el-select v-model="shareConfig.expiryType" @change="updateExpiry">
              <el-option label="1天" value="1day" />
              <el-option label="3天" value="3days" />
              <el-option label="1周" value="1week" />
              <el-option label="1个月" value="1month" />
              <el-option label="自定义" value="custom" />
            </el-select>
          </el-form-item>
          
          <el-form-item v-if="shareConfig.expiryType === 'custom'" label="自定义时间">
            <el-date-picker
              v-model="shareConfig.customExpiry"
              type="datetime"
              placeholder="选择过期时间"
              :disabled-date="disabledDate"
              format="YYYY-MM-DD HH:mm"
              value-format="YYYY-MM-DD HH:mm:ss"
            />
          </el-form-item>
          
          <el-form-item label="访问限制">
            <el-input-number 
              v-model="shareConfig.maxAccess" 
              :min="1" 
              :max="1000"
              placeholder="最大访问次数"
            />
            <span class="form-tip">设置最大访问次数，超过后链接失效</span>
          </el-form-item>
        </el-form>
      </div>

      <!-- 权限设置 -->
      <div class="config-section">
        <h4 class="section-title">
          <el-icon><Lock /></el-icon>
          权限设置
        </h4>
        
        <div class="permission-options">
          <el-checkbox v-model="shareConfig.allowDownload" class="permission-item">
            <el-icon><Download /></el-icon>
            允许下载报告
          </el-checkbox>
          
          <el-checkbox v-model="shareConfig.allowPrint" class="permission-item">
            <el-icon><Printer /></el-icon>
            允许打印报告
          </el-checkbox>
          
          <el-checkbox v-model="shareConfig.requirePassword" class="permission-item">
            <el-icon><Key /></el-icon>
            需要访问密码
          </el-checkbox>
        </div>
        
        <el-form-item v-if="shareConfig.requirePassword" label="访问密码" class="password-input">
          <el-input 
            v-model="shareConfig.password" 
            type="password"
            placeholder="请设置访问密码"
            maxlength="20"
            show-password
          />
        </el-form-item>
      </div>

      <!-- 预览信息 -->
      <div class="config-section">
        <h4 class="section-title">
          <el-icon><View /></el-icon>
          分享预览
        </h4>
        
        <div class="share-preview">
          <div class="preview-item">
            <span class="preview-label">分享标题：</span>
            <span class="preview-value">{{ shareConfig.title || '未设置' }}</span>
          </div>
          <div class="preview-item">
            <span class="preview-label">有效期至：</span>
            <span class="preview-value">{{ formatExpiry }}</span>
          </div>
          <div class="preview-item">
            <span class="preview-label">访问限制：</span>
            <span class="preview-value">最多 {{ shareConfig.maxAccess }} 次</span>
          </div>
          <div class="preview-item">
            <span class="preview-label">权限设置：</span>
            <div class="preview-permissions">
              <el-tag v-if="shareConfig.allowDownload" size="small" type="success">可下载</el-tag>
              <el-tag v-if="shareConfig.allowPrint" size="small" type="primary">可打印</el-tag>
              <el-tag v-if="shareConfig.requirePassword" size="small" type="warning">需密码</el-tag>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm" :loading="loading">
          <el-icon><Share /></el-icon>
          创建分享链接
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { ElMessage } from 'element-plus'
import {
  Setting, Lock, View, Download, Printer, Key, Share
} from '@element-plus/icons-vue'

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false
  },
  reportData: {
    type: Object,
    default: () => ({})
  }
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const visible = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const loading = ref(false)

// 分享配置
const shareConfig = ref({
  title: '',
  expiryType: '1week',
  customExpiry: null,
  maxAccess: 100,
  allowDownload: true,
  allowPrint: true,
  requirePassword: false,
  password: ''
})

// 监听报告数据变化，自动设置标题
watch(() => props.reportData, (newData) => {
  if (newData && newData.candidateName) {
    shareConfig.value.title = `${newData.candidateName}的面试评估报告`
  }
}, { immediate: true })

// 格式化过期时间显示
const formatExpiry = computed(() => {
  const now = new Date()
  let expiryDate
  
  switch (shareConfig.value.expiryType) {
    case '1day':
      expiryDate = new Date(now.getTime() + 24 * 60 * 60 * 1000)
      break
    case '3days':
      expiryDate = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
      break
    case '1week':
      expiryDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      break
    case '1month':
      expiryDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      break
    case 'custom':
      expiryDate = shareConfig.value.customExpiry ? new Date(shareConfig.value.customExpiry) : new Date()
      break
    default:
      expiryDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
  }
  
  return expiryDate.toLocaleString('zh-CN')
})

// 更新过期时间
const updateExpiry = () => {
  if (shareConfig.value.expiryType !== 'custom') {
    shareConfig.value.customExpiry = null
  }
}

// 禁用过去的日期
const disabledDate = (time) => {
  return time.getTime() < Date.now()
}

// 处理关闭
const handleClose = () => {
  visible.value = false
}

// 处理确认
const handleConfirm = async () => {
  // 验证配置
  if (!shareConfig.value.title.trim()) {
    ElMessage.warning('请输入分享标题')
    return
  }
  
  if (shareConfig.value.expiryType === 'custom' && !shareConfig.value.customExpiry) {
    ElMessage.warning('请选择自定义过期时间')
    return
  }
  
  if (shareConfig.value.requirePassword && !shareConfig.value.password.trim()) {
    ElMessage.warning('请设置访问密码')
    return
  }

  loading.value = true
  
  try {
    // 计算过期时间
    let expiresAt
    const now = new Date()
    
    switch (shareConfig.value.expiryType) {
      case '1day':
        expiresAt = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString()
        break
      case '3days':
        expiresAt = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString()
        break
      case '1week':
        expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
        break
      case '1month':
        expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString()
        break
      case 'custom':
        expiresAt = new Date(shareConfig.value.customExpiry).toISOString()
        break
      default:
        expiresAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }

    const options = {
      title: shareConfig.value.title,
      expiresAt,
      maxAccess: shareConfig.value.maxAccess,
      allowDownload: shareConfig.value.allowDownload,
      allowPrint: shareConfig.value.allowPrint,
      password: shareConfig.value.requirePassword ? shareConfig.value.password : null,
      permissions: {
        canView: true,
        canDownload: shareConfig.value.allowDownload,
        canPrint: shareConfig.value.allowPrint
      }
    }

    emit('confirm', options)
    visible.value = false
    
  } catch (error) {
    console.error('分享配置确认失败:', error)
    ElMessage.error('配置失败，请稍后重试')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.share-config-dialog {
  --el-dialog-border-radius: 12px;
}

.share-config-content {
  max-height: 60vh;
  overflow-y: auto;
}

.config-section {
  margin-bottom: 24px;
  padding: 16px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #f0f0f0;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 0 0 16px 0;
  font-size: 14px;
  font-weight: 600;
  color: #1890ff;
}

.share-form .el-form-item {
  margin-bottom: 16px;
}

.form-tip {
  font-size: 12px;
  color: #999;
  margin-left: 8px;
}

.permission-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.permission-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
}

.password-input {
  margin-top: 16px;
}

.share-preview {
  background: white;
  padding: 16px;
  border-radius: 6px;
  border: 1px solid #e8e8e8;
}

.preview-item {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.preview-item:last-child {
  margin-bottom: 0;
}

.preview-label {
  font-weight: 500;
  color: #666;
  min-width: 80px;
}

.preview-value {
  color: #333;
  flex: 1;
}

.preview-permissions {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .share-config-dialog {
    width: 95% !important;
  }
  
  .config-section {
    padding: 12px;
  }
  
  .permission-options {
    gap: 8px;
  }
  
  .preview-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
  
  .preview-label {
    min-width: auto;
    font-size: 12px;
  }
}
</style>
