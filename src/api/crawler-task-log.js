import request from '@/utils/request'

// 查询CrawlerTaskLog列表
export function listCrawlerTaskLog(query) {
  return request({
    url: '/admin/v1/crawler-task-log',
    method: 'get',
    params: query
  })
}

// 查询CrawlerTaskLog详细
export function getCrawlerTaskLog(id) {
  return request({
    url: '/admin/v1/crawler-task-log/' + id,
    method: 'get'
  })
}

// 新增CrawlerTaskLog
export function addCrawlerTaskLog(data) {
  return request({
    url: '/admin/v1/crawler-task-log',
    method: 'post',
    data: data
  })
}

// 修改CrawlerTaskLog
export function updateCrawlerTaskLog(data) {
  return request({
    url: '/admin/v1/crawler-task-log',
    method: 'put',
    data: data
  })
}

// 删除CrawlerTaskLog
export function delCrawlerTaskLog(data) {
  return request({
    url: '/admin/v1/crawler-task-log',
    method: 'delete',
    data: data
  })
}

