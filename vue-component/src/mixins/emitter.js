/*** 
 * 消息派发  往上派发，后代组件 ==> 父级组件
*/
function $dispatch(eventName, data) {
  let parent = this.$parent;
  // 查找父元素
  while (parent) {
    // 父元素用$emit触发
    parent.$emit(eventName, data);
    // 递归查找父元素
    parent = parent.$parent;
  }
}

/*** 
 * 消息广播 往下广播，父级组件 ==> 后代组件
*/
function boardcast(eventName, data) {
  this.$children.forEach(child => {
    // 子元素触发$emit
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
