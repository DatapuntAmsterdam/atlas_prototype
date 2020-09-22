import { Close } from '@amsterdam/asc-assets'
import { Button, Divider, Heading, Link, Modal, Paragraph, TopBar } from '@amsterdam/asc-ui'
import PropTypes from 'prop-types'
import React from 'react'
import RouterLink from 'redux-first-router-link'
import CONSTANTS from '../../../shared/config/constants'
import { toHelpPage } from '../../../store/redux-first-router/actions'
import ModalBlock from './ModalBlock'
import withModalBehaviour, { propTypes as modalPropTypes } from './withModalBehaviour'

export const openFeedbackForm = () => {
  const openFeedbackFormEvent = new CustomEvent('openForm_feedbackModal')
  window.dispatchEvent(openFeedbackFormEvent)
}

const FEEDBACK_RECIPIENT = 'terugmelding.basisinformatie@amsterdam.nl'
const FEEDBACK_SUBJECT = 'Terugmelding data.amsterdam.nl'
const FEEDBACK_BODY = (location) => `Onjuistheid terugmelden voor de pagina: ${location}\n
  Beschrijf zo volledig mogelijk van welk onjuist gegeven je een melding wilt maken:
  - Welk gegeven is kennelijk onjuist of ontbreekt?
  - Weet je wat het wel zou moeten zijn?
  - Waarop is jouw constatering gebaseerd? Omschrijf de reden en voeg indien mogelijk relevante
  documenten in de bijlage toe (bijvoorbeeld: een bouwtekening, koopakte, et cetera).
  `

const PROBLEM_RECIPIENT = 'datapunt@amsterdam.nl'
const PROBLEM_SUBJECT = 'Probleem melden of suggestie voor data.amsterdam.nl'
const PROBLEM_BODY = (location) => `Probleem melden voor de pagina: ${location}\n
  Beschrijf zo volledig mogelijk waar je tegenaan loopt:
  - Om welk onderdeel van de pagina gaat het?
  - Wat zie je op het scherm als je een probleem ondervindt?
  - Heb je een suggestie hoe het anders zou kunnen?
  `
const getMailtoLink = (recipient, subject, body) =>
  `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

const FeedbackModalComponent = ({
  open,
  handleClose,
  reportFeedbackAction,
  reportProblemAction,
}) => (
  <Modal
    aria-labelledby="feedback"
    aria-describedby="feedback"
    open={open}
    onClose={handleClose}
    hideOverFlow={false}
    backdropOpacity={CONSTANTS.BACKDROP_OPACITY}
  >
    <TopBar>
      <Heading as="h4">
        Feedback
        <Button
          variant="blank"
          title="Sluit"
          type="button"
          size={30}
          onClick={handleClose}
          icon={<Close />}
        />
      </Heading>
    </TopBar>
    <Divider />
    <ModalBlock>
      <Heading as="h4">Onjuiste of ontbrekende gegevens?</Heading>
      <Paragraph>
        We horen graag welke gegevens onjuist zijn of ontbreken. Voor medewerkers van de gemeente is
        dit &lsquo;terugmelden&lsquo; overigens verplicht.
      </Paragraph>
      <Button
        as="a"
        title="Onjuistheid terugmelden"
        variant="primary"
        onClick={reportFeedbackAction}
        href={getMailtoLink(
          FEEDBACK_RECIPIENT,
          FEEDBACK_SUBJECT,
          FEEDBACK_BODY(typeof window !== 'undefined' ? window.location.href : ''),
        )}
      >
        Onjuistheid terugmelden
      </Button>
    </ModalBlock>
    <Divider gutter />
    <ModalBlock>
      <Heading as="h4">Probleem of suggestie?</Heading>
      <Paragraph>
        Als iets op deze pagina niet goed werkt, onduidelijk is of vragen oproept, geef het aan ons
        door.
      </Paragraph>
      <Button
        as="a"
        title="Probleem melden"
        variant="primary"
        onClick={reportProblemAction}
        href={getMailtoLink(
          PROBLEM_RECIPIENT,
          PROBLEM_SUBJECT,
          PROBLEM_BODY(typeof window !== 'undefined' ? window.location.href : ''),
        )}
      >
        Probleem melden
      </Button>
    </ModalBlock>
    <Divider transparent />
    <ModalBlock>
      <Link variant="inline" to={toHelpPage()} onClick={handleClose} as={RouterLink}>
        Hulp nodig?
      </Link>
    </ModalBlock>
  </Modal>
)

FeedbackModalComponent.propTypes = {
  reportFeedbackAction: PropTypes.func.isRequired,
  reportProblemAction: PropTypes.func.isRequired,
  ...modalPropTypes,
}

export default withModalBehaviour(FeedbackModalComponent)
