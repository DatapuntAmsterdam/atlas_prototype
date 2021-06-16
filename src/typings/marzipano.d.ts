/* eslint-disable @typescript-eslint/no-empty-interface,@typescript-eslint/ban-types */
declare module 'marzipano' {
  const value: any
  export default value

  interface View {}

  interface Source {}

  interface Geometry {}

  interface CreateSceneOpts {
    view: View
    source: Source
    geometry: Geometry
    pinFirstLevel?: boolean
    textureStoreOpts?: any
    layerOpts?: any
  }

  interface SwitchSceneOpts {
    transitionDuration?: number
    transitionUpdate?: number
  }

  type Stage = EventTarget & {}

  export interface Scene {
    switchTo(opts?: SwitchSceneOpts): void
    hotspotContainer(): HotspotContainer
  }

  export interface RectilinearViewCoords {
    yaw: number
    pitch: number
  }

  interface FlatViewCoords {
    x: number
    y: number
  }

  interface HotspotOpts {
    perspective: {
      radius?: number
      extraTransforms?: string
    }
  }

  export interface HotspotContainer {
    createHotspot(
      domElement: Element,
      coords: RectilinearViewCoords | FlatViewCoords,
      opts?: HotspotOpts,
    ): Hotspot
    destroy(): void
    destroyHotspot(hotspot: Hotspot): void
    domElement(): Element
    hasHotspot(hotspot: Hotspot): boolean
    hide(): void
    listHotspot(): Array<Hotspot>
    rect(): Rect
    setRect(rect: Rect): void
    show(): void
  }

  export interface Hotspot {
    destroy(): void
    domElement(): Element
    hide(): void
    perspective(): any
    position(): any
    setPerspective(perspective: any): void
    setPosition(coords: any): void
    show(): void
  }

  export interface Viewer {
    createScene(opts: CreateSceneOpts): Scene
    stage(): Stage
    destroy(): void
    view(): {
      yaw(): number
      pitch(): number
      fov(): number
    }
    destroyScene(scene: Scene): void
  }

  interface Rect {}

  export interface RectilinearViewParams {
    yaw: number
    pitch: number
    roll: number
    fov: number
  }

  export interface RectilinearViewLimiter {
    min: number
    max: number
  }

  class RectilinearView {
    limit: {
      traditional: (maxResolution: number, radian: number) => RectilinearViewLimiter
    }
    constructor(parameters: RectilinearViewParams, limiter: RectilinearViewLimiter)
  }
}
