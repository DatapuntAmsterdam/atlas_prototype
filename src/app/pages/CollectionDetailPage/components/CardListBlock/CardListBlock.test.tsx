import { render } from '@testing-library/react'
import withAppContext from '../../../../utils/withAppContext'
import type { CMSCollectionList } from './CardListBlock'
import CardListBlock from './CardListBlock'

const RESULTS: CMSCollectionList[] = [{ field_title: 'Some title', field_content: [] }]

describe('CardListBlock', () => {
  it('renders the block', () => {
    const { container } = render(
      withAppContext(<CardListBlock loading={false} results={RESULTS} />),
    )

    expect(container.firstChild).toBeDefined()
  })
})
