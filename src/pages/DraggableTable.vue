<script setup lang="ts">
import { ElMessage } from "element-plus";
import { ref } from "vue";
import { vDraggable, createDragOptions } from '@/utils/draggable-handlers';

// 테이블 리렌더링을 위한 key
const tableKey = ref(0);

// 커스텀 onEnd 콜백 함수 정의
const handleDragEnd = (evt: any) => {
    ElMessage.success(
        `DraggableTable에서 처리: ${evt.oldIndex}번째 행을 ${evt.newIndex}번째로 이동`
    );
    console.log('DraggableTable에서 받은 드래그 이벤트:', evt);
    console.log('변경 전 데이터:', data.value);
    
    const newData = JSON.parse(JSON.stringify(data.value));

    const movedItem = newData.splice(evt.oldIndex, 1)[0]; // 이동할 아이템 추출
    newData.splice(evt.newIndex, 0, movedItem); // 새 위치에 삽입
    data.value = newData; // 새로운 배열로 교체
    tableKey.value++; // 테이블 강제 리렌더링
    console.log("변경 후 데이터:", data.value);
};

// util.js의 함수를 사용해서 dragOptions 생성
const dragOptions = createDragOptions(handleDragEnd);

const columns = ref([
    { prop: "id", label: "ID" },
    { prop: "name", label: "Name" },
    { prop: "gender", label: "Gender" },
]);

const data = ref([
    { id: 1, name: "UserA", gender: "Male" },
    { id: 2, name: "UserB", gender: "Female" },
    { id: 3, name: "UserC", gender: "Male" },
    { id: 4, name: "UserD", gender: "Male" },
    { id: 5, name: "UserE", gender: "Female" },
    { id: 6, name: "UserF", gender: "Male" },
    { id: 7, name: "UserG", gender: "Male" },
    { id: 8, name: "UserH", gender: "Female" },
    { id: 9, name: "UserI", gender: "Female" },
]);
</script> 

<template>
<div class="draggable-table">
  <h2>Try to drag the row or column's header.</h2>
  <el-table 
   class="draggable-container"
   :key="tableKey"
   border
   v-draggable="dragOptions"
   :data="data"
  >
  
  <el-table-column    
    v-for="item in columns"
    :key="item.prop"
    :prop="item.prop"
    :label="item.label"
    />
  </el-table>
</div>
</template>

<style scoped>
.draggable-table {
  max-width: 100%;
  margin: 50px;
  padding: 20px;
}
.draggable-container {
  height: 100%;
  width: 100%;
}
</style>