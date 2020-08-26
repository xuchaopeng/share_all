<template>
  <div class="coms-mixin">
    <h3>mixin-comp1</h3>
    <!--  toggleview在本页面组件没有显性的定义，其实是通过混合融入（合并）进来的，-->
    <button class="btn" @click="toggleview">按我展示</button>
    <div v-if="isshow">
      <p>
        Mixin允许你封装一块在应用的其他组件中都可以使用的函数。如果使用姿势得当，他们不会改变函数作用域外部的任何东西，因此哪怕执行多次，只要是同样的输入你总是能得到一样的值，真的很强大！
      </p>
    </div>
  </div>
</template>

<script>
import { toggle } from '@/mixins/toggle';
export default {
  name: 'mixin-child1',
  mixins: [toggle],
  data() {
    return {
      isshow: true,
    };
  },
  methods: {
    toggleview() {
      console.log('child1中taggleview');
      this.isshow = !this.isshow;
    },
  },
  mounted() {
    console.log('*********************组件内部child1的钩子-mouted');
  },
};
</script>

<style lang="less" scoped>
.coms-mixin {
  font-size: 16px;
  border: 1px solid #ec4b4b;
}
.btn {
  cursor: pointer;
}
</style>
