# 组件化

组件化是 vue 的核心思想，它能提高开发效率，方便重复使用，简化调试步骤，提高整个项目的可维护性，便于多人协同开发。

## 组件通讯

### 父组件 => 子组件

- **属性 props**

  ```javascript
  // Child
  props: {
    msg: String;
  }

  // parent
  <Child msg="各位大佬们"></Child>;
  ```

- **特性\$attrs**

  ```javascript
  // Child: 未在props中声明的属性
  <p>{{$attrs.name}}</p>

  // parent
   <Child msg="各位大佬们" name="A"></Child>
  ```

- **引用 refs**

  ```javascript
  // parent
  <Child ref="v1"></Child>

  mounted() {
    this.$refs.v1.msg = '兄弟们'
  }
  ```

- **子元素\$children**
  ```javascript
  // parent
  this.$children[0].name = '各位小伙伴们';
  ```
  > **特别的：子元素是不保证顺序的，尤其是存在多个子组件，并且有异步组件的时候。**

### 子组件 => 父组件

- **自定义事件**

  ```javascript
  // Child
  this.$emit('add', 'B'); //'add': 父组件指定的数据绑定的函数名称, 'B'：子组件向父组件传递的数据

  // parent
  <Child @add="addHandler"></Child>

  methods: {
    addHandler(v) {
      console.log(v) // 'B'
    }
  }
  ```

### 兄弟组件<=>兄弟组件

- **通过共同的祖辈组件**
  > 通过共同的祖辈组件搭桥，$parent 或 $root
  ```javascript
  // brother1
  this.$parent.$on('foo', handle);
  // brother2
  this.$parent.$emit('foo');
  ```

### 祖先组件 => 后代组件

> 由于嵌套层数过多，传递 props 不切实际，vue 给我们提供了 provide/inject API 完成该任务。

```javascript
// 组先组件
provide() {
  return { foo: 'foo' }
}

// 后代组件
inject: ['foo']
```

> **特别的：只能祖先给后代传值**

### 任意两个组件之间

- **事件总线**
- **创建一个类负责事件派发、监听与回调管理**

```javascript
// 事件派发、监听和回调管理
class Bus {
  constructor() {
    this.callbacks = {};
  }
  $on(name, fn) {
    this.callbacks[name] = this.callbacks[name] || [];
    this.callbacks[name].push(fn);
  }
  $emit(name, args) {
    if (this.callbacks[name]) {
      this.callbacks[name].forEach((cb) => cb(args));
    }
  }
}

// 使用 main.js 挂在Vue原型上
Vue.prototype.$bus = new Bus();

// Child1
this.$bus.$on('foo', handle);
// Child2
this.$bus.$emit('foo', handle);
```

> **特别的：实践中，可以用 Vue 代替 Bus,因为 Vue 已实现了相应的功能**

- **vuex**
  > 创建唯一的全局数据管理者 store，通过它管理数据并通知组件状态变更。这里不展开。工作中用的比较频繁。关于它的使用及实现原理，后续可作为一个专题来讲。

## 插槽

插槽语法是 Vue 实现内容分发 API,用于复合组件的开发。通常在我们开发通用组件库中大量使用。

### 匿名插槽

```javascript
// Comp1
<div>
  <slot></slot>
</div>

// parent
<Comp1>hello</Comp1>
```

### 具名插槽

将内容分发到子组件指定位置

```javascript
// Comp2
<div>
  <slot></slot>
  <slot name="content"></slot>
</div>

// parent
<Comp2>
  <!-- 默认插槽用default做参数 -->
  <template v-slot:default>具名插槽</template>
  <!-- 具名插槽用插槽名做参数 -->
  <template v-slot:content>内容...</template>
</Comp2>
```

### 作用域插槽

分发内容要用到子组件中的数据

```html
// Comp3
<div>
  <slot :foo="foo"></slot>
</div>

// parent
<Comp3>
  <template v-slot:default="slotProps">
    来自子组件数据：{{ slotProps.foo }}
  </template>
</Comp3>
```

## 组件实践

