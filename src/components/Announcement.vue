<template>
  <div :class="['announcement-container', { collapsed: isCollapsed }]">
    <!-- 收起/展开按钮 -->
    <button class="toggle-button" @click="toggleCollapse">
      {{ isCollapsed ? '▶' : '◀' }}
    </button>

    <section class="announcement">
      <h2>当前公告</h2>

      <div v-if="announcements.length === 0" class="content">暂无公告内容</div>
      <div v-else>
        <div class="content" v-html="currentAnnouncement.content"></div>
        <p class="timestamp">发布时间：{{ currentAnnouncement.created_at }}</p>

        <!-- 手动选择公告 -->
        <div class="controls">
          <button v-for="(item, index) in announcements"
                  :key="item.id"
                  @click="currentIndex = index"
                  :class="{ active: index === currentIndex }">
            公告 {{ index + 1 }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, watchEffect } from 'vue'
import axios from 'axios'

const announcements = ref([])  // 存储多个公告
const currentIndex = ref(0)  // 当前显示的公告索引
const isCollapsed = ref(false)  // 是否折叠公告栏

// 获取公告数据
const fetchAnnouncements = async () => {
  try {
    const res = await axios.get('/api/announcements')
    if (res.data && res.data.length > 0) {
      announcements.value = res.data
    } else {
      announcements.value = [{ content: '暂无公告内容', created_at: new Date().toISOString() }]
    }
  } catch (err) {
    announcements.value = [{ content: '公告加载失败', created_at: new Date().toISOString() }]
    console.error('公告加载错误:', err)
  }
}

// 计算当前公告
const currentAnnouncement = ref({})
watchEffect(() => {
  currentAnnouncement.value = announcements.value[currentIndex.value] || { content: '暂无公告内容', created_at: new Date().toISOString() }
})

// 轮播公告（每 5 秒切换）
const startAnnouncementRotation = () => {
  setInterval(() => {
    if (announcements.value.length > 1) {
      currentIndex.value = (currentIndex.value + 1) % announcements.value.length
    }
  }, 5000)
}

// 切换公告栏显示/隐藏
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value
}

onMounted(async () => {
  await fetchAnnouncements()
  startAnnouncementRotation()
})
</script>

<style scoped>
.announcement-container {
  position: fixed;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  height: auto;
  display: flex;
  align-items: flex-start;
  transition: left 0.3s ease-in-out;
  z-index: 1000;
  background: #282c34;  /* 深灰色背景 */
  border-radius: 20px;  /* 圆角效果 */
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.4); /* 轻微阴影 */
}

/* 收起时，向左隐藏 */
.announcement-container.collapsed {
  left: -300px;
}

/* 公告主体 */
.announcement {
  width: 300px;
  background: #353b48;  /* 深灰色 */
  padding: 1.5rem;
  border-radius: 20px;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.2);
  color: #ffffff;
  overflow-y: auto;
  max-height: 90vh;
  transition: max-height 0.3s ease-in-out; /* 动态变化 */
}

/* 标题 */
h2 {
  font-size: 1.5rem; /* 更合适的大小 */
  color: #4caf50;  /* ChatGPT风格的绿色 */
  margin-bottom: 1rem;
  text-align: center;
  font-weight: bold;
}

/* 收起按钮 */
.toggle-button {
  position: absolute;
  right: -40px;
  top: 50%;
  transform: translateY(-50%);
  width: 40px;
  height: 80px;
  background: #282c34;
  color: #ffffff;
  border: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.3s;
  box-shadow: 2px 0 6px rgba(0, 0, 0, 0.3);
}

.toggle-button:hover {
  background: #4caf50;  /* 悬停时变绿色 */
}

/* 控制按钮 */
.controls {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
}

.controls button {
  background: #7f8c8d;  /* 灰色按钮 */
  color: #ecf0f1;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background 0.3s;
}

.controls button.active {
  background: #4caf50;  /* 绿色激活状态 */
  color: #ffffff;
}

.controls button:hover {
  background: #4caf50;  /* 悬停时变绿色 */
  color: #ffffff;
}

/* 时间戳 */
.timestamp {
  font-size: 0.9rem;
  color: #bdc3c7;
  margin-top: 1rem;
  text-align: center;
}

/* 公告内容 */
.content {
  font-size: 1rem; /* 根据屏幕宽度适应字体大小 */
  color: #ecf0f1;
  margin-bottom: 1rem;
  line-height: 1.5;
  word-wrap: break-word;
  white-space: pre-line;
  max-height: 50vh; /* 限制内容区域最大高度 */
  overflow-y: auto;
}
</style>