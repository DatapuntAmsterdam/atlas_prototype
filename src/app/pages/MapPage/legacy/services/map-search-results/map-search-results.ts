import categoryTypeOrder from '../map-search/category-type-order'
import type { MapSearchCategory } from '../map-search/map-search'

export const sortByCategoryTypeOrder = (items: MapSearchCategory[]) =>
  [...items].sort((a, b) => {
    const indexA = categoryTypeOrder.indexOf(a.type)
    const indexB = categoryTypeOrder.indexOf(b.type)
    return indexA - indexB
  })

export const filterNonPandMonuments = (results: MapSearchCategory[]) =>
  results.some((feature) => feature.type === 'bag/pand')
    ? results.filter((feature) => feature.type !== 'monumenten/monument')
    : results

const filterResultsByCategory = (items: MapSearchCategory[], label: string) =>
  filterNonPandMonuments(items).filter((item) => item.categoryLabel === label)

const getSubCategories = (items: MapSearchCategory[], type: MapSearchCategory['type']) =>
  items.filter((subCategory) => subCategory.parent === type)

export const createMapSearchResultsModel = (
  allResults: MapSearchCategory[],
  isSubCategory = false,
): MapSearchCategory[] =>
  sortByCategoryTypeOrder(filterNonPandMonuments(allResults)).reduce(
    (newList: MapSearchCategory[], currentValue: MapSearchCategory) => {
      const { categoryLabel, categoryLabelPlural, type, parent } = currentValue

      // if the category already exists or if the category has a parent
      // and isSubCategory is false return the newList
      if (
        newList.some((item) => item.categoryLabel === categoryLabel) ||
        (parent && !isSubCategory)
      ) {
        return newList
      }

      const subCategories = getSubCategories(allResults, type)

      let results = []
      // addresses should not be sorted
      if (categoryLabel === 'Adres') {
        results = filterResultsByCategory(allResults, categoryLabel)
      } else {
        results = sortByCategoryTypeOrder(filterResultsByCategory(allResults, categoryLabel))
      }

      return [
        ...newList,
        {
          categoryLabel,
          categoryLabelPlural,
          type,
          results,
          subCategories:
            subCategories && subCategories.length
              ? createMapSearchResultsModel(subCategories, true)
              : [],
        } as any,
      ]
    },
    [],
  )
