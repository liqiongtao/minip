import { createApp } from 'vue'
import { createPinia } from 'pinia'

import TDesign from 'tdesign-vue-next'
import 'tdesign-vue-next/dist/tdesign.min.css'

import './styles/themes.scss'

const App = createApp({
    onShow(options) {
        updateManager()
    }
})

App.use(TDesign)
App.use(createPinia())

export default App
