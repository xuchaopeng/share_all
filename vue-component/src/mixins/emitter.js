/***
 * 消息派发  自下往上派发，后代组件 ==> 父级组件
 */
function $dispatch(eventName, data) {
  let parent = this.$parent;
  // 查找父组件
  while (parent) {
    // 父组件通过调用$emit派发eventName事件，并传递data参数
    parent.$emit(eventName, data);
    // 递归查找父组件
    parent = parent.$parent;
  }
}

/***
 * 消息广播 往下广播，父级组件 ==> 后代组件
 */
function boardcast(eventName, data) {
  this.$children.forEach((child) => {
    // 子组件调用$emit派发eventName事件
    child.$emit(eventName, data);
    if (child.$children.length) {
      // 递归调用，通过call修改this指向 child
      boardcast.call(child, eventName, data);
    }
  });
}

export default {
  methods: {
    $dispatch,
    $boardcast: function(eventName, data) {
      boardcast.call(this, eventName, data);
    },
  },
};
