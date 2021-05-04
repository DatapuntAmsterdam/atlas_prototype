import { ExternalLink } from '@amsterdam/asc-assets'
import { Button, themeColor, themeSpacing } from '@amsterdam/asc-ui'
import { useHistory, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import { isEmbeddedParam } from '../../query-params'
import Control from '../Control'

export const EmbedButton = styled(Button)`
  position: absolute;
  right: ${themeSpacing(2)};
  top: ${themeSpacing(2)};
  z-index: 1;

  svg path {
    fill: ${themeColor('tint', 'level7')};
  }
`

const EmbedControl = () => {
  const history = useHistory()
  const location = useLocation()

  function onClick() {
    const searchParams = new URLSearchParams(location.search)

    searchParams.delete(isEmbeddedParam.name)

    const href = history.createHref({
      ...location,
      search: searchParams.toString(),
    })

    window.open(href, 'blank')
  }

  return (
    <Control>
      <EmbedButton
        data-testid="embedButton"
        variant="blank"
        iconSize={18}
        aria-label="Naar interactieve kaart"
        iconLeft={<ExternalLink />}
        onClick={onClick}
      >
        data.amsterdam.nl
      </EmbedButton>
    </Control>
  )
}

export default EmbedControl
