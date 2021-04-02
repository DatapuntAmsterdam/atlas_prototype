import { render } from '@testing-library/react'
import ViewerControls from './ViewerControls'

describe('ViewerControls', () => {
  it('passes other props to the root', () => {
    const { getByTestId } = render(<ViewerControls data-testid="root" />)

    expect(getByTestId('root')).toBeDefined()
  })

  it('renders the controls', () => {
    const topLeftComponent = 'TopLeftComponent'
    const bottomLeftComponent = 'BottomLeftComponent'
    const topRightComponent = 'TopRightComponent'
    const bottomRightComponent = 'BottomRightComponent'
    const { getByText } = render(
      <ViewerControls
        topLeftComponent={topLeftComponent}
        bottomLeftComponent={bottomLeftComponent}
        topRightComponent={topRightComponent}
        bottomRightComponent={bottomRightComponent}
      />,
    )

    expect(getByText(topLeftComponent)).toBeDefined()
    expect(getByText(bottomLeftComponent)).toBeDefined()
    expect(getByText(topRightComponent)).toBeDefined()
    expect(getByText(bottomRightComponent)).toBeDefined()
  })

  it('renders the meta data', () => {
    const metaData = ['hello', 'world']
    const { getByText } = render(<ViewerControls metaData={metaData} />)

    expect(getByText(metaData[0])).toBeDefined()
    expect(getByText(metaData[1])).toBeDefined()
  })
})
