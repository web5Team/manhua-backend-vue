import request from '@/utils/request'

// 查询服务器详细
export function getServer() {
  return request({
    url: '/admin/v1/monitor/server',
    method: 'get'
  })
}

// 查询首页统计数量
export function getMainCount() {
  return request({
    url: '/admin/v1/maincount',
    method: 'get'
  })
}
