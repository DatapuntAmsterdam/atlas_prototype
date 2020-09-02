/* eslint-disable camelcase */
import { useStateRef } from '@datapunt/arm-core'
import { Feature } from 'geojson'
import { LatLng, LatLngTuple } from 'leaflet'
import React, { useCallback, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { v4 as uuidv4 } from 'uuid'
import { getUserScopes } from '../../../../shared/ducks/user/user'
import { fetchWithToken } from '../../../../shared/services/api/api'
import config, { AuthScope, DataSelectionMapVisualizationType, DataSelectionType } from '../config'
import DataSelectionContext from './DataSelectionContext'

export interface MapData {
  layer: any
  distanceText: string
}

export type DataSelection = {
  id: string
  result: DataSelectionResult
  totalCount: number
  latLngs: LatLng[][]
  size: number
  page: number
  order: number
  mapData?: MapData
}

export interface NamedFeature extends Feature {
  name: string
}

export interface MapVisualizationGeoJSON {
  id: string
  type: DataSelectionMapVisualizationType.GeoJSON
  data: NamedFeature[]
}

export interface Marker {
  id: string
  latLng: LatLngTuple
}

export interface MapVisualizationMarkers {
  id: string
  type: DataSelectionMapVisualizationType.Markers
  data: Marker[]
}

export type MapVisualization = MapVisualizationGeoJSON | MapVisualizationMarkers

export type DataSelectionResult = Array<{
  id: string
  name: string
}>

export type DataSelectionResponse = {
  totalCount: number
  results: DataSelectionResult
}

export interface PaginationParams {
  size: number
  page: number
}

// Todo: next 2 methods could be moved to graphQL layer
async function getMapVisualization(
  params: { [key: string]: string },
  type: DataSelectionType,
): Promise<MapVisualization> {
  const searchParams = new URLSearchParams(params)
  const { object_list: data, eigenpercelen, niet_eigenpercelen, extent } = await fetchWithToken(
    `${config[type].endpointMapVisualization}?${searchParams.toString()}`,
  )

  switch (type) {
    case DataSelectionType.BAG:
    case DataSelectionType.HR: {
      const response: MapVisualizationMarkers = {
        id: '',
        type: DataSelectionMapVisualizationType.Markers,
        data: data.map(
          ({
            _source: { centroid },
            _id: id,
          }: {
            _source: { centroid: [number, number] }
            _id: string
          }) => ({
            id: type === DataSelectionType.HR ? id.split('ves').pop() : id,
            latLng: [centroid[1], centroid[0]],
          }),
        ),
      }

      return response
    }
    case DataSelectionType.BRK: {
      const response: MapVisualizationGeoJSON = {
        id: '',
        type: DataSelectionMapVisualizationType.GeoJSON,
        data: [
          {
            type: 'Feature',
            name: 'dataSelection',
            geometry: eigenpercelen,
            properties: null,
          },
          {
            type: 'Feature',
            name: 'dataSelectionAlternate',
            geometry: niet_eigenpercelen,
            properties: null,
          },
          {
            type: 'Feature',
            name: 'dataSelectionBounds',
            geometry: {
              coordinates: [
                [
                  [extent[0], extent[1]],
                  [extent[2], extent[3]],
                ],
              ],
              type: 'Polygon',
            },
            properties: null,
          },
        ],
      }

      return response
    }
    default:
      throw new Error(
        `Unable to get map visualization, encountered an unknown data selection type '${type}'.`,
      )
  }
}

async function getData(
  params: { [key: string]: string },
  type: DataSelectionType,
): Promise<DataSelectionResponse> {
  const searchParams = new URLSearchParams(params)
  const result = await fetchWithToken(`${config[type].endpointData}?${searchParams.toString()}`)

  switch (type) {
    case DataSelectionType.BAG:
      return {
        totalCount: result?.object_count,
        results: result?.object_list.map(
          ({
            landelijk_id,
            _openbare_ruimte_naam,
            huisnummer,
            huisnummer_toevoeging,
            huisletter,
          }: any) => ({
            id: landelijk_id || uuidv4(),
            name: `${_openbare_ruimte_naam} ${huisnummer}${huisletter && ` ${huisletter}`}${
              huisnummer_toevoeging && `-${huisnummer_toevoeging}`
            }`.trim(),
          }),
        ),
      }
    case DataSelectionType.HR:
      return {
        totalCount: result?.object_count,
        results: result?.object_list.map(({ handelsnaam, vestiging_id }: any) => ({
          id: vestiging_id || uuidv4(),
          name: handelsnaam,
        })),
      }
    case DataSelectionType.BRK:
      return {
        totalCount: result?.object_count,
        results: result?.object_list.map(({ aanduiding, kadastraal_object_id }: any) => ({
          id: kadastraal_object_id || uuidv4(),
          name: aanduiding,
        })),
      }
    default:
      throw new Error(`Unable to get data, encountered an unknown data selection type '${type}'.`)
  }
}

const DataSelectionProvider: React.FC = ({ children }) => {
  const [mapVisualization, setMapVisualizationState, mapVisualizationRef] = useStateRef<
    MapVisualization[]
  >([])
  const [dataSelection, setDataSelectionState, dataSelectionRef] = useStateRef<DataSelection[]>([])
  const [loadingIds, setLoadingIds, loadingIdsRef] = useStateRef<string[]>([])
  const [errorIds, setErrorIds] = useState<string[]>([])
  const [type, setType, typeRef] = useStateRef<DataSelectionType>(DataSelectionType.BAG)
  const userScopes = useSelector(getUserScopes)
  const forbidden =
    config[type].authScope === AuthScope.None ? false : !userScopes.includes(config[type].authScope)

  const fetchResults = async <T,>(
    fn: (params: { [key: string]: string }, type: DataSelectionType) => void,
    latLngs: LatLng[][],
    id?: string,
    extraParams?: { [key: string]: string },
  ): Promise<T | void> => {
    if (forbidden) {
      return undefined
    }
    try {
      if (id) {
        setLoadingIds([...loadingIdsRef.current, id])
      }

      const params = {
        shape: JSON.stringify(latLngs[0].map(({ lat, lng }) => [lng, lat])),
        ...extraParams,
      }

      if (!typeRef.current) {
        throw new Error(`No data selection type set.`)
      }

      return await fn(params, typeRef.current)
    } catch (e) {
      if (id) {
        setErrorIds([...errorIds, id])
      }
      return undefined
    } finally {
      if (id) {
        setErrorIds(errorIds.filter((errorId) => id !== errorId))
        if (loadingIdsRef.current) {
          setLoadingIds(loadingIdsRef.current.filter((loadingId) => id !== loadingId))
        }
      }
    }
  }

  const setDataSelection = useCallback(
    (results: DataSelection[]) => {
      const ids = results.map(({ id }) => id)
      const newDataSelection = [
        ...dataSelectionRef?.current?.filter(({ id: dataId }) => !ids.includes(dataId)),
        ...results,
      ].sort((a, b) => a.order - b.order)
      setDataSelectionState(newDataSelection)
    },
    [dataSelectionRef, setDataSelectionState],
  )

  const setMapVisualization = useCallback(
    (results: MapVisualization[]) => {
      const ids = results.map(({ id }) => id)
      const newMapVisualization = [
        ...mapVisualizationRef?.current?.filter(({ id: markerId }) => !ids.includes(markerId)),
        ...results,
      ]
      setMapVisualizationState(newMapVisualization)
    },
    [mapVisualizationRef, setMapVisualizationState],
  )

  const fetchMapVisualization = async (
    latLngs: LatLng[][],
    id: string,
    setState = true,
  ): Promise<MapVisualization | null> => {
    const result = await fetchResults<MapVisualization>(getMapVisualization, latLngs)

    if (result) {
      const newMapVisualization = {
        ...result,
        id,
      }

      if (setState) {
        setMapVisualization([newMapVisualization])
      }

      return newMapVisualization
    }

    return null
  }

  const fetchDataSelection = async (
    latLngs: LatLng[][],
    id: string,
    paginationParams: PaginationParams,
    mapData?: MapData,
    setState = true,
  ): Promise<DataSelection | null> => {
    const result = await fetchResults<DataSelectionResponse>(getData, latLngs, id, {
      size: paginationParams.size.toString(),
      page: paginationParams.page.toString(),
    })

    if (result) {
      const existingData = dataSelectionRef?.current?.find(({ id: dataId }) => dataId === id)
      const newData = {
        id,
        order: existingData ? existingData.order : dataSelectionRef?.current?.length || 0,
        result: result.results,
        latLngs,
        totalCount: result.totalCount,
        mapData,
        ...paginationParams,
      }

      if (setState) {
        setDataSelection([newData])
      }

      return newData
    }

    return null
  }

  const removeDataSelection = (idsToRemove: string[]) => {
    if (idsToRemove.length === 0) {
      return
    }

    if (mapVisualizationRef.current && dataSelectionRef.current) {
      setMapVisualizationState(
        mapVisualizationRef.current.filter(({ id }) => !idsToRemove.includes(id)),
      )
      setDataSelectionState(dataSelectionRef.current.filter(({ id }) => !idsToRemove.includes(id)))
    }
  }

  // Re-fetch from new endpoints when type changes
  useEffect(() => {
    const promises: { data: Promise<any>[]; mapVisualization: Promise<any>[] } = {
      data: [],
      mapVisualization: [],
    }
    dataSelection.forEach(({ latLngs, id, size, mapData }) => {
      promises.data.push(fetchDataSelection(latLngs, id, { size, page: 1 }, mapData, false))
      promises.mapVisualization.push(fetchMapVisualization(latLngs, id, false))
    })
    ;(async () => {
      const dataResults = await Promise.all(promises.data)
      const mapVisualizationResults = await Promise.all(promises.mapVisualization)
      setMapVisualization(mapVisualizationResults)
      setDataSelection(dataResults)
    })()
  }, [type])

  return (
    <DataSelectionContext.Provider
      value={{
        fetchData: fetchDataSelection,
        fetchMapVisualization,
        removeDataSelection,
        mapVisualizations: mapVisualization,
        dataSelection,
        setType,
        type,
        forbidden,
        loadingIds,
        errorIds,
      }}
    >
      {children}
    </DataSelectionContext.Provider>
  )
}

export default DataSelectionProvider
