<template>
  <div class="diff-viewer">
    <div class="controls">
      <h2>Diff Viewer</h2>
      
      <!-- File Upload Section -->
      <div class="upload-section">
        <div class="file-input-group">
          <label for="file1">Original File:</label>
          <input 
            id="file1" 
            type="file" 
            @change="handleFile1Change" 
            accept=".txt,.js,.ts,.vue,.html,.css,.json,.md"
          />
        </div>
        
        <div class="file-input-group">
          <label for="file2">Modified File:</label>
          <input 
            id="file2" 
            type="file" 
            @change="handleFile2Change" 
            accept=".txt,.js,.ts,.vue,.html,.css,.json,.md"
          />
        </div>
      </div>

      <!-- Text Input Section -->
      <div class="text-input-section">
        <div class="text-input-group">
          <label for="text1">Original Text:</label>
          <textarea 
            id="text1"
            v-model="originalText" 
            placeholder="Enter original text here..."
            rows="8"
          ></textarea>
        </div>
        
        <div class="text-input-group">
          <label for="text2">Modified Text:</label>
          <textarea 
            id="text2"
            v-model="modifiedText" 
            placeholder="Enter modified text here..."
            rows="8"
          ></textarea>
        </div>
      </div>

      <!-- Options -->
      <div class="options">
        <div class="option-group">
          <label>
            <input 
              v-model="options.drawFileList" 
              type="checkbox"
            />
            Show File List
          </label>
        </div>
        
        <div class="option-group">
          <label>
            <input 
              v-model="options.matching" 
              type="radio" 
              value="lines"
            />
            Line Matching
          </label>
          <label>
            <input 
              v-model="options.matching" 
              type="radio" 
              value="words"
            />
            Word Matching
          </label>
        </div>

        <div class="option-group">
          <label>
            Output Format:
            <select v-model="options.outputFormat">
              <option value="line-by-line">Line by Line</option>
              <option value="side-by-side">Side by Side</option>
            </select>
          </label>
        </div>

        <button @click="generateDiff" :disabled="!canGenerateDiff">
          Generate Diff
        </button>
        
        <button @click="clearAll">
          Clear All
        </button>
      </div>
    </div>

    <!-- Diff Display -->
    <div class="diff-container">
      <div v-if="loading" class="loading">
        Generating diff...
      </div>
      
      <div v-else-if="error" class="error">
        {{ error }}
      </div>
      
      <div 
        v-else-if="diffHtml" 
        ref="diffContainer"
        class="diff-content"
        v-html="diffHtml"
      ></div>
      
      <div v-else class="placeholder">
        Upload files or enter text to see the diff
      </div>
    </div>

    <!-- Statistics -->
    <div v-if="stats" class="stats">
      <h3>Diff Statistics</h3>
      <div class="stats-grid">
        <div class="stat-item">
          <span class="stat-label">Files Changed:</span>
          <span class="stat-value">{{ stats.filesChanged }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Lines Added:</span>
          <span class="stat-value added">+{{ stats.linesAdded }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Lines Deleted:</span>
          <span class="stat-value deleted">-{{ stats.linesDeleted }}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Lines Modified:</span>
          <span class="stat-value modified">{{ stats.linesModified }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
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
  matching: 'lines' as 'lines' | 'words',
  outputFormat: 'line-by-line' as 'line-by-line' | 'side-by-side'
})

// Statistics
const stats = ref<{
  filesChanged: number
  linesAdded: number
  linesDeleted: number
  linesModified: number
} | null>(null)

// Computed properties
const canGenerateDiff = computed(() => {
  return originalText.value.trim() !== '' && modifiedText.value.trim() !== ''
})

// File handling functions
const handleFile1Change = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    try {
      originalText.value = await readFileAsText(file)
    } catch (err) {
      error.value = 'Error reading original file: ' + (err as Error).message
    }
  }
}

const handleFile2Change = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    try {
      modifiedText.value = await readFileAsText(file)
    } catch (err) {
      error.value = 'Error reading modified file: ' + (err as Error).message
    }
  }
}

const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      resolve(e.target?.result as string)
    }
    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }
    reader.readAsText(file)
  })
}

