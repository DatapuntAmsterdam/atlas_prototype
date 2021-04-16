import stateTokenGenerator from './state-token-generator'

describe('The state token generator service', () => {
  const byteString = '048>IYceiv{ÈÌÐàð'
  const asciiString = 'abcd+efgh=='

  let origBtoa: (data: string) => string
  let origCrypto: Crypto | undefined

  beforeEach(() => {
    origBtoa = global.btoa
    global.btoa = jest.fn()
    // @ts-ignore
    global.btoa.mockImplementation(() => asciiString)

    origCrypto = global.crypto
    // @ts-ignore
    global.crypto = {}
    global.crypto.getRandomValues = jest.fn()
    // @ts-ignore
    global.crypto.getRandomValues.mockImplementation((list) => {
      /* eslint-disable no-param-reassign */
      list[0] = 48 // 0
      list[1] = 52 // 4
      list[2] = 56 // 8
      list[3] = 62 // >
      list[4] = 73 // I
      list[5] = 89 // Y
      list[6] = 99 // c
      list[7] = 101 // e
      list[8] = 105 // i
      list[9] = 118 // v
      list[10] = 123 // {
      list[11] = 200 // È
      list[12] = 204 // Ì
      list[13] = 208 // Ð
      list[14] = 224 // à
      list[15] = 240 // ð
      /* eslint-enable no-param-reassign */
    })
  })

  afterEach(() => {
    global.btoa = origBtoa
    // @ts-ignore
    global.crypto = origCrypto
    // @ts-ignore
    global.msCrypto = undefined
  })

  it('returns an empty string when the crypto library is not available', () => {
    // @ts-ignore
    global.crypto = undefined
    const stateToken = stateTokenGenerator()

    expect(global.btoa).not.toHaveBeenCalled()
    expect(stateToken).toBe('')
  })

  it('it generates a random string of characters and url encodes it', () => {
    const stateToken = stateTokenGenerator()
    expect(global.btoa).toHaveBeenCalledWith(byteString)
    expect(stateToken).toBe(asciiString)
  })
})
