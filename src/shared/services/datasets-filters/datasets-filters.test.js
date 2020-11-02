import getDatasetFilters from './datasets-filters'
import mockApiData from './datasets-filters.mock'

describe('fetchApiSpecification', () => {
  const state = {
    user: {
      accessToken: '',
    },
  }
  global.reduxStore = {
    getState: () => state,
  }

  it('should return the correct data', async () => {
    fetch.mockResponseOnce(JSON.stringify(mockApiData))
    const result = await getDatasetFilters()
    expect(result).toMatchSnapshot()
  })
})
