<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark px-4">
    <NuxtLink class="navbar-brand" to="/">🛒 DEMO-Shop</NuxtLink>

    <div class="ms-auto d-flex align-items-center">
      <div v-if="username" class="text-white me-3">
        👤 {{ username }}
      </div>
      <button v-if="username" @click="logout" class="btn btn-outline-light btn-sm">Logout</button>
      <NuxtLink v-else to="/login" class="btn btn-outline-light btn-sm">Login</NuxtLink>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { navigateTo } from '#app'

const username = ref('')

// โหลดชื่อผู้ใช้จาก localStorage เมื่อ component ถูก mount
onMounted(() => {
  try {
    const token = localStorage.getItem('token')
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1])) // decode JWT
      username.value = payload.username
    }
  } catch (err) {
    console.error('Token parsing error:', err)
  }
})

const logout = () => {
  localStorage.removeItem('token')
  alert('👋 ออกจากระบบแล้ว')
  navigateTo('/login')
}
</script>

<style scoped>
.navbar {
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
}
</style>
