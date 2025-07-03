<script setup lang="ts">
import { ElMessage } from "element-plus";
import { ref } from "vue";
import { vDraggable, createDragOptions } from '@/utils/draggable-handlers';

// 커스텀 onEnd 콜백 함수 정의
const handleDragEnd = (evt: any) => {
    ElMessage.success(
        `App.vue에서 처리: ${evt.oldIndex}번째 행을 ${evt.newIndex}번째로 이동`
    );
    console.log('App.vue에서 받은 드래그 이벤트:', evt);
    // 실제 데이터 순서 변경 (필요시)
    // const movedItem = data.value.splice(evt.oldIndex, 1)[0];
    // data.value.splice(evt.newIndex, 0, movedItem);
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
   key="id"
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