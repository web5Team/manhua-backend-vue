import request from '@/utils/request'

// 查询CrawlerTask列表
export function listCrawlerTask(query) {
  return request({
    url: '/admin/v1/crawler-task',
    method: 'get',
    params: query
  })
}

// 查询CrawlerTask详细
export function getCrawlerTask(id) {
  return request({
    url: '/admin/v1/crawler-task/' + id,
    method: 'get'
  })
}

// 新增CrawlerTask
export function addCrawlerTask(data) {
  return request({
    url: '/admin/v1/crawler-task',
    method: 'post',
    data: data
  })
}

// 修改CrawlerTask
export function updateCrawlerTask(data) {
  return request({
    url: '/admin/v1/crawler-task',
    method: 'put',
    data: data
  })
}

// 删除CrawlerTask
export function delCrawlerTask(data) {
  return request({
    url: '/admin/v1/crawler-task',
    method: 'delete',
    data: data
  })
}

// 查询规则列表
export function listRule(query) {
  return request({
    url: '/admin/v1/crawler-rule',
    method: 'get',
    params: query
  })
}

