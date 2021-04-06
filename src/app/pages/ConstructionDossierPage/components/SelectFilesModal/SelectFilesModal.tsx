import { Close } from '@amsterdam/asc-assets'
import { Button, Divider, Heading, Modal, Paragraph, themeSpacing, TopBar } from '@amsterdam/asc-ui'
import { FunctionComponent } from 'react'
import styled from 'styled-components'

export interface SelectFilesModalProps {
  onClose: () => void
}

const ModalBody = styled.div`
  padding: ${themeSpacing(6, 4)};
`

const SelectFilesModal: FunctionComponent<SelectFilesModalProps> = ({ onClose }) => {
  return (
    <Modal open onClose={onClose}>
      <TopBar>
        <Heading as="h4">
          Selecteer eerst documenten
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
        <Paragraph>
          U kunt alleen geselecteerde documenten downloaden. Selecteer eerst documenten met de
          checkbox en klik dan opnieuw op de download knop.
        </Paragraph>
        <Button type="button" variant="primary" onClick={onClose}>
          Ik begrijp het
        </Button>
      </ModalBody>
    </Modal>
  )
}

export default SelectFilesModal
