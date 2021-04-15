import { toArticleDetail, toSpecialDetail } from '../../app/links'
import { CmsType } from '../../shared/config/cms.config'
import normalizeCMSResults, {
  getLinkProps,
  getLocaleFormattedDate,
  normalizeObject,
} from './normalizeCMSResults'

jest.mock('../../app/links')

// @ts-ignore
// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
toArticleDetail.mockImplementation((id, slug) => `${id}/${slug}`)
// @ts-ignore
// eslint-disable-next-line @typescript-eslint/restrict-template-expressions
toSpecialDetail.mockImplementation((id, slug) => `${id}/${slug}`)

describe('normalizeCMSResults', () => {
  describe('getLocaleFormattedDate', () => {
    /* eslint-disable camelcase */
    it('returns an object with empty values', () => {
      const { localeDate, localeDateFormatted } = getLocaleFormattedDate()

      expect(localeDate).toEqual('')
      expect(localeDateFormatted).toEqual('')
    })

    it('returns an object with empty values from an empty options object', () => {
      const { localeDate, localeDateFormatted } = getLocaleFormattedDate({})

      expect(localeDate).toEqual('')
      expect(localeDateFormatted).toEqual('')
    })

    it('returns an object with empty values when options do not contain a possible valid date', () => {
      const { localeDate, localeDateFormatted } = getLocaleFormattedDate({
        field_publication_year: 'foobar',
      })

      expect(localeDate).toEqual('')
      expect(localeDateFormatted).toEqual('')
    })

    it('returns an object with dates from field_publication_date', () => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const field_publication_date = '2020-12-02T16:00:00+01:00'
      const { localeDate, localeDateFormatted } = getLocaleFormattedDate({
        field_publication_date,
      })

      expect(localeDate).toEqual(field_publication_date)
      expect(localeDateFormatted).toEqual('2 december 2020')
    })

    it('returns an object with dates from field_publication_year', () => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const field_publication_year = '2020'
      const { localeDate, localeDateFormatted } = getLocaleFormattedDate({
        field_publication_year,
      })

      // @ts-ignore
      expect(localeDate).toEqual(new Date(Date.UTC(field_publication_year)))
      expect(localeDateFormatted).toEqual(`1-1-${field_publication_year}`)
    })

    it('returns an object with dates from field_publication_year and field_publication_month', () => {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const field_publication_year = '2020'
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const field_publication_month = '12'
      const { localeDate, localeDateFormatted } = getLocaleFormattedDate({
        field_publication_year,
        field_publication_month,
      })

      expect(localeDate).toEqual(new Date(Date.UTC(2020, 12 - 1)))
      expect(localeDateFormatted).toEqual(`1-${field_publication_month}-${field_publication_year}`)
    })

    it('returns an object with dates from field_publication_year, field_publication_month and field_publication_day', () => {
      /* eslint-disable @typescript-eslint/naming-convention */
      const field_publication_year = '2020'
      const field_publication_month = '10'
      const field_publication_day = '31'
      /* eslint-enable @typescript-eslint/naming-convention */
      const { localeDate, localeDateFormatted } = getLocaleFormattedDate({
        field_publication_year,
        field_publication_month,
        field_publication_day,
      })

      expect(localeDate).toEqual(new Date(Date.UTC(2020, 10 - 1, 31)))
      expect(localeDateFormatted).toEqual(
        `${field_publication_day}-${field_publication_month}-${field_publication_year}`,
      )
    })

    it('returns an object with dates from field_publication_year, field_publication_month and field_publication_day 1', () => {
      /* eslint-disable @typescript-eslint/naming-convention */
      const field_publication_year = '2020'
      const field_publication_month = '1'
      const field_publication_day = '1'
      /* eslint-enable @typescript-eslint/naming-convention */
      const { localeDate, localeDateFormatted } = getLocaleFormattedDate({
        field_publication_year,
        field_publication_month,
        field_publication_day,
      })

      expect(localeDate).toEqual(new Date(Date.UTC(2020, 1 - 1, 1)))
      expect(localeDateFormatted).toEqual(
        `${field_publication_day}-${field_publication_month}-${field_publication_year}`,
      )
    })
    /* eslint-enable camelcase */
  })

  const input = {
    id: 'foobarbaz',
    title: 'title',
    type: 'foo',
    body: {
      value: 'body',
    },
    teaser_url: 'teaser_url',
    media_image_url: 'media_image_url',

    short_title: 'short_title',
    field_short_title: 'short_title',
    field_teaser: 'field_teaser',
    intro: 'intro',
    field_special_type: 'field_special_type',
    field_publication_date: '',
  }

  const output = {
    key: input.id,
    id: input.id,
    title: input.title,
    type: input.type,
    body: input.body.value,
    teaserImage: input.teaser_url,
    coverImage: input.media_image_url,
    imageIsVertical: false,
    shortTitle: input.short_title,
    teaser: input.field_teaser,
    intro: input.intro,
    specialType: input.field_special_type,
    fileUrl: undefined,
    localeDate: '',
    localeDateFormatted: '',
    slug: input.title,
    to: {},
    related: [],
  }

  describe('getLinkProps', () => {
    it('sets the "to" prop', () => {
      expect(
        getLinkProps(
          {
            ...input,
            type: CmsType.Article,
          },
          input.title,
        ),
      ).toMatchObject({
        to: `${input.id}/${input.title}`,
      })
    })

    it('sets the "to" prop for type special', () => {
      // eslint-disable-next-line camelcase,@typescript-eslint/naming-convention
      const field_special_type = 'foo'
      expect(
        getLinkProps(
          {
            ...input,
            type: CmsType.Special,
            field_special_type,
          },
          input.title,
        ),
      ).toMatchObject({
        to: `${input.id}/${field_special_type}`,
      })
    })

    it('sets the "linkProps" prop', () => {
      const href = 'href'
      expect(
        getLinkProps(
          {
            ...input,
            field_link: {
              uri: href,
            },
          },
          input.title,
        ),
      ).toMatchObject({
        linkProps: {
          forwardedAs: 'a',
          href,
        },
      })
    })
  })

  describe('normalizeObject', () => {
    it('normalizes the data to use in the application', () => {
      expect(normalizeObject(input)).toMatchObject(output)
    })

    it('has a vertical image and file url for publications', () => {
      expect(
        normalizeObject({
          ...input,
          type: CmsType.Publication,
          field_file: { field_media_file: { uri: { url: 'url' } } },
        }),
      ).toMatchObject({
        imageIsVertical: true,
        fileUrl: 'url',
      })
    })

    it('sets the links prop', () => {
      // eslint-disable-next-line camelcase,@typescript-eslint/naming-convention
      const field_links = [
        { uri: 'http://example.com?foo=bar&amp;baz=qux', title: 'Test', options: [] },
        { uri: 'internal:/test/', title: 'Test 2', options: [] },
        { uri: 'entity:node/8', title: 'Foo', options: [] },
      ]
      expect(
        normalizeObject({
          ...input,
          field_links,
        }),
      ).toMatchObject({
        links: [
          { uri: 'http://example.com?foo=bar&baz=qux', title: 'Test', options: [] },
          { uri: 'internal:/test/', title: 'Test 2', options: [] },
          { uri: 'entity:node/8', title: 'Foo', options: [] },
        ],
      })
    })

    it('normalizes the data when it is an array', () => {
      expect(normalizeCMSResults([input])).toMatchObject([output])
    })

    it('normalizes the data when it is NOT an array', () => {
      expect(normalizeCMSResults(input)).toMatchObject(output)
    })
  })
})
