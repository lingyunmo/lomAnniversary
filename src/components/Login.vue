<template>
  <div class="login-wrapper">
    <div class="ambient-light one"></div>
    <div class="ambient-light two"></div>

    <div
        class="login-card"
        v-motion
        :initial="{ opacity: 0, y: 50, scale: 0.95 }"
        :enter="{ opacity: 1, y: 0, scale: 1, transition: { duration: 800, type: 'spring' } }"
    >
      <div class="card-header">
        <h1 class="logo-text">LOM<span class="highlight">11th</span></h1>
        <p class="subtitle">用户登录入口</p>
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
        <div class="input-group">
          <label class="input-label">账号</label>
          <el-input
              v-model="username"
              placeholder="请输入用户名"
              size="large"
              class="custom-input"
          >
            <template #prefix>
              <User :size="18" class="input-icon" />
            </template>
          </el-input>
        </div>

        <div class="input-group">
          <label class="input-label">密码</label>
          <el-input
              v-model="password"
              type="password"
              placeholder="请输入密码"
              size="large"
              show-password
              class="custom-input"
          >
            <template #prefix>
              <Lock :size="18" class="input-icon" />
            </template>
          </el-input>
        </div>

        <button
            type="submit"
            class="submit-btn"
            :class="{ 'is-loading': loading }"
            :disabled="loading"
        >
          <span v-if="!loading">立即登录</span>
          <span v-else class="loading-spinner"></span>
          <ArrowRight v-if="!loading" :size="18" class="btn-icon" />
        </button>
      </form>

      <div class="card-footer">
        <div class="info-box">
          <Info :size="16" class="info-icon" />
          <div class="info-text">
            <p>登录以启用内部功能，暂不支持公开注册。</p>
            <p class="sub-info">参赛人员如无账户，请在活动 QQ 群联系管理。</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { User, Lock, ArrowRight, Info } from 'lucide-vue-next' // 引入图标
import { ElMessage } from 'element-plus' // 引入消息提示

const username = ref('')
const password = ref('')
const loading = ref(false) // 增加 loading 状态
const store = useStore()
const router = useRouter()

const handleLogin = async () => {
  if (!username.value || !password.value) {
    ElMessage.warning('请输入用户名和密码')
    return
  }

  loading.value = true // 开始加载

  try {
    const res = await axios.post('/api/user/login', {
      username: username.value,
      password: password.value
    })

    // 登录成功
    const token = res.data.token
    store.commit('setToken', token)

    ElMessage.success('登录成功，欢迎回来！')

    // 延迟一点跳转，让用户看到成功提示
    setTimeout(async () => {
      if (res.data.need_reset_pwd === 1) {
        await router.push('/change-pwd')
      } else {
        await router.push('/')
      }
    }, 500)

  } catch (error) {
    const msg = error.response?.data?.error || '登录失败，请检查网络或账号'
    ElMessage.error(msg)
  } finally {
    loading.value = false // 结束加载
  }
}
</script>

<style scoped>
/* 1. 全屏背景布局 */
.login-wrapper {
  min-height: calc(100vh - 140px); /* 减去 navbar footer 高度，或者直接 100vh */
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #0f1115;
  position: relative;
  overflow: hidden;
  padding: 20px;
}

/* 2. 背景极光动效 (Ambient Light) */
.ambient-light {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  z-index: 0;
  animation: float 10s infinite alternate;
}

.one {
  width: 300px;
  height: 300px;
  background: #3b82f6; /* 蓝色光晕 */
  top: 10%;
  left: 20%;
}

.two {
  width: 250px;
  height: 250px;
  background: #ec4899; /* 粉色光晕 */
  bottom: 10%;
  right: 20%;
  animation-delay: -5s;
}

@keyframes float {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(30px, -30px) scale(1.1); }
}

/* 3. 玻璃拟态卡片 */
.login-card {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 420px;
  background: rgba(30, 32, 38, 0.6); /* 半透明黑 */
  backdrop-filter: blur(20px); /* 毛玻璃核心 */
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 40px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  gap: 30px;
}

/* 头部样式 */
.card-header {
  text-align: center;
}

.logo-text {
  font-size: 36px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 2px;
  margin-bottom: 5px;
}

.highlight {
  background: linear-gradient(45deg, #3b82f6, #ec4899);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  margin-left: 5px;
  font-style: italic;
}

.subtitle {
  color: #9ca3af;
  font-size: 14px;
}

/* 表单样式 */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.input-label {
  color: #d1d5db;
  font-size: 14px;
  font-weight: 500;
  margin-left: 4px;
}

/* 深度定制 Element Input */
:deep(.custom-input .el-input__wrapper) {
  background-color: rgba(0, 0, 0, 0.3);
  box-shadow: 0 0 0 1px rgba(255, 255, 255, 0.1) inset;
  border-radius: 12px;
  padding: 4px 15px;
  transition: all 0.3s;
}

:deep(.custom-input .el-input__wrapper.is-focus) {
  box-shadow: 0 0 0 1px #3b82f6 inset !important;
  background-color: rgba(59, 130, 246, 0.05);
}

:deep(.custom-input .el-input__inner) {
  color: #fff;
  height: 45px;
}

.input-icon {
  color: #6b7280;
}

/* 登录按钮 */
.submit-btn {
  margin-top: 10px;
  height: 50px;
  border-radius: 12px;
  border: none;
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  color: white;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
  background: linear-gradient(90deg, #60a5fa, #3b82f6);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Loading 动画 */
.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* 底部提示框 */
.card-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 20px;
}

.info-box {
  background: rgba(255, 166, 0, 0.1); /* 橙色警告背景，极淡 */
  border: 1px solid rgba(255, 166, 0, 0.2);
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.info-icon {
  color: #fbbf24; /* 琥珀色图标 */
  flex-shrink: 0;
  margin-top: 2px;
}

.info-text p {
  margin: 0;
  font-size: 13px;
  color: #e5e7eb;
  line-height: 1.5;
}

.info-text .sub-info {
  color: #9ca3af;
  font-size: 12px;
  margin-top: 2px;
}

/* 响应式适配 */
@media (max-width: 480px) {
  .login-card {
    padding: 30px 20px;
  }

  .logo-text {
    font-size: 28px;
  }
}
</style>