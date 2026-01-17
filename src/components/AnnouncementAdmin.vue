<template>
  <section class="announcement-management">
    <h2>📢 公告管理</h2>
    <textarea v-model="newAnnouncement" placeholder="请输入公告内容..." class="announcement-textarea"></textarea>
    <button @click="updateAnnouncement" class="update-announcement-btn">📝 更新公告</button>
  </section>
</template>

<script setup>
import { ref } from 'vue';
import api from '../api/api.js'; // 引入封装好的 API 模块

const newAnnouncement = ref('');

// 更新公告
const updateAnnouncement = async () => {
  try {
    await api.post('/announcements', { content: newAnnouncement.value });
    alert('公告更新成功');
    newAnnouncement.value = ''; // 清空输入框
  } catch (error) {
    console.error('更新公告失败:', error);
    alert('更新公告失败');
  }
};
</script>

<style scoped>
.announcement-management {
  display: flex;
  flex-direction: column;
  align-items: center;  /* 居中对齐内容 */
  justify-content: center;  /* 垂直居中 */
  max-width: 1400px;
  margin: 0 auto 2rem;  /* 水平居中并设置底部间距 */
  padding: 1rem;
  background-color: #121212;
  border-radius: 8px;
}

h2 {
  color: #00d9ff;
  font-size: 1.5rem;  /* 调整字体大小 */
  margin-bottom: 1rem;
  text-align: center;
}

.announcement-textarea {
  width: 100%;
  height: 150px;
  padding: 0.8rem;
  margin-bottom: 1rem;
  border: 1px solid #555;
  border-radius: 6px;
  background-color: #333;
  color: #e0e0e0;
  resize: none;
}

.announcement-textarea:focus {
  border-color: #1DB954;
}

.update-announcement-btn {
  padding: 8px 16px;  /* 调整按钮内边距 */
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;  /* 调整按钮字体大小 */
  margin-top: 1rem;
}

.update-announcement-btn:hover {
  background-color: #2980b9;
  opacity: 0.9;
}
</style>