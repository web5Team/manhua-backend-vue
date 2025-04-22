import request from '@/utils/request'

// 查询Device列表
export function listDevice(query) {
  return request({
    url: '/admin/v1/device',
    method: 'get',
    params: query
  })
}

// 查询Device详细
export function getDevice(id, appId) {
  return request({
    url: '/admin/v1/device/' + id + '?appId=' + appId,
    method: 'get'
  })
}

// 新增Device
export function addDevice(data) {
  return request({
    url: '/admin/v1/device',
    method: 'post',
    data: data
  })
}

// 修改Device
export function updateDevice(data) {
  return request({
    url: '/admin/v1/device',
    method: 'put',
    data: data
  })
}

// 删除Device
export function delDevice(data) {
  return request({
    url: '/admin/v1/device',
    method: 'delete',
    data: data
  })
}

// 设置免广告时间
export function setFeelAdvertTimeDevice(data) {
  return request({
    url: '/admin/v1/device/freetime',
    method: 'put',
    data: data
  })
}

// 导出设备防盗链IP
export function exportDeviceDoorChain(data) {
  return request({
    url: '/admin/v1/deviceexport',
    method: 'get',
    params: data
  })
}
