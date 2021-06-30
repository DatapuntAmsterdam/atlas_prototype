import styled from 'styled-components'
import type { FunctionComponent } from 'react'
import { themeSpacing } from '@amsterdam/asc-ui'
import ViewerInfoBar from '../../../../components/ViewerInfoBar/ViewerInfoBar'
import useParam from '../../../../utils/useParam'
import { locationParam } from '../../query-params'
import Control from '../Control'
import { useMapContext } from '../../MapContext'

const StyledControl = styled(Control)`
  order: 2;
  align-self: flex-end;
  transform: translateY(-${themeSpacing(10)});
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
