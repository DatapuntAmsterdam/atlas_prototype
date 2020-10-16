import parseDetailPath from './parseDetailPath'

describe('parseDetailPath', () => {
  it('should parse the url', () => {
    expect(parseDetailPath('/foo/bar/1234')).toEqual({
      id: '1234',
      type: 'foo/bar',
    })
  })

  it('should should remove the id prefix', () => {
    expect(parseDetailPath('/foo/bar/id1234')).toEqual({
      id: '1234',
      type: 'foo/bar',
    })
  })
})
