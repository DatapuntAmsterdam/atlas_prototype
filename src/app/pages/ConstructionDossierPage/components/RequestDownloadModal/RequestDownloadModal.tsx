import { Close } from '@amsterdam/asc-assets'
import { Button, Divider, Heading, Modal, Paragraph, themeSpacing, TopBar } from '@amsterdam/asc-ui'
import usePromise, { isFulfilled, isPending, isRejected } from '@amsterdam/use-promise'
import { useMemo, useState } from 'react'
import styled from 'styled-components'
import type { FunctionComponent } from 'react'
import type { Bestand } from '../../../../../api/iiif-metadata/bouwdossier'
import requestDownloadLink from '../../../../../api/iiif/requestDownloadLink'
import LoadingSpinner from '../../../../components/LoadingSpinner/LoadingSpinner'
import { useAuthToken } from '../../AuthTokenContext'
import ButtonBar from '../ButtonBar'

export interface RequestDownloadModalProps {
  files: Bestand[]
  onClose: () => void
}

const ModalBody = styled.div`
  padding: ${themeSpacing(6, 4)};
`

const LoadingText = styled(Paragraph)`
  text-align: center;
`

const RequestDownloadModal: FunctionComponent<RequestDownloadModalProps> = ({ files, onClose }) => {
  const { token } = useAuthToken()
  const [retryCount, setRetryCount] = useState(0)
  const urls = useMemo(() => files.map((file) => file.url), [files])
  const result = usePromise(() => requestDownloadLink(urls, token), [urls, token, retryCount])

  return (
    <Modal open onClose={onClose}>
      <TopBar>
        <Heading as="h4">
          Downloaden bouw- en omgevingsdossiers
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
        {isPending(result) && (
          <>
            <LoadingText data-testid="loadingMessage">
              Bezig met aanvragen downloadlink&hellip;
            </LoadingText>
            <LoadingSpinner />
          </>
        )}
        {isRejected(result) && (
          <>
            <Paragraph data-testid="errorMessage">
              Er is helaas iets mis gegaan met het aanvragen van uw downloadlink. Probeer het nog
              eens.
            </Paragraph>
            <ButtonBar>
              <Button type="button" variant="primary" onClick={() => setRetryCount(retryCount + 1)}>
                Probeer opnieuw
              </Button>
              <Button type="button" onClick={onClose}>
                Annuleren
              </Button>
            </ButtonBar>
          </>
        )}
        {isFulfilled(result) && (
          <>
            <Paragraph data-testid="successMessage">
              Uw downloadlink wordt voorbereid. Zodra deze klaar is ontvangt u een email met
              downloadlink. Dit kan bij hoge drukte even duren. Controleer ook uw spambox.
              <br />
              De downloadlink is 7 dagen geldig.
            </Paragraph>
            <Button type="button" variant="primary" onClick={onClose}>
              Sluiten
            </Button>
          </>
        )}
      </ModalBody>
    </Modal>
  )
}

export default RequestDownloadModal
