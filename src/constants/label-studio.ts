// 라벨 색상 매핑
export type LabelType = '빨간' | '주황' | '파랑' | '초록' | '보라'
export const labelColors: Record<LabelType, string> = {
  '빨간': '#ff0000',
  '주황': '#ff9800',
  '파랑': '#2196f3',
  '초록': '#00ff00',
  '보라': '#800080'
}

// Label Studio 인터페이스 설정
export const LABEL_STUDIO_INTERFACES = [
  'panel',
  'update',
  'submit',
  'controls',
  'annotations:menu',
  'annotations:add-new',
  'annotations:delete'
] as const

// 샘플 텍스트 설정
export const sampleTextConfig = `
  <View>
    <Labels name="label" toName="text">
      <Label value="빨간" background="#ff0000"/>
      <Label value="주황" background="#ff9800"/>
      <Label value="파랑" background="#2196f3"/>
      <Label value="초록" background="#00ff00"/>
      <Label value="보라" background="#800080"/>
    </Labels>
    <Text name="text" value="$text"/>
  </View>
`

// 샘플 텍스트 태스크
export const sampleTextTask = {
  data: {
    id: 'text-task-1',
    text: `너와 걸을 때면
      난 내가 사랑하는 걸 느껴
      너와 발을 맞출 때 yeah
      이렇게 기분 좋은 걸
      향기로운 풍경
      일렁이는 물결
      I feel like something new
      언제 어디든 곁에 있을게
      우린 같은 걸 보면서
      이렇게 네가 날 안아주면
      말을 건네지 않아도
      서로를 바라봐 주면서
      웃어줘
      함께 하는 순간
      한번 더 안아줘
      Everyday and night
      널 처음 만났을 때
      우리가 영원할 거란 걸
      난 가끔 걱정이 돼
      세상이 너와 날 외면할 때
      그래 사실 난 겁쟁이야
      좀 예민하고 소심할 뿐인데
      하지만 괜찮아 넌 유일한 내 편
      다시 태어나면
      내가 먼저 널 안아줄게
      우린 같은 걸 보면서 (약속해)
      이렇게 네가 날 안아주면
      말을 건네지 않아도
      서로를 바라봐 주면서
      웃어줘 (웃어줘)
      함께 하는 순간
      한번 더 안아줘
      Everyday and night, ooh-ooh, yeah, ooh`
  },
  annotations: [
    {
      id: '2',
      result: [
        {
          id: 'r2',
          type: 'labels',
          value: {
            start: 0,
            end: 13,
            text: 'Label Studio는',
            labels: ['빨간', '주황', '파랑', '초록', '보라']
          },
          origin: 'manual',
          to_name: 'text',
          from_name: 'label',
        }
      ]
    }
  ],
  predictions: [],
  config: sampleTextConfig
} 