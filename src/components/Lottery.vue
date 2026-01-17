<script setup>
import { computed, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import api from '../api/api.js'

// 获取 Vuex store 实例
const store = useStore()

const isDrawing = ref(false)
const userScore = ref(0)   // 用户积分
const userEnable = ref(0)  // 剩余抽奖次数

// 获取当前用户的ID
const currentUserId = computed(() => store.getters.id)

// 获取用户信息
const getUserInfo = async () => {
  try {
    // 调用后端接口获取用户积分和抽奖次数
    const res = await api.get('/user')  // 后端会根据 token 自动识别用户
    userScore.value = res.data.score  // 设置用户积分
    userEnable.value = res.data.enable  // 设置剩余抽奖次数
  } catch (error) {
    console.error('获取用户信息失败', error)
  }
}

// 进行抽奖
const drawLottery = async () => {
  if (isDrawing.value) return

  const confirmed = confirm(`消耗1次抽奖机会，得到0~5积分。是否确认进行抽奖？`)
  if (!confirmed) return

  isDrawing.value = true
  try {
    // 调用后端 API 进行抽奖
    const res = await api.post('/lottery')

    // 更新剩余抽奖次数和用户积分
    await getUserInfo()  // 重新获取用户信息并更新

    // 显示抽奖结果
    alert(`🎉 恭喜获得 ${res.data.scoreChange} 积分！\n剩余抽奖次数：${res.data.remaining}\n当前积分：${userScore.value}`)
  } catch (error) {
    alert('抽奖失败，请稍后重试')
  } finally {
    isDrawing.value = false
  }
}

// 组件挂载时，获取用户信息
onMounted(() => {
  getUserInfo()
})
</script>

<template>
  <section class="lottery">
    <h2>积分抽奖 🎉</h2>
    <div class="lottery-box">
      <!-- 显示剩余抽奖次数 -->
      <p>您的积分：{{ userScore }}</p>
      <p v-if="userEnable > 0">剩余抽奖次数：{{ userEnable }}</p>

      <!-- 抽奖按钮 -->
      <button
          v-if="userEnable > 0"
          :disabled="isDrawing"
          @click="drawLottery"
          :class="{ 'drawing': isDrawing, 'bounce': !isDrawing }"
      >
        {{ isDrawing ? '抽奖中...' : '开始抽奖' }}
      </button>

      <!-- 没有抽奖机会时的提示 -->
      <p v-else class="no-chance">🛑 当前没有抽奖机会</p>
    </div>
  </section>
</template>

<style scoped>
/* 暗黑风格背景 */
.lottery {
  background: #1e1e1e; /* 深色背景 */
  padding: 2rem;
  border-radius: 20px;  /* 边角圆润 */
  text-align: center;
  width: 40%;
  max-width: 400px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  margin: 0 auto;
}

/* 抽奖区域 */
.lottery-box {
  margin-top: 1.5rem;
}

/* 按钮样式 */
button {
  margin-top: 2rem;
  background: #1abc9c;
  border: none;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  color: white;
  cursor: pointer;
  border-radius: 30px; /* 圆角 */
  transition: background 0.3s, transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out;
}

/* 按钮悬停效果 */
button:hover {
  background: #16a085;
  box-shadow: 0 0 15px rgba(255, 255, 255, 0.5); /* 光效 */
}

/* 禁用状态下按钮样式 */
button:disabled {
  background: #7f8c8d;
  cursor: not-allowed;
}

/* 动画效果 */
button.drawing {
  animation: spinning 2s infinite linear;
}

/* 按钮旋转动画 */
@keyframes spinning {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 弹跳效果 */
button.bounce {
  animation: bounce 0.5s ease-in-out infinite;
}

/* 按钮弹跳动画 */
@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
  100% {
    transform: translateY(0);
  }
}

/* 无抽奖机会时的提示 */
.no-chance {
  color: #e74c3c;
  font-size: 1.2rem;
  margin-top: 1rem;
  font-weight: bold;
}

/* 标题样式 */
h2 {
  font-size: 1.5rem;
  color: #ecf0f1;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
}
</style>