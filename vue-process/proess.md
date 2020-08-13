# vue 流程初步认识

### 1. vue 工作流程简述

![alt vue工作流程图](http://ttpcstatic.dftoutiao.com/ecms/image/20200803/767x549_7869741f.png_.webp)

- **初始化**
  Vue会调用init函数进行初始化 生命周期、data、props、事件等。
- **挂载**
  执行编译、首次渲染、创建和追加过程。
- **编译**
  编译模块分为三个阶段：parse、optimize、generate
- **数据响应式**
  渲染函数执行时会触发 getter 进行依赖收集、将来数据变化时会触发 setter 进行更新。
- **虚拟 dom**
  通过 JS 对象描述 dom，数据变更时，映射为 dom 操作。

```bash
<!-- dom -->
<div name="toutiao" style="color:pink" @click="xx">
<a>Click me</a>
</div>

<!-- vdom -->
{
tag:'div',
props: {
  name:'toutiao',
  style: {color:'red'},
  onClick:xx
}
children: [
  {
    tag: 'a',
    text: 'click me'
  }
]
}
```

- **更新视图**
  数据修改时监听器会执行更新，通过对比新旧 `vdom`，得到最小修改，就是`patch`。

[参考文章](https://www.cnblogs.com/ming1025/p/13091678.html)

### 2. vue 响应式原理

```html
<div id="app">
  <p>你好，<span id="name"></span></p>
</div>

<script>
  var obj = {};
  Object.defineProperty(obj, 'name', {
    get() {
      console.log('获取name');
      return document.querySelector('#name').innerHTML;
    },
    set(nick) {
      console.log('设置name');
      document.querySelector('#name').innerHTML = nick;
    },
  });
  obj.name = 'Jerry';
  console.log(obj.name);
</script>
```
1、在`Vue`被实例化的时候，会遍历传入`data`对象的每个属性，通过`Object.defineProperty`给这些属性设置`setter/getter`。
2、在初始化过程中，通过访问属性触发对应的`getter`，将该属性相关依赖收集起来，并在设置属性时触发`setter`重新渲染。


### 3、vue 实现

- **简版架构图**
  ![实现思路](http://ttpcstatic.dftoutiao.com/ecms/image/20200813/759x413_acbcbf41.png_.webp)

- **设置属性方法**
  创建 kvue.js

  ```javascript
  class KVue {
    constructor(options) {
      // 缓存配置项
      this.$options = options;
      // 提出data
      this.$data = options.data;
      // 响应化
      this.oberve(this.$data);
    }

    observe(data) {
      // 做一层简单的过滤处理
      if (!data || typeof data !== 'object') return;
      // 遍历，执行数据响应式
      Object.keys(data).forEach((key) => {
        this.defineReactive(data, key, data[key]);
      });
    }

    defineReactive(data, key, val) {
      // 递归
      this.observe(val);
      // 给obj定义属性
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
  }
  ```

  创建 index.html

  ```html
  <script src="kvue.js"></script>
  <script>
    const app = new KVue({
      data: {
        test: 'I am test',
        foo: {
          bar: 'A1',
        },
      },
    });
    app.$data.test = 'DFZX';
    app.$data.foo.bar = 'A2';
  </script>
  ```

- **给\$data 做代理（kvue.js）**

```javascript
observe(data) {
  ...
  Object.keys(data).forEach(key => {
    this.defineReactive(data,key,data[key]);
    // 将data中的属性代理到vue实例上(vue根)
    this.proxyData(key);
  });

  // 在vue根上定义属性代理data中的数据
  proxyData(key) {
    Object.defineProperty(this, key, {
      get() {
        return this.$data[key];
      },
      set(newval) {
        this.$data[key] = newval;
      }
    })
  }
}
```

- **依赖收集与追踪**
  看实例源码。
  
- **回顾总结**
  ![总结流程图](http://ttpcstatic.dftoutiao.com/ecms/image/20200813/841x417_5b04f027.png_.webp)

  - 在`new Vue()`后，Vue会调用`_init`函数进行初始化，也就是init过程，在这个过程中`Data`通过`oberver`转换成`getter/setter`的形式，来对数据追踪变化，当被设置的对象被读取的时候会执行getter函数，而在被赋值的时候会执行`setter`函数。
  
  - 当外界通过`watcher`读取数据时，会触发`getter`从而将`Watcher`添加到依赖中。
  
  - 在修改对象的值的时候，会触发对应的`setter`、`setter`通知之前依赖收集得到的`Dep`中的每个`Watcher`，告诉它们自己的值改变了，需要重新渲染视图。此时这些`Watcher`就会开始调用`update`来更新视图。
