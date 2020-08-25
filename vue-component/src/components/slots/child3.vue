<template>
  <div class="slot-v3">
    <h3>slot-child3 --- 作用域插槽</h3>
    <!--  -->
    <slot :foo="foo1"></slot>
  </div>
</template>

<script>
export default {
  data() {
    return {
      foo1: 'slot-v3内的数据',
      a: '其它',
    }
  },
  mounted() {
    setTimeout(() => {
      this.foo1 = 'slot-v3内的数据-2秒后发生了改变'
    }, 2000)
  },
}
</script>

<style scoped>
.slot-v3 {
  border: 2px solid blue;
  font-size: 14px;
  padding: 5px;
}
</style>
