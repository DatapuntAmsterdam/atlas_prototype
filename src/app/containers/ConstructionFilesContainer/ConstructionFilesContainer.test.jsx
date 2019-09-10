import React from 'react'
import { mount } from 'enzyme'
import configureMockStore from 'redux-mock-store'
import { ThemeProvider } from '@datapunt/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import ConstructionFilesContainer from './ConstructionFilesContainer'
import useDocumentTitle from '../../utils/useDocumentTitle'
import { getByUrl } from '../../../shared/services/api/api'
import SHARED_CONFIG from '../../../shared/services/shared-config/shared-config'

jest.mock('../../utils/useDocumentTitle')
jest.mock('../../../shared/services/api/api')
jest.mock('@datapunt/matomo-tracker-react')

describe('ConstructionFilesContainer', () => {
  let component
  const mockSetDocumentTitle = jest.fn()
  beforeEach(() => {
    useDocumentTitle.mockImplementation(() => ({
      documentTitle: 'foo',
      setDocumentTitle: mockSetDocumentTitle,
    }))
    useMatomo.mockImplementation(() => ({ trackPageView: jest.fn(), trackEvent: jest.fn() }))
    getByUrl.mockReturnValue({
      titel: 'foo',
      datering: '',
      dossier_type: '',
      dossiernr: 1,
      stadsdeel: '',
    })

    const store = configureMockStore()({
      ui: { isPrintMode: false },
      user: { scopes: ['BD/R'] },
      location: {
        payload: {
          id: `id12`,
        },
      },
    })

    component = mount(
      <ThemeProvider>
        <ConstructionFilesContainer fileName="foo" store={store} />
      </ThemeProvider>,
    )
  })

  it('should render', () => {
    expect(component).toMatchSnapshot()
  })

  it('should get the results', () => {
    expect(getByUrl).toHaveBeenCalledWith(`${SHARED_CONFIG.API_ROOT}stadsarchief/bouwdossier/12/`)
  })
})
