/* eslint-disable no-use-before-define,no-underscore-dangle */
/* global L */
import debounce from 'lodash.debounce'
import defer from 'lodash.defer'
import isEqual from 'lodash.isequal'
import { isBusy, start } from '../suppress/suppress'
import drawToolConfig from './draw-tool.config'

// holds all information about the state of the shape being created or edited
const DEFAULTS = {
  isConsistent: true,
  type: null,
  layer: null,
  layerPrev: null,
  markers: [],
  markersPrev: [],
  markersEdit: [],
  deleteMarker: {},
  markersMaxCount: drawToolConfig.MAX_MARKERS,
  area: 0,
  areaTxt: '',
  distance: 0,
  distanceTxt: '',
}

export let currentShape = { ...DEFAULTS } // eslint-disable-line import/no-mutable-exports

// holds all information of the leaflet.draw drawing and editing structures
export const drawTool = {
  drawingMode: drawToolConfig.DRAWING_MODE.NONE,
  drawnItems: null,
  drawShapeHandler: null,
  editShapeHandler: null,
  // these callback methods will be called on a finished polygon and on a change of drawing mode
  onFinishShape: () => {},
  onDrawingMode: () => {},
  onUpdateShape: () => {},
}

// initialise factory; initialise draw tool, register callback methods and register events
export function initialize(
  map,
  onFinishShapeCallback,
  onDrawingModeCallback,
  onUpdateShapeCallback,
) {
  currentShape = { ...DEFAULTS }

  initDrawTool(map)

  // callback method to call on finish draw/edit polygon
  drawTool.onFinishShape = onFinishShapeCallback
  // callback method to call on change of drawing mode
  drawTool.onDrawingMode = onDrawingModeCallback
  // callback method to call on change of shape
  drawTool.onUpdateShape = onUpdateShapeCallback

  registerDrawEvents()
  registerMapEvents()
}

export function destroy() {
  unregisterMapEvents()
  unregisterDrawEvents()
  deleteAllMarkers()
  deletePolygon()
  cancel()
}

// triggered when a polygon has changed to a new valid state
function onChangePolygon() {
  // add class to drawn polygon
  if (currentShape.layer && currentShape.layer._path) {
    L.DomUtil.addClass(currentShape.layer._path, 'c-map__leaflet-drawn-polygon')
  }

  // update the publicly available shape info, applyAsync because triggered by a leaflet event
  updateShape()

  if (!isEqual(currentShape.markers, currentShape.markersPrev)) {
    defer(() => {
      // call any registered callback function, applyAsync because triggered by a leaflet event
      drawTool.onUpdateShape(currentShape)
    })
  }

  // triggered when the drawing mode has changed
  setDrawingMode(drawTool.drawingMode)

  currentShape.markersPrev = [...currentShape.markers]
}

// Construct a polygon from an array of coordinates
export function setPolygon(latLngs) {
  // Save the previous layer
  currentShape.layerPrev = currentShape.layer
  deletePolygon() // delete any existing polygon
  if (latLngs.length > 0) {
    createPolygon(new L.Polygon(latLngs))
  }
  updateShape()
}

// Delete an existing polygon
function deletePolygon() {
  if (currentShape.layer) {
    currentShape.layer.off('click', toggleEditModeOnShapeClick)
    drawTool.drawnItems.removeLayer(currentShape.layer)
    drawTool.map.fire(L.Draw.Event.DELETED, {
      layers: currentShape.layer,
    })
    currentShape.layer = null // No current layer after delete polygon
  }
}

// Create a new polygon by registering the layer, show the layer and register a click
// handler to start/end edit
export function createPolygon(layer) {
  currentShape.layer = layer
  drawTool.drawnItems.addLayer(layer)
  drawTool.drawnItems.bringToFront()
  layer.on('click', toggleEditModeOnShapeClick)
}

// Called when a polygon is finished (end draw or end edit)
export function finishPolygon() {
  currentShape.markersEdit = []
  if (drawTool.drawingMode === drawToolConfig.DRAWING_MODE.EDIT && !currentShape.isConsistent) {
    // Exit edit mode with an inconsistent shape; restore previous shape
    setPolygon([...currentShape.markersPrev])
    updateShape()
  } else if (
    drawTool.drawingMode === drawToolConfig.DRAWING_MODE.DRAW &&
    currentShape.markers.length <= 1 &&
    currentShape.layerPrev
  ) {
    // Exit draw mode without having drawn a line or shape;
    // Restore the previous polygon layer if available
    createPolygon(currentShape.layerPrev)
    updateShape()
  }
  setPolygon(currentShape.markers)
  // Silently change the drawing mode
  setDrawingMode(drawToolConfig.DRAWING_MODE.NONE)
  drawTool.onFinishShape(currentShape)
}

