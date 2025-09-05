import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { useAuthStore } from './stores/auth'

const app = createApp(App)
const pinia = createPinia(); // Create Pinia instance

app.use(pinia); // Use Pinia BEFORE other logic

// Call checkAuth() right after creating the pinia instance
const authStore = useAuthStore()
authStore.checkAuth()

app.use(router);

app.mount('#app')
