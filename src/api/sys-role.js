import request from '@/utils/request'

// 查询角色列表
export function listRole(query) {
  return request({
    url: '/admin/v1/roles',
    method: 'get',
    params: query
  })
}

// 查询角色详细
export function getRole(roleId) {
  return request({
    url: '/admin/v1/roles/' + roleId,
    method: 'get'
  })
}

// 新增角色
export function addRole(data) {
  return request({
    url: '/admin/v1/roles',
    method: 'post',
    data: data
  })
}

// 修改角色
export function updateRole(data) {
  return request({
    url: '/admin/v1/roles',
    method: 'put',
    data: data
  })
}

// 角色数据权限
export function dataScope(data) {
  return request({
    url: '/admin/v1/role-data-scope',
    method: 'put',
    data: data
  })
}

// 角色状态修改
export function changeRoleStatus(roleId, status) {
  const data = {
    roleId,
    status
  }
  return request({
    url: '/admin/v1/role/status',
    method: 'put',
    data: data
  })
}

// 删除角色
export function delRole(data) {
  return request({
    url: '/admin/v1/roles',
    method: 'delete',
    data: data
  })
}

export function getListrole(id) {
  return request({
    url: '/admin/v1/menu/role/' + id,
    method: 'get'
  })
}

export function getRoutes() {
  return request({
    url: '/admin/v1/menu-role',
    method: 'get'
  })
}

export function getMenuNames() {
  return request({
    url: '/admin/v1/menuids',
    method: 'get'
  })
}
