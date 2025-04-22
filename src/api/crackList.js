import request from '@/utils/request'

// 破解列表
// 删除破解
export function delCarackFeach(id) {
  return request({
    url: '/admin/v1/deviceblacklist/' + id,
    method: 'delete'
  })
}
// 修改破解状态
export function changeCarackStatusFeach(data) {
  return request({
    url: '/admin/v1/deviceblacklist',
    method: 'put',
    data
  })
}
// 破解列表
export function getCarackListFeach(data) {
  return request({
    url: '/admin/v1/deviceblacklists',
    method: 'get',
    params: data
  })
}
