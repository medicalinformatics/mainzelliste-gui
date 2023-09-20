export function removeFrom<E>(predicate: (value: E) => unknown, array: E[]) {
  let index = array.findIndex(predicate);
  if (index > -1) {
    array.splice(index, 1);
  }
}

export function addIfNotExist<E>(element: E, array: E[], predicate: (value: E) => unknown) {
  if (array.find(predicate) == undefined)
    array.push(element);
}
