
import marked from 'marked';
import { dcatdScopes } from '../../../../src/shared/services/auth/auth';

const formatCatalogData = (data, catalogFilters) => {
  const resourceTypes = catalogFilters.resourceTypes;
  if (!resourceTypes || !data) {
    return {};
  }
  const resources = data['dcat:distribution'];

  const formattedData = {
    _display: data['dct:title'],
    resources: resourceTypes.map((item) => ({
      type: item.id,
      rows: resources.filter((row) => row['ams:resourceType'] === item.id)
    })).filter((resource) => resource.rows.length),
    editDatasetId: data['dct:identifier']
  };

  return Object.keys(data).filter((key) => key !== 'dcat:distribution')
    .reduce((result, key) => ({
      ...result,
      [key]: data[key]
    }), formattedData);
};

const formatData = (data, subject, catalogFilters) => {
  switch (subject) {
    case 'datasets': // dcat data
      return formatCatalogData(data, catalogFilters);
    default:
      return data;
  }
};

const formatDetailData = (rawData, category, subject, catalogFilters, scopes) => {
  let data = formatData(rawData, subject, catalogFilters);
  if (category === 'dcatd' && subject === 'datasets') {
    const fields = ['dct:description', 'overheid:grondslag', 'overheidds:doel'];
    const markdownFields = fields.reduce((acc, field) => {
      if (data[field]) {
        acc[field] = marked(data[field]);
      }
      return acc;
    }, {});

    data = { ...data, ...markdownFields };

    data.canEditDataset = scopes.some((scope) => dcatdScopes.includes(scope));
  }
  return data;
};

export default formatDetailData;
