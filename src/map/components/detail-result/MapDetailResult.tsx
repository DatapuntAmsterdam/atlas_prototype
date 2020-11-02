import { Alert, Heading, Link } from '@amsterdam/asc-ui'
import React from 'react'
import styled from 'styled-components'
import { LocationDescriptor } from 'history'
import { Link as RouterLink, useParams } from 'react-router-dom'
import {
  DetailInfo,
  DetailResultItem,
  DetailResultItemDefinitionList,
  DetailResultItemTable,
  DetailResultItemType,
} from '../../types/details'
import MapDetailResultItemTable from './MapDetailResultItemTable'
import MapDetailResultWrapper from './MapDetailResultWrapper'
import useDataDetail from '../../../app/pages/DataDetailPage/useDataDetail'
import { MapDetails } from '../../services/map'
import PromiseResult from '../../../app/components/PromiseResult/PromiseResult'

export interface MapDetailResultProps {
  onMaximize: () => void
}

// Todo: AfterBeta can be removed
const MapDetailResult: React.FC<MapDetailResultProps> = ({ onMaximize }) => {
  const { id: rawId, subtype: subType, type } = useParams<DetailInfo & { subtype: string }>()
  if (!rawId || !subType || !type) {
    return null
  }
  const id = rawId.includes('id') ? rawId.substr(2) : rawId

  // Todo: need to trigger this to dispatch certain redux actions (Legacy)
  const { result: promise } = useDataDetail<MapDetails>(id, subType, type)
  return (
    <PromiseResult promise={promise}>
      {({ value }) => (
        <MapDetailResultWrapper
          location={value.location}
          subTitle={value?.data?.subTitle}
          title={value?.data?.title}
          onMaximize={onMaximize}
        >
          {value?.data?.notifications
            ?.filter(({ value: val }: any) => val)
            ?.map((notification: any) => (
              <Alert
                key={notification.id}
                dismissible={notification.canClose}
                level={notification.level}
              >
                {notification.value}
              </Alert>
            ))}

          <ul className="map-detail-result__list">
            {value.data?.items?.map((item: any, index: number) => renderItem(item, index))}
          </ul>
        </MapDetailResultWrapper>
      )}
    </PromiseResult>
  )
}

function renderItem(item: DetailResultItem, index: number) {
  switch (item?.type) {
    case DetailResultItemType.DefinitionList:
      return renderDefinitionListItem(item, index)
    case DetailResultItemType.Table:
      return renderTableItem(item, index)
    default:
      // Don't throw error if component doesn't exist
      return null
  }
}

const DefinitionListHeading = styled(Heading)`
  margin: 0;
`

function renderDefinitionListItem(item: DetailResultItemDefinitionList, index: number) {
  return (
    <>
      {item.title && (
        <li key={index} className="map-detail-result__item">
          <DefinitionListHeading forwardedAs="h4">{item.title}</DefinitionListHeading>
        </li>
      )}
      {item.entries
        ?.filter(({ description }) => description)
        .map((entry) => (
          <li key={entry.term + entry.description} className="map-detail-result__item">
            <section className="map-detail-result__item-content">
              <div className="map-detail-result__item-label">{entry.term}</div>
              <div className="map-detail-result__item-value">
                {renderDescription(entry.description, entry.href, entry.to)}
              </div>
            </section>
          </li>
        ))}
    </>
  )
}

function renderDescription(
  description?: string | null,
  href?: LocationDescriptor | null,
  to?: string | { pathname: string; search?: string },
) {
  if (href) {
    return (
      <Link href={href} inList>
        {description}
      </Link>
    )
  }

  if (to) {
    return (
      <Link as={RouterLink} to={to} href={href} inList>
        {description}
      </Link>
    )
  }

  return description
}

function renderTableItem(item: DetailResultItemTable, index: number) {
  return <MapDetailResultItemTable key={index} item={item} />
}

export default MapDetailResult
