export function sortBy(list, comparator) {
  const arr = Array.isArray(list) ? [...list] : []
  arr.sort(comparator)
  return arr
}
