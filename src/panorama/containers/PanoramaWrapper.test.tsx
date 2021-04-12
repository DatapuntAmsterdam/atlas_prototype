import { render } from '@testing-library/react'
import PanoramaWrapper from './PanoramaWrapper'
import * as panoSelectors from '../ducks/selectors'
import { ForbiddenError } from '../../shared/services/api/customError'

describe('PanoramaWrapper', () => {
  it('should not render the PanoramaContainer when error is set', () => {
    const errorSelectorMock = jest
      .spyOn(panoSelectors, 'getPanoramaError')
      .mockReturnValue(new ForbiddenError(403, 'forbidden'))
    const { queryByTestId } = render(<PanoramaWrapper />)
    expect(errorSelectorMock).toHaveBeenCalledTimes(1)
    expect(queryByTestId('panoramaContainer')).toBeNull()
  })
})
