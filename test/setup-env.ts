import { server } from './server'

const globalThis: any = global

beforeAll(() => server.listen())

// if you need to add a handler after calling setupServer for some specific test
// this will remove that handler for the rest of them
// (which is important for test isolation):
afterEach(() => server.resetHandlers())

afterAll(() => {
  globalThis.unsetAuthentication()
  server.close()
})

/* tokens generated with https://www.jsonwebtoken.io/ */
// token contains 'exp' prop with a date in the past
const expiredToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImp0aSI6IjZhNTc3NzZlLTczYWYtNDM3ZS1hMmJiLThmYTkxYWVhN2QxYSIsImlhdCI6MTU4ODE2Mjk2MywiZXhwIjoxMjQyMzQzfQ.RbJHkXRPmFZMYDJs-gxhk7vWYlIYZi8uik83Q0V1nas'

// token doesn't have 'exp' prop
const invalidToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE1MTYyMzkwMjIsImp0aSI6IjUzYzUyZmFjLWQwZjgtNDYzZC1iZjcwLTMzOTMyNWZhOTIwYiIsImV4cCI6MTYxMDU1ODMyNn0.6UsyJjNyixhQ8rB5rvgcnAwWVNOeO0ly9A-KWkLd3SM'

// token contains 'exp' prop with a date far into the future
const validToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImp0aSI6ImMxOWRhNDgwLTAyM2UtNGM2YS04NDM2LWNhMzNkYzZjYzVlMyIsImlhdCI6MTU4ODE2NDUyMCwiZXhwIjoxNTg4MTY4MTQ1MH0.LMA3E950H0EACrvME7Gps1Y-Q43Fux1q8YCJUl9pbYE'

globalThis.unsetAuthentication = () => {
  globalThis.sessionStorage.removeItem('accessToken')
}

globalThis.setExpiredAuthentication = () => {
  globalThis.sessionStorage.setItem('accessToken', expiredToken)
}

globalThis.setValidAuthentication = () => {
  globalThis.sessionStorage.setItem('accessToken', validToken)
  globalThis.sessionStorage.setItem('stateToken', validToken)
}

globalThis.setInvalidAuthentication = () => {
  globalThis.sessionStorage.setItem('accessToken', invalidToken)
}

globalThis.setAuthenticationWithToken = (token: string) => {
  globalThis.sessionStorage.setItem('accessToken', token)
}
