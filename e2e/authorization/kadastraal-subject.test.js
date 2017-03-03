describe('The detail page of kadastrale subjecten', () => {
    it('doesn\'t show anything for users with the DEFAULT role', () => {
        const page = dp.navigate('MAP_DETAIL--KADASTRAAL-SUBJECT-NATUURLIJK-PERSOON', 'DEFAULT');
        const detail = page.dashboard.rightColumn.detail;

        expect(detail.kadastraalSubject.glossaryHeader.subtitle).toBe('Kadastraal subject');
        expect(detail.kadastraalSubject.glossaryHeader.title).toBe('');

        expect(detail.natuurlijkPersoon.isPresent).toBe(false);
        expect(detail.zakelijkRecht.isPresent).toBe(false);
    });

    it('shows everything except rechten for users with the EMPLOYEE role', () => {
        const page = dp.navigate('MAP_DETAIL--KADASTRAAL-SUBJECT-NATUURLIJK-PERSOON', 'EMPLOYEE');
        const detail = page.dashboard.rightColumn.detail;

        expect(detail.kadastraalSubject.glossaryHeader.subtitle).toBe('Kadastraal subject');
        expect(detail.kadastraalSubject.glossaryHeader.title).toBe('Erik Niels Nijland');

        expect(detail.natuurlijkPersoon.isPresent).toBe(true);
        expect(detail.natuurlijkPersoon.descriptionList.term(0)).toBe('Voornamen');
        expect(detail.natuurlijkPersoon.descriptionList.definition(0)).toBe('Erik Niels');

        expect(detail.zakelijkRecht.isPresent).toBe(false);
    });

    it('shows everything including the rechten for users with the EMPLOYEE_PLUS role', () => {
        const page = dp.navigate('MAP_DETAIL--KADASTRAAL-SUBJECT-NATUURLIJK-PERSOON', 'EMPLOYEE');
        const detail = page.dashboard.rightColumn.detail;

        expect(detail.kadastraalSubject.glossaryHeader.subtitle).toBe('Kadastraal subject');
        expect(detail.kadastraalSubject.glossaryHeader.title).toBe('Erik Niels Nijland');

        expect(detail.natuurlijkPersoon.isPresent).toBe(true);
        expect(detail.natuurlijkPersoon.descriptionList.term(0)).toBe('Voornamen');
        expect(detail.natuurlijkPersoon.descriptionList.definition(0)).toBe('Erik Niels');

        expect(detail.zakelijkRecht.isPresent).toBe(true);
        // Todo: test real content here
    });
});
