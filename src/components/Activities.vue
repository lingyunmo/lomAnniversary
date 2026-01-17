<template>
  <section class="home-container">
    <div class="ambient-light blue"></div>
    <div class="ambient-light purple"></div>

    <div class="content-wrapper">

      <div class="header-section" v-motion :initial="{ opacity: 0, y: -20 }" :enter="{ opacity: 1, y: 0 }">
        <h2 class="main-title">活动列表 <span class="highlight">Events</span></h2>
        <p class="subtitle">探索 lom 11周年精彩庆典时刻</p>
      </div>

      <div v-if="activities.length === 0" class="empty-state">
        <Inbox :size="48" class="empty-icon" />
        <p>暂无活动安排，敬请期待...</p>
      </div>

      <div v-else class="carousel-stage">
        <div class="carousel-container">
          <div
              v-for="(activity, index) in activities"
              :key="activity.id"
              class="activity-card"
              :class="{ 'is-active': index === currentIndex }"
              :style="getCardStyle(index)"
              @click="handleClick(index)"
          >
            <div class="card-left">
              <img :src="getImageUrl(activity.image)" :alt="activity.name" loading="lazy" />
              <div class="card-overlay"></div>

              <div class="status-badge" :class="getStatusClass(activity)">
                {{ getActivityStatusText(activity) }}
              </div>
            </div>

            <div class="card-right">
              <div class="card-header-group">
                <h3 class="card-title">{{ activity.name }}</h3>

                <div class="meta-row">
                  <div class="meta-item">
                    <Calendar :size="14" class="icon" />
                    <span>{{ formatTime(activity.start_time) }}</span>
                  </div>
                  <div class="meta-divider">|</div>
                  <div class="meta-item">
                    <Clock :size="14" class="icon" />
                    <span>{{ formatDuration(activity) }}</span>
                  </div>
                </div>
              </div>

              <div class="rich-content-wrapper custom-scrollbar">
                <div class="rich-text" v-html="activity.description"></div>
              </div>

              <div class="card-footer">
                <button class="detail-btn">
                  查看详情 <ArrowRight :size="16" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="indicators">
          <div
              v-for="(item, index) in activities"
              :key="'indicator-' + index"
              class="dot"
              :class="{ active: currentIndex === index }"
              @click="handleDotClick(index)"
          ></div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from 'axios'
import { Calendar, Clock, Inbox, ArrowRight } from 'lucide-vue-next'

const activities = ref([])
const currentIndex = ref(0)
let autoPlayTimer = null

// --- 数据获取 ---
const fetchActivities = async () => {
  try {
    const res = await axios.get('/api/activities')
    activities.value = res.data
    // 如果没有数据，使用 Mock 数据展示效果
    if (activities.value.length === 0) useMockData()
    else startAutoPlay()
  } catch (err) {
    console.error('API Error, using mock data:', err)
    useMockData()
  }
}

const useMockData = () => {
  activities.value = [
    {
      id: 1,
      name: 'Shuffle Parkour 2',
      start_time: Date.now() + 86400000,
      end_time: Date.now() + 90000000,
      image: 'https://media.forgecdn.net/attachments/395/594/1.png', // 示例图
      description: '<p><strong>Shuffle Parkour - 竞速跑酷地图</strong></p><p>每次完成关卡后，玩家会被随机传送到另一个关卡。</p><ul><li>支持多人游戏</li><li>超过 250 个独特关卡</li><li>自定义计时器系统</li></ul><p>快来挑战你的极限吧！</p>'
    },
    { id: 2, name: 'Minecraft 建筑大赛', start_time: Date.now() - 100000, end_time: Date.now() + 10000000, image: '', description: '<p>主题：<strong>未来城市</strong>。</p><p>展示你的建筑才华，赢取丰厚奖励。</p>' },
    { id: 3, name: '生存服 PVP 锦标赛', start_time: Date.now() + 200000000, end_time: Date.now() + 300000000, image: '', description: '最强王者之战，胜者为王。' },
  ]
  startAutoPlay()
}

