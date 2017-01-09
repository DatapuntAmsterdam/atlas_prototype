describe('The bagAddress filter', function () {
    let bagAddressFilter;

    beforeEach(function () {
        angular.mock.module('dpDataShared');

        angular.mock.inject(function (_bagAddressFilter_) {
            bagAddressFilter = _bagAddressFilter_;
        });
    });

    it('returns _openbare_ruimte_naam followed by the huisnummer and an optional huisletter', function () {
        let input,
            output;

        // huisnummer
        input = {
            _openbare_ruimte_naam: 'Weesperstraat',
            huisnummer: 113,
            huisletter: '',
            huisnummer_toevoeging: ''
        };
        output = bagAddressFilter(input);
        expect(output).toBe('Weesperstraat 113');

        // huisnummer + huisletter
        input.huisletter = 'B';
        output = bagAddressFilter(input);
        expect(output).toBe('Weesperstraat 113B');
    });

    it('shows an optional huisnummer_toevoeging after the huisnummer+huisletter', function () {
        let input,
            output;

        // huisnummer
        input = {
            _openbare_ruimte_naam: 'Weesperstraat',
            huisnummer: 113,
            huisletter: '',
            huisnummer_toevoeging: '1'
        };
        output = bagAddressFilter(input);
        expect(output).toBe('Weesperstraat 113-1');

        // huisnummer + huisletter
        input.huisletter = 'B';
        output = bagAddressFilter(input);
        expect(output).toBe('Weesperstraat 113B-1');
    });
});
