export type TypeAhead = {
  label: string
  content: Content[]
  // eslint-disable-next-line camelcase
  total_results: number
}

export type Content = {
  _display: string
  uri: string
  type?: string
}
