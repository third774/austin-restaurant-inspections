export interface Address {
  type: string
  coordinates: number[]
}

export interface AustinRestaurantInspectionsData {
  address: Address
  address_address: string
  address_city: string
  address_state: string
  address_zip: string
  facility_id: string
  inspection_date: Date
  process_description: string
  restaurant_name: string
  score: number
  zip_code: string
}
