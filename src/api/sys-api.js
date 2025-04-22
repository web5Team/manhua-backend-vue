import request from '@/utils/request'

// 查询SysApi列表
export function listSysApi(query) {
  return request({
    url: '/admin/v1/apis',
    method: 'get',
    params: query
  })
}

// 查询SysApi详细
export function getSysApi(id) {
  return request({
    url: '/admin/v1/apis/' + id,
    method: 'get'
  })
}

// 新增SysApi
export function addSysApi(data) {
  return request({
    url: '/admin/v1/apis',
    method: 'post',
    data: data
  })
}

// 修改SysApi
export function updateSysApi(data) {
  return request({
    url: '/admin/v1/apis',
    method: 'put',
    data: data
  })
}

// 删除SysApi
export function delSysApi(data) {
  return request({
    url: '/admin/v1/apis',
    method: 'delete',
    data: data
  })
}

