import request from '@/utils/request'

// 查询SysLoginlog列表
export function listSysLoginlog(query) {
  return request({
    url: '/admin/v1/login-logs',
    method: 'get',
    params: query
  })
}

// 查询SysLoginlog详细
export function getSysLoginlog(ID) {
  return request({
    url: '/admin/v1/login-logs/' + ID,
    method: 'get'
  })
}

// 删除SysLoginlog
export function delSysLoginlog(data) {
  return request({
    url: '/admin/v1/login-logs',
    method: 'delete',
    data: data
  })
}

// 清空SysLoginlog
export function cleanSysLoginlog() {
  return request({
    url: '/admin/v1/login-logs/clean',
    method: 'delete'
  })
}

