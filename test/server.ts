import { rest, MockedRequest } from 'msw'
import { setupServer } from 'msw/node'
import serverHandlers from './server-handlers'

const server = setupServer(...serverHandlers)

export { server, rest }
export type { MockedRequest }
