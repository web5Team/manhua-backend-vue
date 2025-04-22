import request from '@/utils/request'

// 查询CommentReply列表
export function listCommentReply(query) {
  return request({
    url: '/admin/v1/comment-reply',
    method: 'get',
    params: query
  })
}

// 查询CommentReply详细
export function getCommentReply(id) {
  return request({
    url: '/admin/v1/comment-reply/' + id,
    method: 'get'
  })
}

// 新增CommentReply
export function addCommentReply(data) {
  return request({
    url: '/admin/v1/comment-reply',
    method: 'post',
    data: data
  })
}

// 修改CommentReply
export function updateCommentReply(data) {
  return request({
    url: '/admin/v1/comment-reply',
    method: 'put',
    data: data
  })
}

// 删除CommentReply
export function delCommentReply(data) {
  return request({
    url: '/admin/v1/comment-reply',
    method: 'delete',
    data: data
  })
}

