describe('The variableWidth factory', function () {
    var $rootScope,
        variableWidth,
        mockedContainer,
        mockedLeafletMap;

    beforeEach(function () {
        angular.mock.module('dpMap');

        angular.mock.inject(function (_$rootScope_, _variableWidth_) {
            $rootScope = _$rootScope_;
            variableWidth = _variableWidth_;
        });

        mockedContainer = document.createElement('div');
        mockedContainer.style.width = '100px';

        document.body.appendChild(mockedContainer);

        mockedLeafletMap = {
            invalidateSize: function () {}
        };

        spyOn(mockedLeafletMap, 'invalidateSize');
    });

    it('won\'t get triggered on initialization', function () {
        variableWidth.initialize(mockedContainer, mockedLeafletMap);
        $rootScope.$apply();

        expect(mockedLeafletMap.invalidateSize).not.toHaveBeenCalled();
    });

    it('detects changes of the container width and breaks Leaflet\'s internal cached width if needed', function () {
        variableWidth.initialize(mockedContainer, mockedLeafletMap);
        $rootScope.$apply();

        mockedContainer.style.width = '101px';
        variableWidth.initialize(mockedContainer, mockedLeafletMap);
        $rootScope.$apply();

        expect(mockedLeafletMap.invalidateSize).toHaveBeenCalledTimes(1);
    });
});
