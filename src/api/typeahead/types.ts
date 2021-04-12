export interface TypeAhead {
  label: string
  content: Content[]
  // eslint-disable-next-line camelcase
  total_results: number
}

export interface Content {
  _display: string
  uri: string
  type?: string
}
