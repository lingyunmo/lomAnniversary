<template>
  <section class="lottery-card">
    <div class="card-header">
      <div class="title-wrapper">
        <Sparkles :size="28" class="header-icon" /> <h2>幸运抽奖</h2>
      </div>
      <div class="subtitle">消耗次数赢取积分大奖</div>
    </div>

    <div class="lottery-stage">
      <div class="gift-box-wrapper" :class="{ 'is-shaking': isDrawing }">
        <Gift :size="120" class="gift-icon" /> <div class="gift-glow"></div>
      </div>

      <div class="stats-row">
        <div class="stat-capsule score">
          <Coins :size="18" />
          <span class="label">当前积分</span>
          <span class="value">{{ userScore }}</span>
        </div>
        <div class="stat-capsule ticket" :class="{ 'empty': userEnable <= 0 }">
          <Ticket :size="18" />
          <span class="label">剩余次数</span>
          <span class="value">{{ userEnable }}</span>
        </div>
      </div>
    </div>

    <div class="action-footer">
      <button
          class="draw-btn"
          :class="{ 'disabled': userEnable <= 0 || isDrawing }"
          @click="handleDraw"
          :disabled="userEnable <= 0 || isDrawing"
      >
        <span v-if="isDrawing" class="btn-content">
          <Loader2 :size="24" class="spin" /> 祈愿中...
        </span>
        <span v-else-if="userEnable > 0" class="btn-content">
          <Zap :size="24" /> 立即抽奖 (-1次)
        </span>
        <span v-else class="btn-content">
          <Lock :size="24" /> 次数不足
        </span>
      </button>

      <p v-if="userEnable <= 0" class="no-chance-tip">
        今日次数已耗尽，请关注后续活动
      </p>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import api from '../api/api.js'
import { Gift, Sparkles, Coins, Ticket, Zap, Lock, Loader2 } from 'lucide-vue-next'
import { ElMessageBox, ElMessage, ElNotification } from 'element-plus'

const store = useStore()
const isDrawing = ref(false)
const userScore = ref(0)
const userEnable = ref(0)

const refreshUserInfo = async () => {
  try {
    const res = await api.get('/user')
    userScore.value = res.data.score
    userEnable.value = res.data.enable
  } catch (error) {
    console.error('获取用户信息失败', error)
  }
}

const handleDraw = async () => {
  if (isDrawing.value || userEnable.value <= 0) return

  try {
    await ElMessageBox.confirm(
        '将消耗 1 次抽奖机会，随机获取 0~5 积分。确定要搏一搏吗？',
        '✨ 抽奖确认',
        {
          confirmButtonText: '直接抽！',
          cancelButtonText: '再想想',
          type: 'warning',
          center: true,
          customClass: 'dark-message-box-lg' // 👈 使用新的大号样式类
        }
    )
  } catch {
    return
  }

  isDrawing.value = true
  const minTime = new Promise(resolve => setTimeout(resolve, 1500))
  const request = api.post('/lottery')

  try {
    const [_, res] = await Promise.all([minTime, request])
    const scoreAdded = res.data.scoreChange

    ElNotification({
      title: '🎉 欧气爆发！',
      message: `恭喜你获得了 ${scoreAdded} 积分！离大奖又近了一步。`,
      type: 'success',
      position: 'bottom-right',
      duration: 5000,
      offset: 100 // 稍微往上一点，避免太贴底
    })

    await refreshUserInfo()
  } catch (error) {
    ElMessage.error(error.response?.data?.error || '抽奖失败，请稍后重试')
  } finally {
    isDrawing.value = false
  }
}

onMounted(() => {
  refreshUserInfo()
})
</script>

