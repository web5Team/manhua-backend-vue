import request from '@/utils/request'

// 查询Findcartoon列表
export function listFindcartoon(query) {
  return request({
    url: '/admin/v1/findcartoon',
    method: 'get',
    params: query
  })
}

// 查询Findcartoon详细
export function getFindcartoon(id) {
  return request({
    url: '/admin/v1/findcartoon/' + id,
    method: 'get'
  })
}

// 新增Findcartoon
export function addFindcartoon(data) {
  return request({
    url: '/admin/v1/findcartoon',
    method: 'post',
    data: data
  })
}

// 修改Findcartoon
export function updateFindcartoon(data) {
  return request({
    url: '/admin/v1/findcartoon',
    method: 'put',
    data: data
  })
}

// 用户找漫画
export function replyFindcartoon(data) {
  return request({
    url: '/admin/v1/findcartoon/reply',
    method: 'post',
    data: data
  })
}
// 删除Findcartoon
export function delFindcartoon(data) {
  return request({
    url: '/admin/v1/findcartoon',
    method: 'delete',
    data: data
  })
}

// 批量修改findcartoon
export function editFindcartoonStatus(data) {
  return request({
    url: '/admin/v1/findcartoon/batch',
    method: 'put',
    data: data
  })
}

