<template>
  <div class="icon-test-page">
    <el-card>
      <template #header>
        <h2>Element Plus 图标测试页面</h2>
        <p>验证所有图标是否正常加载</p>
      </template>
      
      <div class="icon-grid">
        <div v-for="icon in testIcons" :key="icon.name" class="icon-item">
          <el-icon :size="24">
            <component :is="icon.component" />
          </el-icon>
          <span class="icon-name">{{ icon.name }}</span>
        </div>
      </div>
      
      <el-divider />
      
      <div class="test-results">
        <h3>测试结果</h3>
        <el-alert 
          v-if="allIconsLoaded" 
          title="所有图标加载成功！" 
          type="success" 
          :closable="false"
        />
        <el-alert 
          v-else 
          title="部分图标加载失败" 
          type="warning" 
          :closable="false"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  // 基础图标
  User, ArrowLeft, Check, Setting, Lock, Star, Document,
  // 系统图标
  Reading, Guide, MagicStick, Notebook, QuestionFilled,
  WarningFilled, Menu, ZoomIn, ZoomOut, FullScreen,
  StarFilled, RefreshRight, SuccessFilled, UploadFilled,
  CaretTop, UserFilled, School, List, CaretBottom,
  CloseBold, Select, Brush, Bottom, ChatLineRound,
  DataLine, Filter, Mouse, Platform, Headset,
  Pointer, Lightning, Right, Sort, Money, Service,
  MoreFilled, DocumentAdd, RefreshLeft, PieChart,
  Back, Sunny, CircleCloseFilled,
  // 常用图标
  VideoPlay, TrendCharts, Grid, Cpu, DataBoard,
  Upload, Download, Search, Edit, Delete,
  Plus, Minus, Refresh, Close, Warning, InfoFilled
} from '@element-plus/icons-vue'

const testIcons = ref([
  // 基础图标测试
  { name: 'User', component: User },
  { name: 'ArrowLeft', component: ArrowLeft },
  { name: 'Check', component: Check },
  { name: 'Setting', component: Setting },
  { name: 'Lock', component: Lock },
  { name: 'Star', component: Star },
  { name: 'Document', component: Document },
  
  // 系统图标测试
  { name: 'Reading', component: Reading },
  { name: 'Guide', component: Guide },
  { name: 'MagicStick', component: MagicStick },
  { name: 'Notebook', component: Notebook },
  { name: 'QuestionFilled', component: QuestionFilled },
  { name: 'WarningFilled', component: WarningFilled },
  { name: 'Menu', component: Menu },
  { name: 'ZoomIn', component: ZoomIn },
  { name: 'ZoomOut', component: ZoomOut },
  { name: 'FullScreen', component: FullScreen },
  { name: 'StarFilled', component: StarFilled },
  { name: 'RefreshRight', component: RefreshRight },
  { name: 'SuccessFilled', component: SuccessFilled },
  { name: 'UploadFilled', component: UploadFilled },
  { name: 'CaretTop', component: CaretTop },
  { name: 'UserFilled', component: UserFilled },
  { name: 'School', component: School },
  { name: 'List', component: List },
  { name: 'CaretBottom', component: CaretBottom },
  { name: 'CloseBold', component: CloseBold },
  { name: 'Select', component: Select },
  { name: 'Brush', component: Brush },
  { name: 'Bottom', component: Bottom },
  { name: 'ChatLineRound', component: ChatLineRound },
  { name: 'DataLine', component: DataLine },
  { name: 'Filter', component: Filter },
  { name: 'Mouse', component: Mouse },
  { name: 'Platform', component: Platform },
  { name: 'Headset', component: Headset },
  { name: 'Pointer', component: Pointer },
  { name: 'Lightning', component: Lightning },
  { name: 'Right', component: Right },
  { name: 'Sort', component: Sort },
  { name: 'Money', component: Money },
  { name: 'Service', component: Service },
  { name: 'MoreFilled', component: MoreFilled },
  { name: 'DocumentAdd', component: DocumentAdd },
  { name: 'RefreshLeft', component: RefreshLeft },
  { name: 'PieChart', component: PieChart },
  { name: 'Back', component: Back },
  { name: 'Sunny', component: Sunny },
  { name: 'CircleCloseFilled', component: CircleCloseFilled },
  
  // 常用图标测试
  { name: 'VideoPlay', component: VideoPlay },
  { name: 'TrendCharts', component: TrendCharts },
  { name: 'Grid', component: Grid },
  { name: 'Cpu', component: Cpu },
  { name: 'DataBoard', component: DataBoard },
  { name: 'Upload', component: Upload },
  { name: 'Download', component: Download },
  { name: 'Search', component: Search },
  { name: 'Edit', component: Edit },
  { name: 'Delete', component: Delete },
  { name: 'Plus', component: Plus },
  { name: 'Minus', component: Minus },
  { name: 'Refresh', component: Refresh },
  { name: 'Close', component: Close },
  { name: 'Warning', component: Warning },
  { name: 'InfoFilled', component: InfoFilled }
])

const allIconsLoaded = computed(() => {
  return testIcons.value.every(icon => icon.component)
})

onMounted(() => {
  console.log('图标测试页面加载完成')
  console.log(`总共测试 ${testIcons.value.length} 个图标`)
  console.log(`所有图标加载状态: ${allIconsLoaded.value ? '成功' : '失败'}`)
})
</script>

<style scoped>
.icon-test-page {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.icon-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 16px;
  margin-bottom: 20px;
}

.icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px;
  border: 1px solid #e4e7ed;
  border-radius: 8px;
  transition: all 0.3s;
}

.icon-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.icon-name {
  margin-top: 8px;
  font-size: 12px;
  color: #606266;
  text-align: center;
  word-break: break-all;
}

.test-results {
  margin-top: 20px;
}
</style>