// Diff generation
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
      matching: options.value.matching,
      outputFormat: options.value.outputFormat,
      synchronisedScroll: true,
      highlight: true,
      fileListToggle: true,
      fileListStartVisible: false,
      fileContentToggle: true,
      maxLineSizeInBlockForComparison: 200,
      maxLineLengthHighlight: 10000,
      renderNothingWhenEmpty: false,
      compiledTemplates: {},
      rawTemplates: {
        'generic-wrapper': `<div class="d2h-wrapper">
          {{#fileList}}
            {{{fileList}}}
          {{/fileList}}
          {{#files}}
            {{{diffs}}}
          {{/files}}
        </div>`,
      }
    }

    // Generate HTML
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
  let linesAdded = 0
  let linesDeleted = 0
  let linesModified = 0
  
  for (const line of lines) {
    if (line.startsWith('+') && !line.startsWith('+++')) {
      linesAdded++
    } else if (line.startsWith('-') && !line.startsWith('---')) {
      linesDeleted++
    }
  }
  
  // Simple heuristic for modified lines
  linesModified = Math.min(linesAdded, linesDeleted)
  linesAdded -= linesModified
  linesDeleted -= linesModified
  
  stats.value = {
    filesChanged: 1,
    linesAdded,
    linesDeleted,
    linesModified
  }
}

// Utility functions
const clearAll = () => {
  originalText.value = ''
  modifiedText.value = ''
  diffHtml.value = ''
  error.value = ''
  stats.value = null
  
  // Clear file inputs
  const fileInputs = document.querySelectorAll('input[type="file"]') as NodeListOf<HTMLInputElement>
  fileInputs.forEach(input => {
    input.value = ''
  })
}

// Sample data for demonstration
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
}

// Watch for automatic diff generation
watch([originalText, modifiedText], () => {
  if (canGenerateDiff.value) {
    // Debounce automatic generation
    setTimeout(() => {
      if (canGenerateDiff.value) {
        generateDiff()
      }
    }, 1000)
  }
}, { debounce: 500 })

// Lifecycle
onMounted(() => {
  // Load sample data for demonstration
  loadSampleData()
})

// Expose methods for parent component
defineExpose({
  generateDiff,
  clearAll,
  loadSampleData
})
</script>

<style scoped>
.diff-viewer {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.controls {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.controls h2 {
  margin: 0 0 20px 0;
  color: #333;
}

.upload-section,
.text-input-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.file-input-group,
.text-input-group {
  display: flex;
  flex-direction: column;
}

.file-input-group label,
.text-input-group label {
  font-weight: 600;
  margin-bottom: 8px;
  color: #555;
}

.file-input-group input[type="file"] {
  padding: 8px;
  border: 2px dashed #ddd;
  border-radius: 4px;
  background: white;
}

.text-input-group textarea {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 14px;
  resize: vertical;
}

.options {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: center;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.option-group {
  display: flex;
  gap: 10px;
  align-items: center;
}

.option-group label {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 14px;
  cursor: pointer;
}

.option-group select {
  padding: 6px 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-left: 8px;
}

button {
  padding: 10px 16px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;
}

button:hover:not(:disabled) {
  background: #0056b3;
}

button:disabled {
  background: #6c757d;
  cursor: not-allowed;
}

button + button {
  margin-left: 10px;
  background: #6c757d;
}

button + button:hover:not(:disabled) {
  background: #545b62;
}

.diff-container {
  border: 1px solid #ddd;
  border-radius: 8px;
  min-height: 400px;
  background: white;
  overflow: auto;
}

.loading,
.error,
.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 400px;
  font-size: 16px;
}

.loading {
  color: #007bff;
}

.error {
  color: #dc3545;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  border-radius: 4px;
  margin: 20px;
  padding: 20px;
}

.placeholder {
  color: #6c757d;
  font-style: italic;
}

.diff-content {
  padding: 0;
}

.stats {
  margin-top: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.stats h3 {
  margin: 0 0 15px 0;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 15px;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background: white;
  border-radius: 4px;
  border-left: 4px solid #007bff;
}

.stat-label {
  font-weight: 500;
  color: #555;
}

.stat-value {
  font-weight: 600;
  font-size: 16px;
}

.stat-value.added {
  color: #28a745;
}

.stat-value.deleted {
  color: #dc3545;
}

.stat-value.modified {
  color: #ffc107;
}

/* Responsive design */
@media (max-width: 768px) {
  .upload-section,
  .text-input-section {
    grid-template-columns: 1fr;
  }
  
  .options {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
  }
}

/* Override diff2html styles for better integration */
:deep(.d2h-wrapper) {
  font-family: 'Courier New', monospace;
}

:deep(.d2h-file-header) {
  background: #f1f3f4;
  border-bottom: 1px solid #d1d5da;
}

:deep(.d2h-code-line-add) {
  background: #e6ffed;
}

:deep(.d2h-code-line-del) {
  background: #ffeef0;
}

:deep(.d2h-code-line-ctn) {
  background: #f8f9fa;
}
</style> 