// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import VueRouter from 'vue-router';
import VueResource from 'vue-resource';
import App from './App';
import goods from '@components/goods/goods';
import seller from '@components/seller/seller';
import ratings from '@components/ratings/ratings';

import '@common/stylus/index.styl';

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(VueResource);

// 定义路由(配置路由)
const routes = [
  {path: '/', component: goods},
  {path: '/goods', component: goods},
  {path: '/seller', component: seller},
  {path: '/ratings', component: ratings}
];

// 创建一个路由实例
const router = new VueRouter({
  // 设置选中的路由的颜色
  linkActiveClass: 'active',
  routes
});

// 在js中使用new来创建一个实例对象是要赋给某个值的，但这里不需要，所以在代码上单独配一个规则，跳过该校验规则（no-new是规则名）
/* eslint-disable no-new */
new Vue({
  router,
  components: {App}
}).$mount('#app');

// router.push('/goods');
