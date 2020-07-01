export default function getParam(param: string) {
  if (typeof window === 'undefined') {
    return null
  }

  return new URLSearchParams(window.location.search).get(param)
}
