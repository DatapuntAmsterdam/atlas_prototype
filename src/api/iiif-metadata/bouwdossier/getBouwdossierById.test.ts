import { getBouwdossierById } from '.'

describe('getBouwdossierById', () => {
  const id = 'foobarbaz'

  it('throws an error when request is made unauthorized', async () => {
    globalThis.unsetAuthentication()

    await expect(getBouwdossierById(id)).rejects.toThrow()
  })

  it('throws an error when request is made with invalid auth', async () => {
    globalThis.setInvalidAuthentication()

    await expect(getBouwdossierById(id)).rejects.toThrow()
  })

  it('makes a request and returns the response', async () => {
    globalThis.setValidAuthentication()

    const result = await getBouwdossierById(id)

    expect(result).not.toBeUndefined()
  })
})
