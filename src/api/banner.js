import request from '@/utils/request'

// 查询Banner列表
export function listBanner(query) {
  return request({
    url: '/admin/v1/banner',
    method: 'get',
    params: query
  })
}

// 查询Banner详细
export function getBanner(id) {
  return request({
    url: '/admin/v1/banner/' + id,
    method: 'get'
  })
}

// 新增Banner
export function addBanner(data) {
  return request({
    url: '/admin/v1/banner',
    method: 'post',
    data: data
  })
}

// 修改Banner
export function updateBanner(data) {
  return request({
    url: '/admin/v1/banner',
    method: 'put',
    data: data
  })
}

// 删除Banner
export function delBanner(data) {
  return request({
    url: '/admin/v1/banner',
    method: 'delete',
    data: data
  })
}

// 批量修改banner的状态
export function changeBannerStatus(data) {
  return request({
    url: '/admin/v1/banner/batch',
    method: 'put',
    data
  })
}