// updates the drawing mode and trigger any callback method
function setDrawingMode(drawingMode) {
  if (drawTool.drawingMode !== drawingMode) {
    drawTool.drawingMode = drawingMode
    drawTool.onDrawingMode(drawingMode)
  }
}

function clearTexts(obj) {
  return Object.keys(obj).reduce(
    (acc, key) => ({
      ...acc,
      [key]:
        // eslint-disable-next-line no-nested-ternary
        typeof obj[key] === 'object'
          ? clearTexts(obj[key])
          : typeof obj[key] === 'string'
          ? ''
          : obj[key],
    }),
    {},
  )
}

// Initialisation of the draw tool, initialise drawing and register required objects
// in the drawTool object
function initDrawTool(map) {
  L.drawLocal = clearTexts(L.drawLocal)
  L.drawLocal.format = drawToolConfig.format

  drawTool.map = map
  drawTool.drawnItems = new L.FeatureGroup()
  drawTool.drawShapeHandler = new L.Draw.Polygon(drawTool.map, drawToolConfig.draw.polygon)

  const editConfig = { ...drawToolConfig.edit }
  editConfig.featureGroup = drawTool.drawnItems
  const editToolbar = new L.EditToolbar(editConfig)

  drawTool.editShapeHandler = editToolbar.getModeHandlers(drawTool.map)[0].handler

  drawTool.map.addLayer(drawTool.drawnItems)
}

// enforce the maximum markers limit and the non-intersection of line segments limit
export function enforceLimits() {
  if (!currentShape.isConsistent) {
    const markersPrev = [...currentShape.markersPrev] // restore previous state

    deletePolygon() // delete current polygon

    setPolygon(markersPrev) // restore previous polygon
    updateShape()
  } else {
    // check for auto close of shape in drawing mode
    autoClose()
    onChangePolygon() // trigger change on new consistent state of the polygon
  }
}

// Auto close polygon when in drawing mode and max markers has been reached
export function autoClose() {
  if (
    drawTool.drawingMode === drawToolConfig.DRAWING_MODE.DRAW &&
    currentShape.markers.length === currentShape.markersMaxCount
  ) {
    disable()
  }
}

// handle any leaflet.draw event
export function handleDrawEvent(eventName, e) {
  const handlers = {
    // Triggered when the user has chosen to draw a particular vector or marker
    DRAWSTART: () => setDrawingMode(drawToolConfig.DRAWING_MODE.DRAW),

    // Triggered when the user has chosen to exit the drawing mode
    DRAWSTOP: finishPolygon,

    // Triggered when a vertex is created on a polyline or polygon
    DRAWVERTEX: bindLastDrawnMarker,

    // Triggered when a new vector or marker has been created
    CREATED: () => {
      createPolygon(e.layer)
      finishPolygon()
    },

    // Triggered when the user starts edit mode by clicking the edit tool button
    EDITSTART: () => setDrawingMode(drawToolConfig.DRAWING_MODE.EDIT),

    EDITVERTEX: editVertex,

    // Triggered when the user has finshed editing (edit mode) and saves edits
    EDITSTOP: finishPolygon,

    // Triggered when layers have been removed (and saved) from the FeatureGroup
    DELETED: () => {
      currentShape.layer = null
    },
  }

  const handler = handlers[eventName]
  if (handler) {
    handler(e)
  }
}

function editVertex(vertex) {
  ;[currentShape.markersEdit] = vertex.poly._latlngs
}

// Every leaflet.draw event is catched, thereby taking care that the shape is always up-to-date,
// that all limits are respected and that the last consistent state gets exposed by the
// drawing tool
function registerDrawEvents() {
  Object.keys(L.Draw.Event).forEach((eventName) => {
    drawTool.map.on(L.Draw.Event[eventName], (e) => {
      if (eventName === 'DELETED') {
        // IE HACK
        start(300)
      }

      handleDrawEvent(eventName, e)

      updateShape() // Update current shape and tooltip

      // Force Leaflet to enable TextSelection
      L.DomUtil.enableTextSelection()

      // Execute this code after leaflet.draw has finished the event
      defer(() => {
        enforceLimits() // max vertices, auto close when max reached
      })
    })
  })

  // fix for firefox onUpdateShape not fired
  defer(() => {
    onChangePolygon()
  })
}

