describe('The detail page of kadastrale subjecten', () => {
    describe('natuurlijk persoon', () => {
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
            const page = dp.navigate('MAP_DETAIL--KADASTRAAL-SUBJECT-NATUURLIJK-PERSOON', 'EMPLOYEE_PLUS');
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

    describe('niet natuurlijk persoon', () => {
        it('doesn\'t show anything for users with the DEFAULT role', () => {
            const page = dp.navigate('MAP_DETAIL--KADASTRAAL-SUBJECT-NIET-NATUURLIJK-PERSOON', 'DEFAULT');
            const detail = page.dashboard.rightColumn.detail;

            expect(detail.kadastraalSubject.glossaryHeader.subtitle).toBe('Kadastraal subject');
            expect(detail.kadastraalSubject.glossaryHeader.title).toBe('');

            expect(detail.nietNatuurlijkPersoon.isPresent).toBe(false);
            expect(detail.zakelijkRecht.isPresent).toBe(false);
        });

        it('shows everything for users with the EMPLOYEE or EMPLOYEE_PLUS role', () => {
            ['EMPLOYEE', 'EMPLOYEE_PLUS'].forEach(role => {
                const page = dp.navigate('MAP_DETAIL--KADASTRAAL-SUBJECT-NIET-NATUURLIJK-PERSOON', role);
                const detail = page.dashboard.rightColumn.detail;

                expect(detail.kadastraalSubject.glossaryHeader.subtitle).toBe('Kadastraal subject');
                expect(detail.kadastraalSubject.glossaryHeader.title).toBe('De Gemeente Gods Amsterdam');

                expect(detail.nietNatuurlijkPersoon.isPresent).toBe(true);
                expect(detail.nietNatuurlijkPersoon.descriptionList.term(0)).toBe('Statutaire zetel');
                expect(detail.nietNatuurlijkPersoon.descriptionList.definition(0)).toBe('AMSTERDAM');
                expect(detail.nietNatuurlijkPersoon.descriptionList.term(1)).toBe('Rechtsvorm');
                expect(detail.nietNatuurlijkPersoon.descriptionList.definition(1)).toBe('Kerkelijke organisatie');

                expect(detail.zakelijkRecht.isPresent).toBe(true);
                // Todo: test real content here
            });
        });
    });
});
