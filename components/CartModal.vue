<template>
  <div class="container" style="text-align:center;">
    <div class="col-auto">
  <div v-if="show"class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-white p-6 rounded shadow w-full max-w-lg">
          <div style="float: right; margin-bottom: 2%">
            <button @click="$emit('close')" class="btn">X</button>
          </div>
          <div class="container" style="padding: 5%;">
          <h2 class="text-xl font-bold mb-4" style="padding-top: 3%">
            🛒 ตะกร้าสินค้า
          </h2>
          <div v-if="cart.length === 0">ไม่มีสินค้าในตะกร้า</div>
          <table v-else class="w-full border mb-4" style="text-align:center;">
            <thead class="bg-gray-100">
              <tr>
                <th class="border p-2">ชื่อ</th>
                <th class="border p-2">จำนวน</th>
                <th class="border p-2">ลบ</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in cart" :key="item.id">
                <td class="border p-2">{{ item.name }}</td>
                <td class="border p-2">{{ item.quantity }}</td>
                <td class="border p-2">
                  <button @click="remove(item.id)" class="text-red-500">
                    🗑️
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="flex justify-between items-center" style="text-align:left;">
            <span class="font-bold">รวม: {{ totalPrice.toFixed(2) }} บาท</span>
          </div>
          <!-- confirm order -->
            <div style="text-align:center; margin-top: 5%">
              <button class="btn btn-success" @click="confirmOrder"> ✅ ยืนยันคำสั่งซื้อ</button>
            </div>
          <!-- end -->
        </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";

const props = defineProps({
  show: Boolean,
});
const emit = defineEmits(["close"]);

const cart = ref([]);

const loadCart = () => {
  cart.value = JSON.parse(localStorage.getItem("cart") || "[]");
};

watch(
  () => props.show,
  (val) => {
    if (val) loadCart();
  }
);

const remove = (id) => {
  cart.value = cart.value.filter((i) => i.id !== id);
  localStorage.setItem("cart", JSON.stringify(cart.value));
};

const totalPrice = computed(() =>
  cart.value.reduce((sum, i) => sum + i.price * i.quantity, 0)
);

// confirm order
const confirmOrder = async () => {
  // ดึงค่าจาก localStorage เป็น array ปกติ ไม่ใช่ ref
  const rawCart = localStorage.getItem("cart");
  const cart = JSON.parse(rawCart || "[]");

  if (cart.length === 0) {
    alert("ไม่มีสินค้าในตะกร้า");
    return;
  }

  try {
    // ลอง stringify ก่อน เพื่อทดสอบว่าข้อมูล stringify ได้
    console.log("📦 Sending cart:", JSON.stringify({ cart }));

    await $fetch("http://localhost:3001/api/checkout", {
      method: "POST",
      body: { cart }, // ✅ ส่งแบบปกติ ไม่ใช่ ref
    });

    alert("✅ ยืนยันคำสั่งซื้อเรียบร้อย");
    localStorage.removeItem("cart");
    // รีเฟรชหน้าเว็บ
    window.location.reload();  // รีโหลดหน้าเว็บหลังจากที่ยืนยันคำสั่งซื้อสำเร็จ
  } catch (err) {
    console.error("❌ Checkout failed:", err);
    alert("❌ สั่งซื้อไม่สำเร็จ: " + (err.data?.error || err.message));
  }
};

//  end

</script>

<style scoped>
.btn {
  @apply bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600;
}
</style>
