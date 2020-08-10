let Vue;

class Store {
  // 持有state，并使其响应化
  // 实现commit和dispatch两个方法
  constructor(options) {
    //   数据响应式
    // this.state是Vue实例，访问this.state.count
    this.state = new Vue({ data: options.state });

    this.mutations = options.mutations;
    this.actions = options.actions;

    // bind this
    this.commit = this.commit.bind(this);
    this.dispatch = this.dispatch.bind(this);
  }

  //   实现commit：可以修改state中的数据
  commit(type, arg) {
    this.mutations[type](this.state, arg);
  }

  dispatch(type, arg) {
    return this.actions[type](this, arg);
  }
}

// 声明插件install
// _Vue是形参：Vue构造函数，use会把它传进来
function install(_Vue) {
  Vue = _Vue;

  Vue.mixin({
    beforeCreate() {
      // this指的是组件实例
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store;
      }
    },
  });
}

// 导出Vuex
export default { Store, install };
