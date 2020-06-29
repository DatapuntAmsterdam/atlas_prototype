import { cleanup, fireEvent, render } from '@testing-library/react'
import * as React from 'react'
import SearchBarFilter from './SearchBarFilter'
import { CmsType } from '../../../shared/config/cms.config'

const ARTICLE = 'article' as typeof CmsType.Article
const COLLECTION = 'collection' as typeof CmsType.Collection

jest.mock('../../pages/SearchPage/config', () => ({
  article: {
    label: 'Article label',
    type: 'article',
  },
  collection: {
    label: 'Collection label',
    type: 'collection',
  },
}))

describe('SearchFilter', () => {
  beforeEach(cleanup)

  const mockOnChange = jest.fn()

  it('should render a select with the filter options', () => {
    const { getAllByText } = render(
      <SearchBarFilter searchCategory={COLLECTION} setSearchCategory={mockOnChange} />,
    )

    const selectNode = getAllByText('Article label')
    expect(selectNode[0].tagName).toBe('OPTION')
  })

  it('should handle changes in selection for a select', () => {
    const { getByTestId } = render(
      <SearchBarFilter searchCategory={COLLECTION} setSearchCategory={mockOnChange} />,
    )

    const selectNode = getByTestId('SearchBarFilter')

    fireEvent.change(selectNode, { target: { value: ARTICLE } })
    expect(mockOnChange).toBeCalledWith(ARTICLE)
  })
})
