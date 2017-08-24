/**
 * Created by Sugar on 2017/5/17.
 */

const mutations = {
  // 页面标题变更
  changeTitle: (state, {title}) => {
    state.headerTitle = title
  },
  // 搜索
  showSearch: (state) => {
    state.search = !state.search
  },
  // 获取当前查看的名片id
  getActiveId: (state, {activeId}) => {
    state.activeId = activeId
  },
  // 查看详情
  viewDetail: (state) => {
    state.details = !state.details
  },
  // 添加分组
  addGroup: (state, {groupName}) => {
    state.groupList.push(groupName)
  },
  // 测试获取sf名片数据
  getBCData: (state, {records}) => {
    state.businessCardList = records;
    state.isAjax = false
  }
}

export default mutations
