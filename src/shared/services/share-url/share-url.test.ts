import getShareUrl, { ShareTarget } from './share-url'

describe('getShareUrl', () => {
  const windowSpy = jest.spyOn(window, 'window', 'get')
  const location = { href: 'https://amsterdam.nl' } as Location
  const document = { title: 'Gemeente Amsterdam' } as Document

  windowSpy.mockImplementation(() => ({ location, document } as typeof window))

  it('should open up a share url', () => {
    let shareUrl = getShareUrl(ShareTarget.Facebook)

    expect(shareUrl?.url).toContain(window.location.href)
    expect(shareUrl?.url).toContain(window.document.title)
    expect(shareUrl?.target).toBe('_blank')

    shareUrl = getShareUrl(ShareTarget.Twitter)

    expect(shareUrl?.url).toContain(window.location.href)
    expect(shareUrl?.url).toContain(window.document.title)
    expect(shareUrl?.target).toBe('_blank')

    shareUrl = getShareUrl(ShareTarget.LinkedIn)

    expect(shareUrl?.url).toContain(window.location.href)
    expect(shareUrl?.url).toContain(window.document.title)
    expect(shareUrl?.target).toBe('_blank')

    shareUrl = getShareUrl(ShareTarget.Email)

    expect(shareUrl?.url).toContain(escape(window.location.href))
    expect(shareUrl?.target).toBe('_self')
  })
})
