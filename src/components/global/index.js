import Vue from 'vue'
import {
  XHeader,
  Actionsheet,
  ToastPlugin,
  Confirm,
  XNumber,
  Group,
  ButtonTab,
  ButtonTabItem,
  XInput
} from 'vux'

Vue.component('x-header', XHeader)

Vue.component('actionsheet', Actionsheet)

Vue.component('confirm', Confirm)

Vue.component('input-number', () => import('./InputNumber'))

Vue.component('x-number', XNumber)

Vue.component('button-tab', ButtonTab)

Vue.component('button-tab-item', ButtonTabItem)

Vue.component('group', Group)

Vue.component('x-input', XInput)

Vue.use(ToastPlugin)
