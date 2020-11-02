import { rest } from 'msw'
import environment from '../src/environment'
import joinUrl from '../src/app/utils/joinUrl'
import typeaheadFixture from '../src/api/typeahead/fixture'

const typeaheadUrl = joinUrl([environment.API_ROOT, 'typeahead'])

const handlers = [
  rest.get(typeaheadUrl, async (req, res, ctx) => {
    console.log(req.headers.get('authorization'))
    return res(ctx.json(typeaheadFixture))
  }),

  // rest.post('/checkout', async (req, res, ctx) => {
  //   const user = await users.login(JSON.parse(req.body))
  //   const isAuthorized = user.authorize(req.headers.Authorization)
  //   if (!isAuthorized) {
  //     return res(ctx.status(401), ctx.json({ message: 'Not authorized' }))
  //   }
  //   const shoppingCart = JSON.parse(req.body)
  //   // do whatever other things you need to do with this shopping cart
  //   return res(ctx.json({ success: true }))
  // }),
]

export { handlers }
