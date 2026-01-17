<template>
  <div class="login-container">
    <h1>用户登录</h1>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label>用户名：</label>
        <input type="text" v-model="username" required placeholder="请输入用户名" />
      </div>
      <div class="form-group">
        <label>密码：</label>
        <input type="password" v-model="password" required placeholder="请输入密码" />
      </div>
      <button type="submit" class="submit-btn">登录</button>
      <div v-if="errorMsg" class="error-message">{{ errorMsg }}</div>
    </form>
  </div>
  <div class="info">
    <h2>登录以启用内部功能，此网站无法注册用户。</h2>
    <h3>若为参赛人员但无账户，请在活动QQ群反馈。</h3>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const username = ref('')
const password = ref('')
const errorMsg = ref('')
const store = useStore()
const router = useRouter()

const handleLogin = async () => {
  try {
    const res = await axios.post('/api/user/login', {
      username: username.value,
      password: password.value
    })

    // 登录成功，将 token 存入 Vuex
    const token = res.data.token
    store.commit('setToken', token)

    // 判断是否需要重置密码
    if (res.data.need_reset_pwd === 1) {
      await router.push('/change-pwd')
    } else {
      await router.push('/')
    }
  } catch (error) {
    errorMsg.value = error.response?.data?.error || '登录失败'
  }
}
</script>

<style scoped>
/* 背景和整体布局 */
.login-container {
  max-width: 380px;
  margin: 5rem auto;
  padding: 2rem;
  border-radius: 12px;
  background: #2b2d33; /* 深色背景 */
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25);
  animation: fadeIn 1s ease-out;
}

/* 标题 */
h1 {
  text-align: center;
  color: #00d9ff; /* 使用明亮的蓝色 */
  font-size: 2.5rem;
  margin-bottom: 1.5rem;
}

/* 表单组 */
.form-group {
  margin-bottom: 1.5rem;
}

label {
  font-size: 1rem;
  color: #bbb; /* 灰色文字 */
  margin-bottom: 0.5rem;
  display: block;
}

/* 输入框 */
input {
  width: 100%;
  padding: 1rem;
  border-radius: 8px;
  border: 2px solid #444; /* 深色边框 */
  background-color: #333; /* 深色背景 */
  color: #fff; /* 白色文字 */
  font-size: 1rem;
  margin-bottom: 1rem;
  transition: border-color 0.3s ease, background-color 0.3s ease;
}

input::placeholder {
  color: #888; /* 浅灰色的占位符文字 */
}

input:focus {
  border-color: #00d9ff; /* 蓝色边框 */
  background-color: #444; /* 深色聚焦背景 */
  outline: none;
}

/* 按钮 */
button {
  width: 100%;
  padding: 1rem;
  background-color: #00d9ff; /* 明亮的蓝色按钮 */
  color: white;
  font-size: 1.1rem;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, background-color 0.2s ease;
}

button:hover {
  transform: scale(1.05);
  background-color: #007bff; /* 更深的蓝色 */
}

/* 错误提示 */
.error-message {
  color: #e57373; /* 红色提示 */
  margin-top: 1rem;
  text-align: center;
  font-size: 1rem;
}

/* 其他文本 */
.info h2, .info h3 {
  color: #bbb; /* 浅灰色文字 */
  text-align: center;
  font-size: 1rem;
}

/* 动效：淡入 */
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(30px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>