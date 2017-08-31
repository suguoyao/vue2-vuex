/**
 * Created by Sugar on 2017/5/17.
 */

import router from './../router'
import axios from 'axios'
import jsonp from 'jsonp'

// actions里存放的是异步操作
// 由于vuex中的state的变更只能由mutations进行操作，所以actions不直接进行数据操作，而是调用mutations方法
// 以下出现的that都是vue实例对象，因为把axios绑定在了Vue原型上，vuex无法调用，所以这里需要传入this
const actions = {
  // 异步获取基础数据
  // 这里使用了es7的async函数，相当于封装了promis的generator
  // 获取名片列表
  getSFBusinessCard: async ({dispatch, commit}) => {
    let records = [];

    // let url = "select new_name,new_comp,new_mobile from new_card where new_memberid='" + context.OpenId + "'"
    let url = "select new_name,new_comp,new_mobile,_new_group_value from new_card"
    await client.query(url, (data) => {
      console.log("名片数据", data.value);
      records = data.value;
    }, (error) => {
      console.log(error);
    });

    await dispatch('getGroupList')

    commit('getBCData', {records: records})
  },
  // 获取名片分组
  getGroupList: async ({commit}) => {
    let groups = []
    await client.query("select new_groupid,new_name from new_group", (data) => {
      console.log("获取分组成功", data);
      groups = data.value && data.value.length > 0 ? data.value : []
    }, (error) => {
      console.log("获取分组失败", error);
    });

    commit('getGroups', {groups})
  },
  // 识别名片
  getScanResult: async ({dispatch, commit, state}, {file, that}) => {
    let results = {};

    // 显示识别中的loading
    state.isScan = true;

    await axios({
      url: 'https://netocr.com/api/recog.do',
      method: 'post',
      data: {
        file: file,
        key: 'CuJSU2hs3ex2cQ39KzXpsC',
        secret: '5af14827d6854a82a397009d928d33cc',
        typeId: 20,
        format: 'json'
      },
      transformRequest: [function (data) {
        // Do whatever you want to transform the data
        var ret = new FormData();
        ret.append('file', data.file);
        ret.append('key', data.key);
        ret.append('secret', data.secret);
        ret.append('typeId', data.typeId);
        ret.append('format', data.format);
        return ret
      }],
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then((res) => {
      console.log('名片识别成功', res.data);
      if (res.data.message.status == '0') {
        let rs = res.data.cardsinfo[0].items;

        for (let i = 0; i < rs.length; i++) {
          let item = rs[i];
          let index = item.index;
          let nId = item.nID;
          let content = item.content;
          if (index == "0") {
            switch (nId) {
              case "0"://姓名
                results.new_name = content;
                break;
              case "1"://职务部门
                results.new_dept = content;
                break;
              case "2"://手机
                results.new_mobile = content;
                break;
              case "3"://公司
                results.new_comp = content;
                break;
              case "4"://地址
                results.new_addr = content;
                break;
              case "5"://电话
                results.new_tel = content;
                break;
              case "6"://传真
                results.new_fax = content;
                break;
              case "7"://邮箱
                results.new_email = content;
                break;
              case "8"://网址
                results.new_fax = content;
                break;
              case "9"://邮编
                results.new_post = content;
                break;
              default:
                break;
            }
          }
        }

        console.log(results);
        commit('getCardScanResult', {results: results})
        router.push('result')
        commit('showToast', {msg: '识别成功'})
        // dispatch('saveCardResult', {cardResult: results})
      } else {
        commit('showToast', {msg: '识别失败，请重试'})
      }
      state.isScan = false
    });

  },
  // 更新名片详情信息
  updateCardDetails: async ({commit}, {id, details}) => {
    client.update("new_card", id, details, (data) => {
      console.log("更新成功", data);
      commit('getCardScanResult', {results: details})
      commit('showToast', {msg: '更新成功'})
      window.location.reload()

    }, (error) => {
      console.log("更新失败", error);
      commit('showToast', {msg: '更新失败，请重试'})
    });
  },
  //将名片识别结果存储到CRM系统中
  saveCardResult: async ({commit}, {cardResult}) => {
    // commit('getCardScanResult', {results: cardResult})
    await client.apexrest("new_cards", (data) => {
      console.log("名片存储成功", data);

      commit('getCardScanResult', {results: cardResult})
      commit('showToast', {msg: '保存成功'})
      router.replace('home')
    }, (error) => {
      console.log("名片存储失败", error);
      commit('showToast', {msg: '保存失败，请重试'})
    }, "POST", cardResult, null, true)
  },
  // 搜索名片
  searchCard: async ({commit}, {keyword}) => {
    // await client.query("", (data) => {
    //   console.log(data);
    //
    // }, (error) => {
    //   console.log(error);
    // });
  },
  // 查看名片详情
  getCardDetails: async ({commit}, {id}) => {
    let fields = 'new_name,new_mobile,new_tel,new_post,new_web,new_fax,new_email,new_dept,new_comp,new_addr,new_title'
    let details = {}

    await client.retrieve("new_card", id, fields, (data) => {
      console.log("获取名片详情成功", data);
      if (data.new_cardid) {
        details = data;

        commit('getCardScanResult', {results: details})
      }
    }, (error) => {
      console.log("获取名片详情失败", error);
    });
  },
  // 删除名片
  delCard: async ({commit}, {id}) => {
    client.del("new_card", id, (data) => {
      console.log('删除名片成功', data);
      commit('delCardItem', {id})
      commit('showToast', {msg: '删除成功'})
    }, (error) => {
      console.log('删除名片失败', error);
    });
  },
  // 从CRM系统获取工商信息
  getBusinessDataByCRM: async ({dispatch, commit}, {company}) => {
    let bsData = {};
    // select new_buscompanyId,new_enterpriseName,new_frName,new_regNo from new_buscompany where new_enterprisename = 企业名称
    let url = "select new_enterprisename,new_frname,new_regno,new_creditcode,new_regcap,new_regcapcur,new_esdate,new_openfrom,new_opento,new_enterprisetype,new_enterprisestatus,new_operatescope from new_buscompanie where new_enterprisename='" + company + "'";
    await client.query(url, (data) => {
      console.log("系统中的工商信息", data);
      if (data.value.length > 0) {
        bsData = data.value[0];

        // 显示工商信息
        commit('getCrmBsData', {bsData})
      } else {
        dispatch('getBusinessDataByApi', {company})
      }
    }, (error) => {
      console.log(error);
    });
  },
  // 从第三方接口获取工商信息
  getBusinessDataByApi: async ({dispatch, commit}, {company}) => {
    let bsData = {};

    let key = '09863cd4ace198743f7ce7f845beb83a';
    await jsonp("https://v.juhe.cn/youshu/query?key=" + key + "&name=" + company, null, (err, data) => {
      if (err) {
        console.error(err.message);
      } else {
        console.log(data);
        if (data.error_code == 0) {
          if (data.result !== null) {
            bsData = data.result

            // 将返回信息字段全部加上前缀new_
            let newBsData = {}
            Object.keys(bsData).forEach(key => newBsData['new_' + key.toLowerCase()] = bsData[key])

            dispatch('saveBsDataResult', {newBsData})
          }
        } else {
          // dispatch('saveBsDataResult', {newBsData:{}})

          commit('getApiBsData', {newBsData: {new_comp: ''}})
        }
      }
    });

  },
  //将查询到的工商信息存储到CRM系统中
  saveBsDataResult: async ({commit}, {newBsData}) => {
    await client.apexrest("new_buscompanies", (data) => {
      console.log("工商信息存储成功", data);

    }, (error) => {
      console.log(error);
    }, "POST", newBsData, null, true)

    // 显示工商信息
    commit('getApiBsData', {newBsData})
  }
}


export default actions
