import { FieldDownload } from './types'

interface NormalizedDownloadObject {
  fileName: string
  key: string
  type: string
  size: string
  fieldFile: {
    field_media_file: {
      uri: {
        url: string
      }
    }
  }
  url: string
}

const normalizeDownloadsObject = (
  downloads?: FieldDownload[],
): NormalizedDownloadObject[] | null => {
  return downloads && downloads.length
    ? downloads.map(
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
    : null
}

export default normalizeDownloadsObject
