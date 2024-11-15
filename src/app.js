import { createApp } from 'vue'
import { createPinia } from 'pinia'

import './app.scss'

const App = createApp({
    onShow(options) {
        // updateManager()
    }
})

App.use(createPinia())

export default App
