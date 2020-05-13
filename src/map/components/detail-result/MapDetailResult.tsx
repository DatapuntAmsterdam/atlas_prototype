import React, { Fragment } from 'react'
import Notification from '../../../shared/components/notification/Notification'
import {
  DetailResult,
  DetailResultItem,
  DetailResultItemDefault,
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
          <Notification
            key={notification.value}
            canClose={notification.canClose}
            level={notification.level}
          >
            {notification.value}
          </Notification>
        )
      })}

      <ul className="map-detail-result__list">
        {result.items.map((item, index) => renderItem(item, index))}
      </ul>
    </MapDetailResultWrapper>
  )
}

function renderItem(item: DetailResultItem, index: number) {
  switch (item.type) {
    case DetailResultItemType.Default:
      return renderDefaultItem(item)
    case DetailResultItemType.Table:
      return renderTableItem(item, index)
    default:
      throw new Error('Unable to render map detail pane, encountered unknown item type.')
  }
}

function renderDefaultItem(item: DetailResultItemDefault) {
  const { value } = item

  // TODO: This should be changed so that items without values are never added in the first place.
  // Skip items that have empty values.
  if (value === undefined || value === null || value === false) {
    return null
  }

  if (Array.isArray(value)) {
    return (
      <Fragment key={item.label}>
        <h4 className="map-detail-result__category-title">{item.label}</h4>
        {value.map((subItem) => renderDefaultItem(subItem))}
      </Fragment>
    )
  }

  return <MapDetailResultItem key={item.label} item={item} />
}

function renderTableItem(item: DetailResultItemTable, index: number) {
  return <MapDetailResultItemTable key={index} item={item} />
}

export default MapDetailResult
