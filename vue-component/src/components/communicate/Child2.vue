<template>
  <div class="com-child2">
    <h3>Child2</h3>
    <p>{{ title }}</p>
    <button @click="clickhandler1">通讯父组件</button>
    <button @click="clickhandler2">通讯child1</button>
  </div>
</template>

<script>
export default {
  name: 'com-child2',
  data() {
    return {
      title: '',
    };
  },
  methods: {
    clickhandler1() {
      this.$emit('add', 'B');
    },
    clickhandler2() {
      this.$parent.$emit('foo', '来自child2的慰问----');
    },
  },
};
</script>

<style lang="less" scoped>
.com-child2 {
  border: 2px solid blue;
  font-size: 14px;
  padding: 5px;
  h3 {
    font-size: 20px;
  }
}
</style>
