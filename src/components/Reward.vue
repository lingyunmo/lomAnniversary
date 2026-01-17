<template>
  <section class="reward-map-card">
    <div class="card-header">
      <div class="title-wrapper">
        <Target :size="28" class="header-icon" />
        <h2>联盟奖励里程碑</h2>
      </div>
      <div class="subtitle">集结联盟之力，解锁丰厚大奖</div>
    </div>

    <div v-if="loading" class="state-box">
      <Loader2 :size="32" class="spin" />
      <span>正在同步联盟数据...</span>
    </div>

    <div v-else-if="error" class="state-box error">
      <AlertTriangle :size="32" />
      <span>{{ error }}</span>
    </div>

    <div v-else class="map-content">
      <div class="progress-section">
        <div class="progress-track">
          <div
              class="progress-fill"
              :style="{ width: progressPercentage + '%' }"
          >
            <div class="progress-glow"></div>
          </div>

          <div
              v-for="(milestone, index) in milestones"
              :key="index"
              class="milestone-node"
              :class="{ 'unlocked': participantCount >= milestone.target }"
              :style="{ left: milestone.position }"
          >
            <div class="node-icon-wrapper">
              <template v-if="participantCount >= milestone.target">
                <Unlock :size="20" class="icon-unlocked" />
              </template>
              <template v-else>
                <Lock :size="16" class="icon-locked" />
              </template>
            </div>
            <div class="node-label">{{ milestone.target }}人</div>
          </div>
        </div>
      </div>

      <div class="status-banner">
        <div class="status-item">
          <Users :size="20" class="status-icon" />
          <span>当前参与人数：</span>
          <span class="highlight-num">{{ participantCount }}</span>
        </div>
        <div class="status-divider"></div>
        <div class="status-item">
          <TrendingUp :size="20" class="status-icon" />
          <span>解锁进度：</span>
          <span class="highlight-num">{{ progressPercentage.toFixed(1) }}%</span>
        </div>
      </div>

      <div class="rewards-grid">
        <div
            v-for="(milestone, index) in milestones"
            :key="index"
            class="reward-card"
            :class="{ 'is-unlocked': participantCount >= milestone.target }"
        >
          <div class="card-top">
            <span class="target-badge">{{ milestone.target }}人达成</span>
            <span class="status-text">
              <component :is="participantCount >= milestone.target ? CheckCircle2 : Lock" :size="14" />
              {{ participantCount >= milestone.target ? '已解锁' : '未解锁' }}
            </span>
          </div>

          <ul class="reward-list">
            <li v-for="(reward, rIndex) in milestone.rewards" :key="rIndex">
              <Gift :size="14" class="list-icon" />
              {{ reward }}
            </li>
          </ul>

          <div class="locked-overlay" v-if="participantCount < milestone.target">
            <Lock :size="32" class="overlay-lock" />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import axios from 'axios' // 记得如果报错改成 api
import { Target, Users, TrendingUp, Lock, Unlock, Gift, CheckCircle2, Loader2, AlertTriangle } from 'lucide-vue-next'

// 配置
const MAX_TARGET = 20 // 最大目标人数，用于计算百分比
const milestones = ref([
  {
    target: 5,
    rewards: [
      '冠军：下界合金锄 x1 (顶级嘲讽)',
      '亚军：一组圆石 (真正的硬通货)',
      '季军：附魔金苹果 (保命神药)'
    ],
    position: '25%'
  },
  {
    target: 10,
    rewards: [
      '冠军：5.20￥ (爱意糖点)',
      '前3名：2.33￥ (满屏 233)',
      '前5名：1.11￥ (光棍奖励)'
    ],
    position: '50%'
  },
  {
    target: 15,
    rewards: [
      '冠军：8.88￥ (恭喜发财)',
      '前5名：3.60￥ (全方位守护)',
      '前10名：1.68￥ (一路发发)'
    ],
    position: '75%'
  },
  {
    target: 20,
    rewards: [
      '冠军：11.11￥ (11周年庆限定)',
      '前3名：6.66￥ (全场扣 666)',
      '前10名：5.20￥ (爱满全服)'
    ],
    position: '100%'
  }
])

const participantCount = ref(0)
const loading = ref(true)
const error = ref(null)
const ws = ref(null)

// 计算进度百分比 (最高100%)
const progressPercentage = computed(() => {
  const pct = (participantCount.value / MAX_TARGET) * 100
  return Math.min(Math.max(pct, 0), 100)
})

