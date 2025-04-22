import request from '@/utils/request'

// 查询App列表
export function listApp(query) {
  return request({
    url: '/admin/v1/app',
    method: 'get',
    params: query
  })
}

// 查询App详细
export function getApp(id) {
  return request({
    url: '/admin/v1/app/' + id,
    method: 'get'
  })
}

// 新增App
export function addApp(data) {
  return request({
    url: '/admin/v1/app',
    method: 'post',
    data: data
  })
}

// 修改App
export function updateApp(data) {
  return request({
    url: '/admin/v1/app',
    method: 'put',
    data: data
  })
}

// 删除App
export function delApp(data) {
  return request({
    url: '/admin/v1/app',
    method: 'delete',
    data: data
  })
}

// 保存第三方信息
export function saveThirdSetthingFeach(data) {
  return request({
    url: '/admin/v1/appthirdparameters',
    method: 'put',
    data
  })
}

// 查看应用配置版本设置信息
export function checkEditionFeach(id) {
  return request({
    url: '/admin/v1/app-edition/' + id,
    method: 'get'
  })
}

// 设置应用配置版本设置信息
export function saveEditionFeach(data) {
  return request({
    url: '/admin/v1/app-edition',
    method: 'post',
    data
  })
}

// 应用配置-栏目管理列表
export function columnCartoonListFeach(data) {
  return request({
    url: '/admin/v1/cartoon-column',
    method: 'get',
    params: data
  })
}

// 应用配置-栏目管理新增漫画
export function addColumnCartoonFeach(data) {
  return request({
    url: '/admin/v1/cartoon-column',
    method: 'post',
    data
  })
}

// 应用配置-栏目管理删除漫画
export function delColumnCartoonFeach(appId, columnId, data) {
  return request({
    url: `/admin/v1/cartoon-column/${appId}/${columnId}`,
    method: 'delete',
    data
  })
}

// 应用配置-获取漫画推荐表
export function recommendCartoonListFeach(data) {
  return request({
    url: '/admin/v1/cartoonshelf-recommend',
    method: 'get',
    params: data
  })
}

// 应用配置-设置漫画推荐表
export function addRecommendCartoonFeach(data) {
  return request({
    url: '/admin/v1/cartoonshelf-recommend',
    method: 'post',
    data
  })
}

// 应用配置-删除漫画推荐表
export function delRecommendCartoonFeach(data) {
  return request({
    url: '/admin/v1/cartoonshelf-recommend',
    method: 'delete',
    data
  })
}

// 生成静态文件
export function createStaticFile(data) {
  return request({
    url: '/admin/v1/geneRateStaticFile',
    method: 'post',
    data
  })
}
//修改状态
export function updateAppStatus(data) {
  return request({
    url: '/admin/v1/app/update-status',
    method: 'put',
    data
  })
}

// 刷新CDN
export function refreshFileFeach(data) {
  return request({
    url: '/admin/v1/refresh-cdn',
    method: 'post',
    data
  })
}
// 生成
export function createAppFeach(data) {
  return request({
    url: '/admin/v1/genapp',
    method: 'post',
    data
  })
}

// 查看平台版本
export function checkDevierInfoFeach(id) {
  return request({
    url: '/admin/v1/app-edition/' + id,
    method: 'get'
  })
}

// 查看下载签名
export function downloadAppSignFeach(data) {
  return request({
    url: '/admin/v1/getsignfile',
    method: 'post',
    data
  })
}
// 查看日志
export function checkCreatStatusFeach(id) {
  return request({
    url: '/admin/v1/genapp/status/' + id,
    method: 'get'
  })
}
//获取oss域名
export function getOssDomainNameFeach() {
  return request({
    url: '/admin/v1/config-key/aliyun_oss',
    method: 'get'
  })
}
//上传oss
export function uploadOssDomainFeach(data) {
  return request({
    url: '/admin/v1/upstaticfiles',
    method: 'post',
    data
  })
}
