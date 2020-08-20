<template>
  <div>
    <Child1></Child1>

    <div class="line"></div>

    <Child2></Child2>
  </div>
</template>

<script>
import Child1 from '@/components/mixincom/child1.vue'
import Child2 from '@/components/mixincom/child2.vue'
export default {
  name: 'mixin',
  components: {
    Child1,
    Child2,
  },
}
</script>

<style lang="less" scoped>
.line {
  height: 10px;
  width: 100%;
}
</style>
