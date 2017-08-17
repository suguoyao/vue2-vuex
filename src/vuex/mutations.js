/**
 * Created by Sugar on 2017/5/17.
 */

const mutations = {
  // ajax获取用户信息
  getData: (state, data) => {
    // 将ajax获取到的值赋予state
    state.data = data
    // ajax请求状态为结束
    state.isAjax = false
  },
  // 页面标题变更
  changeTitle: (state, {title}) => {
    state.headerTitle = title
  },
  // 滑动删除
  swipeDelete: (state, {index, isSwipe}) => {
    console.log(index, isSwipe);
    state.messageList.splice(index, 1, {
      _id: index + 1,
      list: [{_id: index + 1, message: '你可以和我聊天', time: '4:28'}],
      isSwipe: isSwipe
    });
    console.log(state.messageList);
  },
  // 删除消息队列中的消息
  removeMessage: (state, {_id}) => {
    state.messageList.forEach((item, index, arr) => {
      if (item._id === _id) {
        arr.splice(index, 1)
      }
    })
  },

  // 测试获取sf名片数据
  getBCData: (state, {records}) => {
    // let list = [{
    //   _id: 1,
    //   list: [{_id: 1, message: '你可以和我聊天', time: '4:28'}]
    // }];
    // records.forEach((item, index, arr) => {
    //   list.push({_id: 5, friend: {_id: 5, name: item.Name}, list: [{_id: 1, message: item.Company__c, item: '12:28'}]})
    // })
    // state.messageList = state.messageList.concat(list)
    state.businessCardList = records;
    state.isAjax = false
  }
}

export default mutations
