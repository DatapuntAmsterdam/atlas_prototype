describe('The dp-straatbeeld-history component', () => {
    var $compile,
        $rootScope,
        $window,
        store,
        ACTIONS;

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

        angular.mock.inject((_$compile_, _$rootScope_, _$window_, _store_, _ACTIONS_) => {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $window = _$window_;
            store = _store_;
            ACTIONS = _ACTIONS_;
        });

        spyOn($window, 'open');
        spyOn(store, 'dispatch');
    });

    function getComponent (location, heading, history) {
        const element = document.createElement('dp-straatbeeld-history');
        element.setAttribute('location', 'location');
        element.setAttribute('heading', 'heading');
        element.setAttribute('history', 'history');
        document.body.appendChild(element);

        const scope = $rootScope.$new();
        scope.location = location;
        scope.heading = heading;
        scope.history = history;

        const component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    describe('The drop up menu', () => {
        it('is hidden by default', () => {
            const component = getComponent();

            expect(component.find('.qa-straatbeeld-history__menu').length).toBe(0);
        });

        it('pops up when the button is clicked', () => {
            const component = getComponent();
            const button = component.find('.qa-straatbeeld-history__button');

            button.click();
            expect(component.find('.qa-straatbeeld-history__menu').length).toBe(1);
        });

        it('hides when the button is clicked again', () => {
            const component = getComponent();
            const button = component.find('.qa-straatbeeld-history__button');

            button.click();
            button.click();
            expect(component.find('.qa-straatbeeld-history__menu').length).toBe(0);
        });

        it('can be opened more than once', () => {
            const component = getComponent();
            const button = component.find('.qa-straatbeeld-history__button');

            button.click();
            button.click();
            button.click();
            expect(component.find('.qa-straatbeeld-history__menu').length).toBe(1);
        });

        it('hides when anywhere else in the page is clicked', () => {
            const component = getComponent();
            const button = component.find('.qa-straatbeeld-history__button');

            button.click();
            angular.element(document.body).click();
            expect(component.find('.qa-straatbeeld-history__menu').length).toBe(0);
        });

        it('hides when an item is clicked', () => {
            const component = getComponent();
            const button = component.find('.qa-straatbeeld-history__button');

            button.click();

            component.find('.qa-straatbeeld-history__item').click();
            expect(component.find('.qa-straatbeeld-history__menu').length).toBe(0);
        });

        it('hides when the external link is clicked', () => {
            const component = getComponent();
            const button = component.find('.qa-straatbeeld-history__button');

            button.click();

            component.find('.qa-straatbeeld-history__external-link').click();
            expect(component.find('.qa-straatbeeld-history__menu').length).toBe(0);
        });

        it('does not hide when anywhere else in the menu is clicked', () => {
            const component = getComponent();
            const button = component.find('.qa-straatbeeld-history__button');

            button.click();

            component.find('.qa-straatbeeld-history__menu').click();
            component.find('.qa-straatbeeld-history__devider').click();
            component.find('.qa-straatbeeld-history__external').click();

            expect(component.find('.qa-straatbeeld-history__menu').length).toBe(1);
        });
    });

    describe('The external link', () => {
        it('reflects the location and heading', () => {
            const component = getComponent([52.123, 4.789], 12, 12);
            const button = component.find('.qa-straatbeeld-history__button');

            button.click();

            expect(component.find('.qa-straatbeeld-history__external-link').attr('ng-href'))
                .toEqual('http://maps.google.com/maps?q=&layer=c&cbll=52.123,4.789&cbp=11,12,0,0,0');
        });

        it('updates the location and heading when changed', () => {
            const location = [52.123, 4.789];
            const component = getComponent(location, 12, 12);
            const button = component.find('.qa-straatbeeld-history__button');

            button.click();

            location[0] = 53.123;
            location[1] = 5.789;
            $rootScope.$digest();

            expect(component.find('.qa-straatbeeld-history__external-link').attr('ng-href'))
                .toEqual('http://maps.google.com/maps?q=&layer=c&cbll=53.123,5.789&cbp=11,12,0,0,0');
        });
    });

    describe('The menu items', () => {
        let clock;

        beforeEach(() => {
            clock = jasmine.clock();
            clock.install();
        });

        afterEach(() => {
            clock.uninstall();
        });

        it('The first item is for the most recent street view', () => {
            const component = getComponent();
            const button = component.find('.qa-straatbeeld-history__button');

            button.click();

            const items = component.find('.qa-straatbeeld-history__item');

            expect(items.eq(0).text()).toContain('recent');
        });

        it('Does not list any years if the current year is before 2016', () => {
            clock.mockDate(new Date(2015, 3, 9));

            const component = getComponent();
            const button = component.find('.qa-straatbeeld-history__button');

            button.click();

            const items = component.find('.qa-straatbeeld-history__item');

            expect(items.length).toBe(1);
        });

        it('Lists every year from 2016 till the current year (2016)', () => {
            clock.mockDate(new Date(2016, 11, 31));

            const component = getComponent();
            const button = component.find('.qa-straatbeeld-history__button');

            button.click();

            const items = component.find('.qa-straatbeeld-history__item');

            expect(items.length).toBe(2);
            expect(items.eq(1).text()).toContain('2016');
        });

        it('Lists every year from 2016 till the current year (2017)', () => {
            clock.mockDate(new Date(2017, 0, 1));

            const component = getComponent();
            const button = component.find('.qa-straatbeeld-history__button');

            button.click();

            const items = component.find('.qa-straatbeeld-history__item');

            expect(items.length).toBe(3);
            expect(items.eq(1).text()).toContain('2017');
            expect(items.eq(2).text()).toContain('2016');
        });

        it('Lists every year from 2016 till the current year (2020)', () => {
            clock.mockDate(new Date(2020, 10, 16));

            const component = getComponent();
            const button = component.find('.qa-straatbeeld-history__button');

            button.click();

            const items = component.find('.qa-straatbeeld-history__item');

            expect(items.length).toBe(6);
            expect(items.eq(1).text()).toContain('2020');
            expect(items.eq(2).text()).toContain('2019');
            expect(items.eq(3).text()).toContain('2018');
            expect(items.eq(4).text()).toContain('2017');
            expect(items.eq(5).text()).toContain('2016');
        });

        it('sets the selection', () => {
            let items;

            clock.mockDate(new Date(2020, 10, 16));

            const component = getComponent();
            const button = component.find('.qa-straatbeeld-history__button');

            expect(button.text()).toContain('recent');

            button.click();
            items = component.find('.qa-straatbeeld-history__item');
            items.eq(1).click();
            expect(button.text()).toContain('2020');

            button.click();
            items = component.find('.qa-straatbeeld-history__item');
            items.eq(3).click();
            expect(button.text()).toContain('2018');

            button.click();
            items = component.find('.qa-straatbeeld-history__item');
            items.eq(5).click();
            expect(button.text()).toContain('2016');

            button.click();
            items = component.find('.qa-straatbeeld-history__item');
            items.eq(0).click();
            expect(button.text()).toContain('recent');
        });

        it('dispatches an action', () => {
            let items;

            clock.mockDate(new Date(2020, 10, 16));

            const component = getComponent();
            const button = component.find('.qa-straatbeeld-history__button');

            button.click();
            items = component.find('.qa-straatbeeld-history__item');
            items.eq(1).click();
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.SET_STRAATBEELD_HISTORY,
                payload: 2020
            });

            button.click();
            items = component.find('.qa-straatbeeld-history__item');
            items.eq(3).click();
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.SET_STRAATBEELD_HISTORY,
                payload: 2018
            });

            button.click();
            items = component.find('.qa-straatbeeld-history__item');
            items.eq(5).click();
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.SET_STRAATBEELD_HISTORY,
                payload: 2016
            });

            button.click();
            items = component.find('.qa-straatbeeld-history__item');
            items.eq(0).click();
            expect(store.dispatch).toHaveBeenCalledWith({
                type: ACTIONS.SET_STRAATBEELD_HISTORY,
                payload: 0
            });
        });

        it('can have its selection initialized', () => {
            clock.mockDate(new Date(2020, 10, 16));

            const component = getComponent(null, null, 2020);
            const button = component.find('.qa-straatbeeld-history__button');

            expect(button.text()).toContain('2020');

            button.click();
            const items = component.find('.qa-straatbeeld-history__item');

            expect(items.eq(0).hasClass('c-straatbeeld-history__item--active')).toBeFalsy();
            expect(items.eq(1).hasClass('c-straatbeeld-history__item--active')).toBeTruthy();
            expect(items.eq(2).hasClass('c-straatbeeld-history__item--active')).toBeFalsy();
            expect(items.eq(3).hasClass('c-straatbeeld-history__item--active')).toBeFalsy();
            expect(items.eq(4).hasClass('c-straatbeeld-history__item--active')).toBeFalsy();
            expect(items.eq(5).hasClass('c-straatbeeld-history__item--active')).toBeFalsy();
        });

        it('highlights the selection', () => {
            let items;

            clock.mockDate(new Date(2020, 10, 16));

            const component = getComponent();
            const button = component.find('.qa-straatbeeld-history__button');

            button.click();
            items = component.find('.qa-straatbeeld-history__item');
            expect(items.eq(0).hasClass('c-straatbeeld-history__item--active')).toBeTruthy();
            expect(items.eq(1).hasClass('c-straatbeeld-history__item--active')).toBeFalsy();
            expect(items.eq(2).hasClass('c-straatbeeld-history__item--active')).toBeFalsy();
            expect(items.eq(3).hasClass('c-straatbeeld-history__item--active')).toBeFalsy();
            expect(items.eq(4).hasClass('c-straatbeeld-history__item--active')).toBeFalsy();
            expect(items.eq(5).hasClass('c-straatbeeld-history__item--active')).toBeFalsy();

            items.eq(2).click();
            button.click();
            items = component.find('.qa-straatbeeld-history__item');
            expect(items.eq(0).hasClass('c-straatbeeld-history__item--active')).toBeFalsy();
            expect(items.eq(1).hasClass('c-straatbeeld-history__item--active')).toBeFalsy();
            expect(items.eq(2).hasClass('c-straatbeeld-history__item--active')).toBeTruthy();
            expect(items.eq(3).hasClass('c-straatbeeld-history__item--active')).toBeFalsy();
            expect(items.eq(4).hasClass('c-straatbeeld-history__item--active')).toBeFalsy();
            expect(items.eq(5).hasClass('c-straatbeeld-history__item--active')).toBeFalsy();

            items.eq(4).click();
            button.click();
            items = component.find('.qa-straatbeeld-history__item');
            expect(items.eq(0).hasClass('c-straatbeeld-history__item--active')).toBeFalsy();
            expect(items.eq(1).hasClass('c-straatbeeld-history__item--active')).toBeFalsy();
            expect(items.eq(2).hasClass('c-straatbeeld-history__item--active')).toBeFalsy();
            expect(items.eq(3).hasClass('c-straatbeeld-history__item--active')).toBeFalsy();
            expect(items.eq(4).hasClass('c-straatbeeld-history__item--active')).toBeTruthy();
            expect(items.eq(5).hasClass('c-straatbeeld-history__item--active')).toBeFalsy();

            items.eq(0).click();
            button.click();
            items = component.find('.qa-straatbeeld-history__item');
            expect(items.eq(0).hasClass('c-straatbeeld-history__item--active')).toBeTruthy();
            expect(items.eq(1).hasClass('c-straatbeeld-history__item--active')).toBeFalsy();
            expect(items.eq(2).hasClass('c-straatbeeld-history__item--active')).toBeFalsy();
            expect(items.eq(3).hasClass('c-straatbeeld-history__item--active')).toBeFalsy();
            expect(items.eq(4).hasClass('c-straatbeeld-history__item--active')).toBeFalsy();
            expect(items.eq(5).hasClass('c-straatbeeld-history__item--active')).toBeFalsy();
        });
    });
});
