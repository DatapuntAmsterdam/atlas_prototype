import { render, screen } from '@testing-library/react'
import { CmsType } from '../../../../../shared/config/cms.config'
import { EDITORIAL_CARD_TEST_ID } from '../../../../components/EditorialCard/EditorialCard'
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
    expect(screen.getAllByTestId(EDITORIAL_CARD_TEST_ID).length).toBe(2)
  })
})
