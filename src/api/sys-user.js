import request from '@/utils/request'

// 查询用户列表
export function listUser(query) {
  return request({
    url: '/admin/v1/sys-users',
    method: 'get',
    params: query
  })
}

// 查询用户详细
export function getUser(userId) {
  return request({
    url: '/admin/v1/sys-users/' + userId,
    method: 'get'
  })
}

export function getUserInit() {
  return request({
    url: '/admin/v1/sys-users/',
    method: 'get'
  })
}

// 新增用户
export function addUser(data) {
  return request({
    url: '/admin/v1/sys-users',
    method: 'post',
    data: data
  })
}

// 修改用户
export function updateUser(data) {
  return request({
    url: '/admin/v1/sys-users',
    method: 'put',
    data: data
  })
}

// 删除用户
export function delUser(data) {
  return request({
    url: '/admin/v1/sys-users',
    method: 'delete',
    data: data
  })
}

// 导出用户
export function exportUser(query) {
  return request({
    url: '/admin/v1/sys-users/export',
    method: 'get',
    params: query
  })
}

// 用户密码重置
export function resetUserPwd(userId, password) {
  const data = {
    userId,
    password
  }
  return request({
    url: '/admin/v1/user/pwd/reset',
    method: 'put',
    data: data
  })
}

// 用户状态修改
export function changeUserStatus(userId, status) {
  const data = {
    userId,
    status
  }
  return request({
    url: '/admin/v1/user/status',
    method: 'put',
    data: data
  })
}

// 查询用户个人信息
export function getUserProfile() {
  return request({
    url: '/admin/v1/user/profile',
    method: 'get'
  })
}

// 修改用户个人信息
export function updateUserProfile(data) {
  return request({
    url: '/admin/v1/user/profile',
    method: 'put',
    data: data
  })
}

// 用户密码重置
export function updateUserPwd(oldPassword, newPassword) {
  const data = {
    oldPassword,
    newPassword
  }
  return request({
    url: '/admin/v1/user/pwd/set',
    method: 'put',
    data: data
  })
}

// 用户头像上传
export function uploadAvatar(data) {
  return request({
    url: '/admin/v1/user/avatar',
    method: 'post',
    data: data
  })
}

// 下载用户导入模板
export function importTemplate() {
  return request({
    url: '/admin/v1/user/importTemplate',
    method: 'get'
  })
}
