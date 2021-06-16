import Marzipano, { Scene, Viewer } from 'marzipano'
import { renderToStaticMarkup } from 'react-dom/server'
import type { Dispatch, SetStateAction } from 'react'
import type { TrackEventParams } from '@datapunt/matomo-tracker-react/lib/types'
import { PANORAMA_CONFIG } from '../panorama-api/panorama-api'
import {
  degreesToRadians,
  radiansToDegrees,
} from '../../../../../../shared/services/angle-conversion/angle-conversion'
import Hotspot from '../Hotspot'

/*
  Calculate height of the hotspots
  TODO: DP-6135 replace with height returned from the api
*/
function calculateHotspotPitch(height: number, distance: number) {
  return Math.atan(height / distance)
}

type TrackEvent = (params: TrackEventParams) => void | undefined

/*
  Create hotspot element that will be placed in the hotspot container
*/
function createHotspotTemplate(
  viewer: Viewer,
  scene: Scene,
  hotspot: any,
  onClickHandler: Dispatch<SetStateAction<null>>,
  trackEvent: TrackEvent,
) {
  const hotspotPitch = calculateHotspotPitch(PANORAMA_CONFIG.CAMERA_HEIGHT, hotspot.distance)

  const realLifeHotspotSize = 0.6
  const minDistance = 4
  const maxDistance = 21
  const viewport = 960

  /*
    All hotspots are shown, the min- and maxDistance variables are only used to determine
    the minimum and maximum hotspot size.
  */
  const correctedDistance = Math.min(maxDistance, Math.max(minDistance, hotspot.distance))
  const viewAngle = Math.atan(realLifeHotspotSize / correctedDistance)

  /*
    The actual hotspot size is dependent on the width of the straatbeeld and the FOV. For
    this first version we're making assumptions about the viewport and FOV.
    Offset is a value between 7 and 10 degrees depending on the distance. it is subtracted from
    the angle of the hotspot x rotation to render hotspots better that are far away
  */
  const offset = 5 / (maxDistance - correctedDistance + 1) + 8 // eslint-disable-line
  const angle = 90 - radiansToDegrees(hotspotPitch) - offset // eslint-disable-line

  const size = Math.round((radiansToDegrees(viewAngle) * viewport) / PANORAMA_CONFIG.DEFAULT_FOV)

  /*
    Create hotspot element and render to static markup ReactdomElement
  */
  const hotspotElement = document.createElement('div')
  hotspotElement.className = 'hotspot'
  hotspotElement.innerHTML = renderToStaticMarkup(
    // eslint-disable-next-line
    <Hotspot year={hotspot.year} size={size} angle={angle} />,
  )

  // Add onClick event to hotspot
  hotspotElement.addEventListener('click', () => {
    if (trackEvent) {
      trackEvent({
        category: 'kaart-2.0',
        action: 'panorama-hotspot',
      })
    }
    onClickHandler(hotspot.id)
  })

  const position = {
    yaw: degreesToRadians(hotspot.heading),
    pitch: hotspotPitch,
  }

  return scene.hotspotContainer().createHotspot(hotspotElement, position)
}

/*
  Set the initial Marzipano viewer that is tied to the ref in the PanoramaContainer
*/
export function initialize(domElement: HTMLElement) {
  return new Marzipano.Viewer(domElement, {
    stage: {
      preserveDrawingBuffer: true,
      width: 960,
    },
  })
}

/*
  Load the Marzipano viewer into its view components
*/
export function loadScene(
  viewer: Viewer,
  onClickHandler: Dispatch<SetStateAction<null>>,
  image: {
    preview: string
    pattern: string
  },
  heading: number,
  pitch: number,
  fov: number,
  hotspots: Array<{
    distance: number
  }>,
  trackEvent: TrackEvent,
) {
  const source = Marzipano.ImageUrlSource.fromString(image.pattern, {
    cubeMapPreviewUrl: image.preview,
  })

  const viewLimiter = Marzipano.RectilinearView.limit.traditional(
    PANORAMA_CONFIG.MAX_RESOLUTION,
    degreesToRadians(PANORAMA_CONFIG.MAX_FOV),
  )

  const view = new Marzipano.RectilinearView(null, viewLimiter)

  const scene = viewer.createScene({
    source,
    geometry: new Marzipano.CubeGeometry(PANORAMA_CONFIG.LEVEL_PROPERTIES_LIST),
    view,
    pinFirstLevel: true,
  })

  hotspots
    .sort((hotspotA, hotspotB) => hotspotB.distance - hotspotA.distance)
    .forEach((hotspot) => createHotspotTemplate(viewer, scene, hotspot, onClickHandler, trackEvent))

  view.setYaw(degreesToRadians(heading))
  view.setPitch(degreesToRadians(pitch))
  view.setFov(degreesToRadians(fov))

  return scene.switchTo()
}

/*
  Return the orientation values according to the view in Marzipano
*/
export function getOrientation(viewer: Viewer) {
  if (!viewer.view()) {
    // eslint-disable-next-line no-console
    console.warn('Viewer needs a view by creating a scene')
    return {}
  }
  const heading = radiansToDegrees(viewer.view().yaw())
  const pitch = radiansToDegrees(viewer.view().pitch())
  const fov = radiansToDegrees(viewer.view().fov())

  return {
    heading,
    pitch,
    fov,
  }
}
