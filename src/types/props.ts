import type { Status } from './index'

// 버튼 컴포넌트 props
export interface ButtonProps {
  type?: 'button' | 'submit' | 'reset'
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
  loading?: boolean
  block?: boolean
  onClick?: () => void
}

// 입력 필드 컴포넌트 props
export interface InputProps {
  type?: 'text' | 'password' | 'email' | 'number' | 'tel'
  label?: string
  placeholder?: string
  value?: string | number
  disabled?: boolean
  readonly?: boolean
  error?: string
  required?: boolean
  onChange?: (value: string) => void
  onBlur?: () => void
}

// 카드 컴포넌트 props
export interface CardProps {
  title?: string
  subtitle?: string
  loading?: boolean
  status?: Status
  onClick?: () => void
}

// 모달 컴포넌트 props
export interface ModalProps {
  isOpen: boolean
  title?: string
  onClose: () => void
  onConfirm?: () => void
  confirmText?: string
  cancelText?: string
  loading?: boolean
}

// 테이블 컴포넌트 props
export interface TableProps<T> {
  columns: {
    key: string
    label: string
    render?: (item: T) => React.ReactNode
  }[]
  data: T[]
  loading?: boolean
  emptyText?: string
  onRowClick?: (item: T) => void
} 