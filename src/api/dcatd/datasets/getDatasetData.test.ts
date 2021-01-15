import getDatasetData from './getDatasetData'

describe('getDatasetData', () => {
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
