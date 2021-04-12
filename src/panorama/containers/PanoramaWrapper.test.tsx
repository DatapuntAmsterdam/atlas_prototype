import { render } from '@testing-library/react'
import * as reactRedux from 'react-redux'
import PanoramaWrapper from './PanoramaWrapper'
import { ForbiddenError } from '../../shared/services/api/customError'
import withAppContext from '../../app/utils/withAppContext'

jest.mock('react-redux', () => ({
  // @ts-ignore
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
}))

describe('PanoramaWrapper', () => {
  it('should not render the PanoramaContainer when error is set', () => {
    const errorSelectorMock = jest
      .spyOn(reactRedux, 'useSelector')
      .mockImplementation(() => new ForbiddenError(403, 'forbidden'))
    const { queryByTestId } = render(withAppContext(<PanoramaWrapper />))
    expect(errorSelectorMock).toHaveBeenCalledTimes(1)
    expect(queryByTestId('panoramaContainer')).toBeNull()
  })
})
