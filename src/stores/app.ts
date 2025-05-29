import { defineStore } from 'pinia'
import { ref } from 'vue'

type User = {
  id: string
  name: string
  role: string
} | null

export const useAppStore = defineStore('app', () => {
  const currentApp = ref<'enterprise' | 'studio'>('enterprise')
  const isAuthenticated = ref(false)
  const user = ref<User>(null)

  function setCurrentApp(app: 'enterprise' | 'studio') {
    currentApp.value = app
  }

  function setAuth(newUser: User) {
    isAuthenticated.value = !!newUser
    user.value = newUser
  }

  function logout() {
    isAuthenticated.value = false
    user.value = null
    localStorage.removeItem('token')
  }

  return {
    currentApp,
    isAuthenticated,
    user,
    setCurrentApp,
    setAuth,
    logout
  }
}, {
  persist: {
    storage: localStorage,
  }
}) 