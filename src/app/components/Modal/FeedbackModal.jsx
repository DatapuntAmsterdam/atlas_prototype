import React from 'react'
import PropTypes from 'prop-types'
import {
  Button,
  Divider,
  ListItem,
  Modal,
  TopBar,
  Heading,
  Paragraph,
  Link,
} from '@datapunt/asc-ui/lib/index'
import { Close } from '@datapunt/asc-assets'
import { routing } from '../../routes'
import withModalBehaviour, { propTypes as modalPropTypes } from './withModalBehaviour'

const FEEDBACK_RECIPIENT = 'terugmelding.basisinformatie@amsterdam.nl'
const FEEDBACK_SUBJECT = 'Terugmelding data.amsterdam.nl'
const FEEDBACK_BODY = location => `Onjuistheid terugmelden voor de pagina: ${location}\n
  Beschrijf zo volledig mogelijk van welk onjuist gegeven je een melding wilt maken:
  - Welk gegeven is kennelijk onjuist of ontbreekt?
  - Weet je wat het wel zou moeten zijn?
  - Waarop is jouw constatering gebaseerd? Omschrijf de reden en voeg indien mogelijk relevante
  documenten in de bijlage toe (bijvoorbeeld: een bouwtekening, koopakte, et cetera).
  `

const PROBLEM_RECIPIENT = 'datapunt@amsterdam.nl'
const PROBLEM_SUBJECT = 'Probleem melden of suggestie voor data.amsterdam.nl'
const PROBLEM_BODY = location => `Probleem melden voor de pagina: ${location}\n
  Beschrijf zo volledig mogelijk waar je tegenaan loopt:
  - Om welk onderdeel van de pagina gaat het?
  - Wat zie je op het scherm als je een probleem ondervindt?
  - Heb je een suggestie hoe het anders zou kunnen?
  `

const getMailtoLink = (recipient, subject, body) => `mailto:${recipient}
?subject=${window.encodeURIComponent(subject)}
&body=${window.encodeURIComponent(body)}`

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
    blurredNodeSelector="#root"
  >
    <TopBar>
      <Heading $as="h4">
        Feedback
        <Button variant="blank" type="button" size={30} onClick={handleClose} icon={<Close />} />
      </Heading>
    </TopBar>
    <Divider />
    <ListItem>
      <Heading $as="h4">Onjuiste of ontbrekende gegevens?</Heading>
      <Paragraph>
        We horen graag welke gegevens onjuist zijn of ontbreken. Voor medewerkers van de gemeente is
        dit &lsquo;terugmelden&lsquo; overigens verplicht.
      </Paragraph>
      <Button
        as="a"
        variant="primary"
        onClick={reportFeedbackAction}
        href={getMailtoLink(
          FEEDBACK_RECIPIENT,
          FEEDBACK_SUBJECT,
          FEEDBACK_BODY(window.location.href),
        )}
      >
        Onjuistheid terugmelden
      </Button>
    </ListItem>
    <Divider gutter />
    <ListItem>
      <Heading $as="h4">Probleem of suggestie?</Heading>
      <Paragraph>
        Als iets op deze pagina niet goed werkt, onduidelijk is of vragen oproept, geef het aan ons
        door.
      </Paragraph>
      <Button
        as="a"
        variant="primary"
        onClick={reportProblemAction}
        href={getMailtoLink(PROBLEM_RECIPIENT, PROBLEM_SUBJECT, PROBLEM_BODY(window.location.href))}
      >
        Probleem melden
      </Button>
    </ListItem>
    <Divider transparent />
    <ListItem>
      <Link linkType="inline" href={routing.help.path}>
        Hulp nodig?
      </Link>
    </ListItem>
  </Modal>
)

FeedbackModalComponent.propTypes = {
  reportFeedbackAction: PropTypes.func.isRequired,
  reportProblemAction: PropTypes.func.isRequired,
  ...modalPropTypes,
}

export default withModalBehaviour(FeedbackModalComponent)
