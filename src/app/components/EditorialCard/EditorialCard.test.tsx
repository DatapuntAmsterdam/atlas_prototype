import { render } from '@testing-library/react'
import { mocked } from 'ts-jest/utils'
import { CmsType, SpecialType } from '../../../shared/config/cms.config'
import { NOT_FOUND_THUMBNAIL } from '../../../shared/config/constants'
import getImageFromCms from '../../utils/getImageFromCms'
import EditorialCard from './EditorialCard'

jest.mock('../../utils/getImageFromCms')

const getImageFromCmsMock = mocked(getImageFromCms)

describe('EditorialCard', () => {
  const mockDataItem = {
    type: CmsType.Article,
    id: 1,
    title: 'long title',
    description: 'intro',
    image: 'thumbnail.jpg',
  }

  beforeEach(() => {
    getImageFromCmsMock.mockImplementation(() => 'image.jpg')
  })

  afterEach(() => {
    getImageFromCmsMock.mockReset()
  })

  it('should display a cover image', () => {
    const { container } = render(<EditorialCard {...mockDataItem} />)

    const image = container.querySelector('img')

    expect(image?.getAttribute('src')).toBe('image.jpg')
  })

  it('should not render when type is omitted', () => {
    const { container } = render(<EditorialCard {...mockDataItem} type={undefined} />)

    expect(container.firstChild).toBeNull()
  })

  it('should display the correct title', () => {
    const { container } = render(<EditorialCard {...mockDataItem} />)

    const heading = container.querySelector('h3')
    expect(heading?.textContent).toBe(mockDataItem.title)
  })

  it("should display a placeholder when there's no cover image", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { image: unusedImage, ...mockDataItems } = mockDataItem
    const { container } = render(<EditorialCard image={null} {...mockDataItems} />)

    const image = container.querySelector('img')

    expect(image?.getAttribute('src')).toBe(NOT_FOUND_THUMBNAIL)
  })

  it('should display a content type if enabled', () => {
    const { container, rerender, getByTestId } = render(<EditorialCard {...mockDataItem} />)

    expect(container.querySelectorAll('[data-testid="contentType"]').length).toBe(0)

    rerender(
      <EditorialCard
        {...mockDataItem}
        specialType={SpecialType.Animation}
        showContentType
        type={CmsType.Special}
      />,
    )

    expect(getByTestId('contentType')?.textContent).toBe(SpecialType.Animation)
  })

  it("should display a date there's one provided", () => {
    const { container, rerender, getByTestId } = render(
      <EditorialCard date="date" {...mockDataItem} />,
    )

    expect(getByTestId('metaText')?.textContent).toBe('date')

    rerender(
      <EditorialCard
        specialType={SpecialType.Dashboard}
        {...mockDataItem}
        type={CmsType.Special}
      />,
    )

    expect(container.querySelectorAll("[data-test='metaText']")?.length).toBe(0)
  })
})
