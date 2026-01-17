<template>
  <div class="admin-container">
    <h1>🔧 管理后台</h1>
    <!-- 引入公告管理模块 -->
    <AnnouncementAdmin />

    <ActivitiesAdmin />

    <!-- 引入 UserAdmin 组件 -->
    <UserAdmin />
  </div>
</template>

<script setup>
import ActivitiesAdmin from './ActivitiesAdmin.vue';
import UserAdmin from './UserAdmin.vue';  // 引入 UserAdmin 组件
import AnnouncementAdmin from './AnnouncementAdmin.vue'; // 引入新的公告管理组件
</script>

<style scoped>
.admin-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  background-color: #121212;
  color: #e0e0e0;
  border-radius: 8px;
}

h1, h2 {
  color: #e0e0e0;
  margin-bottom: 1.5rem;
}

h1 {
  font-size: 2.5rem;
}

h2 {
  font-size: 2rem;
}
</style>