// @ts-ignore
import normalize from 'json-api-normalize'
import { mocked } from 'ts-jest/utils'
import cmsJsonApiNormalizer, { getType } from './cms-json-api-normalizer'

jest.mock('json-api-normalize')

const mockedNormalize = mocked(normalize)

describe('jsonApiNormalizer', () => {
  const mockImageUrl = 'path/to/file'
  let mockData = {
    body: {
      value: 'body',
    },
    title: 'title',
    field_intro: 'intro',
    field_short_title: 'september',
    created: '2019-03-15T00:00:00+01:00',
    field_teaser_image: {
      field_media_image: {
        uri: {
          url: mockImageUrl,
        },
      },
    },
    field_cover_image: {
      field_media_image: {
        uri: {
          url: mockImageUrl,
        },
      },
    },
    type: 'node--article',
  }

  afterEach(() => {
    mockedNormalize.mockReset()
  })

  it('should return the correct type', () => {
    const type = 'node--article'

    expect(getType(type)).toBe('article')
  })

  it('should return a normalized json for a single result', () => {
    mockedNormalize.mockImplementation(() => ({
      get: () => mockData,
    }))

    const normalizedData = cmsJsonApiNormalizer(mockData as any, ['field_title', 'field_intro'])

    expect(normalizedData).toEqual({
      ...mockData,
      short_title: mockData.field_short_title,
      teaser_url: mockImageUrl,
      type: getType(mockData.type),
      intro: mockData.field_intro,
      uuid: (mockData as any).id,
      media_image_url: mockImageUrl,
    })
  })
  it('should return a normalized json for a list', () => {
    mockData = {
      ...mockData,
      field_items: [
        {
          ...mockData,
        },
      ],
    } as any

    mockedNormalize.mockImplementation(() => ({
      get: () => mockData,
    }))

    const normalizedData = cmsJsonApiNormalizer(mockData as any, ['field_title', 'field_intro'])

    expect(normalizedData).toEqual([
      {
        ...mockData,
        type: getType((mockData as any).field_items[0].type),
        media_image_url: mockImageUrl,
        intro: mockData.field_intro,
        uuid: (mockData as any).id,
        short_title: mockData.field_short_title,
        teaser_url: mockImageUrl,
      },
    ])
  })
})
