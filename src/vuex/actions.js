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

  // 获取userid
  getUserId: async ({dispatch, commit}) => {
    let userid = 0;

    await client.query("select vlink_wechat_userid from vlink_wechat_user where vlink_open_id ='" + context.OpenId + "'", (data) => {
      console.log("getUserId", data);
      userid = data.value.length > 0 ? data.value[0].vlink_wechat_userid : 0
    }, (error) => {
      console.log(error);
    });

    if (userid !== 0) {
      await dispatch('getSFBusinessCard', {userid})
    } else {
      await dispatch('createWechatUser')
    }
  },
  // 创建微信用户
  createWechatUser: async ({dispatch}) => {
    await client.create("vlink_wechat_user", {vlink_open_id: context.OpenId}, (data) => {
      console.log(data)
      dispatch('getUserId')
    }, (error) => {
      console.log(error)
    })
  },
  // 获取名片列表
  getSFBusinessCard: async ({dispatch, commit}, {userid}) => {
    // 有微信用户Id,设置全局
    commit('setUserId', {userid})

    let records = [];

    let url = "select new_cardid,new_name,new_comp,new_mobile,new_card_url,_new_group_value from new_card where _new_wechatuser_value=" + userid
    // let url = "select new_name,new_comp,new_mobile,_new_group_value,_new_wechatuser_value from new_card"
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
  // 搜索名片
  searchCards: async ({commit, state}, {keyword}) => {
    let results = [];
    await client.contains("new_card", {
      new_name: keyword,
      new_comp: keyword,
      new_mobile: keyword,
      new_tel: keyword,
      new_email: keyword,
      new_dept: keyword,
      new_addr: keyword,
      new_web: keyword,
      new_fax: keyword,
      new_post: keyword,
    }, {_new_wechatuser_value: state.userId}, (data) => {
      console.log("查询名片成功", data);
      results = data.value;
    }, (error) => {
      console.log("查询名片失败", error);
    });

    commit('getSearchResult', {results})
  },
  // 识别名片
  getScanResult: async ({dispatch, commit, state}, {file, url}) => {
    let results = {};

    // 显示识别中的loading
    // state.isScan = true;

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
                results.new_web = content;
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
        commit('setScanCardImg', {url: url})
        router.push('result')
        commit('showToast', {msg: '识别成功'})
        // dispatch('saveCardResult', {cardResult: results})
      } else {
        commit('showToast', {msg: '识别失败，请重试'})
      }
      state.isScan = false
    }).catch((error) => {
      state.isScan = false
      commit('showToast', {msg: '识别失败，请重试'})
    });

  },
  // 更新名片详情信息
  updateCardDetails: async ({commit, state}, {id, details, groupid, userid}) => {
    // details._new_group_value = groupid
    let newDetails = {}

    Object.keys(details).forEach(key => {
      newDetails[key] = details[key]
    })
    // newDetails._new_group_value = groupid
    // newDetails.new_group = groupid
    if (groupid !== 0 && groupid !== null) {
      newDetails['new_group@odata.bind'] = "/new_groups(" + groupid + ")"
    }
    newDetails['new_wechatUser@odata.bind'] = "/vlink_wechat_users(" + userid + ")"

    await client.update("new_card", id, newDetails, (data) => {
      console.log("更新成功", data);
      commit('getCardScanResult', {results: details})
      commit('showToast', {msg: '更新成功'})

      setTimeout(function () {
        window.location.reload()
      }, 1000);
    }, (error) => {
      console.log("更新失败", error);
      commit('showToast', {msg: '更新失败，请重试'})
      state.saving = false
    });
    delete details._new_group_value

    // setTimeout(function () {
    //   window.location.reload()
    // }, 1000);
  },
  //将名片识别结果存储到CRM系统中
  saveCardResult: async ({dispatch, commit, state}, {cardResult, groupid, userid}) => {
    state.saving = true;

    let uploadResult = null;
    let rname = new Date().getTime() + '.jpg';
    let oss = new uploadfile.Client();
    let fname = 'custom/' + context.AppId + '/card/' + rname;
    let vlink_url = 'https://test.veevlink.com/Proxy';
    let oss_url = 'https://oss-test.veevlink.com/';

    uploadResult = await oss.uploadToOSS(state.scanCardImg, fname, vlink_url, oss_url);

    console.log('uploadResult', uploadResult);


    // commit('getCardScanResult', {results: cardResult})
    let newDetails = {}

    Object.keys(cardResult).forEach(key => {
      newDetails[key] = cardResult[key]
    })

    if (groupid !== 0 && groupid !== null) {
      newDetails['new_group@odata.bind'] = "/new_groups(" + groupid + ")"
    }
    newDetails['new_wechatUser@odata.bind'] = "/vlink_wechat_users(" + userid + ")"

    if (uploadResult !== null && uploadResult !== 'error') {
      newDetails.new_card_url = uploadResult;

      await client.apexrest("new_cards", (data) => {
        console.log("名片存储成功", data);

        commit('getCardScanResult', {results: cardResult})
        // 上传图片
        commit('showToast', {msg: '保存成功'})
        router.replace('/')
      }, (error) => {
        console.log("名片存储失败", error);
        commit('showToast', {msg: '保存失败，请重试'})
      }, "POST", newDetails, null, true)
      state.saving = false
    } else {
      commit('showToast', {msg: '图片上传失败，请重试'})
      state.saving = false
    }
  },
  // 上传名片照片
  uploadCardImg: async ({commit}, {file, dataUrl}) => {
    let rname = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    }) + '.jpg';
    let oss = new uploadfile.Client();
    let fname = 'custom/' + context.AppId + '/card/' + rname;
    let vlink_url = 'https://test.veevlink.com/Feihe';
    let oss_url = 'https://veevlink-dev.oss-cn-qingdao.aliyuncs.com';
    let uploadResult = null;

    await (function () {
      uploadResult = oss.uploadToOSS(dataUrl, fname, vlink_url, oss_url);
    })()

    console.log('uploadResult', uploadResult);

    if (uploadResult !== null && uploadResult !== 'error') {
      commit('showToast', {msg: '保存成功'})
      router.replace('/')
    } else {
      commit('showToast', {msg: '图片上传失败，请重试'})
    }
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
    let fields = '_new_wechatuser_value,_new_group_value,new_name,new_mobile,new_email,new_comp,new_addr,new_tel,new_dept,new_web,new_post,new_fax,new_card_url'
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
    let url = "select new_faren,new_regnumber,new_regmoney,new_creditcode,new_regcap,new_regdate,new_business,new_companytype,new_businessstatus,new_cervalidityperiod,new_companycode,new_companyname,new_companykey,new_companysize,new_areacode,new_areaname,new_regorgname,new_issuetime,new_invalidtime,new_phonearea,new_phone,new_provincename,new_email,new_website,new_tradedic,new_address,new_regtype,new_chkdate,new_operatescope,new_yearchk from new_buscompanie where new_companyname='" + company + "'";
    await client.query(url, (data) => {
      console.log("系统中的工商信息", data);
      if (data.value.length > 0) {
        bsData = data.value[0];

        // 显示工商信息
        commit('getCrmBsData', {bsData})
      } else {
        dispatch('getBsDataApiToken', {company})
      }
    }, (error) => {
      console.log(error);
    });
  },
  // 获取第三方接口token
  getBsDataApiToken: async ({dispatch, commit}, {company}) => {
    let token = 0;
    await axios({
      method: "get",
      url: "https://api.qianzhan.com/OpenPlatformService/GetToken?type=JSON&appkey=5c6a51ad662ecfc5&seckey=ea5df4dd88579f89"
    }).then((res) => {
      console.log(res.data);
      if (res.data.status == "200") {
        token = res.data.result.token;
      }
    })
    if (token !== 0) {
      dispatch("getBusinessDataByApi", {company, token})
    } else {

    }
  },
  // 从第三方接口获取工商信息
  getBusinessDataByApi: async ({dispatch, commit}, {company, token}) => {
    let bsData = {};

    /*
    let key = '09863cd4ace198743f7ce7f845beb83a'; // juhe key
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
    });  */
    await axios({
      method: "get",
      url: "https://api.qianzhan.com/OpenPlatformService/OrgCompanyListByCompanyName?token=" + token + "&type=JSON&companyName=" + company
    }).then((res) => {
      console.log("查询工商数据成功", res.data);
      if (res.data.status == "200") {
        if (res.data.result !== null) {
          bsData = res.data.result

          // 将返回信息字段全部加上前缀new_
          let newBsData = {}
          Object.keys(bsData).forEach(key => newBsData['new_' + key.toLowerCase()] = bsData[key])

          let tradedic = newBsData['new_tradedic'];
          let newTrade = "";
          for (let k in tradedic) {
            // newBsData['new_tradedic'] +=
            newTrade += tradedic[k];
          }
          newBsData['new_tradedic'] = newTrade;

          dispatch('saveBsDataResult', {newBsData})
        } else {
          commit('getApiBsData')
        }
      } else {
        commit('getApiBsData')
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
    commit('getApiBsData', newBsData)
  }
}


export default actions
