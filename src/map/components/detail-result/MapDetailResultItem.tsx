import React from 'react'
import { DetailResultItemDefault } from '../../types/details'

export interface MapDetailResultItemProps {
  item: DetailResultItemDefault
}

const MapDetailResultItem: React.FC<MapDetailResultItemProps> = ({ item }) => {
  return item.value ? (
    <li className="map-detail-result__item">
      <section className="map-detail-result__item-content">
        <div className="map-detail-result__item-label">{item.label}</div>
        <div
          className={`map-detail-result__item-value${
            item.multiLine ? '--multiline' : ''
          }           ${
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
              {item.value}
            </a>
          ) : (
            item.value
          )}
        </div>
      </section>
    </li>
  ) : null
}

export default MapDetailResultItem
