import angular from 'angular'

const keys = {
  stadsdeel: 'stadsdeel',
  wijk: 'buurtcombinatie',
  buurt: 'buurt',
  bouwblok: 'bouwblok',
  gebiedsgerichtWerken: 'gebiedsgerichtwerken',
  grootstedelijkGebied: 'grootstedelijkgebied',
}

const keyOrder = [
  keys.stadsdeel,
  keys.wijk,
  keys.buurt,
  keys.bouwblok,
  keys.gebiedsgerichtWerken,
  keys.grootstedelijkGebied,
]

const labels = {
  [keys.stadsdeel]: 'Stadsdeel',
  [keys.wijk]: 'Wijk',
  [keys.buurt]: 'Buurt',
  [keys.bouwblok]: 'Bouwblok',
  [keys.gebiedsgerichtWerken]: 'Gebiedsgericht werken',
  [keys.grootstedelijkGebied]: 'Grootstedelijk gebied',
}

angular.module('dpDetail').constant('PARENT_RELATIONS_CONFIG', {
  keys,
  keyOrder,
  labels,
})
