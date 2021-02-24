import { rest, MockedRequest } from 'msw'
import { setupServer } from 'msw/node'
import serverHandlers from './server-handlers'

// configure a Service Worker for the browser environment (eg. Jest)
const server = setupServer(...serverHandlers)

export { server, rest, MockedRequest }
