import { Alert, CustomHTMLBlock, Link, ShowMoreShowLess } from '@amsterdam/asc-ui'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'
import type { FunctionComponent } from 'react'
import type { LocationDescriptor } from 'history'
import type { DetailResultItemDefinitionList } from '../../legacy/types/details'
import DefinitionList, { DefinitionListItem } from '../../../../components/DefinitionList'

const StyledCustomHTMLBlock = styled(CustomHTMLBlock)`
  white-space: pre-line;
`

const DetailDefinitionList: FunctionComponent<Pick<DetailResultItemDefinitionList, 'entries'>> = ({
  entries,
}) => {
  if (!entries) {
    return null
  }

  return (
    <DefinitionList data-testid="detail-definition-list">
      {entries.map(({ term, description, href, alert, to }) => (
        <DefinitionListItem term={term} key={term}>
          {renderDescription(description, href, to)}
          {alert && <Alert>{alert}</Alert>}
        </DefinitionListItem>
      ))}
    </DefinitionList>
  )
}

function renderDescription(
  description?: string | null,
  href?: string | null,
  to?: LocationDescriptor,
) {
  if (href) {
    return (
      <Link href={href} inList>
        {description}
      </Link>
    )
  }

  if (to) {
    return (
      <Link as={RouterLink} to={to} inList>
        {description}
      </Link>
    )
  }

  if (description && description.length > 300) {
    return (
      <ShowMoreShowLess maxHeight="200px">
        <StyledCustomHTMLBlock body={description} />
      </ShowMoreShowLess>
    )
  }

  return description
}

export default DetailDefinitionList
