/* eslint-disable global-require,@typescript-eslint/no-var-requires */

import { rest } from 'msw'
import environment from '../src/environment'
import joinUrl from '../src/app/utils/joinUrl'
import { isAuthenticated } from '../src/shared/services/auth/auth'

const typeaheadUrl = joinUrl([environment.API_ROOT, 'typeahead'])
const iiifMetadataUrl = joinUrl([environment.API_ROOT, 'iiif-metadata/bouwdossier', ':id'])
const dcatDatasetsUrl = joinUrl([environment.API_ROOT, 'dcatd/datasets', ':id'])
const dcatDatasetFiltersUrl = joinUrl([environment.API_ROOT, 'dcatd/openapi'])
const panoramaThumbnailUrl = joinUrl([environment.API_ROOT, 'panorama/thumbnail', '?:q'])
const stadsdeelUrl = joinUrl([environment.API_ROOT, 'gebieden/stadsdeel', ':id'])

const handlers = [
  rest.get(typeaheadUrl, async (req, res, ctx) => {
    const typeaheadFixture = require('../src/api/typeahead/typeahead.json')
    const typeaheadAuthFixture = require('../src/api/typeahead/typeahead_auth.json')

    const fixture = isAuthenticated() ? typeaheadAuthFixture : typeaheadFixture
    return res(ctx.json(fixture))
  }),

  rest.get(iiifMetadataUrl, async (req, res, ctx) => {
    const bouwdossierFixture = require('../src/api/iiif-metadata/bouwdossier').singleFixture

    return res(ctx.json(bouwdossierFixture))
  }),

  rest.get(dcatDatasetsUrl, async (req, res, ctx) => {
    const datasetsFixture = require('../src/api/dcatd/datasets').singleFixture

    return res(ctx.json(datasetsFixture))
  }),

  rest.get(dcatDatasetFiltersUrl, async (req, res, ctx) => {
    const datasetFiltersFixture = require('../src/api/dcatd/openapi').singleFixture

    return res(ctx.json(datasetFiltersFixture))
  }),

  rest.get(panoramaThumbnailUrl, async (req, res, ctx) => {
    const panoramaThumbnailFixture = require('../src/api/panorama/thumbnail').singleFixture

    return res(ctx.json(panoramaThumbnailFixture))
  }),

  rest.get(stadsdeelUrl, async (req, res, ctx) => {
    const stadsdeelFixture = require('../src/api/gebieden/stadsdeel').singleFixture

    return res(ctx.json(stadsdeelFixture))
  }),
]

export default handlers
