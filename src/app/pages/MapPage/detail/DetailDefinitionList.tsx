import { Alert, CustomHTMLBlock, Link, ShowMoreShowLess } from '@amsterdam/asc-ui'
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
      {entries
        .map(({ term, description, link, alert }) => {
          if (!description) {
            return null
          }

          const renderShowMoreShowLess = !link && description.length > 300
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
        })
        .filter((value) => value)}
    </DefinitionList>
  )
}

export default DetailDefinitionList
