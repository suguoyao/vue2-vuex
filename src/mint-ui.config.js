/**
 * Created by Sugar on 2017/8/24.
 */

// import { Cell, Checklist } from 'mint-ui';
import {PaletteButton} from 'mint-ui';

const components = {
  PaletteButton
}

export default {
  install(Vue) {
    Object.keys(components).forEach((key) => {
      Vue.component(components[key].name, components[key])
    })
  }
}