function unregisterDrawEvents() {
  Object.keys(L.Draw.Event).forEach((eventName) => {
    drawTool.map.off(L.Draw.Event[eventName])
  })
}

// register any non-leaflet.draw events
function registerMapEvents() {
  drawTool.map.on('click', onMapClick)
  drawTool.map.on('layeradd', onMapLayerAdd)
}

function unregisterMapEvents() {
  drawTool.map.off('layeradd', onMapLayerAdd)
  drawTool.map.off('click', onMapClick)
}

// Click outside shape => delete shape
function onMapClick() {
  if (isBusy()) {
    return
  }

  // In edit mode => disable()
  if (drawTool.drawingMode === drawToolConfig.DRAWING_MODE.EDIT) {
    disable()
  } else if (drawTool.drawingMode !== drawToolConfig.DRAWING_MODE.DRAW && currentShape.layer) {
    // If not in Draw or EDIT mode and a polygon exists
    // then the current polygon gets deleted
    // Note: In draw mode the click on map adds a new marker
    deletePolygon()
    updateShape()
    disable()
    drawTool.onFinishShape(currentShape)
  }
}

// When a new layer gets added to the map...
function onMapLayerAdd() {
  // ...make sure the layer of the drawn shape stays on top,
  // so it can still be clicked to enter edit mode.
  // This will not affect markers, they'll stay on top anyway.
  drawTool.drawnItems.bringToFront()
}

// Click on the shape toggles EDIT mode
function toggleEditModeOnShapeClick(e) {
  if (isBusy()) {
    return
  }
  L.DomEvent.stop(e)
  toggle()
}

// toggle between draw/edit (enable) and show mode (null)
function toggle() {
  return isEnabled() ? disable() : enable()
}

export function isEnabled() {
  // isEnabled => shape is being created or being edited
  return drawTool.drawingMode !== drawToolConfig.DRAWING_MODE.NONE
}

// start draw or edit mode for current layer or start create mode for new shape
// the outside only knows enabled or disabled, internally the mode is further defined
// in DRAW or EDIT
export function enable() {
  if (!isEnabled()) {
    if (currentShape.layer) {
      // Shape exists, start edit
      drawTool.editShapeHandler.enable()
    } else {
      // Shape does not yet exist, start draw
      drawTool.drawShapeHandler.enable()
    }
  }
}

// end of draw or edit mode => in create mode complete shape, in edit mode save shape
export function disable() {
  if (isEnabled()) {
    if (drawTool.drawingMode === drawToolConfig.DRAWING_MODE.DRAW) {
      if (currentShape.markers.length > 1) {
        // Close the polyline between the first and last points
        drawTool.drawShapeHandler.completeShape()
      } else {
        deleteAllMarkers()
        drawTool.drawShapeHandler.disable()
      }
    } else {
      drawTool.editShapeHandler.save() // Save the layer geometries
      drawTool.editShapeHandler.disable()
    }
    setDrawingMode(drawToolConfig.DRAWING_MODE.NONE)
  }
}

// Cancel drawing => disable the draw tool and do not save anything
// that has been drawn
export function cancel() {
  if (isEnabled()) {
    if (drawTool.drawingMode === drawToolConfig.DRAWING_MODE.DRAW) {
      deleteAllMarkers()
      drawTool.drawShapeHandler.disable()
    } else {
      drawTool.editShapeHandler.disable()
    }
    // Silently change the drawing mode
    setDrawingMode(drawToolConfig.DRAWING_MODE.NONE)
  }
}

// Shape method for shape.info
// while drawing the polygon is not closed => distance is distance of the lines
// When editing the polygon is closed => distance is surrounding
// When only two points => distance is line length
function getDistance(latLngs, isClosed) {
  return latLngs.reduce(
    (total, latlng, i) => {
      if (i > 0) {
        const dist = latlng.distanceTo(latLngs[i - 1])
        return total + dist
      }
      return total
    },
    isClosed && latLngs.length > 2 ? latLngs[0].distanceTo(latLngs[latLngs.length - 1]) : 0,
  )
}