elementUI 表单提交组件简版的实现，它几乎涵盖了，我们以上分享的所有内容。一个很典型的组件实现的例子。
[elementUI 表单提交使用截图](http://ttpcstatic.dftoutiao.com/ecms/image/20200809/947x931_02f29ee9.png_.webp)

- **简单描述实现思路**
- **创建 KInput.vue**

  ```html
  <template>
    <div>
      <input :value="value" @input="onInput" v-bind="$attrs" />
    </div>
  </template>

  <script>
    export default {
      inheritAttrs: false,
      props: {
        value: {
          type: String,
          default: '',
        },
        type: {
          type: String,
          default: 'text',
        },
      },
      methods: {
        onInput(e) {
          // 转发input事件即可
          this.$emit('input', e.target.value);
          // 通知校验
          this.$parent.$emit('validate');
        },
      },
    };
  </script>
  ```

- **使用 KInput.vue**
  创建 index.vue, 添加如下代码：

  ```html
  <template>
    <div>
      <h3>KForm表单</h3>
      <hr />
      <k-input v-model="model.username"></k-input>
      <k-input type="text" v-model="model.age"></k-input>
    </div>
  </template>

  <script>
    import KInput from './KInput';
    export default {
      components: { KInput },
      data() {
        return {
          model: {
            username: 'xcp',
            age: '',
          },
        };
      },
    };
  </script>
  ```

- **创建 KFormItem.vue**

  ```html
  <template>
    <div>
      <label v-if="label">{{label}}</label>
      <slot></slot>
      <p v-if="error">{{error}}</p>
    </div>
  </template>

  <script>
    export default {
      props: {
        label: { type: String, default: '' }, // 标签
        prop: { type: String, default: '' }, // 字段
      },
      data() {
        return { error: '' };
      },
    };
  </script>
  ```

- **使用 KFormItem.vue**
  index.vue, 添加如下代码：

  ```html
  <template>
    <div>
      <h3>KForm表单</h3>
      <hr />
      <k-form-item label="用户名" prop="username">
        <k-input v-model="model.username"></k-input>
      </k-form-item>
      <k-form-item label="年龄" prop="age">
        <k-input type="text" v-model="model.age"></k-input>
      </k-form-item>
    </div>
  </template>
  ```

- **实现 KForm**

```html
<template>
  <form>
    <slot></slot>
  </form>
</template>
<script>
  export default {
    provide() {
      return { form: this };
    },
    props: {
      model: { type: Object, required: true },
      rules: { type: Object },
    },
  };
</script>
```

- **使用 KForm**

  ```html
  <template>
    <div>
      <h3>KForm表单</h3>
      <hr />
      <k-form :model="model" :rules="rules" ref="loginForm">
        ...
      </k-form>
    </div>
  </template>

  <script>
    import KForm from './KForm';
    export default {
      components: { KForm },
      data() {
        return {
          rules: {
            username: [{ required: true, message: '请输入用户名' }],
            password: [{ required: true, message: '请填写年龄' }],
          },
        };
      },
      methods: {
        submitForm() {
          this.$refs['loginForm'].validate((valid) => {
            if (valid) {
              alert('校验通过。');
            } else {
              alert('校验失败！');
            }
          });
        },
      },
    };
  </script>
  ```

- **数据校验**

  - KInput 通知校验

    ```javascript
    onInput(e) {
      this.$parent.$emit('validate');//$parent指KFormItem
    }
    ```

  - KFormItem 监听校验通知，获取规则并执行校验
    ```bash
    inject: ['form'], // 注入
    mounted(){
      // 监听校验事件
      this.$on('validate', () => { this.validate() })
    },
    methods: {
      validate() {
        // 获取对应KFormItem校验规则
        console.log(this.form.rules[this.prop]);
        // 获取校验值
        console.log(this.form.model[this.prop]);
      }
    }
    ```
  - 安装 async-validator： npm i async-validator -S

    ```javascript
    import Schema from "async-validator";

    validate() {
      // 获取对应FormItem校验规则
      const rules = this.form.rules[this.prop];
      // 获取校验值
      const value = this.form.model[this.prop];
      // 校验描述对象
      const descriptor = { [this.prop]: rules };
      // 创建校验器
      const schema = new Schema(descriptor);
      // 返回Promise，没有触发catch就说明验证通过
      return schema.validate({ [this.prop]: value }, errors => {
        if (errors) {
          // 将错误信息显示
          this.error = errors[0].message;
        } else {
          // 校验通过
          this.error = "";
        }
      }
    }
    ```

  - 表单全局验证，为 Form 提供 validate 方法
    ```javascript
    validate(cb) {
      // 调用所有含有prop属性的子组件的validate方法并得到Promise数组
      const tasks = this.$children.filter(item => item.prop).map(item => item.validate());
      // 所有任务必须全部成功才算校验通过，任一失败则校验失败
      Promise.all(tasks).then(() => cb(true)).catch(() => cb(false))
    }
    ```

## 弹窗组件

> 意义?
> [参考博文](https://blog.csdn.net/wwwqiaoling/article/details/105077832)

思路（实现全局 Notice 组件）：
1、首先我得有一个 Notice 组件的配置，也就是 Notice.vue 文件。
2、要把 Notice 组件直接挂在到 body 下，用 render 函数实现。
3、全局引用，通过 vue 插件方式引入。

## 递归组件

## 消息传递

## vue 流程初步认识

### 1. vue 工作流程图

![alt vue工作流程图](http://ttpcstatic.dftoutiao.com/ecms/image/20200803/767x549_7869741f.png_.webp)

- **初始化**
  初始化 data、props、事件等。
- **挂载**
  执行编译、首次渲染、创建和追加过程
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
  数据修改时监听器会执行更新，通过对比新旧 vdom，得到最小修改，就是 patch。

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

### 3、vue 实现

- **简版架构图**
- **设置属性方法**
  创建 kvue.js

  ```javascript
  // 创建kvue.js
  // new KVue({
  //  data: {
  //    msg: 'hello vue'
  //  }
  // })

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
