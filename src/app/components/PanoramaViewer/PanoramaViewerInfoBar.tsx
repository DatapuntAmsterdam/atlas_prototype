import styled from 'styled-components'
import { FunctionComponent } from 'react'
import ViewerInfoBar from '../ViewerInfoBar/ViewerInfoBar'
import useParam from '../../utils/useParam'
import { locationParam } from '../../pages/MapPage/query-params'
import Control from '../../pages/MapPage/components/Control'
import { useMapContext } from '../../pages/MapPage/MapContext'

const StyledControl = styled(Control)`
  order: 2;
  align-self: flex-end;
  transform: translateY(-100%);
`

const PanoramaViewerInfoBar: FunctionComponent = () => {
  const [location] = useParam(locationParam)
  const { panoImageDate } = useMapContext()
  return location && panoImageDate ? (
    <StyledControl>
      <ViewerInfoBar date={panoImageDate} location={location} />
    </StyledControl>
  ) : null
}

export default PanoramaViewerInfoBar
