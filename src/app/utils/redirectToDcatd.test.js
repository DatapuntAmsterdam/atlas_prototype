import redirectToDcatd, {
  DCATD_DETAIL_REDIRECT_URL,
  DCATD_LIST_REDIRECT_URL,
} from './redirectToDcatd'
import { routing } from '../routes'

describe('redirectToDcatd', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        setItem: jest.fn(),
      },
    })
    Object.defineProperty(window, 'location', {
      value: {
        assign: jest.fn(),
      },
    })
  })

  it('should set the variables to redirect in the session storage', () => {
    const id = '123'

    redirectToDcatd(id)

    expect(global.sessionStorage.setItem).toHaveBeenCalledWith(
      DCATD_DETAIL_REDIRECT_URL,
      document.location.href,
    )

    expect(global.sessionStorage.setItem).toHaveBeenCalledWith(
      DCATD_LIST_REDIRECT_URL,
      `${document.location.origin}${routing.datasetSearch.path}`,
    )
  })

  it('should redirect the user', () => {
    const id = '123'

    redirectToDcatd(id)

    expect(window.location.assign).toHaveBeenCalledWith(`/dcatd_admin/#/datasets/${id}`)
  })
})
