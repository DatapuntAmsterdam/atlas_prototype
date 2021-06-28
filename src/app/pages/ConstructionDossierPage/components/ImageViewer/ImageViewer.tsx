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
import type { Options, Viewer } from 'openseadragon'
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

interface File {
  url: string
  filename: string
}

export interface ImageViewerProps {
  title: string
  selectedFileName: string
  files: File[]
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
  const fileExtension = selectedFileName.split('.').pop()
  const isImage = !!fileExtension?.toLowerCase().match(/(jpg|jpeg|png|gif)/)
  const { token } = useAuthToken()
  const tokenQueryString = useMemo(
    () => (token ? `?${new URLSearchParams({ auth: token }).toString()}` : ''),
    [token],
  )

  const [selectedFileIndex, setSelectedFileIndex] = useState(() => {
    const idx = files.findIndex((file) => file.filename === selectedFileName)

    return idx || 0
  })

  async function fetchTileSourceData(file: string) {
    const tileOptions = await fetchWithToken(`${file}/info.json${tokenQueryString}`)
    const tileSource = new IIIFTileSource(tileOptions)

    // Monkey patch the 'getTileUrl' method to return the URL including the token.
    tileSource.getTileUrl = function getTileUrlWithToken(...args) {
      return IIIFTileSource.prototype.getTileUrl.call(this, ...args) + tokenQueryString
    }

    return tileSource
  }

  async function getMultipleTileSourceData() {
    const tileSources: any[] = []

    await Promise.all(
      files.map(async (file) => tileSources.push(await fetchTileSourceData(file.url))),
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
      // If the user didn't select the first image in the collection set the correct starting index
      // const selectedFileIndex = files.findIndex((file) => file.filename === fileName)

      return {
        ...options,
        sequenceMode: true,
        initialPage: selectedFileIndex > -1 ? selectedFileIndex : 0,
        tileSources: await getMultipleTileSourceData(),
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
      setSelectedFileIndex(selectedFileIndex + 1)
    }
  }

  function prevSlide() {
    const currentPage = viewer?.currentPage() as number

    if (currentPage > 0) {
      viewer?.goToPage(currentPage - 1)
      setSelectedFileIndex(selectedFileIndex - 1)
    }
  }

  function zoomIn() {
    viewer?.viewport.zoomBy(1.5)
  }

  function zoomOut() {
    viewer?.viewport.zoomBy(0.5)
  }

  function handleDownload(imageUrl: string, size: string) {
    downloadFile(imageUrl + tokenQueryString, { method: 'get', headers }, selectedFileName)

    trackEvent({
      category: 'download-bouwtekening',
      action: `bouwtekening-download-${size}`,
      name: selectedFileName,
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
              <>
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
              </>
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
              <div data-testid="zoomControls">
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
              </div>
            )
          }
          bottomLeftComponent={
            !error && (
              <ContextMenu
                handleDownload={handleDownload}
                downloadLoading={downloadLoading}
                fileUrl={files[selectedFileIndex].url}
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
