import { Alert, CustomHTMLBlock, Link, ShowMoreShowLess } from '@amsterdam/asc-ui'
import { LocationDescriptor } from 'history'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
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
    <DefinitionList>
      {entries.map(({ term, description, link, alert }) => (
        <DefinitionListItem term={term} key={term}>
          {renderDescription(description, link)}
          {alert && <Alert>{alert}</Alert>}
        </DefinitionListItem>
      ))}
    </DefinitionList>
  )
}

function renderDescription(description?: string | null, link?: LocationDescriptor | null) {
  if (link) {
    return (
      <Link href={link} inList>
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
