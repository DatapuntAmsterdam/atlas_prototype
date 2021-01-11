import { useState, useEffect } from 'react'

/* istanbul ignore next */
const EmbedHeader = ({ closeAction }) => {
  const [embedLink, setEmbedLink] = useState('')
  const [iframe, setIframe] = useState('')

  useEffect(() => {
    // Todo: figure out a better way to embed a map
    // (e.g. by only sharing locations / results instead of just any state of the map)
    // Now we need to check the URL of the iFrame, as this can change
    const iframeObject = document.getElementById('atlas-iframe-map')
    const setUrlFromIframe = () => {
      if (iframeObject) {
        const {
          location: { href },
        } = iframeObject.contentWindow
        setEmbedLink(href)
        setIframe(`<iframe width="500" height="400" src="${href}"></iframe>`)
      }
    }

    setUrlFromIframe()

    const iframeChecker = window.setInterval(setUrlFromIframe, 500)

    return function cleanup() {
      window.clearInterval(iframeChecker)
    }
  }, [])

  const selectField = (event) => event.target.select()

  return (
    <div className="u-grid">
      <div className="u-row">
        <div className="u-col-sm--3">
          <h1 className="c-embed-header__title">Embedversie</h1>
        </div>
        <div className="u-col-sm--9">
          <nav>
            <button type="button" onClick={closeAction} className="c-embed-header__close" />
          </nav>
        </div>
      </div>
      <form className="c-embed-header__form">
        <div className="u-row c-embed-header__form-row qa-embed-header-form-link">
          <label
            htmlFor="linkField"
            className="u-col-sm--2 c-embed-header__field-label qa-embed-header-form-label"
          >
            Link
          </label>
          <div className="u-col-sm--10 c-embed-header__field-value">
            <input
              id="linkField"
              className="c-embed-header-form__input qa-embed-header-form-input"
              type="text"
              onClick={selectField}
              onChange={(e) => {
                setEmbedLink(e.target.value)
              }}
              value={embedLink}
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              spellCheck="false"
              placeholder="Link"
            />
          </div>
        </div>
        <div className="u-row c-embed-header__form-row qa-embed-header-form-html">
          <label
            htmlFor="iframe-field"
            className="u-col-sm--2 c-embed-header__field-label qa-embed-header-form-label"
          >
            HTML-code
          </label>
          <div className="u-col-sm--10 c-embed-header__field-value">
            <input
              id="iframe-field"
              className="c-embed-header-form__input qa-embed-header-form-input"
              type="text"
              onClick={selectField}
              onChange={(e) => {
                setIframe(e.target.value)
              }}
              value={iframe}
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              spellCheck="false"
              placeholder="Link"
            />
          </div>
        </div>
      </form>
    </div>
  )
}

export default EmbedHeader
