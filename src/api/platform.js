import request from '@/utils/request'

// 查询Platform列表
export function listPlatform(query) {
  return request({
    url: '/admin/v1/platform',
    method: 'get',
    params: query
  })
}

// 查询Platform详细
export function getPlatform(id) {
  return request({
    url: '/admin/v1/platform/' + id,
    method: 'get'
  })
}

// 新增Platform
export function addPlatform(data) {
  return request({
    url: '/admin/v1/platform',
    method: 'post',
    data: data
  })
}

// 修改Platform
export function updatePlatform(data) {
  return request({
    url: '/admin/v1/platform',
    method: 'put',
    data: data
  })
}

// 删除Platform
export function delPlatform(data) {
  return request({
    url: '/admin/v1/platform',
    method: 'delete',
    data: data
  })
}

