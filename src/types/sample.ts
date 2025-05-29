import type { Ref } from 'vue'

// 사용자 정보 타입
export interface User {
  id: string
  name: string
  email: string
  role: 'admin' | 'user'
  createdAt: string
}

// 할 일 항목 타입
export interface Todo {
  id: string
  title: string
  completed: boolean
  order: number
}

// 샘플 페이지 상태 타입
export interface SampleState {
  users: User[]
  todos: Todo[]
  loading: boolean
  error: string | null
}

// API 응답 타입
export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}

// 필터 옵션 타입
export interface FilterOption {
  label: string
  value: string
}

// 정렬 옵션 타입
export interface SortOption {
  field: keyof User | keyof Todo
  order: 'asc' | 'desc'
}

// 페이지네이션 타입
export interface Pagination {
  page: number
  limit: number
  total: number
}

// 컴포넌트 Props 타입
export interface UserListProps {
  users: User[]
  loading: boolean
  error: string | null
  pagination: Pagination
  onPageChange: (page: number) => void
}

export interface TodoListProps {
  todos: Todo[]
  loading: boolean
  error: string | null
  onToggle: (id: string) => void
  onReorder: (todos: Todo[]) => void
}

// 이벤트 타입
export interface TodoReorderEvent {
  oldIndex: number
  newIndex: number
} 