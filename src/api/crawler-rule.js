import request from '@/utils/request'

// 查询CrawlerRule列表
export function listCrawlerRule(query) {
  return request({
    url: '/admin/v1/crawler-rule',
    method: 'get',
    params: query
  })
}

// 查询CrawlerRule详细
export function getCrawlerRule(id) {
  return request({
    url: '/admin/v1/crawler-rule/' + id,
    method: 'get'
  })
}

// 新增CrawlerRule
export function addCrawlerRule(data) {
  return request({
    url: '/admin/v1/crawler-rule',
    method: 'post',
    data: data
  })
}

// 修改CrawlerRule
export function updateCrawlerRule(data) {
  return request({
    url: '/admin/v1/crawler-rule',
    method: 'put',
    data: data
  })
}

// 删除CrawlerRule
export function delCrawlerRule(data) {
  return request({
    url: '/admin/v1/crawler-rule',
    method: 'delete',
    data: data
  })
}

// 测试采集规则
export function testCrawlerRule(data) {
  return request({
    url: '/admin/v1/crawler-rule/test',
    method: 'post',
    data: data
  })
}
