<!-- pages/register.vue -->
 
<template>
  <div class="container mt-5">
    <h2 class="mb-4">📝 สมัครสมาชิก</h2>
    <form @submit.prevent="register">
      <div class="mb-3">
        <input v-model="form.username" class="form-control" placeholder="ชื่อผู้ใช้" required />
      </div>
      <div class="mb-3">
        <input v-model="form.email" class="form-control" type="email" placeholder="อีเมล" required />
      </div>
      <div class="mb-3">
        <input v-model="form.password" class="form-control" type="password" placeholder="รหัสผ่าน" required />
      </div>
      <button class="btn btn-primary">สมัครสมาชิก</button>
    </form>
    <p class="mt-3 text-success" v-if="success">{{ success }}</p>
    <p class="mt-3 text-danger" v-if="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref({ username: '', email: '', password: '' })
const success = ref('')
const error = ref('')

const register = async () => {
  try {
    const res = await $fetch('http://localhost:3001/api/register', {
      method: 'POST',
      body: form.value,
    })
    success.value = '✅ สมัครสมาชิกสำเร็จ'
    error.value = ''
    form.value = { username: '', email: '', password: '' }

    // 👉 redirect ไปหน้า login หลังสมัครสำเร็จ
    setTimeout(() => {
      router.push('/login')
    }, 1000) // รอ 1 วิให้ผู้ใช้เห็นข้อความ

  } catch (err) {
    error.value = err?.data?.error || 'เกิดข้อผิดพลาด'
    success.value = ''
  }
}
</script>
