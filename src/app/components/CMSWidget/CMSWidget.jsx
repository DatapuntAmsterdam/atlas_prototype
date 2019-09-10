/* eslint-disable react/no-danger */
import React from 'react'
import RouterLink from 'redux-first-router-link'
import getContents from '../../../shared/services/google-sheet/google-sheet'
import { routing } from '../../routes'
import formatDate from '../../../shared/services/date-formatter/date-formatter'
import './CMSWidget.scss'
import LoadingIndicator from '../../../shared/components/loading-indicator/LoadingIndicator'

const CMSWidget = ({ type, limit }) => {
  const [feed, setFeed] = React.useState(null)
  const [entries, setEntries] = React.useState([])

  React.useEffect(() => {
    let setContent = true
    ;(async () => {
      await getContents(type).then(contents => {
        if (setContent) {
          setFeed(contents.feed)
          setEntries(contents.entries.slice(0, limit))
        }
      })
    })()

    return () => {
      setContent = false
    }
  }, [])

  return (
    <>
      <h1 className="u-padding__left--3 c-homepage__news-header">Nieuws</h1>
      {feed ? (
        <>
          <div className="u-grid">
            {entries.map(entry => (
              <div key={entry.id} className="u-col-sm--4">
                <div className="c-user-content-widget__news-entry">
                  <h2 className="c-user-content-widget__news-title">
                    {entry.verkorteTitel.isHref ? (
                      <div
                        className="o-btn
                            o-btn--link
                            s-cms-widget-content
                            s-cms-widget-content--inline
                            s-cms-widget-content--link"
                        dangerouslySetInnerHTML={{
                          __html: entry.verkorteTitel.html,
                        }}
                      />
                    ) : (
                      <RouterLink className="c-link" to={{ type: routing.nieuws.type }}>
                        <div
                          className="s-cms-widget-content s-cms-widget-content--inline"
                          dangerouslySetInnerHTML={{
                            __html: entry.verkorteTitel.html,
                          }}
                        />
                      </RouterLink>
                    )}
                  </h2>

                  <div
                    className="c-user-content-widget__news-content s-cms-widget-content"
                    dangerouslySetInnerHTML={{
                      __html: entry.verkorteContent.html,
                    }}
                  />
                  {entry.datum && entry.datum.date ? (
                    <div className="c-user-content-widget__news-date">
                      {formatDate(entry.datum.date)}
                    </div>
                  ) : null}
                </div>
              </div>
            ))}
            <div className="u-clearfix" />
          </div>
          <div className="u-padding__left--3 c-homepage__news-show-more">
            <RouterLink to={{ type: routing.nieuws.type }} className="o-btn o-btn--link">
              Nieuwsoverzicht
            </RouterLink>
          </div>
        </>
      ) : (
        <LoadingIndicator />
      )}
    </>
  )
}

export default CMSWidget
