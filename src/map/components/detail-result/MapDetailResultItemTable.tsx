import { Divider } from '@amsterdam/asc-ui'
import React, { Fragment } from 'react'
import { DetailResultItemTable } from '../../types/details'

export interface MapDetailResultItemTableProps {
  item: DetailResultItemTable
}

const MapDetailResultItemTable: React.FC<MapDetailResultItemTableProps> = ({ item }) => (
  <>
    {item.values.map((value, index) => (
      // eslint-disable-next-line react/no-array-index-key
      <Fragment key={index}>
        <Divider />
        <ul className="map-detail-result__list">
          {item.headings
            .filter((heading) => !!value[heading.key])
            .map((heading) => {
              return (
                <li className="map-detail-result__item">
                  <section className="map-detail-result__item-content">
                    <div className="map-detail-result__item-label">{heading.title}</div>
                    <div className="map-detail-result__item-value">{value[heading.key]}</div>
                  </section>
                </li>
              )
            })}
        </ul>
      </Fragment>
    ))}
  </>
)

export default MapDetailResultItemTable
