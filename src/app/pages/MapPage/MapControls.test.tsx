import { fireEvent, render, screen } from '@testing-library/react'
import MapControls from './MapControls'
import withMapContext from '../../utils/withMapContext'

describe('MapControls', () => {
  const { rerender } = render(
    withMapContext(
      <MapControls
        currentOverlay={0}
        setCurrentOverlay={() => {}}
        showDesktopVariant
        isLoading={false}
        panoActive={false}
      />,
    ),
  )
  it('should show the button to open drawtool', () => {
    expect(screen.getByTestId('drawtoolOpenButton')).toBeDefined()
  })

  it('should hide the button to open drawtool when drawtool or panorama is active', () => {
    rerender(
      withMapContext(
        <MapControls
          currentOverlay={0}
          setCurrentOverlay={() => {}}
          showDesktopVariant
          isLoading={false}
          panoActive
        />,
      ),
    )
    expect(screen.queryByTestId('drawtoolOpenButton')).toBeNull()

    rerender(
      withMapContext(
        <MapControls
          currentOverlay={0}
          setCurrentOverlay={() => {}}
          showDesktopVariant
          isLoading={false}
          panoActive={false}
        />,
        {
          showDrawTool: true,
        },
      ),
    )
    expect(screen.queryByTestId('drawtoolOpenButton')).toBeNull()
  })

  it('should open the drawtool when clicking on drawtool button', () => {
    const setShowDrawToolMock = jest.fn()

    const { getByTestId } = render(
      withMapContext(
        <MapControls
          currentOverlay={0}
          setCurrentOverlay={() => {}}
          showDesktopVariant
          isLoading={false}
          panoActive={false}
        />,
        {
          setShowDrawTool: setShowDrawToolMock,
        },
      ),
    )
    expect(setShowDrawToolMock).not.toHaveBeenCalled()
    const openDrawtoolButton = getByTestId('drawtoolOpenButton')
    fireEvent.click(openDrawtoolButton)
    expect(setShowDrawToolMock).toHaveBeenCalled()
  })
})
