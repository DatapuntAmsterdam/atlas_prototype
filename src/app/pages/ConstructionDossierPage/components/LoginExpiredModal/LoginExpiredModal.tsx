import { Close } from '@amsterdam/asc-assets'
import {
  Button,
  Divider,
  Heading,
  Input,
  Label,
  Modal,
  Paragraph,
  themeSpacing,
  TopBar,
} from '@amsterdam/asc-ui'
import { useState } from 'react'
import styled from 'styled-components'
import type { FormEvent, FunctionComponent } from 'react'
import ButtonBar from '../ButtonBar'
import LoginExpiredModalLinkRequestFlow from './LoginExpiredModalLinkRequestFlow'

const ModalBody = styled.div`
  padding: ${themeSpacing(6, 4)};
`

const FormGroup = styled.div`
  margin-bottom: ${themeSpacing(6)};
`

export interface LoginExpiredModalProps {
  onClose: () => void
}

const LoginExpiredModal: FunctionComponent<LoginExpiredModalProps> = ({ onClose }) => {
  const [email, setEmail] = useState('')
  const [showRequestFlow, setShowRequestFlow] = useState(false)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setShowRequestFlow(true)
  }

  return (
    <Modal open onClose={onClose}>
      <TopBar>
        <Heading as="h4">
          Toegang aanvragen bouw- en omgevingdossiers
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
        {showRequestFlow ? (
          <LoginExpiredModalLinkRequestFlow
            email={email}
            onRetry={() => setShowRequestFlow(false)}
            onClose={onClose}
          />
        ) : (
          <>
            {/* TODO replace placeholder text */}
            <Paragraph>Link is expired!</Paragraph>
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <Label htmlFor="email-input" label="E-mailadres" />
                <Input
                  id="email-input"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </FormGroup>
              <ButtonBar>
                <Button type="submit" variant="primary">
                  Versturen
                </Button>
                <Button type="button" onClick={onClose}>
                  Annuleren
                </Button>
              </ButtonBar>
            </form>
          </>
        )}
      </ModalBody>
    </Modal>
  )
}

export default LoginExpiredModal
