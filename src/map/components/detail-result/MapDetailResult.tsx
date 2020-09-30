import { Alert, Heading, Link, themeColor } from '@amsterdam/asc-ui'
import React, { Fragment, useMemo } from 'react'
import styled from 'styled-components'
import { v4 as uuid } from 'uuid'
import {
  DetailResult,
  DetailResultItem,
  DetailResultItemDefault,
  DetailResultItemDefinitionList,
  DetailResultItemHeading,
  DetailResultItemTable,
  DetailResultItemType,
} from '../../types/details'
import MapDetailResultItem from './MapDetailResultItem'
import MapDetailResultItemTable from './MapDetailResultItemTable'
import MapDetailResultWrapper from './MapDetailResultWrapper'

export interface MapDetailResultProps {
  panoUrl?: string
  result: DetailResult
  onMaximize: () => void
  onPanoPreviewClick: () => void
}

const MapDetailResult: React.FC<MapDetailResultProps> = ({
  panoUrl,
  result,
  onMaximize,
  onPanoPreviewClick,
}) => {
  return (
    <MapDetailResultWrapper
      panoUrl={panoUrl}
      subTitle={result.subTitle}
      title={result.title}
      onMaximize={onMaximize}
      onPanoPreviewClick={onPanoPreviewClick}
    >
      {result.notifications?.map((notification) => {
        // TODO: This should be refactored so that a notification always has a string value.
        if (typeof notification.value === 'boolean') {
          return null
        }

        return (
          <Alert
            key={notification.value}
            dismissible={notification.canClose}
            level={notification.level}
          >
            {notification.value}
          </Alert>
        )
      })}

      <ul className="map-detail-result__list">
        {result.items?.map((item, index) => renderItem(item, index))}
      </ul>
    </MapDetailResultWrapper>
  )
}

function renderItem(item: DetailResultItem, index: number) {
  switch (item.type) {
    case DetailResultItemType.Default:
      return renderDefaultItem(item)
    case DetailResultItemType.DefinitionList:
      return renderDefinitionListItem(item, index)
    case DetailResultItemType.Table:
      return renderTableItem(item, index)
    case DetailResultItemType.Heading:
      return renderHeadingItem(item, index)
    default:
      // Don't throw error if component doesn't exist
      return null
  }
}

function renderDefaultItem(item: DetailResultItemDefault) {
  const { value, title } = item
  const uid = useMemo(() => uuid(), [])

  // TODO: This should be changed so that items without values are never added in the first place.
  // Skip items that have empty values.
  if (value === undefined || value === null || value === false) {
    return null
  }

  if (Array.isArray(value)) {
    return (
      <Fragment key={uid}>
        <h4 className="map-detail-result__category-title">{title}</h4>
        {value.map((subItem) => renderDefaultItem(subItem))}
      </Fragment>
    )
  }

  return <MapDetailResultItem key={uid} item={item} />
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
      {item.entries.map((entry) => (
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

const StyledHeading = styled(Heading)`
  margin: 0;
  color: ${themeColor('secondary')};
`

function renderHeadingItem(item: DetailResultItemHeading, index: number) {
  return (
    <li key={index} className="map-detail-result__item">
      <StyledHeading forwardedAs="h3">{item.title}</StyledHeading>
    </li>
  )
}

export default MapDetailResult
