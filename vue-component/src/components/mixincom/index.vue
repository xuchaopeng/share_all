<template>
  <div>
    <Comp1></Comp1>
    <div class="line"></div>
    <Comp2></Comp2>
  </div>
</template>

<script>
import Comp1 from '@/components/mixincom/comp1.vue'
import Comp2 from '@/components/mixincom/comp2.vue'
export default {
  components: {
    Comp1,
    Comp2,
  },
}
</script>

<style lang="less" scoped>
.line {
  height: 10px;
  width: 100%;
}
</style>
