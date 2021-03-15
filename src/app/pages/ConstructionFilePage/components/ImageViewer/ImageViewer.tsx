/* eslint-disable no-nested-ternary */
import { Close, Download, Enlarge, Minimise } from '@amsterdam/asc-assets'
import { Button, themeColor } from '@amsterdam/asc-ui'
import { useMatomo } from '@datapunt/matomo-tracker-react'
import { Options, Viewer } from 'openseadragon'
import { FunctionComponent, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import styled, { css } from 'styled-components'
import { isPrintMode } from '../../../../../shared/ducks/ui/ui'
import { getAccessToken } from '../../../../../shared/services/auth/auth-legacy'
import { ConstructionFiles as ContextMenu } from '../../../../components/ContextMenu'
import ErrorMessage from '../../../../components/ErrorMessage/ErrorMessage'
import useDownload from '../../../../utils/useDownload'
import OSDViewer from '../OSDViewer'
import ViewerControls from '../ViewerControls'

const ImageViewerContainer = styled(OSDViewer)<{ $printMode: boolean }>`
  background-color: ${themeColor('tint', 'level5')};
  color: transparent; // Hides error messages as they can't be hidden programmatically
  height: 100%;
  width: 100%;

  ${({ $printMode }) =>
    $printMode &&
    css`
      height: calc(
        100vh - 188px
      ); // Height of the printheader as defined in Angular (to be deprecated)
    `}
`

export interface ImageViewerProps {
  title: string
  fileName: string
  fileUrl: string
  onClose: () => void
}

const ImageViewer: FunctionComponent<ImageViewerProps> = ({
  title,
  fileName,
  fileUrl,
  onClose,
}) => {
  const { trackEvent } = useMatomo()
  const [downloadLoading, downloadFile] = useDownload()
  const printMode = useSelector(isPrintMode)
  const accessToken = useSelector(getAccessToken)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [viewer, setViewer] = useState<Viewer>()
  const viewerOptions = useMemo<Options>(
    () => ({
      preserveViewport: true,
      visibilityRatio: 1.0,
      minZoomLevel: 0,
      defaultZoomLevel: 0,
      sequenceMode: true,
      showNavigationControl: false,
      showSequenceControl: false,
      loadTilesWithAjax: true,
      ajaxHeaders: {
        authorization: `Bearer ${accessToken || ''}`,
      },
      tileSources: [`${fileUrl}/info.json`],
    }),
    [],
  )

  const fileExtension = fileName.split('.').pop()
  const isImage = !!fileExtension?.toLowerCase().match(/(jpg|jpeg|png|gif)/)

  function zoomIn() {
    viewer?.viewport.zoomBy(1.5)
  }

  function zoomOut() {
    viewer?.viewport.zoomBy(0.5)
  }

  function handleDownload(imageUrl: string, size: string) {
    downloadFile(
      imageUrl,
      {
        method: 'get',
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
      fileName,
    )

    trackEvent({
      category: 'download-bouwtekening',
      action: `bouwtekening-download-${size}`,
      name: fileName,
    })
  }

  return (
    <>
      <ImageViewerContainer
        options={viewerOptions}
        $printMode={printMode}
        onInit={setViewer}
        onOpen={() => setLoading(false)}
        onOpenFailed={() => {
          setLoading(false)
          setError(true)
        }}
        data-testid="imageViewer"
      />

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
                    `${fileUrl}?source_file=true`, // If the file is not an image the source file should be downloadable
                    'origineel',
                  )
          }
        />
      )}

      {!loading && (
        <ViewerControls
          metaData={[title, fileName]}
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
              <div>
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
                fileUrl={fileUrl}
                isImage={isImage}
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
