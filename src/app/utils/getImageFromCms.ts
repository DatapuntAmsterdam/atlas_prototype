import environment from '../../environment'
import joinUrl from './joinUrl'

export type Resize = 'fit' | 'fill' | 'crop' | 'force'
export type Gravity =
  | 'no'
  | 'so'
  | 'ea'
  | 'we'
  | 'noea'
  | 'nowe'
  | 'soea'
  | 'sowe'
  | 'ce'
  | 'sm'
  | 'fp:%x:%y'

export type Extension = 'jpg' | 'png' | 'webp' | 'gif' | 'ico' | 'heic' | 'tiff'

/**
 *
 * Generate the url from imgproxy. For more info check: https://github.com/imgproxy/imgproxy/blob/master/docs/generating_the_url_basic.md
 *
 * @param src This is the path of the file
 * @param width
 * @param height
 * @param resize
 * @param gravity
 * @param enlarge
 */
const getImageFromCms = (
  src: string,
  width: number,
  height: number,
  resize: Resize = 'fill',
  gravity: Gravity = 'sm',
  enlarge = 0,
) => {
  const extension = src.split('.').pop()

  if (!extension) {
    // eslint-disable-next-line no-console
    console.warn('Could not get extension from file passed to getImageFromCms')
    return ''
  }

  return joinUrl([
    environment.CMS_ROOT,
    'assets',
    resize,
    width.toString(),
    height.toString(),
    gravity,
    enlarge.toString(),
    `${btoa(src)}.${extension}`,
  ])
}

export default getImageFromCms
