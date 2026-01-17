<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <p>&copy; 2014-2025 lom联盟版权所有</p>
        <p>All Rights Reserved</p>
      </div>
      <div class="footer-section">
        <p>联系我们：<a href="mailto:admin@bzlom.cn">admin@bzlom.cn</a></p>
        <p>技术支持：<a href="mailto:yklom@foxmail.com">凌云陌(lingyunmo)</a></p>
      </div>
      <div class="footer-section">
        <p>地址：上海市浦东新区银城中路68号时代金融中心16层</p>
        <p>备案号：沪ICP备19024878号</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>本网站由 lom联盟 提供技术支持</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Foot'
}
</script>

<style scoped>
.footer {
  background-color: #222; /* 深色背景 */
  padding: 40px 0;
  color: #fff; /* 统一白色字体 */
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.5); /* 增强阴影效果 */
}

.footer-content {
  display: flex;
  justify-content: space-between; /* 保持三列布局 */
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 20px;
  flex-wrap: wrap; /* 避免在小屏幕上内容溢出 */
}

.footer-section {
  flex: 1;
  text-align: center; /* 让每列的文本在列的范围内居中 */
  min-width: 300px;
  margin-bottom: 20px;
}

.footer p {
  margin: 6px 0;
  font-size: 16px;
  line-height: 1.6;
}

.footer a {
  color: #00bfff; /* 亮蓝色，符合 ChatGPT 风格 */
  text-decoration: none;
}

.footer a:hover {
  text-decoration: underline;
}

.footer-bottom {
  margin-top: 20px;
  text-align: center;
  font-size: 13px;
  color: #aaa; /* 更柔和的灰色 */
}

@media screen and (max-width: 768px) {
  .footer-content {
    flex-direction: column; /* 小屏幕改为垂直排列 */
    align-items: center;
  }
}
</style>