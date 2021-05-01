import { screen, render } from '@testing-library/react'
import DrawToolControl from './DrawToolControl'
import { drawToolOpenParam } from '../../query-params'
import withMapContext from '../../../../utils/withMapContext'
import { DataSelectionProvider } from '../../../../components/DataSelection/DataSelectionContext'

const mockPush = jest.fn()
let search = ''
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
    const { container } = render(withMapContext(<DrawToolControl />))

    expect(screen.getByTestId('drawtoolOpenButton')).toBeInTheDocument()
    expect(container.firstChild).toBeDefined()
  })

  it('renders the DrawTool when url contains the drawtoolOpen parameter', () => {
    search = `${drawToolOpenParam.name}=true`
    render(
      withMapContext(
        <DataSelectionProvider>
          <DrawToolControl />
        </DataSelectionProvider>,
      ),
    )

    expect(screen.getByTestId('drawTool')).toBeInTheDocument()
  })
})
