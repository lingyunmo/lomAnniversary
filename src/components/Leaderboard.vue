<template>
  <section class="leaderboard-card">
    <div class="card-header">
      <div class="title-wrapper">
        <Trophy :size="24" class="header-icon" />
        <h2>积分风云榜</h2>
      </div>
      <div class="subtitle">实时更新 Top 排名</div>
    </div>

    <div v-if="loading" class="state-box">
      <div class="loading-spinner"></div>
      <span>数据加载中...</span>
    </div>

    <div v-else-if="error" class="state-box error">
      <AlertCircle :size="20" />
      <span>{{ error }}</span>
    </div>

    <div v-else-if="rankings.length > 0" class="ranking-list custom-scrollbar">
      <div
          v-for="(user, index) in rankings"
          :key="user.id"
          class="user-item"
          :class="{ 'top-one': index === 0 }"
      >
        <div class="rank-badge">
          <template v-if="index === 0">
            <Crown :size="24" class="icon-gold" />
          </template>
          <template v-else-if="index === 1">
            <Medal :size="22" class="icon-silver" />
          </template>
          <template v-else-if="index === 2">
            <Medal :size="20" class="icon-bronze" />
          </template>
          <span v-else class="rank-number">{{ index + 1 }}</span>
        </div>

        <div class="user-info">
          <div class="name-row">
            <span class="username" :class="getRankColorClass(index)">
              {{ user.username }}
            </span>
            <span class="nickname" v-if="user.nickname">{{ user.nickname }}</span>
          </div>

          <div class="progress-track">
            <div
                class="progress-fill"
                :class="getRankGradientClass(index)"
                :style="{ width: `${(user.score / maxScore) * 100}%` }"
            ></div>
          </div>
        </div>

        <div class="score-badge">
          <span class="score-num">{{ user.score }}</span>
          <span class="score-unit">分</span>
        </div>
      </div>
    </div>

    <div v-else class="state-box empty">
      <Ghost :size="32" />
      <span>暂无上榜数据</span>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import axios from "axios"
import { Trophy, Crown, Medal, AlertCircle, Ghost } from 'lucide-vue-next'

// 响应式数据
const rankings = ref([])
const maxScore = ref(100)
const loading = ref(true)
const error = ref(null)
const ws = ref(null)

// 辅助函数：根据排名获取文字颜色类
const getRankColorClass = (index) => {
  if (index === 0) return 'text-gold'
  if (index === 1) return 'text-silver'
  if (index === 2) return 'text-bronze'
  return ''
}

// 辅助函数：根据排名获取进度条渐变
const getRankGradientClass = (index) => {
  if (index === 0) return 'grad-gold'
  if (index === 1) return 'grad-silver'
  if (index === 2) return 'grad-bronze'
  return 'grad-blue' // 默认蓝紫渐变
}

const fetchRankings = async () => {
  try {
    const res = await axios.get('/api/leaderboard')
    updateData(res.data)
  } catch (err) {
    error.value = err.response?.data?.error || '无法连接排行榜服务'
  } finally {
    loading.value = false
  }
}

const updateData = (data) => {
  rankings.value = data.sort((a, b) => b.score - a.score)
  // 动态计算最大值，保证进度条比例好看
  const max = Math.max(...data.map(u => u.score), 100)
  maxScore.value = max * 1.1 //稍微留一点余量
}

const handleWebSocketData = (event) => {
  try {
    const data = JSON.parse(event.data)
    updateData(data)
  } catch (e) {
    console.error('WS Parse Error', e)
  }
}

onMounted(() => {
  // 动态构建 WS 地址
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  // 开发环境可能需要硬编码端口，生产环境用相对路径
  const wsUrl = `${protocol}//${window.location.host}/ws`

  try {
    ws.value = new WebSocket(wsUrl)
    ws.value.onmessage = handleWebSocketData
    ws.value.onerror = (e) => console.error('WS Error:', e)
  } catch (e) {
    console.error('WS Init Failed', e)
  }

  fetchRankings()
})

