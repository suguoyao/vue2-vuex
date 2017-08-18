// 单组件加载

// 加载基础样式
import 'muse-components/styles/base.less'
import appBar from 'muse-components/appBar'
import avatar from 'muse-components/avatar'
import badge from 'muse-components/badge'
import dialog from 'muse-components/dialog'
import * as card from 'muse-components/card'
import * as menu from 'muse-components/menu'
import iconMenu from 'muse-components/iconMenu'
import dropDownMenu from 'muse-components/dropDownMenu'
import linearProgress from 'muse-components/linearProgress'
import circularProgress from 'muse-components/circularProgress'
import refreshControl from 'muse-components/refreshControl'
import * as bottomNav from 'muse-components/bottomNav'
import flatButton from 'muse-components/flatButton'
import iconButton from 'muse-components/iconButton'
import chip from 'muse-components/chip'
import drawer from 'muse-components/drawer'
import icon from 'muse-components/icon'
import * as list from 'muse-components/list'
import textField from 'muse-components/textField'
import * as tabs from 'muse-components/tabs'
import divider from 'muse-components/divider'
import subHeader from 'muse-components/subHeader'
// 这个模块在项目官网上并没有看到，但是看到作者在issues上回答时说是高分辨率屏的处理，于是就试着加进去了
import {retina} from 'muse-components/utils'

const components = {
  appBar,
  avatar,
  badge,
  dialog,
  ...card,
  ...menu,
  iconMenu,
  dropDownMenu,
  circularProgress,
  refreshControl,
  ...bottomNav,
  flatButton,
  iconButton,
  chip,
  drawer,
  icon,
  ...list,
  textField,
  ...tabs,
  divider,
  subHeader
}

export default {
  install(Vue) {
    Object.keys(components).forEach((key) => {
      Vue.component(components[key].name, components[key])
    })
    retina()
  }
}
