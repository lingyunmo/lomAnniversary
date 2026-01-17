<template>
  <div class="admin-container">
    <h2>🎉 活动管理</h2>
    <!-- Center the Add Activity button -->
    <button @click="openModal('create')" class="add-btn">➕ 添加活动</button>

    <!-- 活动列表 -->
    <div v-if="activities.length === 0" class="empty">📅 暂无活动</div>

    <div v-for="activity in activities" :key="activity.id" class="activity-card">
      <h3 @click="toggleCollapse(activity.id)" class="activity-title">{{ activity.name }} ⏳</h3>
      <div v-show="collapsed[activity.id]" class="activity-details">
        <p>{{ formatTime(activity.start_time) }} - {{ formatTime(activity.end_time) }}</p>
        <p>{{ activity.description }}</p>
        <div class="actions">
          <button @click="openModal('edit', activity)" class="action-btn">✏️ 编辑</button>
          <button @click="deleteActivity(activity.id)" class="action-btn">🗑️ 删除</button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h3>{{ modalType === 'create' ? '创建活动 🎉' : '编辑活动 ✏️' }}</h3>
        <form @submit.prevent="handleFormSubmit">
          <div class="form-group">
            <label>活动名称</label>
            <input v-model="form.name" required />
          </div>
          <div class="form-group">
            <label>开始时间</label>
            <input type="datetime-local" v-model="form.start_time" required />
          </div>
          <div class="form-group">
            <label>结束时间</label>
            <input type="datetime-local" v-model="form.end_time" required />
          </div>
          <div class="form-group">
            <label>活动描述</label>
            <textarea v-model="form.description" required></textarea>
          </div>
          <button type="submit">{{ modalType === 'create' ? '创建活动' : '更新活动' }}</button>
          <button type="button" @click="closeModal">关闭</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from "../api/api.js";  // 引入封装后的 api.js

const activities = ref([]);  // 存储活动列表
const showModal = ref(false); // 控制 modal 显示与隐藏
const modalType = ref('');    // 'create' 或 'edit'，用于区分是添加活动还是编辑活动
const form = ref({
  id: '',
  name: '',
  start_time: '',
  end_time: '',
  description: ''
});
const collapsed = ref({}); // 控制每个活动卡片的折叠状态

// 获取活动列表
const fetchActivities = async () => {
  try {
    const res = await api.get('/activities');  // 使用封装后的 API
    activities.value = res.data;
  } catch (error) {
    console.error('活动加载失败:', error);
  }
};

// 打开 modal（根据操作类型设置 modal 内容）
const openModal = (type, activity = null) => {
  modalType.value = type;
  if (type === 'edit' && activity) {
    form.value = { ...activity }; // 复制活动数据到表单
  } else {
    form.value = { id: '', name: '', start_time: '', end_time: '', description: '' }; // 重置表单
  }
  showModal.value = true;
};

// 关闭 modal
const closeModal = () => {
  showModal.value = false;
};

// 提交表单（添加或编辑活动）
const handleFormSubmit = async () => {
  try {
    if (modalType.value === 'create') {
      await api.post('/activities', form.value); // 创建活动
    } else if (modalType.value === 'edit') {
      await api.put(`/activities/${form.value.id}`, form.value); // 更新活动
    }
    await fetchActivities();  // 刷新活动列表
    closeModal();  // 关闭 modal
  } catch (error) {
    console.error('活动操作失败:', error);
  }
};

// 删除活动
const deleteActivity = async (id) => {
  try {
    await api.delete(`/activities/${id}`);  // 删除活动
    await fetchActivities();  // 刷新活动列表
  } catch (error) {
    console.error('删除活动失败:', error);
  }
};

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp);
  return date.toLocaleString();  // 格式化为本地时间字符串
};

// 切换折叠状态
const toggleCollapse = (id) => {
  collapsed.value[id] = !collapsed.value[id];
};

// 在组件挂载时加载活动数据
onMounted(fetchActivities);
</script>

<style scoped>
.admin-container {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background-color: #121212;
  color: #e0e0e0;
  border-radius: 12px;
}

h2 {
  text-align: center;
  color: #00d9ff;
  margin-bottom: 2rem;
  font-size: 1.8rem; /* 调整标题字体大小 */
}

/* Center the button */
.add-btn {
  display: block;
  margin: 1rem auto;
  background-color: #007bff;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px; /* 调整按钮字体大小 */
}

.add-btn:hover {
  background-color: #0056b3;
}

.empty {
  text-align: center;
  color: #888;
  font-size: 1.2rem;
}

.activity-card {
  margin: 1rem 0;
  padding: 1rem;
  background-color: #333;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: transform 0.3s ease;
}

.activity-card:hover {
  transform: scale(1.02);
}

.activity-title {
  font-size: 1.3rem; /* 调整活动标题的字体大小 */
  color: #00d9ff;
  cursor: pointer;
  text-align: center; /* Center-align the activity title */
}

.activity-details {
  margin-top: 1rem;
}

.actions {
  display: flex;
  justify-content: center;  /* Center the action buttons */
  align-items: center;
}

.action-btn {
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px; /* 调整操作按钮的字体大小 */
}

.action-btn:hover {
  background-color: #2980b9;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background-color: #2b2d33;
  padding: 2rem;
  border-radius: 12px;
  width: 450px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  color: #bbb;
  margin-bottom: 0.5rem;
}

input, textarea {
  width: 100%;
  padding: 0.8rem;
  border-radius: 8px;
  border: 1px solid #444;
  background-color: #333;
  color: white;
}

input[type="datetime-local"] {
  cursor: pointer;
}

button[type="submit"] {
  width: 100%;
  background-color: #00d9ff;
  padding: 0.75rem;
  border-radius: 8px;
  color: white;
  margin-top: 1rem;
}

button[type="submit"]:hover {
  background-color: #007bff;
}

button[type="button"] {
  width: 100%;
  background-color: #999;
  padding: 0.75rem;
  border-radius: 8px;
  color: white;
  margin-top: 0.5rem;
}

button[type="button"]:hover {
  background-color: #777;
}
</style>