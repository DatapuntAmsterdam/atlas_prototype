import React from 'react'
import { fireEvent, render } from '@testing-library/react'
import fetch from 'jest-fetch-mock'
import withMapContext from '../../../utils/withMapContext'
import DetailPanel from './DetailPanel'
import stadsdeelResponse from '../../../../api/gebieden/stadsdeel.json'
import environment from '../../../../environment'
import { routing } from '../../../routes'

const pushMock = jest.fn()
jest.mock('react-router-dom', () => ({
  // @ts-ignore
  ...jest.requireActual('react-router-dom'),
  useHistory: () => ({
    push: pushMock,
  }),
  useLocation: () => ({
    search: '?pano={"shouldBe": "removed"}&thisOne="should_not"',
  }),
  useParams: () => ({
    type: 'gebieden',
    subtype: 'stadsdeel',
    id: '124',
  }),
}))

describe('DetailPanel', () => {
  it('should navigate back to geoSearch page, without pano parameter, when closing the panel', async () => {
    fetch.mockIf(`${environment.API_ROOT}gebieden/stadsdeel/124/`, () =>
      Promise.resolve(JSON.stringify(stadsdeelResponse)),
    )

    const { findByTitle } = render(withMapContext(<DetailPanel />))

    const button = await findByTitle('Sluit')
    expect(pushMock).not.toHaveBeenCalled()

    fireEvent.click(button)

    expect(pushMock).toHaveBeenCalledWith({
      pathname: routing.dataSearchGeo.path,
      search: 'thisOne=%22should_not%22',
    })
  })
})
