/* eslint-disable @typescript-eslint/naming-convention */
import { Alert } from '@amsterdam/asc-ui'
import type { FunctionComponent } from 'react'
import { useEffect } from 'react'
import styled from 'styled-components'
import environment from '../../../environment'
import { createCookie, getCookie } from '../../../shared/services/cookie/cookie'
import { useIsEmbedded } from '../../contexts/ui'
import useDataFetching from '../../utils/useDataFetching'
import { InfoModal } from '../Modal'

const COOKIE_NAME = 'showNotificationAlert'

const Content = styled.div`
  p {
    margin-bottom: 0;
  }
`
const StyledAlert = styled(Alert)`
  /* Ensure outline is visible when element is in focus */
  &:focus {
    z-index: 999;
  }

  @media print {
    display: none;
  }
`

const NotificationAlert: FunctionComponent = () => {
  const { fetchData, results } = useDataFetching()
  const isEmbedded = useIsEmbedded()

  useEffect(() => {
    // Limit = 1 because this prevents us from getting multiple notifications
    const endpoint = `${environment.CMS_ROOT}jsonapi/node/notification?filter[field_active]=1&page[limit]=1`
    ;(() => {
      fetchData(endpoint)
        .then(() => {})
        .catch(() => {})
    })()
  }, [])

  if (!isEmbedded && !getCookie(COOKIE_NAME) && results) {
    const { title, body, field_notification_type, field_position, field_notification_title } =
      results?.data[0]?.attributes || {}

    if (body) {
      return field_position === 'header' ? (
        <StyledAlert
          dismissible
          heading={field_notification_title}
          level={field_notification_type || 'info'}
          onDismiss={() => createCookie(COOKIE_NAME, '8')}
        >
          <Content dangerouslySetInnerHTML={{ __html: body.value }} />
        </StyledAlert>
      ) : (
        <InfoModal
          id="infoModal"
          {...{ open: !isEmbedded, title: field_notification_title ?? title, body: body.value }}
          closeModalAction={() => createCookie(COOKIE_NAME, '8')}
        />
      )
    }

    return null
  }

  return null
}

export default NotificationAlert
