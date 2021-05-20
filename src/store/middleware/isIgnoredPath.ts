// These paths are ignored by all the shitty Redux code.
// Add your route here if you are moving away from Redux First Router.
import { matchPath } from 'react-router-dom'
import { routing } from '../../app/routes'
import { FEATURE_BETA_MAP, isFeatureEnabled } from '../../app/features'

const ignoredPaths = [routing.constructionDossier.path]

export default function isIgnoredPath(path: string) {
  if (isFeatureEnabled(FEATURE_BETA_MAP)) {
    ignoredPaths.push(
      routing.data.path,
      routing.dataSearchGeo.path,
      routing.dataDetail.path,
      routing.addresses.path,
      routing.establishments.path,
      routing.cadastralObjects.path,
    )
  }
  return ignoredPaths.some((ignoredPath) => matchPath(path, ignoredPath))
}
