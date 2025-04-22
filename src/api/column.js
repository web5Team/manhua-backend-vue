import request from '@/utils/request'

// 查询Column列表
export function listColumn(query) {
  return request({
    url: '/admin/v1/column',
    method: 'get',
    params: query
  })
}

// 查询Column详细
export function getColumn(id) {
  return request({
    url: '/admin/v1/column/' + id,
    method: 'get'
  })
}

// 新增Column
export function addColumn(data) {
  return request({
    url: '/admin/v1/column',
    method: 'post',
    data: data
  })
}

// 修改Column
export function updateColumn(data) {
  return request({
    url: '/admin/v1/column',
    method: 'put',
    data: data
  })
}

// 删除Column
export function delColumn(data) {
  return request({
    url: '/admin/v1/column',
    method: 'delete',
    data: data
  })
}

