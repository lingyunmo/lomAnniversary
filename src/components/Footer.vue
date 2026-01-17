<template>
  <el-footer class="advanced-footer" height="auto">
    <div
        class="footer-accent-line"
        v-motion
        :initial="{ scaleX: 0, opacity: 0 }"
        :visible="{ scaleX: 1, opacity: 1, transition: { duration: 1000, type: 'spring' } }"
    ></div>

    <div class="footer-content">
      <el-row :gutter="40" justify="space-between">

        <el-col :xs="24" :sm="24" :md="8" class="footer-section">
          <div
              class="brand-container"
              v-motion
              :initial="{ opacity: 0, x: -50 }"
              :visible="{ opacity: 1, x: 0, transition: { duration: 800 } }"
          >
            <h2 class="logo-text">lom<span class="highlight">11th</span></h2>
            <p class="slogan">十年磨砺，智启未来。</p>
            <p class="copyright-year">
              &copy; 2014 - {{ currentYear }} lom league
            </p>
          </div>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" class="footer-section">
          <div
              v-motion
              :initial="{ opacity: 0, y: 50 }"
              :visible="{ opacity: 1, y: 0, transition: { delay: 200, duration: 800 } }"
          >
            <h4 class="section-title">联系我们</h4>
            <div class="link-group">
              <a href="mailto:admin@bzlom.cn" class="icon-link">
                <div class="icon-wrapper" v-motion :hover="{ scale: 1.2 }">
                  <Mail :size="16" />
                </div>
                <span>admin@bzlom.cn</span>
              </a>
              <a href="mailto:yklom@foxmail.com" class="icon-link">
                <div class="icon-wrapper" v-motion :hover="{ scale: 1.2 }">
                  <User :size="16" />
                </div>
                <span>技术支持：凌云陌 (lingyunmo)</span>
              </a>
            </div>
          </div>
        </el-col>

        <el-col :xs="24" :sm="12" :md="8" class="footer-section">
          <div
              v-motion
              :initial="{ opacity: 0, y: 50 }"
              :visible="{ opacity: 1, y: 0, transition: { delay: 400, duration: 800 } }"
          >
            <h4 class="section-title">位置信息</h4>
            <div class="info-group">
              <div class="info-item">
                <div class="icon-wrapper">
                  <MapPin :size="16" />
                </div>
                <span>上海市浦东新区银城中路68号<br>时代金融中心16层</span>
              </div>

              <a href="https://beian.miit.gov.cn/" target="_blank" class="icp-badge">
                <ShieldCheck :size="12" class="icon" />
                <span>沪ICP备19024878号</span>
              </a>
            </div>
          </div>
        </el-col>
      </el-row>

      <el-divider class="custom-divider" />

      <div
          class="footer-bottom"
          v-motion
          :initial="{ opacity: 0 }"
          :visible="{ opacity: 1, transition: { delay: 600, duration: 1000 } }"
      >
        <p>Designed by lom league. Powered by <span class="vue-green">Vue 3</span> & Element Plus.</p>
      </div>
    </div>
  </el-footer>
</template>

<script setup>
import { ref } from 'vue'
import { Mail, User, MapPin, ShieldCheck } from 'lucide-vue-next'

const currentYear = ref(new Date().getFullYear())
</script>

<style scoped>
:root {
  --footer-bg: #0f1115;
  --text-secondary: #8b9bb4;
  --accent-color: #3b82f6;
}

.advanced-footer {
  background-color: #0f1115;
  padding: 0;
  color: var(--text-secondary);
  font-family: system-ui, -apple-system, sans-serif;
  position: relative;
  overflow: hidden;
}

.footer-accent-line {
  height: 2px; /* 线条稍微变细一点，更精致 */
  background: linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899);
  width: 100%;
  transform-origin: center;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  /* 关键修改：大幅减少上下内边距 */
  /* 原来是 60px 20px 30px */
  padding: 30px 20px 15px;
}

.logo-text {
  font-size: 24px; /* 字体稍微调小一点适配窄高度 */
  font-weight: 700;
  color: #fff;
  margin-bottom: 5px; /* 减少间距 */
  letter-spacing: 1px;
}

.highlight {
  color: var(--accent-color);
  margin-left: 5px;
  display: inline-block;
}

.slogan {
  font-size: 13px;
  margin-bottom: 10px; /* 减少间距 */
  opacity: 0.8;
}

.copyright-year {
  font-size: 12px;
  opacity: 0.6;
}

.section-title {
  font-size: 15px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 12px; /* 减少标题下方的间距 (原来是 20px) */
}

.link-group, .info-group {
  display: flex;
  flex-direction: column;
  gap: 10px; /* 减少条目之间的间距 (原来是 16px) */
}

.icon-link, .info-item {
  display: flex;
  align-items: center; /* 确保垂直居中 */
  gap: 10px;
  color: var(--text-secondary);
  text-decoration: none;
  font-size: 13px; /* 字体微调 */
  transition: color 0.3s ease;
  line-height: 1.4;
}

.icon-link:hover {
  color: #fff;
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px; /* 缩小图标容器 */
  height: 20px;
  color: var(--accent-color);
}

.icp-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 5px; /* 减少间距 */
  padding: 2px 8px; /* 缩小内边距 */
  border: 1px solid #333;
  border-radius: 4px;
  color: #666;
  text-decoration: none;
  font-size: 12px;
  width: fit-content;
  transition: all 0.3s;
}

.icp-badge:hover {
  border-color: var(--accent-color);
  color: var(--accent-color);
  background: rgba(59, 130, 246, 0.1);
}

.custom-divider {
  border-color: rgba(255, 255, 255, 0.1);
  /* 关键修改：减少分割线的上下边距 */
  /* 原来是 40px 0 20px */
  margin: 20px 0 15px;
}

.footer-bottom {
  text-align: center;
  font-size: 12px;
  color: #555;
  padding-bottom: 5px;
}

.vue-green {
  color: #42b883;
  font-weight: 600;
}

@media screen and (max-width: 768px) {
  .footer-section {
    margin-bottom: 25px; /* 手机端间距也相应调小 */
    text-align: center;
  }

  .link-group, .info-group, .icon-link, .info-item, .icp-badge {
    align-items: center;
    justify-content: center;
  }
}
</style>