import request from '@/utils/request'

// 查询应用概览列表
export function listAppoverview(data) {
  return request({
    url: '/admin/v1/stat-app-general-view/list',
    method: 'get',
    params: data
  })
}
// 应用概览明细列表
export function listOverviewInfo(data) {
  return request({
    url: '/admin/v1/stat-app-log-report/list',
    method: 'get',
    params: data
  })
}
// 查询推广统计列表
export function listExtension(data) {
  return request({
    url: '/admin/v1/stat-device-daily-info',
    method: 'get',
    params: data
  })
}
// 查询推广统计-被邀请人详情
export function inviteeDailyPassiveDetail(data) {
  return request({
    url: '/admin/v1/stat-device-invite-daily',
    method: 'get',
    params: data
  })
}
// 查询推广统计-邀请人详情
export function inviteeDailyDetail(data) {
  return request({
    url: '/admin/v1/stat-device-share-daily',
    method: 'get',
    params: data
  })
}
// 查询会员统计
export function memberStatistics(data) {
  return request({
    url: '/admin/v1/stat-daily-info',
    method: 'get',
    params: data
  })
}
// 留存分析
export function retainedStatistics(data) {
  return request({
    url: '/admin/v1/keep-analysis',
    method: 'get',
    params: data
  })
}
// ocpc分析
export const ocpcAlysisFeach = (data) => {
  return request({
    url: '/admin/v1/ocpcStatistic',
    method: 'get',
    params: data
  })
}
