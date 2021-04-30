// These paths are ignored by all the shitty Redux code.
// Add your route here if you are moving away from Redux First Router.
import { FEATURE_BETA_MAP, isFeatureEnabled } from '../../app/features'

const ignoredPaths = ['bouwdossiers']

ignoredPaths.push(isFeatureEnabled(FEATURE_BETA_MAP) ? 'data' : 'kaart')

export default function isIgnoredPath(path: string) {
  if (path.includes('kaarten')) {
    return false
  }

  return ignoredPaths.some((ignoredPath) => path.includes(ignoredPath))
}
