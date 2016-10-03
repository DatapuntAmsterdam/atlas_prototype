describe('The dp-panorama-metadata component', function () {
    var $compile,
        $rootScope;

    beforeEach(function () {
        angular.mock.module(
            'dpPanorama',
            function ($provide) {
                $provide.value('coordinatesFilter', function (input) {
                    return 'MOCKED_RD_COORDINATES (' + input.join(', ') + ')';
                });
            }
        );

        angular.mock.inject(function (_$compile_, _$rootScope_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
        });
    });

    function getComponent (date, location) {
        var component,
            element,
            scope;

        element = document.createElement('dp-panorama-metadata');
        element.setAttribute('date', 'date');
        element.setAttribute('location', 'location');

        scope = $rootScope.$new();
        scope.date = date;
        scope.location = location;

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('only shows the meta information if it has a valid date and location', function () {
        var component;

        component = getComponent(null, null);
        expect(component.text().trim().length).toBe(0);

        component = getComponent(new Date(), [52.123, 4.789]);
        expect(component.text().trim().length).toBeGreaterThan(0);
    });

    it('uses a date filter for formatting the date into dd-MM-yyyy', function () {
        var component,
            date = new Date(2016, 7, 1);

        component = getComponent(date, [52.123, 4.789]);
        expect(component.text()).toContain('01-08-2016'); //With leading zeros
    });

    it('it uses a filter to display both the RD and the WGS84 coordinates', function () {
        var component;

        component = getComponent(new Date(), [52.123, 4.789]);
        expect(component.text()).toContain('MOCKED_RD_COORDINATES (52.123, 4.789)');
    });
});