// --- 3D 核心逻辑 (宽屏适配版) ---
const getCardStyle = (index) => {
  const total = activities.value.length
  if (total === 0) return {}

  let diff = index - currentIndex.value
  if (diff > total / 2) diff -= total
  if (diff < -total / 2) diff += total

  // 参数调整：让卡片散得更开，避免宽卡片重叠
  const rotateY = diff * 35 // 增加旋转角度
  const translateZ = diff === 0 ? 400 : -100
  const scale = diff === 0 ? 1 : 0.85
  const opacity = diff === 0 ? 1 : Math.max(0.1, 1 - Math.abs(diff) * 0.3)
  const zIndex = diff === 0 ? 100 : 50 - Math.abs(diff)
  const blur = diff === 0 ? 0 : Math.min(10, Math.abs(diff) * 5)

  // 核心：横向位移，让未选中的卡片往两边跑，不要挡住中间
  const translateX = diff * 180

  const isVisible = Math.abs(diff) <= 2

  return {
    transform: `translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`,
    opacity: isVisible ? opacity : 0,
    zIndex: zIndex,
    filter: `blur(${blur}px)`,
    visibility: isVisible ? 'visible' : 'hidden',
    pointerEvents: diff === 0 ? 'auto' : 'none'
  }
}

// --- 工具函数 ---
const getImageUrl = (path) => {
  if (!path) return 'https://via.placeholder.com/720x400?text=LOM+Event'
  return path.startsWith('http') ? path : `/${path.replace(/^\//, '')}`
}
const formatTime = (ts) => new Date(ts).toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
const formatDuration = (activity) => {
  const start = new Date(activity.start_time)
  const now = new Date()
  if (now < start) return '即将开始'
  if (now > new Date(activity.end_time)) return '已结束'
  return '进行中'
}
const getActivityStatusText = (act) => {
  const now = new Date(); if (now < new Date(act.start_time)) return '未开始'; if (now > new Date(act.end_time)) return '已结束'; return '进行中';
}
const getStatusClass = (act) => {
  const now = new Date(); if (now < new Date(act.start_time)) return 'status-upcoming'; if (now > new Date(act.end_time)) return 'status-ended'; return 'status-ongoing';
}

// --- 交互 ---
const handleClick = (index) => { if (currentIndex.value !== index) setCurrentIndex(index); }
const handleDotClick = (index) => setCurrentIndex(index)
const setCurrentIndex = (index) => {
  currentIndex.value = index
  if (autoPlayTimer) { clearInterval(autoPlayTimer); startAutoPlay(); }
}
const startAutoPlay = () => {
  if (autoPlayTimer) clearInterval(autoPlayTimer)
  autoPlayTimer = setInterval(() => {
    currentIndex.value = (currentIndex.value + 1) % activities.value.length
  }, 6000)
}

onMounted(fetchActivities)
onUnmounted(() => clearInterval(autoPlayTimer))
</script>

<style scoped>
/* 1. 全局容器与背景 */
.home-container {
  position: relative;
  height: auto;
  min-height: auto;
  overflow: hidden;
  padding: 40px 0 100px 0; /* 上下留白，左右贴边 */
}

