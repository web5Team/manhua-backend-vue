import request from '@/utils/request'

// 查询日志
export function getServerLog(date) {
  return request({
    url: '/admin/v1/serverlog/' + date,
    method: 'get'
  })
}
