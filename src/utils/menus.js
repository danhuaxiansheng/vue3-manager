// / <summary>
// / 获取菜单栏-全部
// / </summary>
// / <returns></returns>
function GetMenulist(list) {
  const menuList = []
  const parentList = list.filter((d) => !d.pid)
  parentList.forEach((item) => {
    // 系统
    const menu = {
      ...item,
      children: GetMenuChild(item.id, list),
    }
    menuList.push(menu)
  })
  return menuList
}

function GetMenuChild(id, allList) {
  const childList = []
  const filterList = allList.filter((d) => d.pid === id)
  if (filterList.length > 0) {
    debugger
    filterList.forEach((item) => {
      // 页面
      const child = {
        id: item.id,
        pid: id,
        icon: item.icon,
        isshow: item.isshow,
        sortcode: item.sortcode,
        fullname: item.fullname,
        urladdress: item.urladdress,
        enabledmark: item.enabledmark,
        children: GetMenuChild(item.id, allList),
      }
      childList.push(child)
    })
  }
  return childList.length > 0 ? childList : null
}

// / <summary>
// / 通过角色 控制用户访问的页面权限
// / </summary>
// / <param name="muen"></param>
// / <param name="topicList"></param>
function SetEnableMenu(muens, roleList) {
  var hasRole = roleList.filter((d) => d.moduleid === muens.id)
  if (hasRole != null && hasRole.length > 0) {
    muens.enabledmark = 1
    if (muens.children != null && muens.children.length > 0) {
      muens.children.forEach((childItem) => {
        SetEnableMenu(childItem, roleList)
      })
    }
  } else {
    muens.enabledmark = 0
  }
}

module.exports = {
  SetEnableMenu,
  GetMenuChild,
  GetMenulist,
}
