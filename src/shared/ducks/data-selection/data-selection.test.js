import reducer from './reducer'
import * as actionCreators from './actions'

describe('Data Selection Reducer', () => {
  /**
   * Use this helper to build an object that we can iterate the tests with.
   * @param actionCreatorName, this should be the name of the actionCreator function,
   * derived from the actionCreators you imported. use actionCreators[actionCreator].name to bind
   * the actionCreator to it's function name
   * @param expectedKeysToChange, used to pass the initial reducer state to test
   * @param [payload]: this must be an array, as action creators could accept more arguments.
   * @param [initialState], used to pass the initial reducer state to test, eg. if we conditionally
   * change a value of a state in the reducer.
   * @returns {{}}
   */
  const getExpectations = (
    actionCreatorName,
    expectedKeysToChange,
    payload = [],
    initialState = {},
  ) => ({
    [actionCreatorName]: {
      expectedKeysToChange,
      payload,
      initialState,
    },
  })

  // Create the expectations what the actions would do here
  const expectations = {
    ...getExpectations(actionCreators.setPage.name, ['page'], [1]),
    ...getExpectations(actionCreators.fetchMarkersRequest.name, ['loadingMarkers'], []),
    ...getExpectations(
      actionCreators.fetchMarkersSuccess.name,
      ['loadingMarkers', 'markers'],
      ['foobar'],
    ),
    ...getExpectations(
      actionCreators.fetchMarkersFailure.name,
      ['loadingMarkers', 'errorMessage', 'result', 'markers'],
      ['error'],
    ),
    ...getExpectations(
      actionCreators.setGeometryFilter.name,
      ['geometryFilter'],
      [[{ filter: 'foo' }]],
    ),
    ...getExpectations(actionCreators.removeGeometryFilter.name, ['geometryFilter', 'markers']),
    ...getExpectations(actionCreators.startDrawing.name, ['']),
    ...getExpectations(actionCreators.endDataSelection.name, ['']),
    ...getExpectations(actionCreators.cancelDrawing.name, ['']),
    ...getExpectations(actionCreators.resetDrawing.name, ['shape']),
  }

  Object.keys(actionCreators).forEach((actionCreator) => {
    const { payload, expectedKeysToChange, initialState = {} } = expectations[actionCreator]
    it(`should set ${expectedKeysToChange.join(
      ', ',
    )} state when dispatching ${actionCreator}`, () => {
      const action = actionCreators[actionCreator](...payload)
      const result = reducer(initialState, action)

      // Check if every key is changed, not more or less than the expected keys to change
      expect(expectedKeysToChange.sort().toString()).toEqual(Object.keys(result).sort().toString())
    })
  })
})
