import { useState, FunctionComponent } from 'react'
import {
  Alert,
  Button,
  Heading,
  Link,
  Paragraph,
  themeColor,
  themeSpacing,
} from '@amsterdam/asc-ui'
import styled from 'styled-components'
import Metadata from '../../../../shared/assets/icons/metadata.svg'
import DetailDefinitionList from './DetailDefinitionList'
import { InfoBoxProps } from '../../../../map/types/details'
import Spacer from '../../../components/Spacer/Spacer'

const StyledAlert = styled(Alert)`
  margin: ${themeSpacing(2, 0)};
`

const StyledButton = styled(Button)`
  border: 1px solid ${themeColor('tint', 'level3')};
`

const DetailInfoBox: FunctionComponent<InfoBoxProps> = ({ plural, description, url, meta }) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <StyledButton
        type="button"
        variant="blank"
        data-testid="detail-infobox"
        title="Meer info"
        size={32}
        iconSize={26}
        onClick={() => setOpen(!open)}
        icon={<Metadata />}
      />
      {open && (
        <StyledAlert dismissible onDismiss={() => setOpen(false)} level="neutral">
          <Heading styleAs="h3" as="h6">
            Uitleg over {plural}
          </Heading>
          {description && <Paragraph>{description}</Paragraph>}
          {url && (
            <Link href={url} target="_blank" inList>
              Lees verder op stelselpedia
            </Link>
          )}
          {!!meta?.length && (
            <>
              <Spacer />
              <Heading styleAs="h3" as="h6">
                Metadata
              </Heading>
              <DetailDefinitionList entries={meta} />
            </>
          )}
        </StyledAlert>
      )}
    </>
  )
}

export default DetailInfoBox
