<template>
  <div id="communicate" class="communicate">
    <h3>communicate-{{ v }} {{ msg }}</h3>
    <button class="btns" @click="fbxx">发布$bus消息</button>
    <!-- 第一个子组件 -->
    <Child1 :title="title1" name1="c1---" name2="c2---"></Child1>
    <div class="line"></div>
    <!-- 第二个子组件 -->
    <Child2 ref="c2" @add="addHandler"></Child2>
  </div>
</template>

<script>
import Child1 from '@/components/communicate/child1.vue';
import Child2 from '@/components/communicate/child2.vue';
export default {
  name: 'communicate',
  provide() {
    return {
      mvp: '来自父级组件的慰问-----',
    };
  },
  components: {
    Child1,
    Child2,
  },
  data() {
    return {
      title1: 'child1的title---888',
      v: '',
      msg: '',
    };
  },
  mounted() {
    this.$refs.c2.title = '大佬们99999999';
    // 当存在异步组件的时候，顺序是不保证。children是一个数组，每个成员存放的是当前子组件的实例化对象，但是psuh 的进去的顺序是按照组件渲染的顺序。
    this.$children[1].title = 'child2的title---';
    // 订阅dispatch来接收消息
    this.$on('dispatch', (msg) => {
      this.msg = '接收dispatch消息:' + msg;
    });
  },
  methods: {
    fbxx() {
      this.$bus.$emit('event-bus', '来自远方的问候');
    },
    addHandler(v) {
      this.v = '有来自子组件child2的消息' + v;
    },
  },
};
</script>
<style lang="less" scoped>
.communicate {
  border: 2px solid #ec4b4b;
  padding: 8px;
}
.line {
  height: 5px;
}
</style>
