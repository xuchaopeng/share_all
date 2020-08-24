/**
 * 发布-订阅模式 (观察者模式)
 */
export default class Bus {
  constructor() {
    // {
    //   eventName1:[fn1,fn2],
    //   eventName2:[fn3,fn4],
    // }
    this.callbacks = {};
  }
  // 实现事件的订阅
  $on(name, fn) {
    this.callbacks[name] = this.callbacks[name] || [];
    this.callbacks[name].push(fn);
  }
  // 事件的派发
  $emit(name, args) {
    if (this.callbacks[name]) {
      // 存在 遍历所有callback
      this.callbacks[name].forEach((cb) => cb(args));
    }
  }
}
