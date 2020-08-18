<template>
  <div class="com-grandchild1">
    <h3>Grandchild1</h3>
    <p></p>
  </div>
</template>

<script>
export default {
  name: 'com-grandchild1',
}
</script>

<style lang="less" scoped>
.com-grandchild1 {
  border: 2px solid #8f8f8f;
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
