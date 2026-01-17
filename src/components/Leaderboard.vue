<script setup>
import { ref, onMounted } from 'vue'
import axios from "axios"

// 响应式数据
const rankings = ref([])  // 排行榜数据
const maxScore = ref(100)  // 默认最大值
const loading = ref(true)  // 加载状态
const error = ref(null)  // 错误信息
const ws = ref(null);  // WebSocket连接

// 获取排行榜数据
const fetchRankings = async () => {
  try {
    const res = await axios.get('/api/leaderboard')
    rankings.value = res.data.sort((a, b) => b.score - a.score)
    maxScore.value = Math.max(...res.data.map(u => u.score), 100)
  } catch (err) {
    error.value = err.response?.data?.error || '排行榜加载失败'
    console.error('排行榜加载错误:', err)
  } finally {
    loading.value = false
  }
}

// 处理 WebSocket 数据
const handleWebSocketData = (event) => {
  const updatedLeaderboard = JSON.parse(event.data);
  rankings.value = updatedLeaderboard.sort((a, b) => b.score - a.score);
  maxScore.value = Math.max(...updatedLeaderboard.map(u => u.score), 100);
};

onMounted(() => {
  // 动态构建 WebSocket 地址
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${protocol}//${window.location.host}/ws`;

  ws.value = new WebSocket(wsUrl);
  ws.value.onmessage = handleWebSocketData;

  // 首次加载数据
  fetchRankings();
});
</script>

<template>
  <section class="ranking">
    <h2>积分排行榜</h2>

    <div v-if="loading" class="loading-message">排行榜加载中...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <template v-else-if="rankings.length > 0">
      <div
          v-for="(user, index) in rankings"
          :key="user.id"
          class="user-item"
      >
        <span class="rank">{{ index + 1 }}.</span>
        <span class="username">{{ user.username + " " + user.nickname }}</span>
        <div class="progress-bar">
          <div
              class="progress"
              :style="{ width: `${(user.score / maxScore) * 100}%` }"
          ></div>
        </div>
        <span class="score">{{ user.score }} 分</span>
      </div>
    </template>
    <div v-else class="no-data">暂无排行榜数据</div>
  </section>
</template>

<style scoped>
/* ChatGPT 深色风格 */
.ranking {
  flex: 1;
  background: #1e1e1e; /* 深色背景 */
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

h2 {
  font-size: 1.6rem;
  margin-bottom: 1rem;
  color: #10a37f; /* ChatGPT 主题色 */
  text-align: center;
}

.loading-message, .no-data {
  text-align: center;
  color: #a0a0a0; /* 更柔和的灰色 */
}

.error-message {
  text-align: center;
  color: #e06c75; /* 调暗红色，减少视觉冲击 */
}

.user-item {
  background: #252526; /* 深灰色卡片 */
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.3s;
}

.user-item:hover {
  background: #2d2d30; /* 悬停时稍微亮一点 */
}

.rank {
  font-size: 1.2rem;
  color: #10a37f; /* ChatGPT 主题色 */
  font-weight: bold;
}

.username {
  font-size: 1.2rem;
  flex: 1;
  margin-left: 1rem;
  color: #e0e0e0; /* 浅灰色，避免对比过强 */
}

/* 进度条容器 */
.progress-bar {
  flex: 2;
  background: #333;
  border-radius: 5px;
  height: 10px;
  overflow: hidden;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

/* 进度条 */
.progress {
  height: 100%;
  background: #10a37f; /* ChatGPT 主题色 */
  border-radius: 5px;
  transition: width 0.5s ease-in-out;
}

/* 评分 */
.score {
  font-size: 1.2rem;
  color: #e0e0e0;
  font-weight: bold;
}
</style>