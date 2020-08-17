<template>
  <div class="com-child1">
    <h3>Child1</h3>
    <p>{{ title }}</p>
    <p>{{ $attrs.name }}</p>
    <p v-bind="$attrs"></p>
  </div>
</template>

<script>
export default {
  name: 'com-child1',
  // inheritAttrs: false,
  props: {
    title: {
      type: String,
    },
  },
  data() {
    return {}
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
    font-size: 12px;
    line-height: 16px;
  }
  h3 {
    font-size: 16px;
  }
}
</style>
