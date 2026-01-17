<template>
  <div class="announcement-dock" :class="{ 'is-expanded': !isCollapsed }">

    <div class="toggle-trigger" @click="toggleCollapse">
      <div class="icon-pulse-wrapper">
        <Megaphone :size="32" class="megaphone-icon"/>
        <div class="pulse-ring" v-if="announcements.length > 0"></div>
      </div>
      <transition name="fade">
        <span class="trigger-text" v-if="isCollapsed">公告</span>
        <X :size="24" v-else class="close-icon"/>
      </transition>
    </div>

    <div class="announcement-card">
      <div class="card-inner">
        <div class="card-header">
          <div class="title-row">
            <BellDot :size="22" class="bell-icon"/>
            <h3>系统公告</h3>
          </div>
          <div class="nav-dots">
            <span
                v-for="(_, index) in announcements"
                :key="index"
                class="dot"
                :class="{ active: index === currentIndex }"
                @click="currentIndex = index"
            ></span>
          </div>
        </div>

        <div class="card-body custom-scrollbar">
          <transition name="fade-slide" mode="out-in">
            <div :key="currentIndex" class="announcement-item">
              <div class="content-rich" v-html="currentAnnouncement.content"></div>
              <div class="meta-info">
                <Clock :size="14"/>
                <span>发布于 {{ formatTime(currentAnnouncement.created_at) }}</span>
              </div>
            </div>
          </transition>
        </div>

        <div class="card-footer">
          <div class="pagination">
            <span class="current">{{ currentIndex + 1 }}</span> / {{ announcements.length }}
          </div>
          <button class="next-btn" @click="nextAnnouncement">
            下一条
            <ChevronRight :size="16"/>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, onUnmounted, ref, watchEffect} from 'vue'
import api from '../api/api.js'
import {BellDot, ChevronRight, Clock, Megaphone, X} from 'lucide-vue-next'

const announcements = ref([])
const currentIndex = ref(0)
const isCollapsed = ref(true)
let rotationTimer = null

const fetchAnnouncements = async () => {
  try {
    const res = await api.get('/announcements')
    if (res.data?.length > 0) {
      announcements.value = res.data
    } else {
      announcements.value = [{content: '当前暂无重要通知', created_at: new Date()}]
    }
  } catch (err) {
    announcements.value = [{content: '公告同步失败，请刷新重试', created_at: new Date()}]
  }
}

const currentAnnouncement = ref({})
watchEffect(() => {
  currentAnnouncement.value = announcements.value[currentIndex.value] || {}
})

const nextAnnouncement = () => {
  if (announcements.value.length > 1) {
    currentIndex.value = (currentIndex.value + 1) % announcements.value.length
  }
}

const startRotation = () => {
  rotationTimer = setInterval(nextAnnouncement, 8000)
}

const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

const formatTime = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()} ${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`
}

onMounted(async () => {
  await fetchAnnouncements()
  startRotation()
})

onUnmounted(() => {
  clearInterval(rotationTimer)
})
</script>

<style scoped>
/* 1. 容器：使用 CSS 动画替代 v-motion，解决 transform 冲突 */
.announcement-dock {
  position: fixed;
  left: 30px;
  top: 50%;
  /* 核心修正：这里保留 translateY，且不会被 JS 覆盖 */
  transform: translateY(-50%);
  z-index: 2000;
  display: flex;
  align-items: center;
  /* 添加入场动画 */
  animation: slide-in 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
  /* 初始状态：移出屏幕 */
  opacity: 0;
}

/* 入场关键帧：手动处理 transform 的合并 */
@keyframes slide-in {
  from {
    left: -100px;
    opacity: 0;
    transform: translateY(-50%); /* 保持垂直居中 */
  }
  to {
    left: 30px;
    opacity: 1;
    transform: translateY(-50%); /* 保持垂直居中 */
  }
}

/* 2. 触发器 */
.toggle-trigger {
  width: 72px;
  height: 72px;
  background: rgba(30, 32, 38, 0.9);
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  position: relative;
  z-index: 10; /* 保证在卡片之上 */
}

.toggle-trigger:hover {
  background: #3b82f6;
  border-color: #93c5fd;
  transform: scale(1.05);
}

/* 3. 公告卡片：平滑展开逻辑 */
.announcement-card {
  /* 初始状态：宽度为0，透明，位移 */
  width: 0;
  height: auto;
  min-height: 260px;
  background: rgba(20, 22, 26, 0.92);
  backdrop-filter: blur(25px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  margin-left: 0; /* 初始间距为0 */
  box-shadow: 25px 25px 80px rgba(0, 0, 0, 0.6);
  overflow: hidden;
  opacity: 0;
  transform: translateX(-20px);
  /* 核心动画：所有属性平滑过渡 */
  transition: all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none; /* 收起时不可点击 */
}

/* 展开状态 */
.is-expanded .announcement-card {
  width: 420px;
  margin-left: 20px;
  opacity: 1;
  transform: translateX(0);
  pointer-events: auto;
}

/* 内部容器：防止内容在宽度缩小时被挤压 */
.card-inner {
  width: 420px; /* 固定宽度，确保内容布局不乱 */
  display: flex;
  flex-direction: column;
}

/* --- 以下内部样式保持不变 --- */

.icon-pulse-wrapper {
  position: relative;
  display: flex;
}

.megaphone-icon {
  color: #fff;
}

.pulse-ring {
  position: absolute;
  inset: -8px;
  border: 3px solid #3b82f6;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.trigger-text {
  font-size: 11px;
  color: #d1d5db;
  margin-top: 6px;
  font-weight: 700;
}

.card-header {
  padding: 24px 28px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.title-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.bell-icon {
  color: #fbbf24;
  filter: drop-shadow(0 0 5px rgba(251, 191, 36, 0.5));
}

h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 800;
  color: #fff;
}

.nav-dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.15);
  cursor: pointer;
  transition: all 0.3s;
}

.dot.active {
  width: 20px;
  background: #3b82f6;
  box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}

.card-body {
  padding: 28px;
  max-height: 500px;
  overflow-y: auto;
}

.content-rich {
  font-size: 16px;
  line-height: 1.8;
  color: #e5e7eb;
}

:deep(.content-rich strong) {
  color: #fff;
  font-weight: 700;
  border-bottom: 2px solid #3b82f6;
}

:deep(.content-rich a) {
  color: #60a5fa;
  text-decoration: none;
}

:deep(.content-rich p) {
  margin-bottom: 16px;
}

.meta-info {
  margin-top: 24px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #9ca3af;
}

.card-footer {
  padding: 16px 28px;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  font-size: 14px;
  color: #6b7280;
  font-family: monospace;
}

.pagination .current {
  color: #3b82f6;
  font-weight: 700;
}

.next-btn {
  background: transparent;
  border: none;
  color: #3b82f6;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s;
}

.next-btn:hover {
  color: #fff;
  transform: translateX(3px);
}

@keyframes pulse {
  0% {
    transform: scale(0.8);
    opacity: 0.8;
  }
  100% {
    transform: scale(1.6);
    opacity: 0;
  }
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.fade-slide-enter-active, .fade-slide-leave-active {
  transition: all 0.4s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-15px);
}

.custom-scrollbar::-webkit-scrollbar {
  width: 5px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.15);
  border-radius: 3px;
}

@media (max-width: 1024px) {
  .is-expanded .announcement-card {
    width: 360px;
  }

  .card-inner {
    width: 360px;
  }
}
</style>