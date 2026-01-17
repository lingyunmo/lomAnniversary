<template>
  <div class="activities-wrapper">
    <div class="header-action">
      <div class="left-tip">
        <h3>📅 活动列表</h3>
        <p>管理全服活动的时间安排与详情展示。</p>
      </div>
      <button class="create-btn" @click="openModal('create')">
        <Plus :size="18" /> 创建新活动
      </button>
    </div>

    <div v-if="activities.length === 0" class="empty-state">
      <CalendarOff :size="48" class="empty-icon" />
      <p>暂无活动，快去创建一个吧！</p>
    </div>

    <div v-else class="activity-grid">
      <div
          v-for="activity in activities"
          :key="activity.id"
          class="activity-card"
          :class="getStatusClass(activity)"
      >
        <div class="card-top">
          <div class="status-badge">
            {{ getStatusText(activity) }}
          </div>
          <div class="action-menu">
            <button class="icon-btn edit" @click="openModal('edit', activity)" title="编辑">
              <Edit2 :size="16" />
            </button>
            <el-popconfirm
                title="确定要删除这个活动吗？此操作无法撤销。"
                confirm-button-text="删除"
                cancel-button-text="取消"
                confirm-button-type="danger"
                @confirm="deleteActivity(activity.id)"
            >
              <template #reference>
                <button class="icon-btn delete" title="删除">
                  <Trash2 :size="16" />
                </button>
              </template>
            </el-popconfirm>
          </div>
        </div>

        <h4 class="activity-name">{{ activity.name }}</h4>

        <div class="time-range">
          <div class="time-item">
            <span class="label">开始</span>
            <span class="value">{{ formatTime(activity.start_time) }}</span>
          </div>
          <div class="time-arrow">➜</div>
          <div class="time-item">
            <span class="label">结束</span>
            <span class="value">{{ formatTime(activity.end_time) }}</span>
          </div>
        </div>

        <div class="desc-preview">
          {{ activity.description }}
        </div>
      </div>
    </div>

    <el-dialog
        v-model="showModal"
        :title="modalType === 'create' ? '✨ 创建新活动' : '✏️ 编辑活动'"
        width="500px"
        class="custom-dialog"
        :close-on-click-modal="false"
    >
      <form @submit.prevent="handleFormSubmit" class="activity-form">
        <div class="form-item">
          <label>活动名称</label>
          <input v-model="form.name" placeholder="例如：11周年庆跑酷大赛" required />
        </div>

        <div class="form-row">
          <div class="form-item">
            <label>开始时间</label>
            <input type="datetime-local" v-model="form.start_time" required />
          </div>
          <div class="form-item">
            <label>结束时间</label>
            <input type="datetime-local" v-model="form.end_time" required />
          </div>
        </div>

        <div class="form-item">
          <label>活动详情 (支持 HTML)</label>
          <textarea
              v-model="form.description"
              placeholder="描述活动规则、奖励等..."
              rows="5"
              required
          ></textarea>
        </div>

        <div class="dialog-footer">
          <button type="button" class="cancel-btn" @click="closeModal">取消</button>
          <button type="submit" class="submit-btn" :disabled="loading">
            <span v-if="loading"><Loader2 :size="16" class="spin" /> 提交中...</span>
            <span v-else>{{ modalType === 'create' ? '确认创建' : '保存修改' }}</span>
          </button>
        </div>
      </form>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from "../../api/api.js";
import { Plus, Edit2, Trash2, CalendarOff, Loader2 } from 'lucide-vue-next';
import { ElMessage, ElPopconfirm, ElDialog } from 'element-plus';

const activities = ref([]);
const showModal = ref(false);
const modalType = ref('');
const loading = ref(false);

const form = ref({
  id: '',
  name: '',
  start_time: '',
  end_time: '',
  description: ''
});

// 获取活动列表
const fetchActivities = async () => {
  try {
    const res = await api.get('/activities');
    activities.value = res.data.sort((a, b) => new Date(b.start_time) - new Date(a.start_time));
  } catch (error) {
    ElMessage.error('活动列表加载失败');
  }
};

const openModal = (type, activity = null) => {
  modalType.value = type;
  if (type === 'edit' && activity) {
    // 转换时间格式适配 datetime-local input (yyyy-MM-ddTHH:mm)
    form.value = {
      ...activity,
      start_time: formatToLocalInput(activity.start_time),
      end_time: formatToLocalInput(activity.end_time)
    };
  } else {
    form.value = { id: '', name: '', start_time: '', end_time: '', description: '' };
  }
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  loading.value = false;
};

const handleFormSubmit = async () => {
  loading.value = true;
  try {
    // 转换回 ISO 字符串 (可选，视后端需求而定)
    const payload = {
      ...form.value,
      start_time: new Date(form.value.start_time).toISOString(),
      end_time: new Date(form.value.end_time).toISOString()
    }

    if (modalType.value === 'create') {
      await api.post('/activities', payload);
      ElMessage.success('活动创建成功');
    } else {
      await api.put(`/activities/${form.value.id}`, payload);
      ElMessage.success('活动已更新');
    }
    await fetchActivities();
    closeModal();
  } catch (error) {
    ElMessage.error('操作失败，请检查输入');
  } finally {
    loading.value = false;
  }
};

