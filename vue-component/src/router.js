import Vue from 'vue';
// import Router from 'vue-router'
import Router from './kvue-router';
import Home from './views/Home.vue';

// 1.应用插件：做了什么？
Vue.use(Router); // use执行了插件install()

// 2.创建Router实例
export default new Router({
  mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import(/* webpackChunkName: "about" */ './views/About.vue'),
    },
  ],
});
