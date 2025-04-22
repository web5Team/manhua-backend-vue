import request from '@/utils/request'

// 查询Comment列表
export function listComment(query) {
  return request({
    url: '/admin/v1/comment',
    method: 'get',
    params: query
  })
}

// 查询Comment详细
export function getComment(id) {
  return request({
    url: '/admin/v1/comment/' + id,
    method: 'get'
  })
}

// 新增Comment
export function addComment(data) {
  return request({
    url: '/admin/v1/comment',
    method: 'post',
    data: data
  })
}

// 修改Comment
export function updateComment(data) {
  return request({
    url: '/admin/v1/comment',
    method: 'put',
    data: data
  })
}

// 删除Comment
export function delComment(data) {
  return request({
    url: '/admin/v1/comment',
    method: 'delete',
    data: data
  })
}

