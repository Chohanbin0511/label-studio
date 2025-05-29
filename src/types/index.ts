// API 응답 타입
export interface ApiResponse<T = any> {
  data: T
  status: number
  message?: string
}

// 페이지네이션 응답 타입
export interface PaginatedResponse<T> extends ApiResponse {
  data: {
    items: T[]
    total: number
    page: number
    limit: number
  }
}

// 사용자 관련 타입
export interface User {
  id: number
  email: string
  name: string
  role: 'admin' | 'user'
  createdAt: string
  updatedAt: string
}

// 에러 타입
export interface ApiError {
  code: string
  message: string
  details?: Record<string, any>
}

// 공통 상태 타입
export type Status = 'idle' | 'loading' | 'success' | 'error'

// 공통 옵션 타입
export interface Option {
  label: string
  value: string | number
}

// 공통 필터 타입
export interface Filter {
  field: string
  value: string | number | boolean
  operator: 'eq' | 'contains' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'nin'
} 