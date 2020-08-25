# Vue 组件化实践

本次分享内容分以下几个部分（通讯、插槽、混入、实践、弹窗组件、递归组件）。<br>
每个部分会附带一些例子，其运行环境 vue 版本 2.2.6, node 版本 8.15.0 。<br>
组件化是 vue 的核心思想，它能提高开发效率，方便重复使用，简化调试步骤，提高整个项目的可维护性，便于多人协同开发。<br>

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

  1、默认情况下，调用组件时，传入一些没有在 props 中定义的属性（`非法属性`），会把这些`非法属性`渲染在组件的`根元素`上，然而这些非法属性会记录在\$attrs 属性上。<br>

  2、通过组件内部设置`inheritAttrs:false`即可，避免非法属性渲染在组件根元素上。(vue2.4.0 新增)<br>

  3、通过 v-bind="\$attrs"可以把`非法`属性渲染到指定的组件内某个元素上。<br>

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

  父组件定义事件，子组件派发事件，并传递数据。

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

  // child1 通过给父组件注册（订阅）一个事件foo
  this.$parent.$on('foo', handle);
  // child2 获取到共同的父辈组件，并通过$emit派发这个foo事件
  this.$parent.$emit('foo','来自兄弟的问候');
  ```

### 祖先组件 => 后代组件

> 通常我们父子组件讯息的时候，如果组件层级较深，通过props显然不切实际。vue 给我们提供了 `provide/inject` 高级特性完成通讯任务。(vue 2.2.0 之后新增的)<br />

> 简单说，父级组件中通过`provide`来提供变量，然后在子组件中通过`inject`来注入变量。不论子组件有多深，只要调用`inject`就可以注入`provide`中的数据。

```javascript
// 父级组件提供 'foo'
provide() {
  return { foo: 'foo' }
}

// 子组件注入 'foo'
inject: ['foo']
```

**注意：**

- 1、只能父级组件给后代子组传值。<br>

### 任意两个组件之间

- **事件总线**

  - 创建一个类负责事件派发、监听与回调管理

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

  // Child1 订阅消息
  this.$bus.$on('event-bus', handle);
  // Child2 发布消息
  this.$bus.$emit('event-bus', '来自远方的问候');
  ```

  - **注意**
    - 1、事件总线是对发布-订阅模式的一种实现。它是一种集中式事件处理机制，允许不同的组件之间进行彼此通信而又不需要相互依赖，从而达到一种解耦的目的。<br>
    - 2、实践中，可以用 Vue 代替 Bus,因为 Vue 已实现了相应的功能。<br>
    - 3、其实我们开发过程中,尤其是组件化开发（当然不局限于 vue）过程中，`事件池`带给我们的是一种处理问题的思维模式。例如，微信小程序开发 onReachBottom（页面上拉触底事件），项目中多个地方依赖这个触底事件，可考虑用`事件池`。<br>

- **引入 vuex**

  &emsp;&emsp;vuex 多数情况，是针对我们业务相关数据的全局状态管理。<br>
  &emsp;&emsp;vuex 其实可以替代已上大部分情况来实现组件通讯，但是通常我们在封装项目中、团队中的通用组件、甚至在封装第三方 vue 插件库的时候，是没有 vuex 的。<br>
  &emsp;&emsp;创建唯一的全局数据管理者 store，通过它管理数据并通知组件状态变更。这里不展开。工作中用的比较频繁。关于它的使用及实现原理，后续可作为一个专题来讲。<br>

## 插槽

&emsp;&emsp;插槽就是 Vue 实现内容分发的 API,将元素（slot）作为承载分发内容的出口。通常在我们开发通用组件库中大量使用。<br>
&emsp;&emsp;通俗点：插槽，也就是 slot,是组件的一块 html 模版，这快模版显不显示、以及怎样显示由父组件来决定。<br>
&emsp;&emsp;这里我只介绍最新使用方式 v-slot,它只能用在 template 上，和组件标签上。（`vue2.6`及已上版本，slot-scope 已开始废弃）

