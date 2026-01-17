<script setup>
import { ref, computed, onMounted } from 'vue'
import axios from "axios"

// 奖品里程碑配置
const milestones = ref([
  {
    target: 5,
    rewards: ['冠军：256.3598￥', '亚军：163.9124￥', '季军：71.6727￥'],
    position: '25%'
  },
  {
    target: 10,
    rewards: ['冠军：S奖牌', '前3名：R奖牌', '前5名：Q奖牌'],
    position: '50%'
  },
  {
    target: 15,
    rewards: ['冠军：黄金徽章', '前5名：白银徽章', '前10名：青铜徽章'],
    position: '75%'
  },
  {
    target: 20,
    rewards: ['冠军：钻石奖杯', '前3名：金奖杯', '前10名：银奖杯'],
    position: '100%'
  }
])

const participantCount = ref(0)
const loading = ref(true)
const error = ref(null)
const ws = ref(null)

// 计算当前激活的里程碑
const activeMilestone = computed(() =>
    milestones.value.filter(m => participantCount.value >= m.target)
)

// 处理WebSocket数据
const handleWebSocketData = async (event) => {
  try {
    const leaderboard = JSON.parse(event.data)
    const validUsers = leaderboard.filter(user => user.score > 0)
    participantCount.value = validUsers.length
  } catch (err) {
    error.value = '实时数据解析失败'
  }
}

// 获取初始数据
const fetchInitialData = async () => {
  try {
    const res = await axios.get('/api/leaderboard')
    const validUsers = res.data.filter(user => user.score > 0)
    participantCount.value = validUsers.length
  } catch (err) {
    error.value = err.response?.data?.error || '数据加载失败'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  ws.value = new WebSocket('/ws');
  ws.value.onmessage = handleWebSocketData
  fetchInitialData()
})
</script>

<template>
  <section class="ranking">
    <h2>奖品解锁进度</h2>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-message">数据加载中...</div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-message">{{ error }}</div>

    <!-- 主内容 -->
    <template v-else>
      <!-- 进度条容器 -->
      <div class="progress-container">
        <!-- 背景进度条 -->
        <div class="progress-track">
          <!-- 当前进度 -->
          <div
              class="current-progress"
              :style="{ width: `${(participantCount / 20) * 100}%` }"
          ></div>

          <!-- 里程碑节点 -->
          <div
              v-for="(milestone, index) in milestones"
              :key="index"
              class="milestone-marker"
              :class="{ 'achieved': participantCount >= milestone.target }"
              :style="{ left: milestone.position }"
          >
            <div class="marker-tip">{{ milestone.target }}人</div>
          </div>
        </div>
      </div>

      <!-- 当前状态 -->
      <div class="status-info">
        当前有效参赛人数：<strong>{{ participantCount }}</strong> 人
      </div>

      <!-- 奖品展示 -->
      <div class="rewards-container">
        <div
            v-for="(milestone, index) in milestones"
            :key="index"
            class="reward-tier"
        >
          <h3 :class="{ 'achieved': participantCount >= milestone.target }">
            {{ milestone.target }}人奖励
          </h3>
          <ul>
            <li
                v-for="(reward, rewardIndex) in milestone.rewards"
                :key="rewardIndex"
                :class="{ 'achieved': participantCount >= milestone.target }"
            >
              {{ reward }}
            </li>
          </ul>
        </div>
      </div>

      <!-- 人数不足提示 -->
      <div v-if="participantCount < 5" class="notice">
        * 当前参赛人数不足5人，无法解锁任何奖励
      </div>
    </template>
  </section>
</template>

<style scoped>
.ranking {
  flex: 1;
  background: #1e1e1e;
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
  min-height: 600px;  /* 保证内容高度统一 */
}

h2 {
  font-size: 1.8rem;
  margin-bottom: 2rem;
  color: #10a37f;
  text-align: center;
  letter-spacing: 0.05em;
  position: relative;
  padding-bottom: 0.5rem;
}

h2::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 60px;
  height: 2px;
  background: rgba(16, 163, 127, 0.3);
}

/* ===== 进度条样式优化 ===== */
.progress-container {
  margin: 2.5rem 0;
  position: relative;
}

.progress-track {
  height: 16px;
  background: #2a2a2a;
  border-radius: 8px;
  position: relative;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.2);
}

