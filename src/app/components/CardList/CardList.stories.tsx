import CardList from './CardList'

export default {
  title: 'Dataportaal/Dossiers/CardList',

  decorators: [
    (storyFn: () => React.ReactNode) => <div style={{ padding: '40px 10px' }}>{storyFn()}</div>,
  ],
}

const exampleItem = {
  title: 'Lorem ipsum dolor sit amet',
  image: 'https://placekitten.com/300/300',
}

export const DefaultState = () => (
  <CardList loading={false} title="Example list" results={new Array(3).fill(exampleItem)} />
)
