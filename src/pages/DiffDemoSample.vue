<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DiffViewerComponent from '@/components/DiffViewerComponent.vue'

// Reactive state - 샘플 데이터
const originalText = ref('')
const modifiedText = ref('')
// const loading = ref(false)

const loadSampleData = () => {
  originalText.value = 
  `function calculateSum(a, b) {
      return a + b;
    }

    const numbers = [1, 2, 3, 4, 5];
    const result = numbers.reduce((acc, num) => acc + num, 0);

    console.log('Sum:', result);`

  modifiedText.value = 
  `function calculateSum(a, b, c = 0) {
    // Added optional third parameter
    return a + b + c;
  }

  function calculateProduct(a, b) {
    return a * b;
  }

  const numbers = [1, 2, 3, 4, 5, 6];
  const sum = numbers.reduce((acc, num) => acc + num, 0);
  const product = numbers.reduce((acc, num) => acc * num, 1);

  console.log('Sum:', sum);
  console.log('Product:', product);`
}

onMounted(() => {
  loadSampleData()
})
</script>

<template>
    <!-- DiffViewerComponent 사용 -->
    <DiffViewerComponent
      :original-text="originalText"
      :modified-text="modifiedText"
      :original-label="'현재 버전'"
      :modified-label="'선택 버전'"
      :output-format="'side-by-side'"
      :show-stats="true"
      />
      <!-- :max-height="'70vh'"
      :loading="loading" -->
</template>

<style scoped>
</style> 