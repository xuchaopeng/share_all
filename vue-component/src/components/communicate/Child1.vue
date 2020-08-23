<template>
  <div class="com-child1">
    <h3>Child1</h3>
    <p>{{ title }}</p>
    <p>{{ $attrs.name }}</p>
    <p v-bind="$attrs"></p>
    <p>{{ msg }}</p>
    <Grandchild1></Grandchild1>
  </div>
</template>

<script>
import Grandchild1 from '@/components/communicate/grandchild1.vue'
export default {
  name: 'com-child1',
  inheritAttrs: false,
  props: {
    title: {
      type: String,
    },
  },
  data() {
    return {
      msg: 'A',
    }
  },
  mounted() {
    this.$parent.$on('foo', (a) => {
      this.msg = a
    })
  },
  methods: {},
  components: {
    Grandchild1,
  },
}
</script>

<style lang="less" scoped>
.com-child1 {
  border: 2px solid blue;
  font-size: 14px;
  padding: 5px;
  p {
    margin: 0;
    font-size: 14px;
    line-height: 20px;
  }
  h3 {
    font-size: 16px;
  }
}
</style>
