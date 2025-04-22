import request from '@/utils/request'

// 清空操作日志
export function cleanOperlog() {
  return request({
    url: '/admin/v1/action-logs/clean',
    method: 'delete'
  })
}

// 查询SysOperlog列表
export function listSysOperlog(query) {
  return request({
    url: '/admin/v1/action-logs',
    method: 'get',
    params: query
  })
}

// 删除SysOperlog
export function delSysOperlog(data) {
  return request({
    url: '/admin/v1/action-logs',
    method: 'delete',
    data: data
  })
}

