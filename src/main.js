import Vue from 'vue'
import App from './App.vue'
import router from './router'
//引入element-ui配置
import './plugins/element'
// 引入axios配置
import './plugins/axios'

// 引入初始化css样式
import '../src/assets/css/_gloabl.css'

//引入字体图标
import './assets/fonts/iconfont.css'


Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
