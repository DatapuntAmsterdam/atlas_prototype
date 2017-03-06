describe('The detail page of kadastrale objecten', () => {
    it('only shows identification properties for users with the DEFAULT role', () => {
        const page = dp.navigate('MAP_DETAIL--KADASTRAAL-OBJECT', 'DEFAULT');
        const detail = page.dashboard.rightColumn.detail;

        expect(detail.kadastraalObject.glossaryHeader.subtitle).toBe('Kadastraal object');
        expect(detail.kadastraalObject.glossaryHeader.title).toBe('STN02 N 00538 A 0001');

        expect(detail.kadastraalObject.descriptionList.term(0)).toBe('Kadastrale gemeentecode');
        expect(detail.kadastraalObject.descriptionList.definition(0)).toBe('STN02');

        expect(detail.kadastraalObject.descriptionList.term(7)).toBe('Koopsom');
        expect(detail.kadastraalObject.descriptionList.definition(7)).toBe('');

        expect(detail.kadastraalObject.descriptionList.term(8)).toBe('Koopjaar');
        expect(detail.kadastraalObject.descriptionList.definition(8)).toBe('');

        expect(detail.kadastraalObject.descriptionList.term(10)).toBe('Cultuur bebouwd');
        expect(detail.kadastraalObject.descriptionList.definition(10)).toBe('');

        expect(detail.kadastraalObject.descriptionList.term(11)).toBe('Cultuur onbebouwd');
        expect(detail.kadastraalObject.descriptionList.definition(11)).toBe('');

        expect(detail.kadastraleObjecten(0).zakelijkRecht.isPresent).toBe(false);
        expect(detail.kadastraleObjecten(0).beperking.isPresent).toBe(true);
        expect(detail.kadastraleObjecten(0).aantekeningen.isPresent).toBe(false);
        expect(detail.kadastraleObjecten(1).ontstaanUit.isPresent).toBe(true);
        expect(detail.kadastraleObjecten(0).betrokkenBij.isPresent).toBe(true);
    });

    it('only shows everything for users with the EMPLOYEE and EMPLOYEE_PLUS role', () => {
        ['EMPLOYEE', 'EMPLOYEE_PLUS'].forEach(role => {
            const page = dp.navigate('MAP_DETAIL--KADASTRAAL-OBJECT', role);
            const detail = page.dashboard.rightColumn.detail;

            expect(detail.kadastraalObject.glossaryHeader.subtitle).toBe('Kadastraal object');
            expect(detail.kadastraalObject.glossaryHeader.title).toBe('STN02 N 00538 A 0001');

            expect(detail.kadastraalObject.descriptionList.term(0)).toBe('Kadastrale gemeentecode');
            expect(detail.kadastraalObject.descriptionList.definition(0)).toBe('STN02');

            expect(detail.kadastraalObject.descriptionList.term(7)).toBe('Koopsom');
            expect(detail.kadastraalObject.descriptionList.definition(7)).toBe('TODO: DIT INVULLEN');

            expect(detail.kadastraalObject.descriptionList.term(8)).toBe('Koopjaar');
            expect(detail.kadastraalObject.descriptionList.definition(8)).toBe('TODO: DIT INVULLEN');

            expect(detail.kadastraalObject.descriptionList.term(10)).toBe('Cultuur bebouwd');
            expect(detail.kadastraalObject.descriptionList.definition(10)).toBe('TODO: DIT INVULLEN');

            expect(detail.kadastraalObject.descriptionList.term(11)).toBe('Cultuur onbebouwd');
            expect(detail.kadastraalObject.descriptionList.definition(11)).toBe('TODO: DIT INVULLEN');

            expect(detail.kadastraleObjecten(0).zakelijkRecht.isPresent).toBe(true);
            expect(detail.kadastraleObjecten(0).beperking.isPresent).toBe(true);
            expect(detail.kadastraleObjecten(0).aantekeningen.isPresent).toBe(true);
            expect(detail.kadastraleObjecten(1).ontstaanUit.isPresent).toBe(true);
            expect(detail.kadastraleObjecten(0).betrokkenBij.isPresent).toBe(true);
        });
    });
});
