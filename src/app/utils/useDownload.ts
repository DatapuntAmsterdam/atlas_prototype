import { useState } from 'react'
import fileSaver from 'file-saver'

function useDownload(): [boolean, (url: string, options: RequestInit, fileName?: string) => void] {
  const [loading, setLoading] = useState(false)

  function downloadFile(url: string, options = {}, fileName = '') {
    setLoading(true)

    fetch(url, options)
      .then((response) => response.blob())
      .then((blob) => {
        // @ts-ignore
        fileSaver(blob, fileName || url.split('/').pop())
        setLoading(false)
      })
      .catch((error: string) => {
        // eslint-disable-next-line no-console
        console.error(`Failed to download file: ${error}`)
      })
  }

  return [loading, downloadFile]
}

export default useDownload
