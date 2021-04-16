import { fireEvent, render, screen } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import setIframeSize from '../../../shared/services/set-iframe-size/setIframeSize'
import IFrame from './IFrame'

const setIframeSizeMock = mocked(setIframeSize)

jest.mock('../../../shared/services/set-iframe-size/setIframeSize')

describe('IFrame', () => {
  const contentLink = { uri: 'https://this.is/a-link/this-is-a-slug' }
  const title = 'title'

  beforeEach(() => {
    setIframeSizeMock.mockImplementation(() => {})
  })

  afterEach(() => {
    setIframeSizeMock.mockReset()
  })

  it('mounts the iframe when there are results', () => {
    render(<IFrame contentLink={contentLink} title={title} />)
    expect(screen.getByTitle(title)).toBeInTheDocument()
  })

  it('calls the setIframeSize function', () => {
    const { unmount } = render(<IFrame contentLink={contentLink} title={title} />)

    fireEvent.load(screen.getByTitle(title))
    expect(setIframeSize).toHaveBeenCalled()

    unmount()
    expect(setIframeSize).not.toHaveBeenCalledTimes(2)
  })
})
