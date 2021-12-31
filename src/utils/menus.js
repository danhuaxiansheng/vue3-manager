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
    filterList.forEach((item) => {
      // 页面
      const child = { ...item, children: GetMenuChild(item.id, allList) }
      childList.push(child)
    })
  }
  return childList.length > 0 ? childList : null
}

module.exports = {
  GetMenuChild,
  GetMenulist,
}
