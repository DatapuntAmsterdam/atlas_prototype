import { LatLngTuple } from 'leaflet'

const generateParams = (data: { [key: string]: any }) =>
  Object.entries(data)
    .filter(([, value]) => value !== null && value !== undefined)
    .map((pair) => pair.map(encodeURIComponent).join('='))
    .join('&')

export type DataSelection = {
  numberOfRecords: number
  data: Array<{ [key: string]: string }>
  markers: LatLngTuple[]
}

export default async function getDataSelection(
  endpoint: string,
  params: { [key: string]: string },
): Promise<DataSelection> {
  return fetch(`${endpoint}?${generateParams(params)}`)
    .then((response) => response.json())
    .then(({ object_count: numberOfRecords, object_list: data }) => ({
      numberOfRecords,
      data,
      markers: data
        .map(({ _source: { centroid } }: { _source: { centroid: [number, number] } }) => centroid)
        .filter((x: [number, number]) => x)
        .map(([lon, lat]: number[]) => [lat, lon]),
    }))
}
