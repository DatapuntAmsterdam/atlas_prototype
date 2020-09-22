import { Link, themeSpacing } from '@amsterdam/asc-ui'
import React from 'react'
import styled from 'styled-components'

const StyledLink = styled(Link)`
  margin: ${themeSpacing(2, 0)};

  :last-child {
    margin-bottom: 0;
  }
`

export interface MapLayerSearchResultsProps {
  // TODO: Properly type the results
  results: any[]
}

const MapLayerSearchResults: React.FC<MapLayerSearchResultsProps> = ({ results }) => {
  return (
    <ul>
      {results.map((result) => (
        <li key={result.id}>
          <StyledLink inList href={result.href}>
            {result.title}
          </StyledLink>
        </li>
      ))}
    </ul>
  )
}

export default MapLayerSearchResults
