import { render, screen } from '@testing-library/react'
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
    render(<EditorialCard {...mockDataItem} />)

    const image = screen.getByRole('img')

    expect(image?.getAttribute('src')).toBe('image.jpg')
  })

  it('should not render when type is omitted', () => {
    const { container } = render(<EditorialCard {...mockDataItem} type={undefined} />)

    expect(container.firstChild).not.toBeInTheDocument()
  })

  it('should display the correct title', () => {
    render(<EditorialCard {...mockDataItem} />)

    expect(screen.getByText(mockDataItem.title)).toBeInTheDocument()
  })

  it("should display a placeholder when there's no cover image", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { image: unusedImage, ...mockDataItems } = mockDataItem
    render(<EditorialCard image={null} {...mockDataItems} />)

    const image = screen.getByRole('img')

    expect(image?.getAttribute('src')).toBe(NOT_FOUND_THUMBNAIL)
  })

  it('should display a content type if enabled', () => {
    const { rerender } = render(<EditorialCard {...mockDataItem} />)

    expect(screen.queryByTestId('contentType')).not.toBeInTheDocument()

    rerender(
      <EditorialCard
        {...mockDataItem}
        specialType={SpecialType.Animation}
        showContentType
        type={CmsType.Special}
      />,
    )

    expect(screen.getByTestId('contentType')?.textContent).toBe(SpecialType.Animation)
  })

  it("should display a date there's one provided", () => {
    const { rerender } = render(<EditorialCard date="date" {...mockDataItem} />)

    expect(screen.getByTestId('metaText')).toHaveTextContent('date')

    rerender(
      <EditorialCard
        specialType={SpecialType.Dashboard}
        {...mockDataItem}
        type={CmsType.Special}
      />,
    )

    expect(screen.queryByTestId('metaText')).not.toBeInTheDocument()
  })
})
