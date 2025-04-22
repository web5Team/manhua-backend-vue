import request from '@/utils/request'

export const sysfiledirList = data => request({
  url: '/admin/v1/sysfiledir',
  method: 'GET',
  data
})

export const sysfiledirAcionAdd = data => request({
  url: '/admin/v1/sysfiledir',
  method: 'POST',
  data
})

export const sysfiledirAcionEdit = data => request({
  url: '/admin/v1/sysfiledir',
  method: 'PUT',
  data
})

export const sysfiledirAcionDel = data => request({
  url: '/admin/v1/sysfiledir',
  method: 'DELETE',
  data: data
})

export const sysfileinfoList = data => request({
  url: `/admin/v1/sysfileinfo`,
  method: 'GET',
  params: data
})

export const sysfileinfo = id => request({
  url: '/admin/v1/sysfileinfo/' + id,
  method: 'GET'
})

export const sysfileinfoAdd = data => request({
  url: '/admin/v1/sysfileinfo',
  method: 'POST',
  data
})

export const sysfileinfoEdit = data => request({
  url: '/admin/v1/sysfileinfo',
  method: 'put',
  data
})

export const sysfileinfoDelete = data => request({
  url: '/admin/v1/sysfileinfo',
  method: 'DELETE',
  data: data
})
