export interface FilterItem {
  display: string,
  field: string,
  fields: string[],
  searchCriteria: string | string[],
  isIdType: boolean
}
