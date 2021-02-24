import { Alert } from '@amsterdam/asc-ui'
import { FunctionComponent, useMemo } from 'react'

function parseBrowserVersion() {
  const versionRaw = navigator.userAgent.split('/').pop() as string
  const [major] = versionRaw.split('.').map((part) => parseInt(part, 10))

  return {
    major,
  }
}

const BrowserSupportAlert: FunctionComponent = () => {
  const isFirefox = navigator.userAgent.includes('Firefox')
  const version = useMemo(() => parseBrowserVersion(), [])

  // We only support the latest ESR release of Firefox.
  // Make sure to update this with the correct version according to the release schedule:
  // https://wiki.mozilla.org/Release_Management/Calendar
  if (!isFirefox || version.major >= 78) {
    return null
  }

  return (
    <Alert level="warning" dismissible>
      Uw browser is verouderd en zal binnenkort niet langer ondersteund worden. Medewerker bij de
      Gemeente? Zorg dan dat u gebruik maakt van ADW Next.
    </Alert>
  )
}

export default BrowserSupportAlert
