export interface Metadata {
  id: string
  title: string
  group: number
  /* eslint-disable camelcase */
  update_frequency: string
  data_modified_date: string
  last_import_date: string | null
  /* eslint-enable camelcase */
}
