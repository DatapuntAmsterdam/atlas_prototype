import { FunctionComponent, ReactNode } from 'react'
import styled, { css } from 'styled-components'

const ViewerControlsContainer = styled.div`
  bottom: 0;
  left: 0;
  pointer-events: none;
  position: absolute;
  right: 0;
  top: 0;
`

const CONTROL_OFFSET = 10

const ViewerControlsItem = styled.div<{
  $topLeft?: boolean
  $topRight?: boolean
  $bottomRight?: boolean
  $bottomLeft?: boolean
}>`
  align-items: flex-end;
  display: flex;
  flex-direction: column;
  pointer-events: all;
  position: absolute;

  // These styles are temporary, until we move to the new amsterdam style
  & > button,
  & > div > button {
    border: 1px solid #ccc;
    box-shadow: 2px 2px 0 0 #999;

    & + button {
      margin-top: 2px;
    }
  }

  & > * + * {
    margin-top: ${CONTROL_OFFSET}px;
  }

  ${({ $topLeft, $topRight, $bottomRight, $bottomLeft }) => {
    if ($topLeft) {
      return css`
        left: ${CONTROL_OFFSET}px;
        top: ${CONTROL_OFFSET}px;
      `
    }

    if ($topRight) {
      return css`
        right: ${CONTROL_OFFSET}px;
        top: ${CONTROL_OFFSET}px;
      `
    }

    if ($bottomRight) {
      return css`
        bottom: ${CONTROL_OFFSET}px;
        padding-right: ${CONTROL_OFFSET}px;
        right: 0;
      `
    }

    if ($bottomLeft) {
      return css`
        bottom: ${CONTROL_OFFSET}px;
        left: ${CONTROL_OFFSET}px;
      `
    }
  }}
`

const ViewerControlsMeta = styled.div`
  align-items: center;
  box-shadow: 0 2px 0 0 #999;
  display: flex;
  flex-direction: row;
  margin-right: ${CONTROL_OFFSET * -0.5}px;
  max-width: 70vw;
  overflow: hidden;
  width: 100%;
`

const ViewerControlsMetaItem = styled.div`
  align-items: center;
  background-color: rgba(255, 255, 255, 0.67);
  display: flex;
  flex-grow: 1;
  height: 32px;
  max-width: 70vw;
  padding: 0 10px;

  & + & {
    margin-left: 1px;
  }

  & > span {
    display: block;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`

export interface ViewerControlsProps {
  topLeftComponent?: ReactNode
  bottomLeftComponent?: ReactNode
  topRightComponent?: ReactNode
  bottomRightComponent?: ReactNode
  metaData?: string[]
}

const ViewerControls: FunctionComponent<ViewerControlsProps> = ({
  topLeftComponent,
  bottomLeftComponent,
  topRightComponent,
  bottomRightComponent,
  metaData,
  ...otherProps
}) => (
  <ViewerControlsContainer {...otherProps}>
    <ViewerControlsItem $topLeft>{topLeftComponent}</ViewerControlsItem>
    <ViewerControlsItem $topRight>{topRightComponent}</ViewerControlsItem>
    <ViewerControlsItem $bottomLeft>{bottomLeftComponent}</ViewerControlsItem>
    <ViewerControlsItem $bottomRight>
      {bottomRightComponent}
      {metaData && (
        <ViewerControlsMeta>
          {metaData.map((name) => (
            <ViewerControlsMetaItem key={name}>
              <span>{name}</span>
            </ViewerControlsMetaItem>
          ))}
        </ViewerControlsMeta>
      )}
    </ViewerControlsItem>
  </ViewerControlsContainer>
)

export default ViewerControls
