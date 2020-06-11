import React from 'react'
import fileSaver from 'file-saver'

function useDownload() {
  const [loading, setLoading] = React.useState(false)

  async function downloadFile(url, options = {}, fileName = '') {
    setLoading(true)

    fetch(url, options)
      .then((response) => response.blob())
      .then((blob) => {
        fileSaver(blob, fileName || url.split('/').pop())
        setLoading(false)
      })
  }

  return [loading, downloadFile]
}

export default useDownload
