<template>
  <div>
    <Child1>内容1</Child1>

    <Child2>
      <!-- 默认插槽用default -->
      <template v-slot:default>内容2</template>
      <!-- v-slot:插槽名 -->
      <template v-slot:content>内容3</template>
    </Child2>

    <Child3>
      <!-- v-slot:插槽名="作用域上下文", 作用域上下文指的是对应slot标签上属性组成的对象集 -->
      <template v-slot:default="ctx">
        来自子组件数据：{{ ctx.foo }}
        {{ ctx.a }}
      </template>
    </Child3>
  </div>
</template>

<script>
import Child1 from './child1.vue'
import Child2 from './child2.vue'
import Child3 from './child3.vue'

export default {
  name: 'slots',
  components: {
    Child1,
    Child2,
    Child3,
  },
}
</script>

<style scoped></style>
