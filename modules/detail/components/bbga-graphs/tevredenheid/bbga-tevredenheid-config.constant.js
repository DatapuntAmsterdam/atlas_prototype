import angular from 'angular'

angular.module('dpDetail').constant('BBGA_TEVREDENHEID_CONFIG', [
  {
    label: 'Tevredenheid met buurt',
    variable: 'LBUURT_R',
  },
  {
    label: 'Tevredenheid met eigen woning',
    variable: 'WWONING_R',
  },
  {
    label: 'Parkeervoorzieningen',
    variable: 'VKPARKEREN_R',
  },
  {
    label: 'Schoonhouden straten en stoepen',
    variable: 'ORSCHOONSTRATEN_R',
  },
  {
    label: 'Betrokkenheid buurtbewoners',
    variable: 'LBETROKKEN_R',
  },
])
