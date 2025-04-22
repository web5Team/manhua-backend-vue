import request from '@/utils/request'
window.request = request;

export function updateStatus(data) {
  return request({
    url: '/admin/v1/cartoon/updateStatus',
    method: 'put',
    data
  })
}
// 根据漫画名与规则id查询Cartoon列表
export function getOriginCartoonList(query) {
  return request({
    url: '/admin/v1/cartoon/source',
    method: 'get',
    params: query
  })
}

// 源站漫画章节列表接口
export function getOriginChapterList(query) {
  return request({
    url: '/admin/v1/cartoon/sourceList',
    method: 'get',
    params: query
  })
}

// 批量添加漫画新书接口
export function batchAddCartoon(data = {}) {
  return request({
    url: '/admin/v1/cartoon/addSource',
    method: 'post',
    data,
  })
}

// 查询Cartoon列表
export function listCartoon(query) {
  return request({
    url: '/admin/v1/cartoon',
    method: 'get',
    params: query
  })
}

// 查询类别列表
export function listCategory(query) {
  return request({
    url: '/admin/v1/category',
    method: 'get',
    params: query
  })
}

// 查询Cartoon详细
export function getCartoon(id) {
  return request({
    url: '/admin/v1/cartoon/' + id,
    method: 'get'
  })
}

// 新增Cartoon
export function addCartoon(data) {
  return request({
    url: '/admin/v1/cartoon',
    method: 'post',
    data: data
  })
}

// 修改Cartoon
export function updateCartoon(data) {
  return request({
    url: '/admin/v1/cartoon',
    method: 'put',
    data: data
  })
}

// 删除Cartoon
export function delCartoon(data) {
  return request({
    url: '/admin/v1/cartoon',
    method: 'delete',
    data: data
  })
}

//添加纠错
export function addErrorCartoon(data) {
  return request({
    url: '/admin/v1/cartoon/add-err',
    method: 'post',
    data
  })
}

//添加到更新列表
export function addUploadCartoon(data) {
  return request({
    url: '/admin/v1/cartoon/updatelist',
    method: 'post',
    data
  })
}

// 采集规则名称列表
export function ruleNameList(data) {
  return request({
    url: '/admin/v1/crawler-rule',
    method: 'get',
    params: data
  })
}

// 章节列表
export function chapterList(data) {
  return request({
    url: '/admin/v1/chapter',
    method: 'get',
    params: data
  })
}
// 编辑章节
export function editChapter(data) {
  return request({
    url: '/admin/v1/chapter',
    method: 'put',
    data
  })
}
// 新建章节
export function addChapter(data) {
  return request({
    url: '/admin/v1/chapter',
    method: 'post',
    data
  })
}
// 删除章节
export function delChapter(data) {
  return request({
    url: '/admin/v1/chapter',
    method: 'delete',
    data
  })
}
// 上传章节图片
export function uploadChapterImg(data) {
  return request({
    url: '/admin/v1/chapter/pic',
    method: 'post',
    data
  })
}
// 删除章节图片
export function delChapterImg(data) {
  return request({
    url: '/admin/v1/chapter/pic',
    method: 'delete',
    data
  })
}
// 修改章节排序
export function editSortChapter(data) {
  return request({
    url: '/admin/v1/chapter/sort',
    method: 'put',
    data
  })
}
// 章节详情
export function chapterInfo(cartoonId, id) {
  return request({
    url: `/admin/v1/chapter/${cartoonId}/${id}`,
    method: 'get'
  })
}
//添加到纠错
export function addNovelCartoonErr(data) {
  return request({
    url: '/admin/v1/chapter/addcartoonerr',
    method: 'post',
    data
  })
}
//获取图片的流
export function getImgData(url) {
  return request({
    url,
    method: 'get'
  })
}

//获取obs签名
export function getSignature(data) {
  return request({
    url: '/admin/v1/config/obssign',
    method: 'get',
    params: data
  })
}

//修改章节图片状态和上传图片内容
export function uploadChapterStatus(data) {
  return request({
    url: '/admin/v1/chapter/uploadstatus',
    method: 'put',
    data
  })
}