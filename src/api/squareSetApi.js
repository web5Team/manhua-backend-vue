import request from '@/utils/request'

// 广场管理列表
export function listSquarte(data) {
  return request({
    url: '/admin/v1/recommendList',
    method: 'get',
    params: data
  })
}
// 广场管理删除
export function delSquarte(id) {
  return request({
    url: '/admin/v1/recommend/del/' + id,
    method: 'delete'
  })
}
// 广场管理修改状态
export function editSquarteStatus(data) {
  return request({
    url: '/admin/v1/recommend/batchcategorystatus',
    method: 'put',
    data
  })
}

// 广场管理修改
export function editSquarte(data) {
  return request({
    url: '/admin/v1/recommendUpdate',
    method: 'put',
    data
  })
}

// 广场举报列表
export function listSquarteReport(data) {
  return request({
    url: '/admin/v1/recommendreportList',
    method: 'get',
    params: data
  })
}
// 广场举报删除
export function delSquarteReport(id) {
  return request({
    url: '/admin/v1/recommendreport/' + id,
    method: 'delete'
  })
}
// 广场举报修改状态
export function editSquarteReportStatus(data) {
  return request({
    url: '/admin/v1/recommendreport/batchcategorystatus',
    method: 'put',
    data
  })
}


// 查询Tag列表
export function listSquareTag(query) {
  return request({
    url: '/admin/v1/topic',
    method: 'get',
    params: query
  })
}

// 查询Tag详细
export function getSquareTag(id) {
  return request({
    url: '/admin/v1/topic/' + id,
    method: 'get'
  })
}

// 新增Tag
export function addSquareTag(data) {
  return request({
    url: '/admin/v1/topic',
    method: 'post',
    data: data
  })
}

// 修改Tag
export function updateSquareTag(data) {
  return request({
    url: '/admin/v1/topic',
    method: 'put',
    data: data
  })
}

// 删除Tag
export function delSquareTag(data) {
  return request({
    url: '/admin/v1/topic',
    method: 'delete',
    data: data
  })
}
