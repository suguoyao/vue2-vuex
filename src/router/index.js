import Vue from 'vue'
import Router from 'vue-router'
import store from '../vuex/store'
// 注册router组件
Vue.use(Router)
// 导入组件
import home from '../components/home/home.vue'
import search from '../components/search/search.vue'
import details from '../components/details/details.vue'
import discover from '../components/discover/discover.vue'
import group from '../components/group/group.vue'

let routes = [
  {
    path: '/home', name: 'home', component: home,
  },
  {path: '/search', name: 'search', component: search},
  {path: '/details', name: 'details', component: details},
  {
    path: '/discover', name: 'discover', component: discover
  },
  {path: '/group', name: 'group', component: group}
]

export default new Router({
  mode: 'history',
  routes
})
