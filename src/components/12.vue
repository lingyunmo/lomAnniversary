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
            <p class="time">🕒 开始时间：{{ formatTime(activity.start_time) }}</p>
            <p class="time">⏳ 结束时间：{{ formatTime(activity.end_time) }}</p>
            <p class="status" :class="getStatusClass(activity)">
              {{ getActivityStatus(activity) }}
            </p>
            <div class="description" v-html="activity.description"></div>
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

// 卡片3D位置计算
const getCardStyle = (index) => {
  const total = activities.value.length
  const activeIndex = currentIndex.value
  const angleStep = 360 / total
  const distanceZ = 400 // 控制立体深度

  // 计算旋转角度
  const rotateY = (index - activeIndex) * angleStep
  // 计算Z轴位移（抛物线效果）
  const translateZ = Math.abs(rotateY) > 90 ? -distanceZ : -Math.abs(rotateY/90 * distanceZ)

  return {
    transform: `rotateY(${rotateY}deg) translateZ(${translateZ}px)`,
    opacity: rotateY === 0 ? 1 : 0.6,
    filter: `blur(${Math.abs(rotateY/18)}px)`,
    zIndex: rotateY === 0 ? 2 : 1
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
  padding: 2rem;
  background: #1e1e1e;
  min-height: 80vh;
}

h2 {
  font-size: 2rem;
  color: #10a37f;
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
}

h2::after {
  content: '';
  position: absolute;
  bottom: -1rem;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 3px;
  background: #10a37f;
}

.carousel-3d {
  position: relative;
  width: 100%;
  height: 600px;
  perspective: 1800px;
  margin: 2rem 0;
}

.carousel-container {
  position: absolute;
  width: 300px;
  height: 450px;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  transform-style: preserve-3d;
  transition: transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.activity-card {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #282c34;
  border-radius: 20px;
  padding: 1.5rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  transform-style: preserve-3d;
  backface-visibility: hidden;
  transition:
      opacity 0.6s ease,
      filter 0.6s ease,
      transform 0.8s ease;
  cursor: pointer;
  overflow: hidden;
}

.activity-card:hover {
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
}

.image-container {
  width: 100%;
  height: 250px;
  border-radius: 12px;
  overflow: hidden;
  transform: translateZ(30px);
  transition: transform 0.3s;
}

.activity-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}

.activity-card:hover .activity-image {
  transform: scale(1.05);
}

.activity-info {
  padding: 1.2rem 0;
  transform: translateZ(40px);
}

.time {
  font-size: 0.9rem;
  color: #a0a0a0;
  margin: 0.3rem 0;
}

.status {
  display: inline-block;
  padding: 0.6rem 1.2rem;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-top: 1rem;
  transform: translateZ(20px);
}

.ongoing {
  background: linear-gradient(135deg, #4CAF50, #45a049);
  color: white;
}

.upcoming {
  background: linear-gradient(135deg, #8A2BE2, #7B1FA2);
  color: white;
}

.ended {
  background: linear-gradient(135deg, #E57373, #D32F2F);
  color: white;
}

.indicators {
  position: absolute;
  bottom: -50px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 1rem;
}

.indicator {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  cursor: pointer;
  transition: all 0.3s;
}

.indicator.active {
  background: #10a37f;
  transform: scale(1.3);
  box-shadow: 0 0 10px rgba(16, 163, 127, 0.5);
}

.empty {
  text-align: center;
  color: #a0a0a0;
  font-size: 1.2rem;
  padding: 2rem;
}

@media (max-width: 768px) {
  .carousel-3d {
    height: 500px;
    perspective: 1200px;
  }

  .carousel-container {
    width: 260px;
    height: 400px;
  }

  .image-container {
    height: 200px;
  }

  h2 {
    font-size: 1.6rem;
  }
}
</style>