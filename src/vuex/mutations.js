/**
 * Created by Sugar on 2017/5/17.
 */

const mutations = {
  // 设置微信用户Id
  setUserId: (state, {userid}) => {
    state.userId = userid
  },
  // 页面标题变更
  changeTitle: (state, {title}) => {
    state.headerTitle = title
  },
  // 搜索
  showSearch: (state) => {
    state.search = !state.search
    if (!state.search) {
      state.searchKeyword = ''
    }
  },
  getSearchKeyword: (state, {keyword}) => {
    state.searchKeyword = keyword
  },
  getSearchResult: (state, {results}) => {
    state.searchResult = results
    state.isAjax = false
  },
  // 获取名片详情信息
  getCardDetails: (state, {details}) => {
    state.cardDetails = details
    state.isAjax = false
  },
  // 获取名片识别结果
  getCardScanResult: (state, {results}) => {
    localStorage.setItem('scanResult', JSON.stringify(results))
    state.scanResult = results;
    state.isAjax = false
  },
  // 显示识别的名片照片
  setScanCardImg: (state, {url}) => {
    state.scanCardImg = url
  },
  //
  updateScanResult: (state, key) => {
    state.scanResult[key] = results;
  },
  // 获取当前查看的名片id
  getActiveId: (state, {activeId}) => {
    state.activeId = activeId
  },
  // 查看详情
  viewDetail: (state) => {
    state.details = !state.details
    if (!state.details) {
      state.scanResult = {}
      // state.cardDetails = {}
    }
  },
  // 移除名片
  delCardItem: (state, {id}) => {
    console.log('del id', id);
    state.businessCardList.filter((item, index, arr) => {
      if (item.new_cardid == id) {
        state.businessCardList.splice(index, 1)
      }
    })
    state.isAjax = false
  },
  // 获取分组列表
  getGroups: (state, {groups}) => {
    state.groupList = groups;
    state.isAjax = false
  },
  getCurrGroup: (state, {group, id}) => {
    state.currGroup = group
    state.currGroupId = id
  },
  // 添加分组
  addGroup: (state, {groupName}) => {
    state.groupList.push(groupName)
  },
  // 获取名片列表数据
  getBCData: (state, {records}) => {
    state.businessCardList = records;
    // state.isAjax = false
  },
  // 获取crm中工商数据
  getCrmBsData: (state, {bsData}) => {
    state.compayBusinessData.push(bsData)
    state.isAjax = false
  },
  // 获取api中工商数据
  getApiBsData: (state, bsData) => {
    if (bsData) {
      state.compayBusinessData.push(bsData)
    } else {
      state.compayBusinessData = []
    }
    state.isAjax = false
  },
  // common
  // 弹出toast
  showToast: (state, {msg}) => {
    state.toastMsg = msg
    state.toast = true
    if (state.toastTimer) clearTimeout(state.toastTimer)
    state.toastTimer = setTimeout(() => {
      state.toastMsg = ''
      state.toast = false
    }, 2000)
  }
}

export default mutations
