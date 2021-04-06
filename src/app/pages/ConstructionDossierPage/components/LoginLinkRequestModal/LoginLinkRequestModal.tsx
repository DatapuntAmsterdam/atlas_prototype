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
import { FormEvent, FunctionComponent, useState } from 'react'
import styled from 'styled-components'
import ButtonBar from '../ButtonBar'
import LoginLinkRequestFlow from './LoginLinkRequestFlow'

const ModalBody = styled.div`
  padding: ${themeSpacing(6, 4)};
`

const FormGroup = styled.div`
  margin-bottom: ${themeSpacing(6)};
`

export interface LoginLinkRequestModalProps {
  onClose: () => void
}

const LoginLinkRequestModal: FunctionComponent<LoginLinkRequestModalProps> = ({ onClose }) => {
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
          <LoginLinkRequestFlow
            email={email}
            onRetry={() => setShowRequestFlow(false)}
            onClose={onClose}
          />
        ) : (
          <>
            <Paragraph>
              Vul hier uw e-mailadres in om een toegangslink te ontvangen voor de bouw- en
              omgevingsdossiers. Deze link is 24 uur geldig.
            </Paragraph>
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

export default LoginLinkRequestModal
