import { Link } from '@amsterdam/asc-ui'
import React from 'react'
import { DetailResultItemDefinitionListEntry } from '../../../../map/types/details'
import DefinitionList, { DefinitionListItem } from '../../../components/DefinitionList'

export interface DetailDefinitionListProps {
  entries: DetailResultItemDefinitionListEntry[]
}

const DetailDefinitionList: React.FC<DetailDefinitionListProps> = ({ entries }) => (
  <DefinitionList>
    {entries.map(({ term, description, link }) => (
      <DefinitionListItem term={term} key={term}>
        {link ? (
          <Link href={link} inList>
            {description}
          </Link>
        ) : (
          description
        )}
      </DefinitionListItem>
    ))}
  </DefinitionList>
)

export default DetailDefinitionList
