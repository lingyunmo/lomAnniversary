<template>
  <nav class="modern-navbar" :class="{ 'scrolled': isScrolled }">
    <div class="navbar-container">

      <div class="brand-section">
        <router-link to="/" class="brand-link">
          <div class="logo-wrapper" v-motion :initial="{ opacity: 0, x: -20 }" :enter="{ opacity: 1, x: 0 }">
            <img src="/logo.svg" alt="LOM Logo" class="logo-img" />
            <span class="logo-text">lom</span>
            <span class="logo-highlight">11th</span>
          </div>
        </router-link>
        <span class="vertical-divider"></span>
        <span class="subtitle">十一周年庆典</span>
      </div>

      <div class="desktop-menu hidden-sm-and-down">
        <router-link to="/" class="nav-item" active-class="active">
          <Home :size="18" />
          <span>首页</span>
        </router-link>

        <template v-if="!isLoggedIn">
          <router-link to="/login">
            <el-button type="primary" round class="login-btn">
              登录 / 注册
            </el-button>
          </router-link>
        </template>

        <template v-else>
          <el-dropdown trigger="click" @command="handleCommand">
            <div class="user-profile">
              <el-avatar :size="32" class="user-avatar">{{ username.charAt(0).toUpperCase() }}</el-avatar>
              <span class="username">{{ username }}</span>
              <ChevronDown :size="16" class="chevron-icon" />
            </div>

            <template #dropdown>
              <el-dropdown-menu class="custom-dropdown">
                <el-dropdown-item v-if="isAdmin" command="admin">
                  <el-icon><Settings /></el-icon>后台管理
                </el-dropdown-item>
                <el-dropdown-item command="change-pwd">
                  <el-icon><Key /></el-icon>修改密码
                </el-dropdown-item>
                <el-dropdown-item divided command="logout" class="logout-item">
                  <el-icon><LogOut /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </div>

      <div class="mobile-toggle hidden-md-and-up">
        <el-button link @click="drawerVisible = true">
          <Menu :size="24" color="#fff" />
        </el-button>
      </div>
    </div>

    <div class="navbar-line"></div>
  </nav>

  <el-drawer
      v-model="drawerVisible"
      title="LOM 11th"
      direction="rtl"
      size="70%"
      class="mobile-drawer"
      :with-header="false"
  >
    <div class="drawer-content">
      <div class="drawer-header">
        <h2>LOM<span>11th</span></h2>
        <p>活动 · 统计 · 抽奖</p>
      </div>

      <div class="drawer-links">
        <router-link to="/" class="drawer-item" @click="drawerVisible = false">
          <Home :size="20" /> 首页
        </router-link>

        <template v-if="isLoggedIn">
          <div class="drawer-user-info">
            <el-avatar :size="40">{{ username.charAt(0).toUpperCase() }}</el-avatar>
            <span>{{ username }}</span>
          </div>

          <router-link v-if="isAdmin" to="/admin" class="drawer-item" @click="drawerVisible = false">
            <Settings :size="20" /> 后台管理
          </router-link>

          <router-link to="/change-pwd" class="drawer-item" @click="drawerVisible = false">
            <Key :size="20" /> 修改密码
          </router-link>

          <div class="drawer-item logout" @click="handleLogout">
            <LogOut :size="20" /> 退出登录
          </div>
        </template>

        <template v-else>
          <router-link to="/login" class="drawer-item active" @click="drawerVisible = false">
            <User :size="20" /> 立即登录
          </router-link>
        </template>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { Home, Menu, User, Settings, Key, LogOut, ChevronDown } from 'lucide-vue-next'
import { ElMessageBox, ElMessage } from 'element-plus'

const store = useStore()
const router = useRouter()

// 状态管理
const isLoggedIn = computed(() => store.getters.isLoggedIn)
const username = computed(() => store.getters.username || 'Guest')
const isAdmin = computed(() => store.getters.isAdmin)
const drawerVisible = ref(false)
const isScrolled = ref(false)

// 检查 Token
store.dispatch('checkTokenValidity')

// 滚动监听 (实现磨砂效果切换)
const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

// 菜单指令处理
const handleCommand = (command) => {
  switch (command) {
    case 'admin':
      router.push('/admin')
      break
    case 'change-pwd':
      router.push('/change-pwd')
      break
    case 'logout':
      handleLogout()
      break
  }
}

// 退出登录逻辑
const handleLogout = () => {
  drawerVisible.value = false // 如果在移动端，先关抽屉

  ElMessageBox.confirm(
      '确定要退出当前账号吗？',
      '提示',
      {
        confirmButtonText: '退出',
        cancelButtonText: '取消',
        type: 'warning',
      }
  ).then(() => {
    store.commit('clearToken')
    router.push('/login')
    ElMessage.success('已安全退出')
  }).catch(() => {})
}
</script>

