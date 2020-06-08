import React from 'react'
import PropTypes from 'prop-types'
import { Divider, Button, Modal, TopBar, Heading, Paragraph } from '@datapunt/asc-ui'
import { Close } from '@datapunt/asc-assets'
import withModalBehaviour, { propTypes as modalPropTypes } from './withModalBehaviour'
import ModalBlock from './ModalBlock'
import CONSTANTS from '../../../shared/config/constants'

const InfoModal = ({ open, handleClose, title, body }) => (
  <Modal
    aria-labelledby="feedback"
    aria-describedby="feedback"
    open={open}
    onClose={handleClose}
    hideOverFlow={false}
    backdropOpacity={CONSTANTS.BACKDROP_OPACITY}
  >
    <TopBar>
      <Heading style={{ flexGrow: 1 }} as="h4">
        {title}
        <Button variant="blank" type="button" size={30} onClick={handleClose} icon={<Close />} />
      </Heading>
    </TopBar>
    <Divider />
    <ModalBlock>
      <Paragraph className="infomodal__body" dangerouslySetInnerHTML={{ __html: body }} />
    </ModalBlock>
  </Modal>
)

InfoModal.propTypes = {
  title: PropTypes.string.isRequired,
  body: PropTypes.string.isRequired,
  ...modalPropTypes,
}

export default withModalBehaviour(InfoModal)
