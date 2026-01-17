<template>
  <div class="security-wrapper">
    <div class="ambient-light purple"></div>
    <div class="ambient-light blue"></div>

    <div
        class="glass-card"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 600 } }"
    >
      <div class="card-header">
        <div class="icon-circle">
          <ShieldCheck :size="32" />
        </div>
        <h2>账号安全中心</h2>
        <p>定期修改密码，守护您的数字资产。</p>
      </div>

      <form @submit.prevent="handleChangePassword" class="security-form">
        <div class="input-group">
          <label>当前密码</label>
          <div class="input-wrapper">
            <Lock :size="18" class="input-icon" />
            <input
                type="password"
                v-model="oldPassword"
                placeholder="请输入旧密码"
                required
            />
          </div>
        </div>

        <div class="input-group">
          <label>设置新密码</label>
          <div class="input-wrapper" :class="{ 'error': passwordStrengthError }">
            <Key :size="18" class="input-icon" />
            <input
                type="password"
                v-model="newPassword"
                placeholder="8位以上，包含字母和数字"
                required
                @input="checkStrength"
            />
          </div>

          <div class="strength-meter" v-if="newPassword">
            <div class="meter-bar">
              <div
                  class="meter-fill"
                  :style="{ width: strengthScore + '%', background: strengthColor }"
              ></div>
            </div>
            <span class="strength-text" :style="{ color: strengthColor }">{{ strengthText }}</span>
          </div>
        </div>

        <div class="input-group">
          <label>确认新密码</label>
          <div class="input-wrapper" :class="{ 'error': passwordMatchError }">
            <CheckCircle2 :size="18" class="input-icon" />
            <input
                type="password"
                v-model="confirmPassword"
                placeholder="再次输入新密码"
                required
                @input="validatePasswordsMatch"
            />
          </div>
          <p v-if="passwordMatchError" class="tip-error">{{ passwordMatchError }}</p>
        </div>

        <button type="submit" class="submit-btn" :disabled="loading">
          <span v-if="loading" class="btn-content">
            <Loader2 :size="20" class="spin" /> 正在加密提交...
          </span>
          <span v-else class="btn-content">
            确认修改 <ArrowRight :size="20" />
          </span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import api from "../api/api.js";
import { ShieldCheck, Lock, Key, CheckCircle2, ArrowRight, Loader2 } from 'lucide-vue-next'
import { ElMessage } from 'element-plus'

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)

const passwordStrengthError = ref('')
const passwordMatchError = ref('')

// 密码强度逻辑
const strengthScore = ref(0)
const strengthColor = ref('#555')
const strengthText = ref('')

const checkStrength = () => {
  const val = newPassword.value
  let score = 0

  if (!val) {
    strengthScore.value = 0
    return
  }

  if (val.length >= 8) score += 40
  if (/[A-Za-z]/.test(val)) score += 30
  if (/[0-9]/.test(val)) score += 30

  strengthScore.value = score

  if (score < 40) {
    strengthColor.value = '#ef4444' // 红
    strengthText.value = '太弱'
    passwordStrengthError.value = '密码太短'
  } else if (score < 100) {
    strengthColor.value = '#f59e0b' // 黄
    strengthText.value = '中等'
    passwordStrengthError.value = ''
  } else {
    strengthColor.value = '#10b981' // 绿
    strengthText.value = '完美'
    passwordStrengthError.value = ''
  }
}

const validatePasswordsMatch = () => {
  passwordMatchError.value = newPassword.value !== confirmPassword.value
      ? '两次输入的密码不一致'
      : '';
}

const handleChangePassword = async () => {
  validatePasswordsMatch()
  checkStrength()

  if (strengthScore.value < 70) {
    ElMessage.warning('为了安全，请设置包含字母和数字的强密码')
    return
  }
  if (passwordMatchError.value) return

  loading.value = true
  try {
    await api.post('/user/change-pwd', {
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
    });

    ElMessage.success('密码修改成功！请重新登录。')
    // 可选：跳转到登录页
    // router.push('/login')

    oldPassword.value = newPassword.value = confirmPassword.value = ''
    strengthScore.value = 0
  } catch (error) {
    ElMessage.error(error.response?.data?.error || '密码修改失败，请检查旧密码')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* 1. 全局容器与背景 */
.security-wrapper {
  position: relative;
  min-height: calc(100vh - 140px); /* 减去 Navbar 高度 */
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  overflow: hidden;
}

.ambient-light {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.2;
  pointer-events: none;
}
.purple { width: 500px; height: 500px; background: #8b5cf6; top: -100px; left: 10%; }
.blue { width: 400px; height: 400px; background: #3b82f6; bottom: -50px; right: 10%; }

/* 2. 玻璃卡片 */
.glass-card {
  width: 100%;
  max-width: 480px;
  background: rgba(30, 32, 38, 0.75);
  backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  z-index: 1;
}

/* 头部 */
.card-header {
  text-align: center;
  margin-bottom: 32px;
}

.icon-circle {
  width: 64px; height: 64px;
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  margin: 0 auto 16px;
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.2);
}

.card-header h2 {
  margin: 0 0 8px;
  font-size: 24px;
  color: #fff;
  font-weight: 700;
}

.card-header p {
  margin: 0;
  color: #9ca3af;
  font-size: 14px;
}

/* 表单区域 */
.security-form {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.input-group label {
  display: block;
  font-size: 13px;
  color: #d1d5db;
  margin-bottom: 8px;
  font-weight: 500;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  transition: all 0.3s;
}

.input-wrapper:focus-within {
  border-color: #3b82f6;
  background: rgba(0, 0, 0, 0.4);
  box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1);
}

.input-wrapper.error {
  border-color: #ef4444;
}

.input-icon {
  margin-left: 14px;
  color: #6b7280;
}

.input-wrapper input {
  width: 100%;
  background: transparent;
  border: none;
  padding: 14px;
  color: #fff;
  font-size: 15px;
  outline: none;
}

.input-wrapper input::placeholder {
  color: #4b5563;
}

/* 密码强度条 */
.strength-meter {
  margin-top: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.meter-bar {
  flex: 1;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.meter-fill {
  height: 100%;
  transition: all 0.5s ease;
}

.strength-text {
  font-size: 12px;
  font-weight: 600;
  min-width: 30px;
  text-align: right;
}

.tip-error {
  color: #ef4444;
  font-size: 12px;
  margin-top: 6px;
}

/* 提交按钮 */
.submit-btn {
  margin-top: 10px;
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  color: #fff;
  border: none;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
}

.submit-btn:active:not(:disabled) { transform: scale(0.98); }

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  filter: grayscale(1);
}

.btn-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>