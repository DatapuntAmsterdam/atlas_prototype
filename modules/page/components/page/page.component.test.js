import * as getContents from '../../../../src/shared/services/google-sheet/google.sheet';

describe('The page component', function () {
    var $compile,
        $rootScope,
        $templateCache,
        entries,
        getContentsThen;

    beforeEach(function () {
        entries = [
            {
                id: 'item'
            },
            {
                id: 'anotheritem'
            }
        ];

        angular.mock.module('dpPage');

        angular.mock.inject(function (_$compile_, _$rootScope_, _$templateCache_) {
            $compile = _$compile_;
            $rootScope = _$rootScope_;
            $templateCache = _$templateCache_;
        });

        $templateCache.put('modules/page/components/page/templates/welcome.html', 'THIS_IS_WELCOME');
        $templateCache.put('modules/page/components/page/templates/about.html', 'THIS_IS_ABOUT');

        spyOn(getContents, 'default').and.returnValue({ then: (func) => getContentsThen = func });
    });

    function getComponent (name, type, item) {
        const element = document.createElement('dp-page');
        element.setAttribute('name', name);
        element.setAttribute('type', type);
        element.setAttribute('item', item);

        const scope = $rootScope.$new();

        const component = $compile(element)(scope);
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

        const component = getComponent('name', 'type', 'item');
        const scope = component.isolateScope();

        expect(getContents.default).toHaveBeenCalledWith('type');

        $rootScope.$apply();

        getContentsThen({
            feed: 'a feed',
            entries
        });
        expect(scope.vm.feed).toBe('a feed');
        expect(scope.vm.entries).toEqual(entries);
        expect(scope.vm.entry).toEqual({id: 'item'});
    });

    it('does nothing on empty type', function () {
        const component = getComponent('about', '', '');
        const scope = component.isolateScope();

        $rootScope.$apply();

        expect(scope.vm.feed).toBeNull();
        expect(scope.vm.entries).toEqual([]);
        expect(getContents.default).not.toHaveBeenCalled();
    });
});
