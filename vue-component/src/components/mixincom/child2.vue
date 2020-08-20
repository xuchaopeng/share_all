<template>
  <div class="coms-mixin">
    <h3>mixin-comp2</h3>
    <button class="btn" @click="toggleview">按我展示</button>
    <div v-if="isshow">
      <p>
        有两个或多个非常相似的组件，他们基本功能差不多，但是他们之间存在差异足够的差异性。
      </p>
    </div>
  </div>
</template>

<script>
import { toggle } from '@/mixins/toggle'
export default {
  name: 'mixin-child2',
  mixins: [toggle],
}
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
