<template>
  <div class="slot-v1">
    <h4>slot-child1 -- 匿名插槽</h4>
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'slot-child1',
}
</script>

<style scoped>
.slot-v1 {
  border: 2px solid blue;
  font-size: 14px;
  padding: 5px;
  margin-bottom: 10px;
}
</style>
