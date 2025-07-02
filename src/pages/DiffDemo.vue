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
  drawFileList: false,
  outputFormat: 'side-by-side' as 'line-by-line' | 'side-by-side',
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
const basicUsageCode = `// 필요한 패키지들 import
import { ref } from 'vue'                              
import * as Diff2Html from 'diff2html'                 // diff2html 라이브러리
import { createTwoFilesPatch } from 'diff'             // diff 생성 함수
import 'diff2html/bundles/css/diff2html.min.css'       // diff2html 스타일시트

// 반응형 상태 정의
const originalText = ref('')                           // 원본 텍스트
const modifiedText = ref('')                           // 수정된 텍스트
const diffHtml = ref('')                               // 생성된 diff HTML

// diff 생성 함수
const generateDiff = () => {
  const patch = createTwoFilesPatch(                   // 두 파일의 패치 생성
    'original.txt',                                    // 원본 파일명
    'modified.txt',                                    // 수정된 파일명
    originalText.value,                                // 원본 텍스트 내용
    modifiedText.value                                 // 수정된 텍스트 내용
  )
  
  diffHtml.value = Diff2Html.html(patch, {             // HTML로 변환
    drawFileList: true,                                // 파일 목록 표시
    outputFormat: 'side-by-side'                       // 좌우 배치 형식
  })
}`

const advancedUsageCode = 
`const diff2htmlOptions = {
  drawFileList: true,                                  // diff 앞에 파일 목록 표시 여부
  outputFormat: 'side-by-side',                        // 출력 형식: 'line-by-line' 또는 'side-by-side'
  synchronisedScroll: true,                            // side-by-side 모드에서 두 패널 스크롤 동기화
  highlight: true,                                     // 코드 구문 강조 표시 여부
  fileListToggle: true,                                // 파일 목록 토글(접기/펼치기) 가능 여부
  fileListStartVisible: false,                         // 파일 목록이 처음에 보이는지 여부
  fileContentToggle: true,                             // 각 파일 내용을 개별적으로 토글 가능 여부
  maxLineSizeInBlockForComparison: 200,                // 블록 비교 시 더 큰 라인의 최대 문자 수
  maxLineLengthHighlight: 10000,                       // diff 변경사항 강조 표시할 라인의 최대 길이
  renderNothingWhenEmpty: false                        // 변경사항이 없을 때 아무것도 렌더링 안할지 여부
}`
</script>

<template>
  <div class="diff-demo">
    <h1>Diff2HTML Vue 3 Demo</h1>
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
        <div v-if="stats && diffHtml" class="github-style-stats">
          <span class="additions">+{{ stats.added }} additions</span>
          <span class="deletions">-{{ stats.removed }} deletions</span>
        </div>
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
  margin-bottom: 20px;
}

.github-style-stats {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #f6f8fa;
  border: 1px solid #d1d9e0;
  border-radius: 6px 6px 0 0;
  font-size: 12px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
}

.additions {
  color: #1a7f37;
  font-weight: 600;
}

.deletions {
  color: #d1242f;
  font-weight: 600;
}
</style> 