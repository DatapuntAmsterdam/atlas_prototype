import { render } from '@testing-library/react'
import DrawToolControl from './DrawToolControl'
import withMapContext from '../../../../utils/withMapContext'
import { DataSelectionProvider } from '../../../../components/DataSelection/DataSelectionContext'

jest.mock('../DrawTool/DrawTool', () => () => null)
const mockPush = jest.fn()
const search = ''
jest.mock('react-router-dom', () => ({
  // @ts-ignore
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: mockPush,
  }),
  useLocation: () => ({
    pathname: '/kaart/bag/foo/bar',
    search,
  }),
}))

describe('DrawToolControl', () => {
  it('renders the control', () => {
    const { container } = render(
      withMapContext(
        <DataSelectionProvider>
          <DrawToolControl />
        </DataSelectionProvider>,
      ),
    )

    expect(container.firstChild).toBeDefined()
  })
})
