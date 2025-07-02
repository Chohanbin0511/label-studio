<script setup lang="ts">
import { ref, computed, nextTick, watch } from 'vue'
import * as Diff2Html from 'diff2html'
import { createTwoFilesPatch } from 'diff'
import 'diff2html/bundles/css/diff2html.min.css'

// Reactive state
const originalText = ref('')
const modifiedText = ref('')
const diffHtml = ref('')
const loading = ref(false)
const error = ref('')
const diffContainer = ref<HTMLElement>()

// Options
const options = ref({
  drawFileList: true,
  outputFormat: 'line-by-line' as 'line-by-line' | 'side-by-side',
  highlight: true
})

const stats = ref<{
  added: number
  removed: number
  changed: number
} | null>(null)

// Computed properties
const canGenerateDiff = computed(() => {
  return originalText.value.trim() !== '' && modifiedText.value.trim() !== ''
})

// Diff generation using diff2html
const generateDiff = async () => {
  if (!canGenerateDiff.value) return

  loading.value = true
  error.value = ''
  
  try {
    await nextTick()
    
    // Create unified diff
    const patch = createTwoFilesPatch(
      'original.txt',
      'modified.txt',
      originalText.value,
      modifiedText.value,
      'Original',
      'Modified'
    )

    // Configure diff2html options
    const diff2htmlOptions: Diff2Html.Diff2HtmlConfig = {
      drawFileList: options.value.drawFileList,
      outputFormat: options.value.outputFormat
    }

    // Generate HTML using diff2html
    diffHtml.value = Diff2Html.html(patch, diff2htmlOptions)
    
    // Calculate statistics
    calculateStats(patch)
    
  } catch (err) {
    error.value = 'Error generating diff: ' + (err as Error).message
    console.error('Diff generation error:', err)
  } finally {
    loading.value = false
  }
}


// Statistics calculation
const calculateStats = (patch: string) => {
  const lines = patch.split('\n')
  let added = 0
  let removed = 0
  let changed = 0
  
  for (const line of lines) {
    if (line.startsWith('+') && !line.startsWith('+++')) {
      added++
    } else if (line.startsWith('-') && !line.startsWith('---')) {
      removed++
    }
  }
  
  // Simple heuristic for changed lines
  changed = Math.min(added, removed)
  added -= changed
  removed -= changed
  
  stats.value = { added, removed, changed }
}

// Utility functions
const clearAll = () => {
  originalText.value = ''
  modifiedText.value = ''
  diffHtml.value = ''
  error.value = ''
  stats.value = null
}

