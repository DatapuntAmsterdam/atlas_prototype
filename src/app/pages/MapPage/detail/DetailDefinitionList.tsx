import React from 'react'
import { Link } from '@amsterdam/asc-ui'
import { DetailResultItemDefinitionListEntry } from '../../../../map/types/details'
import DefinitionList, { DefinitionListItem } from '../../../components/DefinitionList'

const DetailDefinitionList: React.FC<{ entries: DetailResultItemDefinitionListEntry[] }> = ({
  entries,
}) => (
  <DefinitionList>
    {entries.map(({ term, description, link }) => (
      <DefinitionListItem term={term}>
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
