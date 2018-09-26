import * as googleSheet from '../../../../src/shared/services/google-sheet/google.sheet';

describe('The page component', function () {
    var $compile,
        $rootScope,
        $templateCache,
        entries;

    beforeEach(function () {
        entries = [
            {
                id: 'item'
            },
            {
                id: 'anotheritem'
            }
        ];

        angular.mock.module('dpPage', {});

        angular.mock.inject(function (_$compile_, _$rootScope_, _$templateCache_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $templateCache = _$templateCache_;
        });

        $templateCache.put('modules/page/components/page/templates/welcome.html', 'THIS_IS_WELCOME');
        $templateCache.put('modules/page/components/page/templates/about.html', 'THIS_IS_ABOUT');

        spyOn(googleSheet, 'default').and.returnValue(Promise.resolve({ feed: 'a feed', entries }));
    });

    function getComponent (name, type, item) {
        var component,
            scope,
            element;

        element = document.createElement('dp-page');
        element.setAttribute('name', name);
        element.setAttribute('type', type);
        element.setAttribute('item', item);

        scope = $rootScope.$new();

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('loads an HTML page based on the name binding', function () {
        var component;

        // Welcome page
        component = getComponent('welcome');
        expect(component.text()).toContain('THIS_IS_WELCOME');

        // About page
        component = getComponent('about');
        expect(component.text()).toContain('THIS_IS_ABOUT');
    });

    it('loads cms contents for the specified type and item', function () {
        $templateCache.put('modules/page/components/page/templates/name.html', 'NAME');

        getComponent('name', 'type', 'item');

        expect(googleSheet.default).toHaveBeenCalledWith('type');
    });

    it('does nothing on empty type', function () {
        const component = getComponent('about', '', '');
        const scope = component.isolateScope();

        $rootScope.$apply();

        expect(scope.vm.feed).toBeNull();
        expect(scope.vm.entries).toEqual([]);
        expect(googleSheet.default).not.toHaveBeenCalled();
    });
});
