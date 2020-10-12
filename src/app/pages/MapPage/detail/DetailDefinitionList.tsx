import { Alert, CustomHTMLBlock, Link, ShowMoreShowLess } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import React from 'react'
import { DetailResultItemDefinitionListEntry } from '../../../../map/types/details'
import DefinitionList, { DefinitionListItem } from '../../../components/DefinitionList'

export interface DetailDefinitionListProps {
  entries?: DetailResultItemDefinitionListEntry[]
}

const StyledCustomHTMLBlock = styled(CustomHTMLBlock)`
  white-space: pre-line;
`

const DetailDefinitionList: React.FC<DetailDefinitionListProps> = ({ entries }) => (
  <DefinitionList>
    {entries?.map(({ term, description, link, alert }) => (
      <DefinitionListItem term={term} key={term}>
        {/* eslint-disable-next-line no-nested-ternary */}
        {link ? (
          <Link href={link} inList>
            {description}
          </Link>
        ) : description && description.length > 300 ? (
          <ShowMoreShowLess maxHeight="200px">
            <StyledCustomHTMLBlock body={description} />
          </ShowMoreShowLess>
        ) : (
          description
        )}
        {alert && <Alert>{alert}</Alert>}
      </DefinitionListItem>
    ))}
  </DefinitionList>
)

export default DetailDefinitionList
