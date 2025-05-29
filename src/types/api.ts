import type { ApiResponse, PaginatedResponse, User, Filter } from './index'

// API 요청 파라미터 타입
export interface QueryParams {
  page?: number
  limit?: number
  sort?: string
  order?: 'asc' | 'desc'
  filters?: Filter[]
}

// 인증 관련 타입
export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse extends ApiResponse {
  data: {
    token: string
    user: User
  }
}

// 사용자 관련 API 타입
export interface GetUsersResponse extends PaginatedResponse<User> {}
export interface GetUserResponse extends ApiResponse<User> {}
export interface CreateUserRequest {
  email: string
  name: string
  password: string
  role: User['role']
}
export interface UpdateUserRequest extends Partial<CreateUserRequest> {
  id: number
}

// API 에러 응답 타입
export interface ApiErrorResponse extends ApiResponse {
  data: {
    code: string
    message: string
    details?: Record<string, any>
  }
} 