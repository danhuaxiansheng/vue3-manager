import Layout from '@/layouts'

function getConstRoter(menu) {
  let tem = {
    meta: {
      icon: menu.icon,
      title: menu.title,
    },
    path: menu.path,
    name: menu.name || '',
    component:
      menu.component === 'Layout'
        ? Layout
        : (resolve) => require(['@/views/' + menu.component], resolve),
    hidden: menu.isHide ? true : false,
  }

  if (menu.children && menu.children.length > 0) {
    tem.children = []
    menu.children.forEach((item) => {
      tem.children.push(getConstRoter(item))
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
