import React, { useContext } from 'react'
import DataSelectionMapVisualization from './DataSelectionMapVisualization'
import DataSelectionResults from './DataSelectionResults'
import DataSelectionContext from '../DataSelectionContext'
import { Overlay } from '../types'

type Props = {
  showDrawTool: boolean
  currentOverlay: Overlay
  setShowDrawTool: () => void
}

const DrawContent: React.FC<Props> = ({ showDrawTool, currentOverlay, setShowDrawTool }) => {
  const { dataSelection, mapVisualization } = useContext(DataSelectionContext)

  return (
    showDrawTool && (
      <>
        {mapVisualization.length && <DataSelectionMapVisualization />}
        {dataSelection.length && <DataSelectionResults {...{ currentOverlay, setShowDrawTool }} />}
      </>
    )
  )
}

export default DrawContent