const deleteActivity = async (id) => {
  try {
    await api.delete(`/activities/${id}`);
    ElMessage.success('活动已删除');
    await fetchActivities();
  } catch (error) {
    ElMessage.error('删除失败');
  }
};

// 工具函数
const formatTime = (ts) => new Date(ts).toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' });
const formatToLocalInput = (ts) => {
  const d = new Date(ts);
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 16);
};

const getStatusText = (act) => {
  const now = new Date();
  if (now < new Date(act.start_time)) return '即将开始';
  if (now > new Date(act.end_time)) return '已结束';
  return '进行中';
};

const getStatusClass = (act) => {
  const now = new Date();
  if (now < new Date(act.start_time)) return 'status-upcoming';
  if (now > new Date(act.end_time)) return 'status-ended';
  return 'status-ongoing';
};

onMounted(fetchActivities);
</script>

<style scoped>
.activities-wrapper {
  max-width: 1000px;
  margin: 0 auto;
}

/* 头部操作栏 */
.header-action {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.left-tip h3 { margin: 0 0 4px 0; color: #fff; font-size: 16px; }
.left-tip p { margin: 0; color: #9ca3af; font-size: 13px; }

.create-btn {
  display: flex; align-items: center; gap: 6px;
  padding: 10px 20px;
  background: #f97316;
  color: #fff;
  border: none; border-radius: 8px;
  font-weight: 600; cursor: pointer;
  transition: all 0.2s;
}
.create-btn:hover { background: #ea580c; transform: translateY(-2px); }

/* 卡片网格 */
.activity-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

/* 卡片样式 */
.activity-card {
  background: rgba(30, 32, 38, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  padding: 20px;
  transition: all 0.3s;
  position: relative;
  overflow: hidden;
}

.activity-card:hover {
  transform: translateY(-4px);
  background: rgba(30, 32, 38, 0.8);
  border-color: rgba(255, 255, 255, 0.15);
  box-shadow: 0 10px 30px rgba(0,0,0,0.3);
}

/* 状态颜色边框 */
.status-ongoing { border-left: 4px solid #10b981; }
.status-upcoming { border-left: 4px solid #3b82f6; }
.status-ended { border-left: 4px solid #6b7280; opacity: 0.8; }

.card-top {
  display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;
}

.status-badge {
  font-size: 12px; padding: 4px 10px; border-radius: 20px; font-weight: 600;
}
.status-ongoing .status-badge { background: rgba(16, 185, 129, 0.2); color: #10b981; }
.status-upcoming .status-badge { background: rgba(59, 130, 246, 0.2); color: #3b82f6; }
.status-ended .status-badge { background: rgba(107, 114, 128, 0.2); color: #9ca3af; }

.action-menu { display: flex; gap: 8px; }
.icon-btn {
  background: transparent; border: none; color: #6b7280; cursor: pointer; padding: 4px; transition: color 0.2s;
}
.icon-btn.edit:hover { color: #3b82f6; }
.icon-btn.delete:hover { color: #ef4444; }

.activity-name {
  margin: 0 0 16px 0; font-size: 18px; font-weight: 700; color: #fff;
}

.time-range {
  display: flex; align-items: center; justify-content: space-between;
  background: rgba(0,0,0,0.2); padding: 10px; border-radius: 8px; margin-bottom: 16px;
}

.time-item { display: flex; flex-direction: column; gap: 2px; }
.time-item .label { font-size: 10px; color: #6b7280; text-transform: uppercase; }
.time-item .value { font-size: 13px; color: #d1d5db; font-family: monospace; }
.time-arrow { color: #4b5563; font-size: 12px; }

.desc-preview {
  font-size: 13px; color: #9ca3af;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;
  line-height: 1.5;
}

/* 空状态 */
.empty-state {
  text-align: center; padding: 60px 0; color: #6b7280;
}
.empty-icon { margin-bottom: 16px; opacity: 0.5; }

/* 表单样式 (复用之前的公告样式) */
.activity-form { display: flex; flex-direction: column; gap: 16px; padding: 10px 0; }
.form-row { display: flex; gap: 16px; }
.form-item { flex: 1; display: flex; flex-direction: column; gap: 6px; }

label { font-size: 13px; color: #9ca3af; }
input, textarea {
  background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.1);
  border-radius: 8px; padding: 10px; color: #fff; font-size: 14px;
}
input:focus, textarea:focus { border-color: #f97316; outline: none; background: rgba(0,0,0,0.4); }

.dialog-footer {
  display: flex; justify-content: flex-end; gap: 12px; margin-top: 10px;
}
.cancel-btn {
  background: transparent; border: 1px solid rgba(255,255,255,0.2); color: #d1d5db;
  padding: 8px 16px; border-radius: 6px; cursor: pointer;
}
.submit-btn {
  background: #f97316; border: none; color: #fff;
  padding: 8px 20px; border-radius: 6px; cursor: pointer;
  display: flex; align-items: center; gap: 6px;
}
.submit-btn:disabled { opacity: 0.7; cursor: not-allowed; }
.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>

<style>
/* 强制覆盖 Element Dialog 深色模式 */
.custom-dialog {
  background: #1f2937 !important;
  border: 1px solid #374151;
  border-radius: 16px !important;
}
.custom-dialog .el-dialog__header span { color: #fff; }
.custom-dialog .el-dialog__body { padding-top: 10px !important; }
</style>