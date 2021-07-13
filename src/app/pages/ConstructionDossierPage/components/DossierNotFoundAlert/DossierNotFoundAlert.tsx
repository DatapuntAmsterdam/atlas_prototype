import { Alert, Paragraph } from '@amsterdam/asc-ui'

const DossierNotFoundAlert = () => (
  <Alert level="error" data-testid="errorMessage">
    <Paragraph>Er is geen dossier gevonden.</Paragraph>
  </Alert>
)

export default DossierNotFoundAlert
