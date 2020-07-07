import environment from '../../environment'

const isString = (any) => typeof any === 'string'
/**
 *
 * Generate the url from imgproxy. For more info check: https://github.com/imgproxy/imgproxy/blob/master/docs/generating_the_url_basic.md
 *
 * @param {string} src This is the path of the file
 * @param {number} width
 * @param {number} height
 * @param {('fit'|'fill'|'crop'|'force')} resize
 * @param {('no'|'so'|'ea'|'we'|'noea'|'nowe'|'soea'|'sowe'|'ce'|'sm'|'fp:%x:%y')} gravity
 * @param {number} enlarge
 * @param {'jpg'|'png'|'webp'|'gif'|'ico'|'heic'|'tiff'} extension
 * @returns {string|undefined}
 */
const getImageFromCms = (
  src,
  width,
  height,
  resize = 'fill',
  gravity = 'sm',
  enlarge = 0,
  extension = isString(src) && src.split('.').pop(),
) => {
  if (isString(src)) {
    return `${environment.CMS_ROOT}assets/${resize}/${width}/${height}/${gravity}/${enlarge}/${btoa(
      src,
    )}.${extension}`
  }

  return undefined
}

export default getImageFromCms
