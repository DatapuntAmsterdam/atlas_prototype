/* eslint-disable camelcase */
import React from 'react'
import styled from 'styled-components'
import { Alert } from '@datapunt/asc-ui'
import { useSelector } from 'react-redux'
import { isEmbedded, isPrintMode } from '../../../shared/ducks/ui/ui'
import useDataFetching from '../../utils/useDataFetching'
import { createCookie, getCookie } from '../../../shared/services/cookie/cookie'
import { InfoModal } from '../Modal'
import environment from '../../../environment'

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
`

const NotificationAlert: React.FC = () => {
  const hide = useSelector(isEmbedded)
  const { fetchData, results } = useDataFetching()
  const printMode = useSelector(isPrintMode)

  React.useEffect(() => {
    if (printMode) {
      return
    }
    // Limit = 1 because this prevents us from getting multiple notifications
    const endpoint = `${environment.CMS_ROOT}jsonapi/node/notification?filter[field_active]=1&page[limit]=1`
    ;(async () => {
      await fetchData(endpoint)
    })()
  }, [])

  if (!printMode && !hide && !getCookie(COOKIE_NAME) && results) {
    const { title, body, field_notification_type, field_position, field_notification_title } =
      results?.data[0]?.attributes || {}

    if (body) {
      return field_position === 'header' ? (
        <StyledAlert
          dismissible
          heading={field_notification_title}
          compact
          level={field_notification_type || 'attention'}
          onDismiss={() => createCookie(COOKIE_NAME, '8')}
        >
          <Content dangerouslySetInnerHTML={{ __html: body.value }} />
        </StyledAlert>
      ) : (
        <InfoModal
          id="infoModal"
          {...{ open: !hide, title: field_notification_title ?? title, body: body.value }}
          closeModalAction={() => createCookie(COOKIE_NAME, '8')}
        />
      )
    }

    return null
  }

  return null
}

export default NotificationAlert