// 处理 WebSocket
const handleWebSocketData = (event) => {
  try {
    const data = JSON.parse(event.data)
    // 假设 WS 推送的是整个排行榜数组
    const validUsers = Array.isArray(data) ? data.filter(u => u.score > 0) : []
    participantCount.value = validUsers.length
  } catch (e) {
    console.error('WS Data Error', e)
  }
}

const fetchData = async () => {
  try {
    // 记得改成 api.get 如果你有封装
    const res = await axios.get('/api/leaderboard')
    const validUsers = res.data.filter(user => user.score > 0)
    participantCount.value = validUsers.length
  } catch (err) {
    error.value = '无法获取进度数据'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  // WS 连接逻辑
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const wsUrl = `${protocol}//${window.location.host}/ws`

  try {
    ws.value = new WebSocket(wsUrl)
    ws.value.onmessage = handleWebSocketData
  } catch (e) { console.error(e) }

  fetchData()
})

onUnmounted(() => {
  if (ws.value) ws.value.close()
})
</script>

<style scoped>
/* 1. 外层容器 */
.reward-map-card {
  background: rgba(20, 22, 26, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 32px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  margin-top: 40px; /* 与上方双栏保持间距 */
}

/* 头部 */
.card-header {
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}

.header-icon { color: #10b981; filter: drop-shadow(0 0 5px rgba(16, 185, 129, 0.5)); }

h2 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: 700;
  color: #fff;
  letter-spacing: 1px;
}

.subtitle { font-size: 1rem; color: #9ca3af; margin-left: 40px; }

/* 2. 进度条区域 */
.progress-section {
  position: relative;
  padding: 40px 20px 60px; /* 为节点留出空间 */
}

.progress-track {
  height: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #3b82f6);
  border-radius: 6px;
  position: relative;
  transition: width 1s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-glow {
  position: absolute;
  top: 0; right: 0; bottom: 0; width: 20px;
  background: #fff;
  filter: blur(5px);
  opacity: 0.6;
  box-shadow: 0 0 10px #fff;
}

/* 节点 */
.milestone-node {
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 2;
}

.node-icon-wrapper {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #1f2937;
  border: 2px solid #4b5563;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #9ca3af;
  transition: all 0.5s;
}

.milestone-node.unlocked .node-icon-wrapper {
  background: #10b981;
  border-color: #fff;
  color: #fff;
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.6);
  transform: scale(1.2);
}

.node-label {
  font-size: 12px;
  color: #9ca3af;
  margin-top: 18px; /* 放到进度条下面 */
  white-space: nowrap;
}

/* 3. 状态条 */
.status-banner {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 30px;
  margin-bottom: 40px;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  color: #d1d5db;
}

.status-icon { color: #10b981; }
.highlight-num { font-size: 1.4rem; font-weight: 700; color: #fff; font-family: monospace; }
.status-divider { width: 1px; height: 24px; background: rgba(255,255,255,0.1); }

/* 4. 奖励卡片网格 */
.rewards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}

.reward-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 20px;
  position: relative;
  overflow: hidden;
  transition: all 0.3s;
}

.reward-card:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.05);
}

/* 解锁状态 */
.reward-card.is-unlocked {
  border-color: rgba(16, 185, 129, 0.3);
  background: linear-gradient(180deg, rgba(16, 185, 129, 0.05), transparent);
}

.card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.target-badge {
  font-size: 0.9rem; font-weight: 700; color: #fff;
}

.status-text {
  font-size: 0.75rem;
  display: flex; align-items: center; gap: 4px;
  color: #9ca3af;
}

.is-unlocked .status-text { color: #10b981; }

/* 奖励列表 */
.reward-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.reward-list li {
  font-size: 0.85rem;
  color: #d1d5db;
  display: flex;
  align-items: center;
  gap: 6px;
}

.list-icon { color: #fbbf24; }

/* 未解锁遮罩 */
.locked-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transition: opacity 0.5s;
}

.overlay-lock { color: #6b7280; opacity: 0.8; }

.is-unlocked .locked-overlay { opacity: 0; pointer-events: none; }

/* 加载状态 */
.state-box {
  padding: 60px 0;
  display: flex; flex-direction: column; align-items: center; gap: 10px;
  color: #6b7280;
}
.spin { animation: spin 1s linear infinite; }
.error { color: #ef4444; }

@keyframes spin { to { transform: rotate(360deg); } }

/* 响应式 */
@media (max-width: 900px) {
  .rewards-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 600px) {
  .rewards-grid { grid-template-columns: 1fr; }
  .status-banner { flex-direction: column; gap: 10px; }
  .status-divider { display: none; }
}
</style>