import { Link, themeSpacing } from '@amsterdam/asc-ui'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'
import type { FunctionComponent } from 'react'
import { getDetailPageData } from '../../../store/redux-first-router/actions'
import buildDetailUrl from '../../pages/MapPage/components/DetailPanel/buildDetailUrl'
import DataSelectionFormatter from './DataSelectionFormatter/DataSelectionFormatter'
import type { Data } from './types'

const StyledListItem = styled.li`
  margin-bottom: ${themeSpacing(2)};
`

export interface DataSelectionListProps {
  content: Data
}

const DataSelectionList: FunctionComponent<DataSelectionListProps> = ({ content }) => (
  <ul data-testid="dataSelectionList">
    {content.body.map((row) => (
      <StyledListItem key={row.id}>
        <Link
          as={RouterLink}
          to={buildDetailUrl(getDetailPageData(row.detailEndpoint as string))}
          inList
        >
          <DataSelectionFormatter
            variables={row.content[0]}
            formatter={content.formatters[0]}
            useInline
          />
        </Link>

        {row.content.map(
          (variables, i) =>
            i !== 0 && (
              <DataSelectionFormatter
                // eslint-disable-next-line react/no-array-index-key
                key={i}
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
