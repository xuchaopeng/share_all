<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
export default {
  provide() {
    return {
      // this指的是表单组件实例
      form: this
    };
  },
  props: {
    model: {
      type: Object,
      required: true
    },
    rules: {
      type: Object
    }
  },
  methods: {
    validate(cb) {
      // 调用所有formitem的validate，只要一个失败就失败
      // 结果是Promise数组
      const tasks = this.$children
        .filter(item => !!item.prop) // 留下带prop属性的formitem
        .map(item => item.validate());
      // 判断所有结果
      Promise.all(tasks)
        .then(() => cb(true)) // 校验通过
        .catch(() => cb(false));// 校验失败
    }
  }
};
</script>

<style lang="scss" scoped>
</style>