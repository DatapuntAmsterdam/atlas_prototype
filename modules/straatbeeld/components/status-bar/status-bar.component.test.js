describe('The dp-straatbeeld-status-bar component', () => {
    var $compile,
        $rootScope,
        $window;

    beforeEach(() => {
        angular.mock.module(
            'dpStraatbeeld',
            {
                store: {
                    dispatch: angular.noop
                }
            },
            $provide => {
                $provide.value('coordinatesFilter', input => 'MOCKED_RD_COORDINATES (' + input.join(', ') + ')');
            }
        );

        angular.mock.inject((_$compile_, _$rootScope_, _$window_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $window = _$window_;
        });

        spyOn($window, 'open');
    });

    function getComponent (date, location, heading) {
        var component,
            element,
            scope;

        element = document.createElement('dp-straatbeeld-status-bar');
        element.setAttribute('date', 'date');
        element.setAttribute('location', 'location');
        element.setAttribute('heading', 'heading');
        scope = $rootScope.$new();
        scope.date = date;
        scope.location = location;
        scope.heading = heading;
        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('only shows the meta information if it has a valid date and location', () => {
        var component;

        component = getComponent(null, null);

        expect(component.text().trim().length).toBe(0);

        component = getComponent(new Date(), [52.123, 4.789]);
        expect(component.text().trim().length).toBeGreaterThan(0);
    });

    it('uses a date filter for formatting the date into dd-MM-yyyy', () => {
        var component,
            date = new Date(2016, 7, 1);

        component = getComponent(date, [52.123, 4.789]);
        expect(component.text()).toContain('01-08-2016'); // With leading zeros
    });

    it('it uses a filter to display both the RD and the WGS84 coordinates', () => {
        var component;

        component = getComponent(new Date(), [52.123, 4.789]);
        expect(component.text()).toContain('MOCKED_RD_COORDINATES (52.123, 4.789)');
    });
});
