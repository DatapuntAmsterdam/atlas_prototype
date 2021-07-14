import { ReactElement, useEffect } from 'react'
import type { PromiseResult } from '@amsterdam/use-promise'
import { isFulfilled, isPending, isRejected } from '@amsterdam/use-promise'
import { useMapContext } from '../MapContext'
import { AuthError, ForbiddenError } from '../../../../shared/services/api/customError'

const useAsyncMapPanelHeader = <T = any>(
  results: PromiseResult<T>,
  title?: string | null,
  type?: string | null,
  customElement?: ReactElement<any, any> | null,
) => {
  const { setPanelHeader } = useMapContext()

  useEffect(() => {
    if (isFulfilled(results) && title) {
      setPanelHeader({
        title,
        type,
        customElement,
      })
    }

    if (isPending(results)) {
      setPanelHeader({
        title: 'Laden...',
      })
    }

    if (isRejected(results)) {
      setPanelHeader({
        title:
          results.reason instanceof AuthError || results.reason instanceof ForbiddenError
            ? 'Meer resultaten na inloggen'
            : 'Er is een fout opgetreden',
      })
    }

    return () => {
      setPanelHeader({
        title: '',
      })
    }
  }, [results])
}

export default useAsyncMapPanelHeader
