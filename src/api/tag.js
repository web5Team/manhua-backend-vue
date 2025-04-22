import request from '@/utils/request'

// 查询Tag列表
export function listTag(query) {
  return request({
    url: '/admin/v1/tag',
    method: 'get',
    params: query
  })
}

// 查询Tag详细
export function getTag(id) {
  return request({
    url: '/admin/v1/tag/' + id,
    method: 'get'
  })
}

// 新增Tag
export function addTag(data) {
  return request({
    url: '/admin/v1/tag',
    method: 'post',
    data: data
  })
}

// 修改Tag
export function updateTag(data) {
  return request({
    url: '/admin/v1/tag',
    method: 'put',
    data: data
  })
}

// 删除Tag
export function delTag(data) {
  return request({
    url: '/admin/v1/tag',
    method: 'delete',
    data: data
  })
}

