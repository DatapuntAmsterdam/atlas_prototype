import { shallow } from 'enzyme'
import React from 'react'
import configureMockStore from 'redux-mock-store'
import { DATASETS } from '../../../shared/ducks/data-selection/constants'
import { VIEW_MODE } from '../../../shared/ducks/ui/ui'
import DataSelection from './DataSelection'
import DataSelectionContainer from './DataSelectionContainer'

const initialState = {
  filter: { filters: {} },
  user: {
    scopes: [],
  },
  ui: {
    viewMode: VIEW_MODE.SPLIT,
  },
  dataSelection: {
    isLoading: false,
    markers: [],
    geometryFilter: {
      markers: [],
    },
    dataset: DATASETS.BAG,
    authError: false,
    errorMessage: '',
    page: 1,
    results: {
      numberOfRecords: 10,
      data: {},
    },
  },
}

describe('DataSelection', () => {
  const setup = (overrides) =>
    shallow(
      <DataSelection
        view={VIEW_MODE.FULL}
        user={{}}
        isLoading={false}
        setPage={jest.fn}
        page={1}
        activeFilters={{}}
        geometryFilter={{}}
        authError={false}
        dataset={DATASETS.BAG}
        userScopes={[]}
        results={{
          numberOfRecords: 10,
          data: {},
        }}
        {...overrides}
      />,
    )

  it('should render the container', () => {
    const store = configureMockStore()({ ...initialState })
    const component = shallow(<DataSelectionContainer store={store} />)
      .dive()
      .dive()
    expect(component).toMatchSnapshot()
  })

  it(`should render as ${VIEW_MODE.FULL}`, () => {
    const component = setup({ view: VIEW_MODE.FULL })
    expect(component).toMatchSnapshot()
  })

  it(`should render as ${VIEW_MODE.SPLIT}`, () => {
    const component = setup({ view: VIEW_MODE.SPLIT })
    expect(component).toMatchSnapshot()
  })

  it('should render the loading state', () => {
    const component = setup({ isLoading: true })
    expect(component).toMatchSnapshot()
  })

  it('should show authorization message if user has no permission', () => {
    const component = setup({ authError: true })
    expect(component).toMatchSnapshot()
  })
})
