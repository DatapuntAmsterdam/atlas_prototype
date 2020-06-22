export default function getParam(param: string): string | null {
  if (typeof window !== 'undefined') {
    const searchParams = new URLSearchParams(window.location.search)
    return searchParams.get(param) || ''
  }

  return null
}
