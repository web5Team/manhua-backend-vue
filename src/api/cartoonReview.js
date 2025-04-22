import request from '@/utils/request'

// 漫画评论管理-列表
export function listCartoonComment(data) {
  return request({
    url: '/admin/v1/comment',
    method: 'get',
    params: data
  })
}
// 漫画评论管理-删除
export function deleteCartoonComment(data) {
  return request({
    url: '/admin/v1/comment',
    method: 'delete',
    data
  })
}
// 漫画评论管理-修改状态
export function editCartoonCommentStatus(data) {
  return request({
    url: '/admin/v1/comment/batch',
    method: 'put',
    data
  })
}

// 漫画评论回复管理-列表
export function listCartoonReply(data) {
  return request({
    url: '/admin/v1/comment-reply',
    method: 'get',
    params: data
  })
}
// 漫画评论回复管理-删除
export function deleteCartoonReply(data) {
  return request({
    url: '/admin/v1/comment-reply',
    method: 'delete',
    data
  })
}
// 漫画评论回复管理-修改状态
export function editCartoonReplyStatus(data) {
  return request({
    url: '/admin/v1/comment-reply/batch',
    method: 'put',
    data
  })
}

// 漫画评论举报管理-列表
export function listCartoonReport(data) {
  return request({
    url: '/admin/v1/report',
    method: 'get',
    params: data
  })
}
// 漫画评论举报管理-删除
export function deleteCartoonReport(data) {
  return request({
    url: '/admin/v1/report',
    method: 'delete',
    data
  })
}
// 漫画评论举报管理-修改状态
export function editCartoonReportStatus(data) {
  return request({
    url: '/admin/v1/report/batch',
    method: 'put',
    data
  })
}
