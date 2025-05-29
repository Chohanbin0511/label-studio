// LocalStorage 키
export const STORAGE_KEY = 'label-studio-annotations'

// 어노테이션 데이터 타입 정의
export interface AnnotationResult {
  id: string
  type: string
  value: {
    start: number
    end: number
    text: string
    labels: string[]
  }
  origin: string
  to_name: string
  from_name: string
}

export interface Annotation {
  id: string
  type?: string
  result: AnnotationResult[]
}

// 어노테이션 데이터를 저장하는 함수
export function saveAnnotations(annotations: Record<string, AnnotationResult[]>) {
  try {
    if (!annotations || typeof annotations !== 'object') {
      console.error('저장할 데이터가 유효하지 않음')
      return
    }
    
    const jsonString = JSON.stringify(annotations)
    console.log('저장할 데이터:', jsonString)
    
    localStorage.setItem(STORAGE_KEY, jsonString)
    console.log('어노테이션 저장 성공')
  } catch (error) {
    console.error('어노테이션 저장 실패:', error)
  }
}

// 어노테이션 데이터를 로드하는 함수
export function loadAnnotations(): Record<string, AnnotationResult[]> {
  try {
    const data = localStorage.getItem(STORAGE_KEY)
    console.log('LocalStorage에서 로드한 원본 데이터:', data)
    if (!data) {
      console.log('LocalStorage에 데이터가 없음')
      return {}
    }
    const parsed = JSON.parse(data)
    console.log('파싱된 데이터:', parsed)
    return parsed
  } catch (error) {
    console.error('LocalStorage 접근 에러:', error)
    return {}
  }
}

// 어노테이션 데이터 유효성 검사
export function isValidAnnotation(annotation: any): annotation is Annotation {
  // 기본적인 객체 검사
  if (!annotation || typeof annotation !== 'object') return false
  
  // id가 없어도 허용 (Label Studio가 자동으로 생성할 수 있음)
  if (annotation.id && typeof annotation.id !== 'string') return false
  
  // result 배열 검사
  if (!Array.isArray(annotation.result)) return false
  
  // result 배열의 각 항목 검사
  return annotation.result.every((result: any) => {
    if (!result || typeof result !== 'object') return false
    
    // 필수 필드 검사
    const hasRequiredFields = 
      result.type === 'labels' && // type이 'labels'인지 확인
      result.value && 
      typeof result.value === 'object' &&
      typeof result.value.start === 'number' &&
      typeof result.value.end === 'number' &&
      Array.isArray(result.value.labels)
    
    return hasRequiredFields
  })
}

// LocalStorage 초기화 함수
export function clearAnnotations() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    console.log('LocalStorage 초기화 완료')
  } catch (error) {
    console.error('LocalStorage 초기화 실패:', error)
  }
}

// 특정 어노테이션 삭제 함수
export function deleteAnnotation(taskId: string) {
  try {
    const savedAnnotations = loadAnnotations()
    console.log('삭제 전 데이터:', savedAnnotations)
    
    if (savedAnnotations[taskId]) {
      delete savedAnnotations[taskId]
      console.log('삭제 후 데이터:', savedAnnotations)
      saveAnnotations(savedAnnotations)
      console.log('어노테이션 삭제 완료')
      return true
    } else {
      console.log('삭제할 어노테이션이 존재하지 않음:', taskId)
      return false
    }
  } catch (error) {
    console.error('어노테이션 삭제 중 오류 발생:', error)
    return false
  }
} 