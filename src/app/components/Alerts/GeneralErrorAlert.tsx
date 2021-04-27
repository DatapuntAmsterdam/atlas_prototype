import React from 'react'
import { Alert, Paragraph } from '@amsterdam/asc-ui'

const GeneralErrorAlert = () => (
  <Alert level="error" data-testid="errorMessage">
    <Paragraph>
      Er kunnen door een technische storing helaas geen gegevens worden getoond. Probeer het later
      nog eens.
    </Paragraph>
  </Alert>
)

export default GeneralErrorAlert
