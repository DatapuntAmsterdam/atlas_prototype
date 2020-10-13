import React from 'react'
import { Heading, Link, List, ListItem } from '@amsterdam/asc-ui'
import NotificationLevel from '../../../models/notification'
import { DetailResultNotification } from '../../../../map/types/details'

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

const wkpbNotification: DetailResultNotification = {
  id: 20,
  level: NotificationLevel.Normal,
  canClose: true,
  value: <WKPBDisclaimer />,
}

export default wkpbNotification
