(function(){
	'use strict';

	angular
		.module('dpMap')
		.component('dpLegendItem', {
			bindings: {
				overlay: '=',
				zoom: '='
			},
			templateUrl: 'modules/map/components/overlay-legend/legend-item/legend-item.html',
			controller: LegendItem,
			controllerAs: 'vm'
		});

	LegendItem.$inject = ['$scope', 'OVERLAYS', 'mapConfig'];

	function LegendItem($scope, OVERLAYS, mapConfig) {
		var vm = this;

		// Setting legend and label
		vm.label = OVERLAYS.SOURCES[vm.overlay.id].label_short;
		vm.legend = OVERLAYS.SOURCES[vm.overlay.id].legend;
		vm.icon_alt_text = 'Status Icon';
		// Checking for external link
		if (vm.legend && !OVERLAYS.SOURCES[vm.overlay.id].external) {
			vm.legend = mapConfig.OVERLAY_ROOT + vm.legend;
		}	
		
		vm.getIcon = function() {
			// Determining which icon to use based on visibility
			var icon = '/assets/icons/'; // The prefix path
			if (vm.overlay.isVisible) {
				if (vm.zoom >= OVERLAYS.SOURCES[vm.overlay.id].minZoom &&
	            	vm.zoom <= OVERLAYS.SOURCES[vm.overlay.id].maxZoom) {
					icon += 'visible.svg';
					vm.icon_alt_text = 'Overlay zichtbaar';
				} else {
					icon += 'invisible-zoomlevel.svg';
					vm.icon_alt_text = 'Overlay onzichtbaar door zoom level';
				}
			} else {
				icon += 'invisible-hidden.svg';
				vm.icon_alt_text = 'Overlay verborgen';
			}
			return icon;	
		};

	}

})();