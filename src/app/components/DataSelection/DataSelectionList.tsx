import { Link, themeSpacing } from '@amsterdam/asc-ui'
import { FunctionComponent } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'
import { getDetailPageData } from '../../../store/redux-first-router/actions'
import buildDetailUrl from '../../pages/MapPage/detail/buildDetailUrl'
import DataSelectionFormatter from './DataSelectionFormatter/DataSelectionFormatter'
import { Data } from './types'

const StyledListItem = styled.li`
  margin-bottom: ${themeSpacing(2)};
`

const DataSelectionList: FunctionComponent<{
  content: Data
}> = ({ content }) => (
  <ul data-testid="dataSelectionList">
    {content.body.map((row) => (
      <StyledListItem key={row.id}>
        <Link as={RouterLink} to={buildDetailUrl(getDetailPageData(row.detailEndpoint))} inList>
          {/*
          // @ts-ignore */}
          <DataSelectionFormatter
            // @ts-ignore
            variables={row.content[0]}
            formatter={content.formatters[0]}
            useInline
          />
        </Link>

        {row.content.map(
          (variables, i) =>
            i !== 0 && (
              // @ts-ignore
              <DataSelectionFormatter
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                // @ts-ignore
                variables={variables}
                formatter={content.formatters[i]}
                useInline
              />
            ),
        )}
      </StyledListItem>
    ))}
  </ul>
)

export default DataSelectionList
