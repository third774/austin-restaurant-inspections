import {stringify} from 'query-string'

function fetchData(params: any) {
  return fetch(
    `https://data.austintexas.gov/resource/nguv-n54k.json?${stringify(params)}`,
  ).then((res) => res.json())
}

const api = {
  search: (search: string) =>
    fetchData({
      $select: 'restaurant_name,facility_id,address_address',
      $where: `UPPER(restaurant_name) like '%${search.toUpperCase()}%'`,
      $group: 'restaurant_name,facility_id,address_address',
      $order: 'restaurant_name',
    }),

  fetchByFacilityId(facility_id: string) {
    return fetchData({
      $where: `facility_id=${facility_id}`,
    })
  },
}

export default api
