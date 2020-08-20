<template>
  <div class="slot-v2">
    <h4>slot-child2 -- 具名插槽</h4>

    <p>
      <slot></slot>
    </p>

    <p>其它内容.......</p>

    <slot name="content"></slot>
  </div>
</template>

<script>
export default {
  name: 'slot-child2',
}
</script>

<style scoped>
.slot-v2 {
  border: 2px solid blue;
  font-size: 14px;
  padding: 5px;
  margin-bottom: 10px;
}
</style>
