import { STORAGE_KEY, saveAnnotations, loadAnnotations, deleteAnnotation } from './label-studio'

export function createLabelStudioHandlers(task: any, resultText: any) {
  // 선택된 어노테이션을 저장할 변수
  let selectedAnnotation: any = null

  return {
    onLabelStudioLoad: (LS: any) => {
      console.log('Label Studio 로드 완료')
      // 마지막 어노테이션이 있고 selectedAnnotation이 null이면 자동 선택
      if (task.annotations && task.annotations.length > 0 && !selectedAnnotation) {
        const lastAnnotation = task.annotations[task.annotations.length - 1]
        selectedAnnotation = lastAnnotation
        resultText.value = lastAnnotation
        console.log('마지막 어노테이션 자동 선택:', lastAnnotation)
      }
    },

    onSubmitAnnotation: (LS: any, annotation: any) => {
      selectedAnnotation = annotation
      const serialized = annotation.serializeAnnotation()
      
      
      try {
        const savedAnnotations = loadAnnotations()
        console.log('onSubmit savedAnnotations ::', savedAnnotations)
        const taskId = annotation.id
        
        if (serialized && Array.isArray(serialized)) {
          savedAnnotations[taskId] = serialized
        } else if (serialized && serialized.result && Array.isArray(serialized.result)) {
          savedAnnotations[taskId] = serialized.result
        } else {
          console.error('유효하지 않은 어노테이션 데이터:', serialized)
          return
        }
        
        saveAnnotations(savedAnnotations)
        
        task.annotations = [{
          id: taskId,
          result: savedAnnotations[taskId]
        }]
        resultText.value = annotation
        resultText.value._initialAnnotationObj = serialized
      } catch (error) {
        console.error('어노테이션 저장 중 오류 발생:', error)
      }
    },

    onUpdateAnnotation: (LS: any, annotation: any) => {
      const serialized = annotation.serializeAnnotation()
      console.log('serialized ::', serialized)
      
      
      try {
        const savedAnnotations = loadAnnotations()
        console.log('onUpdate savedAnnotations ::', savedAnnotations)
        const taskId = selectedAnnotation?.pk ? selectedAnnotation.pk : selectedAnnotation.id
        
        if (serialized && Array.isArray(serialized)) {
          savedAnnotations[taskId] = serialized
        } else if (serialized && serialized.result && Array.isArray(serialized.result)) {
          savedAnnotations[taskId] = serialized.result
        } else {
          console.error('유효하지 않은 어노테이션 데이터:', serialized)
          return
        }
        
        saveAnnotations(savedAnnotations)
        
        task.annotations = [{
          id: taskId,
          result: savedAnnotations[taskId]
        }]

        resultText.value = annotation
        resultText.value._initialAnnotationObj = serialized
      } catch (error) {
        console.error('어노테이션 업데이트 중 오류 발생:', error)
      }
    },

    onDeleteAnnotation: (LS: any, annotation: any) => {
      resultText.value = null
      
      try {
        // 선택된 어노테이션이 있으면 그 정보를 사용
        const taskId = selectedAnnotation?.pk
        
        const isDeleted = deleteAnnotation(taskId)
        if (isDeleted) {
          console.log('어노테이션 삭제 성공')
          selectedAnnotation = null // 삭제 후 선택된 어노테이션 초기화
        } else {
          console.log('어노테이션 삭제 실패 - 저장된 데이터와 taskId가 일치하지 않을 수 있음')
        }
      } catch (error) {
        console.error('어노테이션 삭제 중 오류 발생:', error)
      }
    },

    onSkipTask: (LS: any) => {
      console.log('태스크 스킵:', LS)
    },

    onSelectAnnotation: (LS: any) => {
      resultText.value = LS
      // 선택된 어노테이션 저장
      selectedAnnotation = LS
      console.log('선택된 어노테이션 저장됨:', selectedAnnotation)
    }
  }
} 