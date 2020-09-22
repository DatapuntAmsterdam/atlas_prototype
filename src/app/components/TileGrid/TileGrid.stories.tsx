import { Container, Row } from '@amsterdam/asc-ui'
import React from 'react'
import CollectionTileGrid from '../../pages/CollectionDetailPage/CollectionTileGrid'
import { CMSResultItem } from '../../utils/useFromCMS'

export default {
  title: 'Dataportaal/Dossiers/TileGridBlock',

  decorators: [
    (storyFn: () => React.ReactNode) => (
      <div style={{ padding: '40px 10px', margin: '0 auto' }}>{storyFn()}</div>
    ),
  ],
}

type StoryProps = {
  items: CMSResultItem[]
}

const Default: React.FC<StoryProps> = ({ items }) => {
  return (
    <Container>
      <Row>
        <CollectionTileGrid
          loading={false}
          results={items}
          title="Example"
          description="Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab alias aliquam culpa dolor et eveniet ex inventore ipsam molestiae quod, reprehenderit repudiandae voluptatem."
        />
      </Row>
    </Container>
  )
}

const exampleItem = {
  title: 'Lorem ipsum dolor sit amet',
  image: 'https://placekitten.com/300/300',
}

export const WithThreeImageCards = () => <Default items={new Array(3).fill(exampleItem)} />
export const WithFourImageCards = () => <Default items={new Array(4).fill(exampleItem)} />
export const WithFiveImageCards = () => <Default items={new Array(5).fill(exampleItem)} />
export const WithSixImageCards = () => <Default items={new Array(6).fill(exampleItem)} />