/* 极光背景 */
.ambient-light {
  position: absolute;
  border-radius: 50%;
  filter: blur(120px);
  opacity: 0.2; /* 稍微调低透明度，不要抢戏 */
  pointer-events: none;
}
.blue { width: 800px; height: 800px; background: #3b82f6; top: -200px; left: -10%; }
.purple { width: 600px; height: 600px; background: #ec4899; bottom: -100px; right: -5%; }

/* 2. 内容容器 - 彻底去容器化 */
.content-wrapper {
  position: relative;
  z-index: 1;
  max-width: 1400px; /* 宽屏适配 */
  margin: 0 auto;
  padding: 0 20px;
  /* 移除了背景色和阴影，让它隐形 */
}

.header-section {
  text-align: center;
  margin-bottom: 60px;
}

.main-title {
  font-size: 3.5rem; /* 更大的标题 */
  font-weight: 800;
  color: #fff;
  letter-spacing: 2px;
  margin-bottom: 10px;
  text-shadow: 0 4px 20px rgba(0,0,0,0.5); /* 文字发光 */
}

.highlight {
  background: linear-gradient(45deg, #3b82f6, #ec4899);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  font-style: italic;
  padding-left: 15px;
}

.subtitle { color: #9ca3af; font-size: 1.2rem; }

/* 3. 舞台与卡片 */
.carousel-stage {
  height: 500px;
  perspective: 1500px; /* 更深的透视感 */
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.carousel-container {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
}

/* 核心卡片样式 */
.activity-card {
  position: absolute;
  left: 50%;
  top: 50%;

  /* 宽屏卡片尺寸 */
  width: 760px;
  height: 420px;
  margin-left: -380px; /* 居中修正 */
  margin-top: -210px;

  /* 玻璃拟态深色背景 */
  background: rgba(20, 22, 26, 0.85);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
  box-shadow: 0 40px 80px rgba(0,0,0,0.6); /* 更强的阴影，增加悬浮感 */

  display: flex;
  flex-direction: row;
}

/* 左侧：图片 */
.card-left {
  width: 45%;
  position: relative;
  overflow: hidden;
  background: #000;
}

.card-left img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s ease;
  opacity: 0.9;
}

.is-active .card-left img {
  transform: scale(1.05);
  opacity: 1;
}

.card-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to right, transparent 70%, rgba(20, 22, 26, 0.9)); /* 图片与内容的平滑过渡 */
}

.status-badge {
  position: absolute;
  top: 20px;
  left: 20px;
  padding: 6px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 700;
  color: white;
  backdrop-filter: blur(8px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  z-index: 2;
}
.status-ongoing { background: #10b981; }
.status-upcoming { background: #8b5cf6; }
.status-ended { background: #6b7280; }

/* 右侧：内容 */
.card-right {
  width: 55%;
  padding: 30px;
  display: flex;
  flex-direction: column;
}

.card-title {
  font-size: 1.8rem;
  color: #fff;
  margin-bottom: 12px;
  font-weight: 700;
  line-height: 1.2;
}

.meta-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #9ca3af;
}

.meta-divider { color: #374151; }

/* 富文本区域 */
.rich-content-wrapper {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 20px;
  padding-right: 10px;
}

.rich-text {
  font-size: 15px;
  line-height: 1.7;
  color: #d1d5db;
}

/* 样式穿透 */
:deep(.rich-text p) { margin-bottom: 10px; }
:deep(.rich-text strong) { color: #fff; font-weight: 600; }
:deep(.rich-text ul) { padding-left: 20px; margin-bottom: 10px; color: #9ca3af; }
:deep(.rich-text li) { margin-bottom: 4px; }
:deep(.rich-text a) { color: #3b82f6; text-decoration: none; border-bottom: 1px dashed #3b82f6; }

/* 自定义滚动条 */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-track { background: rgba(255,255,255,0.02); }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }
.custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.3); }

/* 底部按钮 */
.card-footer {
  margin-top: auto;
}

.detail-btn {
  width: 100%;
  background: rgba(59, 130, 246, 0.1);
  border: 1px solid rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  padding: 12px;
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;
  font-weight: 600;
  font-size: 15px;
}

.detail-btn:hover {
  background: #3b82f6;
  color: #fff;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

/* 指示器 */
.indicators {
  position: absolute;
  bottom: -60px;
  width: 100%;
  display: flex;
  justify-content: center;
  gap: 12px;
}
.dot {
  width: 8px; height: 8px; border-radius: 50%; background: rgba(255,255,255,0.15); cursor: pointer; transition: all 0.4s;
}
.dot.active { width: 32px; border-radius: 4px; background: #3b82f6; box-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }

/* 空状态 */
.empty-state { text-align: center; color: #6b7280; padding: 120px 0; }
.empty-icon { margin-bottom: 16px; opacity: 0.5; }

/* 移动端适配 (竖屏) */
@media (max-width: 900px) {
  .carousel-stage { height: 600px; }

  .activity-card {
    flex-direction: column;
    width: 320px;
    height: 540px;
    margin-left: -160px;
    margin-top: -270px;
  }

  .card-left { width: 100%; height: 220px; }
  .card-right { width: 100%; height: 320px; padding: 20px; }
  .main-title { font-size: 2.2rem; }
}
</style>