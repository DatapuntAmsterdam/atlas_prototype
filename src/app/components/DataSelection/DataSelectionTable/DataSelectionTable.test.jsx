import { shallow } from 'enzyme'
import DataSelectionTable from './DataSelectionTable'
import { getDetailPageData } from '../../../../store/redux-first-router/actions'

jest.mock('react-router-dom', () => ({
  generatePath: jest.fn(),
  Link: jest.fn(),
}))
jest.mock('../../../../store/redux-first-router/actions')

describe('DataSelectionTable', () => {
  it('should render without failing', () => {
    getDetailPageData.mockReturnValue(['type', 'subtype', 'id'])
    const component = shallow(
      <DataSelectionTable
        content={{
          head: ['foo', 'bar'],
          body: [{ content: [], detailEndpoint: 'http://example.com/foo/bar/baz/' }],
        }}
      />,
    )

    expect(component).toMatchSnapshot()
  })
})
