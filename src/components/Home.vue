<template>
  <div class="dashboard-container">
    <Announcement />
    <Activities />

    <div class="split-section-wrapper">
      <div class="columns">

        <div class="col-left">
          <Leaderboard />
        </div>

        <div class="col-right">
          <Lottery
              v-if="currentUser.username"
              :currentUser="currentUser"
          />

          <LoginGuide v-else />
        </div>

      </div>
    </div>

    <Reward />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import Announcement from './Announcement.vue'
import Activities from './Activities.vue'
import Leaderboard from './Leaderboard.vue'
import Lottery from './Lottery.vue'
import Reward from "./Reward.vue"
import LoginGuide from "./LoginGuide.vue";

const store = useStore()

const currentUser = computed(() => ({
  username: store.getters.username,
  score: store.getters.score,
  enable: store.getters.enable
}))
</script>

<style scoped>
.dashboard-container {
  /* ❌ 删除了 display: flex 和 gap: 40px
     原因：Flex gap 很难精确控制 3D 元素和平面元素之间的视觉距离。
     改用自然文档流堆叠。
  */
  position: relative;
  padding-bottom: 60px;
}

/* 包装器：核心对齐容器 */
.split-section-wrapper {
  width: 100%;
  max-width: 1400px;
  margin: 0 auto; /* 水平居中 */
  padding: 0 20px;

  /* ✨ 核心修复：使用 margin-top 调整距离。
     如果觉得离得太远，可以设为负值（例如 -40px），
     因为 3D 轮播底部通常有很多“透视留白”，用负边距可以让排行榜“插入”那个留白区。
  */
  margin-top: 0px;
  position: relative;
  z-index: 2; /* 确保在层级上高于背景光晕 */
}

.columns {
  display: flex;
  gap: 24px;
  align-items: flex-start;
}

/* 左侧排行榜 */
.col-left {
  flex: 1;
  min-width: 0;
}

/* 右侧抽奖 */
.col-right {
  width: 480px; /* 稍微调窄一点点，留给排行榜更多空间 */
  flex-shrink: 0;
}

/* 📱 响应式适配 */
@media (max-width: 900px) {
  .columns {
    flex-direction: column;
  }

  .col-right {
    width: 100%;
    margin-top: 24px; /* 手机端增加一点间距 */
  }

  .split-section-wrapper {
    margin-top: 20px; /* 手机端 3D 效果不明显，恢复正边距 */
  }
}
</style>