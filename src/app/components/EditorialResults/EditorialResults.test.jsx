import { shallow } from 'enzyme'
import React from 'react'
import { CmsType } from '../../../shared/config/cms.config'
import EditorialResults, { IMAGE_SIZE } from './EditorialResults'

describe('EditorialResults', () => {
  let component

  const result = {
    id: '1',
    specialType: false,
    slug: 'slug',
    coverImage: '123.jpg',
    teaserImage: '456.jpg',
    dateLocale: 'locale',
    label: 'label',
    teaser: 'long text',
    type: CmsType.Article,
  }

  it('should display the loading indicator', () => {
    component = shallow(
      <EditorialResults type={CmsType.Article} loading results={[]} errors={[]} />,
    )

    expect(component.find('Styled(Spinner)').exists()).toBe(true)

    component = shallow(
      <EditorialResults type={CmsType.Article} loading={false} results={[]} errors={[]} />,
    )

    expect(component.find('Styled(Spinner)').exists()).toBe(false)
  })

  it('should render the cards', () => {
    component = shallow(<EditorialResults type={CmsType.Article} results={[]} errors={[]} />)
    expect(component.find('EditorialCard').exists()).toBe(false)

    // Should render two cards
    component = shallow(
      <EditorialResults type={CmsType.Article} results={[result, result]} errors={[]} />,
    )
    expect(component.find('EditorialCard').exists()).toBe(true)
    expect(component.find('EditorialCard')).toHaveLength(2)
  })

  it('should set the correct props', () => {
    component = shallow(<EditorialResults type={CmsType.Article} results={[result]} errors={[]} />)

    const editorialCard = component.find('EditorialCard')

    expect(editorialCard.exists()).toEqual(true)
    expect(editorialCard.props()).toMatchObject({
      date: result.dateLocale,
      description: result.teaser,
      image: result.teaserImage,
      imageDimensions: [IMAGE_SIZE, IMAGE_SIZE],
      specialType: result.specialType,
      title: result.label,
      type: result.type,
      to: {
        payload: {
          id: result.id,
          slug: result.slug,
        },
      },
    })
  })

  it('should set the correct props for publications', () => {
    component = shallow(
      <EditorialResults
        type={CmsType.Publication}
        results={[{ ...result, type: CmsType.Publication }]}
        errors={[]}
      />,
    )

    const editorialCard = component.find('EditorialCard')

    expect(editorialCard.exists()).toEqual(true)
    expect(editorialCard.props()).toMatchObject({
      image: result.coverImage, // Publications use a different image source
      imageDimensions: [Math.ceil(IMAGE_SIZE * 0.7), IMAGE_SIZE], // Publications have vertically aligned images
    })
  })

  it('should set the correct props for specials', () => {
    component = shallow(
      <EditorialResults
        type={CmsType.Special}
        results={[{ ...result, type: CmsType.Special, specialType: 'foo' }]}
        errors={[]}
      />,
    )

    const editorialCard = component.find('EditorialCard')

    expect(editorialCard.exists()).toEqual(true)
    expect(editorialCard.props()).toMatchObject({
      to: {
        payload: {
          id: result.id,
          type: 'foo', // The special type is important for constructing the route
          slug: result.slug,
        },
      },
      date: result.dateLocale,
    })
  })
})
