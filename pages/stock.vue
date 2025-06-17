
<template>
  <title>DEMO-STOCK</title>
  <Navbar />
  <!-- body -->
  <div class="p-6 max-w-3xl mx-auto">
    <div class="container" style="margin-top: 5%">
      <h1 class="text-2xl font-bold mb-4">📦 รายการสินค้า</h1>
      <NuxtLink to="/" class="btn btn-outline-primary mb-4">🔍 เลือกรายการสินค้า</NuxtLink>
      <div class="col-10">
        <form @submit.prevent="save" class="mb-4">
          <div class="mb-3">
            <input v-model="form.name" placeholder="ชื่อสินค้า"class="form-control"/>
          </div>
          <div class="mb-3">
            <input v-model="form.category" placeholder="หมวดหมู่"class="form-control" />
          </div>
          <div class="mb-3">
            <input v-model.number="form.price" type="number" placeholder="ราคา" class="form-control" />
          </div>
          <div class="mb-3">
            <input v-model.number="form.quantity" type="number"placeholder="จำนวน"class="form-control"/>
          </div>
          <!-- <div class="mb-3">
            <input v-model="form.image" placeholder="URL รูปภาพสินค้า" class="form-control" />
          </div> -->
          <div class="mb-3">
            <!-- <h5 class="text-lg font-bold mb-2">📤 อัปโหลดรูปสินค้า</h5> -->
            <input type="file" @change="handleFileChange" accept="image/*" class="mb-4" />
              <div v-if="previewUrl" class="mb-4">
                <p>Preview:</p>
                <img :src="previewUrl" alt="preview" class="w-48 rounded border" style="width: 200px; object-fit: cover; border-radius: 8px;" />
                <!-- <button @click="uploadImage" class="btn btn-primary">อัปโหลด</button> -->
            </div>
          </div>
          <button type="button" @click="uploadImage" class="btn btn-primary">
            {{ form.id ? "อัปเดต" : "เพิ่ม" }}
          </button>
          <button type="button" class="btn btn-danger ms-2" @click="reset">
            ล้าง
          </button>
        </form>

        <table class="table table-bordered">
          <thead class="table-light">
            <tr>
              <th>img</th>
              <th>ID</th>
              <th>ชื่อ</th>
              <th>หมวดหมู่</th>
              <th>ราคา</th>
              <th>จำนวน</th>
              <th>จัดการ</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in items" :key="item.id">
              <td><img :src="`/images/${item.image}`" :alt="item.name" class="w-12 h-auto rounded" style="width: 50px; object-fit: cover; border-radius: 8px;"/></td>
              <!-- <td>{{item.image}}</td> -->
              <td>{{ item.id }}</td>
              <td>{{ item.name }}</td>
              <td>{{ item.category }}</td>
              <td>{{ item.price }}</td>
              <td>{{ item.quantity }}</td>
              <td>
                <button class="btn btn-warning btn-sm" @click="edit(item)" style="margin-right: 2%;">✏️</button>
                <button class="btn btn-danger btn-sm" @click="del(item.id)">🗑️</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>




<script setup>
// select
// const { data: shops } = await useFetch('http://localhost:3001')

import { ref, onMounted } from "vue";
import Navbar from "/layouts/navbar.vue";
const { fetchAll, create, update, remove } = useShopApi();

const items = ref([]);
const form = ref({ id: null, name: "", category: "", price: 0, quantity: 0, image: "" });

const load = async () => {
  items.value = await fetchAll();
};

const save = async () => {
  if (form.value.id) {
    await update(form.value.id, form.value);
  } else {
    if(form.value.name!=''){
      await create(form.value);
    }else{
      alert('ไม่มีชื่อรายการที่ต้องการเพิ่ม' );
    }
    
  }
  await load(); // โหลดข้อมูลใหม่หลังจากอัปเดตหรือสร้างข้อมูล
  reset();
};

const edit = (shop) => {
  form.value = { ...shop };
  // await load()
};

const del = async (id) => {
  if (confirm("แน่ใจว่าต้องการลบ?")) {
    await remove(id);
    await load();
  }
};

const reset = () => {
  form.value = { id: null, name: "", category: "", price: 0, quantity: 0, image: "" };
};

onMounted(load);

// upload
// import { ref } from 'vue'

const selectedFile = ref(null)
const previewUrl = ref(null)
const uploadedPath = ref(null)

const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    previewUrl.value = URL.createObjectURL(file)
  }
}

const uploadImage = async () => {
  if (!selectedFile.value) {
    alert('กรุณาเลือกรูปก่อน')
    return
  }

  const formData = new FormData()
  formData.append('image', selectedFile.value)

  try {
    const response = await $fetch('http://localhost:3001/api/upload-image', {
      method: 'POST',
      body: formData,
    })

    // ดึงชื่อไฟล์จาก response 
    const filename = response.filename || response.path?.split('/').pop()
    form.value.image = filename // บันทึกชื่อไฟล์ลงใน form

    // หลังอัปโหลดเสร็จ -> สร้างสินค้า
    await save()  // ← เรียกฟังก์ชัน save() ที่คุณมีอยู่แล้ว
    uploadedPath.value = `http://localhost:3001${response.path}`
    alert('✅ อัปโหลดและเพิ่มสินค้าเรียบร้อย')
    // reload
    window.location.reload();
    
  } catch (err) {
    console.error('❌ Upload error:', err)
    alert('❌ อัปโหลดไม่สำเร็จ')
  }
}
// // navbar
// import Navbar from '/layouts/Navbar.vue'

</script>

<!-- <style scoped>
.input {
  @apply border p-2 w-full rounded;
}
.btn {
  @apply bg-blue-100 px-2 py-1 rounded hover:bg-blue-200;
}

</style> -->
