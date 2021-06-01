import socialItems from './socialItems'

describe('socialItems', () => {
  it('should render the socialItems', () => {
    const component = socialItems()
    expect(component.length).toBe(4)
  })
})
