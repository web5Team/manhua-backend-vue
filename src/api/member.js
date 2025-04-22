import request from '@/utils/request'

// 查询Member列表
export function listMember(query) {
  return request({
    url: '/admin/v1/member',
    method: 'get',
    params: query
  })
}

// 查询Member详细
export function getMember(id) {
  return request({
    url: '/admin/v1/member/' + id,
    method: 'get'
  })
}

// 新增Member
export function addMember(data) {
  return request({
    url: '/admin/v1/member',
    method: 'post',
    data: data
  })
}

// 修改Member
export function updateMember(data) {
  return request({
    url: '/admin/v1/member',
    method: 'put',
    data: data
  })
}

// 删除Member
export function delMember(data) {
  return request({
    url: '/admin/v1/member',
    method: 'delete',
    data: data
  })
}

// 头像审核接口
export function examineUserAvatarFeach(data) {
  return request({
    url: '/admin/v1/member/updateavatarstatus',
    method: 'put',
    data
  })
}
