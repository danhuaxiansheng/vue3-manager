const whiteList = ['*']

/**
 * @description all模式渲染后端返回路由
 * @param constantRoutes
 * @returns {*}
 */
// export function convertRouter(asyncRoutes) {
//   return asyncRoutes.map((route) => {
//     if (route.component) {
//       if (route.component === 'Layout') {
//         route.component = (resolve) => require(['@/layouts'], resolve)
//       } else if (route.component === 'EmptyLayout') {
//         route.component = (resolve) =>
//           require(['@/layouts/EmptyLayout'], resolve)
//       } else {
//         const index = route.component.indexOf('views')
//         const path =
//           index > 0 ? route.component.slice(index) : `views/${route.component}`
//         route.component = (resolve) => require([`@/${path}`], resolve)
//       }
//     }
//     if (route.children && route.children.length)
//       route.children = convertRouter(route.children)
//     if (route.children && route.children.length === 0) delete route.children
//     return route
//   })
// }

function hasMenus(route, userMenus) {
  let isTrue = false
  const address = route.path

  userMenus.forEach((item) => {
    if (item.urladdress === address) {
      isTrue = true
      setMenuAttr(route, item)
      return false
    } else if (item.children && item.children.length > 0) {
      if (hasMenus(route, item.children)) {
        isTrue = true

        return false
      }
    }
  })
  return isTrue
}

function setMenuAttr(route, item) {
  route.meta = {
    icon: item.icon,
    title: item.fullname,
  }
  route.hidden = !item.isshow
}

function hasPermission(userMenus, route) {
  const address = route.path
  if (!address || !route.meta || whiteList.includes(address)) {
    return true
  } else {
    if (hasMenus(route, userMenus)) {
      return true
    } else {
      return false
    }
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes, userMenus) {
  const res = []
  routes.forEach((route) => {
    const tmp = { ...route }
    if (hasPermission(userMenus, tmp)) {
      const temChild = route.children
      if (temChild && temChild.length > 0) {
        const newChild = filterAsyncRoutes(temChild, userMenus)
        if (!tmp.children || tmp.children.length === 0) {
          delete tmp.children
        } else {
          tmp.children = newChild
        }
      }
      res.push(tmp)
    }
  })
  return res
}
