import * as mapDocumentTitle from '../../../../src/map/services/document-title/document-title';

describe('The dpCombinedDocumentTitle factory', function () {
    let combinedDocumentTitle,
        $q,
        $rootScope;
    const detailDocumentTitle = { getTitle: angular.noop },
        dataSelectionDocumentTitle = { getTitle: angular.noop };

    beforeEach(function () {
        angular.mock.module(
            'dpShared',
            function ($provide) {
                $provide.value('dpDetailDocumentTitle', detailDocumentTitle);
                $provide.value('dpDataSelectionDocumentTitle', dataSelectionDocumentTitle);
            }
        );

        angular.mock.inject((dpCombinedDocumentTitle, _$q_, _$rootScope_) => {
            combinedDocumentTitle = dpCombinedDocumentTitle;
            $q = _$q_;
            $rootScope = _$rootScope_;
        });

        spyOn(mapDocumentTitle, 'getTitle').and.callFake(() => {
            const def = $q.defer();
            def.resolve('simpele titel');
            return def.promise;
        });

        spyOn(detailDocumentTitle, 'getTitle').and.returnValue('detailTitel');
        spyOn(dataSelectionDocumentTitle, 'getTitle').and.returnValue('dataSelectionTitel');
    });

    it('returns a default title with promise', function () {
        const mockState = {};
        const promise = combinedDocumentTitle.getTitle(mockState);

        promise.then(value => {
            expect(value).toBe('simpele titel');
        });

        $rootScope.$digest();
    });

    it('returns a detail title with promise', function () {
        const mockState = {
            detail: {
                display: true
            }
        };

        const promise = combinedDocumentTitle.getTitle(mockState);

        promise.then(value => {
            expect(value).toBe('detailTitel | simpele titel');
        });

        $rootScope.$digest();
    });

    it('returns a dataselection title with promise', function () {
        const mockState = {
            dataSelection: {
                view: 'CARDS'
            }
        };

        const promise = combinedDocumentTitle.getTitle(mockState);

        promise.then(value => {
            expect(value).toBe('dataSelectionTitel | simpele titel');
        });

        $rootScope.$digest();
    });
});
