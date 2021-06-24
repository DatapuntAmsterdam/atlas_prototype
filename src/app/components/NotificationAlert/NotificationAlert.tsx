import { Alert } from '@amsterdam/asc-ui'
import usePromise, { isFulfilled } from '@amsterdam/use-promise'
import type { FunctionComponent } from 'react'
import styled from 'styled-components'
import type { AttributesObject, CollectionResourceDoc } from '../../../api/cms'
import environment from '../../../environment'
import { fetchWithoutToken } from '../../../shared/services/api/api'
import { createCookie, getCookie } from '../../../shared/services/cookie/cookie'
import { useIsEmbedded } from '../../contexts/ui'
import joinUrl from '../../utils/joinUrl'
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

export type PathAttributes = AttributesObject<{
  alias: string
  pid: null
  langcode: string
}>

export type BodyAttributes = AttributesObject<{
  value: string
  format: string
  processed: string
  summary: string
}>

export type NotificationAttributes = AttributesObject<{
  drupal_internal__nid: number
  drupal_internal__vid: number
  langcode: string
  revision_timestamp: string
  revision_log: null
  status: boolean
  title: string
  created: string
  changed: string
  promote: boolean
  sticky: boolean
  default_langcode: boolean
  revision_translation_affected: boolean
  path: PathAttributes
  body: BodyAttributes
  field_active: boolean
  field_notification_title: string
  field_notification_type: 'error' | 'info' | 'neutral' | 'warning'
  field_position: string
}>

const NotificationAlert: FunctionComponent = () => {
  const isEmbedded = useIsEmbedded()
  const result = usePromise((signal) => {
    const url = new URL(joinUrl([environment.CMS_ROOT, 'jsonapi/node/notification']))

    url.searchParams.set('filter[field_active]', '1')
    url.searchParams.set('page[limit]', '1')

    return fetchWithoutToken<CollectionResourceDoc<'node--notification', NotificationAttributes>>(
      url.toString(),
      { signal },
    )
  }, [])

  if (!isFulfilled(result) || isEmbedded || getCookie(COOKIE_NAME)) {
    return null
  }

  const attributes = result.value.data[0]?.attributes

  if (!attributes) {
    return null
  }

  return attributes.field_position === 'header' ? (
    <StyledAlert
      dismissible
      heading={attributes.field_notification_title}
      level={attributes.field_notification_type || 'info'}
      onDismiss={() => createCookie(COOKIE_NAME, '8')}
    >
      <Content dangerouslySetInnerHTML={{ __html: attributes.body.value }} />
    </StyledAlert>
  ) : (
    <InfoModal
      open={!isEmbedded}
      title={attributes.field_notification_title ?? attributes.title}
      body={attributes.body.value}
      handleClose={() => createCookie(COOKIE_NAME, '8')}
    />
  )
}

export default NotificationAlert
