import React, { FunctionComponent } from 'react'
import { Button, Heading, Link, List, ListItem, Modal, Paragraph, TopBar } from '@amsterdam/asc-ui'
import { Close } from '@amsterdam/asc-assets'
import RouterLink from 'redux-first-router-link'
import CONSTANTS from '../../../shared/config/constants'
import ModalBlock from './ModalBlock'
import {
  toDatasetSearch,
  toMapAndPreserveQuery,
  toPanoramaAndPreserveQuery,
} from '../../../store/redux-first-router/actions'

type Props = {
  openErrorModal: boolean
  setOpenErrorModal: (openErrorModal: boolean) => void
}

const ErrorModal: FunctionComponent<Props> = ({ openErrorModal, setOpenErrorModal }) => {
  return (
    <Modal
      aria-labelledby="feedback"
      aria-describedby="feedback"
      open={openErrorModal}
      onClose={() => setOpenErrorModal(false)}
      hideOverFlow={false}
      backdropOpacity={CONSTANTS.BACKDROP_OPACITY}
    >
      <TopBar>
        <Heading as="h4">
          Storing
          <Button
            variant="blank"
            title="Sluit"
            type="button"
            size={30}
            onClick={() => setOpenErrorModal(false)}
            icon={<Close />}
          />
        </Heading>
      </TopBar>
      <ModalBlock>
        <Paragraph>
          Er is een storing op de site waardoor niet alle inhoud beschikbaar is.
        </Paragraph>
        <List variant="bullet">
          <ListItem>
            <Link
              variant="inline"
              as={RouterLink}
              onClick={() => setOpenErrorModal(false)}
              to={toMapAndPreserveQuery()}
            >
              De kaart
            </Link>
          </ListItem>
          <ListItem>
            <Link
              variant="inline"
              as={RouterLink}
              onClick={() => setOpenErrorModal(false)}
              to={toPanoramaAndPreserveQuery()}
            >
              Panoramabeelden
            </Link>
          </ListItem>
          <ListItem>
            <Link
              variant="inline"
              as={RouterLink}
              onClick={() => setOpenErrorModal(false)}
              to={toDatasetSearch()}
            >
              Datasets
            </Link>
          </ListItem>
        </List>
        <Paragraph>Excuus voor het ongemak.</Paragraph>
      </ModalBlock>
    </Modal>
  )
}

export default ErrorModal
