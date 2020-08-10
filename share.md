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

## 混入

  - **使用场景:**
  > - 1、有两个或多个非常相似的组件，他们基本功能差不多，但是他们之间存在差异足够的差异性。

  > - 2、**如果我们把它们拆分n个不同组件?** 这样我们可能一旦功能变动，就得承担多个文件中更新代码的风险，也违背了DRY原则。

  > - 3、**如果我们保留为一个组件，通过props来创造差异性，从而进行区分?** 太多的props传值会很快变得混乱不堪，维护者在使用组件的时候，需要理解一大段上下文，反而会拖慢迭代速度。

  - **基本使用方式**
  ===> 代码实例 @components/mixincom

  - **合并问题**
    - 1、组件与mixin都定义相同的生命周期钩子函数。
    > 默认mixin定义的钩子会先执行，接着才是组件的生命周期钩子函数。组件拥有最终发言权。其实只不过是重写这个生命钩子函数。
    - 2、组件与mixin定义相同其它非钩子函数。
    > 组件内定义的权重最高，mixin中定义的属性方法会被盖掉。

  其它，根组件的混入。后续实例

## 消息传递

===> @/mixins/emitter.js

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

> [参考博文](https://blog.csdn.net/wwwqiaoling/article/details/105077832)

### 特点

弹窗这类组件的特点是它们在当前vue实例例之外独⽴立存在，通常挂载于body; 它们是通过JS动态创建 的，不需要在任何组件中声明。通常类似的使用姿势:

```javascript
this.$create(Notice, {
      title: '我是一个弹窗哦',
      message: '提示信息', 
      duration: 1000
}).show();
```

### 实现思路

思路（实现全局 Notice 组件）：
1、首先我得有一个 Notice 组件的配置，也就是 Notice.vue 文件。
2、要把 Notice 组件直接挂在到 body 下，用 render 函数实现。
3、全局引用，通过 vue 插件方式引入。

===> 代码实例 @components/notice


## 递归组件

===> 代码实例 @components/recursion