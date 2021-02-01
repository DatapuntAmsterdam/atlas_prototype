import { render } from '@testing-library/react'
import { CmsType } from '../../../shared/config/cms.config'
import { toArticleDetail, toPublicationDetail } from '../../links'
import EditorialResults, { IMAGE_SIZE } from './EditorialResults'
import { CMSResultItem } from '../../utils/useFromCMS'
import { LOADING_SPINNER_TEST_ID } from '../LoadingSpinner/LoadingSpinner'
import withAppContext from '../../utils/withAppContext'
import EditorialCard from '../EditorialCard/EditorialCard'
import { toSpecialDetail } from '../../../store/redux-first-router/actions'

jest.mock('../EditorialCard/EditorialCard', () => {
  return jest.fn(() => <div data-testid="editorialCard" />)
})

describe('EditorialResults', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const result: CMSResultItem = {
    id: '1',
    specialType: null,
    slug: 'slug',
    coverImage: '123.jpg',
    teaserImage: '456.jpg',
    dateLocale: 'locale',
    label: 'label',
    teaser: 'long text',
    type: CmsType.Article,
    date: '',
    intro: '',
    link: null,
  }

  it('should display the loading indicator', () => {
    const props = {
      query: '',
      label: 'Label',
      isOverviewPage: false,
      type: CmsType.Article,
      errors: [],
      results: [],
    }
    const { queryByTestId, rerender } = render(<EditorialResults {...props} loading />)

    expect(queryByTestId(LOADING_SPINNER_TEST_ID)).toBeDefined()

    rerender(withAppContext(<EditorialResults {...props} loading={false} />))

    expect(queryByTestId(LOADING_SPINNER_TEST_ID)).toBeDefined()
  })

  it('should render the cards', () => {
    const props = {
      query: '',
      label: 'Label',
      loading: false,
      isOverviewPage: false,
      type: CmsType.Article,
      errors: [],
    }
    const { queryAllByTestId, rerender } = render(
      withAppContext(<EditorialResults {...props} results={[]} />),
    )

    expect(queryAllByTestId('editorialCard')).toEqual([])

    // Should render two cards
    rerender(
      withAppContext(<EditorialResults {...props} results={[result, { ...result, id: '2' }]} />),
    )
    expect(queryAllByTestId('editorialCard').length).toBe(2)
  })

  // This test could probably be deleted if all files concerning the Editorial part of the app are fully typed.
  it('should render no cards if slug or type is missing from result', () => {
    const props = {
      query: '',
      label: 'Label',
      loading: false,
      isOverviewPage: false,
      type: CmsType.Article,
      errors: [],
    }
    const { queryAllByTestId, rerender } = render(
      withAppContext(<EditorialResults {...props} results={[{ ...result, slug: null }]} />),
    )

    expect(queryAllByTestId('editorialCard')).toEqual([])

    rerender(withAppContext(<EditorialResults {...props} results={[{ ...result, type: null }]} />))
    expect(queryAllByTestId('editorialCard')).toEqual([])
  })

  describe('setting props for EditorialCard', () => {
    const defaultProps = {
      query: '',
      label: 'Label',
      loading: false,
      isOverviewPage: false,
      errors: [],
    }
    it('should set the correct props to EditorialCard', () => {
      const props = {
        ...defaultProps,
        type: CmsType.Article,
        results: [result],
      }
      render(withAppContext(<EditorialResults {...props} />))

      expect(EditorialCard).toHaveBeenNthCalledWith(
        1,
        {
          date: result.dateLocale,
          teaser: result.teaser,
          image: result.teaserImage,
          imageDimensions: [IMAGE_SIZE, IMAGE_SIZE],
          specialType: result.specialType,
          title: result.label,
          type: result.type,
          highlighted: false,
          showContentType: false,
          forwardedAs: expect.any(Object),
          to: toArticleDetail(result.id as string, result.slug as string),
        },
        {},
      )
    })

    it('should set the correct props for publications', () => {
      const props = {
        ...defaultProps,
        type: CmsType.Publication,
        results: [{ ...result, type: CmsType.Publication }],
      }

      render(withAppContext(<EditorialResults {...props} />))

      expect(EditorialCard).toHaveBeenNthCalledWith(
        1,
        {
          date: result.dateLocale,
          teaser: result.teaser,
          image: result.coverImage, // Publications use a different image source
          imageDimensions: [Math.ceil(IMAGE_SIZE * 0.7), IMAGE_SIZE], // Publications have vertically aligned images
          specialType: result.specialType,
          title: result.label,
          type: CmsType.Publication,
          highlighted: false,
          showContentType: false,
          forwardedAs: expect.any(Object),
          to: toPublicationDetail(result.id as string, result.slug as string),
        },
        {},
      )
    })

    it('should set the correct props for specials', () => {
      const props = {
        ...defaultProps,
        type: CmsType.Special,
        results: [{ ...result, type: CmsType.Special }],
      }

      render(withAppContext(<EditorialResults {...props} />))

      expect(EditorialCard).toHaveBeenNthCalledWith(
        1,
        {
          date: result.dateLocale,
          teaser: result.teaser,
          image: result.teaserImage, // Publications use a different image source
          imageDimensions: [IMAGE_SIZE, IMAGE_SIZE], // Publications have vertically aligned images
          specialType: result.specialType,
          title: result.label,
          type: CmsType.Special,
          highlighted: false,
          showContentType: false,
          forwardedAs: expect.any(Object),
          to: toSpecialDetail(result.id as string, result.slug as string),
        },
        {},
      )
    })
  })
})
