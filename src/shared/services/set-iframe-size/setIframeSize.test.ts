import setIframeSize from './setIframeSize'

describe('setIframeSize', () => {
  const mockHandleResize = jest.fn()
  const map: any = {}

  beforeEach(() => {
    window.addEventListener = jest.fn((event, cb) => {
      map[event] = cb
    })
  })

  afterEach(() => {
    mockHandleResize.mockReset()
  })

  it('should execute the handleResize function when a documentHeight was returned', () => {
    setIframeSize(mockHandleResize)

    map.message({ data: 'documentHeight:300' })

    expect(mockHandleResize).toHaveBeenCalledWith('300')
  })

  it("shouldn't execute the handleResize function when nothing was returned", () => {
    setIframeSize(mockHandleResize)

    map.message({})

    expect(mockHandleResize).not.toHaveBeenCalled()
  })
})
