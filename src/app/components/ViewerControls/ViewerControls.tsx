import { FunctionComponent, ReactNode } from 'react'

interface ViewerControlsProps {
  topLeftComponent?: ReactNode
  bottomLeftComponent?: ReactNode
  topRightComponent?: ReactNode
  bottomRightComponent?: ReactNode
  className?: string
  metaData?: string[]
}

const ViewerControls: FunctionComponent<ViewerControlsProps> = ({
  topLeftComponent,
  bottomLeftComponent,
  topRightComponent,
  bottomRightComponent,
  metaData,
  className,
}) => (
  <div className={`viewer-controls ${className ?? ''}`}>
    <div className="viewer-controls-item viewer-controls-item--top-left">{topLeftComponent}</div>
    <div className="viewer-controls-item viewer-controls-item--top-right">{topRightComponent}</div>
    <div className="viewer-controls-item viewer-controls-item--bottom-left">
      {bottomLeftComponent}
    </div>
    <div className="viewer-controls-item viewer-controls-item--bottom-right">
      {bottomRightComponent}
      {metaData && (
        <div className="viewer-controls__meta">
          {metaData.map(
            (string, i) =>
              string && (
                // eslint-disable-next-line react/no-array-index-key
                <div key={i} className="viewer-controls__meta__item">
                  <span>{string}</span>
                </div>
              ),
          )}
        </div>
      )}
    </div>
  </div>
)

ViewerControls.defaultProps = {
  topLeftComponent: null,
  bottomLeftComponent: null,
  topRightComponent: null,
  bottomRightComponent: null,
  className: '',
  metaData: [],
}

export default ViewerControls
