import Vue from 'vue';
import App from './App.vue';
import emitter from './mixins/emitter';
import Bus from './utils/bus';
import create from './utils/create';

Vue.config.productionTip = false;
Vue.mixin(emitter);
Vue.prototype.$bus = new Bus();
Vue.prototype.$create = create;

new Vue({
  data: {
    bar: 'bar',
  },
  render: (h) => h(App),
}).$mount('#app');
