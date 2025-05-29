import { createI18n } from 'vue-i18n'

const messages = {
  ko: {
    common: {
      welcome: '환영합니다',
      login: '로그인',
      logout: '로그아웃',
      signup: '회원가입',
      search: '검색',
      cancel: '취소',
      confirm: '확인',
      save: '저장',
      delete: '삭제',
      edit: '수정',
    },
    validation: {
      required: '{field}은(는) 필수 항목입니다',
      email: '올바른 이메일 형식이 아닙니다',
      minLength: '{field}은(는) 최소 {length}자 이상이어야 합니다',
      maxLength: '{field}은(는) 최대 {length}자까지 입력 가능합니다',
    },
    error: {
      network: '네트워크 오류가 발생했습니다',
      server: '서버 오류가 발생했습니다',
      unknown: '알 수 없는 오류가 발생했습니다',
    },
  },
  en: {
    common: {
      welcome: 'Welcome',
      login: 'Login',
      logout: 'Logout',
      signup: 'Sign Up',
      search: 'Search',
      cancel: 'Cancel',
      confirm: 'Confirm',
      save: 'Save',
      delete: 'Delete',
      edit: 'Edit',
    },
    validation: {
      required: '{field} is required',
      email: 'Please enter a valid email address',
      minLength: '{field} must be at least {length} characters',
      maxLength: '{field} must be at most {length} characters',
    },
    error: {
      network: 'Network error occurred',
      server: 'Server error occurred',
      unknown: 'An unknown error occurred',
    },
  },
}

export const i18n = createI18n({
  legacy: false,
  locale: localStorage.getItem('locale') || 'ko',
  fallbackLocale: 'en',
  messages,
}) 