import React from 'react'
import { shallow } from 'enzyme'
import DatasetCard from './DatasetCard'

describe('DatasetCard', () => {
  const mockDatasetItem = {
    shortTitle: 'title',
    teaser: 'the teaser text',
    modified: 'modified',
    lastModified: 'last modified',
    distributionTypes: ['format1', 'format2'],
  }

  it('should display the title and teaser', () => {
    const component = shallow(<DatasetCard href="link" {...mockDatasetItem} />).dive()

    const heading = component.find('Styled(Heading)')
    expect(heading.exists()).toBeTruthy()
    expect(heading.props().children).toBe(mockDatasetItem.shortTitle)

    const paragraph = component.find('Styled(Paragraph)')
    expect(paragraph.exists()).toBeTruthy()
    expect(paragraph.props()?.dangerouslySetInnerHTML?.__html).toBe(mockDatasetItem.teaser)
  })

  it('should display the date', () => {
    const component = shallow(<DatasetCard href="link" {...mockDatasetItem} />).dive()

    const metaText = component.find("[data-test='metaText']").at(0)

    expect(metaText.exists()).toBeTruthy()
    expect(metaText.props().datetime).toBe(mockDatasetItem.modified)
    expect(metaText.props().children).toBe(mockDatasetItem.lastModified)
  })

  it('should display the formats', () => {
    const component = shallow(<DatasetCard href="link" {...mockDatasetItem} />).dive()

    const metaText = component.find("[data-test='metaText']").at(1)

    expect(metaText.exists()).toBeTruthy()

    const tags = metaText.find('Styled(Tag)')

    expect(tags.at(0).exists()).toBe(true)
    expect(tags.at(1).exists()).toBe(true)

    expect(tags.at(0).props().children).toEqual(mockDatasetItem.distributionTypes[0])

    expect(tags.at(1).props().children).toEqual(mockDatasetItem.distributionTypes[1])
  })
})
