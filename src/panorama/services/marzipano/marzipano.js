import Marzipano from 'marzipano';
import { PANORAMA_CONFIG } from '../panorama-api/panorama-api';
import { degreesToRadians, radiansToDegrees } from '../../../shared/services/angle-conversion/angle-conversion';

function calculateHotspotPitch(height, distance) {
  return Math.atan(height / distance);
}

function createHotspotTemplate(viewer, scene, view, hotspot) {
  const hotspotPitch = calculateHotspotPitch(PANORAMA_CONFIG.CAMERA_HEIGHT, hotspot.distance);

  const realLifeHotspotSize = 0.6;
  const minDistance = 4;
  const maxDistance = 21;
  const viewport = 960;

  /*
  All hotspots are shown, the min- and maxDistance variables are only used to determine
  the minimum and maximum hotspot size.
  */
  const correctedDistance = Math.min(maxDistance, Math.max(minDistance, hotspot.distance));
  const viewAngle = Math.atan(realLifeHotspotSize / correctedDistance);

  /*
  The actual hotspot size is dependent on the width of the straatbeeld and the FOV. For
  this first version we're making assumptions about the viewport and FOV.
  Offset is a value between 7 and 10 degrees depending on the distance. it is subtracted from
  the angle of the hotspot x rotation to render hotspots better that are far away
  */
  const offset = (5 / (maxDistance - correctedDistance + 1)) + 8; // eslint-disable-line
  const angle = (90 - radiansToDegrees(hotspotPitch) - offset); // eslint-disable-line

  const size = Math.round((radiansToDegrees(viewAngle) * viewport) / PANORAMA_CONFIG.DEFAULT_FOV);
  const transform = `rotateX(${angle} deg)`;

  // Add hotspot.
  const hotspotContainer =
    new Marzipano.HotspotContainer(viewer.domElement(), scene, view, viewer.renderLoop());

  const hotspotElement = document.createElement('div');
  hotspotElement.className = 'hotspot';
  hotspotElement.setAttribute('scene-id', hotspot.id);
  hotspotElement.setAttribute('distance', hotspot.distance);
  hotspotElement.setAttribute('pitch', hotspotPitch);
  hotspotElement.setAttribute('year', hotspot.year);

  const hotspotButtonElement = document.createElement('button');
  hotspotButtonElement.className = `c-hotspot c-hotspot--year-${hotspot.year} qa-hotspot-button`;

  const hotspotRotationElement = document.createElement('div');
  hotspotRotationElement.className = 'qa-hotspot-rotation';
  hotspotRotationElement.setAttribute(
    'style', `width: ${size}px; height: ${size}px; transform: ${transform}`
  );

  const hotspotImageElement = document.createElement('div');
  hotspotImageElement.className = 'c-hotspot__image';
  hotspotImageElement.setAttribute(
    'style', `width: ${size}px; height: ${size}px; transform: ${transform}`
  );

  const hotspotAriaElement = document.createElement('span');
  hotspotAriaElement.className = 'u-sr-only';
  hotspotAriaElement.innerElement = 'Navigeer naar deze locatie';

  hotspotButtonElement.appendChild(hotspotImageElement);
  hotspotButtonElement.appendChild(hotspotRotationElement);
  hotspotButtonElement.appendChild(hotspotAriaElement);
  hotspotElement.appendChild(hotspotButtonElement);

  const position = {
    yaw: degreesToRadians(hotspot.heading),
    pitch: hotspotPitch
  };

  return hotspotContainer.createHotspot(hotspotElement, position);
}

export function initialize(domElement) {
  const viewer = new Marzipano.Viewer(domElement, {
    stageType: null,
    stage: {
      preserveDrawingBuffer: true
    }
  });

  return viewer;
}

export function loadScene(viewer, image, heading, pitch, fov, hotspots) {
  const source = Marzipano.ImageUrlSource.fromString(
    image.pattern,
    { cubeMapPreviewUrl: image.preview }
  );

  const viewLimiter = Marzipano.RectilinearView.limit.traditional(
    PANORAMA_CONFIG.MAX_RESOLUTION,
    degreesToRadians(PANORAMA_CONFIG.MAX_FOV)
  );

  const view = new Marzipano.RectilinearView({}, viewLimiter);

  const scene = viewer.createScene({
    source,
    geometry: new Marzipano.CubeGeometry(PANORAMA_CONFIG.LEVEL_PROPERTIES_LIST),
    view,
    pinFirstLevel: true
  });

  const hotspotsObject = JSON.parse(JSON.stringify(hotspots));

  hotspotsObject // Do not mutate someone else's data collection!
    .sort((hotspotA, hotspotB) => hotspotB.distance - hotspotA.distance)
    .forEach((hotspot) => createHotspotTemplate(viewer, scene, view, hotspot));

  view.setYaw(degreesToRadians(heading));
  view.setPitch(degreesToRadians(pitch));
  view.setFov(degreesToRadians(fov));

  scene.switchTo();
}

export function getOrientation(viewer) {
  const heading = radiansToDegrees(viewer.view().yaw());
  const pitch = radiansToDegrees(viewer.view().pitch());
  const fov = radiansToDegrees(viewer.view().fov());

  return {
    heading,
    pitch,
    fov
  };
}
