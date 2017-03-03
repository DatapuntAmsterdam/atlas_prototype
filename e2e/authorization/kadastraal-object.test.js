fdescribe('The detail page of kadastrale objecten', () => {
    it('only shows identification properties for users with the DEFAULT role', () => {
        const page = dp.navigate('MAP_DETAIL--KADASTRAAL-OBJECT', 'DEFAULT');
        const detail = page.dashboard.rightColumn.detail;

        expect(detail.kadastraalObject.glossaryHeader.subtitle).toBe('Kadastraal object');
        expect(detail.kadastraalObject.glossaryHeader.title).toBe('ASD41 AU 00154 G 0000');

        expect(detail.kadastraalObject.descriptionList.term(0)).toBe('Kadastrale gemeentecode');
        expect(detail.kadastraalObject.descriptionList.definition(0)).toBe('ASD41');

        expect(detail.kadastraalObject.descriptionList.term(7)).toBe('Koopsom');
        expect(detail.kadastraalObject.descriptionList.definition(7)).toBe('');

        expect(detail.kadastraalObject.descriptionList.term(8)).toBe('Koopjaar');
        expect(detail.kadastraalObject.descriptionList.definition(8)).toBe('');

        expect(detail.kadastraalObject.descriptionList.term(10)).toBe('Cultuur bebouwd');
        expect(detail.kadastraalObject.descriptionList.definition(10)).toBe('');

        expect(detail.kadastraalObject.descriptionList.term(11)).toBe('Cultuur onbebouwd');
        expect(detail.kadastraalObject.descriptionList.definition(11)).toBe('');

        expect(detail.zakelijkRecht.isPresent).toBe(false);
        expect(detail.beperking.isPresent).toBe(true);
        expect(detail.aantekeningen.isPresent).toBe(false);
        expect(detail.ontstaanUit.isPresent).toBe(true);
        expect(detail.betrokkenBij.isPresent).toBe(true);
    });

    it('only shows everything for users with the EMPLOYEE and EMPLOYEE_PLUS role', () => {
        ['EMPLOYEE', 'EMPLOYEE_PLUS'].forEach(role => {
            const page = dp.navigate('MAP_DETAIL--KADASTRAAL-OBJECT', role);
            const detail = page.dashboard.rightColumn.detail;

            expect(detail.kadastraalObject.glossaryHeader.subtitle).toBe('Kadastraal object');
            expect(detail.kadastraalObject.glossaryHeader.title).toBe('ASD41 AU 00154 G 0000');

            expect(detail.kadastraalObject.descriptionList.term(0)).toBe('Kadastrale gemeentecode');
            expect(detail.kadastraalObject.descriptionList.definition(0)).toBe('ASD41');

            expect(detail.kadastraalObject.descriptionList.term(7)).toBe('Koopsom');
            expect(detail.kadastraalObject.descriptionList.definition(7)).toBe('TODO: DIT INVULLEN');

            expect(detail.kadastraalObject.descriptionList.term(8)).toBe('Koopjaar');
            expect(detail.kadastraalObject.descriptionList.definition(8)).toBe('TODO: DIT INVULLEN');

            expect(detail.kadastraalObject.descriptionList.term(10)).toBe('Cultuur bebouwd');
            expect(detail.kadastraalObject.descriptionList.definition(10)).toBe('TODO: DIT INVULLEN');

            expect(detail.kadastraalObject.descriptionList.term(11)).toBe('Cultuur onbebouwd');
            expect(detail.kadastraalObject.descriptionList.definition(11)).toBe('TODO: DIT INVULLEN');

            expect(detail.zakelijkRecht.isPresent).toBe(true);
            expect(detail.beperking.isPresent).toBe(true);
            expect(detail.aantekeningen.isPresent).toBe(true);
            expect(detail.ontstaanUit.isPresent).toBe(true);
            expect(detail.betrokkenBij.isPresent).toBe(true);
        });
    });
});
