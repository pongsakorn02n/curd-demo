<template>
  <div class="container" style="padding-top:10%">
    <div class="row">
    <div class="col-3"></div>
    <div class="col-6">
    <h1>🔐 Login</h1>
    <form @submit.prevent="login">
      <input v-model="username" placeholder="Username" class="form-control mb-2" />
      <input v-model="password" type="password" placeholder="Password" class="form-control mb-2" />
      <button class="btn btn-primary" style="margin-right:2%;">เข้าสู่ระบบ</button>
      <NuxtLink :to="`/register`" class="btn btn-warning">ลงทะเบียน</NuxtLink>
    </form>
  </div>
</div>
<div class="col-3"></div>
</div>
</template>

<script setup>
import { ref } from 'vue';
import { navigateTo } from '#app';
import { useRouter } from 'vue-router'

const router = useRouter()

const username = ref('');
const password = ref('');

const login = async () => {
console.log('Username:', username);
console.log('Password input:', password);
// console.log('Password bcrypt:', bcrypt.hash(password, 10));
  try {
    const res = await $fetch('http://localhost:3001/api/login', {
      method: 'POST',
      body: { username: username.value, password: password.value }
    });
    localStorage.setItem('token', res.token);
    console.log('Response:', res);
    // alert('✅ เข้าสู่ระบบสำเร็จ');
    navigateTo('/'); // redirect ไปหน้าแรก
  } catch (err) {
    alert('❌ ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง');
  }
};
</script>

