/**
 * 1. 新创建两个类：Dep(大管家)、Watcher(观察者)
 * 2. Dep: 同data中的每一个key一一对应起来，主要负责管理相关watcher
 * 3. Watcher: 负责创建data中key和更新函数的映射关系
 * */

class KVue {
  constructor(options) {
    // 缓存配置项
    this.$options = options;
    // 缓存data
    this.$data = options.data;
    // 响应化，属性代理
    this.observe(this.$data);
    // 测试
    new Watcher(this, 'name');
    this.name; // 访问下name, 触发了其get属性方法
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

  defineReactive(data, key, val) {
    // 递归
    this.observe(val);
    // 创建Dep实例和key一一对应
    const dep = new Dep();
    // 给data定义属性方法 (set、get)
    Object.defineProperty(data, key, {
      get() {
        // Dep.target 即为 Watcher实例
        Dep.target && dep.addDep(Dep.target);
        return val;
      },
      set(newval) {
        if (newval === val) return;
        val = newval;
        // console.log(`${key}属性更新了`);
        dep.notify(); // 通知更新
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

/**
 * 作用：同$data中的每一个key对应起来，主要负责管理相关watcher
 * 1. data属性 与 Dep 是 1对1的关系，每一个data中的属性，对应一个实例化Dep
 */
class Dep {
  constructor() {
    this.deps = [];
  }
  // 添加
  addDep(dep) {
    this.deps.push(dep);
  }

  // 通知
  notify() {
    this.deps.forEach((dep) => dep.update());
  }
}

/**
 *  作用：负责创建data中key和更新函数的映射关系
 *  1. 假设我们的界面中，发现一个地方要用的一个属性，我们会new Watcher，读取下这个属性。get函数会触发，建立联系了。
 */
class Watcher {
  /**
   * 初始化
   * @param {*} vm  kvue实例
   * @param {*} key 监听的属性
   */
  constructor(vm, key) {
    this.vm = vm;
    this.key = key;
    Dep.target = this; // 把当前wather实例附加到Dep的静态属性上
  }

  update() {
    console.log(`Watcher--${this.key}属性更新了`);
  }
}
