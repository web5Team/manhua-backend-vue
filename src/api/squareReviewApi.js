import request from '@/utils/request'

// 广场评论列表
export function squareReviewCommentList(data) {
  return request({
    url: '/admin/v1/recommend/commentlist',
    method: 'get',
    params: data
  })
}

// 广场评论删除
export function delSquareReviewComment(id) {
  return request({
    url: '/admin/v1/recommend/comment/' + id,
    method: 'delete'
  })
}

// 广场评论修改状态
export function editSquareReviewCommentStatus(data) {
  return request({
    url: '/admin/v1/recommend/comment/batch',
    method: 'put',
    data
  })
}

// 广场评论回复列表
export function squareReviewReplyList(data) {
  return request({
    url: '/admin/v1/recommend/commentreplyList',
    method: 'get',
    params: data
  })
}

// 广场评论回复删除
export function delSquareReviewReply(id) {
  return request({
    url: '/admin/v1/recommend/commentReply/' + id,
    method: 'delete'
  })
}

// 广场评论回复修改状态
export function editSquareReviewReplyStatus(data) {
  return request({
    url: '/admin/v1/recommend/commentReply',
    method: 'put',
    data
  })
}

// 广场评论举报列表
export function squareReviewReportList(data) {
  return request({
    url: '/admin/v1/recommend/commentreportList',
    method: 'get',
    params: data
  })
}

// 广场评论举报删除
export function delSquareReviewReport(id) {
  return request({
    url: '/admin/v1/recommend/commentreport/' + id,
    method: 'delete'
  })
}

// 广场评论举报修改状态
export function editSquareReviewReportStatus(data) {
  return request({
    url: '/admin/v1/recommend/commentreport',
    method: 'put',
    data
  })
}
