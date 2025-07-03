<script setup lang="ts">
import { ref, nextTick, computed, watch } from 'vue'
import * as Diff2Html from 'diff2html'
import { createTwoFilesPatch } from 'diff'
import 'diff2html/bundles/css/diff2html.min.css'

// Props 정의
interface Props {
  originalText: string
  modifiedText: string
  originalLabel?: string
  modifiedLabel?: string
  outputFormat?: 'line-by-line' | 'side-by-side'
  showStats?: boolean
  // maxHeight?: string
  // loading?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  originalLabel: '현재 버전',
  modifiedLabel: '선택 버전',
  outputFormat: 'side-by-side',
  showStats: true,
  // maxHeight: '60vh',
  // loading: false
})

// Reactive state
const diffHtml = ref('')
const error = ref('')
const diffContainer = ref<HTMLElement>()

const stats = ref<{
  added: number
  removed: number
  changed: number
} | null>(null)

// Computed
const isDataReady = computed(() => {
  return props.originalText.trim() !== '' && props.modifiedText.trim() !== ''
})

// Diff generation
const generateDiff = async () => {
  if (!isDataReady.value) return
  
  error.value = ''
  
  try {
    await nextTick()
    
    // Create unified diff
    const patch = createTwoFilesPatch(
      props.originalLabel,
      props.modifiedLabel,
      props.originalText,
      props.modifiedText,
      'Prompt',
      'Prompt'
    )

    // Configure diff2html options
    const diff2htmlOptions: Diff2Html.Diff2HtmlConfig = {
      drawFileList: false,
      outputFormat: props.outputFormat,
    }

    // Generate HTML using diff2html
    diffHtml.value = Diff2Html.html(patch, diff2htmlOptions)
    
    // Calculate statistics
    if (props.showStats) {
      calculateStats(patch)
    }
    
  } catch (err) {
    error.value = 'Error generating diff: ' + (err as Error).message
    console.error('Diff generation error:', err)
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

// Watch for prop changes and regenerate diff
watch(
  () => [props.originalText, props.modifiedText, props.outputFormat],
  () => {
    if (isDataReady.value) {
      generateDiff()
    }
  },
  { immediate: true }
)

// Expose methods for parent component
defineExpose({
  generateDiff,
  stats: computed(() => stats.value)
})
</script>
<template>
  <div v-if="showStats && stats && diffHtml" class="github-style-stats">
    <span class="additions">+{{ stats.added }} additions</span>
    <span class="deletions">-{{ stats.removed }} deletions</span>
  </div>
  <div 
      v-if="diffHtml" 
      ref="diffContainer"
      v-html="diffHtml"
  ></div>
</template>

<style scoped>
.github-style-stats {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background-color: #f6f8fa;
  border: 1px solid #d1d9e0;
  border-radius: 6px 6px 0 0;
  font-size: 12px;
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