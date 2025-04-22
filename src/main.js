import Vue from 'vue'

import Cookies from 'js-cookie'
import 'default-passive-events'

import 'normalize.css/normalize.css' // a modern alternative to CSS resets

import Element from 'element-ui'
import './styles/element-variables.scss'

import '@/styles/index.scss' // global css
import '@/styles/admin.scss'

import VueCodemirror from 'vue-codemirror'
import 'codemirror/lib/codemirror.css'
Vue.use(VueCodemirror)

import App from './App'
import store from './store'
import router from './router'
import permission from './directive/permission'

import { getDicts } from '@/api/sys-dict-data'
import { getItems, setItems } from '@/api/table'
import { getConfigKey } from '@/api/sys-config'
import { parseTime, resetForm, addDateRange, selectDictLabel, download, selectItemsLabel } from '@/utils/costum'
import { replaceDomainUrl } from '@/utils/index'
import cryptoCartoon from '@/utils/crypto-js'

import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log

import * as filters from './filters' // global filters

import Pagination from '@/components/Pagination'
import BasicLayout from '@/layout/BasicLayout'
import plTable from 'pl-table'

import 'pl-table/themes/index.css'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import weekday from 'dayjs/plugin/weekday'
import isToday from 'dayjs/plugin/isToday'
import XEUtils from "xe-utils";

dayjs.extend(duration)
dayjs.extend(weekday)
dayjs.extend(isToday)
Vue.prototype.dayjs = dayjs

import '@/utils/dialog'

// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getItems = getItems
Vue.prototype.setItems = setItems
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectItemsLabel = selectItemsLabel
Vue.prototype.download = download
Vue.prototype.cryptoCartoon = cryptoCartoon
Vue.prototype.replaceDomainUrl = replaceDomainUrl
Vue.prototype.$XEUtils = XEUtils;

// 全局组件挂载
Vue.component('Pagination', Pagination)
Vue.component('BasicLayout', BasicLayout)

Vue.prototype.msgSuccess = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'success' })
}

Vue.prototype.msgError = function(msg) {
  this.$message({ showClose: true, message: msg, type: 'error' })
}

Vue.prototype.msgInfo = function(msg) {
  this.$message.info(msg)
}

Vue.use(permission)
Vue.use(plTable)

Vue.use(Element, {
  size: Cookies.get('size') || 'medium' // set element-ui default size
})

import VueDND from 'awe-dnd'
Vue.use(VueDND)

import 'remixicon/fonts/remixicon.css'

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
