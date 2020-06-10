import React from 'react'
import { shallow } from 'enzyme'
import ConstructionFileDetail from './ConstructionFileDetail'

jest.mock('../../../shared/services/link-attributes-from-action/linkAttributesFromAction')

describe('ConstructionFileDetail', () => {
  let mockResults = {
    titel: 'title',
    documenten: [],
    datering: 'date',
    dossier_type: 'fileType',
    dossiernr: 1,
    stadsdeel: 'district',
    adressen: [],
  }
  let component = shallow(<ConstructionFileDetail {...mockResults} />)

  const setState = jest.fn()
  const useStateSpy = jest.spyOn(React, 'useState')
  useStateSpy.mockImplementation((init) => [init, setState])

  it('returns the component', () => {
    expect(component.at(0).exists()).toBeTruthy()
  })

  it('should set the title', () => {
    expect(component.at(0).find('Heading').at(0)).toBeTruthy()
    expect(component.at(0).find('Heading').at(0).props().children).toBe(mockResults.titel)
  })

  it('should render the subfiles', () => {
    mockResults = {
      ...mockResults,
      documenten: [{ subdossier_titel: 'documenten', bestanden: [] }],
    }

    component = shallow(<ConstructionFileDetail {...mockResults} />)

    expect(component.at(0).find('[data-testid="DocumentsHeading"]').at(0)).toBeTruthy()
    expect(
      component.at(0).find('[data-testid="DocumentsHeading"]').at(0).props().children,
    ).toContain(mockResults.documenten[0].subdossier_titel)

    expect(component.at(0).find('Gallery').at(0)).toBeTruthy()
    expect(component.at(0).find('Gallery').at(0).props().allFiles).toBe(
      mockResults.documenten[0].bestanden,
    )
  })

  it('should render the addresses', () => {
    const mockAdres = {
      nummeraanduidingen: ['1234'],
      nummeraanduidingen_label: ['foo'],
      verblijfsobjecten: [],
      verblijfsobjecten_label: [],
    }

    mockResults = {
      ...mockResults,
      adressen: [mockAdres],
    }

    component = shallow(<ConstructionFileDetail {...mockResults} />)

    expect(component.at(0).find('List').at(0)).toBeTruthy()
    expect(component.at(0).find('Link').at(0)).toBeTruthy()
    expect(component.at(0).find('Link').at(0).props().title).toBe(
      mockAdres.nummeraanduidingen_label[0],
    )
    expect(component.at(0).find('Link').at(0).props().children).toEqual(
      <span>{mockAdres.nummeraanduidingen_label[0]}</span>,
    )
  })
})
