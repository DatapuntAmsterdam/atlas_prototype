describe('The endpointParser factory', function () {
    var endpointParser;

    beforeEach(function () {
        angular.mock.module(
            'dpDetail',
            {
                environment: {
                    API_ROOT: 'http://www.api-root.com/'
                }
            }
        );

        angular.mock.inject(function (_endpointParser_) {
            endpointParser = _endpointParser_;
        });
    });

    describe('getSubject', () => {
        it('returns the subject based on an endpoint', () => {
            expect(endpointParser.getSubject('http://www.api-root.com/bag/nummeraanduiding/123456/'))
                .toBe('nummeraanduiding');

            expect(endpointParser.getSubject('http://www.api-root.com/brk/object/789/'))
                .toBe('object');

            expect(endpointParser.getSubject('http://www.api-root.com/meetbouten/meetbout/654/'))
                .toBe('meetbout');

            expect(endpointParser.getSubject('http://www.api-root.com/brk/object-wkpb/' +
                    'NL.KAD.OnroerendeZaak.123456/'))
                .toBe('object-wkpb');
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
        });

        it('has special exceptions for zakelijk recht (BRK)', () => {
            expect(endpointParser.getTemplateUrl('http://www.api-root.com/brk/zakelijk-recht/' +
                    'some-id-with-numbers-123456/subject/'))
                .toBe('modules/detail/components/detail/templates/brk/subject.html');
        });
    });

    describe('getStelselpediaKey', () => {
        it('returns a stelselpedia key (uppercased) based on an endpoint', () => {
            expect(endpointParser.getStelselpediaKey('http://www.api-root.com/bag/nummeraanduiding/123456/'))
                .toBe('NUMMERAANDUIDING');

            expect(endpointParser.getStelselpediaKey('http://www.api-root.com/brk/object/789/'))
                .toBe('OBJECT');

            expect(endpointParser.getStelselpediaKey('http://www.api-root.com/meetbouten/meetbout/654/'))
                .toBe('MEETBOUT');
        });

        it('turns dashes (-) in the endpoint into underscores (_) in the stelselpedia key', () => {
            expect(endpointParser.getStelselpediaKey('http://www.api-root.com/brk/object-wkpb/' +
                    'NL.KAD.OnroerendeZaak.123456/'))
                .toBe('OBJECT_WKPB');
        });

        it('has special exceptions for zakelijk recht (BRK)', () => {
            expect(endpointParser.getStelselpediaKey('http://www.api-root.com/brk/zakelijk-recht/' +
                    'some-id-with-numbers-123456/subject/'))
                .toBe('SUBJECT');
        });
    });
});
