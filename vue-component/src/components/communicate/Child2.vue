<template>
  <div class="com-child2">
    <h3>Child2</h3>
    <p>{{ title }}</p>
  </div>
</template>

<script>
export default {
  name: 'com-child2',
  data() {
    return {
      title: '',
    }
  },
}
</script>

<style lang="less" scoped>
.com-child2 {
  border: 2px solid blue;
  font-size: 14px;
  padding: 5px;
  h3 {
    font-size: 16px;
  }
}
</style>
