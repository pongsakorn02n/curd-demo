<template>
  <title>DEMO-SHOP</title>
  <Navbar />
<!-- body  -->
  <div class="container mt-5">
    <h1 class="mb-4">🛍️ รายการสินค้า</h1>

    <!-- ปุ่มเปิดตะกร้า -->
    <div class="mb-4">
      <!-- ลิงก์ไปยังคลังสินค้า -->
      <NuxtLink to="/stock" class="btn btn-warning" style="margin-right: 2%;">คลังสินค้า</NuxtLink>
      <button @click="showCart = true" class="btn btn-secondary">🛒 เปิดตะกร้า</button>
      <CartModal :show="showCart" @close="showCart = false" />
    </div>

    <!-- แสดงสินค้าแบบ Card 4 คอลัมน์ -->
    <!-- <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"> -->
      <div class="container">
      <div class="row">
        <!-- <div class="card" style="width: 18rem;"> -->
      <div v-for="item in items":key="item.id" class="card" style="width: 18rem; margin-right: 2%; margin-bottom: 2%;">
        <div class="card-body" style="text-align: center;">
          <img :src="`/images/${item.image}`" :alt="item.name" class="w-12 h-auto rounded" style="width: 200px; object-fit: cover; border-radius: 8px;"/>
        </div>
        <div class="card-body">
          <h2 class="font-bold text-lg mb-2">{{ item.name }}</h2>
          <p class="text-gray-600 mb-1">{{ item.price }} บาท</p>
          <NuxtLink :to="`/order/${item.id}`" class="btn btn-outline-primary btn-sm" style="margin-right: 1%;">รายละเอียด</NuxtLink>
          <button class="btn btn-success btn-sm" @click="addToCart(item)">ใส่ตะกร้า</button>
        </div>
      </div>
    <!-- </div> -->
    </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { navigateTo } from '#app'
const { fetchAll } = useShopApi();
const items = ref([]);

// popup cart
// import { ref } from "vue";
import CartModal from "~/components/CartModal.vue";
const showCart = ref(false);


const selectedProduct = ref(null)

const openDetail = (product) => {
  selectedProduct.value = product
  showDetail.value = true
}

onMounted(async () => {
  items.value = await fetchAll();
});

const addToCart = (item) => {
  // ดึงรายการตะกร้าจาก localStorage (ถ้ามี)
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  // ตรวจสอบว่ามีสินค้านี้อยู่ในตะกร้าอยู่แล้วหรือไม่
  const existingItem = cart.find((i) => i.id === item.id);

  if (existingItem) {
    existingItem.quantity += 1; // เพิ่มจำนวนสินค้า
  } else {
    cart.push({ ...item, quantity: 1 }); // เพิ่มสินค้าใหม่
  }

  // บันทึกกลับลง localStorage
  localStorage.setItem("cart", JSON.stringify(cart));
  // localDetail.setItem("cart", JSON.stringify(cart));

  // แจ้งเตือน
  alert(`✅ เพิ่ม ${item.name} ลงในตะกร้าแล้ว`);
//   showCart.value = true // เปิด popup
  // loadCart() // โหลดข้อมูลตะกร้าใหม่
};
// navbar
import Navbar from '/layouts/Navbar.vue'
</script>

