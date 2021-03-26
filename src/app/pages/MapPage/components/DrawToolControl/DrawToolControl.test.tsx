import { render } from '@testing-library/react'
import DrawToolControl from './DrawToolControl'
import { drawToolOpenParam } from '../../query-params'
import withMapContext from '../../../../utils/withMapContext'

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
    const { container, getByTestId } = render(withMapContext(<DrawToolControl />))

    expect(getByTestId('drawtoolOpenButton')).toBeDefined()
    expect(container.firstChild).toBeDefined()
  })

  it('renders the DrawTool when url contains the drawtoolOpen parameter', () => {
    search = `${drawToolOpenParam.name}=true`
    const { getByTestId } = render(withMapContext(<DrawToolControl />))

    expect(getByTestId('drawTool')).toBeDefined()
  })
})
