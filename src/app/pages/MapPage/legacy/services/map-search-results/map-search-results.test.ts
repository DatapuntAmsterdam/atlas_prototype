import { createMapSearchResultsModel, sortByCategoryTypeOrder } from './map-search-results'
import { basicDataModel, basicSortDataModel, expectedDataModel } from './map-search-results.fixture'

describe('Map search results', () => {
  describe('sortByCategoryTypeOrder', () => {
    it('should order the items correctly', () => {
      const items = sortByCategoryTypeOrder(basicSortDataModel)
      const calculatedOrder = items.reduce(
        (accumulator: number[], newValue) => [
          ...accumulator,
          basicSortDataModel.findIndex((item) => item.type === newValue.type),
        ],
        [],
      )
      expect(calculatedOrder).toEqual([2, 0, 1])
    })
  })

  describe('createMapSearchResultsModel', () => {
    it('should return a empty array', () => {
      expect(createMapSearchResultsModel([])).toEqual([])
    })

    it('should generate the desired datamodel', () => {
      expect(createMapSearchResultsModel(basicDataModel)).toEqual(expectedDataModel)
    })
  })
})
