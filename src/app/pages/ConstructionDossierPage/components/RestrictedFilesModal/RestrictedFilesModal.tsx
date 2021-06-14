import { Close } from '@amsterdam/asc-assets'
import {
  Button,
  Divider,
  Heading,
  List,
  ListItem,
  Modal,
  Paragraph,
  themeSpacing,
  TopBar,
} from '@amsterdam/asc-ui'
import styled from 'styled-components'
import type { FunctionComponent } from 'react'
import type { Bestand } from '../../../../../api/iiif-metadata/bouwdossier'

export interface RestrictedFilesModalProps {
  files: Bestand[]
  onClose: () => void
  onDownload: () => void
}

const ModalBody = styled.div`
  padding: ${themeSpacing(6, 4)};
`

const RestrictedFilesModal: FunctionComponent<RestrictedFilesModalProps> = ({
  files,
  onClose,
  onDownload,
}) => (
  <Modal open onClose={onClose}>
    <TopBar>
      <Heading as="h4">
        De volgende documenten zijn uitgesloten van uw download
        <Button
          variant="blank"
          title="Sluit"
          type="button"
          size={30}
          onClick={onClose}
          icon={<Close />}
        />
      </Heading>
    </TopBar>
    <Divider />
    <ModalBody>
      <>
        <Paragraph>
          U heeft niet de bevoegdheden om de volgende beveiligde documenten te downloaden:
        </Paragraph>
        <List variant="bullet">
          {files.map(({ filename, url }) => (
            <ListItem key={url}>{filename}</ListItem>
          ))}
        </List>
        <Paragraph>De overige bestanden kunt u wel in één keer downloaden.</Paragraph>
        <Button type="button" variant="primary" onClick={onDownload}>
          Download het dossier
        </Button>
      </>
    </ModalBody>
  </Modal>
)

export default RestrictedFilesModal
