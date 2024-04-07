
// #ifndef VUE3
import Vue from 'vue'
import App from './App'

import globalMethod from './static/globalMethod.js'
Vue.prototype.$selfGlobal = globalMethod;

import io from '@hyoga/uni-socket.io';
const socket = io('ws://172.168.1.33:442', {
	query: {},
	transports: ['websocket', 'polling'],
	timeout: 5000,
});
Vue.prototype.$socket = socket;
Vue.prototype.$baseUrl = "http://172.168.1.33:442"
Vue.prototype.$static_Url = "http://172.168.1.33:3100"

Vue.config.productionTip = false
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
import App from './App.vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif