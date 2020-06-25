import React from 'react'
import formatDate from '../../../shared/services/date-formatter/date-formatter'
import { DetailResultItemDefault } from '../../types/details'

export interface MapDetailResultItemProps {
  item: DetailResultItemDefault
}

const MapDetailResultItem: React.FC<MapDetailResultItemProps> = ({ item }) => {
  const value = item.value instanceof Date ? formatDate(item.value) : item.value

  return value ? (
    <li className="map-detail-result__item">
      <section className="map-detail-result__item-content">
        <div className="map-detail-result__item-label">{item.label}</div>
        <div
          className={`map-detail-result__item-value ${
            item.status && item.status.length > 0
              ? `map-detail-result__item-value--${item.status}`
              : ''
          }`}
        >
          {item.link ? (
            <a
              className="o-btn o-btn--link map-detail-result__item-value--inline"
              href={item.link}
              rel="noopener noreferrer"
              target="_blank"
            >
              {value}
            </a>
          ) : (
            value
          )}
        </div>
      </section>
    </li>
  ) : null
}

export default MapDetailResultItem
