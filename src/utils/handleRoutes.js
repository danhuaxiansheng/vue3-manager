// const whiteList = ['*']

// function hasMenus(route, userMenus) {
//   let isTrue = false
//   userMenus.forEach((item) => {
//     if (item.path === route.path) {
//       isTrue = true
//       setMenuAttr(route, item)
//       return false
//     } else if (item.children && item.children.length > 0) {
//       if (hasMenus(route, item.children)) {
//         isTrue = true
//         return false
//       }
//     }
//   })
//   return isTrue
// }

// function setMenuAttr(route, menu) {
//   route.meta = {
//     icon: menu.icon,
//     title: menu.title,
//   }
//   route.path = menu.path
//   route.name = menu.name || ''
//   route.hidden = menu.isHide ? true : false
// }

// function hasPermission(userMenus, route) {
//   const path = route.path
//   if (!path || whiteList.includes(path)) {
//     return true
//   } else {
//     if (hasMenus(route, userMenus)) {
//       return true
//     } else {
//       return false
//     }
//   }
// }

// /**
//  * Filter asynchronous routing tables by recursion
//  * @param routes asyncRoutes
//  * @param roles
//  */
// export function filterAsyncRoutes(userMenus, routes) {
//   const res = []
//   routes.forEach((route) => {
//     const tmp = { ...route }
//     if (hasPermission(userMenus, tmp)) {
//       const temChild = route.children
//       if (temChild && temChild.length > 0) {
//         const newChild = filterAsyncRoutes(temChild, userMenus)
//         if (!tmp.children || tmp.children.length === 0) {
//           delete tmp.children
//         } else {
//           tmp.children = newChild
//         }
//       }
//       res.push(tmp)
//     }
//   })
//   return res
// }

import Layout from '@/layouts'

function getConstRoter(menu) {
  let tem = {
    meta: {
      icon: menu.icon,
      title: menu.title,
    },
    path: menu.path,
    name: menu.name || '',
    component: () => {
      menu.component === 'Layout' ? Layout : require(`@/views/${menu.component}`)
    },
    hidden: menu.isHide ? true : false,
  }

  if (menu.childern && menu.childern.length > 0) {
    tem.childern = []
    menu.childern.forEach((item) => {
      tem.childern.push(getConstRoter(item))
    })
  }
  return tem
}

export function filterAsyncRoutes(userMenus) {
  const res = []
  userMenus.forEach((route) => {
    res.push(getConstRoter(route))
  })
  return res
}
