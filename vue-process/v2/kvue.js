/**
 * 1. 对内部的$data, 添加访问代理。
 * */

class KVue {
  constructor(options) {
    // 缓存配置项
    this.$options = options;
    // 缓存data
    this.$data = options.data;
    // 响应化
    this.observe(this.$data);
  }

  /**
   * {
   *   name: 'A',
   *   foo: { a: 1}
   * }
   * @param {*} data
   */
  observe(data) {
    // 做一层简单的过滤处理
    if (!data || typeof data !== 'object') return;
    // 遍历对象的属性，设置属性方法
    Object.keys(data).forEach((key) => {
      this.defineReactive(data, key, data[key]);
      // 将data中的属性代理到vue实例上(vue根)
      this.proxyData(key);
    });
  }

  // 内部形成了一个闭包
  defineReactive(data, key, val) {
    // 递归
    this.observe(val);
    // 给data定义属性方法 (set、get)
    Object.defineProperty(data, key, {
      get() {
        return val;
      },
      set(newval) {
        if (newval === val) return;
        val = newval;
        console.log(`${key}属性更新了`);
      },
    });
  }

  proxyData(key) {
    Object.defineProperty(this, key, {
      get() {
        return this.$data[key];
      },
      set(newval) {
        this.$data[key] = newval;
      },
    });
  }
}
