import getImageFromCms from './getImageFromCms'

describe('getImageFromCms', () => {
  it('should return an url with the correct extension', () => {
    expect(getImageFromCms('myimage.PNG', 10, 10)).toContain('.PNG')
  })
})
