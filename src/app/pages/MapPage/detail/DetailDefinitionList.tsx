import { Alert, CustomHTMLBlock, Link, ShowMoreShowLess } from '@amsterdam/asc-ui'
import React, { FunctionComponent } from 'react'
import styled from 'styled-components'
import { DetailResultItemDefinitionListEntry } from '../../../../map/types/details'
import DefinitionList, { DefinitionListItem } from '../../../components/DefinitionList'

export interface DetailDefinitionListProps {
  entries?: DetailResultItemDefinitionListEntry[]
}

const StyledCustomHTMLBlock = styled(CustomHTMLBlock)`
  white-space: pre-line;
`

const DetailDefinitionList: FunctionComponent<DetailDefinitionListProps> = ({ entries }) => (
  <DefinitionList>
    {entries?.map(({ term, description, link, alert }) => {
      const renderShowMoreShowLess = !link && description && description.length > 300
      const renderLink = link && !renderShowMoreShowLess
      const renderDescription = !link && !renderShowMoreShowLess
      return (
        <DefinitionListItem term={term} key={term}>
          {renderShowMoreShowLess && (
            <ShowMoreShowLess maxHeight="200px">
              <StyledCustomHTMLBlock body={description} />
            </ShowMoreShowLess>
          )}
          {renderLink && (
            <Link href={link} inList>
              {description}
            </Link>
          )}
          {renderDescription && description}
          {alert && <Alert>{alert}</Alert>}
        </DefinitionListItem>
      )
    })}
  </DefinitionList>
)

export default DetailDefinitionList
