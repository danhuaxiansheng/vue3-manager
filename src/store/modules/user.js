/**
 * @description 登录、获取用户信息、退出登录、清除accessToken逻辑，不建议修改
 */

import Vue from 'vue'
import { login, logout, getInfo, getMenuByRoleid } from '@/api/user'
import { addData } from '@/api/common.js'
import { GetMenulist } from '@UTILS/menus.js'
import {
  getAccessToken,
  removeAccessToken,
  setAccessToken,
} from '@/utils/accessToken'
import { resetRouter } from '@/router'
import { title, tokenName } from '@/config'

const state = () => ({
  accessToken: getAccessToken(),
  username: '',
  userid: '',
  roleids: [],
})
const getters = {
  accessToken: (state) => state.accessToken,
  username: (state) => state.username,
  userid: (state) => state.userid,
  photo: (state) => state.photo,
}
const mutations = {
  setAccessToken(state, accessToken) {
    state.accessToken = accessToken
    setAccessToken(accessToken)
  },
  setUsername(state, username) {
    state.username = username
  },
  setUserid(state, userid) {
    state.userid = userid
  },
  setPhoto(state, photo) {
    state.photo = photo
  },
  setRole(state, roleids) {
    state.roleids = roleids
  },
}
const actions = {
  async login({ commit }, userInfo) {
    const { data } = await login(userInfo)
    const accessToken = data[tokenName]
    if (accessToken) {
      commit('setAccessToken', accessToken)
      const hour = new Date().getHours()
      const thisTime =
        hour < 8
          ? '早上好'
          : hour <= 11
          ? '上午好'
          : hour <= 13
          ? '中午好'
          : hour < 18
          ? '下午好'
          : '晚上好'
      Vue.prototype.$baseNotify(`欢迎登录${title}`, `${thisTime}！`)
    } else {
      Vue.prototype.$baseMessage(
        `登录接口异常，未正确返回${tokenName}...`,
        'error'
      )
    }
  },
  async getInfo({ commit, state }) {
    const { data } = await getInfo(state.accessToken)
    if (!data) {
      Vue.prototype.$baseMessage('验证失败，请重新登录...', 'error')
      return false
    }
    let { username, userid, photo, roleids } = data
    roleids = roleids ? roleids.split(',').map(Number) : []
    commit('setUsername', username)
    commit('setUserid', userid)
    commit('setPhoto', photo)
    commit('setRole', roleids)
    return roleids
  },
  async getMenuList({ commit, state }, roleids) {
    let res
    let menusData = []
    if (roleids && roleids.length > 0) {
      res = await getMenuByRoleid({ roleids: roleids.join(',') })
      menusData = GetMenulist(res.data)
    }
    return menusData
  },

  async addLog({ commit }, to) {
    let pageName = to.meta.title || '未知'
    addData({
      indexName: 'tb_operation_log',
      dataList: JSON.stringify({
        menuname: pageName,
        details: '访问界面' + pageName,
        createid: this.state.user.userid,
        opertype: '界面查询',
      }),
    })
  },

  async logout({ dispatch }) {
    await logout(state.accessToken)
    await dispatch('resetAccessToken')
    // await resetRouter()
  },
  resetAccessToken({ commit }) {
    commit('setAccessToken', '')
    removeAccessToken()
  },
}
export default { state, getters, mutations, actions }