.current-progress {
  height: 100%;
  background: linear-gradient(90deg, #10a37f, #0d8f6f);
  border-radius: 8px;
  transition: width 0.8s cubic-bezier(0.4, 0, 0.2, 1);
  position: relative;
  overflow: hidden;
}

.current-progress::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(90deg,
  rgba(255,255,255,0) 0%,
  rgba(255,255,255,0.15) 50%,
  rgba(255,255,255,0) 100%
  );
  pointer-events: none;
}

/* ===== 里程碑标记 ===== */
.milestone-marker {
  position: absolute;
  top: -6px;
  width: 24px;
  height: 24px;
  background: #3a3a3a;
  border-radius: 50%;
  transform: translateX(-50%);
  transition: all 0.3s ease;
  cursor: pointer;
  border: 2px solid #2a2a2a;
}

.milestone-marker.achieved {
  background: #10a37f;
  box-shadow: 0 0 12px rgba(16, 163, 127, 0.4);
  border-color: #0d8f6f;
}

.marker-tip {
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  background: #252526;
  padding: 8px 16px;
  border-radius: 6px;
  color: #e0e0e0;
  font-size: 0.95rem;
  white-space: nowrap;
  opacity: 0;
  transition: all 0.3s ease;
  box-shadow: 0 3px 6px rgba(0, 0, 0, 0.2);
}

.milestone-marker:hover .marker-tip {
  opacity: 1;
  transform: translateX(-50%) translateY(-2px);
}

/* ===== 状态信息 ===== */
.status-info {
  text-align: center;
  color: #909090;
  margin: 1.5rem 0;
  font-size: 1.1rem;
}

.status-info strong {
  color: #10a37f;
  font-weight: 600;
}

/* ===== 奖励展示 ===== */
.rewards-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-top: 3rem;
}

.reward-tier {
  background: #252526;
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid #303030;
  transition: all 0.3s ease;
  min-height: 200px;  /* 统一卡片高度 */
  display: flex;
  flex-direction: column;
}

.reward-tier:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
}

.reward-tier h3 {
  color: #e06c75;
  font-size: 1.2rem;
  margin-bottom: 1.2rem;
  text-align: center;
  font-weight: 600;
  padding-bottom: 0.8rem;
  border-bottom: 1px solid #333;
  transition: all 0.3s ease;
}

.reward-tier h3.achieved {
  color: #10a37f;
  border-bottom-color: rgba(16, 163, 127, 0.3);
}

.reward-tier ul {
  list-style: none;
  padding: 0;
  margin: auto 0;  /* 垂直居中内容 */
}

.reward-tier li {
  color: #e06c75;
  padding: 0.8rem;
  margin: 0.5rem 0;
  border-radius: 6px;
  transition: all 0.3s ease;
  background: rgba(224, 108, 117, 0.05);
  border: 1px solid rgba(224, 108, 117, 0.1);
  font-size: 0.95rem;
}

.reward-tier li.achieved {
  color: #10a37f;
  background: rgba(16, 163, 127, 0.08);
  border-color: rgba(16, 163, 127, 0.15);
}

/* ===== 响应式设计 ===== */
@media (max-width: 1200px) {
  .rewards-container {
    grid-template-columns: repeat(2, 1fr);
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .ranking {
    padding: 1.5rem;
  }

  .rewards-container {
    grid-template-columns: 1fr;
  }

  .progress-track {
    height: 12px;
  }

  .milestone-marker {
    width: 20px;
    height: 20px;
  }
}

/* ===== 提示信息 ===== */
.notice {
  text-align: center;
  color: #e06c75;
  margin-top: 2rem;
  padding: 1.2rem;
  background: #252526;
  border-radius: 8px;
  border: 1px solid rgba(224, 108, 117, 0.2);
  font-size: 0.95rem;
}

.loading-message,
.error-message {
  text-align: center;
  padding: 2rem;
  font-size: 1.1rem;
  border-radius: 8px;
  margin: 2rem 0;
}

.loading-message {
  color: #909090;
  background: rgba(144, 144, 144, 0.05);
}

.error-message {
  color: #e06c75;
  background: rgba(224, 108, 117, 0.05);
  border: 1px solid rgba(224, 108, 117, 0.1);
}
</style>