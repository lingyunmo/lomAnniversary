<template>
  <section class="activities">
    <h2>🎉 活动列表</h2>

    <div v-if="activities.length === 0" class="empty">📭 暂无活动</div>

    <div v-else class="carousel-3d">
      <div class="carousel-container">
        <div
            v-for="(activity, index) in activities"
            :key="activity.id"
            class="activity-card"
            :style="getCardStyle(index)"
            @click="setCurrentIndex(index)"
        >
          <div class="image-container">
            <img :src="`/${activity.image}`" :alt="activity.name" class="activity-image" />
          </div>

          <div class="activity-info">
            <h3>📌 {{ activity.name }}</h3>
            <div class="scroll-content">
              <p class="time">🕒 {{ formatTime(activity.start_time) }}</p>
              <p class="time">⏳ {{ formatTime(activity.end_time) }}</p>
              <p class="status" :class="getStatusClass(activity)">
                {{ getActivityStatus(activity) }}
              </p>
              <div class="description" v-html="activity.description"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="indicators">
        <div
            v-for="n in activities.length"
            :key="n"
            class="indicator"
            :class="{ active: currentIndex === n - 1 }"
            @click="setCurrentIndex(n - 1)"
        ></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'

const activities = ref([])
const currentIndex = ref(0)
let autoPlayTimer = null

// 时间格式化方法
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 持续时间格式化
const formatDuration = (ms) => {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)

  if (days > 0) return `${days}天${hours % 24}小时`
  if (hours > 0) return `${hours}小时${minutes % 60}分`
  if (minutes > 0) return `${minutes}分钟`
  return `${seconds}秒`
}

// 获取活动状态
const getActivityStatus = (activity) => {
  const now = new Date()
  const startTime = new Date(activity.start_time)
  const endTime = new Date(activity.end_time)

  if (now < startTime) {
    return `⏳ 准备中，距离开始还有 ${formatDuration(startTime - now)}`
  }
  if (now <= endTime) {
    return `🚀 进行中，已进行 ${formatDuration(now - startTime)}`
  }
  return `🏁 已结束，已结束 ${formatDuration(now - endTime)}`
}

// 获取状态样式类
const getStatusClass = (activity) => {
  const now = new Date()
  const start = new Date(activity.start_time)
  const end = new Date(activity.end_time)

  if (now < start) return 'upcoming'
  if (now <= end) return 'ongoing'
  return 'ended'
}

// 卡片3D位置计算（优化版）
const getCardStyle = (index) => {
  const total = activities.value.length
  const activeIndex = currentIndex.value
  const angleStep = 360 / total
  const distanceZ = 600 // 增加立体深度

  // 计算旋转角度（限制最大旋转角度）
  let rotateY = (index - activeIndex) * angleStep
  if (rotateY > 180) rotateY -= 360
  if (rotateY < -180) rotateY += 360

  // 动态计算透明度和模糊度
  const absAngle = Math.abs(rotateY)
  const opacity = 1 - (absAngle / 180) * 0.6
  const blurValue = Math.min(8, (absAngle / 180) * 15)

  return {
    transform: `rotateY(${rotateY}deg) translateZ(${distanceZ}px)`,
    opacity: opacity,
    filter: `blur(${blurValue}px)`,
    zIndex: 100 - Math.abs(rotateY),
    pointerEvents: absAngle > 90 ? 'none' : 'auto'
  }
}

// 自动播放控制
const startAutoPlay = () => {
  autoPlayTimer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % activities.value.length
  }, 10000)
}

// 手动切换
const setCurrentIndex = (index) => {
  currentIndex.value = index
  resetAutoPlay()
}

// 重置自动播放
const resetAutoPlay = () => {
  clearInterval(autoPlayTimer)
  startAutoPlay()
}

// 获取活动数据
const fetchActivities = async () => {
  try {
    const res = await axios.get('/api/activities')
    activities.value = res.data
    if (activities.value.length > 0) startAutoPlay()
  } catch (err) {
    console.error('活动数据加载失败:', err)
  }
}

onMounted(fetchActivities)
onUnmounted(() => clearInterval(autoPlayTimer))
</script>

<style scoped>
.activities {
  padding: 4rem 2rem;
  background: #1e1e1e;
  min-height: 100vh;
}

h2 {
  font-size: 2.5rem;
  color: #10a37f;
  text-align: center;
  margin-bottom: 4rem;
  position: relative;
  text-shadow: 0 2px 4px rgba(0,0,0,0.3);
}

h2::after {
  content: '';
  position: absolute;
  bottom: -1.5rem;
  left: 50%;
  transform: translateX(-50%);
  width: 80px;
  height: 4px;
  background: #10a37f;
  border-radius: 2px;
}

.carousel-3d {
  position: relative;
  width: 100%;
  height: 800px;
  perspective: 2000px;
  margin: 3rem 0;
}

.carousel-container {
  position: absolute;
  width: 400px;
  height: 600px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transform-style: preserve-3d;
  transition: transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.activity-card {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #282c34;
  border-radius: 25px;
  padding: 2rem;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
  transform-style: preserve-3d;
  backface-visibility: visible;
  transition:
      opacity 0.8s ease,
      filter 0.8s ease,
      transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  cursor: pointer;
  overflow: visible;
}

.image-container {
  width: 100%;
  height: 300px;
  border-radius: 15px;
  overflow: hidden;
  transform: translateZ(50px);
  box-shadow: 0 8px 20px rgba(0,0,0,0.2);
}

.activity-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s;
}

.activity-info {
  padding: 1.5rem 0;
  transform: translateZ(60px);
}

.scroll-content {
  max-height: 180px;
  overflow-y: auto;
  padding-right: 1rem;
}

.time {
  font-size: 1rem;
  color: #b0b0b0;
  margin: 0.5rem 0;
}

.status {
  display: inline-block;
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  font-size: 1rem;
  margin: 1rem 0;
  transform: translateZ(30px);
  backdrop-filter: blur(5px);
}

.description {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #d0d0d0;
  margin-top: 1rem;
  transform: translateZ(20px);
}

/* 状态颜色 */
.ongoing {
  background: linear-gradient(135deg, rgba(76, 175, 80, 0.9), rgba(69, 160, 73, 0.9));
}

.upcoming {
  background: linear-gradient(135deg, rgba(138, 43, 226, 0.9), rgba(123, 31, 162, 0.9));
}

.ended {
  background: linear-gradient(135deg, rgba(229, 115, 115, 0.9), rgba(211, 47, 47, 0.9));
}

/* 指示器 */
.indicators {
  position: absolute;
  bottom: -80px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1.2rem;
}

.indicator {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 4px rgba(0,0,0,0.2);
}

.indicator.active {
  background: #10a37f;
  transform: scale(1.4);
  box-shadow: 0 0 15px rgba(16, 163, 127, 0.6);
}

.empty {
  text-align: center;
  color: #a0a0a0;
  font-size: 1.5rem;
  padding: 4rem;
}

/* 滚动条样式 */
.scroll-content::-webkit-scrollbar {
  width: 6px;
}

.scroll-content::-webkit-scrollbar-track {
  background: rgba(255,255,255,0.05);
  border-radius: 3px;
}

.scroll-content::-webkit-scrollbar-thumb {
  background: #10a37f;
  border-radius: 3px;
}

@media (max-width: 768px) {
  .carousel-3d {
    height: 600px;
    perspective: 1500px;
  }

  .carousel-container {
    width: 320px;
    height: 500px;
  }

  .image-container {
    height: 220px;
  }

  h2 {
    font-size: 2rem;
  }

  .description {
    font-size: 0.9rem;
  }
}
</style>