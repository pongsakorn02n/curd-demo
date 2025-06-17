<template>
  <Navbar/>
  <div class="container mt-5">
    <div class="row">
      <div class="col-3"></div>
      <div class="col-6" style="text-align: center">
        <div
          class="crad"
          style="background-color: beige; padding-top: 2%; padding-bottom: 3%"
        >
          <h2 class="mb-4">📄 รายละเอียดสินค้า</h2>
          <hr>
          <div v-if="product">
            <h4><strong>ชื่อ:</strong> {{ product.name }}</h4>
            <p><strong>หมวดหมู่:</strong> {{ product.category }}</p>
            <p><strong>ราคา:</strong> {{ product.price }} บาท</p>
            <p><strong>คงเหลือ:</strong> {{ product.quantity }}</p>
            <div>
              <label for="quantity" style="margin-right: 1%;">จำนวน : </label>
              <input type="number" id="quantity" v-model="quantity" min="1":max="product.stock"class="quantity-input"/>
            </div><br>
            <button class="btn btn-success" @click="addToCart(product)">
              ใส่ตะกร้า
            </button>
          </div>

          <NuxtLink to="/" class="btn btn-secondary mt-3">⬅️ กลับ</NuxtLink
          ><br />
          <button @click="showCart = true" class="btn btn-secondary mt-3">
            🛒 เปิดตะกร้า
          </button>
          <CartModal :show="showCart" @close="showCart = false" />
        </div>
      </div>
    </div>
  </div>
  <div class="col-3"></div>
</template>

<script setup>
// popup cart
// import { ref } from "vue";
// import CartModal from "CartModal.vue";

// const showCart = ref(false);
import { ref, onMounted } from "vue";
import CartModal from "~/components/CartModal.vue";
const { fetchAll } = useShopApi();

// const items = ref([])
const showCart = ref(false);

// vue
// import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import Navbar from "~/layouts/navbar.vue";
const route = useRoute();
const product = ref(null);

onMounted(async () => {
  const res = await fetch(`http://localhost:3001/${route.params.id}`);
  product.value = await res.json();
});




const quantity = ref(1); // ค่าเริ่มต้นของจำนวนสินค้า

const addToCart = (item) => {
  // ดึงรายการตะกร้าจาก localStorage (ถ้ามี)
  const cart = JSON.parse(localStorage.getItem("cart") || "[]");

  // ตรวจสอบว่ามีสินค้านี้อยู่ในตะกร้าอยู่แล้วหรือไม่
  const existingItem = cart.find((i) => i.id === item.id);

  if (existingItem) {
    existingItem.quantity += quantity.value; // เพิ่มจำนวนสินค้า
  } else {
    cart.push({ ...item, quantity: quantity.value }); // เพิ่มสินค้าใหม่
  }

  // บันทึกกลับลง localStorage
  localStorage.setItem("cart", JSON.stringify(cart));

  // แจ้งเตือน
  alert(`✅ เพิ่ม ${item.name} ลงในตะกร้าแล้ว`);
  showCart.value = true // เปิด popup
  loadCart(); // โหลดข้อมูลตะกร้าใหม่
};
// // navbar
// import Navbar from '/layouts/Navbar.vue'
</script>

<style scoped>
.quantity-input {
  width: 50px;
  text-align: center;
}
</style>