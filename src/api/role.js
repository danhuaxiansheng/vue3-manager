import request from '@/utils/request'

export function addRole(data) {
  return request({
    url: '/api/role/add',
    method: 'post',
    data,
  })
}

export function updateRole(data) {
  return request({
    url: '/api/role/edit',
    method: 'post',
    data,
  })
}
