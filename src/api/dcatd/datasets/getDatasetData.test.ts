import fetch from 'jest-fetch-mock'
import { singleFixture as datasetResponse } from './index'
import { singleFixture as openApi } from '../openapi'
import getDatasetData from './getDatasetData'

describe('getDatasetData', () => {
  beforeEach(() => {
    fetch.mockResponses(
      [JSON.stringify(datasetResponse), { status: 200 }], // /dcatd/datasets/123
      [JSON.stringify(openApi), { status: 200 }], // /dcatd/openapi
    )
  })
  it('should return data of dataset, filters and resources', async () => {
    const { dataset, filters, resources } = await getDatasetData('123')

    expect(dataset).toBeDefined()
    expect(filters).toBeDefined()
    expect(resources).toBeDefined()
  })

  it("should build the resources object from filters.resourceTypes and dataset['dcat:distribution']", async () => {
    const { resources } = await getDatasetData('123')
    expect(resources.length).toBe(2)
    expect(resources[0].type).toBe('data')
    expect(resources[0].rows[0]).toMatchObject({ 'ams:resourceType': 'data' })
  })
})
