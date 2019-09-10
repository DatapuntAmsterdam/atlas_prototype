// const MapDetailResultItem = ({ label, value, link, hasMultiline, status = '' }) => {
//   return (
//     value && (
//       <li className="map-detail-result__item">
//         <section className="map-detail-result__item-content">
//           <div className="map-detail-result__item-label">{label}</div>
//           <div
//             className={`map-detail-result__item-value${
//               hasMultiline ? '--multiline' : ''
//             }           ${
//               status && status.length ? `map-detail-result__item-value--${status}` : ''
//             }`}
//           >
//             {link ? (
//               <a
//                 className="o-btn o-btn--link map-detail-result__item-value--inline"
//                 href={link}
//                 rel="noopener noreferrer"
//                 target="_blank"
//               >
//                 {value}
//               </a>
//             ) : (
//               value
//             )}
//           </div>
//         </section>
//       </li>
//     )
//   )
// }

import React from 'react'
import { shallow } from 'enzyme'
import MapDetailResultItem from './MapDetailResultItem'

describe('MapDetailResultItem', () => {
  let component
  let props

  afterEach(() => {
    jest.resetAllMocks()
  })

  it('should display the item', () => {
    props = {
      label: 'label',
      value: 'value',
    }

    component = shallow(<MapDetailResultItem {...props} />)

    expect(component.find('li').exists()).toBeTruthy()
  })

  it('should not display the item without value', () => {
    props = {
      label: 'label',
    }

    component = shallow(<MapDetailResultItem {...props} />)

    expect(component.find('li').exists()).toBeFalsy()
  })

  it('should display the item with a multiline', () => {
    props = {
      label: 'label',
      value: 'value',
      hasMultiline: true,
    }

    component = shallow(<MapDetailResultItem {...props} />)

    expect(component.find('.map-detail-result__item-value--multiline').exists()).toBeTruthy()
  })

  it('should display the item with a status', () => {
    props = {
      label: 'label',
      value: 'value',
      status: 'foo',
    }

    component = shallow(<MapDetailResultItem {...props} />)

    expect(component.find(`.map-detail-result__item-value--${props.status}`).exists()).toBeTruthy()
  })

  it('should make the item clickable', () => {
    props = {
      label: 'label',
      value: 'value',
      link: 'foo',
    }

    component = shallow(<MapDetailResultItem {...props} />)

    expect(component.find('a').exists()).toBeTruthy()
    expect(component.find('a').props().children).toBe(props.value)
    expect(component.find('a').props().href).toBe(props.link)
  })
})
