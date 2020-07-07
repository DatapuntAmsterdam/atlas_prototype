import React from 'react'
import fileSaver from 'file-saver'

function useDownload(): [
  boolean,
  (url: string, options: Object, fileName?: string) => Promise<void>,
] {
  const [loading, setLoading] = React.useState(false)

  async function downloadFile(url: string, options = {}, fileName = '') {
    setLoading(true)

    fetch(url, options)
      .then((response) => response.blob())
      .then((blob) => {
        // @ts-ignore
        fileSaver(blob, fileName || url.split('/').pop())
        setLoading(false)
      })
  }

  return [loading, downloadFile]
}

export default useDownload
