import { screen, render } from '@testing-library/react'
import ViewerControls from './ViewerControls'

describe('ViewerControls', () => {
  it('passes other props to the root', () => {
    render(<ViewerControls data-testid="root" />)

    expect(screen.getByTestId('root')).toBeInTheDocument()
  })

  it('renders the controls', () => {
    const topLeftComponent = 'TopLeftComponent'
    const bottomLeftComponent = 'BottomLeftComponent'
    const topRightComponent = 'TopRightComponent'
    const bottomRightComponent = 'BottomRightComponent'
    render(
      <ViewerControls
        topLeftComponent={topLeftComponent}
        bottomLeftComponent={bottomLeftComponent}
        topRightComponent={topRightComponent}
        bottomRightComponent={bottomRightComponent}
      />,
    )

    expect(screen.getByText(topLeftComponent)).toBeInTheDocument()
    expect(screen.getByText(bottomLeftComponent)).toBeInTheDocument()
    expect(screen.getByText(topRightComponent)).toBeInTheDocument()
    expect(screen.getByText(bottomRightComponent)).toBeInTheDocument()
  })

  it('renders the meta data', () => {
    const metaData = ['hello', 'world']
    render(<ViewerControls metaData={metaData} />)

    expect(screen.getByText(metaData[0])).toBeInTheDocument()
    expect(screen.getByText(metaData[1])).toBeInTheDocument()
  })
})
