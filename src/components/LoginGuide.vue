<template>
  <div class="guide-card">
    <div class="card-header">
      <div class="title-wrapper">
        <Gem :size="24" class="header-icon" />
        <h2>专属福利</h2>
      </div>
      <div class="subtitle">登录解锁每日积分抽奖</div>
    </div>

    <div class="visual-stage">
      <div class="icon-stack">
        <div class="glow-bg"></div>
        <Gift :size="80" class="gift-icon-blur" />
        <div class="lock-wrapper">
          <LockKeyhole :size="40" class="lock-icon" />
        </div>
      </div>

      <p class="guide-text">
        登录后即可参与 <strong>每日抽奖</strong><br>
        赢取积分兑换 <strong>现金 & 游戏道具</strong>
      </p>
    </div>

    <div class="action-footer">
      <button class="login-btn" @click="goToLogin">
        <LogIn :size="20" /> 立即登录 / 注册
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { Gem, Gift, LockKeyhole, LogIn } from 'lucide-vue-next'

const router = useRouter()

const goToLogin = () => {
  router.push('/login') // 跳转到你的登录页路由
}
</script>

<style scoped>
/* 复用之前的玻璃卡片风格，保持右侧视觉高度一致 */
.guide-card {
  background: rgba(20, 22, 26, 0.6);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 400px; /* 保证和左边排行榜高度差不多 */
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  position: relative;
  overflow: hidden;
}

/* 头部 */
.card-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 6px;
}

.header-icon { color: #8b5cf6; filter: drop-shadow(0 0 5px rgba(139, 92, 246, 0.5)); }

h2 {
  margin: 0; font-size: 1.8rem; font-weight: 700; color: #fff; letter-spacing: 1px;
}

.subtitle { font-size: 0.9rem; color: #9ca3af; margin-left: 36px; }

/* 视觉区域 */
.visual-stage {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

.icon-stack {
  position: relative;
  width: 120px;
  height: 120px;
  display: flex; align-items: center; justify-content: center;
}

.glow-bg {
  position: absolute;
  width: 100%; height: 100%;
  background: radial-gradient(circle, rgba(139, 92, 246, 0.2) 0%, transparent 70%);
  border-radius: 50%;
}

.gift-icon-blur {
  color: #4b5563;
  opacity: 0.5;
  filter: blur(2px); /* 让礼盒看起来被封印了 */
  transform: scale(0.9);
}

.lock-wrapper {
  position: absolute;
  background: rgba(30, 32, 38, 0.9);
  border: 2px solid rgba(255, 255, 255, 0.1);
  width: 64px; height: 64px;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 10px 20px rgba(0,0,0,0.5);
  animation: float 3s ease-in-out infinite;
}

.lock-icon { color: #fbbf24; }

.guide-text {
  text-align: center;
  color: #9ca3af;
  font-size: 1rem;
  line-height: 1.6;
}
.guide-text strong { color: #fff; font-weight: 600; }

/* 底部按钮 */
.action-footer { margin-top: auto; }

.login-btn {
  width: 100%;
  padding: 16px;
  border: none;
  border-radius: 16px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: white;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex; align-items: center; justify-content: center; gap: 10px;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(59, 130, 246, 0.5);
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}
</style>