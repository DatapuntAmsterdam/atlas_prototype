import { testSaga } from 'redux-saga-test-plan'
import { fetchMapSearchResultsFailure } from '../../ducks/data-search/actions'
import { fetchMapSearchResults } from './data-search'

import ActiveOverlaysClass from '../../services/active-overlays/active-overlays'

jest.mock('../../services/active-overlays/active-overlays')

describe('fetchMapSearchResults', () => {
  beforeEach(() => {
    ActiveOverlaysClass.getOverlaysWarning.mockReturnValueOnce('')
  })

  it('should throw error and put error', () => {
    const error = new Error('My Error')
    testSaga(fetchMapSearchResults, {})
      .next()
      .next()
      .next()
      .next()
      .next()
      .throw(error)
      .put(fetchMapSearchResultsFailure(''))
      .next()
      .isDone()
  })
})
