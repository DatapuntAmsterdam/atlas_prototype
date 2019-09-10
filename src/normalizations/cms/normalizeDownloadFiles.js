const normalizeDownloadsObject = downloads => {
  try {
    return (
      downloads &&
      downloads.length &&
      downloads.map(
        ({
          title: fileName,
          drupal_internal__nid: key,
          field_file_type: type,
          field_file_size: size,
          field_file: fieldFile,
        }) => ({
          fileName,
          key,
          type,
          size,
          fieldFile,
          url: fieldFile.field_media_file.uri.url.replace(/^\/+/, ''),
        }),
      )
    )
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(`Could not show downloads in article: ${e}`)
  }

  return null
}

export default normalizeDownloadsObject
