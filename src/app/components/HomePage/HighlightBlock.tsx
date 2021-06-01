import { breakpoint, styles, themeSpacing } from '@amsterdam/asc-ui'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import usePromise, { isFulfilled, isPending, isRejected } from '@amsterdam/use-promise'
import styled from 'styled-components'
import cmsConfig from '../../../shared/config/cms.config'
import getImageFromCms from '../../utils/getImageFromCms'
import ErrorMessage, { ErrorBackgroundCSS } from '../ErrorMessage/ErrorMessage'
import HighlightCard from './HighlightCard'
import OverviewLink from './OverviewLink'
import { fetchListFromCms } from '../../utils/fetchFromCms'
import { routing } from '../../routes'

const HighlightBlockStyle = styled.div<{ showError: boolean }>`
  position: relative;
  width: 100%;

  ${({ showError }) => showError && ErrorBackgroundCSS}
`

const HighlightBlockInnerStyle = styled.section`
  display: flex;
  flex-wrap: wrap;
`

const ImageCardWrapperLarge = styled.div`
  flex-basis: 100%;
  margin-bottom: ${themeSpacing(5)};
  line-height: 0;

  @media screen and ${breakpoint('min-width', 'tabletM')} {
    flex-basis: calc(${100 - 100 / 3}% - ${themeSpacing(6)});
    margin-right: ${themeSpacing(6)};
    margin-bottom: 0;
  }
`

const ImageCardWrapperSmall = styled.div`
  justify-content: flex-start;
  display: flex;
  flex-wrap: nowrap;
  flex-basis: calc(${100 / 3}% - ${themeSpacing(6)});
  flex-direction: column;

  // Set a margin-bottom on the last item in ImageCardWrapperSmall
  ${/* sc-selector */ styles.LinkStyle}:first-child {
    margin-bottom: ${themeSpacing(5)};

    @media screen and ${breakpoint('min-width', 'tabletM')} {
      margin-bottom: ${themeSpacing(6)};
    }
  }

  ${styles.ImageCardContentStyle} {
    padding: ${themeSpacing(2, 4)};
  }

  @media screen and ${breakpoint('min-width', 'mobileL')} and ${breakpoint(
      'max-width',
      'tabletM',
    )} {
    flex-basis: 100%;
    flex-direction: row;

    ${/* sc-selector */ styles.LinkStyle}:first-child {
      margin-right: ${themeSpacing(5)};
    }
  }

  @media screen and ${breakpoint('max-width', 'mobileL')} {
    flex-basis: 100%;
  }
`

const HighlightBlock = () => {
  const [retryCount, setRetryCount] = useState(0)

  const result = usePromise(
    () => fetchListFromCms(cmsConfig.HOME_HIGHLIGHT.endpoint(), cmsConfig.HOME_HIGHLIGHT.fields),
    [retryCount],
  )

  const loading = isPending(result)
  const error = isRejected(result)

  return (
    <>
      <HighlightBlockStyle showError={isRejected(result)} data-test="highlight-block">
        {isRejected(result) && (
          <ErrorMessage
            absolute
            message="Er is een fout opgetreden bij het laden van dit blok."
            buttonLabel="Probeer opnieuw"
            buttonOnClick={() => setRetryCount(retryCount + 1)}
          />
        )}
        <HighlightBlockInnerStyle>
          <ImageCardWrapperLarge>
            {/*
            // @ts-ignore */}
            <HighlightCard
              loading={loading}
              showError={error}
              {...(isFulfilled(result) && result.value[0])}
              teaserImage={
                isFulfilled(result) && result.value[0]?.teaserImage
                  ? getImageFromCms(result.value[0].teaserImage, 900, 900)
                  : null
              }
              styleAs="h2"
            />
          </ImageCardWrapperLarge>
          <ImageCardWrapperSmall>
            {isFulfilled(result) && result.value.length
              ? result.value
                  .slice(1)
                  .map(({ id, teaserImage, title, linkProps }) => (
                    <HighlightCard
                      key={id}
                      linkProps={linkProps}
                      loading={false}
                      showError={false}
                      title={title}
                      teaserImage={teaserImage ? getImageFromCms(teaserImage, 500, 500) : null}
                    />
                  ))
              : null}
            {error ||
              (loading && (
                <>
                  <HighlightCard title="" key={0} loading={loading} showError={error} />
                  <HighlightCard title="" key={1} loading={loading} showError={error} />
                </>
              ))}
          </ImageCardWrapperSmall>
        </HighlightBlockInnerStyle>
      </HighlightBlockStyle>
      <OverviewLink
        linkProps={{
          to: {
            pathname: routing.articleSearch.path,
          },
          forwardedAs: Link,
        }}
        label="Bekijk overzicht"
        title="Bekijk het overzicht van alle artikelen"
      />
    </>
  )
}

export default HighlightBlock
