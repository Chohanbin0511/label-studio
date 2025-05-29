# Label Studio Vue Integration

Label Studio를 Vue 3와 TypeScript로 통합한 데이터 라벨링 애플리케이션입니다.

## Label Studio 소개

Label Studio는 다양한 데이터 유형(이미지, 텍스트, 오디오 등)에 라벨을 붙일 수 있는 오픈소스 데이터 라벨링 툴입니다. 이 프로젝트에서는 Label Studio의 JavaScript SDK를 Vue 3 환경에 통합하여 사용합니다.

### 버전 정보

현재 프로젝트에서 사용 중인 Label Studio 버전:
```json
{
  "dependencies": {
    "label-studio": "^1.18.0"
  }
}
```

> **참고**: Label Studio는 HumanSignal에서 관리하는 오픈소스 프로젝트입니다. 최신 업데이트와 문서는 [Label Studio 공식 GitHub](https://github.com/HumanSignal/label-studio)에서 확인할 수 있습니다.

### 확장성 및 미래 계획

Label Studio는 지속적으로 발전하고 있으며, 다음과 같은 확장 가능성을 제공합니다:

### 주요 기능

- Vue 3 + TypeScript 기반
- Label Studio 통합
  - 텍스트 데이터 라벨링
  - 다중 라벨 지원
  - 실시간 어노테이션 업데이트
  - 커스텀 이벤트 핸들링
- LocalStorage를 활용한 어노테이션 데이터 저장
- 다국어 지원 (i18n)
- Pinia 상태 관리
- ESLint + Prettier 코드 스타일 관리

### Label Studio 설치

```bash
pnpm add label-studio
```

### Label Studio 기본 사용법

```typescript
import LabelStudio from 'label-studio'
import 'label-studio/build/static/css/main.css'

// Label Studio 초기화
const labelStudio = new LabelStudio(element, {
  config: configString,  // 라벨링 설정
  interfaces: ['panel', 'update', 'submit'],  // 사용할 인터페이스
  task: {
    data: { text: '라벨링할 텍스트' },
    annotations: [],
    predictions: []
  }
})
```

### Label Studio 이벤트

Label Studio는 다음과 같은 주요 이벤트를 제공합니다:

- `onLabelStudioLoad`: Label Studio 로드 완료
- `onSubmitAnnotation`: 어노테이션 제출
- `onUpdateAnnotation`: 어노테이션 업데이트
- `onDeleteAnnotation`: 어노테이션 삭제
- `onSkipTask`: 태스크 스킵
- `onSelectAnnotation`: 어노테이션 선택

## 시작하기

### 필수 조건

- Node.js 16.0.0 이상
- pnpm 7.0.0 이상

### 설치

```bash
# 의존성 설치
pnpm install

# 개발 서버 실행
pnpm dev

# 프로덕션 빌드
pnpm build

# 린트 검사
pnpm lint
```

## 프로젝트 구조

```
src/
├── api/           # API 통신 관련 코드
├── assets/        # 정적 자원
├── components/    # 재사용 가능한 컴포넌트
│   └── LabelStudioExample.vue  # Label Studio 통합 컴포넌트
├── constants/     # 상수 정의
│   └── label-studio.ts         # Label Studio 관련 상수
├── i18n/          # 다국어 지원
├── layouts/       # 레이아웃 컴포넌트
├── pages/         # 페이지 컴포넌트
├── router/        # 라우터 설정
├── stores/        # Pinia 스토어
├── types/         # TypeScript 타입 정의
├── utils/         # 유틸리티 함수
│   ├── label-studio.ts         # Label Studio 유틸리티
│   └── label-studio-handlers.ts # 이벤트 핸들러
├── App.vue        # 루트 컴포넌트
└── main.ts        # 애플리케이션 진입점
```

## 주요 컴포넌트 설명

### LabelStudioExample

Label Studio의 핵심 기능을 구현한 컴포넌트입니다.

- 텍스트 데이터 라벨링
- 어노테이션 저장 및 로드
- 실시간 어노테이션 업데이트
- 다중 라벨 지원

### 유틸리티

- `label-studio.ts`: 어노테이션 데이터 관리 유틸리티
- `label-studio-handlers.ts`: Label Studio 이벤트 핸들러

### 상수

- `label-studio.ts`: 라벨 색상, 인터페이스 설정, 샘플 데이터 등

## 환경 변수

`.env` 파일에서 다음 환경 변수를 설정할 수 있습니다:

- `VITE_APP_TITLE`: 애플리케이션 제목
- `VITE_API_BASE_URL`: API 기본 URL

## 개발 가이드

### 새로운 라벨 추가

`src/constants/label-studio.ts`에서 라벨 색상과 설정을 수정할 수 있습니다:

```typescript
export type LabelType = '빨간' | '주황' | '파랑' | '초록' | '보라'
export const labelColors: Record<LabelType, string> = {
  '빨간': '#ff0000',
  '주황': '#ff9800',
  // ... 추가 라벨
}
```

### 어노테이션 데이터 관리

`src/utils/label-studio.ts`에서 어노테이션 데이터 관리 함수를 수정할 수 있습니다:

- `saveAnnotations`: 어노테이션 저장
- `loadAnnotations`: 어노테이션 로드
- `isValidAnnotation`: 어노테이션 유효성 검사
- `clearAnnotations`: 어노테이션 초기화

## 라이선스

MIT 