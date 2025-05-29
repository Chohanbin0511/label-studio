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
    text: `Label Studio는 다양한 데이터 유형에 라벨을 붙일 수 있는 강력한 도구입니다.
      텍스트, 이미지, 오디오, 비디오 등 다양한 형식을 지원합니다.
      이 예시에서는 텍스트 라벨링의 기본 기능을 보여드립니다.
      드래그하여 텍스트를 선택하고 원하는 라벨을 지정할 수 있습니다.
      여러 개의 라벨을 동시에 지정할 수도 있습니다.
      라벨링 결과는 실시간으로 저장되며 나중에 다시 불러올 수 있습니다.
      이 도구는 데이터 과학, 머신러닝, 자연어 처리 등 다양한 분야에서 활용됩니다.
      사용자 친화적인 인터페이스로 누구나 쉽게 사용할 수 있습니다.
      커스텀 라벨과 설정을 통해 프로젝트에 맞게 조정할 수 있습니다.`
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