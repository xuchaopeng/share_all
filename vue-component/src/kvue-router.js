// 声明插件：vue插件需求实现一个install静态方法
let Vue; // 保存Vue构造函数引用

class KVueRouter {
  constructor(options) {
    this.$options = options;

    this.routeMap = {}; // {'/index': {component:Index,...}}

    // 当前url需要是响应式的
    this.app = new Vue({
      data: { current: "/" },
    });
  }

  // 初始化
  init() {
    // 监听事件
    this.bindEvents();
    // 解析routes
    this.createRouteMap();
    // 声明组件
    this.initComponent();
  }

  bindEvents() {
    window.addEventListener("hashchange", this.onHashchange.bind(this));
  }
  onHashchange() {
      console.log(window.location.hash);
      
    this.app.current = window.location.hash.slice(1) || "/";
  }

  createRouteMap() {
    //   遍历用户配置路由数组
    this.$options.routes.forEach(route => {
      this.routeMap[route.path] = route;
    });
  }

  initComponent() {
    //   转换目标：<a href="#/">xxx</a>
    // <router-link to="/">
    Vue.component("router-link", {
      props: {
        to: String,
      },
      render(h) {
        //   this指向组件实例对象
        // h(tag, data, children)
        // 使用createElement函数
        // return h('a', {
        //     attrs: {href: '#' + this.to}
        // }, [this.$slots.default])

        // 使用jsx
        return <a href={"#" + this.to}>{this.$slots.default}</a>;
      },
    });
    // 获取path对应的Component将它渲染出来
    Vue.component("router-view", {
        render: (h) => {
            const Component = this.routeMap[this.app.current].component;
            return h(Component)
        }
    })
  }
}

// 参数是Vue构造函数
KVueRouter.install = function(_Vue) {
  Vue = _Vue;

  // 实现一个混入
  Vue.mixin({
    beforeCreate() {
      // 获取KVueRouter实例并挂载到Vue.prototype
      if (this.$options.router) {
        // 根组件beforeCreate时执行一次
        Vue.prototype.$router = this.$options.router;
        // 路由器初始化
        this.$options.router.init();
      }
    },
  });
};

export default KVueRouter;