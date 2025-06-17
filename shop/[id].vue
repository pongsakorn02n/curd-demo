<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">รายละเอียดสินค้า</h1>
    <div v-if="shop">
      <p><strong>ชื่อสินค้า:</strong> {{ shop.name }}</p>
      <p><strong>หมวดหมู่:</strong> {{ shop.category }}</p>
      <p><strong>ราคา:</strong> {{ shop.price }} บาท</p>
      <p><strong>จำนวน:</strong> {{ shop.quantity }}</p>
    </div>
    <div v-else>
      <p>กำลังโหลดข้อมูล...</p>
    </div>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
import { ref, onMounted } from 'vue'

const route = useRoute()
const shop = ref(null)

onMounted(async () => {
  const id = route.params.id
  try {
    const response = await fetch(`http://localhost:3001/shop/${id}`)
    if (!response.ok) {
      throw new Error('ไม่พบข้อมูลสินค้า')
    }
    shop.value = await response.json()
  } catch (error) {
    console.error(error)
  }
})
</script>
