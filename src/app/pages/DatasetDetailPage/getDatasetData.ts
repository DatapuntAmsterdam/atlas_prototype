const formatCatalogData = (data, catalogFilters) => {
  const { resourceTypes } = catalogFilters
  if (!resourceTypes || !data) {
    return {}
  }
  const resources = data['dcat:distribution']

  const formattedData = {
    _display: data['dct:title'],
    resources: resourceTypes
      .map((item) => ({
        type: item.id,
        rows: resources.filter((row) => row['ams:resourceType'] === item.id),
      }))
      .filter((resource) => resource.rows.length),
    editDatasetId: data['dct:identifier'],
  }

  return Object.keys(data)
    .filter((key) => key !== 'dcat:distribution')
    .reduce(
      (result, key) => ({
        ...result,
        [key]: data[key],
      }),
      formattedData,
    )
}

const formatData = (data, subject, catalogFilters) => {
  if (subject === 'datasets') {
    return formatCatalogData(data, catalogFilters) // dcat data
  }
  return data
}

// This is incorrectly called formatDetailData as this is only used for datasets....
const formatDetailData = (rawData, category, subject, catalogFilters, scopes) => {
  let data = formatData(rawData, subject, catalogFilters)
  if (category === 'dcatd' && subject === 'datasets') {
    const fields = ['dct:description', 'overheid:grondslag', 'overheidds:doel']
    const markdownFields = fields.reduce((acc, field) => {
      if (data[field]) {
        acc[field] = marked(data[field])
      }
      return acc
    }, {})

    data = { ...data, ...markdownFields }

    data.canEditDataset = scopes.some((scope) => dcatdScopes.includes(scope))
  }
  return data
}
