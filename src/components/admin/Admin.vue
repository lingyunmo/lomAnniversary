<template>
  <div class="admin-wrapper">
    <div class="ambient-light orange"></div>
    <div class="ambient-light blue"></div>

    <div class="content-container">
      <div class="admin-header" v-motion :initial="{ opacity: 0, y: -20 }" :enter="{ opacity: 1, y: 0 }">
        <div class="title-group">
          <LayoutDashboard :size="32" class="header-icon" />
          <h2>管理控制台 <span class="highlight">Command Center</span></h2>
        </div>
        <p class="subtitle">LOM 11周年庆典 · 系统核心管理</p>
      </div>

      <div
          class="glass-panel"
          v-motion
          :initial="{ opacity: 0, scale: 0.98 }"
          :enter="{ opacity: 1, scale: 1, transition: { duration: 600 } }"
      >
        <el-tabs v-model="activeTab" class="custom-tabs">

          <el-tab-pane name="announcement">
            <template #label>
              <span class="custom-label">
                <Megaphone :size="16" /> 公告发布
              </span>
            </template>
            <div class="tab-content">
              <AnnouncementAdmin />
            </div>
          </el-tab-pane>

          <el-tab-pane name="activities">
            <template #label>
              <span class="custom-label">
                <CalendarRange :size="16" /> 活动配置
              </span>
            </template>
            <div class="tab-content">
              <ActivitiesAdmin />
            </div>
          </el-tab-pane>

          <el-tab-pane name="users">
            <template #label>
              <span class="custom-label">
                <Users :size="16" /> 成员管理
              </span>
            </template>
            <div class="tab-content">
              <UserAdmin />
            </div>
          </el-tab-pane>

        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ActivitiesAdmin from './ActivitiesAdmin.vue'
import UserAdmin from './UserAdmin.vue'
import AnnouncementAdmin from './AnnouncementAdmin.vue'
import { LayoutDashboard, Megaphone, CalendarRange, Users } from 'lucide-vue-next'

// 默认激活的 Tab
const activeTab = ref('announcement')
</script>

<style scoped>
/* 1. 布局容器 */
.admin-wrapper {
  position: relative;
  min-height: calc(100vh - 140px);
  padding: 40px 20px;
  overflow: hidden;
}

/* 氛围光 (换个色调区分后台，用橙色和蓝色) */
.ambient-light {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.15;
  pointer-events: none;
}
.orange { width: 600px; height: 600px; background: #f97316; top: -100px; left: -10%; }
.blue { width: 500px; height: 500px; background: #3b82f6; bottom: -100px; right: -5%; }

.content-container {
  position: relative;
  z-index: 1;
  max-width: 1400px; /* 宽屏适配 */
  margin: 0 auto;
}

/* 2. 头部样式 */
.admin-header {
  margin-bottom: 30px;
}

.title-group {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.header-icon { color: #f97316; filter: drop-shadow(0 0 8px rgba(249, 115, 22, 0.4)); }

h2 {
  font-size: 2.2rem;
  font-weight: 800;
  color: #fff;
  letter-spacing: 1px;
  margin: 0;
}

.highlight {
  background: linear-gradient(90deg, #f97316, #ec4899);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  font-family: monospace;
  font-size: 1.5rem;
  margin-left: 10px;
}

.subtitle {
  color: #9ca3af;
  font-size: 1rem;
  margin-left: 44px; /* 对齐标题文字 */
}

/* 3. 玻璃拟态面板 */
.glass-panel {
  background: rgba(20, 22, 26, 0.7);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  padding: 20px; /* 内边距 */
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
  min-height: 600px;
}

.tab-content {
  padding: 20px 0;
  /* 给子组件一个淡入动画 */
  animation: fade-in 0.4s ease;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 4. Element Plus Tabs 深度定制 (黑金风格) */
.custom-label {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 15px;
  font-weight: 600;
}

:deep(.el-tabs__header) {
  margin-bottom: 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

/* Tab 导航条背景去掉 */
:deep(.el-tabs__nav-wrap::after) {
  background-color: transparent !important;
}

/* 未激活的 Tab 文字颜色 */
:deep(.el-tabs__item) {
  color: #9ca3af !important;
  transition: all 0.3s;
  padding: 0 24px !important;
  height: 48px;
}

:deep(.el-tabs__item:hover) {
  color: #fff !important;
}

/* 激活的 Tab */
:deep(.el-tabs__item.is-active) {
  color: #f97316 !important; /* 橙色高亮 */
  text-shadow: 0 0 10px rgba(249, 115, 22, 0.3);
}

/* 底部游标颜色 */
:deep(.el-tabs__active-bar) {
  background-color: #f97316 !important;
  height: 3px;
  border-radius: 2px;
}

/* 响应式 */
@media (max-width: 768px) {
  .admin-wrapper { padding: 20px 10px; }
  .glass-panel { padding: 10px; }
  h2 { font-size: 1.5rem; }
  .highlight { display: block; margin: 0; font-size: 1.2rem; }
  .subtitle { margin-left: 0; }
}
</style>