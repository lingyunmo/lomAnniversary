<template>
  <div class="announcement-wrapper">
    <div class="header-tip">
      <div class="icon-box">
        <Megaphone :size="20" />
      </div>
      <div class="text-info">
        <h3>发布新公告</h3>
        <p>此消息将推送到首页悬浮公告栏，支持 HTML 格式。</p>
      </div>
    </div>

    <div class="input-area">
      <textarea
          v-model="newAnnouncement"
          placeholder="在此输入公告内容... (例如: <strong>重要通知</strong> 服务器将于今晚维护)"
          class="custom-textarea"
          :class="{ 'has-content': newAnnouncement.length > 0 }"
      ></textarea>

      <div class="char-count">{{ newAnnouncement.length }} 字符</div>
    </div>

    <div class="action-bar">
      <button
          @click="updateAnnouncement"
          class="publish-btn"
          :disabled="loading || !newAnnouncement.trim()"
      >
        <span v-if="loading" class="btn-content">
          <Loader2 :size="18" class="spin" /> 发布中...
        </span>
        <span v-else class="btn-content">
          <Send :size="18" /> 立即发布
        </span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../../api/api.js';
import { Megaphone, Send, Loader2 } from 'lucide-vue-next';
import { ElMessage } from 'element-plus';

const newAnnouncement = ref('');
const loading = ref(false);

const updateAnnouncement = async () => {
  if (!newAnnouncement.value.trim()) return;

  loading.value = true;
  try {
    await api.post('/announcements', { content: newAnnouncement.value });

    ElMessage.success({
      message: '公告发布成功！首页已同步更新。',
      type: 'success',
      duration: 3000
    });

    newAnnouncement.value = ''; // 清空输入框
  } catch (error) {
    console.error('更新公告失败:', error);
    ElMessage.error('发布失败，请检查网络或权限。');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.announcement-wrapper {
  /* 移除背景色，直接利用父级的玻璃背景 */
  max-width: 800px;
  margin: 0 auto;
  padding: 10px;
}

/* 1. 头部提示区 */
.header-tip {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(249, 115, 22, 0.1); /* 橙色微光背景 */
  border: 1px solid rgba(249, 115, 22, 0.2);
  border-radius: 12px;
}

.icon-box {
  width: 40px;
  height: 40px;
  background: rgba(249, 115, 22, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #f97316;
}

.text-info h3 {
  margin: 0 0 4px 0;
  font-size: 16px;
  color: #fff;
}

.text-info p {
  margin: 0;
  font-size: 13px;
  color: #9ca3af;
}

/* 2. 输入框区域 */
.input-area {
  position: relative;
  margin-bottom: 24px;
}

.custom-textarea {
  width: 100%;
  height: 200px;
  padding: 20px;
  background-color: rgba(0, 0, 0, 0.2); /* 更深的半透明黑 */
  border: 2px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  color: #e5e7eb;
  font-size: 15px;
  line-height: 1.6;
  resize: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  font-family: 'JetBrains Mono', Consolas, monospace; /* 代码风格字体 */
}

/* 聚焦状态：橙色光晕 */
.custom-textarea:focus {
  outline: none;
  border-color: #f97316;
  background-color: rgba(0, 0, 0, 0.4);
  box-shadow: 0 0 20px rgba(249, 115, 22, 0.15);
}

.custom-textarea::placeholder {
  color: #4b5563;
}

.char-count {
  position: absolute;
  bottom: 16px;
  right: 16px;
  font-size: 12px;
  color: #4b5563;
  pointer-events: none;
}

/* 3. 按钮区域 */
.action-bar {
  display: flex;
  justify-content: flex-end;
}

.publish-btn {
  padding: 12px 32px;
  background: linear-gradient(135deg, #f97316, #ea580c); /* 橙色渐变 */
  color: white;
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.3s;
  box-shadow: 0 4px 15px rgba(249, 115, 22, 0.3);
  opacity: 1;
}

.publish-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(249, 115, 22, 0.5);
  filter: brightness(1.1);
}

.publish-btn:active:not(:disabled) {
  transform: scale(0.98);
}

.publish-btn:disabled {
  background: #374151;
  color: #9ca3af;
  cursor: not-allowed;
  box-shadow: none;
  opacity: 0.7;
}

.btn-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>