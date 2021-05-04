import { FunctionComponent } from 'react'
import { isEmbeddedParam } from '../../pages/MapPage/query-params'
import createNamedContext from '../../utils/createNamedContext'
import useParam from '../../utils/useParam'
import useRequiredContext from '../../utils/useRequiredContext'

export interface UiContextProps {
  /**
   * Indicates whether the application is being embedded through an iframe.
   */
  isEmbedded: boolean
}

const UiContext = createNamedContext<UiContextProps | null>('Ui', null)

export default UiContext

export const UiProvider: FunctionComponent = ({ children }) => {
  const [isEmbedded] = useParam(isEmbeddedParam)

  return <UiContext.Provider value={{ isEmbedded }}>{children}</UiContext.Provider>
}

export const useIsEmbedded = () => useRequiredContext(UiContext).isEmbedded
