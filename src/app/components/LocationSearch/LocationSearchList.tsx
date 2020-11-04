import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import { List } from '@amsterdam/asc-ui'
import { toDetailFromEndpoint } from '../../../store/redux-first-router/actions'
import LocationSearchListItem, { Result } from './LocationSearchListItem'
import { VIEW_MODE } from '../../../shared/ducks/ui/ui'

const StyledList = styled(List)`
  margin-bottom: 0;
`

type Props = {
  categoryResults?: {
    slug?: unknown
    results: Result[]
  }
  limit: number
}

const LocationSearchList: FunctionComponent<Props> = ({ categoryResults, limit }) => {
  const results: Result[] =
    categoryResults?.results?.map((result) => ({
      ...result,
      linkTo: toDetailFromEndpoint(result.endpoint, VIEW_MODE.SPLIT),
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