onUnmounted(() => {
  if (ws.value) ws.value.close()
})
</script>

<style scoped>
/* 定义金银铜颜色变量 */
:root {
  --rank-gold: #fbbf24;
  --rank-silver: #9ca3af;
  --rank-bronze: #d97706;
}

/* 1. 外层卡片容器 (Glassmorphism) */
.leaderboard-card {
  background: rgba(20, 22, 26, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 400px; /* 最小高度 */
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

/* 2. 头部样式 */
.card-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}

.header-icon {
  color: #fbbf24; /* 金色奖杯 */
  filter: drop-shadow(0 0 5px rgba(251, 191, 36, 0.5));
}

h2 {
  margin: 0;
  font-size: 1.4rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 1px;
}

.subtitle {
  font-size: 0.85rem;
  color: #6b7280;
  margin-left: 34px; /* 对齐标题文字 */
}

/* 3. 列表区域 */
.ranking-list {
  flex: 1;
  overflow-y: auto;
  padding-right: 5px; /* 给滚动条留空 */
  display: flex;
  flex-direction: column;
  gap: 10px;
}

/* 单行用户卡片 */
.user-item {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 12px 16px;
  transition: all 0.3s;
}

.user-item:hover {
  background: rgba(255, 255, 255, 0.08);
  transform: translateX(4px);
  border-color: rgba(255, 255, 255, 0.1);
}

/* 第一名特殊样式：呼吸光效 */
.user-item.top-one {
  background: linear-gradient(90deg, rgba(251, 191, 36, 0.1), rgba(20, 22, 26, 0.5));
  border-color: rgba(251, 191, 36, 0.3);
  box-shadow: 0 0 15px rgba(251, 191, 36, 0.1);
}

/* 排名徽章 */
.rank-badge {
  width: 32px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 12px;
}

.rank-number {
  font-size: 1.1rem;
  font-weight: 700;
  color: #4b5563;
  font-family: monospace;
}

.icon-gold { color: #fbbf24; filter: drop-shadow(0 0 4px #fbbf24); }
.icon-silver { color: #e5e7eb; filter: drop-shadow(0 0 2px #e5e7eb); }
.icon-bronze { color: #d97706; }

/* 用户信息区 */
.user-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0; /* 防止文字溢出 */
}

.name-row {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.username {
  font-size: 1rem;
  font-weight: 600;
  color: #e5e7eb;
}

.nickname {
  font-size: 0.8rem;
  color: #6b7280;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 名字高亮颜色 */
.text-gold { color: #fbbf24; }
.text-silver { color: #e5e7eb; }
.text-bronze { color: #d97706; }

/* 进度条 */
.progress-track {
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  overflow: hidden;
  width: 100%;
}

.progress-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.8s cubic-bezier(0.25, 0.8, 0.25, 1);
}

/* 进度条渐变色 */
.grad-gold { background: linear-gradient(90deg, #fbbf24, #f59e0b); }
.grad-silver { background: linear-gradient(90deg, #e5e7eb, #9ca3af); }
.grad-bronze { background: linear-gradient(90deg, #d97706, #b45309); }
.grad-blue { background: linear-gradient(90deg, #3b82f6, #8b5cf6); } /* 默认蓝紫 */

/* 分数 */
.score-badge {
  margin-left: 16px;
  text-align: right;
  min-width: 60px;
}

.score-num {
  font-size: 1.1rem;
  font-weight: 700;
  color: #fff;
  display: block;
}

.score-unit {
  font-size: 0.75rem;
  color: #6b7280;
}

/* 状态框 (加载/错误/空) */
.state-box {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  color: #6b7280;
  min-height: 200px;
}

.loading-spinner {
  width: 24px;
  height: 24px;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.error { color: #ef4444; }

@keyframes spin { to { transform: rotate(360deg); } }

/* 自定义滚动条 */
.custom-scrollbar::-webkit-scrollbar { width: 4px; }
.custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.2); border-radius: 2px; }
</style>