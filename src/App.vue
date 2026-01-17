<template>
  <div id="app">
    <Navbar/>
    <div class="content-wrapper">
      <router-view/>
    </div>
    <Foot/>
  </div>
</template>

<script setup>
import Navbar from "./components/Navbar.vue";
import Foot from "./components/Foot.vue";
</script>

<style scoped>
/* 整体布局 */
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #202123; /* ChatGPT 深色背景 */
  color: #d1d5db; /* 浅灰色文本 */
}

/* 修正内容区 */
.content-wrapper {
  flex: 1;
  padding: 20px;
  background-color: #343541; /* ChatGPT 风格背景 */
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
</style>
