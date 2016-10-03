describe('The dp-panorama-thumbnail component', function () {
    var $compile,
        $rootScope,
        store,
        ACTIONS,
        $q,
        api,
        hasMockedThumbnail,
        finishApiCall;

    beforeEach(function () {
        angular.mock.module(
            'dpShared',
            {
                detailConfig: {
                    PANORAMA_THUMB_URL: 'http://fake.panorama.url/path/',
                    RADIUS: 50
                },
                store: {
                    dispatch: function () {}
                },
                api: {
                    getByUrl: function() {
                        var q = $q.defer();
                         
                        finishApiCall = function () {
                            q.resolve( hasMockedThumbnail ? { 
                                url:'http://example.com/example.png' , pano_id: 'ABC', heading: 179 } : [] );
                            $rootScope.$apply();
                        };
                        return q.promise;
                    }
                }

            }, function ($provide) {
                    $provide.factory('dpLoadingIndicatorDirective', function () {
                        return {};
                    });
                }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_, _store_, _ACTIONS_, _$q_, _api_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            store = _store_;
            ACTIONS = _ACTIONS_;
            $q = _$q_;
            api = _api_;

        });

        hasMockedThumbnail = true;
        spyOn(store, 'dispatch');
        spyOn(api, 'getByUrl').and.callThrough();
    });

    function getComponent (location) {
        var component,
            element,
            scope;

        element = document.createElement('dp-panorama-thumbnail');
        element.setAttribute('location', 'location');

        scope = $rootScope.$new();
        scope.location = location;

        component = $compile(element)(scope);

        scope.$apply();

        return component;
    }
    
  

    it('when it cannot find a thumbnail it shows a message', function () {
        hasMockedThumbnail = false;
        var component = getComponent([52,4]);
        var scope = component.isolateScope();

        finishApiCall();
        
        expect( component.find('img').length).toBe(0);

        expect(scope.vm.isLoading).toBe(false);  
 
        expect( component.find('.qa-found-no-panorama').text() )
                          .toContain('Op deze locatie is binnen 50 meter geen panorama gevonden.');
 
    });

    it('shows a thumbnail when thumbnail is found', function () {
        hasMockedThumbnail = true;
        var component = getComponent([52,4]);      
        var scope = component.isolateScope();
        
        finishApiCall();
        
        expect( component.find('.qa-found-no-panorama').length).toBe(0);
        expect( component.find('img').attr('src') ).toBe('http://example.com/example.png');
        expect(scope.vm.isLoading).toBe(false);                
    });
    
    it('shows a loading indicator when loading', function () {
      var component = getComponent([52,4]);
      var scope = component.isolateScope();

      expect(component.find('dp-loading-indicator').length).toBe(1);
      expect(component.find('dp-loading-indicator').attr('is-loading')).toBe('vm.isLoading');
      
      expect( component.find('img').length).toBe(0);
      expect( component.find('.qa-found-no-panorama').length).toBe(0);
      expect(scope.vm.isLoading).toBe(true);

    });

     it('responds to click on thumbnail', function() {
         var component = getComponent([52,4]);
         
         finishApiCall();
         
         component.find('button').trigger('click');

         expect(store.dispatch).toHaveBeenCalledWith({
             type: ACTIONS.FETCH_PANORAMA, payload: { id: 'ABC', heading: 179, isInitial: true  }  });

     });    
});