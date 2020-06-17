export default function getParam(param: string): string {
  if (typeof window !== 'undefined') {
    const searchParams = new URLSearchParams(window.location.search)
    return searchParams.get(param) || ''
  }

  return ''
}
