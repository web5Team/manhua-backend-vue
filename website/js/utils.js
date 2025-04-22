/**
 * 解析 search 为 对象形式
 * @param {Object}} urlObj url 对象 , 如 location
 */
  function parseSearchToObject(urlObj) {
    const search = urlObj.search //获取url中"?"符后的字串
    const tar = {}
    if (search.indexOf('?') != -1) {
      const str = search.substr(1)
      const strs = str.split('&')
      for (var i = 0; i < strs.length; i++) {
        tar[strs[i].split('=')[0]] = strs[i].split('=')[1]
      }
    }
    return tar
  }
  
   function px2viewport(pixel) {
    return (pixel / 360) * 100
  }
  // 延迟函数
function debounce(method, delay) {
    var timer = ''
    return () => {
      let args = arguments
      clearTimeout(timer)
      timer = setTimeout(() => {
        method.apply(this, args)
      }, delay)
    }
  }
  
   function getUrlQueryVariable(variable, str) {
    const query = str || window.location.search.substring(1)
    const vars = query.split('&')
    for (let i = 0; i < vars.length; i++) {
      const pair = vars[i].split('=')
      if (pair[0] == variable) {
        return decodeURIComponent(pair[1])
      }
    }
    return false
  }
  
  // 获取参数
   function getQueryString(name) {
    let reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i')
    let r = window.location.search.substr(1).match(reg)
    if (r != null) {
      return unescape(r[2])
    }
    return null
  }
  
 function isPC() {
    let reg = /Android|webOS|iPhone|iPod|BlackBerry|SymbianOS|Windows Phone/i
    return reg.test(navigator.userAgent) ? false : true
  }
  
  // 日期格式化
   function parseTime(time, pattern) {
    if (arguments.length === 0 || !time) {
      return null
    }
    const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
      date = time
    } else {
      if (typeof time === 'string' && /^[0-9]+$/.test(time)) {
        time = parseInt(time)
      }
      if (typeof time === 'number' && time.toString().length === 10) {
        time = time * 1000
      }
      date = new Date(time)
    }
    const formatObj = {
      y: date.getFullYear(),
      m: date.getMonth() + 1,
      d: date.getDate(),
      h: date.getHours(),
      i: date.getMinutes(),
      s: date.getSeconds(),
      a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
      let value = formatObj[key]
      // Note: getDay() returns 0 on Sunday
      if (key === 'a') {
        return ['日', '一', '二', '三', '四', '五', '六'][value]
      }
      if (result.length > 0 && value < 10) {
        value = '0' + value
      }
      return value || 0
    })
    return time_str
  }
  