<template>
  <div class="p-6 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-4">🛒 ตะกร้าสินค้า</h1>

    <div v-if="cart.length === 0">ไม่มีสินค้าที่เลือกไว้</div>
    <table v-else class="w-full border">
      <thead class="bg-gray-100">
        <tr>
          <th class="border p-2">ชื่อ</th>
          <th class="border p-2">ราคา</th>
          <th class="border p-2">จำนวน</th>
          <th class="border p-2">รวม</th>
          <th class="border p-2">ลบ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in cart" :key="item.id">
          <td class="border p-2">{{ item.name }}</td>
          <td class="border p-2">{{ item.price }}</td>
          <td class="border p-2">{{ item.quantity }}</td>
          <td class="border p-2">{{ (item.price * item.quantity).toFixed(2) }}</td>
          <td class="border p-2">
            <button @click="remove(item.id)" class="btn text-red-500">🗑️</button>
          </td>
        </tr>
      </tbody>
    </table>

    <div class="text-right mt-4 font-bold">
      รวมทั้งหมด: {{ totalPrice.toFixed(2) }} บาท
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const cart = ref([])

const loadCart = () => {
  cart.value = JSON.parse(localStorage.getItem('cart') || '[]')
}

const remove = (id) => {
  cart.value = cart.value.filter(item => item.id !== id)
  localStorage.setItem('cart', JSON.stringify(cart.value))
}

const totalPrice = computed(() =>
  cart.value.reduce((sum, item) => sum + item.price * item.quantity, 0)
)

onMounted(loadCart)
</script>

<style scoped>
.btn {
  @apply bg-red-100 px-2 py-1 rounded hover:bg-red-200;
}
</style>
