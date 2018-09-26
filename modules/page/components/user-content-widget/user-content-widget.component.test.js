import * as googleSheet from '../../../../src/shared/services/google-sheet/google.sheet';

describe('The user content widget component', function () {
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

        spyOn(googleSheet, 'default').and.returnValue(Promise.resolve({ feed: 'a feed', entries }));
    });

    function getComponent (type) {
        var component,
            scope,
            element;

        element = document.createElement('dp-user-content-widget');
        element.setAttribute('type', type);

        scope = $rootScope.$new();

        component = $compile(element)(scope);
        scope.$apply();

        return component;
    }

    it('loads cms contents for the specified type', function () {
        $templateCache.put('modules/page/components/user-content-widget/templates/type.html', 'TYPE');

        getComponent('type');

        expect(googleSheet.default).toHaveBeenCalledWith('type');
    });
});
