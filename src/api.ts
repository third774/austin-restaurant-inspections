import {stringify} from 'query-string'

const api = {
  search: (search: string) =>
    fetch(
      // tslint:disable-next-line:max-line-length
      `https://data.austintexas.gov/resource/nguv-n54k.json?${stringify({
        $select: 'restaurant_name,facility_id',
        $where: `UPPER(restaurant_name) like '%${search.toUpperCase()}%'`,
        $group: 'restaurant_name,facility_id',
      })}`,
    ).then((res) => res.json()),
}

export default api
