import request from '@/utils/request'

// 获取验证码
export function getCodeImg() {
  return request({
    url: '/admin/v1/captcha',
    method: 'get'
  })
}

// 查询
export function getSetting() {
  return request({
    url: '/admin/v1/setting',
    method: 'get'
  })
}

// 修改
export function updateSetting(data) {
  return request({
    url: '/admin/v1/setting',
    method: 'post',
    data: data
  })
}

export function login(data) {
  return request({
    url: '/admin/v1/login',
    method: 'post',
    data
  })
}

export function refreshtoken(data) {
  return request({
    url: '/admin/v1/refresh-token',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/admin/v1/getinfo',
    method: 'get'
  })
}

export function logout() {
  return request({
    url: '/admin/v1/logout',
    method: 'post'
  })
}

export function tripleDESkey() {
  return request({
    url: '/admin/v1/config/decryptkey',
    method: 'get'
  })
}
