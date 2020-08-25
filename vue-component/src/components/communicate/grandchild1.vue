<template>
  <div class="com-grandchild1">
    <h3>Grandchild1</h3>
    <p>{{ mvp }}</p>
    <p>{{ msg }}</p>
    <button @click="clickhandler">派发消息</button>
  </div>
</template>

<script>
export default {
  name: 'com-grandchild1',
  inject: ['mvp'],
  data() {
    return {
      msg: '',
    }
  },
  methods: {
    clickhandler() {
      this.$dispatch('dispatch', '来自GrandGrandChild1的消息派发')
    },
  },
  mounted() {
    this.$bus.$on('event-bus', (msg) => {
      this.msg = '接收event-bus消息:' + msg
    })
  },
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
