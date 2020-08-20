<template>
  <div id="app">
    <!-- 一、组件通信 -->
    <!-- <Communicate></Communicate> -->

    <!-- 二、组件插槽 -->
    <!-- <SlotTest></SlotTest> -->

    <!-- 三、混入 -->
    <Mixincom></Mixincom>

    <!-- 三、组件实践，表单实例 -->
    <!-- <form-test></form-test> -->

    <!-- 四、递归组件 -->
    <!-- <Recursion></Recursion> -->

    <!-- 五、全局弹窗组件 -->
    <!-- <Notice></Notice> -->

    <!-- 六、树形组件 -->
    <!-- <Tree></Tree> -->
  </div>
</template>

<script>
// import Communicate from '@/components/communicate'
// import SlotTest from '@/components/slots'
import Mixincom from '@/components/mixincom'
// import FormTest from '@/components/form'
// import Recursion from '@/components/recursion'
// import Notice from '@/components/notice';
// import Tree from '@/components/tree'

export default {
  name: 'app',
  // provide() {
  //   return {
  //     foo: 'foo',
  //   }
  // },
  components: {
    // Communicate,
    // SlotTest,
    Mixincom,
    // FormTest,
    // Recursion,
    // Notice,
    // Tree
  },
  mounted() {
    // this.$refs.hw.xx = 'xxxxxx'
    // 子组件实例的顺序不保证的
    // this.$children[0].xx = 'oo'
  },
  methods: {
    onMyClick() {
      console.log('myclick')
    },
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
