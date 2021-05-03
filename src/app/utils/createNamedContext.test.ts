import createNamedContext from './createNamedContext'

describe('createNamedContext', () => {
  it('creates a named context', () => {
    const displayName = 'someName'
    expect(createNamedContext(displayName, null).displayName).toEqual(displayName)
  })
})
