<template>
  <div>
    <button @click="clickMe">点击全局弹窗组件</button>
  </div>
</template>

<script>
import Notice from '@/components/notice/notice.vue'
export default {
  methods: {
    clickMe() {
      this.$create(Notice, {
        title: '大佬喊你来搬砖',
        message: '弹出消息提示',
        duration: 2000,
      }).show()
    },
  },
}
</script>

<style lang="less" scoped></style>
