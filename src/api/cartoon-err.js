import request from '@/utils/request'

// 查询CartoonErr列表
export function listCartoonErr(query) {
  return request({
    url: '/admin/v1/cartoon-err',
    method: 'get',
    params: query
  })
}

// 查询CartoonErr详细
export function getCartoonErr(id) {
  return request({
    url: '/admin/v1/cartoon-err/' + id,
    method: 'get'
  })
}

// 新增CartoonErr
export function addCartoonErr(data) {
  return request({
    url: '/admin/v1/cartoon-err',
    method: 'post',
    data: data
  })
}

// 修改CartoonErr
export function updateCartoonErr(data) {
  return request({
    url: '/admin/v1/cartoon-err',
    method: 'put',
    data: data
  })
}

// 删除CartoonErr
export function delCartoonErr(data) {
  return request({
    url: '/admin/v1/cartoon-err',
    method: 'delete',
    data: data
  })
}

// 查找源站章节列表
export function getSourceChapterList(query) {
  return request({
    url: '/admin/v1/cartoon-chapter/source-list',
    method: 'get',
    params: query
  })
}

// 源站章节补录
export function editSourceIdRecord(data) {
  return request({
    url: '/admin/v1/cartoon-err/cartoonrel',
    method: 'post',
    data
  })
}

// 一键替换
export function replaceChapter(data) {
  return request({
    url: '/admin/v1/cartoon-chapter/replace',
    method: 'post',
    data: data
  })
}

// 全本替换
export function replaceAllChapter(data) {
  return request({
    url: '/admin/v1/cartoon-chapter/replace-all',
    method: 'post',
    data: data
  })
}

// 一键纠错
export function oneClickReplaceError(data) {
  return request({
    url: '/admin/v1/cartoon-chapter/one-click-replace',
    method: 'post',
    data
  })
}

// 替换章节 替换进度查询
export function replaceBookChapterLog(id) {
  return request({
    url: `/admin/v1/replaceBookChapterLog/${id}`,
    method: 'get'
  })
}

// 插入章节
export function insertChapterSort(data) {
  return request({
    url: `/admin/v1/cartoon-chapter/insert-sort`,
    method: 'post',
    data
  })
}

// 书籍纠错编辑章节内容
export function editerrnovelchaptercontent(data) {
  return request({
    url: `/admin/v1/editerrnovelchaptercontent`,
    method: 'post',
    data
  })
}
// 漫画纠错批量修改状态
export function editCartoonerrorStatus(data) {
  return request({
    url: `/admin/v1/cartoon-err/batchstatus`,
    method: 'put',
    data
  })
}
// 漫画自动纠错
export function autoCartoonerrorExec(data) {
  return request({
    url: `/admin/v1/cartoon-err/exec `,
    method: 'post',
    data
  })
}
//漫画查询纠错状态
export function replaceChapterLog(id) {
  return request({
    url: '/admin/v1/cartoon-chapter/replace-log/' + id,
    method: 'get'
  })
}
