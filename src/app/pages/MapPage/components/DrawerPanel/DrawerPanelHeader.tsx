import { Close } from '@amsterdam/asc-assets'
import { Button, themeSpacing } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import type { FunctionComponent, HTMLAttributes } from 'react'

const HeaderContainer = styled.div`
  display: flex;
  padding: ${themeSpacing(4)};
`

const CloseButton = styled(Button)`
  margin-left: auto;
`

const Wrapper = styled.div`
  position: relative;
  width: 100%;
`

interface DrawerPanelHeaderProps {
  onClose?: () => void
}

const DrawerPanelHeader: FunctionComponent<
  DrawerPanelHeaderProps & HTMLAttributes<HTMLDivElement>
> = ({ children, onClose, className }) => (
  <HeaderContainer className={className}>
    <Wrapper>{children}</Wrapper>
    {onClose && (
      <CloseButton
        data-testid="closePanelButton"
        variant="blank"
        title="Sluit paneel"
        type="button"
        size={30}
        onClick={onClose}
        icon={<Close />}
      />
    )}
  </HeaderContainer>
)

export default DrawerPanelHeader
