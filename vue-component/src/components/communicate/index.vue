<template>
  <div id="communicate" class="communicate">
    <h3>communicate----{{ mvp }}</h3>
    <button class="btns" @click="fbxx">发布$bus消息</button>
    <!-- 第一个子组件 -->
    <Child1 :title="title1" name="c1"></Child1>
    <div class="line"></div>
    <!-- 第二个子组件 -->
    <Child2 ref="c2"></Child2>
  </div>
</template>

<script>
import Child1 from '@/components/communicate/child1.vue'
import Child2 from '@/components/communicate/child2.vue'
export default {
  name: 'communicate',
  provide() {
    return {
      mvp: 'AAA',
    }
  },
  components: {
    Child1,
    Child2,
  },
  data() {
    return {
      title1: 'child1的title',
    }
  },
  mounted() {
    this.$refs.c2.title = '大佬们'
    // this.$children[1].title = 'child2的title';
  },
  methods: {
    fbxx() {
      this.$bus.$emit('event-bus', '来自远方的问候')
    },
  },
}
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