const loadSampleData = () => {
  originalText.value = `function calculateSum(a, b) {
  return a + b;
}

const numbers = [1, 2, 3, 4, 5];
const result = numbers.reduce((acc, num) => acc + num, 0);

console.log('Sum:', result);`

  modifiedText.value = `function calculateSum(a, b, c = 0) {
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

  // Auto generate diff after loading sample data
  setTimeout(() => generateDiff(), 100)
}

// Watch for option changes and regenerate diff automatically
watch(
  () => [options.value.outputFormat, options.value.drawFileList, options.value.highlight],
  () => {
    // Only regenerate if we already have content and a diff
    if (diffHtml.value && canGenerateDiff.value) {
      generateDiff()
    }
  }
)

// Code examples for documentation
const basicUsageCode = `import { ref } from 'vue'
import * as Diff2Html from 'diff2html'
import { createTwoFilesPatch } from 'diff'
import 'diff2html/bundles/css/diff2html.min.css'

const originalText = ref('')
const modifiedText = ref('')
const diffHtml = ref('')

const generateDiff = () => {
  const patch = createTwoFilesPatch(
    'original.txt',
    'modified.txt',
    originalText.value,
    modifiedText.value
  )
  
  diffHtml.value = Diff2Html.html(patch, {
    drawFileList: true,
    outputFormat: 'side-by-side'
  })
}`

const advancedUsageCode = `const diff2htmlOptions = {
  drawFileList: true,
  outputFormat: 'side-by-side',
  synchronisedScroll: true,
  highlight: true,
  fileListToggle: true,
  fileListStartVisible: false,
  fileContentToggle: true,
  maxLineSizeInBlockForComparison: 200,
  maxLineLengthHighlight: 10000,
  renderNothingWhenEmpty: false
}`
</script>

<template>
  <div class="diff-demo">
    <h1>Diff2HTML Vue 3 Demo</h1>
    <!-- Text Comparison with diff2html -->
    <div>
      <h3>텍스트 비교</h3>
      <div class="text-input-section">
        <div class="text-input-group">
          <label for="text1">원본 텍스트:</label>
          <textarea 
            id="text1"
            v-model="originalText" 
            placeholder="원본 텍스트를 입력하세요..."
            rows="8"
          ></textarea>
        </div>
        
        <div class="text-input-group">
          <label for="text2">수정된 텍스트:</label>
          <textarea 
            id="text2"
            v-model="modifiedText" 
            placeholder="수정된 텍스트를 입력하세요..."
            rows="8"
          ></textarea>
        </div>
      </div>

      <div class="controls">
        <button @click="generateDiff" :disabled="!canGenerateDiff">
          Diff 생성
        </button>
        <button @click="clearAll">
          모두 지우기
        </button>
        <button @click="loadSampleData">
          샘플 데이터 로드
        </button>
      </div>

      <!-- Options -->
      <div class="options">
        <div>
          <label>
            <input 
              v-model="options.drawFileList" 
              type="checkbox"
            />
            파일 목록 표시
          </label>
        </div>
        
        <div>
          <label>
            출력 형식:
            <select v-model="options.outputFormat">
              <option value="line-by-line">Line by Line</option>
              <option value="side-by-side">Side by Side</option>
            </select>
          </label>
        </div>
        
        <div>
          <label>
            <input 
              v-model="options.highlight" 
              type="checkbox"
            />
            구문 강조
          </label>
        </div>
      </div>

      <!-- Diff Display using diff2html -->
      <div class="diff-container">
        <div v-if="loading">
          Generating diff...
        </div>
        
        <div v-else-if="error">
          {{ error }}
        </div>
        
        <div 
          v-else-if="diffHtml" 
          ref="diffContainer"
          v-html="diffHtml"
        ></div>
        
        <div v-else>
          텍스트를 입력하고 'Diff 생성' 버튼을 클릭하세요
        </div>
      </div>

      <!-- Statistics -->
      <div v-if="stats">
        <h4>통계:</h4>
        <div>
          <div>
            <span>추가된 라인: {{ stats.added }}</span>
          </div>
          <div>
            <span>삭제된 라인: {{ stats.removed }}</span>
          </div>
          <div>
            <span>변경된 라인: {{ stats.changed }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Instructions -->
    <div>
      <h3>diff2html 사용 방법</h3>
      <div class="instruction-section">
        <h4>1. 패키지 설치</h4>
        <pre><code>pnpm add diff2html diff</code></pre>
      </div>

      <div class="instruction-section">
        <h4>2. 기본 사용법</h4>
        <pre><code>{{ basicUsageCode }}</code></pre>
      </div>

      <div class="instruction-section">
        <h4>3. 고급 사용법</h4>
        <pre><code>{{ advancedUsageCode }}</code></pre>
      </div>
    </div>
  </div>
</template>

<style scoped>
.diff-demo {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.text-input-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.text-input-group {
  display: flex;
  flex-direction: column;
}

.text-input-group label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #555;
}

.text-input-group textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  resize: vertical;
}

.controls {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.options {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
}


.diff-container {
  border: 1px solid #ddd;
  border-radius: 8px;
  min-height: 400px;
  background: white;
  overflow: auto;
}

.instruction-section pre {
  background: #2d3748;
  color: #e2e8f0;
  padding: 15px;
  border-radius: 4px;
  overflow-x: auto;
  margin: 0;
}
</style> 