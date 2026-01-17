import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
    plugins: [vue()],
    server: {
        allowedHosts: ["frp-aim.com"],
        host: '0.0.0.0',
        port: 5173,  // 前端服务端口
        proxy: {
            '/api': {
                target: 'http://localhost:3000',  // 推荐使用 localhost 代替 127.0.0.1
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, '/api'), // 保持路径前缀
                secure: false,  // 允许代理到非 HTTPS 服务
            },
            '/ws': {
                target: 'ws://localhost:3000',
                ws: true, // 启用 WebSocket 代理
                changeOrigin: true, // 修改请求头中的 Origin 字段
                rewrite: (path) => path.replace(/^\/ws/, '/ws') // 可选：重写路径
            }
        }
    }
})