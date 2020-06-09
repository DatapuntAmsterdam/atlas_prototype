import React, { useEffect, useState } from 'react'
import { Paragraph, Spinner } from '@datapunt/asc-ui'
import { mapPanelComponents } from '@datapunt/arm-core'
import { LatLng } from 'leaflet'
import { Overlay } from '../types'

const { MapPanelContent } = mapPanelComponents

type Props = {
  setLocation: (latLng: LatLng) => void
  location: LatLng
  currentOverlay: Overlay
}

const PointSearchResults: React.FC<Props> = ({ setLocation, currentOverlay, location }) => {
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    setLoading(true)
    // Fake loading time
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }, [location])
  return (
    <MapPanelContent
      title="Resultaten"
      animate
      stackOrder={currentOverlay === Overlay.Results ? 2 : 1}
      onClose={() => {
        setLocation(null)
      }}
    >
      {loading ? (
        <Spinner />
      ) : (
        <Paragraph>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Excepturi nobis odit reiciendis
          totam! Ad adipisci alias aliquid beatae commodi, consequatur cumque debitis delectus
          dolorem eius error fugit, harum hic iure labore laborum laudantium minima, neque non nulla
          quam quibusdam sapiente similique sit suscipit ut vel vero! Accusamus ad consequatur
          dolore esse, facere fugiat illum maxime mollitia nihil optio, quasi quisquam reprehenderit
          saepe sunt totam unde vel veniam veritatis vero voluptates.
        </Paragraph>
      )}
    </MapPanelContent>
  )
}

export default PointSearchResults
