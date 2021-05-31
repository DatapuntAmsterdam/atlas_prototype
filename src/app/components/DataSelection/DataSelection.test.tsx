import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { rest } from 'msw'
import DataSelection from './DataSelection'
import { DataSelectionProvider } from './DataSelectionContext'
import withAppContext from '../../utils/withAppContext'
import { routing } from '../../routes'
import { server } from '../../../../test/server'
import { singleFixture as bagFixture } from '../../../api/dataselectie/bag'
import joinUrl from '../../utils/joinUrl'
import environment from '../../../environment'

const pathname = routing.addresses.path
let search = '?modus=volledig'

const pushMock = jest.fn()
const replaceMock = jest.fn()

jest.mock('react-router-dom', () => ({
  // @ts-ignore
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: pushMock,
    replace: replaceMock,
  }),
  useLocation: () => ({
    pathname,
    search,
  }),
}))

const dataSelectionBagUrl = joinUrl([environment.API_ROOT, 'dataselectie/bag/'])

jest.mock('react-redux', () => ({
  // @ts-ignore
  ...jest.requireActual('react-redux'),
  useDispatch: jest.fn(() => jest.fn()),
}))

describe('DataSelection', () => {
  beforeEach(() => {
    server.use(rest.get(dataSelectionBagUrl, async (req, res, ctx) => res(ctx.json(bagFixture))))
  })
  describe('Table', () => {
    it('should render', async () => {
      render(
        withAppContext(
          <DataSelectionProvider>
            <DataSelection />
          </DataSelectionProvider>,
        ),
      )
      await waitFor(() => {
        const rows = screen.queryAllByTestId('dataSelectionTableRow').length
        expect(rows).toBe(2)
      })
    })

    it('should add a filter', async () => {
      render(
        withAppContext(
          <DataSelectionProvider>
            <DataSelection />
          </DataSelectionProvider>,
        ),
      )
      await waitFor(() => {
        const filter = screen
          .queryByTestId('dataSelectionAvailableFilters')
          ?.querySelectorAll('li')[0]
          .querySelector('button') as Element
        fireEvent.click(filter)

        expect(pushMock).toHaveBeenCalledWith({
          pathname: routing.addresses.path,
          search: 'filters=%7B%22woonplaats%22%3A%22Amsterdam%22%7D',
        })
      })
    })

    it('should remove a filter', async () => {
      search = 'filters=%7B%22woonplaats%22%3A%22Amsterdam%22%7D'
      render(
        withAppContext(
          <DataSelectionProvider>
            <DataSelection />
          </DataSelectionProvider>,
        ),
      )
      await waitFor(() => {
        const activeFilter = screen
          .queryByTestId('activeFilters')
          ?.querySelectorAll('li')[0]
          .querySelector('button') as Element
        fireEvent.click(activeFilter)

        expect(pushMock).toHaveBeenCalledWith({
          pathname: routing.addresses.path,
          search: '',
        })
      })
    })
  })

  describe('List', () => {
    it('should render', async () => {
      search = ''
      render(
        withAppContext(
          <DataSelectionProvider>
            <DataSelection />
          </DataSelectionProvider>,
        ),
      )
      await waitFor(() => {
        const rows = screen.queryByTestId('dataSelectionList')?.querySelectorAll('li').length
        expect(rows).toBe(2)
      })
    })
  })
})
