<template>
  <div class="user-admin-wrapper">
    <div class="header-action">
      <div class="left-panel">
        <div class="search-box">
          <Search :size="16" class="search-icon" />
          <input
              v-model="searchQuery"
              placeholder="搜索用户名..."
              class="search-input"
          />
        </div>
      </div>
      <button class="create-btn" @click="openCreateDialog">
        <UserPlus :size="18" /> 新增成员
      </button>
    </div>

    <div class="table-container">
      <el-table
          :data="filteredUsers"
          style="width: 100%"
          :row-class-name="tableRowClassName"
          empty-text="暂无用户数据"
      >
        <el-table-column prop="id" label="ID" width="80" align="center" />

        <el-table-column label="用户" min-width="180">
          <template #default="scope">
            <div class="user-cell">
              <div class="avatar-placeholder">{{ scope.row.username.charAt(0).toUpperCase() }}</div>
              <span class="username-text">{{ scope.row.username }}</span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="资产信息" min-width="160">
          <template #default="scope">
            <div class="asset-info">
              <span class="asset-tag score">
                <Coins :size="12" /> {{ scope.row.score }}
              </span>
              <span class="asset-tag ticket">
                <Ticket :size="12" /> {{ scope.row.enable }}
              </span>
            </div>
          </template>
        </el-table-column>

        <el-table-column label="状态" width="150" align="center">
          <template #default="scope">
            <el-tag v-if="scope.row.is_admin" type="warning" size="small" effect="dark">管理员</el-tag>
            <el-tag v-else type="info" size="small" effect="dark">普通用户</el-tag>
            <el-tag v-if="scope.row.need_reset_pwd" type="danger" size="small" style="margin-left: 5px;">需重置密码</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="180" align="right">
          <template #default="scope">
            <button class="icon-btn edit" @click="openEditDialog(scope.row)" title="编辑用户">
              <Edit3 :size="16" />
            </button>

            <el-popconfirm
                title="确定要删除此用户吗？数据无法恢复。"
                confirm-button-text="删除"
                cancel-button-text="取消"
                confirm-button-type="danger"
                @confirm="deleteUser(scope.row.id)"
            >
              <template #reference>
                <button class="icon-btn delete" title="删除用户">
                  <Trash2 :size="16" />
                </button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog
        v-model="showDialog"
        :title="dialogType === 'create' ? '👤 新增用户' : '🛠️ 编辑用户'"
        width="450px"
        class="custom-dialog"
    >
      <form @submit.prevent="handleSubmit" class="user-form">
        <div class="form-item">
          <label>用户名</label>
          <input
              v-model="form.username"
              placeholder="请输入用户名"
              :disabled="dialogType === 'edit'"
              required
          />
        </div>

        <div class="form-item" v-if="dialogType === 'create'">
          <label>初始密码</label>
          <input v-model="form.password" type="password" placeholder="设置初始密码" required />
        </div>

        <div class="form-row" v-if="dialogType === 'edit'">
          <div class="form-item">
            <label>积分 (Score)</label>
            <input v-model.number="form.score" type="number" />
          </div>
          <div class="form-item">
            <label>抽奖次数</label>
            <input v-model.number="form.enable" type="number" />
          </div>
        </div>

        <div class="form-switches" v-if="dialogType === 'edit'">
          <div class="switch-item">
            <span>强制重置密码</span>
            <el-switch v-model="form.need_reset_pwd" :active-value="1" :inactive-value="0" />
          </div>
        </div>

        <div class="dialog-footer">
          <button type="button" class="cancel-btn" @click="showDialog = false">取消</button>
          <button type="submit" class="submit-btn" :disabled="loading">
            <span v-if="loading"><Loader2 :size="16" class="spin" /> 保存中...</span>
            <span v-else>确认保存</span>
          </button>
        </div>
      </form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from "../../api/api.js";
import { UserPlus, Search, Edit3, Trash2, Coins, Ticket, Loader2 } from 'lucide-vue-next';
import { ElMessage } from 'element-plus';

const users = ref([]);
const searchQuery = ref('');
const showDialog = ref(false);
const dialogType = ref('create'); // 'create' | 'edit'
const loading = ref(false);

const form = ref({
  id: '',
  username: '',
  password: '',
  score: 0,
  enable: 0,
  need_reset_pwd: 0,
  is_admin: 0
});

// 获取用户列表
const fetchUsers = async () => {
  try {
    const response = await api.get('/users');
    users.value = response.data;
  } catch (error) {
    ElMessage.error('用户列表加载失败');
  }
};

