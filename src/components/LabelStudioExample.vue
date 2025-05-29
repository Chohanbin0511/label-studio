<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import LabelStudio from 'label-studio'
import 'label-studio/build/static/css/main.css'
import { 
  type Annotation,
  loadAnnotations,
} from '../utils/label-studio'
import { createLabelStudioHandlers } from '../utils/label-studio-handlers'
import { 
  LABEL_STUDIO_INTERFACES,
  sampleTextConfig,
  sampleTextTask
} from '../constants/label-studio'

defineOptions({
  name: 'LabelStudioExample'
})

// Label Studio 타입 확장
declare module 'label-studio' {
  interface LabelStudioOptions {
    onUpdateAnnotation?: (LS: any, annotation: any) => void
    onDeleteAnnotation?: (LS: any, annotation: any) => void
    onSkipTask?: (LS: any) => void
  }
}

const labelStudioText = ref<HTMLElement | null>(null)
const resultText = ref<any>(null)
const textLS = ref<any>(null)

function initTextLS() {
  if (!labelStudioText.value) return
  
  labelStudioText.value.innerHTML = ''
  
  // 저장된 어노테이션 데이터 로드
  const savedAnnotations = loadAnnotations()
  console.log('savedAnnotations ::', savedAnnotations)
  
  // task 복사본 생성
  const task = {
    ...sampleTextTask,
    annotations: [] as Annotation[]
  }
  
  // 저장된 어노테이션이 있으면 task에 추가
  if (Object.keys(savedAnnotations).length > 0) {
    task.annotations = Object.entries(savedAnnotations).map(([id, results]) => ({
      id,
      result: Array.isArray(results) ? results : []
    }))
  } else {
    task.annotations = [{
      id: '1',
      result: []
    }]
  }
  
  // 이벤트 핸들러 생성
  const handlers = createLabelStudioHandlers(task, resultText)
  
  // Label Studio 초기화
  textLS.value = new LabelStudio(labelStudioText.value, {
    config: sampleTextConfig,
    interfaces: LABEL_STUDIO_INTERFACES,
    task,
    ...handlers
  } as any)
}

onMounted(() => {
  initTextLS()
})

watch(resultText, (newValue) => {
  console.log('텍스트 라벨링 결과:', newValue)
  // initTextLS()
}, { deep: true })
</script>


<template>
  <div class="label-studio-container">
    <h2>Label Studio Example</h2>
    <div class="main-content">
      <div ref="labelStudioText" class="label-studio-wrapper">
      </div>
      <div class="annotation-result-container">
        <h3>라벨링 결과</h3>
        <div class="annotation-result">
          {{ resultText?._initialAnnotationObj }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.label-studio-container {
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.label-studio-wrapper {
  width: 100%;
  height: 600px;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: #fff;
  position: relative;
  z-index: 1;
}

.annotation-result-container {
  margin-top: 20px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 4px;
}

.annotation-result {
  line-height: 1.6;
  font-size: 16px;
  white-space: pre-wrap;
  word-break: break-all;
}
</style> 