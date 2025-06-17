<template>
  <div class="container text-center" style="padding-top: 10%">
    <h1>ออกจากระบบสำเร็จ</h1>
    <p>กำลังพาคุณกลับไปยังหน้าแรก...</p>
  </div>
</template>

<script setup>
import { navigateTo } from '#app';

localStorage.removeItem('token'); // ลบ token ออกจาก localStorage

// เปลี่ยนเส้นทางไปยังหน้า login หรือหน้าแรก
setTimeout(() => {
  navigateTo('/login');
}, 2000); // ใช้เวลา 2 วินาทีในการเปลี่ยนหน้า
</script>