<style scoped>
/* 定义变量 */
:root {
  --nav-bg: rgba(15, 17, 21, 0.8); /* 半透明黑 */
  --nav-height: 70px;
  --accent-color: #3b82f6;
  --text-primary: #ffffff;
}

/* 导航栏整体 */
.modern-navbar {
  position: sticky;
  top: 0;
  z-index: 999;
  background-color: #0f1115; /* 默认不透明 */
  height: var(--nav-height);
  transition: all 0.3s ease;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.logo-img {
  width: 32px; /* 根据导航栏高度调整 */
  height: 32px;
  margin-right: 8px;
  filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.5)); /* 加一点发光效果 */
}

/* 滚动后的磨砂效果 */
.modern-navbar.scrolled {
  background-color: rgba(15, 17, 21, 0.85);
  backdrop-filter: blur(12px); /* 核心：毛玻璃模糊 */
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
}

.navbar-line {
  height: 2px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
  opacity: 0.8;
}

.navbar-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 24px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 品牌区域 */
.brand-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-link {
  text-decoration: none;
}

.logo-text {
  font-size: 24px;
  font-weight: 800;
  color: #fff;
  letter-spacing: 1px;
}

.logo-highlight {
  font-size: 14px;
  background: linear-gradient(45deg, #3b82f6, #ec4899);
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  font-weight: 900;
  margin-left: 4px;
  font-style: italic;
}

.vertical-divider {
  width: 1px;
  height: 18px;
  background-color: rgba(255, 255, 255, 0.2);
}

.subtitle {
  font-size: 14px;
  color: #9ca3af;
  letter-spacing: 0.5px;
}

/* 桌面端导航 */
.desktop-menu {
  display: flex;
  align-items: center;
  gap: 24px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  color: #d1d5db;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.2s;
  padding: 8px 12px;
  border-radius: 6px;
}

.nav-item:hover, .nav-item.active {
  color: #fff;
  background: rgba(255, 255, 255, 0.08);
}

.login-btn {
  background: linear-gradient(90deg, #3b82f6, #2563eb);
  border: none;
  font-weight: 600;
}

.login-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}

/* 用户头像下拉 */
.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 10px;
  border-radius: 20px;
  transition: background 0.2s;
}

.user-profile:hover {
  background: rgba(255, 255, 255, 0.1);
}

.user-avatar {
  background: #3b82f6;
  font-weight: 600;
  color: #fff;
}

.username {
  color: #fff;
  font-size: 14px;
  font-weight: 500;
}

.chevron-icon {
  color: #9ca3af;
}

/* 移动端抽屉样式 */
.drawer-header {
  padding: 20px;
  background: #1f2937;
  border-bottom: 1px solid #374151;
  text-align: center;
}

.drawer-header h2 {
  color: #fff;
  font-size: 24px;
  margin-bottom: 5px;
}

.drawer-header h2 span {
  color: #3b82f6;
}

.drawer-header p {
  color: #9ca3af;
  font-size: 12px;
}

.drawer-links {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.drawer-item {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  color: #d1d5db;
  padding: 12px 16px;
  border-radius: 8px;
  transition: background 0.2s;
  font-size: 16px;
}

.drawer-item:hover, .drawer-item.active {
  background: rgba(59, 130, 246, 0.15);
  color: #3b82f6;
}

.drawer-user-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  padding: 20px 0;
  border-bottom: 1px solid #374151;
  margin-bottom: 10px;
}

.drawer-user-info span {
  color: #fff;
  font-weight: 600;
}

.logout {
  color: #ef4444; /* 红色警告色 */
  cursor: pointer;
  margin-top: 10px;
}

.logout:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

/* 响应式工具类 */
@media (max-width: 768px) {
  .hidden-sm-and-down { display: none !important; }
  .logo-text { font-size: 20px; }
  .subtitle { display: none; } /* 手机上隐藏副标题 */
  .vertical-divider { display: none; }
}

@media (min-width: 769px) {
  .hidden-md-and-up { display: none !important; }
}
</style>

<style>
/* 覆盖 Element Plus 下拉菜单的全局样式 */
.custom-dropdown {
  background-color: #1f2937 !important;
  border: 1px solid #374151 !important;
}

.el-dropdown-menu__item {
  color: #d1d5db !important;
}

.el-dropdown-menu__item:hover {
  background-color: rgba(59, 130, 246, 0.1) !important;
  color: #3b82f6 !important;
}

.el-dropdown-menu__item--divided {
  border-top-color: #374151 !important;
}

.logout-item {
  color: #ef4444 !important;
}

.logout-item:hover {
  background-color: rgba(239, 68, 68, 0.1) !important;
}

/* 抽屉背景覆盖 */
.el-drawer {
  background-color: #111827 !important;
}
</style>