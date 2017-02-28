describe('The autocomplete suggestions', () => {
    it('only shows kadastrale objecten of type natuurlijke personen only for EMPLOYEE_PLUS', () => {
        let page;

        ['DEFAULT', 'EMPLOYEE'].forEach(role => {
            page = dp.navigate('MAP_PAGE--HOME', role);
            page.dashboard.header.search.setQuery('Erik Niels Nijland');

            expect(page.dashboard.header.search.autocomplete.categories(0).isPresent).toBe(false);
        });

        page = dp.navigate('MAP_PAGE--HOME', 'EMPLOYEE_PLUS');
        page.dashboard.header.search.setQuery('Erik Niels Nijland');

        expect(page.dashboard.header.search.autocomplete.categories(0).isPresent).toBe(true);
        expect(page.dashboard.header.search.autocomplete.categories(0).header).toBe('Kadastrale subjecten');
        expect(page.dashboard.header.search.autocomplete.categories(0).options(0).label).toBe('Erik Niels Nijland');
    });

    it('shows kadastrale objecten of type NIET natuurlijk persoon for all users', () => {
        let page;

        ['DEFAULT', 'EMPLOYEE', 'EMPLOYEE_PLUS'].forEach(role => {
            page = dp.navigate('MAP_PAGE--HOME', role);
            page.dashboard.header.search.setQuery('De Gemeente Gods Amsterdam');

            expect(page.dashboard.header.search.autocomplete.categories(0).header).toBe('Kadastrale subjecten');
            expect(page.dashboard.header.search.autocomplete.categories(0).options(0).label)
                .toBe('De Gemeente Gods Amsterdam');
        });
    });
});
