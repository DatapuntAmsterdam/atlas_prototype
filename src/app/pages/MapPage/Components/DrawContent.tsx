import React, { useContext } from 'react'
import DataSelectionContext from '../DataSelectionContext'
import { Overlay } from '../types'
import DataSelectionMapVisualization from './DataSelectionMapVisualization'
import DataSelectionResults from './DataSelectionResults'

type Props = {
  showDrawTool: boolean
  currentOverlay: Overlay
  setShowDrawTool: (show: boolean) => void
}

const DrawContent: React.FC<Props> = ({ showDrawTool, currentOverlay, setShowDrawTool }) => {
  const { dataSelection, mapVisualizations: mapVisualization } = useContext(DataSelectionContext)

  return showDrawTool ? (
    <>
      {mapVisualization.length && <DataSelectionMapVisualization />}
      {dataSelection.length && <DataSelectionResults {...{ currentOverlay, setShowDrawTool }} />}
    </>
  ) : null
}

export default DrawContent
