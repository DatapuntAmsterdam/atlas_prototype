import { Alert, Heading, Link } from '@amsterdam/asc-ui'
import React from 'react'
import styled from 'styled-components'
import { useParams } from 'react-router-dom'
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

export interface MapDetailResultProps {
  panoUrl?: string
  result: MapDetails
  onMaximize: () => void
  onPanoPreviewClick: () => void
}

// Todo: AfterBeta can be removed
const MapDetailResult: React.FC<MapDetailResultProps> = ({
  panoUrl,
  result,
  onMaximize,
  onPanoPreviewClick,
}) => {
  const { id: rawId, subtype: subType, type } = useParams<DetailInfo & { subtype: string }>()
  const id = rawId.includes('id') ? rawId.substr(2) : rawId

  // Todo: need to trigger this to dispatch certain redux actions (Legacy)
  useDataDetail(id, subType, type)
  return result ? (
    <MapDetailResultWrapper
      panoUrl={panoUrl}
      subTitle={result?.data?.subTitle}
      title={result?.data?.title}
      onMaximize={onMaximize}
      onPanoPreviewClick={onPanoPreviewClick}
    >
      {result?.data?.notifications
        ?.filter(({ value }) => value)
        ?.map((notification) => (
          <Alert
            key={notification.id}
            dismissible={notification.canClose}
            level={notification.level}
          >
            {notification.value}
          </Alert>
        ))}

      <ul className="map-detail-result__list">
        {result?.data?.items?.map((item, index) => renderItem(item, index))}
      </ul>
    </MapDetailResultWrapper>
  ) : null
}

function renderItem(item: DetailResultItem, index: number) {
  switch (item.type) {
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
                {entry.link ? (
                  <Link href={entry.link} inList target="_blank">
                    {entry.description}
                  </Link>
                ) : (
                  entry.description
                )}
              </div>
            </section>
          </li>
        ))}
    </>
  )
}

function renderTableItem(item: DetailResultItemTable, index: number) {
  return <MapDetailResultItemTable key={index} item={item} />
}

export default MapDetailResult
