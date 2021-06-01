import { createCookie, getCookie } from './cookie'

describe('cookie', () => {
  describe('setCookie', () => {
    it('should set a cookie with the given parameters', () => {
      createCookie('test', '1')
      expect(document.cookie).toEqual('test=1')
    })
  })

  describe('getCookie', () => {
    it('should get a cookie with the given name', () => {
      createCookie('test', '1')
      expect(getCookie('test')).toEqual('1')
    })
  })
})
