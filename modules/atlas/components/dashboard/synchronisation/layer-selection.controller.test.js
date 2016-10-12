describe('The layerSelection controller', function () {
    var $controller,
        $rootScope,
        store;

    beforeEach(function () {
        angular.mock.module('atlas');

        angular.mock.inject(function (_$controller_, _$rootScope_, _store_) {
            $controller = _$controller_;
            $rootScope = _$rootScope_;
            store = _store_;
        });
    });

    function getController () {
        var controller,
            scope = $rootScope.$new();

        controller = $controller('LayerSelectionController', {
            $scope: scope
        });

        scope.$apply();

        return controller;
    }

    it('subscribes to the store to listen for changes', function () {
        spyOn(store, 'subscribe').and.callThrough();

        getController();

        expect(store.subscribe).toHaveBeenCalledWith(jasmine.any(Function));
    });

    it('sets the baseLayer, overlays and zoom level based on the state', function () {
        var mockedState = {
                map: {
                    baseLayer: 'topografie',
                    overlays: [
                        {
                            id: 'layer_1',
                            isVisible: true
                        }, {
                            id: 'layer_3',
                            isVisible: true
                        }
                    ],
                    zoom: 10
                }
            },
            controller;

        spyOn(store, 'getState').and.returnValue(mockedState);

        controller = getController();

        expect(controller.baseLayer).toBe('topografie');
        expect(controller.overlays).toEqual([
                        {id: 'layer_1', isVisible: true},
                        {id: 'layer_3', isVisible: true}
        ]);
        expect(controller.zoom).toBe(10);
    });
});
