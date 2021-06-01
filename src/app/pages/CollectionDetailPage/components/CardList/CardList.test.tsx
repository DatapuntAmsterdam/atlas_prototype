import { render, screen } from '@testing-library/react'
import { CmsType } from '../../../../../shared/config/cms.config'
import CardList from './CardList'

describe('CardList', () => {
  it('should render EditorialCard components based on results', () => {
    render(
      <CardList
        results={[
          // @ts-ignore
          { id: 'foo', type: CmsType.Collection },
          // @ts-ignore
          { id: 'bar', type: CmsType.Article },
        ]}
        title="A title"
        loading={false}
      />,
    )
    expect(screen.getAllByTestId('editorialCard').length).toBe(2)
  })
})
