import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/style.css'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { MotionPlugin } from '@vueuse/motion'

createApp(App)
    .use(router)
    .use(store)
    .use(ElementPlus)
    .use(MotionPlugin)
    .mount('#app')