import request from '@/utils/request'

// 广告管理-列表
export function listAdvert(data) {
  return request({
    url: '/admin/v1/ad-base/list',
    method: 'get',
    params: data
  })
}
// 广告管理-删除
export function deleteAdvert(data) {
  return request({
    url: '/admin/v1/ad-base',
    method: 'delete',
    data
  })
}
// 广告管理-新增
export function addAdvert(data) {
  return request({
    url: '/admin/v1/ad-base',
    method: 'post',
    data
  })
}
// 广告管理-编辑
export function updateAdvert(data) {
  return request({
    url: '/admin/v1/ad-base',
    method: 'put',
    data
  })
}
// 广告管理-详情
export function advertDetailFeach(data) {
  return request({
    url: '/admin/v1/ad-base',
    method: 'get',
    params: data
  })
}
// 广告管理-版本号列表
export function listVersion(data) {
  return request({
    url: '/admin/v1/ad-base/version-simple-list',
    method: 'get',
    params: data
  })
}
