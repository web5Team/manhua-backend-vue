import request from '@/utils/request'

// 模板管理-添加模板
export const addTemplateFeach = (data) => {
  return request({
    url: '/admin/v1/template',
    method: 'post',
    data
  })
}
// 模板管理-编辑模板
export const editTemplateFeach = (data) => {
  return request({
    url: '/admin/v1/template',
    method: 'put',
    data
  })
}
// 模板管理-删除模板
export const delTemplateFeach = (data) => {
  return request({
    url: '/admin/v1/template',
    method: 'delete',
    data
  })
}
// 模板管理-批量修改模板状态
export const modifyTemplateStatusFeach = (data) => {
  return request({
    url: '/admin/v1/template/batch',
    method: 'put',
    data
  })
}
// 模板管理-模板详情
export const templateInfoFeach = (id) => {
  return request({
    url: '/admin/v1/template/' + id,
    method: 'get'
  })
}
// 模板管理-模板列表
export const templateListFeach = (data) => {
  return request({
    url: '/admin/v1/template',
    method: 'get',
    params: data
  })
}
// 模板管理-栏目管理-添加
export const addTemplateColumnFeach = (data) => {
  return request({
    url: '/admin/v1/template-column',
    method: 'post',
    data
  })
}
// 模板管理-栏目管理-编辑
export const editTemplateColumnFeach = (data) => {
  return request({
    url: '/admin/v1/template-column',
    method: 'put',
    data
  })
}
// 模板管理-栏目管理-删除
export const delTemplateColumnFeach = (data) => {
  return request({
    url: '/admin/v1/template-column',
    method: 'delete',
    data
  })
}
// 模板管理-栏目管理-批量修改状态
export const modifyTemplateColumnStatusFeach = (data) => {
  return request({
    url: '/admin/v1/template-column/batch',
    method: 'put',
    data
  })
}
// 模板管理-栏目管理-详情
export const templateColumnInfoFeach = (id) => {
  return request({
    url: '/admin/v1/template-column/' + id,
    method: 'get'
  })
}
// 模板管理-栏目管理-列表
export const templateColumnListFeach = (data) => {
  return request({
    url: '/admin/v1/template-column',
    method: 'get',
    params: data
  })
}
// 模板管理-栏目管理-关联列表
export const templateColumnCartoonListFeach = (data) => {
  return request({
    url: '/admin/v1/template-cartoon-column',
    method: 'get',
    params: data
  })
}
// 模板管理-栏目管理-添加漫画
export const addTemplateColumnVideoFeach = (data) => {
  return request({
    url: '/admin/v1/template-cartoon-column',
    method: 'post',
    data
  })
}
// 模板管理-栏目管理-删除漫画
export const delTemplateColumnVideoFeach = (data, templateId, columnId) => {
  return request({
    url: `/admin/v1/template-cartoon-column/${templateId}/${columnId}`,
    method: 'delete',
    data
  })
}
// 模板管理-轮播图管理-列表
export const listTemBanner = (data) => {
  return request({
    url: '/admin/v1/template-banner',
    method: 'get',
    params: data
  })
}
// 模板管理-轮播图管理-修改
export const editTemBanner = (data) => {
  return request({
    url: '/admin/v1/template-banner',
    method: 'put',
    data
  })
}
// 模板管理-轮播图管理-添加
export const addTemBanner = (data) => {
  return request({
    url: '/admin/v1/template-banner',
    method: 'post',
    data
  })
}
// 模板管理-轮播图管理-删除
export const deleteTemBanner = (data) => {
  return request({
    url: '/admin/v1/template-banner',
    method: 'delete',
    data
  })
}
// 模板管理-轮播图管理-详情
export const temBannerDetail = (id) => {
  return request({
    url: '/admin/v1/template-banner/' + id,
    method: 'get'
  })
}
// 模板管理-漫画推荐-列表
export const listTemRecommend = (data) => {
  return request({
    url: '/admin/v1/template-cartoonshelf-recommend',
    method: 'get',
    params: data
  })
}
// 模板管理-漫画推荐-添加
export const addTemRecommend = (data) => {
  return request({
    url: '/admin/v1/template-cartoonshelf-recommend',
    method: 'post',
    data
  })
}
// 模板管理-漫画推荐-删除
export const deleteTemRecommend = (data) => {
  return request({
    url: '/admin/v1/template-cartoonshelf-recommend',
    method: 'delete',
    data
  })
}
