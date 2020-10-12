import React from 'react'
import { Heading, Link, List, ListItem, Paragraph } from '@amsterdam/asc-ui'
import NotificationLevel from '../../../models/notification'

const HRDisplaimer = () => {
  return (
    <>
      <Heading as="h3">Disclaimer</Heading>
      <Paragraph>
        De gegevens uit het Handelsregister (HR) zijn afkomstig van een lokale gemeentelijke kopie
        van de Kamer van Koophandel (KvK).
      </Paragraph>
      <Paragraph>
        De volgende vestigingen komen op dit moment nog niet voor op deze website (met kvk-nummer):
        RABO-bank (30046259), Fortis (30080248), ING (33031431), ABN AMRO (34334259), Bart Smit
        (36009388), Het Nederlandse Rode Kruis (40409352), Kruidvat/Trekpleister (31035585).
      </Paragraph>
      <Paragraph>
        Raadpleeg voor de meest actuele gegevens de{' '}
        <Link target="_blank" rel="noopener" href="https://www.kvk.nl/zoeken/">
          raadpleegvoorziening van de KvK
        </Link>
        .
      </Paragraph>
    </>
  )
}

const WKPBDisclaimer = () => {
  return (
    <>
      <Heading as="h3">Disclaimer</Heading>
      <List variant="bullet">
        <ListItem>
          De Wet kenbaarheid publiekrechtelijke beperkingen onroerende zaken schrijft voor dat
          beperkingen op kadastraal object worden geregistreerd. Om zeker te weten waar een
          beperking op rust, raadpleeg het brondocument van de beperking.
        </ListItem>
        <ListItem>
          Alleen de gemeentelijke beperkingen worden getoond. Voor een volledig overzicht van alle
          publiek- en privaatrechtelijke beperkingen bij een bepaald kadastraal object wordt u
          verzocht de website van het {` `}
          <Link target="_blank" rel="noopener" href="https://www.kadaster.nl">
            Kadaster
          </Link>
          te raadplegen.
        </ListItem>
        <ListItem>
          Er kunnen vier dagen zitten tussen het kenbaar maken van een beperkingenbesluit en
          vestigingen daarvan in het register.
        </ListItem>
      </List>
    </>
  )
}

export const hrNotification = {
  id: 10,
  level: NotificationLevel.Normal,
  canClose: true,
  value: <HRDisplaimer />,
}

export const wkpbNotification = {
  id: 20,
  level: NotificationLevel.Normal,
  canClose: true,
  value: <WKPBDisclaimer />,
}
