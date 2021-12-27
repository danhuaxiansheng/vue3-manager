/**
 * @description router全局配置，如有必要可分文件抽离，其中asyncRoutes只有在intelligence模式下才会用到，vip文档中已提供路由的基础图标与小清新图标的配置方案，请仔细阅读
 */

import Vue from 'vue'
import VueRouter from 'vue-router'
import Layout from '@/layouts'
// import EmptyLayout from '@/layouts/EmptyLayout'
import { publicPath, routerMode } from '@/config'

// 解决重复push路由 导致的报错
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch((err) => err)
}

Vue.use(VueRouter)
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },
  {
    path: '/register',
    component: () => import('@/views/register/index'),
    hidden: true,
  },
  {
    path: '/401',
    name: '401',
    component: () => import('@/views/401'),
    hidden: true,
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/404'),
    hidden: true,
  },
  {
    path: '/',
    component: Layout,
    redirect: '/index',
    children: [
      {
        path: 'index',
        name: 'Index',
        component: () => import('@/views/index/index'),
        meta: {
          title: '首页',
          icon: 'home',
          affix: true,
        },
      },
    ],
  },

  {
    path: '/material',
    component: Layout,
    redirect: 'noRedirect',
    name: 'material',
    alwaysShow: true,
    meta: { title: '资料', icon: 'box-open' },
    children: [
      {
        path: 'studylist',
        component: () => import('@/views/vab/study/index'),
        name: 'studylist',
        meta: {
          title: '学习资料',
        },
      },
      {
        path: 'audiolist',
        component: () => import('@/views/vab/audio/index'),
        name: 'audiolist',
        meta: {
          title: '音频资料',
        },
      },
    ],
  },
]

export const asyncRoutes = [
  // {
  //   path: '/vab',
  //   component: Layout,
  //   redirect: 'noRedirect',
  //   name: 'Vab',
  //   alwaysShow: true,
  //   meta: { title: '组件', icon: 'box-open' },
  //   children: [
  //     {
  //       path: 'table',
  //       component: () => import('@/views/vab/table/index'),
  //       name: 'Table',
  //       meta: {
  //         title: '表格',
  //       },
  //     },
  //     {
  //       path: 'log',
  //       name: 'Log',
  //       component: () => import('@/views/vab/errorLog/index'),
  //       meta: { title: '错误日志模拟',  },
  //     },
  //   ],
  // },
  {
    path: '/permission',
    component: Layout,
    redirect: 'noRedirect',
    name: 'permission',
    meta: { title: '权限配置', icon: 'users-cog' },
    children: [
      {
        path: 'user',
        name: 'user',
        component: () =>
          import('@/views/personnelManagement/userManagement/index'),
        meta: { title: '用户管理', icon: 'user-cog' },
      },
      {
        path: 'role',
        name: 'role',
        component: () =>
          import('@/views/personnelManagement/roleManagement/index'),
        meta: { title: '角色管理', icon: 'user-shield' },
      },
      {
        path: 'menu',
        name: 'menu',
        component: () =>
          import('@/views/personnelManagement/menuManagement/index'),
        meta: { title: '菜单管理', icon: 'dice-six' }, // badge: 'New'
      },
    ],
  },
  {
    path: '/meet',
    component: Layout,
    redirect: '/meet/meetlist',
    name: 'meet',
    meta: {
      title: '资料管理',
      icon: 'tasks',
    },
    children: [
      {
        path: 'meetlist',
        component: () => import('@/views/vab/meet/index'),
        name: 'meetlist',
        meta: { title: '资料列表', icon: 'list' },
      },
      {
        path: 'meetcreate',
        component: () => import('@/views/vab/meet/components/create'),
        name: 'meetcreate',
        meta: { title: '创建资料', icon: 'plus' },
      },
      {
        path: 'meetedit',
        hidden: true,
        component: () => import('@/views/vab/meet/components/edit'),
        name: 'meetedit',
        meta: { title: '资料编辑', icon: 'file-signature' },
      },
      {
        path: 'meetdetils',
        hidden: true,
        component: () => import('@/views/vab/meet/components/details'),
        name: 'meetdetils',
        meta: { title: '资料详情', icon: 'money-check' },
      },
    ],
  },
  {
    path: '/personalCenter',
    component: Layout,
    redirect: '/personalCenter/personalCenter',
    name: 'personalCenter',
    hidden: true,
    meta: {
      isHide: true,
      title: '个人信息',
      icon: 'el-icon-s-help',
    },
    children: [
      {
        path: 'personalCenter',
        component: () => import('@/views/personalCenter/index'),
        name: 'personalCenterIndex',
        meta: { title: '个人中心', icon: 'street-view' },
      },
    ],
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true,
  },
]

const router = new VueRouter({
  base: publicPath,
  mode: routerMode,
  scrollBehavior: () => ({
    y: 0,
  }),
  routes: constantRoutes,
})

export function resetRouter() {
  location.reload()
}

export default router
