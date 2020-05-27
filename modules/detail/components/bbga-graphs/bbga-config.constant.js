import angular from 'angular'

angular.module('dpDetail').constant('BBGA_CONFIG', {
  PERSONEN: [
    {
      variable: 'BEVHHMKIND_P',
      compareWithAmsterdam: true,
    },
    {
      variable: 'BEV65PLUS_P',
      compareWithAmsterdam: true,
    },
    {
      variable: 'BEVNW_P',
      compareWithAmsterdam: true,
    },
  ],
  HUIZEN: [
    {
      variable: 'WKOOP_P',
      compareWithAmsterdam: false,
    },
    {
      variable: 'WCORHUUR_P',
      compareWithAmsterdam: false,
    },
    {
      variable: 'WPARTHUUR_P',
      compareWithAmsterdam: false,
    },
    {
      variable: 'WWOZ_M2',
      compareWithAmsterdam: true,
    },
  ],
  TEVREDENHEID: [
    {
      variable: 'LBUURT_R',
      compareWithAmsterdam: true,
    },
    {
      variable: 'WWONING_R',
      compareWithAmsterdam: true,
    },
    {
      variable: 'VKPARKEREN_R',
      compareWithAmsterdam: true,
    },
    {
      variable: 'ORSCHOONSTRATEN_R',
      compareWithAmsterdam: true,
    },
    {
      variable: 'LBETROKKEN_R',
      compareWithAmsterdam: true,
    },
  ],
})
