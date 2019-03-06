import categoryLabels from './category-labels';

// mapping for map search results to collect the correct categoryLabel
const categoryLabelsByType = {
  'bag/ligplaats': categoryLabels.ligplaats,
  'bag/openbareruimte': categoryLabels.openbareRuimte,
  'bag/pand': categoryLabels.pand,
  'bag/standplaats': categoryLabels.standplaats,
  'bommenkaart/bominslag': categoryLabels.explosief,
  'bommenkaart/gevrijwaardgebied': categoryLabels.explosief,
  'bommenkaart/uitgevoerdonderzoek': categoryLabels.explosief,
  'bommenkaart/verdachtgebied': categoryLabels.explosief,
  'gebieden/bouwblok': categoryLabels.gebied,
  'gebieden/buurt': categoryLabels.gebied,
  'gebieden/buurtcombinatie': categoryLabels.gebied,
  'gebieden/gebiedsgerichtwerken': categoryLabels.gebied,
  'gebieden/grootstedelijkgebied': categoryLabels.gebied,
  'gebieden/stadsdeel': categoryLabels.gebied,
  'gebieden/unesco': categoryLabels.gebied,
  'grex/grondexploitatie': categoryLabels.grondexploitatie,
  'kadaster/kadastraal_object': categoryLabels.kadastraalObject,
  'meetbouten/meetbout': categoryLabels.meetbout,
  'monumenten/monument': categoryLabels.monument,
  'pand/address': categoryLabels.address,
  'pand/monument': categoryLabels.monument,
  'nap/peilmerk': categoryLabels.napPijlmerk,
  'parkeervakken/parkeervakken': categoryLabels.parkeervak,
  vestiging: categoryLabels.vestiging,
  'vsd/biz': categoryLabels.bedrijfsinvesteringszone,
  'vsd/oplaadpunten': categoryLabels.oplaadpunten,
  'vsd/winkgeb': categoryLabels.winkelgebied,
  'wkpb/beperking': categoryLabels.gemeentelijkeBeperking
};

export default categoryLabelsByType;