[参考文章](https://www.cnblogs.com/jiajia123/p/12526307.html)

### 匿名插槽

没有 slot 插槽情况下，组件标签内写的内容是不起任何作用的。匿名插槽没有设置 name 属性的插槽（默认插槽），一个元素里只能有一个匿名插槽。

```javascript
// child1
<div>
  <slot></slot>
</div>

// parent
<Child1>hello</Child1>
```

### 具名插槽

具名插槽：具有 name 属性的插槽。使用场景：需要将内容分发到子组件指定位置，可以存在多个具名插槽。

```javascript
// child2
<div>
  <h3>标题....</h3>
  <slot name="conten1"></slot>
  <p>其它内容....</p>
  <slot name="conten2"></slot>
</div>

// parent
<Child2>
  <!-- template上v-slot:插槽名  作为参数 -->
  <template v-slot:conten1>内容1...</template>
  <!-- 具名插槽用插槽名做参数 -->
  <template v-slot:conten2>内容2...</template>
</Child2>
```

### 作用域插槽

通俗的说：作用域插槽就是让插槽内容能够访问子组件中才有的数据。<br>
使用场景：父组件需要使用到子组件的数据。子组件可以在 slot 标签上绑定属性值。

```html
<!-- Child3 -->
<div>
  <slot :foo="foo1"></slot>
</div>

<!-- parent -->
<Child3>
  <!-- 默认插槽的插槽名称 default , slotProps指的是对应slot标签上属性组成的对象集合-->
  <template v-slot:default="slotProps">
    来自子组件数据：{{ slotProps.foo }}
  </template>
</Child3>
```

## 混入

- **什么是混入?**

  官方的解释：混入 (mixin) 提供了一种非常灵活的方式，来分发 Vue 组件中的可复用功能。一个混入对象可以包含任意组件选项。当组件使用混入对象时，所有混入对象的选项将被“混合”进入该组件本身的选项。 <br>
  其实就是 `混合的融入`。

- **基本使用方式**

  ===> 代码实例 @components/mixincom

- **合并问题**

  - 1、当 `组件内` 与 `mixin` 定义相同的生命周期钩子函数。默认 mixin 定义的钩子会先执行，接着才是组件内的钩子。其实只不过是对该生命钩子的重写。

  - 2、当 `组件内` 与 `mixin` 定义相同的属性或方法（非钩子函数）。`组件内`权重最高，`mixin`中定义的属性方法会被盖掉。(简单的理解记忆)

- **使用场景:**

  有两个或多个非常相似的组件，他们基本功能差不多，但是他们之间存在差异足够的差异性。我们就可以考虑使用混合了。为什么呢 ?

  - 1、**如果我们把它们拆分 n 个不同组件?** 这样我们可能一旦功能变动，就得承担多个文件中更新代码的风险，也违背了 DRY(不写重复代码)原则。

  - 2、**如果我们保留为一个组件，通过 props 来创造差异性，从而进行区分?** 太多的 props 传值会很快变得混乱不堪，维护者在使用组件的时候，需要理解一大段上下文，反而会拖慢迭代速度。

## 消息传递 (派发与广播)

### 派发， 往上派发。

- 曾孙组件 GrandGrandChild1

```html
<template>
  <button @click="dispathHandler">
    dispatch
  </button>
</template>

<script>
  methods: {
    dispathHandler() {
      this.$dispatch('dispatch', '哈喽 我是GrandGrandChild1')
    }
  }
</script>
```

- 子组件 Child1

```html
<script>
  mounted: {
    this.$on('dispatch', (msg) => {
      this.msg = '接收dispatch消息:' + msg;
    });
  }
</script>
```

### 广播， 往下广播。

- 子组件 Child1

```html
<template>
  <button @click="boardcastHandler">广播子元素</button>
</template>

<script>
  methods: {
    boardcastHandler() {
      this.$boardcast('boardcast','我是Child1');
    }
  }
</script>
```

- 曾孙组件 GrandGrandChild1

```html
<script>
  mounted: {
    this.$on('boardcast', (msg) => {
      this.msg = '接收boardcast消息:' + msg;
    });
  }
</script>
```

===> @/mixins/emitter.js

### 其它

1、实际上 vue1.x 版本是有$dispatch 和 $broadcast， 自 vue2.x 之后被弃用，可能官方有它自己考量。（平时的业务场景，不太会出现这么复杂的场景，即使存在可以用 vuex 替代）<br>
2、当我们在独立开发 vue 组件库的时候，不会依赖 vuex 的。官方弃用，不表示不能用，要谨慎使用。 [elementUI 源码地址](https://github.com/ElemeFE/element/blob/dev/src/mixins/emitter.js) ||| [elementUI 源码截图](http://ttpcstatic.dftoutiao.com/ecms/image/20200821/734x940_703dc49e.png_.webp)

## 组件实践

elementUI 表单提交组件简版的实现，是对已上内容的综合实践。一个很典型的组件实现的例子。(高阶组件封装)
[elementUI 表单提交使用截图](http://ttpcstatic.dftoutiao.com/ecms/image/20200809/947x931_02f29ee9.png_.webp)

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

弹窗这类组件的特点是它们在当前 vue 实例例之外独立存在，通常挂载于 body; 它们是通过 JS 动态创建 的，不需要在任何组件中声明。通常类似的使用姿势:

```javascript
this.$create(Notice, {
  title: '我是一个弹窗哦',
  message: '提示信息',
  duration: 1000,
}).show();
```

### 实现思路

思路（实现 Notice 弹窗组件）：<br>
1、首先我得有一个 Notice 组件的配置，也就是 Notice.vue 文件。<br>
2、要把 Notice 组件直接挂在到 body 下，通过 render 函数实现。<br>

### 代码实现

===> 代码实例 @components/notice

## 递归组件

===> 代码实例 @components/recursion

- **递归组件 Node**

```html
<template>
  <li>
    <div @click="toggle">
      {{ data.title }}
      <span v-if="isFolder">[{{ open ? '-' : '+' }}]</span>
    </div>
    <!-- 必须有结束条件 -->
    <ul v-show="open" v-if="isFolder">
      <Node v-for="d in data.children" :key="d.id" :data="d"></Node>
    </ul>
  </li>
</template>

<script>
  export default {
    name: 'Node', // name对递归组件是必要的
    data() {
      return {
        open: false,
      };
    },
    props: {
      data: {
        type: Object,
        require: true,
      },
    },
    methods: {
      toggle() {
        if (this.isFolder) {
          this.open = !this.open;
        }
      },
    },
    computed: {
      isFolder() {
        return this.data.children && this.data.children.length;
      },
    },
  };
</script>
```

- **使用方式**

```html
<template>
  <div class="coms-recursion">
    <ul>
      <Node :data="data"></Node>
    </ul>
  </div>
</template>

<script>
  import Node from './Node.vue';
  export default {
    data() {
      return {
        data: {
          id: '1',
          title: '递归组件',
          children: [
            {
              id: '1-1',
              title: '使用方法',
              children: [
                { id: '1-1-1', title: '使用方法1' },
                { id: '1-1-2', title: '使用方法2' },
                { id: '1-1-3', title: '使用方法3' },
              ],
            },
            {
              id: '1-2',
              title: '注意事项',
              children: [
                { id: '1-2-1', title: '注意事项1' },
                { id: '1-2-2', title: '注意事项2' },
              ],
            },
            {
              id: '1-3',
              title: '使用场景',
            },
          ],
        },
      };
    },
    components: {
      Node,
    },
  };
</script>
```

- **特别的**
  1、递归组件一定要设置 name。<br>
  2、必须要有结束条件，不然死循环，内存溢出。<br>
  3、一般，我们自己在封装一些业务的时候，碰到这种树形结构数据的时候，会考虑递归。电商类业务会用的比较多。<br>
  4、一般有明显（确定）层次的树形数据构，正常的循环就能满足需求，就没必要考虑递归。<br>
