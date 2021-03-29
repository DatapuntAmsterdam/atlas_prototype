import joinUrl from '../../app/utils/joinUrl'
import environment from '../../environment'

const BACKDROP_OPACITY = 0.5

const CONSTANTS = {
  BACKDROP_OPACITY,
}

export const NOT_FOUND_THUMBNAIL = joinUrl([
  environment.ROOT,
  'assets/images/not_found_thumbnail.jpg',
])

export default CONSTANTS
