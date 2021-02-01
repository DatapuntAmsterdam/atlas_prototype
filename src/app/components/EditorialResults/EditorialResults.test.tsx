import { fireEvent, render } from '@testing-library/react'
import { CmsType, SpecialType } from '../../../shared/config/cms.config'
import EditorialResults from './EditorialResults'
import { CMSResultItem } from '../../utils/useFromCMS'
import { LOADING_SPINNER_TEST_ID } from '../LoadingSpinner/LoadingSpinner'
import withAppContext from '../../utils/withAppContext'
import {
  EDITORIAL_CARD_CONTENT_TYPE_TEST_ID,
  EDITORIAL_CARD_TEST_ID,
} from '../EditorialCard/EditorialCard'
import {
  ERROR_MESSAGE_RELOAD_BUTTON_TEST_ID,
  ERROR_MESSAGE_TEST_ID,
} from '../ErrorMessage/ErrorMessage'

describe('EditorialResults', () => {
  const { location } = window

  beforeAll(() => {
    // @ts-ignore
    delete window.location
    // @ts-ignore
    window.location = { reload: jest.fn() }
  })

  afterAll(() => {
    window.location = location
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

  it('should render AuthAlert', () => {
    const props = {
      query: '',
      label: 'Label',
      loading: false,
      isOverviewPage: false,
      type: CmsType.Article,
      results: [],
      errors: [
        {
          message: 'Auth Error',
          path: ['articleSearch'],
          extensions: {
            label: 'No access',
            code: 'UNAUTHORIZED',
          },
        },
      ],
    }
    const { getByTestId } = render(withAppContext(<EditorialResults {...props} />))

    expect(getByTestId('auth-alert')).toBeDefined()
  })
  it('should render ErrorMessage', () => {
    const props = {
      query: '',
      label: 'Label',
      loading: false,
      isOverviewPage: false,
      type: CmsType.Article,
      results: [],
      errors: [
        {
          message: 'Just an error',
          path: ['articleSearch'],
        },
      ],
    }
    const { getByTestId } = render(withAppContext(<EditorialResults {...props} />))

    expect(getByTestId(ERROR_MESSAGE_TEST_ID)).toBeDefined()
    fireEvent.click(getByTestId(ERROR_MESSAGE_RELOAD_BUTTON_TEST_ID))
    expect(window.location.reload).toHaveBeenCalled()
  })

  describe('passing the right props to EditorialCard', () => {
    const defaultProps = {
      query: '',
      label: 'Label',
      loading: false,
      isOverviewPage: false,
      errors: [],
    }

    it('should show the right fields for Article results', () => {
      const props = {
        ...defaultProps,
        type: CmsType.Article,
        results: [result],
      }
      const { queryByTestId } = render(withAppContext(<EditorialResults {...props} />))

      // It should not show the content field
      expect(queryByTestId(EDITORIAL_CARD_CONTENT_TYPE_TEST_ID)).toBeNull()

      // It should not pass highlight: true to EditorialCard
      const style = window.getComputedStyle(
        queryByTestId(EDITORIAL_CARD_TEST_ID)?.childNodes[0] as Element,
      )
      expect(style.paddingTop).toBe('')

      // It should build the right URL
      expect(queryByTestId(EDITORIAL_CARD_TEST_ID)?.closest('a')).toHaveAttribute(
        'href',
        '/artikelen/artikel/slug/1/',
      )
    })

    it('should show the right fields for Publication results', () => {
      const props = {
        ...defaultProps,
        type: CmsType.Publication,
        results: [{ ...result, type: CmsType.Publication }],
      }

      const { queryByTestId } = render(withAppContext(<EditorialResults {...props} />))

      // It should not show the content field
      expect(queryByTestId(EDITORIAL_CARD_CONTENT_TYPE_TEST_ID)).toBeNull()

      // It should not pass highlight: true to EditorialCard
      const style = window.getComputedStyle(
        queryByTestId(EDITORIAL_CARD_TEST_ID)?.childNodes[0] as Element,
      )
      expect(style.paddingTop).toBe('')

      // It should build the right URL
      expect(queryByTestId(EDITORIAL_CARD_TEST_ID)?.closest('a')).toHaveAttribute(
        'href',
        '/publicaties/publicatie/slug/1/',
      )
    })

    it('should show the right fields for Special results', () => {
      const props = {
        ...defaultProps,
        type: CmsType.Special,
        results: [{ ...result, specialType: SpecialType.Animation, type: CmsType.Special }],
      }

      const { queryByTestId } = render(withAppContext(<EditorialResults {...props} />))

      // It should not show the content field
      expect(queryByTestId(EDITORIAL_CARD_CONTENT_TYPE_TEST_ID)).toHaveTextContent('animatie')

      // It should not pass highlight: true to EditorialCard
      const style = window.getComputedStyle(
        queryByTestId(EDITORIAL_CARD_TEST_ID)?.childNodes[0] as Element,
      )
      expect(style.paddingTop).toBe('')

      // It should build the right URL
      expect(queryByTestId(EDITORIAL_CARD_TEST_ID)?.closest('a')).toHaveAttribute(
        'href',
        '/specials/animatie/slug/1/',
      )
    })

    it('should show the right fields for Collection results', () => {
      const props = {
        ...defaultProps,
        type: CmsType.Collection,
        isOverviewPage: true,
        results: [{ ...result, type: CmsType.Collection }],
      }

      const { queryByTestId } = render(withAppContext(<EditorialResults {...props} />))

      // It should not show the content field
      expect(queryByTestId(EDITORIAL_CARD_CONTENT_TYPE_TEST_ID)).toBeNull()

      // It should pass highlight: true to EditorialCard
      const style = window.getComputedStyle(
        queryByTestId(EDITORIAL_CARD_TEST_ID)?.childNodes[0] as Element,
      )
      expect(style.paddingTop).toBe('8px')

      // It should build the right URL
      expect(queryByTestId(EDITORIAL_CARD_TEST_ID)?.closest('a')).toHaveAttribute(
        'href',
        '/dossiers/dossier/slug/1/',
      )
    })
  })
})
