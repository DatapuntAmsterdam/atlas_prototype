import getFileName from './getFileName'

describe('getFileName', () => {
  it('should get the file name from a path', () => {
    expect(getFileName('https://example.com/path/to/file.txt')).toEqual('file.txt')
  })
})
