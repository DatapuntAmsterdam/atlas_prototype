/* eslint-disable global-require */

import { rest } from 'msw'
import environment from '../src/environment'
import joinUrl from '../src/app/utils/joinUrl'
import { isAuthenticated } from '../src/shared/services/auth/auth'

const typeaheadUrl = joinUrl([environment.API_ROOT, 'typeahead'])
// const iiifMetadataUrl = joinUrl([environment.API_ROOT, 'iiif-metadata/bouwdossier', ':id'])
const dcatDatasetsUrl = joinUrl([environment.API_ROOT, 'dcatd/datasets', ':id'])
const dcatDatasetFiltersUrl = joinUrl([environment.API_ROOT, 'dcatd/openapi'])
// const panoramaThumbnailUrl = joinUrl([environment.API_ROOT, 'panorama/thumbnail', '?:q'])
const stadsdeelUrl = joinUrl([environment.API_ROOT, 'gebieden/stadsdeel'])

const handlers = [
  rest.get(typeaheadUrl, async (req, res, ctx) => {
    const typeaheadFixture = require('../src/api/typeahead/typeahead.json')
    const typeaheadAuthFixture = require('../src/api/typeahead/typeahead_auth.json')

    const fixture = isAuthenticated() ? typeaheadAuthFixture : typeaheadFixture
    return res(ctx.json(fixture))
  }),

  // rest.get(iiifMetadataUrl, async (req, res, ctx) => {
  //   const bouwdossierFixture = require('../src/api/iiif-metadata/bouwdossier/fixture').default

  //   return res(ctx.json(bouwdossierFixture))
  // }),

  rest.get(dcatDatasetsUrl, async (req, res, ctx) => {
    const datasetsFixture = require('../src/api/dcatd/datasets/fixture').default

    return res(ctx.json(datasetsFixture))
  }),

  rest.get(dcatDatasetFiltersUrl, async (req, res, ctx) => {
    const datasetFiltersFixture = require('../src/api/dcatd/openapi/fixture').default

    return res(ctx.json(datasetFiltersFixture))
  }),

  // rest.get(panoramaThumbnailUrl, async (req, res, ctx) => {
  //   const panoramaThumbnailFixture = require('../src/api/panorama/thumbnail/fixture').default

  //   return res(ctx.json(panoramaThumbnailFixture))
  // }),

  rest.get(stadsdeelUrl, async (req, res, ctx) => {
    const stadsdeelFixture = require('../src/api/gebieden/stadsdeel/fixture').default

    return res(ctx.json(stadsdeelFixture))
  }),
]

/* tokens generated with https://www.jsonwebtoken.io/ */
// token contains 'exp' prop with a date in the past
const expiredToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImp0aSI6IjZhNTc3NzZlLTczYWYtNDM3ZS1hMmJiLThmYTkxYWVhN2QxYSIsImlhdCI6MTU4ODE2Mjk2MywiZXhwIjoxMjQyMzQzfQ.RbJHkXRPmFZMYDJs-gxhk7vWYlIYZi8uik83Q0V1nas'

// token doesn't have 'exp' prop
const invalidToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c'

// token contains 'exp' prop with a date far into the future
const validToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImp0aSI6ImMxOWRhNDgwLTAyM2UtNGM2YS04NDM2LWNhMzNkYzZjYzVlMyIsImlhdCI6MTU4ODE2NDUyMCwiZXhwIjoxNTg4MTY4MTQ1MH0.LMA3E950H0EACrvME7Gps1Y-Q43Fux1q8YCJUl9pbYE'

global.unsetAuthentication = () => {
  global.sessionStorage.removeItem('accessToken')
}

global.setExpiredAuthentication = () => {
  global.sessionStorage.setItem('accessToken', expiredToken)
}

global.setValidAuthentication = () => {
  global.sessionStorage.setItem('accessToken', validToken)
}

global.setInvalidAuthentication = () => {
  global.sessionStorage.setItem('accessToken', invalidToken)
}

export default handlers
