# vue 流程初步认识

### 1. vue 工作流程简述

![alt vue工作流程图](http://ttpcstatic.dftoutiao.com/ecms/image/20200803/767x549_7869741f.png_.webp)

**初始化流程线**
- 1、实例化一个Vue构造函数, 内部会调用一个_init函数, 初始化data、props、事件及生命周期等。
- 2、调用实例上$mounted方法（挂载过程），这个过程有编译执行、首次渲染、创建及DOM的追加。其实可以认为就是一个虚拟DOM的计算过程。
- 3、虚拟DOM通过执行rander函数得到的，在rander函数之前有个compile编译过程。平时写的template就是在定义render函数。
- 4、compile过程有个3个阶端。parse(正则解析),既然解析出template中定义的插值语法、属性、指令、及方法;optimize(标记静态节点),generate（生成rander）。
- 5、patch过程，虚拟DOM的计算过程，牛B的diff算法就在这个过程实现的。

**更新操作**
  - 1、render执行过程中，触发这个getter，通过watcher类来进行属性的依赖收集，当属性变化时，触发这个setter , 通知watcher该属性对应依重新执行，再到$patch过程，从而映射到真实的DOM。
  
**虚拟 dom**
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

**patch过程**
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

- **实现思路**
  Watcher类：负责创建data中key和更新函数的映射关系。<br>
  Dep类：同data中的每一个key一一对应起来，主要负责管理相关Watcher类。<br>
  Compiler类: 模版编译、解析。<br>
  KVue类: 初始化处理，属性劫持，这个一个入口类，以上3个类最初都是通过它实例化的。<br>
  **特别的**
  data中的属性与Dep是1对1关系。它与Watcher是1对多的关系，因为从客观上，一个属性可以在多个地方使用，然而每一个使用的地方需要建立一个依赖。

- **第一阶段 设置属性方法**
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

- **第二阶段 \$data 做代理（kvue.js）**

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
- **第三阶段 新建两个类Dep(大管家)，Watcher(观察者)**
  看实例源码。
- **第四阶段 依赖收集与追踪（完整源码实现）**
  - index.html
  ```html
  <div id="app">
      <p>{{name}}</p>
      <p k-text="name"></p>
      <p>{{age}}</p>
      <input type="text" k-model="name" />
      <button @click="changeName">点击</button>
      <div k-html="html"></div>
  </div>
  
    <script src="./compiler.js"></script>
    <script src="./kvue.js"></script>
    <script>
      let app = new KVue({
        el: '#app',
        data: {
          name: 'A',
          age: 30,
          html: '<button>这是一个按钮</button>',
        },
        created() {
          console.log('开始了');
          setTimeout(() => {
            this.name = '我是测试';
          }, 1500);
        },
        methods: {
          changeName() {
            this.name = 'Hi，兄弟们';
            this.age = 18;
          },
        },
      });
    </script>
  ```
  - **compiler.js**
  ```javascript
  /**
   * 作用：模版编译、解析
   * 1. 遍历模版，分析其中那些地方用到了data中的key以及事件指令
   */
  class Compiler {
    /**
     * 初始化
     * @param {*} el 宿主元素
     * @param {*} vm KVue实例
     */
    constructor(el, vm) {
      this.$vm = vm;
      this.$el = document.querySelector(el);
      // 开始编译
      this.compile(this.$el);
    }

    /**
     * 开始编译模版
     * @param {*} el 宿主元素,原生DOM对象
     */
    compile(el) {
      const childNodes = el.childNodes; // 获取DOM对象的子节点
      Array.from(childNodes).forEach((node) => {
        // 判断节点类型
        if (this.isElement(node)) {
          // 1. 如果节点类型是 元素节点 通俗就是html中标签 <div></div>
          console.log('编译元素' + node.nodeName);
          this.compileElement(node);
        } else if (this.isInter(node)) {
          // 2. 如果节点类型是 插值文本 {{xx}}
          console.log('编译插值文本' + node.textContent);
          this.compileText(node);
        }

        // 递归可能存在的子元素
        this.compile(node);
      });
    }

    // 是否是元素节点
    isElement(node) {
      return node.nodeType === 1;
    }

    // 是否是插值表达式 ：是文本节点并且符合正则
    isInter(node) {
      return node.nodeType === 3 && /\{\{(.*)\}\}/.test(node.textContent);
    }

    //编译文本
    compileText(node) {
      this.update(node, RegExp.$1, 'text');
    }

    /**
     * name   {{name}}
     * @param {*} node
     * @param {*} exp   name
     * @param {*} dir
     * @memberof Compiler
     */
    update(node, exp, dir) {
      // 首次，初始化
      const updaterFn = this[dir + 'Updater'];
      updaterFn && updaterFn(node, this.$vm[exp]);
      // 更新 挂钩操作
      // 1、回调函数什么时候执行 ?
      new Watcher(this.$vm, exp, function (value) {
        updaterFn && updaterFn(node, value);
      });
    }

    textUpdater(node, value) {
      node.textContent = value;
    }

    //编译元素
    compileElement(node) {
      const nodeAttrs = node.attributes; // 获取节点上的属性
      Array.from(nodeAttrs).forEach((attr) => {
        // k-text="exp"
        const attrName = attr.name; // 得到属性名称 k-text
        const exp = attr.value; // 得到属性值 exp
        if (this.isDirective(attrName)) {
          // 截取指令的名字v-html html v-text
          const dir = attrName.substring(2);
          // 执行相应更新函数
          this[dir] && this[dir](node, exp);
        }

        // 如果是事件指令
        if (this.isEvent(attrName)) {
          // @click="onClick"
          const dir = attrName.substring(1);
          // exp 是onclick
          this.eventHandler(node, exp, dir);
        }
      });
    }

    // 是否是指令
    isDirective(attr) {
      return attr.indexOf('k-') == 0;
    }
    // 是否是事件
    isEvent(attr) {
      return attr.indexOf('@') == 0;
    }
    // k-text指令
    text(node, exp) {
      this.update(node, exp, 'text');
    }
    // k-html
    html(node, exp) {
      this.update(node, exp, 'html');
    }

    htmlUpdater(node, value) {
      node.innerHTML = value;
    }

    // k-model指令
    model(node, exp) {
      // 复制
      this.update(node, exp, 'model');
      //事件监听
      node.addEventListener('input', (e) => {
        this.$vm[exp] = e.target.value;
      });
    }

    modelUpdater(node, value) {
      node.value = value;
    }

    // 事件操作
    eventHandler(node, exp, dir) {
      const fn = this.$vm.$options.methods && this.$vm.$options.methods[exp];
      if (fn) {
        node.addEventListener(dir, fn.bind(this.$vm));
      }
    }
  }
  ```
  - **kuve.js**
  ```javascript
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
      //依赖收集
      new Compiler(options.el, this);
      // 测试
      // new Watcher(this, 'name');
      // this.name; // 访问下name, 触发了其get属性方法

      //执行钩子函数
      if (options.created) {
        options.created.call(this);
      }
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
   * 1. data属性 与 Dep 是 1对1的关系，每一个$data中的属性，对应一个实例化Dep
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
     * @param {*} cb 回调
     */
    constructor(vm, key, cb) {
      this.vm = vm;
      this.key = key;
      this.cb = cb;
      Dep.target = this; // 把当前wather实例附加到Dep的静态属性上

      this.vm[this.key]; // 触发依赖收集
      Dep.target = null; // 放置性能问题
    }

    update() {
      // console.log(`Watcher--${this.key}属性更新了`);
      this.cb.call(this.vm, this.vm[this.key]);
    }
  }
  ```
- **回顾总结**
  ![总结流程图](http://ttpcstatic.dftoutiao.com/ecms/image/20200813/841x417_5b04f027.png_.webp)

  - 在`new Vue()`后，Vue会调用`_init`函数进行初始化，也就是init过程，在这个过程中`Data`通过`oberver`转换成`getter/setter`的形式，来对数据追踪变化，当被设置的对象被读取的时候会执行getter函数，而在被赋值的时候会执行`setter`函数。
  
  - 当外界通过`watcher`读取数据时，会触发`getter`从而将`Watcher`添加到依赖中。
  
  - 在修改对象的值的时候，会触发对应的`setter`、`setter`通知之前依赖收集得到的`Dep`中的每个`Watcher`，告诉它们自己的值改变了，需要重新渲染视图。此时这些`Watcher`就会开始调用`update`来更新视图。
