/**
 * Created by Sugar on 2017/5/17.
 */

var pinyin = require("pinyin");

const getters = {
  //  从名片列表中提取出首字母 再排序
  bcInitialList: (state) => {
    var initialList = [],
      allBCs = state.businessCardList,
      max = allBCs.length
    for (var i = 0; i < max; i++) {
      var fl = pinyin(allBCs[i].new_name || '#', {
        style: pinyin.STYLE_FIRST_LETTER
      })[0][0].substr(0, 1).toUpperCase()

      if (initialList.indexOf(fl) == -1) {
        initialList.push(fl)
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
        let fl = pinyin(allBCList[j].new_name || '#', {
          style: pinyin.STYLE_FIRST_LETTER
        })[0][0].substr(0, 1).toUpperCase()

        if (fl == protoTypeName) {
          bcsSortList[protoTypeName].push(allBCList[j])
        }
      }
    }
    return bcsSortList
  }
}

export default getters
