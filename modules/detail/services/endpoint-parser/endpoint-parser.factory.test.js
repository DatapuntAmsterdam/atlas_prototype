describe('The endpointParser factory', function () {
    var endpointParser;

    beforeEach(function () {
        angular.mock.module(
            'dpDetail',
            {
                sharedConfig: {
                    API_ROOT: 'http://www.api-root.com/'
                }
            }
        );

        angular.mock.inject(function (_endpointParser_) {
            endpointParser = _endpointParser_;
        });
    });

    describe('getParts', () => {
        it('returns the category and subject based on an endpoint', () => {
            expect(endpointParser.getParts('http://www.api-root.com/bag/nummeraanduiding/123456/'))
                .toEqual(['bag', 'nummeraanduiding']);

            expect(endpointParser.getParts('http://www.api-root.com/brk/object/789/'))
                .toEqual(['brk', 'object']);

            expect(endpointParser.getParts('http://www.api-root.com/meetbouten/meetbout/654/'))
                .toEqual(['meetbouten', 'meetbout']);

            expect(endpointParser.getParts('http://www.api-root.com/brk/object-wkpb/' +
                'NL.KAD.OnroerendeZaak.123456/'))
                .toEqual(['brk', 'object-wkpb']);

            expect(endpointParser.getParts('http://www.api-root.com/folder-1/folder-2/folder-3/123/'))
                .toEqual(['folder-2', 'folder-3']);

            expect(endpointParser.getParts('http://www.api-root.com/catalogus/api/3/action/package_show?id=7'))
                .toEqual(['catalogus', 'api']);
        });
    });

    describe('getTemplateUrl', () => {
        it('returns a template URL based on an endpoint', () => {
            expect(endpointParser.getTemplateUrl('http://www.api-root.com/bag/nummeraanduiding/123456/'))
                .toBe('modules/detail/components/detail/templates/bag/nummeraanduiding.html');

            expect(endpointParser.getTemplateUrl('http://www.api-root.com/brk/object/789/'))
                .toBe('modules/detail/components/detail/templates/brk/object.html');

            expect(endpointParser.getTemplateUrl('http://www.api-root.com/meetbouten/meetbout/654/'))
                .toBe('modules/detail/components/detail/templates/meetbouten/meetbout.html');

            expect(endpointParser.getTemplateUrl('http://www.api-root.com/folder-1/folder-2/folder-3/654/'))
                .toBe('modules/detail/components/detail/templates/folder-2/folder-3.html');
        });

        it('has special exceptions for zakelijk recht (BRK)', () => {
            expect(endpointParser.getTemplateUrl('http://www.api-root.com/brk/zakelijk-recht/' +
                    'some-id-with-numbers-123456/subject/'))
                .toBe('modules/detail/components/detail/templates/brk/subject.html');
        });

        it('has special exception for catalogus detail pages', () => {
            expect(endpointParser.getTemplateUrl('http://www.api-root.com/catalogus/api/3/action/package_show?id=123'))
                .toBe('modules/detail/components/detail/templates/catalogus/api.html');
        });
    });

    describe('getGlossaryKey', () => {
        it('returns a glossary key (uppercased) based on an endpoint', () => {
            expect(endpointParser.getGlossaryKey('http://www.api-root.com/bag/nummeraanduiding/123456/'))
                .toBe('NUMMERAANDUIDING');

            expect(endpointParser.getGlossaryKey('http://www.api-root.com/brk/object/789/'))
                .toBe('OBJECT');

            expect(endpointParser.getGlossaryKey('http://www.api-root.com/meetbouten/meetbout/654/'))
                .toBe('MEETBOUT');

            expect(endpointParser.getGlossaryKey('http://www.api-root.com/milieuthemas/explosieven/inslag/1/'))
                .toBe('INSLAG');

            expect(endpointParser.getGlossaryKey('http://www.api-root.com/catalogus/api/3/action/package_show?id=124'))
                .toBe('API');
        });

        it('turns dashes (-) in the endpoint into underscores (_) in the glossary key', () => {
            expect(endpointParser.getGlossaryKey('http://www.api-root.com/brk/object-wkpb/' +
                    'NL.KAD.OnroerendeZaak.123456/'))
                .toBe('OBJECT_WKPB');
        });

        it('has special exceptions for zakelijk recht (BRK)', () => {
            expect(endpointParser.getGlossaryKey('http://www.api-root.com/brk/zakelijk-recht/' +
                    'some-id-with-numbers-123456/subject/'))
                .toBe('SUBJECT');
        });
    });
});
