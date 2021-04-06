import { v4 } from 'uuid'
import isObject from '../../../app/utils/isObject'
import { LegacyDataSelectionConfigType } from './data-selection-config'
import {
  ActiveFilter,
  AvailableFilter,
  AvailableFilterOption,
  Data,
  FilterObject,
  LegacyDataSelectionViewTypes,
  ObjectDetailWithLink,
} from '../../../app/components/DataSelection/types'
import environment from '../../../environment'
import { AggsList, Bucket, ObjectDetail } from '../../../api/dataselectie/bag/types'

export function formatFilters(config: LegacyDataSelectionConfigType, aggsList: AggsList) {
  const rawData = Object.entries(aggsList).reduce((acc, [key, value]) => {
    acc[key] = {
      numberOfOptions: value.doc_count,
      options: value.buckets.map((option: Bucket) => ({
        id: option.key,
        label: option.key,
        count: option.doc_count,
      })),
    }
    return acc
  }, {})
  const formattedFilters = config.FILTERS
  const sortFilters = config.SORT_FILTERS || false
  const newRawData = { ...rawData }
  const filters: AvailableFilter[] = formattedFilters
    .filter((filter) => isObject(rawData[filter.slug]))
    .map((filter) => {
      const newFilter = { ...filter }
      // use the specific term order when defined
      if (newFilter.order) {
        newRawData[newFilter.slug].options = newFilter.order
          .map((term) => {
            const found = newRawData[newFilter.slug].options.filter(
              (option: AvailableFilterOption) => option.label === term,
            )
            return found.length > 0 ? found[0] : null
          })
          .filter((item) => !!item)
        delete newFilter.order
      }
      return { ...newFilter, ...newRawData[newFilter.slug] }
    })

  if (sortFilters) {
    return filters.map((filter) => {
      filter.options.sort((a, b) => {
        // ignore upper and lowercase
        const labelA = a.label.toLowerCase()
        const labelB = b.label.toLowerCase()
        if (labelA < labelB) {
          return -1
        }
        if (labelA > labelB) {
          return 1
        }

        // names must be equal
        return 0
      })
      return filter
    })
  }

  return filters
}

function recurGetContent(path: string[], rawData: any): string | any[] {
  if (path.length === 1) {
    const key = path[0]
    const rawValue = rawData[key]

    return Array.isArray(rawValue) ? rawValue.filter((part) => part).join(' | ') : rawValue
  }
  const key = path[0]
  const rawValue = rawData[key]
  const remainingPath = path.splice(1)

  return Array.isArray(rawValue)
    ? rawValue.map((value) => recurGetContent(remainingPath, value))
    : recurGetContent(remainingPath, rawValue)
}

const getDetailEndpoint = (config: LegacyDataSelectionConfigType, rawDataRow: ObjectDetail) =>
  rawDataRow.dataset === 'mac'
    ? `${environment.API_ROOT}handelsregister/maatschappelijkeactiviteit/${
        rawDataRow.kvk_nummer ?? ''
      }/`
    : // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `${environment.API_ROOT}${config.ENDPOINT_DETAIL}${rawDataRow[config.PRIMARY_KEY] ?? ''}/`

export function formatData(
  config: LegacyDataSelectionConfigType,
  view: LegacyDataSelectionViewTypes,
  objectList: ObjectDetail[],
): Data {
  const objectListWithLinks: ObjectDetailWithLink[] = objectList.map((objectListRow) => ({
    ...objectListRow,
    _links: {
      self: {
        href: getDetailEndpoint(config, objectListRow),
      },
    },
  }))

  const fields = config.CONTENT[view]

  return {
    // @ts-ignore
    head: fields.map(({ label }) => label || null),
    body: objectListWithLinks.map((rawDataRow) => ({
      id: v4(),
      // eslint-disable-next-line no-underscore-dangle
      detailEndpoint: rawDataRow._links.self.href,
      content: fields.map(({ variables }: { variables: string[] }) =>
        variables.map((variable) => ({
          id: v4(),
          key: variable,
          value: recurGetContent(variable.split('.'), rawDataRow) as string,
        })),
      ),
    })),
    // @ts-ignore
    formatters: fields.map(({ formatter }) => formatter || null),
    // @ts-ignore
    templates: fields.map(({ template }) => template || null),
  }
}

export function createFiltersObject(activeFilters: ActiveFilter[]): FilterObject {
  return !activeFilters.length
    ? {}
    : activeFilters.reduce(
        (acc, { key, value }) => ({
          ...acc,
          [key]: value,
        }),
        {},
      )
}
