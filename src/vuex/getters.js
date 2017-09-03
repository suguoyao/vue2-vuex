/**
 * Created by Sugar on 2017/5/17.
 */

import pinyin from 'pinyin'
import bskey from '../common/js/BSKEY'

const getters = {
  // 搜索名片
  getCardBySearch: (state) => {
    let allBCs = state.businessCardList,
      resultList = []

    allBCs.filter(item => {
      if (state.searchKeyword.length > 0) {
        if (item.new_name !== null && item.new_name.indexOf(state.searchKeyword) > -1) {
          resultList.push(item)
        }
      }
    })

    return resultList
  },
  //  从名片列表中提取出首字母 再排序
  bcInitialList: (state) => {
    var initialList = [],
      allBCs = state.businessCardList,
      max = allBCs.length,
      currGId = state.currGroupId

    for (var i = 0; i < max; i++) {
      let gid = allBCs[i]._new_group_value;

      if (gid == currGId || currGId == 0) {
        let lt = '';
        if (allBCs[i].new_name == null) {
          lt = '#'
          // let lt = isNaN(parseFloat(allBCs[i].new_name)) ? '#' : allBCs[i].new_name
        } else {
          lt = isNaN(parseFloat(allBCs[i].new_name)) ? allBCs[i].new_name : '#'
        }
        var fl = pinyin(lt, {
          style: pinyin.STYLE_FIRST_LETTER
        })[0][0].substr(0, 1).toUpperCase()

        if (initialList.indexOf(fl) == -1) {
          initialList.push(fl)
        }
      }
    }

    initialList.sort();

    // 存在'#'，放最后面
    if (initialList.indexOf('#') > -1) {
      for (let i = 0; i < initialList.length; i++) {
        if (initialList[i] == '#') {
          initialList.splice(i, 1)
          initialList.push('#')
          break
        }
      }
    }

    return initialList;
  },
  // 将名片根据首字母进行分类
  bcsSortList: (state, getters) => {
    let bcsSortList = {},
      allBCList = state.businessCardList,
      max = allBCList.length;

    for (let i = 0; i < getters.bcInitialList.length; i++) {
      let protoTypeName = getters.bcInitialList[i]
      bcsSortList[protoTypeName] = []
      for (let j = 0; j < max; j++) {
        let lt = '';
        if (allBCList[j].new_name == null) {
          lt = '#'
        } else {
          lt = isNaN(parseFloat(allBCList[j].new_name)) ? allBCList[j].new_name : '#'
        }

        let fl = pinyin(lt, {
          style: pinyin.STYLE_FIRST_LETTER
        })[0][0].substr(0, 1).toUpperCase()

        if (fl == protoTypeName) {
          bcsSortList[protoTypeName].push(allBCList[j])
        }
      }
    }
    return bcsSortList
  },
  // 根据分组进行筛选
  getCardsByGroup: (state, getters) => {
    let currG = state.currGroup,
      currGID = state.currGroupId,
      bcList = getters.bcsSortList,
      gList = {}

    if (currG !== '全部') {

      for (let key in bcList) {
        let letterList = bcList[key]
        let newLetterList = []
        console.log(letterList);
        for (let i = 0; i < letterList.length; i++) {
          let gId = letterList[i]._new_group_value
          if (gId && gId == currGID) {
            newLetterList.push(letterList[i])
          }
        }
        if (newLetterList.length > 0) {
          gList[key] = newLetterList
        }
      }

      return gList
    } else {
      return bcList
    }
  },
  // 获取当前分组下名片的数量
  getCardsCount: (state, getters) => {
    let list = getters.getCardsByGroup;
    let count = 0;
    for (let key in list) {
      let item = list[key];
      for (let i = 0; i < item.length; i++) {
        count++
      }
    }

    return count
  },
  // 获取名片详情信息字段标题,icon 等
  // 获取名片识别结果详情字段标题，icon等
  getDetailsTitle: (state) => {
    let newData = {},
      oldData = state.scanResult;

    Object.keys(oldData).forEach(key => {
      if (bskey[key] && bskey.hasOwnProperty(key)) {
        newData[key] = oldData[key] || ''
      }
    })

    // if (oldData._new_group_value) {
    //   newData._new_group_value = oldData._new_group_value
    // }

    return newData
  },
  // 获取当前查看名片的分组名
  getCardDetailGroupName: (state) => {
    let details = state.scanResult
    let glist = state.groupList
    let gname = ''

    console.log('getters', details);
    if (details._new_group_value == null || details._new_group_value == 'undefined') {
      return '未分组'
    }

    for (let i = 0; i < glist.length; i++) {
      if (glist[i].new_groupid == details._new_group_value) {
        gname = glist[i].new_name;
        break;
      }
    }

    return gname
  },
  // 获取工商信息标题
  getBSTitle: (state, getters) => {
    let newBsData = {},
      oldBsData = state.compayBusinessData[0];

    Object.keys(oldBsData).forEach(key => {
      if (bskey[key]) {
        newBsData[bskey[key]] = oldBsData[key]
      }
    })

    return newBsData
  }
}

export default getters
