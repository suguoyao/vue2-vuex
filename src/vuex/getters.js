/**
 * Created by Sugar on 2017/5/17.
 */

const getters = {
  // 对当前队列消息列表进行加工，添加对应好友资料
  nowMessageList: (state) => {
    let list = state.messageList;

    list.forEach(x => {
      // 筛选_id相同的好友
      let friend = state.data.friends.filter(i => i._id === x._id)[0]
      if (x._id !== 5) {
        x.friend = friend
      }
    })

    return list
  }
}

export default getters
