import { render } from '@testing-library/react'
import CardList from './CardList'
import { EDITORIAL_CARD_TEST_ID } from '../EditorialCard/EditorialCard'
import { CmsType } from '../../../shared/config/cms.config'

describe('CardList', () => {
  it('should render EditorialCard components based on results', () => {
    const { getAllByTestId } = render(
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
    expect(getAllByTestId(EDITORIAL_CARD_TEST_ID).length).toBe(2)
  })
})
