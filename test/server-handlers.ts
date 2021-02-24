/* eslint-disable global-require,@typescript-eslint/no-var-requires */
import { rest } from 'msw'
// import joinUrl from '../src/app/utils/joinUrl'
// import { isAuthenticated } from '../src/shared/services/auth/auth'
import { HIGHLIGHT } from '../src/shared/config/constants'
import { highlightsListFixture } from '../src/api/cms/jsonapi/node'

// const typeaheadUrl = joinUrl([API_ROOT, 'typeahead'])
// const iiifMetadataUrl = joinUrl([API_ROOT, 'iiif-metadata/bouwdossier', ':id'])
// const dcatDatasetsUrl = joinUrl([API_ROOT, 'dcatd/datasets', ':id'])
// const dcatDatasetFiltersUrl = joinUrl([API_ROOT, 'dcatd/openapi'])
// const panoramaThumbnailUrl = joinUrl([API_ROOT, 'panorama/thumbnail', '?:q'])
// const stadsdeelUrl = joinUrl([API_ROOT, 'gebieden/stadsdeel'])

const highLightRegExp = `**/jsonapi/node/list/**&__type__=${HIGHLIGHT}`
const typeaheadUrl = joinUrl([environment.API_ROOT, 'typeahead'])
const iiifMetadataUrl = joinUrl([environment.API_ROOT, 'iiif-metadata/bouwdossier', ':id'])
const dcatDatasetsUrl = joinUrl([environment.API_ROOT, 'dcatd/datasets', ':id'])
const dcatDatasetFiltersUrl = joinUrl([environment.API_ROOT, 'dcatd/openapi'])
const panoramaThumbnailUrl = joinUrl([environment.API_ROOT, 'panorama/thumbnail', '?:q'])
const stadsdeelUrl = joinUrl([environment.API_ROOT, 'gebieden/stadsdeel', ':id'])

const handlers = [
  rest.get(highLightRegExp, async (req, res, ctx) => res(ctx.json(highlightsListFixture))),

  // rest.get(/typeahead$/, async (req, res, ctx) => {
  //   const typeaheadFixture = require('../src/api/typeahead/typeahead.json')
  //   // const typeaheadAuthFixture = require('../src/api/typeahead/typeahead_auth.json')

  //   // const fixture = isAuthenticated() ? typeaheadAuthFixture : typeaheadFixture
  //   return res(ctx.json(typeaheadFixture))
  // }),

  // rest.get(/iiif-metadata\/bouwdossier$/, async (req, res, ctx) => {
  //   const bouwdossierFixture = require('../src/api/iiif-metadata/bouwdossier').singleFixture

  //   return res(ctx.json(bouwdossierFixture))
  // }),

  // rest.get(/dcatd\/datasets$/, async (req, res, ctx) => {
  //   const datasetsFixture = require('../src/api/dcatd/datasets').singleFixture

  //   return res(ctx.json(datasetsFixture))
  // }),

  // rest.get(/dcatd\/openapi$/, async (req, res, ctx) => {
  //   const datasetFiltersFixture = require('../src/api/dcatd/openapi').singleFixture

  //   return res(ctx.json(datasetFiltersFixture))
  // }),

  // rest.get(/'panorama\/thumbnail$/, async (req, res, ctx) => {
  //   const panoramaThumbnailFixture = require('../src/api/panorama/thumbnail').singleFixture

  //   return res(ctx.json(panoramaThumbnailFixture))
  // }),

  // rest.get(/gebieden\/stadsdeel$/, async (req, res, ctx) => {
  //   const stadsdeelFixture = require('../src/api/gebieden/stadsdeel').singleFixture

  //   return res(ctx.json(stadsdeelFixture))
  // }),
]

const highlightsList = {
  fixture: highlightsListFixture,
  url: highLightRegExp,
}

export { handlers as default, highlightsList }
