<template>
  <div class="coms-recursion">
    <ul>
      <Node :data="data"></Node>
    </ul>
  </div>
</template>

<script>
import Node from './Node.vue'

export default {
  data() {
    return {
      data: {
        id: '1',
        title: '递归组件',
        children: [
          {
            id: '1-1',
            title: '使用方法',
            children: [
              { id: '1-1-1', title: '使用方法1' },
              { id: '1-1-2', title: '使用方法2' },
              { id: '1-1-3', title: '使用方法3' },
            ],
          },
          {
            id: '1-2',
            title: '注意事项',
            children: [
              { id: '1-2-1', title: '注意事项1' },
              { id: '1-2-2', title: '注意事项2' },
            ],
          },
          {
            id: '1-3',
            title: '使用场景',
          },
        ],
      },
    }
  },
  components: {
    Node,
  },
}
</script>

<style lang="less">
ul {
  list-style: none;
}
ul li {
  line-height: 30px;
  font-size: 16px;
  color: #333;
}
.coms-recursion {
  border: 1px solid skyblue;
}
</style>
