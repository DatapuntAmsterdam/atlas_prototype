import { FunctionComponent, MouseEventHandler } from 'react'
import { Close } from '@amsterdam/asc-assets'
import { Button, Divider, Heading, Link, Modal, Paragraph, TopBar } from '@amsterdam/asc-ui'
import { Link as RouterLink } from 'react-router-dom'
import CONSTANTS from '../../../shared/config/constants'
import { toHelpPage } from '../../links'
import ModalBlock from './ModalBlock'
import withModalBehaviour from './withModalBehaviour'

export const openFeedbackForm = () => {
  const openFeedbackFormEvent = new CustomEvent('openForm_feedbackModal')
  window.dispatchEvent(openFeedbackFormEvent)
}

const FEEDBACK_RECIPIENT = 'terugmelding.basisinformatie@amsterdam.nl'
const FEEDBACK_SUBJECT = 'Terugmelding data.amsterdam.nl'
const FEEDBACK_BODY = (location: string) => `Onjuistheid terugmelden voor de pagina: ${location}\n
  Beschrijf zo volledig mogelijk van welk onjuist gegeven je een melding wilt maken:
  - Welk gegeven is kennelijk onjuist of ontbreekt?
  - Weet je wat het wel zou moeten zijn?
  - Waarop is jouw constatering gebaseerd? Omschrijf de reden en voeg indien mogelijk relevante
  documenten in de bijlage toe (bijvoorbeeld: een bouwtekening, koopakte, et cetera).
  `

const QUESTION_RECIPIENT = 'datapunt@amsterdam.nl'
const QUESTION_SUBJECT = 'Probleem melden of suggestie voor data.amsterdam.nl'
const QUESTION_BODY = (location: string) => `
  Beschrijf zo volledig mogelijk waar je tegenaan loopt:
  - Om welke pagina gaat het? (bijvoorbeeld: ${location})
  - Om welk onderdeel van de pagina gaat het?
  - Wat zie je op het scherm als je een probleem ondervindt?
  - Heb je een suggestie hoe het anders zou kunnen?
  `
const getMailtoLink = (recipient: string, subject: string, body: string) =>
  `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

interface FeedbackModalProps {
  reportFeedbackAction: MouseEventHandler<HTMLElement>
  reportProblemAction: MouseEventHandler<HTMLElement>
  handleClose(): void
  open: boolean
}

const FeedbackModalComponent: FunctionComponent<FeedbackModalProps> = ({
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
      <Heading as="h4">Onjuistheid terugmelden</Heading>
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
          FEEDBACK_BODY(typeof window !== 'undefined' ? window.location.href : ''),
        )}
      >
        Onjuistheid terugmelden
      </Button>
    </ModalBlock>
    <Divider gutter />
    <ModalBlock>
      <Heading as="h4">Verzoek nieuwe data of functionaliteiten</Heading>
      <Paragraph>
        Heb je een verzoek voor bijvoorbeeld een nieuwe dataset, kaartlaag of een verbetering van de
        site? We horen het graag.
      </Paragraph>
      <Button
        as="a"
        variant="primary"
        href="https://formulier.amsterdam.nl/thema/datapunt/verzoek-nieuwe-data-functionaliteit/"
      >
        Nieuw verzoek
      </Button>
    </ModalBlock>
    <Divider gutter />
    <ModalBlock>
      <Heading as="h4">Overige vragen</Heading>
      <Paragraph>
        Als iets op deze pagina niet goed werkt, onduidelijk is of vragen oproept, geef het aan ons
        door.
      </Paragraph>
      <Button
        as="a"
        variant="primary"
        onClick={reportProblemAction}
        href={getMailtoLink(
          QUESTION_RECIPIENT,
          QUESTION_SUBJECT,
          QUESTION_BODY(typeof window !== 'undefined' ? window.location.href : ''),
        )}
      >
        Vraag indienen
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

export default withModalBehaviour(FeedbackModalComponent)
