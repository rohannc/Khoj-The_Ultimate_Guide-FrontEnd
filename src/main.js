import './main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'
import { formatAddress } from './utils/address'

const app = createApp(App)
const pinia = createPinia(); // Create Pinia instance

app.use(pinia); // Use Pinia BEFORE other logic

// Make formatAddress available in templates globally: $formatAddress(...)
app.config.globalProperties.$formatAddress = formatAddress

// Call checkAuth() right after creating the pinia instance
const authStore = useAuthStore()
authStore.checkAuth()

app.use(router);

app.mount('#app')
