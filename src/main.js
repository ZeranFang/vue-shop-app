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

// 格式化时间
Vue.filter('dateFormat', function (originVal) {
  const dt = new Date(originVal)

  const y = dt.getFullYear()
  const m = (dt.getMonth() + 1 + '').padStart(2, '0')
  const d = (dt.getDate() + '').padStart(2, '0')

  const hh = (dt.getHours() + '').padStart(2, '0')
  const mm = (dt.getMinutes() + '').padStart(2, '0')
  const ss = (dt.getSeconds() + '').padStart(2, '0')

  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
