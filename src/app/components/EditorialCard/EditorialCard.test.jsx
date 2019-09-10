import React from 'react'
import { shallow } from 'enzyme'
import EditorialCard from './EditorialCard'

describe('EditorialCard', () => {
  const mockDataItem = {
    id: 1,
    title: 'title',
    field_intro: 'intro',
    teaserImageUrl: 'thumbnail.jpg',
  }

  it('should display a cover image', () => {
    const component = shallow(<EditorialCard href="link" dataItem={mockDataItem} />).dive()

    const image = component.find('Image')

    expect(image.exists()).toBeTruthy()
    expect(image.props().src).toBe('thumbnail.jpg')
  })

  it("should display a placeholder when there's no cover image", () => {
    const component = shallow(
      <EditorialCard href="link" dataItem={{ ...mockDataItem, teaserImageUrl: false }} />,
    ).dive()

    const image = component.find('Image')

    expect(image.exists()).toBeTruthy()
    expect(image.props().src).toBe('../assets/images/not_found_thumbnail.jpg')
  })

  it("should display a tag when there's one provided", () => {
    const component = shallow(
      <EditorialCard
        href="link"
        dataItem={{
          ...mockDataItem,
          field_special_type: 'foo',
        }}
      />,
    ).dive()

    const tag = component.find('Styled(Tag)')

    expect(tag.exists()).toBeTruthy()
    expect(tag.props().children).toBe('foo')
  })
})
