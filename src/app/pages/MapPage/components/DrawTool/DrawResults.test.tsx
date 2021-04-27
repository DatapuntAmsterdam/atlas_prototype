import { fireEvent, render } from '@testing-library/react'
import DrawResults from './DrawResults'
import { Overlay } from '../../types'
import withMapContext from '../../../../utils/withMapContext'
import { routing } from '../../../../routes'
import DataSelectionProvider from './DataSelectionProvider'

const pushMock = jest.fn()
jest.mock('react-router-dom', () => ({
  // @ts-ignore
  ...jest.requireActual('react-router-dom'),
  useLocation: () => ({
    pathname: routing.addresses.path,
    search:
      '?geo={"id": "should_be_removed", "polygon": [[123,321]]}&meten={"shouldAlsoBe": "removed"}&thisOne="should_not"',
  }),
  useHistory: () => ({
    push: pushMock,
  }),
}))

describe('DrawResults', () => {
  it('should navigate to geosearch page, removing the draw params, when closing the drawresults panel', async () => {
    const { findByTitle } = render(
      withMapContext(
        <DataSelectionProvider>
          <DrawResults currentOverlay={Overlay.Results} />
        </DataSelectionProvider>,
      ),
    )
    const button = await findByTitle('Sluit')

    expect(pushMock).not.toHaveBeenCalled()
    fireEvent.click(button)
    expect(pushMock).toHaveBeenCalledWith({
      pathname: routing.dataSearchGeo_TEMP.path,
      search: 'thisOne=%22should_not%22',
    })
  })
})
