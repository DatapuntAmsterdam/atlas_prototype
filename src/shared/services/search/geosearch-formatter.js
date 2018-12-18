// Todo: fix / add tests
/* istanbul ignore file */
import SEARCH_CONFIG from './search-config';

const format = (allSearchResults) => {
  const allFeaturesFlattened = allSearchResults
    .map((searchResult) => searchResult.features.map((feature) => feature.properties))
    .reduce((previous, current) => previous.concat(current), []);

  return SEARCH_CONFIG.COORDINATES_HIERARCHY.map((rawCategory) => {
    const formattedCategory = {
      slug: rawCategory.slug || null,
      label_singular: rawCategory.label_singular,
      label_plural: rawCategory.label_plural,
      results: allFeaturesFlattened
        .filter((feature) => rawCategory.features.indexOf(feature.type) !== -1)
        .sort((featureA, featureB) => {
          const indexA = rawCategory.features.indexOf(featureA.type);
          const indexB = rawCategory.features.indexOf(featureB.type);

          return indexA - indexB;
        })
        .map((feature) => {
          let subtype = null;
          let subtypeLabel;

          if (feature.opr_type) {
            // Openbare ruimtes
            subtype = feature.opr_type.toLowerCase();
          } else if (feature.type === 'bag/ligplaats' || feature.type === 'bag/standplaats') {
            subtype = feature.type.split('/')[1];
          } else {
            ['gebieden', 'bommenkaart'].forEach((category) => {
              const regex = new RegExp(`^${category}/`);

              if (feature.type.match(regex)) {
                subtype = feature.type.replace(regex, '');
              }
            });
          }

          subtypeLabel = subtype;

          if (subtype && rawCategory.subtypes) {
            subtypeLabel = rawCategory.subtypes[subtype] || subtype;
          }

          return {
            label: feature.display,
            subtype,
            subtypeLabel,
            endpoint: feature.uri
          };
        }),
      useIndenting: false
    };

    formattedCategory.count = formattedCategory.results.length;

    return formattedCategory;
  }).filter((category) => category.count > 0);
};

export default format;
