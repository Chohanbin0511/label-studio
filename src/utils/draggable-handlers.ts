import Sortable from "sortablejs";

/**
 * SortableJS를 사용하여 요소를 드래그 가능하게 만드는 Vue 3 디렉티브
 * @param {HTMLElement} el - 드래그 가능하게 만들 요소
 * @param {Object} binding - Vue 디렉티브 바인딩 객체
 * @param {Array} binding.value - 드래그 옵션 배열
 */
export const vDraggable = {
    mounted(el: HTMLElement, binding: any) { 
        const options = binding.value;
        for (let oi = 0; oi < options.length; oi++) {
            const o = options[oi]; 
            new Sortable(el.querySelector(o.selector), o.option);
        }
    },
};

/**
 * 테이블 행 드래그 옵션을 생성합니다
 * @param {Function} onEndCallback - 드래그 종료 시 호출될 콜백 함수
 * @returns {Array} 드래그 옵션 배열
 */
export const createDragOptions = (onEndCallback: any) => [
    {
        selector: "tbody", // 테이블 행 드래그 지원
        option: {
            // SortableJS 옵션
            animation: 150,
            forceFallback: true,  // HTML5 DragDrop 대신 fallback 사용
            fallbackTolerance: 0, // 마우스 이동 임계값
            touchStartThreshold: 0, // 터치 시작 임계값
            delay: 0, // 드래그 시작 지연시간
            delayOnTouchStart: false, // 터치에서 지연 비활성화
            onEnd: (evt: any) => {
                console.log("드래그 종료 - 이전 인덱스:", evt.oldIndex, "새 인덱스:", evt.newIndex);
                
                // vue에서 전달받은 콜백 실행
                onEndCallback(evt);
            },
        },
    },
];
