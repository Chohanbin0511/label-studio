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
    text: `Label Studio는 다양한 데이터 유형(이미지, 텍스트, 오디오 등)에 라벨을 붙일 수 있는 오픈소스 데이터 라벨링 툴입니다.\n\n이 예시는 긴 텍스트에서 특정 구간을 선택해 라벨을 지정할 수 있습니다. 원하는 부분을 드래그해서 라벨을 붙여보세요.`
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