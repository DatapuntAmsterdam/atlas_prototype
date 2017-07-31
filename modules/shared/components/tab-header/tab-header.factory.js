((() => {
    'use strict';

    angular
        .module('dpShared')
        .factory('TabHeader', tabHeaderFactory);

    tabHeaderFactory.$inject = ['TAB_HEADER_CONFIG'];

    function tabHeaderFactory (TAB_HEADER_CONFIG) {
        const countProvider = {},
            tabHeader = {};

        class TabPage {
            constructor (id, {title, action, getPayload, tip}) {
                this._id = id;
                this._title = title;
                this._action = action;
                this._getPayload = getPayload;
                this._tip = tip;
                this._count = null;
                this._isActive = false;
            }

            get id () {
                return this._id;
            }

            get title () {
                return this._title;
            }

            get action () {
                return this._action;
            }

            get payload () {
                return this._payload;
            }

            get tip () {
                return this._tip;
            }

            get isActive () {
                return this._isActive;
            }

            set isActive (isActive) {
                this._isActive = Boolean(isActive);
            }

            set query (query) {
                this._query = query;
                this._payload = this._getPayload(query);
            }

            get query () {
                return this._query;
            }

            get count () {
                return this._count;
            }

            set count (value) {
                this._count = value;
            }
        }

        class TabHeader {
            constructor (id) {
                if (tabHeader[id]) {
                    this._tabs = tabHeader[id]._tabs;
                } else {
                    this._tabs = Object.keys(TAB_HEADER_CONFIG[id])
                        .map(key => new TabPage(key, TAB_HEADER_CONFIG[id][key]));
                    tabHeader[id] = this;
                }
                this._tabPages = this._tabs.reduce((all, tab) => {
                    all[tab.id] = tab;
                    return all;
                }, {});
            }

            get tabs () {
                return this._tabs;
            }

            getTab (page) {
                return this._tabPages[page];
            }

            set activeTab (theActiveTab) {
                this._tabs.forEach(tab => tab.isActive = tab.id === theActiveTab.id);
            }

            set query (query) {
                this._tabs.forEach(tab => {
                    if (tab.query !== query) {
                        tab.query = query;
                        if (!tab.isActive && countProvider[tab.action]) {
                            // active tabs update their count directly
                            // non-active tabs rely on a provider that is able to return the count
                            countProvider[tab.action](tab.payload).then(count => {
                                tab.count = count;
                            });
                        }
                    }
                });
            }

            static provideCounter (action, getCount) {
                countProvider[action] = getCount;
            }
        }

        return TabHeader;
    }
}))();
