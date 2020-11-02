import React from 'react'
import { useSelector } from 'react-redux'
import { LatLngLiteral } from 'leaflet'
import { Link } from '@amsterdam/asc-ui'
import styled from 'styled-components'
import { isEmbedded } from '../../../shared/ducks/ui/ui'
import useGetLegacyPanoramaPreview from '../../../app/utils/useGetLegacyPanoramaPreview'

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

const MapDetailResultWrapper: React.FC<MapDetailResultWrapperProps> = ({
  children,
  subTitle,
  title,
  onMaximize,
  location,
}) => {
  const { panoramaUrl, link, linkComponent } = useGetLegacyPanoramaPreview(location as any)
  const isEmbed = useSelector(isEmbedded)

  return (
    <section className="map-detail-result">
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
          {panoramaUrl && (
            <img
              alt="Panoramabeeld"
              className="map-detail-result__header-pano"
              height="292"
              src={panoramaUrl}
              width="438"
            />
          )}
          <div className="map-detail-result__header-container">
            <h1 className="map-detail-result__header-title">{title}</h1>
            {subTitle && <h2 className="map-detail-result__header-subtitle">{subTitle}</h2>}
          </div>
        </StyledLink>
      </header>
      <div className="map-detail-result__scroll-wrapper">
        {children}
        <footer className="map-search-results__footer">
          <button
            type="button"
            className="map-search-results__button"
            onClick={onMaximize}
            title="Volledig weergeven"
          >
            <span
              className={`
                    map-search-results__button-icon
                    map-search-results__button-icon--maximize
                  `}
            />
            Volledig weergeven
          </button>
        </footer>
      </div>
    </section>
  )
}

export default MapDetailResultWrapper
