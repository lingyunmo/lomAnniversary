<template>
  <div class="home-container">
    <Announcement />
    <Activities />

    <div class="columns">
      <Leaderboard />
      <!-- 仅在用户登录时渲染 Lottery -->
      <Lottery v-if="currentUser.username" :currentUser="currentUser" />
    </div>
    <Reward/>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'  // 导入 useStore
import Announcement from './Announcement.vue'
import Activities from './Activities.vue'
import Leaderboard from './Leaderboard.vue'
import Lottery from './Lottery.vue'
import Reward from "./Reward.vue";

// 获取 Vuex store 实例
const store = useStore()

// 从 Vuex 获取当前用户信息
const currentUser = computed(() => {
  return {
    username: store.getters.username,
    score: store.getters.score,
    enable: store.getters.enable
  }
})
</script>

<style scoped>
.home-container {
  display: flex;
  flex-direction: column;
  gap: 1rem; /* 添加空隙 */
}

.columns {
  display: flex;
  gap: 1rem; /* 在水平排列的组件之间添加空隙 */
}
</style>