import { rest } from 'msw'
import { isAuthenticated } from '../src/shared/services/auth/auth'
import api from '../src/api'
import environment from '../src/environment'

const handlers = Object.values(api).map(
  ({ path, singleFixture, singleFixtureAuth, onlyAuthenticated }) =>
    rest.get(new RegExp(`${environment.API_ROOT}${path}`, 'i'), async (req, res, ctx) => {
      if (onlyAuthenticated && !isAuthenticated()) {
        return res(ctx.status(401))
      }

      if (isAuthenticated() && singleFixtureAuth) {
        return res(ctx.json(singleFixtureAuth))
      }

      return res(ctx.json(singleFixture))
    }),
)

handlers.push(
  /**
   * Catch-all handler that will fail any test that has an outgoing request without a matching handler.
   * Whenever an outgoing request is caught, make sure that the value for `path` in the API folder is correct
   * or that a custom handler is defined for that particular test.
   */
  rest.get('*', (req) => {
    throw new Error(`${req.url.toString()} doesn't have a handler`)
  }),
)

export default handlers
