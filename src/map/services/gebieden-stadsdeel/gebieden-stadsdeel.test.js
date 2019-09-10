import { getByUrl } from '../../../shared/services/api/api'

import normalize from './gebieden-stadsdeel'

jest.mock('../../../shared/services/api/api')

describe('gebieden-stadsdelen', () => {
  let result

  const grexResult = {
    field: 'grex',
  }

  it('should return the API result', async () => {
    getByUrl.mockImplementationOnce(() => {
      throw new Error('not authorized')
    })

    result = {
      code: 123,
    }

    const response = await normalize(result)

    expect(response).toEqual(result)
  })

  it('should return the API result with the grex data', async () => {
    getByUrl.mockImplementationOnce(() => grexResult)

    result = {
      code: 123,
    }

    const response = await normalize(result)

    expect(getByUrl).toHaveBeenCalled()

    expect(response).toEqual({
      ...result,
      ...grexResult,
    })
  })
})
