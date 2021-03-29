// These paths are ignored by all the shitty Redux code.
// Add your route here if you are moving away from Redux First Router.
const ignoredPaths = ['kaart', 'bouwdossiers']

export default function isIgnoredPath(path: string) {
  if (path.includes('kaarten')) {
    return false
  }

  return ignoredPaths.some((ignoredPath) => path.includes(ignoredPath))
}
