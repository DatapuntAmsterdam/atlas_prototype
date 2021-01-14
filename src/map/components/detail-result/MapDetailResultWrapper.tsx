import { Heading, Button, Link, themeSpacing } from '@amsterdam/asc-ui'
import { LatLngLiteral } from 'leaflet'
import { FunctionComponent } from 'react'
import { useSelector } from 'react-redux'
import styled from 'styled-components'
import PanoAlert from '../../../app/components/PanoAlert/PanoAlert'
import useGetLegacyPanoramaPreview from '../../../app/utils/useGetLegacyPanoramaPreview'
import Maximize from '../../../shared/assets/icons/icon-maximize.svg'
import { isEmbedded } from '../../../shared/ducks/ui/ui'
import { getUser } from '../../../shared/ducks/user/user'

export interface MapDetailResultWrapperProps {
  title: string
  location?: LatLngLiteral
  subTitle?: string | null
  onMaximize: () => void
  children: React.ReactNode
}

const StyledLink = styled(Link)`
  padding: 0;
  height: 100%;
  width: 100%;
`

const Header = styled.header`
  margin: 0 ${themeSpacing(3)};
`

const MapDetailResultWrapper: FunctionComponent<MapDetailResultWrapperProps> = ({
  children,
  subTitle,
  title,
  onMaximize,
  location,
}) => {
  const { panoramaUrl, link, linkComponent } = useGetLegacyPanoramaPreview(location as any)
  const isEmbed = useSelector(isEmbedded)
  const user = useSelector(getUser)

  return (
    <section className="map-detail-result">
      {panoramaUrl && user.authenticated ? (
        <header
          className={`
      map-detail-result__header
      map-detail-result__header--${!isEmbed && panoramaUrl ? 'pano' : 'no-pano'}
    `}
        >
          <StyledLink
            to={link || ''}
            as={linkComponent}
            title={panoramaUrl ? 'Panoramabeeld tonen' : 'Geen Panoramabeeld beschikbaar'}
          >
            <img
              alt="Panoramabeeld"
              className="map-detail-result__header-pano"
              height="292"
              src={panoramaUrl}
              width="438"
            />
            <div className="map-detail-result__header-container">
              <h1 className="map-detail-result__header-title">{title}</h1>
              {subTitle && <h2 className="map-detail-result__header-subtitle">{subTitle}</h2>}
            </div>
          </StyledLink>
        </header>
      ) : (
        <PanoAlert />
      )}
      <div className="map-detail-result__scroll-wrapper">
        {!user.authenticated && (
          <Header>
            <Heading styleAs="h4">{title}</Heading>
            {subTitle && (
              <Heading styleAs="h6" as="h2">
                {subTitle}
              </Heading>
            )}
          </Header>
        )}
        {children}
        <footer className="map-search-results__footer">
          <Button
            type="button"
            onClick={onMaximize}
            title="Volledig weergeven"
            iconLeft={<Maximize />}
            iconSize={21}
          >
            Volledig weergeven
          </Button>
        </footer>
      </div>
    </section>
  )
}

export default MapDetailResultWrapper
