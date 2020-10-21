import { Alert, CustomHTMLBlock, Link, ShowMoreShowLess } from '@amsterdam/asc-ui'
import React, { FunctionComponent } from 'react'
import { Link as RouterLink } from 'react-router-dom'
import styled from 'styled-components'
import { LocationDescriptor } from 'history'
import { DetailResultItemDefinitionList } from '../../../../map/types/details'
import DefinitionList, { DefinitionListItem } from '../../../components/DefinitionList'

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
  href?: LocationDescriptor | null,
  to?: string | { pathname: string; search?: string },
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
      <Link as={RouterLink} to={to} href={href} inList>
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