// Update the internal information about the current shape
export function updateShape() {
  const DISTANCE_IN_KILOMETERS = 1000 // Show in km starting from this #meters, else show in m

  let latLngs = []
  let area = 0
  let distance = 0
  let intersects = false

  if (currentShape.layer) {
    ;[latLngs] = currentShape.layer.getLatLngs()
    distance = getDistance(latLngs, true)
    area = L.GeometryUtil.geodesicArea(latLngs)
    intersects = currentShape.layer.intersects()
  } else if (drawTool.drawShapeHandler._markers && drawTool.drawShapeHandler._markers.length > 0) {
    latLngs = drawTool.drawShapeHandler._markers.map((m) => m._latlng)
    area = drawTool.drawShapeHandler._area
    distance = getDistance(latLngs, false)
  } else if (currentShape.markersEdit.length > 0) {
    latLngs = currentShape.markersEdit
    distance = getDistance(latLngs, true)
  }

  currentShape.markers = latLngs.map(({ lat, lng }) => [lat, lng])
  currentShape.area = area
  currentShape.areaTxt = L.GeometryUtil.readableArea(
    area,
    drawToolConfig.draw.polygon.metric,
    drawToolConfig.draw.polygon.precision,
  )
  currentShape.distance = distance
  if (distance >= DISTANCE_IN_KILOMETERS) {
    currentShape.distanceTxt = `${L.GeometryUtil.formattedNumber(
      distance / DISTANCE_IN_KILOMETERS,
      2,
    )} km`
  } else {
    currentShape.distanceTxt = `${L.GeometryUtil.formattedNumber(distance, 1)} m`
  }
  currentShape.intersects = intersects

  currentShape.isConsistent = !(
    currentShape.markers.length > currentShape.markersMaxCount || currentShape.intersects
  )

  if (currentShape.isConsistent) {
    L.drawLocal.edit.handlers.edit.tooltip.text = currentShape.areaTxt
    L.drawLocal.edit.handlers.edit.tooltip.subtext = currentShape.distanceTxt
  }
}

// Delete all markers in DRAW mode
function deleteAllMarkers() {
  if (!isEnabled()) {
    return
  }

  const firstMarker = drawTool?.drawShapeHandler?._markers?.[0]

  if (firstMarker) {
    currentShape.deleteMarker = firstMarker
    deleteMarker()
  }
}

// delete a marker in DRAW mode
function deleteMarker() {
  const marker = currentShape.deleteMarker
  const { drawShapeHandler } = drawTool
  const markers = drawShapeHandler._markers // is always an array
  const index = markers.findIndex((m) => m._leaflet_id === marker._leaflet_id)
  let nDelete = markers.length - index // Delete all from last to marker, inclusive
  while (nDelete > 0) {
    // Remove the last vertex from the polyline, removes polyline from map if only one point
    // exists
    markers[markers.length - 1].off('click')
    markers[markers.length - 1].off('mousedown')
    drawShapeHandler.deleteLastVertex()
    nDelete -= 1
  }
}

const debouncedDeleteMarker = debounce(() => deleteMarker(), 300, {
  leading: true,
  trailing: false,
})

// returns the last marker that was added to the polygon (only called in draw mode)
function getLastDrawnMarker() {
  const { drawShapeHandler } = drawTool
  return drawShapeHandler._markers[drawShapeHandler._markers.length - 1]
}

// bind last marker in DRAW mode to deleteMarker
// bind first marker in DRAW mode to close polygon (by calling disable())
function bindLastDrawnMarker() {
  const lastMarker = getLastDrawnMarker()
  const isFirstMarker = drawTool.drawShapeHandler._markers.length === 1
  ;['mousedown', 'click'].forEach((key) =>
    lastMarker.on(key, () => {
      if (drawTool.drawShapeHandler.enabled()) {
        // click on map automatically creates a new marker -> remove that first
        if (isFirstMarker) {
          const isLineOrPolygon = currentShape.markers.length > 1
          disable() // Includes auto close for any line or polygon
          if (!isLineOrPolygon) {
            if (currentShape.markers.length) {
              setPolygon([])
            }
            // Reopen draw mode to place first marker somewhere else
            enable()
          }
        } else {
          currentShape.deleteMarker = lastMarker
          debouncedDeleteMarker()
        }
      }
    }),
  )
}

export const isDrawingActive = (drawingMode) => drawingMode !== drawToolConfig.DRAWING_MODE.NONE

/* eslint-enable no-use-before-define,no-underscore-dangle */
