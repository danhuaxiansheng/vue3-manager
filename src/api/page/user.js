import request from '@/utils/request'
import { encryptedData } from '@/utils/encrypt'
import { loginRSA } from '@/config'

export async function login(data) {
  if (loginRSA) {
    data = await encryptedData(data)
  }

  return request({
    url: '/api/login',
    method: 'post',
    data,
  })
}

export function getInfo(accessToken) {
  return request({
    url: '/api/user/info',
    method: 'post',
    data: { accessToken },
  })
}

export function logout() {
  return request({
    url: '/api/user/logout',
    method: 'post',
  })
}

export function addUser(data) {
  return request({
    url: '/api/user/add',
    method: 'post',
    data,
  })
}

export function updateDefaultPwd(data) {
  return request({
    url: '/api/user/updateDefaultPwd',
    method: 'post',
    data,
  })
}

export function resetPwd(data) {
  return request({
    url: '/api/user/resetPwd',
    method: 'post',
    data,
  })
}
