import React from 'react'
import PropTypes from 'prop-types'

import MapDetailResultItem from './MapDetailResultItem'
import MapDetailResultWrapper from './MapDetailResultWrapper'
import Notification from '../../../shared/components/notification/Notification'

const MapDetailResult = ({ panoUrl, result, onMaximize, onPanoPreviewClick }) => (
  <MapDetailResultWrapper
    panoUrl={panoUrl}
    onMaximize={onMaximize}
    onPanoPreviewClick={onPanoPreviewClick}
    subTitle={result.subTitle}
    title={result.title}
  >
    <>
      {result.notifications &&
        result.notifications.length &&
        result.notifications.map(
          (notification, index) =>
            notification.value && (
              <Notification
                // eslint-disable-next-line react/no-array-index-key
                key={index}
                canClose={!!notification.canClose}
                level={notification.level}
              >
                {notification.value}
              </Notification>
            ),
        )}

      <ul className="map-detail-result__list">
        {result.items.length > 0 &&
          result.items.map((item, index) =>
            item.value && Array.isArray(item.value) ? (
              <React.Fragment key={item.label}>
                <h4 className="map-detail-result__category-title">{item.label}</h4>
                {item.value.map((subItem, subIndex) => (
                  <MapDetailResultItem
                    // eslint-disable-next-line react/no-array-index-key
                    key={subIndex}
                    hasMultiline={!!subItem.multiLine}
                    link={subItem.link ? subItem.link : false}
                    label={subItem.label}
                    value={subItem.value}
                    status={subItem.status}
                  />
                ))}
              </React.Fragment>
            ) : (
              item.value && (
                <MapDetailResultItem
                  // eslint-disable-next-line react/no-array-index-key
                  key={index}
                  hasMultiline={!!item.multiLine}
                  link={item.link ? item.link : false}
                  label={item.label}
                  value={item.value}
                  status={item.status}
                />
              )
            ),
          )}
      </ul>
    </>
  </MapDetailResultWrapper>
)

MapDetailResult.defaultProps = {
  panoUrl: '',
}

MapDetailResult.propTypes = {
  panoUrl: PropTypes.string,
  result: PropTypes.shape({
    title: PropTypes.string,
    subTitle: PropTypes.string,
    items: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
  onMaximize: PropTypes.func.isRequired,
  onPanoPreviewClick: PropTypes.func.isRequired,
}

export default MapDetailResult
