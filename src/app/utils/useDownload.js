import React from 'react'
import fileSaver from 'file-saver'

function useDownload() {
  const [loading, setLoading] = React.useState(false)

  async function downloadFile(url, options = {}) {
    setLoading(true)

    const fileName = url.split('/').pop()

    fetch(url, options)
      .then((response) => response.blob())
      .then((blob) => {
        fileSaver(blob, fileName)
        setLoading(false)
      })
  }

  return [loading, downloadFile]
}

export default useDownload
