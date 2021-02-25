import { getMetadata } from './getMetadata'
import { singleFixture } from '.'

describe('getMetadata', () => {
  it('makes a request and returns the response', async () => {
    const response = await getMetadata()

    expect(response).toEqual(singleFixture)
  })
})
