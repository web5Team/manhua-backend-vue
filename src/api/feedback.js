import request from '@/utils/request'

// 查询Feedback列表
export function listFeedback(query) {
  return request({
    url: '/admin/v1/feedback',
    method: 'get',
    params: query
  })
}

// 查询Feedback详细
export function getFeedback(id) {
  return request({
    url: '/admin/v1/feedback/' + id,
    method: 'get'
  })
}

// 新增Feedback
export function addFeedback(data) {
  return request({
    url: '/admin/v1/feedback',
    method: 'post',
    data: data
  })
}

// 修改Feedback
export function updateFeedback(data) {
  return request({
    url: '/admin/v1/feedback',
    method: 'put',
    data: data
  })
}
// 意见纠错回复
export function replyFeedback(data) {
  return request({
    url: '/admin/v1/feedback/reply',
    method: 'post',
    data: data
  })
}

// 删除Feedback
export function delFeedback(data) {
  return request({
    url: '/admin/v1/feedback',
    method: 'delete',
    data
  })
}

// 批量修改状态
export function editFeedbackStatus(data) {
  return request({
    url: '/admin/v1/feedback/batch',
    method: 'put',
    data
  })
}

