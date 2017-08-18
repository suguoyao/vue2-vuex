/**
 * Created by Sugar on 2017/5/17.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import getters from './getters'
import actions from './actions'

// 注册vuex
Vue.use(Vuex)

// 初始化一些常用数据，根据vue的理念，使用到的数据都必须先进行初始化设置。
let state = {
  // 对话框
  dialog: false,
  // 侧边栏
  sidebar: {
    open: false,
    docked: true
  },
  // 用户主页
  personindex: false,
  // 搜索框
  search: false,
  // 导航栏标题
  headerTitle: "查看分组",
  // ajax请求数据是否结束
  isAjax: true,
  // 当前被选中或者在查看中的名片
  activeId: 0,
  // 名片列表
  businessCardList: []
}

// 导出一个新生成的Store对象
export default new Vuex.Store({
  state,
  mutations,
  actions,
  getters
})
