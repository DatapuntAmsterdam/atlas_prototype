describe('The embed factory', () => {
    let embed,
        $location;

    beforeEach(() => {
        angular.mock.module('dpShared', {
            stateUrlConverter: {
                state2url: () => {
                    return '#foo=1&bar=x';
                }
            }
        });

        angular.mock.inject(_$location_ => {
            $location = _$location_;
        });

        spyOn($location, 'protocol').and.returnValue('https');
        spyOn($location, 'host').and.returnValue('data.amsterdam.nl');
        spyOn($location, 'port').and.returnValue('443');

        angular.mock.inject(_embed_ => {
            embed = _embed_;
        });
    });

    it('can create a embed link', () => {
        expect(embed.getLink({})).toBe('https://data.amsterdam.nl:443/#foo=1&bar=x');
    });

    it('can create a embed html', () => {
        expect(embed.getHtml({})).toBe('<iframe width="500" height="400" ' +
            'src="https://data.amsterdam.nl:443/#foo=1&bar=x" frameborder="0"></iframe>');
    });
});
