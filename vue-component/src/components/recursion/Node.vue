<template>
  <li>
    <div @click="toggle">
      {{ data.title }}
      <span v-if="isFolder">[{{ open ? '-' : '+' }}]</span>
    </div>
    <!-- 必须有结束条件 -->
    <ul v-show="open" v-if="isFolder">
      <Node v-for="d in data.children" :key="d.id" :data="d"></Node>
    </ul>
  </li>
</template>

<script>
export default {
  name: 'Node', // name对递归组件是必要的
  data() {
    return {
      open: false,
    }
  },
  props: {
    data: {
      type: Object,
      require: true,
    },
  },
  methods: {
    toggle() {
      if (this.isFolder) {
        this.open = !this.open
      }
    },
  },
  computed: {
    isFolder() {
      return this.data.children && this.data.children.length
    },
  },
}
</script>
