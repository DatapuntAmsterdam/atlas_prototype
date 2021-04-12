import { FunctionComponent } from 'react'
import styled from 'styled-components'
import { List } from '@amsterdam/asc-ui'
import { toDetailFromEndpoint } from '../../../store/redux-first-router/actions'
import LocationSearchListItem, { Result } from './LocationSearchListItem'
import { ViewMode } from '../../../shared/ducks/ui/ui'
import AuthScope from '../../../shared/services/api/authScope'

const StyledList = styled(List)`
  margin-bottom: 0;
`

export interface CategoryResult {
  count: number
  authScope: AuthScope
  warning?: string
  singular: string
  plural: string
  slug?: unknown
  more?: {
    endpoint: string
    label: string
  }
  subResults?: Array<CategoryResult>
  results: Result[]
}

export interface LocationSearchListProps {
  categoryResults?: CategoryResult
  limit: number
}

const LocationSearchList: FunctionComponent<LocationSearchListProps> = ({
  categoryResults,
  limit,
}) => {
  const results: Result[] =
    categoryResults?.results?.map((result) => ({
      ...result,
      linkTo: toDetailFromEndpoint(result.endpoint, ViewMode.Split),
    })) ?? []
  return (
    <StyledList>
      {results.slice(0, limit).map((result) => (
        <LocationSearchListItem
          key={result.endpoint}
          {...{
            category: categoryResults,
            result,
          }}
        />
      ))}
    </StyledList>
  )
}

export default LocationSearchList