// 过滤用户
const filteredUsers = computed(() => {
  if (!searchQuery.value) return users.value;
  return users.value.filter(u =>
      u.username.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

// 打开创建弹窗
const openCreateDialog = () => {
  dialogType.value = 'create';
  form.value = { username: '', password: '', score: 0, enable: 0 };
  showDialog.value = true;
};

// 打开编辑弹窗
const openEditDialog = (user) => {
  dialogType.value = 'edit';
  // 浅拷贝数据
  form.value = { ...user };
  showDialog.value = true;
};

// 提交表单
const handleSubmit = async () => {
  loading.value = true;
  try {
    if (dialogType.value === 'create') {
      await api.post('/users', {
        username: form.value.username,
        password: form.value.password
      });
      ElMessage.success('用户创建成功');
    } else {
      await api.put(`/users/${form.value.id}`, {
        username: form.value.username,
        score: form.value.score,
        enable: form.value.enable,
        need_reset_pwd: form.value.need_reset_pwd, // 如果API支持
        // is_admin: form.value.is_admin
      });
      ElMessage.success('用户信息已更新');
    }
    await fetchUsers();
    showDialog.value = false;
  } catch (error) {
    ElMessage.error('操作失败');
    console.error(error);
  } finally {
    loading.value = false;
  }
};

const deleteUser = async (id) => {
  try {
    await api.delete(`/users/${id}`);
    ElMessage.success('用户已删除');
    await fetchUsers();
  } catch (error) {
    ElMessage.error('删除失败');
  }
};

onMounted(fetchUsers);
</script>

<style scoped>
.user-admin-wrapper {
  max-width: 1000px;
  margin: 0 auto;
}

/* 头部操作栏 */
.header-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.search-box {
  position: relative;
  width: 280px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
}

.search-input {
  width: 100%;
  padding: 10px 12px 10px 36px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  color: #fff;
  font-size: 14px;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.1);
  border-color: #3b82f6;
}

.create-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 10px 20px;
  background: #10b981; /* 绿色按钮代表新增 */
  color: #fff;
  border: none; border-radius: 8px;
  font-weight: 600; cursor: pointer;
  transition: all 0.2s;
}
.create-btn:hover { background: #059669; transform: translateY(-2px); }

/* 表格容器 */
.table-container {
  background: rgba(30, 32, 38, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  overflow: hidden;
}

/* Element Table 深度定制 (透明深色风格) */
:deep(.el-table) {
  --el-table-bg-color: transparent;
  --el-table-tr-bg-color: transparent;
  --el-table-header-bg-color: rgba(0, 0, 0, 0.2);
  --el-table-border-color: rgba(255, 255, 255, 0.05);
  --el-table-text-color: #d1d5db;
  --el-table-header-text-color: #9ca3af;
  --el-table-row-hover-bg-color: rgba(255, 255, 255, 0.05);
}

:deep(.el-table th.el-table__cell) {
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

:deep(.el-table td.el-table__cell) {
  border-bottom: 1px solid rgba(255, 255, 255, 0.03);
}

/* 用户列 */
.user-cell { display: flex; align-items: center; gap: 10px; }
.avatar-placeholder {
  width: 32px; height: 32px; border-radius: 50%;
  background: linear-gradient(135deg, #6366f1, #a855f7);
  display: flex; align-items: center; justify-content: center;
  font-weight: 700; color: #fff; font-size: 14px;
}
.username-text { font-weight: 500; color: #fff; }

/* 资产列 */
.asset-info { display: flex; gap: 8px; }
.asset-tag {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 2px 8px; border-radius: 4px; font-size: 12px; font-family: monospace;
}
.asset-tag.score { background: rgba(251, 191, 36, 0.1); color: #fbbf24; }
.asset-tag.ticket { background: rgba(59, 130, 246, 0.1); color: #60a5fa; }

/* 操作列 */
.icon-btn {
  background: transparent; border: none; padding: 6px; cursor: pointer;
  border-radius: 4px; transition: all 0.2s; margin-left: 4px;
}
.icon-btn.edit { color: #60a5fa; }
.icon-btn.edit:hover { background: rgba(59, 130, 246, 0.1); }
.icon-btn.delete { color: #ef4444; }
.icon-btn.delete:hover { background: rgba(239, 68, 68, 0.1); }

/* 表单样式 (复用 ActivitiesAdmin) */
.user-form { display: flex; flex-direction: column; gap: 16px; padding: 10px 0; }
.form-row { display: flex; gap: 16px; }
.form-item { flex: 1; display: flex; flex-direction: column; gap: 6px; }
.form-switches { display: flex; gap: 20px; background: rgba(0,0,0,0.2); padding: 12px; border-radius: 8px; }
.switch-item { display: flex; align-items: center; gap: 10px; font-size: 13px; color: #d1d5db; }

label { font-size: 13px; color: #9ca3af; }
input {
  background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px; padding: 10px; color: #fff; font-size: 14px;
}
input:disabled { opacity: 0.5; cursor: not-allowed; }
input:focus { border-color: #3b82f6; outline: none; background: rgba(0,0,0,0.4); }

.dialog-footer { display: flex; justify-content: flex-end; gap: 12px; margin-top: 10px; }
.cancel-btn { background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #d1d5db; padding: 8px 16px; border-radius: 6px; cursor: pointer; }
.submit-btn { background: #3b82f6; border: none; color: #fff; padding: 8px 20px; border-radius: 6px; cursor: pointer; display: flex; align-items: center; gap: 6px; }
.submit-btn:disabled { opacity: 0.7; }
.spin { animation: spin 1s linear infinite; }
</style>