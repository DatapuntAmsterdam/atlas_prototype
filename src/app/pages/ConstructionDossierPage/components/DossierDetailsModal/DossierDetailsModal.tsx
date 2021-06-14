import type { FunctionComponent } from 'react'
import type { Bestand } from '../../../../../api/iiif-metadata/bouwdossier'
import type { DossierDetailsModalType } from '../DossierDetails/DossierDetails'
import LoginLinkRequestModal from '../LoginLinkRequestModal'
import SelectFilesModal from '../SelectFilesModal'
import RequestDownloadModal from '../RequestDownloadModal'
import RestrictedFilesModal from '../RestrictedFilesModal'

export interface DossierDetailsModalProps {
  currentModal: DossierDetailsModalType | null
  setModal: (name: DossierDetailsModalType | null) => void
  selectedFiles: Bestand[]
  restrictedFiles: Bestand[]
}

const DossierDetailsModal: FunctionComponent<DossierDetailsModalProps> = ({
  currentModal,
  setModal,
  selectedFiles,
  restrictedFiles,
}) => {
  if (currentModal === 'login') {
    return (
      <LoginLinkRequestModal data-testid="loginLinkRequestModal" onClose={() => setModal(null)} />
    )
  }

  if (currentModal === 'select') {
    return <SelectFilesModal data-testid="selectFilesModal" onClose={() => setModal(null)} />
  }

  if (currentModal === 'download') {
    return <RequestDownloadModal files={selectedFiles} onClose={() => setModal(null)} />
  }

  if (currentModal === 'restricted') {
    return (
      <RestrictedFilesModal
        files={restrictedFiles}
        onClose={() => setModal(null)}
        onDownload={() => setModal('download')}
      />
    )
  }

  return null
}

export default DossierDetailsModal
