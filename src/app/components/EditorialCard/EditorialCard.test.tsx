import React from 'react'
import { render } from '@testing-library/react'
import EditorialCard from './EditorialCard'
import getImageFromCms from '../../utils/getImageFromCms'
import { CmsType, SpecialType } from '../../../shared/config/cms.config'

jest.mock('../../utils/getImageFromCms')

describe('EditorialCard', () => {
  const mockDataItem = {
    type: CmsType.Article,
    id: 1,
    title: 'long title',
    description: 'intro',
    image: 'thumbnail.jpg',
  }

  beforeEach(() => {
    // @ts-ignore
    getImageFromCms.mockImplementation(() => 'image.jpg')
  })

  it('should display a cover image', () => {
    const { container } = render(<EditorialCard {...mockDataItem} />)

    const image = container.querySelector('img')

    expect(image?.getAttribute('src')).toBe('image.jpg')
  })

  it('should display the correct title', () => {
    const { container } = render(<EditorialCard {...mockDataItem} />)

    const heading = container.querySelector('h3')
    expect(heading?.textContent).toBe(mockDataItem.title)
  })

  it("should display a placeholder when there's no cover image", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { image: unusedImage, ...mockDataItems } = mockDataItem
    const { container } = render(<EditorialCard {...mockDataItems} />)

    const image = container.querySelector('img')

    expect(image?.getAttribute('src')).toBe('/assets/images/not_found_thumbnail.jpg')
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
