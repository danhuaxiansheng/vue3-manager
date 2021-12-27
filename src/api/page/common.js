import request from '@/utils/request'

export function getData(data) {
  return request({
    url: '/api/common/findMany',
    method: 'post',
    data,
  })
}

export function getFirstData(data) {
  return request({
    url: '/api/common/findUnique',
    method: 'post',
    data,
  })
}

export function addData(data) {
  return request({
    url: '/api/common/create',
    method: 'post',
    data,
  })
}

export function updateData(data) {
  return request({
    url: '/api/common/update',
    method: 'post',
    data,
  })
}

export function deleteData(data) {
  return request({
    url: '/api/common/delete',
    method: 'post',
    data,
  })
}

export function UploadImg(data) {
  return request({
    url: '/api/common/uploadimage',
    method: 'post',
    headers: {
      'Content-Type': 'multipart/form-data',
      // 'authorization': 'Bearer ' + getToken()
    },
    data,
  })
}
