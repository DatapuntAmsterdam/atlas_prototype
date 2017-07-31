describe('The TabHeader factory', () => {
    let $rootScope,
        $q,
        TAB_HEADER_CONFIG,
        TabHeader;

    beforeEach(() => {
        angular.mock.module('dpShared',
            $provide => {
                $provide.constant('TAB_HEADER_CONFIG', {
                    tabs: {
                        tab1: {
                            title: 'Tab1',
                            action: 'ACTION1',
                            getPayload: angular.noop,
                            tip: 'tip1'
                        },
                        tab2: {
                            title: 'Tab2',
                            action: 'ACTION2',
                            getPayload: angular.noop,
                            tip: 'tip2'
                        }
                    },
                    othertabs: {
                        tab1: {
                            title: 'OtherTab1',
                            action: 'OTHERACTION1',
                            getPayload: angular.noop
                        },
                        tab2: {
                            title: 'OtherTab2',
                            action: 'OTHERACTION2',
                            getPayload: angular.noop
                        }
                    }
                });
            }
        );

        angular.mock.inject((_$rootScope_, _$q_, _TAB_HEADER_CONFIG_, _TabHeader_) => {
            $rootScope = _$rootScope_;
            $q = _$q_;
            TAB_HEADER_CONFIG = _TAB_HEADER_CONFIG_;
            TabHeader = _TabHeader_;
        });

        Object.keys(TAB_HEADER_CONFIG.tabs)
            .forEach(key => spyOn(TAB_HEADER_CONFIG.tabs[key], 'getPayload'));
    });

    it('has a constructor that accepts an TAB_HEADER_CONFIG key', () => {
        const tabHeader = new TabHeader('tabs');
        expect(tabHeader.tabs.length).toBe(2);
        tabHeader.tabs.forEach(tab => {
            const configTab = TAB_HEADER_CONFIG.tabs[tab.id];
            expect(tab.title).toBe(configTab.title);
            expect(tab.action).toBe(configTab.action);
            expect(tab.count).toBe(null);
            expect(tab.tip).toBe(configTab.tip);
            expect(tabHeader.getTab(tab.id)).toEqual(tab);
        });
    });

    it('reuses any already created tabheader with the same key', () => {
        let tabHeader = new TabHeader('tabs');
        tabHeader.getTab('tab1').isActive = true;
        tabHeader.getTab('tab1').count = 1;

        tabHeader = new TabHeader('othertabs');
        expect(tabHeader.getTab('tab1').isActive).toBe(false);
        expect(tabHeader.getTab('tab1').count).toBe(null);

        tabHeader = new TabHeader('tabs');
        expect(tabHeader.getTab('tab1').isActive).toBe(true);
        expect(tabHeader.getTab('tab1').count).toBe(1);
    });

    it('can set the active tab to any given tab of the tabheader', () => {
        const tabHeader = new TabHeader('tabs');
        tabHeader.tabs.forEach(tab => {
            expect(tab.isActive).toBe(false);
        });
        tabHeader.activeTab = tabHeader.getTab('tab1');
        tabHeader.tabs.forEach(tab => {
            expect(tab.isActive).toBe(tab === tabHeader.getTab('tab1'));
        });
    });

    it('can set the query that unites the tab header pages', () => {
        const tabHeader = new TabHeader('tabs'),
            query = 'a query';

        tabHeader.query = query;

        Object.keys(TAB_HEADER_CONFIG.tabs)
            .forEach(key => expect(TAB_HEADER_CONFIG.tabs[key].getPayload).toHaveBeenCalledWith(query));
    });

    it('does not update the payload if called with the same query', () => {
        const tabHeader = new TabHeader('tabs'),
            query = 'a query';

        tabHeader.query = query;

        Object.keys(TAB_HEADER_CONFIG.tabs)
            .forEach(key => expect(TAB_HEADER_CONFIG.tabs[key].getPayload.calls.reset()));

        tabHeader.query = query;

        Object.keys(TAB_HEADER_CONFIG.tabs)
            .forEach(key => expect(TAB_HEADER_CONFIG.tabs[key].getPayload).not.toHaveBeenCalled());
    });

    it('accepts a count provider that can return counts for non-active pages', () => {
        const tabHeader = new TabHeader('tabs'),
            count = 100,
            getCount = () => $q.resolve(count),
            query = 'a query';

        TabHeader.provideCounter(TAB_HEADER_CONFIG.tabs.tab1.action, getCount);
        tabHeader.query = query;

        $rootScope.$apply();

        expect(tabHeader.getTab('tab1').count).toBe(count);
        expect(tabHeader.getTab('tab2').count).toBe(null);
    });
});
