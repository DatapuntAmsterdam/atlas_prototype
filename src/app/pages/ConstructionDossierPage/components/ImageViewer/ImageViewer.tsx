/* eslint-disable no-nested-ternary */
import {
  ChevronLeft,
  ChevronRight,
  Close,
  Download,
  Enlarge,
  Minimise,
} from '@amsterdam/asc-assets'
import { Button, themeColor } from '@amsterdam/asc-ui'
import usePromise, { isFulfilled, isRejected } from '@amsterdam/use-promise'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import type { Options, TileSourceOptions, Viewer } from 'openseadragon'
import { IIIFTileSource } from 'openseadragon'
import type { FunctionComponent } from 'react'
import { useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { fetchWithToken } from '../../../../../shared/services/api/api'
import { getAccessToken } from '../../../../../shared/services/auth/auth'
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage'
import useDownload from '../../../../utils/useDownload'
import { useAuthToken } from '../../AuthTokenContext'
import ContextMenu from '../ContextMenu'
import OSDViewer from '../OSDViewer'
import ViewerControls from '../ViewerControls'

const ImageViewerContainer = styled(OSDViewer)`
  background-color: ${themeColor('tint', 'level5')};
  color: transparent; // Hides error messages as they can't be hidden programmatically
  height: 100%;
  width: 100%;

  @media print {
    height: calc(
      100vh - 188px
    ); // Height of the printheader as defined in Angular (to be deprecated)
  }
`

const NavigationButtons = styled.div`
  display: flex;
  pointer-events: all;
`

const ZoomControls = styled.div`
  pointer-events: all;
`

export interface DossierFile {
  url: string
  filename: string
}

export interface ImageViewerProps {
  title: string
  selectedFileName: string
  files: DossierFile[]
  onClose: () => void
}

const ImageViewer: FunctionComponent<ImageViewerProps> = ({
  title,
  selectedFileName,
  files,
  onClose,
}) => {
  const { trackEvent } = useMatomo()
  const [downloadLoading, downloadFile] = useDownload()
  const accessToken = getAccessToken()
  const headers = accessToken.length > 0 ? { Authorization: `Bearer ${accessToken}` } : undefined
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [viewer, setViewer] = useState<Viewer>()
  const [selectedFileIndex, setSelectedFileIndex] = useState<number>(
    () => files.findIndex((file) => file.filename === selectedFileName) || 0,
  )
  const fileExtension = selectedFileName.split('.').pop()
  const isImage = !!fileExtension?.toLowerCase().match(/(jpg|jpeg|png|gif)/)
  const { token } = useAuthToken()
  const tokenQueryString = useMemo(
    () => (token ? `?${new URLSearchParams({ auth: token }).toString()}` : ''),
    [token],
  )

  function createTileSource(options: TileSourceOptions): IIIFTileSource {
    const tileSource = new IIIFTileSource(options)

    // Monkey patch the 'getTileUrl' method to return the URL including the token.
    tileSource.getTileUrl = function getTileUrlWithToken(...args) {
      return IIIFTileSource.prototype.getTileUrl.call(this, ...args) + tokenQueryString
    }

    return tileSource
  }

  async function fetchTileSourceData(file: string) {
    const tileOptions = await fetchWithToken(`${file}/info.json${tokenQueryString}`)
    const tileSource = createTileSource(tileOptions)

    return tileSource
  }

  async function fetchMultipleTileSourceData() {
    const tileSources: IIIFTileSource[] = []
    const requests = files.map((file) => fetchWithToken(`${file.url}/info.json${tokenQueryString}`))

    await Promise.all(requests).then((results) =>
      results.forEach((result) => tileSources.push(createTileSource(result))),
    )

    return tileSources
  }

  async function fetchViewerOptions(): Promise<Options> {
    const options = {
      preserveViewport: true,
      visibilityRatio: 1.0,
      minZoomLevel: 0,
      defaultZoomLevel: 0,
      sequenceMode: false,
      showNavigationControl: false,
      showReferenceStrip: true,
      showSequenceControl: false,
      loadTilesWithAjax: true,
      ajaxHeaders: headers,
    }

    if (files.length > 1) {
      return {
        ...options,
        sequenceMode: true,
        initialPage: selectedFileIndex > -1 ? selectedFileIndex : 1,
        tileSources: await fetchMultipleTileSourceData(),
      }
    }

    return {
      ...options,
      tileSources: [await fetchTileSourceData(files[0].url)],
    }
  }

  const viewerOptions = usePromise(() => fetchViewerOptions(), [])

  // Show an error if the viewer options could not be retrieved.
  useEffect(() => {
    if (isRejected(viewerOptions)) {
      setError(true)
    }
  }, [viewerOptions.status])

  function nextSlide() {
    const maxPages = files.length > 1 ? files.length - 1 : 1
    const currentPage = viewer?.currentPage() as number

    if (currentPage <= maxPages) {
      viewer?.goToPage(currentPage + 1)
    }
  }

  function prevSlide() {
    const currentPage = viewer?.currentPage() as number

    if (currentPage > 0) {
      viewer?.goToPage(currentPage - 1)
    }
  }

  function zoomIn() {
    viewer?.viewport.zoomBy(1.5)
  }

  function zoomOut() {
    viewer?.viewport.zoomBy(0.5)
  }

  function onPageChange() {
    if (viewer) {
      setSelectedFileIndex(viewer.currentPage())
    }
  }

  function handleDownload(imageUrl: string, filename: string, size: string) {
    downloadFile(imageUrl + tokenQueryString, { method: 'get', headers }, filename)

    trackEvent({
      category: 'download-bouwtekening',
      action: `bouwtekening-download-${size}`,
      name: filename,
    })
  }

  return (
    <>
      {isFulfilled(viewerOptions) && (
        <ImageViewerContainer
          options={viewerOptions.value}
          onInit={setViewer}
          onOpen={() => setLoading(false)}
          onOpenFailed={() => {
            setLoading(false)
            setError(true)
          }}
          onPageChange={onPageChange}
          data-testid="imageViewer"
        />
      )}

      {error && (
        <ErrorMessage
          data-testid="errorMessage"
          absolute
          message={
            isImage
              ? 'Er is een fout opgetreden bij het laden van dit bestand.'
              : 'Dit bestandsformaat kan niet worden weergegeven op deze pagina.'
          }
          buttonLabel={isImage ? 'Probeer opnieuw' : `Download bronbestand`}
          buttonIcon={!isImage && <Download />}
          buttonOnClick={
            isImage
              ? () => window.location.reload()
              : () =>
                  handleDownload(
                    `${files[selectedFileIndex].url}?source_file=true`, // If the file is not an image the source file should be downloadable
                    files[selectedFileIndex].filename,
                    'origineel',
                  )
          }
        />
      )}

      {!loading && (
        <ViewerControls
          metaData={[title, files[selectedFileIndex].filename]}
          topLeftComponent={
            files.length > 1 ? (
              <NavigationButtons data-testid="navigationControls">
                <Button
                  type="button"
                  variant="blank"
                  title="Vorige bestand"
                  size={32}
                  icon={<ChevronLeft />}
                  iconSize={15}
                  disabled={selectedFileIndex === 0}
                  onClick={prevSlide}
                />
                <Button
                  type="button"
                  variant="blank"
                  title="Volgende bestand"
                  size={32}
                  icon={<ChevronRight />}
                  iconSize={15}
                  disabled={selectedFileIndex === files.length - 1}
                  onClick={nextSlide}
                />
              </NavigationButtons>
            ) : null
          }
          topRightComponent={
            <Button
              type="button"
              variant="blank"
              title="Bestand sluiten"
              size={32}
              icon={<Close />}
              iconSize={15}
              onClick={onClose}
            />
          }
          bottomRightComponent={
            !error && (
              <ZoomControls data-testid="zoomControls">
                <Button
                  type="button"
                  variant="blank"
                  title="Inzoomen"
                  size={32}
                  iconSize={12}
                  onClick={zoomIn}
                  icon={<Enlarge />}
                />
                <Button
                  type="button"
                  variant="blank"
                  title="Uitzoomen"
                  size={32}
                  iconSize={12}
                  onClick={zoomOut}
                  icon={<Minimise />}
                />
              </ZoomControls>
            )
          }
          bottomLeftComponent={
            !error && (
              <ContextMenu
                handleDownload={handleDownload}
                downloadLoading={downloadLoading}
                file={files[selectedFileIndex]}
                isImage={isImage}
                data-testid="contextMenu"
              />
            )
          }
          data-testid="viewerControls"
        />
      )}
    </>
  )
}

export default ImageViewer