<style scoped>
/* 卡片容器：增加内边距 */
.lottery-card {
  background: rgba(20, 22, 26, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 32px; /* 增大内边距 */
  display: flex;
  flex-direction: column;
  height: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

/* 头部 */
.card-header {
  margin-bottom: 30px; /* 增加间距 */
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 6px;
}

.header-icon { color: #ec4899; filter: drop-shadow(0 0 5px rgba(236, 72, 153, 0.5)); }

h2 {
  margin: 0;
  font-size: 1.8rem; /* 字体加大 */
  font-weight: 700;
  color: #fff;
  letter-spacing: 1px;
}

.subtitle { font-size: 1rem; color: #9ca3af; margin-left: 40px; }

/* 舞台区 */
.lottery-stage {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 40px; /* 拉开间距 */
  padding: 20px 0;
}

/* 礼盒动画 */
.gift-box-wrapper { position: relative; transition: transform 0.3s; }

.gift-icon {
  color: #ec4899;
  filter: drop-shadow(0 15px 30px rgba(236, 72, 153, 0.4));
  transition: all 0.3s;
  animation: float 3s ease-in-out infinite;
}

.gift-glow {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 160px; /* 光晕加大 */
  height: 160px;
  background: radial-gradient(circle, rgba(236, 72, 153, 0.25) 0%, transparent 70%);
  z-index: -1;
}

.is-shaking .gift-icon {
  animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both infinite;
  color: #fbbf24;
}

/* 数据胶囊 */
.stats-row {
  display: flex;
  gap: 16px;
  width: 100%;
}

.stat-capsule {
  flex: 1;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 16px; /* 加大胶囊 */
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.stat-capsule.score { color: #fbbf24; }
.stat-capsule.ticket { color: #3b82f6; }
.stat-capsule.ticket.empty { color: #ef4444; opacity: 0.6; }

.label { font-size: 0.9rem; color: #9ca3af; }
.value { font-size: 1.5rem; font-weight: 700; font-family: monospace; }

/* 按钮 */
.action-footer { margin-top: auto; }

.draw-btn {
  width: 100%;
  padding: 18px; /* 按钮变厚 */
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #ec4899, #8b5cf6);
  color: white;
  font-size: 1.2rem; /* 字体加大 */
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(236, 72, 153, 0.3);
}

.draw-btn:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(236, 72, 153, 0.5);
  filter: brightness(1.1);
}

.draw-btn:active:not(.disabled) { transform: scale(0.98); }

.draw-btn.disabled {
  background: #374151;
  color: #9ca3af;
  cursor: not-allowed;
  box-shadow: none;
}

.btn-content {
  display: flex; align-items: center; justify-content: center; gap: 10px;
}

.spin { animation: spin 1s linear infinite; }

.no-chance-tip {
  text-align: center; font-size: 0.9rem; color: #ef4444; margin-top: 15px;
}

@keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0) rotate(-5deg); }
  20%, 80% { transform: translate3d(2px, 0, 0) rotate(5deg); }
  30%, 50%, 70% { transform: translate3d(-4px, 0, 0) rotate(-5deg); }
  40%, 60% { transform: translate3d(4px, 0, 0) rotate(5deg); }
}
</style>

<style>
/* 全局覆盖：Element Plus 弹窗大号样式 */
.dark-message-box-lg {
  background-color: #1f2937 !important;
  border: 1px solid #374151 !important;
  border-radius: 20px !important;
  padding-bottom: 30px !important;
  width: 500px !important; /* 强制加宽 */
  max-width: 90vw !important; /* 手机端防止溢出 */
}

/* 标题加大 */
.dark-message-box-lg .el-message-box__title {
  color: #fff !important;
  font-size: 22px !important;
  padding-top: 10px;
}

/* 内容文字加大 */
.dark-message-box-lg .el-message-box__message {
  color: #d1d5db !important;
  font-size: 16px !important;
  padding: 20px 0 !important;
}

/* 按钮加大 */
.dark-message-box-lg .el-button {
  padding: 12px 24px !important;
  font-size: 16px !important;
  border-radius: 8px !important;
}

.dark-message-box-lg .el-button--primary {
  background: #ec4899 !important;
  border-color: #ec4899 !important;
}
.dark-message-box-lg .el-button:not(.el-button--primary) {
  background: transparent !important;
  border-color: #4b5563 !important;
  color: #d1d5db !important;
}
.dark-message-box-lg .el-button:not(.el-button--primary):hover {
  border-color: #fff !important;
  color: #fff !important;
}
</style>