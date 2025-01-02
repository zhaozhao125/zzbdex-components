import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import locale from 'element-plus/es/locale/lang/zh-cn' // 中文语言

const app = createApp(App)

app.use(router)
app.use(ElementPlus, {
  locale: locale,
  size: 'default'
});

app.mount('#app')
