<template>
  <nav class="navbar">
    <div class="container">
      <div class="brand">
        <router-link to="/">lom联盟十周年庆典</router-link>
        <p class="subtitle">活动进行、统计、抽奖网站</p>
      </div>

      <div class="nav-links" :class="{ 'active': isMenuOpen }">
        <template v-if="isLoggedIn">
          <span class="username">欢迎，{{ username }}</span>

          <router-link to="/" exact-active-class="active-link">首页</router-link>
          <router-link to="/admin" v-if="isAdmin" active-class="active-link">管理</router-link>
          <router-link to="/change-pwd" active-class="active-link">修改密码</router-link>

          <button @click="handleLogout" class="logout-btn">退出登录</button>
        </template>

        <router-link to="/login" v-else active-class="active-link">登录</router-link>
      </div>

      <button class="hamburger" @click="toggleMenu" aria-label="Toggle menu">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </button>
    </div>
  </nav>
</template>

<script setup>
import {computed, ref, watch} from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'

const store = useStore()
const router = useRouter()

const isLoggedIn = computed(() => store.getters.isLoggedIn)
const username = computed(() => store.getters.username)
const isAdmin = computed(() => store.getters.isAdmin)
const isMenuOpen = ref(false)

store.dispatch('checkTokenValidity');

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const handleLogout = () => {
  if (confirm('确定要退出登录吗？')) {
    store.commit('clearToken')
    router.push('/login')
  }
}

watch(isLoggedIn, (newVal) => {
  if (newVal) isMenuOpen.value = false
})
</script>

<style scoped>
/* 导航栏样式 */
.navbar {
  background: #202123;
  padding: 1rem 0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
  position: sticky;
  top: 0;
  z-index: 1000;
  font-size: 16px; /* 更适合网站常用的字体大小 */
}

/* 布局容器 */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 品牌部分 */
.brand {
  display: flex;
  flex-direction: column;
  color: #d1d5db;
}

.brand a {
  font-size: 1.6rem; /* 缩小为常见的标题字体大小 */
  color: #fff;
  font-weight: bold;
  text-decoration: none;
}

.subtitle {
  font-size: 1rem; /* 副标题字体更适中 */
  color: #aaa;
  margin-top: 2px;
}

/* 导航链接 */
.nav-links {
  display: flex;
  gap: 1.5rem; /* 缩小导航链接之间的间距 */
  align-items: center;
}

.nav-links a,
.logout-btn {
  font-size: 1rem; /* 导航链接字体调整为常规大小 */
  color: #d1d5db;
  text-decoration: none;
  padding: 0.6rem 1rem; /* 调整为适中的点击区域 */
  border-radius: 4px;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

/* 链接悬停 */
.nav-links a:hover:not(.active-link),
.logout-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

/* 激活链接样式 */
.active-link {
  color: #10a37f;
  background: rgba(16, 163, 127, 0.2);
  border-radius: 4px;
}

/* 退出按钮 */
.logout-btn {
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.3);
  cursor: pointer;
}

.logout-btn:hover {
  border-color: #fff;
  background: rgba(255, 255, 255, 0.1);
}

/* 用户名 */
.username {
  color: #10a37f;
  font-size: 1rem; /* 用户名字体适中 */
  margin-left: 1rem;
  display: inline-block;
}

/* 移动端汉堡菜单 */
.hamburger {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 30px;
  height: 21px;
  border: none;
  background: none;
  cursor: pointer;
}

.bar {
  width: 100%;
  height: 4px;
  background: #d1d5db;
  border-radius: 2px;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .container {
    flex-direction: column;
    gap: 1rem;
    padding: 0 15px;
  }

  .brand a {
    font-size: 1.4rem; /* 调整为更合适的手机端标题字体大小 */
  }

  .subtitle {
    font-size: 0.9rem;
    text-align: center;
  }

  .nav-links {
    width: 100%;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
    display: none;
    transition: all 0.3s ease;
  }

  .nav-links.active {
    display: flex;
    background: #343541;
    padding: 10px;
    border-radius: 8px;
  }

  .nav-links a,
  .logout-btn {
    flex: 1 1 auto;
    min-width: 140px;
    justify-content: center;
    padding: 0.7rem 1rem;
    font-size: 0.95rem; /* 调整为适合移动端的常用大小 */
  }

  .hamburger {
    display: flex;
  }

  .username {
    font-size: 0.95rem; /* 用户名字体适中 */
  }
}

@media (max-width: 480px) {
  .brand a {
    font-size: 1.2rem; /* 调整为手机端适配的字体大小 */
  }

  .subtitle {
    font-size: 0.85rem;
  }

  .nav-links {
    gap: 0.6rem;
  }

  .nav-links a,
  .logout-btn {
    min-width: 120px;
    font-size: 0.9rem;
    padding: 0.6rem 0.8rem;
  }

  .username {
    font-size: 0.9rem;
  }
}
</style>