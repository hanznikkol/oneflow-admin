import { createApp } from 'vue'
import './style.css'
import router from './router.js'
import App from './App.vue'
import Notifications from '@kyvg/vue3-notification'

createApp(App)
  .use(router)
  .use(Notifications)
  .mount('#app')
