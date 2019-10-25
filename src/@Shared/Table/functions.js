
export function groupBy(arr, property) {
  return arr.reduce((grouped, x) => {
    if (!grouped[x[property]]) { grouped[x[property]] = [] }
    grouped[x[property]].push(x)
    return grouped
  }, {})
}
export function groupByYear(arr, property) {
  return arr.reduce((grouped, x) => {
    if (!grouped[x[property].getFullYear()]) { grouped[x[property].getFullYear()] = [] }
    grouped[x[property].getFullYear()].push(x)
    return grouped
  }, {})
}

export function sortBy(arr, property, reverse) {
  const sorted = arr.concat().sort((a, b) => {
    if(a[property] < b[property]) { return -1 }
    if(a[property] > b[property]) { return 1 }
    return 0
  })
  return (reverse) ? (sorted.reverse()) : (sorted)
}
export function sortByYear(arr, property, reverse) {
  const sorted = arr.concat().sort((a, b) => {
    if(a[property].getFullYear() < b[property].getFullYear()) { return -1 }
    if(a[property].getFullYear() > b[property].getFullYear()) { return 1 }
    return 0
  })
  return (reverse) ? (sorted.reverse()) : (sorted)
}

export function formGroupedRows(groups, reverse = true) {
  let updated = []
  const keys = Object.keys(groups).sort().reverse()
  keys.forEach((key, id) => {
    updated.push({id: id, value: key, group: key, items: groups[key]})
    updated = updated.concat(groups[key])
  })
  return updated
}
export function formSortedGroupedRows(groups, reverse, property, showGroups = false) {
  let updated = []
  const keys = Object.keys(groups).sort().reverse()
  keys.forEach((key, id) => {
    const iSort = sortBy(groups[key], property, reverse)
    if(showGroups) iSort.unshift({id: id, value: key, group: key, items: groups[key]})
    updated = updated.concat(iSort)
  })
  return updated
}

export function getPagedData(data, currPage, perPage) {
  const first = ((currPage)*perPage)
  const last = first+perPage
  const paged = (data.length > perPage)
    ? (data.slice(first, last)) : (data)
  return paged
}
