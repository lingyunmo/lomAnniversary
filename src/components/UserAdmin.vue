<template>
  <section class="user-management">
    <h2>👤 用户管理</h2>
    <div class="add-user-container">
      <button @click="showCreateDialog = true" class="add-user-btn">➕ 新增用户</button>
    </div>

    <table>
      <thead>
      <tr>
        <th>ID</th>
        <th>用户名</th>
        <th>积分</th>
        <th>抽奖次数</th>
        <th>需要重置密码</th>
        <th>管理员</th>
        <th>操作</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="user in users" :key="user.id">
        <td>{{ user.id }}</td>
        <td>{{ user.username }}</td>
        <td><input type="number" v-model.number="user.score" class="user-score-input"></td>
        <td><input type="number" v-model.number="user.enable" class="user-enable-input"></td>
        <td>{{ user.need_reset_pwd === 1 ? '是 ✅' : '否 ❌' }}</td>
        <td>{{ user.is_admin === 1 ? '是 ✅' : '否 ❌' }}</td>
        <td>
          <button @click="updateUser(user)" class="save-btn">💾 保存</button>
          <button @click="deleteUser(user.id)" class="delete-btn">🗑️ 删除</button>
        </td>
      </tr>
      </tbody>
    </table>
  </section>

  <!-- 新建用户弹窗 -->
  <div v-if="showCreateDialog" class="dialog-overlay">
    <div class="dialog">
      <h3>🆕 新建用户</h3>
      <div class="form-group">
        <label>用户名：</label>
        <input v-model="newUser.username" placeholder="请输入用户名" class="input-field">
      </div>
      <div class="form-group">
        <label>初始密码：</label>
        <input v-model="newUser.password" type="password" placeholder="请输入密码" class="input-field">
      </div>
      <div class="button-group">
        <button @click="createUser" class="create-btn">创建</button>
        <button @click="showCreateDialog = false" class="cancel-btn">取消</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import api from '../api/api.js';

const showCreateDialog = ref(false);
const newUser = ref({ username: '', password: '' });
const users = ref([]);

// 获取用户列表
const fetchUsers = async () => {
  try {
    const response = await api.get('/users');
    users.value = response.data;
  } catch (error) {
    console.error('获取用户失败:', error);
  }
};

// 更新用户信息
const updateUser = async (user) => {
  try {
    await api.put(`/users/${user.id}`, {
      username: user.username,
      score: user.score,
      enable: user.enable
    });
    alert('用户信息更新成功');
  } catch (error) {
    console.error('更新用户信息失败:', error);
    alert('更新用户信息失败');
  }
};

// 删除用户
const deleteUser = async (userId) => {
  try {
    await api.delete(`/users/${userId}`);
    alert('用户删除成功');
    await fetchUsers(); // 刷新用户列表
  } catch (error) {
    console.error('删除用户失败:', error);
    alert('删除用户失败');
  }
};

// 创建新用户
const createUser = async () => {
  try {
    await api.post('/users', {
      username: newUser.value.username,
      password: newUser.value.password
    });
    alert('用户创建成功');
    await fetchUsers(); // 刷新用户列表
    showCreateDialog.value = false;
  } catch (error) {
    console.error('创建用户失败:', error);
    alert('创建用户失败');
  }
};

// 页面加载时获取用户列表
fetchUsers();
</script>

<style scoped>
.user-management {
  margin-bottom: 2rem;
  background-color: #121212;
  color: #e0e0e0;
  border-radius: 8px;
  padding: 20px;
}

h2 {
  margin-bottom: 1.5rem;
  font-size: 2rem;
  color: #1DB954;
  text-align: center;
}

.add-user-container {
  text-align: center;
  margin-bottom: 20px;
}

.add-user-btn {
  padding: 10px 20px;
  background-color: #1DB954;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
}

.add-user-btn:hover {
  background-color: #1ed760;
}

table {
  width: 100%;
  border-collapse: collapse;
  background-color: #2c2c2c;
  color: #e0e0e0;
}

th, td {
  padding: 12px;
  border: 1px solid #444;
  text-align: center; /* 居中显示 */
}

th {
  background-color: #212121;
  color: #1DB954;
}

td {
  background-color: #333;
}

input[type="number"], input[type="text"], input[type="password"] {
  padding: 8px;
  border: 1px solid #555;
  border-radius: 4px;
  width: 100%;
  max-width: 220px;
  background-color: #121212;
  color: #e0e0e0;
}

input[type="number"]:focus, input[type="text"]:focus, input[type="password"]:focus {
  border-color: #1DB954;
}

button {
  padding: 8px 16px;
  margin: 4px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

button:hover {
  opacity: 0.9;
}

.save-btn {
  background-color: #3498db;
  color: white;
}

.save-btn:hover {
  background-color: #2980b9;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
}

.delete-btn:hover {
  background-color: #c0392b;
}

.dialog-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
}

.dialog {
  background: #2c2c2c;
  padding: 2rem;
  border-radius: 8px;
  width: 400px;
  color: #e0e0e0;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #555;
  border-radius: 4px;
  background-color: #121212;
  color: #e0e0e0;
}

.input-field:focus {
  border-color: #1DB954;
}

.button-group {
  margin-top: 1rem;
  text-align: right;
}

.button-group button {
  margin-left: 0.5rem;
}

.create-btn {
  background-color: #1DB954;
  color: white;
}

.create-btn:hover {
  background-color: #1ed760;
}

.cancel-btn {
  background-color: #e74c3c;
  color: white;
}

.cancel-btn:hover {
  background-color: #c0392b;
}
</style>
