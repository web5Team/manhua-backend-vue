import request from '@/utils/request'

// 消息中心-添加
export const addMessage = (data) => {
  return request({
    url: '/admin/v1/member-notify',
    method: 'post',
    data
  })
}
// 消息中心-列表
export const listMessage = (data) => {
  return request({
    url: '/admin/v1/member-notify',
    method: 'get',
    params: data
  })
}
// 消息中心-删除
export const deleteMessage = (data) => {
  return request({
    url: '/admin/v1/member-notify',
    method: 'delete',
    data
  })
}
