/**
 * Created by Sugar on 2017/5/17.
 */

// actions里存放的是异步操作
// 由于vuex中的state的变更只能由mutations进行操作，所以actions不直接进行数据操作，而是调用mutations方法
// 以下出现的that都是vue实例对象，因为把axios绑定在了Vue原型上，vuex无法调用，所以这里需要传入this
const actions = {
  // 异步获取基础数据
  // 这里使用了es7的async函数，相当于封装了promis的generator
  getAllData: async ({commit}, that) => {
    let self = {}
    let friends = {}

    await that.$http.get('/api/self').then(({data}) => {
      self = data.data
    })

    await that.$http.get('/api/friends').then(({data}) => {
      friends = data.data
    })

    commit('getData', {self, friends})
  },
  // 测试请求SF接口
  getSFBusinessCard: async ({commit}, that) => {
    let records = [];

    // await that.$http.get('/api/getBusinessCard').then(({data}) => {
    //   bc = JSON.parse(data.data);
    // })
    let memberid = '9987b011-217b-e711-81ca-0248aae46430';
    let url = "select new_name,new_mobile,new_email,new_comp,new_dept from new_card where new_memberid='" + memberid + "'"
    await client.query(url, function (data) {
      console.log("名片数据", data.value);
      records = data.value;
    }, function (error) {
      console.log(error);
    });

    commit('getBCData', {records})
  }
}


export default actions
