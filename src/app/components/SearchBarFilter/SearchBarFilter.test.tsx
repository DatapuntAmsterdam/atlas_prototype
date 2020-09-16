import { cleanup, render } from '@testing-library/react'
import * as React from 'react'
import SearchBarFilter from './SearchBarFilter'
import useParam from '../../utils/useParam'

jest.mock('../../utils/useParam')

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

// @ts-ignore
useParam.mockImplementation(() => ['someQuery'])

describe('SearchFilter', () => {
  beforeEach(cleanup)

  it('should render a select with the filter options', () => {
    const { getAllByText } = render(<SearchBarFilter />)

    const selectNode = getAllByText('Article label')
    expect(selectNode[0].tagName).toBe('OPTION')
  })
})
