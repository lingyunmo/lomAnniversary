<template>
  <div id="app">
    <Navbar />

    <main class="main-content">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <Foot />
  </div>
</template>

<script setup>
import Navbar from "./components/Navbar.vue";
import Foot from "./components/Footer.vue"; // 👈 注意：刚才我们改名叫 Footer.vue 了吗？确认文件名
</script>

<style>
/* 注意：这里去掉了 scoped
  因为我们需要设置全局的 body 背景色，scoped 无法影响 body
*/

/* 1. 全局重置：确保背景色统一为深邃黑 */
body {
  margin: 0;
  padding: 0;
  background-color: #0f1115; /* 与 Navbar/Footer/Login 统一 */
  color: #ffffff;
  font-family: 'Helvetica Neue', Helvetica, 'PingFang SC', 'Microsoft YaHei', Arial, sans-serif;
  -webkit-font-smoothing: antialiased; /* 让字体在 Mac 上更清晰 */
}

/* 2. 布局容器：实现 Sticky Footer (页脚沉底) */
#app {
  min-height: 100vh; /* 至少占满一屏高度 */
  display: flex;
  flex-direction: column;
}

/* 3. 中间内容区：自动占据剩余空间 */
.main-content {
  flex: 1; /* 关键：这会让内容区自动撑开，把 footer 挤到底部 */
  position: relative;
  width: 100%;
}

/* 4. 页面切换淡入淡出动效 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>