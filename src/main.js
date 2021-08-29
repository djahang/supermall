import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

Vue.config.productionTip = false

//使用事件总线，必须加加一个$bus属性，= new Vue
Vue.prototype.$bus =new Vue()

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
