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

  // 负责更新dom
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
        // 截取指令的名字
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
