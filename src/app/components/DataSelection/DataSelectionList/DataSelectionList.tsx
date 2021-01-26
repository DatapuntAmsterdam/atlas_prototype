import { Link, themeSpacing } from '@amsterdam/asc-ui'
import { FunctionComponent } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'
import { getDetailPageData } from '../../../../store/redux-first-router/actions'
import buildDetailUrl from '../../../pages/MapPage/detail/buildDetailUrl'
import DataSelectionFormatter from '../DataSelectionFormatter/DataSelectionFormatter'

const StyledListItem = styled.li`
  margin-bottom: ${themeSpacing(2)};
`

// TODO: Accurately determine the types in this interface.
export interface DataSelectionListProps {
  content: {
    head: []
    body: [
      {
        detailEndpoint: string
        content: string[]
      },
    ]
    formatters: string[]
  }
}

const DataSelectionList: FunctionComponent<DataSelectionListProps> = ({ content }) => (
  <ul>
    {content.body.map((row) => (
      <StyledListItem key={row.content[0]}>
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
