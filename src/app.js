import { createApp } from 'vue'
import { createPinia } from 'pinia'

import { Locale } from '@nutui/nutui-taro'
import zhCN from '@nutui/nutui-taro/dist/packages/locale/lang/zh-CN'
Locale.use('zh-CN', zhCN)

import '@/assets/styles/app.scss'

const App = createApp({
    onShow(options) {}
})

App.use(createPinia())

export default App
