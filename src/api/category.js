import request from '@/utils/request'

// 查询Category列表
export function listCategory(query) {
  return request({
    url: '/admin/v1/category',
    method: 'get',
    params: query
  })
}

// 查询Category详细
export function getCategory(id) {
  return request({
    url: '/admin/v1/category/' + id,
    method: 'get'
  })
}

// 新增Category
export function addCategory(data) {
  return request({
    url: '/admin/v1/category',
    method: 'post',
    data: data
  })
}

// 修改Category
export function updateCategory(data) {
  return request({
    url: '/admin/v1/category',
    method: 'put',
    data: data
  })
}

// 删除Category
export function delCategory(data) {
  return request({
    url: '/admin/v1/category',
    method: 'delete',
    data: data
  })
}

// 查询Category映射列表
export function listCategoryMapp(query) {
  return request({
    url: '/admin/v1/cartoon-category',
    method: 'get',
    params: query
  })
}

// 新增Category映射
export function addCategoryMapp(data) {
  return request({
    url: '/admin/v1/cartoon-category',
    method: 'post',
    data: data
  })
}

// 删除Category映射
export function delCategoryMapp(data) {
  return request({
    url: '/admin/v1/cartoon-category',
    method: 'delete',
    data: data
  })
}
