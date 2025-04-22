import request from '@/utils/request'

// 查询岗位列表
export function listPost(query) {
  return request({
    url: '/admin/v1/posts',
    method: 'get',
    params: query
  })
}

// 查询岗位详细
export function getPost(postId) {
  return request({
    url: '/admin/v1/posts/' + postId,
    method: 'get'
  })
}

// 新增岗位
export function addPost(data) {
  return request({
    url: '/admin/v1/posts',
    method: 'post',
    data: data
  })
}

// 修改岗位
export function updatePost(data) {
  return request({
    url: '/admin/v1/posts',
    method: 'put',
    data: data
  })
}

// 删除岗位
export function delPost(data) {
  return request({
    url: '/admin/v1/posts',
    method: 'delete',
    data: data
  })
}

