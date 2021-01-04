import { render, fireEvent } from '@testing-library/react'
import configureMockStore from 'redux-mock-store'
import { Provider } from 'react-redux'
import * as ui from '../../../shared/ducks/ui/ui'
import ShareBar from './ShareBar'

jest.mock('../../../shared/ducks/ui/ui')

describe('ShareBar', () => {
  const store = configureMockStore()()

  const sharePageMock = jest.spyOn(ui, 'sharePage').mockImplementation(() => ({
    type: ui.SHARE_PAGE,
    payload: undefined,
    meta: { tracking: true },
  }))

  const showPrintModeMock = jest.spyOn(ui, 'showPrintMode').mockImplementation(() => ({
    type: ui.SHOW_PRINT,
    payload: undefined,
    meta: { tracking: true },
  }))

  beforeEach(() => {
    global.window.open = jest.fn()
  })

  it('should handle onClick event on buttons', () => {
    jest.spyOn(ui, 'hasPrintMode').mockImplementation(() => false)
    jest.spyOn(ui, 'isPrintMode').mockImplementation(() => false)

    const { queryAllByRole } = render(
      <Provider store={store}>
        <ShareBar hideInPrintMode={false} />
      </Provider>,
    )

    const buttons = queryAllByRole('button')

    buttons.forEach((button) => {
      fireEvent.click(button)
    })

    expect(buttons.length).toBe(4)
    expect(sharePageMock).toHaveBeenCalledTimes(4)
  })

  it('should only render the print button when in print mode', () => {
    jest.spyOn(ui, 'hasPrintMode').mockImplementation(() => true)
    jest.spyOn(ui, 'isPrintMode').mockImplementation(() => false)
    const { queryAllByRole } = render(
      <Provider store={store}>
        <ShareBar hideInPrintMode={false} />
      </Provider>,
    )
    const buttons = queryAllByRole('button')
    expect(buttons.length).toBe(5)
    fireEvent.click(buttons[4])
    expect(showPrintModeMock).toHaveBeenCalled()
  })

  it('should be hidden by default in print mode', () => {
    jest.spyOn(ui, 'hasPrintMode').mockImplementation(() => false)
    jest.spyOn(ui, 'isPrintMode').mockImplementation(() => true)

    const { container } = render(
      <Provider store={store}>
        <ShareBar />
      </Provider>,
    )

    expect(container.firstChild).toBeNull()
  })
})
